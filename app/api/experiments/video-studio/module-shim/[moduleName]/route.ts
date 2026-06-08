import { NextResponse } from "next/server";

export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{ moduleName: string }>;
}

/* Module shims bridge the browser's `import 'remotion'` (from the
   agent-authored composition) to the studio page's loaded React +
   Remotion instances. We enumerate the named exports per module
   because ESM `export const X = obj.X` is eager — and we need the
   shim to resolve AFTER the studio page has set globalThis.__videoStudioGlobals.

   The cleanest answer is to make the shim a tiny script that grabs
   the parent module reference once and re-exports every named binding
   we care about. The list is conservative; if the agent needs an API
   we missed, the prompt steers it to a known-good subset. */

type ShimSpec = {
  globalKey: "react" | "react/jsx-runtime" | "remotion";
  exports: string[];
  withDefault?: boolean;
};

const SHIMS: Record<string, ShimSpec> = {
  remotion: {
    globalKey: "remotion",
    exports: [
      "AbsoluteFill",
      "Audio",
      "Composition",
      "Easing",
      "Folder",
      "Freeze",
      "Img",
      "IFrame",
      "Loop",
      "OffthreadVideo",
      "Sequence",
      "Series",
      "Still",
      "Video",
      "continueRender",
      "delayRender",
      "getInputProps",
      "getRemotionEnvironment",
      "interpolate",
      "interpolateColors",
      "measureSpring",
      "prefetch",
      "random",
      "registerRoot",
      "spring",
      "staticFile",
      "useCurrentFrame",
      "useDelayRender",
      "useVideoConfig",
    ],
  },
  react: {
    globalKey: "react",
    exports: [
      "Children",
      "Component",
      "Fragment",
      "PureComponent",
      "StrictMode",
      "Suspense",
      "cloneElement",
      "createContext",
      "createElement",
      "createRef",
      "forwardRef",
      "isValidElement",
      "lazy",
      "memo",
      "startTransition",
      "useCallback",
      "useContext",
      "useDebugValue",
      "useDeferredValue",
      "useEffect",
      "useId",
      "useImperativeHandle",
      "useInsertionEffect",
      "useLayoutEffect",
      "useMemo",
      "useReducer",
      "useRef",
      "useState",
      "useSyncExternalStore",
      "useTransition",
      "version",
    ],
    withDefault: true,
  },
  // Route segments can't contain `/`; map flat names back to real ones.
  "react-jsx-runtime": {
    globalKey: "react/jsx-runtime",
    exports: ["jsx", "jsxs", "Fragment"],
  },
};

function buildShimSource(spec: ShimSpec): string {
  // Pull the module reference once at top of the shim, then expose
  // each named export. If __videoStudioGlobals isn't set yet, throw
  // loudly so the developer sees the bootstrap-order bug clearly.
  const globalKey = JSON.stringify(spec.globalKey);
  const lines: string[] = [
    `const g = (globalThis.__videoStudioGlobals || (globalThis.__videoStudioGlobals = {}));`,
    `const mod = g[${globalKey}];`,
    `if (!mod) { throw new Error("Video Studio: __videoStudioGlobals[" + ${globalKey} + "] is not set. Mount <RemotionGlobals /> before importing agent compositions."); }`,
  ];

  for (const name of spec.exports) {
    const key = JSON.stringify(name);
    lines.push(`export const ${name} = mod[${key}];`);
  }

  if (spec.withDefault) {
    lines.push("export default mod.default ?? mod;");
  }

  return lines.join("\n") + "\n";
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { moduleName } = await params;
  const spec = SHIMS[moduleName];

  if (!spec) {
    return NextResponse.json(
      { error: `Unknown module shim: ${moduleName}` },
      { status: 404 },
    );
  }

  const source = buildShimSource(spec);

  return new NextResponse(source, {
    headers: {
      "Content-Type": "text/javascript; charset=utf-8",
      // Cache aggressively — the shim never changes per session, only
      // the global it reads from. Vary by URL only.
      "Cache-Control": "public, max-age=3600",
    },
  });
}
