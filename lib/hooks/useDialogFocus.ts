'use client';

import * as React from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Accessible dialog focus management (WCAG 2.4.3 / 2.1.2):
 * - moves focus into the dialog when it opens,
 * - keeps Tab / Shift+Tab inside the dialog while open,
 * - returns focus to the element that opened it when it closes.
 */
export function useDialogFocus<T extends HTMLElement>(isOpen: boolean) {
  const containerRef = React.useRef<T>(null);

  React.useEffect(() => {
    if (!isOpen) return;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const focusables = () =>
      containerRef.current
        ? [...containerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
            (el) => el.offsetParent !== null || el === document.activeElement
          )
        : [];

    // Wait one frame so the dialog (and any enter animation wrapper) is in the DOM.
    const raf = requestAnimationFrame(() => {
      const container = containerRef.current;
      if (!container) return;
      const preferred = container.querySelector<HTMLElement>('[data-autofocus]');
      (preferred ?? focusables()[0] ?? container).focus({ preventScroll: true });
    });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !containerRef.current) return;
      const items = focusables();
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      const inside = containerRef.current.contains(active);
      if (e.shiftKey && (active === first || !inside)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !inside)) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('keydown', onKeyDown);
      if (opener && document.contains(opener)) opener.focus({ preventScroll: true });
    };
  }, [isOpen]);

  return containerRef;
}
