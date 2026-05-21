import {
  whyDataSources,
  whyProblems,
  whySection,
  whySources,
  whyTools,
} from "@/content/aether";

/**
 * Why now — Data is connected. AI tools multiply. Expertise is still
 * scattered.
 *
 * Two-column section. Left lists the four named problems. Right renders
 * a single panel with three zones, read top-to-bottom:
 *
 *   1. Data sources connected — a tidy row of named pills (Snowflake,
 *      ThoughtSpot, Meta Ads, Monday, Frontify, Notion). The eye reads
 *      "infrastructure exists".
 *   2. AI tools + interfaces rolled out — a second tidy row (Claude,
 *      Copilot, Slack, agents, workflows, dashboards). The eye reads
 *      "tools exist".
 *   3. Expertise — six small tiles laid across a 12-column grid at
 *      varying widths and offsets. The eye reads "interpretation is
 *      not encoded".
 *
 * The asymmetry of form is the argument: two tidy rails on top, one
 * scattered grid underneath. The Layer section that follows is the
 * resolution: data sources on the left, encoded substrate in the
 * middle, AI tools + interfaces on the right.
 */
export function Contrast() {
  return (
    <section className="section" id="why">
      <div className="wrap">
        <header className="section-head reveal">
          <p className="eyebrow">{whySection.eyebrow}</p>
          <h2 className="section-title">
            {whySection.title} <em>{whySection.titleEm}</em>
          </h2>
          <p className="section-intro">{whySection.lede}</p>
        </header>

        <div className="why-grid">
          <div className="why-col">
            <ul className="why-list" role="list" data-reveal-stack>
              {whyProblems.map((problem) => (
                <li key={problem.id} className="why-list__item reveal">
                  <span className="why-list__x" aria-hidden="true">
                    ✕
                  </span>
                  <span className="why-list__copy">
                    <strong>{problem.title}</strong>
                    <span>{problem.body}</span>
                  </span>
                </li>
              ))}
            </ul>

            <p className="why-thesis reveal">{whySection.vizFoot}</p>
          </div>

          <aside
            className="why-frame reveal"
            aria-label="Data sources connected, AI tools and interfaces rolled out, and the expertise scattered between them"
          >
            <section
              className="why-frame__zone why-frame__zone--data"
              aria-label={whySection.dataLabel}
            >
              <header className="why-frame__zone-head">
                <span className="why-frame__zone-label">
                  {whySection.dataLabel}
                </span>
                <span className="why-frame__zone-meta">
                  {whyDataSources.length}
                </span>
              </header>
              <ul className="why-frame__chips" role="list">
                {whyDataSources.map((chip) => (
                  <li
                    key={chip.id}
                    className={`why-frame__chip why-frame__chip--${chip.tone}`}
                  >
                    {chip.label}
                  </li>
                ))}
              </ul>
              <p className="why-frame__zone-note">{whySection.dataNote}</p>
            </section>

            <hr className="why-frame__divider" aria-hidden="true" />

            <section
              className="why-frame__zone why-frame__zone--tools"
              aria-label={whySection.toolsLabel}
            >
              <header className="why-frame__zone-head">
                <span className="why-frame__zone-label">
                  {whySection.toolsLabel}
                </span>
                <span className="why-frame__zone-meta">
                  {whyTools.length}
                </span>
              </header>
              <ul className="why-frame__chips" role="list">
                {whyTools.map((chip) => (
                  <li
                    key={chip.id}
                    className={`why-frame__chip why-frame__chip--${chip.tone}`}
                  >
                    {chip.label}
                  </li>
                ))}
              </ul>
              <p className="why-frame__zone-note">{whySection.toolsNote}</p>
            </section>

            <hr className="why-frame__divider why-frame__divider--strong" aria-hidden="true" />

            <section
              className="why-frame__zone why-frame__zone--expertise"
              aria-label={whySection.sourcesLabel}
            >
              <header className="why-frame__zone-head">
                <span className="why-frame__zone-label">
                  {whySection.sourcesLabel}
                </span>
                <span className="why-frame__zone-meta why-frame__zone-meta--em">
                  scattered
                </span>
              </header>
              <ul className="why-frame__scatter" role="list">
                {whySources.map((source, index) => (
                  <li
                    key={source.id}
                    className="why-frame__source"
                    data-pos={index + 1}
                  >
                    <span
                      className={`why-frame__source-icon why-frame__source-icon--${source.tone}`}
                      aria-hidden="true"
                    >
                      {source.initials}
                    </span>
                    <span className="why-frame__source-copy">
                      <strong>{source.label}</strong>
                      <span>{source.location}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <p className="why-frame__zone-note">{whySection.sourcesNote}</p>
            </section>
          </aside>
        </div>
      </div>
    </section>
  );
}
