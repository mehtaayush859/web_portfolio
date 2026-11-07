import * as React from 'react';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  index: string;
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: 'left' | 'center';
  className?: string;
  /** Optional element shown on the right of the heading (desktop). */
  aside?: React.ReactNode;
}

/** Numbered section header: "01 — Experience", a large title and an optional description. */
export function SectionHeading({ index, eyebrow, title, description, align = 'left', className, aside }: SectionHeadingProps) {
  const centered = align === 'center';
  return (
    <div className={cn('mb-12 sm:mb-16 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between', centered && 'items-center text-center lg:flex-col lg:items-center', className)}>
      <div className={cn('max-w-3xl', centered && 'mx-auto')}>
        <p className={cn('flex items-center gap-3 mb-4 font-mono text-xs uppercase tracking-[0.22em] text-text-subtle', centered && 'justify-center')}>
          <span className="text-accent">{index}</span>
          <span className="h-px w-8 bg-gradient-to-r from-accent to-primary" aria-hidden="true" />
          <span>{eyebrow}</span>
        </p>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-text-primary leading-[1.1]">{title}</h2>
        {description && <p className="mt-4 text-base sm:text-lg text-text-muted leading-relaxed max-w-2xl">{description}</p>}
      </div>
      {aside && <div className="shrink-0">{aside}</div>}
    </div>
  );
}

/** Small pill showing which lens an item belongs to. */
export function LensBadges({ lenses }: { lenses: readonly ('build' | 'secure')[] }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      {lenses.map((l) => (
        <span
          key={l}
          className={cn(
            'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider',
            l === 'build' ? 'border-accent/30 bg-accent/10 text-accent' : 'border-primary/30 bg-primary/10 text-primary'
          )}
        >
          <span className={cn('h-1.5 w-1.5 rounded-full', l === 'build' ? 'bg-accent' : 'bg-primary')} aria-hidden="true" />
          {l === 'build' ? 'Build' : 'Secure'}
        </span>
      ))}
    </span>
  );
}
