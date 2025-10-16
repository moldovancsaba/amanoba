/**
 * QuizQuestion Model
 * 
 * What: Stores QUIZZZ trivia questions with intelligent usage tracking
 * Why: Enables database-driven question management with fair rotation and difficulty metrics
 * 
 * Features:
 * - Multiple difficulty levels (EASY, MEDIUM, HARD, EXPERT)
 * - Category-based organization
 * - Usage tracking (showCount, correctCount)
 * - Intelligent selection support via compound indexes
 */

import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Difficulty Levels Enum
 * Why: Type-safe difficulty references matching game component
 */
export enum QuestionDifficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
  EXPERT = 'EXPERT',
}

/**
 * QuizQuestion Document Interface
 * Why: TypeScript type safety for QuizQuestion documents
 */
export interface IQuizQuestion extends Document {
  question: string;
  options: string[];
  correctIndex: number;
  difficulty: QuestionDifficulty;
  category: string;
  showCount: number;
  correctCount: number;
  isActive: boolean;
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    createdBy?: string;
    lastShownAt?: Date;
  };
}

/**
 * QuizQuestion Schema
 * Why: Defines structure, validation, and indexes for intelligent question selection
 */
const QuizQuestionSchema = new Schema<IQuizQuestion>(
  {
    // Question text
    // Why: Main content displayed to players
    question: {
      type: String,
      required: [true, 'Question text is required'],
      trim: true,
      minlength: [10, 'Question must be at least 10 characters'],
      maxlength: [500, 'Question cannot exceed 500 characters'],
      index: true, // Why: Used for alphabetical tie-breaking in selection algorithm
    },

    // Answer options
    // Why: Multiple choice answers (4 options standard)
    options: {
      type: [String],
      required: [true, 'Options are required'],
      validate: {
        validator: function (opts: string[]) {
          return opts.length === 4 && opts.every(opt => opt.length > 0);
        },
        message: 'Must provide exactly 4 non-empty options',
      },
    },

    // Correct answer index (0-3)
    // Why: Identifies which option is correct (never sent to client before answer)
    correctIndex: {
      type: Number,
      required: [true, 'Correct index is required'],
      min: [0, 'Correct index must be 0-3'],
      max: [3, 'Correct index must be 0-3'],
    },

    // Difficulty level
    // Why: Used to filter questions by game difficulty setting
    difficulty: {
      type: String,
      required: [true, 'Difficulty is required'],
      enum: {
        values: Object.values(QuestionDifficulty),
        message: 'Invalid difficulty level',
      },
      index: true, // Why: Primary filter in selection queries
    },

    // Category/Topic
    // Why: Enables category-specific filtering and balanced distribution
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      enum: {
        values: [
          'Science',
          'History',
          'Geography',
          'Math',
          'Technology',
          'Arts & Literature',
          'Sports',
          'General Knowledge',
        ],
        message: 'Invalid category',
      },
      index: true,
    },

    // Show count
    // Why: Tracks how many times question has appeared in games (Priority 1 selection)
    showCount: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Show count cannot be negative'],
      index: true, // Why: Primary sort key in intelligent selection algorithm
    },

    // Correct answer count
    // Why: Tracks how many times question was answered correctly (Priority 2 selection)
    correctCount: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Correct count cannot be negative'],
      index: true, // Why: Secondary sort key in intelligent selection algorithm
    },

    // Active status
    // Why: Allows soft-deletion without removing question from database
    isActive: {
      type: Boolean,
      default: true,
      index: true, // Why: Always filter by active status
    },

    // Metadata
    // Why: Audit trail and temporal tracking
    metadata: {
      createdAt: {
        type: Date,
        default: () => new Date(),
        immutable: true,
        // Why: ISO 8601 timestamp for compliance with AI rules
      },
      updatedAt: {
        type: Date,
        default: () => new Date(),
        // Why: Tracks last modification for admin visibility
      },
      createdBy: {
        type: String,
        trim: true,
        // Why: Optional admin user who created the question
      },
      lastShownAt: {
        type: Date,
        // Why: Timestamp of most recent use (optional future enhancement)
      },
    },
  },
  {
    timestamps: false, // Using custom metadata timestamps
    strict: true,
    // Why: Prevents accidental addition of undefined fields
    collection: 'quiz_questions',
  }
);

/**
 * Compound Index for Intelligent Selection
 * Why: Optimizes the three-tier selection algorithm:
 *   1. Filter by difficulty + isActive
 *   2. Sort by showCount ASC (lowest first)
 *   3. Then by correctCount ASC (harder questions first)
 *   4. Then by question ASC (alphabetical tie-breaker)
 */
QuizQuestionSchema.index(
  { 
    difficulty: 1, 
    isActive: 1, 
    showCount: 1, 
    correctCount: 1, 
    question: 1 
  },
  { name: 'intelligent_selection' }
);

/**
 * Additional Index for Category Filtering
 * Why: Enables future category-specific queries
 */
QuizQuestionSchema.index(
  { category: 1, difficulty: 1, isActive: 1 },
  { name: 'category_difficulty' }
);

/**
 * Pre-save Hook: Update metadata timestamp
 * Why: Ensures updatedAt is current on every save
 */
QuizQuestionSchema.pre('save', function (next) {
  if (!this.isNew) {
    this.metadata.updatedAt = new Date();
  }
  next();
});

/**
 * Validation: Ensure all options are distinct
 * Why: Prevents duplicate answer choices
 */
QuizQuestionSchema.pre('save', function (next) {
  const uniqueOptions = new Set(this.options);
  if (uniqueOptions.size !== this.options.length) {
    return next(new Error('All options must be unique'));
  }
  next();
});

/**
 * Virtual: Difficulty Rate (correctCount / showCount)
 * Why: Computed metric for question difficulty analysis
 */
QuizQuestionSchema.virtual('difficultyRate').get(function () {
  return this.showCount > 0 ? this.correctCount / this.showCount : 0;
});

/**
 * Export Model
 * Why: Singleton pattern prevents multiple model compilations in Next.js hot reload
 */
const QuizQuestion: Model<IQuizQuestion> =
  mongoose.models.QuizQuestion ||
  mongoose.model<IQuizQuestion>('QuizQuestion', QuizQuestionSchema);

export default QuizQuestion;
