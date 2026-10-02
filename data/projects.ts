export interface Project {
  id: string;
  title: string;
  category: 'Full-Stack' | 'Security' | 'Cloud & Systems';
  tagline: string;
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
