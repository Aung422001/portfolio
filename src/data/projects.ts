import type { Project } from "@/types";

export const projects: Project[] = [
  {
    slug: "merbolo",
    featured: true,
    title: "Merbolo Stationery Store",
    tagline: "Full-stack storefront and admin dashboard",
    description:
      "Built the customer shopping flow and an admin dashboard for products and orders. React and Zustand manage the interface and cart state; an Express and MongoDB API provides authenticated data.",
    demoNote: "The catalog depends on a hosted API and may take time to load. Checkout is a portfolio demonstration; real payment processing is not claimed.",
    study: { problem: "A stationery store needs a consistent path from browsing to checkout and tools for managing products and orders.", contribution: "Built storefront, catalogue, cart, checkout and administrative interfaces with API integration.", approach: "React and Zustand coordinate UI and cart state; Express and MongoDB provide the application data layer." },
    stack: [
      "React",
      "Vite",
      "Tailwind CSS",
      "Zustand",
      "Axios",
      "Express",
      "MongoDB",
      "JWT",
    ],
    features: [
      "Product catalogue and categories",
      "Shopping cart",
      "Checkout interface (demo)",
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
    year: "2026",
  },
  {
    slug: "applytrail",
    title: "ApplyTrail",
    tagline: "Job application tracker with a companion browser extension",
    badge: "Latest project",
    description:
      "Built a React workspace to track applications from saved jobs to interviews and offers. Google sign-in connects account-specific MongoDB records; a companion extension captures job links and syncs applications with the portal. Optional Gmail integration supports referee invitations, reply checking and notifications.",
    stack: ["React", "Vite", "Node.js", "MongoDB", "Google OAuth", "Gmail API", "Chrome Extension"],
    links: { live: "https://applytrail-km2o.onrender.com" },
    image: "/projects/applytrail.jpg",
    imageKind: "screenshot",
    demoNote: "The hosted demo may need time to wake up. Guest tracking works without Google sign-in; Gmail features require a connected account. Source code is private.",
    study: { problem: "Job applicants need a single place to keep track of saved opportunities, status updates and correspondence.", contribution: "Built the React tracking workspace and companion extension workflow for capturing and organizing job links.", approach: "Account-specific records use Google sign-in and MongoDB; optional Gmail integration connects reply checking and notifications." },
    year: "2026",
  },
  {
    slug: "triapex",
    title: "Tri-Apex 3D Printer E-Commerce Platform",
    tagline: "Frontend for a full-stack commerce platform",
    badge: "Professional work",
    description:
      "Built product catalogue, cart and checkout interfaces during a 14-week full-stack web development internship. Used TanStack Query for API data, Zustand for shared client state, and REST API integration for commerce workflows.",
    demoNote: "Hosted on Render; the first visit may need time to wake the service. Project notes and a screenshot are available while it starts.",
    study: { problem: "A 3D-printer store needs responsive catalogue, cart and checkout interfaces connected to commerce APIs.", contribution: "Contributed frontend features during a 14-week remote full-stack internship, including responsive product catalogue, cart, checkout and REST API integration.", approach: "Next.js and TypeScript support the interface; TanStack Query handles server data and Zustand coordinates shared UI state. Supported debugging, testing, documentation and deployment." },
    stack: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Zustand",
      "TanStack Query",
      "Axios",
    ],
    links: {
      live: "https://triapex-web.onrender.com/",
      github: "https://github.com/Aung422001/Tri-Apex-Trading-Store",
      caseStudy:
        "https://github.com/Aung422001/Tri-Apex-Trading-Store/blob/master/prd.md",
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
    slug: "a-small-journey",
    title: "A Small Journey — Browser Game",
    tagline: "Canvas-based exploration game with a quest system",
    description:
      "Built a dependency-free browser game set in a fictional Myanmar-inspired town. Players ride a bicycle, explore neighborhoods, help a neighbor and deliver a parcel. Includes keyboard and mobile controls, a map, journal, and automated tests for quest and movement logic.",
    stack: ["JavaScript", "HTML Canvas", "Node.js", "Node Test Runner"],
    features: ["Top-down exploration", "Quest and dialogue interactions", "Mobile touch controls", "Automated gameplay logic tests"],
    links: { github: "https://github.com/Aung422001/a-small-journey" },
    year: "2026",
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
