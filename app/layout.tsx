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
    default: "AM-Portfolio",
    template: "%s | AM-Portfolio",
  },
  description: "Ayush Mehta Portfolio",
  metadataBase: new URL("https://example.com"),
  openGraph: {
    title: "AM-Portfolio",
    description: "Ayush Mehta Portfolio",
    images: [{ url: "/og-image.png" }],
  },
  alternates: {
    canonical: "https://example.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
