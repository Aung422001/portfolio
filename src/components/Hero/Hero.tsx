import type { CSSProperties } from "react";
import { ArrowDownToLine, ArrowRight } from "lucide-react";
import { profile } from "@/data/profile";
import { Button } from "@/components/ui/Button";

/**
 * Deliberately a server component with a CSS entrance rather than a Framer one.
 *
 * Framer serialises `initial` into the server HTML as `opacity:0`, so a
 * Framer hero stays blank until hydration finishes — the largest text on the
 * page, gated behind JavaScript. That costs LCP and looks broken on a slow
 * connection. CSS animates on first paint and ships no client JS.
 *
 * Framer still drives the scroll reveals further down, where the content is
 * off-screen at load and the trade-off doesn't apply.
 */

const delay = (seconds: number) => ({ "--d": `${seconds}s` }) as CSSProperties;

export function Hero() {
  return (
    <section id="home" aria-labelledby="hero-heading" className="relative">
      <div className="mx-auto w-full max-w-6xl px-5 pb-20 pt-16 sm:px-8 sm:pb-28 sm:pt-24 lg:px-12 lg:pb-36 lg:pt-32">
        <p
          style={delay(0.05)}
          className="hero-in inline-flex items-center gap-2.5 rounded-full border border-[var(--line)] bg-white/60 px-3.5 py-1.5 text-[0.78rem] text-[var(--ink-soft)]"
        >
          <span className="relative flex h-1.5 w-1.5" aria-hidden>
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-70" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </span>
          {profile.availability}
        </p>

        <h1 id="hero-heading" className="mt-7">
          <span
            style={delay(0.12)}
            className="hero-in h-display block text-[clamp(2.4rem,7.5vw,5.4rem)] text-[var(--ink)]"
          >
            Hi, I&rsquo;m {profile.firstName}.
          </span>
          <span
            style={delay(0.19)}
            className="hero-in h-display mt-1 block text-[clamp(2.4rem,7.5vw,5.4rem)] text-[var(--ink-ghost)]"
          >
            {profile.role}.
          </span>
        </h1>

        <p
          style={delay(0.26)}
          className="hero-in mt-7 max-w-xl text-[1.02rem] leading-relaxed text-[var(--ink-soft)]"
        >
          {profile.heroSupport}
        </p>

        <div style={delay(0.33)} className="hero-in mt-9 flex flex-wrap gap-3">
          <Button href="#projects">
            View Projects
            <ArrowRight size={16} aria-hidden />
          </Button>
          {profile.cvAvailable && (
            <Button href={profile.cvPath} variant="outline" download>
              <ArrowDownToLine size={16} aria-hidden />
              Download CV
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
