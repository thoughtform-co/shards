"use client";

import { useMemo, useState } from "react";
import { engineLabel, recommendEngine } from "@/experiments/video-studio/router";
import {
  defaultInputForTemplate,
  getTemplateById,
  videoTemplates,
} from "@/experiments/video-studio/templates";
import { PreviewPane } from "@/experiments/video-studio/ui/PreviewPane";
import { RenderPanel } from "@/experiments/video-studio/ui/RenderPanel";
import { TemplateGallery } from "@/experiments/video-studio/ui/TemplateGallery";
import { VariableForm } from "@/experiments/video-studio/ui/VariableForm";
import { VideoStudioHero } from "@/experiments/video-studio/ui/VideoStudioHero";
import { WorkshopSection } from "@/experiments/video-studio/ui/WorkshopSection";
import type { TemplateInputProps } from "@/experiments/video-studio/types";

export function VideoStudio() {
  const [selectedId, setSelectedId] = useState(videoTemplates[0]!.id);
  const [valuesByTemplate, setValuesByTemplate] = useState<
    Record<string, TemplateInputProps>
  >(() =>
    Object.fromEntries(
      videoTemplates.map((template) => [
        template.id,
        defaultInputForTemplate(template),
      ]),
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

  const template = getTemplateById(selectedId) ?? videoTemplates[0]!;
  const values = valuesByTemplate[template.id] ?? defaultInputForTemplate(template);
  const recommendedEngine = recommendEngine(template.jobType);
  const videoAssetUrl = videoUrlsByTemplate[template.id]?.videoAsset;

  const routerSummary = useMemo(() => {
    return `Router recommends ${engineLabel(recommendedEngine)} for ${template.jobType.replaceAll("-", " ")} · ${engineLabel(template.engine)} selected`;
  }, [recommendedEngine, template.engine, template.jobType]);

  function handleSelectTemplate(templateId: string) {
    setSelectedId(templateId);
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

    try {
      const response = await fetch("/api/experiments/video-studio/render", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          templateId: template.id,
          input: values,
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

      <TemplateGallery
        templates={videoTemplates}
        selectedId={template.id}
        onSelect={handleSelectTemplate}
      />

      <section className="aiop-section cw-vs cw-vs--editor">
        <div className="aiop-wrap cw-vs__inner">
          <div className="cw-vs__head">
            <p className="cw-vs__eyebrow">Editor</p>
            <h2 className="cw-vs__title">
              Variables &amp; <em>preview</em>
            </h2>
            <p className="cw-vs__sub">
              Fill template variables, upload footage where required, then
              preview live before rendering locally.
            </p>
          </div>

          <div className="cw-vs__layout">
            <div>
              <span
                className={`cw-vs__engine ${
                  template.engine === "remotion" ? "cw-vs__engine--remotion" : ""
                }`}
              >
                {engineLabel(template.engine)}
              </span>

              <VariableForm
                fields={template.fields}
                values={values}
                templateId={template.id}
                onChange={handleChange}
                onUploadComplete={handleUploadComplete}
              />

              <RenderPanel
                isRendering={isRendering}
                status={renderStatus}
                downloadUrl={downloadUrl}
                onRender={handleRender}
              />
            </div>

            <div>
              <div className="cw-vs__preview-head">
                <span className="cw-vs__preview-label">Live preview</span>
              </div>
              <PreviewPane
                template={template}
                input={values}
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
