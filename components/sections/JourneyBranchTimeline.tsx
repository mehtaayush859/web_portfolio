'use client';

import * as React from 'react';
import Image from 'next/image';
import {
  Briefcase,
  GraduationCap,
  MapPin,
  Calendar,
  ShieldCheck,
  Code2,
  Layers,
  ArrowRight,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import {
  careerExperiences,
  educationExperiences,
  type CareerItem,
  type EducationItem,
} from '@/data/profile';
import dynamic from 'next/dynamic';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

const DetailModal = dynamic(
  () => import('@/components/ui/DetailModal').then((mod) => mod.DetailModal),
  { ssr: false }
);

export function JourneyBranchTimeline() {
  const [filter, setFilter] = React.useState<'all' | 'security' | 'software'>('all');
  const [selectedCareer, setSelectedCareer] = React.useState<CareerItem | null>(null);
  const [selectedEdu, setSelectedEdu] = React.useState<EducationItem | null>(null);
  const careerScrollRef = React.useRef<HTMLDivElement>(null);

  // When filter changes, smoothly reset horizontal track to first card
  React.useEffect(() => {
    if (careerScrollRef.current) {
      careerScrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  }, [filter]);

  const filteredCareer = React.useMemo(() => {
    if (filter === 'all') return careerExperiences;
    return careerExperiences.filter((item) => item.category === filter);
  }, [filter]);

  return (
    <div className="w-full">
      {/* 3D Companion Overview Bar (Optimized: zero backdrop-blur lag, hidden on mobile so Work Experience loads immediately) */}
      <div className="hidden sm:flex items-start gap-4 p-4 sm:p-5 rounded-2xl bg-surface border border-border/80 shadow-md mb-8">
        <div className="relative shrink-0 w-12 h-12 rounded-xl overflow-hidden border border-primary/30 bg-surface-elevated">
          <Image
            src="/robot-mascot-transparent.png"
            alt="Career Companion Mascot"
            fill
            loading="lazy"
            sizes="48px"
            className="object-contain p-1"
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-primary mb-0.5">
            <Sparkles className="h-3.5 w-3.5" />
            <span>AYUSH.AI</span>
          </div>
          <p className="text-xs sm:text-sm text-text-muted leading-relaxed font-sans">
            From offensive penetration testing and SOC engineering to enterprise backend systems and cloud AI security. Explore Ayush&apos;s chronological industry milestones below, followed by his graduate education.
          </p>
        </div>
      </div>

      {/* ----------------- PART 1: WORK EXPERIENCE ----------------- */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          {/* Subheading */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-text-primary">
                Work Experience
              </h3>
              <p className="text-xs sm:text-sm text-text-muted font-mono mt-0.5">
                Software engineering, threat hunting, and automated cloud security
              </p>
            </div>
          </div>

          {/* Interactive Domain Filter (Fits clean in one line) */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface border border-border self-start md:self-auto">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer whitespace-nowrap',
                filter === 'all'
                  ? 'bg-primary text-black font-semibold shadow-sm'
                  : 'text-text-subtle hover:text-text-primary'
              )}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>All Role</span>
            </button>

            <button
              type="button"
              onClick={() => setFilter('security')}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer whitespace-nowrap',
                filter === 'security'
                  ? 'bg-primary text-black font-semibold shadow-sm'
                  : 'text-text-subtle hover:text-text-primary'
              )}
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Security</span>
            </button>

            <button
              type="button"
              onClick={() => setFilter('software')}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer whitespace-nowrap',
                filter === 'software'
                  ? 'bg-primary text-black font-semibold shadow-sm'
                  : 'text-text-subtle hover:text-text-primary'
              )}
            >
              <Code2 className="h-3.5 w-3.5" />
              <span>Software</span>
            </button>
          </div>
        </div>

        {/* Mobile Swipe Gesture Hint Bar */}
        <div className="flex md:hidden items-center justify-center px-1 mb-4 text-xs font-mono text-text-subtle">
          <span className="flex items-center gap-1.5 text-primary font-semibold">
            <span>← Swipe Roles →</span>
          </span>
        </div>

        {/* Chronological Career Container: Touch-Swipe Snap Track on mobile, Vertical Timeline Spine on desktop */}
        <div
          ref={careerScrollRef}
          className="flex md:block overflow-x-auto md:overflow-visible snap-x snap-mandatory swipe-track no-scrollbar gap-4 pt-2 pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 scroll-pl-4 scroll-pr-4 md:relative md:border-l-2 md:border-border/80 md:ml-3 md:sm:ml-5 md:pl-5 md:sm:pl-8 md:space-y-8"
        >
          {filteredCareer.map((item) => {
            const isCurrent = item.employmentType === 'Current Role' || item.period.includes('Present');
            const isAmazon = item.organization.toLowerCase() === 'amazon';

            return (
              <div
                key={item.id}
                className="w-[86vw] max-w-[340px] sm:max-w-[380px] shrink-0 snap-start md:w-full md:max-w-none md:shrink flex flex-col relative group"
              >
                {/* Timeline Node Dot (Desktop only) */}
                <div
                  className={cn(
                    'hidden md:block absolute -left-[27px] sm:-left-[39px] top-6 w-4 h-4 rounded-full border-2 transition-all duration-300',
                    isCurrent
                      ? 'bg-emerald-400 border-surface ring-4 ring-emerald-400/20'
                      : 'bg-surface border-border group-hover:border-primary group-hover:scale-110'
                  )}
                />

                {/* Role Card: Entire Card Clickable */}
                <Card
                  interactive
                  onClick={() => setSelectedCareer(item)}
                  className="p-5 sm:p-6 transition-[border-color,background-color,box-shadow] duration-200 h-full flex flex-col justify-between cursor-pointer group select-none border-border hover:border-primary/50"
                >
                  <div>
                    {/* Top Row: Role Name on top, Period on right */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1.5 sm:gap-3 mb-1.5">
                      <h4 className="text-base sm:text-lg font-bold text-text-primary leading-snug group-hover:text-primary transition-colors flex-1 min-w-0">
                        {item.role}
                      </h4>

                      {/* Period Badge */}
                      <div className="self-start sm:self-auto shrink-0">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-border bg-surface-elevated text-xs font-mono font-medium text-text-primary">
                          <Calendar className="h-3.5 w-3.5 text-primary" />
                          {item.period}
                        </span>
                      </div>
                    </div>

                    {/* Organization, Location & Employment Status */}
                    <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-text-muted mb-3">
                      {isAmazon ? (
                        <span className="font-semibold text-amber-400">
                          Amazon
                        </span>
                      ) : (
                        <span className="font-semibold text-text-primary">
                          {item.organization}
                        </span>
                      )}
                      <span>•</span>
                      <span className="flex items-center gap-1 text-xs text-text-subtle font-mono">
                        <MapPin className="h-3 w-3" />
                        {item.location}
                      </span>
                      <span>•</span>
                      {isCurrent ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Current Role
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-surface-elevated text-text-subtle border border-border shrink-0">
                          {item.employmentType}
                        </span>
                      )}
                    </div>

                    {/* Single Tailored Short Point */}
                    <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                      {item.summary}
                    </p>
                  </div>

                  {/* Card Footer: Top Skills + Sleek Tap Indicator */}
                  <div className="pt-3 mt-4 border-t border-border/60 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 overflow-hidden">
                      {item.tech.slice(0, 2).map((t, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-mono truncate max-w-[120px] border bg-surface-elevated border-border/70 text-text-subtle"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-1 text-[11px] font-mono font-semibold text-primary group-hover:text-primary-hover group-hover:translate-x-0.5 transition-all shrink-0">
                      <span>Details</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      </div>

      {/* ----------------- PART 2: EDUCATION SECTION ----------------- */}
      <div className="mt-16 pt-12 border-t border-border/80">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/20 text-accent">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-text-primary">
              Academic Background
            </h3>
            <p className="text-xs sm:text-sm text-text-muted font-mono mt-0.5">
              Graduate and undergraduate studies in advanced computer science &amp; information technology
            </p>
          </div>
        </div>

        {/* Mobile Swipe Gesture Hint Bar */}
        <div className="flex md:hidden items-center justify-center px-1 mb-4 text-xs font-mono text-text-subtle">
          <span className="flex items-center gap-1.5 text-accent font-semibold">
            <span>← Swipe Academic →</span>
          </span>
        </div>

        {/* 2-Column Academic Container: Native Touch-Swipe Snap on mobile, 2-Col Grid on tablet/desktop */}
        <div className="flex md:grid md:grid-cols-2 gap-4 lg:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory swipe-track no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 pt-2 pb-4 scroll-pl-4 scroll-pr-4">
          {educationExperiences.map((edu) => (
            <div
              key={edu.id}
              className="w-[86vw] max-w-[340px] sm:max-w-[380px] shrink-0 snap-start md:w-auto md:max-w-none md:shrink flex flex-col"
            >
              {/* Education Card: Entire Card Clickable */}
              <Card
                interactive
                onClick={() => setSelectedEdu(edu)}
                className="p-5 sm:p-6 flex flex-col justify-between border-border hover:border-accent/50 transition-[border-color,background-color,box-shadow] duration-200 h-full cursor-pointer group select-none"
              >
                <div>
                  {/* Top Row: Responsive Degree on top, Period on right */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1.5 sm:gap-3 mb-2">
                    <h4 className="text-base sm:text-lg font-bold text-text-primary leading-snug group-hover:text-accent transition-colors">
                      <span className="sm:hidden block">
                        {edu.id === 'seattle-university'
                          ? 'M.S. in Computer Science'
                          : edu.id === 'mit-adt'
                          ? 'B.Tech in Information Technology'
                          : edu.degree}
                      </span>
                      <span className="hidden sm:inline">{edu.degree}</span>
                    </h4>

                    <div className="self-start sm:self-auto shrink-0">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-border bg-surface-elevated text-xs font-mono font-medium text-text-primary">
                        <Calendar className="h-3.5 w-3.5 text-accent" />
                        {edu.period}
                      </span>
                    </div>
                  </div>

                  {/* Institution, Location & Status Badge */}
                  <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-text-muted mb-3">
                    <span className="font-semibold text-text-primary">
                      {edu.institution}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-xs text-text-subtle font-mono">
                      <MapPin className="h-3 w-3" />
                      {edu.location}
                    </span>
                    <span>•</span>
                    <span
                      className={cn(
                        'px-2.5 py-0.5 rounded-full text-[10px] font-mono border shrink-0',
                        edu.status === 'In Progress'
                          ? 'bg-accent/10 text-accent border-accent/20'
                          : 'bg-surface-elevated text-text-muted border border-border'
                      )}
                    >
                      {edu.status}
                    </span>
                  </div>

                  {/* Single Tailored Short Point */}
                  <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                    {edu.summary}
                  </p>
                </div>

                {/* Card Footer: Exactly 2 Top Coursework + Sleek Tap Indicator */}
                <div className="pt-3 mt-4 border-t border-border/60 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 overflow-hidden">
                    {edu.coursework.slice(0, 2).map((course, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-mono bg-surface-elevated border border-border/70 text-text-subtle truncate max-w-[120px]"
                      >
                        {course}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-1 text-[11px] font-mono font-semibold text-accent group-hover:text-accent-hover group-hover:translate-x-0.5 transition-all shrink-0">
                    <span className="hidden sm:inline">Details</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Career Role Detail Pop-up Modal */}
      {selectedCareer && (
        <DetailModal
          isOpen={!!selectedCareer}
          onClose={() => setSelectedCareer(null)}
          title={selectedCareer.role}
          subtitle={selectedCareer.organization}
          status={selectedCareer.employmentType}
          period={selectedCareer.period}
          location={selectedCareer.location}
          metrics={selectedCareer.impactMetrics}
          bullets={selectedCareer.modalBullets || selectedCareer.bullets.slice(0, 3)}
          tags={selectedCareer.tech.slice(0, 4)}
          tagsLabel="Technologies & Tools"
        />
      )}

      {/* Education Detail Pop-up Modal */}
      {selectedEdu && (
        <DetailModal
          isOpen={!!selectedEdu}
          onClose={() => setSelectedEdu(null)}
          title={selectedEdu.degree}
          subtitle={selectedEdu.institution}
          badge={selectedEdu.id === 'seattle-university' ? 'Graduate Degree' : 'Undergraduate Degree'}
          badgeVariant="accent"
          status={selectedEdu.status}
          period={selectedEdu.period}
          location={selectedEdu.location}
          bullets={selectedEdu.modalHighlights || selectedEdu.researchHighlights.slice(0, 3)}
          tags={selectedEdu.coursework.slice(0, 4)}
          tagsLabel="Core Coursework & Specialization"
        />
      )}
    </div>
  );
}
