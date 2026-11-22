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
    let visible = true;
    const resize = () => {
      const rect = hero.getBoundingClientRect();
      w = Math.max(1, rect.width); h = Math.max(1, rect.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const pointer = (event: PointerEvent) => {
      const rect = hero.getBoundingClientRect();
      tx = ((event.clientX - rect.left) / rect.width - .5) * 2;
      ty = ((event.clientY - rect.top) / rect.height - .5) * 2;
    };
    const observer = new IntersectionObserver((entries) => { visible = entries[0]?.isIntersecting ?? true; });
    observer.observe(hero);
    const render = () => {
      raf = requestAnimationFrame(render);
      if (!visible) return;
      ctx.clearRect(0, 0, w, h);
      px += (tx - px) * .045;
      py += (ty - py) * .045;
      if (!reduced) tick += .007;
      const cx = w * (w < 700 ? .68 : .73), cy = h * .49;
      const radius = Math.min(w * (w < 700 ? .32 : .24), h * .39, 230);
      const rings = 17, steps = 95;
      ctx.lineWidth = 1;
      for (let j = 0; j < rings; j++) {
        const a = j / rings * Math.PI * 2;
        ctx.beginPath();
        for (let i = 0; i <= steps; i++) {
          const b = i / steps * Math.PI * 2;
          const x = (1.05 + .36 * Math.cos(b)) * Math.cos(a);
          const y = (1.05 + .36 * Math.cos(b)) * Math.sin(a);
          const z = .36 * Math.sin(b);
          const ay = tick + px * .38, ax = .45 + Math.sin(tick * .5) * .22 - py * .3;
          const xr = x * Math.cos(ay) + z * Math.sin(ay);
          const zr = -x * Math.sin(ay) + z * Math.cos(ay);
          const yr = y * Math.cos(ax) - zr * Math.sin(ax);
          const depth = y * Math.sin(ax) + zr * Math.cos(ax);
          const scale = 2.8 / (2.8 + depth * .3);
          const sx = cx + xr * radius * .65 * scale;
          const sy = cy + yr * radius * .65 * scale;
          if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
        }
        ctx.strokeStyle = `rgba(116,169,255,${.14 + .24 * (1 + Math.sin(a + tick)) / 2})`;
        ctx.stroke();
      }
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 1.8);
      glow.addColorStop(0, "rgba(56,109,206,.14)");
      glow.addColorStop(1, "rgba(56,109,206,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(cx - radius * 1.8, cy - radius * 1.8, radius * 3.6, radius * 3.6);
    };
    resize();
    render();
    const ro = new ResizeObserver(resize);
    ro.observe(hero);
    hero.addEventListener("pointermove", pointer);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); observer.disconnect(); hero.removeEventListener("pointermove", pointer); };
  }, []);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    let raf = 0, current = 0;
    const update = () => {
      const rect = scene.getBoundingClientRect();
      const range = Math.max(1, scene.offsetHeight - window.innerHeight);
      const target = Math.max(0, Math.min(1, -rect.top / range));
      current += (target - current) * .12;
      cardsRef.current.forEach((card, index) => {
        if (!card) return;
        const phase = current * selected.length - index;
        const ahead = phase < 0;
        const y = ahead ? 70 + -phase * 18 : -Math.min(phase, 1.5) * 115;
        const z = ahead ? -150 : -Math.min(phase, 1.5) * 250;
        const rotate = ahead ? 12 : -Math.min(phase, 1.5) * 14;
        const opacity = ahead ? Math.max(0, 1 + phase * 2.5) : Math.max(0, 1 - phase * 1.8);
        card.style.transform = `translate3d(0,${y}%,${z}px) rotateX(${rotate}deg)`;
        card.style.opacity = String(opacity);
        card.style.pointerEvents = opacity > .6 ? "auto" : "none";
      });
      raf = requestAnimationFrame(update);
    };
    update();
    return () => cancelAnimationFrame(raf);
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
      <section ref={sceneRef} aria-label="Scroll-controlled project showcase" className="motion-gallery-scene relative h-[310vh]">
        <div className="sticky top-0 flex h-svh items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_center,#172a4a_0%,#0b1120_72%)] px-5" style={{ perspective: "1200px" }}>
          <div className="relative h-[min(57vh,500px)] w-full max-w-4xl" style={{ transformStyle: "preserve-3d" }}>
            {selected.map((project, index) => (
              <article key={project.slug} ref={(node) => { cardsRef.current[index] = node; }} className="motion-gallery-card absolute inset-0 flex flex-col justify-between overflow-hidden rounded-3xl border border-[#5d7aaf] bg-[linear-gradient(140deg,#1b355d,#10182a_72%)] p-6 shadow-2xl shadow-black/50 sm:p-12" style={{ zIndex: selected.length - index, opacity: index === 0 ? 1 : 0, transform: index === 0 ? "none" : "translateY(100%)" }}>
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
