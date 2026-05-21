export type HeroData = {
  eyebrow: string;
  titlePre: string;
  titlePost?: string;
  titleEm: string;
  lede: string;
  meta: { key: string; value: string }[];
};

/**
 * Generic hero used as the opening slide on the vision and process pages.
 *
 * The pre/post/em pattern lets headlines break naturally across two lines:
 *   {titlePre}<br />{titlePost} <em>{titleEm}</em>
 *
 * Pages that only want a single-line headline can omit `titlePost`.
 */
export function Hero({ data, id }: { data: HeroData; id?: string }) {
  return (
    <section className="hero" id={id}>
      <div className="wrap">
        <p className="eyebrow reveal">{data.eyebrow}</p>
        <h1 className="reveal">
          {data.titlePre}
          {data.titlePost ? (
            <>
              <br />
              {data.titlePost}{" "}
            </>
          ) : (
            " "
          )}
          <em>{data.titleEm}</em>
        </h1>
        <p className="hero-lede reveal">{data.lede}</p>

        <dl className="hero-meta reveal">
          {data.meta.map((cell) => (
            <div key={cell.key} className="hero-meta__cell">
              <dt>{cell.key}</dt>
              <dd>
                <b>{cell.value}</b>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
