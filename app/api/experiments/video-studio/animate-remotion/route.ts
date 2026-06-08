import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { animateDeckRemotion } from "@/experiments/video-studio/server/animateDeckRemotion";
import { scenePlanSchema } from "@/experiments/video-studio/deck-scene-plan";
import { createJob, getJob, updateJob } from "@/experiments/video-studio/server/jobs";
import { ensureWorkspace } from "@/experiments/video-studio/server/workspace";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 120;

const motionPresetSchema = ["calm", "kinetic"] as const;

type AnimateRequestBody = {
  scenePlan: unknown;
  motionPreset?: string;
  styleIntent?: string;
};

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rateLimit = checkRateLimit(`video-studio-animate-remotion:${ip}`, {
    max: 6,
    windowMs: 120_000,
  });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many animate requests. Wait before trying again." },
      { status: 429 },
    );
  }

  let body: AnimateRequestBody;
  try {
    body = (await request.json()) as AnimateRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = scenePlanSchema.safeParse(body.scenePlan);
  if (!parsed.success) {
    return NextResponse.json(
      { error: `Invalid scene plan: ${parsed.error.message}` },
      { status: 400 },
    );
  }

  const motionPreset =
    typeof body.motionPreset === "string" &&
    (motionPresetSchema as readonly string[]).includes(body.motionPreset)
      ? (body.motionPreset as "calm" | "kinetic")
      : "calm";

  const styleIntent =
    typeof body.styleIntent === "string" ? body.styleIntent.slice(0, 800) : "";

  await ensureWorkspace();

  const jobId = randomUUID();
  const sessionId = jobId;

  createJob({
    id: jobId,
    templateId: "deck-explainer-series",
    engine: "remotion",
    status: "queued",
    sessionId,
  });

  // Fire-and-forget. Client polls via the GET handler.
  void (async () => {
    updateJob(jobId, {
      status: "rendering",
      progress: 0.02,
      message: "Starting…",
    });

    try {
      const result = await animateDeckRemotion({
        scenePlan: parsed.data,
        motionPreset,
        styleIntent,
        sessionId,
        onProgress: (progress, message) => {
          updateJob(jobId, { status: "rendering", progress, message });
        },
      });

      updateJob(jobId, {
        status: "complete",
        progress: 1,
        message:
          result.source === "agent"
            ? "Composition ready · Claude agent"
            : "Composition ready · deterministic fallback",
        sessionId: result.sessionId,
        source: result.source,
        completedAt: Date.now(),
      });
    } catch (error) {
      console.error(
        "[video-studio] animate-remotion failed:",
        error instanceof Error ? error.stack : error,
      );

      updateJob(jobId, {
        status: "failed",
        progress: 1,
        message:
          error instanceof Error
            ? error.message
            : "Remotion animation failed unexpectedly.",
        error:
          error instanceof Error
            ? error.message
            : "Remotion animation failed unexpectedly.",
        completedAt: Date.now(),
      });
    }
  })();

  return NextResponse.json({ jobId, status: "queued" });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const jobId = url.searchParams.get("jobId");

  if (!jobId) {
    return NextResponse.json({ error: "Missing jobId." }, { status: 400 });
  }

  const job = getJob(jobId);

  if (!job) {
    return NextResponse.json({ error: "Job not found." }, { status: 404 });
  }

  return NextResponse.json({
    id: job.id,
    status: job.status,
    progress: job.progress,
    message: job.message,
    sessionId: job.sessionId,
    source: job.source,
    error: job.error,
  });
}
