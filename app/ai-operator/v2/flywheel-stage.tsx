"use client";

import { useEffect, useRef, useState } from "react";

import { v2Hero, v2Loop, v2Method } from "./content";

/*
 * Flywheel stage — the single sticky scroll surface that anchors the
 * V2 page. Three "frames" (hero, loop, method) live on top of each
 * other inside one sticky viewport. As the visitor scrolls through the
 * track, the active frame swaps and the centered Navigate / Encode /
 * Build orbit reshapes itself: pinned at the centre during the first
 * two frames, then decomposing so each pill flies to its own row in
 * the third.
 *
 * The choreography is opt-in. On narrow viewports, or whenever the
 * user prefers reduced motion, the same DOM falls back to a plain
 * top-to-bottom stack via CSS. JS only adds the `is-animated` flag
 * when the choreography is appropriate; it never rewrites the markup.
 */

const FRAMES = ["hero", "loop", "method"] as const;
type Frame = (typeof FRAMES)[number];

export function FlywheelStage() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeFrame, setActiveFrame] = useState<Frame>("hero");
  const [animated, setAnimated] = useState(false);

  /* Decide whether to enable the choreography. Reduced motion or
   * narrow viewports drop back to the static stack. The check re-runs
   * on resize / preference change so a window resize mid-session
   * picks up the right mode. */
  useEffect(() => {
    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const widthMq = window.matchMedia("(min-width: 960px)");

    const update = () => {
      setAnimated(!motionMq.matches && widthMq.matches);
    };

    update();

    motionMq.addEventListener("change", update);
    widthMq.addEventListener("change", update);
    return () => {
      motionMq.removeEventListener("change", update);
      widthMq.removeEventListener("change", update);
    };
  }, []);

  /* Track scroll position once the choreography is on. We map the
   * visible track range (track top → track bottom minus viewport
   * height) to a 0..1 progress, then snap to the closest of N frames
   * for the discrete `data-frame` attribute and write the smooth
   * frame position to `--aiop-v2-frame-pos` so CSS can drive
   * Legend-style scroll-coupled parallax (hero text + particle band
   * translate upward while the orbit stays anchored).
   * Reading happens inside requestAnimationFrame so we never thrash
   * the scroll thread. */
  useEffect(() => {
    if (!animated) {
      // No scroll listener in static mode. We deliberately don't
      // reset activeFrame here — the rendered `data-frame` is
      // derived below, so the leftover state has no visual effect.
      const track = trackRef.current;
      if (track) {
        track.style.removeProperty("--aiop-v2-frame-pos");
        track.style.removeProperty("--aiop-v2-hero-progress");
      }
      return;
    }

    let raf = 0;

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const track = trackRef.current;
        if (!track) return;
        const rect = track.getBoundingClientRect();
        const viewHeight = window.innerHeight;
        const total = track.offsetHeight - viewHeight;
        if (total <= 0) {
          track.style.setProperty("--aiop-v2-frame-pos", "0");
          track.style.setProperty("--aiop-v2-hero-progress", "0");
          setActiveFrame("hero");
          return;
        }
        const scrolled = -rect.top;
        const p = Math.max(0, Math.min(1, scrolled / total));
        const framePos = p * (FRAMES.length - 1);
        const heroProgress = Math.max(0, Math.min(1, framePos));
        track.style.setProperty(
          "--aiop-v2-frame-pos",
          framePos.toFixed(4),
        );
        track.style.setProperty(
          "--aiop-v2-hero-progress",
          heroProgress.toFixed(4),
        );
        const idx = Math.max(
          0,
          Math.min(FRAMES.length - 1, Math.round(framePos)),
        );
        const next = FRAMES[idx];
        setActiveFrame((prev) => (prev === next ? prev : next));
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [animated]);

  // The visible frame is derived: in static mode it's always "hero"
  // (the data-frame attribute is purely cosmetic when all frames are
  // displayed simultaneously), in animated mode it follows scroll.
  const dataFrame: Frame = animated ? activeFrame : "hero";

  return (
    <div
      ref={trackRef}
      className={`aiop-v2-track${animated ? " is-animated" : ""}`}
      data-frame={dataFrame}
    >
      <div className="aiop-v2-stage">
        <div className="aiop-v2-particle-band" aria-hidden="true" />

        {/* Centred content container: gives every frame and the orbit
         * the same max-width and side gutters so the layout never
         * runs edge-to-edge on wide viewports. The animated mode
         * uses this wrapper as the absolute-positioning context for
         * the orbit and frames. */}
        <div className="aiop-v2-stage__content">
          <Orbit />
          <FrameHero active={!animated || dataFrame === "hero"} />
          <FrameLoop active={!animated || dataFrame === "loop"} />
          <FrameMethod active={!animated || dataFrame === "method"} />
        </div>
      </div>
    </div>
  );
}

/* ─── Orbit ────────────────────────────────────────────────────────
 *
 * The flywheel itself: two concentric rings, a central substrate
 * core, and three coloured pills. Rendered once per page. The CSS
 * positions the rings/core in the centre during the first two
 * frames, then fades them out and flies the pills to row anchors
 * once the method frame becomes active.
 * ──────────────────────────────────────────────────────────────── */

function Orbit() {
  return (
    <div className="aiop-v2-orbit" aria-hidden="true">
      <span className="aiop-v2-orbit__ring aiop-v2-orbit__ring--outer" />
      <span className="aiop-v2-orbit__ring aiop-v2-orbit__ring--inner" />

      <div className="aiop-v2-orbit__core">
        <strong>Substrate</strong>
      </div>

      <span className="aiop-v2-orbit__pill aiop-v2-orbit__pill--navigate">
        <span className="aiop-v2-orbit__dot" />
        <span>Navigate</span>
      </span>
      <span className="aiop-v2-orbit__pill aiop-v2-orbit__pill--encode">
        <span className="aiop-v2-orbit__dot" />
        <span>Encode</span>
      </span>
      <span className="aiop-v2-orbit__pill aiop-v2-orbit__pill--build">
        <span className="aiop-v2-orbit__dot" />
        <span>Build</span>
      </span>
    </div>
  );
}

/* ─── Frame 01 · Hero ─────────────────────────────────────────────── */

function FrameHero({ active }: { active: boolean }) {
  return (
    <section
      className={`aiop-v2-frame aiop-v2-frame--hero${active ? " is-active" : ""}`}
      aria-labelledby="aiop-v2-hero-title"
    >
      <header className="aiop-v2-frame__head">
        <p className="aiop-v2-mono">
          <span>{v2Hero.index}</span>
          <span className="aiop-v2-mono__sep" aria-hidden="true">·</span>
          <span>{v2Hero.chapter}</span>
        </p>
        <h1 className="aiop-v2-display" id="aiop-v2-hero-title">
          <span className="aiop-v2-display__line">{v2Hero.title}</span>
          <span className="aiop-v2-display__line">
            <em>{v2Hero.titleEm}</em>
          </span>
        </h1>
      </header>

      <div className="aiop-v2-frame__body aiop-v2-frame__body--triptych">
        <aside className="aiop-v2-side aiop-v2-side--left">
          <p className="aiop-v2-mono aiop-v2-mono--ink">
            <span className="aiop-v2-mono__bullet" aria-hidden="true" />
            {v2Hero.vision.label}
          </p>
          {v2Hero.vision.paragraphs.map((paragraph) => (
            <p key={paragraph} className="aiop-v2-side__body">
              {paragraph}
            </p>
          ))}
          <a className="aiop-v2-button" href={v2Hero.vision.cta.href}>
            {v2Hero.vision.cta.label}
            <span className="aiop-v2-button__arrow" aria-hidden="true">
              →
            </span>
          </a>
        </aside>

        <div className="aiop-v2-flywheel-slot" aria-hidden="true" />

        <aside className="aiop-v2-side aiop-v2-side--right">
          <p className="aiop-v2-mono aiop-v2-mono--ink">
            <span className="aiop-v2-mono__bullet" aria-hidden="true" />
            {v2Hero.bio.label}
          </p>
          <p className="aiop-v2-side__name">{v2Hero.bio.name}</p>
          {v2Hero.bio.paragraphs.map((paragraph) => (
            <p key={paragraph} className="aiop-v2-side__body">
              {paragraph}
            </p>
          ))}
          <a className="aiop-v2-button" href={v2Hero.bio.cta.href}>
            {v2Hero.bio.cta.label}
            <span className="aiop-v2-button__arrow" aria-hidden="true">
              →
            </span>
          </a>
        </aside>
      </div>
    </section>
  );
}

/* ─── Frame 02 · Loop ─────────────────────────────────────────────── */

function FrameLoop({ active }: { active: boolean }) {
  return (
    <section
      className={`aiop-v2-frame aiop-v2-frame--loop${active ? " is-active" : ""}`}
      aria-labelledby="aiop-v2-loop-title"
    >
      <header className="aiop-v2-frame__head">
        <p className="aiop-v2-mono">
          <span>{v2Loop.index}</span>
          <span className="aiop-v2-mono__sep" aria-hidden="true">·</span>
          <span>{v2Loop.chapter}</span>
        </p>
      </header>

      <div className="aiop-v2-frame__body aiop-v2-frame__body--triptych">
        <aside className="aiop-v2-side aiop-v2-side--left">
          <p className="aiop-v2-mono aiop-v2-mono--ink">
            <span className="aiop-v2-mono__bullet" aria-hidden="true" />
            {v2Loop.vision.label}
          </p>
          <h2 className="aiop-v2-display aiop-v2-display--md" id="aiop-v2-loop-title">
            {v2Loop.vision.title} <em>{v2Loop.vision.titleEm}</em>
          </h2>
          <p className="aiop-v2-side__body">{v2Loop.vision.body}</p>
          <a className="aiop-v2-button" href={v2Loop.vision.cta.href}>
            {v2Loop.vision.cta.label}
            <span className="aiop-v2-button__arrow" aria-hidden="true">→</span>
          </a>
        </aside>

        <div className="aiop-v2-flywheel-slot" aria-hidden="true" />

        <aside className="aiop-v2-side aiop-v2-side--right">
          <p className="aiop-v2-mono aiop-v2-mono--ink">
            <span className="aiop-v2-mono__bullet" aria-hidden="true" />
            {v2Loop.proof.label}
          </p>
          <h3 className="aiop-v2-side__title">{v2Loop.proof.title}</h3>
          {v2Loop.proof.paragraphs.map((paragraph) => (
            <p key={paragraph} className="aiop-v2-side__body">
              {paragraph}
            </p>
          ))}
          <dl className="aiop-v2-side__metrics">
            {v2Loop.proof.metrics.map((m) => (
              <div key={m.k} className="aiop-v2-side__metric">
                <dt>{m.k}</dt>
                <dd>{m.v}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
    </section>
  );
}

/* ─── Frame 03 · Method ───────────────────────────────────────────── */

function FrameMethod({ active }: { active: boolean }) {
  return (
    <section
      className={`aiop-v2-frame aiop-v2-frame--method${active ? " is-active" : ""}`}
      aria-labelledby="aiop-v2-method-title"
    >
      <header className="aiop-v2-frame__head">
        <p className="aiop-v2-mono">
          <span>{v2Method.index}</span>
          <span className="aiop-v2-mono__sep" aria-hidden="true">·</span>
          <span>{v2Method.chapter}</span>
        </p>
        <h2 className="aiop-v2-display aiop-v2-display--md" id="aiop-v2-method-title">
          {v2Method.title} <em>{v2Method.titleEm}</em>
        </h2>
      </header>

      <ol className="aiop-v2-method__rows" role="list">
        {v2Method.steps.map((step) => (
          <li
            key={step.id}
            className={`aiop-v2-method__row aiop-v2-method__row--${step.id}`}
          >
            <div
              className="aiop-v2-method__pill-anchor"
              aria-hidden="true"
            />
            <div className="aiop-v2-method__copy">
              <h3 className="aiop-v2-method__headline">{step.headline}</h3>
              <p className="aiop-v2-method__body">{step.body}</p>
              <dl className="aiop-v2-method__signal">
                <dt>{step.signal.k}</dt>
                <dd>{step.signal.v}</dd>
              </dl>
            </div>
            <ul className="aiop-v2-method__visual" role="list">
              {step.visual.map((cell) => (
                <li key={cell.k} className="aiop-v2-method__visual-cell">
                  <span className="aiop-v2-method__visual-v">{cell.v}</span>
                  <span className="aiop-v2-method__visual-k">{cell.k}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </section>
  );
}
