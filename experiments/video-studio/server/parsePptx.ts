import JSZip from "jszip";
import { XMLParser } from "fast-xml-parser";

export type ParsedSlide = {
  index: number;
  title: string;
  lines: string[];
};

export type ParsedPptx = {
  slides: ParsedSlide[];
  slideCount: number;
};

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  removeNSPrefix: true,
  isArray: (name) =>
    ["sldId", "Relationship", "sp", "p", "r", "t"].includes(name),
});

function asArray<T>(value: T | T[] | undefined): T[] {
  if (!value) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
}

function collectText(node: unknown): string {
  if (!node || typeof node !== "object") {
    return "";
  }

  const record = node as Record<string, unknown>;

  if (typeof record["#text"] === "string") {
    return record["#text"];
  }

  if (typeof record.t === "string") {
    return record.t;
  }

  const runs = asArray(record.r);
  const runText = runs.map((run) => collectText(run)).join("");

  if (runText) {
    return runText;
  }

  return Object.values(record)
    .map((child) => collectText(child))
    .join("");
}

function paragraphText(paragraph: unknown): string {
  if (!paragraph || typeof paragraph !== "object") {
    return "";
  }

  const record = paragraph as Record<string, unknown>;
  const runs = asArray(record.r);
  const direct = typeof record.t === "string" ? record.t : "";

  if (runs.length > 0) {
    return runs
      .map((run) => collectText(run))
      .join("")
      .replace(/\s+/g, " ")
      .trim();
  }

  return direct.replace(/\s+/g, " ").trim();
}

function shapeIsTitle(shape: Record<string, unknown>): boolean {
  const nvSpPr = shape.nvSpPr as Record<string, unknown> | undefined;
  const nvPr = nvSpPr?.nvPr as Record<string, unknown> | undefined;
  const ph = nvPr?.ph as Record<string, unknown> | undefined;
  const type = String(ph?.["@_type"] ?? "");

  return type === "title" || type === "ctrTitle";
}

function extractShapeText(shape: Record<string, unknown>): string {
  const txBody = shape.txBody as Record<string, unknown> | undefined;
  const paragraphs = asArray(txBody?.p);

  return paragraphs
    .map((paragraph) => paragraphText(paragraph))
    .filter(Boolean)
    .join("\n");
}

function mergeTextBlocks(blocks: string[]): string[] {
  const merged: string[] = [];

  for (const block of blocks) {
    const previous = merged.at(-1);

    if (
      previous &&
      (block.length < 36 || previous.length < 36) &&
      `${previous} ${block}`.length < 120
    ) {
      merged[merged.length - 1] = `${previous} ${block}`.trim();
      continue;
    }

    merged.push(block);
  }

  return merged;
}

function extractTextBlocksFromSlideXml(xml: string): string[] {
  const matches = [...xml.matchAll(/<a:t(?:\s[^>]*)?>([\s\S]*?)<\/a:t>/g)];

  return matches
    .map((match) =>
      match[1]
        ?.replaceAll("&amp;", "&")
        .replaceAll("&lt;", "<")
        .replaceAll("&gt;", ">")
        .replaceAll("&quot;", '"')
        .replaceAll("&#39;", "'")
        .replace(/\s+/g, " ")
        .trim() ?? "",
    )
    .filter(Boolean);
}

function parseSlideXml(xml: string, index: number): ParsedSlide {
  const textBlocks = extractTextBlocksFromSlideXml(xml);

  if (textBlocks.length > 0) {
    const mergedBlocks = mergeTextBlocks(textBlocks);
    const [title, ...lines] = mergedBlocks;

    return {
      index,
      title: title ?? `Slide ${index + 1}`,
      lines: lines.filter((line) => line !== title),
    };
  }

  const doc = parser.parse(xml) as Record<string, unknown>;
  const sld = doc.sld as Record<string, unknown> | undefined;
  const cSld = sld?.cSld as Record<string, unknown> | undefined;
  const spTree = cSld?.spTree as Record<string, unknown> | undefined;
  const shapes = asArray(spTree?.sp);

  let title = "";
  const bodyLines: string[] = [];

  for (const shape of shapes) {
    if (!shape || typeof shape !== "object") {
      continue;
    }

    const record = shape as Record<string, unknown>;
    const text = extractShapeText(record);

    if (!text) {
      continue;
    }

    if (!title && shapeIsTitle(record)) {
      title = text.split("\n")[0]?.trim() ?? text;
      const remainder = text
        .split("\n")
        .slice(1)
        .map((line) => line.trim())
        .filter(Boolean);

      bodyLines.push(...remainder);
      continue;
    }

    bodyLines.push(
      ...text
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
    );
  }

  const uniqueLines = Array.from(new Set(bodyLines)).filter(
    (line) => line !== title,
  );

  if (!title && uniqueLines.length > 0) {
    title = uniqueLines.shift() ?? `Slide ${index + 1}`;
  }

  if (!title) {
    title = `Slide ${index + 1}`;
  }

  return {
    index,
    title,
    lines: uniqueLines,
  };
}

async function readSlideOrder(
  zip: JSZip,
): Promise<{ path: string; index: number }[]> {
  const slideFiles = Object.keys(zip.files)
    .filter((name) => /^ppt\/slides\/slide\d+\.xml$/.test(name))
    .sort((a, b) => {
      const numA = Number(a.match(/slide(\d+)\.xml$/)?.[1] ?? 0);
      const numB = Number(b.match(/slide(\d+)\.xml$/)?.[1] ?? 0);
      return numA - numB;
    });

  const presentationFile = zip.file("ppt/presentation.xml");
  const relsFile = zip.file("ppt/_rels/presentation.xml.rels");

  if (!presentationFile || !relsFile) {
    return slideFiles.map((path, index) => ({ path, index }));
  }

  try {
    const presentation = parser.parse(await presentationFile.async("string")) as Record<
      string,
      unknown
    >;
    const rels = parser.parse(await relsFile.async("string")) as Record<string, unknown>;
    const relationships = asArray(
      (rels.Relationships as Record<string, unknown> | undefined)?.Relationship,
    );

    const targetById = new Map<string, string>();

    for (const rel of relationships) {
      const record = rel as Record<string, unknown>;
      const id = String(record["@_Id"] ?? "");
      const target = String(record["@_Target"] ?? "");

      if (id && target.startsWith("slides/")) {
        targetById.set(id, `ppt/${target}`);
      }
    }

    const sldIdLst = (
      (presentation.presentation as Record<string, unknown> | undefined)
        ?.sldIdLst as Record<string, unknown> | undefined
    )?.sldId;

    const orderedIds = asArray(sldIdLst).map((entry) =>
      String((entry as Record<string, unknown>)["@_r:id"] ?? ""),
    );

    const orderedPaths = orderedIds
      .map((id) => targetById.get(id))
      .filter((path): path is string => Boolean(path));

    if (orderedPaths.length > 0) {
      return orderedPaths.map((path, index) => ({ path, index }));
    }
  } catch {
    // Fall back to numeric sort below.
  }

  return slideFiles.map((path, index) => ({ path, index }));
}

export async function parsePptx(buffer: Buffer): Promise<ParsedPptx> {
  const zip = await JSZip.loadAsync(buffer);
  const order = await readSlideOrder(zip);
  const slides: ParsedSlide[] = [];

  for (const entry of order) {
    const file = zip.file(entry.path);

    if (!file) {
      continue;
    }

    const xml = await file.async("string");
    slides.push(parseSlideXml(xml, entry.index));
  }

  return {
    slides,
    slideCount: slides.length,
  };
}
