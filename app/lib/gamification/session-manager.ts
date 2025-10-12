/**
 * Game Session Manager
 * 
 * Purpose: Orchestrates game session lifecycle and rewards distribution
 * Why: Central coordinator for all gamification systems working together
 * 
 * Features:
 * - Session creation and initialization
 * - Session completion with rewards calculation
 * - Points, XP, achievements, streaks all processed together
 * - Transaction management for data consistency
 * - Event logging for analytics
 */

import mongoose from 'mongoose';
import {
  Player,
  PlayerSession,
  PlayerProgression,
  PointsWallet,
  PointsTransaction,
  Game,
  GameBrandConfig,
  Brand,
  EventLog,
} from '../models';
import {
  calculatePoints,
  calculateXP,
  processXPGain,
  checkAndUnlockAchievements,
  updateWinStreak,
  type PointsCalculationInput,
  type XPCalculationInput,
  type AchievementCheckContext,
} from './index';
import logger from '../logger';

/**
 * Interface: Session Start Input
 * Why: All data needed to create a new game session
 */
export interface SessionStartInput {
  playerId: mongoose.Types.ObjectId;
  brandId: mongoose.Types.ObjectId;
  gameId: mongoose.Types.ObjectId;
  deviceType?: 'mobile' | 'tablet' | 'desktop';
  browserInfo?: string;
  ipAddress?: string;
  country?: string;
}

/**
 * Interface: Session Complete Input
 * Why: All data needed to finalize a session and award rewards
 */
export interface SessionCompleteInput {
  sessionId: mongoose.Types.ObjectId;
  score: number;
  maxScore: number;
  accuracy?: number;
  outcome: 'win' | 'loss' | 'draw';
  moves?: number;
  hints?: number;
  difficulty?: string;
  level?: number;
  rawData?: Record<string, any>;
}

/**
 * Interface: Session Complete Result
 * Why: Comprehensive result of session completion with all rewards
 */
export interface SessionCompleteResult {
  sessionId: mongoose.Types.ObjectId;
  rewards: {
    points: number;
    pointsBreakdown: string;
    xp: number;
    bonusPoints: number;
    bonusXP: number;
  };
  progression: {
    leveledUp: boolean;
    newLevel?: number;
    levelsGained?: number;
    levelUpRewards?: any[];
  };
  achievements: {
    newUnlocks: number;
    achievements: any[];
  };
  streak: {
    current: number;
    best: number;
    milestoneReached?: number;
  };
  newFeatures: string[];
}

/**
 * Start a new game session
 * 
 * What: Creates PlayerSession record and logs event
 * Why: Tracks when session started for analytics and duration
 */
export async function startGameSession(
  input: SessionStartInput
): Promise<mongoose.Types.ObjectId> {
  try {
    // Get player data
    const player = await Player.findById(input.playerId);
    if (!player) {
      throw new Error('Player not found');
    }
    
    // Get game data
    const game = await Game.findById(input.gameId);
    if (!game) {
      throw new Error('Game not found');
    }
    
    // Create session
    const session = new PlayerSession({
      playerId: input.playerId,
      brandId: input.brandId,
      gameId: input.gameId,
      sessionStart: new Date(),
      status: 'in_progress',
      gameData: {
        score: 0,
        maxScore: 100, // Will be updated on completion
        outcome: 'incomplete',
      },
      rewards: {
        pointsEarned: 0,
        xpEarned: 0,
        bonusMultiplier: 1.0,
        achievementsUnlocked: [],
        streakBonus: 0,
      },
      context: {
        deviceType: input.deviceType,
        browserInfo: input.browserInfo,
        ipAddress: input.ipAddress,
        country: input.country,
        isPremium: player.isPremium || false,
      },
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        version: '1.0.0',
      },
    });
    
    await session.save();
    
    // Log event
    await EventLog.create({
      playerId: input.playerId,
      brandId: input.brandId,
      eventType: 'game_played',
      eventData: {
        gameId: input.gameId,
        gameName: (game as any).name,
        sessionId: session._id,
      },
      timestamp: new Date(),
      context: {
        sessionId: (session._id as mongoose.Types.ObjectId).toString(),
        ipAddress: input.ipAddress,
        userAgent: input.browserInfo,
        platform: input.deviceType,
      },
      metadata: {
        createdAt: new Date(),
        version: '1.0.0',
      },
    });
    
    logger.info(
      {
        playerId: input.playerId,
        gameId: input.gameId,
        sessionId: session._id,
      },
      'Game session started'
    );
    
    return session._id as mongoose.Types.ObjectId;
  } catch (error) {
    logger.error({ err: error }, 'Failed to start game session');
    throw error;
  }
}

/**
 * Complete a game session and award all rewards
 * 
 * What: Orchestrates all gamification systems for session completion
 * Why: Ensures consistent rewards and proper data updates
 */
export async function completeGameSession(
  input: SessionCompleteInput
): Promise<SessionCompleteResult> {
  const sessionDb = await mongoose.startSession();
  sessionDb.startTransaction();
  
  try {
    // 1. Get session data
    const session = await PlayerSession.findById(input.sessionId).session(
      sessionDb
    );
    if (!session) {
      throw new Error('Session not found');
    }
    
    if (session.status !== 'in_progress') {
      throw new Error('Session already completed');
    }
    
    // 2. Get related data
    const [player, game, gameBrandConfig, progression] = await Promise.all([
      Player.findById(session.playerId).session(sessionDb),
      Game.findById(session.gameId).session(sessionDb),
      GameBrandConfig.findOne({
        brandId: session.brandId,
        gameId: session.gameId,
      }).session(sessionDb),
      PlayerProgression.findOne({ playerId: session.playerId }).session(
        sessionDb
      ),
    ]);
    
    if (!player || !game || !gameBrandConfig || !progression) {
      throw new Error('Required data not found');
    }
    
    // 3. Calculate session duration
    const sessionEnd = new Date();
    const duration = sessionEnd.getTime() - session.sessionStart.getTime();
    
    // 4. Update win streak
    const streakResult = await updateWinStreak(session.playerId, input.outcome);
    
    // 5. Calculate points
    const pointsInput: PointsCalculationInput = {
      game: game as any,
      gameBrandConfig: gameBrandConfig as any,
      sessionData: {
        score: input.score,
        maxScore: input.maxScore,
        accuracy: input.accuracy,
        duration,
        outcome: input.outcome,
      },
      playerContext: {
        isPremium: player.isPremium || false,
        currentWinStreak: streakResult.currentStreak,
      },
    };
    
    const pointsResult = calculatePoints(pointsInput);
    
    // 6. Calculate XP
    const xpInput: XPCalculationInput = {
      game: game as any,
      sessionData: {
        outcome: input.outcome,
        score: input.score,
        maxScore: input.maxScore,
        accuracy: input.accuracy,
        duration,
      },
      playerContext: {
        currentLevel: progression.level,
        isPremium: player.isPremium || false,
      },
    };
    
    const xpResult = calculateXP(xpInput);
    
    // 7. Process XP and level ups
    const previousLevel = progression.level;
    const xpProcessResult = processXPGain(
      {
        level: progression.level,
        currentXP: progression.currentXP,
        xpToNextLevel: progression.xpToNextLevel,
      },
      xpResult.totalXP
    );
    
    // 8. Update progression
    progression.level = xpProcessResult.finalLevel;
    progression.currentXP = xpProcessResult.finalCurrentXP;
    progression.totalXP += xpResult.totalXP;
    progression.xpToNextLevel = xpProcessResult.finalXPToNextLevel;
    progression.statistics.totalGamesPlayed += 1;
    progression.statistics.totalPlayTime += duration;
    progression.statistics.averageSessionTime =
      progression.statistics.totalPlayTime /
      progression.statistics.totalGamesPlayed;
    progression.statistics.currentStreak = streakResult.currentStreak;
    progression.statistics.bestStreak = streakResult.bestStreak;
    progression.metadata.lastXPGain = new Date();
    
    if (input.outcome === 'win') {
      progression.statistics.totalWins += 1;
    } else if (input.outcome === 'loss') {
      progression.statistics.totalLosses += 1;
    } else {
      progression.statistics.totalDraws += 1;
    }
    
    if (xpProcessResult.leveledUp) {
      progression.metadata.lastLevelUp = new Date();
    }
    
    await progression.save({ session: sessionDb });
    
    // 9. Update or create points wallet
    let wallet = await PointsWallet.findOne({ playerId: session.playerId }).session(
      sessionDb
    );
    
    if (!wallet) {
      wallet = new PointsWallet({
        playerId: session.playerId,
        currentBalance: 0,
        lifetimeEarned: 0,
        lifetimeSpent: 0,
        pendingBalance: 0,
        lastTransaction: new Date(),
        metadata: {
          createdAt: new Date(),
          updatedAt: new Date(),
          lastBalanceCheck: new Date(),
        },
      });
    }
    
    const balanceBefore = wallet.currentBalance;
    wallet.currentBalance += pointsResult.totalPoints;
    wallet.lifetimeEarned += pointsResult.totalPoints;
    wallet.lastTransaction = new Date();
    
    await wallet.save({ session: sessionDb });
    
    // 10. Create points transaction
    await PointsTransaction.create(
      [
        {
          playerId: session.playerId,
          walletId: wallet._id,
          type: 'earn',
          amount: pointsResult.totalPoints,
          balanceBefore,
          balanceAfter: wallet.currentBalance,
          source: {
            type: 'game_session',
            referenceId: session._id,
            description: `${(game as any).name} - ${input.outcome}`,
          },
          metadata: {
            createdAt: new Date(),
          },
        },
      ],
      { session: sessionDb }
    );
    
    // 11. Check achievements
    const achievementContext: AchievementCheckContext = {
      playerId: session.playerId,
      gameId: session.gameId,
      progression,
      recentSession: {
        score: input.score,
        maxScore: input.maxScore,
        accuracy: input.accuracy,
        duration,
        outcome: input.outcome,
      },
    };
    
    const newAchievements = await checkAndUnlockAchievements(achievementContext);
    
    // 12. Update session
    session.sessionEnd = sessionEnd;
    session.duration = duration;
    session.status = 'completed';
    session.gameData = {
      score: input.score,
      maxScore: input.maxScore,
      accuracy: input.accuracy,
      moves: input.moves,
      hints: input.hints,
      difficulty: input.difficulty,
      level: input.level,
      outcome: input.outcome,
      rawData: input.rawData,
    };
    session.rewards = {
      pointsEarned: pointsResult.totalPoints,
      xpEarned: xpResult.totalXP,
      bonusMultiplier: 1.0,
      achievementsUnlocked: newAchievements.map(a => a.achievement._id as mongoose.Types.ObjectId),
      streakBonus: streakResult.currentStreak > 1 ? streakResult.bonusMultiplier : 0,
    };
    
    await session.save({ session: sessionDb });
    
    // 13. Commit transaction
    await sessionDb.commitTransaction();
    
    logger.info(
      {
        sessionId: session._id,
        playerId: session.playerId,
        outcome: input.outcome,
        points: pointsResult.totalPoints,
        xp: xpResult.totalXP,
        leveledUp: xpProcessResult.leveledUp,
        newLevel: xpProcessResult.finalLevel,
        achievements: newAchievements.length,
      },
      'Game session completed successfully'
    );
    
    // 14. Build result
    const result: SessionCompleteResult = {
      sessionId: session._id as mongoose.Types.ObjectId,
      rewards: {
        points: pointsResult.totalPoints,
        pointsBreakdown: pointsResult.formula,
        xp: xpResult.totalXP,
        bonusPoints: 0, // Could add from achievements
        bonusXP: 0,
      },
      progression: {
        leveledUp: xpProcessResult.leveledUp,
        newLevel: xpProcessResult.finalLevel,
        levelsGained: xpProcessResult.levelsGained,
        levelUpRewards: xpProcessResult.levelUpResults.map(r => r.rewards),
      },
      achievements: {
        newUnlocks: newAchievements.length,
        achievements: newAchievements.map(a => ({
          id: a.achievement._id,
          name: a.achievement.name,
          tier: a.achievement.tier,
          rewards: a.rewards,
        })),
      },
      streak: {
        current: streakResult.currentStreak,
        best: streakResult.bestStreak,
        milestoneReached: streakResult.milestoneReached,
      },
      newFeatures: [], // Would check progressive disclosure
    };
    
    return result;
  } catch (error) {
    await sessionDb.abortTransaction();
    logger.error(
      { err: error, sessionId: input.sessionId },
      'Failed to complete game session'
    );
    throw error;
  } finally {
    sessionDb.endSession();
  }
}

/**
 * Abandon a session (player quit without finishing)
 * 
 * What: Marks session as abandoned without rewards
 * Why: Tracks incomplete sessions for analytics
 */
export async function abandonGameSession(
  sessionId: mongoose.Types.ObjectId
): Promise<void> {
  try {
    const session = await PlayerSession.findById(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }
    
    session.sessionEnd = new Date();
    session.duration = session.sessionEnd.getTime() - session.sessionStart.getTime();
    session.status = 'abandoned';
    
    await session.save();
    
    logger.info({ sessionId }, 'Game session abandoned');
  } catch (error) {
    logger.error({ err: error, sessionId }, 'Failed to abandon session');
    throw error;
  }
}
