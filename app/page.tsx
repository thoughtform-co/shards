import type { Metadata } from "next";
import Link from "next/link";

import styles from "./page.module.css";

/*
 * Shards / front door.
 *
 * Reachable only after unlocking via the gate at /login (the proxy
 * rewrites locked traffic to /login). Same scene composition as the
 * gate — full-bleed gradient backdrop, top corner markers, bottom-left
 * card — but the card body is text-only with a small pointer to
 * /dashboard, where the curated experiment hub lives.
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
              A small lab of single-purpose tools and visual probes.
            </h1>

            <p className={styles.support}>
              Playful prototypes that break brand locally while still docking
              into one shared instrument panel. Quiet by default, opened on
              request.
            </p>

            <Link className={styles.link} href="/dashboard">
              Open the dashboard
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
