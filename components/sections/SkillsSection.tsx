import * as React from 'react';
import { Code2, ShieldCheck, Cloud } from 'lucide-react';
import { toolkit } from '@/data/skills';
import { lensAttr } from '@/data/lens';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { cn } from '@/lib/utils';

const ICONS = { build: Code2, secure: ShieldCheck, platform: Cloud } as const;
const TONES = {
  build: { text: 'text-accent', ring: 'border-accent/30 bg-accent/10', dot: 'bg-accent' },
  secure: { text: 'text-primary', ring: 'border-primary/30 bg-primary/10', dot: 'bg-primary' },
  platform: { text: 'text-violet', ring: 'border-violet/30 bg-violet/10', dot: 'bg-violet' },
} as const;

// Server Component (no client JavaScript).
export function SkillsSection() {
  return (
    <section id="skills" className="relative py-24 sm:py-32 border-t border-border/60">
      <Container size="lg">
        <SectionHeading
          index="03"
          eyebrow="Toolkit"
          title={
            <>
              The <span className="font-display text-accent">stack</span> behind the work.
            </>
          }
          description="Grouped by what I do with it, with where each part was put to use."
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
          {toolkit.map((group) => {
            const Icon = ICONS[group.id as keyof typeof ICONS] ?? Code2;
            const tone = TONES[group.id as keyof typeof TONES] ?? TONES.build;
            return (
              // Lens highlight on the wrapper, scroll reveal on the card: an animation's fill would
              // otherwise override the lens opacity on the same element.
              <div key={group.id} data-lens-item={lensAttr(group.lenses)} className="flex">
              <article className="reveal spotlight lens-card relative flex w-full flex-col rounded-2xl border border-border bg-surface/80 p-6 sm:p-7">
                <header className="flex items-center gap-3">
                  <span className={cn('flex h-11 w-11 items-center justify-center rounded-xl border', tone.ring)}>
                    <Icon className={cn('h-5 w-5', tone.text)} aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-xl font-semibold tracking-tight text-text-primary">{group.title}</h3>
                    <p className="text-sm text-text-muted">{group.summary}</p>
                  </div>
                </header>

                <div className="mt-6 space-y-5">
                  {group.areas.map((area) => (
                    <div key={area.name}>
                      <h4 className="mb-2 font-mono text-[11px] uppercase tracking-[0.18em] text-text-subtle">{area.name}</h4>
                      <ul className="flex flex-wrap gap-1.5">
                        {area.items.map((item) => (
                          <li
                            key={item}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface-elevated/60 px-2.5 py-1 text-[13px] text-text-primary"
                          >
                            <span className={cn('h-1.5 w-1.5 rounded-full', tone.dot)} aria-hidden="true" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <footer className="mt-auto pt-6">
                  <div className="border-t border-border/70 pt-4">
                    <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.18em] text-text-subtle">Used at</p>
                    <p className="text-sm text-text-muted leading-relaxed">{group.provenIn.join(' · ')}</p>
                  </div>
                </footer>
              </article>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
