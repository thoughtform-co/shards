import Anthropic from "@anthropic-ai/sdk";
import {
  monizzeDefaultScenePlan,
  scenePlanSchema,
  type DeckScenePlan,
} from "@/experiments/video-studio/deck-scene-plan";
import { env } from "@/lib/env";

export type SiteAnalysisResult = {
  scenePlan: DeckScenePlan;
  designMd: string;
  source: "live" | "mock";
  siteTitle: string;
};

export type FetchedSite = {
  url: string;
  title: string;
  description: string;
  text: string;
  headings: string[];
};

/* SSRF guard. We only fetch from public http(s) hosts; localhost, link-local,
   and RFC1918 ranges (and a few other reserved bands) are blocked so the
   server can't be coerced into hitting internal services through this route. */
const BLOCKED_HOSTS = new Set([
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "::1",
  "metadata.google.internal",
]);

function isPrivateIpv4(host: string): boolean {
  const match = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (!match) return false;
  const parts = match.slice(1, 5).map(Number) as [number, number, number, number];
  const [a, b] = parts;
  // 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 169.254.0.0/16, 127.0.0.0/8,
  // 100.64.0.0/10 (CG-NAT), 0.0.0.0/8, AWS metadata 169.254.169.254.
  if (a === 10) return true;
  if (a === 127) return true;
  if (a === 0) return true;
  if (a === 169 && b === 254) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a === 100 && b >= 64 && b <= 127) return true;
  return false;
}

function isBlockedHost(host: string): boolean {
  const lowered = host.toLowerCase();
  if (BLOCKED_HOSTS.has(lowered)) return true;
  if (lowered.endsWith(".local")) return true;
  if (lowered.endsWith(".internal")) return true;
  if (isPrivateIpv4(lowered)) return true;
  // IPv6: any non-bracketed colon-form here is the resolved host, block
  // unique-local + loopback prefixes outright.
  if (lowered.startsWith("fc") || lowered.startsWith("fd")) return true;
  if (lowered === "::" || lowered === "0:0:0:0:0:0:0:0") return true;
  return false;
}

export function validateTargetUrl(input: string): URL {
  let url: URL;
  try {
    url = new URL(input.trim());
  } catch {
    throw new Error("Enter a valid URL (https://example.com).");
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("Only http(s) URLs are supported.");
  }
  if (isBlockedHost(url.hostname)) {
    throw new Error("That host is not reachable from this endpoint.");
  }
  return url;
}

const MAX_BYTES = 1_500_000;
const FETCH_TIMEOUT_MS = 12_000;

export async function fetchSite(target: URL): Promise<FetchedSite> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(target.toString(), {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        // Some sites refuse fetch without a UA; identify as a generic crawler.
        "User-Agent":
          "Mozilla/5.0 (compatible; ThoughtformVideoStudio/0.1; +https://thoughtform.co)",
        Accept: "text/html,application/xhtml+xml",
      },
    });
  } catch (error) {
    clearTimeout(timer);
    if ((error as { name?: string }).name === "AbortError") {
      throw new Error("That site took too long to respond.");
    }
    throw new Error("Couldn't reach that URL.");
  }
  clearTimeout(timer);

  if (!response.ok) {
    throw new Error(`That site returned ${response.status}.`);
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("text/html")) {
    throw new Error("That URL didn't return an HTML page.");
  }

  // Read the body with a hard byte cap so a giant page can't blow memory.
  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error("Couldn't read that site's response.");
  }
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (!value) continue;
    total += value.byteLength;
    if (total > MAX_BYTES) {
      try {
        await reader.cancel();
      } catch {
        // Ignore: we already have enough bytes for parsing.
      }
      break;
    }
    chunks.push(value);
  }

  const buffer = Buffer.concat(chunks.map((chunk) => Buffer.from(chunk)));
  const html = buffer.toString("utf8");

  return parseSiteHtml(target.toString(), html);
}

function pickAttr(html: string, attr: string): string | null {
  // Match the value of the requested attribute (single or double quoted) on a
  // single tag. Capture group 2 is the value.
  const re = new RegExp(`${attr}\\s*=\\s*(['"])(.*?)\\1`, "i");
  const match = html.match(re);
  return match?.[2] ?? null;
}

function metaContent(html: string, propertyOrName: string): string | null {
  const tagRe = new RegExp(
    `<meta\\b[^>]*(?:property|name)\\s*=\\s*['"]${propertyOrName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}['"][^>]*>`,
    "i",
  );
  const tag = html.match(tagRe)?.[0];
  if (!tag) return null;
  return pickAttr(tag, "content");
}

function decodeEntities(value: string): string {
  return value
    .replaceAll("&nbsp;", " ")
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&apos;", "'");
}

function stripHtmlText(html: string, maxChars: number): string {
  // Drop scripts/styles/noscript entirely, then collapse remaining tags.
  const cleaned = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ");
  const collapsed = decodeEntities(cleaned).replace(/\s+/g, " ").trim();
  if (collapsed.length <= maxChars) return collapsed;
  return `${collapsed.slice(0, maxChars)}…`;
}

function extractHeadings(html: string, max = 12): string[] {
  const re = /<h([1-3])\b[^>]*>([\s\S]*?)<\/h\1>/gi;
  const out: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = re.exec(html)) !== null) {
    const inner = match[2] ?? "";
    const text = decodeEntities(inner.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
    if (text.length > 0 && text.length <= 240) {
      out.push(text);
    }
    if (out.length >= max) break;
  }
  return out;
}

export function parseSiteHtml(url: string, html: string): FetchedSite {
  const rawTitle = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "";
  const title = decodeEntities(rawTitle.replace(/\s+/g, " ").trim()).slice(0, 200);
  const description =
    metaContent(html, "og:description") ??
    metaContent(html, "twitter:description") ??
    metaContent(html, "description") ??
    "";
  const headings = extractHeadings(html);
  const text = stripHtmlText(html, 12_000);

  return {
    url,
    title: title || new URL(url).hostname,
    description: decodeEntities(description).slice(0, 600),
    headings,
    text,
  };
}

function inferBrandName(site: FetchedSite): string {
  const cleaned = site.title.replace(/\s*[|\-—·:]\s*.*$/, "").trim();
  return cleaned.length > 0 ? cleaned : new URL(site.url).hostname;
}

function buildDeterministicScenePlanFromSite(site: FetchedSite): DeckScenePlan {
  const brand = inferBrandName(site);
  const headings = site.headings.length > 0 ? site.headings.slice(0, 5) : [site.title];
  const fallbackBullets = site.description
    ? [site.description.slice(0, 140)]
    : ["A short tour of the product."];

  const scenes = headings.map((headline, index) => ({
    headline: headline.slice(0, 90) || `${brand} highlight`,
    bullets:
      index === 0
        ? fallbackBullets
        : [`Why this matters · ${headline.slice(0, 60)}`],
    durationSeconds: 4,
  }));

  return {
    title: site.title || brand,
    brandName: brand,
    accentColor: "#E8521F",
    backgroundColor: "#0F0E0C",
    scenes:
      scenes.length > 0
        ? scenes.slice(0, 6)
        : monizzeDefaultScenePlan.scenes,
  };
}

function buildDeterministicDesignMd(site: FetchedSite, plan: DeckScenePlan): string {
  const host = (() => {
    try {
      return new URL(site.url).hostname;
    } catch {
      return site.url;
    }
  })();

  return [
    `# DESIGN.md — ${plan.brandName}`,
    "",
    `_Auto-derived from ${host}. Adjust freely; this is a baseline, not a contract._`,
    "",
    "## Brand voice",
    site.description
      ? `- ${site.description.slice(0, 280)}`
      : `- ${plan.brandName} — clear, modern, confident.`,
    "",
    "## Color palette",
    `- Accent · \`${plan.accentColor}\``,
    `- Background · \`${plan.backgroundColor}\``,
    "- Text · automatically derived for contrast (cream on dark, ink on light)",
    "",
    "## Typography",
    "- Display · Inter / system-ui, weight 600",
    "- Body · Inter / system-ui, weight 400",
    "- Eyebrow & labels · ui-monospace, JetBrains Mono",
    "",
    "## Layout principles",
    "- Generous padding (≈ 7-9% of canvas)",
    "- Single-column, left-aligned compositions",
    "- One headline + max 4 bullets per scene",
    "",
    "## Do",
    "- Keep one strong visual idea per scene",
    "- Reuse the accent color sparingly (rails, markers, eyebrows)",
    "- Let typography carry the hierarchy",
    "",
    "## Don't",
    "- Stack competing accents on the same scene",
    "- Use stock decorative gradients or emoji clutter",
    "- Animate width/height or call play/pause on media",
  ].join("\n");
}

function extractJsonPayload(text: string) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return text;
  return text.slice(start, end + 1);
}

function buildClaudePrompt(site: FetchedSite): string {
  return [
    `Source URL: ${site.url}`,
    `Page title: ${site.title}`,
    site.description ? `Meta description: ${site.description}` : "Meta description: (none)",
    site.headings.length > 0
      ? `Headings on page:\n${site.headings.map((h) => `  - ${h}`).join("\n")}`
      : "Headings on page: (none detected)",
    "",
    "Visible page text (truncated):",
    "```",
    site.text,
    "```",
    "",
    "Turn the above into JSON with EXACTLY these keys:",
    "  - scenePlan: { title, brandName, accentColor (#hex), backgroundColor (#hex), scenes: [{ headline, bullets: string[], durationSeconds (3-6) }] }",
    "  - designMd: string (a concise DESIGN.md cheat sheet for this brand in plain markdown)",
    "",
    "RULES:",
    "- 4 to 6 scenes, total runtime 18-28 seconds, every scene durationSeconds between 3 and 6.",
    "- Headlines under 70 characters. 1-3 bullets per scene, each under 110 characters.",
    "- Pick accentColor and backgroundColor that feel native to this brand (infer from the page voice).",
    "- The designMd MUST include sections: Brand voice, Color palette (with hex), Typography, Layout principles, Do, Don't.",
    "- Return JSON only — no markdown fences, no commentary.",
  ].join("\n");
}

const designMdResponseSchema = (() => {
  // Lightweight runtime guard for the live-mode payload shape — `scenePlan`
  // is fully validated downstream by `scenePlanSchema`, so we only assert the
  // surrounding wrapper here.
  return {
    parse(value: unknown): { scenePlan: unknown; designMd: string } {
      if (!value || typeof value !== "object") {
        throw new Error("Claude returned a non-object payload.");
      }
      const record = value as Record<string, unknown>;
      if (typeof record.designMd !== "string" || record.designMd.trim().length === 0) {
        throw new Error("Claude payload missing designMd.");
      }
      return {
        scenePlan: record.scenePlan,
        designMd: record.designMd,
      };
    },
  };
})();

export async function analyzeSite(site: FetchedSite): Promise<SiteAnalysisResult> {
  const apiKey = env().ANTHROPIC_API_KEY;

  if (!apiKey) {
    const fallbackPlan = buildDeterministicScenePlanFromSite(site);
    return {
      scenePlan: fallbackPlan,
      designMd: buildDeterministicDesignMd(site, fallbackPlan),
      source: "mock",
      siteTitle: site.title,
    };
  }

  try {
    const anthropic = new Anthropic({ apiKey });
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2400,
      temperature: 0.4,
      system: [
        "You convert a website into (a) a multi-scene explainer video plan and (b) a concise DESIGN.md brand cheat sheet.",
        "Return STRICT JSON with keys `scenePlan` and `designMd` — no markdown fences, no prose.",
        "Lean editorial: short headlines, punchy bullets, brand-true palette.",
      ].join(" "),
      messages: [
        {
          role: "user",
          content: [{ type: "text", text: buildClaudePrompt(site) }],
        },
      ],
    });

    const block = message.content.find((entry) => entry.type === "text");
    const wrapper = designMdResponseSchema.parse(
      JSON.parse(extractJsonPayload(block?.text ?? "")),
    );
    const scenePlan = scenePlanSchema.parse(wrapper.scenePlan);

    return {
      scenePlan,
      designMd: wrapper.designMd.trim(),
      source: "live",
      siteTitle: site.title,
    };
  } catch (error) {
    console.warn(
      "[analyzeSite] Claude path failed, using deterministic fallback:",
      error instanceof Error ? error.message : error,
    );
    const fallbackPlan = buildDeterministicScenePlanFromSite(site);
    return {
      scenePlan: fallbackPlan,
      designMd: buildDeterministicDesignMd(site, fallbackPlan),
      source: "mock",
      siteTitle: site.title,
    };
  }
}
