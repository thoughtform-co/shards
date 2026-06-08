"use client";

import { useEffect, useRef, useState } from "react";
import type {
  DeckAnalysisResult,
  DeckScenePlan,
  ExplainerScene,
} from "@/experiments/video-studio/deck-scene-plan";
import type { AnimationState } from "@/experiments/video-studio/ui/VideoStudio";

export type MotionPreset = "calm" | "kinetic";

const MOTION_PRESETS: { id: MotionPreset; label: string; hint: string }[] = [
  { id: "calm", label: "Calm", hint: "Slow eases, generous holds, editorial pace." },
  { id: "kinetic", label: "Kinetic", hint: "Tight tweens, snappier transitions, on-beat." },
];

export type PptxSetupPanelProps = {
  scenePlan: DeckScenePlan;
  analysisSource: "live" | "mock" | "sample" | null;
  filename: string | null;
  status: string;
  animationState: AnimationState;
  animationProgress: number;
  animationMessage: string;
  animationSource: "agent" | "fallback" | null;
  isAnimationStale: boolean;
  motionPreset: MotionPreset;
  styleIntent: string;
  onMotionPresetChange: (preset: MotionPreset) => void;
  onStyleIntentChange: (value: string) => void;
  onAnimate: () => void;
  onScenePlanChange: (plan: DeckScenePlan) => void;
  onAnalysisComplete: (result: DeckAnalysisResult & { filename: string }) => void;
  onLoadSample: () => void;
  onStatus: (message: string) => void;
};

export type SceneTimelineProps = {
  scenePlan: DeckScenePlan;
  selectedIndex: number;
  onSelect: (index: number) => void;
  onScenePlanChange: (plan: DeckScenePlan) => void;
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

function totalDurationSeconds(plan: DeckScenePlan) {
  return plan.scenes.reduce((sum, scene) => sum + scene.durationSeconds, 0);
}

/* Tiny chevron — purely decorative; size is set by ems so it follows
   the surrounding label. */
function Chevron({ open }: { open: boolean }) {
  return (
    <span
      className={`cw-vs__chevron ${open ? "cw-vs__chevron--open" : ""}`}
      aria-hidden="true"
    >
      ▾
    </span>
  );
}

export function PptxSetupPanel({
  scenePlan,
  analysisSource,
  filename,
  status,
  animationState,
  animationProgress,
  animationMessage,
  animationSource,
  isAnimationStale,
  motionPreset,
  styleIntent,
  onMotionPresetChange,
  onStyleIntentChange,
  onAnimate,
  onScenePlanChange,
  onAnalysisComplete,
  onLoadSample,
  onStatus,
}: PptxSetupPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  // Brand defaults to closed: the analysis step picks tokens from the deck,
  // so most users never need to touch them. Collapsed-by-default keeps the
  // rail minimal; one click reveals the full form when tuning.
  const [brandOpen, setBrandOpen] = useState(false);
  // Style intent is a power-user knob — hidden until requested.
  const [styleIntentOpen, setStyleIntentOpen] = useState(
    Boolean(styleIntent.trim()),
  );

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

  const sceneCount = scenePlan.scenes.length;
  const totalSeconds = totalDurationSeconds(scenePlan);
  const sourceLabel =
    analysisSource === "live"
      ? "Analyzed with Claude"
      : analysisSource === "mock"
        ? "Fallback analysis"
        : analysisSource === "sample"
          ? "Sample deck"
          : null;

  const animateButtonLabel =
    animationState === "animating"
      ? "Animating…"
      : animationState === "ready"
        ? "Re-animate"
        : "Animate";

  const animateProgressPct = Math.round(animationProgress * 100);

  return (
    <div className="cw-vs__rail-inner">
      <div className="cw-vs__rail-head cw-vs__rail-head--flush">
        <span className="cw-vs__rail-label">Source</span>
        {sceneCount > 0 ? (
          <span className="cw-vs__rail-meta">
            {sceneCount} {sceneCount === 1 ? "scene" : "scenes"}
          </span>
        ) : null}
      </div>

      <label
        className={`cw-vs__dropzone cw-vs__dropzone--inline ${isDragging ? "cw-vs__dropzone--active" : ""}`}
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
        <button
          type="button"
          className="aiop-button aiop-button--gold"
          disabled={isAnalyzing}
          onClick={() => inputRef.current?.click()}
        >
          {isAnalyzing ? "Analyzing…" : "Upload PowerPoint"}
        </button>
        <span className="cw-vs__dropzone-hint">
          {isDragging ? "Drop to analyze" : "or drop a .pptx"}
        </span>
      </label>

      {sourceLabel ? (
        <p className="cw-vs__source-state">
          <span className="cw-vs__status-dot" aria-hidden="true" />
          <span className="cw-vs__source-state-text">
            {filename ?? sourceLabel}
          </span>
        </p>
      ) : null}

      <button
        type="button"
        className="cw-vs__text-action"
        onClick={onLoadSample}
      >
        {analysisSource === "sample" ? "Reload sample deck" : "Load sample deck"}
      </button>

      {status ? <p className="cw-vs__upload-meta">{status}</p> : null}

      {/* Brand: collapsed by default. The summary row shows the two
          tokens + brand name so the user can see at a glance whether the
          analysis picked sensible values; click to tune. */}
      <div className="cw-vs__collapse">
        <button
          type="button"
          className="cw-vs__collapse-summary"
          onClick={() => setBrandOpen((value) => !value)}
          aria-expanded={brandOpen}
        >
          <span className="cw-vs__rail-label">Brand</span>
          <span className="cw-vs__brand-tokens" aria-hidden="true">
            <span
              className="cw-vs__brand-token"
              style={{ background: scenePlan.accentColor }}
            />
            <span
              className="cw-vs__brand-token"
              style={{ background: scenePlan.backgroundColor }}
            />
          </span>
          <span className="cw-vs__collapse-summary-name">
            {scenePlan.brandName}
          </span>
          <Chevron open={brandOpen} />
        </button>

        {brandOpen ? (
          <div className="cw-vs__brand-fields">
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
            <div className="cw-vs__brand-color-row">
              <label className="cw-vs__field cw-vs__field--color">
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
              <label className="cw-vs__field cw-vs__field--color">
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
        ) : null}
      </div>

      {/* Animate block pinned at the bottom. Spacer is a flex grower in
          the rail-inner column. */}
      <div className="cw-vs__rail-spacer" />

      <div className="cw-vs__animate">
        <div className="cw-vs__rail-head cw-vs__rail-head--flush">
          <span className="cw-vs__rail-label">Animate</span>
          <span className="cw-vs__rail-meta">{totalSeconds}s · 16:9</span>
        </div>

        <div className="cw-vs__motion-row">
          <div
            className="cw-vs__chip-row"
            role="radiogroup"
            aria-label="Motion energy"
          >
            {MOTION_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                role="radio"
                aria-checked={motionPreset === preset.id}
                title={preset.hint}
                className={`cw-vs__chip ${motionPreset === preset.id ? "cw-vs__chip--active" : ""}`}
                onClick={() => onMotionPresetChange(preset.id)}
              >
                {preset.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="cw-vs__text-action cw-vs__text-action--inline"
            onClick={() => setStyleIntentOpen((value) => !value)}
            aria-expanded={styleIntentOpen}
          >
            {styleIntentOpen ? "− direction" : "+ direction"}
          </button>
        </div>

        {styleIntentOpen ? (
          <textarea
            className="cw-vs__style-intent"
            value={styleIntent}
            onChange={(event) => onStyleIntentChange(event.target.value)}
            rows={2}
            placeholder="e.g. editorial, sharp typography, micro-grid"
          />
        ) : null}

        {animationState === "animating" ? (
          <div
            className="cw-vs__animate-progress"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={animateProgressPct}
          >
            <span
              className="cw-vs__animate-progress-bar"
              style={{ width: `${animateProgressPct}%` }}
            />
          </div>
        ) : null}

        {animationState === "ready" && isAnimationStale ? (
          <p className="cw-vs__animate-stale">Edits since last animation</p>
        ) : null}

        {animationState === "ready" && !isAnimationStale ? (
          <p className="cw-vs__animate-ready">
            <span className="cw-vs__status-dot" aria-hidden="true" />
            <span>
              Ready ·{" "}
              {animationSource === "fallback" ? "Deterministic" : "Claude agent"}
            </span>
          </p>
        ) : null}

        {animationMessage && animationState !== "ready" ? (
          <p className="cw-vs__animate-status">{animationMessage}</p>
        ) : null}

        <button
          type="button"
          className={`aiop-button ${
            animationState === "ready" && !isAnimationStale
              ? "aiop-button--ghost"
              : "aiop-button--gold"
          }`}
          onClick={onAnimate}
          disabled={animationState === "animating" || sceneCount === 0}
        >
          {animateButtonLabel}
        </button>
      </div>
    </div>
  );
}

/* Compact horizontal scene timeline. The strip lives below the preview;
   the editor for the selected chip docks beneath the strip in a single
   density-tight row + bullets textarea. Reorder arrows and helper text
   were removed to keep the bar shallow — drag-to-reorder is a future
   add. */
export function SceneTimeline({
  scenePlan,
  selectedIndex,
  onSelect,
  onScenePlanChange,
}: SceneTimelineProps) {
  const sceneRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const totalSeconds = totalDurationSeconds(scenePlan);
  const safeIndex = Math.min(
    Math.max(0, selectedIndex),
    Math.max(0, scenePlan.scenes.length - 1),
  );
  const activeScene = scenePlan.scenes[safeIndex];

  // Keep the active chip in view as the user navigates.
  useEffect(() => {
    const node = sceneRefs.current[safeIndex];
    if (node) {
      node.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "nearest",
      });
    }
  }, [safeIndex]);

  function addScene() {
    onScenePlanChange({
      ...scenePlan,
      scenes: [
        ...scenePlan.scenes,
        {
          headline: "New scene",
          bullets: ["Key point"],
          durationSeconds: 4,
        },
      ],
    });
    onSelect(scenePlan.scenes.length);
  }

  function removeScene(index: number) {
    if (scenePlan.scenes.length <= 1) {
      return;
    }

    onScenePlanChange({
      ...scenePlan,
      scenes: scenePlan.scenes.filter((_, sceneIndex) => sceneIndex !== index),
    });

    if (index <= safeIndex) {
      onSelect(Math.max(0, safeIndex - 1));
    }
  }

  return (
    <section className="cw-vs__timeline" aria-label="Scene timeline">
      <header className="cw-vs__timeline-head">
        <span className="cw-vs__rail-label">
          Scenes · {scenePlan.scenes.length}
        </span>
        <span className="cw-vs__timeline-total">{totalSeconds}s total</span>
        <button
          type="button"
          className="cw-vs__scene-add"
          onClick={addScene}
        >
          + Add
        </button>
      </header>

      <ol className="cw-vs__timeline-strip">
        {scenePlan.scenes.map((scene, index) => {
          const isActive = index === safeIndex;
          return (
            <li key={`scene-${index}`} className="cw-vs__timeline-slot">
              <button
                ref={(node) => {
                  sceneRefs.current[index] = node;
                }}
                type="button"
                className={`cw-vs__scene-chip ${isActive ? "cw-vs__scene-chip--active" : ""}`}
                onClick={() => onSelect(index)}
                aria-pressed={isActive}
                style={{ flexGrow: Math.max(1, scene.durationSeconds) }}
              >
                <span className="cw-vs__scene-chip-index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="cw-vs__scene-chip-headline">
                  {scene.headline || "Untitled scene"}
                </span>
                <span className="cw-vs__scene-chip-duration">
                  {scene.durationSeconds}s
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      {activeScene ? (
        <div className="cw-vs__timeline-editor">
          <div className="cw-vs__timeline-editor-row">
            <span className="cw-vs__scene-index">
              {String(safeIndex + 1).padStart(2, "0")}
            </span>
            <input
              type="text"
              className="cw-vs__timeline-headline"
              value={activeScene.headline}
              placeholder="Headline"
              onChange={(event) =>
                onScenePlanChange(
                  updateScene(scenePlan, safeIndex, {
                    headline: event.target.value,
                  }),
                )
              }
            />
            <input
              type="number"
              className="cw-vs__timeline-duration"
              min={2}
              max={12}
              value={activeScene.durationSeconds}
              aria-label="Duration in seconds"
              onChange={(event) =>
                onScenePlanChange(
                  updateScene(scenePlan, safeIndex, {
                    durationSeconds: Number(event.target.value),
                  }),
                )
              }
            />
            <span className="cw-vs__timeline-duration-unit" aria-hidden="true">
              s
            </span>
            <button
              type="button"
              className="cw-vs__scene-remove"
              onClick={() => removeScene(safeIndex)}
              disabled={scenePlan.scenes.length <= 1}
            >
              Remove
            </button>
          </div>

          <textarea
            className="cw-vs__timeline-bullets"
            value={activeScene.bullets.join("\n")}
            placeholder="One bullet per line · up to 4"
            onChange={(event) =>
              onScenePlanChange(
                updateBullets(scenePlan, safeIndex, event.target.value),
              )
            }
          />
        </div>
      ) : null}
    </section>
  );
}
