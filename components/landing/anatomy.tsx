import { anatomyPieces, anatomySection } from "@/content/process";

/**
 * Anatomy of a Skill.
 *
 * Four-up grid that makes the substrate inspectable: rules, examples,
 * sources, review. Each card carries a tiny code-style snippet so the
 * piece reads like an artifact, not a marketing point. Inspired by the
 * "what's a skill" block in the substrate reference, restated in Loop's
 * voice.
 */
export function Anatomy() {
  return (
    <section className="section" id="anatomy">
      <div className="wrap">
        <header className="section-head reveal">
          <p className={`eyebrow eyebrow--${anatomySection.eyebrowTone}`}>
            {anatomySection.eyebrow}
          </p>
          <h2 className="section-title">
            {anatomySection.title} <em>{anatomySection.titleEm}</em>
          </h2>
          <p className="section-intro">{anatomySection.lede}</p>
        </header>

        <div className="anatomy-grid reveal">
          {anatomyPieces.map((piece) => (
            <article key={piece.id} className="anatomy-card">
              <span className="anatomy-card__num">{piece.number}</span>
              <h3 className="anatomy-card__title">{piece.title}</h3>
              <p className="anatomy-card__body">{piece.body}</p>
              <div className="anatomy-card__snippet">
                {piece.snippet.map((row) => (
                  <div key={row.key} className="anatomy-card__snippet-row">
                    <span className="anatomy-card__snippet-key">{row.key}</span>
                    <span className="anatomy-card__snippet-val">{row.val}</span>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
