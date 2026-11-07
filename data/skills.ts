import type { Lens } from './lens';

// ---------------------------------------------------------------------------
// Toolkit (redesign): skills grouped by the two lenses, each with where it was used.
// "provenIn" only lists roles/projects whose own data mentions that work.
// ---------------------------------------------------------------------------
export interface ToolkitGroup {
  id: string;
  title: string;
  lenses: Lens[];
  summary: string;
  areas: { name: string; items: string[] }[];
  provenIn: string[];
}

export const toolkit: ToolkitGroup[] = [
  {
    id: 'build',
    title: 'Build',
    lenses: ['build'],
    summary: 'Backend services, APIs and the interfaces on top of them.',
    areas: [
      { name: 'Languages', items: ['Python', 'Java', 'TypeScript', 'JavaScript', 'Go', 'C++'] },
      { name: 'Backend', items: ['Flask', 'Django', 'FastAPI', 'Node.js & Express', 'Spring Boot', 'REST & gRPC', 'Async I/O'] },
      { name: 'Frontend', items: ['React', 'Next.js', 'Angular', 'Tailwind CSS'] },
    ],
    provenIn: ['Resilinc.ai', 'EchoJournal', 'Postal Address Service'],
  },
  {
    id: 'secure',
    title: 'Secure',
    lenses: ['secure'],
    summary: 'Finding weaknesses, detecting attacks and testing AI agents.',
    areas: [
      { name: 'AppSec & testing', items: ['OWASP Top 10', 'Burp Suite', 'OWASP ZAP', 'API pentesting', 'CVSS reporting'] },
      { name: 'Detection & response', items: ['SIEM', 'EDR', 'Microsoft Defender', 'Darktrace', 'Entra ID', 'Log correlation'] },
      { name: 'Cloud & AI security', items: ['Adversarial testing', 'AWS IAM', 'AWS SigV4', 'CloudWatch', 'CI/CD AppSec'] },
    ],
    provenIn: ['Amazon', 'Seattle University', 'S3 Infotech', 'Virtual Testing Foundation', 'SecuScan', 'ThreatHunter'],
  },
  {
    id: 'platform',
    title: 'Cloud & Data',
    lenses: ['build', 'secure'],
    summary: 'Where both halves run: infrastructure, pipelines and storage.',
    areas: [
      { name: 'Cloud & DevOps', items: ['AWS', 'GCP', 'Azure', 'Docker', 'Kubernetes', 'GitLab CI/CD'] },
      { name: 'Data', items: ['PostgreSQL', 'MongoDB', 'Redis', 'MySQL', 'DynamoDB', 'SQL optimization'] },
    ],
    provenIn: ['Resilinc.ai', 'Amazon', 'Postal Address Service', 'SecuScan'],
  },
];
