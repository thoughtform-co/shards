import {
  figureLabel,
  polarPercent,
  workflowFigure,
  type HeroFigureSection,
} from "./hero-figure";

/*
 * ConstellationOrbit — candidate C. One boundary with four bodies
 * attached.
 *
 * The most literal of the three, and the closest to the calm of the
 * `/ai-keynote` flywheel: a single orbit, a faint outer ring, and four
 * small bodies sitting ON the orbit, each wired back to the centre by a
 * hairline. It is the same skeleton as `<ConfigurationOrbit />`, whose
 * problem was never the geometry: it was four long captions floating on
 * two rings, which reads as a framework checklist.
 *
 * The bodies differ in KIND, not just in position: a filled disc, a
 * hollow ring, a dotted ring, an accented disc. That carries "four
 * different sorts of thing are attached here" on its own — but only
 * that, which is why `labels` exists.
 *
 * ── labels ──────────────────────────────────────────────────────────
 *   "none"   marks only. Elegant, and mute: a viewer has to be told
 *            what the four bodies are.
 *   "named"  one word per body — SKILL, MODEL, DATA, INTERFACE.
 *
 * Labels are ANCHORED OUTWARD from their body rather than centred on a
 * point: the top one sits above it, the right one starts beside it and
 * reads right, and so on. Centring would push the horizontal pair half
 * their own width past the edge of a square figure — that constraint
 * decides most of the geometry in a diagram like this, and it is why the
 * two shortest words are the ones on the horizontal.
 *
 * The halo is dropped whenever labels are on. It sits at r=44 and the
 * labels need that band: centred on the halo they cross it, outside it
 * they leave the figure. Nothing is lost — with four labels ringing the
 * boundary the figure already has its outer layer.
 *
 * The morph is the same one its siblings run. The boundary ring is the
 * anchor: at the cycle boundary it sits at r=6.6 with a heavy stroke
 * and no fill, which is the Loop mark.
 *
 * ── how the bodies arrive ───────────────────────────────────────────
 * They are not faded in and they do not appear beside the ring. They
 * come out of the mark itself, in three overlapping moves:
 *
 *   1. BUD. A body's radius grows from 0 while it still sits on the
 *      mark's circumference, and the mark's stroke is 3.6 wide there.
 *      Until the body is wider than half that stroke it is inside the
 *      line — so what a viewer sees is a bead swelling OUT OF the
 *      thickness of the brandmark, with no moment of appearing. The
 *      radius stays at 0 through the whole of the mark's hold, so the
 *      brandmark itself is never carrying pips.
 *   2. RIDE. The translate is locked to the ring's own radius keyframe,
 *      beat for beat. A body is on the orbit or it is nowhere; an
 *      earlier cut let it lag "so the bodies follow the boundary out"
 *      and every frame of the opening had dots floating loose inside a
 *      full-size circle.
 *   3. SLOT. Each body starts a rotation behind its clock position and
 *      unwinds into it, finishing a few beats AFTER the ring has
 *      settled — so the last thing that happens is four beads sliding
 *      along a stationary orbit into their places.
 *
 * ── one cue per facet ───────────────────────────────────────────────
 * Everything that belongs to a facet — the bud, the slot, the spoke and
 * the word — runs off a single `--tf-cn-cue` offset, so each of the four
 * is one continuous gesture and the four cascade clockwise from SKILL.
 * The first cut staggered only the slot and left the spokes and labels
 * on a shared un-offset timeline: the beads clicked in one at a time and
 * then all four wires drew simultaneously, which is the thing that
 * reads as out of sync.
 *
 * The RIDE is the one thing deliberately left off the cue. It is the
 * radial travel, and a body whose radius lags the boundary's is a body
 * off the orbit. Rotation, radius, opacity and dash offset can all be
 * delayed safely; distance from the centre cannot.
 *
 * Bodies travel by a static rotation on a wrapper group composed with
 * animated transforms underneath, so all four share one keyframe. Same
 * technique as the other two candidates; see `quatrefoil-orbit.tsx` for
 * why the travel is on a group and not on `cx`/`cy`.
 *
 * Server component.
 */

/* The constellation sits at 26 rather than 32, and that is what buys the
   room for everything else. Between the ring and the boundary at 45 is
   19 units of clear annulus: the four labels live there without touching
   either, and the horizontal pair — which used to run flush to the edge
   of the figure — now has two thirds more width than its type needs. */
const RING_RADIUS = 26;
const BOUNDARY_RADIUS = 45;
const BODY_RADIUS = 2.9;

/* Where a facet label's INNER edge sits. The body's outer edge is at
   28.9, so this leaves two units of air — enough to read as attached
   rather than floating, close enough not to drift toward the boundary. */
const LABEL_RADIUS = 31;

export type ConstellationLabels = "none" | "named";

export const CONSTELLATION_GEOMETRY = {
  ringRadius: RING_RADIUS,
  boundaryRadius: BOUNDARY_RADIUS,
  bodyRadius: BODY_RADIUS,
  labelRadius: LABEL_RADIUS,
} as const;

/* Which way a label reads away from its body. Four cardinals only —
   anything off-axis would need a diagonal anchor and this figure has no
   off-axis facets. */
function anchorFor(angle: number): "top" | "right" | "bottom" | "left" {
  const a = ((angle % 360) + 360) % 360;
  if (a === 0) return "top";
  if (a === 180) return "bottom";
  return a < 180 ? "right" : "left";
}

export function ConstellationOrbit({
  section = workflowFigure,
  loop = false,
  labels = "none",
}: {
  section?: HeroFigureSection;
  /** Opt into the 16s Loop-mark → constellation → Loop-mark cycle. */
  loop?: boolean;
  /** How much each body says for itself. See the block above. */
  labels?: ConstellationLabels;
}) {
  return (
    <div
      className="tf-fig tf-cn"
      role="img"
      aria-label={figureLabel(section)}
      data-tf-loop={loop ? "on" : undefined}
      data-tf-labels={labels}
    >
      <svg className="tf-fig__svg" viewBox="0 0 100 100" aria-hidden="true">
        {/* The whole figure's edge, and now a named one. It used to be
            dropped whenever labels were on, because the labels needed
            that band; pulling the constellation in to r=26 gives them
            their own annulus and hands this ring back its job. */}
        <circle
          className="tf-cn__boundary"
          cx="50"
          cy="50"
          r={BOUNDARY_RADIUS}
        />

        {/* The morph anchor. At the cycle boundary this same circle is
            the Loop mark: a heavy torus around a transparent hole, which
            is only transparent because nothing in this figure fills the
            centre. */}
        <circle className="tf-cn__ring" cx="50" cy="50" r={RING_RADIUS} />

        {section.facets.map((facet) => (
          /* `data-tf-facet` sits on the OUTERMOST group so the per-facet
             cue (`--tf-cn-cue`, set in the CSS) inherits to everything
             inside it — spoke, sweep and body all read the same offset
             and cascade together. The body keeps its own copy of the
             attribute because its appearance is keyed off it too. */
          <g
            key={facet.id}
            data-tf-facet={facet.id}
            style={{ transform: `rotate(${facet.angle}deg)` }}
          >
            {/* Authored straight up, from the centre to the ring. The
                rotation above carries it to the facet's clock position,
                so the spoke and its body can never disagree about where
                that is. `pathLength` normalises the line so the draw-in
                keyframe is the same 100 units for every candidate. */}
            {/* Path distance 0 is the centre and 100 the ring, which is
                what lets the draw-in run from the body inward. */}
            <line
              className="tf-cn__spoke"
              x1="50"
              y1="50"
              x2="50"
              y2={50 - RING_RADIUS}
              pathLength="100"
            />
            {/* Three nested transforms, and the nesting is the point.
                Outermost (above) is the static rotation to the facet's
                clock position. `__sweep` rotates about the figure's
                centre, which PRESERVES the distance from it — so a body
                mid-sweep is still exactly on the ring, and the sweep can
                carry a per-facet delay without any risk of a body
                drifting off the line. `__ride` then translates outward,
                undelayed and locked to the ring's own radius. Collapse
                the two into one transform and the stagger would have to
                come from the translate, which is precisely what pulls a
                body off the orbit. */}
            <g className="tf-cn__sweep" data-tf-facet={facet.id}>
              <g className="tf-cn__ride">
                <circle
                  className="tf-cn__body"
                  data-tf-facet={facet.id}
                  cx="50"
                  cy="50"
                  r={BODY_RADIUS}
                />
              </g>
            </g>
          </g>
        ))}
      </svg>

      {/* The subject: the work, and the people accountable for it. Two
          registers rather than two lines of the same thing — the second
          is smaller, quieter and ruled off, so it reads as who owns the
          first rather than as a second thing at the centre. */}
      <span className="tf-fig__core">
        <span className="tf-fig__core-main">{section.center}</span>
        {section.centerSub ? (
          <span className="tf-fig__core-sub">{section.centerSub}</span>
        ) : null}
      </span>

      {/* HTML, not SVG <text>. These size against the container and
          anchor off their own box, which is ordinary CSS here and
          hand-built geometry in SVG. They are `aria-hidden` because the
          figure already announces the same words through `aria-label` on
          the root — reading them twice is worse than not drawing them at
          all. */}
      {labels === "none" ? null : (
        <>
          {section.facets.map((facet) => (
            <span
              key={facet.id}
              className={`tf-cn__label tf-cn__label--${anchorFor(facet.angle)}`}
              style={polarPercent(LABEL_RADIUS, facet.angle)}
              data-tf-facet={facet.id}
              aria-hidden="true"
            >
              {facet.label}
            </span>
          ))}

          {/* Sits ON the boundary at 12 o'clock and knocks a hole in it,
              the way the nested-orbit labels do — a label beside a ring
              could belong to any ring, a label in the gap it cuts can
              only belong to that one. Framed, because it names the whole
              figure rather than a part of it, and a box is the one piece
              of chrome that says "everything inside this". */}
          {section.boundary ? (
            <span
              className="tf-fig__boundary-label"
              style={polarPercent(BOUNDARY_RADIUS, 0)}
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
