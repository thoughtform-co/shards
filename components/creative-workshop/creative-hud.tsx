/*
 * Creative AI Workshop · HUD telemetry rails.
 *
 * Pixel-perfect port of the Thoughtform.co v7 HUD. Markup
 * mirrors `01_thoughtform/public/prototypes/v7/landing-v7-motion.html`
 * (3 corner brackets, 2 rails with track + 21 ticks + labels at
 * majors, gold depth diamond on the left rail, brandmark at the
 * bottom-left anchor). Geometry tokens and colors come from
 * `app/creative-ai-workshop/creative-ai-workshop.css` so the
 * rails breathe with the rest of the route's light skin.
 *
 * Tick gauge: 21 ticks at i = 0..20 (every 5%). Major every 5;
 * labels at majors carry the depth-gauge values from v7
 * (0 / 2 / 5 / 7 / 10). Both rails get the same labels.
 *
 * Brandmark glyph is inlined SVG so the paths inherit
 * `currentColor` (set to `--aiop-gold` on the wrapper).
 *
 * No client hooks; this is a server component.
 */

const TICK_COUNT = 20;

const TICK_LABELS: Record<number, string> = {
  0: "0",
  5: "2",
  10: "5",
  15: "7",
  20: "10",
};

type Tick = {
  yPct: number;
  major: boolean;
  label?: string;
};

const TICKS: Tick[] = Array.from({ length: TICK_COUNT + 1 }, (_, i) => {
  const major = i % 5 === 0;
  const yPct = (i / TICK_COUNT) * 100;
  return major ? { yPct, major, label: TICK_LABELS[i] } : { yPct, major };
});

function ThoughtformBrandmark() {
  return (
    <svg
      viewBox="0 0 430.99 436"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Thoughtform"
    >
      <g fill="currentColor">
        <path d="M336.78,99.43c18.82,18.93,33.41,41.16,43.78,66.63,5.03,12.35,8.81,24.86,11.42,37.57h19.62c-1.91-18.99-6.54-37.52-13.79-55.54-10.01-24.71-24.56-46.73-43.78-66.02-19.17-19.29-41.16-33.97-65.92-43.99-7.9-3.24-15.9-5.92-23.95-8.1l-1.36,7.49-.9,4.91-1.41,7.49c2.87,1.11,5.79,2.28,8.65,3.54,25.51,10.99,48.06,26.33,67.63,46.02h.01Z" />
        <path d="M383.13,314.65c-8.61,22.23-21.59,41.97-38.85,59.38-16.91,16.61-35.23,29.06-55,37.36-19.78,8.3-40.21,12.45-61.29,12.45-11.68,0-23.35-1.22-34.92-3.7-2.47-.46-4.93-1.01-7.4-1.67-2.42-.61-4.88-1.27-7.3-2.02-7.4-2.18-14.74-4.91-22.14-8.1-1.21-.51-2.47-1.06-3.67-1.62-1.16-.51-2.31-1.06-3.42-1.62-2.37-1.11-4.73-2.28-7.05-3.49-20.78-10.83-39.75-24.86-56.91-42.07-19.98-19.69-35.63-42.88-46.9-69.56-5.38-12.61-9.46-25.36-12.28-38.22-.6-2.53-1.11-5.06-1.56-7.59s-.85-5.06-1.21-7.59c-.81-5.87-1.41-11.85-1.71-17.77-.1-2.53-.2-5.06-.2-7.59-.05-.96-.05-1.92-.05-2.89,0-1.57,0-3.14.1-4.71.45-21.06,4.48-41.21,11.98-60.45,8.1-20.66,20.53-39.49,37.44-56.45,16.86-17.01,35.48-29.57,55.86-37.67,20.33-8.1,41.62-12.2,63.91-12.2,5.99,0,11.93.25,17.86.81l2.72-14.68c-26.82,0-53.19,5.32-79,15.95-25.92,10.63-49.06,26.12-69.39,46.63-20.73,20.81-36.38,43.99-46.95,69.51-6.59,15.85-11.12,32.05-13.59,48.55-.35,2.53-.7,5.06-.96,7.59-.3,2.53-.5,5.06-.7,7.59-.35,5.01-.55,10.02-.55,15.04,0,.91,0,1.82.05,2.73,0,2.53.1,5.06.25,7.59.1,2.53.25,5.06.5,7.59,1.76,19.9,6.49,39.24,14.14,57.97,9.96,24.3,24.56,46.12,43.78,65.41,19.93,19.74,42.57,34.78,67.93,45.21,3.72,1.52,7.5,2.99,11.27,4.25,2.42.86,4.83,1.67,7.25,2.38,2.42.76,4.88,1.47,7.3,2.13,7.5,2.03,15.1,3.59,22.74,4.71,2.52.35,5.03.71,7.55.96,2.52.3,5.03.51,7.55.66,4.88.41,9.76.56,14.64.56,26.87,0,52.84-5.11,78-15.34,25.16-10.23,47.71-25.41,67.68-45.51,20.33-20.81,35.78-44.2,46.35-70.07,7.1-17.42,11.78-35.18,14.09-53.31h-15.1c-.71,21.82-4.98,42.78-12.83,62.88h-.01Z" />
        <path d="M29.12,218.81l132.09-.05v.05H29.12h0Z" />
        <path d="M163.32,250.35l12.58.05h-12.58v-.05Z" />
        <path d="M179.17,408.81l30.34-158.46-29.79,158.61s-.35-.1-.55-.15h0Z" />
        <path d="M430.98,218.81l-5.23,17.77h-184.93l-10.32.05-2.47,13.72h-18.52l-30.34,158.46c-7.2-2.23-14.44-4.96-21.59-8.1l24.05-132.9h-8.86l3.12-17.42h-20.73l2.57-13.77H30.87c-.86-5.87-1.46-11.8-1.76-17.77h132.09l10.32-.05,2.47-13.72h18.52l29.54-157.85,1.36-7.49,1.41-7.44.2-1.21,1.41-7.49,1.36-7.44L230.76.06h23.6l-3.52,19.14-1.36,7.44-1.41,7.49-.65,3.44-1.36,7.49-1.41,7.54-23.9,129.71h.6l13.49.1-4.78,21.52h17.01l-.2,1.16-2.57,13.77h186.69v-.05h-.01Z" />
        <path d="M254.35,0l-33.01,182.26h-.6L254.35,0h0Z" />
      </g>
    </svg>
  );
}

function RailTicks({ withLabels }: { withLabels: boolean }) {
  return (
    <>
      {TICKS.map((tick, i) => (
        <div
          key={`tick-${i}`}
          className={`cw-hud__tick${tick.major ? " cw-hud__tick--major" : ""}`}
          style={{ top: `${tick.yPct}%` }}
        />
      ))}
      {withLabels
        ? TICKS.filter((t) => t.label !== undefined).map((tick, i) => (
            <div
              key={`label-${i}`}
              className="cw-hud__tick-label"
              style={{ top: `${tick.yPct}%`, transform: "translateY(-50%)" }}
            >
              {tick.label}
            </div>
          ))
        : null}
    </>
  );
}

export function CreativeHud() {
  return (
    <div className="cw-hud" aria-hidden="true">
      {/* Three corner brackets — TL / BL / BR. TR intentionally
          empty: the v7 site reserves that quadrant for the top
          nav, which on this page is the sticky `.aiop-header`. */}
      <div className="cw-hud__corner cw-hud__corner--tl" />
      <div className="cw-hud__corner cw-hud__corner--bl" />
      <div className="cw-hud__corner cw-hud__corner--br" />

      {/* Left rail: track + ticks + labels + gold depth diamond */}
      <aside className="cw-hud__rail cw-hud__rail--l">
        <div className="cw-hud__rail-track" />
        <RailTicks withLabels />
        <div className="cw-hud__depth" />
      </aside>

      {/* Right rail: track + ticks + labels (no depth chevron) */}
      <aside className="cw-hud__rail cw-hud__rail--r">
        <div className="cw-hud__rail-track" />
        <RailTicks withLabels />
      </aside>

      {/* Brandmark anchor — bottom-left corner glyph */}
      <div
        className="cw-hud__brandmark"
        style={{ color: "var(--aiop-gold)" }}
      >
        <ThoughtformBrandmark />
      </div>
    </div>
  );
}
