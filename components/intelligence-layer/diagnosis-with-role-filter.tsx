"use client";

import {
  pageDiagnosisByRole,
  pageDiagnosisHead,
} from "@/content/intelligence-layer";
import { useRole } from "./role-context";
import { RoleSelector } from "./role-selector";

/**
 * Diagnosis with role filter — homepage `aiop-diagnosis` chrome with a
 * compact role dropdown sitting above the four-card grid.
 *
 * Mirrors the homepage's `<Diagnosis />` component visually (Linear-
 * style two-column section head, four lane-tinted cards, diamond gap
 * card below) but with one extra control: the existing
 * `<RoleSelector />` swaps which role's four pain points the grid
 * shows.
 *
 * Role state lives in `RoleProvider` (URL-synced via `?role=`), so
 * switching here also flips the parked deep-dive sections at the
 * bottom of the page in lockstep. One source of truth for "which
 * stakeholder are we showing right now".
 *
 * Optional `head` prop lets route forks (currently
 * /claude-workshop-v1) replace the title / titleEm / sub strings
 * without touching the shared `pageDiagnosisHead` source — used to
 * generalise "learn Loop from scratch" to a non-Loop framing on the
 * workshop fork.
 */
export type DiagnosisHeadCopy = {
  title: string;
  titleEm: string;
  sub: string;
};

export function DiagnosisWithRoleFilter({
  head = pageDiagnosisHead,
}: {
  head?: DiagnosisHeadCopy;
} = {}) {
  const { role } = useRole();
  const cards = pageDiagnosisByRole[role.id];

  return (
    <section
      className="aiop-section aiop-diagnosis ail-diagnosis"
      id="diagnosis"
    >
      <div className="aiop-wrap">
        <header className="aiop-section-head aiop-diagnosis__head aiop-reveal">
          <h2 className="aiop-section-title aiop-diagnosis__title">
            {head.title} <em>{head.titleEm}</em>
          </h2>
          <p className="aiop-section-head__sub aiop-diagnosis__sub">
            {head.sub}
          </p>
        </header>

        <div className="ail-role-filter aiop-reveal">
          <RoleSelector />
        </div>

        {/*
         * `key={role.id}` used to live on this <ul> to force a fresh
         * mount on role swap. That triggered a bug: the remounted
         * <ul> picks up the `.aiop-reveal` opacity:0 initial state,
         * but the IntersectionObserver (set up at page mount) only
         * observed the original instance — so the cards stayed
         * invisible after every role change. Cards already carry
         * their own per-item keys (`key={c.id}`) so swapping the
         * content in place gives the same visual result without
         * remounting the wrapper.
         */}
        <ul
          className="aiop-diagnosis__grid aiop-reveal"
          role="list"
          aria-label={`Four ${role.label} pain points sharing the same missing layer`}
        >
          {cards.map((c) => (
            <li
              key={c.id}
              className={`aiop-diagnosis__card aiop-diagnosis__card--${c.tone}`}
            >
              <header className="aiop-diagnosis__card-head">
                <span className="aiop-diagnosis__card-tag">{c.tag}</span>
              </header>
              <h3 className="aiop-diagnosis__card-title">{c.title}</h3>
              <details className="aiop-diagnosis__card-details">
                <summary>
                  <span
                    className="aiop-diagnosis__card-toggle-icon"
                    aria-hidden="true"
                  />
                  Read context
                </summary>
                <p className="aiop-diagnosis__card-body">{c.body}</p>
              </details>
            </li>
          ))}
        </ul>

        <div className="aiop-diagnosis__bridge aiop-reveal" aria-hidden="true">
          <span className="aiop-diagnosis__chevron" />
        </div>

        <div className="aiop-diagnosis__gap aiop-reveal">
          <span className="aiop-diagnosis__gap-eyebrow">
            {pageDiagnosisHead.gap.eyebrow}
          </span>
          <p className="aiop-diagnosis__gap-title">
            {pageDiagnosisHead.gap.title}
          </p>
        </div>
      </div>
    </section>
  );
}
