"use client";

import { useRef } from "react";

import type { TimelineGeometry } from "../../lib/hooks/useTimelineGeometry";
import { retimeScene } from "../../lib/motiondoc/mutate";
import type { MotionDoc, Scene } from "../../lib/motiondoc/schema";
import { useStudioStore } from "../../lib/store/useStudioStore";

/*
 * One scene on the scene track. Body click selects; the right edge
 * drags to retime (min 10 frames, integer snap). Retimes are
 * gesture-scoped: every pointermove recomputes from the gesture-start
 * snapshot, one undo entry per drag.
 */
export function SceneBlock({
  doc,
  scene,
  index,
  geometry,
}: {
  doc: MotionDoc;
  scene: Scene;
  index: number;
  geometry: TimelineGeometry;
}) {
  const select = useStudioStore((s) => s.select);
  const selection = useStudioStore((s) => s.selection);
  const beginGesture = useStudioStore((s) => s.beginGesture);
  const endGesture = useStudioStore((s) => s.endGesture);
  const transientDoc = useStudioStore((s) => s.transientDoc);

  const dragState = useRef<{
    base: MotionDoc;
    startX: number;
    startDuration: number;
  } | null>(null);

  const selected =
    selection.type !== "none" && selection.sceneId === scene.id;

  const left = geometry.frameToPx(geometry.starts[index]);
  const width = geometry.frameToPx(scene.durationInFrames);
  const crossfade =
    index > 0 && scene.transitionIn.type === "crossfade"
      ? scene.transitionIn.durationInFrames
      : 0;

  const onEdgePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    beginGesture();
    dragState.current = {
      base: useStudioStore.getState().doc,
      startX: e.clientX,
      startDuration: scene.durationInFrames,
    };
  };

  const onEdgePointerMove = (e: React.PointerEvent) => {
    const drag = dragState.current;
    if (!drag) return;
    const deltaFrames = geometry.pxToFrame(e.clientX - drag.startX);
    const next = Math.max(10, Math.round(drag.startDuration + deltaFrames));
    transientDoc(retimeScene(drag.base, scene.id, next));
  };

  const onEdgePointerUp = (e: React.PointerEvent) => {
    if (!dragState.current) return;
    dragState.current = null;
    e.currentTarget.releasePointerCapture(e.pointerId);
    endGesture();
  };

  return (
    <div
      className={`ml-scene${selected ? " ml-scene--selected" : ""}`}
      style={{ left, width }}
      onPointerDown={(e) => {
        e.stopPropagation();
        select({ type: "scene", sceneId: scene.id });
      }}
      title={`${scene.name} · ${scene.durationInFrames}f`}
    >
      {crossfade > 0 ? (
        <span
          className="ml-scene__xfade"
          style={{ width: Math.max(10, geometry.frameToPx(crossfade)) }}
          title={`crossfade ${crossfade}f`}
        />
      ) : null}
      <span className="ml-scene__name">{scene.name}</span>
      <span className="ml-scene__duration">{scene.durationInFrames}f</span>
      <span
        className="ml-scene__edge"
        onPointerDown={onEdgePointerDown}
        onPointerMove={onEdgePointerMove}
        onPointerUp={onEdgePointerUp}
        title="Drag to retime"
      />
    </div>
  );
}
