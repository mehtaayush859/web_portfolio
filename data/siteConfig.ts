const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://amehta.vercel.app';

export const siteConfig = {
  name: 'Ayush Mehta',
  title: 'Ayush Mehta | Software Engineer & Cybersecurity Enthusiast',
  description:
    "Explore Ayush Mehta's portfolio showcasing software engineering, cloud architecture, backend systems, and cybersecurity projects.",
  url: siteUrl,
  ogImage: `${siteUrl}/og-image.png`,
  links: {
    github: 'https://github.com/mehtaayush859',
    linkedin: 'https://www.linkedin.com/in/ayushmehta44',
    email: 'mehtaayush251@gmail.com',
  },
  navLinks: [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Projects', href: '#projects' },
    { name: 'Skills', href: '#skills' },
    { name: 'Certifications', href: '#certifications' },
    { name: 'Contact', href: '#contact' },
  ],
  targetQueries: [
    'Ayush Mehta',
    'Ayush Mehta Software Engineer',
    'Ayush Mehta Seattle',
    'Ayush Mehta Portfolio',
    'Ayush Mehta Cybersecurity',
  ],
  features: {
    enable3DScene: false,
    enableRealtimeStatus: false,
  },
} as const;
