'use client';

import * as React from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import {
  Code2,
  Layers,
  Cloud,
  ShieldCheck,
  Database,
  Layout,
  Sparkles,
} from 'lucide-react';
import { skillDomains, type SkillDomain } from '@/data/skills';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Heading';
import { Card } from '@/components/ui/Card';
import { MotionWrapper } from '@/components/motion/MotionWrapper';
import { cn } from '@/lib/utils';

export function SkillsSection() {
  const getDomainIcon = (category: SkillDomain['category']) => {
    switch (category) {
      case 'languages':
        return <Code2 className="h-5 w-5 text-emerald-400" />;
      case 'backend':
        return <Layers className="h-5 w-5 text-violet-400" />;
      case 'cloud':
        return <Cloud className="h-5 w-5 text-indigo-400" />;
      case 'security':
        return <ShieldCheck className="h-5 w-5 text-cyan-400" />;
      case 'database':
        return <Database className="h-5 w-5 text-amber-400" />;
      case 'frontend':
        return <Layout className="h-5 w-5 text-teal-400" />;
    }
  };

  const getAccentStyles = (accent: SkillDomain['accent']) => {
    switch (accent) {
      case 'emerald':
        return {
          border: 'border-emerald-500/25 hover:border-emerald-400/60',
          glow: 'from-emerald-500/10 via-transparent to-transparent',
          iconBg: 'bg-emerald-500/15 border-emerald-500/30',
          dot: 'bg-emerald-400',
          topLine: 'from-emerald-500/60 via-emerald-400/20 to-transparent',
        };
      case 'violet':
        return {
          border: 'border-violet-500/25 hover:border-violet-400/60',
          glow: 'from-violet-500/10 via-transparent to-transparent',
          iconBg: 'bg-violet-500/15 border-violet-500/30',
          dot: 'bg-violet-400',
          topLine: 'from-violet-500/60 via-violet-400/20 to-transparent',
        };
      case 'indigo':
        return {
          border: 'border-indigo-500/25 hover:border-indigo-400/60',
          glow: 'from-indigo-500/10 via-transparent to-transparent',
          iconBg: 'bg-indigo-500/15 border-indigo-500/30',
          dot: 'bg-indigo-400',
          topLine: 'from-indigo-500/60 via-indigo-400/20 to-transparent',
        };
      case 'cyan':
        return {
          border: 'border-cyan-500/25 hover:border-cyan-400/60',
          glow: 'from-cyan-500/10 via-transparent to-transparent',
          iconBg: 'bg-cyan-500/15 border-cyan-500/30',
          dot: 'bg-cyan-400',
          topLine: 'from-cyan-500/60 via-cyan-400/20 to-transparent',
        };
      case 'amber':
        return {
          border: 'border-amber-500/25 hover:border-amber-400/60',
          glow: 'from-amber-500/10 via-transparent to-transparent',
          iconBg: 'bg-amber-500/15 border-amber-500/30',
          dot: 'bg-amber-400',
          topLine: 'from-amber-500/60 via-amber-400/20 to-transparent',
        };
      case 'teal':
        return {
          border: 'border-teal-500/25 hover:border-teal-400/60',
          glow: 'from-teal-500/10 via-transparent to-transparent',
          iconBg: 'bg-teal-500/15 border-teal-500/30',
          dot: 'bg-teal-400',
          topLine: 'from-teal-500/60 via-teal-400/20 to-transparent',
        };
    }
  };

  return (
    <section id="skills" className="py-20 sm:py-28 border-t border-border/60 bg-surface/30">
      <Container size="lg">
        {/* Section Header */}
        <MotionWrapper className="text-center mb-10 sm:mb-12">
          <span className="text-xs font-mono font-medium text-primary uppercase tracking-widest mb-3 block">
            Technical Proficiency
          </span>
          <Heading as="h2" size="xl">
            Skills &amp; Capabilities
          </Heading>
          <p className="mt-3 text-sm sm:text-base text-text-muted max-w-2xl mx-auto font-mono">
            A balanced matrix of technical capabilities across programming languages, backend architectures, cloud infrastructure, and security engineering.
          </p>
        </MotionWrapper>

        {/* 3D Mascot Companion Dialogue Banner (Optimized: hidden on mobile for instant card access, solid background on desktop) */}
        <div className="hidden sm:block mb-10">
          <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-primary/30 shadow-md flex flex-col sm:flex-row items-center gap-4">
            <div className="shrink-0 relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl border border-primary/30 bg-primary/10 flex items-center justify-center overflow-hidden">
              <div className="relative w-full h-full">
                <Image
                  src="/dev-character-transparent.png"
                  alt="3D Companion Guide"
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
                &ldquo;Ayush&apos;s capabilities are structured across 6 core domains: programming languages, backend systems, cloud infrastructure, cybersecurity, storage, and frontend development.&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* Mobile Swipe Gesture Hint Bar */}
        <div className="flex lg:hidden items-center justify-center px-1 mb-4 text-xs font-mono text-text-subtle">
          <span className="flex items-center gap-1.5 text-primary font-semibold">
            <span>← Swipe →</span>
          </span>
        </div>

        {/* 6 Balanced, Spacious Domain Cards (Touch-Swipe on mobile, 2 Columns on desktop) */}
        <div className="flex lg:grid lg:grid-cols-2 gap-4 lg:gap-6 overflow-x-auto lg:overflow-visible snap-x snap-mandatory no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 pt-2 pb-4 items-stretch">
          {skillDomains.map((domain, index) => {
            const styles = getAccentStyles(domain.accent);
            return (
              <div
                key={domain.id}
                className="w-[86vw] max-w-[340px] shrink-0 snap-center lg:w-auto lg:max-w-none lg:shrink flex flex-col"
              >
                <MotionWrapper delay={60 * index} direction="up" className="h-full">
                  <Card
                    interactive
                    className={cn(
                      'p-5 sm:p-6 rounded-2xl bg-surface/90 border transition-all duration-300 relative overflow-hidden group shadow-md hover:shadow-xl flex flex-col justify-between h-full select-none',
                      styles.border
                    )}
                  >
                    {/* Decorative Top Accent Line */}
                    <div
                      className={cn('absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r', styles.topLine)}
                      aria-hidden="true"
                    />

                    {/* Top-Right Ambient Glow */}
                    <div
                      className={cn(
                        'absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl pointer-events-none bg-gradient-to-b opacity-40 group-hover:opacity-90 transition-opacity',
                        styles.glow
                      )}
                      aria-hidden="true"
                    />

                    <div>
                      {/* Card Header: Balanced, Simple, Aligned */}
                      <div className="flex items-center gap-3 mb-4 sm:mb-5 relative z-10">
                        <div
                          className={cn(
                            'p-2.5 rounded-xl border flex items-center justify-center shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-105',
                            styles.iconBg
                          )}
                        >
                          {getDomainIcon(domain.category)}
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-text-primary tracking-tight">
                          {domain.title}
                        </h3>
                      </div>

                      {/* Skills Grid: Generous Cells with Zero Truncation */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5 relative z-10">
                        {domain.skills.map((skill) => (
                          <div
                            key={skill}
                            className="flex items-center gap-2.5 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl bg-surface-elevated/70 border border-border/80 text-xs sm:text-sm font-mono text-text-muted hover:text-text-primary hover:border-primary/50 hover:bg-surface-elevated transition-all"
                          >
                            <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', styles.dot)} />
                            <span className="font-medium whitespace-normal sm:whitespace-nowrap">{skill}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                </MotionWrapper>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
