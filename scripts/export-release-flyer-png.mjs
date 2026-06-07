import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { dirname, extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const htmlFile = "exports/release-thoughtform-bold-notice.html";
const outFile = resolve(root, "exports/release-thoughtform-bold-notice.png");

const mime = {
  ".html": "text/html; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".css": "text/css",
  ".js": "text/javascript",
};

function startServer() {
  return new Promise((resolvePromise) => {
    const server = createServer(async (req, res) => {
      try {
        const urlPath = decodeURIComponent((req.url ?? "/").split("?")[0]);
        const rel = urlPath === "/" ? htmlFile : urlPath.replace(/^\//, "");
        const filePath = resolve(root, rel);
        if (!filePath.startsWith(root)) {
          res.writeHead(403);
          res.end("Forbidden");
          return;
        }
        const body = await readFile(filePath);
        res.writeHead(200, {
          "Content-Type": mime[extname(filePath)] ?? "application/octet-stream",
        });
        res.end(body);
      } catch {
        res.writeHead(404);
        res.end("Not found");
      }
    });

    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      resolvePromise({ server, port });
    });
  });
}

const { server, port } = await startServer();
const url = `http://127.0.0.1:${port}/${htmlFile}`;

try {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    deviceScaleFactor: 4,
    viewport: { width: 900, height: 1200 },
  });

  await page.goto(url, { waitUntil: "networkidle" });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.waitForTimeout(300);

  const flyer = page.locator(".page");
  await flyer.screenshot({
    path: outFile,
    type: "png",
    animations: "disabled",
  });

  await browser.close();
  console.log(`wrote: ${outFile}`);
} finally {
  server.close();
}
