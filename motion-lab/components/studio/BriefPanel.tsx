"use client";

import { useEffect, useState } from "react";

import {
  DEFAULT_BRAND,
  EXALATE_STARTER_BRAND,
} from "../../lib/motiondoc/presets";
import { motionDocSchema, type Brand } from "../../lib/motiondoc/schema";
import { useStudioStore } from "../../lib/store/useStudioStore";

type BrandPreset = "default" | "exalate" | "current";

const DURATIONS = [6, 15, 30, 60] as const;

/*
 * Brief → first draft. POSTs to /api/generate (Claude with the
 * motion-design skill as system prompt) and loads the returned doc
 * onto the timeline. Degrades to a hint when no API key is set.
 */
export function BriefPanel() {
  const loadDoc = useStudioStore((s) => s.loadDoc);
  const currentBrand = useStudioStore((s) => s.doc.brand);
  const hasEdits = useStudioStore((s) => s.past.length > 0);
  const generateStatus = useStudioStore((s) => s.generateStatus);
  const setGenerateStatus = useStudioStore((s) => s.setGenerateStatus);

  const [brief, setBrief] = useState("");
  const [format, setFormat] = useState<"16:9" | "9:16" | "1:1">("16:9");
  const [duration, setDuration] = useState<number>(30);
  const [brandPreset, setBrandPreset] = useState<BrandPreset>("default");
  const [config, setConfig] = useState<{
    hasApiKey: boolean;
    model: string;
  } | null>(null);

  useEffect(() => {
    fetch("/api/config")
      .then((r) => r.json())
      .then(setConfig)
      .catch(() => setConfig({ hasApiKey: false, model: "?" }));
  }, []);

  const working = generateStatus.state === "working";

  const generate = async () => {
    if (
      hasEdits &&
      !window.confirm(
        "Generating replaces the current doc (export JSON first to keep it). Continue?",
      )
    ) {
      return;
    }
    const brand: Brand | undefined =
      brandPreset === "default"
        ? DEFAULT_BRAND
        : brandPreset === "exalate"
          ? EXALATE_STARTER_BRAND
          : currentBrand;

    setGenerateStatus({
      state: "working",
      message: `Directing ${config?.model ?? "Claude"}…`,
    });
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brief,
          format,
          durationSeconds: duration,
          brand,
        }),
      });
      const body = await res.json();
      if (!res.ok) {
        setGenerateStatus({
          state: "error",
          message: body.error ?? `Generation failed (${res.status})`,
        });
        return;
      }
      const parsed = motionDocSchema.safeParse(body.doc);
      if (!parsed.success) {
        setGenerateStatus({
          state: "error",
          message: "Server returned an invalid doc.",
        });
        return;
      }
      loadDoc(parsed.data);
      setGenerateStatus({ state: "idle" });
    } catch {
      setGenerateStatus({
        state: "error",
        message: "Could not reach /api/generate.",
      });
    }
  };

  return (
    <section className="ml-panel">
      <h2 className="ml-panel__title">Brief → draft</h2>
      {config && !config.hasApiKey ? (
        <p className="ml-panel__hint ml-panel__hint--warn">
          No API key — add <code>ANTHROPIC_API_KEY</code> to{" "}
          <code>.env.local</code> to enable generation. Everything else
          (examples, editing, rendering) works without it.
        </p>
      ) : (
        <p className="ml-panel__hint">
          Describe the video. Claude drafts a motion doc; you refine it on the
          timeline.
        </p>
      )}

      <textarea
        className="ml-field__input ml-field__input--area ml-brief__text"
        rows={5}
        placeholder="e.g. 30s explainer for a two-way issue sync between Jira and ServiceNow. Hook on the pain of double bookkeeping, show a field syncing both directions, end on 'Set the rules once.'"
        value={brief}
        onChange={(e) => setBrief(e.target.value)}
        disabled={working}
      />

      <div className="ml-brief__row">
        <select
          className="ml-field__input"
          value={format}
          onChange={(e) => setFormat(e.target.value as typeof format)}
          disabled={working}
          title="Format"
        >
          <option value="16:9">16:9 · 1920×1080</option>
          <option value="9:16">9:16 · 1080×1920</option>
          <option value="1:1">1:1 · 1080×1080</option>
        </select>
        <select
          className="ml-field__input"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          disabled={working}
          title="Duration"
        >
          {DURATIONS.map((d) => (
            <option key={d} value={d}>
              {d}s
            </option>
          ))}
        </select>
      </div>

      <select
        className="ml-field__input"
        value={brandPreset}
        onChange={(e) => setBrandPreset(e.target.value as BrandPreset)}
        disabled={working}
        title="Brand tokens"
      >
        <option value="default">Brand: Motion Lab dark</option>
        <option value="exalate">Brand: Exalate starter</option>
        <option value="current">Brand: keep current doc&apos;s</option>
      </select>

      <button
        type="button"
        className="ml-btn ml-btn--primary ml-brief__go"
        onClick={generate}
        disabled={working || brief.trim().length < 4 || !config?.hasApiKey}
      >
        {working ? "Generating…" : "Generate draft"}
      </button>

      {generateStatus.state === "working" ? (
        <p className="ml-panel__hint">{generateStatus.message}</p>
      ) : null}
      {generateStatus.state === "error" ? (
        <p className="ml-panel__hint ml-panel__hint--error">
          {generateStatus.message}
        </p>
      ) : null}
    </section>
  );
}
