"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useScrollFrame, type ScrollFrame } from "@/components/loam/use-scroll-frame";

/*
 * Substrate network — the signature scroll-driven layer behind the
 * hero of /loam/substrate.
 *
 * A blueprint-meets-mycelium drawing in pure SVG. Hyphal strands
 * branch from the left margin and the top/bottom, converge through a
 * central junction (the "loam" hub), and spread out toward the right
 * (where the surfaces live). Each path uses an explicit pathLength of
 * 100 so the CSS can normalize the draw-on transition regardless of
 * the actual cubic-bézier arc length.
 *
 * Two motion contracts:
 *
 *   1. Initial reveal. On mount we add `.is-drawn` on the next frame.
 *      Each path transitions its stroke-dashoffset from 100 to 0 with
 *      a staggered delay (set per-path via --d), so the network grows
 *      from the source ports outward.
 *
 *   2. Scroll progress. We map the hero element's pass through the
 *      viewport to a 0..1 progress value, driven by the project-local
 *      `useScrollFrame` (single rAF, no deps). Each junction has a
 *      threshold; once progress exceeds it, the junction lights amber
 *      (or chartreuse for the central hub).
 *
 * SSR-safe: server renders the full SVG with hidden paths; the client
 * adds `.is-drawn` after hydration. Junction `progress` defaults to 0
 * on the server, so the dots render in their muted base state.
 *
 * prefers-reduced-motion: the CSS for `.subs-net__path` collapses the
 * transition so the final state paints immediately. Junctions still
 * light at their thresholds (no transition needed — they're driven by
 * a class swap, not animation).
 */

const W = 1400;
const H = 800;

type StrandSpec = {
  id: string;
  d: string;
  delay: number;
  width?: number;
  opacity?: number;
};

/* Main hyphal strands. The geometry is hand-tuned: three inputs
   converge at the central hub (700, 400) and three outputs spread to
   the right. */
const strands: readonly StrandSpec[] = [
  {
    id: "main-1",
    d: "M -40 120 C 220 100, 380 220, 580 320 C 660 360, 700 400, 700 400 C 740 408, 820 432, 980 480 C 1140 528, 1280 540, 1460 540",
    delay: 0,
  },
  {
    id: "main-2",
    d: "M -40 400 C 180 380, 360 400, 520 400 C 620 400, 680 400, 700 400 C 760 400, 900 380, 1080 340 C 1240 300, 1320 280, 1460 240",
    delay: 120,
  },
  {
    id: "main-3",
    d: "M -40 680 C 220 700, 380 600, 540 500 C 640 440, 700 408, 700 400 C 760 392, 880 408, 1040 480 C 1240 580, 1340 700, 1460 740",
    delay: 240,
  },
  {
    id: "vert-a",
    d: "M 320 -40 C 360 160, 540 320, 700 400 C 800 460, 880 580, 940 840",
    delay: 320,
    opacity: 0.8,
  },
  {
    id: "vert-b",
    d: "M 1060 -40 C 980 200, 820 320, 700 400 C 580 480, 480 600, 420 840",
    delay: 400,
    opacity: 0.8,
  },
  /* Finer secondary strands branching off the main ones. */
  {
    id: "fine-1",
    d: "M 120 60 C 260 200, 420 280, 580 320",
    delay: 480,
    width: 1,
    opacity: 0.5,
  },
  {
    id: "fine-2",
    d: "M 120 760 C 240 660, 420 540, 600 460",
    delay: 540,
    width: 1,
    opacity: 0.5,
  },
  {
    id: "fine-3",
    d: "M 900 200 C 980 280, 1080 360, 1240 380",
    delay: 600,
    width: 1,
    opacity: 0.5,
  },
  {
    id: "fine-4",
    d: "M 880 600 C 960 540, 1080 480, 1240 440",
    delay: 660,
    width: 1,
    opacity: 0.5,
  },
];

type JunctionSpec = {
  id: string;
  cx: number;
  cy: number;
  r: number;
  threshold: number; // 0..1 hero scroll progress at which this lights
  variant?: "hub" | "edge" | "mid";
};

const junctions: readonly JunctionSpec[] = [
  { id: "hub", cx: 700, cy: 400, r: 8, threshold: 0.05, variant: "hub" },
  { id: "j2", cx: 580, cy: 320, r: 3, threshold: 0.15, variant: "mid" },
  { id: "j3", cx: 540, cy: 500, r: 3, threshold: 0.22, variant: "mid" },
  { id: "j4", cx: 880, cy: 432, r: 3.4, threshold: 0.28, variant: "mid" },
  { id: "j5", cx: 980, cy: 480, r: 3, threshold: 0.34, variant: "mid" },
  { id: "j6", cx: 1080, cy: 340, r: 3, threshold: 0.4, variant: "mid" },
  { id: "j7", cx: 320, cy: 240, r: 2.6, threshold: 0.5, variant: "edge" },
  { id: "j8", cx: 240, cy: 580, r: 2.6, threshold: 0.55, variant: "edge" },
  { id: "j9", cx: 1240, cy: 380, r: 2.6, threshold: 0.6, variant: "edge" },
  { id: "j10", cx: 1180, cy: 600, r: 2.6, threshold: 0.65, variant: "edge" },
  { id: "j11", cx: 460, cy: 80, r: 2.2, threshold: 0.72, variant: "edge" },
  { id: "j12", cx: 460, cy: 720, r: 2.2, threshold: 0.78, variant: "edge" },
];

/* Source / sink ports — the points where strands enter and leave the
   viewBox. Rendered as small open circles for the blueprint look. */
type Port = { cx: number; cy: number };
const ports: readonly Port[] = [
  { cx: 0, cy: 120 },
  { cx: 0, cy: 400 },
  { cx: 0, cy: 680 },
  { cx: 1400, cy: 540 },
  { cx: 1400, cy: 240 },
  { cx: 1400, cy: 740 },
];

export function SubstrateNetwork() {
  const ref = useRef<HTMLDivElement>(null);
  const [drawn, setDrawn] = useState(false);
  const [progress, setProgress] = useState(0);

  /* Trigger the initial draw-on the frame after mount, so the CSS
     transition from stroke-dashoffset 100 -> 0 actually fires (no
     immediate paint of the final state). */
  useEffect(() => {
    const id = requestAnimationFrame(() => setDrawn(true));
    return () => cancelAnimationFrame(id);
  }, []);

  /* Map this element's pass through the viewport to a 0..1 progress
     value. Stable callback identity for the rAF subscription. */
  const onFrame = useCallback((frame: ScrollFrame) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const range = rect.height + frame.vh;
    if (range <= 0) return;
    const passed = frame.vh - rect.top;
    const p = Math.max(0, Math.min(1, passed / range));
    setProgress(p);
  }, []);

  useScrollFrame(onFrame);

  return (
    <div
      ref={ref}
      className={`subs-net ${drawn ? "is-drawn" : ""}`}
      aria-hidden="true"
    >
      <svg
        className="subs-net__svg"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Source / sink ports — visible at the edges of the viewBox. */}
        {ports.map((p, i) => (
          <circle
            key={`port-${i}`}
            cx={p.cx}
            cy={p.cy}
            r={5}
            className="subs-net__port"
          />
        ))}

        {/* Hyphal strands. */}
        {strands.map((s) => (
          <path
            key={s.id}
            d={s.d}
            pathLength={100}
            className="subs-net__path"
            style={
              {
                "--d": `${s.delay}ms`,
                "--sw": s.width ?? 1.5,
                "--op": s.opacity ?? 1,
              } as React.CSSProperties
            }
          />
        ))}

        {/* Junctions — the dots that light as the visitor scrolls. */}
        {junctions.map((j) => {
          const lit = progress >= j.threshold;
          return (
            <circle
              key={j.id}
              cx={j.cx}
              cy={j.cy}
              r={j.r}
              className={`subs-net__junction subs-net__junction--${
                j.variant ?? "mid"
              } ${lit ? "is-lit" : ""}`}
            />
          );
        })}
      </svg>
    </div>
  );
}
