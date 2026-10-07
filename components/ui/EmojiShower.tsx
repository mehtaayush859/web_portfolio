'use client';

import * as React from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  vRot: number;
  opacity: number;
  emoji: string;
}

export function triggerEmojiShower(emoji: string) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('portfolio-emoji-shower', { detail: { emoji } })
    );
  }
}

export function EmojiShower() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const particlesRef = React.useRef<Particle[]>([]);
  const animFrameRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    const handleShower = (e: Event) => {
      const customEvent = e as CustomEvent<{ emoji: string }>;
      const emoji = customEvent.detail?.emoji || '👍';
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Spawn 36 particles scattered along the top of the viewport
      const newParticles: Particle[] = [];
      const count = Math.min(Math.floor(width / 30), 40);

      for (let i = 0; i < count; i++) {
        newParticles.push({
          x: Math.random() * width,
          y: -20 - Math.random() * 80, // Staggered start above viewport
          vx: (Math.random() - 0.5) * 2.2, // Slight horizontal drift
          vy: 3.5 + Math.random() * 4.5, // Downward velocity
          size: 22 + Math.random() * 18, // 22px to 40px
          rotation: (Math.random() - 0.5) * 40,
          vRot: (Math.random() - 0.5) * 3,
          opacity: 1,
          emoji,
        });
      }

      particlesRef.current = [...particlesRef.current, ...newParticles];

      // Start animation loop if not already running
      if (!animFrameRef.current) {
        startAnimation();
      }
    };

    window.addEventListener('portfolio-emoji-shower', handleShower);
    return () => {
      window.removeEventListener('portfolio-emoji-shower', handleShower);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const startAnimation = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high-DPI displays
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);

    const render = () => {
      const currentParticles = particlesRef.current;
      const height = window.innerHeight;

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      if (currentParticles.length === 0) {
        animFrameRef.current = null;
        return;
      }

      const activeParticles: Particle[] = [];

      for (const p of currentParticles) {
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vRot;

        // Start fading as they reach lower 25% of viewport
        if (p.y > height * 0.75) {
          p.opacity -= 0.025;
        }

        if (p.y < height + 60 && p.opacity > 0) {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.font = `${p.size}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(p.emoji, 0, 0);
          ctx.restore();

          activeParticles.push(p);
        }
      }

      particlesRef.current = activeParticles;
      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);
  };

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[9999] h-full w-full select-none"
      aria-hidden="true"
    />
  );
}

