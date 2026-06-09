/*
 * Creative AI Workshop · Build-chapter quote interstitial.
 *
 * Calm centered pause beat sitting just before the embedded Video
 * Studio. The line — "And this is how you build it yourself." —
 * names the pivot from "tools the team builds for itself" (Cases,
 * SoftwareForFew) into the live worked example: the studio that
 * Loop actually built on HyperFrames + Remotion to turn a brief
 * into MP4. The visitor reads the sentence, then the studio
 * appears below as the answer.
 *
 * No parallax, no chips, no second-line reveal. The pattern
 * follows the same eyebrow + display title + supporting line
 * scaffold as the other creative-workshop interstitials
 * (agent-context, design-md-bridge), tuned down to a single
 * centred editorial line so the studio underneath gets to lead.
 *
 * Server component.
 */

export function BuildQuote() {
  return (
    <section
      className="aiop-section cw-buildquote"
      id="build-quote"
      aria-labelledby="cw-buildquote-title"
      aria-label="And this is how you build it yourself"
    >
      <div className="aiop-wrap cw-buildquote__inner">
        <span className="cw-buildquote__eyebrow">Build</span>
        <blockquote className="cw-buildquote__quote">
          <span
            className="cw-buildquote__mark cw-buildquote__mark--open"
            aria-hidden="true"
          >
            “
          </span>
          <h2
            className="cw-buildquote__title"
            id="cw-buildquote-title"
          >
            And this is how you{" "}
            <em className="cw-buildquote__title-em">build it yourself</em>.
          </h2>
          <span
            className="cw-buildquote__mark cw-buildquote__mark--close"
            aria-hidden="true"
          >
            ”
          </span>
        </blockquote>
        <p className="cw-buildquote__sub">
          The Skills above named what to encode. The next surface shows
          one we built on top: a per-job router over HyperFrames and
          Remotion that turns a brief into MP4.
        </p>
      </div>
    </section>
  );
}
