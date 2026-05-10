"use client";

import { useEffect, useRef, useState } from "react";

import { stripeBridgeSection } from "./content";

/*
 * StripeBridge — closing interstitial between Surface pick and the CTA.
 *
 * Visual posture mirrors the Evans `QuoteBridge` and the simpler
 * `FlywheelBridge`: a full-viewport editorial chapter centered around
 * a pull-quote with a tight attribution rule beneath it. Difference:
 * the atmosphere is not three lane washes, it's a softly playing
 * background video of the same Collison clip the quote is pulled from.
 *
 * The audio choreography is the delicate part. Browsers block unmuted
 * autoplay until the user has interacted with the page — by the time a
 * visitor scrolls this far down, that almost always holds. So:
 *
 *   - The video starts muted with autoplay + loop. Muted autoplay is
 *     always allowed and gives the section atmospheric texture from
 *     first frame.
 *   - When the section enters the viewport (IntersectionObserver,
 *     threshold ~0.45), we attempt `video.muted = false; video.play()`.
 *     If `.play()` rejects (Safari, strict autoplay policies, etc.),
 *     we leave the video muted and surface a "Tap for sound" pill so
 *     the visitor can opt in.
 *   - On exit (the same IO threshold) we pause the video and re-mute
 *     it. The audio never bleeds into the CTA below.
 *   - A persistent mute toggle pill in the section's top-right gives
 *     the visitor an explicit override at any time, regardless of
 *     whether autoplay-with-sound was allowed.
 *
 * Choreography is opt-in: skipped on narrow viewports and under
 * `prefers-reduced-motion: reduce`. JS only adds `is-animated` and
 * touches the video when the choreography is appropriate; markup and
 * CSS fall back to a static stack with the video element receiving
 * native `controls` so the visitor can still play it on demand.
 *
 * The component also exposes `--aiop-stripe-progress` (0..1, the
 * section's transit through the viewport) on the section itself so
 * the inner washes / closing tie-back can drift via CSS for extra
 * depth on top of the natural scroll-over. Mirrors the
 * `--aiop-shift-progress` pattern in `headless-shift.tsx`.
 */
export function StripeBridge() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [animated, setAnimated] = useState(false);
  /* Tracks whether the video is currently emitting audio. Drives both
     the persistent mute toggle's label and the conditional "Tap for
     sound" pill that appears when we couldn't auto-unmute on entry. */
  const [muted, setMuted] = useState(true);
  /* Set to true the first time we successfully auto-unmute on the
     section entering the viewport. Suppresses the "Tap for sound"
     pill so it only nudges visitors when the browser blocked us. */
  const [autoUnmuted, setAutoUnmuted] = useState(false);

  /* Match the Evans bridge / Headless-shift gates. Below 960px or
     under `prefers-reduced-motion: reduce` the choreography is
     disabled and the section reads as a static stack with native
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
            /* On entry: try to play with sound. If the browser blocks
               us (most often Safari with strict autoplay policies),
               fall back to muted playback and let the "Tap for sound"
               pill nudge the visitor. */
            video.muted = false;
            const playAttempt = video.play();
            if (playAttempt && typeof playAttempt.then === "function") {
              playAttempt
                .then(() => {
                  setMuted(false);
                  setAutoUnmuted(true);
                })
                .catch(() => {
                  video.muted = true;
                  /* Muted autoplay is always allowed; queue it as a
                     fallback so the section still has atmospheric
                     motion behind the type. */
                  void video.play().catch(() => {});
                  setMuted(true);
                });
            } else {
              setMuted(false);
              setAutoUnmuted(true);
            }
          } else {
            /* On exit: pause and re-mute so audio never bleeds into
               the CTA. The next entry will retry the unmute attempt. */
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

  /* rAF-batched scroll handler that writes `--aiop-stripe-progress`
     (0..1) onto the section as it transits the viewport. Mirrors the
     `--aiop-shift-progress` pattern in `headless-shift.tsx` so the
     CSS layer can drift the closing tie-back on top of the natural
     scroll-through without recomputing geometry per frame. */
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const reset = () => {
      node.style.removeProperty("--aiop-stripe-progress");
    };

    if (!animated) {
      reset();
      return;
    }

    let raf = 0;

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = node.getBoundingClientRect();
        const vh = window.innerHeight;
        const total = rect.height + vh;
        const traveled = vh - rect.top;
        const p = Math.max(0, Math.min(1, traveled / total));
        node.style.setProperty("--aiop-stripe-progress", p.toFixed(4));
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
      reset();
    };
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
      /* If we're un-muting via explicit user gesture and the video
         isn't already playing (paused under reduced-motion fallback,
         say), try to play. The user gesture means this attempt
         shouldn't be blocked. */
      void video.play().catch(() => {});
    }
    setMuted(next);
  };

  const {
    video,
    quoteParts,
    attribName,
    attribMeta,
    note,
    personalLines,
    emailCard,
    closing,
    audioToggle,
  } = stripeBridgeSection;

  return (
    <section
      ref={sectionRef}
      className={`aiop-section aiop-stripe-bridge${animated ? " is-animated" : ""}`}
      id="stripe-bridge"
      aria-labelledby="aiop-stripe-bridge-quote"
    >
      {/* Background video bleed. `playsInline` keeps iOS from forcing
          fullscreen, `loop` keeps the atmosphere continuous, `muted`
          on the element itself guarantees the muted-autoplay
          contract. The renderer optionally adds `controls` under the
          static-fallback path so reduced-motion / narrow-viewport
          visitors can still trigger playback themselves. */}
      <div className="aiop-stripe-bridge__bleed" aria-hidden="true">
        <video
          ref={videoRef}
          className="aiop-stripe-bridge__video"
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
        <span className="aiop-stripe-bridge__veil" />
      </div>

      {/* Persistent mute toggle. Lives outside the editorial column
          so it stays anchored to the section's top-right regardless
          of inner content height. Hidden under the static-fallback
          path because the native video controls already give the
          visitor sound control. */}
      {animated ? (
        <button
          type="button"
          className={`aiop-stripe-bridge__audio-toggle${
            muted ? " aiop-stripe-bridge__audio-toggle--muted" : ""
          }`}
          onClick={handleToggleMute}
          aria-pressed={!muted}
          aria-label={muted ? "Unmute video" : "Mute video"}
        >
          <span className="aiop-stripe-bridge__audio-icon" aria-hidden="true">
            {muted ? "\u25C7" : "\u25C6"}
          </span>
          <span className="aiop-stripe-bridge__audio-label">
            {muted ? audioToggle.listen : audioToggle.mute}
          </span>
        </button>
      ) : null}

      <div className="aiop-wrap aiop-stripe-bridge__inner">
        {/* Pull-quote + attribution + soft note. Mirrors the Evans
            bridge's `aiop-bridge__quote` figure structure so the two
            interstitials read in the same editorial register. */}
        <figure className="aiop-stripe-bridge__quote aiop-reveal">
          <blockquote
            id="aiop-stripe-bridge-quote"
            className="aiop-stripe-bridge__pull"
          >
            <span
              className="aiop-stripe-bridge__pull-mark"
              aria-hidden="true"
            >
              &ldquo;
            </span>
            {quoteParts.map((part, idx) => (
              <span key={idx} className="aiop-stripe-bridge__plain">
                {part.text}
              </span>
            ))}
          </blockquote>

          <div className="aiop-stripe-bridge__attrib-block">
            <figcaption className="aiop-stripe-bridge__attrib">
              <span
                className="aiop-stripe-bridge__attrib-rule"
                aria-hidden="true"
              />
              <span className="aiop-stripe-bridge__attrib-name">
                {attribName}
              </span>
              <span className="aiop-stripe-bridge__attrib-meta">
                {attribMeta}
              </span>
            </figcaption>

            {/* Soft note — single line, italic, parenthetical
                brackets in a quieter register. Mirrors the Evans
                bridge's `aiop-bridge__scroll-note`. */}
            <p className="aiop-stripe-bridge__note">
              <span
                className="aiop-stripe-bridge__note-bracket"
                aria-hidden="true"
              >
                (
              </span>
              {note}
              <span
                className="aiop-stripe-bridge__note-bracket"
                aria-hidden="true"
              >
                )
              </span>
            </p>
          </div>
        </figure>

        {/* Personal beat + email card. Two-column on desktop with the
            three lines on the left and the stylised reply card on
            the right; collapses to a single column on narrow widths. */}
        <div className="aiop-stripe-bridge__beat aiop-reveal">
          <ol className="aiop-stripe-bridge__lines" role="list">
            {personalLines.map((line, idx) => (
              <li key={idx} className="aiop-stripe-bridge__line">
                <span
                  className="aiop-stripe-bridge__line-mark"
                  aria-hidden="true"
                />
                <span className="aiop-stripe-bridge__line-text">{line}</span>
              </li>
            ))}
          </ol>

          <aside
            className="aiop-stripe-bridge__email"
            aria-label="Stripe engineer reply, paraphrased"
          >
            <header className="aiop-stripe-bridge__email-head">
              <span
                className="aiop-stripe-bridge__email-dot"
                aria-hidden="true"
              />
              <span className="aiop-stripe-bridge__email-eyebrow">
                {emailCard.eyebrow}
              </span>
            </header>
            <p className="aiop-stripe-bridge__email-body">
              <span
                className="aiop-stripe-bridge__email-quote"
                aria-hidden="true"
              >
                &ldquo;
              </span>
              {emailCard.body}
              <span
                className="aiop-stripe-bridge__email-quote"
                aria-hidden="true"
              >
                &rdquo;
              </span>
            </p>
            <p className="aiop-stripe-bridge__email-foot">{emailCard.foot}</p>
          </aside>
        </div>

        {/* Closing tie-back. Italic emphasis on the second clause
            echoes the hero's `ledeStrong` so the page reads as a
            closed loop. The closing block sits in the same editorial
            column rhythm as the quote above. */}
        <p className="aiop-stripe-bridge__closing aiop-reveal">
          <span className="aiop-stripe-bridge__closing-lead">
            {closing.lead}
          </span>
          <em className="aiop-stripe-bridge__closing-em">{closing.em}</em>
        </p>
      </div>
    </section>
  );
}
