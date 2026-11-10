import { ArrowDownRight, ArrowDownToLine } from "lucide-react";
import { profile } from "@/data/profile";
import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section id="home" aria-labelledby="hero-heading">
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[2fr_1fr] lg:items-center lg:px-12 lg:py-24">
        <div className="hero-in">
          <p className="flex items-center gap-2.5 text-[0.78rem] text-[var(--ink-soft)]">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[var(--lagoon)]" />{profile.availability}
          </p>
          <p className="mt-7 font-mono text-[0.72rem] uppercase tracking-[0.12em] text-[var(--ink-soft)]">{profile.name} / {profile.role}</p>
          <h1 id="hero-heading" className="h-display mt-4 text-[clamp(2.5rem,6.5vw,4.8rem)]">
            Clear interfaces.<br /><span className="text-[var(--lagoon)]">Useful experiences.</span>
          </h1>
          <p className="mt-6 max-w-lg text-[1rem] leading-relaxed text-[var(--ink-soft)]">
            I&rsquo;m {profile.firstName}, a frontend developer building storefronts,
            dashboards and everyday tools with React, Next.js and TypeScript.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="#projects">Explore my work <ArrowDownRight size={16} aria-hidden /></Button>
            {profile.cvAvailable && <Button href={profile.cvPath} variant="outline" download><ArrowDownToLine size={16} aria-hidden /> Download CV</Button>}
          </div>
        </div>
        <aside className="hidden border-l border-[var(--line)] pl-8 lg:block" aria-label="Location and focus">
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-[var(--ink-soft)]">Based in</p>
          <p className="h-display mt-3 text-[1.6rem]">Chiang Mai,<br />Thailand.</p>
          <p className="mt-3 text-[0.78rem] leading-relaxed text-[var(--ink-soft)]">Open to opportunities in {profile.openTo}.</p>
          <div className="my-6 h-px bg-[var(--line)]" />
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-[var(--ink-soft)]">My focus</p>
          <p className="mt-3 text-[1rem] leading-loose text-[var(--lagoon)]">Thoughtful UI.<br />Predictable state.<br />Connected APIs.</p>
        </aside>
      </div>
    </section>
  );
}
