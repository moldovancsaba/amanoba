/**
 * Game Model
 * 
 * What: Represents a game type (QUIZZZ, WHACKPOP, MADOKU) in the system
 * Why: Centralizes game definitions, rules, and scoring configuration
 */

import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Game Types Enum
 * 
 * Why: Type-safe game type references throughout application
 */
export enum GameType {
  QUIZZZ = 'QUIZZZ',
  WHACKPOP = 'WHACKPOP',
  MADOKU = 'MADOKU',
  SUDOKU = 'SUDOKU',
  MEMORY = 'MEMORY',
}

/**
 * Game Document Interface
 * 
 * Why: TypeScript type safety for Game documents
 */
export interface IGame extends Document {
  gameId: string;
  name: string;
  type: GameType;
  description: string;
  rules?: string;
  thumbnail?: string;
  isActive: boolean;
  requiresAuth: boolean;
  isPremium: boolean;
  minPlayers: number;
  maxPlayers: number;
  averageDurationSeconds: number;
  pointsConfig: {
    winPoints: number;
    losePoints: number;
    participationPoints: number;
    perfectGameBonus?: number;
  };
  xpConfig: {
    winXP: number;
    loseXP: number;
    participationXP: number;
  };
  difficultyLevels?: string[];
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Game Schema
 * 
 * Why: Defines structure, validation, and indexes for Game collection
 */
const GameSchema = new Schema<IGame>(
  {
    // Unique game identifier
    // Why: Used as primary key for game references
    gameId: {
      type: String,
      required: [true, 'Game ID is required'],
      unique: true,
      uppercase: true,
      trim: true,
      match: [/^[A-Z_]+$/, 'Game ID must contain only uppercase letters and underscores'],
    },

    // Display name of the game
    // Why: Shown to players in UI
    name: {
      type: String,
      required: [true, 'Game name is required'],
      trim: true,
      maxlength: [100, 'Game name cannot exceed 100 characters'],
    },

    // Game type enum
    // Why: Categorizes game for type-specific logic
    type: {
      type: String,
      required: [true, 'Game type is required'],
      enum: {
        values: Object.values(GameType),
        message: 'Invalid game type',
      },
    },

    // Game description for players
    // Why: Explains what the game is about
    description: {
      type: String,
      required: [true, 'Game description is required'],
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },

    // Game rules text (markdown supported)
    // Why: Detailed instructions for players
    rules: {
      type: String,
      trim: true,
    },

    // Thumbnail image URL
    // Why: Visual representation in game launcher
    thumbnail: {
      type: String,
      trim: true,
    },

    // Game activation status
    // Why: Allows temporarily disabling game without deleting
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    // Requires player authentication
    // Why: Some games might allow guest play
    requiresAuth: {
      type: Boolean,
      default: true,
    },

    // Premium-only game flag
    // Why: Used in progressive disclosure and access control
    isPremium: {
      type: Boolean,
      default: false,
      index: true,
    },

    // Minimum players required
    // Why: For multiplayer games (future feature)
    minPlayers: {
      type: Number,
      required: [true, 'Minimum players is required'],
      default: 1,
      min: [1, 'Minimum players must be at least 1'],
    },

    // Maximum players allowed
    // Why: For multiplayer games (future feature)
    maxPlayers: {
      type: Number,
      required: [true, 'Maximum players is required'],
      default: 1,
      min: [1, 'Maximum players must be at least 1'],
    },

    // Average game duration in seconds
    // Why: Used for time estimates in UI
    averageDurationSeconds: {
      type: Number,
      required: [true, 'Average duration is required'],
      min: [1, 'Duration must be positive'],
    },

    // Points configuration
    // Why: Defines how many points are awarded for different outcomes
    pointsConfig: {
      winPoints: {
        type: Number,
        required: [true, 'Win points is required'],
        min: [0, 'Win points cannot be negative'],
      },
      losePoints: {
        type: Number,
        default: 0,
        min: [0, 'Lose points cannot be negative'],
      },
      participationPoints: {
        type: Number,
        default: 0,
        min: [0, 'Participation points cannot be negative'],
      },
      perfectGameBonus: {
        type: Number,
        min: [0, 'Perfect game bonus cannot be negative'],
      },
    },

    // XP configuration
    // Why: Defines how much XP is awarded for different outcomes
    xpConfig: {
      winXP: {
        type: Number,
        required: [true, 'Win XP is required'],
        min: [0, 'Win XP cannot be negative'],
      },
      loseXP: {
        type: Number,
        default: 0,
        min: [0, 'Lose XP cannot be negative'],
      },
      participationXP: {
        type: Number,
        default: 0,
        min: [0, 'Participation XP cannot be negative'],
      },
    },

    // Difficulty levels supported
    // Why: Games like Madoku have different difficulty settings
    difficultyLevels: {
      type: [String],
      default: ['normal'],
    },

    // Flexible metadata field for game-specific config
    // Why: Allows adding game-specific settings without schema changes
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    // Automatic timestamps
    // Why: Track when games are created and updated
    timestamps: true,
    
    // Strict mode to reject undefined fields
    // Why: Prevents data corruption from unexpected fields
    strict: true,
    
    // Collection name
    // Why: Explicitly named for clarity
    collection: 'games',
  }
);

// Indexes for efficient querying
// Why: Games are queried by active status, premium flag, and type

GameSchema.index({ gameId: 1 }, { name: 'game_id_unique', unique: true });
GameSchema.index({ isActive: 1 }, { name: 'game_active' });
GameSchema.index({ isPremium: 1 }, { name: 'game_premium' });
GameSchema.index({ type: 1 }, { name: 'game_type' });
GameSchema.index({ isActive: 1, isPremium: 1 }, { name: 'game_active_premium' });

/**
 * Pre-save hook to ensure maxPlayers >= minPlayers
 * 
 * Why: Data consistency - max cannot be less than min
 */
GameSchema.pre('save', function (next) {
  if (this.maxPlayers < this.minPlayers) {
    return next(new Error('Maximum players must be greater than or equal to minimum players'));
  }
  next();
});

/**
 * Game Model
 * 
 * Why: Export typed model for use in application
 */
const Game: Model<IGame> =
  mongoose.models.Game || mongoose.model<IGame>('Game', GameSchema);

export default Game;
