type VideoStudioHeroProps = {
  routerSummary: string;
};

export function VideoStudioHero({ routerSummary }: VideoStudioHeroProps) {
  return (
    <section className="aiop-section cw-vs cw-vs--hero">
      <div className="aiop-wrap cw-vs__inner">
        <div className="cw-vs__head">
          <p className="cw-vs__eyebrow">Creative production</p>
          <h1 className="cw-vs__title">
            Video <em>Studio</em>
          </h1>
          <p className="cw-vs__sub">
            Pick a template, fill variables or upload footage, preview live, then
            render to MP4 on the machine running{" "}
            <code>npm run dev</code>. The router keeps both Remotion and
            HyperFrames installed — choose per job, not per team.
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
