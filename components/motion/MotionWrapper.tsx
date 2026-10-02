'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface MotionWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  immediate?: boolean;
}

/**
 * Robust, high-performance content wrapper.
 * Directly renders children with 100% opacity in SSR and initial paint.
 * Eliminates Safari IntersectionObserver delays, blank pop-in blocks,
 * and 1-3s mobile hydration lag across the entire website.
 */
export function MotionWrapper({
  children,
  className,
  delay: _delay,
  direction: _direction,
  immediate: _immediate,
  ...props
}: MotionWrapperProps) {
  return (
    <div className={cn(className)} {...props}>
      {children}
    </div>
  );
}
