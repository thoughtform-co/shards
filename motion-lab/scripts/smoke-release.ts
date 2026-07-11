import assert from "node:assert/strict";

import { EXAMPLES } from "../lib/examples";

const baseUrl = process.env.MOTION_LAB_URL ?? "http://127.0.0.1:3221";

async function waitForServer() {
  for (let attempt = 0; attempt < 90; attempt += 1) {
    try {
      const response = await fetch(baseUrl);
      if (response.ok) return;
    } catch {
      // Continue polling while the packaged server boots.
    }
    await new Promise((resolve) => setTimeout(resolve, 1_000));
  }
  throw new Error(`Packaged server did not start at ${baseUrl}`);
}

async function requireStatus(response: Response, expected: number, label: string) {
  if (response.status !== expected) {
    throw new Error(`${label} failed (${response.status}): ${await response.text()}`);
  }
}

async function main() {
  await waitForServer();
  assert.equal((await fetch(baseUrl)).status, 200);
  assert.equal((await fetch(`${baseUrl}/api/config`)).status, 200);

  const doc = structuredClone(EXAMPLES[2].doc);
  const firstWrite = await fetch(`${baseUrl}/api/workspace/project`, {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ doc, force: true }),
  });
  await requireStatus(firstWrite, 200, "Initial workspace write");
  const first = (await firstWrite.json()) as { revision: string };

  const unchanged = await fetch(`${baseUrl}/api/workspace/project`, {
    headers: { "if-none-match": `"${first.revision}"` },
  });
  assert.equal(unchanged.status, 304);

  const changed = structuredClone(doc);
  changed.meta.title = `${doc.meta.title} native release`;
  const secondWrite = await fetch(`${baseUrl}/api/workspace/project`, {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ doc: changed, expectedRevision: first.revision }),
  });
  await requireStatus(secondWrite, 200, "Second workspace write");

  const staleWrite = await fetch(`${baseUrl}/api/workspace/project`, {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ doc, expectedRevision: first.revision }),
  });
  assert.equal(staleWrite.status, 409);

  const render = await fetch(`${baseUrl}/api/render`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ doc: changed }),
  });
  await requireStatus(render, 200, "Render start");
  const { jobId } = (await render.json()) as { jobId: string };

  let complete = false;
  for (let attempt = 0; attempt < 300; attempt += 1) {
    await new Promise((resolve) => setTimeout(resolve, 1_000));
    const statusResponse = await fetch(`${baseUrl}/api/render/${jobId}`);
    assert.equal(statusResponse.status, 200);
    const status = (await statusResponse.json()) as {
      status: string;
      error?: string;
    };
    if (status.status === "failed") throw new Error(status.error ?? "Native render failed");
    if (status.status === "complete") {
      complete = true;
      break;
    }
  }
  assert.equal(complete, true, "Native render timed out");
  const video = await fetch(`${baseUrl}/api/render/${jobId}/file`);
  assert.equal(video.status, 200);
  assert.equal((await video.arrayBuffer()).byteLength > 10_000, true);

  console.log("Packaged runtime, ETag, conflict, and native MP4 smoke checks passed.");
}

void main();
