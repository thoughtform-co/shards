/*
 * Creative AI Workshop · Video section.
 *
 * Calm editorial frame around a single MP4. Used twice on the
 * page — once in Navigate (Michael Levin · Cognitive Interfaces)
 * and once in Encode (Anthropic · Prompting Advice). The header
 * follows the site-wide two-column pattern: the display title
 * (with gold em) sits on the left, a short supporting paragraph
 * on the right. Below it the video sits in a calm cream card with
 * a 1 px hairline, and a caption names the speaker / source.
 *
 * The video is a native <video> element with controls, no
 * autoplay, preload="metadata" so the H.264 sources (~16-20 MB)
 * don't fully buffer until the visitor presses play. No poster image —
 * the first frame is fine for both cuts.
 *
 * Server component. Copy is passed in via props so the page can
 * place a single component twice with different framing.
 */

type VideoLane = "navigate" | "encode";

export interface VideoSectionProps {
  id: string;
  lane: VideoLane;
  title: string;
  titleEm: string;
  titleAfter?: string;
  body: string;
  videoSrc: string;
  videoType?: string;
  duration?: string;
  speaker: string;
  speakerRole: string;
  sourceLabel: string;
  sourceHref?: string;
  ariaLabel?: string;
}

export function VideoSection({
  id,
  lane,
  title,
  titleEm,
  titleAfter = "",
  body,
  videoSrc,
  videoType = "video/mp4",
  duration,
  speaker,
  speakerRole,
  sourceLabel,
  sourceHref,
  ariaLabel,
}: VideoSectionProps) {
  const titleId = `${id}-title`;
  const fallbackAria = `${title} ${titleEm}${titleAfter} — ${speaker}`;

  return (
    <section
      className={`aiop-section cw-video cw-video--${lane}`}
      id={id}
      aria-labelledby={titleId}
      aria-label={ariaLabel ?? fallbackAria}
    >
      <div className="aiop-wrap cw-video__inner">
        <header className="cw-video__head aiop-reveal">
          <h2 className="cw-video__title" id={titleId}>
            {title} <em className="cw-video__title-em">{titleEm}</em>
            {titleAfter}
          </h2>
          <p className="cw-video__body">{body}</p>
        </header>

        <figure className="cw-video__figure aiop-reveal">
          {/* eslint-disable-next-line jsx-a11y/media-has-caption -- the
              Anthropic source has burned-in subtitles; the Levin clip is
              speech-only and provided without captions. The <figcaption>
              names speaker + role so the section still has a textual
              anchor for screen-reader users. */}
          <video
            className="cw-video__player"
            controls
            preload="metadata"
            playsInline
            aria-label={`${speaker} — ${speakerRole}`}
          >
            <source src={videoSrc} type={videoType} />
            Your browser does not support embedded video. Download the file:{" "}
            <a href={videoSrc} download>
              {videoSrc.split("/").pop()}
            </a>
            .
          </video>
          <figcaption className="cw-video__caption">
            <span className="cw-video__caption-speaker">{speaker}</span>
            <span className="cw-video__caption-sep" aria-hidden="true">
              ·
            </span>
            <span className="cw-video__caption-role">{speakerRole}</span>
            {duration ? (
              <>
                <span className="cw-video__caption-sep" aria-hidden="true">
                  ·
                </span>
                <span className="cw-video__caption-meta">{duration}</span>
              </>
            ) : null}
            <span className="cw-video__caption-source">
              Source:{" "}
              {sourceHref ? (
                <a
                  href={sourceHref}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {sourceLabel}
                </a>
              ) : (
                <span>{sourceLabel}</span>
              )}
            </span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
