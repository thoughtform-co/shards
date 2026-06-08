import { readFile } from "node:fs/promises";
import path from "node:path";
import type { TemplateInputProps } from "@/experiments/video-studio/types";

const hyperframesTemplateRoot = path.join(
  process.cwd(),
  "experiments",
  "video-studio",
  "templates",
  "hyperframes",
);

export function getHyperframesTemplateDir(templateId: string) {
  return path.join(hyperframesTemplateRoot, templateId);
}

export async function readHyperframesTemplate(templateId: string) {
  const templateDir = getHyperframesTemplateDir(templateId);
  const html = await readFile(path.join(templateDir, "index.html"), "utf8");
  return { templateDir, html };
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function applyTemplateVariables(
  html: string,
  input: TemplateInputProps,
  assetUrls: Record<string, string> = {},
) {
  let output = html;

  for (const [key, rawValue] of Object.entries(input)) {
    const value = escapeHtml(String(rawValue ?? ""));
    output = output.replaceAll(`{{${key}}}`, value);
  }

  for (const [key, url] of Object.entries(assetUrls)) {
    output = output.replaceAll(`{{${key}}}`, url);
  }

  output = output.replace(/\{\{[a-zA-Z0-9_]+\}\}/g, "");

  return output;
}

export type ParsedCaption = {
  start: number;
  end: number;
  text: string;
};

export function parseCaptions(
  raw: string,
  totalDuration: number,
): ParsedCaption[] {
  const lines = raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return [];
  }

  const timed = lines
    .map((line) => {
      const match = line.match(/^(\d{1,2}:\d{2}(?::\d{2})?|\d+(?:\.\d+)?)\s*[|:-]\s*(.+)$/);

      if (!match) {
        return null;
      }

      const [, timestamp, text] = match;
      const start = parseTimestamp(timestamp);
      return { start, text: text.trim() };
    })
    .filter(Boolean) as { start: number; text: string }[];

  if (timed.length > 0) {
    return timed.map((entry, index) => ({
      start: entry.start,
      end:
        index < timed.length - 1
          ? timed[index + 1]!.start
          : Math.max(totalDuration, entry.start + 2),
      text: entry.text,
    }));
  }

  const slot = totalDuration / lines.length;

  return lines.map((text, index) => ({
    start: index * slot,
    end: (index + 1) * slot,
    text,
  }));
}

function parseTimestamp(value: string) {
  if (value.includes(":")) {
    const parts = value.split(":").map(Number);

    if (parts.length === 2) {
      return parts[0]! * 60 + parts[1]!;
    }

    return parts[0]! * 3600 + parts[1]! * 60 + parts[2]!;
  }

  return Number(value);
}

export function buildCaptionMarkup(
  captions: ParsedCaption[],
  accentColor: string,
) {
  if (captions.length === 0) {
    return `<p class="clip caption-fallback" data-start="1" data-duration="4" data-track-index="2" style="position:absolute;left:50%;bottom:12%;transform:translateX(-50%);font-size:42px;color:${accentColor};">Paste captions to animate</p>`;
  }

  return captions
    .map(
      (caption, index) => `<p id="caption-${index}" class="clip caption-line"
      data-start="${caption.start.toFixed(2)}"
      data-duration="${Math.max(0.4, caption.end - caption.start).toFixed(2)}"
      data-track-index="4"
      >${escapeHtml(caption.text)}</p>`,
    )
    .join("\n");
}

export async function composeHyperframesHtml(
  templateId: string,
  input: TemplateInputProps,
  assetUrls: Record<string, string> = {},
) {
  const { html } = await readHyperframesTemplate(templateId);

  const accentColor = String(input.accentColor ?? "#C5A059");
  const durationSeconds = Number(input.durationSeconds ?? 12);
  const captionsRaw = String(input.captions ?? "");
  const captions = parseCaptions(captionsRaw, durationSeconds);
  const captionMarkup = buildCaptionMarkup(captions, accentColor);

  let composed = applyTemplateVariables(html, input, assetUrls);
  composed = composed.replace("<!-- CAPTIONS -->", captionMarkup);

  const videoBlock = assetUrls.videoAssetUrl
    ? `<video id="footage" class="clip" data-start="2.2" data-duration="9.4" data-track-index="2" src="${assetUrls.videoAssetUrl}" muted playsinline></video>`
    : "";

  composed = composed.replace("<!-- VIDEO_BLOCK -->", videoBlock);

  return composed;
}

export function buildCaptionTimelineScript(captions: ParsedCaption[]) {
  if (captions.length === 0) {
    return "";
  }

  const lines = captions
    .map(
      (caption, index) =>
        `    tl.fromTo("#caption-${index}", { opacity: 0, y: 24, xPercent: -50 }, { opacity: 1, y: 0, xPercent: -50, duration: 0.35, ease: "power2.out" }, ${caption.start.toFixed(2)});`,
    )
    .join("\n");

  return `\n    ${lines}\n`;
}

export async function composeHyperframesProjectHtml(
  templateId: string,
  input: TemplateInputProps,
  assetUrls: Record<string, string> = {},
) {
  let html = await composeHyperframesHtml(templateId, input, assetUrls);
  const durationSeconds = Number(input.durationSeconds ?? 12);
  const captions = parseCaptions(String(input.captions ?? ""), durationSeconds);
  const timelineExtra = buildCaptionTimelineScript(captions);

  html = html.replace("/* CAPTION_TIMELINE */", timelineExtra);

  return html;
}
