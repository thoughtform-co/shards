// Build standalone, self-contained HTML exports for the Stripe collection.
//
// Usage:
//   node scripts/build-exports.mjs
//
// Produces three files in ./exports/ that each open cleanly from file://,
// cross-link to each other via relative paths, and embed all assets.
//
// - exports/stripe.html                    access page / landing (two blocks)
// - exports/link-to-collect.html           Link / Collect product page
// - exports/link-to-collect-substrate.html Link / Skills substrate page

import { mkdir, readFile, writeFile, stat } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const srcCollect = resolve(root, "public", "link-to-collect.html");
const srcSubstrate = resolve(root, "public", "link-to-collect-substrate.html");
const srcBackdrop = resolve(root, "public", "images", "stripe-office-landing.webp");

const outDir = resolve(root, "exports");
const outStripe = resolve(outDir, "stripe.html");
const outCollect = resolve(outDir, "link-to-collect.html");
const outSubstrate = resolve(outDir, "link-to-collect-substrate.html");

await mkdir(outDir, { recursive: true });

// ── 1. link-to-collect.html — rewrite cross-links to relative paths ──────────
const collectHtml = (await readFile(srcCollect, "utf8"))
  .replaceAll(
    'href="/link-to-collect/substrate#',
    'href="./link-to-collect-substrate.html#',
  )
  .replaceAll(
    'href="/link-to-collect/substrate"',
    'href="./link-to-collect-substrate.html"',
  );

await writeFile(outCollect, collectHtml, "utf8");

// ── 2. link-to-collect-substrate.html — rewrite cross-links ──────────────────
const substrateHtml = (await readFile(srcSubstrate, "utf8"))
  .replaceAll(
    'href="/link-to-collect#',
    'href="./link-to-collect.html#',
  )
  .replaceAll(
    'href="/link-to-collect"',
    'href="./link-to-collect.html"',
  );

await writeFile(outSubstrate, substrateHtml, "utf8");

// ── 3. stripe.html — self-contained access/landing ───────────────────────────
const backdropBytes = await readFile(srcBackdrop);
const backdropDataUri = `data:image/webp;base64,${backdropBytes.toString("base64")}`;

const stripeHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Stripe collection — Link</title>
  <meta name="description" content="A small set of product surfaces encoding how Stripe collects invoices and the expertise behind it." />
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; }

    .scene {
      position: fixed;
      inset: 0;
      width: 100%;
      height: 100dvh;
      overflow: hidden;
      background: #f6f9fc;
      color: #0a2540;
      isolation: isolate;
      font-family: Inter, "Helvetica Neue", Arial, system-ui, sans-serif;
      font-feature-settings: "ss01", "cv11", "kern";
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      letter-spacing: -0.01em;
    }

    .backdrop {
      position: absolute;
      inset: 0;
      z-index: 0;
      animation: drift 26s ease-in-out infinite alternate;
    }

    .backdrop img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      display: block;
    }

    @keyframes drift {
      from { transform: scale(1.02) translate3d(0, 0, 0); }
      to   { transform: scale(1.06) translate3d(-1.4%, -0.5%, 0); }
    }

    .overlay {
      position: absolute;
      inset: 0;
      z-index: 1;
      pointer-events: none;
      background:
        linear-gradient(
          180deg,
          rgba(10, 37, 64, 0.16) 0%,
          rgba(10, 37, 64, 0.00) 30%,
          rgba(10, 37, 64, 0.00) 55%,
          rgba(10, 37, 64, 0.42) 100%
        ),
        radial-gradient(
          120% 80% at 16% 92%,
          rgba(10, 37, 64, 0.42) 0%,
          transparent 58%
        );
    }

    .marker-top {
      position: absolute;
      top: clamp(20px, 3vh, 32px);
      left: clamp(20px, 4vw, 40px);
      right: clamp(20px, 4vw, 40px);
      z-index: 3;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.78);
      font-weight: 500;
      pointer-events: none;
    }

    .marker-left {
      display: inline-flex;
      align-items: center;
      gap: 10px;
    }

    .marker-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #635bff;
      box-shadow: 0 0 0 3px rgba(99, 91, 255, 0.22);
    }

    .marker-right {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      color: rgba(255, 255, 255, 0.6);
    }

    .marker-sep {
      color: rgba(255, 255, 255, 0.36);
    }

    .landing {
      position: absolute;
      inset: auto auto clamp(28px, 5vh, 56px) clamp(28px, 5vw, 56px);
      z-index: 2;
      width: min(760px, calc(100% - clamp(40px, 8vw, 80px)));
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .cards {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
      animation: cardIn 480ms cubic-bezier(0.22, 0.61, 0.36, 1) both;
    }

    @keyframes cardIn {
      from { opacity: 0; transform: translateY(12px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .card-link {
      display: flex;
      flex-direction: column;
      gap: 10px;
      background: rgba(255, 255, 255, 0.96);
      backdrop-filter: saturate(140%) blur(10px);
      -webkit-backdrop-filter: saturate(140%) blur(10px);
      border: 1px solid rgba(10, 37, 64, 0.08);
      border-radius: 16px;
      padding: clamp(20px, 2.4vw, 28px);
      text-decoration: none;
      color: inherit;
      transition: transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
      box-shadow:
        0 1px 2px rgba(10, 37, 64, 0.06),
        0 12px 32px rgba(10, 37, 64, 0.16),
        0 32px 80px rgba(10, 37, 64, 0.22);
    }

    .card-link:hover,
    .card-link:focus-visible {
      outline: none;
      transform: translateY(-2px);
      border-color: rgba(99, 91, 255, 0.4);
      box-shadow:
        0 1px 2px rgba(10, 37, 64, 0.08),
        0 16px 38px rgba(10, 37, 64, 0.2),
        0 36px 90px rgba(10, 37, 64, 0.26);
    }

    .card-label {
      font-size: 10.5px;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: rgba(10, 37, 64, 0.45);
      font-weight: 700;
    }

    .card-headline {
      font-size: clamp(22px, 2.2vw, 28px);
      font-weight: 650;
      line-height: 1.08;
      letter-spacing: -0.028em;
      background: linear-gradient(120deg, #635bff, #00d66f);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      margin-top: 4px;
    }

    .card-title {
      font-size: 14px;
      font-weight: 650;
      letter-spacing: -0.012em;
      color: #0a2540;
    }

    .card-copy {
      font-size: 13.5px;
      line-height: 1.5;
      color: rgba(10, 37, 64, 0.62);
      max-width: 30ch;
    }

    .card-arrow {
      align-self: flex-end;
      font-size: 18px;
      color: #635bff;
      margin-top: 6px;
      transition: transform 0.18s ease;
    }

    .card-link:hover .card-arrow,
    .card-link:focus-visible .card-arrow {
      transform: translateX(3px);
    }

    @media (prefers-reduced-motion: reduce) {
      .backdrop,
      .cards { animation: none; }
      .card-link,
      .card-arrow { transition: none; }
    }

    @media (max-width: 720px) {
      .marker-top {
        font-size: 10px;
        letter-spacing: 0.14em;
      }
      .marker-right { display: none; }
      .landing {
        inset: auto clamp(16px, 4vw, 24px) clamp(20px, 4vh, 32px) clamp(16px, 4vw, 24px);
        width: auto;
      }
      .cards { grid-template-columns: 1fr; }
    }

    @media (max-width: 480px) {
      .marker-top {
        top: 16px;
        left: 16px;
        right: 16px;
      }
      .card-headline { font-size: 22px; }
    }
  </style>
</head>
<body>
  <main class="scene">
    <div class="backdrop" aria-hidden="true">
      <img src="${backdropDataUri}" alt="" />
    </div>
    <div class="overlay" aria-hidden="true"></div>

    <div class="marker-top" aria-hidden="true">
      <span class="marker-left">
        <span class="marker-dot"></span>
        link · stripe
        <span class="marker-sep">·</span>
        collection
      </span>
      <span class="marker-right">
        antwerp
        <span class="marker-sep">·</span>
        cet
      </span>
    </div>

    <div class="landing">
      <div class="cards">
        <a class="card-link" href="./link-to-collect.html">
          <span class="card-label">01 · Wallet</span>
          <span class="card-headline">How you pay.</span>
          <span class="card-title">Link / Collect</span>
          <span class="card-copy">Link sees the payments. Link Collect organises the invoices.</span>
          <span class="card-arrow" aria-hidden="true">&rarr;</span>
        </a>
        <a class="card-link" href="./link-to-collect-substrate.html">
          <span class="card-label">02 · Agent</span>
          <span class="card-headline">How you work.</span>
          <span class="card-title">Link / Skills</span>
          <span class="card-copy">An AI agent picks up the judgment behind the routines.</span>
          <span class="card-arrow" aria-hidden="true">&rarr;</span>
        </a>
      </div>
    </div>
  </main>
</body>
</html>
`;

await writeFile(outStripe, stripeHtml, "utf8");

// ── Report ───────────────────────────────────────────────────────────────────
const sizes = await Promise.all(
  [outStripe, outCollect, outSubstrate].map(async (p) => {
    const { size } = await stat(p);
    return { path: p.replace(`${root}\\`, "").replace(`${root}/`, ""), size };
  }),
);

for (const { path, size } of sizes) {
  console.log(`wrote: ${path} (${(size / 1024).toFixed(1)} KB)`);
}
