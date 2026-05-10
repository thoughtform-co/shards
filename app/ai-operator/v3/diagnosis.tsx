import { diagnosisSection } from "../content";

/*
 * DiagnosisV3 — "Treat AI like software, and these are the cracks…"
 *
 * V3 fork of `../diagnosis.tsx`. Same four use cases, same card
 * chrome and grid layout, same gap card hand-off — but reframed by a
 * new title and lede so the section reads as PROOF of the lens above
 * (`AiIsNotSoftware`) rather than as a standalone diagnosis.
 *
 * Differences from v1's `Diagnosis`:
 *   - Title and lede are v3 strings inline (no new content exports —
 *     v3 is a single fork and the strings only appear here).
 *   - Reuses `diagnosisSection.useCases` and `diagnosisSection.gap`
 *     from `../content` so the four organisational patterns and the
 *     "fix isn't more AI" gap card stay in lock-step with v1.
 *
 * The chevron + gap card sit below the four use cases as in v1; in
 * v3 they hand directly into the Evans bridge below.
 */
export function DiagnosisV3() {
  const { gap } = diagnosisSection;

  return (
    <section className="aiop-section aiop-diagnosis" id="diagnosis">
      <div className="aiop-wrap">
        <header className="aiop-diagnosis__head aiop-reveal">
          <div className="aiop-diagnosis__head-title">
            <h2 className="aiop-section-title aiop-diagnosis__title">
              Treat AI like software,{" "}
              <em>and these are the cracks that show up.</em>
            </h2>
          </div>
          <p className="aiop-diagnosis__lede">
            Most companies already have AI tools, data, and founders who want
            to move fast. What they&rsquo;re missing is the layer between what
            their teams know and what AI does. When teams treat that layer
            like software, four patterns repeat.
          </p>
        </header>

        <ol
          className="aiop-diagnosis__grid aiop-reveal"
          role="list"
          aria-label="Four use cases that share the same root cause"
        >
          {diagnosisSection.useCases.map((useCase) => (
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
          aria-label="Shared root cause across the four patterns"
        >
          <p className="aiop-diagnosis__gap-title">
            {gap.title} <em>{gap.titleEm}</em>
          </p>
          {gap.subline ? (
            <p className="aiop-diagnosis__gap-subline">{gap.subline}</p>
          ) : null}
        </aside>
      </div>
    </section>
  );
}
