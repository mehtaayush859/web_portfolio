import { profileData } from '@/data/profile';
import { siteConfig } from '@/data/siteConfig';

export function getStructuredData() {
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profileData.name,
    url: siteConfig.url,
    image: `${siteConfig.url}/profile.jpg`,
    jobTitle: 'Software Engineer',
    description: profileData.heroBio,
    alumnusOf: {
      '@type': 'CollegeOrUniversity',
      name: 'Seattle University',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Seattle',
      addressRegion: 'WA',
      addressCountry: 'USA',
    },
    sameAs: [
      profileData.contact.socials.github,
      profileData.contact.socials.linkedin,
    ],
    knowsAbout: [
      'Software Engineering',
      'Backend Development',
      'Distributed Systems',
      'Cybersecurity',
      'Penetration Testing',
      'Artificial Intelligence',
      'Python',
      'Java',
      'React.js',
      'Node.js',
      'REST APIs',
      'gRPC',
    ],
  };

  const webSiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: `${profileData.name} Portfolio`,
    url: siteConfig.url,
    description: siteConfig.description,
    author: {
      '@type': 'Person',
      name: profileData.name,
    },
  };

  const profilePageSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: personSchema,
    url: siteConfig.url,
    name: `${profileData.name} Developer Portfolio`,
  };

  return [personSchema, webSiteSchema, profilePageSchema];
}
