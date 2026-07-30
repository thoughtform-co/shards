import Image from "next/image";

/*
 * /plopsa-ai-workshop — "Semantic editing, in practice."
 *
 * Follows the tools comparison and shows what the high-control
 * category is actually for: two worked examples from Vince's own
 * output, each named by the job it does rather than by the prompt
 * that made it.
 *
 * Same construction as ToolChoiceSection — the shared
 * `cw-keynote-proof` head plus the `__grid--pair` two-up from
 * plopsa-workshop.css §6 — but under an `--examples` modifier, so it
 * does NOT pick up the `--tools` 2/3 frame override and keeps the
 * shared 4/5 card frame. That is deliberate: these two sources are
 * 4:5 and 3:4, so 4/5 fits the first exactly and trims ~6% off the
 * second, and the differing frame ratio keeps two consecutive
 * two-up grids from reading as the same slide twice. No new CSS.
 *
 * Note on the second image: it is an identifiable person from client
 * work, so the filename and alt text describe the technique rather
 * than naming them.
 */

type ExampleCard = {
  id: string;
  technique: string;
  does: string;
  instead: string;
  src: string;
  alt: string;
};

const EXAMPLE_CARDS: readonly ExampleCard[] = [
  {
    id: "complex-composition",
    technique: "Complex composition",
    does: "Builds a staged scene — set, cast, props and type — in a single frame",
    instead: "A build, a shoot and a layout pass",
    src: "/plopsa-ai-workshop/semantic-complex-composition.jpg",
    alt: "A workshop poster: a miniature stone chamber where a figure raises both hands beneath a glowing orange sunburst, students seated around with laptops, with the title set over the scene.",
  },
  {
    id: "relighting",
    technique: "Relighting",
    does: "Rebuilds the light on a frame that already exists, leaving the subject intact",
    instead: "A reshoot, or an hour of dodge and burn",
    src: "/plopsa-ai-workshop/semantic-relighting.jpg",
    alt: "A portrait against a warm neutral wall, lit by a hard-edged shaft of daylight falling behind the subject.",
  },
];

export function SemanticExamplesSection() {
  return (
    <section
      className="aiop-section cw-keynote-proof cw-keynote-proof--examples"
      id="semantic-examples"
      aria-labelledby="cw-keynote-examples-title"
      aria-label="Semantic editing, in practice"
    >
      <div className="aiop-wrap cw-keynote-proof__inner">
        <header className="cw-keynote-proof__head aiop-reveal">
          <span className="cw-keynote-proof__eyebrow">Worked examples</span>
          <div className="cw-keynote-proof__head-cols">
            <h2
              className="cw-keynote-proof__title"
              id="cw-keynote-examples-title"
            >
              Semantic editing, <em>in practice</em>.
            </h2>
            <p className="cw-keynote-proof__body">
              Semantic editing means you describe the change instead of
              selecting it — no masks, no layers, no lasso. Two jobs it
              handles unusually well: assembling a composition that would
              otherwise cost a studio day, and fixing light that was wrong
              when the shutter closed.
            </p>
          </div>
        </header>

        <ul className="cw-keynote-proof__grid cw-keynote-proof__grid--pair aiop-reveal">
          {EXAMPLE_CARDS.map((example) => (
            <li className="cw-keynote-proof__card" key={example.id}>
              <div className="cw-keynote-proof__card-frame">
                <Image
                  className="cw-keynote-proof__card-img"
                  src={example.src}
                  alt={example.alt}
                  fill
                  sizes="(min-width: 980px) 420px, (min-width: 640px) 45vw, 90vw"
                />
              </div>
              <dl className="cw-keynote-proof__card-stats">
                <div className="cw-keynote-proof__card-row cw-keynote-proof__card-row--accent">
                  <dt>Technique</dt>
                  <dd>{example.technique}</dd>
                </div>
                <div className="cw-keynote-proof__card-row">
                  <dt>What it does</dt>
                  <dd>{example.does}</dd>
                </div>
                <div className="cw-keynote-proof__card-row">
                  <dt>Instead of</dt>
                  <dd>{example.instead}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
