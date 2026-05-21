import { surfacePickSection } from "@/content/operator";

/*
 * SurfacePick — "Pick the surface that fits the workflow."
 *
 * Closing-side beat shared by the operator homepage and the
 * `/intelligence-layer` page. Same engine, different surfaces:
 *   - left card column — three protocols (MCP, API, CLI) the engine
 *     can be called through
 *   - middle connector — `Inherits →`, the verbal bridge between
 *     protocol and surface
 *   - right aside — role-clustered surfaces (Developer / Comms / PM /
 *     Marketer / Ops) so the panel reads as "who reaches this engine,
 *     and on which surface"
 *   - card foot — short closing sentence that lands the section's
 *     point one more time
 *
 * Previously lived inline in `app/page.tsx`; extracted here so the
 * intelligence-layer route can render the same beat without
 * duplicating the long JSX. Accepts a `section` prop so route
 * variants can override the copy without touching the homepage
 * content tree.
 */
export function SurfacePick({
  section = surfacePickSection,
}: {
  section?: typeof surfacePickSection;
} = {}) {
  return (
    <section className="aiop-section aiop-surface-pick" id="surface-pick">
      <div className="aiop-wrap">
        <header className="aiop-surface-pick__head aiop-reveal">
          <h2 className="aiop-section-title aiop-surface-pick__title">
            {section.title} <em>{section.titleEm}</em>
          </h2>
          <p className="aiop-surface-pick__lede">{section.body}</p>
        </header>

        <div className="aiop-surface-pick__card aiop-reveal">
          <header className="aiop-surface-pick__card-head">
            <span className="aiop-surface-pick__card-label">
              <span
                className="aiop-surface-pick__card-dot"
                aria-hidden="true"
              />
              {section.cardLabel}
            </span>
            <span className="aiop-surface-pick__card-flow">{section.flow}</span>
          </header>

          <div className="aiop-surface-pick__layout">
            <article
              className="aiop-surface-pick__lane aiop-surface-pick__lane--interfaces"
              aria-label={section.cardLabel}
            >
              <span className="aiop-surface-pick__lane-pill">
                {section.cardLabel}
              </span>
              <p className="aiop-surface-pick__lane-label">
                Headless entrypoints
              </p>
              <ol className="aiop-surface-pick__interfaces" role="list">
                {section.interfaces.map((iface) => (
                  <li
                    key={iface.id}
                    className={`aiop-surface-pick__interface aiop-surface-pick__interface--${iface.id}${
                      iface.recommended
                        ? " aiop-surface-pick__interface--recommended"
                        : ""
                    }`}
                  >
                    <header className="aiop-surface-pick__interface-head">
                      <span
                        className="aiop-surface-pick__interface-icon"
                        aria-hidden="true"
                      >
                        {iface.icon}
                      </span>
                      <div className="aiop-surface-pick__interface-text">
                        <span className="aiop-surface-pick__interface-label">
                          {iface.label}
                          {iface.recommended ? (
                            <span className="aiop-surface-pick__interface-badge">
                              Default
                            </span>
                          ) : null}
                        </span>
                        <span className="aiop-surface-pick__interface-sublabel">
                          {iface.sublabel}
                        </span>
                      </div>
                    </header>
                    <p className="aiop-surface-pick__interface-detail">
                      {iface.detail}
                    </p>
                  </li>
                ))}
              </ol>
            </article>

            <div
              className="aiop-surface-pick__connector"
              aria-hidden="true"
            >
              <span className="aiop-surface-pick__connector-line" />
              <span className="aiop-surface-pick__connector-label">
                Inherits
              </span>
              <span className="aiop-surface-pick__connector-arrow">&rarr;</span>
            </div>

            <aside
              className="aiop-surface-pick__destinations aiop-surface-pick__lane aiop-surface-pick__lane--destinations"
              aria-label={section.surfacesLabel}
            >
              <span className="aiop-surface-pick__lane-pill">Surface</span>
              <p className="aiop-surface-pick__destinations-label">
                {section.surfacesLabel}
              </p>
              <ul className="aiop-surface-pick__roles" role="list">
                {section.roleSurfaces.map((row) => (
                  <li key={row.role} className="aiop-surface-pick__role">
                    <span className="aiop-surface-pick__role-label">
                      {row.role}
                    </span>
                    <span className="aiop-surface-pick__role-surface">
                      <span
                        className="aiop-surface-pick__role-icon"
                        aria-hidden="true"
                      >
                        {row.icon}
                      </span>
                      <span className="aiop-surface-pick__role-name">
                        {row.surface}
                      </span>
                    </span>
                    <span className="aiop-surface-pick__role-note">
                      {row.note}
                    </span>
                  </li>
                ))}
              </ul>
            </aside>
          </div>

          <footer className="aiop-surface-pick__card-foot">
            {section.closing}
          </footer>
        </div>
      </div>
    </section>
  );
}
