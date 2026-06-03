import type { ReactNode } from "react";

import type { CaSparkline } from "@/content/claude-adoption";

/*
 * UsageSparkline — inline SVG active-users chart.
 *
 * Renders a 30-day WAU series as a path with a final-point
 * dot, light grid hairlines, and a large current value with delta
 * beneath. No chart library — pure SVG in the Aether palette.
 */

const W = 100;
const H = 48;
const PAD = { top: 6, right: 4, bottom: 14, left: 4 };

function scale(
  series: readonly { value: number }[],
  max: number,
): { x: number; y: number }[] {
  const min = Math.min(...series.map((p) => p.value));
  const range = max - min || 1;
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  return series.map((p, i) => ({
    x: PAD.left + (i / Math.max(series.length - 1, 1)) * innerW,
    y: PAD.top + innerH - ((p.value - min) / range) * innerH,
  }));
}

function toPath(pts: { x: number; y: number }[]): string {
  return pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(" ");
}

function buildYTicks(minV: number, max: number): number[] {
  const span = max - minV;
  const step =
    span > 180 ? 40 : span > 120 ? 20 : span > 60 ? 10 : span > 30 ? 5 : 2;
  const lo = Math.floor((minV - 5) / step) * step;
  const hi = Math.ceil((max + 5) / step) * step;
  const ticks: number[] = [];
  for (let t = lo; t <= hi; t += step) ticks.push(t);
  return ticks;
}

export function UsageSparkline({
  data,
  headerSlot,
}: {
  data: CaSparkline;
  headerSlot?: ReactNode;
}) {
  const max = Math.max(...data.series.map((p) => p.value));
  const pts = scale(data.series, max);
  const pathD = toPath(pts);
  const last = pts[pts.length - 1]!;

  const minV = Math.min(...data.series.map((p) => p.value));
  const yTicks = buildYTicks(minV, max);
  const yPos = (v: number) =>
    PAD.top +
    (H - PAD.top - PAD.bottom) -
    ((v - (minV - 5)) /
      (max - minV + 10 || 1)) *
      (H - PAD.top - PAD.bottom);

  return (
    <div className="ca-usage-sparkline">
      <header className="ca-usage-sparkline__head">
        <span className="ca-usage-sparkline__kicker">{data.kicker}</span>
        {headerSlot ?? (
          <span className="ca-usage-sparkline__unit">{data.unit}</span>
        )}
        <span className="ca-usage-sparkline__window">{data.windowLabel}</span>
      </header>

      <div className="ca-usage-sparkline__chart">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="ca-usage-sparkline__svg"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {yTicks.map((t) => (
            <line
              key={t}
              x1={PAD.left}
              y1={yPos(t)}
              x2={W - PAD.right}
              y2={yPos(t)}
              className="ca-usage-sparkline__grid"
            />
          ))}
          <path d={pathD} className="ca-usage-sparkline__line" />
          <circle
            cx={last.x}
            cy={last.y}
            r={2.5}
            className="ca-usage-sparkline__dot"
          />
        </svg>
      </div>

      <div className="ca-usage-sparkline__stat">
        <span className="ca-usage-sparkline__value">{data.currentValue}</span>
        <span className="ca-usage-sparkline__delta">{data.delta}</span>
      </div>
    </div>
  );
}
