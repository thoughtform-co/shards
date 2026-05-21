import { ctaSection } from "@/content/operator";

/*
 * Cta — closing decision sheet.
 *
 * The page's editorial close. A two-column grid:
 *   - left column: eyebrow + italic title + body paragraph + three
 *     concrete decisions (Office / Engineer / Workflows) + fine
 *     print + a row of primary actions ("walk the team shape",
 *     "walk the Loop proof")
 *   - right column: ghost actions pointing at the supporting reads
 *     (the operating-model deep dive, the headless vision)
 *
 * Previously lived inline in `app/page.tsx`; extracted so the
 * intelligence-layer route can render the same beat without
 * duplicating ~100 lines of JSX. Accepts a `section` prop so route
 * variants can override the copy / decisions / actions without
 * touching the homepage content tree.
 *
 * No `"use client"`: pure presentation, no interactivity beyond
 * anchor + external-link semantics, which the markup already
 * carries.
 */
export function Cta({
  section = ctaSection,
}: {
  section?: typeof ctaSection;
} = {}) {
  return (
    <section
      className="aiop-section aiop-section--tight aiop-cta"
      id="cta"
    >
      <div className="aiop-wrap">
        <div className="aiop-cta__grid">
          <div className="aiop-cta__copy aiop-reveal">
            <p className="aiop-eyebrow aiop-cta__eyebrow">
              <span className="aiop-slash" aria-hidden="true" />
              {section.eyebrow}
            </p>
            <h2 className="aiop-cta__title">
              <em>{section.titleEm}</em>
            </h2>
            {section.body.map((paragraph, idx) => (
              <p key={idx} className="aiop-cta__body">
                {paragraph}
              </p>
            ))}

            {/* Three-decision row — Office · Engineer · Workflows. */}
            <ol
              className="aiop-cta__decisions"
              role="list"
              aria-label="Three concrete decisions"
            >
              {section.decisions.map((decision) => (
                <li
                  key={decision.id}
                  className={`aiop-cta__decision aiop-cta__decision--${decision.id}`}
                >
                  <span className="aiop-cta__decision-tag">{decision.tag}</span>
                  <h3 className="aiop-cta__decision-title">
                    {decision.title}
                  </h3>
                  <p className="aiop-cta__decision-body">{decision.body}</p>
                </li>
              ))}
            </ol>

            <p className="aiop-cta__fine">{section.fine}</p>

            <div className="aiop-cta__actions">
              <div
                className="aiop-cta__primary-row"
                aria-label="Walk the argument"
              >
                {section.actions
                  .filter((a) => a.kind === "primary")
                  .map((action) => (
                    <a
                      key={action.id}
                      className="aiop-cta__primary"
                      href={action.href}
                      {...(action.external
                        ? {
                            target: "_blank",
                            rel: "noopener noreferrer",
                          }
                        : {})}
                    >
                      <span className="aiop-cta__primary-label">
                        {action.label}
                      </span>
                      <span
                        className="aiop-cta__primary-arrow"
                        aria-hidden="true"
                      >
                        &rarr;
                      </span>
                    </a>
                  ))}
              </div>
            </div>
          </div>

          <div className="aiop-cta__right aiop-reveal">
            <div
              className="aiop-cta__ghost-row"
              aria-label="Supporting reads"
            >
              {section.actions
                .filter((a) => a.kind === "ghost")
                .map((action) => (
                  <a
                    key={action.id}
                    className="aiop-cta__ghost"
                    href={action.href}
                    {...(action.external
                      ? {
                          target: "_blank",
                          rel: "noopener noreferrer",
                        }
                      : {})}
                  >
                    <span className="aiop-cta__ghost-label">
                      {action.label}
                    </span>
                    <span
                      className="aiop-cta__ghost-arrow"
                      aria-hidden="true"
                    >
                      &rarr;
                    </span>
                  </a>
                ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
