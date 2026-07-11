import { createHash } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

import { NextResponse } from "next/server";

import type { MotionAsset } from "../../../lib/motiondoc/schema";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 25 * 1024 * 1024;
const TYPES: Record<string, { kind: "image" | "font"; mime: string[] }> = {
  png: { kind: "image", mime: ["image/png"] },
  jpg: { kind: "image", mime: ["image/jpeg"] },
  jpeg: { kind: "image", mime: ["image/jpeg"] },
  webp: { kind: "image", mime: ["image/webp"] },
  svg: { kind: "image", mime: ["image/svg+xml"] },
  woff: { kind: "font", mime: ["font/woff", "application/font-woff"] },
  woff2: { kind: "font", mime: ["font/woff2", "application/font-woff2"] },
  ttf: { kind: "font", mime: ["font/ttf", "application/x-font-ttf"] },
  otf: { kind: "font", mime: ["font/otf", "application/x-font-opentype"] },
};

function uploadsDir() {
  return path.join(process.cwd(), "public", "assets", "uploads");
}

function fontMetadata(name: string) {
  const stem = path.basename(name, path.extname(name)).replace(/[-_]+/g, " ");
  const lower = stem.toLowerCase();
  const weight = lower.includes("black")
    ? 900
    : lower.includes("extra bold") || lower.includes("extrabold")
      ? 800
      : lower.includes("bold")
        ? 700
        : lower.includes("semibold") || lower.includes("semi bold")
          ? 600
          : lower.includes("medium")
            ? 500
            : lower.includes("light")
              ? 300
              : 400;
  return {
    fontFamily: stem.replace(
      /\s+(thin|light|regular|medium|semi\s*bold|extra\s*bold|bold|black|italic)$/i,
      "",
    ),
    fontWeight: weight,
    fontStyle: lower.includes("italic") ? ("italic" as const) : ("normal" as const),
  };
}

export async function POST(request: Request) {
  const form = await request.formData();
  const files = form.getAll("files").filter((value): value is File => value instanceof File);
  if (files.length === 0) {
    return NextResponse.json({ error: "No files supplied" }, { status: 400 });
  }

  const dir = uploadsDir();
  await mkdir(dir, { recursive: true });
  const assets: MotionAsset[] = [];

  for (const file of files) {
    const ext = path.extname(file.name).slice(1).toLowerCase();
    const config = TYPES[ext];
    if (!config || file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `Unsupported or oversized file: ${file.name}` },
        { status: 415 },
      );
    }
    if (file.type && !config.mime.includes(file.type)) {
      return NextResponse.json(
        { error: `MIME type does not match ${file.name}` },
        { status: 415 },
      );
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const sha256 = createHash("sha256").update(bytes).digest("hex");
    const storedName = `${sha256}.${ext}`;
    const destination = path.join(dir, storedName);
    await writeFile(destination, bytes, { flag: "wx" }).catch((error: NodeJS.ErrnoException) => {
      if (error.code !== "EEXIST") throw error;
    });

    assets.push({
      id: `asset-${sha256.slice(0, 16)}`,
      kind: config.kind,
      originalName: path.basename(file.name),
      src: `/assets/uploads/${storedName}`,
      mimeType: file.type || config.mime[0],
      sha256,
      ...(config.kind === "font" ? fontMetadata(file.name) : {}),
    });
  }

  return NextResponse.json({ assets });
}

export async function DELETE(request: Request) {
  const body = (await request.json()) as { src?: string };
  const basename = body.src ? path.basename(body.src) : "";
  if (!/^[a-f0-9]{64}\.[a-z0-9]+$/.test(basename)) {
    return NextResponse.json({ error: "Invalid asset path" }, { status: 400 });
  }
  await unlink(path.join(uploadsDir(), basename)).catch((error: NodeJS.ErrnoException) => {
    if (error.code !== "ENOENT") throw error;
  });
  return NextResponse.json({ ok: true });
}
