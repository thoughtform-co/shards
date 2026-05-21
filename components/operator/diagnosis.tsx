import { diagnosisSection, type DiagnosisUseCase } from "@/content/operator";

/*
 * Diagnosis — four faces, one shared deployment gap.
 *
 * Reads the gap before the substrate map shows the layer that
 * fills it. Four beats:
 *
 *   1. Header  — eyebrow + bicolour h2 + 1-line sub.
 *   2. Grid    — four lane-tinted use-case cards. Each card shows
 *                its function tag (NDA review / Variance commentary /
 *                CMF files / Status updates) and opens a "Read
 *                context" disclosure for a short evidence note.
 *   3. Bridge  — small vertical hairline + chevron.
 *   4. Gap     — centred diamond-marked card naming the shared
 *                cause ("Four teams. The same missing layer.").
 *
 * The earlier "Use case 01/02/03/04" slot, the gap subline, and
 * the post-gap italic handoff have all been retired — the cards
 * carry the argument on their own and the substrate map below
 * picks up directly.
 *
 * Same shape the `/judgment-engine` route's `<Diagnosis />` uses,
 * tightened for the homepage executive register.
 *
 * `section` prop lets a route variant (e.g. `/pitch`) inject an
 * alternate copy module while every other component keeps reading
 * the live home content.
 */
export function Diagnosis({
  section = diagnosisSection,
}: {
  section?: {
    label: string;
    title: string;
    titleEm: string;
    sub: string;
    useCases: DiagnosisUseCase[];
    gap: { eyebrow: string; title: string };
  };
} = {}) {
  const { title, titleEm, sub, useCases, gap } = section;

  return (
    <section className="aiop-section aiop-diagnosis" id="diagnosis">
      <div className="aiop-wrap">
        <header className="aiop-section-head aiop-diagnosis__head aiop-reveal">
          <h2 className="aiop-section-title aiop-diagnosis__title">
            {title} <em>{titleEm}</em>
          </h2>
          <p className="aiop-section-head__sub aiop-diagnosis__sub">{sub}</p>
        </header>

        <ul
          className="aiop-diagnosis__grid aiop-reveal"
          role="list"
          aria-label="Four functions share one unencoded judgment gap"
        >
          {useCases.map((c) => (
            <li
              key={c.id}
              className={`aiop-diagnosis__card aiop-diagnosis__card--${c.tone}`}
            >
              <header className="aiop-diagnosis__card-head">
                <span className="aiop-diagnosis__card-tag">{c.tag}</span>
              </header>
              <h3 className="aiop-diagnosis__card-title">{c.title}</h3>
              <details className="aiop-diagnosis__card-details">
                <summary>
                  <span
                    className="aiop-diagnosis__card-toggle-icon"
                    aria-hidden="true"
                  />
                  Read context
                </summary>
                <p className="aiop-diagnosis__card-body">{c.body}</p>
              </details>
            </li>
          ))}
        </ul>

        <div className="aiop-diagnosis__bridge aiop-reveal" aria-hidden="true">
          <span className="aiop-diagnosis__chevron" />
        </div>

        <div className="aiop-diagnosis__gap aiop-reveal">
          <span className="aiop-diagnosis__gap-eyebrow">{gap.eyebrow}</span>
          <p className="aiop-diagnosis__gap-title">{gap.title}</p>
        </div>
      </div>
    </section>
  );
}
