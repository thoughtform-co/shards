"use client";

import { useRef } from "react";

import { motionDocSchema } from "../../lib/motiondoc/schema";
import { useStudioStore } from "../../lib/store/useStudioStore";

function slugify(title: string): string {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "motion-doc"
  );
}

export function TopBar({
  renderSlot,
  exportSlot,
}: {
  /** Render button mounts here (P3). */
  renderSlot?: React.ReactNode;
  /** HyperFrames export button mounts here (P8). */
  exportSlot?: React.ReactNode;
}) {
  const doc = useStudioStore((s) => s.doc);
  const canUndo = useStudioStore((s) => s.past.length > 0);
  const canRedo = useStudioStore((s) => s.future.length > 0);
  const undo = useStudioStore((s) => s.undo);
  const redo = useStudioStore((s) => s.redo);
  const loadDoc = useStudioStore((s) => s.loadDoc);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(doc, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${slugify(doc.meta.title)}.motion.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJson = async (file: File) => {
    try {
      const parsed = motionDocSchema.safeParse(JSON.parse(await file.text()));
      if (!parsed.success) {
        window.alert(
          `Not a valid motion doc:\n${parsed.error.issues
            .slice(0, 5)
            .map((i) => `${i.path.join(".")}: ${i.message}`)
            .join("\n")}`,
        );
        return;
      }
      loadDoc(parsed.data);
    } catch {
      window.alert("Could not parse that file as JSON.");
    }
  };

  return (
    <header className="ml-topbar">
      <div className="ml-topbar__brand">
        <span className="ml-topbar__dot" />
        <span className="ml-topbar__wordmark">MOTION LAB</span>
        <span className="ml-topbar__title" title={doc.meta.title}>
          {doc.meta.title}
        </span>
      </div>

      <div className="ml-topbar__group">
        <button
          type="button"
          className="ml-btn"
          onClick={undo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
        >
          ↩ Undo
        </button>
        <button
          type="button"
          className="ml-btn"
          onClick={redo}
          disabled={!canRedo}
          title="Redo (Ctrl+Shift+Z)"
        >
          Redo ↪
        </button>
      </div>

      <div className="ml-topbar__group ml-topbar__group--right">
        <button
          type="button"
          className="ml-btn"
          onClick={() => fileInputRef.current?.click()}
        >
          Import JSON
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void importJson(file);
            e.target.value = "";
          }}
        />
        <button type="button" className="ml-btn" onClick={exportJson}>
          Export JSON
        </button>
        {exportSlot}
        {renderSlot}
      </div>
    </header>
  );
}
