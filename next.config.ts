import type { NextConfig } from 'next';

const isProduction = process.env.NODE_ENV === 'production';
// Opt-in for testing a production build from a phone over plain HTTP on the home network
// (`npm run preview:phone`). HSTS and `upgrade-insecure-requests` would make the phone request
// every CSS/JS/font file over https://, which a local server doesn't serve. Never set on Vercel.
const localHttpPreview = process.env.LOCAL_HTTP_PREVIEW === '1';

const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  ...(localHttpPreview
    ? []
    : [
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=63072000; includeSubDomains; preload',
        },
      ]),
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
  {
    key: 'Content-Security-Policy',
    // 'unsafe-inline' stays because the pages are statically prerendered: nonce-based CSP
    // requires dynamic rendering (see node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md).
    // 'unsafe-eval' is not needed in production; these headers are only sent in production.
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self' data:",
      "connect-src 'self' https://api.emailjs.com",
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
      ...(localHttpPreview ? [] : ['upgrade-insecure-requests']),
    ].join('; '),
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Don't advertise the framework in every response.
  poweredByHeader: false,
  // Dev server only: let phones/tablets on a private home network load dev assets
  // (`npm run dev:phone`). Private address ranges only; has no effect on production builds.
  allowedDevOrigins: ['192.168.*.*', '10.*.*.*', '*.local'],
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    if (!isProduction) {
      return [];
    }
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
