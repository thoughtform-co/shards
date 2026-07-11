"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useStudioStore } from "../../lib/store/useStudioStore";

type WireJob = {
  id: string;
  status: "queued" | "rendering" | "complete" | "failed";
  progress: number;
  message: string;
  filename?: string;
  error?: string;
};

/*
 * Render button + progress dialog. POSTs the current doc, then polls
 * the job until it completes and offers the MP4 download.
 */
export function RenderDialog() {
  const doc = useStudioStore((s) => s.doc);
  const [open, setOpen] = useState(false);
  const [job, setJob] = useState<WireJob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const pollRef = useRef<number | null>(null);

  const stopPolling = useCallback(() => {
    if (pollRef.current !== null) {
      window.clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  useEffect(() => stopPolling, [stopPolling]);

  const startRender = async () => {
    setOpen(true);
    setError(null);
    setJob(null);
    try {
      const res = await fetch("/api/render", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doc }),
      });
      const body = await res.json();
      if (!res.ok) {
        setError(body.error ?? "Render request failed");
        return;
      }
      const jobId: string = body.jobId;
      pollRef.current = window.setInterval(async () => {
        try {
          const statusRes = await fetch(`/api/render/${jobId}`);
          if (!statusRes.ok) return;
          const status: WireJob = await statusRes.json();
          setJob(status);
          if (status.status === "complete" || status.status === "failed") {
            stopPolling();
          }
        } catch {
          /* transient poll failure — keep going */
        }
      }, 750);
    } catch {
      setError("Could not reach the render API.");
    }
  };

  const close = () => {
    setOpen(false);
    stopPolling();
  };

  return (
    <>
      <button
        type="button"
        className="ml-btn ml-btn--primary"
        onClick={startRender}
      >
        Render MP4
      </button>

      {open ? (
        <div className="ml-dialog-overlay" onClick={close}>
          <div className="ml-dialog" onClick={(e) => e.stopPropagation()}>
            <h2 className="ml-dialog__title">Render</h2>

            {error ? (
              <p className="ml-dialog__error">{error}</p>
            ) : !job ? (
              <p className="ml-dialog__message">Submitting…</p>
            ) : job.status === "failed" ? (
              <>
                <p className="ml-dialog__error">
                  {job.error ?? "Render failed"}
                </p>
                <p className="ml-dialog__hint">
                  Check the terminal running <code>npm run dev</code> for the
                  full stack trace.
                </p>
              </>
            ) : job.status === "complete" ? (
              <>
                <p className="ml-dialog__message">Done.</p>
                <a
                  className="ml-btn ml-btn--primary"
                  href={`/api/render/${job.id}/file`}
                  download
                >
                  Download {job.filename ?? "render.mp4"}
                </a>
                <p className="ml-dialog__hint">
                  Also saved to <code>.renders/</code> inside motion-lab.
                </p>
              </>
            ) : (
              <>
                <div className="ml-progress">
                  <div
                    className="ml-progress__bar"
                    style={{ width: `${Math.round(job.progress * 100)}%` }}
                  />
                </div>
                <p className="ml-dialog__message">{job.message}</p>
              </>
            )}

            <button
              type="button"
              className="ml-btn ml-dialog__close"
              onClick={close}
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
