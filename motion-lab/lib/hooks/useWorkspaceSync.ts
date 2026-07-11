"use client";

import { useCallback, useEffect, useRef } from "react";

import { safeParseMotionDoc } from "../motiondoc/migrate";
import type { MotionDoc } from "../motiondoc/schema";
import { useStudioStore } from "../store/useStudioStore";
import {
  registerWorkspaceController,
  useWorkspaceSyncStore,
} from "../store/useWorkspaceSyncStore";
import type {
  WorkspaceConflictResponse,
  WorkspaceProjectResponse,
  WorkspaceValidationResponse,
} from "../workspace/types";

const AUTOSAVE_KEY = "motion-lab:doc";
const SAVE_DELAY_MS = 800;
const POLL_MS = 2_000;

function serialized(doc: MotionDoc) {
  return JSON.stringify(doc);
}

async function responseMessage(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { error?: string };
    return body.error ?? `Workspace request failed (${response.status})`;
  } catch {
    return `Workspace request failed (${response.status})`;
  }
}

export function useWorkspaceSync() {
  const doc = useStudioStore((state) => state.doc);
  const loadDoc = useStudioStore((state) => state.loadDoc);
  const applyExternalDoc = useStudioStore((state) => state.applyExternalDoc);
  const initializedRef = useRef(false);
  const readyRef = useRef(false);
  const mountedRef = useRef(true);
  const revisionRef = useRef<string | undefined>(undefined);
  const savedDocRef = useRef<string | undefined>(undefined);
  const dirtyRef = useRef(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const setSyncState = useCallback(
    (next: Partial<ReturnType<typeof useWorkspaceSyncStore.getState>>) => {
      if (mountedRef.current) useWorkspaceSyncStore.setState(next);
    },
    [],
  );

  const acceptProject = useCallback(
    (project: WorkspaceProjectResponse, external: boolean) => {
      revisionRef.current = project.revision;
      savedDocRef.current = serialized(project.doc);
      dirtyRef.current = false;
      if (external) applyExternalDoc(project.doc);
      else loadDoc(project.doc);
      setSyncState({
        status: external ? "external" : "synced",
        revision: project.revision,
        updatedAt: project.updatedAt,
        paths: project.paths,
        message: external ? "Agent edit loaded as one undo step" : undefined,
        conflict: undefined,
      });
      if (external) {
        window.setTimeout(() => {
          if (useWorkspaceSyncStore.getState().status === "external") {
            setSyncState({ status: "synced", message: undefined });
          }
        }, 1_200);
      }
    },
    [applyExternalDoc, loadDoc, setSyncState],
  );

  const readProject = useCallback(async (useEtag = false) => {
    const headers: HeadersInit = {};
    if (useEtag && revisionRef.current) {
      headers["if-none-match"] = `"${revisionRef.current}"`;
    }
    return fetch("/api/workspace/project", { headers, cache: "no-store" });
  }, []);

  const saveProject = useCallback(
    async (nextDoc: MotionDoc, force = false) => {
      setSyncState({ status: "saving", message: "Saving workspace..." });
      try {
        const response = await fetch("/api/workspace/project", {
          method: "PUT",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            doc: nextDoc,
            expectedRevision: revisionRef.current,
            force,
          }),
        });
        if (response.status === 409) {
          const body = (await response.json()) as WorkspaceConflictResponse;
          dirtyRef.current = false;
          setSyncState({
            status: "conflict",
            message: body.error,
            conflict: {
              remoteDoc: body.current?.doc,
              remoteRevision: body.current?.revision,
            },
            paths: body.current?.paths ?? useWorkspaceSyncStore.getState().paths,
          });
          return;
        }
        if (!response.ok) throw new Error(await responseMessage(response));
        const project = (await response.json()) as WorkspaceProjectResponse;
        revisionRef.current = project.revision;
        savedDocRef.current = serialized(project.doc);
        dirtyRef.current = false;
        setSyncState({
          status: "synced",
          revision: project.revision,
          updatedAt: project.updatedAt,
          paths: project.paths,
          message: undefined,
          conflict: undefined,
        });
      } catch (error) {
        dirtyRef.current = false;
        setSyncState({
          status: "fallback",
          message: error instanceof Error ? error.message : "Using browser backup",
        });
      }
    },
    [setSyncState],
  );

  const reloadFromDisk = useCallback(async () => {
    const response = await readProject(false);
    if (response.ok) {
      acceptProject((await response.json()) as WorkspaceProjectResponse, true);
      return;
    }
    if (response.status === 422) {
      const body = (await response.json()) as WorkspaceValidationResponse;
      setSyncState({ status: "invalid", message: body.error, paths: body.paths });
      return;
    }
    setSyncState({ status: "fallback", message: await responseMessage(response) });
  }, [acceptProject, readProject, setSyncState]);

  const useDiskVersion = useCallback(async () => {
    const conflict = useWorkspaceSyncStore.getState().conflict;
    if (!conflict?.remoteDoc || !conflict.remoteRevision) {
      await reloadFromDisk();
      return;
    }
    const paths = useWorkspaceSyncStore.getState().paths;
    if (!paths) return;
    acceptProject(
      {
        doc: conflict.remoteDoc,
        revision: conflict.remoteRevision,
        updatedAt: Date.now(),
        paths,
      },
      true,
    );
  }, [acceptProject, reloadFromDisk]);

  const keepEditorVersion = useCallback(async () => {
    await saveProject(useStudioStore.getState().doc, true);
  }, [saveProject]);

  const revealFolder = useCallback(async () => {
    const response = await fetch("/api/workspace/reveal", { method: "POST" });
    if (!response.ok) setSyncState({ message: await responseMessage(response) });
  }, [setSyncState]);

  useEffect(() => {
    mountedRef.current = true;
    registerWorkspaceController({
      saveNow: () => saveProject(useStudioStore.getState().doc),
      reloadFromDisk,
      useDiskVersion,
      keepEditorVersion,
      revealFolder,
    });
    return () => {
      mountedRef.current = false;
      registerWorkspaceController(undefined);
    };
  }, [keepEditorVersion, reloadFromDisk, revealFolder, saveProject, useDiskVersion]);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    void (async () => {
      try {
        const response = await readProject(false);
        if (response.ok) {
          acceptProject((await response.json()) as WorkspaceProjectResponse, false);
          return;
        }

        let fallback = useStudioStore.getState().doc;
        try {
          const raw = window.localStorage.getItem(AUTOSAVE_KEY);
          if (raw) {
            const parsed = safeParseMotionDoc(JSON.parse(raw));
            if (parsed.success) fallback = parsed.data;
          }
        } catch {
          // Keep the bundled example.
        }
        loadDoc(fallback);
        savedDocRef.current = serialized(fallback);

        if (response.status === 404) {
          const body = (await response.json()) as { paths?: WorkspaceProjectResponse["paths"] };
          if (body.paths) setSyncState({ paths: body.paths });
          await saveProject(fallback, true);
        } else if (response.status === 422) {
          const body = (await response.json()) as WorkspaceValidationResponse;
          setSyncState({ status: "invalid", message: body.error, paths: body.paths });
        } else {
          setSyncState({ status: "fallback", message: await responseMessage(response) });
        }
      } catch (error) {
        setSyncState({
          status: "fallback",
          message: error instanceof Error ? error.message : "Using browser backup",
        });
      } finally {
        readyRef.current = true;
      }
    })();
  }, [acceptProject, loadDoc, readProject, saveProject, setSyncState]);

  useEffect(() => {
    const value = serialized(doc);
    const backupTimer = window.setTimeout(() => {
      try {
        window.localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(doc));
      } catch {
        // Server workspace remains the primary persistence path.
      }
    }, SAVE_DELAY_MS);

    if (!readyRef.current || value === savedDocRef.current) {
      return () => window.clearTimeout(backupTimer);
    }
    const status = useWorkspaceSyncStore.getState().status;
    if (status === "conflict" || status === "invalid" || status === "fallback") {
      return () => window.clearTimeout(backupTimer);
    }
    dirtyRef.current = true;
    setSyncState({ status: "saving", message: "Saving workspace..." });
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => void saveProject(doc), SAVE_DELAY_MS);
    return () => {
      window.clearTimeout(backupTimer);
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [doc, saveProject, setSyncState]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      void (async () => {
        const status = useWorkspaceSyncStore.getState().status;
        if (status === "booting" || status === "saving" || status === "conflict") return;
        try {
          const response = await readProject(true);
          if (response.status === 304) return;
          if (response.status === 422) {
            const body = (await response.json()) as WorkspaceValidationResponse;
            setSyncState({ status: "invalid", message: body.error, paths: body.paths });
            return;
          }
          if (!response.ok) return;
          const project = (await response.json()) as WorkspaceProjectResponse;
          if (dirtyRef.current) {
            setSyncState({
              status: "conflict",
              message: "Workspace changed while the editor had unsaved changes",
              conflict: {
                remoteDoc: project.doc,
                remoteRevision: project.revision,
              },
              paths: project.paths,
            });
            dirtyRef.current = false;
            return;
          }
          if (serialized(project.doc) !== serialized(useStudioStore.getState().doc)) {
            acceptProject(project, true);
          } else {
            revisionRef.current = project.revision;
            savedDocRef.current = serialized(project.doc);
            setSyncState({
              status: "synced",
              revision: project.revision,
              updatedAt: project.updatedAt,
              paths: project.paths,
              message: undefined,
            });
          }
        } catch {
          // A transient polling failure must not interrupt editing.
        }
      })();
    }, POLL_MS);
    return () => window.clearInterval(timer);
  }, [acceptProject, readProject, setSyncState]);
}
