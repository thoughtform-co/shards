import { z } from "zod";
import type {
  TemplateField,
  TemplateInputProps,
  VideoTemplate,
} from "@/experiments/video-studio/types";

export function buildInputSchema(template: VideoTemplate) {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const field of template.fields) {
    shape[field.key] = fieldSchemaFor(field);
  }

  return z.object(shape);
}

function fieldSchemaFor(field: TemplateField) {
  switch (field.type) {
    case "number":
      return z.coerce.number();
    case "color":
    case "text":
    case "textarea":
    case "select":
    case "file-video":
    case "file-image":
      return z.string();
    default:
      return z.string();
  }
}

export function parseTemplateInput(
  template: VideoTemplate,
  raw: unknown,
): TemplateInputProps {
  return buildInputSchema(template).parse(raw) as TemplateInputProps;
}
