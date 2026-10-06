/*
 * The beat sheet. Every scene and every event sits on a frame, at 30 fps on
 * a 120 BPM grid: a beat is 15 frames, a half-beat 7.5 (rounded alternately
 * to 7 and 8), and the film is 52 beats, 780 frames, 26 seconds: 13 bars.
 *
 * Act one holds each slab of type for two beats, cuts the hunt on halves and
 * drops the pile-up one notification a beat; act two cuts every five to seven
 * beats. The switch is beat 23. The same tap lands three times: paying
 * (beat 2), approving Folio (beat 30), sending September (beat 42).
 * sound.py reads its cues from the same numbers, so a re-timed scene moves
 * its sound with it.
 */

export const FPS = 30;
export const BEAT = 15;
export const BEATS = 52;
export const FRAMES = BEAT * BEATS;

/* Beat to frame; halves round alternately so cuts never drift off the grid. */
export const b = (beat: number) => Math.round(beat * BEAT);

export const scenes = {
  pay: { from: b(0), to: b(5) },
  collect: { from: b(5), to: b(7) },
  hunt: { from: b(7), to: b(11) },
  twelve: { from: b(11), to: b(15) },
  pile: { from: b(15), to: b(21) },
  weeks: { from: b(21), to: b(23) },
  fetch: { from: b(23), to: b(26) },
  approve: { from: b(26), to: b(33) },
  arrive: { from: b(33), to: b(40) },
  ask: { from: b(40), to: b(45) },
  end: { from: b(45), to: b(52) },
} as const;

export type SceneKey = keyof typeof scenes;

/* Events, absolute frames. */
export const events = {
  payTap: b(2),
  huntCuts: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5].map((h) => b(7 + h)),
  twelveA: b(11),
  twelveB: b(13),
  pileDrops: [0, 1, 2, 3, 4].map((h) => b(15 + h)),
  weeks: b(21),
  switch: b(23),
  fetchLine2: b(24.5),
  approveIn: b(26),
  approveTap: b(30),
  arriveDocs: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5].map((h) => b(33.5 + h)),
  arriveTotal: b(37.5),
  askTap: b(42),
  end: b(45),
};
