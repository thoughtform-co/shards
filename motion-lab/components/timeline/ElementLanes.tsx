"use client";

import type { TimelineGeometry } from "../../lib/hooks/useTimelineGeometry";
import { addKeyframe } from "../../lib/motiondoc/mutate";
import { sampleElementValues } from "../../lib/motiondoc/sample";
import {
  ANIMATABLE_PROPS,
  type AnimatableProp,
  type MotionDoc,
  type Scene,
} from "../../lib/motiondoc/schema";
import { useStudioStore } from "../../lib/store/useStudioStore";

import { PropertyLane } from "./PropertyLane";

const KIND_GLYPH = { text: "T", shape: "◆", image: "▣" } as const;

/*
 * Rows for the ACTIVE scene's elements: one header per element, one
 * PropertyLane per existing track, and a "+ property" menu that
 * starts a new track by pinning a keyframe at the playhead with the
 * element's current value.
 */
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
  const select = useStudioStore((s) => s.select);
  const selection = useStudioStore((s) => s.selection);
  const commitDoc = useStudioStore((s) => s.commitDoc);
  const playhead = useStudioStore((s) => s.playhead);

  const addTrack = (elementId: string, property: AnimatableProp) => {
    const element = scene.elements.find((e) => e.id === elementId);
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
    return <p className="ml-lanes__empty">This scene has no elements yet.</p>;
  }

  return (
    <div className="ml-lanes">
      {scene.elements.map((element) => {
        const missing = ANIMATABLE_PROPS.filter(
          (p) => !element.tracks.some((t) => t.property === p),
        );
        const elementSelected =
          (selection.type === "element" || selection.type === "keyframe") &&
          selection.elementId === element.id;
        return (
          <div key={element.id} className="ml-lanes__group">
            <div
              className={`ml-lanes__header${
                elementSelected ? " ml-lanes__header--selected" : ""
              }`}
              onPointerDown={() =>
                select({
                  type: "element",
                  sceneId: scene.id,
                  elementId: element.id,
                })
              }
            >
              <span className="ml-lanes__kind">{KIND_GLYPH[element.kind]}</span>
              <span className="ml-lanes__name">{element.name}</span>
              {missing.length > 0 ? (
                <select
                  className="ml-lanes__addtrack"
                  value=""
                  onPointerDown={(e) => e.stopPropagation()}
                  onChange={(e) => {
                    if (e.target.value) {
                      addTrack(element.id, e.target.value as AnimatableProp);
                    }
                  }}
                  title="Animate a property (adds a keyframe at the playhead)"
                >
                  <option value="" disabled>
                    + property
                  </option>
                  {missing.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              ) : null}
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
        );
      })}
    </div>
  );
}
