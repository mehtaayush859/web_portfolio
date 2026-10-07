'use client';

import * as React from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Shield, Cpu, Network, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export function HeroCharacterCard() {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = React.useState({ x: 0, y: 0 });
  const [glare, setGlare] = React.useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -12; // tilt angle
    const rotateY = ((x - centerX) / centerX) * 12;

    setRotate({ x: rotateX, y: rotateY });
    setGlare({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.35,
    });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setGlare((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      className="relative perspective-1000 w-full max-w-[460px] mx-auto select-none"
      style={{ perspective: '1200px' }}
    >
      {/* Outer ambient glow behind card */}
      <div
        className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-primary/30 via-accent/20 to-primary/30 blur-2xl opacity-50 dark:opacity-70 transition-opacity duration-500"
        aria-hidden="true"
      />

      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(1.02, 1.02, 1.02)`,
          transition: rotate.x === 0 ? 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
          transformStyle: 'preserve-3d',
        }}
        className="relative rounded-2xl border border-primary/30 bg-surface/90 backdrop-blur-xl p-4 sm:p-5 shadow-2xl overflow-hidden"
      >
        {/* Holographic light glare overlay */}
        <div
          className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, 0.25) 0%, transparent 60%)`,
            opacity: glare.opacity,
          }}
          aria-hidden="true"
        />

        {/* Top Telemetry Header */}
        <div className="flex items-center justify-between px-2 py-1.5 mb-3 border-b border-border/80 text-[11px] font-mono text-text-subtle">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            <span className="text-text-primary font-semibold">AYUSH.DEV</span>
          </div>

          <span className="text-primary font-mono font-medium">SYS.ACTIVE</span>
        </div>

        {/* 3D Character Visual Viewport with Transparent Background */}
        <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-gradient-to-b from-primary/10 via-surface-elevated/40 to-surface/80 border border-border/70 flex items-center justify-center group">
          {/* Subtle Cyber Radial Glow */}
          <div
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.18)_0%,rgba(6,182,212,0.08)_50%,transparent_75%)] pointer-events-none"
            aria-hidden="true"
          />

          {/* Animated Hovering 3D Mascot */}
          <motion.div
            animate={{
              y: [-6, 6, -6],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="relative w-full h-full p-3 flex items-center justify-center"
          >
            <Image
              src="/dev-character-transparent.png"
              alt="3D Developer Companion Mascot holding holographic code tablet"
              fill
              loading="eager"
              sizes="(max-width: 768px) 90vw, 460px"
              className="object-contain object-center transition-transform duration-500 ease-out group-hover:scale-105 drop-shadow-[0_15px_25px_rgba(0,0,0,0.5)] dark:drop-shadow-[0_20px_35px_rgba(0,0,0,0.8)]"
            />
          </motion.div>

          {/* Floating Parallax Badges (at distinct visual depths) */}
          <div
            style={{ transform: 'translateZ(40px)' }}
            className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-background/90 border border-primary/40 backdrop-blur-md text-[10px] sm:text-[11px] font-mono text-primary font-semibold shadow-lg shadow-black/40"
          >
            <Shield className="h-3.5 w-3.5 text-primary shrink-0" />
            <span>Cybersecurity</span>
          </div>

          <div
            style={{ transform: 'translateZ(50px)' }}
            className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-background/90 border border-accent/40 backdrop-blur-md text-[10px] sm:text-[11px] font-mono text-accent font-semibold shadow-lg shadow-black/40"
          >
            <Cpu className="h-3.5 w-3.5 text-accent shrink-0" />
            <span>Cloud &amp; Backend</span>
          </div>

          <div
            style={{ transform: 'translateZ(45px)' }}
            className="absolute bottom-3 left-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-background/90 border border-primary/40 backdrop-blur-md text-[10px] sm:text-[11px] font-mono text-primary font-semibold shadow-lg shadow-black/40"
          >
            <Network className="h-3.5 w-3.5 text-primary shrink-0" />
            <span>gRPC &amp; REST</span>
          </div>

          <div
            style={{ transform: 'translateZ(35px)' }}
            className="absolute bottom-3 right-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-background/90 border border-primary/40 backdrop-blur-md text-[10px] sm:text-[11px] font-mono text-text-primary font-semibold shadow-lg shadow-black/40"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary shrink-0" />
            <span>AI Security</span>
          </div>
        </div>

        {/* Bottom Interactive HUD Stats */}
        <div className="mt-3 pt-3 border-t border-border/80 grid grid-cols-3 gap-2 text-center font-mono">
          <div className="p-2 rounded-lg bg-surface-elevated border border-border/60">
            <span className="block text-[10px] text-text-subtle">EDUCATION</span>
            <span className="text-xs font-semibold text-text-primary">M.S. CS</span>
          </div>
          <div className="p-2 rounded-lg bg-surface-elevated border border-border/60">
            <span className="block text-[10px] text-text-subtle">LOCATION</span>
            <span className="text-xs font-semibold text-text-primary">Seattle, WA</span>
          </div>
          <div className="p-2 rounded-lg bg-surface-elevated border border-border/60">
            <span className="block text-[10px] text-text-subtle">AVAILABILITY</span>
            <span className="text-xs font-semibold text-primary">100% Open</span>
          </div>
        </div>
      </div>
    </div>
  );
}
