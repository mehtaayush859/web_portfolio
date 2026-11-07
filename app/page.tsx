import * as React from 'react';
import { HeroSection } from '@/components/sections/HeroSection';
import { ExperienceSection } from '@/components/sections/ExperienceSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { SkillsSection } from '@/components/sections/SkillsSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { CredentialsSection } from '@/components/sections/CredentialsSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { EmojiShower } from '@/components/ui/EmojiShower';

// Order: who → proof (experience, projects) → capabilities → person → credentials → contact.
export default function Home() {
  return (
    <>
      <HeroSection />
      <ExperienceSection />
      <ProjectsSection />
      <SkillsSection />
      <AboutSection />
      <CredentialsSection />
      <ContactSection />

      {/* Full-screen emoji shower triggered by reactions */}
      <EmojiShower />
    </>
  );
}
