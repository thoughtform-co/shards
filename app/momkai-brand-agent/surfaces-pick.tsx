"use client";

import { useState } from "react";
import {
  surfaces,
  surfacesLayers,
  surfacesSection,
  type SurfaceLayerId,
} from "./content";

/*
 * SurfacesPick — interactive substrate / room selector.
 *
 * Left  : a quiet cream panel showing the five substrate layers. Layers
 *         that the active surface uses are highlighted; the rest fade.
 * Right : four room buttons (Chat · Rollout · Studio · Engine) on top
 *         of a dark "transcript" panel that swaps content based on the
 *         selection. Reads as a small interactive case study, not a
 *         dashboard.
 *
 * State is local. Tab semantics for keyboard + screen-reader users; the
 * detail panel announces itself via aria-live="polite".
 */
export function SurfacesPick() {
  const [activeId, setActiveId] = useState<string>(surfaces[0]?.id ?? "chat");
  const active = surfaces.find((s) => s.id === activeId) ?? surfaces[0];
  const activeLayers = new Set<SurfaceLayerId>(active.layers);

  return (
    <div className="mk-surfaces__grid mk-reveal">
      <aside
        className="mk-surfaces__layers"
        aria-label={surfacesSection.panelHeading}
      >
        <header className="mk-surfaces__layers-head">
          <span className="mk-surfaces__layers-title">
            {surfacesSection.panelHeading}
          </span>
          <span>{surfacesSection.panelMeta}</span>
        </header>
        <ul className="mk-surfaces__layers-list" role="list">
          {surfacesLayers.map((layer) => {
            const isActive = activeLayers.has(layer.id);
            return (
              <li
                key={layer.id}
                className={`mk-surfaces__layer${isActive ? " is-active" : ""}`}
              >
                <span className="mk-surfaces__layer-tag">{layer.tag}</span>
                <span className="mk-surfaces__layer-name">{layer.name}</span>
              </li>
            );
          })}
        </ul>
      </aside>

      <div className="mk-surfaces__right">
        <p className="mk-surfaces__pick-h">{surfacesSection.pickHeading}</p>

        <div
          className="mk-surfaces__rooms"
          role="tablist"
          aria-label="Brand Agent rooms"
        >
          {surfaces.map((surface) => {
            const isActive = surface.id === activeId;
            return (
              <button
                key={surface.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`mk-surface-panel-${surface.id}`}
                id={`mk-surface-tab-${surface.id}`}
                className={`mk-surfaces__room${isActive ? " is-active" : ""}`}
                onClick={() => setActiveId(surface.id)}
              >
                <span className="mk-surfaces__room-label">{surface.label}</span>
                <span className="mk-surfaces__room-name">{surface.name}</span>
                <span className="mk-surfaces__room-room">{surface.room}</span>
              </button>
            );
          })}
        </div>

        <div
          className="mk-surfaces__detail"
          id={`mk-surface-panel-${active.id}`}
          role="tabpanel"
          aria-live="polite"
          aria-labelledby={`mk-surface-tab-${active.id}`}
        >
          <header className="mk-surfaces__detail-head">
            <span className="mk-surfaces__detail-title">
              {active.detail.title}
            </span>
            <span>{active.detail.meta}</span>
          </header>
          <div className="mk-surfaces__transcript">
            {active.detail.transcript.map((line, idx) => (
              <div
                key={idx}
                className={`mk-surfaces__line mk-surfaces__line--${line.type}`}
              >
                <span className="mk-surfaces__line-tag">
                  {line.type === "user"
                    ? "Team"
                    : line.type === "agent"
                      ? "Agent"
                      : "How it runs"}
                </span>
                <span className="mk-surfaces__line-text">{line.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
