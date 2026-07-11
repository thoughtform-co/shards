import { promises as fs } from "node:fs";
import path from "node:path";

import { NextResponse } from "next/server";

import { motionDocToHyperframes } from "../../../../lib/export/motionDocToHyperframes";
import { motionDocSchema } from "../../../../lib/motiondoc/schema";

export const runtime = "nodejs";

function slugify(title: string): string {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "motion-doc"
  );
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = motionDocSchema.safeParse((body as { doc?: unknown })?.doc);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid motion doc" }, { status: 422 });
  }
  const doc = parsed.data;

  const result = motionDocToHyperframes(doc);

  const stamp = new Date()
    .toISOString()
    .replace(/[:.]/g, "-")
    .slice(0, 19);
  const dirName = `${slugify(doc.meta.title)}-${stamp}`;
  const outDir = path.join(process.cwd(), "exports", "hyperframes", dirName);
  await fs.mkdir(outDir, { recursive: true });
  await fs.writeFile(path.join(outDir, "index.html"), result.html, "utf8");

  if (result.notes.length > 0) {
    await fs.writeFile(
      path.join(outDir, "TRANSLATION_NOTES.md"),
      `# Translation notes\n\n${result.notes.map((n) => `- ${n}`).join("\n")}\n`,
      "utf8",
    );
  }

  /* Copy referenced local images so the folder is self-contained. */
  const copied: string[] = [];
  for (const asset of result.localAssets) {
    const rel = asset.replace(/^\/+/, "");
    const from = path.join(process.cwd(), "public", rel);
    const to = path.join(outDir, rel);
    try {
      await fs.mkdir(path.dirname(to), { recursive: true });
      await fs.copyFile(from, to);
      copied.push(rel);
    } catch {
      /* missing asset — the note in TRANSLATION_NOTES flags it */
    }
  }

  return NextResponse.json({
    dir: path.relative(process.cwd(), outDir).replaceAll("\\", "/"),
    notes: result.notes,
    copiedAssets: copied,
    stats: result.stats,
  });
}
