"use client";

import { useKeyboardShortcuts } from "../../lib/hooks/useKeyboardShortcuts";
import { useWorkspaceSync } from "../../lib/hooks/useWorkspaceSync";
import { useStudioUiStore } from "../../lib/store/useStudioUiStore";
import { Inspector } from "../inspector/Inspector";
import { ReviseBox } from "../inspector/ReviseBox";
import { PreviewPanel } from "../preview/PreviewPanel";
import { Timeline } from "../timeline/Timeline";

import { ExportHfDialog } from "./ExportHfDialog";
import { PanelResizeHandle } from "./PanelResizeHandle";
import { RenderDialog } from "./RenderDialog";
import { TopBar } from "./TopBar";
import { WorkspacePanel } from "./WorkspacePanel";

export function StudioShell() {
  const leftOpen = useStudioUiStore((state) => state.leftOpen);
  const rightOpen = useStudioUiStore((state) => state.rightOpen);
  const leftWidth = useStudioUiStore((state) => state.leftWidth);
  const rightWidth = useStudioUiStore((state) => state.rightWidth);
  const timelineHeight = useStudioUiStore((state) => state.timelineHeight);
  const setLeftOpen = useStudioUiStore((state) => state.setLeftOpen);
  const setRightOpen = useStudioUiStore((state) => state.setRightOpen);
  const setLeftWidth = useStudioUiStore((state) => state.setLeftWidth);
  const setRightWidth = useStudioUiStore((state) => state.setRightWidth);
  const setTimelineHeight = useStudioUiStore((state) => state.setTimelineHeight);

  useKeyboardShortcuts();
  useWorkspaceSync();

  return (
    <div
      className="ml-shell"
      style={{
        gridTemplateRows: `48px minmax(0, 1fr) 4px ${timelineHeight}px`,
      }}
    >
      <TopBar renderSlot={<RenderDialog />} exportSlot={<ExportHfDialog />} />
      <div
        className="ml-main"
        style={{
          gridTemplateColumns: `${leftOpen ? leftWidth : 42}px ${leftOpen ? 4 : 0}px minmax(0, 1fr) ${rightOpen ? 4 : 0}px ${rightOpen ? rightWidth : 42}px`,
        }}
      >
        {leftOpen ? (
          <WorkspacePanel />
        ) : (
          <button
            className="ml-collapsed-rail"
            type="button"
            onClick={() => setLeftOpen(true)}
            title="Open workspace tools"
          >
            +
          </button>
        )}
        {leftOpen ? (
          <PanelResizeHandle
            axis="x"
            onDelta={(delta) => setLeftWidth(leftWidth + delta)}
          />
        ) : null}
        <section className="ml-stage">
          <PreviewPanel />
        </section>
        {rightOpen ? (
          <PanelResizeHandle
            axis="x"
            invert
            onDelta={(delta) => setRightWidth(rightWidth + delta)}
          />
        ) : null}
        {rightOpen ? (
          <aside className="ml-inspector-region">
            <button
              type="button"
              className="ml-panel-collapse"
              onClick={() => setRightOpen(false)}
              title="Collapse inspector"
            >
              ×
            </button>
            <Inspector
              reviseSlot={(sceneId) => <ReviseBox key={sceneId} sceneId={sceneId} />}
            />
          </aside>
        ) : (
          <button
            className="ml-collapsed-rail"
            type="button"
            onClick={() => setRightOpen(true)}
            title="Open inspector"
          >
            ◫
          </button>
        )}
      </div>
      <PanelResizeHandle
        axis="y"
        invert
        onDelta={(delta) => setTimelineHeight(timelineHeight + delta)}
      />
      <section className="ml-timeline-region">
        <Timeline />
      </section>
    </div>
  );
}
