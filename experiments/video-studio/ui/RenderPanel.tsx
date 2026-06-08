"use client";

type RenderPanelProps = {
  isRendering: boolean;
  status: string;
  downloadUrl?: string;
  onRender: () => void;
};

export function RenderPanel({
  isRendering,
  status,
  downloadUrl,
  onRender,
}: RenderPanelProps) {
  return (
    <div>
      <div className="cw-vs__actions">
        <button
          type="button"
          className="aiop-button aiop-button--gold"
          disabled={isRendering}
          onClick={onRender}
        >
          {isRendering ? "Rendering…" : "Render MP4 locally"}
        </button>
        {downloadUrl ? (
          <a className="aiop-button aiop-button--ghost" href={downloadUrl}>
            Download MP4
            <span className="aiop-button__arrow" aria-hidden="true">
              &rarr;
            </span>
          </a>
        ) : null}
      </div>
      {status ? <p className="cw-vs__render-status">{status}</p> : null}
    </div>
  );
}
