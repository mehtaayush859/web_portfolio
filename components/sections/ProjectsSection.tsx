'use client';

import * as React from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Sparkles, ArrowUpRight, Github } from 'lucide-react';
import { projectsData, githubProfileUrl, type Project } from '@/data/projects';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Heading';
import { ProjectCard } from '@/components/ui/ProjectCard';
import { MotionWrapper } from '@/components/motion/MotionWrapper';

const DetailModal = dynamic(
  () => import('@/components/ui/DetailModal').then((mod) => mod.DetailModal),
  { ssr: false }
);

export function ProjectsSection() {
  const [selectedProject, setSelectedProject] = React.useState<Project | null>(null);
  return (
    <section id="projects" className="py-20 sm:py-28 border-t border-border/60 bg-surface/30">
      <Container size="lg">
        {/* Section Header */}
        <MotionWrapper className="text-center mb-10 sm:mb-12">
          <span className="text-xs font-mono font-medium text-primary uppercase tracking-widest mb-3 block">
            Featured Repositories &amp; Systems
          </span>
          <Heading as="h2" size="xl">
            Featured Projects
          </Heading>
          <p className="mt-3 text-sm sm:text-base text-text-muted max-w-2xl mx-auto font-mono">
            A curated showcase of engineering builds across full-stack applications, cloud architecture, and security tooling.
          </p>
        </MotionWrapper>

        {/* 3D Mascot Companion Dialogue Banner (Optimized: hidden on mobile for instant card access, solid background on desktop) */}
        <div className="hidden sm:block mb-10">
          <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-primary/30 shadow-md flex flex-col sm:flex-row items-center gap-4">
            <div className="shrink-0 relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl border border-primary/30 bg-primary/10 flex items-center justify-center overflow-hidden">
              <div className="relative w-full h-full">
                <Image
                  src="/dev-character-transparent.png"
                  alt="3D Mascot Companion"
                  fill
                  sizes="64px"
                  className="object-contain p-1 drop-shadow-md"
                />
              </div>
            </div>

            <div className="flex-1 text-center sm:text-left min-w-0">
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-[11px] font-mono font-bold text-primary mb-0.5">
                <Sparkles className="h-3.5 w-3.5" />
                <span>AYUSH.AI</span>
              </div>
              <p className="text-xs sm:text-sm text-text-primary leading-relaxed font-sans">
                &ldquo;Here are selected flagship builds from my GitHub showcasing production-grade software engineering, cloud architecture, and security systems.&rdquo;
              </p>
            </div>

            <a
              href={githubProfileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-surface-elevated border border-border/80 hover:border-primary text-xs font-mono text-text-primary transition-colors cursor-pointer"
            >
              <Github className="h-3.5 w-3.5 text-primary" />
              <span>@mehtaayush859</span>
              <ArrowUpRight className="h-3 w-3 text-text-subtle" />
            </a>
          </div>
        </div>

        {/* Mobile Swipe Gesture Hint Bar */}
        <div className="flex md:hidden items-center justify-center px-1 mb-4 text-xs font-mono text-text-subtle">
          <span className="flex items-center gap-1.5 text-primary font-semibold">
            <span>← Swipe →</span>
          </span>
        </div>

        {/* 4-Card Responsive Container: Native Touch-Swipe Snap on mobile, 2-Col Grid on tablet/desktop */}
        <div className="flex md:grid md:grid-cols-2 gap-4 sm:gap-8 overflow-x-auto md:overflow-visible snap-x snap-mandatory swipe-track no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 pt-2 pb-4 mb-10 md:mb-14 items-stretch scroll-pl-4 scroll-pr-4">
          {projectsData.map((project, index) => (
            <div
              key={project.id}
              className="w-[86vw] max-w-[340px] shrink-0 snap-start md:w-auto md:max-w-none md:shrink flex flex-col"
            >
              <MotionWrapper delay={100 * index} direction="up" className="h-full">
                <ProjectCard
                  {...project}
                  onExplore={() => setSelectedProject(project)}
                />
              </MotionWrapper>
            </div>
          ))}
        </div>

        {/* Bottom GitHub Callout: Explicitly Highlights Breadth of Work */}
        <MotionWrapper delay={200} className="text-center">
          <div className="inline-flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:px-6 rounded-2xl bg-surface-elevated/70 border border-border/80 shadow-md max-w-2xl mx-auto w-full">
            <div className="text-center sm:text-left font-mono">
              <span className="text-xs font-bold text-text-primary block">
                Explore More on GitHub
              </span>
              <span className="text-[11px] text-text-subtle">
                Browse 25+ repositories spanning microservices, automation scripts, and security tooling.
              </span>
            </div>

            <a
              href={githubProfileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-black hover:bg-primary-hover font-mono text-xs font-bold transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer shrink-0"
            >
              <Github className="h-4 w-4" />
              <span>View All Repositories</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </MotionWrapper>
      </Container>

      {/* Project Detail Pop-up Modal */}
      {selectedProject && (
        <DetailModal
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
          title={selectedProject.title}
          subtitle={selectedProject.category}
          bullets={selectedProject.modalHighlights}
          tags={selectedProject.tags.slice(0, 4)}
          tagsLabel="Technologies & Frameworks"
        />
      )}
    </section>
  );
}
