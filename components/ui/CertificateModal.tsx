'use client';

import * as React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Award } from 'lucide-react';
import type { Certification } from '@/data/certifications';

export interface CertificateModalProps {
  certification: Certification | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CertificateModal({
  certification,
  isOpen,
  onClose,
}: CertificateModalProps) {
  // Lock background scroll and broadcast modal state for Mascot companion
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.dispatchEvent(
        new CustomEvent('portfolio-modal-state', { detail: { isOpen: true } })
      );
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
      window.dispatchEvent(
        new CustomEvent('portfolio-modal-state', { detail: { isOpen: false } })
      );
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
      window.dispatchEvent(
        new CustomEvent('portfolio-modal-state', { detail: { isOpen: false } })
      );
    };
  }, [isOpen, onClose]);

  if (!certification) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-5 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/85 backdrop-blur-md"
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: 'spring', damping: 25, stiffness: 320 }}
            className="relative w-full max-w-3xl max-h-[92vh] flex flex-col bg-surface border border-border/90 rounded-2xl shadow-2xl overflow-hidden z-10"
            role="dialog"
            aria-modal="true"
            aria-label={certification.title}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4 border-b border-border/80 bg-surface-elevated/60">
              <div className="min-w-0">
                <h2 className="text-sm sm:text-base font-bold text-text-primary truncate">
                  {certification.title}
                </h2>
                <div className="flex items-center gap-2 text-xs font-mono text-text-subtle mt-0.5">
                  <span className="font-semibold text-primary">
                    {certification.issuer}
                  </span>
                  <span>•</span>
                  <span>{certification.issueDate}</span>
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close Certificate Preview"
                className="p-1.5 sm:p-2 rounded-xl text-text-subtle hover:text-text-primary hover:bg-surface border border-transparent hover:border-border transition-all cursor-pointer shrink-0"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body: Clean, Fully-Responsive Certificate Preview Image */}
            <div className="flex-1 overflow-y-auto p-2 sm:p-4 flex flex-col items-center justify-center bg-background/50">
              <div className="relative w-full flex items-center justify-center rounded-xl overflow-hidden border border-border/80 bg-white p-1.5 sm:p-3 shadow-lg">
                <Image
                  src={certification.imagePreviewUrl}
                  alt={`${certification.title} - ${certification.issuer}`}
                  width={1200}
                  height={850}
                  priority
                  className="w-full h-auto max-h-[52vh] sm:max-h-[68vh] object-contain rounded-lg select-none bg-white"
                />
              </div>

              {/* Skills Learned & Acquired Section */}
              <div className="w-full mt-3.5 pt-3 border-t border-border/70 flex flex-col items-center">
                <span className="text-[11px] sm:text-xs font-mono font-medium text-text-subtle uppercase tracking-wider mb-2">
                  Skills Learned &amp; Acquired
                </span>
                <div className="flex flex-wrap items-center justify-center gap-1.5">
                  {certification.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded-md text-[11px] sm:text-xs font-mono bg-surface-elevated border border-border/70 text-text-muted hover:text-text-primary transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
