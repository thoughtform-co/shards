import { productionSection, productionTools } from "@/content/process";

export function Production() {
  return (
    <section className="section" id="production">
      <div className="wrap">
        <header className="section-head reveal">
          <p className={`eyebrow eyebrow--${productionSection.eyebrowTone}`}>
            {productionSection.eyebrow}
          </p>
          <h2 className="section-title">
            {productionSection.title} <em>{productionSection.titleEm}</em>
          </h2>
          <p className="section-intro">{productionSection.lede}</p>
        </header>

        <div className="tools-matrix reveal" role="table" aria-label="Loop production tools">
          {productionTools.map((tool) => (
            <div className="tool-row" key={tool.id} role="row">
              <div className="tool-row__name" role="rowheader">
                {renderToolName(tool.name)}
              </div>
              <div className={`tool-row__tier tool-row__tier--${tool.tier}`} role="cell">
                {tool.tier}
              </div>
              <div className="tool-row__function" role="cell">
                {tool.function}
              </div>
              <div className="tool-row__surface" role="cell">
                {tool.surface}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function renderToolName(name: string) {
  // Split on case boundary so display fonts can vary the second syllable.
  const match = name.match(/^([A-Z][a-zà-ÿ]+)(.*)$/);
  if (!match) return name;
  const [, head, tail] = match;
  return (
    <>
      {head}
      {tail ? <em>{tail}</em> : null}
    </>
  );
}
