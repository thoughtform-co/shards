import type { Metadata } from "next";

import { v2Footer, v2Meta } from "./content";
import { FlywheelStage } from "./flywheel-stage";

/*
 * AI Operator — V2 landing page.
 *
 * A separate route from the canonical /ai-operator page so V1 stays
 * intact. V2 is a Legend-inspired re-cut of the first three chapters:
 * the Navigate / Encode / Build flywheel becomes the page's central
 * artifact and the surrounding text choreographs around it.
 *
 * The full design rationale and per-frame layouts live in
 * `flywheel-stage.tsx`. This file just wires header, stage, and
 * footer inside the route's parent layout chrome.
 */

export const metadata: Metadata = {
  title: "Vincent Buyssens · AI Operator (V2)",
  description:
    "AI capability built inside the work. Navigate. Encode. Build. A second cut of the AI Operator landing.",
  robots: { index: false, follow: false },
};

export default function AiOperatorV2Page() {
  return (
    <main className="aiop-stage aiop-v2">
      <header className="aiop-v2-header">
        <div className="aiop-v2-header__inner">
          <a className="aiop-v2-brand" href="#top">
            <span className="aiop-v2-brand__diamond" aria-hidden="true" />
            <span className="aiop-v2-brand__name">{v2Meta.brandName}</span>
            <span className="aiop-v2-brand__sub">{v2Meta.brandSub}</span>
          </a>

          <p className="aiop-v2-header__status" aria-label="Status">
            <span className="aiop-v2-header__pulse" aria-hidden="true" />
            {v2Meta.status}
          </p>

          <nav className="aiop-v2-header__nav" aria-label="Sections">
            {v2Meta.links.map((link) => (
              <a key={link.label} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>

          <a className="aiop-v2-header__cta" href={v2Meta.cta.href}>
            {v2Meta.cta.label}
          </a>
        </div>
      </header>

      <div id="top" />

      <FlywheelStage />

      <footer className="aiop-v2-footer">
        <div className="aiop-v2-footer__inner">
          <span>{v2Footer.line}</span>
          <span>{v2Footer.signature}</span>
          <span>{v2Footer.studio}</span>
        </div>
      </footer>
    </main>
  );
}
