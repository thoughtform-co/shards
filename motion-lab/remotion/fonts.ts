import { loadFont as loadPlexMono } from "@remotion/google-fonts/IBMPlexMono";
import { loadFont as loadPlexSans } from "@remotion/google-fonts/IBMPlexSans";

/*
 * Loaded from the interpreter so the SAME font files reach both the
 * in-app <Player> preview and the headless render browser — without
 * this, renders silently fall back to system fonts and stop matching
 * the preview. Brand font stacks reference these families by name.
 */
export function loadBundledFonts(): void {
  loadPlexSans("normal", {
    weights: ["400", "500", "600", "700"],
    subsets: ["latin", "latin-ext"],
  });
  loadPlexMono("normal", {
    weights: ["400", "500", "600"],
    subsets: ["latin", "latin-ext"],
  });
}
