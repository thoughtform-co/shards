"use client";

import type { TimelineGeometry } from "../../lib/hooks/useTimelineGeometry";
import { useStudioStore } from "../../lib/store/useStudioStore";

/*
 * The playhead line spanning the timeline content. Dragging is handled
 * by the scrub surface in Timeline.tsx; this is purely visual.
 */
export function Playhead({ geometry }: { geometry: TimelineGeometry }) {
  const playhead = useStudioStore((s) => s.playhead);
  return (
    <div
      className="ml-playhead"
      style={{ left: geometry.frameToPx(playhead) }}
    >
      <div className="ml-playhead__cap" />
    </div>
  );
}
