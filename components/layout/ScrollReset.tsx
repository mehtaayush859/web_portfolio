'use client';

import * as React from 'react';

export function ScrollReset() {
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      // Force manual scroll restoration so browsers do not remember old scroll offset on reload
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
      }

      // If page reloads with a section hash, clear it to start at the top
      if (window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname);
      }

      // Temporarily disable CSS smooth scrolling to guarantee 0ms instant jump to top
      const html = document.documentElement;
      const prevBehavior = html.style.scrollBehavior;
      html.style.scrollBehavior = 'auto';

      // Scroll immediately to beginning
      window.scrollTo(0, 0);

      // Restore smooth scroll behavior for in-page user navigation
      requestAnimationFrame(() => {
        html.style.scrollBehavior = prevBehavior || '';
      });
    }
  }, []);

  return null;
}
