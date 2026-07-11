import { NextResponse } from "next/server";

import { getJob } from "../../../../lib/render/jobs";

export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{ jobId: string }>;
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { jobId } = await params;
  const job = getJob(jobId);
  if (!job) {
    return NextResponse.json({ error: "Unknown job" }, { status: 404 });
  }
  /* outputPath is a server detail; strip it from the wire. */
  const { outputPath: _outputPath, ...wire } = job;
  return NextResponse.json(wire);
}
