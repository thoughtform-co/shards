import { type CSSProperties } from "react";

import { ledgerCase } from "./content";
import { ScreenshotGallery } from "./screenshot-gallery";

/*
 * CaseLedger — standalone Saga / Ledger product highlight row.
 *
 * Reuses the same `aiop-case-row` chrome the four production rows
 * (Mímir, Vesper, Babylon, Heimdall) ride on, so the visual rhythm
 * is identical: sticky rail with project metadata, challenge,
 * workflow shift, stack on the left; screenshot frame plus 2x2
 * capability grid on the right; accent token injected per-tone.
 *
 * Differences from `CaseRow` in `cases.tsx`:
 *   - No modal trigger. The action button is a plain `<a>` to the
 *     Link Collect landing page, opening in a new tab.
 *   - No walkthrough button. The Ledger walkthrough video doesn't
 *     exist yet, and the chat brief explicitly opted out of it.
 *   - No `01 / 04` num/total cell. The header meta strip uses the
 *     StripeTeaserCard `metaLabel · metaTag` pattern instead, so
 *     this single standalone row never reads as a fifth production
 *     case.
 *
 * Content lives in `ledgerCase` in `content.ts`, lifted from
 * `04_ledger.thoughtform/docs/AI_OPERATOR_PRODUCT_CARD.md`.
 *
 * The component is a server component; ScreenshotGallery itself is
 * a client island and handles its own state internally.
 */
/* Ledger's literal brand gold (#CAA554) from
 * `04_ledger.thoughtform/README.md`. The route's `--aiop-gold-bright`
 * token has been re-mapped to violet for Stripe alignment, so any case
 * row using `tone: "gold"` would actually render violet. Saga is
 * designed to read as Ledger gold so the row visually differentiates
 * from the violet teaser card directly above it in the closer arc.
 */
const LEDGER_GOLD = "#caa554";

export function CaseLedger() {
  const accentVar: CSSProperties = {
    ["--aiop-case-accent" as string]: LEDGER_GOLD,
  } as CSSProperties;

  return (
    <section
      className={`aiop-case-row aiop-case-row--${ledgerCase.tone} aiop-case-row--standalone`}
      id={`case-${ledgerCase.id}`}
      style={accentVar}
      aria-label="Case study: Saga, the Ledger financial command center"
    >
      <div className="aiop-wrap aiop-case-row__inner">
        <header className="aiop-case-row__meta aiop-reveal">
          <span className="aiop-case-row__teaser-tag">
            <span className="aiop-case-row__teaser-dot" aria-hidden="true" />
            {ledgerCase.metaLabel}
            <span
              className="aiop-case-row__teaser-tag-divider"
              aria-hidden="true"
            >
              ·
            </span>
            {ledgerCase.metaTag}
          </span>
          <span className="aiop-case-row__divider" aria-hidden="true" />
          <span className="aiop-case-row__team">{ledgerCase.team}</span>
          <a
            className="aiop-case-row__cta"
            href={ledgerCase.cta.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open the Link Collect landing page in a new tab"
          >
            {ledgerCase.cta.label}
            <svg
              width="12"
              height="12"
              viewBox="0 0 14 14"
              aria-hidden="true"
            >
              <path
                d="M3 7h8M8 4l3 3-3 3"
                stroke="currentColor"
                strokeWidth="1.4"
                fill="none"
              />
            </svg>
          </a>
        </header>

        <div className="aiop-case-row__grid">
          <aside className="aiop-case-row__rail">
            <div className="aiop-rail-block aiop-reveal">
              <p className="aiop-rail-block__eyebrow">
                Project
                <span
                  className={`aiop-rail-block__status aiop-rail-block__status--${ledgerCase.status.toLowerCase()}`}
                  aria-label={`${ledgerCase.status} status`}
                  title={ledgerCase.status}
                />
              </p>
              <h3 className="aiop-case-row__name">
                {ledgerCase.name}
                <em>{ledgerCase.nameEm}</em>
                <span className="aiop-case-row__period">.</span>
              </h3>
              <p
                className="aiop-case-row__codename"
                aria-label={`Codename ${ledgerCase.codename}${ledgerCase.codenameEm}`}
              >
                {ledgerCase.codename}
                <em>{ledgerCase.codenameEm}</em>
                <span className="aiop-case-row__period">.</span>
              </p>
              <p className="aiop-case-row__tagline">{ledgerCase.tagline}</p>
              <p className="aiop-case-row__subline">{ledgerCase.subline}</p>
            </div>

            <div className="aiop-rail-block aiop-reveal">
              <p className="aiop-rail-block__eyebrow">Challenge</p>
              <p className="aiop-case-row__lede">{ledgerCase.challenge}</p>
            </div>

            <div className="aiop-rail-block aiop-reveal">
              <p className="aiop-rail-block__eyebrow">Workflow shift</p>
              <div className="aiop-case-row__workflow">
                <span
                  className={`aiop-cases__mode aiop-cases__mode--${ledgerCase.workflowMode.toLowerCase()}`}
                >
                  {ledgerCase.workflowMode}
                </span>
                <p className="aiop-case-row__workflow-text">
                  {ledgerCase.workflowAfter}
                </p>
              </div>
            </div>

            <div className="aiop-rail-block aiop-reveal">
              <p className="aiop-rail-block__eyebrow">Stack</p>
              <div className="aiop-case-row__chips">
                {ledgerCase.stack.map((item) => (
                  <span key={item} className="aiop-case-row__chip">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </aside>

          <div className="aiop-case-row__shot aiop-reveal">
            <div className="aiop-shot-frame">
              {ledgerCase.screenshots.length > 1 ? (
                <ScreenshotGallery
                  screenshots={ledgerCase.screenshots}
                  name={`${ledgerCase.name}${ledgerCase.nameEm}`}
                />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={
                    ledgerCase.screenshots[0]?.src ?? ledgerCase.image
                  }
                  alt={
                    ledgerCase.screenshots[0]?.alt ??
                    `${ledgerCase.name}${ledgerCase.nameEm} screenshot`
                  }
                  loading="lazy"
                />
              )}
            </div>

            <ul className="aiop-case-row__caps" role="list">
              {ledgerCase.capabilities.slice(0, 4).map((cap) => (
                <li key={cap.k} className="aiop-case-row__cap">
                  <p className="aiop-case-row__cap-k">{cap.k}</p>
                  <p className="aiop-case-row__cap-v">{cap.v}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

