"use client";

import { useState } from "react";
import {
  headlessFoot,
  headlessLayers,
  headlessSection,
  headlessSurfaces,
  type HeadlessDetailToken,
  type HeadlessSurface,
} from "@/content/aether";

/**
 * Headless — one substrate, pick the AI tool or interface that fits.
 *
 * Two-column interactive panel. Left renders the substrate (Rules,
 * Examples, Sources, Loops) — the same encoded layer the previous
 * section showed sitting between data sources and AI tools/interfaces.
 * Right renders four selectable archetypes (Chat, API, Agent, Tool UI)
 * above a detail panel that swaps based on the active selection.
 * Selecting an archetype highlights only the substrate layers it
 * reads from — making the headless contract visible in one diagram.
 *
 * State is local. Keyboard, mouse, and screen-readers all use the
 * same `<button>` semantics; the active panel is announced via
 * `aria-live` so users hear the new detail when they navigate.
 */
export function Surfaces() {
  const [activeId, setActiveId] = useState<string>(headlessSurfaces[0]?.id ?? "chat");
  const active: HeadlessSurface =
    headlessSurfaces.find((s) => s.id === activeId) ?? headlessSurfaces[0];
  const activeLayers = new Set(active.layers);

  return (
    <section className="section section--soft" id="headless">
      <div className="wrap">
        <header className="section-head reveal">
          <p className="eyebrow">{headlessSection.eyebrow}</p>
          <h2 className="section-title">
            {headlessSection.title} <em>{headlessSection.titleEm}</em>
          </h2>
          <p className="section-intro">{headlessSection.lede}</p>
        </header>

        <div className="headless reveal">
          <aside className="headless__substrate" aria-label={headlessSection.panelTitle}>
            <header className="headless__substrate-head">
              <strong>{headlessSection.panelTitle}</strong>
              <span>{headlessSection.panelBadge}</span>
            </header>
            <ul className="headless__layers" role="list">
              {headlessLayers.map((layer) => {
                const isActive = activeLayers.has(layer.id);
                return (
                  <li
                    key={layer.id}
                    className={[
                      "headless-layer",
                      `headless-layer--${layer.id}`,
                      isActive ? "is-active" : null,
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    <span className="headless-layer__tag">{layer.tag}</span>
                    <span className="headless-layer__name">{layer.name}</span>
                  </li>
                );
              })}
            </ul>
          </aside>

          <div className="headless__right">
            <p className="headless__rule">{headlessSection.surfacesHeading}</p>

            <div
              className="headless__surfaces"
              role="tablist"
              aria-label="AI tools and interfaces"
            >
              {headlessSurfaces.map((surface) => {
                const isActive = surface.id === activeId;
                return (
                  <button
                    key={surface.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={`headless-panel-${surface.id}`}
                    id={`headless-tab-${surface.id}`}
                    className={`headless-surface${isActive ? " is-active" : ""}`}
                    onClick={() => setActiveId(surface.id)}
                  >
                    <span className="headless-surface__icon" aria-hidden="true">
                      {surface.icon}
                    </span>
                    <span className="headless-surface__name">{surface.name}</span>
                    <span className="headless-surface__verb">{surface.verb}</span>
                  </button>
                );
              })}
            </div>

            <div
              className="headless__detail"
              id={`headless-panel-${active.id}`}
              role="tabpanel"
              aria-live="polite"
              aria-labelledby={`headless-tab-${active.id}`}
            >
              <header className="headless__detail-head">
                <strong>{active.detail.title}</strong>
                <span>{active.detail.meta}</span>
              </header>
              <pre className="headless__detail-body">{renderDetail(active.detail.body)}</pre>
            </div>
          </div>
        </div>

        <ul className="headless__foot" role="list" data-reveal-stack>
          {headlessFoot.map((point) => (
            <li key={point.id} className="headless-point reveal">
              <h3>{point.title}</h3>
              <p>{point.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function renderDetail(tokens: HeadlessDetailToken[]) {
  return tokens.map((tok, idx) => {
    if (tok.type === "br") return <br key={idx} />;
    if (tok.type === "comment")
      return (
        <span key={idx} className="headless__detail-c">
          {tok.text}
        </span>
      );
    if (tok.type === "k")
      return (
        <span key={idx} className="headless__detail-k">
          {tok.text}
        </span>
      );
    if (tok.type === "v")
      return (
        <span key={idx} className="headless__detail-v">
          {tok.text}
        </span>
      );
    return <span key={idx}>{tok.text}</span>;
  });
}
