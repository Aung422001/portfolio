import { ArrowUpRight } from "lucide-react";
import { education, experience } from "@/data/experience";
import { profile } from "@/data/profile";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { Button } from "@/components/ui/Button";
import type { ExperienceEntry } from "@/types";

function EntryRow({ entry }: { entry: ExperienceEntry }) {
  return (
    <Reveal as="li" className="border-t border-[var(--line)] py-8">
      <div className="grid gap-5 lg:grid-cols-[1fr_1.4fr] lg:gap-12">
        <div>
          <h3 className="text-[0.72rem] uppercase tracking-[0.16em] text-[var(--ink)]">
            {entry.role}
          </h3>
          <p className="mt-2 text-[0.92rem] text-[var(--ink-soft)]">
            {entry.company}
          </p>
          <p className="mt-1 text-[0.8rem] tabular-nums text-[var(--ink-faint)]">
            {entry.period}
          </p>
        </div>

        <div>
          <p className="text-[0.93rem] leading-relaxed text-[var(--ink-soft)]">
            {entry.summary}
          </p>

          {entry.responsibilities.length > 0 && (
            <ul className="mt-5 grid gap-x-8 gap-y-2 sm:grid-cols-2">
              {entry.responsibilities.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-[0.85rem] text-[var(--ink-soft)]"
                >
                  <span
                    aria-hidden
                    className="mt-[0.55em] h-1 w-1 flex-none rounded-full bg-[var(--lagoon)]"
                  />
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Reveal>
  );
}

export function Experience() {
  return (
    <Section
      id="experience"
      marqueeText="Experience"
      className="border-t border-[var(--line)] py-16 sm:py-20"
    >
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-xl">
          <RevealText
            id="experience-heading"
            className="h-display text-[clamp(1.9rem,4.4vw,3.1rem)] text-[var(--ink)]"
          >
            Experience
          </RevealText>
          <p className="mt-4 text-[0.95rem] leading-relaxed text-[var(--ink-soft)]">
            Where I&rsquo;ve worked and what I studied.
          </p>
        </div>

        {profile.cvAvailable && (
          <Button href={profile.cvPath} size="sm" download>
            Download full CV
            <ArrowUpRight size={15} aria-hidden />
          </Button>
        )}
      </div>

      <ul className="mt-10">
        {experience.map((entry) => (
          <EntryRow key={entry.role + entry.company} entry={entry} />
        ))}
        {education.map((entry) => (
          <EntryRow key={entry.role + entry.company} entry={entry} />
        ))}
      </ul>
    </Section>
  );
}
