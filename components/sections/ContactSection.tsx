import * as React from 'react';
import { Mail, MapPin, Github, Linkedin, Clock, ExternalLink } from 'lucide-react';
import { profileData } from '@/data/profile';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ContactForm } from '@/components/sections/ContactForm';

function maskEmail(email: string): string {
  const [user, domain] = email.split('@');
  if (!user || !domain) return email;
  return `${user.slice(0, 3)}*****@${domain}`;
}

// Server Component: header and contact details are static HTML; ContactForm is the client island.
export function ContactSection() {
  const maskedEmail = maskEmail(profileData.contact.email);

  return (
    <section id="contact" className="relative py-24 sm:py-32 border-t border-border/60 bg-surface/30">
      <Container size="lg">
        <SectionHeading
          index="06"
          eyebrow="Contact"
          align="center"
          title={
            <>
              Let&apos;s build something <span className="font-display text-primary">secure</span>.
            </>
          }
          description="Hiring for a software or security engineering role, or want to talk shop? Send a message and I'll reply within a day."
        />

        {/* Unified Compact Contact Console */}
        <div className="max-w-5xl mx-auto">
          <div className="rounded-2xl border border-border bg-surface shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Left Column: Direct Connect & Info */}
              <div className="lg:col-span-5 p-6 sm:p-8 bg-surface-elevated/40 border-b lg:border-b-0 lg:border-r border-border flex flex-col justify-between">
                <div>
                  {/* Status Indicator */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-mono text-primary mb-6">
                    <span className="relative flex h-2 w-2">
                      <span className="md:animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                    </span>
                    <span>Open to SWE & Security Roles</span>
                  </div>

                  <h3 className="text-lg font-bold text-text-primary mb-2">
                    Contact Information
                  </h3>
                  <p className="text-xs text-text-muted mb-6 leading-relaxed">
                    Always happy to connect regarding engineering challenges, full-time roles, or technical discussions.
                  </p>

                  {/* Direct Email */}
                  <div className="p-4 rounded-xl border border-border bg-surface mb-4">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-text-subtle flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5 text-primary" />
                        Direct Email
                      </span>
                      <a
                        href={`mailto:${profileData.contact.email}`}
                        className="inline-flex items-center gap-1 min-h-7 text-[11px] font-mono text-primary hover:text-primary-hover transition-colors px-2.5 py-1 rounded bg-primary/10 hover:bg-primary/20 cursor-pointer"
                        title="Open directly in email client"
                      >
                        <span>Send Email</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                    <p className="text-sm font-semibold text-text-primary">
                      {maskedEmail}
                    </p>
                    <p className="text-xs text-text-muted mt-0.5">
                      Click &quot;Send Email&quot; to reach out
                    </p>
                  </div>

                  {/* Location */}
                  <div className="p-4 rounded-xl border border-border bg-surface mb-6">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-text-subtle flex items-center gap-1.5 mb-1.5">
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      Location
                    </span>
                    <p className="text-sm font-semibold text-text-primary">
                      {profileData.contact.location}
                    </p>
                    <p className="text-xs text-text-muted mt-0.5">
                      Open to Relocation & Remote Roles
                    </p>
                  </div>
                </div>

                {/* Socials & SLA */}
                <div className="pt-4 border-t border-border/60">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-text-subtle block mb-2.5">
                    Connect Profiles
                  </span>
                  <div className="grid grid-cols-2 gap-2.5 mb-4">
                    <a
                      href={profileData.contact.socials.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-border bg-surface text-xs font-medium text-text-primary hover:border-primary/50 hover:text-primary transition-colors min-h-[40px]"
                    >
                      <Github className="h-4 w-4" />
                      <span>GitHub</span>
                    </a>
                    <a
                      href={profileData.contact.socials.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-border bg-surface text-xs font-medium text-text-primary hover:border-primary/50 hover:text-primary transition-colors min-h-[40px]"
                    >
                      <Linkedin className="h-4 w-4" />
                      <span>LinkedIn</span>
                    </a>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-text-subtle">
                    <Clock className="h-3.5 w-3.5 text-primary/80 shrink-0" />
                    <span>Typically responds within 24 hours</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Direct Message Form (client island) */}
              <ContactForm />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
