import { beforeEach, describe, expect, it, vi } from 'vitest';
import mongoose from 'mongoose';

const findMock = vi.fn();
const saveMock = vi.fn();

vi.mock('@/lib/models', () => ({
  FriendStreak: {
    find: findMock,
  },
}));

vi.mock('@/lib/logger', () => ({
  default: {
    info: vi.fn(),
  },
}));

describe('updateFriendStreaksForLearningAction', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    vi.useFakeTimers();
    saveMock.mockResolvedValue(undefined);
  });

  it('starts the shared streak when the second partner learns on the same day', async () => {
    vi.setSystemTime(new Date('2026-05-11T10:00:00.000Z'));
    const ownerId = new mongoose.Types.ObjectId();
    const friendId = new mongoose.Types.ObjectId();
    const doc = {
      ownerPlayerId: ownerId,
      friendPlayerId: friendId,
      ownerLastQualifiedOn: new Date('2026-05-11T07:00:00.000Z'),
      friendLastQualifiedOn: null,
      currentSharedStreak: 0,
      bestSharedStreak: 0,
      lastSharedActivity: null,
      sharedStreakStart: null,
      milestones: [],
      save: saveMock,
    };
    findMock.mockResolvedValue([doc]);

    const { updateFriendStreaksForLearningAction } = await import('@/lib/friend-streaks');
    const result = await updateFriendStreaksForLearningAction(friendId, new Date('2026-05-11T10:00:00.000Z'));

    expect(result).toEqual({
      processed: 1,
      sharedDaysCompleted: 1,
      milestonesReached: [],
    });
    expect(doc.currentSharedStreak).toBe(1);
    expect(doc.lastSharedActivity).toEqual(new Date('2026-05-11T10:00:00.000Z'));
  });

  it('does not increment twice for repeated activity on the same shared day', async () => {
    vi.setSystemTime(new Date('2026-05-11T12:00:00.000Z'));
    const ownerId = new mongoose.Types.ObjectId();
    const friendId = new mongoose.Types.ObjectId();
    const doc = {
      ownerPlayerId: ownerId,
      friendPlayerId: friendId,
      ownerLastQualifiedOn: new Date('2026-05-11T07:00:00.000Z'),
      friendLastQualifiedOn: new Date('2026-05-11T08:00:00.000Z'),
      currentSharedStreak: 4,
      bestSharedStreak: 4,
      lastSharedActivity: new Date('2026-05-11T08:00:00.000Z'),
      sharedStreakStart: new Date('2026-05-08T08:00:00.000Z'),
      milestones: [],
      save: saveMock,
    };
    findMock.mockResolvedValue([doc]);

    const { updateFriendStreaksForLearningAction } = await import('@/lib/friend-streaks');
    const result = await updateFriendStreaksForLearningAction(friendId, new Date('2026-05-11T12:00:00.000Z'));

    expect(result).toEqual({
      processed: 1,
      sharedDaysCompleted: 0,
      milestonesReached: [],
    });
    expect(doc.currentSharedStreak).toBe(4);
  });

  it('continues the shared streak on the next day when both partners qualify again', async () => {
    vi.setSystemTime(new Date('2026-05-11T10:00:00.000Z'));
    const ownerId = new mongoose.Types.ObjectId();
    const friendId = new mongoose.Types.ObjectId();
    const doc = {
      ownerPlayerId: ownerId,
      friendPlayerId: friendId,
      ownerLastQualifiedOn: new Date('2026-05-11T07:00:00.000Z'),
      friendLastQualifiedOn: new Date('2026-05-10T08:00:00.000Z'),
      currentSharedStreak: 2,
      bestSharedStreak: 2,
      lastSharedActivity: new Date('2026-05-10T08:00:00.000Z'),
      sharedStreakStart: new Date('2026-05-09T08:00:00.000Z'),
      milestones: [],
      save: saveMock,
    };
    findMock.mockResolvedValue([doc]);

    const { updateFriendStreaksForLearningAction } = await import('@/lib/friend-streaks');
    const result = await updateFriendStreaksForLearningAction(friendId, new Date('2026-05-11T10:00:00.000Z'));

    expect(result).toEqual({
      processed: 1,
      sharedDaysCompleted: 1,
      milestonesReached: [3],
    });
    expect(doc.currentSharedStreak).toBe(3);
    expect(doc.milestones).toHaveLength(1);
  });
});
