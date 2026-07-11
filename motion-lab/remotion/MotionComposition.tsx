import { useMemo } from "react";
import { AbsoluteFill, Sequence } from "remotion";

import { resolveColor } from "../lib/motiondoc/colors";
import type { MotionDoc } from "../lib/motiondoc/schema";
import { computeSceneStarts, overlapIn } from "../lib/motiondoc/timing";

import { loadBundledFonts } from "./fonts";
import { SceneRenderer } from "./SceneRenderer";

loadBundledFonts();

export type MotionCompositionProps = {
  doc: MotionDoc;
};

/*
 * The generic interpreter: renders ANY MotionDoc from inputProps.
 * Plain <Sequence from> (not <Series>) because crossfades overlap;
 * array order keeps the incoming scene painted on top during the
 * overlap window.
 */
export function MotionComposition({ doc }: MotionCompositionProps) {
  const starts = useMemo(() => computeSceneStarts(doc), [doc]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: resolveColor(doc.meta.background, doc.brand),
      }}
    >
      {doc.scenes.map((scene, i) => {
        const prev = doc.scenes[i - 1];
        const next = doc.scenes[i + 1];
        return (
          <Sequence
            key={scene.id}
            from={starts[i]}
            durationInFrames={scene.durationInFrames}
            name={scene.name}
          >
            <SceneRenderer
              scene={scene}
              brand={doc.brand}
              incomingOverlap={i > 0 ? overlapIn(scene, prev) : 0}
              outgoingOverlap={next ? overlapIn(next, scene) : 0}
            />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
}
