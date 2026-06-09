/*
 * Creative AI Workshop · Navigate interstitial.
 *
 * Sibling of `EncodingInterstitial` (encode) and `SoftwareForFew`
 * (build): a chapter-opener that introduces a flywheel phase with
 * text on the left and a simplified card on the right.
 *
 * This one opens the **Navigate** chapter after the flywheel orbit
 * (`#vision`). It carries the line the previous static divider held
 * ("Why you can't treat AI like normal software.") and pairs it
 * with a three-row card naming the invariant properties of AI as
 * an intelligence — trained on us yet alien, geometric, always
 * generating — so the next two beats (ToolCollabSpectrum + Evans)
 * land as the depth treatment of those properties.
 *
 * Visual chrome reuses the same `.aiop-engine-pattern__bleed`
 * gradient (violet -> sage atmospheric tint) that the previous
 * centered divider used, so the chapter break still sits in the
 * familiar atmospheric family from the homepage's receipts
 * carousel. The 2-col layout is scoped via `.aiop-navigate*`
 * classes in `creative-ai-workshop.css`, which mirror
 * `.aiop-encoding*` layout but tint to the Navigate lane (gold in
 * `tf-light`).
 *
 * Static, server component — no parallax, no scroll hooks. The
 * section sits between two pinned/animated chapters (the flywheel
 * orbit above and the Claude getting-started zone below) and reads
 * cleanest as a calm landing beat.
 */

const NAVIGATE_COPY = {
  phase: "Navigate",
  /* Same line the previous static divider held, recomposed here as
     a 2-col interstitial heading. Em wraps the operative phrase so
     the title types-as-pivot the way the Encode and Build titles
     do. */
  title: "Why you can\u2019t treat AI like",
  titleEm: "normal software.",
  body: "AI gets sold as software. It isn\u2019t. It\u2019s the first intelligence you can use as a tool and work with like a colleague, often both at once. Learning to work with it is its own skill, and it comes before anything compounds.",
  rows: [
    {
      id: "alien",
      label: "Alien",
      detail:
        "Trained on everything we\u2019ve written, but it doesn\u2019t reason like we do. The surface feels familiar; the process underneath isn\u2019t.",
      tag: "TRAINED ON US",
    },
    {
      id: "geometric",
      label: "Geometric",
      detail:
        "It turns meaning into geometry, so how you frame a request shifts the output more than what you literally ask.",
      tag: "FRAMING",
      highlight: true,
    },
    {
      id: "generative",
      label: "Generative",
      detail:
        "It always generates. Insight and fabrication can sound identical, so your judgment rides on top.",
      tag: "VERIFY",
    },
  ],
} as const;

export function NavigateInterstitial() {
  return (
    <section
      className="aiop-section aiop-engine-pattern aiop-navigate"
      id="engine-question"
      aria-labelledby="aiop-navigate-title"
      aria-label="Why you can't treat AI like normal software — Navigate"
    >
      <div className="aiop-engine-pattern__bleed" aria-hidden="true">
        <span className="aiop-engine-pattern__wash aiop-engine-pattern__wash--a" />
        <span className="aiop-engine-pattern__wash aiop-engine-pattern__wash--b" />
        <span className="aiop-engine-pattern__grid" />
      </div>

      <div className="aiop-wrap aiop-navigate__inner">
        <div className="aiop-navigate__copy aiop-reveal">
          {/* Phase pill — names the flywheel motion this chapter opens.
              Mirrors the Encode and Build interstitials' eyebrow so the
              three pills read as a matched set. */}
          <span className="aiop-navigate__phase" aria-label="Flywheel phase">
            <span className="aiop-term-pill aiop-term-pill--navigate">
              <span className="aiop-term-pill__dot" aria-hidden="true" />
              {NAVIGATE_COPY.phase}
            </span>
          </span>
          <h2
            className="aiop-section-title aiop-navigate__title"
            id="aiop-navigate-title"
          >
            {NAVIGATE_COPY.title}{" "}
            <em className="aiop-navigate__title-em">
              {NAVIGATE_COPY.titleEm}
            </em>
          </h2>
          <p className="aiop-navigate__body">{NAVIGATE_COPY.body}</p>
        </div>

        <div className="aiop-navigate__card aiop-reveal" role="presentation">
          <ul className="aiop-navigate__rows" role="list">
            {NAVIGATE_COPY.rows.map((row) => (
              <li
                key={row.id}
                className={`aiop-navigate__row${
                  "highlight" in row && row.highlight
                    ? " aiop-navigate__row--highlight"
                    : ""
                }`}
              >
                <span className="aiop-navigate__row-label">{row.label}</span>
                <span className="aiop-navigate__row-detail">{row.detail}</span>
                <span className="aiop-navigate__row-tag">{row.tag}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
