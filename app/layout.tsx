import type { Metadata } from 'next';
import { Geist, Geist_Mono, Instrument_Serif } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { ToastProvider } from '@/components/ui/Toast';
import { ScrollReset } from '@/components/layout/ScrollReset';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SpotlightEffects } from '@/components/ui/SpotlightEffects';
import { AssistantLauncher } from '@/components/assistant/AssistantLauncher';
import { siteConfig } from '@/data/siteConfig';
import { getStructuredData } from '@/lib/seo';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

// Serif italic accent for one or two words per heading. Not preloaded: it is decorative,
// and the fallback (Georgia italic) is close enough that the swap is barely visible.
const instrumentSerif = Instrument_Serif({
  variable: '--font-instrument-serif',
  subsets: ['latin'],
  weight: '400',
  style: 'italic',
  display: 'swap',
  preload: false,
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: `${siteConfig.name} Portfolio`,
    type: 'website',
    // Image comes from app/opengraph-image.tsx (generated at build time).
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    // Image comes from app/twitter-image.tsx.
  },
  keywords: [
    'Ayush Mehta',
    'Ayush Mehta Software Engineer',
    'Ayush Mehta Portfolio',
    'Ayush Mehta Seattle',
    'Ayush Mehta Cybersecurity',
    'Ayush Mehta Security Engineer',
    'Seattle University Computer Science',
    'Software Engineer Seattle',
    'Security Engineer Seattle',
    'Backend Engineer',
    'Application Security',
    'AI Agent Security',
  ],
  authors: [{ name: 'Ayush Mehta', url: siteConfig.url }],
  creator: 'Ayush Mehta',
  publisher: 'Ayush Mehta',
  // Icons: app/icon.svg (file convention) plus public/favicon.ico for legacy requests.
  // Google Search Console is verified by public/googlee612ac228e024a84.html.
  // (The previous meta tag held that file name, which is not a valid token.)
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const structuredData = getStructuredData();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: "if('scrollRestoration' in history){history.scrollRestoration='manual';}window.scrollTo(0,0);",
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            // Escape "<" so data can never close the script tag (per Next.js JSON-LD guide).
            __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} min-h-screen bg-background text-text-primary antialiased flex flex-col justify-between`}
      >
        <ScrollReset />
        {/* Reading progress (CSS scroll-driven animation; hidden where unsupported) */}
        <div className="scroll-progress" aria-hidden="true" />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ToastProvider>
            <Navbar />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <Footer />
            <AssistantLauncher />
            <SpotlightEffects />
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
