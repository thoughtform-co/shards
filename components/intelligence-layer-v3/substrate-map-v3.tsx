import { v3LayerSection } from "@/content/intelligence-layer-v3";

/**
 * SubstrateMapV3 — three-column intelligence-layer diagram.
 *
 * Mirrors the canonical `SubstrateMap` component's JSX structure
 * exactly so V3 lands on the same visual chrome as the homepage.
 * The only structural difference: the Knowledge Graph ontology line
 * (`.ail-ontology-line`) moves from inside the Trusted Sources
 * column to inside the Encoded Substrate column. Both halves of
 * what the layer encodes — the entities the graph reasons over and
 * the rules / examples / voice / loops that capture how the team
 * decides about them — sit in one tier, cleanly connected.
 *
 * Server component. All styling reuses the canonical
 * `aiop-substrate-map__*` and `ail-*` classes from
 * `intelligence-layer.css` and `operator.css`. No V3-specific
 * styling needed for this section.
 */
export function SubstrateMapV3({
  titleOverride,
  titleEmOverride,
  ledeOverride,
  footer,
}: {
  titleOverride?: string;
  titleEmOverride?: string;
  ledeOverride?: string;
  /** Optional content rendered inside the card, directly after the
      closing strip. Used by /claude-adoption to attach the Adoption /
      Data ownership tracks to the bottom of the card; pages that don't
      pass this (the v3 page) get the standard substrate map. */
  footer?: React.ReactNode;
} = {}) {
  const { id, title, titleEm, lede, columns, closing } = v3LayerSection;
  const finalTitle = titleOverride ?? title;
  const finalTitleEm = titleEmOverride ?? titleEm;
  const finalLede = ledeOverride ?? lede;

  return (
    <section
      className="aiop-section aiop-section--soft aiop-substrate-map"
      id={id}
    >
      <div className="aiop-wrap">
        <header className="aiop-section-head aiop-substrate-map__head aiop-reveal">
          <h2 className="aiop-section-title aiop-substrate-map__title">
            {finalTitle} <em>{finalTitleEm}</em>
          </h2>
          <p className="aiop-section-head__sub aiop-substrate-map__lede">
            {finalLede}
          </p>
        </header>

        <div className="aiop-substrate-map__card aiop-reveal">
          <div className="aiop-substrate-map__grid">
            {/* Column 01 — Trusted sources (data systems only) */}
            <article className="aiop-substrate-map__col aiop-substrate-map__col--sources">
              <header className="aiop-substrate-map__col-head">
                <span className="aiop-substrate-map__col-n">
                  {columns.sources.n} · {columns.sources.kicker}
                </span>
              </header>
              <h3 className="aiop-substrate-map__col-title">
                {columns.sources.title}
              </h3>
              <p className="ail-substrate-map__col-caption">
                {columns.sources.caption}
              </p>
              <ul
                className="ail-systems-grid"
                role="list"
                aria-label="Systems of record"
              >
                {columns.sources.systems.items.map((item) => (
                  <li key={item} className="ail-systems-grid__chip">
                    {item}
                  </li>
                ))}
              </ul>
            </article>

            {/* Column 02 — Encoded substrate (KG entities + rules / examples / voice / loops) */}
            <article className="aiop-substrate-map__col aiop-substrate-map__col--substrate">
              <header className="aiop-substrate-map__col-head">
                <span className="aiop-substrate-map__col-n">
                  {columns.substrate.n} · {columns.substrate.kicker}
                </span>
              </header>
              <h3 className="aiop-substrate-map__col-title">
                {columns.substrate.title}
              </h3>
              <p className="ail-substrate-map__col-caption">
                {columns.substrate.caption}
              </p>

              {/* Knowledge graph ontology line — same `.ail-ontology-line`
                  pattern the canonical homepage uses inside Trusted
                  Sources, moved here so the KG sits alongside the
                  qualitative substrate rows. */}
              <p className="ail-ontology-line">
                <span className="ail-ontology-line__kind">
                  {columns.substrate.ontology.kind}
                </span>
                <span className="ail-ontology-line__objects">
                  {columns.substrate.ontology.objects.join(" · ")}
                </span>
              </p>

              {/* Claude Skills ontology line — parallel to the KG line
                  above. Names the artifact that holds the substrate so
                  the dark RULES / EXAMPLES / VOICE / LOOPS slab below
                  reads as the anatomy of one Skill, not as an
                  abstract concept. Connects this card back to the
                  Skills donut above. */}
              <p className="ail-ontology-line ail-ontology-line--skills">
                <span className="ail-ontology-line__kind">
                  {columns.substrate.skills.kind}
                </span>
                <span className="ail-ontology-line__objects">
                  {columns.substrate.skills.description}
                </span>
              </p>

              <ul className="aiop-substrate-map__rows" role="list">
                {columns.substrate.items.map((item) => (
                  <li key={item.tag} className="aiop-substrate-map__row">
                    <span className="aiop-substrate-map__row-tag">
                      {item.tag}
                    </span>
                    <span className="aiop-substrate-map__row-name">
                      {item.name}
                    </span>
                  </li>
                ))}
              </ul>
              <ul className="aiop-substrate-map__chips" role="list">
                {columns.substrate.tags.map((t) => (
                  <li key={t} className="aiop-substrate-map__chip">
                    {t}
                  </li>
                ))}
              </ul>
            </article>

            {/* Column 03 — Headless surfaces */}
            <article className="aiop-substrate-map__col aiop-substrate-map__col--surfaces">
              <header className="aiop-substrate-map__col-head">
                <span className="aiop-substrate-map__col-n">
                  {columns.surfaces.n} · {columns.surfaces.kicker}
                </span>
              </header>
              <h3 className="aiop-substrate-map__col-title">
                {columns.surfaces.title}
              </h3>
              <p className="ail-substrate-map__col-caption">
                {columns.surfaces.caption}
              </p>
              <ul className="aiop-substrate-map__surfaces" role="list">
                {columns.surfaces.items.map((s) => (
                  <li key={s.name} className="aiop-substrate-map__surface">
                    <span
                      className="aiop-substrate-map__surface-icon"
                      aria-hidden="true"
                    >
                      {s.icon}
                    </span>
                    <span className="aiop-substrate-map__surface-name">
                      {s.name}
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          </div>

          {/* When a footer is passed (claude-adoption page), it replaces
              the closing strip — the ownership tracks take over as the
              card's visual closer so we don't end up with two
              consecutive sign-off lines. Pages that don't pass a
              footer (v3) still get the canonical closing. */}
          {footer ? footer : (
            <p className="ail-substrate-map__closing">{closing}</p>
          )}
        </div>
      </div>
    </section>
  );
}
