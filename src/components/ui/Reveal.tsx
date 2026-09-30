"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Seconds. Used to cascade siblings. */
  delay?: number;
  as?: "div" | "li" | "article" | "section";
}

/**
 * Scroll reveal, done additively: the markup renders visible, and the hidden
 * state is only applied once JS has confirmed it can animate (the `js-reveal`
 * class on <html>, set by the inline script in layout.tsx).
 *
 * This is deliberately not a Framer `whileInView`. Framer serialises its
 * `initial` prop into the server HTML as `opacity:0`, which would leave most
 * of this page invisible until hydration finishes — and permanently invisible
 * if hydration ever failed. Framer still drives the things that genuinely need
 * it: the nav indicator, the mobile menu and the project hover preview.
 */
export function Reveal({
  children,
  className = "",
  delay = 0,
  as = "div",
}: RevealProps) {
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
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Component
      ref={ref}
      className={`reveal ${className}`}
      style={delay ? ({ "--rd": `${delay}s` } as React.CSSProperties) : undefined}
    >
      {children}
    </Component>
  );
}
