import Image from "next/image";

import {
  fdSpectrumBands,
  fdSpectrumFoot,
  fdSpectrumHead,
  fdSpectrumStudioAds,
  type FdSpectrumBand,
} from "@/content/forward-deployed";

/*
 * Forward-deployed pitch · the full spectrum.
 *
 * Answers the implicit VC question "what do you actually do?" by
 * naming three bands in one section and proving the Production band
 * with the same ROAS ads + ATL film the keynote uses. The other two
 * bands carry the headline stats so the page does not need a
 * separate "cases" carousel before the substrate map.
 *
 * Layout:
 *   - Section head: title + sub.
 *   - 01 Production · band header, three stats, three studio ads
 *     (paid-out cuts with ROAS), and the world-first AI ATL video.
 *   - 02 Adoption · band header, three stats, prose note.
 *   - 03 Automation · band header, three stats, prose note.
 *   - Section foot: single-line spectrum thesis.
 *
 * Server component.
 */
export function SpectrumProof() {
  return (
    <section
      className="aiop-section fd-spectrum"
      id="spectrum"
      aria-labelledby="fd-spectrum-title"
      aria-label="The full spectrum: production, adoption, automation"
    >
      <div className="aiop-wrap fd-spectrum__inner">
        <header className="fd-spectrum__head aiop-reveal">
          <span className="fd-spectrum__eyebrow">
            {fdSpectrumHead.eyebrow}
          </span>
          <h2 className="fd-spectrum__title" id="fd-spectrum-title">
            {fdSpectrumHead.title} <em>{fdSpectrumHead.titleEm}</em>
          </h2>
          <p className="fd-spectrum__sub">{fdSpectrumHead.sub}</p>
        </header>

        <ol className="fd-spectrum__bands" role="list">
          {fdSpectrumBands.map((band) => (
            <Band key={band.id} band={band} />
          ))}
        </ol>

        <p className="fd-spectrum__foot aiop-reveal">{fdSpectrumFoot}</p>
      </div>
    </section>
  );
}

function Band({ band }: { band: FdSpectrumBand }) {
  return (
    <li
      className={`fd-band fd-band--${band.id} fd-band--tone-${band.tone} aiop-reveal`}
      aria-labelledby={`fd-band-${band.id}-title`}
    >
      <header className="fd-band__head">
        <span className="fd-band__tag">
          <span className="fd-band__dot" aria-hidden="true" />
          {band.tag}
        </span>
        <div className="fd-band__head-text">
          <h3 className="fd-band__title" id={`fd-band-${band.id}-title`}>
            {band.title}
          </h3>
          <p className="fd-band__body">{band.body}</p>
        </div>
      </header>

      <dl
        className="fd-band__stats"
        aria-label={`${band.tag} headline stats`}
      >
        {band.stats.map((stat) => (
          <div className="fd-band__stat" key={stat.label}>
            <dt className="fd-band__stat-value">{stat.value}</dt>
            <dd className="fd-band__stat-label">{stat.label}</dd>
          </div>
        ))}
      </dl>

      {band.id === "production" ? <ProductionEvidence /> : null}

      <p className="fd-band__note">{band.note}</p>
    </li>
  );
}

/*
 * Production-band evidence panel.
 *
 * Two surfaces in one block: the three paid-out studio ads on the
 * left (mirrors the `cw-keynote-proof__grid` shape from
 * `keynote-proof-sections.tsx` but reuses the new `fd-evidence-*`
 * classes so the pitch route does not depend on keynote chrome) and
 * the world-first AI ATL film on the right. The film carries an
 * explicit figcaption naming the campaign for screen-reader users.
 */
function ProductionEvidence() {
  return (
    <div className="fd-evidence" aria-label="Production proof: paid-out AI cuts and the world-first AI above-the-line film">
      <div className="fd-evidence__col fd-evidence__col--ads">
        <p className="fd-evidence__label">
          <span className="fd-evidence__label-dot" aria-hidden="true" />
          Three recent cuts, all paid out
        </p>
        <ul className="fd-evidence__ads" role="list">
          {fdSpectrumStudioAds.map((ad) => (
            <li className="fd-evidence__ad" key={ad.id}>
              <div className="fd-evidence__ad-frame">
                <Image
                  className="fd-evidence__ad-img"
                  src={ad.src}
                  alt={ad.alt}
                  fill
                  sizes="(min-width: 980px) 220px, (min-width: 640px) 40vw, 90vw"
                />
              </div>
              <dl className="fd-evidence__ad-stats">
                <div className="fd-evidence__ad-row">
                  <dt>SKU</dt>
                  <dd>{ad.sku}</dd>
                </div>
                <div className="fd-evidence__ad-row">
                  <dt>Spend</dt>
                  <dd>{ad.spend}</dd>
                </div>
                <div className="fd-evidence__ad-row">
                  <dt>Order value</dt>
                  <dd>{ad.orderValue}</dd>
                </div>
                <div className="fd-evidence__ad-row fd-evidence__ad-row--accent">
                  <dt>ROAS</dt>
                  <dd>{ad.roas}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>
        <p className="fd-evidence__foot">
          AI visuals, AI-assisted copy, in-house production. ROAS measured against the Loop performance benchmark.
        </p>
      </div>

      <figure className="fd-evidence__film">
        <p className="fd-evidence__label">
          <span className="fd-evidence__label-dot" aria-hidden="true" />
          World-first AI above-the-line film
        </p>
        <div className="fd-evidence__film-player">
          <video
            className="fd-evidence__film-video"
            controls
            preload="metadata"
            playsInline
            aria-label="Smug Owl - Loop AI ATL film"
          >
            <source
              src="/videos/loop-smug-owl-ai-atl.mp4"
              type="video/mp4"
            />
            Your browser does not support embedded video. Download the file:{" "}
            <a href="/videos/loop-smug-owl-ai-atl.mp4" download>
              loop-smug-owl-ai-atl.mp4
            </a>
            .
          </video>
        </div>
        <figcaption className="fd-evidence__film-caption">
          <span className="fd-evidence__film-caption-label">
            Smug Owl &middot; Loop ATL
          </span>
          <span className="fd-evidence__film-caption-meta">
            16:9 master &middot; 30 sec &middot; Sept 2025
          </span>
        </figcaption>
      </figure>
    </div>
  );
}
