import { registerRoot } from "remotion";

import { RemotionRoot } from "./Root";

/*
 * Bundler entry point — @remotion/bundler points here (see
 * lib/render/renderer.ts). The in-app <Player> never loads this file;
 * it imports MotionComposition directly.
 */
registerRoot(RemotionRoot);
