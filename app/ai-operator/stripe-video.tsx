"use client";

import { useEffect, useRef, useState } from "react";

import { stripeAudioToggle, stripeVideoSection } from "./content";

/*
 * StripeVideo — second beat of the closer.
 *
 * After the reflective interstitial sets up "where does this fit at
 * Stripe?", this section gives the visitor the answer in someone
 * else's voice. The Collison clip plays in a centered 16:9 frame on
 * a dark backdrop — no pull-quote overlay, no heavy veil, just the
 * video as the artefact. A small mono-caps attribution and a single
 * italic byline sit below the frame.
 *
 * Audio choreography mirrors the original `StripeBridge` pattern.
 * Browsers block unmuted autoplay until the visitor has interacted
 * with the page; by the time someone reaches this section they
 * almost always have:
 *
 *   - The video starts muted with autoplay + loop. Muted autoplay
 *     is always allowed, so a cued frame is visible from first
 *     paint.
 *   - When the section enters the viewport (IntersectionObserver,
 *     threshold ~0.45), we attempt `video.muted = false; video.play()`.
 *     If `.play()` rejects (Safari, strict autoplay policies), we
 *     leave the video muted and a "Tap for sound" pill in the top-
 *     right gives the visitor an explicit unmute path.
 *   - On exit (same threshold) we pause the video and re-mute it so
 *     audio never bleeds into the Ledger section below.
 *   - A persistent mute toggle in the section's top-right gives the
 *     visitor an override at any time, regardless of whether
 *     auto-unmute succeeded.
 *
 * Choreography is opt-in: skipped on narrow viewports and under
 * `prefers-reduced-motion: reduce`. JS only adds `is-animated` and
 * touches the video when the choreography is appropriate; markup
 * and CSS fall back to a static frame with the video element
 * receiving native `controls` so the visitor can still play it on
 * demand.
 */
export function StripeVideo() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [animated, setAnimated] = useState(false);
  /* Tracks whether the video is currently emitting audio. Drives
     the persistent mute toggle's label. */
  const [muted, setMuted] = useState(true);

  /* Match the Evans bridge / Headless-shift gates. Below 960px or
     under `prefers-reduced-motion: reduce` the choreography is
     disabled and the section reads as a static frame with native
     video controls. */
  useEffect(() => {
    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const widthMq = window.matchMedia("(min-width: 960px)");

    const update = () => {
      setAnimated(!motionMq.matches && widthMq.matches);
    };

    update();

    motionMq.addEventListener("change", update);
    widthMq.addEventListener("change", update);
    return () => {
      motionMq.removeEventListener("change", update);
      widthMq.removeEventListener("change", update);
    };
  }, []);

  /* IntersectionObserver — drives the autoplay/audio activation and
     the on-exit pause. Only wired when `animated` is true so static
     fallback users get the native controls without surprise audio. */
  useEffect(() => {
    const node = sectionRef.current;
    const video = videoRef.current;
    if (!node || !video) return;

    if (!animated) {
      /* Reset to a quiet, paused state if the visitor toggles into
         reduced motion mid-session. */
      video.pause();
      video.muted = true;
      setMuted(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            /* On entry: try to play with sound. If the browser
               blocks us, fall back to muted playback and let the
               "Tap for sound" toggle give the visitor an explicit
               path to unmute. */
            video.muted = false;
            const playAttempt = video.play();
            if (playAttempt && typeof playAttempt.then === "function") {
              playAttempt
                .then(() => setMuted(false))
                .catch(() => {
                  video.muted = true;
                  void video.play().catch(() => {});
                  setMuted(true);
                });
            } else {
              setMuted(false);
            }
          } else {
            /* On exit: pause and re-mute so audio never bleeds
               into the Ledger section. The next entry retries the
               unmute attempt. */
            video.pause();
            video.muted = true;
            setMuted(true);
          }
        }
      },
      { threshold: 0.45 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [animated]);

  /* Persistent mute toggle. Always available regardless of whether
     auto-unmute succeeded so the visitor never feels trapped by
     ambient audio. */
  const handleToggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    const next = !video.muted;
    video.muted = next;
    if (!next) {
      /* If the visitor is un-muting via explicit gesture and the
         video is paused (reduced-motion fallback), try to play.
         The user gesture means this attempt won't be blocked. */
      void video.play().catch(() => {});
    }
    setMuted(next);
  };

  const { title, video, attribName, attribMeta, byline } = stripeVideoSection;

  return (
    <section
      ref={sectionRef}
      className={`aiop-section aiop-stripe-video${animated ? " is-animated" : ""}`}
      id="stripe-video"
      aria-labelledby="aiop-stripe-video-title"
    >
      <div className="aiop-wrap aiop-stripe-video__inner">
        <header className="aiop-stripe-video__head aiop-reveal">
          <h2
            id="aiop-stripe-video-title"
            className="aiop-stripe-video__title"
          >
            {title}
          </h2>
        </header>
        <div className="aiop-stripe-video__frame aiop-reveal">
          <div
            className="aiop-stripe-video__screen"
            aria-label={`${attribName} — ${attribMeta}`}
          >
            <video
              ref={videoRef}
              className="aiop-stripe-video__el"
              src={video.src}
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              controls={!animated}
            >
              {video.captions ? (
                <track kind="captions" src={video.captions} default />
              ) : null}
            </video>

            {animated ? (
              <button
                type="button"
                className={`aiop-stripe-video__audio-toggle${
                  muted ? " aiop-stripe-video__audio-toggle--muted" : ""
                }`}
                onClick={handleToggleMute}
                aria-pressed={!muted}
                aria-label={muted ? "Unmute video" : "Mute video"}
              >
                <span
                  className="aiop-stripe-video__audio-icon"
                  aria-hidden="true"
                >
                  {muted ? "\u25C7" : "\u25C6"}
                </span>
                <span className="aiop-stripe-video__audio-label">
                  {muted ? stripeAudioToggle.listen : stripeAudioToggle.mute}
                </span>
              </button>
            ) : null}
          </div>

          <figcaption
            className="aiop-stripe-video__caption"
            id="aiop-stripe-video-attrib"
          >
            <p className="aiop-stripe-video__attrib">
              <span
                className="aiop-stripe-video__attrib-rule"
                aria-hidden="true"
              />
              <span className="aiop-stripe-video__attrib-name">
                {attribName}
              </span>
              <span className="aiop-stripe-video__attrib-meta">
                {attribMeta}
              </span>
            </p>
            <p className="aiop-stripe-video__byline">{byline}</p>
          </figcaption>
        </div>
      </div>
    </section>
  );
}
