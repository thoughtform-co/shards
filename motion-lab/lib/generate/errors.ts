import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

import { GenerationError } from "./generateDoc";

/** Map generation failures onto HTTP responses (shared by routes). */
export function mapGenerationError(error: unknown): NextResponse {
  if (error instanceof GenerationError) {
    return NextResponse.json(
      { error: error.message },
      { status: error.status },
    );
  }
  if (error instanceof Anthropic.AuthenticationError) {
    return NextResponse.json(
      {
        error:
          "Anthropic rejected the API key — check ANTHROPIC_API_KEY in .env.local.",
      },
      { status: 401 },
    );
  }
  if (error instanceof Anthropic.RateLimitError) {
    return NextResponse.json(
      { error: "Rate limited by the Anthropic API — wait a moment and retry." },
      { status: 429 },
    );
  }
  if (error instanceof Anthropic.APIConnectionError) {
    return NextResponse.json(
      { error: "Could not reach the Anthropic API — check your connection." },
      { status: 502 },
    );
  }
  const message = error instanceof Error ? error.message : String(error);
  return NextResponse.json({ error: message }, { status: 500 });
}
