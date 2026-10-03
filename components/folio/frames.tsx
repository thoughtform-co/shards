import type { ReactNode } from "react";
import specs from "@/content/folio-frames.json";
import { fill, frames as copy, hero } from "@/content/folio-copy";
import { MockActivity } from "./mock-activity";
import { MockAgent } from "./mock-agent";
import { MockConsent } from "./mock-consent";
import { MockInbox } from "./mock-inbox";
import { vars, Wordmark } from "./primitives";

/*
 * Social artboards. Each renders at a fixed CSS size and is captured at 2x
 * by scripts/export-folio-social.mjs, so a 540x675 artboard becomes a
 * 1080x1350 PNG. They reuse the page's mockups, never copies of them.
 */

export interface FrameSpec {
  slug: string;
  w: number;
  h: number;
  out: string;
}

export const frameSpecs: FrameSpec[] = specs;

const portrait: Record<string, { title: string; scale: number; fade?: boolean; visual: ReactNode }> = {
  month: {
    title: fill(copy.month),
    scale: 0.92,
    visual: <MockActivity state="before" rows={9} />,
  },
  endpoint: {
    title: copy.endpoint,
    scale: 0.84,
    visual: <MockActivity split rows={3} />,
  },
  approval: {
    title: fill(copy.approval),
    scale: 0.86,
    visual: <MockConsent />,
  },
  agent: {
    title: copy.agent,
    scale: 0.9,
    visual: <MockAgent />,
  },
};

export function FrameArtboard({ spec }: { spec: FrameSpec }) {
  const size = vars({ "--fw": `${spec.w}px`, "--fh": `${spec.h}px` });

  if (spec.slug === "og") {
    return (
      <div className="fo-frame fo-frame--og" data-folio-frame="og" style={size}>
        <div className="fo-frame__og-copy">
          <div className="fo-frame__head">
            <Wordmark size={20} />
            <span className="fo-badge">Concept</span>
          </div>
          <h2 className="fo-frame__og-title">
            {hero.titleLines.map((l) => (
              <span key={l}>{l}</span>
            ))}
          </h2>
          <p className="fo-frame__og-sub">One read-only grant at the payment layer, for your agent and your accountant.</p>
        </div>
        <div className="fo-frame__og-visual">
          <div className="fo-frame__scaler" style={vars({ "--s": 0.72 })}>
            <MockInbox maxRows={5} />
          </div>
        </div>
      </div>
    );
  }

  const f = portrait[spec.slug];
  if (!f) return null;

  return (
    <div className="fo-frame" data-folio-frame={spec.slug} style={size}>
      <div className="fo-frame__head">
        <Wordmark size={18} />
        <span className="fo-badge">Concept</span>
      </div>
      <h2 className="fo-frame__title">{f.title}</h2>
      <div className={`fo-frame__visual${f.fade ? " fo-frame__visual--fade" : ""}`}>
        <div className="fo-frame__scaler" style={vars({ "--s": f.scale })}>
          {f.visual}
        </div>
      </div>
      <p className="fo-frame__foot">{copy.footnote}</p>
    </div>
  );
}
