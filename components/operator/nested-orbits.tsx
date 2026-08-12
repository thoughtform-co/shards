import {
  figureLabel,
  polarPercent,
  workflowFigure,
  type HeroFigureSection,
} from "./hero-figure";

/*
 * NestedOrbits — the constellation's variant. One orbit each, instead of
 * one orbit carrying four bodies.
 *
 * Same claim, differently argued. The constellation says a workflow is a
 * boundary with four things attached to it; this says a workflow is four
 * layers wrapped around each other, and names each layer by its own
 * line. Which is right depends on whether the four read better as parts
 * of one thing or as depths of one thing.
 *
 * ── the order is the argument ───────────────────────────────────────
 * Inside out: MODEL, SKILL, DATA, INTERFACE. The engine sits at the
 * core, the encoded judgment wraps it, the data it reaches wraps that,
 * and the interface is the outermost layer — the only one a person
 * actually touches. Reorder these and the figure says something else, so
 * the sequence lives in one place (`STACK`) rather than being implied by
 * four radii scattered through the CSS.
 *
 * ── the rings differ in KIND, not just in size ──────────────────────
 * Four concentric circles of the same weight read as a target. Each one
 * here has its own line quality and its own step down a tonal ladder, so
 * they read as four distinct layers: a heavy solid core, the amber
 * accent, a dashed ring, a fine dotted edge.
 *
 * ── the morph ───────────────────────────────────────────────────────
 * The same one every figure in this family runs, and again for free. At
 * the cycle boundary all four rings sit at r=6.6, stroke 3.6, SOLID and
 * INK — four coincident circles, which is the Loop mark. Unfurling
 * animates the radius, the weight, the dash pattern and the colour out
 * to each ring's own destination, on a stagger from the inside out, so
 * the mark opens into four layers rather than four layers fading up.
 *
 * Solid and ink at the boundary matters: a dotted torus reads as a
 * broken mark, and an amber one is not the brandmark at all. The dash
 * pattern is held at `100 0` — a complete circle — and every ring is
 * inked until it is clear of the others. `pathLength="100"` normalises
 * each perimeter to 100 units so the dash patterns stay the same angular
 * size across radii that differ by a factor of two and a half.
 *
 * Server component.
 */

/* Inside out, and DELIBERATELY OFF THE CARDINALS.
 *
 * The first cut put the four labels at 12, 3, 6 and 9 o'clock. Four
 * concentric rings with four labels on a perfect cross reads as a dial —
 * the symmetry is the loudest thing in the figure and it flattens the
 * one relationship that matters, which is that each word belongs to a
 * different DEPTH. Scattered, the eye has to travel in and out to read
 * them, and the radius does the talking.
 *
 * The angles are not arbitrary either. Going round they are 220, 145,
 * 300, 35 — no two within 70° of each other, none on an axis, and none
 * in the bottom sector, which belongs to the caption. INTERFACE has one
 * further constraint: nine characters at r=41 means it has to sit within
 * about 66° of vertical or its box leaves the figure, which is why it
 * takes the upper right rather than a flank. */
const STACK = [
  { id: "model", angle: 220 },
  { id: "skill", angle: 145 },
  { id: "data", angle: 300 },
  { id: "interface", angle: 35 },
] as const;

/* Matched to STACK by index. The innermost is 19 because the centre
   block sits inside it; the outermost is 41 rather than wider so the
   caption clears every circle instead of cutting one. */
const RADII = [19, 27, 34, 41] as const;

/* Where the caption sits — below every orbit, not on one. A framed label
   crossing the outermost ring would read as naming that ring rather than
   the whole stack, which is the entire reason this figure needs no fifth
   dotted circle: it already has four, and the name of the thing they add
   up to belongs underneath them. */
const CAPTION_RADIUS = 46;

export const NESTED_GEOMETRY = {
  radii: RADII,
  captionRadius: CAPTION_RADIUS,
  order: STACK.map((ring) => ring.id),
} as const;

export function NestedOrbits({
  section = workflowFigure,
  loop = false,
  labels = "named",
}: {
  section?: HeroFigureSection;
  /** Opt into the 16s Loop-mark → four orbits → Loop-mark cycle. */
  loop?: boolean;
  /** "none" drops the words and leaves four unexplained layers. */
  labels?: "none" | "named";
}) {
  /* The words come from the shared section; the geometry does not. A
     facet's clock angle in the constellation is set by which cross-axis
     it belongs on, and here by how long its label is — same four
     fields, two different sets of reasons, so neither figure should be
     reading the other's numbers. */
  const rings = STACK.map((ring, index) => ({
    ...ring,
    radius: RADII[index],
    label: section.facets.find((facet) => facet.id === ring.id)?.label,
  })).filter((ring) => ring.label);

  return (
    <div
      className="tf-fig tf-nest"
      role="img"
      aria-label={figureLabel(section)}
      data-tf-loop={loop ? "on" : undefined}
      data-tf-labels={labels}
    >
      <svg className="tf-fig__svg" viewBox="0 0 100 100" aria-hidden="true">
        {rings.map((ring) => (
          <circle
            key={ring.id}
            className="tf-nest__ring"
            data-tf-facet={ring.id}
            cx="50"
            cy="50"
            r={ring.radius}
            pathLength="100"
          />
        ))}
      </svg>

      <span className="tf-fig__core">
        <span className="tf-fig__core-main">{section.center}</span>
        {section.centerSub ? (
          <span className="tf-fig__core-sub">{section.centerSub}</span>
        ) : null}
      </span>

      {/* Each label sits ON its own ring and knocks a hole in it with a
          paper background, rather than floating beside it. That is what
          ties a word to a layer when four layers are otherwise only
          distinguishable by line quality. A mask would be the tidier SVG
          answer and is wrong here: the mask rect is authored at the
          label's final position, and the rings animate their radius, so
          mid-morph it would cut a gap in empty space. */}
      {labels === "none" ? null : (
        <>
          {rings.map((ring) => (
            <span
              key={ring.id}
              className="tf-nest__label"
              data-tf-facet={ring.id}
              style={polarPercent(ring.radius, ring.angle)}
              aria-hidden="true"
            >
              {ring.label}
            </span>
          ))}

          {section.boundary ? (
            <span
              className="tf-fig__boundary-label"
              style={polarPercent(CAPTION_RADIUS, 180)}
              aria-hidden="true"
            >
              {section.boundary}
            </span>
          ) : null}
        </>
      )}
    </div>
  );
}
