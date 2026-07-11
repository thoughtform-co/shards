"use client";

import { useRef } from "react";

import type { TimelineGeometry } from "../../lib/hooks/useTimelineGeometry";
import {
  addKeyframe,
  deleteElement,
  duplicateElement,
  moveElementToIndex,
  patchElement,
  shiftElementInTime,
  trimElement,
} from "../../lib/motiondoc/mutate";
import { sampleElementValues } from "../../lib/motiondoc/sample";
import {
  ANIMATABLE_PROPS,
  type AnimatableProp,
  type MotionDoc,
  type MotionElement,
  type Scene,
} from "../../lib/motiondoc/schema";
import { useStudioStore } from "../../lib/store/useStudioStore";
import { useStudioUiStore } from "../../lib/store/useStudioUiStore";

import { PropertyLane } from "./PropertyLane";

const KIND_GLYPH = { text: "T", shape: "◆", image: "▧" } as const;

function nearestSnap(value: number, magnets: number[], threshold: number) {
  let best = value;
  let distance = threshold + 1;
  magnets.forEach((magnet) => {
    const nextDistance = Math.abs(value - magnet);
    if (nextDistance <= threshold && nextDistance < distance) {
      best = magnet;
      distance = nextDistance;
    }
  });
  return Math.round(best);
}

function LayerClip({
  doc,
  scene,
  element,
  sceneStart,
  geometry,
}: {
  doc: MotionDoc;
  scene: Scene;
  element: MotionElement;
  sceneStart: number;
  geometry: TimelineGeometry;
}) {
  const beginGesture = useStudioStore((state) => state.beginGesture);
  const transientDoc = useStudioStore((state) => state.transientDoc);
  const endGesture = useStudioStore((state) => state.endGesture);
  const select = useStudioStore((state) => state.select);
  const snapping = useStudioUiStore((state) => state.snapping);
  const drag = useRef<{
    base: MotionDoc;
    x: number;
    mode: "move" | "in" | "out";
    inFrame: number;
    outFrame: number;
  } | null>(null);

  const start = (event: React.PointerEvent, mode: "move" | "in" | "out") => {
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    select({ type: "element", sceneId: scene.id, elementId: element.id });
    beginGesture();
    drag.current = {
      base: useStudioStore.getState().doc,
      x: event.clientX,
      mode,
      inFrame: element.inFrame,
      outFrame: element.outFrame,
    };
  };

  const move = (event: React.PointerEvent) => {
    const state = drag.current;
    if (!state) return;
    const delta = Math.round(geometry.pxDeltaToFrames(event.clientX - state.x));
    const playheadLocal = useStudioStore.getState().playhead - sceneStart;
    const siblings = scene.elements
      .filter((item) => item.id !== element.id)
      .flatMap((item) => [item.inFrame, item.outFrame]);
    const magnets = [0, scene.durationInFrames, playheadLocal, ...siblings];
    const threshold = geometry.pxDeltaToFrames(6);

    if (state.mode === "move") {
      let nextDelta = delta;
      if (snapping && !event.altKey) {
        const snappedIn = nearestSnap(state.inFrame + delta, magnets, threshold);
        const snappedOut = nearestSnap(state.outFrame + delta, magnets, threshold);
        const inCorrection = snappedIn - (state.inFrame + delta);
        const outCorrection = snappedOut - (state.outFrame + delta);
        nextDelta +=
          Math.abs(inCorrection) <= Math.abs(outCorrection)
            ? inCorrection
            : outCorrection;
      }
      transientDoc(
        shiftElementInTime(state.base, scene.id, element.id, nextDelta),
      );
      return;
    }

    let frame =
      state.mode === "in" ? state.inFrame + delta : state.outFrame + delta;
    if (snapping && !event.altKey) {
      frame = nearestSnap(frame, magnets, threshold);
    }
    transientDoc(trimElement(state.base, scene.id, element.id, state.mode, frame));
  };

  const end = (event: React.PointerEvent) => {
    if (!drag.current) return;
    drag.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);
    endGesture();
  };

  const effectiveOut = Math.min(scene.durationInFrames, element.outFrame);
  return (
    <div
      className={`ml-layer-clip${element.visible ? "" : " is-hidden"}${
        element.locked ? " is-locked" : ""
      }`}
      style={{
        left: geometry.frameToPx(sceneStart + element.inFrame),
        width: Math.max(
          8,
          geometry.framesToPx(Math.max(1, effectiveOut - element.inFrame)),
        ),
      }}
      onPointerDown={(event) => !element.locked && start(event, "move")}
      onPointerMove={move}
      onPointerUp={end}
      title={`${element.name} · f${element.inFrame}–${effectiveOut}`}
    >
      <span className="ml-layer-clip__label">{element.name}</span>
      <span
        className="ml-layer-clip__handle ml-layer-clip__handle--in"
        onPointerDown={(event) => !element.locked && start(event, "in")}
        onPointerMove={move}
        onPointerUp={end}
      />
      <span
        className="ml-layer-clip__handle ml-layer-clip__handle--out"
        onPointerDown={(event) => !element.locked && start(event, "out")}
        onPointerMove={move}
        onPointerUp={end}
      />
    </div>
  );
}

export function ElementLanes({
  doc,
  scene,
  sceneStart,
  geometry,
}: {
  doc: MotionDoc;
  scene: Scene;
  sceneStart: number;
  geometry: TimelineGeometry;
}) {
  const select = useStudioStore((state) => state.select);
  const selection = useStudioStore((state) => state.selection);
  const commitDoc = useStudioStore((state) => state.commitDoc);
  const playhead = useStudioStore((state) => state.playhead);
  const expanded = useStudioUiStore((state) => state.expandedElementIds);
  const toggleExpanded = useStudioUiStore((state) => state.toggleElementExpanded);

  const addTrack = (elementId: string, property: AnimatableProp) => {
    const element = scene.elements.find((item) => item.id === elementId);
    if (!element) return;
    const frame = Math.max(
      0,
      Math.min(Math.round(playhead - sceneStart), scene.durationInFrames),
    );
    const value = sampleElementValues(element, frame, doc.meta.fps)[property];
    const result = addKeyframe(
      doc,
      { sceneId: scene.id, elementId, property },
      { frame, value },
    );
    commitDoc(result.doc);
    select({
      type: "keyframe",
      sceneId: scene.id,
      elementId,
      property,
      keyframeId: result.keyframeId,
    });
  };

  if (scene.elements.length === 0) {
    return <p className="ml-lanes__empty">Use Create or Assets to add the first layer.</p>;
  }

  const frontToBack = [...scene.elements].reverse();
  return (
    <div className="ml-lanes">
      {frontToBack.map((element, displayIndex) => {
        const missing = ANIMATABLE_PROPS.filter(
          (property) => !element.tracks.some((track) => track.property === property),
        );
        const elementSelected =
          (selection.type === "element" || selection.type === "keyframe") &&
          selection.elementId === element.id;
        const isExpanded = expanded.includes(element.id);
        return (
          <div
            key={element.id}
            className={`ml-lanes__group${elementSelected ? " is-selected" : ""}`}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              const draggedId = event.dataTransfer.getData("text/motion-layer");
              if (!draggedId) return;
              const documentIndex = scene.elements.length - 1 - displayIndex;
              commitDoc(moveElementToIndex(doc, scene.id, draggedId, documentIndex));
            }}
          >
            <div className="ml-layer-row">
              <div
                className="ml-layer-row__controls"
                draggable
                onDragStart={(event) =>
                  event.dataTransfer.setData("text/motion-layer", element.id)
                }
                onPointerDown={() =>
                  select({ type: "element", sceneId: scene.id, elementId: element.id })
                }
              >
                <button
                  type="button"
                  className="ml-layer-row__disclosure"
                  onPointerDown={(event) => event.stopPropagation()}
                  onClick={() => toggleExpanded(element.id)}
                  aria-label={isExpanded ? "Collapse layer" : "Expand layer"}
                >
                  {isExpanded ? "▾" : "▸"}
                </button>
                <span className="ml-lanes__kind">{KIND_GLYPH[element.kind]}</span>
                <span className="ml-lanes__name" title={element.name}>{element.name}</span>
                <button
                  type="button"
                  className={element.visible ? "is-active" : ""}
                  onPointerDown={(event) => event.stopPropagation()}
                  onClick={() =>
                    commitDoc(
                      patchElement(doc, scene.id, element.id, {
                        visible: !element.visible,
                      }),
                    )
                  }
                  title="Toggle visibility"
                >
                  {element.visible ? "◉" : "○"}
                </button>
                <button
                  type="button"
                  className={element.locked ? "is-active" : ""}
                  onPointerDown={(event) => event.stopPropagation()}
                  onClick={() =>
                    commitDoc(
                      patchElement(doc, scene.id, element.id, {
                        locked: !element.locked,
                      }),
                    )
                  }
                  title="Toggle lock"
                >
                  {element.locked ? "●" : "·"}
                </button>
                <button
                  type="button"
                  onPointerDown={(event) => event.stopPropagation()}
                  onClick={() => commitDoc(duplicateElement(doc, scene.id, element.id))}
                  title="Duplicate layer"
                >
                  +
                </button>
                <button
                  type="button"
                  onPointerDown={(event) => event.stopPropagation()}
                  onClick={() => {
                    commitDoc(deleteElement(doc, scene.id, element.id));
                    select({ type: "scene", sceneId: scene.id });
                  }}
                  title="Delete layer"
                >
                  ×
                </button>
              </div>
              <div className="ml-layer-row__track" data-scrub-surface="true">
                <LayerClip
                  doc={doc}
                  scene={scene}
                  element={element}
                  sceneStart={sceneStart}
                  geometry={geometry}
                />
              </div>
            </div>
            {isExpanded ? (
              <div className="ml-layer-properties">
                <div className="ml-layer-properties__add">
                  {missing.length > 0 ? (
                    <select
                      value=""
                      onChange={(event) => {
                        if (event.target.value) {
                          addTrack(element.id, event.target.value as AnimatableProp);
                        }
                      }}
                    >
                      <option value="" disabled>＋ Animate property</option>
                      {missing.map((property) => (
                        <option key={property} value={property}>{property}</option>
                      ))}
                    </select>
                  ) : (
                    <span>All transform properties animated</span>
                  )}
                </div>
                {element.tracks.map((track) => (
                  <PropertyLane
                    key={track.property}
                    doc={doc}
                    element={element}
                    track={track}
                    sceneId={scene.id}
                    sceneStart={sceneStart}
                    sceneDuration={scene.durationInFrames}
                    fps={doc.meta.fps}
                    geometry={geometry}
                  />
                ))}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
