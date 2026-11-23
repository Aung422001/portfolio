import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { profile } from "@/data/profile";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
});

const TITLE = `${profile.name} — Frontend & Full-Stack Developer`;
const DESCRIPTION = `Portfolio of ${profile.name}, a 2026 computer science graduate and junior frontend/full-stack developer in Chiang Mai. Explore React, Next.js and TypeScript projects and internship experience.`;
const isPreview = process.env.VERCEL_ENV === "preview";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: `%s — ${profile.name}`,
  },
  description: DESCRIPTION,
  keywords: [
    "Frontend Developer",
    "React",
    "Next.js",
    "TypeScript",
    "Tailwind CSS",
    "Chiang Mai",
    profile.name,
  ],
  authors: [{ name: profile.name, url: SITE_URL }],
  creator: profile.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: TITLE,
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/opengraph-image"],
  },
  robots: {
    index: !isPreview,
    follow: !isPreview,
    googleBot: { index: !isPreview, follow: !isPreview, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#11151b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={outfit.variable}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "Person", name: profile.name, jobTitle: profile.role, url: SITE_URL, sameAs: [profile.github, profile.linkedin] }).replace(/</g, "\\u003c") }} />
        {/* Runs before paint: opts into the scroll-reveal hidden state only when
            JS is running, then removes it again if React never mounted, so a
            failed hydration can't leave the page blank. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('js-reveal');
window.addEventListener('load',function(){setTimeout(function(){
if(!document.querySelector('.reveal.is-visible')){document.documentElement.classList.remove('js-reveal');}
},600);});`,
          }}
        />
      </head>
      <body>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
