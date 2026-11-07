import * as React from 'react';
import { profileData } from '@/data/profile';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { InteractiveTerminal } from '@/components/ui/InteractiveTerminal';

// Server Component; the terminal (desktop only) is the one client island.
export function AboutSection() {
  return (
    <section id="about" className="relative py-24 sm:py-32 border-t border-border/60 bg-surface/30 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 aurora opacity-60" aria-hidden="true" />
      <Container size="lg" className="relative">
        <SectionHeading
          index="04"
          eyebrow="About"
          title={
            <>
              A developer&apos;s mindset with <span className="font-display text-primary">security</span> instincts.
            </>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Story + principles */}
          <div className="lg:col-span-7 space-y-5">
            {profileData.story.map((p, i) => (
              <p key={i} className={i === 0 ? 'text-lg sm:text-xl text-text-primary leading-relaxed' : 'text-base sm:text-lg text-text-muted leading-relaxed'}>
                {p}
              </p>
            ))}

            <h3 className="pt-6 font-mono text-[11px] uppercase tracking-[0.18em] text-text-subtle">How I work</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {profileData.principles.map((pr, i) => (
                <li key={pr.title} className="reveal spotlight relative rounded-2xl border border-border bg-surface/80 p-5">
                  <span className="font-mono text-xs text-accent">0{i + 1}</span>
                  <h4 className="mt-2 font-semibold text-text-primary">{pr.title}</h4>
                  <p className="mt-1.5 text-sm text-text-muted leading-relaxed">{pr.description}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Right now + terminal */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-subtle">Right now</h3>
            <ul className="space-y-3">
              {profileData.now.map((n) => (
                <li key={n.label} className="spotlight relative flex gap-4 rounded-2xl border border-border bg-surface/80 p-4 sm:p-5">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary shadow-[0_0_12px_var(--primary)]" aria-hidden="true" />
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-wider text-text-subtle">{n.label}</p>
                    <p className="mt-0.5 font-semibold text-text-primary">{n.value}</p>
                    <p className="text-sm text-text-muted">{n.detail}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="hidden lg:block pt-4">
              <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-text-subtle">Prefer a shell? Try it</p>
              <InteractiveTerminal />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
