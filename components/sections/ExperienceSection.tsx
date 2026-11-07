import * as React from 'react';
import { ArrowUpRight, Calendar, MapPin } from 'lucide-react';
import { careerExperiences, type CareerItem } from '@/data/career';
import { lensAttr } from '@/data/lens';
import { Container } from '@/components/ui/Container';
import { SectionHeading, LensBadges } from '@/components/ui/SectionHeading';
import { DetailTrigger, type DetailContent } from '@/components/ui/DetailTrigger';
import { CountUp } from '@/components/ui/CountUp';
import { cn } from '@/lib/utils';

function careerDetail(item: CareerItem): DetailContent {
  return {
    title: item.role,
    subtitle: item.organization,
    status: item.employmentType,
    period: item.period,
    location: item.location,
    metrics: item.impactMetrics,
    bullets: item.modalBullets || item.bullets.slice(0, 3),
    tags: item.tech.slice(0, 4),
    tagsLabel: 'Technologies & Tools',
  };
}

/** True for metrics that are a number (e.g. "10K+", "-35%"), not a label such as "OWASP". */
const isNumeric = (v: string) => /\d/.test(v);

// Server Component: the only client code is DetailTrigger (click → details modal).
export function ExperienceSection() {
  return (
    <section id="experience" className="relative py-24 sm:py-32 border-t border-border/60">
      <Container size="lg">
        <SectionHeading
          index="01"
          eyebrow="Experience"
          title={
            <>
              Shipped in production. <span className="font-display text-primary">Tested</span> like an attacker.
            </>
          }
          description="Six roles across software and security engineering, from enterprise backends to SOC operations and AI-agent security."
        />

        <ol className="relative space-y-5 sm:space-y-6 md:pl-10">
          {/* Timeline spine (desktop): faint track + a bright line that fills as you scroll (CSS only) */}
          <span className="hidden md:block absolute left-[11px] top-3 bottom-3 w-px bg-border" aria-hidden="true" />
          <span
            className="timeline-fill hidden md:block absolute left-[11px] top-3 bottom-3 w-px bg-gradient-to-b from-accent via-primary to-violet"
            aria-hidden="true"
          />
          {careerExperiences.map((item) => {
            const current = item.period.includes('Present');
            const metrics = item.impactMetrics.filter((m) => isNumeric(m.value));
            return (
              <li key={item.id} data-lens-item={lensAttr(item.lenses)} className="relative">
                <span
                  className={cn(
                    'hidden md:block absolute -left-[37px] top-7 h-3.5 w-3.5 rounded-full border-2 border-background',
                    item.lenses.includes('secure') ? 'bg-primary' : 'bg-accent',
                    current && 'ring-4 ring-primary/25'
                  )}
                  aria-hidden="true"
                />
                <DetailTrigger
                  detail={careerDetail(item)}
                  className="reveal spotlight lens-card group relative cursor-pointer rounded-2xl border border-border bg-surface/80 p-5 sm:p-7 transition-colors hover:border-accent/40"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start gap-5 lg:gap-8">
                    {/* Who / when */}
                    <div className="lg:w-[38%] shrink-0">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <LensBadges lenses={item.lenses} />
                        {current && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-primary">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary md:animate-pulse" aria-hidden="true" />
                            Now
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg sm:text-xl font-semibold tracking-tight text-text-primary group-hover:text-accent transition-colors">
                        {item.role}
                      </h3>
                      {item.highlight ? (
                        <p className="mt-1 flex flex-wrap items-center gap-2">
                          <span className="font-bold text-amber-700 dark:text-amber-400">{item.organization}</span>
                          <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-amber-700 dark:text-amber-400">
                            {item.highlight}
                          </span>
                        </p>
                      ) : (
                        <p className="mt-1 font-medium text-text-primary/90">{item.organization}</p>
                      )}
                      <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-text-subtle">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3 w-3" aria-hidden="true" />
                          {item.period}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3 w-3" aria-hidden="true" />
                          {item.location}
                        </span>
                      </p>
                    </div>

                    {/* What / impact */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm sm:text-base text-text-muted leading-relaxed">{item.summary}</p>

                      {metrics.length > 0 && (
                        <dl className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
                          {metrics.map((m) => (
                            <div key={m.label} className="rounded-xl border border-border bg-surface-elevated/60 px-3 py-2.5">
                              <dt className="sr-only">{m.label}</dt>
                              <dd>
                                <CountUp
                                  value={m.value}
                                  className={cn('block text-lg sm:text-xl font-semibold tracking-tight', item.lenses.includes('secure') ? 'text-primary' : 'text-accent')}
                                />
                                <span className="block text-[11px] sm:text-xs text-text-subtle leading-tight" aria-hidden="true">
                                  {m.label}
                                </span>
                              </dd>
                            </div>
                          ))}
                        </dl>
                      )}

                      <div className="mt-4 flex items-center justify-between gap-3">
                        <ul className="flex flex-wrap gap-1.5" aria-label="Technologies">
                          {item.tech.slice(0, 4).map((t) => (
                            <li key={t} className="rounded-md border border-border bg-surface-elevated/60 px-2 py-0.5 font-mono text-[11px] text-text-subtle">
                              {t}
                            </li>
                          ))}
                        </ul>
                        <button
                          type="button"
                          aria-label={`View details: ${item.role} at ${item.organization}`}
                          className="shrink-0 inline-flex items-center gap-1 min-h-8 rounded-full px-3 text-xs font-semibold text-accent hover:bg-accent/10 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                        >
                          Details
                          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                </DetailTrigger>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
