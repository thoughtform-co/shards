"use client";

import { create } from "zustand";

import type { MotionDoc } from "../motiondoc/schema";
import type { WorkspacePaths, WorkspaceSyncStatus } from "../workspace/types";

export type WorkspaceConflict = {
  remoteDoc?: MotionDoc;
  remoteRevision?: string;
};

type WorkspaceSyncState = {
  status: WorkspaceSyncStatus;
  revision?: string;
  updatedAt?: number;
  paths?: WorkspacePaths;
  message?: string;
  conflict?: WorkspaceConflict;
};

export const useWorkspaceSyncStore = create<WorkspaceSyncState>(() => ({
  status: "booting",
}));

export type WorkspaceController = {
  saveNow: () => Promise<void>;
  reloadFromDisk: () => Promise<void>;
  useDiskVersion: () => Promise<void>;
  keepEditorVersion: () => Promise<void>;
  revealFolder: () => Promise<void>;
};

let controller: WorkspaceController | undefined;

export function registerWorkspaceController(next?: WorkspaceController) {
  controller = next;
}

export const workspaceActions = {
  saveNow: () => controller?.saveNow() ?? Promise.resolve(),
  reloadFromDisk: () => controller?.reloadFromDisk() ?? Promise.resolve(),
  useDiskVersion: () => controller?.useDiskVersion() ?? Promise.resolve(),
  keepEditorVersion: () => controller?.keepEditorVersion() ?? Promise.resolve(),
  revealFolder: () => controller?.revealFolder() ?? Promise.resolve(),
};
