'use client';

import * as React from 'react';
import Image from 'next/image';
import { Calendar, ArrowUpRight, Award } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import type { Certification } from '@/data/certifications';
import { cn } from '@/lib/utils';

interface CertificationCardProps {
  certification: Certification;
  onView: (cert: Certification) => void;
}

export function CertificationCard({
  certification,
  onView,
}: CertificationCardProps) {
  const accentStyles = {
    cyan: {
      border: 'hover:border-accent/60',
      category: 'text-accent border-accent/30 bg-accent/5',
      button: 'text-accent group-hover:text-accent-hover',
    },
    violet: {
      border: 'hover:border-purple-500/60',
      category: 'text-purple-400 border-purple-500/30 bg-purple-500/5',
      button: 'text-purple-400 group-hover:text-purple-300',
    },
    emerald: {
      border: 'hover:border-primary/60',
      category: 'text-primary border-primary/30 bg-primary/5',
      button: 'text-primary group-hover:text-primary-hover',
    },
  }[certification.accent];

  return (
    <Card
      interactive
      onClick={() => onView(certification)}
      className={cn(
        'p-5 sm:p-6 border-border transition-[border-color,background-color,box-shadow] duration-200 h-full flex flex-col justify-between cursor-pointer group select-none',
        accentStyles.border
      )}
    >
      <div>
        {/* 1. Category Label on TOP */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <span
            className={cn(
              'font-mono text-[11px] font-semibold tracking-wide uppercase px-2.5 py-0.5 rounded-full border',
              accentStyles.category
            )}
          >
            {certification.categoryLabel}
          </span>
        </div>

        {/* 2. Certification Name cleanly fitted within up to 2 lines */}
        <h3 className="text-base sm:text-lg font-bold text-text-primary leading-snug group-hover:text-primary transition-colors line-clamp-2 min-h-[2.6rem] sm:min-h-[3rem] flex items-start mb-1.5">
          {certification.title}
        </h3>

        {/* 3. Line 3: Issuer & Date */}
        <div className="flex items-center justify-between text-xs font-mono text-text-subtle mb-3">
          <span className="font-semibold text-text-primary truncate">
            {certification.issuer}
          </span>
          <span className="shrink-0 flex items-center gap-1 text-[11px] text-text-muted">
            <Calendar className="h-3 w-3" />
            <span>{certification.issueDate}</span>
          </span>
        </div>

        {/* 4. Visual Certificate Thumbnail Preview - Clean, authentic white certificate canvas */}
        <div className="relative w-full aspect-[16/10] my-2.5 rounded-lg overflow-hidden border border-border/80 bg-white shadow-sm transition-all group-hover:border-primary/50 group-hover:shadow-md">
          <Image
            src={certification.imagePreviewUrl}
            alt={`${certification.title} certificate preview`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-top transition-transform duration-300 group-hover:scale-[1.02] bg-white"
          />
        </div>

        {/* 5. Exactly 2 short visible lines for description */}
        <p className="text-xs sm:text-sm text-text-muted leading-relaxed line-clamp-2 min-h-[2.5rem] mt-2.5 mb-3">
          {certification.description}
        </p>
      </div>

      <div>
        {/* 6. Skills Row: Equal skills on dedicated line for all certifications */}
        <div className="pt-3 border-t border-border/60">
          <div className="flex flex-wrap items-center gap-1.5 min-h-[3.25rem]">
            {certification.skills.slice(0, 3).map((skill, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded text-[11px] font-mono bg-surface-elevated border border-border/70 text-text-subtle"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* 7. Dedicated View Certificate button moved to next line */}
        <div className="mt-3 pt-1">
          <div
            className={cn(
              'w-full py-2 px-3 rounded-lg border border-border/70 bg-surface-elevated/50 flex items-center justify-center gap-1.5 text-xs font-mono font-semibold transition-all group-hover:border-primary/40 group-hover:bg-surface-elevated',
              accentStyles.button
            )}
          >
            <span>View Certificate</span>
            <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </Card>
  );
}
