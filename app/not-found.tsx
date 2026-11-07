import type { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Heading';
import { buttonVariants } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Page Not Found',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-24 px-4 bg-grid-pattern">
      <Container size="sm" className="text-center">
        <span className="text-xs font-mono font-bold text-primary tracking-widest uppercase mb-3 block">
          ERROR 404: ROUTE NOT FOUND
        </span>
        <Heading as="h1" size="2xl" className="mb-4">
          Page Not Found
        </Heading>
        <p className="text-base text-text-muted mb-8 max-w-md mx-auto leading-relaxed">
          The requested URL does not exist or has been relocated. Return to the main portfolio.
        </p>
        {/* A single link styled as a button (no <button> nested inside <a>). A plain <a> on purpose:
            next/link would add its client runtime to every page, since this boundary ships with the root layout. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- full reload from a 404 is fine; avoids shipping next/link on every page */}
        <a href="/" className={cn(buttonVariants({ variant: 'primary', size: 'lg' }), 'gap-2')}>
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>Return to Portfolio</span>
        </a>
      </Container>
    </div>
  );
}
