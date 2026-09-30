import type { Service } from "@/types";

export const services: Service[] = [
  {
    number: "01",
    title: "Frontend Development",
    description:
      "Component-driven interfaces in React and Next.js that stay fast and legible as the codebase grows.",
    icon: "layout",
  },
  {
    number: "02",
    title: "Responsive Web Design",
    description:
      "Layouts reorganised for each breakpoint rather than shrunk — tested from 320px upward on real devices.",
    icon: "responsive",
  },
  {
    number: "03",
    title: "State Management",
    description:
      "Predictable client state with Zustand and server state with TanStack Query, so data flow stays obvious.",
    icon: "layers",
  },
  {
    number: "04",
    title: "API Integration",
    description:
      "Wiring interfaces to REST endpoints with Axios — loading, empty and error states included, not bolted on.",
    icon: "plug",
  },
  {
    number: "05",
    title: "E-Commerce Interfaces",
    description:
      "Catalogue, filtering, cart and checkout flows, including Stripe payments and an admin dashboard behind them.",
    icon: "cart",
  },
  {
    number: "06",
    title: "Performance & Accessibility",
    description:
      "Semantic markup, keyboard paths, contrast that passes, and bundles kept small enough to load quickly.",
    icon: "gauge",
  },
];
