'use client';

import * as React from 'react';
import { Sparkles, Eye, Activity } from 'lucide-react';
import { triggerEmojiShower } from '@/components/ui/EmojiShower';
import { useToast } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';

interface ReactionItem {
  id: string;
  emoji: string;
  label: string;
  baseCount: number;
}

const initialReactions: ReactionItem[] = [
  { id: 'thumbs', emoji: '👍', label: 'Thumbs Up', baseCount: 248 },
  { id: 'fire', emoji: '🔥', label: 'Impressive Tech', baseCount: 196 },
  { id: 'rocket', emoji: '🚀', label: 'Fast & Smooth', baseCount: 154 },
  { id: 'bulb', emoji: '💡', label: 'Innovative', baseCount: 122 },
  { id: 'heart', emoji: '❤️', label: 'Love the Work', baseCount: 210 },
];

export function HeroLivePulse() {
  const { toast } = useToast();
  const [visitorCount, setVisitorCount] = React.useState<number>(1450);
  const [reactions, setReactions] = React.useState<Record<string, number>>(() =>
    initialReactions.reduce((acc, r) => ({ ...acc, [r.id]: r.baseCount }), {})
  );
  const [activeReactionId, setActiveReactionId] = React.useState<string | null>(null);

  // Sync with live /api/pulse backend
  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    let isMounted = true;

    // 1. Dispatch single visit tracking on load (which returns current views & reactions in <5ms)
    fetch('/api/pulse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'visit',
        clientReferrer: document.referrer || '',
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && typeof data.views === 'number') {
          setVisitorCount(data.views);
        }
        if (isMounted && data.reactions) {
          setReactions(data.reactions);
        }
      })
      .catch(() => {});

    // 2. Helper for subsequent background polling
    const pollCounts = async () => {
      try {
        const res = await fetch('/api/pulse', { cache: 'no-store' });
        if (res.ok && isMounted) {
          const data = await res.json();
          if (typeof data.views === 'number') setVisitorCount(data.views);
          if (data.reactions) setReactions(data.reactions);
        }
      } catch {
        // Fallback silently
      }
    };

    // 3. Lightweight live polling (every 16 seconds when tab is active)
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        pollCounts();
      }
    }, 16000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleReaction = (item: ReactionItem) => {
    // 1. Optimistic instant local update in 0ms
    const updatedCount = (reactions[item.id] || item.baseCount) + 1;
    setReactions((prev) => ({ ...prev, [item.id]: updatedCount }));

    // 2. Micro bump animation
    setActiveReactionId(item.id);
    setTimeout(() => setActiveReactionId(null), 600);

    // 3. Trigger full-screen cascading emoji shower!
    triggerEmojiShower(item.emoji);

    // 4. Send reaction to backend in background (fire-and-forget)
    fetch('/api/pulse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'react',
        reactionId: item.id,
        emoji: item.emoji,
        clientReferrer: document.referrer || '',
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.reactions) setReactions(data.reactions);
      })
      .catch(() => {});

    // 5. Friendly feedback toast
    toast({
      title: `${item.emoji} Reaction Dispatched!`,
      description: `Thanks for the feedback!`,
      variant: 'default',
    });
  };

  return (
    <div className="w-full max-w-xl mx-auto lg:mx-0 mt-6 pt-4 border-t border-border/70">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-3.5 py-2.5 sm:px-4 sm:py-2.5 rounded-xl bg-surface/75 border border-border/80 backdrop-blur-md shadow-sm">
        {/* Left: Live Visitor Telemetry Counter */}
        <div className="flex items-center gap-2 text-xs font-mono text-text-subtle shrink-0">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-text-primary font-semibold">
            {visitorCount.toLocaleString()}
          </span>
          <span className="text-text-muted">Live Views</span>
        </div>

        {/* Right: Interactive Reaction Bar */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar max-w-full">
          {initialReactions.map((item) => {
            const count = reactions[item.id] || item.baseCount;
            const isBumping = activeReactionId === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleReaction(item)}
                aria-label={`React with ${item.label}`}
                title={`React with ${item.label}`}
                className={cn(
                  'flex items-center gap-1 px-2 py-1 rounded-lg border border-border/70 bg-surface-elevated/70 text-xs font-mono font-medium hover:border-primary/50 hover:bg-surface-elevated active:scale-95 transition-all cursor-pointer select-none shrink-0',
                  isBumping && 'scale-110 border-primary bg-primary/10 ring-2 ring-primary/30'
                )}
              >
                <span className="text-sm leading-none">{item.emoji}</span>
                <span className="text-[11px] text-text-muted font-semibold">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

