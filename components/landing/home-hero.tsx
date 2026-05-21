import Link from "next/link";
import { hero } from "@/content/aether";

/**
 * Homepage hero — A reusable intelligence layer, built from how your team works.
 *
 * Two-column split. Left column carries the eyebrow pill, title, lede,
 * and CTA pair. Right column is a "working motion" instrument panel
 * with a substrate core and four orbiting motions (Navigate, Encode,
 * Build, Learn). Concentric rings hint at compounding cycles.
 */
export function HomeHero({ id }: { id?: string }) {
  return (
    <section className="hero hero--split" id={id}>
      <div className="hero-grid-bg" aria-hidden="true" />
      <div className="wrap">
        <div className="hero-text" data-reveal-stack>
          <p className="eyebrow-pill reveal">
            <span className="eyebrow-pill__pulse" aria-hidden="true" />
            <span>{hero.eyebrowPill}</span>
          </p>
          <h1 className="reveal">
            {hero.titlePre}
            <br />
            <em>{hero.titleEm}</em>
          </h1>
          <p className="hero-lede reveal">{hero.lede}</p>

          <div className="hero-actions reveal">
            {hero.actions.map((action) =>
              action.primary ? (
                <Link key={action.id} href={action.href} className="btn btn--violet">
                  {action.label}
                  <span className="btn-arrow">→</span>
                </Link>
              ) : (
                <Link key={action.id} href={action.href} className="btn btn--ghost">
                  {action.label}
                </Link>
              ),
            )}
          </div>
        </div>

        <div className="hero-panel reveal">
          <div className="hero-panel__halo" aria-hidden="true" />
          <header className="hero-panel__head">
            <span className="hero-panel__head-dot" aria-hidden="true" />
            <span className="hero-panel__head-label">{hero.panel.title}</span>
            <span className="hero-panel__live">{hero.panel.live}</span>
          </header>

          <div className="hero-orbit" aria-hidden="true">
            <span className="hero-orbit__ring hero-orbit__ring--outer" />
            <span className="hero-orbit__ring hero-orbit__ring--inner" />

            {hero.panel.orbits.map((orbit) => (
              <span
                key={orbit.id}
                className={`hero-orbit__pill hero-orbit__pill--${orbit.position} hero-orbit__pill--${orbit.id}`}
              >
                <span className="hero-orbit__dot" aria-hidden="true" />
                <span>{orbit.label}</span>
              </span>
            ))}

            <span className="hero-orbit__core">
              <strong>{hero.panel.centerLabel}</strong>
              <span>{hero.panel.centerSub}</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
