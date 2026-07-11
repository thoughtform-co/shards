// Package the motion-design Claude Skill bundle.
//
// The canonical skill source lives in motion-lab/skill/motion-design/
// (it doubles as Motion Lab's generation system prompt). This script
// zips it into data/skills/motion-design.skill — the format claude.ai
// accepts on upload and the /api/skills/[name] route serves. The
// bundle's top-level folder is the skill name with SKILL.md at its
// root, matching the existing bundles in data/skills/.
//
// Usage:
//   node scripts/package-motion-skill.mjs        (or: npm run skill:motion-design)
//
// Output:
//   data/skills/motion-design.skill
//
// Zip writer copied from scripts/build-workshop-package.mjs (minimal
// Node-only deflate-or-stored implementation, no dependencies).

import { mkdir, readFile, writeFile, readdir } from "node:fs/promises";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { deflateRawSync } from "node:zlib";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const sourceDir = resolve(root, "motion-lab", "skill", "motion-design");
const outDir = resolve(root, "data", "skills");
const outZip = resolve(outDir, "motion-design.skill");

// ── 1 · Walk the skill source tree ─────────────────────────────────────

async function walk(dir, base = dir) {
  const items = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      items.push(...(await walk(full, base)));
    } else if (entry.isFile()) {
      const rel = relative(base, full).split(sep).join("/");
      items.push({ rel, full });
    }
  }
  return items;
}

const allEntries = (await walk(sourceDir))
  .map(({ rel, full }) => ({
    pathInZip: `motion-design/${rel}`,
    source: full,
  }))
  .sort((a, b) => a.pathInZip.localeCompare(b.pathInZip));

if (!allEntries.some((e) => e.pathInZip === "motion-design/SKILL.md")) {
  console.error("motion-design/SKILL.md missing from the source tree — abort.");
  process.exit(1);
}

// ── 2 · Minimal zip writer (deflate-or-stored, UTF-8 names) ────────────

const crcTable = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) !== 0 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function dosTime(date) {
  const t =
    ((date.getHours() & 0x1f) << 11) |
    ((date.getMinutes() & 0x3f) << 5) |
    (Math.floor(date.getSeconds() / 2) & 0x1f);
  const d =
    (((date.getFullYear() - 1980) & 0x7f) << 9) |
    (((date.getMonth() + 1) & 0x0f) << 5) |
    (date.getDate() & 0x1f);
  return { t, d };
}

const now = new Date();
const { t: dosT, d: dosD } = dosTime(now);

const localChunks = [];
const cdEntries = [];
let offset = 0;
let totalUncompressed = 0;

for (const { pathInZip, source } of allEntries) {
  const data = await readFile(source);
  totalUncompressed += data.length;

  const deflated =
    data.length === 0 ? Buffer.alloc(0) : deflateRawSync(data, { level: 9 });
  const useDeflate = deflated.length < data.length && data.length > 0;
  const stored = useDeflate ? deflated : data;
  const method = useDeflate ? 8 : 0;
  const crc = crc32(data);
  const nameBuf = Buffer.from(pathInZip, "utf8");

  const lfh = Buffer.alloc(30 + nameBuf.length);
  lfh.writeUInt32LE(0x04034b50, 0);
  lfh.writeUInt16LE(20, 4);
  lfh.writeUInt16LE(0x0800, 6);
  lfh.writeUInt16LE(method, 8);
  lfh.writeUInt16LE(dosT, 10);
  lfh.writeUInt16LE(dosD, 12);
  lfh.writeUInt32LE(crc, 14);
  lfh.writeUInt32LE(stored.length, 18);
  lfh.writeUInt32LE(data.length, 22);
  lfh.writeUInt16LE(nameBuf.length, 26);
  lfh.writeUInt16LE(0, 28);
  nameBuf.copy(lfh, 30);

  localChunks.push(lfh, stored);
  cdEntries.push({
    name: nameBuf,
    method,
    crc,
    compressedSize: stored.length,
    uncompressedSize: data.length,
    offset,
  });
  offset += lfh.length + stored.length;
}

const cdStart = offset;
const cdChunks = [];
for (const e of cdEntries) {
  const cdh = Buffer.alloc(46 + e.name.length);
  cdh.writeUInt32LE(0x02014b50, 0);
  cdh.writeUInt16LE(20, 4);
  cdh.writeUInt16LE(20, 6);
  cdh.writeUInt16LE(0x0800, 8);
  cdh.writeUInt16LE(e.method, 10);
  cdh.writeUInt16LE(dosT, 12);
  cdh.writeUInt16LE(dosD, 14);
  cdh.writeUInt32LE(e.crc, 16);
  cdh.writeUInt32LE(e.compressedSize, 20);
  cdh.writeUInt32LE(e.uncompressedSize, 24);
  cdh.writeUInt16LE(e.name.length, 28);
  cdh.writeUInt16LE(0, 30);
  cdh.writeUInt16LE(0, 32);
  cdh.writeUInt16LE(0, 34);
  cdh.writeUInt16LE(0, 36);
  cdh.writeUInt32LE(0, 38);
  cdh.writeUInt32LE(e.offset, 42);
  e.name.copy(cdh, 46);
  cdChunks.push(cdh);
  offset += cdh.length;
}
const cdSize = offset - cdStart;

const eocd = Buffer.alloc(22);
eocd.writeUInt32LE(0x06054b50, 0);
eocd.writeUInt16LE(0, 4);
eocd.writeUInt16LE(0, 6);
eocd.writeUInt16LE(cdEntries.length, 8);
eocd.writeUInt16LE(cdEntries.length, 10);
eocd.writeUInt32LE(cdSize, 12);
eocd.writeUInt32LE(cdStart, 16);
eocd.writeUInt16LE(0, 20);

const final = Buffer.concat([...localChunks, ...cdChunks, eocd]);

await mkdir(outDir, { recursive: true });
await writeFile(outZip, final);

// ── 3 · Report ─────────────────────────────────────────────────────────

const relOut = relative(root, outZip).split(sep).join("/");
console.log(
  `wrote: ${relOut} (${(final.length / 1024).toFixed(1)} KB compressed, ${(totalUncompressed / 1024).toFixed(1)} KB uncompressed)`,
);
console.log(`entries: ${cdEntries.length}`);
for (const e of allEntries) console.log(`  ${e.pathInZip}`);
