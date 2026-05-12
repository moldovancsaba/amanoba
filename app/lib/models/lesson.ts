/**
 * Lesson Model
 * 
 * What: Represents a single lesson within a course
 * Why: Stores lesson content, email templates, and lesson-local metadata
 */

import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Lesson Document Interface
 * 
 * Why: TypeScript type safety for Lesson documents
 */
export interface ILesson extends Document {
  lessonId: string;
  courseId: mongoose.Types.ObjectId;
  dayNumber: number; // Lesson position in course, starting at 1
  language: string; // Language code (hu, en, etc.)
  title: string;
  content: string; // Markdown lesson content (legacy may be HTML; render with contentToHtml for display/email)
  emailSubject: string; // Email subject line template
  emailBody: string; // Email body template (Markdown; render with contentToHtml for sending)
  translations?: Map<string, {
    title: string;
    content: string;
    emailSubject: string;
    emailBody: string;
  }>; // Multi-language support
  assessmentGameId?: mongoose.Types.ObjectId; // Optional game to play after lesson (DEPRECATED - legacy compatibility only)
  quizConfig?: {
    enabled: boolean;
    successThreshold: number; // Legacy compatibility payload only; runtime authority is course.lessonQuizPolicy
    questionCount: number; // Legacy compatibility payload only; runtime authority is course.lessonQuizPolicy
    poolSize: number; // Observed active question pool for this lesson
    required: boolean; // Legacy compatibility payload only; runtime authority is course.lessonQuizPolicy
  }; // Compatibility-only field kept for import/export and legacy responses; not authoritative for learner behavior
  unlockConditions?: {
    requirePreviousLesson?: boolean; // Must complete previous lesson
    requireMinimumDay?: number; // Must be at least day X
    requireCourseStart?: boolean; // Must have started course
  };
  pointsReward: number;
  xpReward: number;
  isActive: boolean;
  displayOrder: number; // For custom ordering within day
  metadata?: {
    estimatedMinutes?: number;
    difficulty?: 'easy' | 'medium' | 'hard';
    tags?: string[];
    resources?: Array<{
      title: string;
      url: string;
      type: 'article' | 'video' | 'document' | 'external';
    }>;
    [key: string]: unknown;
  };
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Lesson Schema
 * 
 * Why: Defines structure, validation, and indexes for Lesson collection
 */
const LessonSchema = new Schema<ILesson>(
  {
    // Unique lesson identifier
    // Why: Used as primary key for lesson references
    lessonId: {
      type: String,
      required: [true, 'Lesson ID is required'],
      unique: true,
      trim: true,
    },

    // Parent course reference
    // Why: Links lesson to its course
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course ID is required'],
      index: true,
    },

    // Day number in course
    // Why: Defines lesson order in a flexible course structure
    dayNumber: {
      type: Number,
      required: [true, 'Day number is required'],
      min: [1, 'Day number must be at least 1'],
      index: true,
    },

    // Lesson language code
    // Why: Primary language of the lesson (hu, en, etc.)
    language: {
      type: String,
      required: [true, 'Language is required'],
      default: 'hu', // Hungarian as default
      trim: true,
      lowercase: true,
      index: true,
    },

    // Lesson title
    // Why: Displayed in UI and email subject
    title: {
      type: String,
      required: [true, 'Lesson title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },

    // Lesson content (HTML/markdown)
    // Why: Main lesson content displayed to students
    content: {
      type: String,
      required: [true, 'Lesson content is required'],
      trim: true,
    },

    // Email subject line template
    // Why: Subject line for daily lesson email
    emailSubject: {
      type: String,
      required: [true, 'Email subject is required'],
      trim: true,
      maxlength: [200, 'Email subject cannot exceed 200 characters'],
    },

    // Email body template (HTML)
    // Why: Email body content for daily lesson email
    emailBody: {
      type: String,
      required: [true, 'Email body is required'],
      trim: true,
    },

    // Multi-language translations
    // Why: Support for lesson content in multiple languages
    translations: {
      type: Map,
      of: {
        title: String,
        content: String,
        emailSubject: String,
        emailBody: String,
      },
      default: new Map(),
    },

    // Optional assessment game (DEPRECATED - compatibility only)
    // Why: Game to play after lesson (QUIZZZ, WHACKPOP, etc.)
    // Note: This is kept for backward compatibility but lesson assessments should follow course.lessonQuizPolicy
    assessmentGameId: {
      type: Schema.Types.ObjectId,
      ref: 'Game',
      index: true,
    },

    // Legacy quiz compatibility payload
    // Why: Keeps import/export and old client payloads readable while authority lives on course.lessonQuizPolicy
    quizConfig: {
      enabled: {
        type: Boolean,
        default: false,
      },
      // Legacy pass threshold snapshot; learner runtime resolves the live value from the course policy
      successThreshold: {
        type: Number,
        min: [0, 'Success threshold must be between 0 and 100'],
        max: [100, 'Success threshold must be between 0 and 100'],
        default: 70, // 70% correct answers required
      },
      // Legacy question-count snapshot; learner runtime resolves the live value from the course policy
      questionCount: {
        type: Number,
        min: [1, 'Must show at least 1 question'],
        max: [50, 'Cannot show more than 50 questions'],
        default: 5,
      },
      // Informational pool size snapshot for compatibility/export consumers
      poolSize: {
        type: Number,
        min: [1, 'Pool must have at least 1 question'],
        default: 10,
      },
      // Legacy required flag snapshot; learner runtime resolves the live value from the course policy
      required: {
        type: Boolean,
        default: true,
      },
    },

    // Unlock conditions for lesson
    // Why: Controls when lesson becomes available
    unlockConditions: {
      requirePreviousLesson: {
        type: Boolean,
        default: true,
      },
      requireMinimumDay: {
        type: Number,
        min: [1, 'Minimum day must be at least 1'],
      },
      requireCourseStart: {
        type: Boolean,
        default: true,
      },
    },

    // Points awarded for completing lesson
    // Why: Gamification reward
    pointsReward: {
      type: Number,
      required: [true, 'Points reward is required'],
      min: [0, 'Points reward cannot be negative'],
      default: 10,
    },

    // XP awarded for completing lesson
    // Why: Gamification reward
    xpReward: {
      type: Number,
      required: [true, 'XP reward is required'],
      min: [0, 'XP reward cannot be negative'],
      default: 5,
    },

    // Lesson activation status
    // Why: Allows temporarily disabling lesson without deleting
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    // Display order within day
    // Why: Allows multiple lessons per day with custom ordering
    displayOrder: {
      type: Number,
      default: 1,
      min: [1, 'Display order must be at least 1'],
    },

    // Flexible metadata field for lesson-specific config
    // Why: Allows adding lesson-specific settings without schema changes
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    // Automatic timestamps
    // Why: Track when lessons are created and updated
    timestamps: true,
    
    // Strict mode to reject undefined fields
    // Why: Prevents data corruption from unexpected fields
    strict: true,
    
    // Collection name
    // Why: Explicitly named for clarity
    collection: 'lessons',
  }
);

// Indexes for efficient querying
// Why: Lessons are queried by course, day number, and active status

LessonSchema.index({ lessonId: 1 }, { name: 'lesson_id_unique', unique: true });
LessonSchema.index({ courseId: 1 }, { name: 'lesson_course' });
LessonSchema.index({ courseId: 1, dayNumber: 1 }, { name: 'lesson_course_day' });
LessonSchema.index({ language: 1 }, { name: 'lesson_language' });
LessonSchema.index({ isActive: 1 }, { name: 'lesson_active' });
LessonSchema.index({ courseId: 1, dayNumber: 1, displayOrder: 1 }, { name: 'lesson_course_day_order' });
LessonSchema.index({ courseId: 1, language: 1, dayNumber: 1 }, { name: 'lesson_course_language_day' });

/**
 * Pre-save hook to validate day number
 * 
 * Why: Ensure day number remains a positive lesson position
 */
LessonSchema.pre('save', function (next) {
  if (!Number.isFinite(this.dayNumber) || this.dayNumber < 1) {
    return next(new Error('Day number must be at least 1'));
  }
  this.dayNumber = Math.floor(this.dayNumber);
  next();
});

/**
 * Lesson Model
 * 
 * Why: Export typed model for use in application
 */
const Lesson: Model<ILesson> =
  mongoose.models.Lesson || mongoose.model<ILesson>('Lesson', LessonSchema);

export default Lesson;
