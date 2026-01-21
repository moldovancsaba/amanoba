/**
 * Feature Flags Model
 * 
 * What: Stores which features are enabled/disabled on the platform
 * Why: Allows admins to control which parts of the site are visible and accessible
 */

import mongoose, { Schema, Document } from 'mongoose';

export interface IFeatureFlags extends Document {
  brandId: mongoose.Types.ObjectId;
  features: {
    courses: boolean;
    myCourses: boolean;
    games: boolean;
    stats: boolean;
    leaderboards: boolean;
    challenges: boolean;
    quests: boolean;
    achievements: boolean;
    rewards: boolean;
  };
  metadata: {
    updatedAt: Date;
    updatedBy?: string;
  };
}

const FeatureFlagsSchema = new Schema<IFeatureFlags>(
  {
    brandId: {
      type: Schema.Types.ObjectId,
      ref: 'Brand',
      required: [true, 'Brand ID is required'],
      unique: true,
      // Why: unique: true automatically creates an index, no need for explicit index
    },
    features: {
      courses: {
        type: Boolean,
        default: true,
      },
      myCourses: {
        type: Boolean,
        default: true,
      },
      games: {
        type: Boolean,
        default: false,
      },
      stats: {
        type: Boolean,
        default: false,
      },
      leaderboards: {
        type: Boolean,
        default: false,
      },
      challenges: {
        type: Boolean,
        default: false,
      },
      quests: {
        type: Boolean,
        default: false,
      },
      achievements: {
        type: Boolean,
        default: false,
      },
      rewards: {
        type: Boolean,
        default: false,
      },
    },
    metadata: {
      updatedAt: {
        type: Date,
        default: Date.now,
      },
      updatedBy: {
        type: String,
        trim: true,
      },
    },
  },
  {
    timestamps: true,
    collection: 'featureflags',
  }
);

// Note: brandId index is automatically created by unique: true constraint above
// No need for explicit index to avoid duplicates

export default mongoose.models.FeatureFlags ||
  mongoose.model<IFeatureFlags>('FeatureFlags', FeatureFlagsSchema);
