export interface NavItem {
  label: string;
  href: string;
  /** id of the section this link points at, used for the active indicator */
  id: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface SkillGroup {
  title: string;
  items: string[];
}

export interface Service {
  number: string;
  title: string;
  description: string;
  /** lucide-react icon name, resolved in the Services component */
  icon: ServiceIcon;
}

export type ServiceIcon =
  | "layout"
  | "layers"
  | "cart"
  | "plug"
  | "responsive"
  | "gauge";

export interface Project {
  slug: string;
  title: string;
  tagline: string;
  /** Short marker shown beside the title, e.g. to flag paid work. */
  badge?: string;
  description: string;
  stack: string[];
  features?: string[];
  metrics?: Metric[];
  links: ProjectLinks;
  featured?: boolean;
  year: string;
  /** Drop a file in /public and set this to swap the placeholder for a real shot. */
  image?: string;
  /**
   * "screenshot" is the real running app and gets a descriptive alt.
   * "cover" is designed artwork standing in for one — decorative, so it takes
   * an empty alt, since the project title sits right beside it.
   */
  imageKind?: "screenshot" | "cover";
}

export interface Metric {
  value: string;
  label: string;
}

export interface ProjectLinks {
  live?: string;
  github?: string;
  caseStudy?: string;
}

export interface ExperienceEntry {
  role: string;
  company: string;
  period: string;
  summary: string;
  responsibilities: string[];
}

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}
