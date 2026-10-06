/*
 * Print the beat sheet as JSON for sound.py, so picture and sound read their
 * frames from one file.  npx tsx video/folio/cues.ts > video/folio/out/cues.json
 */
import { BEAT, events, FPS, FRAMES, scenes } from "./beats";

console.log(JSON.stringify({ fps: FPS, beat: BEAT, frames: FRAMES, scenes, events }, null, 2));
