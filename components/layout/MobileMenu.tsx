'use client';

import * as React from 'react';
import { X, FileText, Github, Linkedin, Mail } from 'lucide-react';
import { profileData } from '@/data/profile';
import { siteConfig } from '@/data/siteConfig';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (sectionId: string) => void;
}

export function MobileMenu({ isOpen, onClose, onNavigate }: MobileMenuProps) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Navigation Menu"
      className="fixed inset-0 z-50 flex flex-col bg-background/95 backdrop-blur-xl md:hidden transition-all duration-300"
    >
      {/* Drawer Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-border">
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('home');
          }}
          className="text-xl font-bold tracking-tight text-primary font-mono"
        >
          {profileData.monogram}
        </a>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-border text-text-primary hover:bg-surface-elevated transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 overflow-y-auto px-6 py-8 flex flex-col justify-center gap-6">
        {siteConfig.navLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            onClick={(e) => {
              e.preventDefault();
              onNavigate(link.href.substring(1));
            }}
            className="flex items-center min-h-[48px] text-2xl font-semibold text-text-primary hover:text-primary transition-colors"
          >
            {link.name}
          </a>
        ))}

        <div className="pt-4 border-t border-border">
          <a
            href={profileData.resume.url}
            download={profileData.resume.filename}
            className="flex items-center gap-3 min-h-[48px] text-lg font-medium text-primary hover:text-primary-hover transition-colors"
          >
            <FileText className="h-5 w-5" />
            Download Resume (PDF)
          </a>
        </div>
      </nav>

      {/* Drawer Footer */}
      <div className="px-6 py-6 border-t border-border flex items-center justify-between text-text-muted">
        <div className="flex items-center gap-4">
          <a
            href={profileData.contact.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Profile"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-elevated text-text-primary hover:text-primary transition-colors"
          >
            <Github className="h-5 w-5" />
          </a>
          <a
            href={profileData.contact.socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn Profile"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-elevated text-text-primary hover:text-primary transition-colors"
          >
            <Linkedin className="h-5 w-5" />
          </a>
          <a
            href={`mailto:${profileData.contact.email}`}
            aria-label="Email Contact"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-elevated text-text-primary hover:text-primary transition-colors"
          >
            <Mail className="h-5 w-5" />
          </a>
        </div>
        <span className="text-xs font-mono text-text-subtle">
          {profileData.contact.location}
        </span>
      </div>
    </div>
  );
}
