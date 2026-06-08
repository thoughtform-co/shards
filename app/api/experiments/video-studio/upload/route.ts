import { randomUUID } from "node:crypto";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { getTemplateById } from "@/experiments/video-studio/templates";
import {
  ensureWorkspace,
  UPLOADS_DIR,
} from "@/experiments/video-studio/server/workspace";
import type { UploadRecord } from "@/experiments/video-studio/types";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const allowedVideoTypes = new Set([
  "video/mp4",
  "video/webm",
  "video/quicktime",
]);

const allowedImageTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const maxUploadSizeBytes = 200 * 1024 * 1024;

export const runtime = "nodejs";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rateLimit = checkRateLimit(`video-studio-upload:${ip}`, {
    max: 8,
    windowMs: 60_000,
  });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many uploads. Wait a moment and try again." },
      { status: 429 },
    );
  }

  try {
    await ensureWorkspace();

    const formData = await request.formData();
    const file = formData.get("file");
    const templateId = String(formData.get("templateId") ?? "");
    const fieldKey = String(formData.get("fieldKey") ?? "videoAsset");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Upload a file before continuing." },
        { status: 400 },
      );
    }

    const template = getTemplateById(templateId);
    const field = template?.fields.find((entry) => entry.key === fieldKey);
    const isVideoField = field?.type === "file-video";
    const isImageField = field?.type === "file-image";

    if (!isVideoField && !isImageField) {
      return NextResponse.json(
        { error: "This template field does not accept uploads." },
        { status: 400 },
      );
    }

    const allowed = isVideoField ? allowedVideoTypes : allowedImageTypes;

    if (!allowed.has(file.type)) {
      return NextResponse.json(
        {
          error: isVideoField
            ? "Unsupported video type. Use MP4, WEBM, or MOV."
            : "Unsupported image type. Use JPG, PNG, or WEBP.",
        },
        { status: 400 },
      );
    }

    if (file.size > maxUploadSizeBytes) {
      return NextResponse.json(
        { error: "File too large. Keep uploads under 200 MB." },
        { status: 400 },
      );
    }

    const uploadId = randomUUID();
    const extension = path.extname(file.name) || (isVideoField ? ".mp4" : ".png");
    const storedFilename = `${uploadId}${extension}`;
    const storedPath = path.join(UPLOADS_DIR, storedFilename);
    const bytes = Buffer.from(await file.arrayBuffer());
    await writeFile(storedPath, bytes);

    const record: UploadRecord = {
      id: uploadId,
      filename: file.name,
      mimeType: file.type,
      size: file.size,
      kind: isVideoField ? "video" : "image",
      storedPath,
      publicUrl: `/api/experiments/video-studio/assets/${uploadId}${extension}`,
    };

    return NextResponse.json(record);
  } catch (error) {
    console.error(
      "[video-studio] upload failed:",
      error instanceof Error ? error.message : "unknown",
    );

    return NextResponse.json(
      { error: "Upload failed while storing the asset." },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({
    maxUploadSizeBytes,
    allowedVideoTypes: [...allowedVideoTypes],
    allowedImageTypes: [...allowedImageTypes],
  });
}
