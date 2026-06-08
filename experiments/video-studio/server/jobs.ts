import type { RenderJobRecord } from "@/experiments/video-studio/types";

declare global {
  var __videoStudioJobs: Map<string, RenderJobRecord> | undefined;
}

function getStore() {
  if (!globalThis.__videoStudioJobs) {
    globalThis.__videoStudioJobs = new Map<string, RenderJobRecord>();
  }

  return globalThis.__videoStudioJobs;
}

export function createJob(
  partial: Omit<RenderJobRecord, "createdAt" | "progress" | "message">,
): RenderJobRecord {
  const job: RenderJobRecord = {
    ...partial,
    progress: 0,
    message: "Queued",
    createdAt: Date.now(),
  };

  getStore().set(job.id, job);
  return job;
}

export function updateJob(id: string, patch: Partial<RenderJobRecord>) {
  const store = getStore();
  const current = store.get(id);

  if (!current) {
    return undefined;
  }

  const next = { ...current, ...patch };
  store.set(id, next);
  return next;
}

export function getJob(id: string) {
  return getStore().get(id);
}
