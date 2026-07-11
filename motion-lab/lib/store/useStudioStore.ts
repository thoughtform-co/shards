"use client";

import { create } from "zustand";

import { EXAMPLES } from "../examples";
import type { AnimatableProp, MotionDoc } from "../motiondoc/schema";
import { totalDurationInFrames } from "../motiondoc/timing";

import { pushHistory } from "./history";

export type Selection =
  | { type: "none" }
  | { type: "scene"; sceneId: string }
  | { type: "element"; sceneId: string; elementId: string }
  | {
      type: "keyframe";
      sceneId: string;
      elementId: string;
      property: AnimatableProp;
      keyframeId: string;
    };

export type PlayerHandle = {
  seekTo: (frame: number) => void;
  play: () => void;
  pause: () => void;
};

export type AsyncStatus =
  | { state: "idle" }
  | { state: "working"; message: string }
  | { state: "error"; message: string };

interface StudioState {
  doc: MotionDoc;
  past: MotionDoc[];
  future: MotionDoc[];
  /** Snapshot taken at beginGesture; null outside a gesture. */
  gestureBase: MotionDoc | null;
  selection: Selection;
  /** Global frame. Written by scrubs AND by the player during playback. */
  playhead: number;
  isPlaying: boolean;
  /** Timeline zoom, px per frame. */
  zoom: number;
  playerHandle: PlayerHandle | null;
  generateStatus: AsyncStatus;

  /* --- document lifecycle --- */
  loadDoc: (doc: MotionDoc) => void;
  /** Committed edit: current doc goes to history, next becomes doc. */
  commitDoc: (next: MotionDoc) => void;
  /** Transient edit (mid-drag): no history entry. */
  transientDoc: (next: MotionDoc) => void;
  beginGesture: () => void;
  endGesture: () => void;
  cancelGesture: () => void;
  undo: () => void;
  redo: () => void;

  /* --- ui state --- */
  select: (selection: Selection) => void;
  registerPlayer: (handle: PlayerHandle | null) => void;
  /** Scrub: moves playhead AND seeks the player. */
  seek: (frame: number) => void;
  /** Player feedback path: playhead only, no seekTo echo. */
  setPlayheadFromPlayer: (frame: number) => void;
  setIsPlaying: (playing: boolean) => void;
  togglePlay: () => void;
  setZoom: (zoom: number) => void;
  setGenerateStatus: (status: AsyncStatus) => void;
}

function clampFrame(doc: MotionDoc, frame: number): number {
  return Math.max(0, Math.min(Math.round(frame), totalDurationInFrames(doc) - 1));
}

export const useStudioStore = create<StudioState>((set, get) => ({
  doc: EXAMPLES[0].doc,
  past: [],
  future: [],
  gestureBase: null,
  selection: { type: "none" },
  playhead: 0,
  isPlaying: false,
  zoom: 1.5,
  playerHandle: null,
  generateStatus: { state: "idle" },

  loadDoc: (doc) => {
    set({
      doc,
      past: [],
      future: [],
      gestureBase: null,
      selection: { type: "none" },
      playhead: 0,
    });
    get().playerHandle?.seekTo(0);
  },

  commitDoc: (next) => {
    const { doc, past } = get();
    set({ doc: next, past: pushHistory(past, doc), future: [] });
  },

  transientDoc: (next) => set({ doc: next }),

  beginGesture: () => {
    const { doc, gestureBase } = get();
    if (!gestureBase) set({ gestureBase: doc });
  },

  endGesture: () => {
    const { doc, gestureBase, past } = get();
    if (!gestureBase) return;
    if (gestureBase !== doc) {
      set({ past: pushHistory(past, gestureBase), future: [], gestureBase: null });
    } else {
      set({ gestureBase: null });
    }
  },

  cancelGesture: () => {
    const { gestureBase } = get();
    if (gestureBase) set({ doc: gestureBase, gestureBase: null });
  },

  undo: () => {
    const { past, future, doc } = get();
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    set({
      doc: previous,
      past: past.slice(0, -1),
      future: [doc, ...future],
      playhead: clampFrame(previous, get().playhead),
    });
  },

  redo: () => {
    const { past, future, doc } = get();
    if (future.length === 0) return;
    const [next, ...rest] = future;
    set({
      doc: next,
      past: pushHistory(past, doc),
      future: rest,
      playhead: clampFrame(next, get().playhead),
    });
  },

  select: (selection) => set({ selection }),

  registerPlayer: (handle) => set({ playerHandle: handle }),

  seek: (frame) => {
    const clamped = clampFrame(get().doc, frame);
    set({ playhead: clamped });
    get().playerHandle?.seekTo(clamped);
  },

  setPlayheadFromPlayer: (frame) => set({ playhead: frame }),

  setIsPlaying: (playing) => set({ isPlaying: playing }),

  togglePlay: () => {
    const { isPlaying, playerHandle } = get();
    if (!playerHandle) return;
    if (isPlaying) playerHandle.pause();
    else playerHandle.play();
  },

  setZoom: (zoom) => set({ zoom: Math.max(0.25, Math.min(8, zoom)) }),

  setGenerateStatus: (status) => set({ generateStatus: status }),
}));

/* Dev-only: expose the store for debugging/scripted verification. */
if (
  typeof window !== "undefined" &&
  process.env.NODE_ENV !== "production"
) {
  (window as unknown as Record<string, unknown>).__mlStore = useStudioStore;
}

/** Resolve the selection against the current doc (undo-safe). */
export function findSelection(doc: MotionDoc, selection: Selection) {
  if (selection.type === "none") return { scene: undefined };
  const scene = doc.scenes.find((s) => s.id === selection.sceneId);
  if (!scene || selection.type === "scene") return { scene };
  const element = scene.elements.find(
    (e) => e.id === selection.elementId,
  );
  if (!element || selection.type === "element") return { scene, element };
  const track = element.tracks.find((t) => t.property === selection.property);
  const keyframe = track?.keyframes.find((k) => k.id === selection.keyframeId);
  return { scene, element, track, keyframe };
}
