"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/**
 * MotionConfig is a client-side context provider, so it cannot be imported
 * straight into the server layout. `reducedMotion="user"` makes every Framer
 * animation in the tree honour the OS setting without per-component checks.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
