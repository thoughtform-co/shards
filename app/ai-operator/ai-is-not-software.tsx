import { aiRealitySection } from "./content";

/*
 * AiIsNotSoftware — "Why traditional adoption doesn't work with AI."
 *
 * Sits between the Evans bridge and the Vision flywheel inside the
 * `.aiop-bridge-and-reality` parallax-reveal wrapper. Names the
 * structural reason the asking gap is hard: AI is neither a tool nor
 * a collaborator, so the playbooks built for either fail.
 *
 * Composition mirrors the diagnosis title-left + lede-right header
 * pattern (`.aiop-diagnosis__head`) so the two sections read as one
 * rhythm:
 *
 *   1. Header — eyebrow + title on the left, lede paragraph + CTA on
 *      the right.
 *   2. Continuum spectrum — a full-width horizontal rail with three
 *      diamond markers (Tool / AI lives here / Collaborator) and a
 *      3-column grid below carrying label / title / desc per stop.
 *      The middle column is highlighted because it names the
 *      mental-model shift the visitor needs to internalise.
 *
 * The spectrum is lifted from the Thoughtform Continuum Spectrum
 * (see `01_thoughtform/legacy/landing-v3/cockpit/continuum-spectrum.css`)
 * and adapted to the paper palette.
 *
 * Choreography lives in `quote-bridge.tsx`, which holds the bridge
 * frozen via `translateY` and also writes `--aiop-reality-hold` onto
 * the wrapper. For the first ~35% of the freeze (Phase 1) that hold
 * mirrors the bridge's translation onto this section so it stays
 * visually stationary while the parenthetical note is read. During
 * the remaining ~65% (Phase 2) the hold linearly releases back to 0
 * so this section slides up over the frozen bridge AND lands at its
 * natural document position by the time the freeze caps — otherwise
 * the next section (Vision) would paint over the spectrum's
 * sub-text. This component does not need its own scroll handler.
 *
 * On narrow viewports and under `prefers-reduced-motion: reduce` the
 * pin and slide-over are disabled at the wrapper level, so the
 * section reads as a calm static beat below the Evans quote.
 */
export function AiIsNotSoftware() {
  const { title, titleEm, lede, actions, spectrum } = aiRealitySection;

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
        <header className="aiop-reality__head aiop-reveal">
          <div className="aiop-reality__head-title">
            <h2
              className="aiop-section-title aiop-reality__title"
              id="aiop-reality-title"
            >
              {title} <em className="aiop-reality__title-em">{titleEm}</em>
            </h2>
          </div>
          <div className="aiop-reality__head-lede">
            <p className="aiop-reality__lede">{lede}</p>
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
        </header>

        <div
          className="aiop-reality__spectrum aiop-reveal"
          role="img"
          aria-label={spectrum.railLabel}
        >
          <div className="aiop-reality__rail" aria-hidden="true">
            <span className="aiop-reality__diamond aiop-reality__diamond--l" />
            <span className="aiop-reality__diamond aiop-reality__diamond--c" />
            <span className="aiop-reality__diamond aiop-reality__diamond--r" />
          </div>

          <div className="aiop-reality__cols">
            {spectrum.columns.map((column) => (
              <div
                key={column.id}
                className={`aiop-reality__col aiop-reality__col--${column.align}${
                  column.highlight ? " aiop-reality__col--highlight" : ""
                }`}
              >
                <span className="aiop-reality__col-label">{column.label}</span>
                <span className="aiop-reality__col-title">{column.title}</span>
                <span className="aiop-reality__col-sub">{column.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
