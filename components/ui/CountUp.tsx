'use client';

import * as React from 'react';

/**
 * Animates the numeric part of a stat (e.g. "10K+", "−35%", "+85%") from 0 when it scrolls
 * into view. Rules:
 * - The real value is server-rendered: no-JS visitors, crawlers and reduced-motion users
 *   always see the final number.
 * - Numbers already visible when the page loads are never animated (that would make a value
 *   the reader has seen reset to 0).
 * - Screen readers read a static copy; the animated text is aria-hidden.
 */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    const el = ref.current;
    const match = value.match(/^([^\d]*)(\d+(?:\.\d+)?)(.*)$/);
    if (!el || !match) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const [, prefix, num, suffix] = match;
    const target = Number(num);
    const decimals = num.includes('.') ? num.split('.')[1].length : 0;
    let frame = 0;
    let started = false;

    const run = () => {
      const start = performance.now();
      const duration = 1100;
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = `${prefix}${(target * eased).toFixed(decimals)}${suffix}`;
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };

    // Skip anything already on screen at load.
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) return;

    // Off screen: show the starting value now, so the number never visibly jumps from its final
    // value back to 0 as it scrolls in. The width of the final value is reserved first, so the
    // shorter intermediate numbers cannot shift the text around them.
    el.style.display = 'inline-block';
    el.style.minWidth = `${r.width}px`;
    el.textContent = `${prefix}${(0).toFixed(decimals)}${suffix}`;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          started = true;
          observer.disconnect();
          run();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      el.textContent = value;
      el.style.display = '';
      el.style.minWidth = '';
    };
  }, [value]);

  return (
    <span className={className}>
      <span ref={ref} aria-hidden="true" style={{ fontVariantNumeric: 'tabular-nums' }}>
        {value}
      </span>
      <span className="sr-only">{value}</span>
    </span>
  );
}
