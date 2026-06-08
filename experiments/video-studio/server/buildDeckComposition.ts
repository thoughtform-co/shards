import type { DeckScenePlan, ExplainerScene } from "@/experiments/video-studio/deck-scene-plan";

export type MotionPreset = "calm" | "kinetic";

export type BuildDeckCompositionOptions = {
  motionPreset?: MotionPreset;
  styleIntent?: string;
  width?: number;
  height?: number;
};

export type BuildDeckCompositionResult = {
  html: string;
  durationSeconds: number;
  textColor: string;
  width: number;
  height: number;
};

const SCENE_OVERLAP_SECONDS = 0.4;

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/** sRGB relative luminance per WCAG. Used to pick a legible text color
    against whatever background the analysis step picked. */
function relativeLuminance(hex: string): number {
  const cleaned = hex.replace(/^#/, "").trim();
  const expanded =
    cleaned.length === 3
      ? cleaned
          .split("")
          .map((c) => c + c)
          .join("")
      : cleaned;

  const match = expanded.match(/^[0-9a-fA-F]{6}$/);
  if (!match) {
    return 0.05;
  }

  const channels = [0, 2, 4].map((offset) => {
    const value = parseInt(expanded.slice(offset, offset + 2), 16) / 255;
    return value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * channels[0]! + 0.7152 * channels[1]! + 0.0722 * channels[2]!;
}

function pickTextColor(backgroundColor: string) {
  const luminance = relativeLuminance(backgroundColor);
  // Threshold 0.45 (slightly under 0.5) leans toward dark text on
  // mid-tone backgrounds, which reads better than near-white text on
  // a dusty olive or warm beige.
  return luminance > 0.45 ? "#0F0E0C" : "#F5F0E8";
}

function pickMutedColor(backgroundColor: string, textColor: string) {
  // 70% mix of text color toward background.
  const txt = parseHex(textColor);
  const bg = parseHex(backgroundColor);
  if (!txt || !bg) {
    return textColor;
  }
  const mix = (a: number, b: number) => Math.round(a * 0.72 + b * 0.28);
  return rgbToHex(mix(txt.r, bg.r), mix(txt.g, bg.g), mix(txt.b, bg.b));
}

function parseHex(hex: string): { r: number; g: number; b: number } | null {
  const cleaned = hex.replace(/^#/, "").trim();
  const expanded =
    cleaned.length === 3
      ? cleaned
          .split("")
          .map((c) => c + c)
          .join("")
      : cleaned;
  if (!/^[0-9a-fA-F]{6}$/.test(expanded)) {
    return null;
  }
  return {
    r: parseInt(expanded.slice(0, 2), 16),
    g: parseInt(expanded.slice(2, 4), 16),
    b: parseInt(expanded.slice(4, 6), 16),
  };
}

function rgbToHex(r: number, g: number, b: number) {
  return (
    "#" +
    [r, g, b]
      .map((value) => Math.max(0, Math.min(255, value)).toString(16).padStart(2, "0"))
      .join("")
  );
}

type MotionTokens = {
  eyebrowDuration: number;
  headlineDuration: number;
  bulletDuration: number;
  bulletStagger: number;
  crossFadeDuration: number;
  eyebrowEase: string;
  headlineEase: string;
  bulletEase: string;
  headlineRise: number;
  bulletShift: number;
};

function motionTokensFor(preset: MotionPreset): MotionTokens {
  if (preset === "kinetic") {
    return {
      eyebrowDuration: 0.4,
      headlineDuration: 0.5,
      bulletDuration: 0.4,
      bulletStagger: 0.08,
      crossFadeDuration: 0.35,
      eyebrowEase: "expo.out",
      headlineEase: "back.out(1.4)",
      bulletEase: "power3.out",
      headlineRise: 28,
      bulletShift: 24,
    };
  }
  return {
    eyebrowDuration: 0.55,
    headlineDuration: 0.8,
    bulletDuration: 0.55,
    bulletStagger: 0.12,
    crossFadeDuration: 0.45,
    eyebrowEase: "power2.out",
    headlineEase: "power3.out",
    bulletEase: "power2.out",
    headlineRise: 44,
    bulletShift: 36,
  };
}

function num(value: number, digits = 2) {
  // Stable serialization for JS literals — avoid trailing zeros and locale.
  const fixed = value.toFixed(digits);
  return fixed.replace(/\.?0+$/, "") || "0";
}

function renderSceneSection(
  scene: ExplainerScene,
  index: number,
  startSeconds: number,
  clipDurationSeconds: number,
  brandName: string,
  totalScenes: number,
  accentColor: string,
) {
  const eyebrow = `${brandName.toUpperCase()} · ${String(index + 1).padStart(2, "0")} / ${String(
    totalScenes,
  ).padStart(2, "0")}`;

  const bullets = scene.bullets
    .map(
      (bullet, bulletIndex) => `
        <li class="vs-deck__bullet" id="vs-bullet-${index}-${bulletIndex}">
          <span class="vs-deck__bullet-marker" aria-hidden="true"></span>
          <p class="vs-deck__bullet-text">${escapeHtml(bullet)}</p>
        </li>`,
    )
    .join("");

  return `
    <section
      id="vs-scene-${index}"
      class="vs-deck__scene clip"
      data-start="${num(startSeconds)}"
      data-duration="${num(clipDurationSeconds)}"
      data-track-index="${index + 1}"
      style="z-index: ${10 + index};"
    >
      <span class="vs-deck__rail" aria-hidden="true" style="background:${accentColor};"></span>
      <p class="vs-deck__eyebrow" id="vs-eyebrow-${index}" style="color:${accentColor};">${escapeHtml(eyebrow)}</p>
      <h1 class="vs-deck__headline" id="vs-headline-${index}">${escapeHtml(scene.headline)}</h1>
      <ul class="vs-deck__bullets" id="vs-bullets-${index}">${bullets}
      </ul>
      <span class="vs-deck__pagination" aria-hidden="true">${String(index + 1).padStart(2, "0")}/${String(totalScenes).padStart(2, "0")}</span>
    </section>`;
}

function renderSceneTimeline(
  scenes: ExplainerScene[],
  motion: MotionTokens,
): string {
  const lines: string[] = [];
  let cursor = 0;

  scenes.forEach((scene, index) => {
    const sceneStart = cursor;
    const isFirst = index === 0;
    const isLast = index === scenes.length - 1;

    // Scene root cross-fade (skipped for the first scene since there's no
    // outgoing scene to fade from).
    if (!isFirst) {
      lines.push(
        `    tl.from("#vs-scene-${index}", { opacity: 0, duration: ${num(motion.crossFadeDuration)}, ease: "${motion.eyebrowEase}" }, ${num(sceneStart)});`,
      );
    }

    const eyebrowOffset = isFirst ? 0.2 : sceneStart + 0.15;
    const headlineOffset = isFirst ? 0.35 : sceneStart + 0.3;
    const bulletsOffset = isFirst ? 0.6 : sceneStart + 0.5;

    lines.push(
      `    tl.from("#vs-eyebrow-${index}", { opacity: 0, y: 18, duration: ${num(motion.eyebrowDuration)}, ease: "${motion.eyebrowEase}" }, ${num(eyebrowOffset)});`,
    );
    lines.push(
      `    tl.from("#vs-headline-${index}", { opacity: 0, y: ${num(motion.headlineRise, 0)}, duration: ${num(motion.headlineDuration)}, ease: "${motion.headlineEase}" }, ${num(headlineOffset)});`,
    );
    if (scene.bullets.length > 0) {
      lines.push(
        `    tl.from("#vs-bullets-${index} .vs-deck__bullet", { opacity: 0, x: -${num(motion.bulletShift, 0)}, duration: ${num(motion.bulletDuration)}, ease: "${motion.bulletEase}", stagger: ${num(motion.bulletStagger)} }, ${num(bulletsOffset)});`,
      );
    }

    // Final-scene fade-out is the only allowed exit anim (per HyperFrames
    // scene-transition rules in .agents/skills/hyperframes/SKILL.md).
    if (isLast) {
      const fadeStart = sceneStart + scene.durationSeconds - 0.6;
      lines.push(
        `    tl.to("#vs-scene-${index}", { opacity: 0, duration: 0.5, ease: "power2.in" }, ${num(fadeStart)});`,
      );
    }

    cursor += scene.durationSeconds;
  });

  return lines.join("\n");
}

export function buildDeckComposition(
  plan: DeckScenePlan,
  options: BuildDeckCompositionOptions = {},
): BuildDeckCompositionResult {
  const motion = motionTokensFor(options.motionPreset ?? "calm");
  const width = options.width ?? 1920;
  const height = options.height ?? 1080;
  const textColor = pickTextColor(plan.backgroundColor);
  const mutedTextColor = pickMutedColor(plan.backgroundColor, textColor);
  const accentColor = plan.accentColor;
  const styleIntent = options.styleIntent?.trim() ?? "";

  const scenes = plan.scenes;
  if (scenes.length === 0) {
    throw new Error("Cannot build a deck composition with zero scenes.");
  }

  // Each scene's clip duration extends through the next scene's cross-fade
  // so the outgoing scene stays visible underneath while the incoming one
  // fades in. Last scene gets no extension.
  let cursor = 0;
  const sceneSections: string[] = [];
  scenes.forEach((scene, index) => {
    const isLast = index === scenes.length - 1;
    const clipDuration = isLast
      ? scene.durationSeconds
      : scene.durationSeconds + SCENE_OVERLAP_SECONDS;

    sceneSections.push(
      renderSceneSection(
        scene,
        index,
        cursor,
        clipDuration,
        plan.brandName,
        scenes.length,
        accentColor,
      ),
    );
    cursor += scene.durationSeconds;
  });

  const totalDurationSeconds = cursor;
  const timelineLines = renderSceneTimeline(scenes, motion);

  // Headline scale roughly tracks the canvas height so 1080p and 1920x1080
  // alike stay legible. Tuned to the 60px+ minimum HyperFrames recommends
  // for rendered video.
  const headlineFontPx = Math.round(height * 0.1);
  const bulletFontPx = Math.max(28, Math.round(height * 0.034));
  const eyebrowFontPx = Math.max(20, Math.round(height * 0.022));

  const intentComment = styleIntent
    ? `\n    <!-- Style intent (deterministic baseline ignores free-form direction): ${escapeHtml(styleIntent).slice(0, 200)} -->\n`
    : "";

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(plan.title)}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      width: 100%;
      height: 100%;
      background: ${plan.backgroundColor};
    }
    body {
      color: ${textColor};
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      overflow: hidden;
    }
    .vs-deck__scene {
      position: absolute;
      inset: 0;
      padding: ${Math.round(height * 0.09)}px ${Math.round(width * 0.07)}px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: ${Math.round(height * 0.045)}px;
      /* Opaque background so scene N+1 fully covers scene N when it
         finishes its cross-fade. Without this, scenes stack
         transparently and all the text bleeds through. */
      background: ${plan.backgroundColor};
    }
    .vs-deck__rail {
      position: absolute;
      left: ${Math.round(width * 0.04)}px;
      top: ${Math.round(height * 0.09)}px;
      bottom: ${Math.round(height * 0.09)}px;
      width: 2px;
      opacity: 0.55;
    }
    .vs-deck__eyebrow {
      font-family: ui-monospace, 'JetBrains Mono', monospace;
      font-size: ${eyebrowFontPx}px;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      font-weight: 500;
    }
    .vs-deck__headline {
      font-size: ${headlineFontPx}px;
      line-height: 0.98;
      letter-spacing: -0.01em;
      font-weight: 600;
      max-width: ${Math.round(width * 0.78)}px;
      color: ${textColor};
    }
    .vs-deck__bullets {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: ${Math.round(height * 0.025)}px;
      max-width: ${Math.round(width * 0.7)}px;
    }
    .vs-deck__bullet {
      display: flex;
      align-items: flex-start;
      gap: ${Math.round(width * 0.012)}px;
    }
    .vs-deck__bullet-marker {
      width: ${Math.round(eyebrowFontPx * 0.55)}px;
      height: ${Math.round(eyebrowFontPx * 0.55)}px;
      background: ${accentColor};
      flex-shrink: 0;
      margin-top: ${Math.round(bulletFontPx * 0.55)}px;
    }
    .vs-deck__bullet-text {
      font-size: ${bulletFontPx}px;
      line-height: 1.4;
      font-weight: 400;
      color: ${textColor};
    }
    .vs-deck__pagination {
      position: absolute;
      right: ${Math.round(width * 0.04)}px;
      bottom: ${Math.round(height * 0.05)}px;
      font-family: ui-monospace, 'JetBrains Mono', monospace;
      font-size: ${eyebrowFontPx}px;
      letter-spacing: 0.18em;
      color: ${mutedTextColor};
    }
  </style>
</head>
<body>${intentComment}
  <div
    id="stage"
    data-composition-id="deck-explainer-series"
    data-start="0"
    data-width="${width}"
    data-height="${height}"
  >
${sceneSections.join("\n")}

    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <script>
      const tl = gsap.timeline({ paused: true });
${timelineLines}
      window.__timelines = window.__timelines || {};
      window.__timelines["deck-explainer-series"] = tl;
    </script>
  </div>
</body>
</html>
`;

  return {
    html,
    durationSeconds: totalDurationSeconds,
    textColor,
    width,
    height,
  };
}
