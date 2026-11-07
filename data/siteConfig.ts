const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://amehta.vercel.app';

export const siteConfig = {
  name: 'Ayush Mehta',
  title: 'Ayush Mehta | Software & Security Engineer',
  description:
    'Ayush Mehta is a software and security engineer in Seattle: backend services and data pipelines at scale, plus application security, detection & response and AI-agent security testing.',
  url: siteUrl,
  links: {
    github: 'https://github.com/mehtaayush859',
    linkedin: 'https://www.linkedin.com/in/ayushmehta44',
    email: 'mehtaayush251@gmail.com',
  },
  navLinks: [
    { name: 'Work', href: '#experience' },
    { name: 'Projects', href: '#projects' },
    { name: 'Toolkit', href: '#skills' },
    { name: 'About', href: '#about' },
    { name: 'Credentials', href: '#credentials' },
    { name: 'Contact', href: '#contact' },
  ],
  targetQueries: [
    'Ayush Mehta',
    'Ayush Mehta Software Engineer',
    'Ayush Mehta Seattle',
    'Ayush Mehta Portfolio',
    'Ayush Mehta Cybersecurity',
  ],
} as const;
