import { aboutBody, aboutTech, profile, stats } from "@/data/profile";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { Counter } from "@/components/ui/Counter";

export function About() {
  return (
    <Section id="about" marqueeText="About me" className="py-16 sm:py-20">
      <div className="grid gap-10 lg:grid-cols-[0.85fr_1fr] lg:gap-16">
        <Reveal>
          <RevealText
            id="about-heading"
            className="h-display text-[clamp(1.9rem,4.4vw,3.1rem)] text-[var(--ink)]"
          >
            About Me
          </RevealText>
          <p className="mt-5 text-[1.05rem] leading-relaxed text-[var(--ink)]">
            {profile.intro}
          </p>
          <p className="mt-5 text-[0.9rem] text-[var(--ink-faint)]">
            {profile.location} &middot; {profile.education.degree},{" "}
            {profile.education.school}
          </p>
          <p className="mt-2 text-[0.9rem] text-[var(--ink-soft)]">
            Open to roles across {profile.openTo}.
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          {aboutBody.map((paragraph) => (
            <p
              key={paragraph.slice(0, 32)}
              className="mb-4 text-[0.97rem] leading-relaxed text-[var(--ink-soft)]"
            >
              {paragraph}
            </p>
          ))}

          <ul className="mt-6 flex flex-wrap gap-2">
            {aboutTech.map((tech) => (
              <li
                key={tech}
                className="rounded-full border border-[var(--line)] px-3 py-1.5 text-[0.8rem] text-[var(--ink-soft)]"
              >
                {tech}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      <dl className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--line)] sm:mt-16 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-[var(--shell)] px-5 py-7 text-center">
            <dt className="sr-only">{stat.label}</dt>
            <dd>
              <Counter
                value={stat.value}
                className="h-display block text-[clamp(1.8rem,4vw,2.5rem)] tabular-nums text-[var(--ink)]"
              />
              <span className="mt-1 block text-[0.78rem] text-[var(--ink-soft)]">
                {stat.label}
              </span>
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
