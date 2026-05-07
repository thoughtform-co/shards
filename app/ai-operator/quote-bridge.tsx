import { quoteBridgeSection } from "./content";

/*
 * QuoteBridge — interstitial between the hero and the Navigate / Encode /
 * Build flywheel.
 *
 * Anchors the framework to a credible outside diagnosis (Benedict Evans
 * on the asking gap), then breaks his sentence into the three challenges
 * folded inside it. Each segment of the line carries a faint colour tint
 * matching the pill that sits directly beneath it, so the reader sees
 * the vocabulary land before the orbit names it a viewport later.
 *
 * Pure presentation — no scroll handler, no client state. The entry
 * fade is handled by the page-level `ScrollReveal` via the `aiop-reveal`
 * class. Reduced-motion preferences are honoured there in a single
 * place rather than re-implemented per-component.
 */
export function QuoteBridge() {
  return (
    <section
      className="aiop-section aiop-bridge"
      id="bridge"
      aria-labelledby="aiop-bridge-quote"
    >
      <div className="aiop-bridge__bleed" aria-hidden="true">
        <span className="aiop-bridge__wash aiop-bridge__wash--a" />
        <span className="aiop-bridge__wash aiop-bridge__wash--b" />
        <span className="aiop-bridge__wash aiop-bridge__wash--c" />
        <span className="aiop-bridge__grid" />
      </div>

      <div className="aiop-wrap aiop-bridge__inner">
        <figure className="aiop-bridge__quote aiop-reveal">
          <p className="aiop-eyebrow">{quoteBridgeSection.eyebrow}</p>
          <blockquote
            id="aiop-bridge-quote"
            className="aiop-bridge__pull"
          >
            <span className="aiop-bridge__pull-mark" aria-hidden="true">
              &ldquo;
            </span>
            <span className="aiop-bridge__pull-text">
              {quoteBridgeSection.quote}
            </span>
          </blockquote>
          <figcaption className="aiop-bridge__attrib">
            <span className="aiop-bridge__attrib-rule" aria-hidden="true" />
            <span className="aiop-bridge__attrib-name">
              {quoteBridgeSection.attribName}
            </span>
            <span className="aiop-bridge__attrib-meta">
              {quoteBridgeSection.attribMeta}
            </span>
          </figcaption>
        </figure>

        <p className="aiop-bridge__intro aiop-reveal">
          {quoteBridgeSection.intro}
        </p>

        <ul className="aiop-bridge__line aiop-reveal" role="list">
          {quoteBridgeSection.rows.map((row) => (
            <li
              key={row.id}
              className={`aiop-bridge__seg aiop-bridge__seg--${row.id}`}
            >
              <span className="aiop-bridge__seg-text">{row.phrase}</span>
              <span className="aiop-bridge__pill">
                <span className="aiop-bridge__pill-dot" aria-hidden="true" />
                <span className="aiop-bridge__pill-name">{row.pill}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
