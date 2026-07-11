import { promises as fs } from "node:fs";
import path from "node:path";

/*
 * The generator's system prompt IS the motion-design skill — single
 * source of truth. SKILL.md plus the two runtime-relevant references
 * are concatenated (the model can't open reference files at runtime).
 * Cached against file mtimes so skill edits hot-reload in dev.
 */

const SKILL_DIR = path.join(process.cwd(), "skill", "motion-design");

const FILES = [
  "SKILL.md",
  path.join("references", "motion-doc-guide.md"),
  path.join("references", "timing-easing.md"),
];

const RUNTIME_ADDENDUM = `
---

# Runtime contract (Motion Lab generator)

You are the generator inside Motion Lab. The user gives a brief; you return a complete motion doc via the structured output format.

- Return ONLY the structured object: { title, brand, scenes }. Ids are assigned server-side — the schema has none.
- The request tells you the exact canvas (width × height @ fps) and target duration. Position for THAT canvas; scene durations minus crossfade overlaps should sum to the target ±10%.
- If brand tokens are provided, echo them EXACTLY into brand. Otherwise design a palette fitting the brief (dark canvases flatter motion; text contrast ≥ 7:1).
- Obey the budgets and the self-critique checklist before returning. Every element earns its place.
`;

let cache: { stamp: string; prompt: string } | null = null;

export async function skillSystemPrompt(): Promise<string> {
  const paths = FILES.map((f) => path.join(SKILL_DIR, f));
  const stats = await Promise.all(paths.map((p) => fs.stat(p)));
  const stamp = stats.map((s) => s.mtimeMs).join(":");

  if (cache?.stamp === stamp) return cache.prompt;

  const contents = await Promise.all(paths.map((p) => fs.readFile(p, "utf8")));
  const prompt = contents.join("\n\n---\n\n") + RUNTIME_ADDENDUM;
  cache = { stamp, prompt };
  return prompt;
}
