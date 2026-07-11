import { readFile } from "node:fs/promises";
import path from "node:path";

import { strToU8, zipSync } from "fflate";

import { safeParseMotionDoc } from "../../../../lib/motiondoc/migrate";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json()) as { doc?: unknown };
  const parsed = safeParseMotionDoc(body.doc);
  if (!parsed.success) {
    return Response.json({ error: "Invalid motion doc" }, { status: 422 });
  }
  const doc = parsed.data;
  const entries: Record<string, Uint8Array> = {
    "manifest.json": strToU8(
      JSON.stringify(
        { format: "motion-lab-project", version: 1, document: "project.motion.json" },
        null,
        2,
      ),
    ),
    "project.motion.json": strToU8(JSON.stringify(doc, null, 2)),
  };

  for (const asset of doc.assets) {
    const basename = path.basename(asset.src);
    try {
      entries[`assets/${basename}`] = new Uint8Array(
        await readFile(path.join(process.cwd(), "public", "assets", "uploads", basename)),
      );
    } catch {
      return Response.json(
        { error: `Missing local asset: ${asset.originalName}` },
        { status: 409 },
      );
    }
  }

  const archive = zipSync(entries, { level: 6 });
  const archiveBody = archive.buffer.slice(
    archive.byteOffset,
    archive.byteOffset + archive.byteLength,
  ) as ArrayBuffer;
  return new Response(archiveBody, {
    headers: {
      "content-type": "application/zip",
      "content-disposition": 'attachment; filename="motion-lab-project.motion.zip"',
    },
  });
}
