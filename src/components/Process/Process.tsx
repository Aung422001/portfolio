import { processSteps } from "@/data/experience";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

export function Process() {
  return (
    <Section
      id="process"
      title="How I Build"
      subtitle="The same five steps on every project, whether it is a weekend build or a fourteen-week platform."
      centered
      className="border-t border-[var(--line)] py-16 sm:py-20"
    >
      <ol className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2 lg:grid-cols-5">
        {processSteps.map((step, index) => (
          <Reveal
            as="li"
            key={step.number}
            delay={index * 0.06}
            className="bg-[var(--shell)] p-6"
          >
            <span className="text-[0.75rem] tabular-nums tracking-[0.12em] text-[var(--ink-faint)]">
              {step.number}
            </span>
            <h3 className="mt-6 text-[1rem] font-medium tracking-tight text-[var(--ink)]">
              {step.title}
            </h3>
            <p className="mt-2 text-[0.85rem] leading-relaxed text-[var(--ink-soft)]">
              {step.description}
            </p>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
