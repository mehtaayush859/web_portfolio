'use client';

import * as React from 'react';
import { Menu, FileText } from 'lucide-react';
import { cx, scrollBehavior } from '@/lib/client-utils';
import { identity } from '@/data/identity';
import { siteConfig } from '@/data/siteConfig';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { CommandPaletteLauncher } from '@/components/ui/CommandPaletteLauncher';
import { MobileMenu } from './MobileMenu';

export function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [active, setActive] = React.useState<string>('');

  // Highlight the nav item for the section currently in the middle of the viewport.
  React.useEffect(() => {
    const ids = siteConfig.navLinks.map((l) => l.href.slice(1));
    const sections = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

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
          window.scrollTo({ top: 0, behavior: scrollBehavior() });
        } else {
          const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
          }
        }
        window.history.replaceState(null, '', `#${sectionId}`);
      });
    });
  };

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-40 px-3 sm:px-6 pt-3 sm:pt-4">
        <div
          className={cx(
            'mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-full border px-3 py-2 sm:px-4 transition-all duration-300',
            isScrolled ? 'glass border-border shadow-lg shadow-black/10' : 'border-transparent bg-transparent'
          )}
        >
          {/* Monogram */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleScrollToSection('home');
            }}
            className="group inline-flex items-center gap-2 min-h-10 rounded-full pl-1 pr-2 select-none"
            aria-label={`${identity.name}, open to work: back to top`}
          >
            <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-accent to-primary font-mono text-sm font-bold text-white dark:text-[#04110c]">
              {identity.monogram}
            </span>
            <span className="hidden sm:flex md:hidden lg:flex flex-col leading-tight">
              <span className="text-sm font-semibold text-text-primary">{identity.name}</span>
              <span className="flex items-center gap-1 font-mono text-[10px] text-text-subtle">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
                open to work
              </span>
            </span>
          </a>

          {/* Desktop navigation */}
          <nav aria-label="Main Navigation" className="hidden md:block">
            <ul className="flex items-center gap-0.5 rounded-full border border-border bg-surface/60 p-1">
              {siteConfig.navLinks.map((link) => {
                const id = link.href.substring(1);
                const isActive = active === id;
                return (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      aria-current={isActive ? 'location' : undefined}
                      onClick={(e) => {
                        e.preventDefault();
                        handleScrollToSection(id);
                      }}
                      className={cx(
                        'inline-flex items-center min-h-9 rounded-full px-2.5 lg:px-3.5 text-sm font-medium transition-colors',
                        isActive ? 'bg-surface-elevated text-text-primary shadow-sm' : 'text-text-muted hover:text-text-primary'
                      )}
                    >
                      {link.name}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1.5">
            <CommandPaletteLauncher />
            <a
              href={identity.resume.url}
              download={identity.resume.filename}
              className="hidden lg:inline-flex items-center gap-1.5 min-h-9 rounded-full border border-border bg-surface-elevated px-4 text-sm font-medium text-text-primary hover:border-accent/50 transition-colors"
            >
              <FileText className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
              Resume
            </a>
            <ThemeToggle listen />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-expanded={mobileMenuOpen}
              aria-label="Open navigation menu"
              className="md:hidden flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-text-primary active:scale-95 transition-transform cursor-pointer"
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
