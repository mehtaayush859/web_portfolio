import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-xs font-medium transition-colors select-none',
  {
    variants: {
      variant: {
        default:
          'bg-primary/10 text-primary border border-primary/25',
        cyan:
          'bg-accent/10 text-accent border border-accent/25',
        muted:
          'bg-surface-elevated text-text-muted border border-border',
        status:
          'bg-primary/10 text-primary border border-primary/30',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  ping?: boolean;
}

export function Badge({
  className,
  variant,
  ping,
  children,
  ...props
}: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, className }))} {...props}>
      {ping && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
        </span>
      )}
      {children}
    </span>
  );
}
