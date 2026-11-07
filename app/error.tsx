'use client';

import * as React from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

// This boundary is a Client Component that ships on every page, so it uses plain markup
// (same classes as Container size="sm" / Heading size="2xl") instead of the cn()-based
// shared components, keeping tailwind-merge out of the initial bundle.

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error('Unhandled runtime error:', error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-24 px-4 bg-grid-pattern">
      <div className="mx-auto w-full px-4 sm:px-6 md:px-8 lg:px-12 max-w-4xl text-center">
        <span className="text-xs font-mono font-bold text-destructive tracking-widest uppercase mb-3 block">
          SYSTEM FAULT: 500
        </span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-text-primary mb-4">
          Something went wrong
        </h1>
        <p className="text-base text-text-muted mb-8 max-w-md mx-auto leading-relaxed">
          An unexpected application error occurred. You can retry loading the interface.
        </p>
        <Button variant="primary" size="lg" onClick={() => reset()} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          <span>Try Again</span>
        </Button>
      </div>
    </div>
  );
}
