/**
 * Course Model
 * 
 * What: Represents a 30-day learning course in the system
 * Why: Centralizes course definitions, structure, and configuration for the learning platform
 */

import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Course Document Interface
 * 
 * Why: TypeScript type safety for Course documents
 */
export interface ICourse extends Document {
  courseId: string;
  name: string;
  description: string;
  language: string; // Language code (hu, en, etc.)
  thumbnail?: string;
  durationDays: number; // Always 30 for standard courses
  isActive: boolean;
  requiresPremium: boolean;
  price?: {
    amount: number; // Price in cents (e.g., 2999 = $29.99)
    currency: string; // ISO currency code (e.g., 'usd', 'eur', 'huf')
  };
  brandId: mongoose.Types.ObjectId;
  translations?: Map<string, {
    name: string;
    description: string;
  }>; // Multi-language support
  pointsConfig: {
    completionPoints: number;
    lessonPoints: number; // Points per lesson completed
    perfectCourseBonus?: number; // Bonus for completing all 30 days
  };
  xpConfig: {
    completionXP: number;
    lessonXP: number; // XP per lesson completed
  };
  metadata?: {
    category?: string;
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    estimatedHours?: number;
    prerequisites?: string[]; // Course IDs that must be completed first
    tags?: string[];
    instructor?: string;
    [key: string]: unknown;
  };
  /** Feature toggles */
  discussionEnabled?: boolean;
  leaderboardEnabled?: boolean;
  studyGroupsEnabled?: boolean;
  /** For short/child courses: parent 30-day courseId. Unset for language-variant or CCS. */
  parentCourseId?: string;
  /** For short/child courses: ordered list of parent lesson _ids. Index 0 = child Day 1. */
  selectedLessonIds?: string[];
  /** 'standard' | 'essentials' | 'beginner' | 'foundations' | 'core_skills' | 'full_program' (or legacy 7day/weekend/1day/1hour). */
  courseVariant?: string;
  /** CCS (course family) id. Set for language-variant and short courses; shorts inherit from parent. */
  ccsId?: string;
  /** Creator (editor) — Player _id. Used for editor access: user sees admin if they created or are assigned to at least one course. */
  createdBy?: mongoose.Types.ObjectId;
  /** Assigned editors — Player _ids. Users in this array (or createdBy) can edit this course and see the admin entry point. */
  assignedEditors?: mongoose.Types.ObjectId[];
  /** Prerequisites: course _ids that must be completed before enrolling. Optional. */
  prerequisiteCourseIds?: mongoose.Types.ObjectId[];
  /** When prerequisites are set: 'hard' = block enrolment until met; 'soft' = warn but allow. Default 'hard'. */
  prerequisiteEnforcement?: 'hard' | 'soft';
  /** Lesson quiz pass rule: max wrong answers allowed (0–10). If set, fail when wrongCount > this; else use successThreshold %. */
  quizMaxWrongAllowed?: number;
  /** Default number of questions per lesson quiz. Used when a lesson does not set quizConfig.questionCount. 1–50. */
  defaultLessonQuizQuestionCount?: number;
  /** Canonical lesson-quiz runtime policy (course-level authority). */
  lessonQuizPolicy?: {
    enabled?: boolean;
    required?: boolean;
    questionCount?: number;
    shownAnswerCount?: number;
    maxWrongAllowed?: number;
    successThreshold?: number;
  };
  /** For shorts: draft until editor publishes. Catalog shows only non-draft. */
  isDraft?: boolean;
  /** Child courses only: 'synced' | 'out_of_sync'. Used for selective unsync/re-sync and admin sync alerts. */
  syncStatus?: 'synced' | 'out_of_sync';
  /** Child courses only: when this child was last re-synced from parent. */
  lastSyncedAt?: Date;
  certification?: {
    enabled: boolean;
    poolCourseId?: string;
    /** Max questions in child final exam. If unset, use default (e.g. 50). */
    certQuestionCount?: number;
    /** Pass rule: minimum final exam score (0–100) to be eligible for certificate. Default 50. */
    passThresholdPercent?: number;
    /** Fail immediately when (wrong/answered)*100 exceeds this %. E.g. 10 = fail as soon as error rate > 10%. */
    maxErrorPercent?: number;
    /** Require all lessons completed for certificate. Default true. */
    requireAllLessonsCompleted?: boolean;
    /** Require all daily quizzes passed for certificate. Default true. */
    requireAllQuizzesPassed?: boolean;
    priceMoney?: { amount: number; currency: string };
    pricePoints?: number;
    premiumIncludesCertification?: boolean;
    templateId?: string;
    /** A/B: list of template IDs for certificate variant assignment. If length > 1, variant chosen at issue. */
    templateVariantIds?: string[];
    /** Optional weights (same length as templateVariantIds) for weighted random; not used when picking by stable hash. */
    templateVariantWeights?: number[];
    credentialTitleId?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Course Schema
 * 
 * Why: Defines structure, validation, and indexes for Course collection
 */
const CourseSchema = new Schema<ICourse>(
  {
    // Unique course identifier
    // Why: Used as primary key for course references
    courseId: {
      type: String,
      required: [true, 'Course ID is required'],
      unique: true,
      uppercase: true,
      trim: true,
      match: [/^[A-Z0-9_]+$/, 'Course ID must contain only uppercase letters, numbers, and underscores'],
    },

    // Display name of the course
    // Why: Shown to students in UI
    name: {
      type: String,
      required: [true, 'Course name is required'],
      trim: true,
      maxlength: [200, 'Course name cannot exceed 200 characters'],
    },

    // Course description for students
    // Why: Explains what the course teaches
    description: {
      type: String,
      required: [true, 'Course description is required'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },

    // Course language code
    // Why: Primary language of the course (hu, en, etc.)
    language: {
      type: String,
      required: [true, 'Language is required'],
      default: 'hu', // Hungarian as default
      trim: true,
      lowercase: true,
      index: true,
    },

    // Multi-language translations
    // Why: Support for course content in multiple languages
    translations: {
      type: Map,
      of: {
        name: String,
        description: String,
      },
      default: new Map(),
    },

    // Thumbnail image URL
    // Why: Visual representation in course listing
    thumbnail: {
      type: String,
      trim: true,
    },

    // Course duration in days
    // Why: Standard courses are 30 days, but flexible for shorter courses
    durationDays: {
      type: Number,
      required: [true, 'Duration is required'],
      default: 30,
      min: [1, 'Duration must be at least 1 day'],
      max: [365, 'Duration cannot exceed 365 days'],
    },

    // Course activation status
    // Why: Allows temporarily disabling course without deleting
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    // Feature toggles
    // Why: Per-course switches for optional UX modules
    discussionEnabled: {
      type: Boolean,
      default: false,
    },
    leaderboardEnabled: {
      type: Boolean,
      default: false,
    },
    studyGroupsEnabled: {
      type: Boolean,
      default: false,
    },

    // Premium-only course flag
    // Why: Used for access control
    requiresPremium: {
      type: Boolean,
      default: false,
      index: true,
    },

    // Course pricing (for premium courses)
    // Why: Allows admins to set custom pricing per course
    price: {
      amount: {
        type: Number,
        min: [0, 'Price amount cannot be negative'],
        // Amount in cents (e.g., 2999 = $29.99)
      },
      currency: {
        type: String,
        default: 'usd',
        uppercase: true,
        trim: true,
        // ISO currency code (e.g., 'USD', 'EUR', 'HUF')
      },
    },

    // Brand the course belongs to
    // Why: Multi-tenancy - course registered under specific brand
    brandId: {
      type: Schema.Types.ObjectId,
      ref: 'Brand',
      required: [true, 'Brand ID is required'],
      // Why: Index created explicitly at schema level with name 'course_brand'
    },

    // Points configuration
    // Why: Defines how many points are awarded for course activities
    pointsConfig: {
      completionPoints: {
        type: Number,
        required: [true, 'Completion points is required'],
        min: [0, 'Completion points cannot be negative'],
      },
      lessonPoints: {
        type: Number,
        required: [true, 'Lesson points is required'],
        min: [0, 'Lesson points cannot be negative'],
      },
      perfectCourseBonus: {
        type: Number,
        min: [0, 'Perfect course bonus cannot be negative'],
      },
    },

    // XP configuration
    // Why: Defines how much XP is awarded for course activities
    xpConfig: {
      completionXP: {
        type: Number,
        required: [true, 'Completion XP is required'],
        min: [0, 'Completion XP cannot be negative'],
      },
      lessonXP: {
        type: Number,
        required: [true, 'Lesson XP is required'],
        min: [0, 'Lesson XP cannot be negative'],
      },
    },

    // Prerequisites: courses that must be completed before this one (optional)
    prerequisiteCourseIds: [{ type: Schema.Types.ObjectId, ref: 'Course', default: undefined }],
    prerequisiteEnforcement: { type: String, enum: ['hard', 'soft'], default: 'hard', trim: true },
    quizMaxWrongAllowed: { type: Number, min: 0, max: 10, default: undefined },
    defaultLessonQuizQuestionCount: { type: Number, min: 1, max: 50, default: undefined },
    lessonQuizPolicy: {
      enabled: { type: Boolean, default: true },
      required: { type: Boolean, default: true },
      questionCount: { type: Number, min: 1, max: 50, default: undefined },
      shownAnswerCount: { type: Number, min: 2, max: 4, default: 3 },
      maxWrongAllowed: { type: Number, min: 0, max: 10, default: undefined },
      successThreshold: { type: Number, min: 0, max: 100, default: 70 },
    },
    // Short/child course fields (optional)
    parentCourseId: { type: String, uppercase: true, trim: true },
    selectedLessonIds: [{ type: String, trim: true }],
    courseVariant: { type: String, trim: true },
    ccsId: { type: String, trim: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'Player', default: null },
    assignedEditors: [{ type: Schema.Types.ObjectId, ref: 'Player', default: undefined }],
    isDraft: { type: Boolean, default: false },
    syncStatus: { type: String, enum: ['synced', 'out_of_sync'], trim: true },
    lastSyncedAt: { type: Date },

    // Certification configuration
    // Why: Controls premium gating, pricing, and pool mapping for final exam
    certification: {
      enabled: {
        type: Boolean,
        default: false,
      },
      poolCourseId: {
        type: String,
        uppercase: true,
        trim: true,
      },
      certQuestionCount: {
        type: Number,
        min: [1, 'certQuestionCount must be at least 1'],
      },
      passThresholdPercent: {
        type: Number,
        min: [0, 'passThresholdPercent must be 0–100'],
        max: [100, 'passThresholdPercent must be 0–100'],
      },
      maxErrorPercent: {
        type: Number,
        min: [0, 'maxErrorPercent must be 0–100'],
        max: [100, 'maxErrorPercent must be 0–100'],
      },
      requireAllLessonsCompleted: {
        type: Boolean,
        default: true,
      },
      requireAllQuizzesPassed: {
        type: Boolean,
        default: true,
      },
      priceMoney: {
        amount: {
          type: Number,
          min: [0, 'Certification price cannot be negative'],
        },
        currency: {
          type: String,
          uppercase: true,
          trim: true,
        },
      },
      pricePoints: {
        type: Number,
        min: [0, 'Certification points price cannot be negative'],
      },
      premiumIncludesCertification: {
        type: Boolean,
        default: false,
      },
      templateId: {
        type: String,
        trim: true,
      },
      templateVariantIds: {
        type: [String],
        default: undefined,
      },
      templateVariantWeights: {
        type: [Number],
        default: undefined,
      },
      credentialTitleId: {
        type: String,
        trim: true,
      },
      themeColors: {
        primary: { type: String, trim: true },
        secondary: { type: String, trim: true },
        accent: { type: String, trim: true },
      },
    },

    // Flexible metadata field for course-specific config
    // Why: Allows adding course-specific settings without schema changes
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    // Automatic timestamps
    // Why: Track when courses are created and updated
    timestamps: true,
    
    // Strict mode to reject undefined fields
    // Why: Prevents data corruption from unexpected fields
    strict: true,
    
    // Collection name
    // Why: Explicitly named for clarity
    collection: 'courses',
  }
);

// Indexes for efficient querying
// Why: Courses are queried by active status, premium flag, and brand

CourseSchema.index({ courseId: 1 }, { name: 'course_id_unique', unique: true });
CourseSchema.index({ isActive: 1 }, { name: 'course_active' });
CourseSchema.index({ requiresPremium: 1 }, { name: 'course_premium' });
CourseSchema.index({ brandId: 1 }, { name: 'course_brand' });
CourseSchema.index({ language: 1 }, { name: 'course_language' });
CourseSchema.index({ isActive: 1, requiresPremium: 1 }, { name: 'course_active_premium' });
CourseSchema.index({ brandId: 1, isActive: 1 }, { name: 'course_brand_active' });
CourseSchema.index({ brandId: 1, language: 1, isActive: 1 }, { name: 'course_brand_language_active' });

/**
 * Pre-save hook to validate duration
 * 
 * Why: Ensure duration is reasonable
 */
CourseSchema.pre('save', function (next) {
  if (this.durationDays < 1 || this.durationDays > 365) {
    return next(new Error('Course duration must be between 1 and 365 days'));
  }
  next();
});

/**
 * Course Model
 * 
 * Why: Export typed model for use in application
 */
const Course: Model<ICourse> =
  mongoose.models.Course || mongoose.model<ICourse>('Course', CourseSchema);

export default Course;
