"use client";

type RenderPanelProps = {
  isRendering: boolean;
  status: string;
  downloadUrl?: string;
  onRender: () => void;
  disabled?: boolean;
  disabledHint?: string;
};

/* All controls live on one row: primary render, optional download,
   followed by a status/hint that truncates if it grows past the rail.
   Keeps the stage footer to a single line so the preview takes the
   vertical space. */
export function RenderPanel({
  isRendering,
  status,
  downloadUrl,
  onRender,
  disabled = false,
  disabledHint,
}: RenderPanelProps) {
  const inlineNote = isRendering ? status : status || (disabled ? disabledHint : "");

  return (
    <div className="cw-vs__render-row">
      <button
        type="button"
        className="aiop-button aiop-button--gold"
        disabled={isRendering || disabled}
        onClick={onRender}
      >
        {isRendering ? "Rendering…" : "Render MP4"}
      </button>
      {downloadUrl ? (
        <a className="aiop-button aiop-button--ghost" href={downloadUrl}>
          Download
          <span className="aiop-button__arrow" aria-hidden="true">
            &rarr;
          </span>
        </a>
      ) : null}
      {inlineNote ? (
        <span className="cw-vs__render-note" title={inlineNote}>
          {inlineNote}
        </span>
      ) : null}
    </div>
  );
}
