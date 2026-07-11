import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

import { EXAMPLES } from "../lib/examples";

const baseUrl = process.env.MOTION_LAB_URL ?? "http://127.0.0.1:3210";
const svg = Buffer.from(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><rect width="10" height="10" fill="#6d5dfc"/></svg>',
);
const sha256 = createHash("sha256").update(svg).digest("hex");
const basename = `${sha256}.svg`;
const appRoot = process.env.MOTION_LAB_ROOT ?? process.cwd();
const uploadDir = path.join(appRoot, "public", "assets", "uploads");
const assetPath = path.join(uploadDir, basename);

async function main() {
  await mkdir(uploadDir, { recursive: true });
  await writeFile(assetPath, svg);

  try {
  const doc = structuredClone(EXAMPLES[2].doc);
  doc.assets.push({
    id: `asset-${sha256.slice(0, 16)}`,
    kind: "image",
    originalName: "bundle-check.svg",
    src: `/assets/uploads/${basename}`,
    mimeType: "image/svg+xml",
    sha256,
    width: 10,
    height: 10,
  });

  const exported = await fetch(`${baseUrl}/api/project/export`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ doc }),
  });
  if (!exported.ok) {
    throw new Error(`Project export failed (${exported.status}): ${await exported.text()}`);
  }
  const archive = await exported.arrayBuffer();
  assert.equal(archive.byteLength > 100, true);

  await rm(assetPath, { force: true });
  const form = new FormData();
  form.append(
    "file",
    new File([archive], "bundle-check.motion.zip", { type: "application/zip" }),
  );
  const imported = await fetch(`${baseUrl}/api/project/import`, {
    method: "POST",
    body: form,
  });
  if (!imported.ok) {
    throw new Error(`Project import failed (${imported.status}): ${await imported.text()}`);
  }
  const result = (await imported.json()) as { doc: typeof doc };
  assert.equal(result.doc.version, 2);
  assert.equal(result.doc.assets[0].sha256, sha256);
  assert.equal(result.doc.assets[0].src, `/assets/uploads/${basename}`);
  console.log("Project bundle export/import round-trip passed.");
  } finally {
    await rm(assetPath, { force: true });
  }
}

void main();
