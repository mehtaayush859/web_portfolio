'use client';

import * as React from 'react';
import { Search } from 'lucide-react';

// Plain import() rather than next/dynamic, for the same reason as AssistantLauncher.
type PaletteType = typeof import('@/components/ui/CommandPalette').CommandPalette;
let palettePromise: Promise<PaletteType> | null = null;
const loadPalette = () => (palettePromise ??= import('@/components/ui/CommandPalette').then((m) => m.CommandPalette));

const noopSubscribe = () => () => {};
const isApple = () => /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

/**
 * Navbar button + global ⌘K / Ctrl+K shortcut. The palette itself is a separate chunk that
 * downloads on first use (or on hover/focus of this button).
 */
export function CommandPaletteLauncher() {
  const [open, setOpen] = React.useState(false);
  const [Palette, setPalette] = React.useState<PaletteType | null>(null);
  // Server snapshot "⌘K"; corrected after hydration for non-Apple devices without a mismatch.
  const apple = React.useSyncExternalStore(noopSubscribe, isApple, () => true);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && !e.altKey && !e.shiftKey && e.key.toLowerCase() === 'k') {
        // Ignore while another modal dialog (details, certificate, mobile menu) is open: actions
        // like "Go to Projects" would scroll the page hidden behind it.
        const otherModal = document.querySelector('[role="dialog"][aria-modal="true"]:not([aria-label="Search and commands"])');
        if (otherModal) return;
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const close = React.useCallback(() => setOpen(false), []);
  const prefetch = () => void loadPalette().catch(() => {});

  React.useEffect(() => {
    if (!open || Palette) return;
    let live = true;
    loadPalette().then(
      (C) => live && setPalette(() => C),
      () => {
        palettePromise = null;
        if (live) setOpen(false);
      }
    );
    return () => {
      live = false;
    };
  }, [open, Palette]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        onPointerEnter={prefetch}
        onFocus={prefetch}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="Search and commands"
        aria-keyshortcuts={apple ? 'Meta+K' : 'Control+K'}
        className="inline-flex items-center justify-center gap-2 min-h-10 min-w-10 rounded-full border border-border bg-surface/80 px-2.5 xl:pl-3 xl:pr-2 text-sm text-text-muted hover:text-text-primary hover:border-accent/50 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <Search className="h-4 w-4" aria-hidden="true" />
        <span className="hidden xl:inline" aria-hidden="true">
          Search
        </span>
        <kbd className="hidden xl:inline rounded-md border border-border bg-surface-elevated px-1.5 py-0.5 font-mono text-[10px] text-text-subtle" aria-hidden="true">
          {apple ? '⌘K' : 'Ctrl K'}
        </kbd>
      </button>
      {open && Palette && <Palette onClose={close} />}
    </>
  );
}
