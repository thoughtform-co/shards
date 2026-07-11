"use client";

import { useState } from "react";

import { useStudioStore } from "../../lib/store/useStudioStore";

type ExportResult = {
  dir: string;
  notes: string[];
  stats: { sceneTweens: number; keyframeTweens: number };
};

/*
 * Export the current doc as a self-contained HyperFrames HTML folder
 * (the second engine path — Apache-2.0, no build step).
 */
export function ExportHfDialog() {
  const doc = useStudioStore((s) => s.doc);
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState<ExportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [working, setWorking] = useState(false);

  const exportHf = async () => {
    setOpen(true);
    setResult(null);
    setError(null);
    setWorking(true);
    try {
      const res = await fetch("/api/export/hyperframes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doc }),
      });
      const body = await res.json();
      if (!res.ok) {
        setError(body.error ?? "Export failed");
        return;
      }
      setResult(body);
    } catch {
      setError("Could not reach the export API.");
    } finally {
      setWorking(false);
    }
  };

  return (
    <>
      <button type="button" className="ml-btn" onClick={exportHf}>
        Export HyperFrames
      </button>

      {open ? (
        <div className="ml-dialog-overlay" onClick={() => setOpen(false)}>
          <div className="ml-dialog" onClick={(e) => e.stopPropagation()}>
            <h2 className="ml-dialog__title">HyperFrames export</h2>

            {working ? (
              <p className="ml-dialog__message">Translating…</p>
            ) : error ? (
              <p className="ml-dialog__error">{error}</p>
            ) : result ? (
              <>
                <p className="ml-dialog__message">
                  Written to <code>{result.dir}/index.html</code> (
                  {result.stats.keyframeTweens} keyframe tweens,{" "}
                  {result.stats.sceneTweens} scene transitions).
                </p>
                <p className="ml-dialog__hint">
                  Preview it (needs Node 22+):
                  <br />
                  <code>npx hyperframes preview {result.dir}</code>
                  <br />
                  Render it (also needs FFmpeg):
                  <br />
                  <code>npx hyperframes render {result.dir}</code>
                </p>
                {result.notes.length > 0 ? (
                  <div className="ml-dialog__hint">
                    Translation notes:
                    <ul className="ml-dialog__notes">
                      {result.notes.map((n) => (
                        <li key={n}>{n}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </>
            ) : null}

            <button
              type="button"
              className="ml-btn ml-dialog__close"
              onClick={() => setOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
