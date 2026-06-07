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
          <h2 className="cw-about__title">
            Vince Buyssens <em className="cw-about__alias">// Voidwalker.</em>
          </h2>
          <p className="cw-about__role">
            Founder &middot; Navigator &middot; Loop Earplugs AI Strategy
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
              <strong>Vince</strong> has spent a decade moving teams through
              the tides of digital change &mdash; the web, mobile, creator
              economies, and now <em>intelligence itself</em>.
            </p>
            <p className="cw-about__bio">
              Through <strong>Thoughtform</strong> he teaches organisations
              how to think and build with AI: keynotes, intensives, and
              embedded residencies with teams ready to ship.
            </p>
            <p className="cw-about__bio">
              Inside <strong>Loop Earplugs</strong> he runs the same
              practice from the inside &mdash; shaping AI strategy and
              prototyping the tools that power the marketing engine.
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
