/** Exponential smoothing with a fixed time constant, regardless of refresh rate. */
export function smoothProgress(current: number, target: number, elapsedMs: number) {
  const next = current + (target - current) * -Math.expm1(-Math.max(0, elapsedMs) / 65);
  return Math.abs(target - next) < 0.0005 ? target : next;
}

export function cardOpacity(distance: number) {
  const ease = (value: number) => value * value * (3 - 2 * value);
  const proximity = Math.min(1, Math.abs(distance));
  return {
    surface: 1 - ease(proximity),
    content: 1 - ease(Math.min(1, proximity * 2)),
  };
}
