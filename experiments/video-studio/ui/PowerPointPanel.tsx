"use client";

import { useRef, useState } from "react";
import {
  monizzeDefaultScenePlan,
  type DeckAnalysisResult,
  type DeckScenePlan,
} from "@/experiments/video-studio/deck-scene-plan";
import type { ExplainerScene } from "@/experiments/video-studio/deck-scene-plan";

type PowerPointPanelProps = {
  scenePlan: DeckScenePlan;
  analysisSource: "live" | "mock" | "sample" | null;
  filename: string | null;
  status: string;
  onScenePlanChange: (plan: DeckScenePlan) => void;
  onAnalysisComplete: (result: DeckAnalysisResult & { filename: string }) => void;
  onLoadSample: () => void;
  onStatus: (message: string) => void;
};

function updateScene(
  plan: DeckScenePlan,
  index: number,
  patch: Partial<ExplainerScene>,
): DeckScenePlan {
  const scenes = plan.scenes.map((scene, sceneIndex) =>
    sceneIndex === index ? { ...scene, ...patch } : scene,
  );

  return { ...plan, scenes };
}

function updateBullets(plan: DeckScenePlan, index: number, raw: string) {
  const bullets = raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 4);

  return updateScene(plan, index, { bullets });
}

export function PowerPointPanel({
  scenePlan,
  analysisSource,
  filename,
  status,
  onScenePlanChange,
  onAnalysisComplete,
  onLoadSample,
  onStatus,
}: PowerPointPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  async function analyzeFile(file: File) {
    onStatus(`Analyzing ${file.name}…`);

    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "clientHint",
      "Monizze employer benefits promo for Centrale des Marchés",
    );

    const response = await fetch("/api/experiments/video-studio/pptx", {
      method: "POST",
      body: formData,
    });

    const payload = (await response.json()) as DeckAnalysisResult & {
      filename?: string;
      error?: string;
    };

    if (!response.ok) {
      throw new Error(payload.error ?? "Deck analysis failed.");
    }

    onAnalysisComplete({
      scenePlan: payload.scenePlan,
      source: payload.source,
      slideCount: payload.slideCount,
      filename: payload.filename ?? file.name,
    });
    onStatus(
      `Analyzed ${payload.slideCount} slides · ${payload.source === "live" ? "Claude" : "deterministic fallback"}`,
    );
  }

  async function handleFiles(files: FileList | null) {
    const file = files?.[0];

    if (!file) {
      return;
    }

    setIsAnalyzing(true);

    try {
      await analyzeFile(file);
    } catch (error) {
      onStatus(
        error instanceof Error ? error.message : "Deck analysis failed unexpectedly.",
      );
    } finally {
      setIsAnalyzing(false);
    }
  }

  function removeScene(index: number) {
    if (scenePlan.scenes.length <= 1) {
      return;
    }

    onScenePlanChange({
      ...scenePlan,
      scenes: scenePlan.scenes.filter((_, sceneIndex) => sceneIndex !== index),
    });
  }

  return (
    <div className="cw-vs__pptx">
      <div className="cw-vs__pptx-actions">
        <button
          type="button"
          className="aiop-button aiop-button--ghost"
          onClick={onLoadSample}
        >
          Load Monizze sample
        </button>
        {analysisSource ? (
          <span
            className={`cw-vs__source-badge cw-vs__source-badge--${analysisSource}`}
          >
            {analysisSource === "live"
              ? "Claude analysis"
              : analysisSource === "sample"
                ? "Sample deck"
                : "Deterministic fallback"}
          </span>
        ) : null}
      </div>

      <label
        className={`cw-vs__dropzone ${isDragging ? "cw-vs__dropzone--active" : ""}`}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          void handleFiles(event.dataTransfer.files);
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pptx,application/vnd.openxmlformats-officedocument.presentationml.presentation"
          hidden
          disabled={isAnalyzing}
          onChange={(event) => void handleFiles(event.target.files)}
        />
        <span className="cw-vs__dropzone-title">
          {isAnalyzing ? "Analyzing deck…" : "Drop a .pptx here or click to upload"}
        </span>
        <span className="cw-vs__dropzone-meta">
          {filename
            ? `Loaded: ${filename}`
            : "Claude reads slide structure → editable scene plan → Remotion preview"}
        </span>
        <button
          type="button"
          className="aiop-button aiop-button--gold"
          disabled={isAnalyzing}
          onClick={() => inputRef.current?.click()}
        >
          Upload PowerPoint
        </button>
      </label>

      {status ? <p className="cw-vs__upload-meta">{status}</p> : null}

      <div className="cw-vs__brand-grid">
        <div className="cw-vs__field">
          <label>
            <span className="cw-vs__field-label">Deck title</span>
            <input
              type="text"
              value={scenePlan.title}
              onChange={(event) =>
                onScenePlanChange({ ...scenePlan, title: event.target.value })
              }
            />
          </label>
        </div>
        <div className="cw-vs__field">
          <label>
            <span className="cw-vs__field-label">Brand name</span>
            <input
              type="text"
              value={scenePlan.brandName}
              onChange={(event) =>
                onScenePlanChange({ ...scenePlan, brandName: event.target.value })
              }
            />
          </label>
        </div>
        <div className="cw-vs__field">
          <label>
            <span className="cw-vs__field-label">Accent</span>
            <div className="cw-vs__color">
              <span className="cw-vs__color-swatch">
                <span
                  className="cw-vs__color-fill"
                  style={{ backgroundColor: scenePlan.accentColor }}
                  aria-hidden="true"
                />
                <input
                  type="color"
                  value={scenePlan.accentColor}
                  onChange={(event) =>
                    onScenePlanChange({
                      ...scenePlan,
                      accentColor: event.target.value,
                    })
                  }
                />
              </span>
              <input
                type="text"
                value={scenePlan.accentColor}
                onChange={(event) =>
                  onScenePlanChange({
                    ...scenePlan,
                    accentColor: event.target.value,
                  })
                }
              />
            </div>
          </label>
        </div>
        <div className="cw-vs__field">
          <label>
            <span className="cw-vs__field-label">Background</span>
            <div className="cw-vs__color">
              <span className="cw-vs__color-swatch">
                <span
                  className="cw-vs__color-fill"
                  style={{ backgroundColor: scenePlan.backgroundColor }}
                  aria-hidden="true"
                />
                <input
                  type="color"
                  value={scenePlan.backgroundColor}
                  onChange={(event) =>
                    onScenePlanChange({
                      ...scenePlan,
                      backgroundColor: event.target.value,
                    })
                  }
                />
              </span>
              <input
                type="text"
                value={scenePlan.backgroundColor}
                onChange={(event) =>
                  onScenePlanChange({
                    ...scenePlan,
                    backgroundColor: event.target.value,
                  })
                }
              />
            </div>
          </label>
        </div>
      </div>

      <div className="cw-vs__scene-list">
        {scenePlan.scenes.map((scene, index) => (
          <article key={`scene-${index}`} className="cw-vs__scene-card">
            <div className="cw-vs__scene-card-head">
              <span className="cw-vs__scene-index">
                Scene {String(index + 1).padStart(2, "0")}
              </span>
              <button
                type="button"
                className="cw-vs__scene-remove"
                onClick={() => removeScene(index)}
              >
                Remove
              </button>
            </div>

            <div className="cw-vs__field">
              <label>
                <span className="cw-vs__field-label">Headline</span>
                <input
                  type="text"
                  value={scene.headline}
                  onChange={(event) =>
                    onScenePlanChange(
                      updateScene(scenePlan, index, {
                        headline: event.target.value,
                      }),
                    )
                  }
                />
              </label>
            </div>

            <div className="cw-vs__field">
              <label>
                <span className="cw-vs__field-label">Bullets (one per line)</span>
                <textarea
                  value={scene.bullets.join("\n")}
                  onChange={(event) =>
                    onScenePlanChange(updateBullets(scenePlan, index, event.target.value))
                  }
                />
              </label>
            </div>

            <div className="cw-vs__field">
              <label>
                <span className="cw-vs__field-label">Duration (seconds)</span>
                <input
                  type="number"
                  min={2}
                  max={12}
                  value={scene.durationSeconds}
                  onChange={(event) =>
                    onScenePlanChange(
                      updateScene(scenePlan, index, {
                        durationSeconds: Number(event.target.value),
                      }),
                    )
                  }
                />
              </label>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
