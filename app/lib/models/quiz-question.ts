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
 * Question Type Enum
 * Why: Categorize questions by cognitive level for analytics and filtering
 */
export enum QuestionType {
  RECALL = 'recall',
  APPLICATION = 'application',
  CRITICAL_THINKING = 'critical-thinking',
}

/**
 * QuizQuestion Document Interface
 * Why: TypeScript type safety for QuizQuestion documents
 */
export interface IQuizQuestion extends Document {
  question: string;
  /** Legacy: at least 4 options; correctIndex 0 to options.length-1. Optional when correctAnswer + wrongAnswers are used. */
  options?: string[];
  /** Legacy: index of correct answer in options (0 to options.length-1). Optional when correctAnswer + wrongAnswers are used. */
  correctIndex?: number;
  /** New format: single correct answer; display shows this + 2 random from wrongAnswers (3 options total). */
  correctAnswer?: string;
  /** New format: wrong answers; at least 2 required when using correctAnswer. */
  wrongAnswers?: string[];
  difficulty: QuestionDifficulty;
  category: string;
  showCount: number;
  correctCount: number;
  isActive: boolean;
  // Course/Lesson context (for lesson-specific assessments)
  // Why: Allows questions to be tied to specific lessons/courses
  lessonId?: string; // Lesson ID this question belongs to (if course-specific)
  courseId?: mongoose.Types.ObjectId; // Course ID this question belongs to (if course-specific) - primary course
  relatedCourseIds?: mongoose.Types.ObjectId[]; // Additional courses this question is related to (for reusable questions)
  isCourseSpecific: boolean; // Whether this question is for a course/lesson (true) or general QUIZZZ (false)
  // New fields for audit and enhancement
  // Why: Support for quiz quality audit with metadata and filtering
  uuid?: string; // Unique v4 UUID for anonymized referencing
  hashtags?: string[]; // Multi-level tags for filtering (#topic #difficulty #type #language)
  questionType?: QuestionType; // Cognitive level: recall, application, or critical-thinking
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    createdBy?: string;
    updatedBy?: string;
    lastShownAt?: Date;
    auditedAt?: Date; // When this question was audited/enhanced
    auditedBy?: string; // Who audited this question
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

    // Answer options (legacy: minimum 4 options; optional when correctAnswer + wrongAnswers are used)
    options: {
      type: [String],
      default: undefined,
      validate: {
        validator: function (this: IQuizQuestion, opts: string[]) {
          if (!opts || opts.length === 0) return !!this.correctAnswer && Array.isArray(this.wrongAnswers) && this.wrongAnswers.length >= 2;
          return opts.length >= 4 && opts.every(opt => typeof opt === 'string' && opt.length > 0);
        },
        message: 'Must provide at least 4 non-empty options, or use correctAnswer + wrongAnswers (min 2)',
      },
    },

    // Correct answer index 0 to options.length-1 (legacy; optional when correctAnswer + wrongAnswers are used)
    correctIndex: {
      type: Number,
      default: undefined,
      min: [0, 'Correct index must be at least 0'],
    },

    // Correct answer (new format: 1 good + N bad; display shows 3 options: correct + 2 random wrong)
    correctAnswer: { type: String, trim: true },
    wrongAnswers: {
      type: [String],
      default: undefined,
      validate: {
        validator: function (v: string[]) {
          if (!v || v.length === 0) return true;
          return v.length >= 2 && v.every(opt => typeof opt === 'string' && opt.length > 0);
        },
        message: 'wrongAnswers must have at least 2 entries when using correctAnswer format',
      },
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
          'Course Specific',
          // Productivity 2026 Course Categories
          'Productivity Foundations',
          'Time, Energy, Attention',
          'Goal Hierarchy',
          'Habits vs Systems',
          'Measurement & Metrics',
          'Capture & GTD',
          'Context Switching',
          'Delegation',
          'Energy Management',
          'Advanced Strategies',
          'Integration & Synthesis',
          'Workplace Application',
          'Team Dynamics',
          'Digital Tools',
          'Communication',
          'Stress Management',
          'Learning Systems',
          'Personal Development',
          'Decision Making',
          'Continuous Improvement',
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

    // Course/Lesson context for lesson-specific assessments
    // Why: Allows questions to be tied to specific lessons for course assessments
    lessonId: {
      type: String,
      trim: true,
      index: true, // Why: Used to filter questions by lesson
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      index: true, // Why: Used to filter questions by course (primary course)
    },
    // NEW: Related courses (multiple courses can use the same question)
    // Why: Enables reusable questions across multiple courses
    relatedCourseIds: {
      type: [Schema.Types.ObjectId],
      ref: 'Course',
      default: [],
      index: true, // Why: Used to filter questions by related courses
    },
    isCourseSpecific: {
      type: Boolean,
      default: false,
      index: true, // Why: Used to separate general QUIZZZ questions from course-specific ones
    },

    // NEW: UUID for anonymized referencing
    // Why: Industry-standard unique identifier for tracking without using _id
    uuid: {
      type: String,
      unique: true,
      sparse: true, // Why: Sparse index allows null values for backward compatibility
      index: true, // Why: Quick lookup by UUID
      // Example: 550e8400-e29b-41d4-a716-446655440000
    },

    // NEW: Hashtags for multi-level filtering and categorization
    // Why: Enable future search/filtering by topic, difficulty, type, language
    // Example: ['#time-management', '#beginner', '#application', '#hu']
    hashtags: {
      type: [String],
      default: [],
      // Why: Array of hashtags for flexible categorization
    },

    // NEW: Question type for cognitive level categorization
    // Why: Support quiz design methodology (60% recall, 30% application, 10% critical thinking)
    questionType: {
      type: String,
      enum: {
        values: Object.values(QuestionType),
        message: 'Invalid question type',
      },
      // Why: Optional to support existing questions without this field
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
      updatedBy: {
        type: String,
        trim: true,
        // Why: Tracks who last edited this question (admins, editors, or bots)
      },
      lastShownAt: {
        type: Date,
        // Why: Timestamp of most recent use (optional future enhancement)
      },
      // NEW: Audit metadata
      // Why: Track when and by whom questions were audited/enhanced
      auditedAt: {
        type: Date,
        // Why: Timestamp of when this question was audited
      },
      auditedBy: {
        type: String,
        trim: true,
        // Why: Name or ID of who performed the audit
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
 * Index for Course/Lesson-Specific Questions
 * Why: Enables efficient querying of lesson-specific quiz questions
 */
QuizQuestionSchema.index(
  { lessonId: 1, isCourseSpecific: 1, isActive: 1 },
  { name: 'lesson_quiz_questions' }
);

QuizQuestionSchema.index(
  { courseId: 1, isCourseSpecific: 1, isActive: 1 },
  { name: 'course_quiz_questions' }
);

/**
 * Index for UUID (Audit Enhancement)
 * Why: Fast lookup by UUID for anonymized question referencing
 */
QuizQuestionSchema.index(
  { uuid: 1 },
  { name: 'uuid_lookup', sparse: true }
);

/**
 * Index for Hashtag Filtering (Audit Enhancement)
 * Why: Enables filtering questions by hashtags for categorization and search
 */
QuizQuestionSchema.index(
  { hashtags: 1 },
  { name: 'hashtag_search' }
);

/**
 * Index for Question Type (Audit Enhancement)
 * Why: Enables filtering questions by cognitive level
 */
QuizQuestionSchema.index(
  { questionType: 1, isActive: 1 },
  { name: 'question_type_filter' }
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
 * Validation: Require either (options + correctIndex) or (correctAnswer + wrongAnswers)
 */
QuizQuestionSchema.pre('save', function (next) {
  const optsLen = Array.isArray(this.options) ? this.options.length : 0;
  const hasLegacy = optsLen >= 4 && typeof this.correctIndex === 'number' && this.correctIndex >= 0 && this.correctIndex < optsLen;
  const hasNewFormat = this.correctAnswer && Array.isArray(this.wrongAnswers) && this.wrongAnswers.length >= 2;
  if (hasLegacy || hasNewFormat) return next();
  return next(new Error('Question must have either options (min 4) + correctIndex (0 to options.length-1) or correctAnswer + wrongAnswers (min 2)'));
});

/**
 * Validation: Ensure all options are distinct (legacy format)
 */
QuizQuestionSchema.pre('save', function (next) {
  if (!Array.isArray(this.options) || this.options.length === 0) return next();
  const uniqueOptions = new Set(this.options);
  if (uniqueOptions.size !== this.options.length) return next(new Error('All options must be unique'));
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
