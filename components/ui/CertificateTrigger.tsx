'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import dynamic from 'next/dynamic';
import type { Certification } from '@/data/certifications';

// Downloaded only after the first click, so `motion` stays out of the initial bundle.
const CertificateModal = dynamic(
  () => import('@/components/ui/CertificateModal').then((mod) => mod.CertificateModal),
  { ssr: false }
);

interface CertificateTriggerProps {
  certification: Certification;
  className?: string;
  children: React.ReactNode;
}

/** Client island that opens the certificate preview for a server-rendered certification card. */
export function CertificateTrigger({ certification, className, children }: CertificateTriggerProps) {
  const [open, setOpen] = React.useState(false);
  const close = React.useCallback(() => setOpen(false), []);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as Element;
    if (!e.currentTarget.contains(target)) return;
    if (target.closest('a')) return;
    setOpen(true);
  };

  return (
    // Mouse shortcut: clicking anywhere on the card opens it. Keyboard and screen-reader users
    // use the real <button> inside every card, so the wrapper needs no role or key handler.
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div className={className} onClick={handleClick}>
      {children}
      {open &&
        createPortal(<CertificateModal certification={certification} isOpen onClose={close} />, document.body)}
    </div>
  );
}
