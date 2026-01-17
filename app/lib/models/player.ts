/**
 * Player Model
 * 
 * What: Core player identity and account information
 * Why: Central model representing a user across all brands and games
 */

import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Player Document Interface
 * 
 * Why: TypeScript type safety for Player documents
 */
export interface IPlayer extends Document {
  facebookId: string;
  displayName: string;
  email?: string;
  profilePicture?: string;
  isPremium: boolean;
  premiumExpiresAt?: Date;
  isAnonymous: boolean; // Guest account flag
  brandId: mongoose.Types.ObjectId;
  locale: string;
  timezone?: string;
  lastLoginAt?: Date;
  lastSeenAt?: Date;
  isActive: boolean;
  isBanned: boolean;
  banReason?: string;
  bannedAt?: Date;
  emailPreferences?: {
    receiveLessonEmails: boolean;
    emailFrequency: 'daily' | 'weekly' | 'never';
    preferredEmailTime?: number; // Hour of day (0-23)
    timezone?: string; // User timezone for email scheduling
  };
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Player Schema
 * 
 * Why: Defines structure, validation, and indexes for Player collection
 */
const PlayerSchema = new Schema<IPlayer>(
  {
    // Facebook ID for authentication
    // Why: Primary authentication method, unique identifier
    facebookId: {
      type: String,
      required: [true, 'Facebook ID is required'],
      unique: true,
      trim: true,
      index: true,
    },

    // Display name shown in UI
    // Why: User-friendly name for leaderboards and profiles
    displayName: {
      type: String,
      required: [true, 'Display name is required'],
      trim: true,
      maxlength: [50, 'Display name cannot exceed 50 characters'],
    },

    // Email address
    // Why: Used for notifications and account recovery
    email: {
      type: String,
      trim: true,
      lowercase: true,
      sparse: true, // Allows multiple null values
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email must be valid'],
    },

    // Profile picture URL
    // Why: Visual representation in UI
    profilePicture: {
      type: String,
      trim: true,
    },

    // Premium status
    // Why: Determines access to premium games and features
    isPremium: {
      type: Boolean,
      default: false,
      index: true,
    },

    // Premium expiration date
    // Why: Premium subscriptions expire, need to track when
    premiumExpiresAt: {
      type: Date,
      index: true,
    },

    // Anonymous guest account flag
    // Why: Identify guest accounts for conversion tracking and analytics
    isAnonymous: {
      type: Boolean,
      default: false,
      index: true,
    },

    // Brand the player belongs to
    // Why: Multi-tenancy - player registered under specific brand
    brandId: {
      type: Schema.Types.ObjectId,
      ref: 'Brand',
      required: [true, 'Brand ID is required'],
      index: true,
    },

    // Player locale (language preference)
    // Why: Used for i18n and localization
    locale: {
      type: String,
      default: 'hu', // Hungarian as default
      trim: true,
      lowercase: true,
      index: true,
    },

    // Player timezone
    // Why: Used for daily challenge resets and time-based features
    timezone: {
      type: String,
      trim: true,
    },

    // Last login timestamp
    // Why: Track player activity, identify inactive players
    lastLoginAt: {
      type: Date,
      index: true,
    },

    // Last seen timestamp (any activity)
    // Why: More granular activity tracking than login
    lastSeenAt: {
      type: Date,
      index: true,
    },

    // Active account status
    // Why: Soft delete - deactivate without losing data
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    // Ban status
    // Why: Prevent abusive players from accessing system
    isBanned: {
      type: Boolean,
      default: false,
      index: true,
    },

    // Reason for ban
    // Why: Audit trail for moderation actions
    banReason: {
      type: String,
      trim: true,
    },

    // Ban timestamp
    // Why: Track when ban was applied
    bannedAt: {
      type: Date,
    },

    // Email preferences for course lessons
    // Why: Control how and when students receive lesson emails
    emailPreferences: {
      receiveLessonEmails: {
        type: Boolean,
        default: true,
      },
      emailFrequency: {
        type: String,
        enum: ['daily', 'weekly', 'never'],
        default: 'daily',
      },
      preferredEmailTime: {
        type: Number,
        min: [0, 'Preferred email time must be between 0 and 23'],
        max: [23, 'Preferred email time must be between 0 and 23'],
        default: 8, // 8 AM default
      },
      timezone: {
        type: String,
        trim: true,
      },
    },

    // Flexible metadata field for player-specific data
    // Why: Allows storing additional player info without schema changes
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    // Automatic timestamps
    // Why: Track when players register and update profiles
    timestamps: true,
    
    // Strict mode to reject undefined fields
    // Why: Prevents data corruption from unexpected fields
    strict: true,
    
    // Collection name
    // Why: Explicitly named for clarity
    collection: 'players',
  }
);

// Indexes for efficient querying
// Why: Players are queried frequently by facebookId, brand, premium status

PlayerSchema.index({ facebookId: 1 }, { name: 'player_facebook_id_unique', unique: true });
PlayerSchema.index({ brandId: 1 }, { name: 'player_brand' });
PlayerSchema.index({ isPremium: 1 }, { name: 'player_premium' });
PlayerSchema.index({ email: 1 }, { name: 'player_email', sparse: true });
PlayerSchema.index({ isActive: 1 }, { name: 'player_active' });
PlayerSchema.index({ isBanned: 1 }, { name: 'player_banned' });
PlayerSchema.index({ lastLoginAt: 1 }, { name: 'player_last_login' });
PlayerSchema.index({ brandId: 1, isPremium: 1 }, { name: 'player_brand_premium' });

/**
 * Pre-save hook to check premium expiration
 * 
 * Why: Automatically set isPremium to false if expired
 */
PlayerSchema.pre('save', function (next) {
  if (this.premiumExpiresAt && this.premiumExpiresAt < new Date()) {
    this.isPremium = false;
  }
  next();
});

/**
 * Virtual for full name (if we add firstName/lastName later)
 * 
 * Why: Example of computed properties
 */
PlayerSchema.virtual('hasPremiumExpired').get(function () {
  if (!this.premiumExpiresAt) return false;
  return this.premiumExpiresAt < new Date();
});

/**
 * Player Model
 * 
 * Why: Export typed model for use in application
 */
const Player: Model<IPlayer> =
  mongoose.models.Player || mongoose.model<IPlayer>('Player', PlayerSchema);

export default Player;
