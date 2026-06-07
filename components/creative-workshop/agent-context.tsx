/*
 * Creative AI Workshop · Agent expectations / context.
 *
 * Sets the room before the diagnosis: everyone wants an agent;
 * agents fail because the model has not learned how the team
 * works; the missing layer is encoded judgment.
 *
 * Renders as a small editorial reading-room with three
 * news-flash style cards (kicker, headline, dek, source line)
 * and a closing reframe sentence. Source slugs and bylines are
 * placeholders; real articles drop in later.
 *
 * Server component.
 */

type ContextCard = {
  id: string;
  kicker: string;
  headline: string;
  dek: string;
  source: string;
  date: string;
  tone: "alert" | "neutral" | "ground";
};

const CARDS: readonly ContextCard[] = [
  {
    id: "hype",
    kicker: "Hype \u00b7 the agent rush",
    headline: "Every team wants an agent. Most don\u2019t know where to start.",
    dek: "Boards put \u201cAI agents\u201d on roadmaps without naming a workflow. Procurement and IT field requests for tools no one has briefed. The starting condition is FOMO, not problem definition.",
    source: "Industry signal",
    date: "Q2 2026",
    tone: "alert",
  },
  {
    id: "miss-context",
    kicker: "Reality \u00b7 the gap",
    headline: "Pilots fail because the model never learned the work.",
    dek: "Same pattern across early agent rollouts: clean enough on a demo, brittle on the third real task. The model is generic, the work isn\u2019t. Without encoded judgment, the agent flattens to the average.",
    source: "Field reports",
    date: "ongoing",
    tone: "neutral",
  },
  {
    id: "missing-layer",
    kicker: "The reframe",
    headline: "The thing missing isn\u2019t the model. It\u2019s the layer.",
    dek: "An intelligence layer carries the rules, examples, and decision patterns that make a team\u2019s output theirs. Trusted sources at the bottom, encoded substrate in the middle, headless surfaces on top. Agents inherit it.",
    source: "Thoughtform",
    date: "the practice",
    tone: "ground",
  },
];

export function AgentContext() {
  return (
    <section
      className="aiop-section cw-context"
      id="agent-context"
      aria-label="The room: agent expectations and the missing layer"
    >
      <div className="aiop-wrap cw-context__inner">
        <header className="cw-context__head aiop-reveal">
          <span className="cw-context__eyebrow">Context</span>
          <h2 className="cw-context__title">
            Everyone wants an agent. <em>Most miss the layer.</em>
          </h2>
          <p className="cw-context__sub">
            The room you are in: hype on one side, brittle pilots on the
            other. Three readouts, then we name what is actually missing.
          </p>
        </header>

        <ol className="cw-context__cards aiop-reveal" role="list">
          {CARDS.map((card) => (
            <li
              key={card.id}
              className={`cw-context__card cw-context__card--${card.tone}`}
            >
              <span className="cw-context__kicker">{card.kicker}</span>
              <h3 className="cw-context__card-headline">{card.headline}</h3>
              <p className="cw-context__card-dek">{card.dek}</p>
              <div className="cw-context__byline">
                <span>{card.source}</span>
                <span className="cw-context__byline-sep">&middot;</span>
                <span>{card.date}</span>
              </div>
            </li>
          ))}
        </ol>

        <p className="cw-context__close aiop-reveal">
          The workshop sits exactly here. We meet the room, then we hand off
          to the <em>solution and the method</em>: an intelligence layer,
          built one team at a time.
        </p>
      </div>
    </section>
  );
}
