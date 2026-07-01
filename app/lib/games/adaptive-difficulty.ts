/**
 * Adaptive Assessment Difficulty (#13)
 *
 * What: Chooses the next QUIZZZ difficulty tier from a learner's recent performance.
 * Why: Fixed, self-selected difficulty ignores how the learner is actually doing.
 *      This nudges difficulty toward the learner's level: strong recent accuracy
 *      serves harder questions, weak accuracy eases off — from existing PlayerSession
 *      data, so no new per-player state is stored.
 */

import mongoose from 'mongoose';
import { PlayerSession, Game } from '@/app/lib/models';

export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';

/** How many recent sessions define "recent". */
export const ADAPTIVE_RECENT_N = 5;

/**
 * Pure mapping from recent average accuracy (0-100) to a difficulty tier.
 * Exported for unit testing.
 */
export function difficultyForAccuracy(accuracyPct: number): Difficulty {
  if (accuracyPct < 50) return 'EASY';
  if (accuracyPct < 70) return 'MEDIUM';
  if (accuracyPct < 85) return 'HARD';
  return 'EXPERT';
}

/**
 * Resolve adaptive difficulty from a player's last N completed QUIZZZ sessions.
 * Anonymous players or those with no history get MEDIUM (a neutral starting point).
 */
export async function resolveAdaptiveDifficulty(playerId: string | null | undefined): Promise<Difficulty> {
  if (!playerId || !mongoose.isValidObjectId(playerId)) return 'MEDIUM';

  const game = await Game.findOne({ gameId: 'QUIZZZ' }).select('_id').lean();
  if (!game) return 'MEDIUM';

  const recent = await PlayerSession.find({
    playerId: new mongoose.Types.ObjectId(playerId),
    gameId: (game as { _id: mongoose.Types.ObjectId })._id,
    status: 'completed',
  })
    .sort({ sessionStart: -1 })
    .limit(ADAPTIVE_RECENT_N)
    .select('gameData.accuracy gameData.score gameData.maxScore')
    .lean();

  if (recent.length === 0) return 'MEDIUM';

  const accuracies = recent.map((s) => {
    const gd = (s as { gameData?: { accuracy?: number; score?: number; maxScore?: number } }).gameData || {};
    if (typeof gd.accuracy === 'number') return gd.accuracy;
    if (gd.maxScore && gd.maxScore > 0) return (Number(gd.score || 0) / gd.maxScore) * 100;
    return 50; // No usable signal for this session — treat as neutral.
  });

  const avg = accuracies.reduce((a, b) => a + b, 0) / accuracies.length;
  return difficultyForAccuracy(avg);
}
