"use client";

import { useMemo, useState } from "react";
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
import { PowerPointPanel } from "@/experiments/video-studio/ui/PowerPointPanel";
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

export function VideoStudio() {
  const [activeTab, setActiveTab] = useState<StudioTabId>("pptx");
  const [scenePlan, setScenePlan] = useState<DeckScenePlan>(monizzeDefaultScenePlan);
  const [analysisSource, setAnalysisSource] = useState<
    "live" | "mock" | "sample" | null
  >("sample");
  const [pptxFilename, setPptxFilename] = useState<string | null>(null);

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

  const routerSummary = useMemo(() => {
    if (activeTab === "pptx") {
      return `Monizze demo · ${scenePlan.scenes.length} scenes · Remotion explainer from PowerPoint`;
    }

    return `${engineLabel(template.engine)} · ${template.name}`;
  }, [activeTab, scenePlan.scenes.length, template.engine, template.name]);

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
      setRenderStatus("Render complete. Download the MP4 below.");
    } catch (error) {
      setRenderStatus(
        error instanceof Error ? error.message : "Render failed unexpectedly.",
      );
    } finally {
      setIsRendering(false);
    }
  }

  return (
    <>
      <VideoStudioHero routerSummary={routerSummary} />

      <section className="aiop-section cw-vs cw-vs--studio">
        <div className="aiop-wrap cw-vs__inner">
          <div className="cw-vs__head">
            <p className="cw-vs__eyebrow">Video module</p>
            <h2 className="cw-vs__title">
              One frame, <em>many inputs</em>
            </h2>
            <p className="cw-vs__sub">
              Upload a PowerPoint for Monizze&apos;s Centrale des Marchés redo, or
              switch tabs for interview captions, social cut-downs, and variant
              sets. Preview stays in the same frame — only the controls change.
            </p>
          </div>

          <StudioTabs
            tabs={studioTabs}
            activeTab={activeTab}
            onChange={handleTabChange}
          />

          <div className="cw-vs__layout">
            <div className="cw-vs__controls">
              <span
                className={`cw-vs__engine ${
                  template.engine === "remotion" ? "cw-vs__engine--remotion" : ""
                }`}
              >
                {engineLabel(template.engine)}
              </span>

              {activeTab === "pptx" ? (
                <PowerPointPanel
                  scenePlan={scenePlan}
                  analysisSource={analysisSource}
                  filename={pptxFilename}
                  status={renderStatus.startsWith("Analy") ? renderStatus : ""}
                  onScenePlanChange={setScenePlan}
                  onAnalysisComplete={(result) => {
                    setScenePlan(result.scenePlan);
                    setAnalysisSource(result.source);
                    setPptxFilename(result.filename);
                    setRenderStatus(
                      `Analyzed ${result.slideCount} slides · ${result.source === "live" ? "Claude" : "deterministic fallback"}`,
                    );
                  }}
                  onLoadSample={() => {
                    setScenePlan(monizzeDefaultScenePlan);
                    setAnalysisSource("sample");
                    setPptxFilename("Monizze × Centrale des Marchés (sample)");
                    setRenderStatus("Loaded Monizze sample scene plan.");
                  }}
                  onStatus={(message) => {
                    setRenderStatus(message);
                  }}
                />
              ) : (
                <VariableForm
                  fields={template.fields}
                  values={values}
                  templateId={template.id}
                  onChange={handleChange}
                  onUploadComplete={handleUploadComplete}
                />
              )}

              <RenderPanel
                isRendering={isRendering}
                status={
                  renderStatus.startsWith("Analy") ? "" : renderStatus
                }
                downloadUrl={downloadUrl}
                onRender={handleRender}
              />
            </div>

            <div className="cw-vs__preview-column">
              <div className="cw-vs__preview-head">
                <span className="cw-vs__preview-label">Live preview</span>
              </div>
              <PreviewPane
                template={template}
                input={previewInput}
                videoAssetUrl={videoAssetUrl}
              />
            </div>
          </div>
        </div>
      </section>

      <WorkshopSection />
    </>
  );
}
