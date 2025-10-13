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
      .lean() as { _id: any; username: string; usageCount: number; lastUsedAt: Date; isActive: boolean } | null;
    
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
    let player = await Player.findOne({ displayName: username }).lean() as any;
    
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
      defaultBrand = await Brand.create({
        name: 'Amanoba',
        slug: 'amanoba',
        domain: 'amanoba.com',
        primaryColor: '#6366f1',
        secondaryColor: '#ec4899',
        logo: '🎮',
        isActive: true,
      });
    }
    
    // Create new anonymous player
    const newPlayer = await Player.create({
      facebookId: `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      displayName: username,
      email: null,
      avatarUrl: null,
      isPremium: false,
      isAnonymous: true, // Flag to identify guest accounts
      brandId: defaultBrand._id,
      registeredAt: new Date(),
    });
    
    // Convert to lean object for consistent return type
    player = await Player.findById(newPlayer._id).lean() as any;
    
    if (!player) {
      throw new Error('Failed to retrieve created player');
    }
    
    // Initialize player progression
    await PlayerProgression.create({
      playerId: player._id,
      level: 1,
      xp: 0,
      title: 'Beginner',
      gamesPlayed: 0,
      gamesWon: 0,
      totalScore: 0,
    });
    
    // Initialize points wallet
    await PointsWallet.create({
      playerId: player._id,
      balance: 0,
      lifetimeEarned: 0,
      lifetimeSpent: 0,
    });
    
    // Initialize streaks
    await Streak.create({
      playerId: player._id,
      type: 'WIN_STREAK',
      currentStreak: 0,
      longestStreak: 0,
      lastActivityAt: new Date(),
    });
    
    await Streak.create({
      playerId: player._id,
      type: 'DAILY_LOGIN',
      currentStreak: 1, // First login
      longestStreak: 1,
      lastActivityAt: new Date(),
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
  facebookId: string,
  displayName?: string,
  email?: string,
  avatarUrl?: string
) {
  try {
    const player = await Player.findByIdAndUpdate(
      anonymousPlayerId,
      {
        facebookId,
        displayName: displayName || undefined,
        email: email || undefined,
        avatarUrl: avatarUrl || undefined,
        isAnonymous: false,
      },
      { new: true }
    );
    
    logger.info(`Converted anonymous player to registered: ${facebookId}`);
    
    return player;
  } catch (error) {
    logger.error(`Failed to convert anonymous player: ${error}`);
    throw error;
  }
}
