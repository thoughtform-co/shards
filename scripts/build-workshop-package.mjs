// Build the Creative AI Workshop package zip.
//
// Assembles the workshop-package/ source tree plus the existing .skill
// bundles in data/skills/ into a single self-contained zip. The zip is
// what attendees drop into Claude Cowork: it unpacks into a folder that
// Cowork can read end-to-end (deck, skills, docs, README).
//
// Usage:
//   node scripts/build-workshop-package.mjs
//
// Output:
//   exports/creative-ai-workshop.zip
//
// Sibling to scripts/build-exports.mjs. Implements a minimal Node-only
// zip writer (deflate-or-stored) so there are no runtime dependencies
// beyond the standard library.

import { mkdir, readFile, writeFile, readdir } from "node:fs/promises";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { deflateRawSync } from "node:zlib";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const sourceDir = resolve(root, "workshop-package");
const skillsDir = resolve(root, "data", "skills");
const outDir = resolve(root, "exports");
const outZip = resolve(outDir, "creative-ai-workshop.zip");

// ── 1 · Walk the workshop-package source tree ──────────────────────────

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

const sourceEntries = (await walk(sourceDir)).map(({ rel, full }) => ({
  pathInZip: `creative-ai-workshop/${rel}`,
  source: full,
}));

// ── 2 · Add the .skill examples under skills/examples/ ─────────────────

const skillBundleNames = (await readdir(skillsDir)).filter((f) =>
  f.endsWith(".skill"),
);
const exampleEntries = skillBundleNames.map((name) => ({
  pathInZip: `creative-ai-workshop/skills/examples/${name}`,
  source: join(skillsDir, name),
}));

const allEntries = [...sourceEntries, ...exampleEntries].sort((a, b) =>
  a.pathInZip.localeCompare(b.pathInZip),
);

// ── 3 · Minimal zip writer (deflate-or-stored, UTF-8 names) ────────────
//
// We avoid a runtime dependency by writing the zip bytes ourselves.
// The format is well-defined; we only need three structures:
//   - Local file header (LFH) before each file's data
//   - Central directory header (CDH) at the end, one per entry
//   - End-of-central-directory record (EOCD) at the very end

// CRC32 table (standard polynomial 0xEDB88320), built once.
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

  // Try deflate; fall back to stored if it doesn't actually shrink
  // (zip-of-zip case for the .skill bundles, tiny files, etc).
  const deflated = data.length === 0 ? Buffer.alloc(0) : deflateRawSync(data, { level: 9 });
  const useDeflate = deflated.length < data.length && data.length > 0;
  const stored = useDeflate ? deflated : data;
  const method = useDeflate ? 8 : 0;
  const crc = crc32(data);
  const nameBuf = Buffer.from(pathInZip, "utf8");

  // Local file header: 30 bytes + filename
  const lfh = Buffer.alloc(30 + nameBuf.length);
  lfh.writeUInt32LE(0x04034b50, 0); // signature
  lfh.writeUInt16LE(20, 4); // version needed (2.0)
  lfh.writeUInt16LE(0x0800, 6); // general flag: UTF-8 filename
  lfh.writeUInt16LE(method, 8);
  lfh.writeUInt16LE(dosT, 10);
  lfh.writeUInt16LE(dosD, 12);
  lfh.writeUInt32LE(crc, 14);
  lfh.writeUInt32LE(stored.length, 18);
  lfh.writeUInt32LE(data.length, 22);
  lfh.writeUInt16LE(nameBuf.length, 26);
  lfh.writeUInt16LE(0, 28); // extra field length
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

// Central directory headers
const cdStart = offset;
const cdChunks = [];
for (const e of cdEntries) {
  const cdh = Buffer.alloc(46 + e.name.length);
  cdh.writeUInt32LE(0x02014b50, 0); // signature
  cdh.writeUInt16LE(20, 4); // version made by
  cdh.writeUInt16LE(20, 6); // version needed
  cdh.writeUInt16LE(0x0800, 8); // UTF-8 filename
  cdh.writeUInt16LE(e.method, 10);
  cdh.writeUInt16LE(dosT, 12);
  cdh.writeUInt16LE(dosD, 14);
  cdh.writeUInt32LE(e.crc, 16);
  cdh.writeUInt32LE(e.compressedSize, 20);
  cdh.writeUInt32LE(e.uncompressedSize, 24);
  cdh.writeUInt16LE(e.name.length, 28);
  cdh.writeUInt16LE(0, 30); // extra field
  cdh.writeUInt16LE(0, 32); // file comment
  cdh.writeUInt16LE(0, 34); // disk number start
  cdh.writeUInt16LE(0, 36); // internal attrs
  cdh.writeUInt32LE(0, 38); // external attrs
  cdh.writeUInt32LE(e.offset, 42); // relative offset of local header
  e.name.copy(cdh, 46);
  cdChunks.push(cdh);
  offset += cdh.length;
}
const cdSize = offset - cdStart;

// End-of-central-directory record
const eocd = Buffer.alloc(22);
eocd.writeUInt32LE(0x06054b50, 0);
eocd.writeUInt16LE(0, 4); // disk number
eocd.writeUInt16LE(0, 6); // disk with start of CD
eocd.writeUInt16LE(cdEntries.length, 8); // entries on this disk
eocd.writeUInt16LE(cdEntries.length, 10); // total entries
eocd.writeUInt32LE(cdSize, 12);
eocd.writeUInt32LE(cdStart, 16);
eocd.writeUInt16LE(0, 20); // comment length

const final = Buffer.concat([...localChunks, ...cdChunks, eocd]);

await mkdir(outDir, { recursive: true });
await writeFile(outZip, final);

// ── 4 · Report ────────────────────────────────────────────────────────

const relOut = relative(root, outZip).split(sep).join("/");
const sizeKb = (final.length / 1024).toFixed(1);
const uncompKb = (totalUncompressed / 1024).toFixed(1);
console.log(`wrote: ${relOut} (${sizeKb} KB compressed, ${uncompKb} KB uncompressed)`);
console.log(`entries: ${cdEntries.length}`);
console.log("");
console.log("Top-level layout:");
const topLevels = new Set();
for (const e of allEntries) {
  const stripped = e.pathInZip.replace(/^creative-ai-workshop\//, "");
  const top = stripped.split("/")[0];
  topLevels.add(stripped.includes("/") ? `${top}/` : top);
}
for (const t of [...topLevels].sort()) console.log(`  ${t}`);
