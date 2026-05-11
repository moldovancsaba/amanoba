import mongoose from 'mongoose';
import logger from '@/lib/logger';
import { FriendStreak, type IFriendStreak } from '@/lib/models';

const FRIEND_STREAK_MILESTONES = [3, 7, 14, 30, 50, 100];

function getDayStart(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function isSameDay(a?: Date | null, b?: Date | null): boolean {
  if (!a || !b) return false;
  return getDayStart(a).getTime() === getDayStart(b).getTime();
}

function getYesterdayStart(date: Date): Date {
  const yesterday = getDayStart(date);
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday;
}

function checkFriendStreakMilestone(
  currentSharedStreak: number,
  previousSharedStreak: number
): number | undefined {
  for (const milestone of FRIEND_STREAK_MILESTONES) {
    if (currentSharedStreak >= milestone && previousSharedStreak < milestone) {
      return milestone;
    }
  }

  return undefined;
}

export function getDisplayedFriendStreakState(friendStreak: {
  currentSharedStreak: number;
  bestSharedStreak: number;
  lastSharedActivity?: Date | null;
}) {
  const now = new Date();
  const todayStart = getDayStart(now);
  const yesterdayStart = getYesterdayStart(now);
  const lastSharedDay = friendStreak.lastSharedActivity
    ? getDayStart(friendStreak.lastSharedActivity)
    : null;

  if (!lastSharedDay) {
    return {
      currentSharedStreak: 0,
      bestSharedStreak: friendStreak.bestSharedStreak,
      statusLabel: 'Not started',
      atRisk: false,
      stale: false,
    };
  }

  if (lastSharedDay.getTime() === todayStart.getTime()) {
    return {
      currentSharedStreak: friendStreak.currentSharedStreak,
      bestSharedStreak: friendStreak.bestSharedStreak,
      statusLabel: 'Shared today',
      atRisk: false,
      stale: false,
    };
  }

  if (lastSharedDay.getTime() === yesterdayStart.getTime()) {
    return {
      currentSharedStreak: friendStreak.currentSharedStreak,
      bestSharedStreak: friendStreak.bestSharedStreak,
      statusLabel: 'At risk today',
      atRisk: true,
      stale: false,
    };
  }

  return {
    currentSharedStreak: 0,
    bestSharedStreak: friendStreak.bestSharedStreak,
    statusLabel: 'Needs restart',
    atRisk: false,
    stale: true,
  };
}

export async function updateFriendStreaksForLearningAction(
  playerId: mongoose.Types.ObjectId,
  now: Date = new Date()
): Promise<{
  processed: number;
  sharedDaysCompleted: number;
  milestonesReached: number[];
}> {
  const friendStreaks = await FriendStreak.find({
    status: 'active',
    $or: [{ ownerPlayerId: playerId }, { friendPlayerId: playerId }],
  });

  if (friendStreaks.length === 0) {
    return { processed: 0, sharedDaysCompleted: 0, milestonesReached: [] };
  }

  let sharedDaysCompleted = 0;
  const milestonesReached: number[] = [];

  for (const friendStreak of friendStreaks) {
    const actorIsOwner = String(friendStreak.ownerPlayerId) === String(playerId);

    if (actorIsOwner) {
      friendStreak.ownerLastQualifiedOn = now;
    } else {
      friendStreak.friendLastQualifiedOn = now;
    }

    const ownerDay = friendStreak.ownerLastQualifiedOn;
    const friendDay = friendStreak.friendLastQualifiedOn;

    if (!isSameDay(ownerDay, friendDay)) {
      await friendStreak.save();
      continue;
    }

    if (isSameDay(friendStreak.lastSharedActivity, now)) {
      await friendStreak.save();
      continue;
    }

    const previousSharedStreak = friendStreak.currentSharedStreak;
    const yesterdayStart = getYesterdayStart(now);
    const lastSharedDay = friendStreak.lastSharedActivity
      ? getDayStart(friendStreak.lastSharedActivity)
      : null;

    if (lastSharedDay && lastSharedDay.getTime() === yesterdayStart.getTime()) {
      friendStreak.currentSharedStreak += 1;
    } else {
      friendStreak.currentSharedStreak = 1;
      friendStreak.sharedStreakStart = now;
    }

    friendStreak.lastSharedActivity = now;

    const milestoneReached = checkFriendStreakMilestone(
      friendStreak.currentSharedStreak,
      previousSharedStreak
    );
    if (milestoneReached) {
      friendStreak.milestones.push({
        value: milestoneReached,
        achievedAt: now,
      });
      milestonesReached.push(milestoneReached);
    }

    await friendStreak.save();
    sharedDaysCompleted += 1;
  }

  logger.info(
    {
      playerId,
      processed: friendStreaks.length,
      sharedDaysCompleted,
      milestonesReached,
    },
    'Updated friend streaks from learning action'
  );

  return {
    processed: friendStreaks.length,
    sharedDaysCompleted,
    milestonesReached,
  };
}

export function getFriendStreakPartner(
  friendStreak: Pick<
    IFriendStreak,
    'ownerPlayerId' | 'friendPlayerId' | 'ownerDisplayNameSnapshot' | 'friendDisplayNameSnapshot'
  >,
  playerId: string
) {
  const viewingAsOwner = String(friendStreak.ownerPlayerId) === playerId;
  return viewingAsOwner
    ? {
        id: friendStreak.friendPlayerId ? String(friendStreak.friendPlayerId) : null,
        displayName: friendStreak.friendDisplayNameSnapshot || 'Waiting for partner',
      }
    : {
        id: String(friendStreak.ownerPlayerId),
        displayName: friendStreak.ownerDisplayNameSnapshot,
      };
}
