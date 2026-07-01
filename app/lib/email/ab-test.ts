/**
 * Email A/B variant selection (#11)
 *
 * What: Deterministically assigns each learner to variant A or B for an experiment.
 * Why: A learner must always receive the same variant (a re-send must not flip them),
 *      and assignment must be stable without storing state — a hash of
 *      (experimentId, playerId) gives an even A/B split that is reproducible.
 */

import { createHash } from 'crypto';

export type EmailVariant = 'A' | 'B';

/** Stable 50/50 variant for a given player + experiment. */
export function pickEmailVariant(playerId: string, experimentId: string): EmailVariant {
  const digest = createHash('sha256').update(`${experimentId}:${playerId}`).digest();
  return (digest[0] & 1) === 0 ? 'A' : 'B';
}
