/** Exponential smoothing with a fixed time constant, regardless of refresh rate. */
export function smoothProgress(current: number, target: number, elapsedMs: number, timeConstant = 65) {
  const next = current + (target - current) * -Math.expm1(-Math.max(0, elapsedMs) / timeConstant);
  return Math.abs(target - next) < 0.0005 ? target : next;
}

/** The incoming opaque card slides over the outgoing card.
 * There is always a complete card surface behind it, even at a stopped midpoint.
 */
export function stackedCardPose(distance: number) {
  const d = Math.max(-1, Math.min(1, distance));
  const p = Math.abs(d);
  const travel = .5 * p + .5 * p * p * (3 - 2 * p);
  return {
    translateY: d < 0 ? travel * 100 : 0,
    tilt: d < 0 ? p * 7 : 0,
    scale: d < 0 ? 1 - p * .025 : 1,
    visible: p < 1,
  };
}

export function frameStats(intervals: number[], refreshInterval: number) {
  const sorted = [...intervals].sort((a, b) => a - b);
  const duration = intervals.reduce((sum, delta) => sum + delta, 0);
  const missed = intervals.reduce((sum, delta) => sum + Math.max(0, Math.round(delta / refreshInterval) - 1), 0);
  return { fps: intervals.length * 1000 / duration, missed, p95: sorted[Math.ceil(sorted.length * .95) - 1], max: sorted.at(-1) ?? 0, frames: intervals.length };
}
