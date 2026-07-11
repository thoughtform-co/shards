import { NextResponse } from "next/server";

import { getModel, hasApiKey } from "../../../lib/generate/anthropic";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    hasApiKey: hasApiKey(),
    model: getModel(),
  });
}
