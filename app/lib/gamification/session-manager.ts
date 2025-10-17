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
  type PointsCalculationResult,
  type XPCalculationInput,
  type AchievementCheckContext,
} from './index';
import type { IGame } from '../models/game';
import type { IGameBrandConfig } from '../models/game-brand-config';
import {
  calculateEloChange,
  getKFactor,
  getAiElo,
  getGameResult,
} from './elo-calculator';
import {
  updateDailyChallengeProgress,
  type ChallengeProgressContext,
} from './daily-challenge-tracker';
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
  rawData?: Record<string, unknown>;
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
    levelUpRewards?: unknown[];
  };
  achievements: {
    newUnlocks: number;
    achievements: unknown[];
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
        gameName: (game as { name: string }).name,
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
    const [player, game, gameBrandConfigRaw, progressionRaw] = await Promise.all([
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
    
    if (!player || !game) {
      throw new Error('Required data not found');
    }

    // Ensure progression exists (auto-create if missing)
    let progression = progressionRaw;
    if (!progression) {
      progression = new PlayerProgression({
        playerId: session.playerId,
        level: 1,
        currentXP: 0,
        totalXP: 0,
        xpToNextLevel: 100,
        unlockedTitles: [],
        statistics: {
          totalGamesPlayed: 0,
          totalWins: 0,
          totalLosses: 0,
          totalDraws: 0,
          totalPlayTime: 0,
          averageSessionTime: 0,
          bestStreak: 0,
          currentStreak: 0,
          dailyLoginStreak: 0,
          lastLoginDate: new Date(),
        },
        gameSpecificStats: new Map(),
        achievements: { totalUnlocked: 0, totalAvailable: 0, recentUnlocks: [] },
        milestones: [],
        metadata: { createdAt: new Date(), updatedAt: new Date(), lastXPGain: new Date() },
      });
    }

    // Fallback GameBrandConfig (use Game defaults) if missing
    const gameBrandConfig = gameBrandConfigRaw || ({
      brandId: session.brandId,
      gameId: session.gameId,
      pointsConfig: (game as { pointsConfig?: Record<string, unknown> }).pointsConfig,
      xpConfig: (game as { xpConfig?: Record<string, unknown> }).xpConfig,
      difficultySettings: (game as { difficultyLevels?: string[] }).difficultyLevels || ['normal'],
    } as IGameBrandConfig);
    
    // 3. Calculate session duration
    const sessionEnd = new Date();
    const duration = sessionEnd.getTime() - session.sessionStart.getTime();

    // Ghost/Practice mode: if flagged, do not award XP/points or achievements
    const isGhost = !!(input.rawData && (input.rawData as { ghost?: boolean }).ghost);
    
    // 4. Update win streak
    const streakResult = await updateWinStreak(session.playerId, input.outcome);
    
    // 5. Calculate points
    const pointsInput: PointsCalculationInput = {
      game: game as IGame,
      gameBrandConfig: gameBrandConfig as IGameBrandConfig,
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
    
    const pointsResult = isGhost
      ? { totalPoints: 0, formula: 'ghost_mode_no_points', breakdown: {} as PointsCalculationResult['breakdown'] }
      : calculatePoints(pointsInput);
    
    // 6. Calculate XP
    const xpInput: XPCalculationInput = {
      game: game as IGame,
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
    
    const xpResult = isGhost
      ? { totalXP: 0, baseXP: 0, bonusXP: 0, multipliers: {} }
      : calculateXP(xpInput);
    
    // 7. Process XP and level ups
    const previousLevel = progression.level;
    const xpProcessResult = isGhost
      ? { leveledUp: false, finalLevel: progression.level, finalCurrentXP: progression.currentXP, finalXPToNextLevel: progression.xpToNextLevel, levelsGained: 0, levelUpResults: [] }
      : processXPGain(
          {
            level: progression.level,
            currentXP: progression.currentXP,
            xpToNextLevel: progression.xpToNextLevel,
          },
          xpResult.totalXP
        );
    
    // 8. Update progression (skip in ghost mode)
    if (!isGhost) {
      progression.level = xpProcessResult.finalLevel;
      progression.currentXP = xpProcessResult.finalCurrentXP;
      progression.totalXP += xpResult.totalXP;
    }
    progression.xpToNextLevel = xpProcessResult.finalXPToNextLevel;
    if (!isGhost) {
      progression.statistics.totalGamesPlayed += 1;
    }
    progression.statistics.totalPlayTime += duration;
    progression.statistics.averageSessionTime =
      progression.statistics.totalPlayTime /
      progression.statistics.totalGamesPlayed;
    if (!isGhost) {
      progression.statistics.currentStreak = streakResult.currentStreak;
      progression.statistics.bestStreak = streakResult.bestStreak;
    }
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
    
    // 8a. Update ELO rating for Madoku games
    const isMadoku = (game as { gameId?: string; name?: string }).gameId === 'MADOKU' || (game as { name?: string }).name?.toLowerCase().includes('madoku');
    if (isMadoku && !isGhost) {
      // Get current ELO or initialize to 1200
      const gameKey = (game as { gameId?: string }).gameId || String(game._id);
      const currentStats = progression.gameSpecificStats.get(gameKey) || {
        gamesPlayed: 0,
        wins: 0,
        losses: 0,
        draws: 0,
        bestScore: 0,
        averageScore: 0,
        totalPoints: 0,
        elo: 1200, // Starting ELO
      };
      
      const currentElo = currentStats.elo || 1200;
      
      // Get opponent ELO (AI difficulty or default)
      const difficulty = (input.difficulty || 'medium') as 'easy' | 'medium' | 'hard' | 'expert';
      const opponentElo = getAiElo(difficulty);
      
      // Calculate game result
      const gameResult = getGameResult(input.outcome === 'win', input.outcome === 'draw');
      
      // Calculate ELO change
      const kFactor = getKFactor(currentElo);
      const { newElo, change } = calculateEloChange(currentElo, opponentElo, gameResult, kFactor);
      
      // Update game-specific stats with new ELO
      currentStats.elo = newElo;
      progression.gameSpecificStats.set(gameKey, currentStats);
      
      logger.info(
        {
          playerId: session.playerId,
          gameKey,
          previousElo: currentElo,
          newElo,
          change,
          difficulty,
          outcome: input.outcome,
        },
        'ELO rating updated for Madoku'
      );
    }
    
    if (!isGhost) {
      await progression.save({ session: sessionDb });
    }
    
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
    
    if (!isGhost) {
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
            description: `${(game as { name?: string }).name || 'Game'} - ${input.outcome}`,
          },
          metadata: {
            createdAt: new Date(),
          },
        },
      ],
      { session: sessionDb }
    );
    }
    
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
    
    const newAchievements = isGhost ? [] : await checkAndUnlockAchievements(achievementContext);
    
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
    
    // 13f. Update daily challenge progress (after transaction commits)
    // Why: Track challenge progress and award bonus rewards
    if (!isGhost) {
      const challengeContext: ChallengeProgressContext = {
        playerId: session.playerId,
        brandId: session.brandId,
        gameId: session.gameId,
        sessionData: {
          outcome: input.outcome,
          pointsEarned: pointsResult.totalPoints,
          xpEarned: xpResult.totalXP,
          isPerfect: input.accuracy === 100,
        },
        streakData: {
          currentStreak: streakResult.currentStreak,
        },
      };
      
      const completedChallenges = await updateDailyChallengeProgress(challengeContext);
      
      if (completedChallenges.length > 0) {
        logger.info(
          {
            playerId: session.playerId,
            completedChallenges: completedChallenges.map(c => c.title),
          },
          'Daily challenges completed during session'
        );
      }
    }
    
    // 13a. Log game completion event
    await EventLog.create({
      playerId: session.playerId,
      brandId: session.brandId,
      eventType: 'game_played',
      eventData: {
        gameId: session.gameId,
        gameName: (game as { name?: string }).name || 'Game',
        sessionId: session._id,
        outcome: input.outcome,
        score: input.score,
        duration,
        completed: true,
      },
      timestamp: new Date(),
      metadata: {
        isPremium: player.isPremium,
        brandId: session.brandId.toString(),
        gameId: session.gameId.toString(),
        pointsEarned: pointsResult.totalPoints,
      },
    });
    
    // 13b. Log points earned event
    if (!isGhost) {
      await EventLog.create({
        playerId: session.playerId,
        brandId: session.brandId,
        eventType: 'points_earned',
      eventData: {
        amount: pointsResult.totalPoints,
        source: 'game_session',
        gameId: session.gameId,
        sessionId: session._id,
      },
      timestamp: new Date(),
      metadata: {
        brandId: session.brandId.toString(),
        amount: pointsResult.totalPoints,
      },
    });
    }
    
    // 13c. Log level up events
    if (!isGhost && xpProcessResult.leveledUp) {
      await EventLog.create({
        playerId: session.playerId,
        brandId: session.brandId,
        eventType: 'level_up',
        eventData: {
          previousLevel,
          newLevel: xpProcessResult.finalLevel,
          levelsGained: xpProcessResult.levelsGained,
          xpEarned: xpResult.totalXP,
        },
        timestamp: new Date(),
        metadata: {
          brandId: session.brandId.toString(),
          newLevel: xpProcessResult.finalLevel,
        },
      });
    }
    
    // 13d. Log achievement unlock events
    for (const ach of newAchievements) {
      await EventLog.create({
        playerId: session.playerId,
        brandId: session.brandId,
        eventType: 'achievement_unlocked',
        eventData: {
          achievementId: ach.achievement._id,
          achievementName: ach.achievement.name,
          tier: ach.achievement.tier,
          rewards: ach.rewards,
        },
        timestamp: new Date(),
        metadata: {
          brandId: session.brandId.toString(),
          achievementId: (ach.achievement._id).toString(),
        },
      });
    }
    
    // 13e. Log streak milestone events
    if (streakResult.milestoneReached) {
      await EventLog.create({
        playerId: session.playerId,
        brandId: session.brandId,
        eventType: 'streak_milestone',
        eventData: {
          type: 'win',
          milestone: streakResult.milestoneReached,
          currentStreak: streakResult.currentStreak,
          bestStreak: streakResult.bestStreak,
        },
        timestamp: new Date(),
        metadata: {
          brandId: session.brandId.toString(),
          milestone: streakResult.milestoneReached,
        },
      });
    }
    
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
        levelUpRewards: (xpProcessResult.levelUpResults || []).map((r: { rewards: unknown }) => r.rewards),
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
