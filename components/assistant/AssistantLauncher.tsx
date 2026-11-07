'use client';

import * as React from 'react';
import { MessageCircle } from 'lucide-react';
import { ASK_EVENT, type AskDetail } from '@/lib/events';

// The panel, the answer engine and its knowledge base download only when first opened
// (or when the visitor hovers/focuses the button, so opening feels instant). A plain import()
// instead of next/dynamic: this island lives in the layout, and sharing next/dynamic with the
// page made webpack split a shared chunk out of the startup bundle (one more request).
type PanelType = typeof import('@/components/assistant/AssistantPanel').AssistantPanel;
let panelPromise: Promise<PanelType> | null = null;
const loadPanel = () => (panelPromise ??= import('@/components/assistant/AssistantPanel').then((m) => m.AssistantPanel));

/**
 * Floating "Ask Ayush" button. Also opens when any island dispatches ASK_EVENT
 * (command palette, terminal), optionally with a question to send straight away.
 */
export function AssistantLauncher() {
  const [open, setOpen] = React.useState(false);
  const [Panel, setPanel] = React.useState<PanelType | null>(null);
  const [pending, setPending] = React.useState<{ q: string; n: number; attack: boolean } | null>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    let n = 0;
    const onAsk = (e: Event) => {
      const detail = (e as CustomEvent<AskDetail | undefined>).detail;
      // Validate the shape: any script on the page could dispatch this event.
      const q = typeof detail?.question === 'string' ? detail.question.slice(0, 1000) : '';
      setOpen(true);
      if (q.trim() || detail?.attack) setPending({ q, n: ++n, attack: detail?.attack === true });
    };
    window.addEventListener(ASK_EVENT, onAsk);
    return () => window.removeEventListener(ASK_EVENT, onAsk);
  }, []);

  const close = React.useCallback(() => {
    setOpen(false);
    // Clear it so reopening the panel later does not send the same question again.
    setPending(null);
    buttonRef.current?.focus({ preventScroll: true });
  }, []);

  const prefetch = () => void loadPanel().catch(() => {});

  React.useEffect(() => {
    if (!open || Panel) return;
    let live = true;
    loadPanel().then(
      (C) => live && setPanel(() => C),
      () => {
        // Chunk failed to load (offline / new deploy): allow a retry on the next open.
        panelPromise = null;
        if (live) setOpen(false);
      }
    );
    return () => {
      live = false;
    };
  }, [open, Panel]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => (open ? close() : setOpen(true))}
        onPointerEnter={prefetch}
        onFocus={prefetch}
        aria-expanded={open}
        aria-controls={open ? 'ask-ayush' : undefined}
        aria-label="Ask Ayush: chat about my experience"
        className={
          'fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-30 inline-flex items-center gap-2 rounded-full border border-border bg-surface/90 backdrop-blur ' +
          'h-12 w-12 sm:w-auto justify-center sm:pl-3.5 sm:pr-4 text-sm font-semibold text-text-primary shadow-lg shadow-black/20 ' +
          'transition-all hover:border-accent/60 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent cursor-pointer ' +
          (open ? 'opacity-0 pointer-events-none sm:opacity-100 sm:pointer-events-auto' : '')
        }
      >
        <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-accent to-primary text-white dark:text-[#04110c]">
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
        </span>
        <span className="hidden sm:inline" aria-hidden="true">
          Ask Ayush
        </span>
      </button>
      {open && Panel && <Panel onClose={close} pending={pending} />}
    </>
  );
}
