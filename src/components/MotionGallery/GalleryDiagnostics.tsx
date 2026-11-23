"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { frameStats } from "./motionMath";

/** Opt-in local benchmark. No telemetry is transmitted or stored. */
export function GalleryDiagnostics({ sceneRef }: { sceneRef: RefObject<HTMLElement | null> }) {
  const [enabled, setEnabled] = useState(false);
  const [status, setStatus] = useState("Ready to sample");
  const [result, setResult] = useState<(ReturnType<typeof frameStats> & { hz: number }) | null>(null);
  const [running, setRunning] = useState(false);
  const raf = useRef(0);
  useEffect(() => {
    setEnabled(new URLSearchParams(window.location.search).get("galleryPerf") === "1");
    return () => cancelAnimationFrame(raf.current);
  }, []);

  const start = () => {
    const scene = sceneRef.current;
    if (!scene || running) return;
    if (matchMedia("(prefers-reduced-motion: reduce), (max-height: 520px)").matches) {
      setStatus("Motion disabled: benchmark unavailable");
      return;
    }
    setRunning(true);
    setResult(null);
    setStatus("Calibrating refresh interval…");
    const top = scene.getBoundingClientRect().top + window.scrollY;
    const range = Math.max(1, scene.offsetHeight - (scene.firstElementChild?.clientHeight ?? innerHeight));
    window.scrollTo({ top, behavior: "instant" });
    const calibration: number[] = [];
    const intervals: number[] = [];
    let first = 0, previous = 0, runStart = 0, refreshInterval = 0;
    const tick = (now: number) => {
      if (document.hidden) {
        setStatus("Interrupted: keep this tab visible and retry");
        setRunning(false);
        return;
      }
      if (!first) first = now;
      if (!runStart) {
        if (previous) calibration.push(now - previous);
        if (now - first >= 1000 && calibration.length >= 10) {
          const sorted = calibration.sort((a, b) => a - b);
          refreshInterval = sorted[Math.floor(sorted.length * .25)];
          runStart = now;
          setStatus("Sampling forward and reverse scroll (8 s)…");
        }
      } else {
        intervals.push(now - previous);
        const elapsed = now - runStart;
        const progress = elapsed < 4000 ? elapsed / 4000 : Math.max(0, 2 - elapsed / 4000);
        window.scrollTo({ top: top + range * progress, behavior: "instant" });
        if (elapsed >= 8000) {
          setResult({ ...frameStats(intervals, refreshInterval), hz: 1000 / refreshInterval });
          setStatus("Complete — foreground rAF sample");
          setRunning(false);
          return;
        }
      }
      previous = now;
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  };

  if (!enabled) return null;
  return (
    <aside aria-label="Gallery performance diagnostics" className="fixed bottom-3 right-3 z-[100] w-[min(20rem,calc(100vw-1.5rem))] rounded-xl border border-[#5d7aaf] bg-[#10182a] p-3 text-xs text-[#b4d1ff] shadow-xl">
      <div className="flex items-center justify-between gap-2"><strong>Gallery frame benchmark</strong><button className="rounded border px-2 py-1 disabled:opacity-50" disabled={running} onClick={start}>Run 8 s test</button></div>
      <p className="mt-2" role="status">{status}</p>
      {result && <dl className="mt-2 grid grid-cols-2 gap-1" data-testid="gallery-perf-result">
        <dt>Measured rAF FPS</dt><dd>{result.fps.toFixed(1)}</dd>
        <dt>Reference cadence</dt><dd>{result.hz.toFixed(1)} Hz</dd>
        <dt>Estimated missed slots</dt><dd>{result.missed}</dd>
        <dt>95th percentile / max</dt><dd>{result.p95.toFixed(1)} / {result.max.toFixed(1)} ms</dd>
        <dt>Intervals sampled</dt><dd>{result.frames}</dd>
      </dl>}
      <p className="mt-2 text-[10px]">Missed slots estimate main-thread frame gaps, not compositor-confirmed dropped frames.</p>
    </aside>
  );
}
