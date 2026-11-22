import { ArrowDownRight, ArrowDownToLine, Github, Linkedin, Code2, Layers3, Database, Sparkles } from "lucide-react";
import { profile } from "@/data/profile";
import { Button } from "@/components/ui/Button";

const capabilities = [
  { icon: Code2, label: "Frontend", detail: "React · Next.js · TypeScript" },
  { icon: Layers3, label: "Full-stack", detail: "Node.js · Express · REST APIs" },
  { icon: Database, label: "Data & state", detail: "PostgreSQL · Prisma · Zustand" },
];

export function Hero() {
  return (
    <section id="home" aria-labelledby="hero-heading" className="relative isolate overflow-hidden">
      <div aria-hidden className="hero-glow pointer-events-none absolute inset-0" />
      <div className="relative mx-auto grid min-h-[min(850px,calc(100svh-4rem))] w-full max-w-6xl items-center gap-12 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[1.25fr_0.75fr] lg:gap-16 lg:px-12">
        <div>
          <p className="hero-story hero-story-1 inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)]/70 px-4 py-2 font-mono text-xs text-[var(--ink-soft)]">
            <Sparkles size={14} aria-hidden className="text-[var(--lagoon)]" />
            Hello, welcome to my portfolio
          </p>
          <p className="hero-story hero-story-2 mt-8 text-sm font-medium tracking-wide text-[var(--ink-soft)]">I&apos;m</p>
          <h1 id="hero-heading" className="hero-story hero-story-3 h-display mt-2 text-[clamp(3.3rem,8vw,6.8rem)] leading-[0.99]">
            Aung Kyaw<br /><span className="text-[var(--lagoon)]">Hein.</span>
          </h1>
          <div className="hero-story hero-story-4 mt-7">
            <p className="font-mono text-[clamp(0.95rem,2.3vw,1.35rem)] font-medium text-[var(--ink)]">
              <span className="hero-role">{profile.role}</span>
            </p>
            <p className="mt-5 max-w-xl text-[0.98rem] leading-[1.85] text-[var(--ink-soft)]">
              I design and build responsive interfaces, connected applications and practical digital products.
              From storefronts and dashboards to APIs, I enjoy turning complex problems into useful experiences.
            </p>
          </div>
          <div className="hero-story hero-story-5 mt-8 flex flex-wrap gap-3">
            <Button href="#projects">See what I&apos;ve built <ArrowDownRight size={16} aria-hidden /></Button>
            <Button href="#skills" variant="outline">What I can do</Button>
            {profile.cvAvailable && <Button href={profile.cvPath} variant="outline" download><ArrowDownToLine size={16} aria-hidden /> CV</Button>}
          </div>
          <div className="hero-story hero-story-6 mt-8 flex items-center gap-5 text-sm text-[var(--ink-soft)]">
            <a href={profile.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 transition-colors hover:text-[var(--lagoon)]"><Github size={17} aria-hidden /> GitHub</a>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 transition-colors hover:text-[var(--lagoon)]"><Linkedin size={17} aria-hidden /> LinkedIn</a>
          </div>
        </div>
        <aside className="hero-story hero-story-5 relative" aria-label="What I do">
          <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)]/85 p-5 shadow-2xl shadow-black/20 backdrop-blur-sm sm:p-7">
            <div className="mb-6 flex items-center justify-between border-b border-[var(--line)] pb-5">
              <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--ink-soft)]">What I bring</span>
              <span className="flex items-center gap-2 text-xs text-[var(--lagoon)]"><span className="h-2 w-2 rounded-full bg-[var(--lagoon)]" /> Open to work</span>
            </div>
            <div className="space-y-5">
              {capabilities.map(({ icon: Icon, label, detail }, index) => (
                <div key={label} className="hero-capability flex items-start gap-4" style={{ animationDelay: `${1.65 + index * 0.18}s` }}>
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-[var(--line)] bg-[var(--surface-soft)] text-[var(--lagoon)]"><Icon size={20} aria-hidden /></span>
                  <div><h2 className="text-base font-semibold">{label}</h2><p className="mt-1 text-sm leading-relaxed text-[var(--ink-soft)]">{detail}</p></div>
                </div>
              ))}
            </div>
            <div className="mt-7 border-t border-[var(--line)] pt-5 text-xs text-[var(--ink-soft)]">
              B.Tech Computer Science · Chiang Mai, Thailand
            </div>
          </div>
        </aside>
      </div>
      <a href="#projects" className="hero-story hero-story-6 relative mx-auto mb-8 flex w-fit items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-[var(--ink-soft)] transition-colors hover:text-[var(--lagoon)]">Scroll to explore <ArrowDownRight size={16} aria-hidden /></a>
    </section>
  );
}
