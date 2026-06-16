"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";

import { useScrollFrame, type ScrollFrame } from "@/components/loam/use-scroll-frame";

/*
 * Cross-section — the pinned substrate centerpiece.
 *
 * The Weave hero ran a horizontal node graph: inputs (brief, voice) on
 * the left, loam in the middle, surfaces on the right. Here the same
 * idea descends into the ground. Topsoil sits on top, the loam band
 * glows underneath, surfaces emerge from it. The hero's living-network
 * photograph drifts behind, faded into the soil.
 *
 * Interaction:
 *
 *   The outer <section> is intentionally tall (~240vh via CSS) so the
 *   sticky inner can pin for ~140vh of scroll. As the section passes
 *   through the viewport, we compute a 0..1 progress value and pick an
 *   active band (0, 1, 2). The active band gets the `.is-active` class
 *   and its border / background brighten, while the others fade back.
 *
 *   The progress comes from the project-local useScrollFrame (single
 *   rAF, no deps). No GSAP, no IntersectionObserver thresholds.
 *
 * Reduced motion: the CSS already collapses the band transitions, and
 * with no JS the bands render in their inactive state, which is still
 * legible — none of the meaning depends on the active band swap.
 */

export type CrossSectionBand = {
  id: string;
  n: string;
  kicker: string;
  title: string;
  body: string;
  chips?: readonly string[];
  variant: "topsoil" | "loam" | "surface";
};

export function CrossSection({
  headline,
  sub,
  caption,
  bands,
  bgSrc,
  closing,
}: {
  headline: { lead: string; em: string };
  sub: string;
  caption: string;
  bands: readonly CrossSectionBand[];
  bgSrc: string;
  closing: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  const onFrame = useCallback((frame: ScrollFrame) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const total = rect.height - frame.vh;
    if (total <= 0) {
      /* Section is shorter than the viewport, e.g. on mobile after
         the sticky collapses. Use a neutral middle state. */
      setActive(1);
      return;
    }
    const scrolled = -rect.top;
    const p = Math.max(0, Math.min(1, scrolled / total));
    /* Three equal stops; the loam band gets a slight bias so it stays
       lit through the most-visible middle window. */
    const idx = p < 0.32 ? 0 : p < 0.7 ? 1 : 2;
    setActive(idx);
  }, []);

  useScrollFrame(onFrame);

  return (
    <section
      ref={ref}
      className="subs-section subs-section--soil subs-xs"
      id="substrate"
      aria-label="The living layer"
    >
      <div className="subs-xs__bg" aria-hidden="true">
        <Image src={bgSrc} alt="" fill priority={false} sizes="100vw" />
      </div>
      <div className="subs-section__inner subs-xs__inner">
        {/* Dedicated pin zone: gives the sticky child its scroll
            runway. The close paragraph lives outside this zone so it
            cannot scroll up over the pinned moment. */}
        <div className="subs-xs__pin">
          <div className="subs-xs__sticky">
            <div className="subs-xs__head">
              <h2>
                {headline.lead} <em>{headline.em}</em>
              </h2>
              <p>{sub}</p>
              <div className="subs-xs__caption">{caption}</div>
            </div>

            <div className="subs-xs__cols">
              {bands.map((b, i) => (
                <article
                  key={b.id}
                  className={`subs-xs__band subs-xs__band--${b.variant} ${
                    i === active ? "is-active" : ""
                  }`}
                  aria-current={i === active ? "true" : undefined}
                >
                  <span className="subs-xs__bandn">{b.n}</span>
                  <div>
                    <span className="subs-xs__bandkicker">{b.kicker}</span>
                    <h3 className="subs-xs__bandtitle">{b.title}</h3>
                    <p className="subs-xs__bandbody">{b.body}</p>
                    {b.chips && b.chips.length > 0 ? (
                      <div className="subs-xs__bandchips">
                        {b.chips.map((c) => (
                          <span key={c} className="subs-xs__bandchip">
                            {c}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>

        <p className="subs-xs__close">{closing}</p>
      </div>
    </section>
  );
}
