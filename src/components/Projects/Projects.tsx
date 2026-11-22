import { projects } from "@/data/projects";
import { Section } from "@/components/ui/Section";
import { RevealText } from "@/components/ui/RevealText";
import { ProjectList } from "./ProjectList";

const showcasedSlugs = new Set(["triapex", "merbolo", "applytrail"]);
const remainingProjects = projects.filter((project) => !showcasedSlugs.has(project.slug));

export function Projects() {
  return (
    <Section id="projects" className="border-t border-[var(--line)] py-16 sm:py-20">
      <div className="max-w-2xl">
        <RevealText id="projects-heading" className="h-display text-[clamp(1.9rem,4.4vw,3.1rem)] text-[var(--ink)]">
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
