/**
 * CourseProgress Model
 * 
 * What: Tracks student progress through a 30-day course
 * Why: Monitors completion, email delivery, and assessment results for each student
 */

import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Course Progress Status Enum
 * 
 * Why: Type-safe status references
 */
export enum CourseProgressStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  ABANDONED = 'abandoned',
}

/**
 * CourseProgress Document Interface
 * 
 * Why: TypeScript type safety for CourseProgress documents
 */
export interface ICourseProgress extends Document {
  playerId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  currentDay: number; // Current lesson day (1-30)
  completedDays: number[]; // Array of completed day numbers
  startedAt: Date;
  completedAt?: Date;
  lastAccessedAt?: Date;
  emailSentDays: number[]; // Days where email was successfully sent
  assessmentResults: Map<string, mongoose.Types.ObjectId>; // dayNumber -> AssessmentResult ID
  totalPointsEarned: number;
  totalXPEarned: number;
  status: CourseProgressStatus;
  metadata?: {
    enrollmentSource?: string; // How student found course
    completionStreak?: number; // Consecutive days completed
    lastEmailSentAt?: Date;
    reminderCount?: number; // Number of reminder emails sent
    [key: string]: unknown;
  };
  createdAt: Date;
  updatedAt: Date;
}

/**
 * CourseProgress Schema
 * 
 * Why: Defines structure, validation, and indexes for CourseProgress collection
 */
const CourseProgressSchema = new Schema<ICourseProgress>(
  {
    // Student reference
    // Why: Links progress to student
    playerId: {
      type: Schema.Types.ObjectId,
      ref: 'Player',
      required: [true, 'Player ID is required'],
      index: true,
    },

    // Course reference
    // Why: Links progress to course
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course ID is required'],
      index: true,
    },

    // Current lesson day
    // Why: Tracks which day student is on (1-30)
    currentDay: {
      type: Number,
      required: [true, 'Current day is required'],
      default: 1,
      min: [1, 'Current day must be at least 1'],
      max: [365, 'Current day cannot exceed 365'],
    },

    // Array of completed day numbers
    // Why: Tracks which lessons have been completed
    completedDays: {
      type: [Number],
      default: [],
    },

    // Course start timestamp
    // Why: Track when student enrolled/started
    startedAt: {
      type: Date,
      required: [true, 'Started at is required'],
      default: Date.now,
      index: true,
    },

    // Course completion timestamp
    // Why: Track when student finished all 30 days
    completedAt: {
      type: Date,
      index: true,
    },

    // Last lesson access timestamp
    // Why: Track student engagement
    lastAccessedAt: {
      type: Date,
      index: true,
    },

    // Days where email was successfully sent
    // Why: Track email delivery to prevent duplicates
    emailSentDays: {
      type: [Number],
      default: [],
    },

    // Assessment results map
    // Why: Links assessment results to specific days
    assessmentResults: {
      type: Map,
      of: Schema.Types.ObjectId,
      ref: 'AssessmentResult',
      default: new Map(),
    },

    // Total points earned from course
    // Why: Track gamification rewards
    totalPointsEarned: {
      type: Number,
      default: 0,
      min: [0, 'Total points cannot be negative'],
    },

    // Total XP earned from course
    // Why: Track gamification rewards
    totalXPEarned: {
      type: Number,
      default: 0,
      min: [0, 'Total XP cannot be negative'],
    },

    // Progress status
    // Why: Track course state (not started, in progress, completed, abandoned)
    status: {
      type: String,
      enum: {
        values: Object.values(CourseProgressStatus),
        message: 'Invalid progress status',
      },
      default: CourseProgressStatus.NOT_STARTED,
      index: true,
    },

    // Flexible metadata field
    // Why: Allows adding progress-specific data without schema changes
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    // Automatic timestamps
    // Why: Track when progress records are created and updated
    timestamps: true,
    
    // Strict mode to reject undefined fields
    // Why: Prevents data corruption from unexpected fields
    strict: true,
    
    // Collection name
    // Why: Explicitly named for clarity
    collection: 'course_progress',
  }
);

// Indexes for efficient querying
// Why: CourseProgress is queried by player, course, status, and dates

CourseProgressSchema.index({ playerId: 1 }, { name: 'course_progress_player' });
CourseProgressSchema.index({ courseId: 1 }, { name: 'course_progress_course' });
CourseProgressSchema.index({ playerId: 1, courseId: 1 }, { name: 'course_progress_player_course', unique: true });
CourseProgressSchema.index({ status: 1 }, { name: 'course_progress_status' });
CourseProgressSchema.index({ startedAt: 1 }, { name: 'course_progress_started' });
CourseProgressSchema.index({ completedAt: 1 }, { name: 'course_progress_completed' });
CourseProgressSchema.index({ lastAccessedAt: 1 }, { name: 'course_progress_last_accessed' });

/**
 * Pre-save hook to update status
 * 
 * Why: Automatically update status based on progress
 */
CourseProgressSchema.pre('save', function (next) {
  // Update status based on progress
  if (this.completedDays.length === 0) {
    this.status = CourseProgressStatus.NOT_STARTED;
  } else if (this.completedAt) {
    this.status = CourseProgressStatus.COMPLETED;
  } else {
    this.status = CourseProgressStatus.IN_PROGRESS;
  }

  // Set currentDay to next incomplete day
  if (this.completedDays.length > 0) {
    const maxCompleted = Math.max(...this.completedDays);
    this.currentDay = maxCompleted + 1;
  }

  next();
});

/**
 * CourseProgress Model
 * 
 * Why: Export typed model for use in application
 */
const CourseProgress: Model<ICourseProgress> =
  mongoose.models.CourseProgress || mongoose.model<ICourseProgress>('CourseProgress', CourseProgressSchema);

export default CourseProgress;
