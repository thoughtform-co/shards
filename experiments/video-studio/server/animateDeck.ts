import Anthropic from "@anthropic-ai/sdk";
import {
  buildDeckComposition,
  type MotionPreset,
} from "@/experiments/video-studio/server/buildDeckComposition";
import {
  deckProjectDir,
  lintHyperframesProject,
  prepareHyperframesProjectFromHtml,
  writeDeckDraft,
} from "@/experiments/video-studio/server/renderHyperframes";
import { scenePlanSchema, type DeckScenePlan } from "@/experiments/video-studio/deck-scene-plan";
import { env } from "@/lib/env";

const DECK_TEMPLATE_ID = "deck-explainer-series";
const DECK_WIDTH = 1920;
const DECK_HEIGHT = 1080;

export type AnimateDeckOptions = {
  scenePlan: DeckScenePlan;
  motionPreset?: MotionPreset;
  styleIntent?: string;
  sessionId: string;
  onProgress?: (progress: number, message: string) => void;
};

export type AnimateDeckResult = {
  sessionId: string;
  source: "agent" | "fallback";
  durationSeconds: number;
};

export { scenePlanSchema };

/* Distilled HyperFrames authoring rules. Lifted from
   `.agents/skills/hyperframes/SKILL.md` non-negotiables — only the rules
   that are likely to be violated by an LLM writing fresh HTML. Long-form
   guidance (motion principles, transition catalogs) is intentionally
   omitted to keep the prompt tight. */
const SYSTEM_PROMPT = `You are a HyperFrames composition author. You output a single complete HTML document and nothing else — no commentary, no markdown fences.

HARD RULES (non-negotiable):

1. Output a full \`<!doctype html>\` document. The very first character of your reply must be \`<\`. Do not wrap in markdown.
2. Document structure:
   - \`<head>\` declares the title and a \`<style>\` block with all CSS.
   - \`<body>\` contains exactly one root composition: \`<div id="stage" data-composition-id="deck-explainer-series" data-start="0" data-width="${DECK_WIDTH}" data-height="${DECK_HEIGHT}">\`.
3. Each scene is a child of the stage with: \`class="... clip"\`, a unique \`id\`, \`data-start\` (seconds), \`data-duration\` (seconds), and a unique \`data-track-index\` integer. Same-track clips MUST NOT overlap; give every scene a distinct track index.
4. Scenes sequence in time. Scene N starts at \`sum(durations[0..N-1])\`. Allow ~0.4s overlap between scenes for cross-fades — extend each non-final scene's \`data-duration\` by 0.4s past its visible duration so the next scene fades in over it.
5. Animations:
   - Single GSAP timeline: \`const tl = gsap.timeline({ paused: true });\`. Register it: \`window.__timelines = window.__timelines || {}; window.__timelines["deck-explainer-series"] = tl;\`.
   - CRITICAL: every entrance tween MUST be added to the timeline as \`tl.from(target, vars, timeOffsetSeconds)\` — NOT \`gsap.from(...)\`. Using top-level \`gsap.from(...)\` creates standalone tweens that fire on page load instead of being scrubbed by the timeline, which breaks scene-by-scene sequencing entirely. Every animation belongs on \`tl\`.
   - LAYOUT BEFORE ANIMATION: every element's CSS describes its visible-at-rest state — full opacity, on-screen position, normal scale. Do NOT set \`opacity: 0\` or off-screen transforms in CSS as a starting state for tweens. The resting CSS IS the destination.
   - Use \`tl.from(target, { ..., duration, ease }, timeOffset)\` for EVERY entrance tween. \`from()\` animates FROM the supplied values TO the resting CSS state, scrubbed by the timeline.
   - Cross-fades between scenes: animate scene N+1's root via \`tl.from("#scene-N+1", { opacity: 0, duration: 0.4, ease: "..." }, sceneStartTime)\` — NOT a \`tl.to()\` that fades in from a CSS-zero state, and NOT a top-level \`gsap.from(...)\`.
   - Worked example for a 2-scene 10s deck:
     \`\`\`js
     const tl = gsap.timeline({ paused: true });
     // Scene 1 (0–5s) — entrances offset 0.2–0.8s
     tl.from("#scene-1 .eyebrow",  { opacity: 0, y: 18, duration: 0.5, ease: "power2.out" }, 0.2);
     tl.from("#scene-1 .headline", { opacity: 0, y: 40, duration: 0.7, ease: "power3.out" }, 0.4);
     tl.from("#scene-1 .bullet",   { opacity: 0, x: -30, duration: 0.5, ease: "power2.out", stagger: 0.12 }, 0.7);
     // Scene 2 (5–10s) — cross-fade scene root + offset element entrances
     tl.from("#scene-2",           { opacity: 0, duration: 0.4, ease: "power2.out" }, 5);
     tl.from("#scene-2 .eyebrow",  { opacity: 0, y: 18, duration: 0.5, ease: "expo.out" }, 5.2);
     tl.from("#scene-2 .headline", { opacity: 0, y: 40, duration: 0.7, ease: "back.out(1.2)" }, 5.4);
     // Final scene only: optional fade to black
     tl.to("#scene-2", { opacity: 0, duration: 0.5, ease: "power2.in" }, 9.5);
     window.__timelines = window.__timelines || {};
     window.__timelines["deck-explainer-series"] = tl;
     \`\`\`
   - NO exit animations EXCEPT the final scene (which may fade to black via \`tl.to()\` near the end).
   - Animate ONLY visual properties: opacity, x, y, scale, rotation, color, backgroundColor, transforms. Never animate visibility, display, width, height, or call \`play()\`/\`pause()\` on media.
   - Offset entrances 0.1-0.3s past scene start. Vary eases across tweens (use at least 3 different eases per scene).
   - Determinism: NO \`Math.random()\`, \`Date.now()\`, \`setTimeout\`, \`async\`, or \`await\`. Build the timeline synchronously.
   - NO \`repeat: -1\` — calculate finite repeat counts.
6. Layout: every scene's content container fills the canvas — \`position: absolute; inset: 0; padding: ...; display: flex\`. Use padding to push content inward, not absolute positioning of inner content.
6a. CRITICAL — Scene stacking: scenes are positioned with \`inset: 0\` and stacked in DOM order, so the LAST scene visually renders on top. The clip framework does NOT auto-hide previous scenes; you must make each scene OPAQUE so the next one fully covers it. Every scene container's CSS MUST include \`background: <plan.backgroundColor>\` (the same value as html/body bg) AND a \`z-index\` that increases per scene (e.g. scene 1 z-index 1, scene 2 z-index 2, ..., scene N z-index N). Combined with the \`tl.from("#scene-N", { opacity: 0, duration: 0.4 }, sceneStartTime)\` cross-fade, scene N+1 properly covers scene N once it reaches full opacity.
7. Typography for 1080p video:
   - Headlines: at least 60px (aim 96-130px). Body bullets: 28-40px. Eyebrow/labels: 18-24px.
   - Use system fonts: \`'Inter', system-ui, -apple-system, sans-serif\` for body and \`ui-monospace, 'JetBrains Mono', monospace\` for labels/eyebrows.
8. Contrast: text MUST be legible against its background. If the background is light, use dark text (\`#0F0E0C\`). If dark, use cream (\`#F5F0E8\`). Compute or eyeball; do not output cream text on a near-white background.
8a. Background coverage: set the brand background on BOTH \`html\` and \`body\` (e.g. \`html, body { background: #...; height: 100%; }\`) so the composition iframe never bleeds default white through. This is non-negotiable.
9. Use exactly this GSAP CDN script: \`<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>\`. Place the timeline script AFTER the GSAP script.
10. Do not include \`<br>\` for forced line breaks — use \`max-width\` and let text wrap.

USE THE PROVIDED DESIGN TOKENS as design constraints, not suggestions. Brand color shows up as accent rules, marker dots, and eyebrow text. Background fills the body. Text uses the contrast-safe color you pick.

The user will give you a scene plan as JSON plus optional free-form style intent and a motion energy ('calm' or 'kinetic'). Honor all three. Calm = longer eases (0.6-1s), more breathing room. Kinetic = tight tweens (0.35-0.55s), snappier transitions, optional scale-in or back-out eases on headlines.`;

function extractHtml(text: string): string {
  const startMatch = text.match(/<!doctype html/i);
  const start = startMatch?.index ?? -1;
  if (start === -1) {
    return text.trim();
  }
  const tail = text.slice(start);
  const endIndex = tail.toLowerCase().lastIndexOf("</html>");
  if (endIndex === -1) {
    return tail;
  }
  return tail.slice(0, endIndex + "</html>".length);
}

function summarizeLintOutput(stdout: string, stderr: string): string {
  const combined = `${stderr}\n${stdout}`.trim();
  // Trim to ~3000 chars so re-prompts stay small.
  if (combined.length <= 3000) {
    return combined;
  }
  return `${combined.slice(0, 1500)}\n[…trimmed…]\n${combined.slice(-1200)}`;
}

function buildUserPrompt(
  plan: DeckScenePlan,
  motionPreset: MotionPreset,
  styleIntent: string,
): string {
  const planJson = JSON.stringify(
    {
      title: plan.title,
      brandName: plan.brandName,
      accentColor: plan.accentColor,
      backgroundColor: plan.backgroundColor,
      scenes: plan.scenes.map((scene) => ({
        headline: scene.headline,
        bullets: scene.bullets,
        durationSeconds: scene.durationSeconds,
      })),
    },
    null,
    2,
  );

  const intentLine = styleIntent.trim()
    ? `Style intent (free-form direction from the user): ${styleIntent.trim()}`
    : "Style intent: (none — choose a tasteful editorial baseline)";

  return [
    `Canvas: ${DECK_WIDTH}x${DECK_HEIGHT}.`,
    `Motion energy: ${motionPreset}.`,
    intentLine,
    "",
    "Scene plan:",
    "```json",
    planJson,
    "```",
    "",
    "Author the complete HTML composition. Output the document only — no markdown, no prose.",
  ].join("\n");
}

function buildFixUserPrompt(
  plan: DeckScenePlan,
  motionPreset: MotionPreset,
  styleIntent: string,
  previousHtml: string,
  lintOutput: string,
): string {
  return [
    "The previous HTML failed `npx hyperframes lint`. Output a corrected complete HTML document that fixes the reported issues while keeping the same scene content and design intent.",
    "",
    `Canvas: ${DECK_WIDTH}x${DECK_HEIGHT}. Motion energy: ${motionPreset}.`,
    styleIntent.trim() ? `Style intent: ${styleIntent.trim()}` : "Style intent: editorial baseline.",
    "",
    "Scene plan (unchanged):",
    "```json",
    JSON.stringify(plan, null, 2),
    "```",
    "",
    "Lint output:",
    "```",
    lintOutput,
    "```",
    "",
    "Previous HTML:",
    "```html",
    previousHtml,
    "```",
    "",
    "Output the corrected document only — no markdown, no prose.",
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
    temperature: 0.3,
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content: [{ type: "text", text: userMessage }],
      },
    ],
  });

  const block = message.content.find((entry) => entry.type === "text");
  return extractHtml(block?.text ?? "");
}

async function attemptAgentAuthoring(
  apiKey: string,
  options: AnimateDeckOptions,
): Promise<{ html: string; source: "agent"; lintFailures: number } | null> {
  const motionPreset = options.motionPreset ?? "calm";
  const styleIntent = options.styleIntent ?? "";
  const sessionId = options.sessionId;
  const reportProgress = options.onProgress;

  reportProgress?.(0.1, "Calling Claude (attempt 1)…");

  let html: string;
  try {
    html = await callClaude(
      apiKey,
      SYSTEM_PROMPT,
      buildUserPrompt(options.scenePlan, motionPreset, styleIntent),
    );
  } catch (error) {
    console.warn("[animateDeck] First Claude call failed:", error);
    return null;
  }

  if (!html || !html.toLowerCase().includes("</html>")) {
    return null;
  }

  await prepareHyperframesProjectFromHtml({
    templateId: DECK_TEMPLATE_ID,
    sessionId,
    html,
    projectName: `Deck explainer · agent · ${sessionId}`,
  });

  reportProgress?.(0.55, "Linting agent composition");
  let lintResult = await lintHyperframesProject(deckProjectDir(sessionId));

  if (lintResult.exitCode === 0) {
    return { html, source: "agent", lintFailures: 0 };
  }

  // One retry — feed the lint output back to Claude.
  reportProgress?.(0.65, "Re-prompting agent with lint errors…");
  let fixedHtml: string;
  try {
    fixedHtml = await callClaude(
      apiKey,
      SYSTEM_PROMPT,
      buildFixUserPrompt(
        options.scenePlan,
        motionPreset,
        styleIntent,
        html,
        summarizeLintOutput(lintResult.stdout, lintResult.stderr),
      ),
    );
  } catch (error) {
    console.warn("[animateDeck] Fix-loop Claude call failed:", error);
    return null;
  }

  if (!fixedHtml || !fixedHtml.toLowerCase().includes("</html>")) {
    return null;
  }

  await prepareHyperframesProjectFromHtml({
    templateId: DECK_TEMPLATE_ID,
    sessionId,
    html: fixedHtml,
    projectName: `Deck explainer · agent (fixed) · ${sessionId}`,
  });

  reportProgress?.(0.85, "Validating fixed composition");
  lintResult = await lintHyperframesProject(deckProjectDir(sessionId));

  if (lintResult.exitCode === 0) {
    return { html: fixedHtml, source: "agent", lintFailures: 1 };
  }

  return null;
}

export async function animateDeck(options: AnimateDeckOptions): Promise<AnimateDeckResult> {
  const { onProgress } = options;
  const apiKey = env().ANTHROPIC_API_KEY;
  const motionPreset = options.motionPreset ?? "calm";

  onProgress?.(0.04, "Preparing scene plan…");

  // Always validate the plan up-front so a malformed payload short-circuits
  // before we kick off the agent.
  const plan = scenePlanSchema.parse(options.scenePlan);

  let agentOutcome: { html: string; source: "agent" } | null = null;

  if (apiKey) {
    const attempt = await attemptAgentAuthoring(
      apiKey,
      { ...options, scenePlan: plan },
    );
    if (attempt) {
      agentOutcome = { html: attempt.html, source: attempt.source };
    } else {
      onProgress?.(0.7, "Agent output rejected — using deterministic fallback…");
    }
  } else {
    onProgress?.(0.4, "No ANTHROPIC_API_KEY — using deterministic generator…");
  }

  let finalHtml: string;
  let source: "agent" | "fallback";
  let durationSeconds: number;

  if (agentOutcome) {
    finalHtml = agentOutcome.html;
    source = "agent";
    // Re-derive duration from the plan; the agent output is opaque.
    durationSeconds = plan.scenes.reduce(
      (total, scene) => total + scene.durationSeconds,
      0,
    );
  } else {
    onProgress?.(0.85, "Building deterministic composition…");
    const built = buildDeckComposition(plan, {
      motionPreset,
      styleIntent: options.styleIntent,
      width: DECK_WIDTH,
      height: DECK_HEIGHT,
    });
    finalHtml = built.html;
    durationSeconds = built.durationSeconds;
    source = "fallback";
  }

  onProgress?.(0.95, "Saving draft…");
  await writeDeckDraft(options.sessionId, finalHtml);

  onProgress?.(1, "Composition ready");

  return {
    sessionId: options.sessionId,
    source,
    durationSeconds,
  };
}
