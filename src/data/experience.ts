import type { ExperienceEntry, ProcessStep } from "@/types";

export const experience: ExperienceEntry[] = [
  {
    role: "Full-Stack Web Development Intern",
    company: "Tri-Apex Trading Group",
    period: "January 2 — April 9, 2026 (14 weeks)",
    summary:
      "Contributed to a 3D-printer e-commerce platform during a 14-week remote internship, building responsive storefront workflows and integrating application data.",
    responsibilities: [
      "Built responsive frontend interfaces in Next.js and React",
      "Managed client-side state with Zustand",
      "Handled data fetching with TanStack Query and Axios",
      "Worked across a multi-page application",
    ],
  },
];

export const education: ExperienceEntry[] = [
  {
    role: "B.Tech, Computer Science and Engineering",
    company: "Parul University — Vadodara, Gujarat, India",
    period: "Graduated June 2026",
    summary:
      "Bachelor's degree covering data structures, algorithms, databases, operating systems and software engineering.",
    responsibilities: [],
  },
  {
    role: "Frontend Specialisation Program",
    company: "Self-directed",
    period: "Ongoing",
    summary:
      "Working through HTML, CSS, JavaScript and React fundamentals in depth, building a project at each stage rather than only following along.",
    responsibilities: [],
  },
];

export const processSteps: ProcessStep[] = [
  {
    number: "01",
    title: "Discover",
    description: "Understand the problem and requirements before writing anything.",
  },
  {
    number: "02",
    title: "Design",
    description: "Plan the interface and the state it depends on.",
  },
  {
    number: "03",
    title: "Develop",
    description: "Build the components and wire them to the API.",
  },
  {
    number: "04",
    title: "Test",
    description: "Check behaviour, responsiveness and accessibility — not just the happy path.",
  },
  {
    number: "05",
    title: "Deploy",
    description: "Ship it, watch it, and keep improving once real users arrive.",
  },
];
