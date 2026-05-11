/**
 * PracticeHubRewardGrant Model
 *
 * What: Stores one-time Practice Hub reward grants per learner recommendation
 * Why: Prevents reward farming while preserving a clean audit trail
 */

import mongoose, { Schema, Document, Model } from 'mongoose';
import type { PracticeCompletionTrigger, PracticeModeId } from '@/app/lib/practice-hub';

export interface IPracticeHubRewardGrant extends Document {
  playerId: mongoose.Types.ObjectId;
  brandId?: mongoose.Types.ObjectId;
  courseId: string;
  lessonDay: number;
  mode: PracticeModeId;
  trigger: PracticeCompletionTrigger;
  pointsAwarded: number;
  xpAwarded: number;
  grantedAt: Date;
  metadata: {
    createdAt: Date;
    updatedAt: Date;
  };
}

const PracticeHubRewardGrantSchema = new Schema<IPracticeHubRewardGrant>(
  {
    playerId: {
      type: Schema.Types.ObjectId,
      ref: 'Player',
      required: [true, 'Player ID is required'],
      index: true,
    },
    brandId: {
      type: Schema.Types.ObjectId,
      ref: 'Brand',
      index: true,
    },
    courseId: {
      type: String,
      required: [true, 'Course ID is required'],
      trim: true,
      uppercase: true,
    },
    lessonDay: {
      type: Number,
      required: [true, 'Lesson day is required'],
      min: [1, 'Lesson day must be at least 1'],
    },
    mode: {
      type: String,
      enum: {
        values: ['continue-next', 'quiz-recovery', 'stale-refresh'],
        message: 'Practice mode must be valid',
      },
      required: [true, 'Practice mode is required'],
    },
    trigger: {
      type: String,
      enum: {
        values: ['lesson_completed', 'quiz_passed'],
        message: 'Practice trigger must be valid',
      },
      required: [true, 'Practice trigger is required'],
    },
    pointsAwarded: {
      type: Number,
      required: [true, 'Points awarded is required'],
      min: [0, 'Points awarded cannot be negative'],
      default: 0,
    },
    xpAwarded: {
      type: Number,
      required: [true, 'XP awarded is required'],
      min: [0, 'XP awarded cannot be negative'],
      default: 0,
    },
    grantedAt: {
      type: Date,
      required: [true, 'Granted at is required'],
      default: () => new Date(),
    },
    metadata: {
      createdAt: {
        type: Date,
        default: () => new Date(),
      },
      updatedAt: {
        type: Date,
        default: () => new Date(),
      },
    },
  },
  {
    timestamps: false,
    strict: true,
    collection: 'practice_hub_reward_grants',
  }
);

PracticeHubRewardGrantSchema.index(
  { playerId: 1, mode: 1, courseId: 1, lessonDay: 1 },
  { unique: true, name: 'practice_hub_reward_unique' }
);

PracticeHubRewardGrantSchema.pre('save', function (next) {
  if (!this.isNew) {
    this.metadata.updatedAt = new Date();
  }
  next();
});

const PracticeHubRewardGrant: Model<IPracticeHubRewardGrant> =
  mongoose.models.PracticeHubRewardGrant ||
  mongoose.model<IPracticeHubRewardGrant>('PracticeHubRewardGrant', PracticeHubRewardGrantSchema);

export default PracticeHubRewardGrant;
