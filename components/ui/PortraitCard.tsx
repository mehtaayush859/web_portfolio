'use client';

import * as React from 'react';

/**
 * Adds a gentle 3D tilt that follows the pointer (desktop, motion allowed).
 * The card content is server-rendered and passed in as children.
 */
export function PortraitTilt({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ok = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    if (!ok.matches) return;
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        el.style.transform = `perspective(1000px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
      });
    };
    const reset = () => {
      cancelAnimationFrame(frame);
      el.style.transform = '';
    };
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', reset);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', reset);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} className={className} style={{ transition: 'transform 0.25s ease-out', transformStyle: 'preserve-3d' }}>
      {children}
    </div>
  );
}
