"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Player,
  type CallbackListener,
  type PlayerRef,
} from "@remotion/player";

import { useRafThrottled } from "../../lib/hooks/useRafThrottled";
import { addElement, setElementPropertyAtFrame } from "../../lib/motiondoc/mutate";
import { newId } from "../../lib/motiondoc/ids";
import { sampleElementValues } from "../../lib/motiondoc/sample";
import type { MotionDoc, MotionElement, Scene } from "../../lib/motiondoc/schema";
import {
  computeSceneStarts,
  sceneIndexAtFrame,
  totalDurationInFrames,
} from "../../lib/motiondoc/timing";
import { useStudioStore } from "../../lib/store/useStudioStore";
import { useStudioUiStore } from "../../lib/store/useStudioUiStore";
import { MotionComposition } from "../../remotion/MotionComposition";

function formatTimecode(frame: number, fps: number): string {
  const seconds = frame / fps;
  const mm = Math.floor(seconds / 60).toString().padStart(2, "0");
  const ss = Math.floor(seconds % 60).toString().padStart(2, "0");
  const ff = Math.floor(frame % fps).toString().padStart(2, "0");
  return `${mm}:${ss}:${ff}`;
}

function elementBox(element: MotionElement) {
  if (element.kind === "shape" || element.kind === "image") {
    return { width: element.width, height: element.height };
  }
  const width =
    element.maxWidth ?? Math.max(element.fontSize, element.text.length * element.fontSize * 0.58);
  const lines = element.maxWidth
    ? Math.max(1, Math.ceil((element.text.length * element.fontSize * 0.58) / element.maxWidth))
    : 1;
  return { width, height: element.fontSize * 1.15 * lines };
}

function applyTransform(
  base: MotionDoc,
  scene: Scene,
  element: MotionElement,
  frame: number,
  values: Partial<Record<"x" | "y" | "scale" | "rotation", number>>,
) {
  let next = base;
  (Object.entries(values) as ["x" | "y" | "scale" | "rotation", number][]).forEach(
    ([property, value]) => {
      next = setElementPropertyAtFrame(
        next,
        { sceneId: scene.id, elementId: element.id, property },
        frame,
        value,
      );
    },
  );
  return next;
}

function CanvasOverlay({
  doc,
  width,
  height,
}: {
  doc: MotionDoc;
  width: number;
  height: number;
}) {
  const playhead = useStudioStore((state) => state.playhead);
  const selection = useStudioStore((state) => state.selection);
  const select = useStudioStore((state) => state.select);
  const beginGesture = useStudioStore((state) => state.beginGesture);
  const transientDoc = useStudioStore((state) => state.transientDoc);
  const endGesture = useStudioStore((state) => state.endGesture);
  const commitDoc = useStudioStore((state) => state.commitDoc);
  const snapping = useStudioUiStore((state) => state.snapping);
  const [guides, setGuides] = useState<{ x?: number; y?: number }>({});
  const drag = useRef<{
    base: MotionDoc;
    scene: Scene;
    element: MotionElement;
    frame: number;
    mode: "move" | "scale" | "rotate";
    startX: number;
    startY: number;
    centerX: number;
    centerY: number;
    startDistance: number;
    startAngle: number;
    values: ReturnType<typeof sampleElementValues>;
  } | null>(null);

  const sceneIndex = sceneIndexAtFrame(doc, playhead);
  const scene = doc.scenes[sceneIndex];
  const sceneStart = computeSceneStarts(doc)[sceneIndex];
  const localFrame = playhead - sceneStart;
  const xScale = width / doc.meta.width;
  const yScale = height / doc.meta.height;

  const startDrag = (
    event: React.PointerEvent,
    element: MotionElement,
    mode: "move" | "scale" | "rotate",
  ) => {
    if (element.locked) return;
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    const values = sampleElementValues(element, localFrame, doc.meta.fps);
    const centerX = values.x * xScale;
    const centerY = values.y * yScale;
    const overlayRect = event.currentTarget
      .closest(".ml-canvas-overlay")
      ?.getBoundingClientRect();
    const pointerX = overlayRect ? event.clientX - overlayRect.left : centerX;
    const pointerY = overlayRect ? event.clientY - overlayRect.top : centerY;
    beginGesture();
    drag.current = {
      base: useStudioStore.getState().doc,
      scene,
      element,
      frame: localFrame,
      mode,
      startX: event.clientX,
      startY: event.clientY,
      centerX,
      centerY,
      startDistance: Math.max(1, Math.hypot(pointerX - centerX, pointerY - centerY)),
      startAngle: Math.atan2(pointerY - centerY, pointerX - centerX),
      values,
    };
  };

  const onMove = (event: React.PointerEvent) => {
    const state = drag.current;
    if (!state) return;
    if (state.mode === "move") {
      let x = state.values.x + (event.clientX - state.startX) / xScale;
      let y = state.values.y + (event.clientY - state.startY) / yScale;
      const nextGuides: { x?: number; y?: number } = {};
      if (snapping && !event.altKey) {
        const thresholdX = 8 / xScale;
        const thresholdY = 8 / yScale;
        const box = elementBox(state.element);
        const halfW = (box.width * state.values.scale) / 2;
        const halfH = (box.height * state.values.scale) / 2;
        const xTargets = [halfW, doc.meta.width / 2, doc.meta.width - halfW];
        const yTargets = [halfH, doc.meta.height / 2, doc.meta.height - halfH];
        const targetX = xTargets.find((target) => Math.abs(target - x) <= thresholdX);
        const targetY = yTargets.find((target) => Math.abs(target - y) <= thresholdY);
        if (targetX !== undefined) {
          x = targetX;
          nextGuides.x = targetX * xScale;
        }
        if (targetY !== undefined) {
          y = targetY;
          nextGuides.y = targetY * yScale;
        }
      }
      setGuides(nextGuides);
      transientDoc(
        applyTransform(state.base, state.scene, state.element, state.frame, { x, y }),
      );
      return;
    }

    const rect = event.currentTarget.parentElement?.getBoundingClientRect();
    const pointerX = rect ? event.clientX - rect.left : event.nativeEvent.offsetX;
    const pointerY = rect ? event.clientY - rect.top : event.nativeEvent.offsetY;
    if (state.mode === "scale") {
      const distance = Math.max(1, Math.hypot(pointerX - state.centerX, pointerY - state.centerY));
      transientDoc(
        applyTransform(state.base, state.scene, state.element, state.frame, {
          scale: Math.max(0.02, state.values.scale * (distance / state.startDistance)),
        }),
      );
    } else {
      const angle = Math.atan2(pointerY - state.centerY, pointerX - state.centerX);
      transientDoc(
        applyTransform(state.base, state.scene, state.element, state.frame, {
          rotation: state.values.rotation + ((angle - state.startAngle) * 180) / Math.PI,
        }),
      );
    }
  };

  const onEnd = (event: React.PointerEvent) => {
    if (!drag.current) return;
    drag.current = null;
    setGuides({});
    event.currentTarget.releasePointerCapture(event.pointerId);
    endGesture();
  };

  return (
    <div
      className="ml-canvas-overlay"
      onPointerDown={() => select({ type: "none" })}
      onPointerMove={onMove}
      onPointerUp={onEnd}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        const assetId = event.dataTransfer.getData("text/motion-asset");
        const asset = doc.assets.find(
          (item) => item.id === assetId && item.kind === "image",
        );
        if (!asset) return;
        const rect = event.currentTarget.getBoundingClientRect();
        const maxWidth = doc.meta.width * 0.5;
        const maxHeight = doc.meta.height * 0.5;
        const sourceWidth = asset.width ?? maxWidth;
        const sourceHeight = asset.height ?? maxHeight;
        const fit = Math.min(1, maxWidth / sourceWidth, maxHeight / sourceHeight);
        const elementId = newId("el");
        const next = addElement(doc, scene.id, {
          id: elementId,
          kind: "image",
          name: asset.originalName,
          assetId: asset.id,
          src: asset.src,
          width: sourceWidth * fit,
          height: sourceHeight * fit,
          fit: "contain",
          radius: 0,
          x: ((event.clientX - rect.left) / rect.width) * doc.meta.width,
          y: ((event.clientY - rect.top) / rect.height) * doc.meta.height,
          scale: 1,
          rotation: 0,
          opacity: 1,
          transformOrigin: "center",
          inFrame: 0,
          outFrame: scene.durationInFrames,
          visible: true,
          locked: false,
          tracks: [],
        });
        commitDoc(next);
        select({ type: "element", sceneId: scene.id, elementId });
      }}
    >
      {guides.x !== undefined ? <span className="ml-canvas-guide ml-canvas-guide--x" style={{ left: guides.x }} /> : null}
      {guides.y !== undefined ? <span className="ml-canvas-guide ml-canvas-guide--y" style={{ top: guides.y }} /> : null}
      {scene.elements.map((element) => {
        if (
          !element.visible ||
          localFrame < element.inFrame ||
          localFrame >= element.outFrame
        ) {
          return null;
        }
        const values = sampleElementValues(element, localFrame, doc.meta.fps);
        if (values.opacity <= 0.01) return null;
        const box = elementBox(element);
        const selected =
          (selection.type === "element" || selection.type === "keyframe") &&
          selection.elementId === element.id;
        return (
          <div
            key={element.id}
            className={`ml-canvas-hit${selected ? " is-selected" : ""}${
              element.locked ? " is-locked" : ""
            }`}
            style={{
              left: values.x * xScale,
              top: values.y * yScale,
              width: box.width * values.scale * xScale,
              height: box.height * values.scale * yScale,
              transform: `translate(-50%, -50%) rotate(${values.rotation}deg)`,
            }}
            onPointerDown={(event) => {
              event.stopPropagation();
              select({ type: "element", sceneId: scene.id, elementId: element.id });
              startDrag(event, element, "move");
            }}
          >
            {selected && !element.locked ? (
              <>
                <button
                  className="ml-canvas-handle ml-canvas-handle--scale"
                  aria-label="Scale layer"
                  onPointerDown={(event) => startDrag(event, element, "scale")}
                />
                <button
                  className="ml-canvas-handle ml-canvas-handle--rotate"
                  aria-label="Rotate layer"
                  onPointerDown={(event) => startDrag(event, element, "rotate")}
                />
              </>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export function PreviewPanel() {
  const doc = useStudioStore((state) => state.doc);
  const playhead = useStudioStore((state) => state.playhead);
  const isPlaying = useStudioStore((state) => state.isPlaying);
  const togglePlay = useStudioStore((state) => state.togglePlay);
  const registerPlayer = useStudioStore((state) => state.registerPlayer);
  const setPlayheadFromPlayer = useStudioStore((state) => state.setPlayheadFromPlayer);
  const setIsPlaying = useStudioStore((state) => state.setIsPlaying);
  const snapping = useStudioUiStore((state) => state.snapping);
  const setSnapping = useStudioUiStore((state) => state.setSnapping);

  const throttledDoc = useRafThrottled(doc);
  const inputProps = useMemo(() => ({ doc: throttledDoc }), [throttledDoc]);
  const durationInFrames = useMemo(
    () => totalDurationInFrames(throttledDoc),
    [throttledDoc],
  );
  const playerRef = useRef<PlayerRef>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 1, height: 1 });

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const update = () => {
      const availableWidth = Math.max(1, stage.clientWidth - 40);
      const availableHeight = Math.max(1, stage.clientHeight - 40);
      const ratio = doc.meta.width / doc.meta.height;
      const width = Math.min(availableWidth, availableHeight * ratio);
      setCanvasSize({ width, height: width / ratio });
    };
    const observer = new ResizeObserver(update);
    observer.observe(stage);
    update();
    return () => observer.disconnect();
  }, [doc.meta.width, doc.meta.height]);

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;
    registerPlayer({
      seekTo: (frame) => player.seekTo(frame),
      play: () => player.play(),
      pause: () => player.pause(),
    });
    const onFrame: CallbackListener<"frameupdate"> = (event) =>
      setPlayheadFromPlayer(event.detail.frame);
    const onPlay: CallbackListener<"play"> = () => setIsPlaying(true);
    const onPause: CallbackListener<"pause"> = () => setIsPlaying(false);
    const onEnded: CallbackListener<"ended"> = () => setIsPlaying(false);
    player.addEventListener("frameupdate", onFrame);
    player.addEventListener("play", onPlay);
    player.addEventListener("pause", onPause);
    player.addEventListener("ended", onEnded);
    return () => {
      player.removeEventListener("frameupdate", onFrame);
      player.removeEventListener("play", onPlay);
      player.removeEventListener("pause", onPause);
      player.removeEventListener("ended", onEnded);
      registerPlayer(null);
    };
  }, [registerPlayer, setPlayheadFromPlayer, setIsPlaying]);

  return (
    <div className="ml-preview">
      <div className="ml-canvas-toolbar">
        <span>Canvas</span>
        <button
          className={`ml-btn${snapping ? " ml-btn--active" : ""}`}
          onClick={() => setSnapping(!snapping)}
        >
          Snap
        </button>
        <span className="ml-canvas-toolbar__hint">Drag to move · corner to scale · top handle to rotate</span>
      </div>
      <div className="ml-preview__stage" ref={stageRef}>
        <div
          className="ml-preview__canvas"
          style={{ width: canvasSize.width, height: canvasSize.height }}
        >
          <Player
            ref={playerRef}
            component={MotionComposition}
            inputProps={inputProps}
            durationInFrames={durationInFrames}
            fps={throttledDoc.meta.fps}
            compositionWidth={throttledDoc.meta.width}
            compositionHeight={throttledDoc.meta.height}
            style={{ width: "100%", height: "100%" }}
            loop
            controls={false}
            acknowledgeRemotionLicense
          />
          <CanvasOverlay doc={doc} width={canvasSize.width} height={canvasSize.height} />
        </div>
      </div>
      <div className="ml-preview__transport">
        <button
          type="button"
          className="ml-btn ml-btn--primary ml-preview__play"
          onClick={togglePlay}
          title="Play/Pause (Space)"
        >
          {isPlaying ? "Ⅱ" : "▶"}
        </button>
        <span className="ml-preview__timecode">
          {formatTimecode(playhead, doc.meta.fps)}
          <span className="ml-preview__timecode-total">
            {" "}/ {formatTimecode(durationInFrames, doc.meta.fps)}
          </span>
        </span>
        <span className="ml-preview__meta">
          f{Math.round(playhead)} · {doc.meta.width}×{doc.meta.height} · {doc.meta.fps}fps · {doc.meta.format}
        </span>
      </div>
    </div>
  );
}
