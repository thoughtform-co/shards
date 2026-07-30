/*
 * /plopsa-ai-workshop — the two Krea beats.
 *
 * Follows the semantic-editing examples. Everything here is drawn
 * from the two Krea workshops on 30 July 2026, not invented: the
 * model line-up and the markup from Krea Workshop II, the video
 * craft and the cinemagraph recommendation from the Claude session.
 *
 * Both reuse the shared `cw-keynote-proof` head under new modifiers,
 * plus the `__card-stats` / `__card-row` list from the --studio
 * variant for the model table. Modifiers carry no CSS of their own,
 * so this needs none — see plopsa-workshop.css §7 for the one grid
 * variant these share with the take-home section.
 *
 * No images: these are text beats between two image-heavy sections.
 */

type ModelRow = {
  id: string;
  model: string;
  note: string;
};

const VIDEO_MODELS: readonly ModelRow[] = [
  {
    id: "seedance",
    model: "Seedance",
    note: "Best all-round. ByteDance, trained on TikTok and film.",
  },
  {
    id: "veo",
    model: "Veo",
    note: "Strongest on dialogue, and the only EU-approved one.",
  },
  { id: "kling", model: "Kling", note: "Liquids and 3D physics." },
  { id: "sora", model: "Sora", note: "High quality, and priced like it." },
];

const VIDEO_CRAFT: readonly { id: string; heading: string; body: string }[] = [
  {
    id: "shot-by-shot",
    heading: "Work shot by shot",
    body: "Video drifts where images do not — physics, movement, light and continuity all have to hold at once, so hallucinations rise with length. Treat it like a production: storyboard, mood board, then individual shots. Not one prompt for the whole film.",
  },
  {
    id: "transitions",
    heading: "Steal the transitions",
    body: "Give the model a start frame and an end frame and it interpolates between them. That single trick produces transitions that are genuinely hard to build by hand in After Effects, and it is the most useful thing video models currently do.",
  },
  {
    id: "cinemagraphs",
    heading: "Cinemagraphs earn their keep",
    body: "For the parks the reliable win is small: a subtle movement, a logo pulse, a character breathing. Short and contained is where the models are strong — and where a bad generation is cheap to throw away.",
  },
];

const VIDEO_TRAPS: readonly string[] = [
  "Generate at 4K rather than upscaling afterwards. Upscaling predicts the missing pixels, and predicted pixels are invented ones.",
  "Always iterate from the original, never from the last generation. Edits accumulate and faces drift without anyone deciding they should.",
  "Longer prompts and longer clips both raise the hallucination rate. Generate many, then select — do not try to prompt your way to one perfect take.",
  "Budget for the last one percent. It routinely takes longer than the first ninety-nine.",
];

export function KreaModelsSection() {
  return (
    <section
      className="aiop-section cw-keynote-proof cw-keynote-proof--krea"
      id="krea-models"
      aria-labelledby="cw-keynote-krea-title"
      aria-label="Where the video models live"
    >
      <div className="aiop-wrap cw-keynote-proof__inner">
        <header className="cw-keynote-proof__head aiop-reveal">
          <span className="cw-keynote-proof__eyebrow">The tool you log into</span>
          <div className="cw-keynote-proof__head-cols">
            <h2 className="cw-keynote-proof__title" id="cw-keynote-krea-title">
              Krea is a <em>front door</em>.
            </h2>
            <p className="cw-keynote-proof__body">
              Krea is not a model. It is a wrapper over most of them, which is
              exactly why it is convenient — one login, one credit balance, and
              every video model in one place. Worth knowing what sits behind
              it, and what the convenience costs.
            </p>
          </div>
        </header>

        <dl className="cw-keynote-proof__card-stats plopsa-krea__models aiop-reveal">
          {VIDEO_MODELS.map((row) => (
            <div className="cw-keynote-proof__card-row" key={row.id}>
              <dt>{row.model}</dt>
              <dd>{row.note}</dd>
            </div>
          ))}
        </dl>

        {/* Not `cw-keynote-proof__footnote` — that is mono uppercase at
            0.18em tracking, built for a one-line credit, and this is a
            paragraph. */}
        <p className="plopsa-krea__aside aiop-reveal">
          The catch is the markup: Krea resells provider capacity, so a call
          that costs a cent direct can land near five. At workshop volumes that
          is noise. At campaign volumes it is not — one team moving the same
          workload onto the provider APIs went from roughly €10,000 a quarter
          to €400.
        </p>
      </div>
    </section>
  );
}

export function KreaVideoCraftSection() {
  return (
    <section
      className="aiop-section cw-keynote-proof cw-keynote-proof--krea-craft"
      id="krea-video"
      aria-labelledby="cw-keynote-krea-craft-title"
      aria-label="Working with AI video"
    >
      <div className="aiop-wrap cw-keynote-proof__inner">
        <header className="cw-keynote-proof__head aiop-reveal">
          <span className="cw-keynote-proof__eyebrow">Working with video</span>
          <div className="cw-keynote-proof__head-cols">
            <h2
              className="cw-keynote-proof__title"
              id="cw-keynote-krea-craft-title"
            >
              Video is <em>harder</em>.
            </h2>
            <p className="cw-keynote-proof__body">
              Images forgive a vague prompt. Video does not — and the way
              through is not a better prompt but a better process, borrowed
              almost unchanged from how film already gets made.
            </p>
          </div>
        </header>

        {/* Stacked rather than the shared two-column `__card-stats`:
            these descriptions are prose, and that rule right-aligns dd
            with tabular numerals for short metric values. */}
        <dl className="plopsa-krea__craft aiop-reveal">
          {VIDEO_CRAFT.map((item) => (
            <div className="plopsa-krea__craft-row" key={item.id}>
              <dt>{item.heading}</dt>
              <dd>{item.body}</dd>
            </div>
          ))}
        </dl>

        <ul className="plopsa-krea__traps aiop-reveal" role="list">
          {VIDEO_TRAPS.map((trap) => (
            <li key={trap} className="plopsa-krea__trap">
              {trap}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
