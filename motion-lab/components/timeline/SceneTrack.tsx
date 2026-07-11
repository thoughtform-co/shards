"use client";

import type { TimelineGeometry } from "../../lib/hooks/useTimelineGeometry";
import type { MotionDoc } from "../../lib/motiondoc/schema";
import { moveSceneToIndex } from "../../lib/motiondoc/mutate";
import { useStudioStore } from "../../lib/store/useStudioStore";

import { SceneBlock } from "./SceneBlock";

export function SceneTrack({
  doc,
  geometry,
}: {
  doc: MotionDoc;
  geometry: TimelineGeometry;
}) {
  const commitDoc = useStudioStore((state) => state.commitDoc);
  return (
    <div className="ml-scenetrack">
      {doc.scenes.map((scene, i) => (
        <SceneBlock
          key={scene.id}
          doc={doc}
          scene={scene}
          index={i}
          geometry={geometry}
          onSceneDrop={(sceneId) =>
            commitDoc(moveSceneToIndex(doc, sceneId, i))
          }
        />
      ))}
    </div>
  );
}
