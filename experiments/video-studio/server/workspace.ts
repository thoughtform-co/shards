import { mkdir, rm } from "node:fs/promises";
import path from "node:path";

export const VIDEO_STUDIO_ROOT = path.join(process.cwd(), ".video-studio");

export const UPLOADS_DIR = path.join(VIDEO_STUDIO_ROOT, "uploads");
export const RENDERS_DIR = path.join(VIDEO_STUDIO_ROOT, "renders");
export const COMPILED_DIR = path.join(VIDEO_STUDIO_ROOT, "compiled");

export function canRenderLocally() {
  return process.env.VERCEL !== "1";
}

export async function ensureWorkspace() {
  await mkdir(UPLOADS_DIR, { recursive: true });
  await mkdir(RENDERS_DIR, { recursive: true });
  await mkdir(COMPILED_DIR, { recursive: true });
}

export function renderOutputPath(jobId: string) {
  return path.join(RENDERS_DIR, `${jobId}.mp4`);
}

export function compiledProjectDir(templateId: string, sessionId: string) {
  return path.join(COMPILED_DIR, `${templateId}-${sessionId}`);
}

export async function cleanupCompiledDir(dir: string) {
  await rm(dir, { recursive: true, force: true });
}
