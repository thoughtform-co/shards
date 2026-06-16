/*
 * Substrate flywheel — the new signature visual for /loam/substrate.
 *
 * Two variants share the brand vocabulary already established on the
 * page: hairline blueprint arcs (rgba(22,24,26,0.22)), chartreuse hub
 * (#cdee65) for the intelligence layer, amber (#e8a13a) for junctions,
 * JetBrains Mono for any micro-labels in surrounding markup.
 *
 *   `variant="mark"` (hero)
 *     ~1:1 iconic mark. Stationary blueprint tick ring + cardinal
 *     compass diamonds; a rotor (three orbiting arcs + amber junctions)
 *     that rotates slowly via CSS; a chartreuse hub at the center.
 *     No labels — the surrounding hero copy carries the meaning.
 *
 *   `variant="engine"` (section 2)
 *     Wider stage. Two arcs forming a closed loop around a chartreuse
 *     hub: top half = Adoption (clockwise flow), bottom half =
 *     Automation (continuing clockwise back to the start). A dashed
 *     overlay path on each arc animates via stroke-dashoffset for a
 *     subtle directional flow. Direction arrows mark the transitions.
 *     Labels for Adoption / Automation / Intelligence layer are
 *     positioned by the section markup in page.tsx, not by the SVG.
 *
 * Pure CSS animation — no client hooks. The CSS rules in substrate.css
 * collapse all motion under `prefers-reduced-motion: reduce`.
 */

type FlywheelVariant = "mark" | "engine";

export function SubstrateFlywheel({
  variant = "mark",
  className,
  ariaLabel,
}: {
  variant?: FlywheelVariant;
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <div
      className={`subs-fly subs-fly--${variant} ${className ?? ""}`.trim()}
      role={ariaLabel ? "img" : undefined}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
    >
      {variant === "mark" ? <FlywheelMarkSvg /> : <FlywheelEngineSvg />}
    </div>
  );
}

/* -----------------------------------------------------------------------
 * Mark — hero iconic
 * --------------------------------------------------------------------- */

function FlywheelMarkSvg() {
  /* 24 tick marks around the outer ring. Major ticks every 90deg
     (cardinals) sit slightly longer. Computed once in render so the
     SVG output is deterministic and SSR-stable. */
  const ticks = Array.from({ length: 24 }, (_, i) => {
    const angle = (i * 360) / 24;
    const rad = (angle * Math.PI) / 180;
    const long = i % 6 === 0;
    const r1 = long ? 182 : 187;
    const r2 = 194;
    return {
      i,
      long,
      x1: 200 + r1 * Math.cos(rad),
      y1: 200 + r1 * Math.sin(rad),
      x2: 200 + r2 * Math.cos(rad),
      y2: 200 + r2 * Math.sin(rad),
    };
  });

  /* Amber junctions sit on (or near) the three orbiting arcs. Mixed
     radii so the rotor reads as organic rather than mechanical. */
  const junctions = [
    { cx: 278, cy: 200, r: 4.2, variant: "mid" },
    { cx: 200, cy: 76, r: 3.6, variant: "edge" },
    { cx: 322, cy: 234, r: 3.6, variant: "edge" },
    { cx: 122, cy: 282, r: 3.6, variant: "edge" },
    { cx: 78, cy: 162, r: 3, variant: "edge" },
    { cx: 268, cy: 114, r: 3, variant: "edge" },
    { cx: 232, cy: 332, r: 3, variant: "edge" },
  ] as const;

  return (
    <svg
      viewBox="0 0 400 400"
      className="subs-fly__svg"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Stationary backdrop: blueprint tick ring + cardinal compass
          diamonds. Reads as a navigation instrument. */}
      <g className="subs-fly__static">
        <circle cx="200" cy="200" r="194" className="subs-fly__ring" />
        {ticks.map((t) => (
          <line
            key={t.i}
            x1={t.x1}
            y1={t.y1}
            x2={t.x2}
            y2={t.y2}
            className={`subs-fly__tick${t.long ? " is-long" : ""}`}
          />
        ))}
        {[0, 90, 180, 270].map((angle) => {
          const rad = (angle * Math.PI) / 180;
          const cx = 200 + 198 * Math.cos(rad);
          const cy = 200 + 198 * Math.sin(rad);
          return (
            <rect
              key={angle}
              x={cx - 3.5}
              y={cy - 3.5}
              width="7"
              height="7"
              transform={`rotate(45 ${cx} ${cy})`}
              className="subs-fly__cardinal"
            />
          );
        })}
      </g>

      {/* Rotor: three orbiting arcs + amber junctions. Rotates via
          CSS keyframes; static under prefers-reduced-motion. */}
      <g className="subs-fly__rotor">
        <circle cx="200" cy="200" r="78" className="subs-fly__orbit" />
        <circle cx="200" cy="200" r="124" className="subs-fly__orbit" />
        <circle cx="200" cy="200" r="170" className="subs-fly__orbit" />
        {junctions.map((j, i) => (
          <circle
            key={i}
            cx={j.cx}
            cy={j.cy}
            r={j.r}
            className={`subs-fly__junction subs-fly__junction--${j.variant}`}
          />
        ))}
      </g>

      {/* Hub: the intelligence layer at the calm center. */}
      <g className="subs-fly__hub">
        <circle cx="200" cy="200" r="34" className="subs-fly__hub-halo" />
        <circle cx="200" cy="200" r="16" className="subs-fly__hub-core" />
      </g>
    </svg>
  );
}

/* -----------------------------------------------------------------------
 * Engine — section 2 instructional diagram
 *
 * A horizontal infinity (lemniscate). The whole figure-8 is one
 * continuous stroke that crosses at the center, so the flow reads as
 * one motion passing from one lobe into the other and back. Left lobe =
 * Adoption, right lobe = Automation; the chartreuse hub sits on the
 * crossing where the two flows meet (the intelligence layer the motion
 * builds). Deliberately NOT a circle, so it never reads as a second
 * copy of the spinning hero mark.
 *
 *   Center crossing P = (380, 200)
 *   Outer apexes      = (50, 200) left, (710, 200) right
 *   Lobe control band = y 65 (top) / y 335 (bottom)
 * --------------------------------------------------------------------- */

const LEMNISCATE =
  "M 380 200 " +
  "C 561.5 65, 710 65, 710 200 " + // center -> over right lobe top -> right apex
  "C 710 335, 561.5 335, 380 200 " + // right apex -> under right lobe -> center
  "C 198.5 65, 50 65, 50 200 " + // center -> over left lobe top -> left apex
  "C 50 335, 198.5 335, 380 200 " + // left apex -> under left lobe -> center
  "Z";

function FlywheelEngineSvg() {
  /* Amber junctions: the two outer apexes (prominent) + a mid dot on
     each upper lobe. The lower-lobe positions are left for the
     converging direction arrows so the marks never stack. */
  const junctions = [
    { cx: 710, cy: 200, r: 5.5, v: "edge" },
    { cx: 50, cy: 200, r: 5.5, v: "edge" },
    { cx: 613, cy: 99, r: 3.4, v: "mid" },
    { cx: 147, cy: 99, r: 3.4, v: "mid" },
  ] as const;

  return (
    <svg
      viewBox="0 0 760 400"
      className="subs-fly__svg"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Base figure-8 hairline. */}
      <path d={LEMNISCATE} className="subs-fly__arc" />
      {/* Chartreuse dashed flow travelling the whole loop. */}
      <path d={LEMNISCATE} className="subs-fly__flow" pathLength={100} />

      {/* Converging arrows on the lower lobes: both flows return toward
          the hub at the bottom, so they read as feeding each other.
          Left lobe heads right (->), right lobe heads left (<-). */}
      <polygon points="135,294 135,308 153,301" className="subs-fly__arrow" />
      <polygon points="625,294 625,308 607,301" className="subs-fly__arrow" />

      {junctions.map((j, i) => (
        <circle
          key={i}
          cx={j.cx}
          cy={j.cy}
          r={j.r}
          className={`subs-fly__junction subs-fly__junction--${j.v}`}
        />
      ))}

      {/* Hub — the intelligence layer at the crossing. Drawn last so the
          four strands emerge from beneath it. */}
      <g className="subs-fly__hub">
        <circle cx="380" cy="200" r="66" className="subs-fly__hub-halo" />
        <circle cx="380" cy="200" r="40" className="subs-fly__hub-core" />
      </g>
    </svg>
  );
}
