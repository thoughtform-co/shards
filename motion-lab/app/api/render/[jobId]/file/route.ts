import { promises as fs } from "node:fs";

import { NextResponse } from "next/server";

import { getJob } from "../../../../../lib/render/jobs";

export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{ jobId: string }>;
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { jobId } = await params;
  const job = getJob(jobId);
  if (!job || job.status !== "complete" || !job.outputPath) {
    return NextResponse.json({ error: "Not ready" }, { status: 404 });
  }

  let data: Buffer;
  try {
    data = await fs.readFile(job.outputPath);
  } catch {
    return NextResponse.json({ error: "File missing" }, { status: 500 });
  }

  return new NextResponse(new Uint8Array(data), {
    status: 200,
    headers: {
      "Content-Type": "video/mp4",
      "Content-Length": String(data.length),
      "Content-Disposition": `attachment; filename="${job.filename ?? "render.mp4"}"`,
    },
  });
}
