"use client";

import { useEffect, useRef, useState } from "react";

import { stripeXThread, type XThreadTweet } from "./content";

/*
 * StripeXThread — auto-scrolling, dark-X recreation of the public
 * thread between Stripe, @voidwalker_com, and Bryan Irace (April
 * 29-30, 2026). Sits in the right column of the rewritten
 * `#stripe-ledger` context section.
 *
 * Architecture:
 *   - Faithful to X's dark mode chrome: `#000` background, primary
 *     text `#e7e9ea`, dim `#71767b`, divider `#2f3336`, accent blue
 *     `#1d9bf0`. Verified glyphs use the gold (`@stripe`, business)
 *     and blue (`@voidwalker_com`, paid) variants.
 *   - Each tweet renders as an article with avatar / header
 *     (name + verified + handle + timestamp) / body / optional
 *     media card / action bar (replies / reposts / likes / views /
 *     bookmark). A vertical reply line drops from the avatar of any
 *     tweet that has another tweet below it in the same conversation.
 *   - Auto-scroll: an IntersectionObserver starts a slow
 *     requestAnimationFrame loop on the scroll container once the
 *     thread enters the viewport. Linearly traverses from top to
 *     bottom over ~28 seconds, holds for two seconds, then loops.
 *     Pauses on hover or focus; halts entirely under
 *     `prefers-reduced-motion: reduce` and ignores the loop on
 *     narrow viewports where the thread renders inline (no fixed
 *     height to scroll inside).
 *   - The whole component is keyboard-accessible: the article body
 *     is a normal scroll container so users can scroll manually
 *     with the wheel, touch, or arrow keys regardless of whether
 *     the auto-scroll loop is running.
 */

const SCROLL_DURATION_MS = 28_000;
const HOLD_AT_BOTTOM_MS = 2_000;
const HOLD_AT_TOP_MS = 1_400;

export function StripeXThread() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [animated, setAnimated] = useState(false);
  const visibleRef = useRef(false);
  const pausedRef = useRef(false);

  // Decide whether to enable auto-scroll based on viewport width and
  // motion preference. Re-evaluates when either changes.
  useEffect(() => {
    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const widthMq = window.matchMedia("(min-width: 720px)");

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

  // Visibility observer: only autoscroll while the thread is in view.
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visibleRef.current = entry.isIntersecting;
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Auto-scroll loop driven by requestAnimationFrame. Bound to the
  // scroll container, scoped by visibility, paused on hover/focus.
  useEffect(() => {
    if (!animated) return;
    const scroller = scrollRef.current;
    if (!scroller) return;

    let raf = 0;
    let phase: "hold-top" | "scroll" | "hold-bottom" = "hold-top";
    let phaseStart = performance.now();

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (!visibleRef.current || pausedRef.current) {
        // Reset the phase clock so the journey resumes cleanly.
        phaseStart = now;
        return;
      }

      const max = scroller.scrollHeight - scroller.clientHeight;
      if (max <= 0) return;

      const elapsed = now - phaseStart;

      if (phase === "hold-top") {
        if (elapsed >= HOLD_AT_TOP_MS) {
          phase = "scroll";
          phaseStart = now;
        }
      } else if (phase === "scroll") {
        const progress = Math.min(1, elapsed / SCROLL_DURATION_MS);
        scroller.scrollTop = max * progress;
        if (progress >= 1) {
          phase = "hold-bottom";
          phaseStart = now;
        }
      } else if (phase === "hold-bottom") {
        if (elapsed >= HOLD_AT_BOTTOM_MS) {
          scroller.scrollTop = 0;
          phase = "hold-top";
          phaseStart = now;
        }
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [animated]);

  const onPointerEnter = () => {
    pausedRef.current = true;
  };
  const onPointerLeave = () => {
    pausedRef.current = false;
  };

  return (
    <aside
      ref={sectionRef}
      className={`aiop-x-thread${animated ? " aiop-x-thread--animated" : ""}`}
      aria-label="X thread between Stripe, Vincent Buyssens, and Bryan Irace, April 29 to 30 2026"
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onFocusCapture={onPointerEnter}
      onBlurCapture={onPointerLeave}
    >
      <header className="aiop-x-thread__head">
        <span className="aiop-x-thread__back" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path
              d="M14.5 5 8 12l6.5 7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span className="aiop-x-thread__title">{stripeXThread.headTitle}</span>
      </header>

      <div className="aiop-x-thread__scroll" ref={scrollRef} role="list">
        {stripeXThread.tweets.map((tweet) => (
          <Tweet key={tweet.id} tweet={tweet} />
        ))}
      </div>
    </aside>
  );
}

/* ─── Tweet article ────────────────────────────────────────────────── */

function Tweet({ tweet }: { tweet: XThreadTweet }) {
  const [avatarFailed, setAvatarFailed] = useState(false);
  const monogram = tweet.name.charAt(0).toUpperCase();
  const showMonogram = !tweet.avatar || avatarFailed;
  const ratioClass = tweet.media?.ratio
    ? ` aiop-x-thread__media--${tweet.media.ratio.replace(":", "x")}`
    : "";

  return (
    <article
      className={`aiop-x-thread__tweet${
        tweet.hasReplyLine ? " aiop-x-thread__tweet--connected" : ""
      }`}
      role="listitem"
    >
      <div className="aiop-x-thread__col">
        <span
          className="aiop-x-thread__avatar"
          aria-hidden="true"
          data-handle={tweet.handle}
        >
          {showMonogram ? (
            <span className="aiop-x-thread__avatar-monogram">{monogram}</span>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={tweet.avatar}
              alt=""
              loading="lazy"
              onError={() => setAvatarFailed(true)}
            />
          )}
        </span>
        {tweet.hasReplyLine ? (
          <span className="aiop-x-thread__reply-line" aria-hidden="true" />
        ) : null}
      </div>

      <div className="aiop-x-thread__body">
        <header className="aiop-x-thread__header">
          <span className="aiop-x-thread__name">{tweet.name}</span>
          {tweet.verified ? (
            <VerifiedBadge variant={tweet.verified} />
          ) : null}
          <span className="aiop-x-thread__handle">{tweet.handle}</span>
          <span className="aiop-x-thread__sep" aria-hidden="true">
            ·
          </span>
          <span className="aiop-x-thread__date">{tweet.date}</span>
        </header>

        <p className="aiop-x-thread__text">
          {tweet.body.split("\n\n").map((para, idx) => (
            <span key={idx} className="aiop-x-thread__para">
              {para}
            </span>
          ))}
        </p>

        {tweet.media && tweet.media.kind === "video" ? (
          <MediaCard tweet={tweet} ratioClass={ratioClass} />
        ) : null}

        <footer className="aiop-x-thread__actions" aria-hidden="true">
          <ActionPill icon="reply" value={tweet.stats.replies} />
          <ActionPill icon="repost" value={tweet.stats.reposts} />
          <ActionPill icon="like" value={tweet.stats.likes} />
          <ActionPill icon="views" value={tweet.stats.views} />
          <ActionPill icon="bookmark" />
          <ActionPill icon="share" />
        </footer>
      </div>
    </article>
  );
}

/* ─── Verified badge ───────────────────────────────────────────────── */

function VerifiedBadge({ variant }: { variant: "blue" | "business" }) {
  return (
    <span
      className={`aiop-x-thread__verified aiop-x-thread__verified--${variant}`}
      aria-label={variant === "business" ? "Verified business account" : "Verified account"}
      title={variant === "business" ? "Verified business" : "Verified"}
    >
      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
        <path
          d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z"
          fill="currentColor"
        />
      </svg>
    </span>
  );
}

/* ─── Action bar pill ──────────────────────────────────────────────── */

type ActionIcon = "reply" | "repost" | "like" | "views" | "bookmark" | "share";

function ActionPill({
  icon,
  value,
}: {
  icon: ActionIcon;
  value?: string;
}) {
  return (
    <span
      className={`aiop-x-thread__action aiop-x-thread__action--${icon}`}
      data-icon={icon}
    >
      <ActionGlyph icon={icon} />
      {value !== undefined ? (
        <span className="aiop-x-thread__action-value">{value}</span>
      ) : null}
    </span>
  );
}

function ActionGlyph({ icon }: { icon: ActionIcon }) {
  const common = {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    "aria-hidden": true as const,
    fill: "none" as const,
    stroke: "currentColor" as const,
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (icon) {
    case "reply":
      return (
        <svg {...common}>
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      );
    case "repost":
      return (
        <svg {...common}>
          <path d="M17 1l4 4-4 4" />
          <path d="M3 11V9a4 4 0 0 1 4-4h14" />
          <path d="M7 23l-4-4 4-4" />
          <path d="M21 13v2a4 4 0 0 1-4 4H3" />
        </svg>
      );
    case "like":
      return (
        <svg {...common}>
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      );
    case "views":
      return (
        <svg {...common}>
          <path d="M3 3h2v18H3z" />
          <path d="M9 13h2v8H9z" />
          <path d="M15 8h2v13h-2z" />
          <path d="M21 3v18" />
        </svg>
      );
    case "bookmark":
      return (
        <svg {...common}>
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
      );
    case "share":
      return (
        <svg {...common}>
          <path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7" />
          <path d="M16 6l-4-4-4 4" />
          <path d="M12 2v14" />
        </svg>
      );
  }
}

/* ─── Media card (video preview) ──────────────────────────────────── */

function MediaCard({
  tweet,
  ratioClass,
}: {
  tweet: XThreadTweet;
  ratioClass: string;
}) {
  if (!tweet.media || tweet.media.kind !== "video") return null;
  const { poster, duration, href, hrefLabel } = tweet.media;

  const inner = (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="aiop-x-thread__media-poster"
        src={poster}
        alt={hrefLabel ?? "Embedded video preview"}
        loading="lazy"
      />
      <span className="aiop-x-thread__media-play" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
          <path d="M8 5v14l11-7z" fill="currentColor" />
        </svg>
      </span>
      <span className="aiop-x-thread__media-duration" aria-hidden="true">
        {duration}
      </span>
    </>
  );

  if (href) {
    return (
      <a
        className={`aiop-x-thread__media${ratioClass}`}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={hrefLabel ?? "Open video preview"}
      >
        {inner}
      </a>
    );
  }

  return (
    <div className={`aiop-x-thread__media${ratioClass}`} aria-hidden="true">
      {inner}
    </div>
  );
}
