/** Exponential smoothing with a fixed time constant, regardless of refresh rate. */
export function smoothProgress(current: number, target: number, elapsedMs: number, timeConstant = 65) {
  const next = current + (target - current) * -Math.expm1(-Math.max(0, elapsedMs) / timeConstant);
  return Math.abs(target - next) < 0.0005 ? target : next;
}

/** On touch screens the incoming opaque card slides over the outgoing card.
 * There is always a complete card surface behind it, even at a stopped midpoint.
 */
export function stackedCardPose(distance: number) {
  const d = Math.max(-1, Math.min(1, distance));
  const p = Math.abs(d);
  const travel = .5 * p + .5 * p * p * (3 - 2 * p);
  return {
    translateY: d < 0 ? travel * 100 : 0,
    visible: p < 1,
  };
}

export function cardOpacity(distance: number) {
  const ease = (value: number) => value * value * (3 - 2 * value);
  const proximity = Math.min(1, Math.abs(distance));
  return {
    surface: 1 - ease(proximity),
    content: 1 - ease(Math.min(1, proximity * 2)),
  };
}
