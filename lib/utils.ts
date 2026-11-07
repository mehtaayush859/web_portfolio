import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Joins classes and resolves Tailwind conflicts (later wins). Use in Server Components and lazily loaded UI. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
