"use client";

import {
  engineLabel,
  engineRationale,
  recommendEngine,
} from "@/experiments/video-studio/router";
import type { VideoTemplate } from "@/experiments/video-studio/types";

type TemplateGalleryProps = {
  templates: VideoTemplate[];
  selectedId: string;
  onSelect: (templateId: string) => void;
};

function cardAccentClass(template: VideoTemplate): string {
  const recommended = recommendEngine(template.jobType);

  if (recommended === template.engine) {
    return "cw-vs__card--router";
  }

  return "cw-vs__card--sage";
}

export function TemplateGallery({
  templates,
  selectedId,
  onSelect,
}: TemplateGalleryProps) {
  return (
    <section className="aiop-section cw-vs cw-vs--gallery">
      <div className="aiop-wrap cw-vs__inner">
        <div className="cw-vs__head">
          <p className="cw-vs__eyebrow">Templates</p>
          <h2 className="cw-vs__title">
            Per-job <em>engines</em>
          </h2>
          <p className="cw-vs__sub">
            Four starter templates — two HyperFrames, two Remotion. The router
            recommends an engine per job type; you can still pick any template.
          </p>
        </div>

        <div className="cw-vs__cards">
          {templates.map((template) => {
            const recommended = recommendEngine(template.jobType);
            const isRecommended = recommended === template.engine;
            const accentClass = cardAccentClass(template);

            return (
              <button
                key={template.id}
                type="button"
                className={`cw-vs__card ${accentClass} ${
                  selectedId === template.id ? "cw-vs__card--active" : ""
                }`}
                onClick={() => onSelect(template.id)}
              >
                <span className="cw-vs__kicker">{engineLabel(template.engine)}</span>
                <h3 className="cw-vs__card-headline">{template.name}</h3>
                <p className="cw-vs__card-dek">{template.description}</p>
                <div className="cw-vs__tags">
                  {isRecommended ? (
                    <span className="cw-vs__tag">router pick</span>
                  ) : null}
                  {template.tags.map((tag) => (
                    <span key={tag} className="cw-vs__tag">
                      {tag}
                    </span>
                  ))}
                </div>
                {selectedId === template.id ? (
                  <p className="cw-vs__card-note">
                    {engineRationale(template.jobType, template.engine)}
                  </p>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
