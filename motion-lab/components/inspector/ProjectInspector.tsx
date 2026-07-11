"use client";

import { patchBrand, patchMeta } from "../../lib/motiondoc/mutate";
import type { MotionDoc } from "../../lib/motiondoc/schema";
import { useStudioStore } from "../../lib/store/useStudioStore";

import { ColorField, NumberField, TextField, type ChangePhase } from "./fields";

export function ProjectInspector({ doc }: { doc: MotionDoc }) {
  const beginGesture = useStudioStore((state) => state.beginGesture);
  const transientDoc = useStudioStore((state) => state.transientDoc);
  const endGesture = useStudioStore((state) => state.endGesture);

  const apply = (next: MotionDoc, phase: ChangePhase) => {
    beginGesture();
    transientDoc(next);
    if (phase === "commit") endGesture();
  };

  return (
    <section className="ml-panel ml-inspector-panel">
      <h2 className="ml-panel__title">Project</h2>
      <TextField
        label="title"
        value={doc.meta.title}
        onCommit={(title) => apply(patchMeta(doc, { title }), "commit")}
      />
      <div className="ml-field-pair">
        <NumberField
          label="width"
          value={doc.meta.width}
          min={16}
          onChange={(width, phase) => apply(patchMeta(doc, { width }), phase)}
        />
        <NumberField
          label="height"
          value={doc.meta.height}
          min={16}
          onChange={(height, phase) => apply(patchMeta(doc, { height }), phase)}
        />
      </div>
      <NumberField
        label="fps"
        value={doc.meta.fps}
        min={1}
        max={60}
        onChange={(fps, phase) => apply(patchMeta(doc, { fps }), phase)}
      />
      <ColorField
        label="canvas"
        value={doc.meta.background}
        brand={doc.brand}
        onCommit={(background) =>
          apply(patchMeta(doc, { background: background ?? "$background" }), "commit")
        }
      />
      <h3 className="ml-panel__subtitle">Brand palette</h3>
      {(Object.keys(doc.brand.colors) as (keyof MotionDoc["brand"]["colors"])[]).map(
        (token) => (
          <ColorField
            key={token}
            label={token}
            value={doc.brand.colors[token]}
            brand={doc.brand}
            onCommit={(value) =>
              value &&
              apply(patchBrand(doc, { colors: { [token]: value } }), "commit")
            }
          />
        ),
      )}
    </section>
  );
}
