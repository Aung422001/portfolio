import { skillGroups } from "@/data/skills";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

export function Skills() {
  return (
    <Section
      id="skills"
      title="Skills"
      subtitle="The stack I reach for, grouped by where it sits in a project."
      className="border-t border-[var(--line)] py-16 sm:py-20"
    >
      {/* Four groups, so four columns on wide screens — a 3-col grid would
          leave a dead cell in the second row. */}
      <ul className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2 lg:grid-cols-4">
        {skillGroups.map((group, index) => (
          <Reveal
            as="li"
            key={group.title}
            delay={index * 0.05}
            className="bg-[var(--shell)] p-6"
          >
            <h3 className="text-[0.72rem] uppercase tracking-[0.16em] text-[var(--ink-faint)]">
              {group.title}
            </h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="rounded-lg bg-[#eef8f7] px-2.5 py-1.5 text-[0.82rem] text-[var(--ink-soft)]"
                >
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
