import Image from "next/image";

import { fdFoundersSection, type FdFounder } from "@/content/forward-deployed";

/*
 * Forward-deployed pitch · founders block.
 *
 * Two-up extension of the `about-vince` shape from
 * `components/creative-workshop/about-vince.tsx`. Each founder gets a
 * portrait in a HUD-cornered frame, a two-paragraph bio, a stack of
 * credentials, and a one-line statement of what they own inside the
 * engagement. Below the pair, a quiet pairing block names why the
 * two seats sit in the same engagement.
 *
 * Reuses the existing `.cw-about__portrait*` classes for the HUD
 * cornered portrait styling (defined in
 * `app/creative-ai-workshop/creative-ai-workshop.css`); founder-row
 * and pairing styles live in `forward-deployed.css`.
 *
 * Server component.
 */
export function AboutFounders() {
  return (
    <section
      className="aiop-section fd-founders"
      id={fdFoundersSection.id}
      aria-labelledby="fd-founders-title"
      aria-label="Founders"
    >
      <div className="aiop-wrap fd-founders__inner">
        <header className="fd-founders__head aiop-reveal">
          <span className="fd-founders__eyebrow">
            {fdFoundersSection.eyebrow}
          </span>
          <h2 className="fd-founders__title" id="fd-founders-title">
            {fdFoundersSection.title} <em>{fdFoundersSection.titleEm}</em>
          </h2>
          <p className="fd-founders__sub">{fdFoundersSection.sub}</p>
        </header>

        <ol
          className="fd-founders__grid aiop-reveal"
          role="list"
          aria-label="Two founders"
        >
          {fdFoundersSection.founders.map((founder) => (
            <FounderCard key={founder.id} founder={founder} />
          ))}
        </ol>

        <aside
          className="fd-founders__pairing aiop-reveal"
          aria-labelledby="fd-pairing-title"
        >
          <span className="fd-founders__pairing-eyebrow">
            {fdFoundersSection.pairing.eyebrow}
          </span>
          <h3
            className="fd-founders__pairing-headline"
            id="fd-pairing-title"
          >
            {fdFoundersSection.pairing.headline}
          </h3>
          <p className="fd-founders__pairing-body">
            {fdFoundersSection.pairing.body}
          </p>
        </aside>
      </div>
    </section>
  );
}

function FounderCard({ founder }: { founder: FdFounder }) {
  return (
    <li className={`fd-founder fd-founder--${founder.id}`}>
      <figure
        className="cw-about__portrait fd-founder__portrait"
        aria-label={`Portrait of ${founder.name}`}
      >
        <div className="cw-about__portrait-frame fd-founder__portrait-frame">
          <Image
            src={founder.portrait.src}
            alt={founder.portrait.alt}
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

      <div className="fd-founder__body">
        <header className="fd-founder__head">
          <h3 className="fd-founder__name">{founder.name}</h3>
          <p className="fd-founder__role">{founder.role}</p>
        </header>

        <div className="fd-founder__bio">
          {founder.bio.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <dl className="fd-founder__owns" aria-label="What this founder owns">
          <dt>Owns</dt>
          <dd>{founder.owns}</dd>
        </dl>

        <ul
          className="fd-founder__credentials"
          role="list"
          aria-label={`${founder.name} credentials`}
        >
          {founder.credentials.map((credential) => (
            <li key={credential} className="fd-founder__credential">
              {credential}
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}
