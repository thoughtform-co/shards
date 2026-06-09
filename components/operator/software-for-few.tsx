"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { softwareForFewSection } from "@/content/operator";
import { useScrollFrame, type ScrollFrame } from "./use-scroll-frame";

/*
 * Software-for-few interstitial.
 *
 * The slide-over choreography happens at the page level in
 * `.aiop-approach-and-few` (see `page.tsx`):
 *
 *   - Approach is the previous section. We can't `position: sticky`
 *     it because it's taller than the viewport (sticky requires the
 *     element to be shorter than its scroll range).
 *   - Instead, this component reads the wrapper's geometry on scroll
 *     and applies a `translateY` to Approach that compensates for
 *     scroll exactly during the slide-over phase, so Approach reads
 *     as visually frozen (its last viewport stays put on screen).
 *   - SoftwareForFew sits below Approach in normal flow, paints on
 *     top (later DOM sibling), and so naturally slides up over the
 *     frozen Approach as the page scrolls.
 *
 * In addition we expose `--aiop-few-progress` (0..1, the section's
 * transit through the viewport) so the inner atmospheric washes can
 * drift for extra depth on top of the natural scroll-over.
 *
 * Choreography is opt-in: skipped on narrow viewports and under
 * `prefers-reduced-motion: reduce`. JS only adds `is-animated` and
 * writes the variables when the choreography is appropriate; markup
 * and CSS fall back to a static stack otherwise.
 *
 * `section` prop lets route variants override the copy.
 */
export function SoftwareForFew({
  section = softwareForFewSection,
}: {
  section?: {
    title: string;
    titleEm: string;
    body: string;
    actions: readonly { id: string; label: string; href: string }[];
    rows: readonly {
      id: string;
      label: string;
      detail: string;
      tag: string;
      highlight?: boolean;
    }[];
    feynman: { quote: string; attribution: string };
  };
} = {}) {
  const sectionRef = useRef<HTMLElement>(null);
  const [animated, setAnimated] = useState(false);

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

  /* Reset helper held in a ref so the cleanup path can also call it.
     The shared scroll subscription below drives writes; this just
     lets the component clean up cleanly when `animated` flips off
     or the component unmounts. */
  const resetRef = useRef<(() => void) | null>(null);

  /*
   * Two wrapper shapes are supported (mirrors `encoding-interstitial.tsx`):
   *
   *   - `.aiop-approach-and-few` (canonical homepage `/`): the freeze
   *     target is the `.aiop-approach` sibling so the flywheel deep
   *     dive freezes while this interstitial slides up over it.
   *
   *   - `.aiop-few-pair` (e.g. `/creative-ai-workshop`): the freeze
   *     target is the first element child of the wrapper that isn't
   *     this section. Lets a route that has its own chapter above
   *     SoftwareForFew (the Claude getting-started zone on the
   *     workshop fork) freeze that chapter as a single block during
   *     the slide-over.
   *
   * If neither wrapper or freeze target is present the section still
   * self-progresses its `--aiop-few-progress` from its own scroll. */
  const findPair = useCallback(() => {
    const node = sectionRef.current;
    if (!node) {
      return { wrapper: null as HTMLElement | null, target: null as HTMLElement | null };
    }

    const wrapper =
      node.closest<HTMLElement>(".aiop-approach-and-few") ??
      node.closest<HTMLElement>(".aiop-few-pair");

    if (!wrapper) return { wrapper: null, target: null };

    const approachTarget = wrapper.querySelector<HTMLElement>(".aiop-approach");
    if (approachTarget) return { wrapper, target: approachTarget };

    const siblingTarget = (Array.from(wrapper.children) as HTMLElement[]).find(
      (child) => child !== node,
    );
    return { wrapper, target: siblingTarget ?? null };
  }, []);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const { target } = findPair();

    resetRef.current = () => {
      node.style.removeProperty("--aiop-few-progress");
      node.style.transform = "";
      if (target) target.style.transform = "";
    };

    if (!animated) {
      resetRef.current();
    }

    return () => {
      resetRef.current?.();
      resetRef.current = null;
    };
  }, [animated, findPair]);

  const measure = useCallback(
    (frame: ScrollFrame) => {
      if (!animated) return;
      const node = sectionRef.current;
      if (!node) return;

      const { wrapper, target: approach } = findPair();

      if (!wrapper || !approach) {
        // Defensive fallback: without the wrapper structure we
        // can't drive the parallax pair, so just expose the
        // inner-progress so atmospheric drift still works.
        const rect = node.getBoundingClientRect();
        const total = rect.height + frame.vh;
        const traveled = frame.vh - rect.top;
        const p = Math.max(0, Math.min(1, traveled / total));
        node.style.setProperty("--aiop-few-progress", p.toFixed(4));
        return;
      }

      const wrapperRect = wrapper.getBoundingClientRect();
      // Approach is the first child of the wrapper (no margin), so
      // its bottom in viewport coords doubles as the natural
      // (transform-free) top of this section.
      const apBottomInVH = wrapperRect.top + approach.offsetHeight;

      // Inner-progress derived from the natural layout coords so
      // the entry-buffer hold applied below doesn't distort the
      // atmospheric drift inside the slide.
      const total = node.offsetHeight + frame.vh;
      const traveled = frame.vh - apBottomInVH;
      const p = Math.max(0, Math.min(1, traveled / total));
      node.style.setProperty("--aiop-few-progress", p.toFixed(4));

      // Page-level slide-over: keep Approach visually frozen during
      // the phase where its last viewport would scroll past, until
      // SoftwareForFew has covered the viewport. We do this with a
      // translateY that compensates for scroll in that phase.
      const freezeNeeded = frame.vh - apBottomInVH;
      const maxFreeze = wrapper.offsetHeight - approach.offsetHeight;
      const freeze = Math.max(0, Math.min(maxFreeze, freezeNeeded));

      approach.style.transform =
        freeze > 0 ? `translate3d(0, ${freeze}px, 0)` : "";

      // Entry buffer: hold this interstitial in place for the
      // first ~140px of freeze (roughly one-to-two scroll-wheel
      // movements) so Approach's closing Outcome card stays
      // readable before the slide-up begins. Otherwise the next
      // section starts to rise on the very next scroll pixel and
      // the visitor never gets a chance to land on the previous
      // section's last beat. After the buffer, the hold releases
      // linearly back to 0 so the section lands at its natural
      // document position by the time the freeze caps; without
      // the release this section would sit translated past its
      // natural bottom and the next chapter would overlap.
      const entryBuffer = Math.min(140, frame.vh * 0.13);
      // Cap at 60% of maxFreeze to guarantee there is always at
      // least some Phase 2 release distance even on small wrappers.
      const cap = Math.min(entryBuffer, maxFreeze * 0.6);
      let hold = 0;
      if (freeze > 0 && cap > 0) {
        if (freeze <= cap) {
          hold = freeze;
        } else if (maxFreeze > cap) {
          const phase2Span = maxFreeze - cap;
          const phase2Progress = (freeze - cap) / phase2Span;
          hold = cap * (1 - phase2Progress);
        }
      }
      node.style.transform = hold > 0 ? `translate3d(0, ${hold}px, 0)` : "";
    },
    [animated, findPair],
  );

  useScrollFrame(measure);

  return (
    <section
      ref={sectionRef}
      className={`aiop-section aiop-few${animated ? " is-animated" : ""}`}
      id="software-for-few"
      aria-labelledby="aiop-few-title"
    >
      <div className="aiop-few__bleed" aria-hidden="true">
        <span className="aiop-few__wash aiop-few__wash--a" />
        <span className="aiop-few__wash aiop-few__wash--b" />
        <span className="aiop-few__grid" />
      </div>

      <div className="aiop-wrap aiop-few__inner">
        <div className="aiop-few__copy aiop-reveal">
          {/* Phase pill — names the flywheel phase this section belongs
              to. Software-for-few is what Build looks like in practice
              once the substrate is in place, so the pill establishes
              the connection back to the Approach flywheel without
              repeating its language. Sage matches the Build lane. */}
          <span className="aiop-few__phase" aria-label="Flywheel phase">
            <span className="aiop-term-pill aiop-term-pill--build">
              <span className="aiop-term-pill__dot" aria-hidden="true" />
              Build
            </span>
          </span>
          <h2
            className="aiop-section-title aiop-few__title"
            id="aiop-few-title"
          >
            <em className="aiop-few__title-em">
              {section.title}
            </em>{" "}
            {section.titleEm}
          </h2>
          <p className="aiop-few__body">{section.body}</p>
          <div className="aiop-few__actions" aria-label="Software for few links">
            {section.actions.map((action) => (
              <a key={action.id} className="aiop-few__link" href={action.href}>
                {action.label}
              </a>
            ))}
          </div>
        </div>

        <div className="aiop-few__card aiop-reveal" role="presentation">
          <ul className="aiop-few__rows" role="list">
            {section.rows.map((row) => (
              <li
                key={row.id}
                className={`aiop-few__row${
                  row.highlight ? " aiop-few__row--highlight" : ""
                }`}
              >
                <span className="aiop-few__row-label">{row.label}</span>
                <span className="aiop-few__row-detail">{row.detail}</span>
                <span className="aiop-few__row-tag">{row.tag}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Feynman sign-off · standalone full-width tile at the bottom
          of the section. Sits below the two-column layout so it reads
          as a quiet outside-voice closer on the "build to understand"
          argument the title and body make above. The hairline above
          and the small sage tick separator keep it editorially
          subordinate; the page's section title still leads. */}
      <aside
        className="aiop-wrap aiop-few__feynman"
        aria-label="Richard Feynman quote"
      >
        <span className="aiop-few__feynman-mark" aria-hidden="true" />
        <blockquote className="aiop-few__feynman-quote">
          {section.feynman.quote}
        </blockquote>
        <cite className="aiop-few__feynman-cite">
          {section.feynman.attribution}
        </cite>
      </aside>
    </section>
  );
}
