import { heroValueStrip } from "@/content/operator";

/*
 * HeroValueStrip — Linear-style three-tile value strip.
 *
 * Renders between the hero and `<HubMandate />`. Mirrors Linear's
 * "Built for purpose / Powered by AI agents / Designed for speed"
 * three-tile rhythm just below the hero. Replaces the 4-up metric
 * grid that previously crowded the hero copy column.
 *
 * Each tile carries a mono-caps `k` label and a one-line `v` clause.
 * No metrics, no numbers — the headline product properties of the
 * Hub. Numbers stay in the proof beats further down the page (Cases
 * + Approach + closer).
 *
 * Server component — no client hooks. Uses the existing `aiop-reveal`
 * IntersectionObserver from `reveal.tsx` for entrance choreography.
 */
export function HeroValueStrip() {
  return (
    <section
      className="aiop-section aiop-hero-value-strip"
      aria-label="What the Hub guarantees"
    >
      <div className="aiop-wrap">
        <ol
          className="aiop-hero-value-strip__grid aiop-reveal"
          role="list"
        >
          {heroValueStrip.tiles.map((tile) => (
            <li
              key={tile.id}
              className={`aiop-hero-value-strip__tile aiop-hero-value-strip__tile--${tile.id}`}
            >
              <span className="aiop-hero-value-strip__tile-k">{tile.k}</span>
              <p className="aiop-hero-value-strip__tile-v">{tile.v}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
