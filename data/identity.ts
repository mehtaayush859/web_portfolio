// The few profile fields that client components in the startup bundle need (navbar, mobile
// menu, terminal). Kept separate from profile.ts so the full profile text (story, principles,
// stats) stays server-rendered instead of shipping as JavaScript. profile.ts reuses these.

export const identity = {
  name: 'Ayush Mehta',
  monogram: 'AM',
  heroBio:
    'I design backend services and data pipelines that scale, and I test them the way an attacker would. Two years shipping Python services in production, plus hands-on security work across pentesting, SOC operations and AI-agent testing.',
  email: 'mehtaayush251@gmail.com',
  location: 'Seattle, WA, USA',
  socials: {
    github: 'https://github.com/mehtaayush859',
    linkedin: 'https://www.linkedin.com/in/ayushmehta44',
  },
  resume: {
    url: '/Ayush_Mehta_Resume.pdf',
    filename: 'Ayush_Mehta_Resume.pdf',
  },
} as const;
