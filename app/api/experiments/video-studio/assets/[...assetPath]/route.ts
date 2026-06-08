import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { UPLOADS_DIR } from "@/experiments/video-studio/server/workspace";

export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{ assetPath: string[] }>;
}

export async function GET(_request: Request, { params }: RouteContext) {
  const segments = (await params).assetPath;
  const filename = segments.join("/");

  if (!filename || filename.includes("..")) {
    return NextResponse.json({ error: "Invalid asset path." }, { status: 400 });
  }

  try {
    const filePath = path.join(UPLOADS_DIR, filename);
    const bytes = await readFile(filePath);
    const extension = path.extname(filename).toLowerCase();

    const contentType =
      extension === ".mp4"
        ? "video/mp4"
        : extension === ".webm"
          ? "video/webm"
          : extension === ".mov"
            ? "video/quicktime"
            : extension === ".png"
              ? "image/png"
              : extension === ".webp"
                ? "image/webp"
                : "application/octet-stream";

    return new NextResponse(bytes, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json({ error: "Asset not found." }, { status: 404 });
  }
}
