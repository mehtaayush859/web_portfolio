import type { Lens } from './lens';

export interface Project {
  id: string;
  title: string;
  category: 'Full-Stack' | 'Security' | 'Cloud & Systems';
  tagline: string;
  /** What problem the project addresses, in one sentence. */
  problem: string;
  /** Simplified data flow, rendered as an architecture strip on the card. */
  pipeline: string[];
  lenses: Lens[];
  theme: 'emerald' | 'cyan' | 'amber' | 'violet';
  tags: string[];
  modalHighlights?: string[];
  github: string;
  demo?: string;
}

export const projectsData: Project[] = [
  {
    id: 'echojournal-mood-booster',
    title: 'EchoJournal — Mood & Emotion Tracker',
    category: 'Full-Stack',
    tagline:
      'A full-stack SaaS platform empowering users to log daily entries, track emotional health patterns, and reflect with automated test validation.',
    problem: 'People who journal rarely see patterns in how they feel over time.',
    pipeline: ['Angular UI', 'Express API', 'JWT auth', 'MongoDB'],
    lenses: ['build'],
    theme: 'emerald',
    tags: ['Angular', 'Node.js', 'Express', 'MongoDB', 'REST APIs'],
    modalHighlights: [
      'Modular full-stack SaaS architecture with Angular client, Express REST API, and MongoDB persistence.',
      'Real-time emotion tracking algorithms and automated test suites for reliable mood logging.',
      'Protected user journal data with secure JWT authentication and encrypted session storage.',
    ],
    github: 'https://github.com/mehtaayush859/echoJournal_mood_booster',
  },
  {
    id: 'secu-scanner',
    title: 'SecuScan — Vulnerability & Audit Engine',
    category: 'Security',
    tagline:
      'Cross-platform security auditing engine integrating multi-threaded port discovery, NVD CVE feeds, and OWASP Top 10 header compliance.',
    problem: 'Host security checks on small teams are manual, slow and inconsistent.',
    pipeline: ['Target', 'Async Nmap scan', 'FastAPI engine', 'NVD CVE feed', 'CVSS report'],
    lenses: ['secure', 'build'],
    theme: 'cyan',
    tags: ['Python', 'FastAPI', 'React', 'Nmap', 'Docker', 'OWASP'],
    modalHighlights: [
      'High-performance asynchronous auditing engine built with FastAPI and Nmap bindings.',
      'Automated CVE vulnerability enrichment mapped to live National Vulnerability Database feeds.',
      'Interactive executive security reports with CVSS risk prioritization and remediation checklists.',
    ],
    github: 'https://github.com/mehtaayush859/secu-scanner',
  },
  {
    id: 'threat-hunter-analyzer',
    title: 'ThreatHunter — SIEM Telemetry & Alerting',
    category: 'Security',
    tagline:
      'Lightweight SIEM log pipeline analyzing syslogs and web telemetry in real time to detect brute-force attacks and privilege escalations.',
    problem: 'Brute-force and privilege-escalation signals hide in noisy system logs.',
    pipeline: ['Syslog & auth logs', 'Parser', 'Correlation rules', 'Alerts'],
    lenses: ['secure'],
    theme: 'amber',
    tags: ['Python', 'Docker', 'SIEM', 'Log Analysis', 'Threat Detection'],
    modalHighlights: [
      'Lightweight SIEM log pipeline correlating syslog and auth telemetry in real time.',
      'Detects brute-force spikes, credential stuffing, and privilege escalation patterns.',
      'Containerized in lightweight Docker containers with low memory footprint for easy deployment.',
    ],
    github: 'https://github.com/mehtaayush859/threat-hunter-analyzer',
  },
  {
    id: 'postal-address-handling-system',
    title: 'Postal Address Verification Microservice',
    category: 'Cloud & Systems',
    tagline:
      'Enterprise address validation backend orchestrated in containerized clusters with high-concurrency relational queries.',
    problem: 'Address lookups have to stay fast and correct under heavy concurrent load.',
    pipeline: ['Client', 'Spring Boot API', 'PostgreSQL', 'Kubernetes'],
    lenses: ['build'],
    theme: 'violet',
    tags: ['Java', 'Spring Boot', 'Kubernetes', 'Docker', 'PostgreSQL'],
    modalHighlights: [
      'Enterprise address verification backend built with Java and Spring Boot.',
      'Optimized PostgreSQL relational queries for high-concurrency lookup volumes.',
      'Orchestrated with Kubernetes manifests for automated clustering, scaling, and resilience.',
    ],
    github: 'https://github.com/mehtaayush859/Web-Based-Postal-Address-Handling-System',
  },
];

export const githubProfileUrl = 'https://github.com/mehtaayush859?tab=repositories';
