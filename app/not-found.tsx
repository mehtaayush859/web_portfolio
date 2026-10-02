import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Heading';
import { Button } from '@/components/ui/Button';

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
        <Link href="/">
          <Button variant="primary" size="lg" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Portfolio</span>
          </Button>
        </Link>
      </Container>
    </div>
  );
}
