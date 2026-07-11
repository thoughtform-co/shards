"use client";

import { useEffect, useRef } from "react";

import { useKeyboardShortcuts } from "../../lib/hooks/useKeyboardShortcuts";
import { motionDocSchema } from "../../lib/motiondoc/schema";
import { useStudioStore } from "../../lib/store/useStudioStore";
import { Inspector } from "../inspector/Inspector";
import { ReviseBox } from "../inspector/ReviseBox";
import { PreviewPanel } from "../preview/PreviewPanel";
import { Timeline } from "../timeline/Timeline";

import { BriefPanel } from "./BriefPanel";
import { ExamplePicker } from "./ExamplePicker";
import { ExportHfDialog } from "./ExportHfDialog";
import { RenderDialog } from "./RenderDialog";
import { TopBar } from "./TopBar";

const AUTOSAVE_KEY = "motion-lab:doc";

export function StudioShell() {
  const doc = useStudioStore((s) => s.doc);
  const loadDoc = useStudioStore((s) => s.loadDoc);
  const hydratedRef = useRef(false);

  useKeyboardShortcuts();

  /* Restore the last session once, client-side. */
  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;
    try {
      const raw = window.localStorage.getItem(AUTOSAVE_KEY);
      if (!raw) return;
      const parsed = motionDocSchema.safeParse(JSON.parse(raw));
      if (parsed.success) loadDoc(parsed.data);
    } catch {
      /* corrupt autosave — ignore, examples remain */
    }
  }, [loadDoc]);

  /* Debounced autosave on any doc change. */
  useEffect(() => {
    if (!hydratedRef.current) return;
    const timer = window.setTimeout(() => {
      try {
        window.localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(doc));
      } catch {
        /* storage full/blocked — non-fatal */
      }
    }, 800);
    return () => window.clearTimeout(timer);
  }, [doc]);

  return (
    <div className="ml-shell">
      <TopBar renderSlot={<RenderDialog />} exportSlot={<ExportHfDialog />} />
      <div className="ml-main">
        <aside className="ml-sidebar">
          <BriefPanel />
          <ExamplePicker />
        </aside>
        <section className="ml-stage">
          <PreviewPanel />
        </section>
        <aside className="ml-inspector-region">
          <Inspector
            reviseSlot={(sceneId) => <ReviseBox key={sceneId} sceneId={sceneId} />}
          />
        </aside>
      </div>
      <section className="ml-timeline-region">
        <Timeline />
      </section>
    </div>
  );
}
