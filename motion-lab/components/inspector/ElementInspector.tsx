"use client";

import {
  addKeyframe,
  deleteElement,
  duplicateElement,
  patchElement,
  setElementPropertyAtFrame,
} from "../../lib/motiondoc/mutate";
import { sampleElementValues } from "../../lib/motiondoc/sample";
import type {
  AnimatableProp,
  MotionDoc,
  MotionElement,
  Scene,
  TransformOrigin,
} from "../../lib/motiondoc/schema";
import { useStudioStore } from "../../lib/store/useStudioStore";

import {
  ColorField,
  NumberField,
  SelectField,
  TextField,
  type ChangePhase,
} from "./fields";

const BASE_PROPS: {
  property: AnimatableProp;
  step: number;
  precision: number;
  min?: number;
  max?: number;
}[] = [
  { property: "x", step: 1, precision: 0 },
  { property: "y", step: 1, precision: 0 },
  { property: "scale", step: 0.01, precision: 2 },
  { property: "rotation", step: 1, precision: 0 },
  { property: "opacity", step: 0.02, precision: 2, min: 0, max: 1 },
];

export function ElementInspector({
  doc,
  scene,
  element,
  sceneStart,
}: {
  doc: MotionDoc;
  scene: Scene;
  element: MotionElement;
  sceneStart: number;
}) {
  const beginGesture = useStudioStore((s) => s.beginGesture);
  const endGesture = useStudioStore((s) => s.endGesture);
  const transientDoc = useStudioStore((s) => s.transientDoc);
  const commitDoc = useStudioStore((s) => s.commitDoc);
  const select = useStudioStore((s) => s.select);
  const playhead = useStudioStore((s) => s.playhead);

  const apply = (next: MotionDoc, phase: ChangePhase) => {
    beginGesture();
    transientDoc(next);
    if (phase === "commit") endGesture();
  };

  const patch = (fields: Record<string, unknown>, phase: ChangePhase) =>
    apply(patchElement(doc, scene.id, element.id, fields), phase);

  const localFrame = Math.max(
    0,
    Math.min(Math.round(playhead - sceneStart), scene.durationInFrames),
  );

  const patchTransform = (
    property: AnimatableProp,
    value: number,
    phase: ChangePhase,
  ) =>
    apply(
      setElementPropertyAtFrame(
        doc,
        { sceneId: scene.id, elementId: element.id, property },
        localFrame,
        value,
      ),
      phase,
    );

  /* Pin a keyframe at the playhead with the current sampled value —
     the stopwatch: starts (or extends) a track without visibly
     changing the animation. */
  const pinKeyframe = (property: AnimatableProp) => {
    const frame = Math.max(
      0,
      Math.min(Math.round(playhead - sceneStart), scene.durationInFrames),
    );
    const value = sampleElementValues(element, frame, doc.meta.fps)[property];
    const result = addKeyframe(
      doc,
      { sceneId: scene.id, elementId: element.id, property },
      { frame, value },
    );
    commitDoc(result.doc);
    select({
      type: "keyframe",
      sceneId: scene.id,
      elementId: element.id,
      property,
      keyframeId: result.keyframeId,
    });
  };

  if (element.locked) {
    return (
      <section className="ml-panel ml-inspector-panel">
        <h2 className="ml-panel__title">Element · {element.kind}</h2>
        <p className="ml-panel__hint">
          {element.name} is locked. It remains visible in the render but cannot
          be changed until it is unlocked.
        </p>
        <button
          type="button"
          className="ml-btn ml-btn--primary"
          onClick={() => patch({ locked: false }, "commit")}
        >
          Unlock layer
        </button>
      </section>
    );
  }

  return (
    <section className="ml-panel">
      <h2 className="ml-panel__title">
        Element · {element.kind}
      </h2>
      <TextField
        label="name"
        value={element.name}
        onCommit={(v) => patch({ name: v }, "commit")}
      />
      <div className="ml-panel__toggles">
        <button
          type="button"
          className={`ml-toggle-chip${element.visible ? " is-active" : ""}`}
          onClick={() => patch({ visible: !element.visible }, "commit")}
        >
          {element.visible ? "Visible" : "Hidden"}
        </button>
        <button
          type="button"
          className={`ml-toggle-chip${element.locked ? " is-active" : ""}`}
          onClick={() => patch({ locked: !element.locked }, "commit")}
        >
          {element.locked ? "Locked" : "Unlocked"}
        </button>
      </div>
      <div className="ml-field-pair">
        <NumberField
          label="in"
          value={element.inFrame}
          min={0}
          max={element.outFrame - 1}
          onChange={(value, phase) => patch({ inFrame: Math.round(value) }, phase)}
        />
        <NumberField
          label="out"
          value={element.outFrame}
          min={element.inFrame + 1}
          onChange={(value, phase) => patch({ outFrame: Math.round(value) }, phase)}
        />
      </div>

      {element.kind === "text" ? (
        <>
          <TextField
            label="text"
            value={element.text}
            multiline
            onCommit={(v) => patch({ text: v }, "commit")}
          />
          <NumberField
            label="font size"
            value={element.fontSize}
            min={8}
            onChange={(v, p) => patch({ fontSize: v }, p)}
          />
          <SelectField
            label="font"
            value={element.fontAssetId ? `asset:${element.fontAssetId}` : element.font}
            options={[
              { value: "heading", label: "heading" },
              { value: "body", label: "body" },
              { value: "mono", label: "mono" },
              ...doc.assets
                .filter((asset) => asset.kind === "font")
                .map((asset) => ({
                  value: `asset:${asset.id}`,
                  label: asset.fontFamily ?? asset.originalName,
                })),
            ]}
            onCommit={(value) =>
              value.startsWith("asset:")
                ? patch({ fontAssetId: value.slice(6) }, "commit")
                : patch({ font: value, fontAssetId: undefined }, "commit")
            }
          />
          <NumberField
            label="weight"
            value={element.fontWeight}
            step={100}
            min={100}
            max={900}
            onChange={(v, p) => patch({ fontWeight: v }, p)}
          />
          <ColorField
            label="color"
            value={element.color}
            brand={doc.brand}
            onCommit={(v) => patch({ color: v ?? "$text" }, "commit")}
          />
          <SelectField
            label="align"
            value={element.align}
            options={[
              { value: "left", label: "left" },
              { value: "center", label: "center" },
              { value: "right", label: "right" },
            ]}
            onCommit={(v) => patch({ align: v }, "commit")}
          />
          <NumberField
            label="max width"
            value={element.maxWidth ?? 0}
            min={0}
            onChange={(v, p) => patch({ maxWidth: v > 0 ? v : undefined }, p)}
            title="0 = single line"
          />
        </>
      ) : element.kind === "shape" ? (
        <>
          <SelectField
            label="shape"
            value={element.shape}
            options={[
              { value: "rect", label: "rect" },
              { value: "ellipse", label: "ellipse" },
            ]}
            onCommit={(v) => patch({ shape: v }, "commit")}
          />
          <NumberField
            label="width"
            value={element.width}
            min={1}
            onChange={(v, p) => patch({ width: v }, p)}
          />
          <NumberField
            label="height"
            value={element.height}
            min={1}
            onChange={(v, p) => patch({ height: v }, p)}
          />
          <ColorField
            label="fill"
            value={element.fill}
            brand={doc.brand}
            onCommit={(v) => patch({ fill: v ?? "$accent" }, "commit")}
          />
          <NumberField
            label="radius"
            value={element.radius}
            min={0}
            onChange={(v, p) => patch({ radius: v }, p)}
          />
        </>
      ) : (
        <>
          <TextField
            label="src"
            value={element.src}
            onCommit={(v) => patch({ src: v }, "commit")}
          />
          <NumberField
            label="width"
            value={element.width}
            min={1}
            onChange={(v, p) => patch({ width: v }, p)}
          />
          <NumberField
            label="height"
            value={element.height}
            min={1}
            onChange={(v, p) => patch({ height: v }, p)}
          />
          <SelectField
            label="fit"
            value={element.fit}
            options={[
              { value: "contain", label: "contain" },
              { value: "cover", label: "cover" },
            ]}
            onCommit={(v) => patch({ fit: v }, "commit")}
          />
          <NumberField
            label="radius"
            value={element.radius}
            min={0}
            onChange={(v, p) => patch({ radius: v }, p)}
          />
        </>
      )}

      <h3 className="ml-panel__subtitle">
        Transform{" "}
        <span className="ml-panel__subtitle-hint">◇ = keyframe at playhead</span>
      </h3>
      {BASE_PROPS.map(({ property, ...field }) => {
        const hasTrack = element.tracks.some((t) => t.property === property);
        return (
          <div key={property} className="ml-field-row">
            <NumberField
              label={property}
              value={element[property]}
              step={field.step}
              precision={field.precision}
              min={field.min}
              max={field.max}
              onChange={(v, p) => patchTransform(property, v, p)}
              title={
                hasTrack
                  ? "Base value (a track overrides this while animating)"
                  : "Base value"
              }
            />
            <button
              type="button"
              className={`ml-pin${hasTrack ? " ml-pin--active" : ""}`}
              onClick={() => pinKeyframe(property)}
              title={`Add ${property} keyframe at playhead`}
            >
              ◇
            </button>
          </div>
        );
      })}
      <SelectField
        label="origin"
        value={element.transformOrigin}
        options={(
          ["center", "left", "right", "top", "bottom"] as TransformOrigin[]
        ).map((v) => ({ value: v, label: v }))}
        onCommit={(v) => patch({ transformOrigin: v }, "commit")}
      />

      <div className="ml-panel__actions">
        <button
          type="button"
          className="ml-btn"
          onClick={() => commitDoc(duplicateElement(doc, scene.id, element.id))}
        >
          Duplicate
        </button>
        <button
          type="button"
          className="ml-btn ml-btn--danger"
          onClick={() => {
            commitDoc(deleteElement(doc, scene.id, element.id));
            select({ type: "scene", sceneId: scene.id });
          }}
        >
          Delete
        </button>
      </div>
    </section>
  );
}
