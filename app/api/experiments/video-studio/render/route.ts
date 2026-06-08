import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { createJob, getJob, updateJob } from "@/experiments/video-studio/server/jobs";
import { renderHyperframesTemplate } from "@/experiments/video-studio/server/renderHyperframes";
import { renderRemotionTemplate } from "@/experiments/video-studio/server/renderRemotion";
import { parseTemplateInput } from "@/experiments/video-studio/server/validateInput";
import { parseDeckSeriesInput } from "@/experiments/video-studio/server/validateDeckSeries";
import {
  canRenderLocally,
  ensureWorkspace,
  renderOutputPath,
  UPLOADS_DIR,
} from "@/experiments/video-studio/server/workspace";
import { getTemplateById } from "@/experiments/video-studio/templates";
import type { TemplateInputProps } from "@/experiments/video-studio/types";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 300;

type RenderRequestBody = {
  templateId: string;
  input: Record<string, string | number>;
  uploadIds?: Record<string, string>;
};

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rateLimit = checkRateLimit(`video-studio-render:${ip}`, {
    max: 4,
    windowMs: 120_000,
  });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many render requests. Wait before trying again." },
      { status: 429 },
    );
  }

  if (!canRenderLocally()) {
    return NextResponse.json(
      {
        error:
          "Local render is disabled on Vercel. Run `npm run dev` locally with FFmpeg installed, or upgrade to cloud rendering.",
        cloudUpgrade: true,
      },
      { status: 503 },
    );
  }

  try {
    const body = (await request.json()) as RenderRequestBody;
    const template = getTemplateById(body.templateId);

    if (!template) {
      return NextResponse.json({ error: "Unknown template." }, { status: 404 });
    }

    const parsedInput =
      template.id === "deck-explainer-series"
        ? parseDeckSeriesInput(body.input)
        : parseTemplateInput(template, body.input);
    const jobId = randomUUID();

    createJob({
      id: jobId,
      templateId: template.id,
      engine: template.engine,
      status: "queued",
    });

    await ensureWorkspace();
    const outputPath = renderOutputPath(jobId);

    updateJob(jobId, {
      status: "rendering",
      progress: 0.02,
      message: "Starting render",
    });

    const assetPaths: Record<string, string> = {};

    if (body.uploadIds?.videoAsset) {
      const files = await import("node:fs/promises").then((mod) =>
        mod.readdir(UPLOADS_DIR),
      );
      const match = files.find((file) =>
        file.startsWith(`${body.uploadIds!.videoAsset}.`) ||
        file.startsWith(`${body.uploadIds!.videoAsset}`),
      );

      if (match) {
        assetPaths.videoAsset = path.join(UPLOADS_DIR, match);
      }
    }

    const onProgress = (progress: number, message: string) => {
      updateJob(jobId, { progress, message, status: "rendering" });
    };

    if (template.engine === "remotion") {
      await renderRemotionTemplate({
        templateId: template.id,
        input: parsedInput,
        outputPath,
        onProgress,
      });
    } else {
      await renderHyperframesTemplate({
        templateId: template.id,
        sessionId: jobId,
        input: parsedInput as TemplateInputProps,
        outputPath,
        assetPaths,
        onProgress,
      });
    }

    updateJob(jobId, {
      status: "complete",
      progress: 1,
      message: "Render complete",
      outputPath,
      completedAt: Date.now(),
    });

    return NextResponse.json({
      jobId,
      status: "complete",
      downloadUrl: `/api/experiments/video-studio/download/${jobId}`,
    });
  } catch (error) {
    console.error(
      "[video-studio] render failed:",
      error instanceof Error ? error.stack : error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Render failed unexpectedly.",
      },
      { status: 500 },
    );
  }
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
    ...job,
    downloadUrl:
      job.status === "complete"
        ? `/api/experiments/video-studio/download/${job.id}`
        : undefined,
  });
}
