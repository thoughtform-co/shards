import { aiRealitySection } from "./content";

/*
 * AiIsNotSoftware — reality-check interstitial.
 *
 * Sits between the Evans bridge and the Vision flywheel inside the
 * `.aiop-bridge-and-reality` parallax-reveal wrapper. Names the
 * structural reason the asking gap is hard: AI is interpretive
 * technology, not deterministic software, so traditional rollout
 * habits fail. The flywheel that follows reads as the answer.
 *
 * Composition (mirrors the Software-for-few interstitial pattern):
 *
 *   1. Left copy column with eyebrow, title, body, strong line, and a
 *      single calm CTA into the flywheel.
 *   2. Right card with three contrast rows (Normal software, AI
 *      systems, Adoption layer). The middle row carries the highlight
 *      because it names the mental-model shift.
 *   3. Foot line — one-sentence takeaway.
 *
 * Choreography lives in `quote-bridge.tsx`, which holds the bridge
 * frozen via `translateY` while this component, as the next sibling
 * inside the wrapper, slides up over it through natural flow. This
 * component does not need its own scroll handler.
 *
 * On narrow viewports and under `prefers-reduced-motion: reduce` the
 * pin and slide-over are disabled at the wrapper level, so the
 * section reads as a calm static beat below the Evans quote.
 */
export function AiIsNotSoftware() {
  const { eyebrow, title, titleEm, body, bodyStrong, rows, foot, actions } =
    aiRealitySection;

  return (
    <section
      className="aiop-section aiop-reality"
      id="reality"
      aria-labelledby="aiop-reality-title"
    >
      <div className="aiop-reality__bleed" aria-hidden="true">
        <span className="aiop-reality__wash aiop-reality__wash--a" />
        <span className="aiop-reality__wash aiop-reality__wash--b" />
        <span className="aiop-reality__grid" />
      </div>

      <div className="aiop-wrap aiop-reality__inner">
        <div className="aiop-reality__copy aiop-reveal">
          <p className="aiop-eyebrow">{eyebrow}</p>
          <h2
            className="aiop-section-title aiop-reality__title"
            id="aiop-reality-title"
          >
            {title} <em className="aiop-reality__title-em">{titleEm}</em>
          </h2>
          <p className="aiop-reality__body">{body}</p>
          <p className="aiop-reality__body aiop-reality__body--strong">
            {bodyStrong}
          </p>
          <div
            className="aiop-reality__actions"
            aria-label="Reality check links"
          >
            {actions.map((action) => (
              <a
                key={action.id}
                className="aiop-reality__link"
                href={action.href}
              >
                {action.label}
              </a>
            ))}
          </div>
        </div>

        <aside
          className="aiop-reality__card aiop-reveal"
          aria-label="Software vs AI vs adoption layer"
        >
          <ul className="aiop-reality__rows" role="list">
            {rows.map((row) => (
              <li
                key={row.id}
                className={`aiop-reality__row aiop-reality__row--${row.id}${
                  row.highlight ? " aiop-reality__row--highlight" : ""
                }`}
              >
                <span className="aiop-reality__row-tag">{row.tag}</span>
                <span className="aiop-reality__row-detail">{row.detail}</span>
              </li>
            ))}
          </ul>
          <p className="aiop-reality__card-foot">{foot}</p>
        </aside>
      </div>
    </section>
  );
}
