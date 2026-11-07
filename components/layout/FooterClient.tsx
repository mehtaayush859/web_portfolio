'use client';

import * as React from 'react';
import { ArrowUp } from 'lucide-react';
import { scrollBehavior } from '@/lib/client-utils';

export function BackToTopButton() {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: scrollBehavior() })}
      className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-border bg-surface text-xs font-medium text-text-primary hover:border-primary/50 hover:text-primary transition-colors"
      aria-label="Scroll back to top"
    >
      <span>Back to top</span>
      <ArrowUp className="h-3.5 w-3.5" />
    </button>
  );
}

const noopSubscribe = () => () => {};

/**
 * The page is prerendered at build time, so the server snapshot is the build year.
 * The client snapshot corrects it after hydration without a hydration mismatch.
 */
export function CurrentYear({ buildYear }: { buildYear: number }) {
  const year = React.useSyncExternalStore(
    noopSubscribe,
    () => new Date().getFullYear(),
    () => buildYear
  );
  return <>{year}</>;
}
