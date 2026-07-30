import Image from "next/image";

/*
 * /plopsa-ai-workshop — "Which AI tools to use?"
 *
 * Closing beat: the model landscape reduced to the only distinction
 * that changes how you work — atmosphere versus control. Two cards,
 * one example image each, both from Vince's own output so the claim
 * is shown rather than asserted.
 *
 * Built on the `cw-keynote-proof` head + `__grid`/`__card` pattern
 * from keynote-proof-sections.tsx (the --studio variant's ad grid),
 * under a `--tools` modifier. Those modifiers carry no CSS of their
 * own, so the head, cards, frames and stat rows come for free. Two
 * scoped overrides live in plopsa-workshop.css §6: the grid drops from
 * three columns to two, and the frame goes from 4/5 to 2/3 because
 * both images are portrait 2:3 and the shared ratio would crop them.
 */

type ToolCard = {
  id: string;
  model: string;
  bestFor: string;
  control: string;
  src: string;
  alt: string;
};

const TOOL_CARDS: readonly ToolCard[] = [
  {
    id: "midjourney",
    model: "Midjourney",
    bestFor: "Atmosphere, mood, art direction",
    control: "Low — you steer toward a feeling",
    src: "/plopsa-ai-workshop/midjourney-atmosphere.jpg",
    alt: "A rust-toned portrait of a helmeted figure haloed by a ring of light, printed and mounted on a brick wall.",
  },
  {
    id: "nano-banana",
    model: "Nano Banana · GPT Image",
    bestFor: "Semantic editing, photorealism, composition",
    control: "High — name the change, keep the frame",
    src: "/plopsa-ai-workshop/nano-banana-composite.jpg",
    alt: "A photorealistic composite: EV chargers at street level above a cutaway mine shaft where workers in hard hats stand on timber scaffolding.",
  },
];

export function ToolChoiceSection() {
  return (
    <section
      className="aiop-section cw-keynote-proof cw-keynote-proof--tools"
      id="which-tools"
      aria-labelledby="cw-keynote-tools-title"
      aria-label="Which AI tools to use?"
    >
      <div className="aiop-wrap cw-keynote-proof__inner">
        <header className="cw-keynote-proof__head aiop-reveal">
          <span className="cw-keynote-proof__eyebrow">
            Two categories, not twenty
          </span>
          <div className="cw-keynote-proof__head-cols">
            <h2
              className="cw-keynote-proof__title"
              id="cw-keynote-tools-title"
            >
              Which <em>AI tools</em> to use?
            </h2>
            <p className="cw-keynote-proof__body">
              The list of image models is long and it turns over every few
              months. In practice it collapses into two categories: one you
              reach for when you want atmosphere, and one you reach for when
              you want control. Knowing which of the two a job calls for is
              most of the skill.
            </p>
          </div>
        </header>

        <ul className="cw-keynote-proof__grid cw-keynote-proof__grid--pair aiop-reveal">
          {TOOL_CARDS.map((tool) => (
            <li className="cw-keynote-proof__card" key={tool.id}>
              <div className="cw-keynote-proof__card-frame">
                <Image
                  className="cw-keynote-proof__card-img"
                  src={tool.src}
                  alt={tool.alt}
                  fill
                  sizes="(min-width: 980px) 420px, (min-width: 640px) 45vw, 90vw"
                />
              </div>
              <dl className="cw-keynote-proof__card-stats">
                <div className="cw-keynote-proof__card-row cw-keynote-proof__card-row--accent">
                  <dt>Model</dt>
                  <dd>{tool.model}</dd>
                </div>
                <div className="cw-keynote-proof__card-row">
                  <dt>Best for</dt>
                  <dd>{tool.bestFor}</dd>
                </div>
                <div className="cw-keynote-proof__card-row">
                  <dt>Control</dt>
                  <dd>{tool.control}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
