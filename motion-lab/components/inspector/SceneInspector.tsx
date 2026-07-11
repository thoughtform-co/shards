"use client";

import {
  deleteScene,
  duplicateScene,
  moveScene,
  patchScene,
} from "../../lib/motiondoc/mutate";
import type { MotionDoc, Scene } from "../../lib/motiondoc/schema";
import { useStudioStore } from "../../lib/store/useStudioStore";

import {
  ColorField,
  NumberField,
  SelectField,
  TextField,
  type ChangePhase,
} from "./fields";

export function SceneInspector({
  doc,
  scene,
  /** P7 mounts the "revise with a note" box here. */
  reviseSlot,
}: {
  doc: MotionDoc;
  scene: Scene;
  reviseSlot?: React.ReactNode;
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

  const index = doc.scenes.findIndex((s) => s.id === scene.id);
  const isFirst = index === 0;

  return (
    <section className="ml-panel">
      <h2 className="ml-panel__title">Scene {index + 1}</h2>
      <TextField
        label="name"
        value={scene.name}
        onCommit={(v) => apply(patchScene(doc, scene.id, { name: v }), "commit")}
      />
      <NumberField
        label="duration"
        value={scene.durationInFrames}
        min={10}
        onChange={(v, p) =>
          apply(patchScene(doc, scene.id, { durationInFrames: v }), p)
        }
        title={`${(scene.durationInFrames / doc.meta.fps).toFixed(2)}s at ${doc.meta.fps}fps`}
      />
      {!isFirst ? (
        <>
          <SelectField
            label="transition in"
            value={scene.transitionIn.type}
            options={[
              { value: "cut", label: "cut" },
              { value: "crossfade", label: "crossfade" },
            ]}
            onCommit={(v) =>
              apply(
                patchScene(doc, scene.id, {
                  transitionIn: { ...scene.transitionIn, type: v },
                }),
                "commit",
              )
            }
          />
          {scene.transitionIn.type === "crossfade" ? (
            <NumberField
              label="overlap"
              value={scene.transitionIn.durationInFrames}
              min={1}
              max={Math.min(scene.durationInFrames - 1, 60)}
              onChange={(v, p) =>
                apply(
                  patchScene(doc, scene.id, {
                    transitionIn: { ...scene.transitionIn, durationInFrames: v },
                  }),
                  p,
                )
              }
              title="Frames of overlap with the previous scene"
            />
          ) : null}
        </>
      ) : null}
      <ColorField
        label="background"
        value={scene.background}
        brand={doc.brand}
        allowEmpty
        emptyLabel="(doc default)"
        onCommit={(v) =>
          apply(patchScene(doc, scene.id, { background: v }), "commit")
        }
      />

      <div className="ml-panel__actions">
        <button
          type="button"
          className="ml-btn"
          disabled={index === 0}
          onClick={() => commitDoc(moveScene(doc, scene.id, -1))}
          title="Move scene earlier"
        >
          ← Move
        </button>
        <button
          type="button"
          className="ml-btn"
          disabled={index === doc.scenes.length - 1}
          onClick={() => commitDoc(moveScene(doc, scene.id, 1))}
          title="Move scene later"
        >
          Move →
        </button>
        <button
          type="button"
          className="ml-btn"
          onClick={() => commitDoc(duplicateScene(doc, scene.id))}
        >
          Duplicate
        </button>
        <button
          type="button"
          className="ml-btn ml-btn--danger"
          disabled={doc.scenes.length <= 1}
          onClick={() => {
            commitDoc(deleteScene(doc, scene.id));
            select({ type: "none" });
          }}
        >
          Delete
        </button>
      </div>

      {reviseSlot}
    </section>
  );
}
