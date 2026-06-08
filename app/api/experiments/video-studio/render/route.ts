import { randomUUID } from "node:crypto";
import { stat } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { remotionProjectDir } from "@/experiments/video-studio/server/compileRemotionComposition";
import { createJob, getJob, updateJob } from "@/experiments/video-studio/server/jobs";
import {
  readDeckDraft,
  renderDeckDraft,
  renderHyperframesTemplate,
} from "@/experiments/video-studio/server/renderHyperframes";
import {
  renderAgentRemotionDraft,
  renderRemotionTemplate,
} from "@/experiments/video-studio/server/renderRemotion";
import { parseTemplateInput } from "@/experiments/video-studio/server/validateInput";
import { parseDeckSeriesInput } from "@/experiments/video-studio/server/validateDeckSeries";
import type { DeckExplainerSeriesProps } from "@/experiments/video-studio/templates/remotion/deck-series-props";
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

const DECK_TEMPLATE_ID = "deck-explainer-series";

type DeckEngine = "hyperframes" | "remotion";

type RenderRequestBody = {
  templateId: string;
  input: Record<string, string | number>;
  uploadIds?: Record<string, string>;
  /** Pptx mode: id of the agent-authored draft to render. Required when
      templateId is deck-explainer-series. */
  animationSessionId?: string;
  /** Pptx mode: which engine produced the draft. Defaults to hyperframes. */
  animationEngine?: DeckEngine;
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

    // Pptx mode now renders the agent-authored draft, not the static
    // Remotion composition. Require the sessionId from the animate step
    // and route to the engine that PRODUCED the draft.
    const isDeckMode = template.id === DECK_TEMPLATE_ID;
    const deckEngine: DeckEngine = body.animationEngine ?? "hyperframes";
    if (isDeckMode) {
      if (!body.animationSessionId) {
        return NextResponse.json(
          {
            error:
              "Animate the deck before rendering. The render uses the agent-authored composition.",
          },
          { status: 400 },
        );
      }

      if (deckEngine === "remotion") {
        const compositionTsx = path.join(
          remotionProjectDir(body.animationSessionId),
          "Composition.tsx",
        );
        try {
          await stat(compositionTsx);
        } catch {
          return NextResponse.json(
            {
              error:
                "No Remotion composition found for that session. Re-animate and try again.",
            },
            { status: 404 },
          );
        }
      } else {
        const draft = await readDeckDraft(body.animationSessionId);
        if (!draft) {
          return NextResponse.json(
            {
              error:
                "No composition found for that session. Re-animate and try again.",
            },
            { status: 404 },
          );
        }
      }
    }

    const parsedInput = isDeckMode
      ? parseDeckSeriesInput(body.input)
      : parseTemplateInput(template, body.input);
    const jobId = randomUUID();

    createJob({
      id: jobId,
      templateId: template.id,
      engine: isDeckMode ? deckEngine : template.engine,
      status: "queued",
      sessionId: body.animationSessionId,
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

    if (isDeckMode) {
      if (deckEngine === "remotion") {
        // parsedInput is guaranteed to be the deck shape here because
        // isDeckMode took the parseDeckSeriesInput branch above; TS
        // can't re-narrow across const reassignment so we assert.
        await renderAgentRemotionDraft({
          sessionId: body.animationSessionId!,
          scenePlan: parsedInput as DeckExplainerSeriesProps,
          outputPath,
          width: template.dimensions.width,
          height: template.dimensions.height,
          fps: template.fps,
          onProgress,
        });
      } else {
        await renderDeckDraft({
          sessionId: body.animationSessionId!,
          outputPath,
          onProgress,
        });
      }
    } else if (template.engine === "remotion") {
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
