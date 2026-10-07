'use client';

import * as React from 'react';
import { Menu, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { profileData } from '@/data/profile';
import { siteConfig } from '@/data/siteConfig';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Button } from '@/components/ui/Button';
import { MobileMenu } from './MobileMenu';

export function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled((prev) => {
            const next = window.scrollY > 20;
            return prev !== next ? next : prev;
          });
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollToSection = (sectionId: string) => {
    document.body.style.overflow = '';
    setMobileMenuOpen(false);

    // Double RAF allows the layout to restore before triggering smooth GPU scroll
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (sectionId === 'home') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
        window.history.replaceState(null, '', `#${sectionId}`);
      });
    });
  };

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-40 transition-all duration-300 py-4 px-4 sm:px-6 md:px-8 lg:px-12',
          isScrolled
            ? 'glass shadow-sm shadow-black/5 dark:shadow-black/20'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo / Monogram */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleScrollToSection('home');
            }}
            className="text-xl font-bold tracking-tight text-primary font-mono select-none"
            aria-label={`${profileData.name} Home`}
          >
            <span className="text-primary hover:text-primary-hover transition-colors">
              {profileData.monogram}
            </span>
            <span className="text-text-subtle text-xs ml-1 font-normal hidden sm:inline">
              // portfolio
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav
            aria-label="Main Navigation"
            className="hidden md:flex items-center space-x-1 lg:space-x-2"
          >
            {siteConfig.navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleScrollToSection(link.href.substring(1));
                }}
                className="relative py-2 px-3 text-sm font-medium text-text-muted hover:text-text-primary transition-colors duration-200 group"
              >
                {link.name}
                <span className="absolute bottom-1 left-3 right-3 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left rounded-full" />
              </a>
            ))}

            {/* Resume CTA */}
            <a
              href={profileData.resume.url}
              download={profileData.resume.filename}
              className="ml-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-mono font-medium rounded-md border border-border bg-surface-elevated text-text-primary hover:border-primary/50 hover:text-primary transition-all duration-200"
            >
              <FileText className="h-3.5 w-3.5 text-primary" />
              Resume
            </a>

            {/* Theme Switcher */}
            <div className="pl-2 border-l border-border ml-2">
              <ThemeToggle />
            </div>
          </nav>

          {/* Mobile Actions */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-expanded={mobileMenuOpen}
              aria-label="Open navigation menu"
              className="flex items-center justify-center h-10 w-10 rounded-lg border border-border bg-surface text-text-primary hover:bg-surface-elevated active:scale-95 transition-transform cursor-pointer"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Accessible Mobile Menu Drawer */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onNavigate={handleScrollToSection}
      />
    </>
  );
}
