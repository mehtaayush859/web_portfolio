import { Metadata } from "next";

// Page-specific metadata for the Home page
export const metadata: Metadata = {
    title: "Home | Ayush Mehta Portfolio",
    description:
      "Welcome to Ayush Mehta's portfolio showcasing software engineering and cybersecurity projects.",
    openGraph: {
      title: "Home | Ayush Mehta Portfolio",
      description:
        "Explore Ayush Mehta's portfolio featuring projects, skills, and achievements.",
      url: "https://amehta.vercel.app",
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
      title: "Home | Ayush Mehta Portfolio",
      description:
        "Explore projects, skills, and achievements from Ayush Mehta.",
      images: ["https://amehta.vercel.app/profile.jpg"],
    },
  };