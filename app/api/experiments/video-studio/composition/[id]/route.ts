import { NextResponse } from "next/server";
import { composeHyperframesProjectHtml } from "@/experiments/video-studio/server/composeHtml";
import { getTemplateById } from "@/experiments/video-studio/templates";
import { parseTemplateInput } from "@/experiments/video-studio/server/validateInput";

export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteContext) {
  const { id } = await params;
  const template = getTemplateById(id);

  if (!template || template.engine !== "hyperframes") {
    return NextResponse.json({ error: "Composition not found." }, { status: 404 });
  }

  const url = new URL(request.url);
  const rawInput = Object.fromEntries(url.searchParams.entries());

  try {
    const input = parseTemplateInput(template, rawInput);
    const videoAssetUrl = url.searchParams.get("videoAssetUrl") ?? "";

    const html = await composeHyperframesProjectHtml(id, input, {
      videoAssetUrl,
    });

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to compose HyperFrames preview.",
      },
      { status: 400 },
    );
  }
}
