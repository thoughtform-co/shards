import { executiveSummarySection } from "@/content/operator";

/*
 * ExecutiveSummary — Section 04 of the Aether home (v16, Forward-
 * Deployed Hub case).
 *
 * Single-screen forwardable beat. Sits between Hub Mandate and The
 * Signal so a busy reader (Dimitri, an investor he forwards the page
 * to) can land on the page, read this one section, and walk away with
 * the receipts: 21 days in, the function is already running.
 *
 * Composition:
 *   - Left column: eyebrow + bicolour title + 2-paragraph body + 4-up
 *     stat grid (`days`, `workshops`, `skills`, `shipped`).
 *   - Right column: faux Monday "Getting Started with Claude" board
 *     mockup. Sidebar with the 13 departments touched + 9 confirmed
 *     follow-ups; main panel with sub-items from the 21-day Monday
 *     board, each carrying an owner and a status pill (`done /
 *     running / pilot`). Designed schematic, not a live render — no
 *     PII, no external surface coupling.
 *   - Closing line under the two columns: editorial italic pull.
 *
 * Server component — no client hooks. Uses the existing `aiop-reveal`
 * IntersectionObserver from `reveal.tsx` for entrance choreography.
 */
export function ExecutiveSummary() {
  const { id, eyebrow, title, titleEm, body, stats, board, closing } =
    executiveSummarySection;

  return (
    <section
      className="aiop-section aiop-exec-summary"
      id={id}
      aria-label="Executive summary: 21 days in, the function is already running"
    >
      <div className="aiop-grid-bg" aria-hidden="true" />
      <div className="aiop-wrap aiop-exec-summary__inner">
        {/* Left column — copy + stat grid. Mirrors the hero copy
            grammar so the typographic rhythm holds across the opening
            beats. */}
        <div className="aiop-exec-summary__copy aiop-reveal">
          <p className="aiop-eyebrow aiop-exec-summary__eyebrow">
            <span className="aiop-slash" aria-hidden="true" />
            {eyebrow}
          </p>
          <h2 className="aiop-exec-summary__title">
            <span className="aiop-exec-summary__title-line">{title}</span>
            <span className="aiop-exec-summary__title-line">
              <em>{titleEm}</em>
            </span>
          </h2>

          <div className="aiop-exec-summary__body">
            {body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <ol
            className="aiop-exec-summary__stats"
            role="list"
            aria-label="Twenty-one-day Monday board metrics"
          >
            {stats.map((stat) => (
              <li key={stat.k} className="aiop-exec-summary__stat">
                <span className="aiop-exec-summary__stat-v">{stat.v}</span>
                <span className="aiop-exec-summary__stat-k">{stat.k}</span>
                {stat.note ? (
                  <span className="aiop-exec-summary__stat-note">
                    {stat.note}
                  </span>
                ) : null}
              </li>
            ))}
          </ol>
        </div>

        {/* Right column — Monday board mockup. The chrome is purely
            schematic so the page reads as forwardable; no live data,
            no avatars, no real ticket IDs. */}
        <aside
          className="aiop-exec-summary__board aiop-reveal"
          aria-label={`${board.headTitle} — schematic of Loop's internal Monday board`}
        >
          <header className="aiop-exec-summary__board-head">
            <span className="aiop-exec-summary__board-dot" aria-hidden="true" />
            <span className="aiop-exec-summary__board-titles">
              <span className="aiop-exec-summary__board-title">
                {board.headTitle}
              </span>
              <span className="aiop-exec-summary__board-sub">
                {board.headSub}
              </span>
            </span>
            <span
              className="aiop-exec-summary__board-controls"
              aria-hidden="true"
            >
              <span />
              <span />
              <span />
            </span>
          </header>

          <div className="aiop-exec-summary__board-grid">
            <div className="aiop-exec-summary__board-side">
              <p className="aiop-exec-summary__board-side-label">
                {board.sidebarLabel}
              </p>
              <ul
                className="aiop-exec-summary__board-side-list"
                role="list"
              >
                {board.departments.map((dept) => (
                  <li
                    key={dept.name}
                    className={`aiop-exec-summary__dept aiop-exec-summary__dept--${dept.state}`}
                  >
                    <span className="aiop-exec-summary__dept-glyph">
                      {dept.glyph}
                    </span>
                    <span className="aiop-exec-summary__dept-name">
                      {dept.name}
                    </span>
                    <span
                      className="aiop-exec-summary__dept-dot"
                      aria-hidden="true"
                    />
                  </li>
                ))}
              </ul>
              <p className="aiop-exec-summary__board-side-foot">
                {board.sidebarFoot}
              </p>
            </div>

            <div className="aiop-exec-summary__board-main">
              <header className="aiop-exec-summary__board-main-head">
                <span className="aiop-exec-summary__board-main-label">
                  {board.mainLabel}
                </span>
                <span className="aiop-exec-summary__board-main-flow">
                  Workshop &rarr; Skill &rarr; Owner
                </span>
              </header>
              <ul
                className="aiop-exec-summary__board-rows"
                role="list"
              >
                {board.rows.map((row) => (
                  <li
                    key={`${row.tag}-${row.name}`}
                    className="aiop-exec-summary__board-row"
                  >
                    <span
                      className={`aiop-exec-summary__board-tag aiop-exec-summary__board-tag--${row.tag.toLowerCase()}`}
                    >
                      {row.tag}
                    </span>
                    <span className="aiop-exec-summary__board-name">
                      {row.name}
                    </span>
                    <span className="aiop-exec-summary__board-owner">
                      {row.owner}
                    </span>
                    <span
                      className={`aiop-exec-summary__board-state aiop-exec-summary__board-state--${row.state}`}
                    >
                      <span
                        className="aiop-exec-summary__board-state-dot"
                        aria-hidden="true"
                      />
                      {row.state}
                    </span>
                  </li>
                ))}
              </ul>
              <footer className="aiop-exec-summary__board-main-foot">
                {board.mainFoot}
              </footer>
            </div>
          </div>
        </aside>

        <p className="aiop-exec-summary__closing aiop-reveal">{closing}</p>
      </div>
    </section>
  );
}
