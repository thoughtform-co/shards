"use client";

import { useEffect } from "react";

import { addKeyframe, deleteElement, deleteKeyframe } from "../motiondoc/mutate";
import { sampleElementValues } from "../motiondoc/sample";
import { computeSceneStarts } from "../motiondoc/timing";
import { findSelection, useStudioStore } from "../store/useStudioStore";

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement ||
    target.isContentEditable
  );
}

/*
 * Global editor shortcuts. Mounted once by StudioShell.
 *
 *   Space        play / pause
 *   ← / →        step 1 frame (Shift = 10)
 *   Home / End   jump to start / end
 *   K            pin keyframe at playhead (keyframe selection's track)
 *   Delete       delete selected keyframe or element
 *   Ctrl+Z       undo · Ctrl+Shift+Z / Ctrl+Y redo
 *   Escape       clear selection (cancels a drag in progress)
 */
export function useKeyboardShortcuts(): void {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target)) return;
      const s = useStudioStore.getState();

      if (e.key === " ") {
        e.preventDefault();
        s.togglePlay();
        return;
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
        const step = (e.shiftKey ? 10 : 1) * (e.key === "ArrowLeft" ? -1 : 1);
        s.seek(s.playhead + step);
        return;
      }
      if (e.key === "Home") {
        e.preventDefault();
        s.seek(0);
        return;
      }
      if (e.key === "End") {
        e.preventDefault();
        s.seek(Number.MAX_SAFE_INTEGER);
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) s.redo();
        else s.undo();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
        e.preventDefault();
        s.redo();
        return;
      }
      if (e.key === "Escape") {
        s.cancelGesture();
        s.select({ type: "none" });
        return;
      }

      if (e.key === "Delete" || e.key === "Backspace") {
        const sel = s.selection;
        if (sel.type === "keyframe") {
          e.preventDefault();
          s.commitDoc(
            deleteKeyframe(
              s.doc,
              {
                sceneId: sel.sceneId,
                elementId: sel.elementId,
                property: sel.property,
              },
              sel.keyframeId,
            ),
          );
          s.select({
            type: "element",
            sceneId: sel.sceneId,
            elementId: sel.elementId,
          });
        } else if (sel.type === "element") {
          e.preventDefault();
          s.commitDoc(deleteElement(s.doc, sel.sceneId, sel.elementId));
          s.select({ type: "scene", sceneId: sel.sceneId });
        }
        return;
      }

      if (e.key.toLowerCase() === "k") {
        const sel = s.selection;
        if (sel.type !== "keyframe") return;
        const resolved = findSelection(s.doc, sel);
        if (!resolved.scene || !resolved.element) return;
        const sceneIndex = s.doc.scenes.findIndex(
          (sc) => sc.id === resolved.scene!.id,
        );
        const start = computeSceneStarts(s.doc)[sceneIndex];
        const frame = Math.max(
          0,
          Math.min(
            Math.round(s.playhead - start),
            resolved.scene.durationInFrames,
          ),
        );
        const value = sampleElementValues(
          resolved.element,
          frame,
          s.doc.meta.fps,
        )[sel.property];
        const result = addKeyframe(
          s.doc,
          {
            sceneId: sel.sceneId,
            elementId: sel.elementId,
            property: sel.property,
          },
          { frame, value },
        );
        s.commitDoc(result.doc);
        s.select({ ...sel, keyframeId: result.keyframeId });
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
}
