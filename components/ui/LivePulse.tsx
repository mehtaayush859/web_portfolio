'use client';

import * as React from 'react';
import { triggerEmojiShower } from '@/components/ui/EmojiShower';
import { useToast } from '@/components/ui/Toast';
import { cx } from '@/lib/client-utils';
import { REACTIONS, isReactionId, type PulseResponse, type ReactionId } from '@/lib/pulse/shared';

type Status = 'loading' | 'ready' | 'disabled';
type Counts = { views: number; reactions: Record<ReactionId, number> };

const POLL_INTERVAL_MS = 60_000;
const STORAGE_KEY = 'pulse-reacted';

// The server counts each reaction once per visitor per UTC day; the browser mirrors that rule
// so repeat clicks do nothing (no request, no shower, no toast), even after a reload.
const utcDay = () => new Date().toISOString().slice(0, 10);

function loadReacted(): Set<ReactionId> {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') as { day?: unknown; ids?: unknown } | null;
    if (saved?.day !== utcDay() || !Array.isArray(saved.ids)) return new Set();
    return new Set(saved.ids.filter(isReactionId));
  } catch {
    return new Set(); // storage blocked or corrupted: fall back to this page view only
  }
}

function saveReacted(ids: ReadonlySet<ReactionId>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ day: utcDay(), ids: [...ids] }));
  } catch {
    /* storage unavailable: the in-memory guard still applies */
  }
}

/** Footer widget: real visit count (small) and one-tap reactions backed by /api/pulse. */
export function LivePulse() {
  const { toast } = useToast();
  const [status, setStatus] = React.useState<Status>('loading');
  const [counts, setCounts] = React.useState<Counts | null>(null);
  const [reacted, setReacted] = React.useState<ReadonlySet<ReactionId>>(() => new Set());
  // Synchronous guard: two clicks in the same frame both see the old state, the ref does not.
  const reactedRef = React.useRef<Set<ReactionId>>(new Set());
  const [activeReactionId, setActiveReactionId] = React.useState<ReactionId | null>(null);

  const applyResponse = React.useCallback((data: PulseResponse | { error: string } | null) => {
    if (!data || 'error' in data) return;
    if (!data.enabled) {
      setStatus('disabled');
      return;
    }
    setCounts({ views: data.views, reactions: data.reactions });
    setStatus('ready');
  }, []);

  // Restore today's reactions after hydration (server HTML has none, so no mismatch).
  React.useEffect(() => {
    const saved = loadReacted();
    if (saved.size === 0) return;
    for (const id of saved) reactedRef.current.add(id);
    const t = setTimeout(() => setReacted(new Set(saved)), 0);
    return () => clearTimeout(t);
  }, []);

  React.useEffect(() => {
    let isMounted = true;
    const safeApply = (data: PulseResponse | null) => {
      if (isMounted) applyResponse(data);
    };

    // Record this visit once; the server de-duplicates per visitor per day.
    fetch('/api/pulse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'visit', clientReferrer: document.referrer || '' }),
    })
      .then((res) => res.json())
      .then(safeApply)
      .catch(() => isMounted && setStatus('disabled'));

    const interval = setInterval(() => {
      if (document.visibilityState !== 'visible') return;
      fetch('/api/pulse')
        .then((res) => (res.ok ? res.json() : null))
        .then(safeApply)
        .catch(() => {});
    }, POLL_INTERVAL_MS);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [applyResponse]);

  const handleReaction = (item: (typeof REACTIONS)[number]) => {
    // One reaction per emoji: any further clicks are ignored entirely.
    if (reactedRef.current.has(item.id)) return;
    reactedRef.current.add(item.id);
    setReacted(new Set(reactedRef.current));
    saveReacted(reactedRef.current);

    setActiveReactionId(item.id);
    setTimeout(() => setActiveReactionId(null), 600);
    triggerEmojiShower(item.emoji);

    if (status === 'ready') {
      // Optimistic +1; the server response is authoritative and replaces it.
      setCounts((prev) =>
        prev ? { ...prev, reactions: { ...prev.reactions, [item.id]: prev.reactions[item.id] + 1 } } : prev
      );
      fetch('/api/pulse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'react', reactionId: item.id, clientReferrer: document.referrer || '' }),
      })
        .then((res) => res.json())
        .then(applyResponse)
        .catch(() => {});
    }

    toast({ title: `${item.emoji} Thanks for the reaction!`, description: 'Your feedback was received.', variant: 'default' });
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-border bg-surface/80 px-4 py-3">
        <div className="flex flex-col items-center sm:items-start gap-0.5 text-center sm:text-left">
          <span className="text-sm font-medium text-text-primary">Enjoyed the visit? Leave a reaction.</span>
          {/* Visit count: real data only, shown small; nothing appears until it loads. */}
          <span className="font-mono text-[11px] text-text-subtle" aria-live="off">
            {status === 'ready' && counts ? `${counts.views.toLocaleString()} unique visits` : '\u00a0'}
          </span>
        </div>

        {/* Right: reaction bar */}
        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-1.5 sm:gap-2 max-w-full">
          {REACTIONS.map((item) => {
            const isBumping = activeReactionId === item.id;
            const done = reacted.has(item.id);
            const count = status === 'ready' && counts ? counts.reactions[item.id] : null;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleReaction(item)}
                aria-pressed={done}
                aria-label={`${done ? 'You reacted' : 'React'} with ${item.label}${count !== null ? ` (${count})` : ''}`}
                title={done ? `You reacted with ${item.label}` : `React with ${item.label}`}
                className={cx(
                  'flex items-center gap-1 px-2 py-1 rounded-lg border text-xs font-mono font-medium transition-all select-none shrink-0',
                  !done && 'cursor-pointer hover:border-primary/50 hover:bg-surface-elevated active:scale-95',
                  isBumping && 'scale-110 ring-2 ring-primary/30',
                  done ? 'border-primary/60 bg-primary/10 cursor-default' : 'border-border/70 bg-surface-elevated/70'
                )}
              >
                <span className="text-sm leading-none">{item.emoji}</span>
                {count !== null && <span className="text-[11px] text-text-muted font-semibold tabular-nums">{count}</span>}
              </button>
            );
          })}
        </div>
    </div>
  );
}
