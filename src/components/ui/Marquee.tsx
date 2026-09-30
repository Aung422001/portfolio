interface MarqueeProps {
  text: string;
  /** Seconds for one full loop. Longer text wants a longer duration. */
  duration?: number;
  repeat?: number;
}

/**
 * The reference heads each section with its title scrolling horizontally.
 * Two identical tracks sit side by side and the pair translates by exactly
 * half its width, so the loop has no seam.
 *
 * It is decorative — the real heading lives in <Section> — so the whole band
 * is hidden from assistive tech rather than read out six times.
 */
export function Marquee({ text, duration = 30, repeat = 4 }: MarqueeProps) {
  const track = (
    <div className="marquee-track" aria-hidden="true">
      {Array.from({ length: repeat }, (_, i) => (
        <span
          key={i}
          className="h-display whitespace-nowrap px-[0.35em] text-[clamp(3rem,11vw,8rem)] text-[var(--ink)]/[0.07]"
        >
          {text}
        </span>
      ))}
    </div>
  );

  return (
    <div
      className="relative select-none overflow-hidden py-2"
      aria-hidden="true"
      role="presentation"
    >
      <div
        className="marquee"
        style={{ ["--marquee-duration" as string]: `${duration}s` }}
      >
        {track}
        {track}
      </div>
    </div>
  );
}
