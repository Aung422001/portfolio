import { featuredProject, otherProjects } from "@/data/projects";
import { Section } from "@/components/ui/Section";
import { RevealText } from "@/components/ui/RevealText";
import { FeaturedProject } from "./FeaturedProject";
import { ProjectList } from "./ProjectList";

export function Projects() {
  return (
    <Section
      id="projects"
      marqueeText="Selected work"
      className="border-t border-[var(--line)] py-16 sm:py-20"
    >
      <div className="max-w-2xl">
        <RevealText
          id="projects-heading"
          className="h-display text-[clamp(1.9rem,4.4vw,3.1rem)] text-[var(--ink)]"
        >
          Selected Projects
        </RevealText>
        <p className="mt-4 text-[0.95rem] leading-relaxed text-[var(--ink-soft)]">
          A live storefront I built end to end, the platform I worked on at
          Tri-Apex, and three more applications of my own.
        </p>
      </div>

      <FeaturedProject project={featuredProject} />
      <ProjectList projects={otherProjects} />
    </Section>
  );
}
