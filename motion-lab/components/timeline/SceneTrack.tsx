"use client";

import type { TimelineGeometry } from "../../lib/hooks/useTimelineGeometry";
import type { MotionDoc } from "../../lib/motiondoc/schema";

import { SceneBlock } from "./SceneBlock";

export function SceneTrack({
  doc,
  geometry,
}: {
  doc: MotionDoc;
  geometry: TimelineGeometry;
}) {
  return (
    <div className="ml-scenetrack">
      {doc.scenes.map((scene, i) => (
        <SceneBlock
          key={scene.id}
          doc={doc}
          scene={scene}
          index={i}
          geometry={geometry}
        />
      ))}
    </div>
  );
}
