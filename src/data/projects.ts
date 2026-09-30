import type { Project } from "@/types";

/**
 * Merbolo leads because it is the only project with a working live demo and a
 * real screenshot — a recruiter can click it and see it running, which beats
 * any amount of description.
 *
 * Tri-Apex follows immediately and carries a badge, because it is the only
 * professional role here and that context matters more than its position.
 *
 * Every project now carries a real screenshot of the running app. Scope and
 * stack match the CV. Only `links.live` values that actually resolve are
 * listed.
 */
export const projects: Project[] = [
  {
    slug: "merbolo",
    title: "Merbolo Stationery Store",
    tagline: "Live storefront with working Stripe checkout",
    description:
      "A full e-commerce storefront built end to end: product catalogue, cart and a working Stripe checkout on a JWT-authenticated Express and MongoDB API. Behind it sits an admin dashboard for managing products and orders, with Zustand holding client state and Axios handling the API layer. It is deployed and you can buy something in it.",
    stack: [
      "React",
      "Vite",
      "Tailwind CSS",
      "Zustand",
      "Axios",
      "Express",
      "MongoDB",
      "Stripe",
      "JWT",
    ],
    features: [
      "Product catalogue and categories",
      "Shopping cart",
      "Stripe checkout",
      "JWT accounts and auth",
      "Admin dashboard",
      "Order and inventory management",
    ],
    links: {
      live: "https://merbolo-stationery-store-frontend.vercel.app",
      github: "https://github.com/Aung422001/merbolo-stationery-store",
    },
    image: "/projects/merbolo.png",
    imageKind: "screenshot",
    featured: true,
    year: "2026",
  },
  {
    slug: "triapex",
    title: "Tri-Apex 3D Printer E-Commerce Platform",
    tagline: "Frontend for a full-stack commerce platform",
    badge: "Professional work",
    description:
      "Three months as a junior developer at Tri-Apex Trading Group, building the frontend of an e-commerce platform for 3D printers, filaments and accessories. I covered the product catalogue, the cart and the checkout, and added a customer-support chat widget on the Gemini API that took routine questions off the team's plate. The lesson that stuck: predictable state matters more than clever code, which is why the app leans on Zustand and TanStack Query as it grew.",
    stack: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Zustand",
      "TanStack Query",
      "Axios",
      "Google Gemini API",
    ],
    links: {
      github: "https://github.com/Aung422001/Tri-Apex-Trading-Store",
      caseStudy:
        "https://github.com/Aung422001/Tri-Apex-Trading-Store/blob/main/prd.md",
    },
    image: "/projects/triapex.png",
    imageKind: "screenshot",
    year: "2026",
  },
  {
    slug: "recursion",
    title: "Recursion — Language Learning App",
    tagline: "10 languages across 90 course pairs",
    description:
      "A Duolingo-style language app with generated lessons and alphabet drills. One concept holds a meaning in all ten languages, so 80 concepts generate every course pair. An SM-2 spaced-repetition scheduler decides what you review next, and auth keeps the access token in memory with an httpOnly refresh cookie rather than in localStorage.",
    stack: ["React", "Vite", "Tailwind CSS", "Node.js", "Express", "MongoDB", "JWT"],
    metrics: [{ value: "218", label: "Automated tests" }],
    links: { github: "https://github.com/Aung422001/Recursion" },
    image: "/projects/recursion.png",
    imageKind: "screenshot",
    year: "2026",
  },
  {
    slug: "smart-office",
    title: "Smart Office IoT Dashboard",
    tagline: "Real-time device monitoring over WebSockets",
    description:
      "A React dashboard for monitoring and controlling office devices, with authenticated login and signup flows and a responsive layout. It talks to a Node and Express REST API to switch devices, and streams live automation state over WebSockets — the interesting part was keeping the UI from stuttering as updates arrived.",
    stack: [
      "React",
      "React Router",
      "Context API",
      "WebSockets",
      "Express",
      "MongoDB",
      "JWT",
    ],
    links: { github: "https://github.com/Aung422001/IOTProject" },
    image: "/projects/smart-office.png",
    imageKind: "screenshot",
    year: "2025",
  },
  {
    slug: "cryptoq",
    title: "CryptoQ",
    tagline: "Strategy builder and backtester",
    description:
      "Build a trading strategy from indicator conditions, then backtest it against real Binance candles. It handles position sizing from a risk percentage, fees and slippage, and the awkward case where stop-loss and take-profit are touched in the same candle. When the exchange can't be reached it falls back to a synthetic series and says so on screen.",
    stack: ["React", "Vite", "Express", "MongoDB", "Docker"],
    links: { github: "https://github.com/Aung422001/cryptoq" },
    image: "/projects/cryptoq.png",
    imageKind: "screenshot",
    year: "2026",
  },
];

export const featuredProject = projects.find((p) => p.featured)!;
export const otherProjects = projects.filter((p) => !p.featured);
