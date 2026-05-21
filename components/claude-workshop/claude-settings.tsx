import { claudeSettingsSection } from "@/content/claude-workshop";

import { ClaudeStack } from "./claude-stack";

/*
 * ClaudeSettings — first of the three "Getting started with
 * Claude" panes inside the .aiop-claude-zone Anthropic chapter.
 *
 * Renders the three settings every Loop user should turn on once
 * (search and reference chats, generate memory from chat history,
 * artifacts and live visualizations) plus two tips about how to
 * tend the memory layer and why the custom instructions field
 * should stay empty.
 *
 * All copy lives in `content/claude-workshop.ts` so editors can
 * tune wording without opening JSX.
 */

export function ClaudeSettings() {
  return <ClaudeStack section={claudeSettingsSection} />;
}
