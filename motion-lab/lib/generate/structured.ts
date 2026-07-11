import { z } from "zod";

import { getClient, getModel } from "./anthropic";
import { GenerationError } from "./generateDoc";
import { skillSystemPrompt } from "./systemPrompt";

/*
 * Structured generation via FORCED (non-strict) TOOL USE.
 *
 * Why not structured outputs (`output_config.format`): our motion-doc
 * schema — a 3-way discriminated element union with nested tracks and
 * keyframes — exceeds the API's compiled-grammar size limit
 * ("The compiled grammar is too large"). Strict tools hit the same
 * limit. A non-strict forced tool skips grammar compilation entirely:
 * the model reads `input_schema` as guidance and we enforce it
 * ourselves with zod, with ONE repair round-trip that feeds the
 * validation issues back before giving up.
 */
export async function callWithSchema<S extends z.ZodType>(opts: {
  schema: S;
  toolName: string;
  toolDescription: string;
  userPrompt: string;
  maxTokens: number;
}): Promise<z.infer<S>> {
  const client = getClient();
  const model = getModel();

  const tool = {
    name: opts.toolName,
    description: opts.toolDescription,
    input_schema: z.toJSONSchema(opts.schema, {
      target: "draft-7",
    }) as Record<string, unknown> & { type: "object" },
  };

  const baseParams = {
    model,
    max_tokens: opts.maxTokens,
    system: [
      {
        type: "text" as const,
        text: await skillSystemPrompt(),
        /* Cached across generate + revise calls in a session. */
        cache_control: { type: "ephemeral" as const },
      },
    ],
    tools: [tool],
    tool_choice: { type: "tool" as const, name: opts.toolName },
  };

  const attempt = async (
    messages: { role: "user" | "assistant"; content: string }[],
  ) => {
    const response = await client.messages.create({
      ...baseParams,
      messages,
    });
    if (response.stop_reason === "max_tokens") {
      throw new GenerationError(
        "The generated output ran too long. Shorten the brief or the duration, or reduce the number of ideas.",
      );
    }
    const block = response.content.find((b) => b.type === "tool_use");
    if (!block) {
      throw new GenerationError("The model returned no structured output.", 502);
    }
    return opts.schema.safeParse(block.input);
  };

  const messages = [{ role: "user" as const, content: opts.userPrompt }];
  let parsed = await attempt(messages);

  if (!parsed.success) {
    const issues = parsed.error.issues
      .slice(0, 12)
      .map((i) => `- ${i.path.join(".")}: ${i.message}`)
      .join("\n");
    parsed = await attempt([
      ...messages,
      {
        role: "assistant",
        content:
          "(previous attempt failed schema validation and was discarded)",
      },
      {
        role: "user",
        content: `Your previous output failed validation:\n${issues}\n\nCall ${opts.toolName} again with a corrected, complete object. Fix every listed issue; keep everything else the same.`,
      },
    ]);
    if (!parsed.success) {
      throw new GenerationError(
        `The model could not produce a valid result: ${parsed.error.issues
          .slice(0, 5)
          .map((i) => `${i.path.join(".")}: ${i.message}`)
          .join("; ")}`,
        502,
      );
    }
  }

  return parsed.data;
}
