import { teamShapeSection, type TeamShapeCadenceBeat } from "@/content/operator";

/*
 * TeamShape — explicit ask, named seats.
 *
 * Sits between Surface pick and the CTA. Renders as a two-seat
 * composition card with codenames + named incumbents, a 3-row cadence
 * strip below ("Embed · Encode · Hand back"), a mandate-clauses block,
 * and a Seed / Mandate / Capability ladder of investment.
 *
 * Read as an org-chart, not a job application: the role + codename
 * convention matches the Cases-row codename grammar used elsewhere
 * on the page, and the ladder names three commitment levels Dimitri
 * can reach for. The Seed rung carries the "On the table" marker so
 * the decision currently in front of him is visible at a glance.
 *
 * Server component — no client hooks.
 *
 * `section` prop lets route variants override the copy.
 */
export function TeamShape({
  section = teamShapeSection,
}: {
  section?: {
    id: string;
    eyebrow: string;
    title: string;
    titleEm: string;
    body: ReadonlyArray<string>;
    composition: {
      headEyebrow: string;
      headBadge: string;
      seats: {
        id: string;
        role: string;
        codename: string;
        codenameEm: string;
        name: string;
        team: string;
        summary: string;
        unlocks: readonly string[];
      }[];
      cadenceLabel: string;
      cadence: TeamShapeCadenceBeat[];
      foot: string;
    };
    ladder: {
      label: string;
      rungs: {
        id: string;
        tag: string;
        title: string;
        body: string;
        marker?: string;
      }[];
      foot: string;
    };
    mandate: {
      label: string;
      clauses: string[];
    };
  };
} = {}) {
  const { id, eyebrow, title, titleEm, body, composition, ladder, mandate } =
    section;

  return (
    <section
      className="aiop-section aiop-team-shape"
      id={id}
      aria-label="Team & ask: two seats, one mandate, three commitments"
    >
      <div className="aiop-wrap aiop-team-shape__inner">
        <header className="aiop-team-shape__head aiop-reveal">
          <p className="aiop-eyebrow aiop-team-shape__eyebrow">
            <span className="aiop-slash" aria-hidden="true" />
            {eyebrow}
          </p>
          <h2 className="aiop-team-shape__title">
            {title} <em>{titleEm}</em>
          </h2>
          <div className="aiop-team-shape__body">
            {body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </header>

        <div className="aiop-team-shape__layout">
          {/* Composition card — two seats, cadence strip, foot. */}
          <article
            className="aiop-team-shape__composition aiop-reveal"
            aria-label="Hub composition: founding seats"
          >
            <header className="aiop-team-shape__composition-head">
              <span className="aiop-team-shape__composition-eyebrow">
                <span
                  className="aiop-team-shape__composition-dot"
                  aria-hidden="true"
                />
                {composition.headEyebrow}
              </span>
              <span className="aiop-team-shape__composition-badge">
                {composition.headBadge}
              </span>
            </header>

            <ol
              className="aiop-team-shape__seats"
              role="list"
              aria-label="Two founding seats"
            >
              {composition.seats.map((seat) => (
                <li
                  key={seat.id}
                  className={`aiop-team-shape__seat aiop-team-shape__seat--${seat.id}`}
                >
                  <header className="aiop-team-shape__seat-head">
                    <span className="aiop-team-shape__seat-role">
                      {seat.role}
                    </span>
                  </header>
                  <p className="aiop-team-shape__seat-codename">
                    {seat.codename}
                    <em>{seat.codenameEm}</em>.
                  </p>
                  <p className="aiop-team-shape__seat-name">{seat.name}</p>
                  <p className="aiop-team-shape__seat-team">{seat.team}</p>
                  <p className="aiop-team-shape__seat-summary">
                    {seat.summary}
                  </p>
                  <ul
                    className="aiop-team-shape__seat-unlocks"
                    role="list"
                    aria-label={`${seat.name} — what this seat unlocks`}
                  >
                    {seat.unlocks.map((line) => (
                      <li
                        key={line}
                        className="aiop-team-shape__seat-unlock"
                      >
                        <span
                          className="aiop-team-shape__seat-unlock-tick"
                          aria-hidden="true"
                        />
                        {line}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>

            <div className="aiop-team-shape__cadence-block">
              <p className="aiop-team-shape__cadence-label">
                {composition.cadenceLabel}
              </p>
              <dl
                className="aiop-team-shape__cadence"
                aria-label={composition.cadenceLabel}
              >
                {composition.cadence.map((beat) => (
                  <div
                    key={beat.k}
                    className="aiop-team-shape__cadence-beat"
                  >
                    <dt>{beat.k}</dt>
                    <dd>{beat.v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <p className="aiop-team-shape__composition-foot">
              {composition.foot}
            </p>
          </article>

          {/* Right column — mandate clauses + ladder of investment. */}
          <aside
            className="aiop-team-shape__right aiop-reveal"
            aria-label="Mandate and ladder of investment"
          >
            <section className="aiop-team-shape__mandate">
              <p className="aiop-team-shape__mandate-label">
                {mandate.label}
              </p>
              <ul
                className="aiop-team-shape__mandate-list"
                role="list"
                aria-label={mandate.label}
              >
                {mandate.clauses.map((clause) => (
                  <li
                    key={clause}
                    className="aiop-team-shape__mandate-clause"
                  >
                    <span
                      className="aiop-team-shape__mandate-tick"
                      aria-hidden="true"
                    />
                    {clause}
                  </li>
                ))}
              </ul>
            </section>

            <section className="aiop-team-shape__ladder">
              <p className="aiop-team-shape__ladder-label">{ladder.label}</p>
              <ol
                className="aiop-team-shape__ladder-list"
                role="list"
                aria-label={ladder.label}
              >
                {ladder.rungs.map((rung) => (
                  <li
                    key={rung.id}
                    className={`aiop-team-shape__rung aiop-team-shape__rung--${rung.id}`}
                  >
                    <header className="aiop-team-shape__rung-head">
                      <span className="aiop-team-shape__rung-tag">
                        {rung.tag}
                      </span>
                      {rung.marker ? (
                        <span className="aiop-team-shape__rung-marker">
                          {rung.marker}
                        </span>
                      ) : null}
                    </header>
                    <h3 className="aiop-team-shape__rung-title">
                      {rung.title}
                    </h3>
                    <p className="aiop-team-shape__rung-body">{rung.body}</p>
                  </li>
                ))}
              </ol>
              <p className="aiop-team-shape__ladder-foot">{ladder.foot}</p>
            </section>
          </aside>
        </div>
      </div>
    </section>
  );
}
