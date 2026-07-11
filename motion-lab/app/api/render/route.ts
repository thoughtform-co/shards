import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";

import { motionDocSchema } from "../../../lib/motiondoc/schema";
import { createJob, updateJob } from "../../../lib/render/jobs";
import { renderMotionDocToFile } from "../../../lib/render/renderer";
import { ensureRendersDir, renderOutputPath } from "../../../lib/render/workspace";

export const runtime = "nodejs";

function slugify(title: string): string {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "motion-doc"
  );
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = motionDocSchema.safeParse((body as { doc?: unknown })?.doc);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid motion doc",
        issues: parsed.error.issues.slice(0, 10).map((i) => ({
          path: i.path.join("."),
          message: i.message,
        })),
      },
      { status: 422 },
    );
  }

  const doc = parsed.data;
  const jobId = randomUUID();
  createJob(jobId, `${slugify(doc.meta.title)}.mp4`);

  /* Fire and forget — the client polls GET /api/render/[jobId]. */
  void (async () => {
    try {
      await ensureRendersDir();
      const outputPath = renderOutputPath(jobId);
      updateJob(jobId, { status: "rendering", message: "Starting…" });
      await renderMotionDocToFile({
        doc,
        outputPath,
        onProgress: (progress, message) =>
          updateJob(jobId, { progress, message }),
      });
      updateJob(jobId, {
        status: "complete",
        progress: 1,
        message: "Done",
        outputPath,
        completedAt: Date.now(),
      });
    } catch (error) {
      updateJob(jobId, {
        status: "failed",
        message: "Render failed",
        error: error instanceof Error ? error.message : String(error),
        completedAt: Date.now(),
      });
    }
  })();

  return NextResponse.json({ jobId });
}
