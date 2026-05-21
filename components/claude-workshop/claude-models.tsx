import { claudeModelsSection } from "@/content/claude-workshop";

import { ClaudeStack } from "./claude-stack";

/*
 * ClaudeModels — second of the three "Getting started with
 * Claude" panes. Reads the same `ClaudeStack` shell as
 * `ClaudeSettings` so the chapter rhythm stays uniform across the
 * Anthropic-tinted zone.
 *
 * Three card rule: always use Opus, keep extended thinking on,
 * and treat the token budget as exploration during the first
 * weeks. Closes on a single mono-caps receipt line about how
 * limit upgrades work.
 */

export function ClaudeModels() {
  return <ClaudeStack section={claudeModelsSection} />;
}
