"use client";

import { getUseCase } from "@/content/intelligence-layer";
import { useRole } from "./role-context";
import { UseCaseTabs } from "./use-case-tabs";
import { useUseCase } from "./use-cases-context";

/**
 * 03 Substrate Gallery — the reframe section.
 *
 * Header + tab strip on top, then a three-column showcase below:
 *
 *   [ data sources ]  [ substrate console ]  [ interfaces ]
 *                       (with a small headless bridge between
 *                        the console and the interfaces)
 *
 * The whole showcase swaps when the active case (or active role)
 * changes; we use `key={`${role.id}-${selectedId}`}` on the body so
 * React fully remounts and the cross-fade animation keys off a fresh
 * element. Below the showcase, a three-cell promises strip stays
 * constant per role (Captured · Owned · Portable).
 */
export function SubstrateGallery() {
  const { role } = useRole();
  const { selectedId } = useUseCase();
  const { galleryCopy } = role;
  const c = getUseCase(role, selectedId);
  const panelKey = `${role.id}-${selectedId}`;

  return (
    <section
      className="section je-gallery-section"
      id="substrate-gallery"
      aria-labelledby="gallery-title"
    >
      <div className="wrap">
        <header className="section-head reveal">
          {galleryCopy.eyebrow ? (
            <p className="eyebrow eyebrow--violet">{galleryCopy.eyebrow}</p>
          ) : null}
          <h2 className="section-title" id="gallery-title">
            {galleryCopy.titlePre} <em>{galleryCopy.titleEm}</em>
          </h2>
          <p className="section-intro">{galleryCopy.lede}</p>
        </header>

        <div className="je-gallery reveal">
          <UseCaseTabs
            ariaLabel="Pick a use case to swap the substrate showcase"
            panelId="je-gallery-panel"
          />

          <div
            id="je-gallery-panel"
            className="je-gallery__panel"
            role="tabpanel"
            aria-labelledby={`je-tab-je-gallery-panel-${selectedId}`}
            key={panelKey}
          >
            <div
              className="je-gallery__showcase"
              aria-label={`${c.shortName} substrate showcase`}
            >
              <aside className="je-gallery__flank je-gallery__flank--left">
                <span className="je-gallery__flank-label">
                  {galleryCopy.flankLabels.sources}
                </span>
                <ul className="je-gallery__systems" role="list">
                  {c.sources.map((src) => (
                    <li key={src.name} className="je-gallery__system">
                      <span
                        className="je-gallery__system-glyph"
                        aria-hidden="true"
                      />
                      <span className="je-gallery__system-name">
                        {src.name}
                      </span>
                      <span className="je-gallery__system-kind">
                        {src.kind}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="je-gallery__flank-note">
                  What {c.shortName} already has.
                </p>
              </aside>

              <article className="je-gallery__console">
                <header className="je-gallery__console-head">
                  <span className="je-gallery__console-title">
                    {c.consoleTitle}
                  </span>
                  <span className="je-gallery__console-badge">Headless</span>
                </header>
                <p className="je-gallery__console-framing">
                  Encoded judgment over {c.shortName}'s own sources.
                </p>
                <ul className="je-gallery__rows" role="list">
                  {c.substrate.map((row) => (
                    <li
                      key={row.tag}
                      className="je-gallery__row"
                      data-row={row.tag}
                    >
                      <span className="je-gallery__row-tag">{row.tag}</span>
                      <span className="je-gallery__row-sample">
                        {row.sample}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="je-gallery__console-caption">
                  {c.consoleCaption}
                </p>
              </article>

              <div className="je-gallery__bridge" aria-hidden="true">
                <span className="je-gallery__bridge-rail" />
                <span className="je-gallery__bridge-badge">
                  <span className="je-gallery__bridge-dot" />
                  <span className="je-gallery__bridge-label">
                    {galleryCopy.bridgeBadge}
                  </span>
                </span>
                <span className="je-gallery__bridge-arrow">→</span>
                <span className="je-gallery__bridge-caption">
                  {galleryCopy.bridgeCaption}
                </span>
              </div>

              <aside className="je-gallery__flank je-gallery__flank--right">
                <span className="je-gallery__flank-label">
                  {galleryCopy.flankLabels.interfaces}
                </span>
                <ul className="je-gallery__interfaces" role="list">
                  {c.surfaces.map((s) => (
                    <li
                      key={s.name}
                      className={`je-gallery__interface${
                        s.thumbnail
                          ? " je-gallery__interface--thumbnail"
                          : ""
                      }`}
                    >
                      {s.thumbnail ? (
                        <span
                          className="je-gallery__interface-thumb"
                          aria-hidden="true"
                          style={{ backgroundImage: `url("${s.thumbnail}")` }}
                        />
                      ) : (
                        <span
                          className="je-gallery__interface-glyph"
                          aria-hidden="true"
                        >
                          {s.glyph}
                        </span>
                      )}
                      <span className="je-gallery__interface-name">
                        {s.name}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="je-gallery__flank-note">{c.surfacesNote}</p>
              </aside>
            </div>
          </div>
        </div>

        <div className="je-gallery__promises reveal" role="list">
          {galleryCopy.promises.map((p) => (
            <div key={p.strong} className="je-gallery__promise" role="listitem">
              <strong>{p.strong}</strong>
              <span>{p.body}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
