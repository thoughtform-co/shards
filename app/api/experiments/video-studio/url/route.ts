import { NextResponse } from "next/server";
import { analyzeSite, fetchSite, validateTargetUrl } from "@/experiments/video-studio/server/analyzeSite";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 30;

type UrlRequestBody = {
  url?: unknown;
};

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rateLimit = checkRateLimit(`video-studio-url:${ip}`, {
    max: 6,
    windowMs: 60_000,
  });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many site analyses. Wait a moment and try again." },
      { status: 429 },
    );
  }

  let body: UrlRequestBody;
  try {
    body = (await request.json()) as UrlRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (typeof body.url !== "string" || body.url.trim().length === 0) {
    return NextResponse.json(
      { error: "Provide a URL to analyze." },
      { status: 400 },
    );
  }

  let target: URL;
  try {
    target = validateTargetUrl(body.url);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Invalid URL.",
      },
      { status: 400 },
    );
  }

  try {
    const site = await fetchSite(target);
    const analysis = await analyzeSite(site);

    return NextResponse.json({
      url: target.toString(),
      siteTitle: analysis.siteTitle,
      source: analysis.source,
      scenePlan: analysis.scenePlan,
      designMd: analysis.designMd,
    });
  } catch (error) {
    console.error(
      "[video-studio] url analyze failed:",
      error instanceof Error ? error.message : "unknown",
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to analyze that website.",
      },
      { status: 500 },
    );
  }
}
