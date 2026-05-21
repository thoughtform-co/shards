import type { ClaudeStackSection } from "@/content/claude-workshop";

/*
 * ClaudeStack — shared shell for the Settings and Models panes.
 *
 * Both panes share the same anatomy: editorial header (eyebrow +
 * Bodoni title with `<em>` pivot + sub), a three-card grid with
 * mono-caps counters and Bodoni-italic labels, an optional tip
 * strip below the grid, and an optional mono-caps receipt line.
 *
 * The Connectors pane has a different shape (three named
 * sub-groups) and lives in its own component file.
 *
 * Visual rhythm intentionally mirrors `.aiop-approach__outcome`
 * proportions so the new Anthropic chapter reads as a sibling of
 * the Aether method sections it sits between, not as a foreign
 * brand block.
 *
 * Recolour happens at the wrapper level: the surrounding
 * `.aiop-claude-zone` overrides the Aether `--aiop-*` tokens to
 * Anthropic surfaces (Ivory / Slate / Clay), so this component
 * inherits the new palette without naming any colour itself.
 */

export function ClaudeStack({ section }: { section: ClaudeStackSection }) {
  return (
    <section
      className="aiop-section aiop-claude-stack"
      id={section.id}
      aria-labelledby={`${section.id}-title`}
      aria-label={section.ariaLabel}
    >
      <div className="aiop-wrap aiop-claude-stack__inner">
        <header className="aiop-section-head aiop-claude-stack__head aiop-reveal">
          <h2
            className="aiop-section-title aiop-claude-stack__title"
            id={`${section.id}-title`}
          >
            {section.title} <em>{section.titleEm}</em>
            {section.titleAfter ?? ""}
          </h2>
          <p className="aiop-section-head__sub aiop-claude-stack__sub">
            {section.sub}
          </p>
        </header>

        <ol className="aiop-claude-stack__cards aiop-reveal" role="list">
          {section.cards.map((card) => (
            <li key={card.id} className="aiop-claude-stack__card">
              <header className="aiop-claude-stack__card-head">
                <span className="aiop-claude-stack__card-n">{card.n}</span>
                <span className="aiop-claude-stack__card-label">
                  {card.label}
                </span>
              </header>
              <p className="aiop-claude-stack__card-body">{card.body}</p>
            </li>
          ))}
        </ol>

        {section.tips && section.tips.length > 0 ? (
          <ul className="aiop-claude-stack__tips aiop-reveal" role="list">
            {section.tips.map((tip) => (
              <li key={tip.id} className="aiop-claude-stack__tip">
                <span className="aiop-claude-stack__tip-tag">{tip.tag}</span>
                <span className="aiop-claude-stack__tip-body">{tip.body}</span>
              </li>
            ))}
          </ul>
        ) : null}

        {section.receipt ? (
          <p className="aiop-claude-stack__receipt aiop-reveal">
            {section.receipt}
          </p>
        ) : null}
      </div>
    </section>
  );
}
