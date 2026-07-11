"use client";

import type { TimelineGeometry } from "../../lib/hooks/useTimelineGeometry";

/*
 * Frame/seconds ruler. Major tick spacing adapts to zoom, aiming for
 * ~70px+ between labels. Clicking/dragging on the ruler scrubs — the
 * pointer handling lives in Timeline.tsx (the ruler is a child of the
 * scrub surface).
 */

const MAJOR_CANDIDATES = [5, 10, 15, 30, 60, 90, 150, 300, 600];

export function TimeRuler({
  geometry,
  fps,
}: {
  geometry: TimelineGeometry;
  fps: number;
}) {
  const { zoom, total, frameToPx } = geometry;
  const major =
    MAJOR_CANDIDATES.find((c) => c * zoom >= 70) ??
    MAJOR_CANDIDATES[MAJOR_CANDIDATES.length - 1];

  const ticks: { frame: number; isMajor: boolean }[] = [];
  const minor = Math.max(1, Math.round(major / 5));
  for (let f = 0; f <= total; f += minor) {
    ticks.push({ frame: f, isMajor: f % major === 0 });
  }

  return (
    <div className="ml-ruler" data-scrub-surface="true">
      {ticks.map(({ frame, isMajor }) => (
        <div
          key={frame}
          className={`ml-ruler__tick${isMajor ? " ml-ruler__tick--major" : ""}`}
          style={{ left: frameToPx(frame) }}
        >
          {isMajor ? (
            <span className="ml-ruler__label">
              {(frame / fps).toFixed(frame % fps === 0 ? 0 : 1)}s
            </span>
          ) : null}
        </div>
      ))}
    </div>
  );
}
