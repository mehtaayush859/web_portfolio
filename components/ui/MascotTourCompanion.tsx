'use client';

import * as React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, X } from 'lucide-react';

interface SectionTourData {
  id: string;
  stepNumber: number;
  sectionName: string;
  speech: string;
  nextId: string;
  nextLabel: string;
}

const tourSections: Record<string, SectionTourData> = {
  home: {
    id: 'home',
    stepNumber: 1,
    sectionName: 'STAGE 01: WELCOME & OVERVIEW',
    speech: "Hey! I'm Ayush's 3D companion. Take a guided walk through his developer journey, projects, and skills!",
    nextId: 'about',
    nextLabel: 'Next: My Journey',
  },
  about: {
    id: 'about',
    stepNumber: 2,
    sectionName: 'STAGE 02: DEVELOPER JOURNEY',
    speech: "Here is Ayush's story — M.S. CS at Seattle University, high-concurrency systems, and cybersecurity focus.",
    nextId: 'projects',
    nextLabel: 'Next: Featured Projects',
  },
  projects: {
    id: 'projects',
    stepNumber: 3,
    sectionName: 'STAGE 03: FEATURED PROJECTS',
    speech: "Explore Ayush's featured engineering builds across software, cloud systems, and security tooling!",
    nextId: 'skills',
    nextLabel: 'Next: Technical Skills',
  },
  skills: {
    id: 'skills',
    stepNumber: 4,
    sectionName: 'STAGE 04: TECHNICAL SKILLS',
    speech: "Organized across 6 core engineering domains: backend architectures, cloud infrastructure, and cybersecurity defense!",
    nextId: 'contact',
    nextLabel: 'Next: Get In Touch',
  },
  contact: {
    id: 'contact',
    stepNumber: 5,
    sectionName: 'STAGE 05: GET IN TOUCH',
    speech: "Ayush is actively open to Software Engineer & Security Engineer opportunities. Send him a dispatch!",
    nextId: 'home',
    nextLabel: 'Back to Top ↑',
  },
};

export function MascotTourCompanion() {
  const [activeSection, setActiveSection] = React.useState<string>('home');
  // Starts minimized by default: wakes up only when the user taps to explore
  const [isMinimized, setIsMinimized] = React.useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);

  // Listen for modal state to disappear when a modal dialog is open
  React.useEffect(() => {
    const handleModalState = (e: Event) => {
      const customEvent = e as CustomEvent<{ isOpen: boolean }>;
      setIsModalOpen(!!customEvent.detail?.isOpen);
    };

    window.addEventListener('portfolio-modal-state', handleModalState);
    return () => window.removeEventListener('portfolio-modal-state', handleModalState);
  }, []);

  // Robust viewport-based active section detection (only active when guide is expanded)
  React.useEffect(() => {
    if (isMinimized) return;

    const sectionIds = ['home', 'about', 'projects', 'skills', 'contact'];
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (window.scrollY < 300) {
            setActiveSection((prev) => (prev !== 'home' ? 'home' : prev));
            ticking = false;
            return;
          }

          const viewportMiddle = window.innerHeight * 0.45;
          let matchedSection = 'home';

          for (const id of sectionIds) {
            const el = document.getElementById(id);
            if (el) {
              const rect = el.getBoundingClientRect();
              if (rect.top <= viewportMiddle && rect.bottom >= viewportMiddle) {
                matchedSection = id;
                break;
              }
            }
          }

          setActiveSection((prev) => (prev !== matchedSection ? matchedSection : prev));
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMinimized]);

  const currentTour = tourSections[activeSection] || tourSections.home;

  const navigateToNext = (targetId: string) => {
    if (targetId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.getElementById(targetId);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  };

  if (isModalOpen) return null;

  return (
    <aside aria-label="Interactive Tour Companion" className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 select-none">
      <AnimatePresence mode="wait">
        {isMinimized ? (
          /* Minimized Floating Mascot Badge */
          <motion.button
            key="minimized"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={() => setIsMinimized(false)}
            aria-label="Wake up 3D Tour Companion Guide"
            className="group relative flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-surface/95 border border-primary/40 backdrop-blur-xl shadow-xl hover:border-primary hover:shadow-primary/20 transition-all cursor-pointer"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
            </span>
            <div className="relative w-7 h-7 rounded-full overflow-hidden bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0">
              <Image
                src="/dev-character-transparent.png"
                alt="3D Companion Avatar"
                width={28}
                height={28}
                className="object-contain"
              />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[11px] font-mono font-bold text-text-primary group-hover:text-primary transition-colors leading-tight">
                Tour Guide
              </span>
              <span className="text-[9px] font-mono text-text-subtle leading-tight">
                Tap to wake up
              </span>
            </div>
          </motion.button>
        ) : (
          /* Expanded Interactive Narrative Bubble */
          <motion.div
            key="expanded"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-[290px] sm:w-[330px] max-w-[calc(100vw-2rem)] rounded-2xl bg-surface/95 border border-primary/30 backdrop-blur-xl shadow-2xl p-4 text-left font-mono relative overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-border/80 text-[10px] text-text-subtle">
              <div className="flex items-center gap-1.5 text-primary font-semibold">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                </span>
                <span>{currentTour.sectionName}</span>
              </div>

              <button
                onClick={() => setIsMinimized(true)}
                title="Minimize Tour Guide"
                aria-label="Minimize Tour Guide"
                className="p-1 rounded text-text-subtle hover:text-text-primary transition-colors cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Mascot + Speech Message */}
            <div className="flex items-start gap-3 my-2">
              <div className="shrink-0 relative w-12 h-12 rounded-xl bg-gradient-to-tr from-primary/20 via-accent/15 to-transparent border border-primary/30 flex items-center justify-center overflow-hidden">
                <motion.div
                  animate={{ y: [-2, 2, -2] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative w-full h-full"
                >
                  <Image
                    src="/dev-character-transparent.png"
                    alt="3D Companion Avatar"
                    fill
                    sizes="48px"
                    className="object-contain p-0.5"
                  />
                </motion.div>
              </div>

              <div className="flex-1">
                <p className="text-xs font-sans text-text-primary leading-snug">
                  &ldquo;{currentTour.speech}&rdquo;
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-3 pt-2 border-t border-border/70 flex items-center justify-between gap-2">
              <span className="text-[10px] text-text-subtle">
                Step {currentTour.stepNumber} of 5
              </span>

              <button
                type="button"
                onClick={() => navigateToNext(currentTour.nextId)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-primary text-primary-foreground hover:bg-primary-hover text-xs font-mono font-medium transition-colors cursor-pointer"
              >
                <span>{currentTour.nextLabel}</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
}
