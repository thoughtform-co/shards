"use client";

import Link from "next/link";
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
import { WorkshopSection } from "@/experiments/video-studio/ui/WorkshopSection";
import type { TemplateInputProps } from "@/experiments/video-studio/types";
import styles from "@/experiments/video-studio/ui/video-studio.module.css";

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
    return `Router recommends ${engineLabel(recommendedEngine)} for ${template.jobType.replaceAll("-", " ")}. You picked ${engineLabel(template.engine)} — both engines stay installed.`;
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
    <div className={styles.vsRoot}>
      <div className={styles.vsShell}>
        <header className={styles.vsHeader}>
          <p className={styles.vsLabel}>
            <Link href="/dashboard">Dashboard</Link> / Video Studio
          </p>
          <h1 className={styles.vsTitle}>Video Studio</h1>
          <p className={styles.vsHelp}>
            Pick a template, fill variables or upload footage, preview live, then render
            to MP4 on the machine running <code>npm run dev</code>. The router keeps
            both Remotion and HyperFrames installed — choose per job, not per team.
          </p>
          <p className={styles.vsRouterNote}>{routerSummary}</p>
        </header>

        <div className={styles.vsGrid}>
          <aside className={styles.vsPanel}>
            <div className={styles.vsPanelHeader}>
              <span className={styles.vsLabel}>Templates</span>
              <span className={styles.vsLabel}>{videoTemplates.length} ready</span>
            </div>
            <div className={styles.vsPanelBody}>
              <TemplateGallery
                templates={videoTemplates}
                selectedId={template.id}
                onSelect={handleSelectTemplate}
              />
            </div>
          </aside>

          <section className={styles.vsPanel}>
            <div className={styles.vsPanelHeader}>
              <span className={styles.vsLabel}>Editor</span>
              <span
                className={`${styles.vsEnginePill} ${
                  template.engine === "remotion"
                    ? styles.vsEngineRemotion
                    : styles.vsEngineHyperframes
                }`}
              >
                {engineLabel(template.engine)}
              </span>
            </div>
            <div className={styles.vsPanelBody}>
              <VariableForm
                fields={template.fields}
                values={values}
                templateId={template.id}
                onChange={handleChange}
                onUploadComplete={handleUploadComplete}
              />

              <div style={{ marginTop: 24 }}>
                <p className={styles.vsLabel}>Live preview</p>
                <PreviewPane
                  template={template}
                  input={values}
                  videoAssetUrl={videoAssetUrl}
                />
              </div>

              <RenderPanel
                isRendering={isRendering}
                status={renderStatus}
                downloadUrl={downloadUrl}
                onRender={handleRender}
              />
            </div>
          </section>
        </div>

        <WorkshopSection />
      </div>
    </div>
  );
}
