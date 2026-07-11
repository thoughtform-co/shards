import { NextResponse } from "next/server";
import { z } from "zod";

import { hasApiKey } from "../../../lib/generate/anthropic";
import { mapGenerationError } from "../../../lib/generate/errors";
import { generateMotionDoc } from "../../../lib/generate/generateDoc";
import { brandSchema } from "../../../lib/motiondoc/schema";

export const runtime = "nodejs";
/* A generation call can take a while on long briefs. */
export const maxDuration = 300;

const requestSchema = z.object({
  brief: z.string().min(4).max(4000),
  format: z.enum(["16:9", "9:16", "1:1"]),
  durationSeconds: z.number().min(3).max(90),
  brand: brandSchema.optional(),
});

export async function POST(request: Request) {
  if (!hasApiKey()) {
    return NextResponse.json(
      {
        error:
          "No ANTHROPIC_API_KEY configured. Copy .env.example to .env.local, add your key, and restart the dev server.",
      },
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
      {
        error: "Invalid request",
        issues: parsed.error.issues.map((i) => ({
          path: i.path.join("."),
          message: i.message,
        })),
      },
      { status: 422 },
    );
  }

  try {
    const doc = await generateMotionDoc(parsed.data);
    return NextResponse.json({ doc });
  } catch (error) {
    return mapGenerationError(error);
  }
}
