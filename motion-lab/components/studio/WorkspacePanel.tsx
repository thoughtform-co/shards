"use client";

import { useRef, useState } from "react";

import {
  addBlankScene,
  addElement,
  isAssetReferenced,
  removeAsset,
  upsertAssets,
} from "../../lib/motiondoc/mutate";
import { newId } from "../../lib/motiondoc/ids";
import type { MotionAsset, MotionElement, Scene } from "../../lib/motiondoc/schema";
import { sceneIndexAtFrame } from "../../lib/motiondoc/timing";
import { useStudioStore } from "../../lib/store/useStudioStore";
import {
  type StudioLeftTab,
  useStudioUiStore,
} from "../../lib/store/useStudioUiStore";

import { BriefPanel } from "./BriefPanel";
import { AgentPanel } from "./AgentPanel";
import { ExamplePicker } from "./ExamplePicker";

const ACCEPT = ".png,.jpg,.jpeg,.webp,.svg,.woff,.woff2,.ttf,.otf";

function activeScene(): Scene {
  const state = useStudioStore.getState();
  const selectedSceneId =
    state.selection.type === "none" ? undefined : state.selection.sceneId;
  const selected =
    selectedSceneId
      ? state.doc.scenes.find((scene) => scene.id === selectedSceneId)
      : undefined;
  return selected ?? state.doc.scenes[sceneIndexAtFrame(state.doc, state.playhead)];
}

function imageSize(asset: MotionAsset, scene: Scene) {
  const doc = useStudioStore.getState().doc;
  const maxW = doc.meta.width * 0.5;
  const maxH = doc.meta.height * 0.5;
  const width = asset.width ?? maxW;
  const height = asset.height ?? maxH;
  const scale = Math.min(1, maxW / width, maxH / height);
  return { width: Math.max(1, width * scale), height: Math.max(1, height * scale) };
}

function makeBase(scene: Scene) {
  return {
    id: newId("el"),
    x: useStudioStore.getState().doc.meta.width / 2,
    y: useStudioStore.getState().doc.meta.height / 2,
    scale: 1,
    rotation: 0,
    opacity: 1,
    transformOrigin: "center" as const,
    inFrame: 0,
    outFrame: scene.durationInFrames,
    visible: true,
    locked: false,
    tracks: [],
  };
}

function addNewElement(element: MotionElement) {
  const state = useStudioStore.getState();
  const scene = activeScene();
  state.commitDoc(addElement(state.doc, scene.id, element));
  state.select({ type: "element", sceneId: scene.id, elementId: element.id });
}

function AssetsTab() {
  const doc = useStudioStore((state) => state.doc);
  const commitDoc = useStudioStore((state) => state.commitDoc);
  const fileInput = useRef<HTMLInputElement>(null);
  const folderInput = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");

  const upload = async (files: File[]) => {
    if (files.length === 0) return;
    setStatus(`Importing ${files.length} file${files.length === 1 ? "" : "s"}…`);
    const form = new FormData();
    files.forEach((file) => form.append("files", file));
    try {
      const response = await fetch("/api/assets", { method: "POST", body: form });
      const body = (await response.json()) as { assets?: MotionAsset[]; error?: string };
      if (!response.ok || !body.assets) throw new Error(body.error ?? "Upload failed");
      commitDoc(upsertAssets(useStudioStore.getState().doc, body.assets));
      setStatus(`${body.assets.length} asset${body.assets.length === 1 ? "" : "s"} ready`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Upload failed");
    }
  };

  const shown = doc.assets.filter((asset) =>
    asset.originalName.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div
      className="ml-library"
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        void upload([...event.dataTransfer.files]);
      }}
    >
      <div className="ml-library__actions">
        <button className="ml-btn ml-btn--primary" onClick={() => fileInput.current?.click()}>
          Import files
        </button>
        <button className="ml-btn" onClick={() => folderInput.current?.click()}>
          Import folder
        </button>
      </div>
      <input
        ref={fileInput}
        hidden
        type="file"
        accept={ACCEPT}
        multiple
        onChange={(event) => {
          void upload([...(event.target.files ?? [])]);
          event.target.value = "";
        }}
      />
      <input
        ref={(node) => {
          folderInput.current = node;
          if (node) node.setAttribute("webkitdirectory", "");
        }}
        hidden
        type="file"
        multiple
        onChange={(event) => {
          void upload([...(event.target.files ?? [])]);
          event.target.value = "";
        }}
      />
      <input
        className="ml-library__search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search assets"
      />
      {status ? <p className="ml-library__status">{status}</p> : null}
      {shown.length === 0 ? (
        <div className="ml-library__empty">
          <strong>Drop assets here</strong>
          <span>PNG, JPEG, WebP, SVG and local fonts up to 25 MB.</span>
        </div>
      ) : (
        <div className="ml-library__grid">
          {shown.map((asset) => {
            const referenced = isAssetReferenced(doc, asset.id);
            return (
              <article key={asset.id} className="ml-asset-card">
                <button
                  className="ml-asset-card__preview"
                  type="button"
                  draggable={asset.kind === "image"}
                  onDragStart={(event) =>
                    event.dataTransfer.setData("text/motion-asset", asset.id)
                  }
                  disabled={asset.kind !== "image"}
                  onClick={() => {
                    if (asset.kind !== "image") return;
                    const scene = activeScene();
                    const size = imageSize(asset, scene);
                    addNewElement({
                      ...makeBase(scene),
                      kind: "image",
                      name: asset.originalName,
                      assetId: asset.id,
                      src: asset.src,
                      width: size.width,
                      height: size.height,
                      fit: "contain",
                      radius: 0,
                    });
                  }}
                  title={asset.kind === "image" ? "Add to active scene" : "Font asset"}
                >
                  {asset.kind === "image" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={asset.src} alt="" />
                  ) : (
                    <span className="ml-asset-card__font">Aa</span>
                  )}
                </button>
                <div className="ml-asset-card__meta">
                  <span title={asset.originalName}>{asset.originalName}</span>
                  <button
                    type="button"
                    disabled={referenced}
                    title={referenced ? "Used by this project" : "Remove asset"}
                    onClick={async () => {
                      const response = await fetch("/api/assets", {
                        method: "DELETE",
                        headers: { "content-type": "application/json" },
                        body: JSON.stringify({ src: asset.src }),
                      });
                      if (response.ok) commitDoc(removeAsset(doc, asset.id));
                    }}
                  >
                    ×
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

function CreateTab() {
  const doc = useStudioStore((state) => state.doc);
  const commitDoc = useStudioStore((state) => state.commitDoc);
  const select = useStudioStore((state) => state.select);
  const setLeftTab = useStudioUiStore((state) => state.setLeftTab);
  const scene = activeScene();
  const addText = () =>
    addNewElement({
      ...makeBase(scene),
      kind: "text",
      name: "Text",
      text: "New text",
      fontSize: 72,
      font: "heading",
      fontWeight: 700,
      color: "$text",
      align: "center",
    });
  const addShape = (shape: "rect" | "ellipse") =>
    addNewElement({
      ...makeBase(scene),
      kind: "shape",
      name: shape === "rect" ? "Rectangle" : "Ellipse",
      shape,
      width: 320,
      height: shape === "rect" ? 180 : 220,
      fill: "$accent",
      radius: shape === "rect" ? 20 : 0,
    });

  return (
    <div className="ml-create-grid">
      <button onClick={addText}><span>T</span>Text</button>
      <button onClick={() => addShape("rect")}><span>▭</span>Rectangle</button>
      <button onClick={() => addShape("ellipse")}><span>●</span>Ellipse</button>
      <button onClick={() => setLeftTab("assets")}><span>▧</span>Image</button>
      <button
        onClick={() => {
          const next = addBlankScene(doc, scene.id);
          const added = next.scenes[next.scenes.findIndex((item) => item.id === scene.id) + 1];
          commitDoc(next);
          if (added) select({ type: "scene", sceneId: added.id });
        }}
      >
        <span>＋</span>Blank scene
      </button>
    </div>
  );
}

function AiTab() {
  return (
    <div className="ml-ai-stack">
      <BriefPanel />
      <ExamplePicker />
    </div>
  );
}

const TABS: { id: StudioLeftTab; label: string }[] = [
  { id: "assets", label: "Assets" },
  { id: "create", label: "Create" },
  { id: "ai", label: "AI" },
  { id: "agent", label: "Agent" },
];

export function WorkspacePanel() {
  const tab = useStudioUiStore((state) => state.leftTab);
  const setTab = useStudioUiStore((state) => state.setLeftTab);
  return (
    <aside className="ml-workspace-panel">
      <nav className="ml-workspace-tabs" aria-label="Workspace tools">
        {TABS.map((item) => (
          <button
            key={item.id}
            className={tab === item.id ? "is-active" : ""}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>
      <div className="ml-workspace-panel__content">
        {tab === "assets" ? (
          <AssetsTab />
        ) : tab === "create" ? (
          <CreateTab />
        ) : tab === "ai" ? (
          <AiTab />
        ) : (
          <AgentPanel />
        )}
      </div>
    </aside>
  );
}
