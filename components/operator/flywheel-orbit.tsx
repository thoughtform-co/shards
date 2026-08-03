import { visionSection, type FlywheelOrbitSection } from "@/content/operator";

/*
 * FlywheelOrbit — Navigate / Encode / Build pills nested on concentric
 * orbits around a substrate core, with Headless as a satellite outside
 * the outer ring.
 *
 * Reusable across two slots on the route:
 *   - `centered` (default) — Vision section, full width, the in-depth
 *     operating-model treatment. Same diameter as before the extract.
 *   - `compact` — Hub Mandate right column, smaller diameter so the
 *     orbit fits a ~420px column without losing the ring + pill rhythm.
 *
 * All visual variation is driven by `aiop-orbit--centered` /
 * `aiop-orbit--compact` modifiers in `operator.css`. The component
 * itself is structural-only.
 *
 * `bloom` (opt-in) renders an SVG morph layer used by the hero
 * choreography: the SAME SVG primitives (3 rings + 1 core fill)
 * interpolate their `r` between Loop-logo geometry and full-flywheel
 * geometry, so the Loop logo literally becomes the flywheel and back
 * on a 16s loop — no cross-fade between separate layers. When bloom
 * is on, the persistent CSS rings + core chrome are hidden in favour
 * of the SVG layer. Pure-CSS — keyframes live in `operator.css`
 * under `.aiop-hero__orbit-stage[data-aiop-bloom]`.
 *
 * Server component — no client hooks.
 *
 * `section` prop lets a route variant override the centerLabel /
 * centerFiles / orbits / satellite values without forking the
 * component itself.
 *
 * `section.nodes` / `section.ticks` (both optional) add the palette
 * layer: small labelled chips and unlabelled marks pinned to a ring at
 * a clock angle. Placement is computed here from (ring, angle) rather
 * than declared per id in CSS the way the three phase pills are — with
 * seven-plus positions that would be seven-plus near-identical
 * selectors, and the whole point of the data shape is that a label
 * moves by editing one number.
 */

/* Ring radii as a percentage of the container's half-width, matching
   the `inset` values in `operator.css` (outer 4% → r 46, middle 14% →
   r 36, inner 24% → r 26). Keep in sync with `.aiop-orbit--nested
   .aiop-orbit__ring--*` and with the SVG bloom circles, which use the
   same three numbers in viewBox units. */
const RING_RADIUS = { outer: 46, middle: 36, inner: 26 } as const;

/* Clock angle (0° = 12 o'clock, clockwise) on a ring → container
   percentages, the same transform the pill comments spell out:
     top  = 50 - r * cos θ
     left = 50 + r * sin θ
   The element is then pulled back by half its own box in CSS. */
function ringPoint(ring: keyof typeof RING_RADIUS, angle: number) {
  const r = RING_RADIUS[ring];
  const rad = (angle * Math.PI) / 180;
  return {
    top: `${(50 - r * Math.cos(rad)).toFixed(2)}%`,
    left: `${(50 + r * Math.sin(rad)).toFixed(2)}%`,
  };
}

export function FlywheelOrbit({
  variant = "centered",
  bloom = false,
  section = visionSection,
}: {
  variant?: "centered" | "compact";
  bloom?: boolean;
  section?: FlywheelOrbitSection;
}) {
  /* One sentence for the whole diagram, assembled from what the route
     actually supplied — the satellite clause and the palette clause
     each drop out when their data does, so a route that renders no
     satellite never announces one. */
  const label = [
    `Navigate, Encode, Build pills nested on concentric orbits around a substrate core${
      section.satellite
        ? `, with ${section.satellite.label} as a satellite outside the outer ring`
        : ""
    }`,
    section.nodes?.length
      ? `Each orbit is marked with what that move works on: ${section.nodes
          .map((node) => node.label)
          .join(", ")}`
      : null,
  ]
    .filter(Boolean)
    .join(". ");

  return (
    <div
      className={`aiop-orbit aiop-orbit--${variant} aiop-orbit--nested`}
      role="img"
      aria-label={label}
      data-aiop-bloom={bloom ? "on" : undefined}
      /* Gates the hairline spine drawn by `.aiop-orbit--nested::after`.
         The connector runs from the satellite down to the core, so
         without a satellite it is a line from nothing to the middle. */
      data-aiop-spine={section.satellite ? "on" : undefined}
    >
      {bloom ? (
        <svg
          className="aiop-orbit__bloom"
          viewBox="0 0 100 100"
          aria-hidden="true"
        >
          {/* True morph layer: the same four SVG primitives carry
              both end states, with `r` interpolated by CSS keyframes.
              At the cycle boundary the inner ring sits at r=6.6 with
              a chunky stroke (the Loop-logo torus) over a small
              filled core at r=4.8 (the Loop's negative-space hole) —
              together they ARE the Loop logo. As the cycle expands,
              the inner ring grows to r=26 and thins out, the middle
              and outer rings emerge to r=36 and r=46, and the core
              fill grows to r=15 (the substrate disc). On the fold
              the same primitives collapse back into the Loop logo.
              No cross-fade between layers — one element, two
              shapes. */}
          <circle
            className="aiop-orbit__bloom-core-fill"
            cx="50"
            cy="50"
            r="15"
          />
          <circle
            className="aiop-orbit__bloom-ring aiop-orbit__bloom-ring--outer"
            cx="50"
            cy="50"
            r="46"
          />
          <circle
            className="aiop-orbit__bloom-ring aiop-orbit__bloom-ring--middle"
            cx="50"
            cy="50"
            r="36"
          />
          <circle
            className="aiop-orbit__bloom-ring aiop-orbit__bloom-ring--inner"
            cx="50"
            cy="50"
            r="26"
          />
        </svg>
      ) : null}

      <span
        className="aiop-orbit__ring aiop-orbit__ring--outer"
        aria-hidden="true"
      />
      <span
        className="aiop-orbit__ring aiop-orbit__ring--middle"
        aria-hidden="true"
      />
      <span
        className="aiop-orbit__ring aiop-orbit__ring--inner"
        aria-hidden="true"
      />

      {section.ticks?.map((tick) => (
        <span
          key={`${tick.ring}-${tick.angle}`}
          className={`aiop-orbit__tick aiop-orbit__tick--ring-${tick.ring}`}
          style={ringPoint(tick.ring, tick.angle)}
          aria-hidden="true"
        />
      ))}

      {section.nodes?.map((node) => (
        <span
          key={node.id}
          className={`aiop-orbit__node aiop-orbit__node--ring-${node.ring}`}
          style={ringPoint(node.ring, node.angle)}
          data-aiop-node={node.id}
        >
          {node.label}
        </span>
      ))}

      {section.orbits.map((orbit) => (
        <span
          key={orbit.id}
          className={`aiop-orbit__pill aiop-orbit__pill--${orbit.id} aiop-orbit__pill--ring-${orbit.ring}`}
          data-aiop-phase={orbit.id}
        >
          <span className="aiop-orbit__dot" aria-hidden="true" />
          <span>{orbit.label}</span>
        </span>
      ))}

      <span className="aiop-orbit__core">
        <strong>{section.centerLabel}</strong>
        <span className="aiop-orbit__core-files">
          {section.centerFiles.map((file) => (
            <span key={file}>{file}</span>
          ))}
        </span>
      </span>

      {section.satellite ? (
        <span
          className={`aiop-orbit__satellite aiop-orbit__satellite--${section.satellite.id}`}
          data-aiop-satellite={section.satellite.id}
        >
          <span className="aiop-orbit__satellite-dot" aria-hidden="true" />
          <span className="aiop-orbit__satellite-label">
            {section.satellite.label}
          </span>
        </span>
      ) : null}
    </div>
  );
}
