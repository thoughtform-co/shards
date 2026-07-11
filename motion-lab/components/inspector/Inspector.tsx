"use client";

import { computeSceneStarts } from "../../lib/motiondoc/timing";
import { findSelection, useStudioStore } from "../../lib/store/useStudioStore";

import { ElementInspector } from "./ElementInspector";
import { KeyframeInspector } from "./KeyframeInspector";
import { ProjectInspector } from "./ProjectInspector";
import { SceneInspector } from "./SceneInspector";

export function Inspector({
  reviseSlot,
}: {
  /** Rendered inside SceneInspector (P7's revise-with-note box). */
  reviseSlot?: (sceneId: string) => React.ReactNode;
}) {
  const doc = useStudioStore((s) => s.doc);
  const selection = useStudioStore((s) => s.selection);
  const resolved = findSelection(doc, selection);

  if (selection.type === "none" || !resolved.scene) {
    return <ProjectInspector doc={doc} />;
  }

  const scene = resolved.scene;

  if (selection.type === "keyframe" && resolved.element && resolved.keyframe) {
    return (
      <KeyframeInspector
        doc={doc}
        scene={scene}
        addr={{
          sceneId: selection.sceneId,
          elementId: selection.elementId,
          property: selection.property,
        }}
        keyframe={resolved.keyframe}
      />
    );
  }

  if (
    (selection.type === "element" || selection.type === "keyframe") &&
    resolved.element
  ) {
    const sceneIndex = doc.scenes.findIndex((s) => s.id === scene.id);
    const starts = computeSceneStarts(doc);
    return (
      <ElementInspector
        doc={doc}
        scene={scene}
        element={resolved.element}
        sceneStart={starts[sceneIndex]}
      />
    );
  }

  return (
    <SceneInspector doc={doc} scene={scene} reviseSlot={reviseSlot?.(scene.id)} />
  );
}
