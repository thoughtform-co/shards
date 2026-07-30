/*
 * /plopsa-ai-workshop — route-local video sections.
 *
 * Two beats the shared components cannot express as-is:
 *
 * 1. `PlopsaShowcaseVideo` — a bare full-bleed film with NO masthead.
 *    The shared `VideoSection` cannot do this: `title`, `titleEm` and
 *    `body` are required props and its <header> renders
 *    unconditionally (video-section.tsx:67-73). Rather than loosen
 *    that shared contract for one route, this reuses `VideoSection`'s
 *    own `.cw-video*` classes and simply omits the header, so it
 *    inherits the identical card, hairline and player styling for
 *    free. `aria-label` carries the accessible name that the absent
 *    <h2> would otherwise have provided.
 *
 * 2. `NavigatingAiProof` — styled like `WorldFirstAiAtlProof`
 *    (keynote-proof-sections.tsx:20-87), which is a zero-prop
 *    component with hardcoded copy, so it cannot be reused with
 *    different text. This clones its markup under a new
 *    `cw-keynote-proof--navigating` modifier. The `--atl` / `--studio`
 *    modifiers carry no CSS of their own — they are pure hooks — so
 *    this needs no new CSS, and `--aiop-gold` is already re-pointed to
 *    the Plopsa accent on this route, so the italic em picks up orange
 *    automatically.
 *
 * Both are server components. Both videos are web-ready H.264 cuts
 * committed under public/videos (see .gitignore:43-53 for why the
 * source masters stay local).
 */

export function PlopsaShowcaseVideo() {
  return (
    <section
      className="aiop-section cw-video cw-video--navigate plopsa-showcase"
      id="plopsa-showcase"
      aria-label="Vulpia — 30 jaar. Showcase film."
    >
      <div className="aiop-wrap cw-video__inner">
        <figure className="cw-video__figure aiop-reveal">
          {/* No <track>: the cut is a music-led showcase reel with no
              spoken dialogue. The section's aria-label names it. */}
          <video
            className="cw-video__player"
            controls
            preload="metadata"
            playsInline
            aria-label="Vulpia — 30 jaar showcase film"
          >
            <source src="/videos/vulpia-30-jaar.mp4" type="video/mp4" />
            Your browser does not support embedded video. Download the file:{" "}
            <a href="/videos/vulpia-30-jaar.mp4" download>
              vulpia-30-jaar.mp4
            </a>
            .
          </video>
        </figure>
      </div>
    </section>
  );
}

export function NavigatingAiProof() {
  return (
    <section
      className="aiop-section cw-keynote-proof cw-keynote-proof--navigating"
      id="navigating-ai"
      aria-labelledby="cw-keynote-navigating-title"
      aria-label="Why prompting is navigating"
    >
      <div className="aiop-wrap cw-keynote-proof__inner">
        <header className="cw-keynote-proof__head aiop-reveal">
          <span className="cw-keynote-proof__eyebrow">
            Vox &middot; How Generative A.I. Works
          </span>
          <div className="cw-keynote-proof__head-cols">
            <h2
              className="cw-keynote-proof__title"
              id="cw-keynote-navigating-title"
            >
              Why prompting is <em>navigating</em>.
            </h2>
            <p className="cw-keynote-proof__body">
              Generating an image or a video is less like giving an
              instruction than navigating a space of possibilities. A prompt
              is a heading, not a command: you steer toward a region, look at
              what you find, and adjust.
            </p>
          </div>
        </header>

        <figure className="cw-keynote-proof__figure aiop-reveal">
          <div className="cw-keynote-proof__player">
            {/* No <track>: the Vox cut carries burned-in graphics and
                narration. The figcaption below names the source for
                screen-reader users. */}
            <video
              className="cw-keynote-proof__video"
              controls
              preload="metadata"
              playsInline
              aria-label="Vox — How Generative A.I. Works"
            >
              <source
                src="/videos/vox-how-generative-ai-works.mp4"
                type="video/mp4"
              />
              Your browser does not support embedded video. Download the
              file:{" "}
              <a href="/videos/vox-how-generative-ai-works.mp4" download>
                vox-how-generative-ai-works.mp4
              </a>
              .
            </video>
          </div>
          <figcaption className="cw-keynote-proof__caption">
            <span className="cw-keynote-proof__caption-label">Vox</span>
            <span className="cw-keynote-proof__caption-sep" aria-hidden="true">
              &middot;
            </span>
            <span className="cw-keynote-proof__caption-meta">
              Explainer &middot; 3 min 16 s
            </span>
            <span className="cw-keynote-proof__caption-source">
              Source:{" "}
              <a
                href="https://www.vox.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                vox.com
              </a>
            </span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
