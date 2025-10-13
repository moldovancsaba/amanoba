import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import connectToDatabase from '@/lib/mongodb';
import logger from '@/lib/logger';
import {
  Reward,
  RewardRedemption,
  PointsWallet,
  PointsTransaction,
  Player,
} from '@/lib/models';
import mongoose from 'mongoose';
import { logRewardRedemption } from '@/lib/analytics';

/**
 * GET /api/rewards
 * 
 * Why: Display available rewards that players can redeem with points
 * What: Returns all active rewards with availability status
 * 
 * Query Parameters:
 * - playerId: Optional player ID to check affordability and availability
 * 
 * Response:
 * - rewards: Array of reward objects with availability info
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const playerId = searchParams.get('playerId');

    // Why: Connect to database before any operations
    await connectToDatabase();

    // Why: Fetch all active rewards
    const rewards = await Reward.find({ 'availability.isActive': true }).sort({
      pointsCost: 1,
    });

    let wallet = null;
    if (playerId) {
      wallet = await PointsWallet.findOne({ playerId });
    }

    // Why: Enrich rewards with player-specific availability
    const enrichedRewards = rewards.map((reward) => {
      const canAfford = wallet ? wallet.currentBalance >= reward.pointsCost : false;
      const limitPerPlayer = reward.redemptionDetails.limitPerPlayer;
      const isAvailable = !limitPerPlayer || limitPerPlayer > 0;

      return {
        id: reward._id,
        name: reward.name,
        description: reward.description,
        category: reward.category,
        type: reward.type,
        pointsCost: reward.pointsCost,
        icon: reward.media.iconEmoji,
        imageUrl: reward.media.imageUrl,
        isActive: reward.availability.isActive,
        limitPerPlayer,
        premiumOnly: reward.availability.premiumOnly,
        canAfford,
        isAvailable,
        stock: reward.stock,
      };
    });

    logger.info(
      { rewardsCount: rewards.length, playerId },
      'Rewards list fetched successfully'
    );

    return NextResponse.json(
      {
        rewards: enrichedRewards,
        playerBalance: wallet?.currentBalance || null,
      },
      { status: 200 }
    );
  } catch (error) {
    // Why: Log unexpected errors for debugging
    logger.error({ error }, 'Error fetching rewards');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Why: Validate incoming redemption request
// What: Zod schema for redeeming a reward
const RedeemRewardSchema = z.object({
  playerId: z.string().min(1, 'Player ID is required'),
  rewardId: z.string().min(1, 'Reward ID is required'),
});

/**
 * POST /api/rewards
 * 
 * Why: Allow players to redeem rewards using their points
 * What: Deducts points and creates a redemption record
 * 
 * Request Body:
 * - playerId: MongoDB ObjectId of the player
 * - rewardId: MongoDB ObjectId of the reward
 * 
 * Response:
 * - redemption: Created redemption object
 * - newBalance: Player's updated points balance
 */
export async function POST(request: NextRequest) {
  // Why: Start a transaction to ensure atomicity
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Why: Parse and validate the request body
    const body = await request.json();
    const validatedData = RedeemRewardSchema.parse(body);

    // Why: Connect to database before any operations
    await connectToDatabase();

    // Why: Fetch player, reward, and wallet within transaction
    const [player, reward, wallet] = await Promise.all([
      Player.findById(validatedData.playerId).session(session),
      Reward.findById(validatedData.rewardId).session(session),
      PointsWallet.findOne({ playerId: validatedData.playerId }).session(session),
    ]);

    if (!player) {
      await session.abortTransaction();
      return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }

    if (!reward) {
      await session.abortTransaction();
      return NextResponse.json({ error: 'Reward not found' }, { status: 404 });
    }

    if (!reward.availability.isActive) {
      await session.abortTransaction();
      return NextResponse.json(
        { error: 'Reward is not available' },
        { status: 400 }
      );
    }

    if (!wallet) {
      await session.abortTransaction();
      return NextResponse.json(
        { error: 'Player wallet not found' },
        { status: 404 }
      );
    }

    // Why: Check if player has enough points
    if (wallet.currentBalance < reward.pointsCost) {
      await session.abortTransaction();
      return NextResponse.json(
        { error: 'Insufficient points' },
        { status: 400 }
      );
    }

    // Why: Check redemption limits if applicable
    if (reward.redemptionDetails.limitPerPlayer) {
      const existingRedemptions = await RewardRedemption.countDocuments({
        playerId: validatedData.playerId,
        rewardId: validatedData.rewardId,
        status: { $in: ['PENDING', 'FULFILLED'] },
      }).session(session);

      if (existingRedemptions >= reward.redemptionDetails.limitPerPlayer) {
        await session.abortTransaction();
        return NextResponse.json(
          { error: 'Redemption limit reached for this reward' },
          { status: 400 }
        );
      }
    }

    // Why: Deduct points from wallet
    wallet.currentBalance -= reward.pointsCost;
    wallet.lifetimeSpent += reward.pointsCost;
    await wallet.save({ session });

    // Why: Create points transaction for audit trail
    await PointsTransaction.create(
      [
        {
          playerId: validatedData.playerId,
          amount: -reward.pointsCost,
          type: 'SPEND',
          reason: 'REWARD_REDEMPTION',
          metadata: {
            rewardId: reward._id,
            rewardName: reward.name,
          },
        },
      ],
      { session }
    );

    // Why: Create redemption record
    const redemption = await RewardRedemption.create(
      [
        {
          playerId: validatedData.playerId,
          rewardId: validatedData.rewardId,
          pointsCost: reward.pointsCost,
          status: 'PENDING',
          redeemedAt: new Date(),
        },
      ],
      { session }
    );

    // Why: Commit transaction
    await session.commitTransaction();

    logger.info(
      {
        playerId: validatedData.playerId,
        rewardId: validatedData.rewardId,
        pointsCost: reward.pointsCost,
        redemptionId: redemption[0]._id,
      },
      'Reward redeemed successfully'
    );
    
    // Log reward redemption event
    await logRewardRedemption(
      validatedData.playerId,
      player.brandId.toString(),
      {
        rewardId: (reward._id as any).toString(),
        rewardName: reward.name,
        pointsCost: reward.pointsCost,
        category: reward.category,
      }
    );

    return NextResponse.json(
      {
        success: true,
        redemption: redemption[0],
        newBalance: wallet.currentBalance,
      },
      { status: 201 }
    );
  } catch (error) {
    // Why: Rollback transaction on error
    await session.abortTransaction();

    // Why: Handle validation errors separately for better error messages
    if (error instanceof z.ZodError) {
      logger.warn({ errors: error.issues }, 'Validation error redeeming reward');
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    // Why: Log unexpected errors for debugging
    logger.error({ error }, 'Error redeeming reward');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    // Why: Always end the session
    session.endSession();
  }
}
