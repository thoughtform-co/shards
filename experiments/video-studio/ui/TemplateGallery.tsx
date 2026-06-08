"use client";

import {
  engineLabel,
  engineRationale,
  recommendEngine,
} from "@/experiments/video-studio/router";
import type { VideoTemplate } from "@/experiments/video-studio/types";
import styles from "@/experiments/video-studio/ui/video-studio.module.css";

type TemplateGalleryProps = {
  templates: VideoTemplate[];
  selectedId: string;
  onSelect: (templateId: string) => void;
};

export function TemplateGallery({
  templates,
  selectedId,
  onSelect,
}: TemplateGalleryProps) {
  return (
    <div className={styles.vsTemplateGrid}>
      {templates.map((template) => {
        const recommended = recommendEngine(template.jobType);
        const isRecommended = recommended === template.engine;

        return (
          <button
            key={template.id}
            type="button"
            className={`${styles.vsTemplateCard} ${
              selectedId === template.id ? styles.vsTemplateCardActive : ""
            }`}
            onClick={() => onSelect(template.id)}
          >
            <div className={styles.vsTagRow}>
              <span
                className={`${styles.vsEnginePill} ${
                  template.engine === "remotion"
                    ? styles.vsEngineRemotion
                    : styles.vsEngineHyperframes
                }`}
              >
                {engineLabel(template.engine)}
              </span>
              {isRecommended ? (
                <span className={styles.vsTag}>router pick</span>
              ) : null}
            </div>
            <h3 className={styles.vsTemplateTitle}>{template.name}</h3>
            <p className={styles.vsTemplateCopy}>{template.description}</p>
            <div className={styles.vsTagRow}>
              {template.tags.map((tag) => (
                <span key={tag} className={styles.vsTag}>
                  {tag}
                </span>
              ))}
            </div>
            {selectedId === template.id ? (
              <p className={styles.vsRouterNote}>
                {engineRationale(template.jobType, template.engine)}
              </p>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
