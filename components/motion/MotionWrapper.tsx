'use client';

import * as React from 'react';
import { motion, useReducedMotion, type HTMLMotionProps } from 'motion/react';
import { cn } from '@/lib/utils';

export interface MotionWrapperProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children?: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
}

export function MotionWrapper({
  children,
  className,
  delay = 0,
  direction = 'up',
  ...props
}: MotionWrapperProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={cn(className)}>{children}</div>;
  }

  const offset = 24;
  const initialVariants = {
    up: { opacity: 0, y: offset },
    down: { opacity: 0, y: -offset },
    left: { opacity: 0, x: offset },
    right: { opacity: 0, x: -offset },
    none: { opacity: 0 },
  };

  return (
    <motion.div
      initial={initialVariants[direction]}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.5,
        delay: delay / 1000,
        ease: [0.16, 1, 0.3, 1], // ease-out-expo
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
