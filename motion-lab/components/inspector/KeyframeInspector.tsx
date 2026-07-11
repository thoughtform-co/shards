"use client";

import { deleteKeyframe, patchKeyframe, type TrackAddress } from "../../lib/motiondoc/mutate";
import type {
  AnimatableProp,
  Keyframe,
  MotionDoc,
  Scene,
} from "../../lib/motiondoc/schema";
import { useStudioStore } from "../../lib/store/useStudioStore";

import { EasingSelect } from "./EasingSelect";
import { NumberField, type ChangePhase } from "./fields";

const VALUE_FIELD: Record<
  AnimatableProp,
  { step: number; precision: number; min?: number; max?: number }
> = {
  x: { step: 1, precision: 0 },
  y: { step: 1, precision: 0 },
  scale: { step: 0.01, precision: 2, min: -10, max: 10 },
  rotation: { step: 1, precision: 0 },
  opacity: { step: 0.02, precision: 2, min: 0, max: 1 },
};

export function KeyframeInspector({
  doc,
  scene,
  addr,
  keyframe,
}: {
  doc: MotionDoc;
  scene: Scene;
  addr: TrackAddress;
  keyframe: Keyframe;
}) {
  const beginGesture = useStudioStore((s) => s.beginGesture);
  const endGesture = useStudioStore((s) => s.endGesture);
  const transientDoc = useStudioStore((s) => s.transientDoc);
  const commitDoc = useStudioStore((s) => s.commitDoc);
  const select = useStudioStore((s) => s.select);

  const apply = (next: MotionDoc, phase: ChangePhase) => {
    beginGesture();
    transientDoc(next);
    if (phase === "commit") endGesture();
  };

  const valueField = VALUE_FIELD[addr.property];

  return (
    <section className="ml-panel">
      <h2 className="ml-panel__title">
        Keyframe · {addr.property}
      </h2>
      <NumberField
        label="frame"
        value={keyframe.frame}
        min={0}
        max={scene.durationInFrames}
        onChange={(v, phase) =>
          apply(patchKeyframe(doc, addr, keyframe.id, { frame: v }), phase)
        }
        title={`0 … ${scene.durationInFrames} (scene-relative)`}
      />
      <NumberField
        label="value"
        value={keyframe.value}
        step={valueField.step}
        precision={valueField.precision}
        min={valueField.min}
        max={valueField.max}
        onChange={(v, phase) =>
          apply(patchKeyframe(doc, addr, keyframe.id, { value: v }), phase)
        }
      />
      <EasingSelect
        ease={keyframe.ease}
        spring={keyframe.spring}
        onChange={(patch, phase) =>
          apply(patchKeyframe(doc, addr, keyframe.id, patch), phase)
        }
      />
      <div className="ml-panel__actions">
        <button
          type="button"
          className="ml-btn ml-btn--danger"
          onClick={() => {
            commitDoc(deleteKeyframe(doc, addr, keyframe.id));
            select({
              type: "element",
              sceneId: addr.sceneId,
              elementId: addr.elementId,
            });
          }}
        >
          Delete keyframe
        </button>
      </div>
    </section>
  );
}
