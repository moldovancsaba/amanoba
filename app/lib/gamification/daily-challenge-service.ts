/**
 * Daily Challenge Service
 *
 * Purpose: Ensure today's daily challenges exist and provide shared utilities
 * Why: Avoid duplicate logic and guarantee challenges are available before tracking progress
 */

import { DailyChallenge } from '../models/daily-challenge';
import logger from '../logger';

/**
 * Ensure today's challenges exist (UTC day) and return them
 *
 * What: Creates a default set if none exist yet today
 * Why: Progress updates may occur before the challenges page is visited
 */
export async function ensureDailyChallengesForToday(session?: import('mongoose').mongo.ClientSession) {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

  // Check existing
  let challenges = await DailyChallenge.find({
    date: { $gte: today, $lt: tomorrow },
    'availability.isActive': true,
  })
    .sort({ difficulty: 1 })
    .session(session || null);

  if (challenges.length > 0) {
    return { challenges, today, tomorrow };
  }

  // Create defaults (kept intentionally simple for MVP)
  const base = [
    {
      type: 'games_played',
      difficulty: 'easy',
      title: 'Warm Up',
      description: 'Play 2 games today',
      target: 2,
      points: 25,
      xp: 25,
    },
    {
      type: 'games_won',
      difficulty: 'medium',
      title: 'First Victory',
      description: 'Win 1 game today',
      target: 1,
      points: 50,
      xp: 50,
    },
    {
      type: 'points_earned',
      difficulty: 'hard',
      title: 'Point Hunter',
      description: 'Earn 150 points today',
      target: 150,
      points: 100,
      xp: 100,
    },
  ] as const;

  const toInsert = base.map((b) => ({
    date: today,
    type: b.type,
    difficulty: b.difficulty,
    title: b.title,
    description: b.description,
    requirement: { target: b.target },
    rewards: { points: b.points, xp: b.xp },
    availability: { startTime: today, endTime: tomorrow, isActive: true },
    completions: { total: 0, percentage: 0 },
    metadata: { createdAt: new Date(), updatedAt: new Date() },
  }));

  await DailyChallenge.insertMany(toInsert, { session: session || undefined });

  challenges = await DailyChallenge.find({
    date: { $gte: today, $lt: tomorrow },
    'availability.isActive': true,
  })
    .sort({ difficulty: 1 })
    .session(session || null);

  logger.info(
    { count: challenges.length, date: today.toISOString() },
    'Created default daily challenges for today'
  );

  return { challenges, today, tomorrow };
}