'use client';

import * as React from 'react';
import { Award, ShieldCheck, Sparkles } from 'lucide-react';
import dynamic from 'next/dynamic';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Heading';
import { CertificationCard } from '@/components/ui/CertificationCard';
import { certificationsData, type Certification } from '@/data/certifications';

const CertificateModal = dynamic(
  () => import('@/components/ui/CertificateModal').then((mod) => mod.CertificateModal),
  { ssr: false }
);

export function CertificationsSection() {
  const [selectedCert, setSelectedCert] = React.useState<Certification | null>(null);

  return (
    <section
      id="certifications"
      className="py-20 sm:py-28 border-t border-border/60 bg-surface/20"
    >
      <Container size="lg">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-14">
          <span className="text-xs font-mono font-medium text-primary uppercase tracking-widest mb-2.5 block">
            VERIFIED CREDENTIALS & CONTINUOUS LEARNING
          </span>
          <Heading as="h2" size="xl">
            Certifications &amp; Accreditations
          </Heading>
          <p className="mt-3 text-sm sm:text-base text-text-muted max-w-2xl mx-auto leading-relaxed">
            Industry and academic certifications validating rigorous competencies across enterprise networking, artificial intelligence mathematics, and machine learning systems.
          </p>
        </div>

        {/* Mobile Swipe Gesture Hint */}
        <div className="flex lg:hidden items-center justify-center px-1 mb-4 text-xs font-mono text-text-subtle">
          <span className="flex items-center gap-1.5 text-primary font-semibold">
            <span>← Swipe Credentials →</span>
          </span>
        </div>

        {/* 3-Card Grid (Touch-Swipe track on mobile, 3-column grid on desktop) */}
        <div className="flex lg:grid lg:grid-cols-3 gap-4 sm:gap-6 overflow-x-auto lg:overflow-visible snap-x snap-mandatory swipe-track no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 pt-2 pb-4 items-stretch scroll-pl-4 scroll-pr-4">
          {certificationsData.map((cert) => (
            <div
              key={cert.id}
              className="w-[86vw] max-w-[360px] shrink-0 snap-start lg:w-auto lg:max-w-none lg:shrink flex flex-col"
            >
              <CertificationCard
                certification={cert}
                onView={(c) => setSelectedCert(c)}
              />
            </div>
          ))}
        </div>
      </Container>

      {/* PDF Certificate Preview & Verification Modal */}
      <CertificateModal
        certification={selectedCert}
        isOpen={!!selectedCert}
        onClose={() => setSelectedCert(null)}
      />
    </section>
  );
}

