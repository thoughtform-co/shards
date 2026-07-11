import { resolveColor } from "../motiondoc/colors";
import { sampleElementValues } from "../motiondoc/sample";
import type { MotionDoc, MotionElement } from "../motiondoc/schema";
import { computeSceneStarts, overlapIn, totalDurationInFrames } from "../motiondoc/timing";

import { GSAP_EASE, springToGsapEase } from "./easeMap";

/*
 * Pure MotionDoc → self-contained HyperFrames HTML translation.
 *
 * The document becomes one composition div with per-scene timed divs
 * and a single paused GSAP timeline registered on window.__timelines —
 * the seekable shape the HyperFrames engine steps through. Scene
 * visibility (cuts + crossfades) is ALSO driven inside the timeline,
 * so a plain `npx hyperframes preview` scrub reproduces exactly what
 * the Remotion interpreter shows.
 *
 * Everything here mirrors the interpreter's semantics:
 *   - initial element state = sampleElementValues(el, frame 0)
 *   - keyframe segment k0→k1 = one tween ending on k1.value with
 *     k1's ease, placed at sceneStartSec + k0.frame/fps
 *   - hold-after-last is implicit (no further tween)
 */

export type HyperframesExport = {
  html: string;
  /** Human-readable translation caveats (springs, fonts, assets). */
  notes: string[];
  /** Local image srcs ("/assets/…") the caller must copy alongside. */
  localAssets: string[];
  stats: { sceneTweens: number; keyframeTweens: number };
};

function slugify(title: string): string {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "motion-doc"
  );
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function sec(frames: number, fps: number): string {
  return (frames / fps).toFixed(4).replace(/\.?0+$/, "") || "0";
}

const ORIGIN_CSS: Record<string, string> = {
  center: "50% 50%",
  left: "0% 50%",
  right: "100% 50%",
  top: "50% 0%",
  bottom: "50% 100%",
};

function elementMarkup(
  element: MotionElement,
  elId: string,
  doc: MotionDoc,
): string {
  if (element.kind === "text") {
    const style = [
      `font-family:${doc.brand.fonts[element.font]}`,
      `font-size:${element.fontSize}px`,
      `font-weight:${element.fontWeight}`,
      `color:${resolveColor(element.color, doc.brand)}`,
      `text-align:${element.align}`,
      `line-height:1.15`,
      element.maxWidth
        ? `width:${element.maxWidth}px;white-space:normal`
        : `white-space:nowrap`,
      element.letterSpacing !== undefined
        ? `letter-spacing:${element.letterSpacing}em`
        : "",
    ]
      .filter(Boolean)
      .join(";");
    return `<div class="el" id="${elId}" style="${style}">${escapeHtml(element.text)}</div>`;
  }
  if (element.kind === "shape") {
    const radius = element.shape === "ellipse" ? "50%" : `${element.radius}px`;
    const style = `width:${element.width}px;height:${element.height}px;background:${resolveColor(element.fill, doc.brand)};border-radius:${radius}`;
    return `<div class="el" id="${elId}" style="${style}"></div>`;
  }
  const src = element.src.startsWith("/")
    ? element.src.replace(/^\/+/, "")
    : element.src;
  const style = `width:${element.width}px;height:${element.height}px;object-fit:${element.fit};border-radius:${element.radius}px`;
  return `<img class="el" id="${elId}" src="${escapeHtml(src)}" style="${style}">`;
}

export function motionDocToHyperframes(doc: MotionDoc): HyperframesExport {
  const notes: string[] = [];
  const localAssets: string[] = [];
  const fps = doc.meta.fps;
  const slug = slugify(doc.meta.title);
  const starts = computeSceneStarts(doc);
  const totalSec = sec(totalDurationInFrames(doc), fps);

  const sceneDivs: string[] = [];
  const setLines: string[] = [];
  const tweenLines: string[] = [];
  let sceneTweens = 0;
  let keyframeTweens = 0;

  doc.scenes.forEach((scene, si) => {
    const sceneId = `scene-${si}`;
    const startSec = sec(starts[si], fps);
    const durSec = sec(scene.durationInFrames, fps);
    const sceneStartS = starts[si] / fps;

    const bg = scene.background
      ? `background:${resolveColor(scene.background, doc.brand)};`
      : "";

    const els = scene.elements
      .map((element, ei) => elementMarkup(element, `s${si}-e${ei}`, doc))
      .join("\n      ");

    /* class="clip" lets the HyperFrames runtime window visibility by
       data-start/duration; the timeline's opacity tweens agree with it
       (and carry the crossfades). */
    sceneDivs.push(
      `    <div class="scene clip" id="${sceneId}" data-start="${startSec}" data-duration="${durSec}" style="${bg}">\n      ${els}\n    </div>`,
    );

    /* --- scene visibility in the timeline (cut / crossfade) --- */
    const inOverlap = si > 0 ? overlapIn(scene, doc.scenes[si - 1]) : 0;
    const next = doc.scenes[si + 1];
    const outOverlap = next ? overlapIn(next, scene) : 0;

    if (si > 0) {
      setLines.push(`  gsap.set("#${sceneId}", { opacity: 0 });`);
      if (scene.transitionIn.type === "crossfade" && inOverlap > 0) {
        tweenLines.push(
          `  tl.to("#${sceneId}", { opacity: 1, duration: ${sec(inOverlap, fps)}, ease: "none" }, ${startSec});`,
        );
      } else {
        tweenLines.push(`  tl.set("#${sceneId}", { opacity: 1 }, ${startSec});`);
      }
      sceneTweens++;
    }
    const endS = sceneStartS + scene.durationInFrames / fps;
    if (next) {
      if (outOverlap > 0) {
        tweenLines.push(
          `  tl.to("#${sceneId}", { opacity: 0, duration: ${sec(outOverlap, fps)}, ease: "none" }, ${(endS - outOverlap / fps).toFixed(4)});`,
        );
      } else {
        tweenLines.push(
          `  tl.set("#${sceneId}", { opacity: 0 }, ${endS.toFixed(4)});`,
        );
      }
      sceneTweens++;
    }

    /* --- elements: base state + keyframe tweens --- */
    scene.elements.forEach((element, ei) => {
      const elSel = `"#s${si}-e${ei}"`;
      const initial = sampleElementValues(element, 0, fps);
      setLines.push(
        `  gsap.set(${elSel}, { x: ${initial.x}, y: ${initial.y}, xPercent: -50, yPercent: -50, scale: ${initial.scale}, rotation: ${initial.rotation}, opacity: ${initial.opacity}, transformOrigin: "${ORIGIN_CSS[element.transformOrigin]}" });`,
      );

      if (element.kind === "image" && element.src.startsWith("/")) {
        localAssets.push(element.src);
      }

      element.tracks.forEach((track) => {
        for (let k = 0; k < track.keyframes.length - 1; k++) {
          const k0 = track.keyframes[k];
          const k1 = track.keyframes[k + 1];
          const duration = sec(k1.frame - k0.frame, fps);
          const at = (sceneStartS + k0.frame / fps).toFixed(4);
          let ease: string;
          if (k1.ease === "spring") {
            ease = springToGsapEase(
              k1.spring ?? { damping: 12, stiffness: 100, mass: 1 },
            );
            notes.push(
              `Spring on ${scene.name} › ${element.name} › ${track.property} approximated as ${ease} (springs are the lossy translation — expect a slightly different settle).`,
            );
          } else {
            ease = GSAP_EASE[k1.ease];
          }
          /* overwrite:"auto" — consecutive segments share exact seam
             times; this keeps the linter and GSAP agreeing on who owns
             the boundary frame. */
          tweenLines.push(
            `  tl.to(${elSel}, { ${track.property}: ${k1.value}, duration: ${duration}, ease: "${ease}", overwrite: "auto" }, ${at});`,
          );
          keyframeTweens++;
        }
      });
    });
  });

  const usesPlex = Object.values(doc.brand.fonts).some((f) =>
    f.includes("IBM Plex"),
  );
  if (usesPlex) {
    notes.push(
      "Brand fonts reference IBM Plex — loaded from Google Fonts in the export, so previews/renders need network access (or swap in local .woff2 files).",
    );
  }
  if (localAssets.length > 0) {
    notes.push(
      `Local images referenced: ${localAssets.join(", ")} — they are copied into the export folder's assets/ directory.`,
    );
  }

  const fontLink = usesPlex
    ? `\n  <link rel="preconnect" href="https://fonts.googleapis.com">\n  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">`
    : "";

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(doc.meta.title)}</title>${fontLink}
  <style>
    html, body { margin: 0; padding: 0; background: #000; }
    #stage {
      position: relative;
      width: ${doc.meta.width}px;
      height: ${doc.meta.height}px;
      overflow: hidden;
      background: ${resolveColor(doc.meta.background, doc.brand)};
    }
    .scene { position: absolute; inset: 0; }
    .el { position: absolute; left: 0; top: 0; }
  </style>
</head>
<body>
  <div id="stage" data-composition-id="${slug}" data-start="0" data-duration="${totalSec}" data-width="${doc.meta.width}" data-height="${doc.meta.height}" data-fps="${fps}">
${sceneDivs.join("\n")}
  </div>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
  <script>
  /* Exported from Motion Lab — "${escapeHtml(doc.meta.title)}" (${doc.meta.width}x${doc.meta.height} @ ${fps}fps). */
  const tl = gsap.timeline({ paused: true });
${setLines.join("\n")}
${tweenLines.join("\n")}
  window.__timelines = window.__timelines || {};
  window.__timelines["${slug}"] = tl;
  </script>
</body>
</html>
`;

  return { html, notes: [...new Set(notes)], localAssets, stats: { sceneTweens, keyframeTweens } };
}
