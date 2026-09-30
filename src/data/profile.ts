import type { NavItem, Stat } from "@/types";

export const profile = {
  name: "Aung Kyaw Hein",
  firstName: "Aung",
  initials: "AK",
  role: "Frontend Developer",
  intro:
    "I build modern, responsive interfaces with React, Next.js and TypeScript — and the API integration behind them.",
  heroSupport:
    "B.Tech Computer Science graduate specialising in frontend development. I turn designs into interfaces that are fast, accessible and hold up on a real device.",
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
  "I'm a frontend developer based in Chiang Mai. I finished my B.Tech in Computer Science at Parul University in June 2026, and the part of the work I keep coming back to is the interface — that moment when a screen finally feels right to use.",
  "Most of what I know I learned by building. At Tri-Apex Trading Group I spent three months on the frontend of an e-commerce platform in Next.js and TypeScript, covering the catalogue, the cart and the checkout. I learned quickly that predictable state matters more than clever code, so I leaned on Zustand and TanStack Query to keep things manageable as the app grew.",
  "My own projects are where I experiment: a live storefront with Stripe checkout, an IoT dashboard streaming device state over WebSockets, and a language-learning app with a spaced-repetition scheduler behind it.",
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
  { value: "5", label: "Projects built end to end" },
  { value: "218", label: "Automated tests written" },
  { value: "10+", label: "Technologies used" },
];

export const navItems: NavItem[] = [
  { label: "Home", href: "#home", id: "home" },
  { label: "About", href: "#about", id: "about" },
  { label: "Skills", href: "#skills", id: "skills" },
  { label: "Projects", href: "#projects", id: "projects" },
  { label: "Experience", href: "#experience", id: "experience" },
  { label: "Contact", href: "#contact", id: "contact" },
];
