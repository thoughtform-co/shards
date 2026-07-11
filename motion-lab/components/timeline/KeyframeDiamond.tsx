"use client";

import { useRef } from "react";

import type { TimelineGeometry } from "../../lib/hooks/useTimelineGeometry";
import { moveKeyframe, type TrackAddress } from "../../lib/motiondoc/mutate";
import type { Keyframe, MotionDoc } from "../../lib/motiondoc/schema";
import { useStudioStore } from "../../lib/store/useStudioStore";

/*
 * A draggable keyframe. Drags recompute from the gesture-start
 * snapshot (so dragging THROUGH a sibling never destroys it — only
 * the final resting frame overwrites, AE-style). Integer-frame snap
 * always; magnetic snap (±5px) to scene bounds, the playhead, and
 * sibling keyframes unless Alt is held.
 */
export function KeyframeDiamond({
  addr,
  keyframe,
  sceneStart,
  sceneDuration,
  siblingFrames,
  geometry,
}: {
  addr: TrackAddress;
  keyframe: Keyframe;
  /** Global frame the scene starts at. */
  sceneStart: number;
  sceneDuration: number;
  /** Scene-relative frames of the other keyframes on this track. */
  siblingFrames: number[];
  geometry: TimelineGeometry;
}) {
  const select = useStudioStore((s) => s.select);
  const selection = useStudioStore((s) => s.selection);
  const beginGesture = useStudioStore((s) => s.beginGesture);
  const endGesture = useStudioStore((s) => s.endGesture);
  const transientDoc = useStudioStore((s) => s.transientDoc);

  const dragState = useRef<{ base: MotionDoc; startX: number } | null>(null);

  const selected =
    selection.type === "keyframe" && selection.keyframeId === keyframe.id;

  const onPointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    select({
      type: "keyframe",
      sceneId: addr.sceneId,
      elementId: addr.elementId,
      property: addr.property,
      keyframeId: keyframe.id,
    });
    beginGesture();
    dragState.current = {
      base: useStudioStore.getState().doc,
      startX: e.clientX,
    };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const drag = dragState.current;
    if (!drag) return;
    const deltaFrames = geometry.pxToFrame(e.clientX - drag.startX);
    let frame = Math.round(keyframe.frame + deltaFrames);
    frame = Math.max(0, Math.min(frame, sceneDuration));

    if (!e.altKey) {
      const playheadLocal = useStudioStore.getState().playhead - sceneStart;
      const magnets = [0, sceneDuration, playheadLocal, ...siblingFrames];
      const threshold = geometry.pxToFrame(5);
      for (const magnet of magnets) {
        if (magnet >= 0 && Math.abs(frame - magnet) <= threshold) {
          frame = Math.round(magnet);
          break;
        }
      }
    }

    transientDoc(moveKeyframe(drag.base, addr, keyframe.id, frame));
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!dragState.current) return;
    dragState.current = null;
    e.currentTarget.releasePointerCapture(e.pointerId);
    endGesture();
  };

  return (
    <div
      className={`ml-kf${selected ? " ml-kf--selected" : ""}${
        keyframe.ease === "spring" ? " ml-kf--spring" : ""
      }`}
      style={{ left: geometry.frameToPx(sceneStart + keyframe.frame) }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      title={`f${keyframe.frame} = ${keyframe.value} (${keyframe.ease})`}
    />
  );
}
