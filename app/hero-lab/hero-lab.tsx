"use client";

import { useEffect, useRef, useState } from "react";

import { ApertureOrbit } from "@/components/operator/aperture-orbit";
import { ConstellationOrbit } from "@/components/operator/constellation-orbit";
import { NestedOrbits } from "@/components/operator/nested-orbits";
import { QuatrefoilOrbit } from "@/components/operator/quatrefoil-orbit";

/*
 * /hero-lab — the three candidate hero figures, side by side.
 *
 * A comparison surface, not a page: no header, no nav, no copy column.
 * The three figures run the same 16s cycle from the same data, so the
 * only difference on screen is the argument each one makes about what an
 * intelligence configuration IS.
 *
 * Client because the whole point is the controls. The figures are server
 * components with no hooks or server-only imports, so pulling them into
 * the client bundle here costs nothing and keeps `restart` able to key
 * them directly.
 *
 * THE SCRUBBER is the reason this route exists rather than a handful of
 * screenshots. A 16s morph cannot be judged at full speed, so the slider
 * seeks every animation in the tree to the same point in its timeline.
 *
 * It does that through the Web Animations API — `getAnimations({subtree:
 * true})`, then `pause()` and a direct `currentTime` — and NOT by
 * writing a negative `animation-delay`, which is the obvious CSS-only
 * way to do it and is silently wrong. `animation-delay` positions an
 * animation when it STARTS; changing it on one that is already running
 * does not move it. The delay and the elapsed time simply add, so the
 * frame you get is "however long the page has been open, plus the number
 * on the slider" — every reading off this lab was offset by the age of
 * the tab until this was found. Setting `currentTime` is exact, and it
 * respects the per-facet stagger on the constellation's sweep for free,
 * since a CSS animation's `currentTime` already accounts for its own
 * delay.
 *
 * THE PALETTE TOGGLE swaps `aiop-shell--plopsa` on the root. tf-light
 * has to stay underneath it either way: the Plopsa route stacks its
 * palette ON tf-light rather than replacing it, so this reproduces
 * exactly what a client route does.
 */

type Candidate = {
  key: string;
  letter: string;
  name: string;
  claim: string;
  /* What to look for — the thing that separates this cut from the one
     above it. */
  watch: string;
  render: (loop: boolean) => React.ReactNode;
};

/* The live decision. D is the same claim as C argued differently — four
   depths rather than four attachments — and the two C cuts differ only
   in whether the bodies are named. */
const CUTS: readonly Candidate[] = [
  {
    key: "nested",
    letter: "D",
    name: "Nested orbits",
    claim: "One orbit each, instead of one orbit with four bodies.",
    watch:
      "Inside out: model at the core, skill wrapping it, the data it reaches, and the interface as the only layer a person touches. The labels sit off the cardinals on purpose — on a perfect cross, four concentric rings read as a dial and the symmetry drowns the one thing that matters, which is that each word belongs to a different depth. No fifth ring here: the figure already has four, so the name of what they add up to is a caption under all of them.",
    render: (loop) => <NestedOrbits loop={loop} />,
  },
  {
    key: "named",
    letter: "C1",
    name: "Named",
    claim: "A workflow, its domain experts, and what performs it.",
    watch:
      "Three registers, reading outward. The centre is the work and the people accountable for it. The ring carries the four things that perform it, one word each. The dotted edge names what the whole adds up to — which is where the phrase 'intelligence configuration' belongs, since a configuration is all of it and not the part at the middle. Pulling the constellation in to r=26 is what made room for all three.",
    render: (loop) => <ConstellationOrbit loop={loop} labels="named" />,
  },
  {
    key: "bare",
    letter: "C2",
    name: "Bare",
    claim: "Marks only — the cut you saw first.",
    watch:
      "Kept for the comparison. The bodies still differ in kind, so the figure says 'four different sorts of thing attached to one boundary' — and nothing about which four, and nothing about who owns any of it.",
    render: (loop) => <ConstellationOrbit loop={loop} />,
  },
];

/* Not in the running, kept on the page so the pick can be re-checked
   against what it was picked over. */
const ALTERNATES: readonly Candidate[] = [
  {
    key: "aperture",
    letter: "A",
    name: "Aperture",
    claim: "One boundary, four faces of the same thing.",
    watch:
      "The four arcs share one radius, so the figure never stops being a single circle. The Loop mark is those same four arcs closed into a complete ring.",
    render: (loop) => <ApertureOrbit loop={loop} />,
  },
  {
    key: "quatrefoil",
    letter: "B",
    name: "Quatrefoil",
    claim: "Four circles of concern. The work is the clearing they all cover.",
    watch:
      "The crossings on the diagonals are the argument: four things laid over each other, not four things attached to a hub.",
    render: (loop) => <QuatrefoilOrbit loop={loop} />,
  },
];

/* Must match `--tf-fig-dur` in `hero-figure.css`. The scrubber seeks in
   milliseconds and has no way to read a CSS time. */
const CYCLE_MS = 16000;

/* The beats worth stopping on. The four between 0.09 and 0.31 walk the
   constellation's emergence, which is the fastest thing in the cycle and
   the reason the scrubber has jump targets at all. */
const MARKS = [
  { t: 0.04, label: "mark" },
  { t: 0.11, label: "bud" },
  { t: 0.16, label: "ride" },
  { t: 0.24, label: "slot" },
  { t: 0.45, label: "hold" },
  { t: 0.8, label: "fold" },
];

/* Each figure renders TWICE: once at the size a hero actually gives it,
   once small. Half of what kills a figure like this is that it stops
   resolving below ~260px, and resizing the window to find that out is
   how it gets missed. That matters more now than it did — a mark
   survives being small, a label does not. */
function renderPanel(candidate: Candidate) {
  return (
    <section className="tf-lab__panel" key={candidate.key}>
      <div className="tf-lab__note">
        <p className="tf-lab__eyebrow">
          {candidate.letter} · {candidate.name}
        </p>
        <h2 className="tf-lab__claim">{candidate.claim}</h2>
        <p className="tf-lab__watch">{candidate.watch}</p>
      </div>

      <div className="tf-lab__stages">
        <div className="tf-lab__stage tf-lab__stage--hero">
          {candidate.render(true)}
          <span className="tf-lab__size">420px · hero</span>
        </div>
        <div className="tf-lab__stage tf-lab__stage--small">
          {candidate.render(true)}
          <span className="tf-lab__size">240px · narrow</span>
        </div>
      </div>
    </section>
  );
}

export function HeroLab({ fontClassName }: { fontClassName: string }) {
  const [plopsa, setPlopsa] = useState(false);
  const [paused, setPaused] = useState(false);
  const [t, setT] = useState(0.45);
  const [runKey, setRunKey] = useState(0);
  const stageRef = useRef<HTMLElement>(null);

  /* Depends on runKey as well as the transport, because Restart
     remounts the figures and the animations that were paused a moment
     ago no longer exist. */
  useEffect(() => {
    const root = stageRef.current;
    if (!root) return;

    const animations = root.getAnimations({ subtree: true });
    if (!paused) {
      animations.forEach((animation) => animation.play());
      return;
    }
    animations.forEach((animation) => {
      animation.pause();
      animation.currentTime = t * CYCLE_MS;
    });
  }, [paused, t, runKey]);

  return (
    <div
      className={`${fontClassName} aiop-shell aiop-shell--tf-light${
        plopsa ? " aiop-shell--plopsa" : ""
      } aiop-stage aiop-workshop-v1 tf-lab`}
    >
      <div className="tf-lab__bar">
        <span className="tf-lab__bar-title">
          Hero figure · workflow constellation
        </span>

        <div className="tf-lab__controls">
          <button
            type="button"
            className="tf-lab__button"
            aria-pressed={plopsa}
            onClick={() => setPlopsa((on) => !on)}
          >
            {plopsa ? "Plopsa orange" : "Thoughtform gold"}
          </button>

          <button
            type="button"
            className="tf-lab__button"
            aria-pressed={paused}
            onClick={() => setPaused((on) => !on)}
          >
            {paused ? "Play" : "Pause"}
          </button>

          <button
            type="button"
            className="tf-lab__button"
            onClick={() => {
              setPaused(false);
              setRunKey((n) => n + 1);
            }}
          >
            Restart
          </button>
        </div>

        <div className="tf-lab__scrub">
          <label className="tf-lab__scrub-label" htmlFor="tf-lab-scrub">
            Cycle
            <span className="tf-lab__scrub-value">
              {Math.round(t * 100)}% · {(t * 16).toFixed(1)}s
            </span>
          </label>
          <input
            id="tf-lab-scrub"
            className="tf-lab__range"
            type="range"
            min={0}
            max={1000}
            step={5}
            value={Math.round(t * 1000)}
            onChange={(event) => {
              /* Scrubbing without pausing looks broken — the delay is
                 applied to a still-running animation and the figure
                 jumps. Grab the transport as soon as the slider moves. */
              setPaused(true);
              setT(Number(event.target.value) / 1000);
            }}
          />
          <div className="tf-lab__marks">
            {MARKS.map((mark) => (
              <button
                key={mark.label}
                type="button"
                className="tf-lab__mark"
                onClick={() => {
                  setPaused(true);
                  setT(mark.t);
                }}
              >
                {mark.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* `runKey` remounts every figure at once, which is the only way
          to restart a CSS animation without touching the DOM by hand.
          Remounting the notes alongside them is free. */}
      <main className="tf-lab__main" key={runKey} ref={stageRef}>
        {CUTS.map(renderPanel)}

        <p className="tf-lab__divider">
          Not in the running — kept for the comparison
        </p>

        {ALTERNATES.map(renderPanel)}
      </main>
    </div>
  );
}
