import { readFile } from "node:fs/promises";
import path from "node:path";
import Anthropic from "@anthropic-ai/sdk";
import {
  compileRemotionComposition,
  type CompileResult,
} from "@/experiments/video-studio/server/compileRemotionComposition";
import {
  scenePlanSchema,
  type DeckScenePlan,
} from "@/experiments/video-studio/deck-scene-plan";
import { env } from "@/lib/env";

export type RemotionMotionPreset = "calm" | "kinetic";

export type AnimateDeckRemotionOptions = {
  scenePlan: DeckScenePlan;
  motionPreset?: RemotionMotionPreset;
  styleIntent?: string;
  /** Optional brand cheat sheet (DESIGN.md). When present, pasted into the
      Claude prompt so authored Remotion TSX honors brand color/type/voice. */
  designMd?: string;
  sessionId: string;
  onProgress?: (progress: number, message: string) => void;
};

export type AnimateDeckRemotionResult = {
  sessionId: string;
  source: "agent" | "fallback";
  durationSeconds: number;
};

export { scenePlanSchema };

/* Distilled Remotion authoring rules. We deliberately constrain Claude
   to a small palette of Remotion APIs the studio knows how to handle,
   and we DEMAND per-scene motion variety so the deck doesn't feel
   like the same fade repeated four times. */
const SYSTEM_PROMPT = `You are a Remotion composition author. Output a single complete TSX file and nothing else — no commentary, no markdown fences.

HARD RULES (non-negotiable):

1. The very first character of your reply must be \`i\` (start with \`import\`). No markdown, no prose.
2. Imports: only from "remotion". Allowed names: \`AbsoluteFill\`, \`Sequence\`, \`Series\`, \`interpolate\`, \`interpolateColors\`, \`spring\`, \`useCurrentFrame\`, \`useVideoConfig\`, \`Easing\`. Do NOT import React directly — JSX uses the automatic runtime.
3. Default-export a single function component. Props shape:
   \`\`\`ts
   type Scene = { headline: string; bullets: string[]; durationSeconds: number };
   type Props = { title: string; brandName: string; accentColor: string; backgroundColor: string; scenes: Scene[] };
   \`\`\`
4. The component returns one \`<AbsoluteFill style={{ background: props.backgroundColor }}>\` containing one \`<Sequence>\` per scene. Compute each scene's \`durationInFrames\` from \`scene.durationSeconds * fps\` (use \`useVideoConfig()\`), and \`from\` = sum of previous scene durations in frames.
5. Inside each \`<Sequence>\`, render a scene component that uses \`useCurrentFrame()\` and \`useVideoConfig()\` for all motion. Drive every animated value with \`interpolate(frame, [a, b], [from, to], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })\` or \`spring({ frame: frame - delay, fps, config: { damping, stiffness } })\`.
6. PER-SCENE MOTION VARIETY IS REQUIRED. Pick a DIFFERENT motion DNA per scene from this menu (cycle if more scenes than DNAs):
   - Editorial: hairline accent rule draws in (scaleX), eyebrow fades, headline rises with a spring, bullets stagger with a small horizontal slide. Restrained, designed.
   - Kinetic: per-word headline reveal (split on whitespace, stagger each word with a spring + slight scale), a thick diagonal accent wipe behind the headline via clip-path interpolation, bullets slam in from below with overshoot.
   - Layered: radial accent gradient that breathes (sin-wave alpha), a large geometric shape drifting across in the background (translate over the full scene duration), headline blur-fades in (CSS filter: blur), bullets pop with a small rotation.
   - Typewriter: headline reveals character-by-character via \`scene.headline.slice(0, n)\` where n is an interpolated count, a mono cursor blinks, bullets fade in straight.
   - Numerical: huge oversized scene index (e.g. "01") looms in behind the headline at 30% opacity, headline fades + rises, bullets are listed with sequence numbers in mono.
   Do NOT repeat the SAME DNA for consecutive scenes.
7. Typography for 1080p video: headlines 90-130px, bullets 28-38px, eyebrow/labels 18-24px. Use system fonts: \`Inter, system-ui, -apple-system, sans-serif\` for body, \`ui-monospace, 'JetBrains Mono', monospace\` for labels/eyebrows.
8. Contrast: text must be legible against the backgroundColor. If the background is light, use dark text (\`#0F0E0C\`); if dark, use cream (\`#F5F0E8\`). Eyeball it from the hex — do not output low-contrast text.
9. Determinism: NO \`Math.random()\`, \`Date.now()\`, \`setTimeout\`, \`setInterval\`, \`async\`, or \`await\`. Compute everything from \`frame\` and \`fps\`.
10. NO assets: no \`staticFile\`, no images, no audio. Pure layout + motion.

The user will pass the scene plan, optional style intent, and a motion energy ('calm' = longer eases / restrained DNAs; 'kinetic' = tighter springs / louder DNAs). Honor all three. Style intent shapes which DNAs you reach for; motion energy controls spring damping/stiffness and durations.`;

function extractTsx(text: string): string {
  // Strip optional markdown fences if Claude ignores the no-markdown rule.
  let body = text.trim();
  body = body.replace(/^```(?:tsx|typescript|jsx|javascript)?\s*/i, "");
  body = body.replace(/```\s*$/i, "");
  // Trim everything before the first `import` to drop any leading prose.
  const importIdx = body.indexOf("import");
  if (importIdx > 0) {
    body = body.slice(importIdx);
  }
  return body.trim();
}

function buildDesignSystemBlock(designMd: string): string[] {
  const trimmed = designMd.trim();
  if (!trimmed) return [];
  return [
    "",
    "DESIGN SYSTEM (baseline — honor these tokens):",
    "```md",
    trimmed,
    "```",
    "These tokens are the FLOOR for color/type/voice. The scene plan above wins on copy + duration; the design system wins on look + feel. If the design system specifies fonts, palette tiers, or motifs, use them.",
  ];
}

function buildUserPrompt(
  plan: DeckScenePlan,
  motionPreset: RemotionMotionPreset,
  styleIntent: string,
  designMd: string,
): string {
  const planJson = JSON.stringify(
    {
      title: plan.title,
      brandName: plan.brandName,
      accentColor: plan.accentColor,
      backgroundColor: plan.backgroundColor,
      scenes: plan.scenes.map((s) => ({
        headline: s.headline,
        bullets: s.bullets,
        durationSeconds: s.durationSeconds,
      })),
    },
    null,
    2,
  );

  const intent = styleIntent.trim()
    ? `Style intent (free-form direction from the user): ${styleIntent.trim()}`
    : "Style intent: (none — pick a tasteful editorial-meets-kinetic baseline that varies per scene)";

  return [
    `Canvas: 1920x1080. FPS: 30.`,
    `Motion energy: ${motionPreset}.`,
    intent,
    "",
    "Scene plan:",
    "```json",
    planJson,
    "```",
    ...buildDesignSystemBlock(designMd),
    "",
    "Author the complete Remotion TSX. Output starts with `import` and ends with `}` of the default-exported component. No markdown.",
  ].join("\n");
}

function buildFixUserPrompt(
  plan: DeckScenePlan,
  motionPreset: RemotionMotionPreset,
  styleIntent: string,
  designMd: string,
  previousTsx: string,
  compileError: string,
): string {
  return [
    "The previous TSX failed to compile with esbuild. Output a corrected complete TSX file that keeps the same scene content and design intent but fixes the reported issues.",
    "",
    `Canvas: 1920x1080. FPS: 30. Motion energy: ${motionPreset}.`,
    styleIntent.trim() ? `Style intent: ${styleIntent.trim()}` : "Style intent: editorial-meets-kinetic baseline.",
    "",
    "Scene plan (unchanged):",
    "```json",
    JSON.stringify(plan, null, 2),
    "```",
    ...buildDesignSystemBlock(designMd),
    "",
    "esbuild errors:",
    "```",
    compileError.slice(0, 3000),
    "```",
    "",
    "Previous TSX:",
    "```tsx",
    previousTsx.slice(0, 6000),
    "```",
    "",
    "Output the corrected TSX only. No markdown.",
  ].join("\n");
}

async function callClaude(
  apiKey: string,
  systemPrompt: string,
  userMessage: string,
): Promise<string> {
  const anthropic = new Anthropic({ apiKey });

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 8000,
    temperature: 0.5,
    system: systemPrompt,
    messages: [
      { role: "user", content: [{ type: "text", text: userMessage }] },
    ],
  });

  const block = message.content.find((entry) => entry.type === "text");
  return extractTsx(block?.text ?? "");
}

async function attemptAgent(
  apiKey: string,
  options: AnimateDeckRemotionOptions,
): Promise<{ result: CompileResult; tsx: string } | null> {
  const motionPreset = options.motionPreset ?? "calm";
  const styleIntent = options.styleIntent ?? "";
  const designMd = options.designMd ?? "";
  const onProgress = options.onProgress;

  onProgress?.(0.1, "Calling Claude (attempt 1)…");

  let tsx: string;
  try {
    tsx = await callClaude(
      apiKey,
      SYSTEM_PROMPT,
      buildUserPrompt(options.scenePlan, motionPreset, styleIntent, designMd),
    );
  } catch (error) {
    console.warn("[animateDeckRemotion] First Claude call failed:", error);
    return null;
  }

  if (!tsx || !tsx.includes("export default")) {
    return null;
  }

  onProgress?.(0.45, "Compiling agent composition…");
  let result = await compileRemotionComposition({
    tsxSource: tsx,
    sessionId: options.sessionId,
  });

  if (result.ok) {
    return { result, tsx };
  }

  onProgress?.(0.6, "Re-prompting agent with compile errors…");

  let fixedTsx: string;
  try {
    fixedTsx = await callClaude(
      apiKey,
      SYSTEM_PROMPT,
      buildFixUserPrompt(
        options.scenePlan,
        motionPreset,
        styleIntent,
        designMd,
        tsx,
        result.error,
      ),
    );
  } catch (error) {
    console.warn("[animateDeckRemotion] Fix-loop Claude call failed:", error);
    return null;
  }

  if (!fixedTsx || !fixedTsx.includes("export default")) {
    return null;
  }

  onProgress?.(0.85, "Validating fixed composition…");
  result = await compileRemotionComposition({
    tsxSource: fixedTsx,
    sessionId: options.sessionId,
  });

  if (result.ok) {
    return { result, tsx: fixedTsx };
  }

  console.warn(
    "[animateDeckRemotion] Agent fix-loop failed:",
    result.error.slice(0, 500),
  );
  return null;
}

async function loadFallbackSource(): Promise<string> {
  // Read the hand-coded fallback TSX as a raw string so we can feed it
  // through the same compiler the agent uses.
  const fallbackPath = path.join(
    process.cwd(),
    "experiments",
    "video-studio",
    "server",
    "agentDeckFallback.tsx",
  );
  return readFile(fallbackPath, "utf8");
}

export async function animateDeckRemotion(
  options: AnimateDeckRemotionOptions,
): Promise<AnimateDeckRemotionResult> {
  const { onProgress } = options;
  const apiKey = env().ANTHROPIC_API_KEY;

  onProgress?.(0.04, "Preparing scene plan…");
  const plan = scenePlanSchema.parse(options.scenePlan);
  const totalDuration = plan.scenes.reduce(
    (sum, s) => sum + s.durationSeconds,
    0,
  );

  let source: "agent" | "fallback" = "fallback";

  if (apiKey) {
    const agentOutcome = await attemptAgent(apiKey, { ...options, scenePlan: plan });
    if (agentOutcome?.result.ok) {
      source = "agent";
    }
  } else {
    onProgress?.(0.3, "No ANTHROPIC_API_KEY — using hand-coded composition…");
  }

  if (source === "fallback") {
    onProgress?.(0.85, "Compiling deterministic composition…");
    const fallbackTsx = await loadFallbackSource();
    const fallbackResult = await compileRemotionComposition({
      tsxSource: fallbackTsx,
      sessionId: options.sessionId,
    });
    if (!fallbackResult.ok) {
      throw new Error(
        `Both agent and fallback failed to compile. Fallback error: ${fallbackResult.error.slice(0, 400)}`,
      );
    }
  }

  onProgress?.(1, "Composition ready");

  return {
    sessionId: options.sessionId,
    source,
    durationSeconds: totalDuration,
  };
}
