"use client";

import { useMemo } from "react";

import type { MotionDoc } from "../motiondoc/schema";
import { computeSceneStarts, totalDurationInFrames } from "../motiondoc/timing";
import { useStudioStore } from "../store/useStudioStore";

/*
 * Shared frame↔pixel math for every timeline component. All positions
 * are in CONTENT space (px from the inner container's left edge);
 * callers add/remove scrollLeft when converting from client coords.
 */
export function useTimelineGeometry(doc: MotionDoc) {
  const zoom = useStudioStore((s) => s.zoom);

  return useMemo(() => {
    const starts = computeSceneStarts(doc);
    const total = totalDurationInFrames(doc);
    return {
      zoom,
      starts,
      total,
      contentWidth: total * zoom + 240,
      frameToPx: (frame: number) => frame * zoom,
      pxToFrame: (px: number) => px / zoom,
    };
  }, [doc, zoom]);
}

export type TimelineGeometry = ReturnType<typeof useTimelineGeometry>;
