/*
 * Creative AI Workshop · Agent expectations / context.
 *
 * Sets the room before the diagnosis: everyone wants an agent;
 * most fail. Two-column header (title left, supporting line on
 * the right) with no card grid below it — the three quick-read
 * cards used to live here but they spoiled the diagnosis and
 * substrate-map beats further down, so they were removed.
 *
 * Server component.
 */

export function AgentContext() {
  return (
    <section
      className="aiop-section cw-context"
      id="agent-context"
      aria-label="The room: agent expectations and the missing layer"
    >
      <div className="aiop-wrap cw-context__inner">
        <header className="cw-context__head aiop-reveal">
          <div className="cw-context__head-title">
            <span className="cw-context__eyebrow">Context</span>
            <h2 className="cw-context__title">
              Everyone wants an agent.
              <br />
              <em>Yet most fail.</em>
            </h2>
          </div>
          <div className="cw-context__head-sub">
            <p className="cw-context__sub">
              The room you&apos;re in: hype on one side, pilots that fizzle
              on the other. Same story across early rollouts, fine in a demo,
              falls apart on the third real task.
            </p>
          </div>
        </header>
      </div>
    </section>
  );
}
