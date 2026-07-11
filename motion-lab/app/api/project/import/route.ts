import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { strFromU8, unzipSync } from "fflate";

import { safeParseMotionDoc } from "../../../../lib/motiondoc/migrate";

export const runtime = "nodejs";

const MAX_ARCHIVE = 200 * 1024 * 1024;

export async function POST(request: Request) {
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File) || file.size > MAX_ARCHIVE) {
    return Response.json({ error: "Invalid project bundle" }, { status: 400 });
  }

  let files: Record<string, Uint8Array>;
  try {
    files = unzipSync(new Uint8Array(await file.arrayBuffer()));
  } catch {
    return Response.json({ error: "Could not read project bundle" }, { status: 400 });
  }
  const names = Object.keys(files);
  const uncompressedSize = Object.values(files).reduce(
    (total, bytes) => total + bytes.byteLength,
    0,
  );
  if (
    names.length > 500 ||
    uncompressedSize > MAX_ARCHIVE ||
    names.some((name) => name.includes("..") || path.isAbsolute(name))
  ) {
    return Response.json({ error: "Unsafe project bundle" }, { status: 400 });
  }

  try {
    const manifest = JSON.parse(strFromU8(files["manifest.json"]));
    if (
      manifest.format !== "motion-lab-project" ||
      manifest.version !== 1 ||
      manifest.document !== "project.motion.json"
    ) {
      throw new Error("manifest");
    }
  } catch {
    return Response.json({ error: "Unsupported project manifest" }, { status: 422 });
  }

  let raw: unknown;
  try {
    raw = JSON.parse(strFromU8(files["project.motion.json"]));
  } catch {
    return Response.json({ error: "Missing project document" }, { status: 422 });
  }
  const parsed = safeParseMotionDoc(raw);
  if (!parsed.success) {
    return Response.json({ error: "Invalid project document" }, { status: 422 });
  }

  const uploadDir = path.join(process.cwd(), "public", "assets", "uploads");
  await mkdir(uploadDir, { recursive: true });
  for (const asset of parsed.data.assets) {
    const basename = path.basename(asset.src);
    const bytes = files[`assets/${basename}`];
    if (!bytes) {
      return Response.json(
        { error: `Bundle is missing ${asset.originalName}` },
        { status: 422 },
      );
    }
    const digest = createHash("sha256").update(bytes).digest("hex");
    if (digest !== asset.sha256 || !basename.startsWith(`${asset.sha256}.`)) {
      return Response.json(
        { error: `Asset hash mismatch: ${asset.originalName}` },
        { status: 422 },
      );
    }
    await writeFile(path.join(uploadDir, basename), bytes);
    asset.src = `/assets/uploads/${basename}`;
  }

  return Response.json({ doc: parsed.data });
}
