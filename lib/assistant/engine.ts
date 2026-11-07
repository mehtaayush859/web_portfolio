import { screen, type GuardResult, type GuardStep } from './guard';
import { FACTS, ALLOWED_LINKS, type Fact, type AnswerLink } from './knowledge';

/**
 * Answer engine: screening → retrieval over FACTS → output check.
 * Retrieval is keyword scoring with light stemming and synonyms. It never generates text and
 * never echoes the visitor's input back, so there is nothing an injection could steer.
 */

export interface Reply {
  kind: 'answer' | 'fallback' | 'blocked';
  source?: string;
  lines: string[];
  links: AnswerLink[];
  next: string[];
  guard: GuardResult;
  /** Screening steps plus retrieval and output-check steps, for Attack mode. */
  trace: GuardStep[];
}

const STOP = new Set(
  'a an the is are was were be been do does did of to in on at for with and or but what whats which whom how about tell me his he him ayush ayushs mehta can could would should you your i my this that it its any some please there their has have had from as by into much many more most give show list'.split(
    ' '
  )
);

// Map question words to the vocabulary used in the facts.
const SYNONYMS: Record<string, string[]> = {
  job: ['experience', 'work'],
  role: ['experience', 'work'],
  intern: ['internship', 'experience'],
  internship: ['experience'],
  employer: ['experience'],
  company: ['experience'],
  school: ['education', 'university'],
  study: ['education', 'university'],
  studied: ['education', 'university'],
  college: ['education', 'university'],
  degree: ['education'],
  masters: ['education', 'science'],
  ms: ['education'],
  bachelor: ['education'],
  btech: ['education', 'technology'],
  language: ['languages', 'skills'],
  languages: ['skills'],
  stack: ['skills'],
  tech: ['skills', 'technologies'],
  tool: ['skills', 'tools'],
  framework: ['backend', 'frontend', 'skills'],
  cloud: ['aws', 'cloud'],
  aws: ['amazon', 'aws'],
  pentesting: ['penetration', 'pentest'],
  hacking: ['penetration', 'offensive', 'security'],
  hacker: ['penetration', 'security'],
  siem: ['siem', 'threathunter', 'detection'],
  llm: ['ai', 'agent'],
  chatgpt: ['assistant', 'model'],
  relocate: ['relocation'],
  moving: ['relocation'],
  sponsor: ['availability'],
  visa: ['availability'],
  salary: ['availability'],
  email: ['contact'],
  phone: ['contact'],
  reach: ['contact'],
  cv: ['resume'],
  python: ['python'],
  frontend: ['frontend', 'react'],
  certs: ['certifications'],
  hire: ['principles'],
};

function stem(w: string): string {
  if (w.length > 4 && w.endsWith('ies')) return `${w.slice(0, -3)}y`;
  if (w.length > 5 && w.endsWith('ing')) return w.slice(0, -3);
  if (w.length > 4 && w.endsWith('ed')) return w.slice(0, -2);
  if (w.length > 3 && w.endsWith('s') && !w.endsWith('ss')) return w.slice(0, -1);
  return w;
}

function tokens(text: string): string[] {
  const out: string[] = [];
  for (const raw of text.toLowerCase().replace(/[’']/g, '').split(/[^a-z0-9.+#]+/)) {
    const w = raw.replace(/^\.+|\.+$/g, '');
    if (w.length < 2) continue;
    out.push(w);
    // "resilinc.ai" should also match "resilinc"; "node.js" also "node".
    if (w.includes('.')) out.push(...w.split('.').filter((x) => x.length > 1));
  }
  return out.filter((w) => !STOP.has(w));
}

// Words that appear in many facts: they count, but less than specific terms like "Amazon".
const GENERIC = new Set(
  ['experience', 'work', 'role', 'skill', 'project', 'security', 'software', 'engineer', 'engineering', 'build', 'built', 'tool', 'technologie', 'stack', 'system', 'test'].map(stem)
);

interface Indexed {
  fact: Fact;
  title: Set<string>;
  keywords: Set<string>;
  body: Set<string>;
}

let INDEX: Indexed[] | null = null;
function index(): Indexed[] {
  INDEX ??= FACTS.map((fact) => ({
    fact,
    title: new Set(tokens(fact.source).map(stem)),
    keywords: new Set(fact.keywords.flatMap(tokens).map(stem)),
    body: new Set([fact.source, ...fact.answer].flatMap(tokens).map(stem)),
  }));
  return INDEX;
}

function score(query: string[], doc: Indexed): number {
  let s = 0;
  for (const q of query) {
    const generic = GENERIC.has(q);
    if (doc.keywords.has(q)) s += generic ? 1.5 : 3;
    else if (doc.body.has(q)) s += generic ? 0.5 : 1;
    // A term in the fact's title ("Amazon", "SecuScan") is the strongest signal.
    if (doc.title.has(q)) s += generic ? 0.5 : 1.5;
  }
  return s;
}

const MIN_SCORE = 1.5;

const OUT_OF_SCOPE = /\b(write|compose|generate|create|draft)\b[^.!?]{0,30}\b(poem|story|essay|code|script|program|song|joke|letter)\b|\b(weather|stock price|recipe|translate)\b/;

const SMALL_TALK: { pattern: RegExp; lines: string[] }[] = [
  { pattern: /^(hi|hey|hello|yo|hiya|good (morning|afternoon|evening))\b[\s!.]*$/, lines: ['Hi! Ask me anything about Ayush’s work, projects, skills or availability.'] },
  { pattern: /^(thanks|thank you|thx|ty|cheers|great|cool|nice)\b[\s!.]*$/, lines: ['Happy to help. The contact form at the bottom reaches Ayush directly.'] },
];

function outputCheck(lines: string[], links: AnswerLink[]): { links: AnswerLink[]; step: GuardStep } {
  const safe = links.filter((l) => ALLOWED_LINKS.has(l.href));
  const removed = links.length - safe.length;
  // Answers are fixed text from the data files; a stray URL inside them would also be caught here.
  const strayUrls = lines.join(' ').match(/https?:\/\/\S+/g)?.length ?? 0;
  return {
    links: safe,
    step: {
      name: 'Output check',
      detail:
        removed || strayUrls
          ? `Removed ${removed} link(s) not on the allow-list; ${strayUrls} inline URL(s) flagged.`
          : 'Only allow-listed links; no visitor text echoed back.',
      status: removed || strayUrls ? 'flag' : 'ok',
    },
  };
}

export function ask(question: string): Reply {
  const guard = screen(question);

  if (!guard.allowed) {
    return {
      kind: 'blocked',
      lines: [
        'That looks like a prompt-injection attempt, so it was stopped before reaching the answer engine.',
        'The defence trace below shows which check caught it.',
      ],
      links: [],
      next: ['How does this assistant work?', 'How does he test AI agents?'],
      guard,
      trace: guard.steps,
    };
  }

  const lower = guard.clean.toLowerCase();
  const small = SMALL_TALK.find((s) => s.pattern.test(lower));
  if (small) {
    return { kind: 'answer', source: 'Assistant', lines: small.lines, links: [], next: ['Who is Ayush?'], guard, trace: guard.steps };
  }

  const scope = OUT_OF_SCOPE.test(lower);
  const base = tokens(lower);
  const query = [...new Set([...base, ...base.flatMap((t) => SYNONYMS[t] ?? [])].map(stem))];
  const ranked = scope
    ? []
    : index()
        .map((d) => ({ d, s: score(query, d) }))
        .filter((r) => r.s > 0)
        .sort((a, b) => b.s - a.s);

  const top = ranked[0];
  const retrievalStep: GuardStep = {
    name: 'Retrieve',
    detail: scope
      ? 'Out of scope: only questions about Ayush are answered.'
      : top && top.s >= MIN_SCORE
        ? `Best match: “${top.d.fact.source}” (score ${top.s.toFixed(1)}).`
        : 'No fact matched well enough.',
    status: 'ok',
  };

  if (!top || top.s < MIN_SCORE) {
    const out = outputCheck([], []);
    return {
      kind: 'fallback',
      lines: [
        scope
          ? 'I only answer questions about Ayush’s work. I have no language model, so I can’t write or generate things.'
          : 'I don’t have a fact that answers that. I only know what is on this page.',
        'Try one of these, or use the contact form to ask Ayush directly.',
      ],
      links: [{ label: 'Contact', href: '#contact' }],
      next: ['What has he built?', 'What did he do at Amazon?', 'What is his tech stack?'],
      guard,
      trace: [...guard.steps, retrievalStep, out.step],
    };
  }

  const fact = top.d.fact;
  // Offer a clearly related second fact as a follow-up, never merged into the answer.
  const related = ranked.slice(1, 3).filter((r) => r.s >= Math.max(MIN_SCORE * 2, top.s - 1.5)).map((r) => `Tell me about ${r.d.fact.source.replace(/^.*· /, '')}`);
  const out = outputCheck(fact.answer, fact.links ?? []);
  return {
    kind: 'answer',
    source: fact.source,
    lines: fact.answer,
    links: out.links,
    next: [...new Set([...(fact.next ?? []), ...related])].slice(0, 3),
    guard,
    trace: [...guard.steps, retrievalStep, out.step],
  };
}
