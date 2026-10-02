export type SkillCategory =
  | 'languages'
  | 'backend'
  | 'cloud'
  | 'security'
  | 'database'
  | 'frontend';

export interface SkillDomain {
  id: string;
  title: string;
  category: SkillCategory;
  accent: 'emerald' | 'violet' | 'indigo' | 'cyan' | 'amber' | 'teal';
  skills: string[];
}

export const skillDomains: SkillDomain[] = [
  {
    id: 'languages',
    title: 'Programming Languages',
    category: 'languages',
    accent: 'emerald',
    skills: ['Python', 'Java', 'TypeScript', 'JavaScript', 'C++', 'Go (Golang)'],
  },
  {
    id: 'backend',
    title: 'Backend & Systems',
    category: 'backend',
    accent: 'violet',
    skills: ['Node.js & Express', 'Flask & Django', 'RESTful APIs', 'gRPC Services', 'Microservices', 'Async Concurrency'],
  },
  {
    id: 'cloud',
    title: 'Cloud & Infrastructure',
    category: 'cloud',
    accent: 'indigo',
    skills: ['AWS Cloud', 'Google Cloud (GCP)', 'Microsoft Azure', 'Docker Containers', 'Kubernetes (K8s)', 'CI/CD Automation'],
  },
  {
    id: 'security',
    title: 'Cybersecurity',
    category: 'security',
    accent: 'cyan',
    skills: ['Adversarial Testing', 'Cloud Security & IAM', 'OWASP Top 10', 'SIEM & Telemetry', 'Vulnerability Auditing', 'Network Security'],
  },
  {
    id: 'database',
    title: 'Databases & Storage',
    category: 'database',
    accent: 'amber',
    skills: ['PostgreSQL', 'MongoDB', 'Redis Caching', 'MySQL', 'Amazon DynamoDB', 'SQL Optimization'],
  },
  {
    id: 'frontend',
    title: 'Frontend Development',
    category: 'frontend',
    accent: 'teal',
    skills: ['React.js', 'Next.js', 'Angular', 'Tailwind CSS', 'TypeScript UI', 'Responsive Design'],
  },
];

// Backwards compatibility exports
export interface Skill {
  name: string;
  category: SkillCategory;
  level: number;
  initials: string;
}

export const skillCategories = [
  { id: 'all', label: 'All Skills' },
] as const;

export const skillsData: Skill[] = skillDomains.flatMap((domain) =>
  domain.skills.map((s) => ({
    name: s,
    category: domain.category,
    level: 5,
    initials: s.slice(0, 2),
  }))
);
