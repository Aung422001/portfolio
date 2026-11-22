"use client";

import { useRef, type ReactNode, type PointerEvent } from "react";

export function TiltCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    node.style.setProperty("--tilt-x", `${(-y * 6).toFixed(2)}deg`);
    node.style.setProperty("--tilt-y", `${(x * 6).toFixed(2)}deg`);
    node.style.setProperty("--glow-x", `${((x + 0.5) * 100).toFixed(1)}%`);
    node.style.setProperty("--glow-y", `${((y + 0.5) * 100).toFixed(1)}%`);
  };
  const reset = () => {
    const node = ref.current;
    if (!node) return;
    node.style.setProperty("--tilt-x", "0deg");
    node.style.setProperty("--tilt-y", "0deg");
  };
  return <div ref={ref} onPointerMove={onMove} onPointerLeave={reset} onBlur={reset} className={`project-tilt ${className}`}>{children}</div>;
}
