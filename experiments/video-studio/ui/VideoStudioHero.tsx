type VideoStudioHeroProps = {
  routerSummary: string;
};

export function VideoStudioHero({ routerSummary }: VideoStudioHeroProps) {
  return (
    <section className="aiop-section cw-vs cw-vs--hero">
      <div className="aiop-wrap cw-vs__inner">
        <div className="cw-vs__head">
          <p className="cw-vs__eyebrow">Monizze workshop demo</p>
          <h1 className="cw-vs__title">
            Video <em>Studio</em>
          </h1>
          <p className="cw-vs__sub">
            Monizze was asked to make a promo for Centrale des Marchés — the
            first cut missed. This module shows AI across the stack: upload the
            deck, Claude reads slide structure, each section becomes a timed
            scene, preview live in Remotion, render to MP4 locally.
          </p>
          <p className="cw-vs__status">
            <span className="cw-vs__status-dot" aria-hidden="true" />
            {routerSummary}
          </p>
        </div>
      </div>
    </section>
  );
}
