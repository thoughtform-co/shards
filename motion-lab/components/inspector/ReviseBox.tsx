"use client";

import { useState } from "react";

import { replaceScene } from "../../lib/motiondoc/mutate";
import { sceneSchema } from "../../lib/motiondoc/schema";
import { useStudioStore } from "../../lib/store/useStudioStore";

/*
 * "Revise with a note" — regenerates ONE scene through /api/revise
 * and splices it in as a single undoable commit. Iteration without
 * losing accepted work elsewhere.
 */
export function ReviseBox({ sceneId }: { sceneId: string }) {
  const doc = useStudioStore((s) => s.doc);
  const commitDoc = useStudioStore((s) => s.commitDoc);
  const select = useStudioStore((s) => s.select);
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<
    { state: "idle" } | { state: "working" } | { state: "error"; message: string }
  >({ state: "idle" });

  const working = status.state === "working";

  const revise = async () => {
    setStatus({ state: "working" });
    try {
      const res = await fetch("/api/revise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doc, sceneId, note }),
      });
      const body = await res.json();
      if (!res.ok) {
        setStatus({
          state: "error",
          message: body.error ?? `Revision failed (${res.status})`,
        });
        return;
      }
      const parsed = sceneSchema.safeParse(body.scene);
      if (!parsed.success) {
        setStatus({ state: "error", message: "Server returned an invalid scene." });
        return;
      }
      commitDoc(replaceScene(doc, sceneId, parsed.data));
      select({ type: "scene", sceneId: parsed.data.id });
      setNote("");
      setStatus({ state: "idle" });
    } catch {
      setStatus({ state: "error", message: "Could not reach /api/revise." });
    }
  };

  return (
    <div className="ml-revise">
      <h3 className="ml-panel__subtitle">Revise with a note</h3>
      <textarea
        className="ml-field__input ml-field__input--area"
        rows={3}
        placeholder="e.g. calmer — drop the bounce, slower entrances, hold the end card longer"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        disabled={working}
      />
      <button
        type="button"
        className="ml-btn"
        onClick={revise}
        disabled={working || note.trim().length < 3}
      >
        {working ? "Revising…" : "Revise this scene"}
      </button>
      {status.state === "error" ? (
        <p className="ml-panel__hint ml-panel__hint--error">{status.message}</p>
      ) : null}
    </div>
  );
}
