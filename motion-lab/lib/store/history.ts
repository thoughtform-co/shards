import type { MotionDoc } from "../motiondoc/schema";

/*
 * Snapshot history. Docs are small JSON (a few hundred KB at the
 * absolute worst), so whole-document snapshots beat patch bookkeeping
 * on simplicity. One entry per user intention — drags snapshot once
 * per GESTURE (see the store's beginGesture/endGesture), not per
 * pointermove.
 */

export const HISTORY_CAP = 100;

export function pushHistory(past: MotionDoc[], snapshot: MotionDoc): MotionDoc[] {
  const next = past.length >= HISTORY_CAP ? past.slice(1) : past.slice();
  next.push(snapshot);
  return next;
}
