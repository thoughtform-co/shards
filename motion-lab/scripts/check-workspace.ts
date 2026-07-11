import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { EXAMPLES } from "../lib/examples";
import { useStudioStore } from "../lib/store/useStudioStore";
import {
  readWorkspaceProject,
  workspacePaths,
  writeWorkspaceProject,
} from "../lib/workspace/server";

async function main() {
  const root = await mkdtemp(path.join(os.tmpdir(), "motion-lab-workspace-"));
  try {
    assert.equal((await readWorkspaceProject(root)).state, "missing");

    const original = structuredClone(EXAMPLES[0].doc);
    const first = await writeWorkspaceProject({ doc: original, force: true, root });
    assert.equal(first.state, "written");
    if (first.state !== "written") throw new Error("Initial write failed");

    const changed = structuredClone(original);
    changed.meta.title = "External agent revision";
    const second = await writeWorkspaceProject({
      doc: changed,
      expectedRevision: first.project.revision,
      root,
    });
    assert.equal(second.state, "written");
    if (second.state !== "written") throw new Error("Second write failed");
    assert.notEqual(second.project.revision, first.project.revision);

    const stale = await writeWorkspaceProject({
      doc: original,
      expectedRevision: first.project.revision,
      root,
    });
    assert.equal(stale.state, "conflict");

    const loaded = await readWorkspaceProject(root);
    assert.equal(loaded.state, "valid");
    if (loaded.state === "valid") {
      assert.equal(loaded.project.doc.meta.title, "External agent revision");
    }

    const store = useStudioStore.getState();
    store.loadDoc(original);
    useStudioStore.getState().applyExternalDoc(changed);
    assert.equal(useStudioStore.getState().doc.meta.title, "External agent revision");
    assert.equal(useStudioStore.getState().past.length, 1);
    useStudioStore.getState().undo();
    assert.equal(useStudioStore.getState().doc.meta.title, original.meta.title);

    await writeFile(workspacePaths(root).project, "{ invalid", "utf8");
    const invalid = await readWorkspaceProject(root);
    assert.equal(invalid.state, "invalid");

    console.log("Workspace atomic write, conflict, validation, and external undo checks passed.");
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

void main();
