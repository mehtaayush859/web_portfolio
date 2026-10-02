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

      // Scroll immediately to beginning
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, []);

  return null;
}
