import type { SkillGroup } from "@/types";

/**
 * Mirrors the four groups on the CV exactly. Anything not on the CV is not
 * here either — a portfolio that lists more tools than the résumé is the first
 * thing a careful reviewer notices.
 */
export const skillGroups: SkillGroup[] = [
  {
    title: "Frontend",
    items: [
      "React.js",
      "Next.js",
      "TypeScript",
      "JavaScript (ES6+)",
      "HTML5",
      "CSS3",
      "Tailwind CSS",
      "Responsive design",
    ],
  },
  {
    title: "Backend & Full-Stack",
    items: [
      "Node.js",
      "Express.js",
      "REST API design",
      "MongoDB",
      "PostgreSQL",
      "JWT authentication",
    ],
  },
  {
    title: "Tools & Libraries",
    items: [
      "TanStack Query",
      "Zustand",
      "Axios",
      "Git / GitHub",
      "Vite",
      "Webpack",
    ],
  },
  {
    title: "AI",
    items: ["Google Gemini API", "Claude Code"],
  },
];
