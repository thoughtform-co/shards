import type { Brand } from "./schema";

/*
 * Colors in a MotionDoc are raw CSS values or "$token" references
 * into brand.colors. Unknown tokens fall through as raw strings so a
 * typo degrades to an ignored CSS value instead of a crash.
 */
export function resolveColor(value: string, brand: Brand): string {
  if (!value.startsWith("$")) return value;
  const token = value.slice(1) as keyof Brand["colors"];
  return brand.colors[token] ?? value;
}
