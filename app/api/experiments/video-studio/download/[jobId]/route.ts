import { readFile } from "node:fs/promises";
import { NextResponse } from "next/server";
import { getJob } from "@/experiments/video-studio/server/jobs";

export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{ jobId: string }>;
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { jobId } = await params;
  const job = getJob(jobId);

  if (!job || job.status !== "complete" || !job.outputPath) {
    return NextResponse.json({ error: "Rendered file not found." }, { status: 404 });
  }

  try {
    const bytes = await readFile(job.outputPath);

    return new NextResponse(bytes, {
      headers: {
        "Content-Type": "video/mp4",
        "Content-Disposition": `attachment; filename="${job.templateId}-${jobId.slice(0, 8)}.mp4"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch {
    return NextResponse.json({ error: "Rendered file missing on disk." }, { status: 404 });
  }
}
