'use client';

import * as React from 'react';
import { ArrowDown, Github, Linkedin, Mail } from 'lucide-react';
import { profileData } from '@/data/profile';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { MotionWrapper } from '@/components/motion/MotionWrapper';
import { ParticleCanvas } from '@/components/ui/ParticleCanvas';
import { HeroCharacterCard } from '@/components/ui/HeroCharacterCard';
import { InteractiveTerminal } from '@/components/ui/InteractiveTerminal';

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col justify-center items-center pt-28 pb-16 px-4 sm:px-6 overflow-hidden bg-grid-pattern"
    >
      {/* Interactive Particle Constellation Canvas */}
      <ParticleCanvas />

      {/* Ambient background glow (CSS only, zero GPU lag) */}
      <div
        className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[42rem] h-[42rem] rounded-full bg-primary/10 blur-[140px] dark:bg-primary/15"
        aria-hidden="true"
      />

      <Container size="full" className="relative z-10">
        {/* Responsive Grid: Single centered column on mobile/tablet, 2-column interactive split on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Headline, Bio, CTAs, and Desktop Terminal */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left w-full max-w-2xl mx-auto lg:mx-0">
            {/* Status Badge */}
            <MotionWrapper delay={50} direction="down">
              <div className="inline-block mb-5">
                <Badge variant="status" ping className="py-1.5 px-4 text-xs sm:text-sm">
                  {profileData.tagline}
                </Badge>
              </div>
            </MotionWrapper>

            {/* Headline */}
            <MotionWrapper delay={150}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-5 text-text-primary">
                Hi, I&apos;m{' '}
                <span className="relative inline-block text-primary">
                  {profileData.name}
                  <span
                    className="absolute -bottom-1 left-0 right-0 h-1 bg-primary/30 rounded-full"
                    aria-hidden="true"
                  />
                </span>
              </h1>
            </MotionWrapper>

            {/* Bio Subtitle */}
            <MotionWrapper delay={250}>
              <p className="text-base sm:text-lg text-text-muted mb-8 max-w-xl leading-relaxed">
                {profileData.heroBio}
              </p>
            </MotionWrapper>

            {/* CTAs & Socials */}
            <MotionWrapper delay={350} className="w-full">
              <div className="flex flex-col sm:flex-row gap-3.5 justify-center lg:justify-start items-center mb-8 w-full sm:w-auto">
                <a
                  href="#contact"
                  className="w-full sm:w-auto inline-flex items-center justify-center min-h-[46px] px-7 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold shadow-sm hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/25 transition-all duration-200 active:scale-[0.98]"
                >
                  Get in touch
                </a>
                <a
                  href="#about"
                  className="w-full sm:w-auto inline-flex items-center justify-center min-h-[46px] px-7 py-2.5 rounded-lg bg-surface border border-border text-text-primary font-semibold hover:border-primary/50 hover:bg-surface-elevated transition-all duration-200 active:scale-[0.98]"
                >
                  My Journey
                </a>

                {/* Social Icons */}
                <div className="flex items-center gap-2.5 mt-2 sm:mt-0 sm:ml-2">
                  <a
                    href={profileData.contact.socials.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub Profile"
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface text-text-primary hover:border-primary/50 hover:text-primary transition-all duration-200"
                  >
                    <Github className="h-4 w-4" />
                  </a>
                  <a
                    href={profileData.contact.socials.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn Profile"
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface text-text-primary hover:border-primary/50 hover:text-primary transition-all duration-200"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                  <a
                    href={`mailto:${profileData.contact.email}`}
                    aria-label="Email Contact"
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface text-text-primary hover:border-primary/50 hover:text-primary transition-all duration-200"
                  >
                    <Mail className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </MotionWrapper>

            {/* Interactive CLI Terminal: Dedicated to Desktop (avoids mobile touchscreen keyboard popups) */}
            <MotionWrapper delay={450} className="w-full max-w-xl hidden lg:block">
              <InteractiveTerminal />
            </MotionWrapper>
          </div>

          {/* Right Column: 3D Holographic Character Showcase Card (Desktop only - preserves 3D mouse parallax) */}
          <div className="lg:col-span-5 hidden lg:flex justify-center">
            <MotionWrapper delay={300} direction="right" className="w-full">
              <HeroCharacterCard />
            </MotionWrapper>
          </div>
        </div>
      </Container>

      {/* Scroll Down Indicator */}
      <div className="mt-12 sm:mt-16 animate-bounce z-10">
        <a
          href="#about"
          aria-label="Scroll down to About section"
          className="inline-flex flex-col items-center gap-1.5 text-xs font-mono text-text-subtle hover:text-primary transition-colors cursor-pointer"
        >
          <span>Scroll down</span>
          <ArrowDown className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
}
