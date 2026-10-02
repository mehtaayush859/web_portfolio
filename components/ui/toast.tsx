'use client';

import * as React from 'react';
import * as ToastPrimitives from '@radix-ui/react-toast';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success';
}

type ToastContextType = {
  toast: (message: Omit<ToastMessage, 'id'>) => void;
};

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastMessage[]>([]);

  const toast = React.useCallback(
    ({ title, description, variant = 'default' }: Omit<ToastMessage, 'id'>) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, title, description, variant }]);
    },
    []
  );

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      <ToastPrimitives.Provider swipeDirection="right" duration={4000}>
        {children}
        {toasts.map(({ id, title, description, variant }) => (
          <ToastPrimitives.Root
            key={id}
            onOpenChange={(open) => {
              if (!open) removeToast(id);
            }}
            className={cn(
              'group pointer-events-auto relative flex w-full max-w-sm items-start gap-3 overflow-hidden rounded-lg p-4 shadow-xl transition-all border',
              variant === 'destructive'
                ? 'bg-destructive/10 border-destructive/40 text-text-primary'
                : variant === 'success'
                ? 'bg-primary/10 border-primary/40 text-text-primary'
                : 'bg-surface border-border text-text-primary'
            )}
          >
            <div className="shrink-0 mt-0.5">
              {variant === 'destructive' ? (
                <AlertCircle className="h-5 w-5 text-destructive" />
              ) : (
                <CheckCircle className="h-5 w-5 text-primary" />
              )}
            </div>
            <div className="flex-1">
              <ToastPrimitives.Title className="text-sm font-semibold">
                {title}
              </ToastPrimitives.Title>
              {description && (
                <ToastPrimitives.Description className="mt-1 text-xs text-text-muted leading-relaxed">
                  {description}
                </ToastPrimitives.Description>
              )}
            </div>
            <ToastPrimitives.Close
              aria-label="Close notification"
              className="rounded p-1 text-text-muted hover:text-text-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              <X className="h-4 w-4" />
            </ToastPrimitives.Close>
          </ToastPrimitives.Root>
        ))}
        <ToastPrimitives.Viewport className="fixed top-4 right-4 z-50 flex max-h-screen w-full max-w-sm flex-col gap-2 p-4 focus:outline-none" />
      </ToastPrimitives.Provider>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
