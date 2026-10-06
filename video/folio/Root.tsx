import { useEffect, useState } from "react";
import { cancelRender, Composition, continueRender, delayRender } from "remotion";

import "@/app/folio/folio.css";
import "@/components/folio/mocks.css";
import "./film.css";

import { FPS, FRAMES } from "./beats";
import { FolioLaunch } from "./FolioLaunch";

/*
 * The page loads Inter Tight and Source Code Pro as variable fonts through
 * next/font, and headlines sit at weights between the static cuts (380,
 * 550). The film loads the same variable files so the type renders at the
 * page's weights, and holds every frame until both faces are in.
 */
const FONTS =
  "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@100..900&family=Source+Code+Pro:wght@200..900&display=block";

function Film() {
  const [handle] = useState(() => delayRender("Loading Inter Tight and Source Code Pro"));
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = FONTS;
    link.onload = () => {
      Promise.all([
        document.fonts.load('400 16px "Inter Tight"'),
        document.fonts.load('600 16px "Inter Tight"'),
        document.fonts.load('400 16px "Source Code Pro"'),
      ])
        .then(() => document.fonts.ready)
        .then(() => continueRender(handle))
        .catch((err) => cancelRender(err));
    };
    link.onerror = () => cancelRender(new Error("Font stylesheet failed to load"));
    document.head.appendChild(link);
  }, [handle]);
  return <FolioLaunch />;
}

export function Root() {
  return (
    <>
      <Composition id="FolioLaunch" component={Film} durationInFrames={FRAMES} fps={FPS} width={540} height={675} />
      <Composition id="FolioLaunchWide" component={Film} durationInFrames={FRAMES} fps={FPS} width={960} height={540} />
    </>
  );
}
