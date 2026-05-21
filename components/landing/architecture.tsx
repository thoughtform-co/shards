import { architectureLayers, architectureSection } from "@/content/process";

export function Architecture() {
  return (
    <section className="section" id="architecture">
      <div className="wrap">
        <header className="section-head reveal">
          <p className={`eyebrow eyebrow--${architectureSection.eyebrowTone}`}>
            {architectureSection.eyebrow}
          </p>
          <h2 className="section-title">
            {architectureSection.title} <em>{architectureSection.titleEm}</em>
          </h2>
          <p className="section-intro">{architectureSection.lede}</p>
        </header>

        <div className="arch-stack reveal">
          {architectureLayers.map((layer) => (
            <article key={layer.id} className="arch-layer">
              <div className="arch-layer__num">
                {layer.number}
                <small>{layer.label}</small>
              </div>
              <div>
                <h3 className="arch-layer__title">{layer.title}</h3>
                <p className="arch-layer__body">{layer.body}</p>
                <div className="arch-layer__examples">
                  {layer.examples.map((ex) => (
                    <span key={ex} className="arch-layer__example">
                      {ex}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        <p className="flywheel__close reveal">{architectureSection.close}</p>
      </div>
    </section>
  );
}
