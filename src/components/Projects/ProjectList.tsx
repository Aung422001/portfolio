import { ArrowUpRight, Code2, FileText } from "lucide-react";
import type { Project } from "@/types";
import { ProjectVisual } from "@/components/ui/ProjectVisual";

export function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <div className="mt-14">
      <h3 className="text-[0.72rem] uppercase tracking-[0.16em] text-[var(--ink-faint)]">
        More work
      </h3>
      <ul className="mt-5 grid gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <li key={project.slug} className="min-w-0">
            <article className="flex h-full flex-col rounded-lg border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-7">
              {project.image && (
                <ProjectVisual
                  title={project.title}
                  image={project.image}
                  imageKind={project.imageKind}
                  className="mb-6"
                />
              )}
              <div className="flex flex-wrap items-center gap-3">
                {project.badge && (
                  <span className="rounded-full bg-[var(--surface-soft)] px-2.5 py-1 text-[0.68rem] font-medium uppercase tracking-[0.1em] text-[var(--lagoon)]">
                    {project.badge}
                  </span>
                )}
                <span className="text-[0.78rem] text-[var(--ink-faint)]">{project.year}</span>
              </div>
              <h4 className="h-display mt-3 text-[1.5rem] text-[var(--ink)]">
                {project.title}
              </h4>
              <p className="mt-2 text-[0.85rem] text-[var(--ink-faint)]">{project.tagline}</p>
              <p className="mt-3 text-[0.9rem] leading-relaxed text-[var(--ink-soft)]">
                {project.description}
              </p>
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {project.stack.map((tech) => (
                  <li key={tech} className="rounded-md border border-[var(--line)] px-2 py-0.5 text-[0.72rem] text-[var(--ink-soft)]">
                    {tech}
                  </li>
                ))}
              </ul>
              {project.demoNote && (
                <p className="mt-4 text-[0.8rem] leading-relaxed text-[var(--ink-soft)]">{project.demoNote}</p>
              )}
              <div className="mt-auto flex flex-wrap gap-4 pt-6 text-[0.82rem] font-medium text-[var(--ink)]">
                {project.links.live && (
                  <a href={project.links.live} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 py-2 underline-offset-4 hover:underline">
                    Live Demo <ArrowUpRight size={14} aria-hidden />
                  </a>
                )}
                {project.links.github && (
                  <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 py-2 underline-offset-4 hover:underline">
                    <Code2 size={14} aria-hidden /> GitHub
                  </a>
                )}
                {project.links.caseStudy && (
                  <a href={project.links.caseStudy} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 py-2 underline-offset-4 hover:underline">
                    <FileText size={14} aria-hidden /> Project Notes
                  </a>
                )}
              </div>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
