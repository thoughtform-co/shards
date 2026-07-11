/*
 * In-memory render job store, keyed on globalThis so it survives
 * Next.js HMR module reloads in dev. Ported from the proven
 * video-studio pattern in the parent repo. Single-user local tool —
 * no persistence needed; a restart simply forgets old jobs (the MP4
 * files stay in .renders/).
 */

export type RenderJobStatus = "queued" | "rendering" | "complete" | "failed";

export type RenderJob = {
  id: string;
  status: RenderJobStatus;
  /** 0..1 */
  progress: number;
  message: string;
  outputPath?: string;
  /** Download filename derived from the doc title. */
  filename?: string;
  error?: string;
  createdAt: number;
  completedAt?: number;
};

declare global {
  var __motionLabJobs: Map<string, RenderJob> | undefined;
}

function getStore(): Map<string, RenderJob> {
  if (!globalThis.__motionLabJobs) {
    globalThis.__motionLabJobs = new Map<string, RenderJob>();
  }
  return globalThis.__motionLabJobs;
}

export function createJob(id: string, filename: string): RenderJob {
  const job: RenderJob = {
    id,
    status: "queued",
    progress: 0,
    message: "Queued",
    filename,
    createdAt: Date.now(),
  };
  getStore().set(id, job);
  return job;
}

export function updateJob(
  id: string,
  patch: Partial<RenderJob>,
): RenderJob | undefined {
  const store = getStore();
  const current = store.get(id);
  if (!current) return undefined;
  const next = { ...current, ...patch };
  store.set(id, next);
  return next;
}

export function getJob(id: string): RenderJob | undefined {
  return getStore().get(id);
}
