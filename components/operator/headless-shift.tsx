"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  headlessShiftSection,
  type HeadlessShiftLayer,
  type HeadlessShiftSurface,
  type HeadlessShiftTab,
} from "@/content/operator";
import { useScrollFrame, type ScrollFrame } from "./use-scroll-frame";

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
 *
 * `section` prop lets route variants override the copy.
 */
export function HeadlessShift({
  section = headlessShiftSection,
}: {
  section?: {
    title: string;
    titleEm: string;
    body: string;
    bodyStrong: string;
    bodyStripe: string;
    actions: readonly { id: string; label: string; href: string }[];
    preview: {
      eyebrow: string;
      badge: string;
      substrate: {
        pill: string;
        title: string;
        layers: readonly HeadlessShiftLayer[];
      };
      connector: string;
      interface: {
        pill: string;
        title: string;
        tabs: readonly HeadlessShiftTab[];
        snippetLabel: string;
        snippetUrl: string;
        surfacesLabel: string;
        surfaces: readonly HeadlessShiftSurface[];
      };
      foot: string;
    };
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

  /* Reset helper held in a ref so the cleanup path in the setup
     effect can also call it. The shared scroll subscription below
     drives writes; this just lets the component clean up cleanly
     when `animated` flips off or the component unmounts. */
  const resetRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const wrapper = node.closest<HTMLElement>(".aiop-cases-and-shift");
    const cases = wrapper?.querySelector<HTMLElement>(".aiop-cases");

    resetRef.current = () => {
      node.style.removeProperty("--aiop-shift-progress");
      node.style.transform = "";
      if (cases) cases.style.transform = "";
    };

    if (!animated) {
      resetRef.current();
    }

    return () => {
      resetRef.current?.();
      resetRef.current = null;
    };
  }, [animated]);

  const measure = useCallback(
    (frame: ScrollFrame) => {
      if (!animated) return;
      const node = sectionRef.current;
      if (!node) return;

      const wrapper = node.closest<HTMLElement>(".aiop-cases-and-shift");
      const cases = wrapper?.querySelector<HTMLElement>(".aiop-cases");

      if (!wrapper || !cases) {
        const rect = node.getBoundingClientRect();
        const total = rect.height + frame.vh;
        const traveled = frame.vh - rect.top;
        const p = Math.max(0, Math.min(1, traveled / total));
        node.style.setProperty("--aiop-shift-progress", p.toFixed(4));
        return;
      }

      const wrapperRect = wrapper.getBoundingClientRect();
      // Cases sits as the first child of the wrapper, so its
      // bottom in viewport coords doubles as the natural
      // (transform-free) top of this section.
      const casesBottomInVH = wrapperRect.top + cases.offsetHeight;

      // Inner-progress derived from natural layout coords so the
      // entry-buffer hold below doesn't distort atmospheric drift.
      const total = node.offsetHeight + frame.vh;
      const traveled = frame.vh - casesBottomInVH;
      const p = Math.max(0, Math.min(1, traveled / total));
      node.style.setProperty("--aiop-shift-progress", p.toFixed(4));

      const freezeNeeded = frame.vh - casesBottomInVH;
      const maxFreeze = wrapper.offsetHeight - cases.offsetHeight;
      const freeze = Math.max(0, Math.min(maxFreeze, freezeNeeded));

      cases.style.transform =
        freeze > 0 ? `translate3d(0, ${freeze}px, 0)` : "";

      // Entry buffer: hold this interstitial in place for the
      // first ~140px of freeze (≈ one-to-two scroll-wheel
      // movements) so Cases' closing bridge callout stays
      // readable before HeadlessShift begins rising. After the
      // buffer, linearly release back to 0 so the section reaches
      // its natural document position by the time freeze caps —
      // otherwise it would sit translated past its natural bottom
      // and the next section (Substrate map) would overlap its
      // tail. Mirrors `software-for-few.tsx`.
      const entryBuffer = Math.min(140, frame.vh * 0.13);
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
    [animated],
  );

  useScrollFrame(measure);

  const { eyebrow, badge, substrate, connector, interface: iface, foot } =
    section.preview;

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
            {section.title}{" "}
            <em className="aiop-shift__title-em">
              {section.titleEm}
            </em>
          </h2>
          <p className="aiop-shift__body">{section.body}</p>
          <p className="aiop-shift__body aiop-shift__body--strong">
            {section.bodyStrong}
          </p>
          {/* Optional Stripe-applied closing beat — only rendered
              when `bodyStripe` is non-empty. The current copy folds
              voice/claims/localization into the first paragraph, so
              this slot is empty by default. Kept wired (with the
              `--stripe` accent class) in case a future iteration
              wants to surface a separate closing beat. */}
          {section.bodyStripe ? (
            <p className="aiop-shift__body aiop-shift__body--stripe">
              {section.bodyStripe}
            </p>
          ) : null}
          <div
            className="aiop-shift__actions"
            aria-label="Headless interstitial links"
          >
            {section.actions.map((action) => (
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
              {eyebrow}
            </span>
            <span className="aiop-shift__card-badge">{badge}</span>
          </header>

          {/* Encode lane — frame wraps the substrate stack so the
              encode card reads as one grouped concept, mirroring the
              build lane's frame for visual symmetry across the two
              lanes. Encode pill is notched into the top edge of the
              frame border (fieldset/legend pattern). */}
          <section
            className="aiop-shift__sub aiop-shift__sub--encode"
            aria-label={substrate.title}
          >
            <div className="aiop-shift__lane">
              <span className="aiop-shift__pill aiop-shift__pill--encode aiop-shift__pill--frame">
                <span className="aiop-shift__pill-dot" aria-hidden="true" />
                {substrate.pill}
              </span>

              <div className="aiop-shift__lane-block">
                <span className="aiop-shift__lane-label">
                  {substrate.title}
                </span>
                <ul className="aiop-shift__substrate" role="list">
                  {substrate.layers.map((layer) => (
                    <li key={layer.tag} className="aiop-shift__substrate-row">
                      <span className="aiop-shift__substrate-tag">
                        {layer.tag}
                      </span>
                      <span className="aiop-shift__substrate-name">
                        {layer.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Connector — names the encode → build transition */}
          <div className="aiop-shift__connector" aria-hidden="true">
            <span className="aiop-shift__connector-line" />
            <span className="aiop-shift__connector-label">{connector}</span>
            <span className="aiop-shift__connector-line" />
          </div>

          {/* Build lane — frame wraps the headless interface and the
              surfaces (two equal sibling blocks separated by a sage
              divider). Build pill notched into the top edge of the
              frame border, mirroring the encode lane above. */}
          <section
            className="aiop-shift__sub aiop-shift__sub--build"
            aria-label={iface.title}
          >
            <div className="aiop-shift__lane">
              <span className="aiop-shift__pill aiop-shift__pill--build aiop-shift__pill--frame">
                <span className="aiop-shift__pill-dot" aria-hidden="true" />
                {iface.pill}
              </span>

              {/* Headless interface — tabs + snippet */}
              <div className="aiop-shift__lane-block">
                <span className="aiop-shift__lane-label">{iface.title}</span>
                <div
                  className="aiop-shift__tabs"
                  role="tablist"
                  aria-label="Available headless surfaces"
                >
                  {iface.tabs.map((tab) => (
                    <span
                      key={tab.id}
                      className={`aiop-shift__tab${
                        tab.active ? " aiop-shift__tab--active" : ""
                      }`}
                      role="tab"
                      aria-selected={tab.active ? "true" : "false"}
                    >
                      <span className="aiop-shift__tab-label">
                        {tab.label}
                      </span>
                      {tab.note ? (
                        <span className="aiop-shift__tab-note">{tab.note}</span>
                      ) : null}
                    </span>
                  ))}
                </div>
                <div
                  className="aiop-shift__snippet"
                  aria-label={iface.snippetLabel}
                >
                  <span className="aiop-shift__snippet-label">
                    {iface.snippetLabel}
                  </span>
                  <code className="aiop-shift__snippet-code">
                    {iface.snippetUrl}
                  </code>
                </div>
              </div>

              <div className="aiop-shift__lane-divider" aria-hidden="true" />

              {/* Surfaces — equal sibling block under Build */}
              <div className="aiop-shift__lane-block">
                <span className="aiop-shift__lane-label">
                  {iface.surfacesLabel}
                </span>
                <ul className="aiop-shift__surfaces" role="list">
                  {iface.surfaces.map((surface) => (
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
            </div>
          </section>

          <p className="aiop-shift__card-foot">{foot}</p>
        </aside>
      </div>
    </section>
  );
}
