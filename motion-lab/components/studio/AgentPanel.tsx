"use client";

import { useState } from "react";

import {
  useWorkspaceSyncStore,
  workspaceActions,
} from "../../lib/store/useWorkspaceSyncStore";

const STARTER_PROMPT = `Read AGENTS.md and skill/motion-design/SKILL.md first. Work with the active video in workspace/project.motion.json. Preserve existing IDs, keep MotionDoc v2 valid, and run the documented checks before finishing.`;

const STATUS_LABELS = {
  booting: "Connecting",
  saving: "Saving",
  synced: "Synced",
  external: "Agent edit loaded",
  conflict: "Conflict",
  invalid: "Invalid file",
  fallback: "Browser backup",
} as const;

export function AgentPanel() {
  const { status, revision, updatedAt, paths, message, conflict } =
    useWorkspaceSyncStore();
  const [copied, setCopied] = useState("");

  const copy = async (value: string, label: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(label);
    window.setTimeout(() => setCopied(""), 1_500);
  };

  return (
    <div className="ml-agent-panel">
      <section className="ml-agent-card">
        <div className="ml-agent-status-row">
          <span className={`ml-agent-status ml-agent-status--${status}`}>
            {STATUS_LABELS[status]}
          </span>
          {revision ? <code>{revision.slice(0, 8)}</code> : null}
        </div>
        <p>
          Motion Lab and your coding agent share one validated MotionDoc. Changes made on
          disk arrive as a single undo step.
        </p>
        {message ? <div className="ml-agent-message">{message}</div> : null}
        {updatedAt ? (
          <small>Last synchronized {new Date(updatedAt).toLocaleTimeString()}</small>
        ) : null}
      </section>

      <section className="ml-agent-card">
        <h3>Point your agent here</h3>
        <label>
          Folder
          <code className="ml-agent-path">{paths?.root ?? "Connecting..."}</code>
        </label>
        <label>
          Active project
          <code className="ml-agent-path">
            {paths?.project ?? "workspace/project.motion.json"}
          </code>
        </label>
        <div className="ml-agent-actions">
          <button className="ml-btn" onClick={() => void workspaceActions.revealFolder()}>
            Reveal folder
          </button>
          <button
            className="ml-btn"
            disabled={!paths?.root}
            onClick={() => paths?.root && void copy(paths.root, "path")}
          >
            {copied === "path" ? "Copied" : "Copy path"}
          </button>
        </div>
      </section>

      <section className="ml-agent-card">
        <h3>Starter prompt</h3>
        <p className="ml-agent-prompt">{STARTER_PROMPT}</p>
        <button
          className="ml-btn ml-btn--primary"
          onClick={() => void copy(STARTER_PROMPT, "prompt")}
        >
          {copied === "prompt" ? "Prompt copied" : "Copy for Codex / Claude / Cursor"}
        </button>
      </section>

      {status === "conflict" || status === "invalid" ? (
        <section className="ml-agent-card ml-agent-card--warning">
          <h3>{status === "conflict" ? "Choose which version wins" : "Repair the disk file"}</h3>
          <p>
            Motion Lab did not overwrite either version. Keep the editor version or load
            the latest valid document from disk.
          </p>
          <div className="ml-agent-actions">
            <button
              className="ml-btn ml-btn--primary"
              onClick={() => void workspaceActions.keepEditorVersion()}
            >
              Keep editor
            </button>
            <button
              className="ml-btn"
              disabled={status === "conflict" && !conflict?.remoteDoc}
              onClick={() => void workspaceActions.useDiskVersion()}
            >
              Load disk
            </button>
          </div>
        </section>
      ) : null}

      <section className="ml-agent-card">
        <h3>Workspace controls</h3>
        <div className="ml-agent-actions">
          <button className="ml-btn" onClick={() => void workspaceActions.saveNow()}>
            Save now
          </button>
          <button className="ml-btn" onClick={() => void workspaceActions.reloadFromDisk()}>
            Reload disk
          </button>
        </div>
        <p>
          Use <strong>Start Motion Lab</strong> for normal editing. Use <strong>Agent Dev</strong>
          when an agent changes application source and needs hot reload or a rebuild.
        </p>
      </section>
    </div>
  );
}
