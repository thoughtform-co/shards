import {
  layerDataSources,
  layerInputs,
  layerPromises,
  layerSection,
  layerStrata,
  layerTools,
} from "@/content/aether";

/**
 * The layer — data sources → encoded substrate → AI tools + interfaces.
 *
 * One artefact, three regions. The dark substrate panel is the only
 * dominant object on the page; the two flanks are quiet rails of
 * named chips so the reader recognises their own data systems and AI
 * tools without those rails competing with the substrate.
 *
 *   Left flank  — Data sources (Snowflake, ThoughtSpot, Meta Ads,
 *                 Monday, Frontify, Notion). Stays where it is.
 *   Centre      — Aether substrate. Rules, examples, sources, loops.
 *                 A small "what gets encoded" rail names the team
 *                 expertise that becomes substrate.
 *   Right flank — AI tools + interfaces (Claude, Copilot, Slack,
 *                 agents, workflows, dashboards). Inherit the same
 *                 expertise.
 *
 * A three-column promise row at the foot (captured, owned, portable)
 * frames what the substrate gives back.
 */
export function Substrate() {
  return (
    <section className="section" id="layer">
      <div className="wrap">
        <header className="section-head reveal">
          <p className="eyebrow">{layerSection.eyebrow}</p>
          <h2 className="section-title">
            {layerSection.title} <em>{layerSection.titleEm}</em>
          </h2>
          <p className="section-intro">{layerSection.lede}</p>
        </header>

        <div className="layer-flow reveal">
          <header className="layer-flow__head">
            <span className="layer-flow__head-l">{layerSection.flowHeader}</span>
            <span className="layer-flow__head-r">{layerSection.flowVersion}</span>
          </header>

          <div className="layer-flow__grid">
            <div className="layer-flow__col layer-flow__col--flank">
              <p className="layer-flow__col-h">{layerSection.dataHeading}</p>
              <ul className="layer-flow__chips" role="list" data-reveal-stack>
                {layerDataSources.map((chip) => (
                  <li
                    key={chip.id}
                    className={`layer-chip layer-chip--${chip.tone} reveal`}
                  >
                    {chip.label}
                  </li>
                ))}
              </ul>
              <p className="layer-flow__col-note">{layerSection.dataNote}</p>
            </div>

            <div className="layer-flow__connector" aria-hidden="true">
              <span className="layer-flow__connector-line" />
            </div>

            <div className="layer-flow__col layer-flow__col--centre">
              <p className="layer-flow__col-h">{layerSection.substrateHeading}</p>
              <div className="layer-stack">
                <header className="layer-stack__head">
                  <strong>{layerSection.substrateTitle}</strong>
                  <span>{layerSection.substrateBadge}</span>
                </header>
                <ul className="layer-stack__rows" role="list" data-reveal-stack>
                  {layerStrata.map((stratum) => (
                    <li
                      key={stratum.id}
                      className={`layer-stack__row layer-stack__row--${stratum.id} reveal`}
                    >
                      <span className="layer-stack__tag">{stratum.tag}</span>
                      <span className="layer-stack__name">{stratum.name}</span>
                      <span className="layer-stack__meta">{stratum.meta}</span>
                    </li>
                  ))}
                </ul>
                <div className="layer-stack__inputs" aria-label={layerSection.inputsHeading}>
                  <p className="layer-stack__inputs-h">{layerSection.inputsHeading}</p>
                  <ul className="layer-stack__inputs-list" role="list">
                    {layerInputs.map((input) => (
                      <li
                        key={input.id}
                        className={`layer-stack__input layer-stack__input--${input.tone}`}
                      >
                        <span
                          className="layer-stack__input-dot"
                          aria-hidden="true"
                        />
                        {input.label}
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="layer-stack__connects">
                  {layerSection.connectsCaption}
                </p>
              </div>
            </div>

            <div className="layer-flow__connector" aria-hidden="true">
              <span className="layer-flow__connector-line" />
            </div>

            <div className="layer-flow__col layer-flow__col--flank">
              <p className="layer-flow__col-h">{layerSection.toolsHeading}</p>
              <ul className="layer-flow__chips" role="list" data-reveal-stack>
                {layerTools.map((chip) => (
                  <li
                    key={chip.id}
                    className={`layer-chip layer-chip--${chip.tone} reveal`}
                  >
                    {chip.label}
                  </li>
                ))}
              </ul>
              <p className="layer-flow__col-note">{layerSection.toolsNote}</p>
            </div>
          </div>

          <ul className="layer-flow__foot" role="list" data-reveal-stack>
            {layerPromises.map((promise) => (
              <li key={promise.id} className="layer-promise reveal">
                <strong>{promise.title}</strong>
                <span>{promise.body}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
