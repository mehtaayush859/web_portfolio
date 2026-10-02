import * as React from 'react';
import dynamic from 'next/dynamic';
import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { SkillsSection } from '@/components/sections/SkillsSection';
import { ContactSection } from '@/components/sections/ContactSection';

// Dynamically load the floating interactive mascot guide so it is code-split into its own bundle
const MascotTourCompanion = dynamic(
  () => import('@/components/ui/MascotTourCompanion').then((mod) => mod.MascotTourCompanion)
);

export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <SkillsSection />
      <ContactSection />

      {/* Floating Interactive 3D Mascot Walkthrough Companion */}
      <MascotTourCompanion />
    </>
  );
}
