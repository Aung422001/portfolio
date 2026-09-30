"use client";

import { useEffect, useRef } from "react";

interface CounterProps {
  /** e.g. "218" or "10+" — digits are counted, any suffix is kept. */
  value: string;
  className?: string;
}

const DURATION = 1400;

/**
 * Counts up when scrolled into view.
 *
 * The real figure is rendered on the server, so it is correct with no JS and
 * correct for crawlers. Only once this mounts does it reset to zero and
 * animate — the number is never wrong, just briefly still.
 */
export function Counter({ value, className = "" }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const match = value.match(/^(\d+)(.*)$/);
    if (!match) return;

    const target = Number(match[1]);
    const suffix = match[2];

    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced || typeof IntersectionObserver === "undefined") return;

    node.textContent = `0${suffix}`;

    let frame = 0;

    const run = () => {
      const started = performance.now();

      const step = (now: number) => {
        // rAF's timestamp is the frame's start, which can be *earlier* than the
        // performance.now() captured a moment ago — without the lower clamp
        // that makes progress negative and flashes a negative number.
        const progress = Math.min(Math.max((now - started) / DURATION, 0), 1);
        // ease-out cubic: quick off the mark, settling onto the final value
        const eased = 1 - Math.pow(1 - progress, 3);
        node.textContent = `${Math.round(target * eased)}${suffix}`;
        if (progress < 1) frame = requestAnimationFrame(step);
      };

      frame = requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer.unobserve(entry.target);
          run();
        });
      },
      { threshold: 0.4 },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
