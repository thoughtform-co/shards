"use client";

import { useEffect, useRef, useState } from "react";

import { headlessShiftSection } from "./content";

/*
 * Headless-shift interstitial.
 *
 * Mirrors the Software-for-few pattern (see `software-for-few.tsx`):
 * a colored-bleed transition slide that rises over a frozen previous
 * section. Here the previous section is `.aiop-cases`; the page-level
 * choreography lives in `.aiop-cases-and-shift` (see `page.tsx`):
 *
 *   - Cases is the previous section. We can't `position: sticky` it
 *     (taller than the viewport, same constraint as Approach) so this
 *     component reads the wrapper's geometry on scroll and applies a
 *     `translateY` to Cases that compensates for scroll exactly during
 *     the slide-over phase, keeping it visually frozen.
 *   - HeadlessShift sits below Cases in normal flow, paints on top
 *     (later DOM sibling), and naturally slides up over the frozen
 *     Cases as the page scrolls.
 *
 * The component also exposes `--aiop-shift-progress` (0..1, the
 * section's transit through the viewport) so the inner atmospheric
 * washes can drift for extra depth on top of the natural scroll-over.
 *
 * Choreography is opt-in: skipped on narrow viewports and under
 * `prefers-reduced-motion: reduce`. JS only adds `is-animated` and
 * writes the variables when the choreography is appropriate; markup
 * and CSS fall back to a static stack otherwise.
 *
 * Modal safety: `OperatorModal` mounts via `createPortal` into
 * `document.body`, so the transform applied here to `.aiop-cases`
 * never clips a case-detail modal opened from inside the row.
 */
export function HeadlessShift() {
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

    const wrapper = node.closest<HTMLElement>(".aiop-cases-and-shift");
    const cases = wrapper?.querySelector<HTMLElement>(".aiop-cases");

    const reset = () => {
      node.style.removeProperty("--aiop-shift-progress");
      if (cases) cases.style.transform = "";
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

        const total = rect.height + vh;
        const traveled = vh - rect.top;
        const p = Math.max(0, Math.min(1, traveled / total));
        node.style.setProperty("--aiop-shift-progress", p.toFixed(4));

        if (!wrapper || !cases) return;

        const wrapperRect = wrapper.getBoundingClientRect();
        const casesBottomInVH = wrapperRect.top + cases.offsetHeight;

        const freezeNeeded = vh - casesBottomInVH;
        const maxFreeze = wrapper.offsetHeight - cases.offsetHeight;
        const freeze = Math.max(0, Math.min(maxFreeze, freezeNeeded));

        cases.style.transform = freeze > 0 ? `translate3d(0, ${freeze}px, 0)` : "";
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

  const preview = headlessShiftSection.preview;

  return (
    <section
      ref={sectionRef}
      className={`aiop-section aiop-shift${animated ? " is-animated" : ""}`}
      id="headless-shift"
      aria-labelledby="aiop-shift-title"
    >
      <div className="aiop-shift__bleed" aria-hidden="true">
        <span className="aiop-shift__wash aiop-shift__wash--a" />
        <span className="aiop-shift__wash aiop-shift__wash--b" />
        <span className="aiop-shift__grid" />
      </div>

      <div className="aiop-wrap aiop-shift__inner">
        <div className="aiop-shift__copy aiop-reveal">
          <h2
            className="aiop-section-title aiop-shift__title"
            id="aiop-shift-title"
          >
            {headlessShiftSection.title}{" "}
            <em className="aiop-shift__title-em">
              {headlessShiftSection.titleEm}
            </em>
          </h2>
          <p className="aiop-shift__body">{headlessShiftSection.body}</p>
          <p className="aiop-shift__body aiop-shift__body--strong">
            {headlessShiftSection.bodyStrong}
          </p>
          <div
            className="aiop-shift__actions"
            aria-label="Headless interstitial links"
          >
            {headlessShiftSection.actions.map((action) => (
              <a key={action.id} className="aiop-shift__link" href={action.href}>
                {action.label}
              </a>
            ))}
          </div>
        </div>

        <aside
          className="aiop-shift__card aiop-reveal"
          aria-label="Headless interface preview"
        >
          <header className="aiop-shift__card-head">
            <span className="aiop-shift__card-eyebrow">
              <span className="aiop-shift__card-dot" aria-hidden="true" />
              {preview.eyebrow}
            </span>
            <span className="aiop-shift__card-badge">{preview.badge}</span>
          </header>

          <div
            className="aiop-shift__tabs"
            role="tablist"
            aria-label="Available headless surfaces"
          >
            {preview.tabs.map((tab) => (
              <span
                key={tab.id}
                className={`aiop-shift__tab${
                  tab.active ? " aiop-shift__tab--active" : ""
                }`}
                role="tab"
                aria-selected={tab.active ? "true" : "false"}
              >
                <span className="aiop-shift__tab-label">{tab.label}</span>
                {tab.note ? (
                  <span className="aiop-shift__tab-note">{tab.note}</span>
                ) : null}
              </span>
            ))}
          </div>

          <div className="aiop-shift__snippet" aria-label={preview.snippetLabel}>
            <span className="aiop-shift__snippet-label">
              {preview.snippetLabel}
            </span>
            <code className="aiop-shift__snippet-code">
              {preview.snippetUrl}
            </code>
          </div>

          <div className="aiop-shift__surfaces-block">
            <span className="aiop-shift__surfaces-label">
              {preview.surfacesLabel}
            </span>
            <ul className="aiop-shift__surfaces" role="list">
              {preview.surfaces.map((surface) => (
                <li key={surface.id} className="aiop-shift__surface">
                  <span
                    className="aiop-shift__surface-icon"
                    aria-hidden="true"
                  >
                    {surface.icon}
                  </span>
                  <span className="aiop-shift__surface-name">
                    {surface.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <p className="aiop-shift__card-foot">{preview.foot}</p>
        </aside>
      </div>
    </section>
  );
}
