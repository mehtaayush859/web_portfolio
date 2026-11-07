import * as React from 'react';
import { ArrowUpRight, Github } from 'lucide-react';
import { projectsData, githubProfileUrl } from '@/data/projects';
import { lensAttr } from '@/data/lens';
import { Container } from '@/components/ui/Container';
import { SectionHeading, LensBadges } from '@/components/ui/SectionHeading';
import { DetailTrigger } from '@/components/ui/DetailTrigger';
import { ArchitectureStrip } from '@/components/ui/ArchitectureStrip';

// Server Component: project cards are HTML; DetailTrigger opens the case-study modal.
export function ProjectsSection() {
  return (
    <section id="projects" className="relative py-24 sm:py-32 border-t border-border/60 bg-surface/30">
      <Container size="lg">
        <SectionHeading
          index="02"
          eyebrow="Projects"
          title={
            <>
              Things I&apos;ve <span className="text-accent">built</span>, and things built to{' '}
              <span className="font-display text-primary">break in</span>.
            </>
          }
          description="Selected open-source work across full-stack products, security tooling and distributed backends."
          aside={
            <a
              href={githubProfileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 min-h-11 rounded-full border border-border bg-surface px-5 text-sm font-medium text-text-primary hover:border-accent/50 transition-colors"
            >
              <Github className="h-4 w-4" aria-hidden="true" />
              All repositories
              <ArrowUpRight className="h-3.5 w-3.5 text-text-subtle" aria-hidden="true" />
            </a>
          }
        />

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {projectsData.map((project, i) => {
            const tone = project.lenses[0];
            return (
              <li key={project.id} data-lens-item={lensAttr(project.lenses)}>
                <DetailTrigger
                  detail={{
                    title: project.title,
                    subtitle: project.category,
                    summary: project.problem,
                    bullets: project.modalHighlights,
                    tags: project.tags.slice(0, 5),
                    tagsLabel: 'Technologies & Frameworks',
                    actionLink: { url: project.github, label: 'View source on GitHub', isExternal: true, icon: 'github' },
                  }}
                  className="reveal spotlight lens-card hairline-top group relative flex h-full cursor-pointer flex-col rounded-2xl border border-border bg-surface/90 p-6 sm:p-7 transition-colors hover:border-accent/40"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-xs text-text-subtle">
                      {String(i + 1).padStart(2, '0')} · {project.category}
                    </span>
                    <LensBadges lenses={project.lenses} />
                  </div>

                  <h3 className="mt-4 text-xl sm:text-2xl font-semibold tracking-tight text-text-primary group-hover:text-accent transition-colors">
                    {project.title.split(' — ')[0]}
                    <span className="block mt-1 text-base sm:text-lg font-normal text-text-muted">
                      {project.title.split(' — ')[1]}
                    </span>
                  </h3>

                  <p className="mt-4 text-sm text-text-muted leading-relaxed">
                    <span className="font-semibold text-text-primary">Problem. </span>
                    {project.problem}
                  </p>

                  <div className="mt-5 rounded-xl border border-dashed border-border bg-background/40 p-3">
                    <ArchitectureStrip nodes={project.pipeline} tone={tone} />
                  </div>

                  <ul className="mt-5 space-y-2 text-sm text-text-muted">
                    {project.modalHighlights?.slice(0, 2).map((h) => (
                      <li key={h} className="flex gap-2.5">
                        <span className={tone === 'build' ? 'text-accent' : 'text-primary'} aria-hidden="true">
                          ▹
                        </span>
                        <span className="leading-relaxed">{h}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-6 flex items-center justify-between gap-3">
                    <ul className="flex flex-wrap gap-1.5" aria-label="Technologies">
                      {project.tags.slice(0, 3).map((t) => (
                        <li key={t} className="rounded-md border border-border bg-surface-elevated/60 px-2 py-0.5 font-mono text-[11px] text-text-subtle">
                          {t}
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        aria-label={`Case study: ${project.title}`}
                        className="inline-flex items-center gap-1 min-h-9 rounded-full px-3 text-xs font-semibold text-accent hover:bg-accent/10 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                      >
                        Case study
                        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`View ${project.title} repository on GitHub`}
                        className="flex h-9 w-9 items-center justify-center rounded-full text-text-muted hover:text-text-primary hover:bg-surface-elevated transition-colors"
                      >
                        <Github className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </DetailTrigger>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
