"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

interface RevealTextProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** The heading level to render — this wraps the text, it doesn't replace it. */
  as?: "h2" | "h3" | "span" | "p";
  id?: string;
}

/**
 * Heading that rises out of a mask, matching the hero's entrance.
 *
 * Same additive approach as <Reveal>: the markup renders visible, and the
 * clipped state only applies under `.js-reveal`, which the inline script in
 * layout.tsx removes again if React never mounts.
 */
export function RevealText({
  children,
  className = "",
  delay = 0,
  as = "h2",
  id,
}: RevealTextProps) {
  const Component = as as ElementType;
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      node.classList.add("is-visible");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Component ref={ref} id={id} className={`reveal-mask ${className}`}>
      <span
        style={delay ? ({ "--rd": `${delay}s` } as React.CSSProperties) : undefined}
      >
        {children}
      </span>
    </Component>
  );
}
