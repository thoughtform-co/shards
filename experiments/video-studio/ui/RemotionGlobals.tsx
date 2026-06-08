"use client";

import { useEffect } from "react";
import * as ReactImport from "react";
import * as ReactJsxRuntime from "react/jsx-runtime";
import * as Remotion from "remotion";

/* Bridges the studio page's bundled React + Remotion to dynamically
   imported agent compositions. Mount this once near the root of the
   Video Studio page tree — before any RemotionLivePreview can mount —
   so the import-map shim routes find the globals they re-export.

   Two effects:
   - Sets globalThis.__videoStudioGlobals to the real module instances.
     The module-shim route reads these at evaluation time.
   - Injects an inline <script type="importmap"> that maps the bare
     specifiers `react`, `react/jsx-runtime`, `remotion` to the shim
     routes. Modern browsers honor importmap insertions that precede
     any `import()` call, which is true here: the lazyComponent only
     fires once the user clicks Animate -> ready, well after mount. */

const IMPORTMAP_DATA_ATTR = "data-video-studio-importmap";

const IMPORTMAP = {
  imports: {
    react: "/api/experiments/video-studio/module-shim/react",
    "react/jsx-runtime":
      "/api/experiments/video-studio/module-shim/react-jsx-runtime",
    remotion: "/api/experiments/video-studio/module-shim/remotion",
  },
} as const;

declare global {
  // eslint-disable-next-line no-var
  var __videoStudioGlobals: Record<string, unknown> | undefined;
}

export function RemotionGlobals() {
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    globalThis.__videoStudioGlobals = {
      ...(globalThis.__videoStudioGlobals ?? {}),
      react: ReactImport,
      "react/jsx-runtime": ReactJsxRuntime,
      remotion: Remotion,
    };

    if (document.querySelector(`script[${IMPORTMAP_DATA_ATTR}]`)) {
      return;
    }

    const script = document.createElement("script");
    script.type = "importmap";
    script.setAttribute(IMPORTMAP_DATA_ATTR, "");
    script.textContent = JSON.stringify(IMPORTMAP);
    document.head.appendChild(script);
  }, []);

  return null;
}
