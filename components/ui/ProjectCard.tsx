'use client';

import * as React from 'react';
import {
  Github,
  ArrowUpRight,
  ShieldCheck,
  Activity,
  Radio,
  Server,
} from 'lucide-react';
import { type Project } from '@/data/projects';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

interface ProjectCardProps extends Project {
  onExplore?: () => void;
}

export function ProjectCard({
  title,
  category,
  tagline,
  theme,
  tags,
  github,
  onExplore,
}: ProjectCardProps) {
  // Theme-based creative graphic visual configurations
  const themeConfig = {
    emerald: {
      border: 'border-emerald-500/30 group-hover:border-emerald-400/70',
      badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
      glow: 'bg-emerald-500/20',
      gradient: 'from-emerald-950/70 via-surface-elevated/80 to-surface',
      icon: <Activity className="h-8 w-8 text-emerald-400" />,
      ringColor: 'border-emerald-500/30',
      svgPattern: (
        <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-emerald" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(16, 185, 129, 0.4)" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-emerald)" />
        </svg>
      ),
    },
    cyan: {
      border: 'border-cyan-500/30 group-hover:border-cyan-400/70',
      badge: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
      glow: 'bg-cyan-500/20',
      gradient: 'from-cyan-950/70 via-surface-elevated/80 to-surface',
      icon: <ShieldCheck className="h-8 w-8 text-cyan-400" />,
      ringColor: 'border-cyan-500/30',
      svgPattern: (
        <svg className="absolute inset-0 w-full h-full opacity-25" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50%" cy="50%" r="40" fill="none" stroke="rgba(6, 182, 212, 0.3)" strokeWidth="1" strokeDasharray="4 4" />
          <circle cx="50%" cy="50%" r="70" fill="none" stroke="rgba(6, 182, 212, 0.2)" strokeWidth="1" />
          <line x1="0" y1="50%" x2="100%" y2="50%" stroke="rgba(6, 182, 212, 0.15)" strokeWidth="0.8" />
          <line x1="50%" y1="0" x2="50%" y2="100%" stroke="rgba(6, 182, 212, 0.15)" strokeWidth="0.8" />
        </svg>
      ),
    },
    amber: {
      border: 'border-amber-500/30 group-hover:border-amber-400/70',
      badge: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
      glow: 'bg-amber-500/20',
      gradient: 'from-amber-950/70 via-surface-elevated/80 to-surface',
      icon: <Radio className="h-8 w-8 text-amber-400 animate-pulse" />,
      ringColor: 'border-amber-500/30',
      svgPattern: (
        <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-amber" width="28" height="28" patternUnits="userSpaceOnUse">
              <circle cx="14" cy="14" r="1.5" fill="rgba(245, 158, 11, 0.5)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-amber)" />
        </svg>
      ),
    },
    violet: {
      border: 'border-violet-500/30 group-hover:border-violet-400/70',
      badge: 'bg-violet-500/10 text-violet-300 border-violet-500/30',
      glow: 'bg-violet-500/20',
      gradient: 'from-violet-950/70 via-surface-elevated/80 to-surface',
      icon: <Server className="h-8 w-8 text-violet-400" />,
      ringColor: 'border-violet-500/30',
      svgPattern: (
        <svg className="absolute inset-0 w-full h-full opacity-25" xmlns="http://www.w3.org/2000/svg">
          <path d="M 30 30 L 120 70 L 220 40 L 320 80" fill="none" stroke="rgba(139, 92, 246, 0.3)" strokeWidth="1" />
          <circle cx="30" cy="30" r="3" fill="rgba(139, 92, 246, 0.6)" />
          <circle cx="120" cy="70" r="4" fill="rgba(139, 92, 246, 0.6)" />
          <circle cx="220" cy="40" r="3" fill="rgba(139, 92, 246, 0.6)" />
          <circle cx="320" cy="80" r="4" fill="rgba(139, 92, 246, 0.6)" />
        </svg>
      ),
    },
  }[theme];

  return (
    <Card
      interactive
      onClick={onExplore}
      className={cn(
        'p-0 overflow-hidden flex flex-col h-full bg-surface/90 border transition-all duration-300 group shadow-lg hover:shadow-2xl relative cursor-pointer select-none active:scale-[0.99]',
        themeConfig.border
      )}
    >
      {/* Creative Visual Banner / Artistic Background Header */}
      <div className={cn('relative h-44 sm:h-48 w-full overflow-hidden flex items-center justify-center bg-gradient-to-b', themeConfig.gradient)}>
        {/* Subtle decorative SVG pattern */}
        {themeConfig.svgPattern}

        {/* Ambient radial blur aura */}
        <div
          className={cn(
            'absolute w-40 h-40 rounded-full blur-2xl transition-all duration-500 ease-out group-hover:scale-125 opacity-70 group-hover:opacity-100',
            themeConfig.glow
          )}
          aria-hidden="true"
        />

        {/* Centerpiece Graphic Emblem */}
        <div className="relative z-10 flex flex-col items-center justify-center">
          <div
            className={cn(
              'relative p-3.5 rounded-2xl bg-surface/80 border backdrop-blur-md shadow-xl transition-transform duration-300 ease-out group-hover:scale-110',
              themeConfig.ringColor
            )}
          >
            {themeConfig.icon}
          </div>
        </div>

        {/* Top-Left: Status Indicator */}
        <div className="absolute top-3.5 left-4 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface/70 backdrop-blur-md border border-border/60 text-[10px] font-mono text-text-subtle">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Open Source</span>
        </div>
      </div>

      {/* Card Body: Minimalist, Balanced, Single Tailored Point */}
      <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between gap-3.5">
        <div>
          {/* Top Row: Project Name on top */}
          <h3 className="text-base sm:text-lg font-bold text-text-primary tracking-tight group-hover:text-primary transition-colors line-clamp-1 mb-1.5">
            {title}
          </h3>

          {/* Category directly below Project Name */}
          <div className="flex items-center gap-2 mb-2.5">
            <span
              className={cn(
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider border shadow-sm',
                themeConfig.badge
              )}
            >
              {category}
            </span>
          </div>

          {/* Crisp single tailored short description */}
          <p className="text-xs sm:text-sm text-text-muted leading-relaxed line-clamp-2 font-sans">
            {tagline}
          </p>
        </div>

        {/* Footer: Exactly 2 Top Skills + Details ↗ & GitHub */}
        <div className="pt-3 border-t border-border/60 flex items-center justify-between gap-2">
          {/* Exactly 2 top tags */}
          <div className="flex items-center gap-1.5 overflow-hidden">
            {tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-mono bg-surface-elevated border border-border/70 text-text-subtle truncate max-w-[110px]"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Action Row: Sleek Details Indicator + Outside GitHub Link */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="flex items-center gap-1 text-[11px] font-mono font-semibold text-primary group-hover:text-primary-hover group-hover:translate-x-0.5 transition-all">
              <span className="hidden sm:inline">Details</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </div>

            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-1 rounded text-text-subtle hover:text-primary transition-colors cursor-pointer"
              aria-label={`View ${title} repository on GitHub`}
              title="Open GitHub repository"
            >
              <Github className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </Card>
  );
}
