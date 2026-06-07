/*
 * Creative AI Workshop · About Vince.
 *
 * Lifts the bio shape from thoughtform.co's `#about` section
 * (`01_thoughtform/public/prototypes/v7/landing-v7-motion.html`)
 * and re-renders it inside the workshop chrome on the
 * Thoughtform light skin.
 *
 * Two-column layout: a framed portrait slot on the left, bio copy
 * on the right. The portrait slot is a placeholder for now (HUD
 * corner brackets + a `PORTRAIT` mono caption); swap in an <img>
 * once a real portrait lands in `public/images/`.
 *
 * Server component.
 */

export function AboutVince() {
  return (
    <section
      className="aiop-section cw-about"
      id="about"
      aria-label="About Vince Buyssens"
    >
      <div className="aiop-wrap cw-about__inner">
        <header className="cw-about__head aiop-reveal">
          <span className="cw-about__eyebrow">About</span>
          <h2 className="cw-about__title">Vince Buyssens</h2>
          <p className="cw-about__role">
            Founder, Thoughtform &middot; AI adoption lead, Loop Earplugs
          </p>
        </header>

        <div className="cw-about__grid aiop-reveal">
          <figure className="cw-about__portrait" aria-label="Portrait placeholder">
            <div className="cw-about__portrait-frame">
              <span className="cw-about__portrait-corner cw-about__portrait-corner--tl" />
              <span className="cw-about__portrait-corner cw-about__portrait-corner--tr" />
              <span className="cw-about__portrait-corner cw-about__portrait-corner--bl" />
              <span className="cw-about__portrait-corner cw-about__portrait-corner--br" />
              <span className="cw-about__portrait-label">Portrait</span>
            </div>
          </figure>

          <div className="cw-about__copy">
            <p className="cw-about__bio">
              Vince leads AI adoption at Loop Earplugs, and for other
              companies through Thoughtform.
            </p>
            <p className="cw-about__bio">
              In workshops and sprints he helps teams capture their
              knowledge, taste, and ways of working in a form any AI can
              use. Not to replace them, but to free them from the busywork
              so they can build what they couldn&apos;t before.
            </p>

            <dl className="cw-about__meta" aria-label="Practice meta">
              <div className="cw-about__meta-row">
                <dt>Base</dt>
                <dd>Antwerp &middot; BE</dd>
              </div>
              <div className="cw-about__meta-row">
                <dt>Practice</dt>
                <dd>10+ yrs</dd>
              </div>
              <div className="cw-about__meta-row">
                <dt>Also at</dt>
                <dd>Loop Earplugs</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
