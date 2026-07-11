"use client";

import { useEffect, useRef } from "react";

import { useTimelineGeometry } from "../../lib/hooks/useTimelineGeometry";
import { sceneIndexAtFrame } from "../../lib/motiondoc/timing";
import { useStudioStore } from "../../lib/store/useStudioStore";

import { ElementLanes } from "./ElementLanes";
import { Playhead } from "./Playhead";
import { SceneTrack } from "./SceneTrack";
import { TimeRuler } from "./TimeRuler";

/*
 * The timeline region: toolbar, ruler (scrub surface), scene track,
 * and the active scene's element lanes, all in one 2-axis scroll
 * container. Ctrl/Cmd+wheel zooms anchored at the cursor.
 *
 * "Active scene" = the selected one, else whichever the playhead is
 * inside — so playing through the video walks the lanes along.
 */
export function Timeline() {
  const doc = useStudioStore((s) => s.doc);
  const selection = useStudioStore((s) => s.selection);
  const playhead = useStudioStore((s) => s.playhead);
  const seek = useStudioStore((s) => s.seek);
  const zoom = useStudioStore((s) => s.zoom);
  const setZoom = useStudioStore((s) => s.setZoom);

  const geometry = useTimelineGeometry(doc);
  const scrollRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const scrubbing = useRef(false);

  const activeSceneIndex =
    selection.type !== "none"
      ? Math.max(
          0,
          doc.scenes.findIndex((s) => s.id === selection.sceneId),
        )
      : sceneIndexAtFrame(doc, playhead);
  const activeScene = doc.scenes[activeSceneIndex];

  /* Cursor-anchored zoom needs a non-passive wheel listener. */
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      const state = useStudioStore.getState();
      const rect = container.getBoundingClientRect();
      const cursorOffset = e.clientX - rect.left;
      const frameAtCursor =
        (container.scrollLeft + cursorOffset) / state.zoom;
      const factor = Math.exp(-e.deltaY * 0.0016);
      const next = Math.max(0.25, Math.min(8, state.zoom * factor));
      state.setZoom(next);
      requestAnimationFrame(() => {
        container.scrollLeft = frameAtCursor * next - cursorOffset;
      });
    };
    container.addEventListener("wheel", onWheel, { passive: false });
    return () => container.removeEventListener("wheel", onWheel);
  }, []);

  const contentFrameFromEvent = (e: React.PointerEvent): number => {
    const inner = innerRef.current;
    if (!inner) return 0;
    const rect = inner.getBoundingClientRect();
    return geometry.pxToFrame(e.clientX - rect.left);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest("[data-scrub-surface]")) return;
    scrubbing.current = true;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    seek(contentFrameFromEvent(e));
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!scrubbing.current) return;
    seek(contentFrameFromEvent(e));
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!scrubbing.current) return;
    scrubbing.current = false;
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
  };

  const fit = () => {
    const container = scrollRef.current;
    if (!container) return;
    const usable = container.clientWidth - 260;
    setZoom(usable / geometry.total);
  };

  return (
    <div className="ml-timeline">
      <div className="ml-timeline__toolbar">
        <span className="ml-timeline__scene-label">
          Scene {activeSceneIndex + 1}/{doc.scenes.length} ·{" "}
          <strong>{activeScene.name}</strong>
        </span>
        <span className="ml-timeline__hint">
          double-click a lane = add keyframe · drag scene edge = retime ·
          ctrl+scroll = zoom
        </span>
        <div className="ml-timeline__zoom">
          <button
            type="button"
            className="ml-btn"
            onClick={() => setZoom(zoom * 0.8)}
            title="Zoom out"
          >
            −
          </button>
          <button type="button" className="ml-btn" onClick={fit} title="Fit">
            Fit
          </button>
          <button
            type="button"
            className="ml-btn"
            onClick={() => setZoom(zoom * 1.25)}
            title="Zoom in"
          >
            +
          </button>
        </div>
      </div>

      <div
        className="ml-timeline__scroll"
        ref={scrollRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        <div
          className="ml-timeline__inner"
          ref={innerRef}
          style={{ width: geometry.contentWidth }}
        >
          <TimeRuler geometry={geometry} fps={doc.meta.fps} />
          <SceneTrack doc={doc} geometry={geometry} />
          <ElementLanes
            doc={doc}
            scene={activeScene}
            sceneStart={geometry.starts[activeSceneIndex]}
            geometry={geometry}
          />
          <Playhead geometry={geometry} />
        </div>
      </div>
    </div>
  );
}
