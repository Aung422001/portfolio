import type { NavItem, Stat } from "@/types";

export const profile = {
  name: "Aung Kyaw Hein",
  firstName: "Aung",
  initials: "AK",
  role: "Frontend Developer",
  intro:
    "I build modern, responsive interfaces with React, Next.js and TypeScript — and the API integration behind them.",
  heroSupport:
    "React, Next.js and TypeScript developer with professional e-commerce experience. I build storefronts, dashboards and tools that connect useful interfaces to real APIs.",
  location: "Chiang Mai, Thailand",
  openTo: "Thailand, Malaysia and Singapore",
  availability: "Available for opportunities",
  email: "aungkyawhein422001@gmail.com",
  github: "https://github.com/Aung422001",
  linkedin: "https://www.linkedin.com/in/aung-kyaw-hein-740b7b248/",
  education: {
    degree: "B.Tech in Computer Science and Engineering",
    school: "Parul University",
    period: "Graduated June 2026",
  },
  /**
   * Drop your PDF at `public/cv/aung-kyaw-hein-cv.pdf` and flip `cvAvailable`
   * to true. While it is false the CV buttons are not rendered at all — a
   * button that 404s is worse than no button.
   */
  cvPath: "/cv/aung-kyaw-hein-cv.pdf",
  cvAvailable: false,
} as const;

export const aboutBody = [
  "I graduated from Parul University in June 2026 with a B.Tech in Computer Science and Engineering. At Tri-Apex Trading Group, I spent three months building product catalogue, cart and checkout interfaces with Next.js and TypeScript.",
  "My independent projects explore different interface problems: tracking job applications in ApplyTrail, scheduling language reviews in Recursion, and displaying live device updates in an IoT dashboard. I'm looking for a frontend role where I can contribute and learn from an experienced team.",
];

export const aboutTech = [
  "React",
  "Next.js",
  "TypeScript",
  "Tailwind CSS",
  "Zustand",
  "TanStack Query",
  "Node.js",
  "Express",
  "MongoDB",
  "REST APIs",
];

export const stats: Stat[] = [
  { value: "3", label: "Months professional experience" },
  { value: "5", label: "Independent projects" },
  { value: "218", label: "Automated tests written" },
  { value: "10+", label: "Technologies used" },
];

export const navItems: NavItem[] = [
  { label: "Home", href: "#home", id: "home" },
  { label: "Projects", href: "#projects", id: "projects" },
  { label: "About", href: "#about", id: "about" },
  { label: "Skills", href: "#skills", id: "skills" },
  { label: "Experience", href: "#experience", id: "experience" },
  { label: "Contact", href: "#contact", id: "contact" },
];
