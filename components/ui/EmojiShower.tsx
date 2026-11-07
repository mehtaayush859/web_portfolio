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
  sprite: HTMLCanvasElement;
}

const EVENT = 'portfolio-emoji-shower';
/** Hard cap on particles on screen, however many showers are requested. */
const MAX_PARTICLES = 60;
/** The same emoji can start a new shower at most this often. */
const COOLDOWN_MS = 1500;
const SPRITE_PX = 64;

export function triggerEmojiShower(emoji: string) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(EVENT, { detail: { emoji } }));
  }
}

// Each emoji is rasterised once to a small offscreen canvas and then drawn as an image.
// Drawing emoji text every frame (font parsing + colour-glyph rasterising per particle) is what
// made rapid reactions freeze the page.
const sprites = new Map<string, HTMLCanvasElement>();
function spriteFor(emoji: string): HTMLCanvasElement {
  let s = sprites.get(emoji);
  if (!s) {
    s = document.createElement('canvas');
    s.width = s.height = SPRITE_PX;
    const c = s.getContext('2d');
    if (c) {
      c.font = `${SPRITE_PX * 0.8}px -apple-system, BlinkMacSystemFont, "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif`;
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      c.fillText(emoji, SPRITE_PX / 2, SPRITE_PX / 2 + SPRITE_PX * 0.04);
    }
    sprites.set(emoji, s);
  }
  return s;
}

export function EmojiShower() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const particlesRef = React.useRef<Particle[]>([]);
  const animFrameRef = React.useRef<number | null>(null);
  const lastShowerRef = React.useRef<Map<string, number>>(new Map());

  React.useEffect(() => {
    const startAnimation = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;

      const render = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, width, height);

        const alive: Particle[] = [];
        for (const p of particlesRef.current) {
          p.x += p.vx;
          p.y += p.vy;
          p.rotation += p.vRot;
          if (p.y > height * 0.75) p.opacity -= 0.025;
          if (p.y >= height + 60 || p.opacity <= 0) continue;

          const rad = (p.rotation * Math.PI) / 180;
          const cos = Math.cos(rad) * dpr;
          const sin = Math.sin(rad) * dpr;
          ctx.setTransform(cos, sin, -sin, cos, p.x * dpr, p.y * dpr);
          ctx.globalAlpha = p.opacity;
          ctx.drawImage(p.sprite, -p.size / 2, -p.size / 2, p.size, p.size);
          alive.push(p);
        }
        ctx.globalAlpha = 1;
        particlesRef.current = alive;

        if (alive.length === 0) {
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          ctx.clearRect(0, 0, width, height);
          animFrameRef.current = null;
          return;
        }
        animFrameRef.current = requestAnimationFrame(render);
      };
      animFrameRef.current = requestAnimationFrame(render);
    };

    const handleShower = (e: Event) => {
      if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
      const raw = (e as CustomEvent<{ emoji?: unknown }>).detail?.emoji;
      // Only short strings (an emoji is a few code units); anything else falls back.
      const emoji = typeof raw === 'string' && raw.length > 0 && raw.length <= 8 ? raw : '👍';

      // Repeated requests for the same emoji while its shower is still falling are ignored.
      const now = performance.now();
      if (now - (lastShowerRef.current.get(emoji) ?? -Infinity) < COOLDOWN_MS) return;
      lastShowerRef.current.set(emoji, now);

      const width = window.innerWidth;
      const room = MAX_PARTICLES - particlesRef.current.length;
      const count = Math.min(Math.floor(width / 40), 30, room);
      if (count <= 0) return;

      const sprite = spriteFor(emoji);
      for (let i = 0; i < count; i++) {
        particlesRef.current.push({
          x: Math.random() * width,
          y: -20 - Math.random() * 80,
          vx: (Math.random() - 0.5) * 2.2,
          vy: 3.5 + Math.random() * 4.5,
          size: 22 + Math.random() * 18,
          rotation: (Math.random() - 0.5) * 40,
          vRot: (Math.random() - 0.5) * 3,
          opacity: 1,
          sprite,
        });
      }
      if (!animFrameRef.current) startAnimation();
    };

    window.addEventListener(EVENT, handleShower);
    return () => {
      window.removeEventListener(EVENT, handleShower);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[9999] h-full w-full select-none"
      aria-hidden="true"
    />
  );
}
