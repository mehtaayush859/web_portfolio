import type { Lens } from './lens';

// Work and education history. Kept out of profile.ts on purpose: client components in the
// startup bundle import profileData, and webpack keeps every export of a module that any
// chunk uses. Living here, this text only reaches the browser in the lazy assistant chunk.

export interface CareerMetric {
  value: string;
  label: string;
}

export interface CareerItem {
  id: string;
  role: string;
  organization: string;
  period: string;
  location: string;
  type: 'work';
  employmentType: 'Current Role' | 'Full-time' | 'Full-time Internship' | string;
  category: 'security' | 'software';
  /** Which story this role supports; drives the lens highlight. */
  lenses: Lens[];
  /** Optional short tag that makes a role stand out (e.g. "Big Tech"). Use sparingly. */
  highlight?: string;
  badge: string;
  domain: string;
  summary: string;
  impactMetrics: CareerMetric[];
  bullets: string[];
  modalBullets?: string[];
  tech: string[];
  coursework?: never;
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  role: string; // compatibility alias with degree
  organization: string; // compatibility alias with institution
  period: string;
  location: string;
  type: 'education';
  status: 'In Progress' | 'Conferred';
  badge: string;
  focusArea: string;
  summary: string;
  coursework: string[];
  modalHighlights?: string[];
  researchHighlights: string[];
  bullets: string[]; // compatibility alias with researchHighlights
  tech: string[];
  impactMetrics?: never;
}


export const careerExperiences: CareerItem[] = [
  {
    id: 'seattle-cyber-analyst',
    role: 'Student Cybersecurity Analyst',
    organization: 'Seattle University',
    period: 'Feb 2025 – Present',
    location: 'Seattle, WA',
    type: 'work',
    employmentType: 'Current Role',
    category: 'security',
    lenses: ['secure'],
    badge: 'SOC OPERATIONS // THREAT HUNTING',
    domain: 'Vulnerability Remediation & Automated Security Operations',
    summary:
      'Leading campus security monitoring, automated CI/CD code scanning, and incident investigation across university identity and endpoint infrastructure.',
    impactMetrics: [
      { value: '-35%', label: 'Prod Vulnerabilities' },
      { value: '-40%', label: 'Triage Time Cut' },
      { value: '50+', label: 'Critical Fixes' },
    ],
    bullets: [
      'Embedded automated vulnerability and secure-code scanning into CI/CD workflows across systems, reducing vulnerabilities reaching production by 35% and strengthening secure-development practices.',
      'Investigated security alerts and compromised-account incidents using Microsoft Defender, Darktrace, SIEM data, and Entra ID auditing, reducing false positives by 30% across university environments.',
      'Developed Python-based automation pipelines to correlate authentication and endpoint logs, detect anomalous activity, and reduce manual triage time by 40% during security investigations.',
      'Remediated 50+ critical vulnerabilities by coordinating with IT and compliance teams to validate findings, prioritize risk-based fixes, and strengthen security controls across campus technology.',
    ],
    modalBullets: [
      'Automated CI/CD security code scanning across campus workflows, reducing production vulnerabilities by 35%.',
      'Investigated threat alerts using Microsoft Defender and Darktrace SIEM telemetry, reducing triage latency by 40%.',
      'Remediated 50+ critical vulnerabilities across university technology stacks in coordination with IT compliance.',
    ],
    tech: ['Microsoft Defender', 'Darktrace', 'SIEM Data', 'Entra ID', 'Python Automation', 'CI/CD AppSec', 'Log Correlation', 'Vulnerability Remediation'],
  },
  {
    id: 'amazon-security',
    role: 'Security Engineer Intern',
    organization: 'Amazon',
    highlight: 'Big Tech',
    period: 'Jun 2026 – Sep 2026',
    location: 'Seattle, WA',
    type: 'work',
    employmentType: 'Full-time Internship',
    category: 'security',
    lenses: ['secure', 'build'],
    badge: 'AI AGENT SECURITY // CLOUD',
    domain: 'Cloud AI Security & Dynamic Adversarial Testing',
    summary:
      'Engineered automated adversarial testing, AWS SigV4 request verification, and CloudWatch log validation for cloud-hosted AI agents.',
    impactMetrics: [
      { value: '+85%', label: 'Threat Coverage' },
      { value: '< 5 Mins', label: 'Review Latency' },
      { value: '95%', label: 'Tests Automated' },
    ],
    bullets: [
      'Built and deployed a Python adversarial-testing framework for AI agents, replacing manual review with repeatable dynamic tests and reducing security-review time from days to minutes.',
      'Integrated AWS SigV4 request signing, IAM authentication, test execution, and results collection into one workflow, automating 95% of testing for cloud-hosted AI-agent environments.',
      'Developed dynamic adversarial test cases for unauthorized tool and API use, boundary violations, and privilege escalation, expanding AI-agent threat coverage by more than 85%.',
      'Validated detected issues against actual agent behavior and Amazon CloudWatch logs, reducing false-positive findings from 60% to 10% before reporting results to engineers.',
    ],
    modalBullets: [
      'Built dynamic Python adversarial testing framework for AI agents, cutting security review latency from days to minutes.',
      'Automated 95% of test execution with AWS SigV4 request signing, IAM authentication, and CloudWatch log validation.',
      'Expanded agent threat coverage by 85%+ with targeted tests for API boundary violations and privilege escalation.',
    ],
    tech: ['Python', 'AWS SigV4', 'IAM', 'CloudWatch', 'Adversarial Testing', 'AI Security', 'API Hardening'],
  },
  {
    id: 'resilinc-swe',
    role: 'Software Engineer',
    organization: 'Resilinc.ai',
    period: 'Sep 2022 – Aug 2024',
    location: 'Pune, IN',
    type: 'work',
    employmentType: 'Full-time',
    category: 'software',
    lenses: ['build'],
    badge: 'HIGH-CONCURRENCY // 10K+ USERS',
    domain: 'Enterprise Backend Systems & Supply Chain Risk Analytics',
    summary:
      'Architected high-throughput backend services, optimized database performance, and built real-time analytics dashboards.',
    impactMetrics: [
      { value: '10K+', label: 'Active Users Scaled' },
      { value: '60%', label: 'Processing Speed Gain' },
      { value: '-30%', label: 'SQL Latency Cut' },
    ],
    bullets: [
      'Led design reviews and built a Python and Flask assessment module with validated multilingual data handling, automating 1,000+ file downloads per day and reducing processing time by 60%.',
      'Designed and deployed a high-performance Python framework using Redis caching and asynchronous I/O, reducing error rates by 40% while scaling traffic capacity 1.5x for 10,000+ users.',
      'Refactored SQL queries with parameterization, indexing, and caching to reduce injection risk, cut compute time by 30%, and improve dashboard responsiveness for enterprise users.',
      'Enhanced a real-time supply-chain risk analytics dashboard with React and MongoDB, enforcing role-based access controls and improving decision-making efficiency by 35% for 80+ clients.',
    ],
    modalBullets: [
      'Scaled Python/Flask backend with Redis caching and async I/O to support 10,000+ users, cutting error rates by 40%.',
      'Refactored SQL queries with indexing and caching, cutting compute latency by 30% and eliminating injection vectors.',
      'Enhanced real-time supply chain risk dashboards with React and MongoDB, improving analytics speed for 80+ enterprise clients.',
    ],
    tech: ['Python', 'Flask', 'Redis', 'React', 'MongoDB', 'SQL Optimization', 'Async I/O', 'RBAC'],
  },
  {
    id: 'resilinc-python',
    role: 'Python Developer',
    organization: 'Resilinc.ai',
    period: 'Mar 2022 – Aug 2022',
    location: 'Pune, IN',
    type: 'work',
    employmentType: 'Full-time Internship',
    category: 'software',
    lenses: ['build'],
    badge: 'PIPELINE AUTOMATION // 500K RECORDS',
    domain: 'Data Ingestion & Microservices Reliability',
    summary:
      'Automated high-volume real-time data pipelines, containerized microservices, and optimized web-service uptime.',
    impactMetrics: [
      { value: '500K+', label: 'Monthly Records Filtered' },
      { value: '2h → 30m', label: 'Downtime Reduced' },
      { value: '95%', label: 'Data Accuracy' },
    ],
    bullets: [
      'Developed Python scripts integrated with REST APIs to automate data workflows, filtering more than 500,000 real-time records monthly and improving data accuracy to 95% across data workflows.',
      'Containerized modular microservices using Docker and applied scalable design patterns with comprehensive documentation, improving onboarding consistency and accelerating deployment.',
      'Diagnosed high-impact web-service bottlenecks through performance profiling and SQL optimization, reducing downtime from two hours to 30 minutes and improving service reliability.',
      'Streamlined delivery across five departments by automating Jira, Confluence, and GitLab CI/CD workflows, improving milestone-delivery efficiency by 30%.',
    ],
    modalBullets: [
      'Automated real-time ETL pipelines processing 500,000+ monthly records with 95%+ data accuracy standards.',
      'Streamlined daily data ingestion by replacing manual steps with Python automation, reducing runs from 2h to 30m.',
      'Containerized microservices using Docker and implemented robust HTTP retry logic to minimize network downtime.',
    ],
    tech: ['Python', 'Docker', 'REST APIs', 'SQL Profiling', 'GitLab CI/CD', 'Workflow Automation'],
  },
  {
    id: 's3-infotech-cyber',
    role: 'Cyber Security Intern',
    organization: 'S3 Infotech Pvt Ltd',
    period: 'Jan 2022 – Apr 2022',
    location: 'Pune, IN',
    type: 'work',
    employmentType: 'Full-time Internship',
    category: 'security',
    lenses: ['secure'],
    badge: 'NETWORK DEFENSE // SOC ANALYSIS',
    domain: 'SIEM Packet Analysis & Incident Response Automation',
    summary:
      'Monitored security events via SIEM/EDR, analyzed network packet flows, and built PowerShell/Bash incident automation scripts.',
    impactMetrics: [
      { value: '-35%', label: 'Remediation Timeline' },
      { value: 'NIST', label: 'Framework Compliance' },
      { value: 'SOC', label: 'Shift Automation' },
    ],
    bullets: [
      'Monitored security alerts from SIEM/EDR platforms, performed TCP/IP packet inspection and flow analysis, and escalated complex threats to senior engineers for deeper investigation.',
      'Assisted in firewall and IDS rule reviews, detecting routing anomalies and misconfigurations, directly contributing to enhanced network security posture and reduced attack surface.',
      'Built Bash and PowerShell automation scripts to standardize incident response actions, reducing remediation timelines for recurring threats by 35% across multiple SOC shifts.',
      'Maintained compliance dashboards and incident documentation aligned with NIST frameworks, preparing regulatory artifacts and supporting external audit readiness.',
    ],
    modalBullets: [
      'Monitored SIEM/EDR telemetry and performed TCP/IP packet inspection to isolate network anomalies.',
      'Built Bash and PowerShell scripts to automate incident response, reducing remediation timelines by 35%.',
      'Audited firewall and IDS rules and prepared compliance documentation aligned with NIST cybersecurity frameworks.',
    ],
    tech: ['SIEM', 'EDR', 'TCP/IP Flow Analysis', 'Firewalls', 'IDS Rules', 'Bash', 'PowerShell', 'NIST Framework'],
  },
  {
    id: 'vtf-pentest',
    role: 'Penetration Tester',
    organization: 'Virtual Testing Foundation',
    period: 'Oct 2021 – Jan 2022',
    location: 'Remote',
    type: 'work',
    employmentType: 'Full-time Internship',
    category: 'security',
    lenses: ['secure'],
    badge: 'OFFENSIVE APPSEC // OWASP TOP 10',
    domain: 'Adversary Simulation, API Pentesting & CVSS Reporting',
    summary:
      'Executed web app and API penetration testing against OWASP Top 10 vulnerabilities, created containerized attack labs, and authored remediation reports.',
    impactMetrics: [
      { value: 'OWASP', label: 'Top 10 Exploitation' },
      { value: 'CVSS', label: 'Risk-Scored Reports' },
      { value: 'Labs', label: 'Dockerized TTPs' },
    ],
    bullets: [
      'Conducted application and API penetration tests using Burp Suite and OWASP ZAP simulating OWASP Top 10 exploits and documenting findings with risk-based remediation guidance.',
      'Developed containerized labs to simulate TTPs including credential theft, privilege escalation, and misconfigured routing exploitation, enhancing team incident response training.',
      'Authored PSIRT-style vulnerability reports with CVSS scoring and remediation guidance, aligning with vulnerability management processes and supporting developer collaboration.',
      'Built reusable red team training modules and automation scripts, scaling adversary simulation scenarios for SOC analyst training and strengthening response validation.',
    ],
    modalBullets: [
      'Conducted web app and API penetration tests using Burp Suite and OWASP ZAP across OWASP Top 10 vulnerabilities.',
      'Developed Dockerized exploit simulation labs covering credential theft, routing bypasses, and privilege escalation.',
      'Authored PSIRT-style vulnerability reports with CVSS scoring and remediation playbooks for development teams.',
    ],
    tech: ['Burp Suite', 'OWASP ZAP', 'OWASP Top 10', 'API Testing', 'Docker Labs', 'CVSS Scoring', 'Privilege Escalation', 'Red Teaming'],
  },
];

export const educationExperiences: EducationItem[] = [
  {
    id: 'seattle-university',
    degree: 'Master of Science in Computer Science',
    institution: 'Seattle University',
    role: 'Master of Science in Computer Science',
    organization: 'Seattle University',
    period: 'Sep 2024 – Dec 2026',
    location: 'Seattle, WA',
    type: 'education',
    status: 'In Progress',
    badge: 'GRADUATE DEGREE // ADVANCED CS',
    focusArea: 'Advanced Software Engineering, Cloud Computing & Systems Verification',
    summary:
      'Master of Science in Computer Science with advanced studies in Software Architecture & Design, Software as a Service (SaaS), and Software Testing & Debugging.',
    coursework: [
      'Distributed Systems',
      'Software as a Service (SAAS)',
      'Software Architecture & Design',
      'Software Testing & Debugging',
    ],
    modalHighlights: [
      'Specialized in advanced distributed systems, high-throughput cloud architectures, and software verification.',
      'Hands-on engineering of scalable microservices, gRPC telemetry, and cloud-native security controls.',
      'Active campus security leadership as Student Cybersecurity Analyst in SOC operations.',
    ],
    researchHighlights: [],
    bullets: [],
    tech: ['Software Architecture', 'SaaS', 'Cloud Systems', 'Microservices', 'Software Testing', 'Python'],
  },
  {
    id: 'mit-adt',
    degree: 'Bachelor of Technology in Information Technology',
    institution: 'MIT ADT University',
    role: 'Bachelor of Technology in Information Technology',
    organization: 'MIT ADT University',
    period: 'Sep 2019 – Aug 2022',
    location: 'Pune, IN',
    type: 'education',
    status: 'Conferred',
    badge: 'UNDERGRADUATE DEGREE // CORE IT',
    focusArea: 'Core Computer Science, Information Systems & Applied Computing',
    summary:
      'Bachelor of Technology in Information Technology with comprehensive coursework in Data Structures, Algorithms, Databases, and Machine Learning.',
    coursework: [
      'Data Structures and Algorithms',
      'Relational Databases',
      'Machine Learning',
      'Artificial Intelligence',
    ],
    modalHighlights: [
      'Core engineering foundations in algorithms, operating systems, and object-oriented architecture.',
      'Practical coursework in network security, database management, and web technologies.',
      'Led technical workshops, hackathons, and competitive programming initiatives.',
    ],
    researchHighlights: [],
    bullets: [],
    tech: ['Data Structures', 'Algorithms', 'Java', 'Python', 'Relational Databases', 'Machine Learning'],
  },
];
