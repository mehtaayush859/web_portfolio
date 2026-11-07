// Theme switch with a circular reveal (View Transitions API) when available and motion is
// allowed; otherwise an instant switch. Shared by ThemeToggle and the command palette.

export type ThemeName = 'light' | 'dark';

export function switchTheme(next: ThemeName, setTheme: (t: string) => void, origin?: { x: number; y: number }) {
  const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
  if (!doc.startViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    setTheme(next);
    return;
  }
  const root = document.documentElement;
  root.style.setProperty('--vt-x', `${Math.round(origin?.x ?? window.innerWidth / 2)}px`);
  root.style.setProperty('--vt-y', `${Math.round(origin?.y ?? 0)}px`);
  // The class is applied inside the transition callback because next-themes applies it in an
  // effect, which the transition's "after" snapshot would not wait for.
  doc.startViewTransition(() => {
    root.classList.toggle('dark', next === 'dark');
    root.classList.toggle('light', next === 'light');
    root.style.colorScheme = next;
    setTheme(next);
  });
}

export function currentTheme(resolved: string | undefined): ThemeName {
  if (resolved === 'dark' || resolved === 'light') return resolved;
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}
