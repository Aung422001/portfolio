"use client";

import { useEffect, useRef, useState } from "react";
import { projects } from "@/data/projects";
import { nextCanvasDeadline, smoothProgress, stackedCardPose, TOUCH_SMOOTHING_MS } from "./motionMath";
import { GalleryDiagnostics } from "./GalleryDiagnostics";

const selected = ["triapex", "merbolo", "applytrail"].map((slug) => projects.find((p) => p.slug === slug)!).filter(Boolean);
const FRAME_MS = 1000 / 60;
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

// Build once per detail level, not per resize or frame.
function makeGeometry(rings: number, steps: number) {
  return Array.from({ length: rings }, (_, j) => {
    const angle = j / rings * Math.PI * 2;
    const cos = Math.cos(angle), sin = Math.sin(angle);
    const points = new Float32Array((steps + 1) * 3);
    for (let i = 0; i <= steps; i++) {
      const b = i / steps * Math.PI * 2;
      const r = 1.05 + .36 * Math.cos(b);
      points.set([r * cos, r * sin, .36 * Math.sin(b)], i * 3);
    }
    return { points, cos, sin };
  });
}

export function MotionGallery() {
  const [paused, setPaused] = useState(false);
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
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = preference.matches || paused;
    let raf = 0;
    let w = 1, h = 1, tick = 0;
    let px = 0, py = 0, tx = 0, ty = 0;
    let visible = false;
    let lastTime = 0;
    let mobile = false, drawDeadline = 0;
    const desktopGeometry = makeGeometry(17, 95);
    const mobileGeometry = makeGeometry(12, 56);
    let geometry = desktopGeometry;
    let glow: CanvasGradient;
    let cx = 0, cy = 0, radius = 0;
    const resize = () => {
      const width = Math.max(1, hero.clientWidth), height = Math.max(1, hero.clientHeight);
      const dpr = Math.min(window.devicePixelRatio || 1, width < 700 ? 1 : 1.5);
      if (width === w && height === h && canvas.width === Math.round(width * dpr) && canvas.height === Math.round(height * dpr)) return;
      w = width; h = height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      mobile = w < 700;
      geometry = mobile ? mobileGeometry : desktopGeometry;
      cx = w * (w < 700 ? .68 : .73); cy = h * .49;
      radius = Math.min(w * (w < 700 ? .32 : .24), h * .39, 230);
      glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 1.8);
      glow.addColorStop(0, "rgba(56,109,206,.14)");
      glow.addColorStop(1, "rgba(56,109,206,0)");
      if (reduced) render(0);
    };
    const pointer = (event: PointerEvent) => {
      if (reduced || event.pointerType !== "mouse") return;
      tx = (event.offsetX / w - .5) * 2;
      ty = (event.offsetY / h - .5) * 2;
    };
    const resetPointer = () => { tx = 0; ty = 0; };
    const render = (time: number) => {
      raf = 0;
      if (!reduced && (!visible || document.hidden)) return;
      // On phones, limit expensive canvas paints to roughly 60 Hz even on 120 Hz screens.
      if (!reduced && mobile) {
        const next = nextCanvasDeadline(time, drawDeadline, FRAME_MS);
        if (next === null) {
          raf = requestAnimationFrame(render);
          return;
        }
        drawDeadline = next;
      }
      const dt = lastTime ? clamp(time - lastTime, 0, 50) : FRAME_MS;
      lastTime = time;
      ctx.clearRect(0, 0, w, h);
      const blend = 1 - Math.pow(.955, dt / FRAME_MS);
      px += (tx - px) * blend;
      py += (ty - py) * blend;
      if (!reduced) tick += .007 * dt / FRAME_MS;
      const ay = tick + px * .38, ax = .45 + Math.sin(tick * .5) * .22 - py * .3;
      const cosY = Math.cos(ay), sinY = Math.sin(ay), cosX = Math.cos(ax), sinX = Math.sin(ax);
      ctx.lineWidth = 1;
      const sinTick = Math.sin(tick), cosTick = Math.cos(tick);
      const projectionRadius = radius * .65;
      for (const { points, cos, sin } of geometry) {
        ctx.beginPath();
        for (let i = 0; i < points.length; i += 3) {
          const x = points[i], y = points[i + 1], z = points[i + 2];
          const xr = x * cosY + z * sinY;
          const zr = -x * sinY + z * cosY;
          const yr = y * cosX - zr * sinX;
          const depth = y * sinX + zr * cosX;
          const scale = 2.8 / (2.8 + depth * .3);
          const sx = cx + xr * projectionRadius * scale;
          const sy = cy + yr * projectionRadius * scale;
          if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
        }
        ctx.strokeStyle = `rgba(116,169,255,${.14 + .12 * (1 + sin * cosTick + cos * sinTick)})`;
        ctx.stroke();
      }
      ctx.fillStyle = glow;
      ctx.fillRect(cx - radius * 1.8, cy - radius * 1.8, radius * 3.6, radius * 3.6);
      if (!reduced) raf = requestAnimationFrame(render);
    };
    const sync = () => {
      if (!reduced && visible && !document.hidden) {
        if (!raf) { lastTime = 0; drawDeadline = 0; raf = requestAnimationFrame(render); }
      } else { cancelAnimationFrame(raf); raf = 0; }
    };
    const onPreference = () => {
      reduced = preference.matches || paused;
      sync();
      if (reduced) { tick = px = py = tx = ty = 0; render(0); }
    };
    const observer = new IntersectionObserver((entries) => { visible = entries[0]?.isIntersecting ?? false; sync(); });
    resize();
    observer.observe(hero);
    document.addEventListener("visibilitychange", sync);
    const ro = new ResizeObserver(resize);
    ro.observe(hero);
    hero.addEventListener("pointermove", pointer);
    hero.addEventListener("pointerleave", resetPointer);
    preference.addEventListener("change", onPreference);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); observer.disconnect(); hero.removeEventListener("pointermove", pointer); hero.removeEventListener("pointerleave", resetPointer); preference.removeEventListener("change", onPreference); document.removeEventListener("visibilitychange", sync); };
  }, [paused]);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    const staticLayout = window.matchMedia("(prefers-reduced-motion: reduce), (max-height: 520px)");
    const isStatic = () => paused || staticLayout.matches;
    const compactLayout = window.matchMedia("(max-width: 699px)");
    let raf = 0;
    let current = 0;
    let target = 0;
    let active = false;
    let start = 0, range = 1, lastTime = 0;
    let previousProgress = -1;
    let selectedIndex = -2;
    const paintedDistances: number[] = [];
    const paintedVisibility: boolean[] = [];

    const readTarget = () => clamp((window.scrollY - start) / range, 0, 1);
    const updateCards = () => {
      const progress = current * (selected.length - 1);
      if (progress === previousProgress) return;
      previousProgress = progress;
      const compact = compactLayout.matches;
      const nearest = Math.round(progress);
      const nextIndex = nearest;
      cardsRef.current.forEach((card, index) => {
        if (!card) return;
        const distance = clamp(progress - index, -1, 1);
        // Keep the outgoing surface fully opaque and stationary until covered.
        const poseKey = distance >= 0 && distance < 1 ? 0 : distance;
        if (paintedDistances[index] !== poseKey) {
          paintedDistances[index] = poseKey;
          const pose = stackedCardPose(distance);
          card.style.transform = compact ? `translate3d(0,${pose.translateY}%,0)` : `translate3d(0,${pose.translateY}%,0) perspective(1200px) rotateX(${pose.tilt}deg) scale(${pose.scale})`;
          if (paintedVisibility[index] !== pose.visible) {
            paintedVisibility[index] = pose.visible;
            card.style.opacity = pose.visible ? "1" : "0";
            card.style.visibility = pose.visible ? "visible" : "hidden";
          }
        }
        if (nextIndex !== selectedIndex) {
          const interactive = index === nextIndex;
          if (!interactive && card.contains(document.activeElement)) scene.focus({ preventScroll: true });
          card.inert = !interactive;
          card.style.pointerEvents = interactive ? "auto" : "none";
        }
      });
      selectedIndex = nextIndex;
    };

    const paint = (time: number) => {
      raf = 0;
      if (!active || isStatic() || document.hidden) return;
      const dt = Math.max(0, time - lastTime);
      lastTime = time;
      // Sample the latest native scroll position before painting, including momentum.
      target = readTarget();
      current = smoothProgress(current, target, dt, compactLayout.matches ? TOUCH_SMOOTHING_MS : 65);
      updateCards();
      if (current !== target) raf = requestAnimationFrame(paint);
    };

    const stop = () => { cancelAnimationFrame(raf); raf = 0; };
    const schedule = () => {
      if (!active || isStatic() || document.hidden) return;
      target = readTarget();
      if (!raf && current !== target) { lastTime = performance.now(); raf = requestAnimationFrame(paint); }
    };
    const measure = () => {
      const rect = scene.getBoundingClientRect();
      start = rect.top + window.scrollY;
      range = Math.max(1, scene.offsetHeight - (scene.firstElementChild?.clientHeight ?? window.innerHeight));
      schedule();
    };
    const snap = () => {
      stop();
      measure();
      stop();
      current = target = readTarget();
      previousProgress = -1;
      updateCards();
    };
    const onCompactChange = () => {
      paintedDistances.length = 0;
      paintedVisibility.length = 0;
      selectedIndex = -2;
      if (!isStatic() && !document.hidden) snap();
    };
    const sync = () => {
      stop();
      if (isStatic()) {
        selectedIndex = -2;
        previousProgress = -1;
        paintedDistances.length = 0;
        paintedVisibility.length = 0;
        cardsRef.current.forEach((card) => {
          if (!card) return;
          card.inert = false;
          card.style.removeProperty("visibility");
          card.style.removeProperty("pointer-events");
        });
      } else if (!document.hidden) snap();
    };
    const observer = new IntersectionObserver((entries) => {
      active = entries[0]?.isIntersecting ?? true;
      if (active && !isStatic() && !document.hidden) snap();
      else stop();
    }, { rootMargin: "200px" });
    observer.observe(scene);
    window.addEventListener("scroll", schedule, { passive: true });
    const ro = new ResizeObserver(measure);
    ro.observe(scene);
    ro.observe(document.body);
    window.addEventListener("resize", measure);
    staticLayout.addEventListener("change", sync);
    compactLayout.addEventListener("change", onCompactChange);
    document.addEventListener("visibilitychange", sync);
    sync();
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      ro.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", measure);
      staticLayout.removeEventListener("change", sync);
      compactLayout.removeEventListener("change", onCompactChange);
      document.removeEventListener("visibilitychange", sync);
    };
  }, [paused]);

  return (
    <div id="showcase" className={`motion-combo border-t border-[var(--line)]${paused ? " motion-paused" : ""}`}>
      <section ref={heroRef} aria-label="Interactive 3D motion introduction" className="relative isolate flex min-h-[580px] items-center overflow-hidden px-6 py-24 sm:px-12 lg:min-h-[690px]">
        <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" />
        <div className="pointer-events-none relative z-10 max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[.25em] text-[var(--lagoon)]">Interactive experience / 01</p>
          <h2 className="h-display mt-6 text-[clamp(3.3rem,8vw,7rem)] leading-[.99]">Ideas into<br/><span className="text-[var(--lagoon)]">motion.</span></h2>
          <p className="mt-7 max-w-md text-base leading-relaxed text-[var(--ink-soft)]">I turn complex problems into practical digital experiences. Move your cursor to explore the geometry, then scroll through selected work.</p>
          <p className="mt-8 font-mono text-xs uppercase tracking-[.18em] text-[var(--lagoon)]">Scroll to explore ↓</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" aria-pressed={paused} onClick={() => setPaused(value => !value)} className="pointer-events-auto inline-flex min-h-11 items-center rounded-md border border-[var(--line)] px-4 py-3 text-sm text-[var(--ink)]">Pause showcase motion</button>
            <a href="#projects" className="pointer-events-auto inline-flex min-h-11 items-center rounded-md border border-[var(--line)] px-4 py-3 text-sm text-[var(--ink)]">Skip animation · View featured projects →</a>
          </div>
        </div>
      </section>
      <section ref={sceneRef} tabIndex={-1} aria-label="Scroll-controlled project showcase" className="motion-gallery-scene relative h-[380svh]">
        <div className="sticky top-0 flex h-svh items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_center,#172a4a_0%,#0b1120_72%)] px-5">
          <div className="motion-gallery-track relative h-[min(78svh,540px)] w-full max-w-4xl shadow-2xl shadow-black/50">
            {selected.map((project, index) => (
              <article key={project.slug} ref={(node) => { cardsRef.current[index] = node; }} className="motion-gallery-card absolute inset-0 flex flex-col justify-between gap-3 overflow-hidden rounded-3xl border border-[#5d7aaf] bg-[linear-gradient(140deg,#1b355d,#10182a_72%)] p-6 sm:p-8 lg:p-10" style={{ zIndex: index + 1, visibility: index === 0 ? "visible" : "hidden", opacity: index === 0 ? 1 : 0, transform: index === 0 ? "none" : "translateY(100%)" }}>
                <div className="flex items-start justify-between gap-3 font-mono text-xs uppercase tracking-[.2em] text-[#b4d1ff]"><span>0{index + 1} / 0{selected.length}</span><span>Selected work</span></div>
                <div className="relative z-10">
                  <p className="mb-4 text-sm text-[#afc5e5]">{project.tagline}</p>
                  <h3 className="h-display max-w-2xl text-[clamp(2.2rem,5vw,4.2rem)] leading-none">{project.title}</h3>
                  <p className="mt-5 max-w-lg text-sm leading-relaxed text-[#bdcce2]">{project.description}</p>
                </div>
                <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
                  <span className="font-mono text-xs text-[#9ec3ff]">{project.stack.slice(0, 4).join(" / ")}</span>
                  {project.links.live && <a href={project.links.live} aria-label={`View live project ↗: ${project.title} (opens in new tab)`} target="_blank" rel="noopener noreferrer" className="rounded-full border border-[#7ea7df] px-4 py-2 text-sm font-medium transition-colors hover:bg-[#284d7a]">View live project ↗</a>}
                </div>
              </article>
            ))}
          </div>
          <p className="pointer-events-none absolute bottom-6 font-mono text-xs uppercase tracking-[.2em] text-[var(--ink-soft)]">Scroll to travel through projects ↓</p>
        </div>
      </section>
      <div className="px-6 py-12 text-center font-mono text-xs uppercase tracking-[.2em] text-[var(--lagoon)]"><a href="#projects" className="underline underline-offset-4">Explore the full project details below ↓</a></div>
      {!paused && <GalleryDiagnostics sceneRef={sceneRef} />}
    </div>
  );
}
