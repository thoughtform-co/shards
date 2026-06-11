import Image from "next/image";

/*
 * Creative AI Workshop · About Vince.
 *
 * Lifts the bio shape from thoughtform.co's `#about` section
 * (`01_thoughtform/public/prototypes/v7/landing-v7-motion.html`)
 * and re-renders it inside the workshop chrome on the
 * Thoughtform light skin.
 *
 * Two-column layout: a framed portrait on the left, bio copy on
 * the right. The portrait sits inside the gold corner brackets so
 * the HUD frame still reads as Thoughtform instrument chrome on
 * top of the photo.
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
          <figure className="cw-about__portrait" aria-label="Portrait of Vince Buyssens">
            <div className="cw-about__portrait-frame">
              <Image
                src="/images/vince-portrait.png"
                alt="Vince Buyssens"
                className="cw-about__portrait-img"
                fill
                sizes="(min-width: 720px) 320px, 100vw"
              />
              <span className="cw-about__portrait-corner cw-about__portrait-corner--tl" />
              <span className="cw-about__portrait-corner cw-about__portrait-corner--tr" />
              <span className="cw-about__portrait-corner cw-about__portrait-corner--bl" />
              <span className="cw-about__portrait-corner cw-about__portrait-corner--br" />
            </div>
          </figure>

          <div className="cw-about__copy">
            <p className="cw-about__bio">
              Vince is a technologist who&apos;s been navigating the tides of
              digital change for over a decade. Through Thoughtform he helps
              teams navigate AI, encode the judgment that makes their work
              good, and build tools they own.
            </p>
            <p className="cw-about__bio">
              He runs the same practice inside Loop Earplugs, leading AI
              adoption across the company.
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
