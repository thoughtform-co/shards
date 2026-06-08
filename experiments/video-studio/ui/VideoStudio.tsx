"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  monizzeDefaultScenePlan,
  type DeckScenePlan,
} from "@/experiments/video-studio/deck-scene-plan";
import { engineLabel } from "@/experiments/video-studio/router";
import {
  defaultInputForTemplate,
  getTemplateById,
  videoTemplates,
} from "@/experiments/video-studio/templates";
import {
  deckSeriesPropsToInput,
} from "@/experiments/video-studio/templates/remotion/deck-series-props";
import { getStudioTab, studioTabs, type StudioTabId } from "@/experiments/video-studio/studio-tabs";
import {
  PptxSetupPanel,
  SceneTimeline,
  type MotionPreset,
} from "@/experiments/video-studio/ui/PowerPointPanel";
import { PreviewPane } from "@/experiments/video-studio/ui/PreviewPane";
import { RenderPanel } from "@/experiments/video-studio/ui/RenderPanel";
import { StudioTabs } from "@/experiments/video-studio/ui/StudioTabs";
import { VariableForm } from "@/experiments/video-studio/ui/VariableForm";
import { VideoStudioHero } from "@/experiments/video-studio/ui/VideoStudioHero";
import { WorkshopSection } from "@/experiments/video-studio/ui/WorkshopSection";
import type { TemplateInputProps } from "@/experiments/video-studio/types";

const legacyTemplateIds = videoTemplates
  .map((template) => template.id)
  .filter((id) => id !== "deck-explainer-series");

function greatestCommonDivisor(a: number, b: number): number {
  return b === 0 ? a : greatestCommonDivisor(b, a % b);
}

function aspectLabel({ width, height }: { width: number; height: number }) {
  const divisor = greatestCommonDivisor(width, height) || 1;
  return `${width / divisor}:${height / divisor}`;
}

export type AnimationState = "idle" | "animating" | "ready";

export function VideoStudio() {
  const [activeTab, setActiveTab] = useState<StudioTabId>("pptx");
  const [scenePlan, setScenePlan] = useState<DeckScenePlan>(monizzeDefaultScenePlan);
  const [analysisSource, setAnalysisSource] = useState<
    "live" | "mock" | "sample" | null
  >("sample");
  const [pptxFilename, setPptxFilename] = useState<string | null>(null);
  const [selectedSceneIndex, setSelectedSceneIndex] = useState(0);

  // Animation state — drives both the preview surface and the render gate.
  // The fingerprint is the JSON snapshot of the scene plan at the moment the
  // composition was authored; comparing it against the current plan lets us
  // detect "stale" edits without an extra hash function.
  const [animationState, setAnimationState] = useState<AnimationState>("idle");
  const [animationSessionId, setAnimationSessionId] = useState<string | undefined>();
  const [animationProgress, setAnimationProgress] = useState(0);
  const [animationMessage, setAnimationMessage] = useState("");
  const [animatedFingerprint, setAnimatedFingerprint] = useState<string | undefined>();
  const [styleIntent, setStyleIntent] = useState("");
  const [motionPreset, setMotionPreset] = useState<MotionPreset>("calm");
  const [animationSource, setAnimationSource] = useState<
    "agent" | "fallback" | null
  >(null);
  const animationPollerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [valuesByTemplate, setValuesByTemplate] = useState<
    Record<string, TemplateInputProps>
  >(() =>
    Object.fromEntries(
      legacyTemplateIds.map((templateId) => {
        const template = getTemplateById(templateId)!;
        return [templateId, defaultInputForTemplate(template)];
      }),
    ),
  );
  const [uploadIdsByTemplate, setUploadIdsByTemplate] = useState<
    Record<string, Record<string, string>>
  >({});
  const [videoUrlsByTemplate, setVideoUrlsByTemplate] = useState<
    Record<string, Record<string, string>>
  >({});
  const [isRendering, setIsRendering] = useState(false);
  const [renderStatus, setRenderStatus] = useState("");
  const [downloadUrl, setDownloadUrl] = useState<string>();

  const activeStudioTab = getStudioTab(activeTab);
  const template =
    getTemplateById(activeStudioTab.templateId) ?? getTemplateById("deck-explainer-series")!;
  const values = valuesByTemplate[template.id] ?? defaultInputForTemplate(template);
  const videoAssetUrl = videoUrlsByTemplate[template.id]?.videoAsset;

  const previewInput = useMemo(() => {
    if (activeTab === "pptx") {
      return deckSeriesPropsToInput(scenePlan);
    }

    return values;
  }, [activeTab, scenePlan, values]);

  const summary = useMemo(() => {
    const ratio = aspectLabel(template.dimensions);

    if (activeTab === "pptx") {
      const count = scenePlan.scenes.length;
      return `${count} ${count === 1 ? "scene" : "scenes"} · ${ratio}`;
    }

    return `${ratio} · ${template.durationSeconds}s`;
  }, [activeTab, scenePlan.scenes.length, template.dimensions, template.durationSeconds]);

  const stageMeta = useMemo(() => {
    const { width, height } = template.dimensions;
    return `${width}×${height} · ${template.fps} fps`;
  }, [template.dimensions, template.fps]);

  const isAnimationStale = useMemo(() => {
    if (animationState !== "ready" || !animatedFingerprint) {
      return false;
    }
    return JSON.stringify(scenePlan) !== animatedFingerprint;
  }, [animationState, animatedFingerprint, scenePlan]);

  const resetAnimation = useCallback(() => {
    if (animationPollerRef.current) {
      clearInterval(animationPollerRef.current);
      animationPollerRef.current = null;
    }
    setAnimationState("idle");
    setAnimationSessionId(undefined);
    setAnimationProgress(0);
    setAnimationMessage("");
    setAnimatedFingerprint(undefined);
    setAnimationSource(null);
  }, []);

  // Selected scene index must stay valid when the plan shrinks.
  useEffect(() => {
    if (selectedSceneIndex >= scenePlan.scenes.length) {
      setSelectedSceneIndex(Math.max(0, scenePlan.scenes.length - 1));
    }
  }, [scenePlan.scenes.length, selectedSceneIndex]);

  // Cleanup poller on unmount.
  useEffect(() => {
    return () => {
      if (animationPollerRef.current) {
        clearInterval(animationPollerRef.current);
        animationPollerRef.current = null;
      }
    };
  }, []);

  function handleTabChange(tabId: StudioTabId) {
    setActiveTab(tabId);
    setDownloadUrl(undefined);
    setRenderStatus("");
  }

  function handleChange(key: string, value: string | number) {
    setValuesByTemplate((current) => ({
      ...current,
      [template.id]: {
        ...(current[template.id] ?? defaultInputForTemplate(template)),
        [key]: value,
      },
    }));
  }

  function handleUploadComplete(fieldKey: string, uploadId: string, publicUrl: string) {
    setUploadIdsByTemplate((current) => ({
      ...current,
      [template.id]: {
        ...(current[template.id] ?? {}),
        [fieldKey]: uploadId,
      },
    }));

    setVideoUrlsByTemplate((current) => ({
      ...current,
      [template.id]: {
        ...(current[template.id] ?? {}),
        [fieldKey]: publicUrl,
      },
    }));

    setRenderStatus(`Footage stored for ${fieldKey}. Preview updated.`);
  }

  function startAnimationPoll(jobId: string, planSnapshot: DeckScenePlan) {
    if (animationPollerRef.current) {
      clearInterval(animationPollerRef.current);
    }

    animationPollerRef.current = setInterval(async () => {
      try {
        const response = await fetch(
          `/api/experiments/video-studio/animate?jobId=${jobId}`,
        );

        if (!response.ok) {
          return;
        }

        const job = (await response.json()) as {
          status?: string;
          progress?: number;
          message?: string;
          sessionId?: string;
          source?: "agent" | "fallback";
          error?: string;
        };

        if (typeof job.progress === "number") {
          setAnimationProgress(job.progress);
        }
        if (typeof job.message === "string") {
          setAnimationMessage(job.message);
        }

        if (job.status === "complete") {
          if (animationPollerRef.current) {
            clearInterval(animationPollerRef.current);
            animationPollerRef.current = null;
          }
          setAnimationSessionId(job.sessionId);
          setAnimatedFingerprint(JSON.stringify(planSnapshot));
          setAnimationSource(job.source ?? null);
          setAnimationState("ready");
          setAnimationProgress(1);
        } else if (job.status === "failed") {
          if (animationPollerRef.current) {
            clearInterval(animationPollerRef.current);
            animationPollerRef.current = null;
          }
          setAnimationState("idle");
          setAnimationMessage(job.error ?? "Animation failed.");
        }
      } catch {
        // Ignore transient polling errors — the next tick will retry.
      }
    }, 900);
  }

  async function handleAnimate() {
    if (animationState === "animating") {
      return;
    }

    setAnimationState("animating");
    setAnimationProgress(0.02);
    setAnimationMessage("Starting…");
    setRenderStatus("");
    setDownloadUrl(undefined);

    const planSnapshot = scenePlan;

    try {
      const response = await fetch("/api/experiments/video-studio/animate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenePlan: planSnapshot,
          styleIntent,
          motionPreset,
        }),
      });

      const payload = (await response.json()) as {
        jobId?: string;
        error?: string;
      };

      if (!response.ok || !payload.jobId) {
        throw new Error(payload.error ?? "Animation failed to start.");
      }

      startAnimationPoll(payload.jobId, planSnapshot);
    } catch (error) {
      setAnimationState("idle");
      setAnimationMessage(
        error instanceof Error ? error.message : "Animation failed to start.",
      );
    }
  }

  async function handleRender() {
    setIsRendering(true);
    setRenderStatus("Starting local render…");
    setDownloadUrl(undefined);

    const renderInput =
      activeTab === "pptx" ? deckSeriesPropsToInput(scenePlan) : values;

    try {
      const response = await fetch("/api/experiments/video-studio/render", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          templateId: template.id,
          input: renderInput,
          uploadIds: uploadIdsByTemplate[template.id] ?? {},
          // Pptx mode renders the agent-authored draft, not the static
          // template — pass through the sessionId so the server can find it.
          animationSessionId:
            activeTab === "pptx" ? animationSessionId : undefined,
        }),
      });

      const payload = (await response.json()) as {
        error?: string;
        downloadUrl?: string;
        cloudUpgrade?: boolean;
      };

      if (!response.ok) {
        throw new Error(payload.error ?? "Render failed.");
      }

      setDownloadUrl(payload.downloadUrl);
      setRenderStatus("Render complete");
    } catch (error) {
      setRenderStatus(
        error instanceof Error ? error.message : "Render failed unexpectedly.",
      );
    } finally {
      setIsRendering(false);
    }
  }

  const isPptx = activeTab === "pptx";
  const uploadStatus = renderStatus.startsWith("Analy") ? renderStatus : "";
  const renderPanelStatus = renderStatus.startsWith("Analy") ? "" : renderStatus;
  const renderDisabled = isPptx && animationState !== "ready";
  const renderDisabledHint = isPptx
    ? animationState === "animating"
      ? "Animation in progress…"
      : "Animate the deck first to enable render."
    : undefined;
  const engineDisplayLabel = isPptx ? "HyperFrames" : engineLabel(template.engine);
  const engineClassName = isPptx
    ? "cw-vs__engine"
    : `cw-vs__engine ${template.engine === "remotion" ? "cw-vs__engine--remotion" : ""}`;

  return (
    <>
      <section className="aiop-section cw-vs cw-vs--studio">
        <div className="cw-vs__canvas">
          <header className="cw-vs__toolbar">
            <VideoStudioHero summary={summary} />
            <div className="cw-vs__modes">
              <span className="cw-vs__modes-label">Start from</span>
              <StudioTabs
                tabs={studioTabs}
                activeTab={activeTab}
                onChange={handleTabChange}
              />
            </div>
          </header>

          <div
            className={`cw-vs__editor ${isPptx ? "cw-vs__editor--pptx" : "cw-vs__editor--legacy"}`}
          >
            {isPptx ? (
              <>
                <aside className="cw-vs__rail">
                  <PptxSetupPanel
                    scenePlan={scenePlan}
                    analysisSource={analysisSource}
                    filename={pptxFilename}
                    status={uploadStatus}
                    animationState={animationState}
                    animationProgress={animationProgress}
                    animationMessage={animationMessage}
                    animationSource={animationSource}
                    isAnimationStale={isAnimationStale}
                    motionPreset={motionPreset}
                    styleIntent={styleIntent}
                    onMotionPresetChange={setMotionPreset}
                    onStyleIntentChange={setStyleIntent}
                    onAnimate={handleAnimate}
                    onScenePlanChange={setScenePlan}
                    onAnalysisComplete={(result) => {
                      setScenePlan(result.scenePlan);
                      setAnalysisSource(result.source);
                      setPptxFilename(result.filename);
                      setRenderStatus(
                        `Analyzed ${result.slideCount} slides · ${result.source === "live" ? "Claude" : "deterministic fallback"}`,
                      );
                      resetAnimation();
                      setSelectedSceneIndex(0);
                    }}
                    onLoadSample={() => {
                      setScenePlan(monizzeDefaultScenePlan);
                      setAnalysisSource("sample");
                      setPptxFilename("Monizze × Centrale des Marchés (sample)");
                      setRenderStatus("Loaded Monizze sample scene plan.");
                      resetAnimation();
                      setSelectedSceneIndex(0);
                    }}
                    onStatus={(message) => {
                      setRenderStatus(message);
                    }}
                  />
                </aside>

                <div className="cw-vs__stage">
                  <div className="cw-vs__stage-topbar">
                    <span className="cw-vs__stage-meta">{stageMeta}</span>
                    <span className={engineClassName}>{engineDisplayLabel}</span>
                  </div>

                  <div className="cw-vs__stage-viewer">
                    <PreviewPane
                      template={template}
                      input={previewInput}
                      videoAssetUrl={videoAssetUrl}
                      animationState={animationState}
                      animationProgress={animationProgress}
                      animationMessage={animationMessage}
                      animationSessionId={animationSessionId}
                      isAnimationStale={isAnimationStale}
                    />
                  </div>

                  <footer className="cw-vs__stage-footer">
                    <RenderPanel
                      isRendering={isRendering}
                      status={renderPanelStatus}
                      downloadUrl={downloadUrl}
                      onRender={handleRender}
                      disabled={renderDisabled}
                      disabledHint={renderDisabledHint}
                    />
                  </footer>
                </div>

                <div className="cw-vs__timeline-wrap">
                  <SceneTimeline
                    scenePlan={scenePlan}
                    selectedIndex={selectedSceneIndex}
                    onSelect={setSelectedSceneIndex}
                    onScenePlanChange={setScenePlan}
                  />
                </div>
              </>
            ) : (
              <>
                <aside className="cw-vs__rail">
                  <div className="cw-vs__rail-inner">
                    <div className="cw-vs__rail-head">
                      <span className="cw-vs__rail-label">Variables</span>
                    </div>
                    <VariableForm
                      fields={template.fields}
                      values={values}
                      templateId={template.id}
                      onChange={handleChange}
                      onUploadComplete={handleUploadComplete}
                    />
                  </div>
                </aside>

                <div className="cw-vs__stage">
                  <div className="cw-vs__stage-topbar">
                    <span className="cw-vs__stage-meta">{stageMeta}</span>
                    <span className={engineClassName}>{engineDisplayLabel}</span>
                  </div>

                  <div className="cw-vs__stage-viewer">
                    <PreviewPane
                      template={template}
                      input={previewInput}
                      videoAssetUrl={videoAssetUrl}
                    />
                  </div>

                  <footer className="cw-vs__stage-footer">
                    <RenderPanel
                      isRendering={isRendering}
                      status={renderPanelStatus}
                      downloadUrl={downloadUrl}
                      onRender={handleRender}
                    />
                  </footer>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <WorkshopSection />
    </>
  );
}
