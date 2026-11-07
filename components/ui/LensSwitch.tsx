'use client';

import * as React from 'react';
import { Code2, Layers, ShieldCheck } from 'lucide-react';
import { cx } from '@/lib/client-utils';
import { LENS_EVENT, type LensChoice } from '@/lib/events';

type LensValue = LensChoice;

const OPTIONS: { id: LensValue; label: string; icon: React.ReactNode; announce: string }[] = [
  { id: 'all', label: 'Both', icon: <Layers className="h-3.5 w-3.5" aria-hidden="true" />, announce: 'Showing all work' },
  { id: 'build', label: 'Build', icon: <Code2 className="h-3.5 w-3.5" aria-hidden="true" />, announce: 'Highlighting software engineering work' },
  { id: 'secure', label: 'Secure', icon: <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />, announce: 'Highlighting security engineering work' },
];

/**
 * Switches the portfolio "lens". It only sets <html data-lens>; the highlighting itself is
 * CSS (globals.css), so the server-rendered sections need no JavaScript to react.
 */
export function LensSwitch() {
  const [lens, setLens] = React.useState<LensValue>('all');

  const choose = React.useCallback((value: LensValue) => {
    setLens(value);
    if (value === 'all') delete document.documentElement.dataset.lens;
    else document.documentElement.dataset.lens = value;
  }, []);

  // Lens changes requested elsewhere (command palette). Only known values are accepted.
  React.useEffect(() => {
    const onLens = (e: Event) => {
      const value = (e as CustomEvent<unknown>).detail;
      if (value === 'all' || value === 'build' || value === 'secure') choose(value);
    };
    window.addEventListener(LENS_EVENT, onLens);
    return () => window.removeEventListener(LENS_EVENT, onLens);
  }, [choose]);

  // Arrow-key navigation inside the radio group (WAI-ARIA radio pattern).
  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) return;
    e.preventDefault();
    const i = OPTIONS.findIndex((o) => o.id === lens);
    const next = OPTIONS[(i + (e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 1) + OPTIONS.length) % OPTIONS.length];
    choose(next.id);
    (e.currentTarget.parentElement?.querySelector(`[data-value="${next.id}"]`) as HTMLButtonElement | null)?.focus();
  };

  const active = OPTIONS.find((o) => o.id === lens)!;

  return (
    <div className="flex flex-col items-center lg:items-start gap-2">
      <span id="lens-label" className="text-[11px] font-mono uppercase tracking-[0.2em] text-text-subtle">
        View my work through
      </span>
      <div
        role="radiogroup"
        aria-labelledby="lens-label"
        className="relative inline-flex items-center gap-1 p-1 rounded-full border border-border bg-surface/80"
      >
        {OPTIONS.map((o) => {
          const selected = lens === o.id;
          return (
            <button
              key={o.id}
              type="button"
              role="radio"
              aria-checked={selected}
              tabIndex={selected ? 0 : -1}
              data-value={o.id}
              onClick={() => choose(o.id)}
              onKeyDown={onKeyDown}
              className={cx(
                'inline-flex items-center gap-1.5 min-h-9 px-4 rounded-full text-xs font-semibold transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
                selected && o.id === 'build' && 'bg-accent text-accent-foreground shadow-[0_0_24px_-6px_var(--accent)]',
                selected && o.id === 'secure' && 'bg-primary text-primary-foreground shadow-[0_0_24px_-6px_var(--primary)]',
                selected && o.id === 'all' && 'bg-text-primary text-background',
                !selected && 'text-text-muted hover:text-text-primary'
              )}
            >
              {o.icon}
              {o.label}
            </button>
          );
        })}
      </div>
      <span className="sr-only" aria-live="polite">
        {lens === 'all' ? '' : active.announce}
      </span>
    </div>
  );
}
