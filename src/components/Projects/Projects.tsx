import { projects } from "@/data/projects";
import { Section } from "@/components/ui/Section";
import { RevealText } from "@/components/ui/RevealText";
import { ProjectList } from "./ProjectList";
import { FeaturedProject } from "./FeaturedProject";

const showcasedSlugs = new Set(["triapex", "merbolo", "applytrail"]);
const remainingProjects = projects.filter((project) => !showcasedSlugs.has(project.slug));
const selected = ["triapex", "merbolo", "applytrail"].map(slug => projects.find(project => project.slug === slug)!);

export function Projects() {
  return (
    <Section id="projects" title="Featured Projects" subtitle="Professional work and independent products, with screenshots, contributions and technical approaches." className="border-t border-[var(--line)] py-16 sm:py-20">
      <div className="mt-5 flex flex-wrap gap-4 text-sm text-[var(--lagoon)]">
        <a className="showcase-link underline underline-offset-4" href="#showcase">Explore interactive showcase ↑</a>
        <a className="underline underline-offset-4" href="#more-projects">View more projects ↓</a>
      </div>
      {selected.map(project => <FeaturedProject key={project.slug} project={project} />)}
      <div id="more-projects" className="mt-20 max-w-2xl border-t border-[var(--line)] pt-12">
        <RevealText id="more-projects-heading" className="h-display text-[clamp(1.9rem,4.4vw,3.1rem)] text-[var(--ink)]">
          More Projects
        </RevealText>
        <p className="mt-4 text-[0.95rem] leading-relaxed text-[var(--ink-soft)]">
          More experiments, applications, and engineering work beyond the three projects in the interactive showcase above.
        </p>
      </div>
      <ProjectList projects={remainingProjects} />
    </Section>
  );
}
