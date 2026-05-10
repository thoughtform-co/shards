import { diagnosisSection } from "../content";

/*
 * DiagnosisV3 — "When the gap shows up."
 *
 * V3 fork of `../diagnosis.tsx`. Same four use cases, same card
 * chrome and grid layout — but reframed by a new eyebrow, title, and
 * lede so the section reads as PROOF of the lens above
 * (`AiIsNotSoftware`) rather than as a standalone diagnosis.
 *
 * Differences from v1's `Diagnosis`:
 *   - Adds a `WHEN THE GAP SHOWS UP` eyebrow above the title using
 *     the existing `.aiop-eyebrow` chrome (same treatment as the hero
 *     and the CTA sections).
 *   - Replaces the title and lede with v3 strings inline. No new
 *     content exports — v3 is a single fork and the strings only
 *     appear here.
 *   - Drops the `<div className="aiop-diagnosis__bridge">` chevron
 *     and the `<aside className="aiop-diagnosis__gap">` card. In v3,
 *     Evans (rendered immediately after this section) carries the
 *     hand-off into the method.
 *
 * Reuses `diagnosisSection.useCases` from `../content` so the four
 * organisational patterns stay in lock-step with v1. Re-skinning a
 * client cut still touches the parent content module.
 */
export function DiagnosisV3() {
  return (
    <section className="aiop-section aiop-diagnosis" id="diagnosis">
      <div className="aiop-wrap">
        <header className="aiop-diagnosis__head aiop-reveal">
          <div className="aiop-diagnosis__head-title">
            <p className="aiop-eyebrow">
              <span className="aiop-slash" aria-hidden="true" />
              When the gap shows up
            </p>
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
      </div>
    </section>
  );
}
