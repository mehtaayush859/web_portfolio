'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, MapPin, ExternalLink, Github, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  badge?: string;
  badgeVariant?: 'primary' | 'accent';
  status?: string;
  title: string;
  subtitle: string;
  period?: string;
  location?: string;
  summary?: string;
  metrics?: Array<{ value: string; label: string }>;
  bullets?: string[];
  tags?: string[];
  tagsLabel?: string;
  actionLink?: {
    url: string;
    label: string;
    isExternal?: boolean;
    icon?: 'github' | 'external';
  };
}

export function DetailModal({
  isOpen,
  onClose,
  badge,
  badgeVariant = 'primary',
  status,
  title,
  subtitle,
  period,
  location,
  summary,
  metrics,
  bullets,
  tags,
  tagsLabel = 'Technologies & Tools',
  actionLink,
}: DetailModalProps) {
  const isAccent = badgeVariant === 'accent';

  // Trap escape key & lock background scroll & broadcast modal state
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.dispatchEvent(new CustomEvent('portfolio-modal-state', { detail: { isOpen: true } }));
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
      window.dispatchEvent(new CustomEvent('portfolio-modal-state', { detail: { isOpen: false } }));
    }

    return () => {
      document.body.style.overflow = '';
      window.dispatchEvent(new CustomEvent('portfolio-modal-state', { detail: { isOpen: false } }));
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
        >
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-md"
            aria-hidden="true"
          />

          {/* Modal Pop-up Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              'relative w-full max-w-xl rounded-2xl border bg-surface p-5 sm:p-7 z-10 max-h-[88vh] flex flex-col justify-between overflow-hidden shadow-2xl',
              isAccent ? 'border-accent/40 shadow-accent/5' : 'border-border'
            )}
          >
            {/* Decorative Top Accent Line */}
            <div
              className={cn(
                'absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r',
                isAccent
                  ? 'from-accent/70 via-accent/30 to-transparent'
                  : 'from-primary/70 via-primary/30 to-transparent'
              )}
              aria-hidden="true"
            />

            {/* Header Close Button */}
            <button
              onClick={onClose}
              aria-label="Close dialog"
              className={cn(
                'absolute top-4 right-4 p-2 rounded-lg text-text-subtle hover:bg-surface-elevated transition-colors cursor-pointer z-20',
                isAccent ? 'hover:text-accent' : 'hover:text-text-primary'
              )}
            >
              <X className="h-5 w-5" />
            </button>

            {/* Scrollable Content Container */}
            <div className="overflow-y-auto pr-1 space-y-4 sm:space-y-5 scrollbar-thin">
              {/* Header Badges & Titles */}
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2 pr-8">
                  {badge && (
                    <span
                      className={cn(
                        'text-[10px] sm:text-[11px] font-mono uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded-full border',
                        badgeVariant === 'accent'
                          ? 'bg-accent/10 text-accent border-accent/30'
                          : 'bg-primary/10 text-primary border-primary/30'
                      )}
                    >
                      {badge.includes('//') ? (
                        <>
                          <span>{badge.split('//')[0].trim()} //</span>{' '}
                          <span className="block sm:inline">{badge.split('//')[1].trim()}</span>
                        </>
                      ) : (
                        badge
                      )}
                    </span>
                  )}
                  {status && (
                    <span
                      className={cn(
                        'text-[10px] font-mono px-2 py-0.5 rounded-full border',
                        isAccent
                          ? 'bg-accent/15 text-accent border-accent/40 font-semibold'
                          : 'bg-surface-elevated border-border text-text-subtle'
                      )}
                    >
                      {status}
                    </span>
                  )}
                </div>

                <h3 id="modal-title" className="text-xl sm:text-2xl font-bold text-text-primary leading-tight">
                  {title}
                </h3>
                <p className="text-sm sm:text-base font-semibold text-text-muted mt-1">
                  {subtitle}
                </p>

                {/* Metadata Row: Period & Location */}
                {(period || location) && (
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs font-mono text-text-subtle">
                    {period && (
                      <span className="flex items-center gap-1.5">
                        <Calendar className={cn('h-3.5 w-3.5', isAccent ? 'text-accent' : 'text-primary')} />
                        {period}
                      </span>
                    )}
                    {period && location && <span>•</span>}
                    {location && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className={cn('h-3.5 w-3.5', isAccent ? 'text-accent' : 'text-primary')} />
                        {location}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Impact Metrics (Mobile: sleek horizontal rows with zero truncation; Desktop: 3-column grid) */}
              {metrics && metrics.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-2 px-3 sm:px-4 rounded-xl bg-surface-elevated/80 border border-border/80">
                  {metrics.map((metric, idx) => (
                    <div
                      key={idx}
                      className="flex sm:flex-col items-center sm:justify-center justify-between gap-1 text-left sm:text-center px-1 py-1 sm:py-0 border-b border-border/30 sm:border-0 last:border-0"
                    >
                      <span className={cn('text-sm font-mono font-bold shrink-0', isAccent ? 'text-accent' : 'text-primary')}>
                        {metric.value}
                      </span>
                      <span className="text-xs sm:text-[11px] font-mono text-text-subtle leading-tight">
                        {metric.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Summary Description (if provided) */}
              {summary && (
                <div className="p-3.5 rounded-xl bg-surface-elevated/40 border border-border/60">
                  <p className="text-xs sm:text-sm text-text-primary leading-relaxed">
                    {summary}
                  </p>
                </div>
              )}

              {/* Key Highlights (at max 3 tailored punchy bullet points) */}
              {bullets && bullets.length > 0 && (
                <div>
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-text-subtle mb-2.5 flex items-center gap-1.5">
                    <Sparkles className={cn('h-3.5 w-3.5', isAccent ? 'text-accent' : 'text-primary')} />
                    <span>Key Highlights</span>
                  </h4>
                  <ul className="space-y-2.5">
                    {bullets.slice(0, 3).map((bullet, idx) => (
                      <li
                        key={idx}
                        className="text-xs sm:text-sm text-text-muted leading-relaxed flex items-start gap-2.5"
                      >
                        <span className={cn('mt-1 shrink-0 font-bold', isAccent ? 'text-accent' : 'text-primary')}>•</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tech Stack / Coursework Chips (limited to 4 total) */}
              {tags && tags.length > 0 && (
                <div className="pt-1">
                  <h4 className="text-[11px] font-mono uppercase tracking-wider text-text-subtle mb-2">
                    {tagsLabel}
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {tags.slice(0, 4).map((tag, idx) => (
                      <span
                        key={idx}
                        className={cn(
                          'text-[11px] font-mono px-2.5 py-1 rounded-md border text-text-primary transition-colors',
                          isAccent
                            ? 'bg-surface-elevated border-accent/25 hover:border-accent/50 hover:text-accent'
                            : 'bg-surface-elevated border-border'
                        )}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="pt-4 mt-4 border-t border-border flex items-center justify-between gap-3">
              {actionLink ? (
                <a
                  href={actionLink.url}
                  target={actionLink.isExternal !== false ? '_blank' : undefined}
                  rel={actionLink.isExternal !== false ? 'noopener noreferrer' : undefined}
                  className={cn(
                    'inline-flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xs font-bold transition-colors shadow-sm cursor-pointer text-black',
                    isAccent ? 'bg-accent hover:bg-accent/80' : 'bg-primary hover:bg-primary-hover'
                  )}
                >
                  {actionLink.icon === 'github' ? (
                    <Github className="h-4 w-4" />
                  ) : (
                    <ExternalLink className="h-4 w-4" />
                  )}
                  <span>{actionLink.label}</span>
                </a>
              ) : (
                <div />
              )}

              <button
                type="button"
                onClick={onClose}
                className={cn(
                  'px-4 py-2 rounded-lg border bg-surface-elevated text-text-primary text-xs font-mono font-medium transition-colors cursor-pointer',
                  isAccent
                    ? 'border-border hover:bg-surface hover:border-accent/50 hover:text-accent'
                    : 'border-border hover:bg-surface hover:border-primary/50'
                )}
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
