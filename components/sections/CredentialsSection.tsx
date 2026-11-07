import * as React from 'react';
import Image from 'next/image';
import { ArrowUpRight, Award, Calendar, GraduationCap, MapPin } from 'lucide-react';
import { educationExperiences, type EducationItem } from '@/data/career';
import { certificationsData } from '@/data/certifications';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { DetailTrigger, type DetailContent } from '@/components/ui/DetailTrigger';
import { CertificateTrigger } from '@/components/ui/CertificateTrigger';

function educationDetail(edu: EducationItem): DetailContent {
  return {
    title: edu.degree,
    subtitle: edu.institution,
    badge: edu.id === 'seattle-university' ? 'Graduate Degree' : 'Undergraduate Degree',
    badgeVariant: 'accent',
    status: edu.status,
    period: edu.period,
    location: edu.location,
    bullets: edu.modalHighlights || edu.researchHighlights.slice(0, 3),
    tags: edu.coursework.slice(0, 4),
    tagsLabel: 'Core Coursework & Specialization',
  };
}

// Server Component: education and certifications together, sized below experience on purpose.
export function CredentialsSection() {
  return (
    <section id="credentials" className="relative py-24 sm:py-32 border-t border-border/60">
      <Container size="lg">
        <SectionHeading
          index="05"
          eyebrow="Education & credentials"
          title={
            <>
              Always <span className="font-display text-accent">learning</span>.
            </>
          }
        />

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {educationExperiences.map((edu) => (
            <li key={edu.id} className="reveal">
              <DetailTrigger
                detail={educationDetail(edu)}
                className="spotlight group relative flex h-full cursor-pointer flex-col rounded-2xl border border-border bg-surface/80 p-6 sm:p-7 transition-colors hover:border-accent/40"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-accent/30 bg-accent/10">
                    <GraduationCap className="h-5 w-5 text-accent" aria-hidden="true" />
                  </span>
                  <span
                    className={
                      edu.status === 'In Progress'
                        ? 'rounded-full bg-primary/10 px-2.5 py-0.5 font-mono text-[11px] text-primary'
                        : 'rounded-full bg-surface-elevated px-2.5 py-0.5 font-mono text-[11px] text-text-subtle'
                    }
                  >
                    {edu.status === 'In Progress' ? 'In progress' : 'Completed'}
                  </span>
                </div>
                <h3 className="mt-4 text-lg sm:text-xl font-semibold tracking-tight text-text-primary group-hover:text-accent transition-colors">
                  {edu.degree}
                </h3>
                <p className="mt-1 font-medium text-text-primary/90">{edu.institution}</p>
                <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs text-text-subtle">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3 w-3" aria-hidden="true" />
                    {edu.period}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3 w-3" aria-hidden="true" />
                    {edu.location}
                  </span>
                </p>
                <div className="mt-auto pt-5 flex items-end justify-between gap-3">
                  <ul className="flex flex-wrap gap-1.5" aria-label="Coursework">
                    {edu.coursework.slice(0, 3).map((c) => (
                      <li key={c} className="rounded-md border border-border bg-surface-elevated/60 px-2 py-0.5 font-mono text-[11px] text-text-subtle">
                        {c}
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    aria-label={`View details: ${edu.degree}, ${edu.institution}`}
                    className="shrink-0 inline-flex items-center gap-1 min-h-8 rounded-full px-3 text-xs font-semibold text-accent hover:bg-accent/10 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    Details
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              </DetailTrigger>
            </li>
          ))}
        </ul>

        <h3 className="mt-14 mb-5 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-text-subtle">
          <Award className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
          Certifications
        </h3>
        <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {certificationsData.map((cert) => (
            <li key={cert.id} className="reveal">
              <CertificateTrigger
                certification={cert}
                className="spotlight group relative flex h-full cursor-pointer items-center gap-4 rounded-2xl border border-border bg-surface/80 p-4 transition-colors hover:border-primary/40"
              >
                <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border border-border bg-white">
                  <Image src={cert.imagePreviewUrl} alt="" fill sizes="80px" className="object-cover object-top" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold leading-snug text-text-primary group-hover:text-primary transition-colors line-clamp-2">
                    {cert.title}
                  </p>
                  <p className="mt-0.5 font-mono text-[11px] text-text-subtle">
                    {cert.issuer} · {cert.issueDate.split(' ')[1] ?? cert.issueDate}
                  </p>
                  <button
                    type="button"
                    aria-label={`View certificate: ${cert.title}`}
                    className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-primary cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                  >
                    View certificate
                    <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                  </button>
                </div>
              </CertificateTrigger>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
