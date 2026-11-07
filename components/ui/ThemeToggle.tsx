'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { switchTheme, currentTheme } from '@/lib/theme-switch';
import { THEME_EVENT } from '@/lib/events';

export function ThemeToggle({ listen = false }: { listen?: boolean }) {
  const { resolvedTheme, setTheme } = useTheme();

  // Theme requests from other islands (command palette). Only one toggle listens (the navbar's),
  // and the event names the target theme, so a repeat cannot flip it back.
  React.useEffect(() => {
    if (!listen) return;
    const onTheme = (e: Event) => {
      const next = (e as CustomEvent<unknown>).detail;
      if (next === 'light' || next === 'dark') switchTheme(next, setTheme);
    };
    window.addEventListener(THEME_EVENT, onTheme);
    return () => window.removeEventListener(THEME_EVENT, onTheme);
  }, [listen, setTheme]);

  const toggleTheme = (e: React.MouseEvent<HTMLButtonElement>) => {
    const next = currentTheme(resolvedTheme) === 'dark' ? 'light' : 'dark';
    const r = e.currentTarget.getBoundingClientRect();
    switchTheme(next, setTheme, { x: r.left + r.width / 2, y: r.top + r.height / 2 });
  };

  return (
    // Classes are the previously merged result of Button(ghost, icon) + overrides, written out
    // explicitly so this client component doesn't need tailwind-merge.
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle color theme"
      title="Toggle color theme"
      className="inline-flex items-center justify-center gap-2 rounded-md font-medium duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 select-none hover:bg-surface-elevated active:scale-[0.98] min-h-[44px] min-w-[44px] h-10 w-10 p-0 relative overflow-hidden text-text-muted hover:text-primary transition-colors cursor-pointer"
    >
      <Sun className="hidden dark:block h-5 w-5 transition-transform duration-300 hover:rotate-45" />
      <Moon className="block dark:hidden h-5 w-5 transition-transform duration-300 hover:-rotate-12" />
    </button>
  );
}
