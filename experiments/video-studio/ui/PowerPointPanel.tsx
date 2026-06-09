"use client";

import { useEffect, useRef, useState } from "react";
import type {
  DeckAnalysisResult,
  DeckScenePlan,
  ExplainerScene,
} from "@/experiments/video-studio/deck-scene-plan";
import type { AnimationState, DeckEngine } from "@/experiments/video-studio/ui/VideoStudio";

export type MotionPreset = "calm" | "kinetic";
export type SourceMode = "upload" | "url";

const MOTION_PRESETS: { id: MotionPreset; label: string; hint: string }[] = [
  { id: "calm", label: "Calm", hint: "Slow eases, generous holds, editorial pace." },
  { id: "kinetic", label: "Kinetic", hint: "Tight tweens, snappier transitions, on-beat." },
];

const DECK_ENGINES: { id: DeckEngine; label: string; hint: string }[] = [
  {
    id: "hyperframes",
    label: "HyperFrames",
    hint: "HTML/CSS/GSAP. Fast iteration, full creative latitude.",
  },
  {
    id: "remotion",
    label: "Remotion",
    hint: "React + frame-perfect motion. Slower to compile, richer animation primitives.",
  },
];

const SOURCE_MODES: { id: SourceMode; label: string; hint: string }[] = [
  {
    id: "upload",
    label: "Upload",
    hint: "Drop a .pptx deck and we'll lift slide structure into scenes.",
  },
  {
    id: "url",
    label: "From URL",
    hint: "Point at a website — we'll read it and infer scenes + brand tokens.",
  },
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
  deckEngine: DeckEngine;
  sourceMode: SourceMode;
  siteUrl: string;
  designMd: string;
  onSourceModeChange: (mode: SourceMode) => void;
  onSiteUrlChange: (value: string) => void;
  onAnalyzeUrl: () => Promise<void> | void;
  onDesignMdChange: (value: string) => void;
  onDeckEngineChange: (engine: DeckEngine) => void;
  onMotionPresetChange: (preset: MotionPreset) => void;
  onStyleIntentChange: (value: string) => void;
  onAnimate: () => void;
  onScenePlanChange: (plan: DeckScenePlan) => void;
  onAnalysisComplete: (
    result: DeckAnalysisResult & { filename: string; designMd?: string },
  ) => void;
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
  deckEngine,
  sourceMode,
  siteUrl,
  designMd,
  onSourceModeChange,
  onSiteUrlChange,
  onAnalyzeUrl,
  onDesignMdChange,
  onDeckEngineChange,
  onMotionPresetChange,
  onStyleIntentChange,
  onAnimate,
  onScenePlanChange,
  onAnalysisComplete,
  onLoadSample,
  onStatus,
}: PptxSetupPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const designMdInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isFetchingSite, setIsFetchingSite] = useState(false);
  // Brand defaults to closed: the analysis step picks tokens from the deck,
  // so most users never need to touch them. Collapsed-by-default keeps the
  // rail minimal; one click reveals the full form when tuning.
  const [brandOpen, setBrandOpen] = useState(false);
  // Design system block opens automatically once content arrives so the user
  // notices the new baseline; before that it stays out of the way.
  const [designOpen, setDesignOpen] = useState(false);
  // Style intent is a power-user knob — hidden until requested.
  const [styleIntentOpen, setStyleIntentOpen] = useState(
    Boolean(styleIntent.trim()),
  );

  // Auto-open the design.md disclosure when content first appears so the
  // user can see/edit the brand baseline right after analyzing a site.
  useEffect(() => {
    if (designMd.trim().length > 0) {
      setDesignOpen(true);
    }
  }, [designMd]);

  async function handleAnalyzeUrlClick() {
    if (siteUrl.trim().length === 0 || isFetchingSite) return;
    setIsFetchingSite(true);
    try {
      await onAnalyzeUrl();
    } finally {
      setIsFetchingSite(false);
    }
  }

  async function handleDesignMdFile(file: File) {
    const text = await file.text();
    // Cap to a sane size so we don't blow the animate prompt budget — Claude
    // calls cost tokens per request and the prompt also carries the scene
    // plan + system instructions.
    onDesignMdChange(text.slice(0, 20_000));
    onStatus(`Loaded design.md from ${file.name}.`);
  }

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

      {/* Source segmented control — two equal-width buttons that swap the
          input below. Mirrors the chip-row pattern already used for engine
          and motion presets. */}
      <div
        className="cw-vs__chip-row cw-vs__chip-row--segmented"
        role="radiogroup"
        aria-label="Source input"
      >
        {SOURCE_MODES.map((mode) => (
          <button
            key={mode.id}
            type="button"
            role="radio"
            aria-checked={sourceMode === mode.id}
            title={mode.hint}
            className={`cw-vs__chip cw-vs__chip--segment ${sourceMode === mode.id ? "cw-vs__chip--active" : ""}`}
            onClick={() => onSourceModeChange(mode.id)}
            disabled={isAnalyzing || isFetchingSite}
          >
            {mode.label}
          </button>
        ))}
      </div>

      {sourceMode === "upload" ? (
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
      ) : (
        <div className="cw-vs__url-row">
          <input
            type="url"
            className="cw-vs__url-input"
            placeholder="https://example.com"
            value={siteUrl}
            spellCheck={false}
            autoComplete="off"
            onChange={(event) => onSiteUrlChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                void handleAnalyzeUrlClick();
              }
            }}
            disabled={isFetchingSite}
          />
          <button
            type="button"
            className="aiop-button aiop-button--gold"
            onClick={() => void handleAnalyzeUrlClick()}
            disabled={isFetchingSite || siteUrl.trim().length === 0}
          >
            {isFetchingSite ? "Reading…" : "Analyze site"}
          </button>
        </div>
      )}

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

      {/* Design system (design.md) — collapsible, modeled on the Brand
          collapse. Carries a free-form markdown baseline that the animate
          prompt picks up as a brand cheat sheet for both engines. */}
      <div className="cw-vs__collapse">
        <button
          type="button"
          className="cw-vs__collapse-summary"
          onClick={() => setDesignOpen((value) => !value)}
          aria-expanded={designOpen}
        >
          <span className="cw-vs__rail-label">Design system</span>
          <span className="cw-vs__collapse-summary-name">
            {designMd.trim().length > 0
              ? `design.md · ${designMd.trim().length.toLocaleString()} chars`
              : "design.md (optional)"}
          </span>
          <Chevron open={designOpen} />
        </button>

        {designOpen ? (
          <div className="cw-vs__design-md">
            <div className="cw-vs__design-md-actions">
              <input
                ref={designMdInputRef}
                type="file"
                accept=".md,text/markdown,text/plain"
                hidden
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    void handleDesignMdFile(file);
                  }
                  // Reset so re-selecting the same file fires onChange again.
                  if (designMdInputRef.current) {
                    designMdInputRef.current.value = "";
                  }
                }}
              />
              <button
                type="button"
                className="cw-vs__text-action cw-vs__text-action--inline"
                onClick={() => designMdInputRef.current?.click()}
              >
                Upload design.md
              </button>
              {designMd.trim().length > 0 ? (
                <button
                  type="button"
                  className="cw-vs__text-action cw-vs__text-action--inline"
                  onClick={() => onDesignMdChange("")}
                >
                  Clear
                </button>
              ) : null}
            </div>
            <textarea
              className="cw-vs__design-md-textarea"
              value={designMd}
              placeholder="# DESIGN.md&#10;&#10;## Color palette&#10;- Accent · #E8521F&#10;&#10;## Typography&#10;- Display · Inter 600&#10;&#10;Paste or upload a design.md, or analyze a URL to generate one."
              onChange={(event) =>
                onDesignMdChange(event.target.value.slice(0, 20_000))
              }
              rows={8}
            />
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

        <label className="cw-vs__engine-select">
          <span className="cw-vs__engine-select-label">Engine</span>
          <select
            className="cw-vs__select"
            value={deckEngine}
            aria-label="Animation engine"
            onChange={(event) =>
              onDeckEngineChange(event.target.value as DeckEngine)
            }
            disabled={animationState === "animating"}
          >
            {DECK_ENGINES.map((engine) => (
              <option key={engine.id} value={engine.id} title={engine.hint}>
                {engine.label}
              </option>
            ))}
          </select>
        </label>

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
