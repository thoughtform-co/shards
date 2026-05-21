import { claudeConnectorsSection } from "@/content/claude-workshop";

/*
 * ClaudeConnectors — third pane of the Anthropic-tinted chapter.
 *
 * Different shape from Settings/Models: three named sub-groups
 * (LIVE / IN PROGRESS / NOT YET) each holding a small grid of
 * connector cards. Status reads from the group, not from the card,
 * so the Loop reader scans the group label first ("what's live
 * for me today?") and then the cards underneath.
 *
 * Single Anthropic accent (Clay) lights only the IN PROGRESS
 * group — the Refero Anthropic guidance is one accent per section
 * maximum, so the LIVE group reads in olive-on-ivory and the NOT
 * YET group sits quiet on the slate edge.
 *
 * Copy lives in `content/claude-workshop.ts`.
 */

export function ClaudeConnectors() {
  const section = claudeConnectorsSection;

  return (
    <section
      className="aiop-section aiop-claude-connectors"
      id={section.id}
      aria-labelledby={`${section.id}-title`}
      aria-label={section.ariaLabel}
    >
      <div className="aiop-wrap aiop-claude-connectors__inner">
        <header className="aiop-section-head aiop-claude-connectors__head aiop-reveal">
          <h2
            className="aiop-section-title aiop-claude-connectors__title"
            id={`${section.id}-title`}
          >
            {section.title} <em>{section.titleEm}</em>
            {section.titleAfter ?? ""}
          </h2>
          <p className="aiop-section-head__sub aiop-claude-connectors__sub">
            {section.sub}
          </p>
        </header>

        <div className="aiop-claude-connectors__groups">
          {section.groups.map((group) => (
            <section
              key={group.id}
              className={`aiop-claude-connectors__group aiop-claude-connectors__group--${group.id} aiop-reveal`}
              aria-labelledby={`${section.id}-group-${group.id}`}
            >
              <header className="aiop-claude-connectors__group-head">
                <span
                  className="aiop-claude-connectors__group-label"
                  id={`${section.id}-group-${group.id}`}
                >
                  {group.label}
                </span>
                <p className="aiop-claude-connectors__group-blurb">
                  {group.blurb}
                </p>
              </header>

              <ul
                className="aiop-claude-connectors__cards"
                role="list"
              >
                {group.connectors.map((connector) => (
                  <li
                    key={connector.id}
                    className="aiop-claude-connectors__card"
                  >
                    <h3 className="aiop-claude-connectors__card-name">
                      {connector.name}
                    </h3>
                    <p className="aiop-claude-connectors__card-body">
                      {connector.body}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
