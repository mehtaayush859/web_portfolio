import { clsx, type ClassValue } from 'clsx';

// Helpers for Client Components that are part of the initial bundle. Kept separate from
// lib/utils.ts so importing them never pulls in tailwind-merge (~8 KB gzip): webpack keeps a
// shared module's used exports in the initial chunk, even if only a lazy chunk uses `cn`.

/**
 * Joins classes without Tailwind conflict resolution. Callers must not pass conflicting
 * utilities (e.g. two text colours); use `cn` from lib/utils in Server Components for that.
 */
export function cx(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/** 'auto' when the user prefers reduced motion, otherwise 'smooth' (for JS-driven scrolling). */
export function scrollBehavior(): ScrollBehavior {
  if (typeof window === 'undefined' || !window.matchMedia) return 'auto';
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
}
