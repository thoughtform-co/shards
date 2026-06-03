import type { CaUsageBars } from "@/content/claude-adoption";

/*
 * UsageBars — ranked horizontal bar list for connectors or skills.
 */

const BAR_COLORS = [
  "var(--aiop-violet)",
  "var(--aiop-amber)",
  "var(--aiop-sage)",
] as const;

export function UsageBars({ data }: { data: CaUsageBars }) {
  const max = Math.max(...data.bars.map((b) => b.value), 1);

  return (
    <div className="ca-usage-bars">
      <header className="ca-usage-bars__head">
        <span className="ca-usage-bars__kicker">{data.kicker}</span>
        <span className="ca-usage-bars__window">{data.windowLabel}</span>
      </header>

      <ul className="ca-usage-bars__list" role="list">
        {data.bars.map((bar, i) => (
          <li key={bar.name} className="ca-usage-bars__row">
            <span className="ca-usage-bars__label">{bar.name}</span>
            <div className="ca-usage-bars__track">
              <span
                className="ca-usage-bars__fill"
                style={{
                  width: `${(bar.value / max) * 100}%`,
                  background: BAR_COLORS[i % BAR_COLORS.length]!,
                }}
              />
              <span className="ca-usage-bars__value">{bar.value}</span>
            </div>
          </li>
        ))}
      </ul>

      {data.total ? (
        <p className="ca-usage-bars__tail">{data.total}</p>
      ) : null}
    </div>
  );
}
