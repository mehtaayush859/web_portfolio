'use client';

import * as React from 'react';
import { RefreshCw } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Heading';
import { Button } from '@/components/ui/Button';

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
      <Container size="sm" className="text-center">
        <span className="text-xs font-mono font-bold text-destructive tracking-widest uppercase mb-3 block">
          SYSTEM FAULT: 500
        </span>
        <Heading as="h1" size="2xl" className="mb-4">
          Something went wrong
        </Heading>
        <p className="text-base text-text-muted mb-8 max-w-md mx-auto leading-relaxed">
          An unexpected application error occurred. You can retry loading the interface.
        </p>
        <Button variant="primary" size="lg" onClick={() => reset()} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          <span>Try Again</span>
        </Button>
      </Container>
    </div>
  );
}
