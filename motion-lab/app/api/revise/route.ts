import { NextResponse } from "next/server";
import { z } from "zod";

import { hasApiKey } from "../../../lib/generate/anthropic";
import { mapGenerationError } from "../../../lib/generate/errors";
import { reviseScene } from "../../../lib/generate/reviseScene";
import { motionDocSchema } from "../../../lib/motiondoc/schema";

export const runtime = "nodejs";
export const maxDuration = 180;

const requestSchema = z.object({
  doc: motionDocSchema,
  sceneId: z.string(),
  note: z.string().min(3).max(2000),
});

export async function POST(request: Request) {
  if (!hasApiKey()) {
    return NextResponse.json(
      { error: "No ANTHROPIC_API_KEY configured (see .env.example)." },
      { status: 401 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 422 },
    );
  }

  try {
    const scene = await reviseScene(parsed.data);
    return NextResponse.json({ scene });
  } catch (error) {
    return mapGenerationError(error);
  }
}
