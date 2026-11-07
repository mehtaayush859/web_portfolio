import Image, { getImageProps } from 'next/image';
import * as React from 'react';
import { ArrowDown, ArrowRight, FileText, Github, Linkedin, Mail, MapPin, GraduationCap } from 'lucide-react';
import { profileData } from '@/data/profile';
import { careerExperiences, educationExperiences } from '@/data/career';

// Organisations flagged with `highlight` in the data (e.g. Amazon) get the same amber accent everywhere.
const highlighted = new Set(careerExperiences.filter((c) => c.highlight).map((c) => c.organization));
import { Container } from '@/components/ui/Container';
import { ParticleCanvas } from '@/components/ui/ParticleCanvas';
import { LensSwitch } from '@/components/ui/LensSwitch';
import { PortraitTilt } from '@/components/ui/PortraitCard';
import { CountUp } from '@/components/ui/CountUp';
import { cn } from '@/lib/utils';

// Every organisation from the experience and education data, in the order they appear there.
const organisations = [
  ...new Set([...careerExperiences.map((c) => c.organization), ...educationExperiences.map((e) => e.institution)]),
];

const PORTRAIT_SRC = '/images/ayush-portrait.jpg';
const PORTRAIT_SIZES = '(min-width: 1024px) 400px, (min-width: 640px) 340px, 300px';

// The portrait is the LCP element on desktop but sits below the fold on phones. So it gets a
// high-priority preload only on wide screens (media query); the <img> itself is eager (never
// lazy, which would delay an LCP image until layout) at the browser's default priority, so on
// phones it does not compete with CSS, fonts and text. Same srcSet as <Image> via getImageProps.
const portraitPreload = getImageProps({ src: PORTRAIT_SRC, alt: '', fill: true, sizes: PORTRAIT_SIZES }).props;

const SPARKLES = [
  { top: '14%', left: '8%', delay: '0s' },
  { top: '22%', left: '46%', delay: '1.1s' },
  { top: '68%', left: '4%', delay: '2.2s' },
  { top: '10%', left: '78%', delay: '0.6s' },
  { top: '58%', left: '52%', delay: '1.7s' },
  { top: '82%', left: '88%', delay: '2.6s' },
];

// Server Component. Client islands: ParticleCanvas, LensSwitch and the portrait tilt.
export function HeroSection() {
  return (
    <section id="home" className="relative overflow-hidden pt-28 sm:pt-32 pb-10 grain">
      <link
        rel="preload"
        as="image"
        media="(min-width: 1024px)"
        imageSrcSet={portraitPreload.srcSet}
        imageSizes={PORTRAIT_SIZES}
        fetchPriority="high"
      />
      {/* Background layers */}
      <div className="pointer-events-none absolute inset-0 aurora" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 bg-grid-fade" aria-hidden="true" />
      <div className="hidden md:block absolute inset-0 pointer-events-none" aria-hidden="true">
        <ParticleCanvas />
      </div>
      <div className="hidden md:block pointer-events-none absolute inset-0" aria-hidden="true">
        {SPARKLES.map((s, i) => (
          <span key={i} className="sparkle absolute text-accent/80 text-xs" style={{ top: s.top, left: s.left, animationDelay: s.delay }}>
            ✦
          </span>
        ))}
      </div>

      <Container size="full" className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Left: identity, statement, actions */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
            <p className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3.5 py-1.5 text-xs font-medium text-primary">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="md:animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              Open to Software Engineer &amp; Security Engineer roles
            </p>

            <h1 className="mt-6 text-5xl sm:text-7xl xl:text-8xl font-semibold tracking-tighter leading-[0.95] text-text-primary">
              Ayush <span className="text-gradient">Mehta</span>
            </h1>

            <p className="mt-6 max-w-2xl text-2xl sm:text-3xl font-medium tracking-tight leading-snug text-text-primary">
              <span data-lens-show="all">
                I <span className="text-accent">build</span> backend systems that scale, and{' '}
                <span className="font-display text-primary">break</span> them before attackers do.
              </span>
              <span data-lens-show="build">
                I <span className="text-accent">build</span> backend services and data pipelines that{' '}
                <span className="font-display text-accent">scale</span>.
              </span>
              <span data-lens-show="secure">
                I find and fix weaknesses <span className="font-display text-primary">before</span> attackers do.
              </span>
            </p>

            <p className="mt-5 max-w-xl text-base sm:text-lg text-text-muted leading-relaxed">{profileData.heroBio}</p>

            <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <a
                href="#experience"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-12 px-6 rounded-full bg-gradient-to-r from-accent to-primary text-white dark:text-[#04110c] font-semibold shadow-[0_10px_40px_-12px_var(--accent)] hover:brightness-110 transition-all"
              >
                See my work
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </a>
              <a
                href={profileData.resume.url}
                download={profileData.resume.filename}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-12 px-6 rounded-full border border-border bg-surface/70 text-text-primary font-semibold hover:border-accent/50 transition-colors"
              >
                <FileText className="h-4 w-4 text-accent" aria-hidden="true" />
                Resume
              </a>
              <div className="flex items-center gap-2 sm:ml-1">
                {[
                  { href: profileData.contact.socials.github, label: 'GitHub Profile', icon: Github, external: true },
                  { href: profileData.contact.socials.linkedin, label: 'LinkedIn Profile', icon: Linkedin, external: true },
                  { href: `mailto:${profileData.contact.email}`, label: 'Email Ayush', icon: Mail, external: false },
                ].map(({ href, label, icon: Icon, external }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface/70 text-text-muted hover:text-text-primary hover:border-accent/50 transition-colors"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            <div className="mt-10">
              <LensSwitch />
            </div>
          </div>

          {/* Right: portrait "access badge" */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <PortraitTilt className="relative w-full max-w-[300px] sm:max-w-[340px] lg:max-w-[400px]">
              <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-accent/25 via-primary/10 to-violet/25 blur-2xl hidden md:block" aria-hidden="true" />
              <figure className="relative rounded-[1.75rem] border border-border bg-surface/80 p-3 shadow-2xl">
                <div className="flex items-center justify-between px-2 pb-3 pt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-text-subtle">
                  <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
                    Identity verified
                  </span>
                  <span>SWE · SEC</span>
                </div>
                <div className="sheen relative aspect-[4/5] overflow-hidden rounded-[1.25rem]">
                  <Image
                    src={PORTRAIT_SRC}
                    alt="Portrait of Ayush Mehta"
                    fill
                    sizes={PORTRAIT_SIZES}
                    loading="eager"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" aria-hidden="true" />
                  <span className="scanline" aria-hidden="true" />
                  {/* HUD corner brackets */}
                  {['top-3 left-3 border-l-2 border-t-2', 'top-3 right-3 border-r-2 border-t-2', 'bottom-3 left-3 border-l-2 border-b-2', 'bottom-3 right-3 border-r-2 border-b-2'].map((c) => (
                    <span key={c} className={cn('absolute h-5 w-5 border-white/70 rounded-[3px]', c)} aria-hidden="true" />
                  ))}
                  <figcaption className="absolute bottom-4 left-5 right-5 text-white">
                    <span className="block text-lg font-semibold">{profileData.name}</span>
                    <span className="block font-mono text-[11px] text-white/80">{profileData.role}</span>
                  </figcaption>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-3">
                  <span className="flex items-center gap-2 rounded-xl bg-surface-elevated px-3 py-2 text-xs text-text-muted">
                    <MapPin className="h-3.5 w-3.5 text-accent shrink-0" aria-hidden="true" />
                    Seattle, WA
                  </span>
                  <span className="flex items-center gap-2 rounded-xl bg-surface-elevated px-3 py-2 text-xs text-text-muted">
                    <GraduationCap className="h-3.5 w-3.5 text-primary shrink-0" aria-hidden="true" />
                    M.S. CS &apos;26
                  </span>
                </div>
              </figure>
            </PortraitTilt>
          </div>
        </div>

        {/* Proof: an even mix of build and secure results */}
        <ul className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4" aria-label="Selected results">
          {profileData.heroStats.map((s) => (
            <li
              key={s.label}
              data-lens-item={s.lens}
              className="spotlight lens-card relative overflow-hidden rounded-2xl border border-border bg-surface/70 p-4 sm:p-5"
            >
              <CountUp
                value={s.value}
                className={cn('block text-3xl sm:text-4xl font-semibold tracking-tight', s.lens === 'build' ? 'text-accent' : 'text-primary')}
              />
              <span className="mt-1 block text-sm text-text-primary leading-snug">{s.label}</span>
              <span
                className={cn(
                  'mt-2 block font-mono text-[11px]',
                  highlighted.has(s.source) ? 'font-bold text-amber-700 dark:text-amber-400' : 'text-text-subtle'
                )}
              >
                {s.source}
              </span>
            </li>
          ))}
        </ul>

        {/* Where the work happened */}
        <div className="mt-12">
          <p className="mb-4 text-center font-mono text-[11px] uppercase tracking-[0.22em] text-text-subtle">
            Experience &amp; education across
          </p>
          <div className="marquee overflow-hidden">
            <ul className="marquee-track flex w-max items-center gap-10 sm:gap-14 pr-10 sm:pr-14">
              {[...organisations, ...organisations].map((org, i) => (
                <li
                  key={`${org}-${i}`}
                  aria-hidden={i >= organisations.length ? true : undefined}
                  className="whitespace-nowrap text-lg sm:text-xl font-semibold tracking-tight text-text-muted/80"
                >
                  {org}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 hidden sm:flex justify-center">
          <a
            href="#experience"
            aria-label="Scroll to experience"
            className="inline-flex flex-col items-center gap-1.5 text-xs font-mono text-text-subtle hover:text-accent transition-colors"
          >
            <span>Scroll</span>
            <ArrowDown className="h-4 w-4 md:animate-bounce" aria-hidden="true" />
          </a>
        </div>
      </Container>
    </section>
  );
}
