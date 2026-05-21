import { pageToolCollabSection } from "@/content/intelligence-layer";

/*
 * ToolCollabSpectrum — "Why traditional adoption doesn't work with
 * AI." Names the structural reason the asking gap is hard: AI is
 * neither a tool nor a collaborator, so the playbooks built for
 * either fail. Tool rollouts teach buttons. Change programs teach
 * behaviours. AI lives between them, and adoption that works has
 * to live inside the work.
 *
 * Composition (mirrors the diagnosis title-left + lede-right
 * header pattern so the two read as one rhythm):
 *
 *   1. Header — title on the left, lede paragraph + bolded
 *      punchline on the right.
 *   2. Continuum spectrum — full-width horizontal rail with three
 *      diamond markers (Tool / AI lives here / Collaborator) and
 *      a 3-column grid below carrying label / title / desc per
 *      stop. The middle column is highlighted because it names
 *      the mental-model shift the visitor needs to internalise
 *      before the Vision flywheel reads as the answer.
 *
 * Ported from the Shards `AiIsNotSoftware` component in
 * `00_shards/app/ai-operator/ai-is-not-software.tsx`. The Shards
 * version sat inside the `.aiop-bridge-and-reality` parallax pair
 * and slid up over the frozen Evans bridge; on Aether the
 * spectrum is the second-to-last chapter slide before Vision and
 * is paired with Vision via `.aiop-spectrum-and-vision` for the
 * final parallax punch (Spectrum freezes, Vision rises as the
 * answer). The scroll handler lives in
 * `question-interstitial.tsx`'s sibling pattern — see the
 * `.aiop-spectrum-and-vision` block in operator.css.
 */
export function ToolCollabSpectrum() {
  const { title, titleEm, lede, ledeStrong, spectrum } =
    pageToolCollabSection;

  return (
    <section
      className="aiop-section aiop-tool-collab"
      id={pageToolCollabSection.id}
      aria-labelledby="aiop-tool-collab-title"
      aria-label={pageToolCollabSection.ariaLabel}
    >
      <div className="aiop-tool-collab__bleed" aria-hidden="true">
        <span className="aiop-tool-collab__wash aiop-tool-collab__wash--a" />
        <span className="aiop-tool-collab__wash aiop-tool-collab__wash--b" />
        <span className="aiop-tool-collab__grid" />
      </div>

      <div className="aiop-wrap aiop-tool-collab__inner">
        <header className="aiop-tool-collab__head aiop-reveal">
          <div className="aiop-tool-collab__head-title">
            <h2
              className="aiop-section-title aiop-tool-collab__title"
              id="aiop-tool-collab-title"
            >
              {title}{" "}
              <em className="aiop-tool-collab__title-em">{titleEm}</em>
            </h2>
          </div>
          <div className="aiop-tool-collab__head-lede">
            <p className="aiop-tool-collab__lede">
              {lede}
              <strong>{ledeStrong}</strong>
            </p>
          </div>
        </header>

        <div
          className="aiop-tool-collab__spectrum aiop-reveal"
          role="img"
          aria-label={spectrum.railLabel}
        >
          <div className="aiop-tool-collab__rail" aria-hidden="true">
            <span className="aiop-tool-collab__diamond aiop-tool-collab__diamond--l" />
            <span className="aiop-tool-collab__diamond aiop-tool-collab__diamond--c" />
            <span className="aiop-tool-collab__diamond aiop-tool-collab__diamond--r" />
          </div>

          <div className="aiop-tool-collab__cols">
            {spectrum.columns.map((column) => (
              <div
                key={column.id}
                className={`aiop-tool-collab__col aiop-tool-collab__col--${column.align}${
                  column.highlight ? " aiop-tool-collab__col--highlight" : ""
                }`}
              >
                <span className="aiop-tool-collab__col-label">
                  {column.label}
                </span>
                <span className="aiop-tool-collab__col-title">
                  {column.title}
                </span>
                <span className="aiop-tool-collab__col-sub">{column.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
