import type { Lens } from './lens';
import { identity } from './identity';

export interface ProfileData {
  name: string;
  monogram: string;
  tagline: string;
  /** Short role line used in titles and the footer. */
  role: string;
  heroBio: string;
  /** First-person story for the About section (facts only; mirrors the experience data). */
  story: string[];
  /** "Right now" cards in the About section. */
  now: { label: string; value: string; detail: string }[];
  /** How I work: short principles shown in the About section. */
  principles: { title: string; description: string }[];
  /** Headline stats in the hero; an even mix of build and secure results. */
  heroStats: { value: string; label: string; source: string; lens: Lens }[];
  contact: {
    email: string;
    location: string;
    locationNote: string;
    availability: {
      status: string;
      percentage: string;
      description: string;
      updated: string;
    };
    socials: {
      github: string;
      linkedin: string;
    };
  };
  resume: {
    url: string;
    filename: string;
  };
}

export const profileData: ProfileData = {
  name: identity.name,
  monogram: identity.monogram,
  tagline: 'Software & Security Engineer',
  role: 'Software Engineer · Security Engineer',
  heroBio: identity.heroBio,
  story: [
    "I started on the offensive side: penetration testing web apps and APIs, and running SOC shifts. Then I spent two years at Resilinc.ai building the backend services, pipelines and dashboards that enterprise customers relied on every day.",
    "That mix shapes how I work. I build systems the way an attacker would read them: validated inputs, least privilege, logs worth reading, and tests that run on every change.",
    "Today I'm finishing an M.S. in Computer Science at Seattle University while working as a Student Cybersecurity Analyst. This summer at Amazon I built an adversarial-testing framework for cloud-hosted AI agents.",
  ],
  now: [
    { label: 'Studying', value: 'M.S. Computer Science', detail: 'Seattle University · graduating Dec 2026' },
    { label: 'Working', value: 'Student Cybersecurity Analyst', detail: 'CI/CD security scanning & incident response' },
    { label: 'Looking for', value: 'SWE & Security Engineer roles', detail: 'Full-time · open to relocation & remote' },
  ],
  principles: [
    { title: 'Secure by default', description: 'Parameterized queries, least-privilege access and validated inputs from the first commit, not the last review.' },
    { title: 'Automate the repetitive', description: 'If a person does it twice, a pipeline should do it next time: scans, tests, triage and deploys.' },
    { title: 'Measure the outcome', description: 'Latency, error rates, false positives. Every change should move a number someone cares about.' },
  ],
  heroStats: [
    { value: '10K+', label: 'users on services I scaled', source: 'Resilinc.ai', lens: 'build' },
    { value: '500K+', label: 'records automated monthly', source: 'Resilinc.ai', lens: 'build' },
    { value: '−35%', label: 'vulnerabilities reaching production', source: 'Seattle University', lens: 'secure' },
    { value: '+85%', label: 'AI-agent threat coverage', source: 'Amazon', lens: 'secure' },
  ],
  contact: {
    email: identity.email,
    location: identity.location,
    locationNote: 'Available for remote work worldwide',
    availability: {
      status: 'Open to Opportunities',
      percentage: '100% Availability',
      description:
        'Currently available for freelance projects and full-time opportunities.',
      updated: 'March 2025',
    },
    socials: identity.socials,
  },
  resume: identity.resume,
};
