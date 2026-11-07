'use client';

import * as React from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import { cx } from '@/lib/client-utils';

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

const DURATION_MS = 4000;
const MAX_VISIBLE = 3;

/**
 * Minimal toast system (replaces @radix-ui/react-toast, ~7.5 KB gzip on every page load).
 * Accessibility: a persistent polite live region announces new toasts; errors use role="alert".
 * Timers pause while a toast is hovered or focused, and every toast has a close button.
 */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastMessage[]>([]);

  const toast = React.useCallback(({ title, description, variant = 'default' }: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, description, variant }].slice(-MAX_VISIBLE));
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const value = React.useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <section aria-label="Notifications" className="pointer-events-none fixed top-4 right-4 z-50 w-full max-w-sm p-4">
        <ol aria-live="polite" aria-relevant="additions" className="flex flex-col gap-2">
          {toasts.map((t) => (
            <ToastItem key={t.id} toast={t} onDismiss={removeToast} />
          ))}
        </ol>
      </section>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onDismiss }: { toast: ToastMessage; onDismiss: (id: string) => void }) {
  const { id, title, description, variant } = toast;
  const remaining = React.useRef(DURATION_MS);
  const startedAt = React.useRef(0);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const start = React.useCallback(() => {
    if (timer.current) return;
    startedAt.current = Date.now();
    timer.current = setTimeout(() => onDismiss(id), remaining.current);
  }, [id, onDismiss]);

  const pause = React.useCallback(() => {
    if (!timer.current) return;
    clearTimeout(timer.current);
    timer.current = null;
    remaining.current = Math.max(0, remaining.current - (Date.now() - startedAt.current));
  }, []);

  React.useEffect(() => {
    start();
    return () => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = null;
    };
  }, [start]);

  return (
    <li
      role={variant === 'destructive' ? 'alert' : 'status'}
      aria-atomic="true"
      onMouseEnter={pause}
      onMouseLeave={start}
      onFocus={pause}
      onBlur={start}
      className={cx(
        'pointer-events-auto relative flex w-full items-start gap-3 overflow-hidden rounded-lg p-4 shadow-xl border',
        variant === 'destructive'
          ? 'bg-surface border-destructive/40 text-text-primary'
          : variant === 'success'
          ? 'bg-surface border-primary/40 text-text-primary'
          : 'bg-surface border-border text-text-primary'
      )}
    >
      <div className="shrink-0 mt-0.5" aria-hidden="true">
        {variant === 'destructive' ? (
          <AlertCircle className="h-5 w-5 text-destructive" />
        ) : (
          <CheckCircle className="h-5 w-5 text-primary" />
        )}
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold">{title}</p>
        {description && <p className="mt-1 text-xs text-text-muted leading-relaxed">{description}</p>}
      </div>
      <button
        type="button"
        onClick={() => onDismiss(id)}
        aria-label="Close notification"
        className="rounded p-1 text-text-muted hover:text-text-primary focus:outline-none focus-visible:ring-1 focus-visible:ring-primary cursor-pointer"
      >
        <X className="h-4 w-4" />
      </button>
    </li>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
