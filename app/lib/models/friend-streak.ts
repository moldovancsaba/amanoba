/**
 * Friend Streak Model
 *
 * What: Tracks a pair-based shared learning streak between two learners
 * Why: Supports a bounded peer-accountability loop without a full social graph
 */

import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFriendStreak extends Document {
  brandId: mongoose.Types.ObjectId;
  ownerPlayerId: mongoose.Types.ObjectId;
  friendPlayerId?: mongoose.Types.ObjectId | null;
  ownerDisplayNameSnapshot: string;
  friendDisplayNameSnapshot?: string | null;
  inviteCode: string;
  status: 'pending' | 'active' | 'ended';
  ownerLastQualifiedOn?: Date | null;
  friendLastQualifiedOn?: Date | null;
  currentSharedStreak: number;
  bestSharedStreak: number;
  lastSharedActivity?: Date | null;
  sharedStreakStart?: Date | null;
  milestones: Array<{
    value: number;
    achievedAt: Date;
  }>;
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    joinedAt?: Date | null;
    endedAt?: Date | null;
  };
}

const FriendStreakSchema = new Schema<IFriendStreak>(
  {
    brandId: {
      type: Schema.Types.ObjectId,
      ref: 'Brand',
      required: [true, 'Brand ID is required'],
      index: true,
    },
    ownerPlayerId: {
      type: Schema.Types.ObjectId,
      ref: 'Player',
      required: [true, 'Owner player ID is required'],
      index: true,
    },
    friendPlayerId: {
      type: Schema.Types.ObjectId,
      ref: 'Player',
      default: null,
      index: true,
    },
    ownerDisplayNameSnapshot: {
      type: String,
      required: [true, 'Owner display name is required'],
      trim: true,
      maxlength: [50, 'Display name cannot exceed 50 characters'],
    },
    friendDisplayNameSnapshot: {
      type: String,
      default: null,
      trim: true,
      maxlength: [50, 'Display name cannot exceed 50 characters'],
    },
    inviteCode: {
      type: String,
      required: [true, 'Invite code is required'],
      trim: true,
      uppercase: true,
      minlength: [6, 'Invite code must be at least 6 characters'],
      maxlength: [16, 'Invite code cannot exceed 16 characters'],
      unique: true,
      index: true,
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'active', 'ended'],
        message: 'Status must be pending, active, or ended',
      },
      default: 'pending',
      index: true,
    },
    ownerLastQualifiedOn: {
      type: Date,
      default: null,
    },
    friendLastQualifiedOn: {
      type: Date,
      default: null,
    },
    currentSharedStreak: {
      type: Number,
      required: [true, 'Current shared streak is required'],
      default: 0,
      min: [0, 'Current shared streak cannot be negative'],
    },
    bestSharedStreak: {
      type: Number,
      required: [true, 'Best shared streak is required'],
      default: 0,
      min: [0, 'Best shared streak cannot be negative'],
    },
    lastSharedActivity: {
      type: Date,
      default: null,
    },
    sharedStreakStart: {
      type: Date,
      default: null,
    },
    milestones: [
      {
        value: {
          type: Number,
          required: true,
          min: 1,
        },
        achievedAt: {
          type: Date,
          required: true,
          default: () => new Date(),
        },
      },
    ],
    metadata: {
      createdAt: {
        type: Date,
        default: () => new Date(),
        immutable: true,
      },
      updatedAt: {
        type: Date,
        default: () => new Date(),
      },
      joinedAt: {
        type: Date,
        default: null,
      },
      endedAt: {
        type: Date,
        default: null,
      },
    },
  },
  {
    timestamps: false,
    strict: true,
  }
);

FriendStreakSchema.index({ ownerPlayerId: 1, status: 1 });
FriendStreakSchema.index({ friendPlayerId: 1, status: 1 });
FriendStreakSchema.index({ brandId: 1, status: 1 });

FriendStreakSchema.pre('save', function (next) {
  if (this.currentSharedStreak > this.bestSharedStreak) {
    this.bestSharedStreak = this.currentSharedStreak;
  }

  if (!this.isNew) {
    this.metadata.updatedAt = new Date();
  }

  next();
});

const FriendStreak: Model<IFriendStreak> =
  mongoose.models.FriendStreak ||
  mongoose.model<IFriendStreak>('FriendStreak', FriendStreakSchema);

export default FriendStreak;
