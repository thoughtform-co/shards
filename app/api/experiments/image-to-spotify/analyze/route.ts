import { NextResponse } from "next/server";
import {
  analyzeImageToPlaylistSeeds,
  type SupportedMimeType,
} from "@/experiments/image-to-spotify/server/analyze-image";
import { getSpotifyPlaylistPreview } from "@/experiments/image-to-spotify/server/spotify";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const maxUploadSizeBytes = 4 * 1024 * 1024;

export const runtime = "nodejs";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rateLimit = checkRateLimit(`image-to-spotify:${ip}`, {
    max: 10,
    windowMs: 60_000,
  });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        error: "Too many spins in a short window. Let the jukebox cool down for a moment.",
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(
            Math.max(1, Math.ceil((rateLimit.resetAt - Date.now()) / 1000)),
          ),
        },
      },
    );
  }

  try {
    const formData = await request.formData();
    const image = formData.get("image");

    if (!(image instanceof File)) {
      return NextResponse.json(
        { error: "Upload a photo before starting the playlist spin." },
        { status: 400 },
      );
    }

    if (!allowedMimeTypes.has(image.type)) {
      return NextResponse.json(
        {
          error:
            "Unsupported image type. Use JPG, PNG, WEBP, or GIF for this experiment.",
        },
        { status: 400 },
      );
    }

    if (image.size > maxUploadSizeBytes) {
      return NextResponse.json(
        {
          error: "Image too large. Keep uploads under 4 MB for this prototype.",
        },
        { status: 400 },
      );
    }

    const bytes = Buffer.from(await image.arrayBuffer());
    const analysis = await analyzeImageToPlaylistSeeds({
      base64: bytes.toString("base64"),
      mimeType: image.type as SupportedMimeType,
    });
    const playlist = await getSpotifyPlaylistPreview(analysis.artistSeeds);

    const mode =
      analysis.source === "live" && playlist.source === "live"
        ? "live"
        : analysis.source === "live" || playlist.source === "live"
          ? "hybrid"
          : "mock";

    return NextResponse.json({
      mode,
      playlistTitle: analysis.playlistTitle,
      objectiveDescription: analysis.objectiveDescription,
      vibeDescription: analysis.vibeDescription,
      artistSeeds: analysis.artistSeeds,
      tracks: playlist.tracks,
    });
  } catch (error) {
    console.error(
      "[image-to-spotify] analyze route failed:",
      error instanceof Error ? error.message : "unknown",
    );

    return NextResponse.json(
      { error: "Signal lost while spinning this playlist." },
      { status: 500 },
    );
  }
}
