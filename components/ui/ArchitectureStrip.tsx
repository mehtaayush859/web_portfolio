import * as React from 'react';
import { cn } from '@/lib/utils';

/** Renders a project's simplified data flow as connected nodes (wraps on small screens). */
export function ArchitectureStrip({ nodes, tone }: { nodes: string[]; tone: 'build' | 'secure' }) {
  const color = tone === 'build' ? 'text-accent border-accent/30 bg-accent/5' : 'text-primary border-primary/30 bg-primary/5';
  return (
    <ol className="flex flex-wrap items-center gap-y-2" aria-label="Architecture">
      {nodes.map((n, i) => (
        <li key={n} className="flex items-center">
          <span
            className={cn(
              'rounded-lg border px-2.5 py-1 font-mono text-[11px] whitespace-nowrap',
              i === 0 || i === nodes.length - 1 ? color : 'border-border bg-surface-elevated/70 text-text-muted'
            )}
          >
            {n}
          </span>
          {i < nodes.length - 1 && (
            <span className="mx-1.5 flex items-center" aria-hidden="true">
              <span className="flow-line h-px w-4 sm:w-6" />
              <span className="text-[10px] text-text-subtle">▸</span>
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}
