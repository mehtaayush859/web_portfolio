'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import dynamic from 'next/dynamic';
import type { DetailModalProps } from '@/components/ui/DetailModal';

// The modal (and the `motion` library it uses) is only downloaded after the first click.
const DetailModal = dynamic(
  () => import('@/components/ui/DetailModal').then((mod) => mod.DetailModal),
  { ssr: false }
);

export type DetailContent = Omit<DetailModalProps, 'isOpen' | 'onClose'>;

interface DetailTriggerProps {
  detail: DetailContent;
  className?: string;
  children: React.ReactNode;
}

/**
 * Client island that makes a server-rendered card open a DetailModal.
 * Any click inside the card opens it, except clicks on links (e.g. "GitHub"), which keep
 * their normal behaviour. The modal is portalled to <body> so it is never clipped or
 * repositioned by transformed ancestors such as the swipe tracks.
 */
export function DetailTrigger({ detail, className, children }: DetailTriggerProps) {
  const [open, setOpen] = React.useState(false);
  const close = React.useCallback(() => setOpen(false), []);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as Element;
    // Portalled modal clicks still bubble through the React tree; ignore anything outside this card.
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
      {open && createPortal(<DetailModal {...detail} isOpen onClose={close} />, document.body)}
    </div>
  );
}
