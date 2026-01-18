/**
 * AnalyticsSnapshot Model
 * 
 * Purpose: Pre-aggregated analytics metrics for fast dashboard loading
 * Why: Avoids expensive real-time aggregations by caching calculated metrics
 * 
 * Features:
 * - Daily/weekly/monthly aggregations
 * - Per-brand and per-game metrics
 * - Player activity and engagement stats
 * - Revenue and points economy metrics
 * - Automated cron job population
 */

import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Interface: AnalyticsSnapshot document structure
 * Why: Type-safe access to snapshot properties
 */
export interface IAnalyticsSnapshot extends Document {
  snapshotType: 'daily' | 'weekly' | 'monthly';
  periodStart: Date;
  periodEnd: Date;
  brandId?: mongoose.Types.ObjectId; // Null for global snapshots
  gameId?: mongoose.Types.ObjectId; // Null for brand-level or global snapshots
  metrics: {
    players: {
      totalActive: number;
      newRegistrations: number;
      returning: number;
      premiumCount: number;
    };
    gameplay: {
      totalSessions: number;
      totalPlayTime: number; // milliseconds
      averageSessionTime: number; // milliseconds
      completionRate: number; // percentage
    };
    engagement: {
      totalLogins: number;
      dailyActiveUsers: number;
      weeklyActiveUsers: number;
      monthlyActiveUsers: number;
      averageSessionsPerPlayer: number;
    };
    economy: {
      pointsEarned: number;
      pointsSpent: number;
      rewardsRedeemed: number;
      averagePointsPerPlayer: number;
    };
    gamification: {
      achievementsUnlocked: number;
      levelsGained: number;
      streaksStarted: number;
      totalXPEarned: number;
    };
  };
  metadata: {
    createdAt: Date;
    calculatedAt: Date;
    calculationDuration: number; // milliseconds
    dataPoints: number; // How many records were aggregated
  };
}

/**
 * Schema: AnalyticsSnapshot
 * Why: Enforces structure for pre-aggregated analytics
 */
const AnalyticsSnapshotSchema = new Schema<IAnalyticsSnapshot>(
  {
    snapshotType: {
      type: String,
      enum: {
        values: ['daily', 'weekly', 'monthly'],
        message: 'Snapshot type must be daily, weekly, or monthly',
      },
      required: [true, 'Snapshot type is required'],
      index: true,
      // Why: Different aggregation granularities
    },
    periodStart: {
      type: Date,
      required: [true, 'Period start is required'],
      index: true,
      // Why: Start of aggregation period
    },
    periodEnd: {
      type: Date,
      required: [true, 'Period end is required'],
      // Why: End of aggregation period
    },
    brandId: {
      type: Schema.Types.ObjectId,
      ref: 'Brand',
      // Why: Index created explicitly at schema level in compound index
    },
    gameId: {
      type: Schema.Types.ObjectId,
      ref: 'Game',
      index: true,
      // Why: Null for brand/global, specific for game-level snapshots
    },
    metrics: {
      players: {
        totalActive: {
          type: Number,
          default: 0,
          min: 0,
          // Why: Players who played in this period
        },
        newRegistrations: {
          type: Number,
          default: 0,
          min: 0,
          // Why: New player signups
        },
        returning: {
          type: Number,
          default: 0,
          min: 0,
          // Why: Players who returned after being inactive
        },
        premiumCount: {
          type: Number,
          default: 0,
          min: 0,
          // Why: Premium players count
        },
      },
      gameplay: {
        totalSessions: {
          type: Number,
          default: 0,
          min: 0,
          // Why: Total game sessions played
        },
        totalPlayTime: {
          type: Number,
          default: 0,
          min: 0,
          // Why: Cumulative play time in milliseconds
        },
        averageSessionTime: {
          type: Number,
          default: 0,
          min: 0,
          // Why: Mean session duration
        },
        completionRate: {
          type: Number,
          default: 0,
          min: 0,
          max: 100,
          // Why: Percentage of sessions completed vs abandoned
        },
      },
      engagement: {
        totalLogins: {
          type: Number,
          default: 0,
          min: 0,
          // Why: Total login events
        },
        dailyActiveUsers: {
          type: Number,
          default: 0,
          min: 0,
          // Why: DAU metric
        },
        weeklyActiveUsers: {
          type: Number,
          default: 0,
          min: 0,
          // Why: WAU metric
        },
        monthlyActiveUsers: {
          type: Number,
          default: 0,
          min: 0,
          // Why: MAU metric
        },
        averageSessionsPerPlayer: {
          type: Number,
          default: 0,
          min: 0,
          // Why: Engagement depth metric
        },
      },
      economy: {
        pointsEarned: {
          type: Number,
          default: 0,
          min: 0,
          // Why: Total points earned in period
        },
        pointsSpent: {
          type: Number,
          default: 0,
          min: 0,
          // Why: Total points spent in period
        },
        rewardsRedeemed: {
          type: Number,
          default: 0,
          min: 0,
          // Why: Total reward redemptions
        },
        averagePointsPerPlayer: {
          type: Number,
          default: 0,
          min: 0,
          // Why: Mean points balance
        },
      },
      gamification: {
        achievementsUnlocked: {
          type: Number,
          default: 0,
          min: 0,
          // Why: Total achievements earned
        },
        levelsGained: {
          type: Number,
          default: 0,
          min: 0,
          // Why: Total level-ups
        },
        streaksStarted: {
          type: Number,
          default: 0,
          min: 0,
          // Why: New streaks initiated
        },
        totalXPEarned: {
          type: Number,
          default: 0,
          min: 0,
          // Why: Total experience points gained
        },
      },
    },
    metadata: {
      createdAt: {
        type: Date,
        default: () => new Date(),
        immutable: true,
        // Why: ISO 8601 timestamp for snapshot creation
      },
      calculatedAt: {
        type: Date,
        required: [true, 'Calculated at is required'],
        default: () => new Date(),
        // Why: When aggregation was computed
      },
      calculationDuration: {
        type: Number,
        default: 0,
        min: 0,
        // Why: How long aggregation took (performance monitoring)
      },
      dataPoints: {
        type: Number,
        default: 0,
        min: 0,
        // Why: Number of records aggregated (data quality indicator)
      },
    },
  },
  {
    timestamps: false, // Using custom metadata timestamps
    strict: true,
  }
);

/**
 * Indexes
 * Why: Optimizes analytics dashboard queries
 */
AnalyticsSnapshotSchema.index(
  { snapshotType: 1, brandId: 1, gameId: 1, periodStart: -1 },
  { unique: true }
);
// Why: One snapshot per period per scope

AnalyticsSnapshotSchema.index({ snapshotType: 1, periodStart: -1 });
// Why: Recent snapshots queries

AnalyticsSnapshotSchema.index({ brandId: 1, snapshotType: 1, periodStart: -1 });
// Why: Brand-specific analytics over time

AnalyticsSnapshotSchema.index({ gameId: 1, snapshotType: 1, periodStart: -1 });
// Why: Game-specific analytics over time

/**
 * Export Model
 * Why: Singleton pattern prevents multiple model compilations
 */
const AnalyticsSnapshot: Model<IAnalyticsSnapshot> =
  mongoose.models.AnalyticsSnapshot ||
  mongoose.model<IAnalyticsSnapshot>('AnalyticsSnapshot', AnalyticsSnapshotSchema);

export default AnalyticsSnapshot;
