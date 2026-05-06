"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ProjectScreenshot } from "./content";
import { useReducedMotion } from "./use-reduced-motion";

/*
 * ScreenshotGallery — auto-rotating image carousel.
 *
 * Mirror of Heimdall's `ScreenshotGallery` adapted to the AI Operator
 * route's class namespace. Cycles every 4.5s, pauses on hover/focus,
 * respects prefers-reduced-motion (live), and falls back to a single
 * image when only one screenshot is provided.
 *
 * The dots are plain buttons rather than a `tablist`: we don't render
 * separate tab panels and we don't implement arrow-key tab navigation,
 * so claiming the role would over-promise the keyboard contract. Each
 * dot still carries a descriptive label and `aria-current` tracks the
 * active slide.
 */

interface ScreenshotGalleryProps {
  screenshots: ProjectScreenshot[];
  name: string;
  className?: string;
}

const INTERVAL_MS = 4500;

export function ScreenshotGallery({
  screenshots,
  name,
  className,
}: ScreenshotGalleryProps) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const reduced = useReducedMotion();

  const count = screenshots.length;

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  /* Autoplay: a single source of truth. The interval is re-armed any
   * time the conditions change (count, pause, motion preference, or
   * the active slide) so a manual click resets the dwell window. */
  useEffect(() => {
    if (count <= 1 || paused || reduced) {
      clearTimer();
      return;
    }
    clearTimer();
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % count);
    }, INTERVAL_MS);
    return clearTimer;
  }, [count, paused, reduced, active, clearTimer]);

  const goTo = useCallback((idx: number) => {
    setActive(idx);
  }, []);

  if (count === 0) return null;

  if (count === 1) {
    return (
      <div className={className}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={screenshots[0].src} alt={screenshots[0].alt} />
      </div>
    );
  }

  return (
    <div
      className={`aiop-gallery ${className ?? ""}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="aiop-gallery__track">
        {screenshots.map((shot, i) => (
          <div
            key={`${i}-${shot.src}`}
            className={`aiop-gallery__slide${i === active ? " is-active" : ""}`}
            aria-hidden={i !== active}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={shot.src}
              alt={shot.alt}
              loading={i === 0 ? undefined : "lazy"}
            />
          </div>
        ))}
      </div>

      <div className="aiop-gallery__dots" aria-label={`${name} screenshots`}>
        {screenshots.map((shot, i) => (
          <button
            key={`${i}-${shot.src}`}
            type="button"
            aria-label={shot.caption ?? shot.alt}
            aria-current={i === active ? "true" : undefined}
            className={`aiop-gallery__dot${i === active ? " is-active" : ""}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </div>
  );
}
