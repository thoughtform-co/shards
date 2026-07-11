import { mkdir } from "node:fs/promises";
import path from "node:path";

/*
 * Render artifacts land in .renders/ inside motion-lab (gitignored).
 * process.cwd() is the motion-lab root because the dev server runs
 * from here.
 */

export function rendersDir(): string {
  return path.join(process.cwd(), ".renders");
}

export async function ensureRendersDir(): Promise<string> {
  const dir = rendersDir();
  await mkdir(dir, { recursive: true });
  return dir;
}

export function renderOutputPath(jobId: string): string {
  return path.join(rendersDir(), `${jobId}.mp4`);
}
