"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type StudioLeftTab = "assets" | "create" | "ai" | "agent";

type StudioUiState = {
  leftTab: StudioLeftTab;
  leftOpen: boolean;
  rightOpen: boolean;
  leftWidth: number;
  rightWidth: number;
  timelineHeight: number;
  snapping: boolean;
  expandedElementIds: string[];
  setLeftTab: (tab: StudioLeftTab) => void;
  setLeftOpen: (open: boolean) => void;
  setRightOpen: (open: boolean) => void;
  setLeftWidth: (width: number) => void;
  setRightWidth: (width: number) => void;
  setTimelineHeight: (height: number) => void;
  setSnapping: (enabled: boolean) => void;
  toggleElementExpanded: (elementId: string) => void;
};

export const useStudioUiStore = create<StudioUiState>()(
  persist(
    (set) => ({
      leftTab: "assets",
      leftOpen: true,
      rightOpen: true,
      leftWidth: 272,
      rightWidth: 304,
      timelineHeight: 320,
      snapping: true,
      expandedElementIds: [],
      setLeftTab: (leftTab) => set({ leftTab }),
      setLeftOpen: (leftOpen) => set({ leftOpen }),
      setRightOpen: (rightOpen) => set({ rightOpen }),
      setLeftWidth: (leftWidth) =>
        set({ leftWidth: Math.max(220, Math.min(420, leftWidth)) }),
      setRightWidth: (rightWidth) =>
        set({ rightWidth: Math.max(260, Math.min(440, rightWidth)) }),
      setTimelineHeight: (timelineHeight) =>
        set({ timelineHeight: Math.max(220, Math.min(560, timelineHeight)) }),
      setSnapping: (snapping) => set({ snapping }),
      toggleElementExpanded: (elementId) =>
        set((state) => ({
          expandedElementIds: state.expandedElementIds.includes(elementId)
            ? state.expandedElementIds.filter((id) => id !== elementId)
            : [...state.expandedElementIds, elementId],
        })),
    }),
    {
      name: "motion-lab:ui-v2",
      partialize: (state) => ({
        leftTab: state.leftTab,
        leftOpen: state.leftOpen,
        rightOpen: state.rightOpen,
        leftWidth: state.leftWidth,
        rightWidth: state.rightWidth,
        timelineHeight: state.timelineHeight,
        snapping: state.snapping,
        expandedElementIds: state.expandedElementIds,
      }),
    },
  ),
);
