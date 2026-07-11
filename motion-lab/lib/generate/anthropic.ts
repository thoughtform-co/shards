import Anthropic from "@anthropic-ai/sdk";

export function hasApiKey(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

export function getModel(): string {
  return process.env.MOTION_LAB_MODEL ?? "claude-sonnet-5";
}

let client: Anthropic | null = null;

export function getClient(): Anthropic {
  if (!client) client = new Anthropic();
  return client;
}
