import { caNumbersSection } from "@/content/claude-adoption";

import { UsageBars } from "./usage-bars";
import { UsageSparklinePanel } from "./usage-sparkline-panel";

/*
 * Numbers — 2×2 panel layout: sparkline + momentum, connectors + skills.
 */

export function Numbers() {
  const {
    id,
    ariaLabel,
    title,
    titleEm,
    titleAfter,
    sub,
    sparklineViews,
    momentum,
    connectors,
    skillsUsage,
    footnote,
  } = caNumbersSection;

  return (
    <section
      className="aiop-section ca-numbers"
      id={id}
      aria-label={ariaLabel}
    >
      <div className="aiop-wrap">
        <header className="aiop-section-head ca-numbers__head aiop-reveal">
          <h2 className="aiop-section-title">
            {title} <em>{titleEm}</em>
            {titleAfter ?? ""}
          </h2>
          <p className="aiop-section-head__sub">{sub}</p>
        </header>

        <div className="ca-numbers__grid aiop-reveal">
          <div className="ca-numbers__panel ca-numbers__panel--sparkline">
            <UsageSparklinePanel views={sparklineViews} />
          </div>

          <div className="ca-numbers__panel ca-numbers__panel--momentum">
            <header className="ca-numbers__panel-kicker">Workshop momentum</header>
            <ul className="ca-numbers__momentum" role="list">
              {momentum.map((stat) => (
                <li
                  key={stat.id}
                  className={
                    "ca-numbers__momentum-tile" +
                    (stat.featured ? " ca-numbers__momentum-tile--featured" : "")
                  }
                >
                  {/* Value leads, label sits underneath as a caption.
                      Same structure across all tiles so the featured
                      one stands out by gradient + size, not by an
                      inverted layout. `sub` is currently unused but
                      stays in the type for future tile variants. */}
                  <span className="ca-numbers__momentum-value">{stat.value}</span>
                  <span className="ca-numbers__momentum-label">{stat.label}</span>
                  {stat.sub ? (
                    <span className="ca-numbers__momentum-sub">{stat.sub}</span>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>

          <div className="ca-numbers__panel">
            <UsageBars data={connectors} />
          </div>

          <div className="ca-numbers__panel">
            <UsageBars data={skillsUsage} />
          </div>
        </div>

        <p className="ca-numbers__footnote aiop-reveal">{footnote}</p>
      </div>
    </section>
  );
}
