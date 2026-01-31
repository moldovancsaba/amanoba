/**
 * Achievement Engine
 * 
 * Purpose: Check, unlock, and track player achievements
 * Why: Automates achievement unlocking and progress tracking
 * 
 * Features:
 * - Achievement criteria evaluation
 * - Progress tracking for incremental achievements
 * - Batch checking for efficiency
 * - Achievement unlock notifications
 */

import mongoose from 'mongoose';
import { Achievement, AchievementUnlock, PlayerProgression } from '@/lib/models';
import { IAchievement } from '@/lib/models/achievement';
import { IPlayerProgression } from '@/lib/models/player-progression';
import { logger } from '@/lib/logger';

/**
 * Interface: Achievement Check Context
 * Why: All data needed to evaluate achievement criteria
 */
export interface AchievementCheckContext {
  playerId: mongoose.Types.ObjectId;
  gameId?: mongoose.Types.ObjectId;
  progression: IPlayerProgression;
  recentSession?: {
    score: number;
    maxScore: number;
    accuracy?: number;
    duration: number;
    outcome: 'win' | 'loss' | 'draw';
  };
  /** For course-specific achievements (first_lesson, lessons_completed, course_completed, course_master, perfect_assessment, lesson_streak). */
  courseId?: string;
  courseProgress?: {
    lessonsCompleted: number;
    status: string;
    /** Longest consecutive lesson streak (e.g. days 1,2,3,4 -> 4). Used for lesson_streak. */
    lessonStreak?: number;
  };
  /** Final exam score (0–100). Used for perfect_assessment (100% on final exam). */
  finalExamScorePercent?: number;
}

/**
 * Interface: Achievement Unlock Result
 * Why: Details of newly unlocked achievements
 */
export interface AchievementUnlockResult {
  achievement: IAchievement;
  unlockedAt: Date;
  rewards: {
    points: number;
    xp: number;
    title?: string;
  };
  wasAlreadyUnlocked: boolean;
}

/**
 * Longest consecutive lesson streak from completed day numbers.
 * E.g. [1,2,3,5,6] -> 3 (days 1,2,3 or 5,6; max is 3).
 */
function computeLessonStreak(completedDays: number[]): number {
  if (completedDays.length === 0) return 0;
  const sorted = [...completedDays].sort((a, b) => a - b);
  let max = 1;
  let current = 1;
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === sorted[i - 1] + 1) {
      current += 1;
      max = Math.max(max, current);
    } else {
      current = 1;
    }
  }
  return max;
}

/**
 * Check and unlock achievements for a player
 * 
 * What: Evaluates all active achievements and unlocks eligible ones
 * Why: Ensures players get credit for achievements as soon as earned
 */
export async function checkAndUnlockAchievements(
  context: AchievementCheckContext
): Promise<AchievementUnlockResult[]> {
  const results: AchievementUnlockResult[] = [];
  
  try {
    // Get all active achievements
    const achievements = await Achievement.find({
      'metadata.isActive': true,
    }).lean();
    
    // Get player's existing achievement unlocks
    const existingUnlocks = await AchievementUnlock.find({
      playerId: context.playerId,
    }).lean();
    
    const unlockedIds = new Set(
      existingUnlocks.map(u => u.achievementId.toString())
    );
    
    // Check each achievement
    for (const achievement of achievements) {
      const achievementId = achievement._id.toString();
      const isUnlocked = unlockedIds.has(achievementId);
      
      // Skip if already fully unlocked
      if (isUnlocked) {
        const unlock = existingUnlocks.find(
          u => u.achievementId.toString() === achievementId
        );
        if (unlock && unlock.progress >= 100) {
          continue;
        }
      }
      
      // Evaluate achievement criteria
      const evaluation = evaluateAchievementCriteria(
        achievement as unknown as IAchievement,
        context
      );
      
      if (evaluation.meetsRequirements) {
        // Unlock or update achievement
        logger.info(
          {
            achievement: achievement.name,
            currentValue: evaluation.currentValue,
            targetValue: evaluation.targetValue,
            playerId: context.playerId,
          },
          '🎉 UNLOCKING ACHIEVEMENT'
        );
        
        const result = await unlockAchievement(
          context.playerId,
          achievement as unknown as IAchievement,
          evaluation.currentValue,
          context.recentSession
            ? new mongoose.Types.ObjectId() // Source session ID
            : undefined
        );
        
        if (result) {
          results.push(result);
        }
      } else if (evaluation.currentValue > 0) {
        // Update progress for incremental achievements
        await updateAchievementProgress(
          context.playerId,
          achievement._id as mongoose.Types.ObjectId,
          evaluation.currentValue,
          evaluation.progress
        );
      }
    }
    
    logger.info(
      { playerId: context.playerId, unlockedCount: results.length },
      'Achievement check completed'
    );
    
    return results;
  } catch (error) {
    logger.error({ err: error, playerId: context.playerId }, 'Achievement check failed');
    throw error;
  }
}

/**
 * Evaluate if achievement criteria are met
 * 
 * What: Checks if player meets achievement unlock requirements
 * Why: Centralized criteria evaluation logic
 */
export function evaluateAchievementCriteria(
  achievement: IAchievement,
  context: AchievementCheckContext
): {
  meetsRequirements: boolean;
  currentValue: number;
  targetValue: number;
  progress: number;
} {
  const criteria = achievement.criteria;
  let currentValue = 0;
  const targetValue = criteria.target;
  
  // Game-specific achievements
  if (criteria.gameId && context.gameId) {
    if (criteria.gameId.toString() !== context.gameId.toString()) {
      return {
        meetsRequirements: false,
        currentValue: 0,
        targetValue,
        progress: 0,
      };
    }
  }

  // Course-specific achievements: require courseProgress when criteria is course-scoped
  const courseCriteriaTypes = ['first_lesson', 'lessons_completed', 'course_completed', 'course_master', 'perfect_assessment', 'lesson_streak'];
  if (courseCriteriaTypes.includes(criteria.type)) {
    const criteriaCourseId = (criteria as { courseId?: string }).courseId?.toUpperCase?.();
    if (criteriaCourseId && context.courseId && criteriaCourseId !== context.courseId.toUpperCase()) {
      return { meetsRequirements: false, currentValue: 0, targetValue, progress: 0 };
    }
    if (!context.courseProgress) {
      return { meetsRequirements: false, currentValue: 0, targetValue, progress: 0 };
    }
    const { lessonsCompleted, status } = context.courseProgress;
    switch (criteria.type) {
      case 'first_lesson':
        currentValue = lessonsCompleted >= 1 ? 1 : 0;
        break;
      case 'lessons_completed':
        currentValue = lessonsCompleted;
        break;
      case 'course_completed':
        currentValue = status === 'completed' ? 1 : 0;
        break;
      case 'course_master':
        currentValue = status === 'completed' ? 1 : 0; // Same as course_completed; can later add perfect/final-exam
        break;
      case 'perfect_assessment':
        // 100% on final exam and course completed
        currentValue =
          status === 'completed' && context.finalExamScorePercent === 100 ? 1 : 0;
        break;
      case 'lesson_streak':
        // Longest consecutive lesson streak (e.g. complete days 1,2,3,4 -> 4)
        currentValue = context.courseProgress?.lessonStreak ?? 0;
        break;
      default:
        break;
    }
    const progressOut = targetValue > 0 ? Math.min(100, (currentValue / targetValue) * 100) : 0;
    const meetsOut = currentValue >= targetValue;
    if (process.env.NODE_ENV !== 'production') {
      logger.debug(
        { achievement: achievement.name, criteriaType: criteria.type, currentValue, targetValue, meetsRequirements: meetsOut },
        'Course achievement criteria evaluated'
      );
    }
    return { meetsRequirements: meetsOut, currentValue, targetValue, progress: progressOut };
  }
  
  // Evaluate based on criteria type
  switch (criteria.type) {
    case 'games_played':
      currentValue = context.progression.statistics.totalGamesPlayed;
      break;
      
    case 'wins':
      currentValue = context.progression.statistics.totalWins;
      break;
      
    case 'streak':
      currentValue = context.progression.statistics.currentStreak;
      break;
      
    case 'points_earned':
      // This requires querying PointsWallet - simplified for now
      currentValue = 0; // Would need wallet lookup
      break;
      
    case 'level_reached':
      currentValue = context.progression.level;
      break;
      
    case 'perfect_score':
      if (context.recentSession) {
        currentValue = context.recentSession.score === context.recentSession.maxScore ? 1 : 0;
      }
      break;
      
    case 'speed':
      // Game-specific speed requirements
      if (context.recentSession) {
        // Would need game configuration to evaluate
        currentValue = 0;
      }
      break;
      
    case 'accuracy':
      if (context.recentSession && context.recentSession.accuracy !== undefined) {
        currentValue = context.recentSession.accuracy >= targetValue ? 1 : 0;
      }
      break;
      
    case 'custom':
      // Custom achievements need special handling
      currentValue = 0;
      break;
  }
  
  const progress = targetValue > 0 ? Math.min(100, (currentValue / targetValue) * 100) : 0;
  const meetsRequirements = currentValue >= targetValue;

  if (process.env.NODE_ENV !== 'production') {
    logger.debug(
      {
        achievement: achievement.name,
        criteriaType: criteria.type,
        currentValue,
        targetValue,
        meetsRequirements,
        stats: context.progression?.statistics
          ? {
              gamesPlayed: context.progression.statistics.totalGamesPlayed,
              wins: context.progression.statistics.totalWins,
              streak: context.progression.statistics.currentStreak,
              level: context.progression.level,
            }
          : undefined,
      },
      meetsRequirements ? 'Achievement criteria MET' : 'Achievement criteria NOT MET'
    );
  }

  return {
    meetsRequirements,
    currentValue,
    targetValue,
    progress,
  };
}

/**
 * Unlock an achievement for a player
 * 
 * What: Creates achievement unlock record and updates counts
 * Why: Persists achievement unlock with rewards
 */
async function unlockAchievement(
  playerId: mongoose.Types.ObjectId,
  achievement: IAchievement,
  currentValue: number,
  sourceSessionId?: mongoose.Types.ObjectId
): Promise<AchievementUnlockResult | null> {
  try {
    const now = new Date();
    
    // Create or update unlock record
    const unlock = await AchievementUnlock.findOneAndUpdate(
      {
        playerId,
        achievementId: achievement._id,
      },
      {
        playerId,
        achievementId: achievement._id,
        unlockedAt: now,
        progress: 100,
        currentValue,
        sourceSessionId,
        'metadata.createdAt': now,
        'metadata.notified': false,
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );
    
    const wasAlreadyUnlocked = unlock.progress === 100 && 
                               unlock.unlockedAt < now;
    
    if (!wasAlreadyUnlocked) {
      // Increment unlock count on achievement
      await Achievement.findByIdAndUpdate(achievement._id, {
        $inc: { 'metadata.unlockCount': 1 },
      });
      
      // Update player progression achievement count
      await PlayerProgression.findOneAndUpdate(
        { playerId },
        {
          $inc: { 'achievements.totalUnlocked': 1 },
          $push: {
            'achievements.recentUnlocks': {
              $each: [
                {
                  achievementId: achievement._id,
                  unlockedAt: now,
                },
              ],
              $slice: -5, // Keep only last 5
            },
          },
        }
      );
      
      logger.info(
        {
          playerId,
          achievementId: achievement._id,
          achievementName: achievement.name,
        },
        'Achievement unlocked'
      );
    }
    
    return {
      achievement,
      unlockedAt: now,
      rewards: {
        points: achievement.rewards.points,
        xp: achievement.rewards.xp,
        title: achievement.rewards.title,
      },
      wasAlreadyUnlocked,
    };
  } catch (error) {
    logger.error(
      { err: error, playerId, achievementId: achievement._id },
      'Failed to unlock achievement'
    );
    return null;
  }
}

/**
 * Update progress for an incremental achievement
 * 
 * What: Updates progress without fully unlocking
 * Why: Shows players how close they are to unlock
 */
async function updateAchievementProgress(
  playerId: mongoose.Types.ObjectId,
  achievementId: mongoose.Types.ObjectId,
  currentValue: number,
  progress: number
): Promise<void> {
  try {
    await AchievementUnlock.findOneAndUpdate(
      {
        playerId,
        achievementId,
      },
      {
        currentValue,
        progress,
        'metadata.createdAt': new Date(),
      },
      {
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );
  } catch (error) {
    logger.error(
      { err: error, playerId, achievementId },
      'Failed to update achievement progress'
    );
  }
}

/**
 * Get player's achievement completion rate
 * 
 * What: Calculates % of achievements unlocked
 * Why: Gamification metric for profiles/leaderboards
 */
export async function getAchievementCompletionRate(
  playerId: mongoose.Types.ObjectId
): Promise<{
  unlocked: number;
  total: number;
  percentage: number;
}> {
  const [unlocked, total] = await Promise.all([
    AchievementUnlock.countDocuments({
      playerId,
      progress: { $gte: 100 },
    }),
    Achievement.countDocuments({
      'metadata.isActive': true,
    }),
  ]);
  
  return {
    unlocked,
    total,
    percentage: total > 0 ? (unlocked / total) * 100 : 0,
  };
}

/**
 * Get achievements by category for a player
 * 
 * What: Retrieves achievements grouped by category with progress
 * Why: UI display for achievement screen
 */
export async function getPlayerAchievementsByCategory(
  playerId: mongoose.Types.ObjectId
): Promise<
  Map<
    string,
    Array<{
      achievement: IAchievement;
      progress: number;
      isUnlocked: boolean;
      unlockedAt?: Date;
    }>
  >
> {
  const achievements = await Achievement.find({
    'metadata.isActive': true,
  })
    .sort({ category: 1, tier: 1 })
    .lean();
  
  const unlocks = await AchievementUnlock.find({
    playerId,
  }).lean();
  
  const unlockMap = new Map(
    unlocks.map(u => [u.achievementId.toString(), u])
  );
  
  const grouped = new Map<string, Array<{ achievement: IAchievement; progress: number; isUnlocked: boolean; unlockedAt?: Date }>>();
  
  for (const achievement of achievements) {
    const unlock = unlockMap.get(achievement._id.toString());
    const category = achievement.category;
    
    if (!grouped.has(category)) {
      grouped.set(category, []);
    }
    
    grouped.get(category)!.push({
      achievement: achievement as unknown as IAchievement,
      progress: unlock?.progress || 0,
      isUnlocked: (unlock?.progress || 0) >= 100,
      unlockedAt: unlock?.unlockedAt,
    });
  }
  
  return grouped;
}

/**
 * Check and unlock course-specific achievements (First Lesson, Week 1, lessons_completed, course_completed, course_master).
 * Call after lesson completion or course completion so milestones unlock.
 *
 * @param playerId - The player
 * @param courseIdStr - Course ID string (e.g. from API)
 * @returns Array of newly unlocked achievements
 */
export async function checkAndUnlockCourseAchievements(
  playerId: mongoose.Types.ObjectId,
  courseIdStr: string
): Promise<AchievementUnlockResult[]> {
  const results: AchievementUnlockResult[] = [];
  const courseIdUpper = String(courseIdStr || '').toUpperCase();
  if (!courseIdUpper) return results;

  try {
    const { Course, CourseProgress, PlayerProgression } = await import('@/lib/models');
    const course = await Course.findOne({ courseId: courseIdUpper }).lean();
    if (!course) return results;
    const courseObjectId = new mongoose.Types.ObjectId(String((course as { _id: unknown })._id));

    const progress = await CourseProgress.findOne({
      playerId,
      courseId: courseObjectId,
    }).lean();
    if (!progress) return results;

    const progression = await PlayerProgression.findOne({ playerId }).lean();
    if (!progression) return results;

    const completedDays = Array.isArray((progress as { completedDays?: number[] }).completedDays)
      ? (progress as { completedDays: number[] }).completedDays
      : [];
    const lessonsCompleted = completedDays.length;
    const status = String((progress as { status?: string }).status ?? 'not_started');

    // Longest consecutive lesson streak (e.g. days 1,2,3,4 -> 4)
    const lessonStreak = computeLessonStreak(completedDays);

    let finalExamScorePercent: number | undefined;
    if (status === 'completed') {
      const { FinalExamAttempt } = await import('@/lib/models');
      const latestAttempt = await FinalExamAttempt.findOne({
        playerId,
        courseId: courseObjectId,
        status: 'GRADED',
      })
        .sort({ submittedAtISO: -1 })
        .limit(1)
        .lean();
      const score = (latestAttempt as { scorePercentInteger?: number } | null)?.scorePercentInteger;
      if (typeof score === 'number') finalExamScorePercent = score;
    }

    const courseCriteriaTypes = ['first_lesson', 'lessons_completed', 'course_completed', 'course_master', 'perfect_assessment', 'lesson_streak'];
    const achievements = await Achievement.find({
      'metadata.isActive': true,
      'criteria.type': { $in: courseCriteriaTypes },
      $or: [
        { 'criteria.courseId': { $exists: false } },
        { 'criteria.courseId': { $in: [null, ''] } },
        { 'criteria.courseId': courseIdUpper },
      ],
    }).lean();

    const existingUnlocks = await AchievementUnlock.find({
      playerId,
      achievementId: { $in: achievements.map((a) => a._id) },
    }).lean();
    const unlockedIds = new Set(
      existingUnlocks.filter((u) => u.progress >= 100).map((u) => u.achievementId.toString())
    );

    const context: AchievementCheckContext = {
      playerId,
      progression: progression as unknown as IPlayerProgression,
      courseId: courseIdUpper,
      courseProgress: { lessonsCompleted, status, lessonStreak },
      ...(finalExamScorePercent !== undefined && { finalExamScorePercent }),
    };

    for (const achievement of achievements) {
      const achievementId = achievement._id.toString();
      if (unlockedIds.has(achievementId)) continue;

      const evaluation = evaluateAchievementCriteria(
        achievement as unknown as IAchievement,
        context
      );
      if (!evaluation.meetsRequirements) continue;

      logger.info(
        {
          achievement: (achievement as { name?: string }).name,
          playerId,
          courseId: courseIdUpper,
          currentValue: evaluation.currentValue,
          targetValue: evaluation.targetValue,
        },
        'Unlocking course achievement'
      );
      const result = await unlockAchievement(
        playerId,
        achievement as unknown as IAchievement,
        evaluation.currentValue,
        undefined
      );
      if (result) {
        results.push(result);
        unlockedIds.add(achievementId);
      }
    }

    return results;
  } catch (error) {
    logger.error(
      { err: error, playerId, courseId: courseIdStr },
      'Failed to check course achievements'
    );
    return results;
  }
}

/**
 * Check and unlock course completion achievements
 * 
 * What: Unlocks achievements when a course is completed
 * Why: Rewards players for completing courses
 * 
 * @param playerId - The player who completed the course
 * @param courseId - The course that was completed
 * @returns Array of unlocked achievements
 */
export async function checkAndUnlockCourseCompletionAchievements(
  playerId: mongoose.Types.ObjectId,
  courseId: mongoose.Types.ObjectId
): Promise<AchievementUnlockResult[]> {
  const results: AchievementUnlockResult[] = [];
  
  try {
    // Import CourseProgress here to avoid circular dependencies
    const { CourseProgress } = await import('../models');
    
    // Verify course is actually completed
    const progress = await CourseProgress.findOne({
      playerId,
      courseId,
    }).lean();
    
    if (!progress || progress.status !== 'completed') {
      logger.info(
        { playerId, courseId, status: progress?.status },
        'Course not completed, skipping achievement check'
      );
      return results;
    }
    
    // Find course completion achievements
    // Look for achievements with "course" or "completion" in name, or custom criteria
    const courseCompletionAchievements = await Achievement.find({
      'metadata.isActive': true,
      $or: [
        { name: { $regex: /course.*complet|complet.*course/i } },
        { 
          criteria: { 
            type: 'custom',
            condition: { $regex: /course.*complet|complet.*course/i }
          }
        },
      ],
    }).lean();
    
    if (courseCompletionAchievements.length === 0) {
      logger.info(
        { playerId, courseId },
        'No course completion achievements found'
      );
      return results;
    }
    
    // Get existing unlocks
    const existingUnlocks = await AchievementUnlock.find({
      playerId,
      achievementId: { $in: courseCompletionAchievements.map(a => a._id) },
    }).lean();
    
    const unlockedIds = new Set(
      existingUnlocks
        .filter(u => u.progress >= 100)
        .map(u => u.achievementId.toString())
    );
    
    // Unlock achievements that aren't already unlocked
    for (const achievement of courseCompletionAchievements) {
      const achievementId = achievement._id.toString();
      
      if (unlockedIds.has(achievementId)) {
        continue; // Already unlocked
      }
      
      logger.info(
        {
          playerId,
          courseId,
          achievementId,
          achievementName: achievement.name,
        },
        '🎉 UNLOCKING COURSE COMPLETION ACHIEVEMENT'
      );
      
      const result = await unlockAchievement(
        playerId,
        achievement as unknown as IAchievement,
        1, // currentValue = 1 (course completed)
        undefined // no source session
      );
      
      if (result) {
        results.push(result);
      }
    }
    
    logger.info(
      { playerId, courseId, unlockedCount: results.length },
      'Course completion achievement check completed'
    );
    
    return results;
  } catch (error) {
    logger.error(
      { err: error, playerId, courseId },
      'Failed to check course completion achievements'
    );
    // Don't throw - achievement unlock shouldn't block course completion
    return results;
  }
}
