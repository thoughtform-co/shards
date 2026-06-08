export function WorkshopSection() {
  return (
    <section className="aiop-section cw-vs cw-vs--close">
      <div className="aiop-wrap cw-vs__inner">
        <p className="cw-vs__close">
          AI as a <em>speed layer</em> on footage and assets you already have —
          not generative video from scratch. Keep both skills installed so
          agents can author new templates that drop into the gallery.
        </p>

        <dl className="cw-vs__meta">
          <div className="cw-vs__meta-row">
            <dt>Install skills</dt>
            <dd>
              HyperFrames:{" "}
              <code>npx skills add heygen-com/hyperframes</code>
            </dd>
          </div>
          <div className="cw-vs__meta-row">
            <dt>Install skills</dt>
            <dd>
              Remotion: <code>remotion-dev/skills</code>
            </dd>
          </div>
          <div className="cw-vs__meta-row">
            <dt>Lint</dt>
            <dd>
              <code>npx hyperframes lint</code> before render
            </dd>
          </div>
          <div className="cw-vs__meta-row">
            <dt>Agent loop</dt>
            <dd>Templatize best output — swap variables at render time</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
