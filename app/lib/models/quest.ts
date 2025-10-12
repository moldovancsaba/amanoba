/**
 * Quest Model
 * 
 * Purpose: Multi-step challenges with sequential or parallel steps and dependencies
 * Why: Drives deeper engagement with narrative-driven, long-form objectives
 * 
 * Features:
 * - Multi-step quest chains
 * - Step dependencies (sequential, parallel, conditional)
 * - Narrative/story elements
 * - Progressive rewards per step + completion reward
 * - Quest categories and tags
 * - Time limits (optional)
 * - Repeatable vs one-time quests
 */

import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Quest Categories
 * 
 * Why: Organize quests by theme and purpose
 */
export type QuestCategory = 
  | 'tutorial'      // Onboarding quests
  | 'daily'         // Daily quest chains
  | 'weekly'        // Weekly quest chains
  | 'seasonal'      // Limited-time seasonal quests
  | 'achievement'   // Achievement-based quests
  | 'story'         // Narrative-driven quests
  | 'challenge';    // Difficult challenge quests

/**
 * Quest Step Types
 * 
 * Why: Different step requirements for variety
 */
export type QuestStepType =
  | 'play_games'           // Play N games
  | 'win_games'            // Win N games
  | 'earn_points'          // Earn N points
  | 'earn_xp'              // Earn N XP
  | 'unlock_achievement'   // Unlock specific achievement
  | 'reach_level'          // Reach specific level
  | 'complete_challenge'   // Complete daily challenge
  | 'spend_points'         // Spend N points
  | 'win_streak'           // Achieve N win streak
  | 'play_specific_game';  // Play/win specific game

/**
 * Quest Step Dependency Type
 * 
 * Why: Controls step unlock logic
 */
export type StepDependency = 
  | 'sequential'   // Must complete previous step first
  | 'parallel'     // Can work on multiple steps simultaneously
  | 'conditional'; // Unlocks based on specific conditions

/**
 * Interface: Quest Step
 * 
 * Why: Individual step within a quest
 */
export interface IQuestStep {
  stepNumber: number;
  title: string;
  description: string;
  type: QuestStepType;
  requirement: {
    target: number;
    gameId?: mongoose.Types.ObjectId;
    achievementId?: mongoose.Types.ObjectId;
    level?: number;
    metric?: string;
  };
  rewards: {
    points: number;
    xp: number;
  };
  dependency: StepDependency;
  isOptional: boolean; // Quest can be completed without this step
}

/**
 * Interface: Quest document structure
 * 
 * Why: Type-safe access to quest properties
 */
export interface IQuest extends Document {
  title: string;
  description: string;
  story?: string; // Narrative text
  category: QuestCategory;
  tags: string[];
  steps: IQuestStep[];
  totalSteps: number;
  rewards: {
    completionPoints: number; // Bonus points for completing entire quest
    completionXP: number;
    unlocks?: {
      achievementId?: mongoose.Types.ObjectId;
      gameId?: mongoose.Types.ObjectId;
      rewardId?: mongoose.Types.ObjectId;
    };
  };
  requirements: {
    minLevel?: number;
    isPremiumOnly: boolean;
    prerequisiteQuestId?: mongoose.Types.ObjectId;
  };
  availability: {
    isActive: boolean;
    startDate?: Date;
    endDate?: Date;
    isRepeatable: boolean;
    repeatCooldown?: number; // Days before can repeat
  };
  statistics: {
    totalStarted: number;
    totalCompleted: number;
    completionRate: number; // Percentage
    averageCompletionTime: number; // Milliseconds
  };
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    displayOrder: number;
  };
}

/**
 * Interface: Player Quest Progress
 * 
 * Why: Tracks individual player progress through a quest
 */
export interface IPlayerQuestProgress extends Document {
  playerId: mongoose.Types.ObjectId;
  questId: mongoose.Types.ObjectId;
  status: 'not_started' | 'in_progress' | 'completed' | 'abandoned';
  currentStep: number;
  stepsCompleted: number[];
  stepsProgress: Map<number, {
    progress: number;
    completedAt?: Date;
    rewardsClaimed: boolean;
  }>;
  startedAt: Date;
  completedAt?: Date;
  rewardsClaimed: boolean;
  completionTime?: number; // Milliseconds to complete
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    lastActivityAt: Date;
  };
}

/**
 * Schema: Quest
 * 
 * Why: Enforces structure and validation for quest definitions
 */
const QuestSchema = new Schema<IQuest>(
  {
    title: {
      type: String,
      required: [true, 'Quest title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
      // Why: Display name for quest
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
      // Why: Explains quest objectives
    },
    story: {
      type: String,
      trim: true,
      maxlength: [5000, 'Story cannot exceed 5000 characters'],
      // Why: Optional narrative context
    },
    category: {
      type: String,
      enum: {
        values: ['tutorial', 'daily', 'weekly', 'seasonal', 'achievement', 'story', 'challenge'],
        message: 'Category must be valid',
      },
      required: [true, 'Category is required'],
      index: true,
      // Why: Organize and filter quests
    },
    tags: [{
      type: String,
      trim: true,
      lowercase: true,
      // Why: Additional categorization (e.g., 'beginner', 'pvp', 'puzzle')
    }],
    steps: [{
      stepNumber: {
        type: Number,
        required: true,
        min: 1,
        // Why: Order of steps
      },
      title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
        // Why: Step name
      },
      description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500,
        // Why: Step instructions
      },
      type: {
        type: String,
        enum: [
          'play_games',
          'win_games',
          'earn_points',
          'earn_xp',
          'unlock_achievement',
          'reach_level',
          'complete_challenge',
          'spend_points',
          'win_streak',
          'play_specific_game',
        ],
        required: true,
        // Why: What player must do
      },
      requirement: {
        target: {
          type: Number,
          required: true,
          min: 1,
          // Why: Target value to complete step
        },
        gameId: {
          type: Schema.Types.ObjectId,
          ref: 'Game',
          // Why: For game-specific steps
        },
        achievementId: {
          type: Schema.Types.ObjectId,
          ref: 'Achievement',
          // Why: For achievement unlock steps
        },
        level: {
          type: Number,
          min: 1,
          // Why: For level requirement steps
        },
        metric: {
          type: String,
          trim: true,
          // Why: Custom metric for specific steps
        },
      },
      rewards: {
        points: {
          type: Number,
          required: true,
          min: 0,
          // Why: Points awarded for completing this step
        },
        xp: {
          type: Number,
          required: true,
          min: 0,
          // Why: XP awarded for completing this step
        },
      },
      dependency: {
        type: String,
        enum: ['sequential', 'parallel', 'conditional'],
        default: 'sequential',
        // Why: How step unlocks
      },
      isOptional: {
        type: Boolean,
        default: false,
        // Why: Quest can complete without optional steps
      },
    }],
    totalSteps: {
      type: Number,
      required: [true, 'Total steps is required'],
      min: [1, 'Quest must have at least 1 step'],
      // Why: For progress calculation
    },
    rewards: {
      completionPoints: {
        type: Number,
        required: [true, 'Completion points is required'],
        min: [0, 'Completion points cannot be negative'],
        // Why: Bonus points for finishing entire quest
      },
      completionXP: {
        type: Number,
        required: [true, 'Completion XP is required'],
        min: [0, 'Completion XP cannot be negative'],
        // Why: Bonus XP for finishing entire quest
      },
      unlocks: {
        achievementId: {
          type: Schema.Types.ObjectId,
          ref: 'Achievement',
          // Why: Achievement granted on completion
        },
        gameId: {
          type: Schema.Types.ObjectId,
          ref: 'Game',
          // Why: Game unlocked on completion
        },
        rewardId: {
          type: Schema.Types.ObjectId,
          ref: 'Reward',
          // Why: Special reward unlocked
        },
      },
    },
    requirements: {
      minLevel: {
        type: Number,
        min: [1, 'Minimum level must be at least 1'],
        // Why: Level gate for advanced quests
      },
      isPremiumOnly: {
        type: Boolean,
        default: false,
        // Why: Restrict to premium players
      },
      prerequisiteQuestId: {
        type: Schema.Types.ObjectId,
        ref: 'Quest',
        // Why: Quest chain dependencies
      },
    },
    availability: {
      isActive: {
        type: Boolean,
        default: true,
        index: true,
        // Why: Can disable without deletion
      },
      startDate: {
        type: Date,
        // Why: When quest becomes available
      },
      endDate: {
        type: Date,
        // Why: When quest expires (for seasonal)
      },
      isRepeatable: {
        type: Boolean,
        default: false,
        // Why: Can player do quest multiple times
      },
      repeatCooldown: {
        type: Number,
        min: [0, 'Cooldown cannot be negative'],
        // Why: Days before quest can be repeated
      },
    },
    statistics: {
      totalStarted: {
        type: Number,
        default: 0,
        min: [0, 'Total started cannot be negative'],
        // Why: How many players started
      },
      totalCompleted: {
        type: Number,
        default: 0,
        min: [0, 'Total completed cannot be negative'],
        // Why: How many players finished
      },
      completionRate: {
        type: Number,
        default: 0,
        min: [0, 'Completion rate cannot be negative'],
        max: [100, 'Completion rate cannot exceed 100'],
        // Why: Success rate percentage
      },
      averageCompletionTime: {
        type: Number,
        default: 0,
        min: [0, 'Average time cannot be negative'],
        // Why: Average time to complete in milliseconds
      },
    },
    metadata: {
      createdAt: {
        type: Date,
        default: () => new Date(),
        immutable: true,
        // Why: ISO 8601 timestamp for quest creation
      },
      updatedAt: {
        type: Date,
        default: () => new Date(),
        // Why: Tracks last modification
      },
      displayOrder: {
        type: Number,
        default: 0,
        // Why: Controls UI ordering
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
 * 
 * Why: Optimizes common query patterns
 */
QuestSchema.index({ category: 1, 'availability.isActive': 1 });
// Why: Browse quests by category

QuestSchema.index({ 'availability.isActive': 1, 'metadata.displayOrder': 1 });
// Why: List active quests in order

QuestSchema.index({ 'availability.endDate': 1 }, { sparse: true });
// Why: Find expiring quests

QuestSchema.index({ 'requirements.isPremiumOnly': 1, 'availability.isActive': 1 });
// Why: Filter by premium/free

/**
 * Pre-save Hook: Update metadata
 * 
 * Why: Ensures updatedAt and totalSteps are current
 */
QuestSchema.pre('save', function (next) {
  if (!this.isNew) {
    this.metadata.updatedAt = new Date();
  }
  
  // Auto-set totalSteps from steps array
  this.totalSteps = this.steps.filter(s => !s.isOptional).length;
  
  next();
});

/**
 * Virtual: isAvailable
 * 
 * Why: Computed property to check if quest is currently available
 */
QuestSchema.virtual('isAvailable').get(function () {
  if (!this.availability.isActive) return false;
  
  const now = new Date();
  
  if (this.availability.startDate && now < this.availability.startDate) return false;
  if (this.availability.endDate && now > this.availability.endDate) return false;
  
  return true;
});

/**
 * Schema: PlayerQuestProgress
 * 
 * Why: Enforces structure for player quest tracking
 */
const PlayerQuestProgressSchema = new Schema<IPlayerQuestProgress>(
  {
    playerId: {
      type: Schema.Types.ObjectId,
      ref: 'Player',
      required: [true, 'Player ID is required'],
      // Why: Links progress to player
    },
    questId: {
      type: Schema.Types.ObjectId,
      ref: 'Quest',
      required: [true, 'Quest ID is required'],
      // Why: Links to quest definition
    },
    status: {
      type: String,
      enum: {
        values: ['not_started', 'in_progress', 'completed', 'abandoned'],
        message: 'Status must be valid',
      },
      required: [true, 'Status is required'],
      default: 'not_started',
      index: true,
      // Why: Tracks quest state
    },
    currentStep: {
      type: Number,
      required: [true, 'Current step is required'],
      default: 1,
      min: [1, 'Current step must be at least 1'],
      // Why: Which step player is on
    },
    stepsCompleted: [{
      type: Number,
      min: 1,
      // Why: Array of completed step numbers
    }],
    stepsProgress: {
      type: Map,
      of: {
        progress: {
          type: Number,
          required: true,
          min: 0,
          // Why: Current progress toward step target
        },
        completedAt: {
          type: Date,
          // Why: When step was completed
        },
        rewardsClaimed: {
          type: Boolean,
          default: false,
          // Why: Whether step rewards were claimed
        },
      },
      // Why: Detailed progress per step
    },
    startedAt: {
      type: Date,
      required: [true, 'Started at is required'],
      default: () => new Date(),
      // Why: When player started quest
    },
    completedAt: {
      type: Date,
      // Why: When player completed quest
    },
    rewardsClaimed: {
      type: Boolean,
      default: false,
      // Why: Whether completion rewards were claimed
    },
    completionTime: {
      type: Number,
      min: [0, 'Completion time cannot be negative'],
      // Why: Time to complete in milliseconds
    },
    metadata: {
      createdAt: {
        type: Date,
        default: () => new Date(),
        immutable: true,
        // Why: ISO 8601 timestamp when progress started
      },
      updatedAt: {
        type: Date,
        default: () => new Date(),
        // Why: Tracks last update
      },
      lastActivityAt: {
        type: Date,
        default: () => new Date(),
        // Why: Last time player made progress
      },
    },
  },
  {
    timestamps: false, // Using custom metadata timestamps
    strict: true,
  }
);

/**
 * Indexes for PlayerQuestProgress
 * 
 * Why: Optimizes player quest queries
 */
PlayerQuestProgressSchema.index({ playerId: 1, questId: 1 });
// Why: Player's progress on specific quest

PlayerQuestProgressSchema.index({ playerId: 1, status: 1 });
// Why: Player's active/completed quests

PlayerQuestProgressSchema.index({ questId: 1, status: 1 });
// Why: Count players on each quest

/**
 * Pre-save Hook: Auto-calculate completion time
 * 
 * Why: Automatically calculate quest completion duration
 */
PlayerQuestProgressSchema.pre('save', function (next) {
  if (this.isModified('status') && this.status === 'completed' && !this.completedAt) {
    this.completedAt = new Date();
    this.completionTime = this.completedAt.getTime() - this.startedAt.getTime();
  }
  
  if (!this.isNew) {
    this.metadata.updatedAt = new Date();
    this.metadata.lastActivityAt = new Date();
  }
  
  next();
});

/**
 * Virtual: progressPercentage
 * 
 * Why: Computed property for overall quest progress
 */
PlayerQuestProgressSchema.virtual('progressPercentage').get(function () {
  const quest = this.populated('questId') as IQuest;
  if (!quest) return 0;
  
  const requiredSteps = quest.steps.filter(s => !s.isOptional).length;
  if (requiredSteps === 0) return 100;
  
  return Math.round((this.stepsCompleted.length / requiredSteps) * 100);
});

/**
 * Export Models
 * 
 * Why: Singleton pattern prevents multiple model compilations
 */
export const Quest: Model<IQuest> =
  mongoose.models.Quest ||
  mongoose.model<IQuest>('Quest', QuestSchema);

export const PlayerQuestProgress: Model<IPlayerQuestProgress> =
  mongoose.models.PlayerQuestProgress ||
  mongoose.model<IPlayerQuestProgress>(
    'PlayerQuestProgress',
    PlayerQuestProgressSchema
  );

export default Quest;
