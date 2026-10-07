'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { Button } from './Button';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = () => {
    // If resolvedTheme is available, toggle it; otherwise check document.documentElement class
    const isDark = resolvedTheme
      ? resolvedTheme === 'dark'
      : typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle color theme"
      title="Toggle color theme"
      className="relative overflow-hidden text-text-muted hover:text-primary transition-colors cursor-pointer"
    >
      <Sun className="hidden dark:block h-5 w-5 transition-transform duration-300 hover:rotate-45" />
      <Moon className="block dark:hidden h-5 w-5 transition-transform duration-300 hover:-rotate-12" />
    </Button>
  );
}
