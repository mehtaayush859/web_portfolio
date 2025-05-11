import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Ayush Mehta | AM Portfolio",
    template: "%s | Ayush Mehta Portfolio",
  },
  description: "Discover Ayush Mehta's portfolio showcasing software engineering and cybersecurity projects.",
  metadataBase: new URL("https://amehta.vercel.app"),
  openGraph: {
    title: "Ayush Mehta | Software Engineer | AM Portfolio",
    description: "Explore Ayush Mehta's portfolio featuring projects, skills, and achievements.",
    url: "https://amehta.vercel.app",
    type: "website",
    images: [
      {
        url: "https://amehta.vercel.app/profile.jpg",
        width: 1200,
        height: 630,
        alt: "Ayush Mehta Portfolio Image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ayush Mehta | AM Portfolio",
    description: "Explore projects, skills, and achievements from Ayush Mehta.",
    images: ["https://amehta.vercel.app/profile.jpg"],
  },
  alternates: {
    canonical: "https://amehta.vercel.app",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
