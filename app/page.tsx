import type { Metadata } from "next";

import styles from "./page.module.css";

/*
 * Shards · front door.
 *
 * Deliberately minimal. After the password gate at /login, the
 * visitor lands here on a single fullscreen gradient with one
 * editorial line and an attribution. Nothing to navigate, nothing
 * to click — the door is a thought, not a menu. Reachable internal
 * surfaces (the showcase, the dashboard, the gated collections)
 * are accessed by direct URL once the site cookie is set.
 *
 * The gradient palette mirrors the `EncodingInterstitial` lane on
 * the workshop fork — amber-top, paper-middle, violet-bottom, with
 * two soft radial washes and a quiet grid texture — so the door
 * and the deeper substrate visually rhyme without leaking shared
 * tokens (the gradient is hand-tuned with rgba literals in
 * `page.module.css`, not inherited from `--aiop-*`).
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
        <div className={styles.washA} aria-hidden="true" />
        <div className={styles.washB} aria-hidden="true" />
        <div className={styles.grid} aria-hidden="true" />
        <div className={styles.vignette} aria-hidden="true" />

        <figure className={styles.quoteWrap}>
          <blockquote className={styles.quote}>
            <p className={styles.quoteText}>
              <span className={styles.quoteMark} aria-hidden="true">
                &ldquo;
              </span>
              What I cannot build, I do not understand.
              <span className={styles.quoteMark} aria-hidden="true">
                &rdquo;
              </span>
            </p>
          </blockquote>
          <figcaption className={styles.attribution}>
            <span className={styles.attributionRule} aria-hidden="true" />
            Richard Feynman
          </figcaption>
        </figure>
      </main>
    </div>
  );
}
