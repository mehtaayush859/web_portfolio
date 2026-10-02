import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'full';
}

export function Container({
  size = 'lg',
  className,
  children,
  ...props
}: ContainerProps) {
  const sizeClasses = {
    sm: 'max-w-4xl',
    md: 'max-w-5xl',
    lg: 'max-w-6xl',
    full: 'max-w-7xl',
  };

  return (
    <div
      className={cn(
        'mx-auto w-full px-4 sm:px-6 md:px-8 lg:px-12',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
