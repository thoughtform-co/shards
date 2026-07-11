import type { MotionDoc } from "../motiondoc/schema";

export type WorkspaceSyncStatus =
  | "booting"
  | "saving"
  | "synced"
  | "external"
  | "conflict"
  | "invalid"
  | "fallback";

export type WorkspacePaths = {
  root: string;
  workspace: string;
  project: string;
  assets: string;
};

export type WorkspaceProjectResponse = {
  doc: MotionDoc;
  revision: string;
  updatedAt: number;
  paths: WorkspacePaths;
};

export type WorkspaceConflictResponse = {
  error: string;
  current?: WorkspaceProjectResponse;
};

export type WorkspaceValidationResponse = {
  error: string;
  revision?: string;
  issues?: { path: string; message: string }[];
  paths: WorkspacePaths;
};
