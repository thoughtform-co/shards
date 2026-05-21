import { pageSubstrateMap } from "@/content/intelligence-layer";

/**
 * Substrate map — homepage `aiop-substrate-map` chrome adapted for
 * the intelligence-layer route.
 *
 * Three columns:
 *   1. Trusted sources  — systems of record + the knowledge graph
 *      that turns them into an ontology AI can read. The KG sits as
 *      the last item in the list, deliberately, so the eye reads it
 *      as a refinement of the systems above it.
 *   2. Encoded substrate — rules / examples / voice / loops rows.
 *      Same canonical authority layer the homepage names.
 *   3. Headless surfaces — where the cohort calls the engine.
 *
 * No Navigate / Encode / Build phase pills. Those frame the broader
 * operating model on the homepage; on this route the page IS the
 * layer, not the flywheel that surrounds it.
 *
 * The component renders server-side; no client state.
 */
export function SubstrateMap() {
  const { title, titleEm, body, columns, closing } = pageSubstrateMap;

  return (
    <section
      className="aiop-section aiop-section--soft aiop-substrate-map"
      id="substrate-map"
    >
      <div className="aiop-wrap">
        <header className="aiop-section-head aiop-substrate-map__head aiop-reveal">
          <h2 className="aiop-section-title aiop-substrate-map__title">
            {title} <em>{titleEm}</em>
          </h2>
          <p className="aiop-section-head__sub aiop-substrate-map__lede">
            {body}
          </p>
        </header>

        <div className="aiop-substrate-map__card aiop-reveal">
          <div className="aiop-substrate-map__grid">
            {/* Column 01 — Trusted sources.
                Three quiet pieces: caption (already names the
                ontology), a single-line mono caption naming what the
                knowledge graph holds, and a compact 2-column chip
                grid of the systems of record below. No framed
                sub-card — the column's caption already does the
                naming. */}
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

              <p className="ail-ontology-line">
                <span className="ail-ontology-line__kind">
                  {columns.sources.ontology.kind}
                </span>
                <span className="ail-ontology-line__objects">
                  {columns.sources.ontology.objects.join(" · ")}
                </span>
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

            {/* Column 02 — Encoded substrate */}
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

          {closing ? (
            <p className="ail-substrate-map__closing">{closing}</p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
