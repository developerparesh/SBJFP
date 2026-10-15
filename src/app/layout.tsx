import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://sbjfp.pages.dev"),
  title: "SBJFP — Skill-Based Job Finding Platform",
  description:
    "Discover relevant jobs through skills-based matching, understand job requirements, explore transparent salary ranges, and bring hiring into one clear experience.",
  keywords: [
    "skill-based jobs",
    "job matching",
    "hire by skills",
    "transparent salary",
    "developer jobs",
  ],
  openGraph: {
    title: "SBJFP — Skills Meet Opportunity",
    description:
      "Find jobs that match your skills. Hire people who fit. Skills-based matching for candidates and employers.",
    type: "website",
    url: "https://sbjfp.pages.dev",
    images: [{ url: "/logo.png", width: 1200, height: 630, alt: "SBJFP Logo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "SBJFP — Skills Meet Opportunity",
    description: "Find jobs that match your skills. Hire people who fit.",
  },
};

import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/logo.png" type="image/png" />
      </head>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
