"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Code2 } from "lucide-react";
import type { Project } from "@/types";
import { ProjectVisual } from "@/components/ui/ProjectVisual";

/**
 * The reference shows projects as a list of large names that dim except for the
 * one under the cursor, with a preview floating alongside the pointer.
 *
 * The preview is decorative and pointer-only: it is aria-hidden, and keyboard
 * users get the same information from the always-visible text and links. On
 * touch there is no hover, so it simply never appears.
 */
export function ProjectList({ projects }: { projects: Project[] }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [point, setPoint] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLUListElement>(null);
  const reduceMotion = useReducedMotion();

  const activeProject = projects.find((project) => project.slug === hovered);

  const handleMove = (event: React.MouseEvent<HTMLUListElement>) => {
    const box = containerRef.current?.getBoundingClientRect();
    if (!box) return;
    setPoint({ x: event.clientX - box.left, y: event.clientY - box.top });
  };

  return (
    <div className="relative mt-16">
      <h3 className="text-[0.72rem] uppercase tracking-[0.16em] text-[var(--ink-faint)]">
        More work
      </h3>

      <ul
        ref={containerRef}
        onMouseMove={handleMove}
        onMouseLeave={() => setHovered(null)}
        className="mt-2"
      >
        {projects.map((project) => (
          <li key={project.slug}>
            <article
              onMouseEnter={() => setHovered(project.slug)}
              className="group border-t border-[var(--line)] py-7 transition-opacity duration-300"
              style={{
                opacity: hovered && hovered !== project.slug ? 0.45 : 1,
              }}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                <h4 className="h-display text-[clamp(1.35rem,3.2vw,2rem)] text-[var(--ink)]">
                  {project.title}
                </h4>
                <span className="flex items-center gap-3">
                  {project.badge && (
                    <span className="rounded-full bg-[var(--lagoon)] px-2.5 py-1 text-[0.68rem] font-medium uppercase tracking-[0.1em] text-[var(--ink)]">
                      {project.badge}
                    </span>
                  )}
                  <span className="text-[0.78rem] tabular-nums text-[var(--ink-faint)]">
                    {project.year}
                  </span>
                </span>
              </div>

              <p className="mt-1.5 max-w-2xl text-[0.85rem] text-[var(--ink-faint)]">
                {project.tagline}
              </p>
              <p className="mt-3 max-w-3xl text-[0.9rem] leading-relaxed text-[var(--ink-soft)]">
                {project.description}
              </p>

              <ul className="mt-4 flex flex-wrap gap-1.5">
                {project.stack.map((tech) => (
                  <li
                    key={tech}
                    className="rounded-md border border-[var(--line)] px-2 py-0.5 text-[0.72rem] text-[var(--ink-soft)]"
                  >
                    {tech}
                  </li>
                ))}
              </ul>

              <div className="mt-5 flex flex-wrap gap-4">
                {project.links.live && (
                  <a
                    href={project.links.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[0.82rem] font-medium text-[var(--ink)] underline-offset-4 hover:underline"
                  >
                    Live Demo
                    <ArrowUpRight size={14} aria-hidden />
                  </a>
                )}
                {project.links.github && (
                  <a
                    href={project.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[0.82rem] font-medium text-[var(--ink-soft)] underline-offset-4 hover:text-[var(--ink)] hover:underline"
                  >
                    <Code2 size={14} aria-hidden />
                    GitHub
                  </a>
                )}
              </div>
            </article>
          </li>
        ))}
      </ul>

      {/* Floating preview — desktop pointers only */}
      <AnimatePresence>
        {activeProject && !reduceMotion && (
          <motion.div
            key={activeProject.slug}
            aria-hidden="true"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ left: point.x + 28, top: point.y - 90 }}
            className="pointer-events-none absolute z-20 hidden w-64 lg:block"
          >
            <ProjectVisual
              title={activeProject.title}
              image={activeProject.image}
              imageKind={activeProject.imageKind}
              hint={activeProject.stack[0]}
              className="shadow-2xl shadow-[#16293c]/15"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
