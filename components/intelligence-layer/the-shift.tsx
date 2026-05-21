"use client";

import { useRole } from "./role-context";

/**
 * 04 The Shift — "From rules engineered to context encoded."
 *
 * Two-column compare. Left: a brittle list of `if x: y` rules with a
 * "...more rules" tail, captioned by `COVERAGE GROWS BY ADDING RULES`.
 * Right: one Skill block sitting on an Intelligence base, captioned by
 * `COVERAGE GROWS BY IMPROVING CONTEXT`. Below: a three-cell strip
 * naming the bottleneck / delivery / governance shifts.
 *
 * Reads `shiftCopy` from the active role so the rules-side examples
 * and section copy can be role-specific (Product Design uses portfolio
 * rules; Ecom PM uses Monday-automation snippets).
 *
 * SVG colours come from the Aether palette via hex literals (SVG
 * `fill`/`stroke` cannot read CSS custom properties through tokens
 * embedded in attribute values reliably across browsers, so we keep
 * the canonical hex pinned here):
 *
 *   --violet      #6243b9
 *   --paper       #f3ebd9
 *   --paper-2     #ece2cc
 *   --paper-3     #e2d6bc
 *   --ink         #252427
 *   --ink-soft    #3a393e
 *   --muted       #6c6970
 */
export function TheShift() {
  const { role } = useRole();
  const { shiftCopy } = role;

  return (
    <section
      className="section je-shift-section"
      id="shift"
      aria-labelledby="shift-title"
    >
      <div className="wrap">
        {/* Section header uses the homepage's two-column grammar
            (`.aiop-section-head` = title-left / sub-right at ≥800px)
            so this beat reads in the same typographic rhythm as
            EnginePattern, Vision, and Approach above it. The
            eyebrow is kept on its own line above the grid because
            it's a tiny mono caps tag, not a header column.
            We stay on the legacy `.reveal` class (driven by
            SharedScrollReveal) because the rest of this section's
            inner blocks also use it; mixing the two reveal classes
            inside one `je-*` section would leave the header invisible
            on initial paint if OperatorScrollReveal's effect runs
            before this part of the suspended tree commits. */}
        <header className="aiop-section-head je-shift-section__head reveal">
          {shiftCopy.eyebrow ? (
            <p className="eyebrow eyebrow--violet">{shiftCopy.eyebrow}</p>
          ) : null}
          <h2 className="aiop-section-title" id="shift-title">
            {shiftCopy.titlePre} <em>{shiftCopy.titleEm}</em>
          </h2>
          {/* Lede is route-local, not role-local. The previous copy
              was Mímir-specific (ranker / LF8 / arc completeness)
              which broke the high-level register the rest of the
              page reads in. The hardcoded line below names why the
              new contract is different — context over rules — and
              sets up the side-by-side visualisation underneath. */}
          <p className="aiop-section-head__sub">
            The old contract was rules &mdash; every edge case spelled
            out, every rule maintained. These Skills swap that contract
            for context: what the team decides, how it sounds, what good
            looks like, encoded once and reused.
          </p>
        </header>

        <div className="je-shift reveal">
          <article className="je-shift__col" data-side="old">
            <span className="je-shift__col-label">{shiftCopy.old.label}</span>
            <svg
              className="je-shift__svg"
              viewBox="0 0 420 250"
              role="img"
              aria-label="Rules engine with many brittle rules"
              xmlns="http://www.w3.org/2000/svg"
            >
              <text
                x="210"
                y="18"
                textAnchor="middle"
                fill="#6c6970"
                fontFamily="var(--font-mono), monospace"
                fontSize="10"
                letterSpacing="1.5"
              >
                {shiftCopy.old.headline}
              </text>
              {shiftCopy.old.rules.map((rule, i) => (
                <g key={rule}>
                  <rect
                    x="40"
                    y={38 + i * 30}
                    width="340"
                    height="25"
                    rx="3"
                    fill="#fffaee"
                    stroke="rgba(37, 36, 39, 0.15)"
                  />
                  <text
                    x="54"
                    y={55 + i * 30}
                    fill="#3a393e"
                    fontFamily="var(--font-mono), monospace"
                    fontSize="11"
                  >
                    {rule}
                  </text>
                </g>
              ))}
              <rect
                x="40"
                y={38 + shiftCopy.old.rules.length * 30}
                width="340"
                height="25"
                rx="3"
                fill="#fffaee"
                stroke="rgba(98, 67, 185, 0.55)"
                strokeDasharray="3,2"
              />
              <text
                x="210"
                y={55 + shiftCopy.old.rules.length * 30}
                textAnchor="middle"
                fill="#6243b9"
                fontFamily="var(--font-mono), monospace"
                fontSize="11"
              >
                {shiftCopy.old.moreLine}
              </text>
              <text
                x="210"
                y="240"
                textAnchor="middle"
                fill="#6c6970"
                fontFamily="var(--font-mono), monospace"
                fontSize="10"
                letterSpacing="1.3"
              >
                {shiftCopy.old.footnote}
              </text>
            </svg>
            <p className="je-shift__caption">{shiftCopy.old.caption}</p>
          </article>

          <article className="je-shift__col je-shift__col--new" data-side="new">
            <span className="je-shift__col-label">{shiftCopy.next.label}</span>
            <svg
              className="je-shift__svg"
              viewBox="0 0 420 250"
              role="img"
              aria-label="Skill contract sitting on an intelligence foundation"
              xmlns="http://www.w3.org/2000/svg"
            >
              <text
                x="210"
                y="18"
                textAnchor="middle"
                fill="#6c6970"
                fontFamily="var(--font-mono), monospace"
                fontSize="10"
                letterSpacing="1.5"
              >
                {shiftCopy.next.headline}
              </text>

              <rect
                x="80"
                y="38"
                width="260"
                height="82"
                rx="7"
                fill="rgba(98, 67, 185, 0.10)"
                stroke="#6243b9"
                strokeWidth="1.4"
              />
              <text
                x="210"
                y="62"
                textAnchor="middle"
                fill="#6243b9"
                fontFamily="var(--font-mono), monospace"
                fontSize="11"
                letterSpacing="1.5"
              >
                {shiftCopy.next.skillTag}
              </text>
              <text
                x="210"
                y="84"
                textAnchor="middle"
                fill="#252427"
                fontFamily="var(--font-display), sans-serif"
                fontSize="13"
              >
                {shiftCopy.next.skillTitle}
              </text>
              <text
                x="210"
                y="104"
                textAnchor="middle"
                fill="#3a393e"
                fontFamily="var(--font-display), sans-serif"
                fontSize="12"
              >
                {shiftCopy.next.skillSub}
              </text>

              <line
                x1="210"
                x2="210"
                y1="120"
                y2="142"
                stroke="#6243b9"
                strokeDasharray="4,3"
                strokeWidth="1.2"
              />

              <rect
                x="40"
                y="144"
                width="340"
                height="70"
                rx="7"
                fill="#252427"
              />
              <text
                x="210"
                y="169"
                textAnchor="middle"
                fill="rgba(243, 235, 217, 0.85)"
                fontFamily="var(--font-mono), monospace"
                fontSize="11"
                letterSpacing="1.5"
              >
                {shiftCopy.next.intelTag}
              </text>
              <text
                x="210"
                y="192"
                textAnchor="middle"
                fill="#f3ebd9"
                fontFamily="var(--font-display), sans-serif"
                fontSize="14"
              >
                {shiftCopy.next.intelLine}
              </text>

              <text
                x="210"
                y="234"
                textAnchor="middle"
                fill="#6c6970"
                fontFamily="var(--font-mono), monospace"
                fontSize="10"
                letterSpacing="1.3"
              >
                {shiftCopy.next.footnote}
              </text>
            </svg>
            <p className="je-shift__caption">{shiftCopy.next.caption}</p>
          </article>
        </div>

        <div className="je-shift__strip reveal" role="list">
          {shiftCopy.strip.map((cell) => (
            <div key={cell.label} className="je-shift__strip-cell" role="listitem">
              <span className="je-shift__strip-label">{cell.label}</span>
              <p className="je-shift__strip-body">{cell.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
