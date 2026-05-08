import { diagnosisSection } from "./content";

/*
 * Diagnosis — Four faces, one missing piece.
 *
 * Sits between the Hero and the Quote Bridge. Static, server-rendered,
 * no interactivity. Composition mirrors the Vision section's
 * title-left + caption-right head pattern so the two read as one
 * rhythm, with the diagnostic content slotting cleanly into the page.
 *
 *   1. Header — eyebrow + title on the left, lede paragraph on the
 *      right. Matches `aiop-vision__head` layout so the pages share
 *      a single rhythm.
 *   2. 2x2 use-case grid — four faces, each with a left-rail accent
 *      in one of the four lane colours (violet / gold / sage / slate).
 *      Cards are joined by a 1px hairline-on-rule treatment lifted
 *      from `.aiop-case__pillars` so the quartet reads as one
 *      inspectable diagnostic surface.
 *   3. Shared-gap card — centred, narrow. Uses the bordered-chip
 *      treatment with diamond markers above and below pointing into
 *      the chevrons. Names the root cause: judgment is not encoded.
 *   4. Handoff sentence — one short bridging line ("The bottleneck
 *      isn't technical. It's knowing what to ask.") that hands into
 *      the Evans bridge below. The italic em on the second clause
 *      visually rhymes with the title's italic em.
 *
 * Re-skinning for Delaware / Ml6 / other clients only touches
 * `diagnosisSection` in `content.ts`. No new components, no morph
 * logic, no pill chrome — the bridge keeps its first-reveal of
 * Navigate / Encode / Build via the chip-to-pill morph.
 */
export function Diagnosis() {
  const { eyebrow, title, titleEm, lede, useCases, gap, handoff } =
    diagnosisSection;

  return (
    <section className="aiop-section aiop-diagnosis" id="diagnosis">
      <div className="aiop-wrap">
        <header className="aiop-diagnosis__head aiop-reveal">
          <div className="aiop-diagnosis__head-title">
            <p className="aiop-eyebrow">{eyebrow}</p>
            <h2 className="aiop-section-title aiop-diagnosis__title">
              {title} <em>{titleEm}</em>
            </h2>
          </div>
          <p className="aiop-diagnosis__lede">{lede}</p>
        </header>

        <ol
          className="aiop-diagnosis__grid aiop-reveal"
          role="list"
          aria-label="Four use cases that share the same root cause"
        >
          {useCases.map((useCase) => (
            <li
              key={useCase.n}
              className={`aiop-diagnosis__card aiop-diagnosis__card--${useCase.tone}`}
            >
              <header className="aiop-diagnosis__card-head">
                <span className="aiop-diagnosis__card-n">
                  Use case {useCase.n}
                </span>
                <span
                  className="aiop-diagnosis__card-rule"
                  aria-hidden="true"
                />
                <span className="aiop-diagnosis__card-tag">{useCase.tag}</span>
              </header>
              <h3 className="aiop-diagnosis__card-title">{useCase.title}</h3>
              <p className="aiop-diagnosis__card-body">{useCase.body}</p>
            </li>
          ))}
        </ol>

        <div className="aiop-diagnosis__bridge" aria-hidden="true">
          <span className="aiop-diagnosis__chevron" />
        </div>

        <aside
          className="aiop-diagnosis__gap aiop-reveal"
          aria-label="Shared root cause across the four faces"
        >
          <span className="aiop-diagnosis__gap-eyebrow">{gap.eyebrow}</span>
          <p className="aiop-diagnosis__gap-title">
            {gap.title} <em>{gap.titleEm}</em>
          </p>
          <p className="aiop-diagnosis__gap-subline">{gap.subline}</p>
        </aside>

        <p className="aiop-diagnosis__handoff aiop-reveal">
          {handoff.lead} <em>{handoff.leadEm}</em>
        </p>
      </div>
    </section>
  );
}
