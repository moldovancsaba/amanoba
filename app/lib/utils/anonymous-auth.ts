/**
 * Anonymous Authentication Utilities
 * 
 * Generates random 3-word usernames and creates guest player accounts.
 * If the same name is generated again, returns existing player.
 * 
 * Why this approach:
 * - Frictionless onboarding - users can start playing immediately
 * - Persistent identity - same name = same account with history
 * - Database-driven words - easy to expand/modify word list
 * - Full player capabilities - guests get progression, points, achievements
 */

import { GuestUsername } from '@/lib/models/guest-username';
import { Player, PlayerProgression, PointsWallet, Streak, Brand } from '@/lib/models';
import logger from '@/lib/logger';

/**
 * Get a random pre-generated guest username
 * Returns: "London Snake Africa" format
 */
export async function getRandomGuestUsername(): Promise<string> {
  try {
    // Get count of active usernames
    const count = await GuestUsername.countDocuments({ isActive: true });
    
    if (count === 0) {
      throw new Error('No guest usernames available in database. Run: npm run seed:guest-usernames');
    }
    
    // Pick a random username
    const randomIndex = Math.floor(Math.random() * count);
    const guestUsername = await GuestUsername.findOne({ isActive: true })
      .skip(randomIndex)
      .lean() as { _id: unknown; username: string; usageCount: number; lastUsedAt: Date; isActive: boolean } | null;
    
    if (!guestUsername) {
      throw new Error('Failed to retrieve guest username');
    }
    
    // Increment usage count
    await GuestUsername.findByIdAndUpdate(
      guestUsername._id,
      { 
        $inc: { usageCount: 1 },
        $set: { lastUsedAt: new Date() }
      }
    );
    
    return guestUsername.username;
  } catch (error) {
    logger.error(`Failed to get guest username: ${error}`);
    throw error;
  }
}

/**
 * Create or retrieve anonymous guest player
 * If username exists, returns existing player
 * Otherwise creates new player with full gamification setup
 */
export async function createAnonymousPlayer(username: string) {
  try {
    // Check if player with this username already exists
    let player = await Player.findOne({ displayName: username }).lean() as { _id: unknown; displayName: string; isPremium: boolean; brandId: unknown } | null;
    
    if (player) {
      logger.info(`Returning existing anonymous player: ${username}`);
      return {
        player,
        isNew: false,
      };
    }
    
    // Get or create default brand for anonymous users
    let defaultBrand = await Brand.findOne({ slug: 'amanoba' });
    if (!defaultBrand) {
      // Create default brand if it doesn't exist
      // Why: Anonymous users need a brand assignment for multi-tenant architecture
      defaultBrand = await Brand.create({
        name: 'Amanoba',
        slug: 'amanoba',
        displayName: 'Amanoba',
        description: 'Unified gamification platform',
        logo: '🎮',
        themeColors: {
          primary: '#6366f1',
          secondary: '#ec4899',
          accent: '#a855f7',
        },
        allowedDomains: ['amanoba.com', 'localhost'],
        supportedLanguages: ['en'],
        defaultLanguage: 'en',
        isActive: true,
      });
    }
    
    // Create new anonymous player (match Player schema)
    // Note: Anonymous users don't have ssoSub (they're not SSO users)
    const newPlayer = await Player.create({
      displayName: username,
      isPremium: false,
      isAnonymous: true,
      authProvider: 'anonymous',
      brandId: defaultBrand._id,
      locale: 'en',
      isActive: true,
      isBanned: false,
      lastLoginAt: new Date(),
      lastSeenAt: new Date(),
    });
    
    // Convert to lean object for consistent return type
    player = await Player.findById(newPlayer._id).lean() as { _id: unknown; displayName: string; isPremium: boolean; brandId: unknown } | null;
    
    if (!player) {
      throw new Error('Failed to retrieve created player');
    }
    
    // Initialize player progression with all required fields
    await PlayerProgression.create({
      playerId: player._id,
      level: 1,
      currentXP: 0,
      totalXP: 0,
      xpToNextLevel: 100,
      title: 'Beginner',
      unlockedTitles: ['Beginner'],
      statistics: {
        totalGamesPlayed: 0,
        totalWins: 0,
        totalLosses: 0,
        totalDraws: 0,
        totalPlayTime: 0,
        averageSessionTime: 0,
        bestStreak: 0,
        currentStreak: 0,
        dailyLoginStreak: 1, // First login
        lastLoginDate: new Date(),
      },
      gameSpecificStats: new Map(),
      achievements: {
        totalUnlocked: 0,
        totalAvailable: 0,
        recentUnlocks: [],
      },
      milestones: [],
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        lastXPGain: new Date(),
      },
    });
    
    // Initialize points wallet
    await PointsWallet.create({
      playerId: player._id,
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
    
    // Initialize streaks (match Streak schema)
    await Streak.create({
      playerId: player._id,
      type: 'win',
      currentStreak: 0,
      bestStreak: 0,
      lastActivity: new Date(),
      streakStart: new Date(),
      bonusMultiplier: 1.0,
      milestones: [],
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    
    await Streak.create({
      playerId: player._id,
      type: 'daily_login',
      currentStreak: 1, // First login
      bestStreak: 1,
      lastActivity: new Date(),
      streakStart: new Date(),
      bonusMultiplier: 1.0,
      milestones: [],
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    
    logger.info(`Created new anonymous player: ${username}`);
    
    return {
      player,
      isNew: true,
    };
  } catch (error) {
    logger.error(`Failed to create anonymous player: ${error}`);
    throw error;
  }
}

/**
 * Convert anonymous account to registered account
 * Called when anonymous user signs in with Facebook
 */
export async function convertAnonymousToRegistered(
  anonymousPlayerId: string,
  ssoSub: string,
  displayName?: string,
  email?: string,
  avatarUrl?: string
) {
  try {
    const player = await Player.findByIdAndUpdate(
      anonymousPlayerId,
      {
        ssoSub,
        displayName: displayName || undefined,
        email: email || undefined,
        avatarUrl: avatarUrl || undefined,
        isAnonymous: false,
      },
      { new: true }
    );
    
    logger.info(`Converted anonymous player to registered: ${ssoSub}`);
    
    return player;
  } catch (error) {
    logger.error(`Failed to convert anonymous player: ${error}`);
    throw error;
  }
}
