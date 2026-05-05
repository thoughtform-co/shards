"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ProjectScreenshot } from "./content";

/*
 * ScreenshotGallery — auto-rotating image carousel.
 *
 * Mirror of Heimdall's `ScreenshotGallery` adapted to the AI Operator
 * route's class namespace. Cycles every 4.5s, pauses on hover/focus,
 * respects prefers-reduced-motion, and falls back to a single image
 * when only one screenshot is provided.
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
  const reducedRef = useRef(false);

  useEffect(() => {
    reducedRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
  }, []);

  const count = screenshots.length;

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (count <= 1 || paused || reducedRef.current) {
      clearTimer();
      return;
    }
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % count);
    }, INTERVAL_MS);
    return clearTimer;
  }, [count, paused, clearTimer]);

  const goTo = useCallback(
    (idx: number) => {
      setActive(idx);
      clearTimer();
      if (count > 1 && !reducedRef.current) {
        timerRef.current = setInterval(() => {
          setActive((prev) => (prev + 1) % count);
        }, INTERVAL_MS);
      }
    },
    [count, clearTimer],
  );

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
            key={shot.src}
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

      <div
        className="aiop-gallery__dots"
        role="tablist"
        aria-label={`${name} screenshots`}
      >
        {screenshots.map((shot, i) => (
          <button
            key={shot.src}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-label={shot.caption ?? shot.alt}
            className={`aiop-gallery__dot${i === active ? " is-active" : ""}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </div>
  );
}
