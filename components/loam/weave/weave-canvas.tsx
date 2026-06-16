import Image from "next/image";

/*
 * Weave canvas — the hero centrepiece for the Weave direction.
 *
 * A node graph in the Figma Weave idiom: media/spec cards laid out on a
 * light blueprint canvas and woven together by thin bezier connectors
 * with small port dots. The flow reads left to right:
 *
 *   inputs (brief, brand voice, performance)  ->  LOAM substrate
 *   ->  surfaces (campaign, agent, chat)
 *
 * which is exactly the Loam pitch: the team's raw inputs woven through
 * the encoded judgment layer into every surface.
 *
 * Geometry lives in one 1200x600 coordinate space. Cards are absolutely
 * positioned as a fraction of that space (via --x/--y/--w/--h custom
 * properties) and the SVG connectors use the same viewBox, so HTML and
 * SVG stay aligned at any width. The stage is locked to a 2:1 aspect so
 * the fractions map 1:1 with the viewBox (no letterboxing). Below the
 * mobile breakpoint the CSS reflows the cards into a simple stack and
 * hides the connectors.
 *
 * Server component: no client JS. The canvas is static and renders in
 * the initial paint, which keeps the hero fast and screenshot-stable.
 */

const W = 1200;
const H = 600;
const pct = (n: number, total: number) => `${(n / total) * 100}%`;

type Node = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  model: string;
  kind: "image" | "text" | "swatch" | "substrate" | "surface";
  img?: string;
  text?: string;
  swatch?: string[];
  chips?: string[];
  surfaceIcon?: string;
};

const nodes: Node[] = [
  {
    id: "brief",
    x: 24,
    y: 70,
    w: 224,
    h: 132,
    label: "Brief",
    model: "Input",
    kind: "text",
    text: "Q3 launch. Hero film plus 40 paid cuts. Keep the brand's dry wit, never salesy.",
  },
  {
    id: "voice",
    x: 24,
    y: 300,
    w: 224,
    h: 132,
    label: "Brand voice",
    model: "Reference",
    kind: "swatch",
    swatch: ["#1f3329", "#b0593a", "#cdee65", "#e7dec4"],
  },
  {
    id: "substrate",
    x: 446,
    y: 150,
    w: 308,
    h: 300,
    label: "Loam",
    model: "Encoded substrate",
    kind: "substrate",
    chips: [
      "rules / how the team decides",
      "examples / what good looks like",
      "voice / how the brand sounds",
      "loops / who confirms what",
    ],
  },
  {
    id: "campaign",
    x: 952,
    y: 44,
    w: 224,
    h: 176,
    label: "Campaign",
    model: "Output",
    kind: "image",
    img: "/loam/living-hero.png",
  },
  {
    id: "agent",
    x: 952,
    y: 250,
    w: 224,
    h: 104,
    label: "Agent",
    model: "Surface",
    kind: "surface",
    surfaceIcon: "{ }",
    text: "Runs the recurring cuts overnight.",
  },
  {
    id: "chat",
    x: 952,
    y: 392,
    w: 224,
    h: 104,
    label: "Chat",
    model: "Surface",
    kind: "surface",
    surfaceIcon: "C",
    text: "Drafts in the team's own voice.",
  },
];

/* Connectors as [fromX,fromY,toX,toY, accent?]. Ports are placed on
   card edges in the same 1200x600 space. */
type Edge = { x1: number; y1: number; x2: number; y2: number; accent?: boolean };
const edges: Edge[] = [
  { x1: 248, y1: 136, x2: 446, y2: 250 }, // brief -> substrate
  { x1: 248, y1: 366, x2: 446, y2: 350 }, // voice -> substrate
  { x1: 754, y1: 250, x2: 952, y2: 132, accent: true }, // substrate -> campaign
  { x1: 754, y1: 300, x2: 952, y2: 302 }, // substrate -> agent
  { x1: 754, y1: 360, x2: 952, y2: 444 }, // substrate -> chat
];

function edgePath(e: Edge): string {
  const dx = Math.max(60, (e.x2 - e.x1) * 0.5);
  return `M ${e.x1} ${e.y1} C ${e.x1 + dx} ${e.y1}, ${e.x2 - dx} ${e.y2}, ${e.x2} ${e.y2}`;
}

export function WeaveCanvas() {
  return (
    <div className="weave-canvas" role="img" aria-label="A node graph weaving brief and brand voice through the encoded Loam layer into a campaign, an agent and a chat surface">
      <svg
        className="weave-canvas__wires"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {edges.map((e, i) => (
          <g key={i} className={e.accent ? "weave-wire is-accent" : "weave-wire"}>
            <path d={edgePath(e)} />
            <circle cx={e.x1} cy={e.y1} r={5} className="weave-port" />
            <circle cx={e.x2} cy={e.y2} r={5} className="weave-port" />
          </g>
        ))}
      </svg>

      {nodes.map((n) => (
        <article
          key={n.id}
          className={`weave-node weave-node--${n.kind}`}
          style={
            {
              "--x": pct(n.x, W),
              "--y": pct(n.y, H),
              "--w": pct(n.w, W),
              "--h": pct(n.h, H),
            } as React.CSSProperties
          }
        >
          <header className="weave-node__head">
            <span className="weave-node__label">{n.label}</span>
            <span className="weave-node__model">{n.model}</span>
          </header>

          {n.kind === "image" && n.img ? (
            <div className="weave-node__media">
              <Image src={n.img} alt="" fill sizes="240px" style={{ objectFit: "cover" }} />
            </div>
          ) : null}

          {n.kind === "text" ? <p className="weave-node__text">{n.text}</p> : null}

          {n.kind === "swatch" && n.swatch ? (
            <div className="weave-node__swatches">
              {n.swatch.map((c) => (
                <span key={c} style={{ background: c }} />
              ))}
            </div>
          ) : null}

          {n.kind === "substrate" && n.chips ? (
            <ul className="weave-node__chips" role="list">
              {n.chips.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          ) : null}

          {n.kind === "surface" ? (
            <div className="weave-node__surface">
              <span className="weave-node__surface-icon" aria-hidden="true">
                {n.surfaceIcon}
              </span>
              <p className="weave-node__text">{n.text}</p>
            </div>
          ) : null}
        </article>
      ))}
    </div>
  );
}
