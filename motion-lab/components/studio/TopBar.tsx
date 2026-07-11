"use client";

import { useRef, useState } from "react";

import { safeParseMotionDoc } from "../../lib/motiondoc/migrate";
import type { MotionDoc } from "../../lib/motiondoc/schema";
import { useStudioStore } from "../../lib/store/useStudioStore";
import { useStudioUiStore } from "../../lib/store/useStudioUiStore";
import { useWorkspaceSyncStore } from "../../lib/store/useWorkspaceSyncStore";

function slugify(title: string): string {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "motion-doc"
  );
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function TopBar({
  renderSlot,
  exportSlot,
}: {
  renderSlot?: React.ReactNode;
  exportSlot?: React.ReactNode;
}) {
  const doc = useStudioStore((state) => state.doc);
  const canUndo = useStudioStore((state) => state.past.length > 0);
  const canRedo = useStudioStore((state) => state.future.length > 0);
  const undo = useStudioStore((state) => state.undo);
  const redo = useStudioStore((state) => state.redo);
  const loadDoc = useStudioStore((state) => state.loadDoc);
  const leftOpen = useStudioUiStore((state) => state.leftOpen);
  const rightOpen = useStudioUiStore((state) => state.rightOpen);
  const setLeftOpen = useStudioUiStore((state) => state.setLeftOpen);
  const setRightOpen = useStudioUiStore((state) => state.setRightOpen);
  const jsonInput = useRef<HTMLInputElement>(null);
  const bundleInput = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState("");
  const workspaceStatus = useWorkspaceSyncStore((state) => state.status);

  const exportJson = () =>
    downloadBlob(
      new Blob([JSON.stringify(doc, null, 2)], { type: "application/json" }),
      `${slugify(doc.meta.title)}.motion.json`,
    );

  const importJson = async (file: File) => {
    try {
      const parsed = safeParseMotionDoc(JSON.parse(await file.text()));
      if (!parsed.success) throw new Error(parsed.error.issues[0]?.message);
      loadDoc(parsed.data);
      setStatus("JSON loaded");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Invalid JSON file");
    }
  };

  const exportBundle = async () => {
    setStatus("Packing project…");
    const response = await fetch("/api/project/export", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ doc }),
    });
    if (!response.ok) {
      const body = (await response.json()) as { error?: string };
      setStatus(body.error ?? "Could not export project");
      return;
    }
    downloadBlob(await response.blob(), `${slugify(doc.meta.title)}.motion.zip`);
    setStatus("Project saved");
  };

  const importBundle = async (file: File) => {
    setStatus("Opening project…");
    const form = new FormData();
    form.append("file", file);
    const response = await fetch("/api/project/import", { method: "POST", body: form });
    const body = (await response.json()) as { doc?: MotionDoc; error?: string };
    if (!response.ok || !body.doc) {
      setStatus(body.error ?? "Could not import project");
      return;
    }
    loadDoc(body.doc);
    setStatus("Project opened");
  };

  return (
    <header className="ml-topbar">
      <div className="ml-topbar__brand">
        <span className="ml-topbar__mark">ML</span>
        <span className="ml-topbar__wordmark">Motion Lab</span>
        <span className="ml-topbar__title" title={doc.meta.title}>{doc.meta.title}</span>
      </div>

      <div className="ml-topbar__group">
        <button className="ml-btn ml-btn--icon" onClick={() => setLeftOpen(!leftOpen)} title="Toggle tools">▤</button>
        <button className="ml-btn ml-btn--icon" onClick={() => setRightOpen(!rightOpen)} title="Toggle inspector">▥</button>
        <button className="ml-btn" onClick={undo} disabled={!canUndo} title="Undo (Ctrl+Z)">Undo</button>
        <button className="ml-btn" onClick={redo} disabled={!canRedo} title="Redo (Ctrl+Shift+Z)">Redo</button>
      </div>

      <div className="ml-topbar__group ml-topbar__group--right">
        <span
          className={`ml-workspace-badge ml-workspace-badge--${workspaceStatus}`}
          title="Agent workspace synchronization status"
        >
          {workspaceStatus === "synced" ? "Workspace synced" : workspaceStatus}
        </span>
        {status ? <span className="ml-topbar__status" title={status}>{status}</span> : null}
        <details className="ml-file-menu">
          <summary className="ml-btn">File</summary>
          <div className="ml-file-menu__popover">
            <button onClick={() => bundleInput.current?.click()}>Open project bundle</button>
            <button onClick={() => jsonInput.current?.click()}>Import JSON</button>
            <hr />
            <button onClick={() => void exportBundle()}>Save project bundle</button>
            <button onClick={exportJson}>Export JSON</button>
          </div>
        </details>
        <input
          ref={jsonInput}
          hidden
          type="file"
          accept=".json,application/json"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void importJson(file);
            event.target.value = "";
          }}
        />
        <input
          ref={bundleInput}
          hidden
          type="file"
          accept=".zip,.motion.zip,application/zip"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void importBundle(file);
            event.target.value = "";
          }}
        />
        {exportSlot}
        {renderSlot}
      </div>
    </header>
  );
}
