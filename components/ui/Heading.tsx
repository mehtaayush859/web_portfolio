import * as React from 'react';
import { cn } from '@/lib/utils';

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'display';
}

export function Heading({
  as: Component = 'h2',
  size,
  className,
  children,
  ...props
}: HeadingProps) {
  const sizeClasses = {
    sm: 'text-lg font-semibold tracking-tight',
    md: 'text-xl font-semibold tracking-tight',
    lg: 'text-2xl md:text-3xl font-bold tracking-tight',
    xl: 'text-3xl md:text-4xl font-bold tracking-tight',
    '2xl': 'text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight',
    display: 'text-4xl sm:text-6xl md:text-7xl font-bold tracking-tighter',
  };

  const defaultSize =
    size ||
    (Component === 'h1'
      ? 'display'
      : Component === 'h2'
      ? 'xl'
      : Component === 'h3'
      ? 'lg'
      : 'md');

  return (
    <Component
      className={cn(sizeClasses[defaultSize], 'text-text-primary', className)}
      {...props}
    >
      {children}
    </Component>
  );
}
