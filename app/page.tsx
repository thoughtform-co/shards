import type { Metadata } from "next";
import Link from "next/link";

import styles from "./page.module.css";

/*
 * Shards / front door.
 *
 * Reachable only after unlocking via the gate at /login (the proxy
 * rewrites locked traffic to /login). Same scene composition as the
 * gate — full-bleed gradient backdrop, top corner markers, bottom-left
 * card — but the card body is text-only with a single pointer to
 * /ai-operator, the public showcase route. The internal experiment
 * hub at /dashboard is intentionally not surfaced from here so external
 * visitors who land on / from the password gate are funneled directly
 * to the showcase. /dashboard remains reachable by direct URL for
 * personal use once the cookie is set.
 *
 * Card content frames the practice abstractly — applied intelligence
 * as a three-motion arc (Navigate / Encode / Build) — with no client,
 * industry, or platform names so the door reads as a portfolio entry
 * regardless of who's holding the password.
 */

export const metadata: Metadata = {
  title: "Shards",
  description:
    "A private lab of small Thoughtform-adjacent experiments and prototypes.",
  robots: { index: false, follow: false },
};

export default function HomePage() {
  return (
    <div className={styles.scope}>
      <main
        className={styles.scene}
        role="main"
        aria-label="Shards · personal lab"
      >
        <div className={styles.backdrop} aria-hidden="true" />
        <div className={styles.overlay} aria-hidden="true" />

        <div className={styles.markerTop} aria-hidden="true">
          <span className={styles.markerLeft}>
            <span className={styles.markerDot} />
            shards
            <span className={styles.markerSep}>·</span>
            personal lab
          </span>
          <span className={styles.markerRight}>
            antwerp
            <span className={styles.markerSep}>·</span>
            cet
          </span>
        </div>

        <div className={styles.cardWrap}>
          <div className={styles.card}>
            <div className={styles.eyebrow}>
              <span className={styles.bar} aria-hidden="true" />
              applied intelligence — private
            </div>

            <div className={styles.brand}>
              <span>Shards</span>
              <span className={styles.brandPeriod} aria-hidden="true">
                .
              </span>
            </div>

            <h1 className={styles.headline}>
              An operating system for doing AI work the way it actually gets
              done.
            </h1>

            <p className={styles.support}>
              One arc. Three motions. Substrate the team keeps using long
              after the engagement.
            </p>

            <ol className={styles.phases} aria-label="Three motions of the practice">
              <li className={styles.phase}>
                <span className={styles.phaseLabel}>Navigate</span>
                <span className={styles.phaseLine}>
                  Read the work as it really moves before AI can be useful.
                </span>
              </li>
              <li className={styles.phase}>
                <span className={styles.phaseLabel}>Encode</span>
                <span className={styles.phaseLine}>
                  Capture the judgment that lives in senior heads, written down.
                </span>
              </li>
              <li className={styles.phase}>
                <span className={styles.phaseLabel}>Build</span>
                <span className={styles.phaseLine}>
                  Surface the substrate as the tools the team uses every day.
                </span>
              </li>
            </ol>

            <Link className={styles.link} href="/ai-operator">
              Open the showcase
              <span className={styles.linkArrow} aria-hidden="true">
                →
              </span>
            </Link>

            <div className={styles.foot}>
              <span>navigate · encode · build</span>
              <span className={styles.footMark}>v.2026.05</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
