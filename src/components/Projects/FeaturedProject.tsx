import { ArrowUpRight, Code2, FileText } from "lucide-react";
import type { Project } from "@/types";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { ProjectVisual } from "@/components/ui/ProjectVisual";

export function FeaturedProject({ project }: { project: Project }) {
  return (
    <Reveal as="article" className="mt-12">
      <div className="overflow-hidden rounded-3xl border border-[var(--line)] bg-white/50">
        <div className="grid lg:grid-cols-[1.05fr_1fr]">
          <div className="order-2 p-7 sm:p-9 lg:order-1 lg:p-11">
            <p className="text-[0.72rem] uppercase tracking-[0.16em] text-[var(--ink-faint)]">
              Featured &middot; {project.year}
            </p>

            <h3 className="h-display mt-4 text-[clamp(1.6rem,3.4vw,2.35rem)] text-[var(--ink)]">
              {project.title}
            </h3>
            <p className="mt-3 text-[0.95rem] text-[var(--ink-soft)]">
              {project.description}
            </p>

            <ul className="mt-6 flex flex-wrap gap-1.5">
              {project.stack.map((tech) => (
                <li
                  key={tech}
                  className="rounded-md border border-[var(--line)] px-2.5 py-1 text-[0.75rem] text-[var(--ink-soft)]"
                >
                  {tech}
                </li>
              ))}
            </ul>

            <div className="mt-7 flex flex-wrap gap-2.5">
              {project.links.live && (
                <Button href={project.links.live} size="sm">
                  Live Demo
                  <ArrowUpRight size={15} aria-hidden />
                </Button>
              )}
              {project.links.github && (
                <Button href={project.links.github} variant="outline" size="sm">
                  <Code2 size={15} aria-hidden />
                  GitHub
                </Button>
              )}
              {project.links.caseStudy && (
                <Button href={project.links.caseStudy} variant="outline" size="sm">
                  <FileText size={15} aria-hidden />
                  Case Study
                </Button>
              )}
            </div>
          </div>

          <div className="order-1 p-7 sm:p-9 lg:order-2 lg:py-11 lg:pl-0 lg:pr-11">
            <ProjectVisual
              title={project.title}
              image={project.image}
              imageKind={project.imageKind}
              hint="Project preview"
              priority
            />
          </div>
        </div>

        {project.features && (
          <div className="border-t border-[var(--line)] px-7 py-8 sm:px-9 lg:px-11">
            <h4 className="text-[0.72rem] uppercase tracking-[0.16em] text-[var(--ink-faint)]">
              What it does
            </h4>
            <ul className="mt-4 grid gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
              {project.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2.5 text-[0.87rem] text-[var(--ink-soft)]"
                >
                  <span
                    aria-hidden
                    className="mt-[0.55em] h-1 w-1 flex-none rounded-full bg-[var(--lagoon)]"
                  />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}

        {project.metrics && (
          <div className="border-t border-[var(--line)] bg-[#eef8f7]/60 px-7 py-7 sm:px-9 lg:px-11">
            <h4 className="text-[0.72rem] uppercase tracking-[0.16em] text-[var(--ink-faint)]">
              Performance
            </h4>
            <dl className="mt-4 grid grid-cols-2 gap-6 lg:grid-cols-4">
              {project.metrics.map((metric) => (
                <div key={metric.label}>
                  <dd className="h-display text-[1.6rem] text-[var(--ink)]">
                    {metric.value}
                  </dd>
                  <dt className="mt-0.5 text-[0.78rem] text-[var(--ink-soft)]">
                    {metric.label}
                  </dt>
                </div>
              ))}
            </dl>
            <p className="mt-5 text-[0.75rem] text-[var(--ink-faint)]">
              Figures are approximate, measured during development profiling.
            </p>
          </div>
        )}
      </div>
    </Reveal>
  );
}
