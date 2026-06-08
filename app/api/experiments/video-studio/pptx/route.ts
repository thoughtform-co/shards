import { NextResponse } from "next/server";
import { analyzeDeck } from "@/experiments/video-studio/server/analyzeDeck";
import { parsePptx } from "@/experiments/video-studio/server/parsePptx";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

const maxUploadSizeBytes = 30 * 1024 * 1024;

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rateLimit = checkRateLimit(`video-studio-pptx:${ip}`, {
    max: 6,
    windowMs: 60_000,
  });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many deck uploads. Wait a moment and try again." },
      { status: 429 },
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const clientHint = String(formData.get("clientHint") ?? "Monizze employer benefits");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Upload a .pptx file before continuing." },
        { status: 400 },
      );
    }

    if (!file.name.toLowerCase().endsWith(".pptx")) {
      return NextResponse.json(
        { error: "Only .pptx files are supported." },
        { status: 400 },
      );
    }

    if (file.size > maxUploadSizeBytes) {
      return NextResponse.json(
        { error: "Deck too large. Keep uploads under 30 MB." },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const parsed = await parsePptx(buffer);

    if (parsed.slides.length === 0) {
      return NextResponse.json(
        { error: "No readable slide text found in this deck." },
        { status: 400 },
      );
    }

    const analysis = await analyzeDeck(parsed, { clientHint });

    return NextResponse.json({
      filename: file.name,
      slideCount: analysis.slideCount,
      source: analysis.source,
      scenePlan: analysis.scenePlan,
      slides: parsed.slides,
    });
  } catch (error) {
    console.error(
      "[video-studio] pptx analyze failed:",
      error instanceof Error ? error.message : "unknown",
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to analyze the PowerPoint deck.",
      },
      { status: 500 },
    );
  }
}
