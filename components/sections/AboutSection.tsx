import * as React from 'react';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Heading';
import { JourneyBranchTimeline } from '@/components/sections/JourneyBranchTimeline';

export function AboutSection() {
  return (
    <section id="about" className="py-20 sm:py-28 border-t border-border/60 bg-surface/30">
      <Container size="lg">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-14">
          <span className="text-xs font-mono font-medium text-primary uppercase tracking-widest mb-2.5 block">
            Career &amp; Academic Pathways
          </span>
          <Heading as="h2" size="xl">
            My Journey: Experience &amp; Education
          </Heading>
          <p className="mt-3 text-sm sm:text-base text-text-muted max-w-2xl mx-auto leading-relaxed">
            Bridging high-throughput enterprise software engineering, automated security operations, and advanced graduate computer science studies.
          </p>
        </div>

        {/* Experience Timeline followed by Education */}
        <JourneyBranchTimeline />
      </Container>
    </section>
  );
}
