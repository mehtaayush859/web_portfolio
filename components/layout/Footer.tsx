'use client';

import * as React from 'react';
import { ArrowUp, Github, Linkedin, Mail } from 'lucide-react';
import { profileData } from '@/data/profile';
import { Container } from '@/components/ui/Container';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className="py-12 border-t border-border bg-surface/50 text-text-muted transition-colors">
      <Container size="lg">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
          {/* Brand & Monogram */}
          <div className="flex flex-col items-center md:items-start gap-1">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold font-mono text-primary">
                {profileData.monogram}
              </span>
              <span className="text-sm font-semibold text-text-primary">
                {profileData.name}
              </span>
            </div>
            <p className="text-xs text-text-subtle">
              {profileData.tagline}
            </p>
          </div>

          {/* Socials & Back to Top */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <a
                href={profileData.contact.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Profile"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface text-text-primary hover:border-primary/50 hover:text-primary transition-colors"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href={profileData.contact.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface text-text-primary hover:border-primary/50 hover:text-primary transition-colors"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href={`mailto:${profileData.contact.email}`}
                aria-label="Email Contact"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface text-text-primary hover:border-primary/50 hover:text-primary transition-colors"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>

            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-border bg-surface text-xs font-medium text-text-primary hover:border-primary/50 hover:text-primary transition-colors"
              aria-label="Scroll back to top"
            >
              <span>Back to top</span>
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Legal & Utility Links */}
        <div className="pt-6 border-t border-border/50 text-xs text-text-subtle flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© {currentYear} {profileData.name}. All rights reserved.</p>

          <ul className="flex items-center gap-6">
            <li>
              <a
                href="#about"
                className="hover:text-primary transition-colors"
              >
                About
              </a>
            </li>
            <li>
              <a
                href="#contact"
                className="hover:text-primary transition-colors"
              >
                Contact
              </a>
            </li>
            <li>
              <a
                href="/sitemap.xml"
                className="hover:text-primary transition-colors"
              >
                Sitemap
              </a>
            </li>
          </ul>
        </div>
      </Container>
    </footer>
  );
}
