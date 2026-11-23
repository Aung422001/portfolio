"use client";

import { useEffect, useRef } from "react";
import { projects } from "@/data/projects";

const selected = ["triapex", "merbolo", "applytrail"].map((slug) => projects.find((p) => p.slug === slug)!).filter(Boolean);

export function MotionGallery() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const sceneRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = heroRef.current;
    if (!canvas || !hero) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let w = 1, h = 1, tick = 0;
    let px = 0, py = 0, tx = 0, ty = 0;
    let visible = false;
    let lastTime = 0;
    let rings = 17, steps = 95;
    let vertices: number[][][] = [];
    let glow: CanvasGradient;
    let cx = 0, cy = 0, radius = 0;
    const resize = () => {
      const rect = hero.getBoundingClientRect();
      w = Math.max(1, rect.width); h = Math.max(1, rect.height);
      const dpr = Math.min(window.devicePixelRatio || 1, w < 700 ? 1 : 1.5);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      rings = w < 700 ? 12 : 17;
      steps = w < 700 ? 64 : 95;
      vertices = Array.from({ length: rings }, (_, j) => {
        const a = j / rings * Math.PI * 2;
        return Array.from({ length: steps + 1 }, (_, i) => {
          const b = i / steps * Math.PI * 2;
          const r = 1.05 + .36 * Math.cos(b);
          return [r * Math.cos(a), r * Math.sin(a), .36 * Math.sin(b)];
        });
      });
      cx = w * (w < 700 ? .68 : .73); cy = h * .49;
      radius = Math.min(w * (w < 700 ? .32 : .24), h * .39, 230);
      glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 1.8);
      glow.addColorStop(0, "rgba(56,109,206,.14)");
      glow.addColorStop(1, "rgba(56,109,206,0)");
      if (reduced) render(0);
    };
    const pointer = (event: PointerEvent) => {
      if (reduced || event.pointerType !== "mouse") return;
      const rect = hero.getBoundingClientRect();
      tx = ((event.clientX - rect.left) / rect.width - .5) * 2;
      ty = ((event.clientY - rect.top) / rect.height - .5) * 2;
    };
    const render = (time: number) => {
      raf = 0;
      if (!reduced && (!visible || document.hidden)) return;
      const dt = lastTime ? Math.min(time - lastTime, 50) : 16.67;
      lastTime = time;
      ctx.clearRect(0, 0, w, h);
      const blend = 1 - Math.pow(.955, dt / 16.67);
      px += (tx - px) * blend;
      py += (ty - py) * blend;
      if (!reduced) tick += .007 * dt / 16.67;
      const ay = tick + px * .38, ax = .45 + Math.sin(tick * .5) * .22 - py * .3;
      const cosY = Math.cos(ay), sinY = Math.sin(ay), cosX = Math.cos(ax), sinX = Math.sin(ax);
      ctx.lineWidth = 1;
      for (let j = 0; j < rings; j++) {
        const a = j / rings * Math.PI * 2;
        ctx.beginPath();
        for (let i = 0; i <= steps; i++) {
          const [x, y, z] = vertices[j][i];
          const xr = x * cosY + z * sinY;
          const zr = -x * sinY + z * cosY;
          const yr = y * cosX - zr * sinX;
          const depth = y * sinX + zr * cosX;
          const scale = 2.8 / (2.8 + depth * .3);
          const sx = cx + xr * radius * .65 * scale;
          const sy = cy + yr * radius * .65 * scale;
          if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
        }
        ctx.strokeStyle = `rgba(116,169,255,${.14 + .24 * (1 + Math.sin(a + tick)) / 2})`;
        ctx.stroke();
      }
      ctx.fillStyle = glow;
      ctx.fillRect(cx - radius * 1.8, cy - radius * 1.8, radius * 3.6, radius * 3.6);
      if (!reduced) raf = requestAnimationFrame(render);
    };
    const sync = () => {
      if (!reduced && visible && !document.hidden) {
        if (!raf) { lastTime = 0; raf = requestAnimationFrame(render); }
      } else { cancelAnimationFrame(raf); raf = 0; }
    };
    const observer = new IntersectionObserver((entries) => { visible = entries[0]?.isIntersecting ?? false; sync(); });
    resize();
    observer.observe(hero);
    document.addEventListener("visibilitychange", sync);
    const ro = new ResizeObserver(resize);
    ro.observe(hero);
    hero.addEventListener("pointermove", pointer);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); observer.disconnect(); hero.removeEventListener("pointermove", pointer); document.removeEventListener("visibilitychange", sync); };
  }, []);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    let raf = 0;
    let current = 0;
    let target = 0;
    let active = false;
    let start = 0, range = 1, lastTime = 0;
    const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
    const ease = (value: number) => value * value * (3 - 2 * value);

    const paint = (time: number) => {
      raf = 0;
      if (!active) return;
      target = clamp((window.scrollY - start) / range, 0, 1);
      const dt = lastTime ? Math.min(time - lastTime, 50) : 16.67;
      lastTime = time;
      current += (target - current) * (1 - Math.pow(.82, dt / 16.67));
      if (Math.abs(target - current) < 0.0005) current = target;
      const progress = current * (selected.length - 1);
      cardsRef.current.forEach((card, index) => {
        if (!card) return;
        const distance = progress - index;
        const proximity = clamp(Math.abs(distance), 0, 1);
        const fade = 1 - ease(proximity);
        const translateY = distance < 0 ? 34 * ease(proximity) : -24 * ease(proximity);
        const scale = 1 - 0.10 * ease(proximity);
        const rotate = distance < 0 ? 8 * ease(proximity) : -7 * ease(proximity);
        card.style.transform = `translate3d(0,${translateY}%,0) scale(${scale}) rotateX(${rotate}deg)`;
        card.style.opacity = String(fade);
        card.style.pointerEvents = fade > 0.85 ? "auto" : "none";
        card.style.visibility = fade < 0.005 ? "hidden" : "visible";
      });
      if (current !== target) raf = requestAnimationFrame(paint);
    };

    const schedule = () => { if (active && !raf) { lastTime = 0; raf = requestAnimationFrame(paint); } };
    const measure = () => {
      const rect = scene.getBoundingClientRect();
      start = rect.top + window.scrollY;
      range = Math.max(1, scene.offsetHeight - (scene.firstElementChild?.clientHeight ?? window.innerHeight));
      schedule();
    };
    const observer = new IntersectionObserver((entries) => {
      active = entries[0]?.isIntersecting ?? true;
      if (active) { measure(); current = clamp((window.scrollY - start) / range, 0, 1); }
      else { cancelAnimationFrame(raf); raf = 0; }
    }, { rootMargin: "200px" });
    observer.observe(scene);
    window.addEventListener("scroll", schedule, { passive: true });
    const ro = new ResizeObserver(measure);
    ro.observe(scene);
    window.addEventListener("resize", measure);
    measure();
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      ro.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <div className="motion-combo border-t border-[var(--line)]">
      <section ref={heroRef} aria-label="Interactive 3D motion introduction" className="relative isolate flex min-h-[580px] items-center overflow-hidden px-6 py-24 sm:px-12 lg:min-h-[690px]">
        <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" />
        <div className="pointer-events-none relative z-10 max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[.25em] text-[var(--lagoon)]">Interactive experience / 01</p>
          <h2 className="h-display mt-6 text-[clamp(3.3rem,8vw,7rem)] leading-[.99]">Ideas into<br/><span className="text-[var(--lagoon)]">motion.</span></h2>
          <p className="mt-7 max-w-md text-base leading-relaxed text-[var(--ink-soft)]">I turn complex problems into practical digital experiences. Move your cursor to explore the geometry, then scroll through selected work.</p>
          <p className="mt-8 font-mono text-xs uppercase tracking-[.18em] text-[var(--lagoon)]">Scroll to explore ↓</p>
        </div>
      </section>
      <section ref={sceneRef} aria-label="Scroll-controlled project showcase" className="motion-gallery-scene relative h-[380vh]">
        <div className="sticky top-0 flex h-svh items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_center,#172a4a_0%,#0b1120_72%)] px-5" style={{ perspective: "1200px" }}>
          <div className="relative h-[min(57vh,500px)] w-full max-w-4xl" style={{ transformStyle: "preserve-3d" }}>
            {selected.map((project, index) => (
              <article key={project.slug} ref={(node) => { cardsRef.current[index] = node; }} className="motion-gallery-card absolute inset-0 flex flex-col justify-between overflow-hidden rounded-3xl border border-[#5d7aaf] bg-[linear-gradient(140deg,#1b355d,#10182a_72%)] p-6 shadow-2xl shadow-black/50 sm:p-12" style={{ zIndex: selected.length - index, opacity: index === 0 ? 1 : 0, transform: index === 0 ? "none" : "translateY(34%) scale(.9) rotateX(8deg)" }}>
                <div className="flex items-start justify-between gap-3 font-mono text-xs uppercase tracking-[.2em] text-[#b4d1ff]"><span>0{index + 1} / 0{selected.length}</span><span>Selected work</span></div>
                <div className="relative z-10">
                  <p className="mb-4 text-sm text-[#afc5e5]">{project.tagline}</p>
                  <h3 className="h-display max-w-2xl text-[clamp(2.5rem,6vw,5.5rem)] leading-none">{project.title}</h3>
                  <p className="mt-5 max-w-lg text-sm leading-relaxed text-[#bdcce2]">{project.description}</p>
                </div>
                <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
                  <span className="font-mono text-xs text-[#9ec3ff]">{project.stack.slice(0, 4).join(" / ")}</span>
                  {project.links.live && <a href={project.links.live} target="_blank" rel="noopener noreferrer" className="rounded-full border border-[#7ea7df] px-4 py-2 text-sm font-medium transition-colors hover:bg-[#284d7a]">View live project ↗</a>}
                </div>
              </article>
            ))}
          </div>
          <p className="pointer-events-none absolute bottom-6 font-mono text-xs uppercase tracking-[.2em] text-[var(--ink-soft)]">Scroll to travel through projects ↓</p>
        </div>
      </section>
      <div className="px-6 py-12 text-center font-mono text-xs uppercase tracking-[.2em] text-[var(--lagoon)]">Explore the full project details below ↓</div>
    </div>
  );
}
