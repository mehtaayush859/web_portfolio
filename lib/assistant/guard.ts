/**
 * Input screening for the "Ask Ayush" assistant.
 *
 * The assistant has no language model: it answers only from a fixed set of facts (see
 * knowledge.ts). This guard is a working model of the screening layer that sits in front of a
 * real LLM agent, so visitors can see prompt-injection defences operate. Every step is
 * deterministic and runs in the browser; nothing is sent anywhere.
 *
 * Pipeline: limit length → normalise (NFKC, strip hidden characters, undo leetspeak) →
 * decode embedded payloads (base64, URL encoding) → match injection rules on every variant.
 *
 * Rules target imperative attack phrasing, not topics: "how does he test for prompt injection?"
 * is a legitimate question and must pass.
 */

const MAX_INPUT = 400;

export type ThreatCategory =
  | 'instruction-override'
  | 'prompt-extraction'
  | 'role-hijack'
  | 'delimiter-injection'
  | 'secret-exfiltration'
  | 'tool-abuse'
  | 'output-steering'
  | 'markup-injection'
  | 'obfuscation';

export const CATEGORY_LABEL: Record<ThreatCategory, string> = {
  'instruction-override': 'Instruction override',
  'prompt-extraction': 'System prompt extraction',
  'role-hijack': 'Role / persona hijack',
  'delimiter-injection': 'Fake message delimiters',
  'secret-exfiltration': 'Secret exfiltration',
  'tool-abuse': 'Tool or command abuse',
  'output-steering': 'Output steering',
  'markup-injection': 'Markup / script injection',
  obfuscation: 'Obfuscation',
};

interface Rule {
  id: string;
  category: ThreatCategory;
  pattern: RegExp;
}

// All patterns run on lower-cased, normalised text. Kept linear (no nested quantifiers) so a
// crafted input cannot cause catastrophic backtracking; input length is also capped.
const RULES: Rule[] = [
  {
    id: 'ignore-previous',
    category: 'instruction-override',
    pattern:
      /\b(ignore|disregard|forget|override|bypass|skip|drop)\b[^.!?\n]{0,40}\b(previous|prior|above|earlier|all|any|your|the|these|those|system|initial|original)\b[^.!?\n]{0,30}\b(instructions?|rules?|prompts?|guidelines?|directives?|polic(y|ies)|guardrails?|constraints?|filters?)\b/,
  },
  {
    id: 'ignore-above',
    category: 'instruction-override',
    pattern: /\b(ignore|disregard|forget)\s+(all\s+|everything\s+)?(the\s+)?(above|previous|prior|preceding|everything|what you were told)\b/,
  },
  {
    id: 'new-instructions',
    category: 'instruction-override',
    pattern: /\b(new|updated|real|actual|following)\s+(instructions?|rules|system\s+prompt|directives?)\s*(:|are|is|follow)/,
  },
  {
    id: 'from-now-on',
    category: 'instruction-override',
    pattern: /\b(from now on|for the rest of this|starting now|henceforth)\b[^.!?\n]{0,40}\b(you|answer|respond|reply|always|only|never)\b/,
  },
  {
    id: 'reveal-prompt',
    category: 'prompt-extraction',
    pattern:
      /\b(reveal|show|print|display|repeat|output|echo|dump|leak|recite|tell me|give me|what (is|are|were)|what's|list|share|copy|paste)\b[^.!?\n]{0,30}\b(your|the|its|initial|hidden|secret|internal|original|system|developer)\s+(system\s+|initial\s+|hidden\s+|original\s+|developer\s+)?(prompt|instructions?|rules|configuration|config|guidelines|context|directives)\b/,
  },
  {
    id: 'what-told',
    category: 'prompt-extraction',
    pattern: /\b(what|how) (were|was) you (told|instructed|programmed|configured|set up)\b|\bwords? above\b|\btext above\b|\beverything (above|before) this\b/,
  },
  {
    id: 'you-are-now',
    category: 'role-hijack',
    pattern: /\b(you are now|you're now|you will now be|act as|pretend (to be|you are)|roleplay as|role-play as|play the role of|simulate being|behave like|impersonate)\b/,
  },
  {
    id: 'jailbreak-persona',
    category: 'role-hijack',
    pattern: /\b(dan|do anything now|developer mode|dev mode|jailbreak|jailbroken|god mode|unfiltered|uncensored|no restrictions|without restrictions|evil (ai|assistant|mode))\b/,
  },
  {
    id: 'fake-delimiters',
    category: 'delimiter-injection',
    pattern:
      /<\/?\s*(system|assistant|user|instructions?|context|prompt)\s*>|\[\/?\s*(inst|system|sys)\s*\]|<\|\s*(im_start|im_end|system|endoftext|eot_id|start_header_id)\s*\|>|(^|\n)\s*(#{2,}\s*)?(system|assistant|developer)\s*(:|prompt\s*:)|\bend of (system )?(prompt|context|instructions)\b|-{3,}\s*(end|begin|new)\b/,
  },
  {
    // Needs an action aimed at the secret: "how does he detect credential stuffing?" is a topic.
    id: 'secrets',
    category: 'secret-exfiltration',
    pattern:
      /\b(give|show|reveal|print|display|dump|leak|send|share|tell me|what (is|are)|what's|list|expose|read|output|paste|cat)\b[^.!?\n]{0,30}\b(api[\s_-]?keys?|secret[\s_-]?keys?|secrets|access[\s_-]?keys?|private[\s_-]?keys?|passwords?|passwd|credentials|auth(entication)?[\s_-]?tokens?|bearer tokens?|session tokens?|env(ironment)? (vars?|variables)|\.env\b|ssh keys?|aws[\s_-]?secret|canary)\b|\/etc\/(passwd|shadow)\b/,
  },
  {
    id: 'commands',
    category: 'tool-abuse',
    pattern:
      /\b(run|execute|exec|eval|invoke|call)\b[^.!?\n]{0,25}\b(command|shell|script|code|function|tool|bash|terminal|sql|query)\b|\brm\s+-rf\b|\b(curl|wget)\s+\S|\b(drop|truncate)\s+table\b|\b(sudo|chmod|powershell)\s+\S|\bsend (an? )?(email|message|request)\b|\bfetch\b[^.!?\n]{0,20}\b(url|https?)\b|\bunion\s+select\b|';\s*--|'\s*or\s+'?\d+'?\s*=\s*'?\d+/,
  },
  {
    id: 'say-exactly',
    category: 'output-steering',
    pattern:
      /\b(say|respond|reply|answer|output|write|state|claim|tell (the )?(recruiter|user|them|everyone))\b[^.!?\n]{0,25}\b(only|exactly|verbatim|nothing (else|but)|that (ayush|he|this candidate) (is|was|should))\b|\b(rate|score) (him|ayush|this candidate)\b[^.!?\n]{0,15}\b(10|ten|100|perfect)\b|\b(must|should) (hire|reject)\b|\bhire him (immediately|now)\b/,
  },
  {
    id: 'markup',
    category: 'markup-injection',
    pattern: /<\s*(script|iframe|img|svg|object|embed|style|link|meta)\b|\bon(error|load|click|mouseover)\s*=|javascript\s*:|data:text\/html|!\[[^\]]*\]\(\s*https?:/,
  },
];

const LEET: Record<string, string> = { '0': 'o', '1': 'i', '3': 'e', '4': 'a', '5': 's', '7': 't', '@': 'a', $: 's', '!': 'i' };

// Zero-width characters, bidi controls, soft hyphen and other invisible formatting characters
// that can hide instructions from a human reviewer while a model still reads them.
const HIDDEN = /[­͏؜ᅟᅠ឴឵᠎​-‏‪-‮⁠-⁤⁦-⁯﻿︀-️]/g;

export interface Finding {
  rule: string;
  category: ThreatCategory;
  /** Which variant of the input the rule matched (e.g. "base64-decoded"). */
  via: string;
  excerpt: string;
}

export interface GuardStep {
  name: string;
  detail: string;
  status: 'ok' | 'flag' | 'block';
}

export interface GuardResult {
  allowed: boolean;
  /** 0–100, for display only. */
  risk: number;
  findings: Finding[];
  steps: GuardStep[];
  /** Normalised text the answer engine should use. */
  clean: string;
}

function safeAtob(s: string): string | null {
  try {
    const padded = s.replace(/-/g, '+').replace(/_/g, '/');
    const bin = atob(padded + '='.repeat((4 - (padded.length % 4)) % 4));
    // Keep only decodings that look like text; random base64-looking words decode to binary.
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    const text = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
    const printable = text.replace(/[^\x20-\x7E\n\t]/g, '').length;
    return printable / Math.max(1, text.length) > 0.9 ? text : null;
  } catch {
    return null;
  }
}

function deLeet(s: string): string {
  // Only inside words that mix letters with digits/symbols ("1gn0re"), so normal numbers
  // like "10K users" stay intact.
  return s.replace(/\b(?=[a-z0-9@$!]*[a-z])(?=[a-z0-9@$!]*[0-9@$!])[a-z0-9@$!]{3,}\b/g, (w) =>
    w.replace(/[013457@$!]/g, (c) => LEET[c] ?? c)
  );
}

export function screen(raw: string): GuardResult {
  const steps: GuardStep[] = [];
  const findings: Finding[] = [];

  // 1. Length limit.
  const truncated = raw.length > MAX_INPUT;
  const input = truncated ? raw.slice(0, MAX_INPUT) : raw;
  steps.push({
    name: 'Length limit',
    detail: truncated ? `Cut to ${MAX_INPUT} characters (was ${raw.length}).` : `${raw.length}/${MAX_INPUT} characters.`,
    status: truncated ? 'flag' : 'ok',
  });

  // 2. Normalisation. NFKC folds look-alike forms (full-width letters, ligatures) to ASCII.
  const hiddenCount = (input.match(HIDDEN) ?? []).length;
  const normalised = input.normalize('NFKC').replace(HIDDEN, '').replace(/\s+/g, ' ').trim();
  const lower = normalised.toLowerCase();
  const changedByNfkc = input.replace(HIDDEN, '').normalize('NFKC') !== input.replace(HIDDEN, '');
  steps.push({
    name: 'Normalise',
    detail:
      hiddenCount > 0
        ? `Removed ${hiddenCount} hidden character${hiddenCount === 1 ? '' : 's'} (zero-width or bidi controls).`
        : changedByNfkc
          ? 'Folded look-alike Unicode characters to plain text.'
          : 'Nothing hidden; text unchanged.',
    status: hiddenCount > 0 ? 'flag' : 'ok',
  });
  if (hiddenCount > 0) {
    findings.push({ rule: 'hidden-characters', category: 'obfuscation', via: 'raw input', excerpt: `${hiddenCount} invisible characters` });
  }

  // 3. Decode embedded payloads so encoded instructions are screened too.
  const variants: { via: string; text: string }[] = [{ via: 'normalised text', text: lower }];
  const leet = deLeet(lower);
  if (leet !== lower) variants.push({ via: 'leetspeak undone', text: leet });
  const decoded: string[] = [];
  for (const token of normalised.match(/[A-Za-z0-9+/_-]{16,}={0,2}/g) ?? []) {
    const text = safeAtob(token);
    if (text) {
      decoded.push('base64');
      variants.push({ via: 'base64-decoded', text: text.toLowerCase() });
    }
  }
  if (/%[0-9a-f]{2}/i.test(normalised)) {
    try {
      const text = decodeURIComponent(normalised).toLowerCase();
      if (text !== lower) {
        decoded.push('URL encoding');
        variants.push({ via: 'URL-decoded', text });
      }
    } catch {
      /* malformed escape: ignore */
    }
  }
  steps.push({
    name: 'Decode payloads',
    detail: decoded.length ? `Decoded ${[...new Set(decoded)].join(' and ')} and screened the result too.` : 'No encoded payloads found.',
    status: decoded.length ? 'flag' : 'ok',
  });

  // 4. Rule matching on every variant.
  const seen = new Set<string>();
  for (const v of variants) {
    for (const rule of RULES) {
      const m = v.text.match(rule.pattern);
      if (m && !seen.has(rule.id)) {
        seen.add(rule.id);
        findings.push({ rule: rule.id, category: rule.category, via: v.via, excerpt: m[0].trim().slice(0, 60) });
      }
    }
  }
  if (decoded.length && findings.some((f) => f.via !== 'normalised text' && f.via !== 'raw input')) {
    findings.push({ rule: 'encoded-payload', category: 'obfuscation', via: decoded[0], excerpt: 'instruction hidden in an encoding' });
  }

  const attackFindings = findings.filter((f) => f.category !== 'obfuscation');
  const categories = [...new Set(attackFindings.map((f) => CATEGORY_LABEL[f.category]))];
  steps.push({
    name: 'Injection rules',
    detail: categories.length ? `Matched: ${categories.join(', ')}.` : `${RULES.length} rule families checked, none matched.`,
    status: categories.length ? 'block' : 'ok',
  });

  // Hidden characters alone are suspicious but not proof of an attack; block only when they
  // come with an actual injection pattern.
  const allowed = attackFindings.length === 0;
  const risk = Math.min(100, attackFindings.length * 35 + (findings.length - attackFindings.length) * 15 + (truncated ? 5 : 0));
  steps.push({
    name: 'Decision',
    detail: allowed ? 'Allowed: passed to the answer engine.' : 'Blocked: never reaches the answer engine.',
    status: allowed ? 'ok' : 'block',
  });

  return { allowed, risk, findings, steps, clean: normalised };
}
