import { useCallback, useState, type CSSProperties, type ReactNode } from "react";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  Easing,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import { MockActivity } from "@/components/folio/mock-activity";
import { MockConsent } from "@/components/folio/mock-consent";
import { NotificationStack } from "@/components/folio/notification-stack";
import { PayCard } from "@/components/folio/pay-card";
import { Monogram, Pill, Wordmark, type PillTone } from "@/components/folio/primitives";
import { Ribbon } from "@/components/folio/ribbon";
import { WorkflowCards } from "@/components/folio/workflow-cards";
import { GET_LABEL, vendorById, vendors, type GetKind } from "@/content/folio";
import { fill, frames as frameCopy, problem, stripe } from "@/content/folio-copy";

import { BEAT, events, scenes, type SceneKey } from "./beats";

/*
 * Folio, the launch film. 4:5, 26 seconds, 52 beats at 120 BPM.
 *
 * Thesis: paying for software already takes one tap; collecting its invoice
 * is a hunt across a dozen billing pages. The hinge is the tap itself: the
 * same press and ripple pays (beat 2), approves Folio (beat 30) and sends
 * September to the accountant (beat 42).
 *
 * Restraint budget: white paper and navy ink; one purple, for the tap; the
 * ribbon is the only colour field and it arrives at the switch, never
 * before. Two faces (the page's). Three entrances: words rise, mocks spring
 * up, stacked items drop. Act one holds its type two beats, cuts the hunt
 * on half-beats and pushes only into the pile-up; act two cuts every five to
 * seven beats and is never still.
 *
 * The screens are the page's own components, rendered, never redrawn. Copy
 * comes from content/folio-copy.ts where the page already says it; the few
 * film-only lines are below, each a cut of a page sentence.
 */

const film = {
  pay: ["Paying takes", "one tap."], // problem.strong, cut
  collect: ["Now find", "the invoice."],
  twelveA: `${fill("{vendors}")} billing portals.`,
  twelveB: `${fill("{vendors}")} sign-ins.`,
  weeks: problem.collectCaption, // "Three weeks of next week."
  fetch: frameCopy.agent, // "If an agent can pay, it can fetch the invoice."
  approve: ["One approval.", "Read-only, per card."],
  arrive: ["Every charge arrives", "with its invoice."],
  ask: ["One question", "a month."],
  end: stripe.closer, // "Ship it, or buy us."
  endSub: "Invoices for everything your agent pays for.",
};

/* The hunt: eight of the twelve, chosen for how differently they fail. */
const HUNT = ["kestrel", "cobalt", "sable", "ferry", "halftone", "meshwork", "quarry", "lumen"];

const HUNT_TONE: Record<GetKind, PillTone> = {
  pdf: "muted",
  "pdf-each": "warn",
  hosted: "warn",
  popup: "red",
  email: "warn",
  receipt: "red",
  owner: "warn",
  "per-project": "muted",
  image: "red",
  statement: "warn",
  zip: "muted",
};

/* ── Motion vocabulary ──────────────────────────────────────────────── */

const out = Easing.bezier(0.16, 1, 0.3, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const ramp = (f: number, from: number, dur: number, ease = out) =>
  interpolate(f, [from, from + dur], [0, 1], { ...clamp, easing: ease });

const vars = (map: Record<string, string | number>) => map as CSSProperties;

/* Entrance one: words rise, two frames apart. */
function Words({ text, at, frame, className }: { text: string; at: number; frame: number; className?: string }) {
  const words = text.split(" ");
  return (
    <span className={`film-line ${className ?? ""}`}>
      {words.map((w, i) => {
        const t = ramp(frame, at + i * 2, 7);
        return (
          <span
            key={i}
            className="film-word"
            style={{ opacity: t, transform: `translateY(${(1 - t) * 0.32}em)` }}
          >
            {w}
            {i < words.length - 1 ? " " : ""}
          </span>
        );
      })}
    </span>
  );
}

/* Entrance two: a mock springs up into place. */
function useRise(frame: number, at: number) {
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: { damping: 18, mass: 0.7, stiffness: 140 } });
  return { opacity: Math.min(1, s * 1.6), y: (1 - s) * 60 };
}

/* The tap: press in, release, a ripple from the button's centre, then the
   button says what happened. `at` is relative to the scene. */
function tapVars(frame: number, at: number): CSSProperties {
  const press = interpolate(frame, [at - 3, at, at + 5], [1, 0.955, 1], clamp);
  const ripple = ramp(frame, at, 14);
  const rippleO = interpolate(frame, [at, at + 2, at + 14], [0, 1, 0], clamp);
  // The old label leaves before the new one arrives, so they never overlap.
  const old = 1 - ramp(frame, at, 3);
  const done = ramp(frame, at + 3, 6);
  return vars({ "--press": press, "--ripple": ripple, "--ripple-o": rippleO, "--old": old, "--done": done });
}

/* Act two is never still: a slow push across the whole scene. */
function push(frame: number, dur: number, amount = 0.03) {
  return `scale(${1 + amount * interpolate(frame, [0, dur], [0, 1], clamp)})`;
}

const len = (k: SceneKey) => scenes[k].to - scenes[k].from;
const rel = (k: SceneKey, abs: number) => abs - scenes[k].from;

function Head() {
  return (
    <div className="film-head">
      <Wordmark size={18} />
      <span className="fo-badge">Concept</span>
    </div>
  );
}

function Stage({ children, className, style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <div className={`film-stage ${className ?? ""}`} style={style}>
      {children}
    </div>
  );
}

function Mock({ width, top, scale, y = 0, opacity = 1, children }: { width: number; top: number; scale: number; y?: number; opacity?: number; children: ReactNode }) {
  return (
    <div
      className="film-mock"
      style={{ width, top, marginLeft: -width / 2, opacity, transform: `translateY(${y}px) scale(${scale})` }}
    >
      {children}
    </div>
  );
}

/* ── Act one: the hunt ──────────────────────────────────────────────── */

function Pay() {
  const f = useCurrentFrame();
  const at = rel("pay", events.payTap);
  // Frame 0 is a finished picture: type and card already set. The card
  // breathes so the opening is alive before the tap.
  const bob = Math.sin((f / BEAT) * Math.PI) * 1.5;
  return (
    <Stage className="film-tap" style={tapVars(f, at)}>
      <Head />
      <h1 className="film-type film-type--xl" style={{ top: 96 }}>
        <span className="film-line">{film.pay[0]}</span>
        <span className="film-line">{film.pay[1]}</span>
      </h1>
      <Mock width={350} top={262} scale={1.3} y={bob}>
        <PayCard />
      </Mock>
    </Stage>
  );
}

function Collect() {
  const f = useCurrentFrame();
  return (
    <Stage>
      <h1 className="film-type film-type--xl" style={{ top: 250 }}>
        <Words text={film.collect[0]} at={-3} frame={f} />
        <Words text={film.collect[1]} at={0} frame={f} className="soft" />
      </h1>
    </Stage>
  );
}

function Hunt() {
  const f = useCurrentFrame();
  const cuts = events.huntCuts.map((c) => rel("hunt", c));
  let i = 0;
  while (i + 1 < cuts.length && f >= cuts[i + 1]) i++;
  const vendor = vendorById(HUNT[i]);
  const local = f - cuts[i];
  // Hard cut with a three-frame punch: the new card lands slightly large.
  const punch = 1 + 0.05 * (1 - ramp(local, 0, 4));
  return (
    <Stage>
      <span className="film-hunt__label">Where the invoice is</span>
      <span className="film-hunt__count">
        <b>{String(i + 1).padStart(2, "0")}</b> / {vendors.length}
      </span>
      <div className="film-hunt" style={{ transform: `scale(${punch})` }}>
        <div className="film-hunt__vendor">
          <Monogram vendor={vendor} size={84} />
          <span>{vendor.name}</span>
        </div>
        <div className="film-hunt__bar">
          <svg width="14" height="16" viewBox="0 0 14 16" aria-hidden="true">
            <rect x="1.5" y="7" width="11" height="8" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
            <path d="M4 7V4.8a3 3 0 0 1 6 0V7" fill="none" stroke="currentColor" strokeWidth="1.6" />
          </svg>
          {vendor.portal.path}
        </div>
        <div className="film-hunt__get">
          <Pill tone={HUNT_TONE[vendor.portal.get]}>{GET_LABEL[vendor.portal.get]}</Pill>
        </div>
        <div className="film-hunt__sign">Sign in: {vendor.portal.signIn}</div>
      </div>
    </Stage>
  );
}

function Twelve() {
  const f = useCurrentFrame();
  const swap = rel("twelve", events.twelveB);
  const second = f >= swap;
  return (
    <Stage>
      <h1 className="film-type film-type--l" style={{ top: 70 }}>
        {second ? (
          <Words key="b" text={film.twelveB} at={swap - 3} frame={f} />
        ) : (
          <Words key="a" text={film.twelveA} at={-3} frame={f} />
        )}
      </h1>
      <div className="film-grid">
        {vendors.map((v, i) => {
          const t = ramp(f, i * 0.6, 5);
          const s = ramp(f, swap + i * 0.5, 5);
          return (
            <div className="film-grid__cell" key={v.id} style={{ opacity: t, transform: `scale(${0.7 + 0.3 * t})` }}>
              <Monogram vendor={v} size={54} />
              <span className="film-grid__sign" style={{ opacity: s }}>
                {v.portal.signIn}
              </span>
            </div>
          );
        })}
      </div>
    </Stage>
  );
}

/* Measure where each notification starts, once, so the stack can be pushed
   down by exactly the room the newcomer takes (the mail group carries an
   extra margin for its stacked edges, so heights alone would be wrong). */
function useItemTops() {
  const [tops, setTops] = useState<number[] | null>(null);
  const [handle] = useState(() => delayRender("Measuring the notification stack"));
  const ref = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node) return;
      const items = Array.from(node.querySelectorAll<HTMLElement>(".fo-notif__item"));
      const last = items[items.length - 1];
      const starts = items.map((el) => el.offsetTop);
      setTops(last ? [...starts, last.offsetTop + last.offsetHeight + 8] : starts);
      continueRender(handle);
    },
    [handle],
  );
  return { ref, tops };
}

function Pile() {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { ref, tops } = useItemTops();
  const drops = events.pileDrops.map((d) => rel("pile", d));
  const total = problem.notifications.length;

  let shown = 0;
  while (shown < drops.length && f >= drops[shown]) shown++;
  // The first lands just before the cut, so the cut never opens on an empty wall.
  const at = drops[Math.max(0, shown - 1)] - (shown === 1 ? 4 : 0);
  const local = f - at;

  // The list is newest first, the oldest arrive first. With `shown` on screen
  // the top visible item is index k; everything above it sits out of the wall.
  const k = total - shown;
  const above = (n: number) => (tops ? tops[Math.min(n, tops.length - 1)] - tops[0] : 0);
  // Entrance two, with weight: the stack is shoved down by the newcomer and
  // overshoots a little before it settles.
  const shove = spring({ frame: local, fps, config: { damping: 11, stiffness: 190, mass: 0.75 } });
  const offset = -(above(k + 1) + (above(k) - above(k + 1)) * shove);
  const enter = ramp(f, at, 5);

  const css = Array.from({ length: total }, (_, i) => {
    if (i < k) return `.film-pile .fo-notif__item:nth-child(${i + 1}) { opacity: 0; }`;
    if (i === k)
      return `.film-pile .fo-notif__item:nth-child(${i + 1}) { opacity: ${enter}; filter: blur(${(1 - enter) * 5}px); transform: scale(${1.05 - 0.05 * enter}); transform-origin: 50% 0; }`;
    return "";
  }).join("\n");

  // Each landing knocks the phone down a few pixels; the knock decays fast.
  const knock = local >= 0 && local < 10 ? Math.sin((local / 10) * Math.PI) * 5 * (1 - local / 10) : 0;
  // The missed call buzzes and rings red twice.
  const callAt = drops[drops.length - 1];
  const c = f - callAt;
  const buzz = c >= 0 && c < 14 ? Math.sin(c * 2.6) * 3.5 * (1 - c / 14) : 0;
  const ring = c >= 0 && c < 30 ? (c % 15) / 15 : 0;
  // Tension: a slow push and a darkening edge as the pile grows.
  const fill01 = interpolate(f, [0, len("pile")], [0, 1], clamp);
  return (
    <Stage
      className="film-pile"
      style={vars({ "--ring": ring, "--ring-on": c >= 0 && c < 30 ? 1 : 0, "--list-y": `${offset}px` })}
    >
      <style>{css}</style>
      <span className="film-hunt__label">{fill("{vendors} vendors, one month")}</span>
      <div className="film-camera" style={{ transform: `scale(${1 + 0.07 * fill01})` }}>
        <Mock width={520} top={78} scale={0.95} y={knock}>
          <div ref={ref} className="film-pile__phone" style={{ transform: `translateX(${buzz}px)` }}>
            <NotificationStack />
          </div>
        </Mock>
      </div>
      <div className="film-vignette" style={{ opacity: 0.25 + 0.75 * fill01 }} />
    </Stage>
  );
}

function Weeks() {
  const f = useCurrentFrame();
  const cut = film.weeks.indexOf(" of ");
  const [a, b] = [film.weeks.slice(0, cut), film.weeks.slice(cut + 1)];
  return (
    <Stage>
      <h1 className="film-type film-type--xl" style={{ top: 250 }}>
        <Words text={a} at={-3} frame={f} />
        <Words text={b} at={0} frame={f} className="soft" />
      </h1>
    </Stage>
  );
}

/* ── Act two: one approval ──────────────────────────────────────────── */

function RibbonIn({ frame, className = "film-frame-ribbon", from = 0 }: { frame: number; className?: string; from?: number }) {
  const t = ramp(frame, from, 24);
  const drift = interpolate(frame, [0, 120], [0, -14], { extrapolateRight: "extend" });
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: -1, opacity: t, transform: `translate(${(1 - t) * 60 + drift * 0.4}px, ${(1 - t) * -40 + drift}px)` }}>
      <Ribbon id={`film-rb-${className}`} className={className} />
    </div>
  );
}

function Fetch() {
  const f = useCurrentFrame();
  const line2 = rel("fetch", events.fetchLine2);
  const [a, b] = film.fetch.split(", ");
  return (
    <Stage>
      <RibbonIn frame={f} />
      <div className="film-camera" style={{ transform: push(f, len("fetch"), 0.02) }}>
        <h1 className="film-type film-type--l" style={{ top: 230 }}>
          <Words text={`${a},`} at={-3} frame={f} className="soft" />
          <Words text={b} at={line2} frame={f} />
        </h1>
      </div>
    </Stage>
  );
}

function Approve() {
  const f = useCurrentFrame();
  const rise = useRise(f, -5);
  const at = rel("approve", events.approveTap);
  return (
    <Stage className="film-tap" style={tapVars(f, at)}>
      <RibbonIn frame={f + 30} />
      <Head />
      <div className="film-camera" style={{ transform: push(f, len("approve")) }}>
        <h2 className="film-type film-type--m" style={{ top: 92 }}>
          <Words text={film.approve[0]} at={-4} frame={f} />
          <Words text={film.approve[1]} at={0} frame={f} className="soft" />
        </h2>
        <Mock width={440} top={196} scale={1} y={rise.y} opacity={rise.opacity}>
          <MockConsent />
        </Mock>
      </div>
    </Stage>
  );
}

function Arrive() {
  const f = useCurrentFrame();
  const rise = useRise(f, -5);
  const docs = events.arriveDocs.map((d) => rel("arrive", d));
  const total = ramp(f, rel("arrive", events.arriveTotal), 8);
  // Each row's invoice drops in on its half-beat, top to bottom.
  const css = docs
    .map((d, i) => {
      const t = ramp(f, d, 6);
      return `.film-arrive .fo-wallet__row:nth-child(${i + 1}) .fo-wallet__doc { opacity: ${t}; transform: translateY(${(1 - t) * -10}px) scale(${0.85 + 0.15 * t}); }`;
    })
    .join("\n");
  return (
    <Stage className="film-arrive" style={vars({ "--total": total })}>
      <style>{css}</style>
      <RibbonIn frame={f + 120} />
      <Head />
      <div className="film-camera" style={{ transform: push(f, len("arrive")) }}>
        <h2 className="film-type film-type--m" style={{ top: 92 }}>
          <Words text={film.arrive[0]} at={-4} frame={f} />
          <Words text={film.arrive[1]} at={0} frame={f} className="soft" />
        </h2>
        <Mock width={520} top={196} scale={0.9} y={rise.y} opacity={rise.opacity}>
          <MockActivity state="after" rows={8} />
        </Mock>
      </div>
    </Stage>
  );
}

function Ask() {
  const f = useCurrentFrame();
  const rise = useRise(f, -5);
  const at = rel("ask", events.askTap);
  return (
    <Stage className="film-tap" style={tapVars(f, at)}>
      <RibbonIn frame={f + 300} />
      <Head />
      <div className="film-camera" style={{ transform: push(f, len("ask")) }}>
        <h2 className="film-type film-type--m" style={{ top: 92 }}>
          <Words text={film.ask[0]} at={-4} frame={f} />
          <Words text={film.ask[1]} at={0} frame={f} className="soft" />
        </h2>
        <Mock width={400} top={250} scale={1.17} y={rise.y} opacity={rise.opacity}>
          <WorkflowCards only={["close"]} />
        </Mock>
      </div>
    </Stage>
  );
}

function End() {
  const f = useCurrentFrame();
  const mark = ramp(f, -4, 10);
  const [a, b] = film.end.split(", ");
  return (
    <Stage>
      <RibbonIn frame={f + 400} className="film-end__ribbon" />
      <div className="film-camera" style={{ transform: push(f, len("end"), 0.015) }}>
        <div className="film-head" style={{ top: 240, opacity: mark, transform: `translateY(${(1 - mark) * 10}px)` }}>
          <Wordmark size={30} />
          <span className="fo-badge" style={{ fontSize: 15, padding: "4px 11px" }}>
            Concept
          </span>
        </div>
        <h1 className="film-type film-type--xl" style={{ top: 308 }}>
          <Words text={`${a},`} at={-2} frame={f} />
          <Words text={b} at={4} frame={f} />
        </h1>
        <p className="film-end__sub" style={{ top: 452, opacity: ramp(f, 12, 10) }}>
          {film.endSub}
        </p>
      </div>
      <p className="film-foot" style={{ opacity: ramp(f, 16, 10) }}>
        {frameCopy.footnote}
      </p>
    </Stage>
  );
}

/* ── The cut ─────────────────────────────────────────────────────────── */

const ORDER: Array<[SceneKey, () => ReactNode]> = [
  ["pay", Pay],
  ["collect", Collect],
  ["hunt", Hunt],
  ["twelve", Twelve],
  ["pile", Pile],
  ["weeks", Weeks],
  ["fetch", Fetch],
  ["approve", Approve],
  ["arrive", Arrive],
  ["ask", Ask],
  ["end", End],
];

export function FolioLaunch() {
  return (
    <AbsoluteFill
      className="folio-shell film"
      style={vars({ "--fo-font-sans": '"Inter Tight"', "--fo-font-mono": '"Source Code Pro"' })}
    >
      {ORDER.map(([key, Scene]) => (
        <Sequence key={key} name={key} from={scenes[key].from} durationInFrames={len(key)} layout="none">
          <Scene />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
}
