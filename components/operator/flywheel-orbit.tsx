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
 */
export function FlywheelOrbit({
  variant = "centered",
  bloom = false,
  section = visionSection,
}: {
  variant?: "centered" | "compact";
  bloom?: boolean;
  section?: FlywheelOrbitSection;
}) {
  return (
    <div
      className={`aiop-orbit aiop-orbit--${variant} aiop-orbit--nested`}
      role="img"
      aria-label="Navigate, Encode, Build pills nested on concentric orbits around a substrate core, with Headless as a satellite outside the outer ring"
      data-aiop-bloom={bloom ? "on" : undefined}
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
