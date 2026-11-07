'use client';

import * as React from 'react';
import { X, Send, ShieldAlert, ShieldCheck, Swords, CircleCheck, CircleAlert, CircleX, ExternalLink } from 'lucide-react';
import { ask, type Reply } from '@/lib/assistant/engine';
import { ATTACK_EXAMPLES, STARTER_QUESTIONS } from '@/lib/assistant/knowledge';
import { CATEGORY_LABEL } from '@/lib/assistant/guard';
import { cn } from '@/lib/utils';
import { scrollBehavior } from '@/lib/client-utils';

type Message = { id: number; role: 'user'; text: string } | { id: number; role: 'bot'; reply: Reply };

interface Props {
  onClose: () => void;
  /** A question sent from elsewhere (palette, terminal); `n` makes repeats distinct. */
  pending: { q: string; n: number; attack: boolean } | null;
}

const STEP_ICON = { ok: CircleCheck, flag: CircleAlert, block: CircleX } as const;
const STEP_TONE = { ok: 'text-primary', flag: 'text-amber-500', block: 'text-red-500' } as const;

/**
 * "Ask Ayush": a chat panel over a fixed fact base, with an Attack mode that shows how each
 * message was screened. Everything runs in the browser. Visitor text is only ever rendered as
 * React text (never HTML), and links come from an allow-list in the knowledge base.
 */
export function AssistantPanel({ onClose, pending }: Props) {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState('');
  const [attackMode, setAttackMode] = React.useState(() => pending?.attack === true);
  // A new request to open in Attack mode (from the palette) switches it on. Adjusted during
  // render rather than in an effect, which would cost an extra render pass.
  const [seenPending, setSeenPending] = React.useState(pending);
  if (pending !== seenPending) {
    setSeenPending(pending);
    if (pending?.attack) setAttackMode(true);
  }
  const [thinking, setThinking] = React.useState(false);
  const idRef = React.useRef(0);
  const logRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const timer = React.useRef<number | undefined>(undefined);

  const attempts = messages.filter((m) => m.role === 'bot' && m.reply.guard.findings.length > 0).length;
  const blocked = messages.filter((m) => m.role === 'bot' && m.reply.kind === 'blocked').length;

  const send = React.useCallback((text: string) => {
    const q = text.trim();
    if (!q) return;
    const reply = ask(q);
    setMessages((prev) => [...prev, { id: ++idRef.current, role: 'user', text: q }]);
    setInput('');
    // A short pause reads as a reply rather than a page change; none with reduced motion.
    const delay = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 280;
    setThinking(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setThinking(false);
      setMessages((prev) => [...prev, { id: ++idRef.current, role: 'bot', reply }]);
    }, delay);
  }, []);

  React.useEffect(() => () => window.clearTimeout(timer.current), []);

  // Questions sent from the palette or terminal.
  React.useEffect(() => {
    if (pending?.q.trim()) send(pending.q);
  }, [pending, send]);

  React.useEffect(() => {
    inputRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  React.useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, thinking]);

  const goTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith('#')) return;
    e.preventDefault();
    document.getElementById(href.slice(1))?.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
    // On phones the panel covers the page, so close it to show the section.
    if (window.matchMedia('(max-width: 639px)').matches) onClose();
  };

  return (
    <div
      id="ask-ayush"
      role="dialog"
      aria-modal="false"
      aria-labelledby="ask-ayush-title"
      className="fixed z-[45] inset-x-2 bottom-2 top-16 sm:inset-auto sm:bottom-24 sm:right-6 sm:h-[min(640px,calc(100dvh-8rem))] sm:w-[400px] flex flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl shadow-black/40"
    >
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent to-primary font-mono text-xs font-bold text-white dark:text-[#04110c]">
          AM
        </span>
        <div className="min-w-0 flex-1">
          <h2 id="ask-ayush-title" className="text-sm font-semibold text-text-primary">
            Ask Ayush
          </h2>
          <p className="font-mono text-[10px] leading-snug text-text-subtle">runs locally · no AI model</p>
        </div>
        <button
          type="button"
          aria-pressed={attackMode}
          onClick={() => setAttackMode((v) => !v)}
          className={cn(
            'inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3 text-xs font-semibold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
            attackMode ? 'border-red-500/50 bg-red-500/10 text-red-600 dark:text-red-400' : 'border-border text-text-muted hover:text-text-primary'
          )}
        >
          <Swords className="h-3.5 w-3.5" aria-hidden="true" />
          Attack mode
        </button>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close Ask Ayush"
          className="flex h-9 w-9 items-center justify-center rounded-full text-text-muted hover:bg-surface-elevated hover:text-text-primary cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      {attackMode && (
        <div className="border-b border-border bg-red-500/[0.06] px-4 py-3">
          <p className="text-xs text-text-primary">
            <strong>Try to prompt-inject me.</strong> Each reply shows the screening steps: a small, rule-based
            model of the input defences in front of an AI agent.
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {ATTACK_EXAMPLES.map((a) => (
              <button
                key={a.label}
                type="button"
                onClick={() => send(a.text)}
                className="rounded-full border border-red-500/30 px-2.5 py-1 text-[11px] font-medium text-text-primary hover:bg-red-500/10 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                {a.label}
              </button>
            ))}
          </div>
          <p className="mt-2 font-mono text-[11px] text-text-muted" aria-live="polite">
            blocked {blocked} of {attempts} suspicious message{attempts === 1 ? '' : 's'}
          </p>
        </div>
      )}

      {/* Conversation */}
      <div ref={logRef} role="log" aria-live="polite" aria-label="Conversation" className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4">
        <div className="rounded-2xl rounded-tl-sm bg-surface-elevated px-3.5 py-2.5 text-sm text-text-primary">
          <p>Hi! I answer questions about Ayush&apos;s work using only facts from this page.</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {STARTER_QUESTIONS.map((q) => (
              <Chip key={q} onClick={() => send(q)}>
                {q}
              </Chip>
            ))}
          </div>
        </div>

        {messages.map((m) =>
          m.role === 'user' ? (
            <div key={m.id} className="flex justify-end">
              {/* Visitor text: rendered as a text node only. */}
              <p className="max-w-[85%] whitespace-pre-wrap break-words rounded-2xl rounded-tr-sm bg-accent/15 px-3.5 py-2 text-sm text-text-primary">
                {m.text}
              </p>
            </div>
          ) : (
            <BotMessage key={m.id} reply={m.reply} showTrace={attackMode || m.reply.kind === 'blocked'} onAsk={send} onLink={goTo} />
          )
        )}

        {thinking && (
          <p className="font-mono text-xs text-text-subtle" aria-hidden="true">
            screening…
          </p>
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex items-end gap-2 border-t border-border p-3"
      >
        <label htmlFor="ask-ayush-input" className="sr-only">
          Your question
        </label>
        <textarea
          id="ask-ayush-input"
          ref={inputRef}
          rows={1}
          maxLength={1000}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
              e.preventDefault();
              send(input);
            }
          }}
          placeholder={attackMode ? 'Try an injection…' : 'Ask about experience, projects, skills…'}
          className="max-h-28 min-h-11 flex-1 resize-none rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-text-primary placeholder:text-text-subtle focus:outline-none focus:ring-2 focus:ring-accent"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          aria-label="Send"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-primary text-white dark:text-[#04110c] disabled:opacity-40 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <Send className="h-4 w-4" aria-hidden="true" />
        </button>
      </form>
    </div>
  );
}

function Chip({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border border-border bg-surface px-2.5 py-1 text-left text-[12px] text-text-primary hover:border-accent/60 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      {children}
    </button>
  );
}

function BotMessage({
  reply,
  showTrace,
  onAsk,
  onLink,
}: {
  reply: Reply;
  showTrace: boolean;
  onAsk: (q: string) => void;
  onLink: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
}) {
  const isBlocked = reply.kind === 'blocked';
  return (
    <div className={cn('rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-sm', isBlocked ? 'border border-red-500/30 bg-red-500/[0.06]' : 'bg-surface-elevated')}>
      <p className="mb-1 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-text-subtle">
        {isBlocked ? (
          <>
            <ShieldAlert className="h-3 w-3 text-red-500" aria-hidden="true" /> Blocked
          </>
        ) : (
          <>
            <ShieldCheck className="h-3 w-3 text-primary" aria-hidden="true" /> {reply.source ?? 'Assistant'}
          </>
        )}
      </p>
      <div className="space-y-1.5 text-text-primary">
        {reply.lines.map((l, i) => (
          <p key={i}>{l}</p>
        ))}
      </div>

      {reply.links.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
          {reply.links.map((l) => {
            const external = /^https?:/.test(l.href);
            return (
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => onLink(e, l.href)}
                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                {...(l.href.endsWith('.pdf') ? { download: '' } : {})}
                className="inline-flex items-center gap-1 text-[13px] font-medium text-accent underline-offset-2 hover:underline"
              >
                {l.label}
                {external && <ExternalLink className="h-3 w-3" aria-hidden="true" />}
              </a>
            );
          })}
        </div>
      )}

      {showTrace && (
        <details className="mt-3 rounded-xl border border-border bg-background/60 p-2.5" open={isBlocked}>
          <summary className="cursor-pointer font-mono text-[11px] text-text-muted">
            Defence trace · risk {reply.guard.risk}/100
          </summary>
          <ol className="mt-2 space-y-1.5">
            {reply.trace.map((s) => {
              const Icon = STEP_ICON[s.status];
              return (
                <li key={s.name} className="flex gap-2 text-[12px]">
                  <Icon className={cn('mt-0.5 h-3.5 w-3.5 shrink-0', STEP_TONE[s.status])} aria-hidden="true" />
                  <span>
                    <span className="font-semibold text-text-primary">{s.name}</span>{' '}
                    <span className="sr-only">({s.status === 'ok' ? 'passed' : s.status === 'flag' ? 'flagged' : 'blocked'})</span>
                    <span className="text-text-muted">{s.detail}</span>
                  </span>
                </li>
              );
            })}
          </ol>
          {reply.guard.findings.length > 0 && (
            <ul className="mt-2 space-y-1 border-t border-border pt-2">
              {reply.guard.findings.map((f) => (
                <li key={f.rule} className="text-[11px] text-text-muted">
                  <span className="font-semibold text-text-primary">{CATEGORY_LABEL[f.category]}</span> via {f.via}:{' '}
                  {/* Excerpt of visitor input: text node only. */}
                  <code className="break-all rounded bg-surface-elevated px-1 font-mono text-[11px]">{f.excerpt}</code>
                </li>
              ))}
            </ul>
          )}
        </details>
      )}

      {reply.next.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {reply.next.map((q) => (
            <Chip key={q} onClick={() => onAsk(q)}>
              {q}
            </Chip>
          ))}
        </div>
      )}
    </div>
  );
}
