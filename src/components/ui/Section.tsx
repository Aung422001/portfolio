import type { ReactNode } from "react";
import { Marquee } from "./Marquee";
import { RevealText } from "./RevealText";

interface SectionProps {
  id: string;
  /** Repeated across the marquee band that heads the section. */
  marqueeText?: string;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  /** Centres the title block, as the reference does for most sections. */
  centered?: boolean;
}

export function Section({
  id,
  marqueeText,
  title,
  subtitle,
  children,
  className = "",
  centered = false,
}: SectionProps) {
  const headingId = `${id}-heading`;

  return (
    <section id={id} aria-labelledby={title ? headingId : undefined} className={className}>
      {marqueeText && <Marquee text={marqueeText} />}

      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8 lg:px-12">
        {title && (
          <div className={centered ? "mx-auto max-w-2xl text-center" : "max-w-3xl"}>
            <RevealText
              id={headingId}
              className="h-display text-[clamp(1.9rem,4.2vw,3rem)] text-[var(--ink)]"
            >
              {title}
            </RevealText>
            {subtitle && (
              <p className="mt-4 text-[0.95rem] leading-relaxed text-[var(--ink-soft)]">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {children}
      </div>
    </section>
  );
}
