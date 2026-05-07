"use client";

import { useEffect, useRef, useState } from "react";

import { softwareForFewSection } from "./content";

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
 */
export function SoftwareForFew() {
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

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    // Walk up from the section to find the parallax-reveal wrapper
    // and the previous-sibling Approach section it pins for us.
    const wrapper = node.closest<HTMLElement>(".aiop-approach-and-few");
    const approach = wrapper?.querySelector<HTMLElement>(".aiop-approach");

    const reset = () => {
      node.style.removeProperty("--aiop-few-progress");
      if (approach) approach.style.transform = "";
    };

    if (!animated) {
      reset();
      return;
    }

    let raf = 0;

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = node.getBoundingClientRect();
        const vh = window.innerHeight;

        // Inner-progress: section's transit through the viewport.
        // 0 = top of section at viewport bottom (just entering).
        // 1 = bottom of section at viewport top (just exited).
        const total = rect.height + vh;
        const traveled = vh - rect.top;
        const p = Math.max(0, Math.min(1, traveled / total));
        node.style.setProperty("--aiop-few-progress", p.toFixed(4));

        // Page-level slide-over: keep Approach visually frozen during
        // the phase where its last viewport would scroll past, until
        // SoftwareForFew has covered the viewport. We do this with a
        // translateY that compensates for scroll in that phase.
        if (!wrapper || !approach) return;

        const wrapperRect = wrapper.getBoundingClientRect();
        // Approach is the first child of the wrapper (no margin).
        const apBottomInVH = wrapperRect.top + approach.offsetHeight;

        // Freeze starts when approach's bottom would scroll above
        // viewport bottom (its last viewport now fills the screen)
        // and ends when the wrapper's bottom reaches viewport bottom
        // (SoftwareForFew has fully taken over). The maximum needed
        // freeze is exactly the section's own height.
        const freezeNeeded = vh - apBottomInVH;
        const maxFreeze = wrapper.offsetHeight - approach.offsetHeight;
        const freeze = Math.max(0, Math.min(maxFreeze, freezeNeeded));

        approach.style.transform = freeze > 0 ? `translate3d(0, ${freeze}px, 0)` : "";
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
      reset();
    };
  }, [animated]);

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
          <h2
            className="aiop-section-title aiop-few__title"
            id="aiop-few-title"
          >
            <em className="aiop-few__title-em">
              {softwareForFewSection.title}
            </em>{" "}
            {softwareForFewSection.titleEm}
          </h2>
          <p className="aiop-few__body">{softwareForFewSection.body}</p>
        </div>

        <div className="aiop-few__card aiop-reveal" role="presentation">
          <ul className="aiop-few__rows" role="list">
            {softwareForFewSection.rows.map((row) => (
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
    </section>
  );
}
