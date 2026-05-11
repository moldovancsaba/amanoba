import { beforeEach, describe, expect, it, vi } from 'vitest';
import mongoose from 'mongoose';

const findOneMock = vi.fn();
const saveMock = vi.fn();

vi.mock('@/lib/models', () => {
  class MockStreak {
    static findOne = findOneMock;
    static updateMany = vi.fn();

    playerId!: mongoose.Types.ObjectId;
    type!: string;
    currentStreak!: number;
    bestStreak!: number;
    lastActivity!: Date;
    streakStart!: Date;
    bonusMultiplier!: number;
    milestones!: Array<{ value: number; achievedAt: Date; rewardGiven: boolean }>;
    metadata!: { createdAt: Date; updatedAt: Date; expiresAt?: Date };

    constructor(data: {
      playerId: mongoose.Types.ObjectId;
      type: string;
      currentStreak: number;
      bestStreak: number;
      lastActivity: Date;
      streakStart: Date;
      bonusMultiplier: number;
      milestones: Array<{ value: number; achievedAt: Date; rewardGiven: boolean }>;
      metadata: { createdAt: Date; updatedAt: Date; expiresAt?: Date };
    }) {
      Object.assign(this, data);
    }

    save = saveMock;
  }

  return { Streak: MockStreak };
});

vi.mock('@/lib/logger', () => ({
  default: {
    info: vi.fn(),
    error: vi.fn(),
  },
}));

describe('updateDailyLearningStreak', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    vi.useFakeTimers();
    saveMock.mockResolvedValue(undefined);
  });

  it('starts a new learning streak on the first qualifying activity', async () => {
    vi.setSystemTime(new Date('2026-05-11T10:00:00.000Z'));
    findOneMock.mockResolvedValue(null);

    const { updateDailyLearningStreak } = await import('@/lib/gamification/streak-manager');
    const result = await updateDailyLearningStreak(new mongoose.Types.ObjectId());

    expect(result).toEqual({
      currentStreak: 1,
      continued: false,
    });
    expect(saveMock).toHaveBeenCalledTimes(1);
  });

  it('does not increment again for a second qualifying activity on the same day', async () => {
    vi.setSystemTime(new Date('2026-05-11T10:00:00.000Z'));
    findOneMock.mockResolvedValue({
      currentStreak: 4,
      bestStreak: 6,
      lastActivity: new Date('2026-05-11T07:30:00.000Z'),
      streakStart: new Date('2026-05-08T07:30:00.000Z'),
      bonusMultiplier: 1,
      milestones: [],
      metadata: { createdAt: new Date('2026-05-08T07:30:00.000Z'), updatedAt: new Date('2026-05-11T07:30:00.000Z') },
      save: saveMock,
    });

    const { updateDailyLearningStreak } = await import('@/lib/gamification/streak-manager');
    const result = await updateDailyLearningStreak(new mongoose.Types.ObjectId());

    expect(result).toEqual({
      currentStreak: 4,
      continued: false,
    });
    expect(saveMock).not.toHaveBeenCalled();
  });

  it('continues the streak when the learner completes a qualifying action the next day', async () => {
    vi.setSystemTime(new Date('2026-05-11T10:00:00.000Z'));
    const streakDoc = {
      currentStreak: 2,
      bestStreak: 2,
      lastActivity: new Date('2026-05-10T07:30:00.000Z'),
      streakStart: new Date('2026-05-09T07:30:00.000Z'),
      bonusMultiplier: 1,
      milestones: [],
      metadata: { createdAt: new Date('2026-05-09T07:30:00.000Z'), updatedAt: new Date('2026-05-10T07:30:00.000Z') },
      save: saveMock,
    };
    findOneMock.mockResolvedValue(streakDoc);

    const { updateDailyLearningStreak } = await import('@/lib/gamification/streak-manager');
    const result = await updateDailyLearningStreak(new mongoose.Types.ObjectId());

    expect(result).toEqual({
      currentStreak: 3,
      continued: true,
      milestoneReached: 3,
    });
    expect(streakDoc.currentStreak).toBe(3);
    expect(saveMock).toHaveBeenCalledTimes(1);
  });
});
