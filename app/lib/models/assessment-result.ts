/**
 * AssessmentResult Model
 * 
 * What: Tracks game session results when used as course assessments
 * Why: Links game performance to course progress and provides insights
 */

import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * AssessmentResult Document Interface
 * 
 * Why: TypeScript type safety for AssessmentResult documents
 */
export interface IAssessmentResult extends Document {
  playerId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  courseProgressId: mongoose.Types.ObjectId;
  lessonDay: number; // Day number (1-30) this assessment belongs to
  gameId: mongoose.Types.ObjectId;
  sessionId: mongoose.Types.ObjectId; // Game session reference
  score: number;
  maxScore: number;
  accuracy?: number; // Percentage correct (0-100)
  insights?: string; // AI-generated insights about performance
  recommendations?: string[]; // Suggested next steps
  completedAt: Date;
  metadata?: {
    difficulty?: string;
    timeSpent?: number; // Seconds
    questionsAnswered?: number;
    correctAnswers?: number;
    wrongAnswers?: number;
    [key: string]: unknown;
  };
  createdAt: Date;
  updatedAt: Date;
}

/**
 * AssessmentResult Schema
 * 
 * Why: Defines structure, validation, and indexes for AssessmentResult collection
 */
const AssessmentResultSchema = new Schema<IAssessmentResult>(
  {
    // Student reference
    // Why: Links result to student
    playerId: {
      type: Schema.Types.ObjectId,
      ref: 'Player',
      required: [true, 'Player ID is required'],
      index: true,
    },

    // Course reference
    // Why: Links result to course
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course ID is required'],
      index: true,
    },

    // Course progress reference
    // Why: Links result to course progress record
    courseProgressId: {
      type: Schema.Types.ObjectId,
      ref: 'CourseProgress',
      required: [true, 'Course progress ID is required'],
      index: true,
    },

    // Lesson day number (1-30)
    // Why: Identifies which lesson day this assessment belongs to
    lessonDay: {
      type: Number,
      required: [true, 'Lesson day is required'],
      min: [1, 'Lesson day must be at least 1'],
      max: [365, 'Lesson day cannot exceed 365'],
      index: true,
    },

    // Game reference
    // Why: Identifies which game was used for assessment
    gameId: {
      type: Schema.Types.ObjectId,
      ref: 'Game',
      required: [true, 'Game ID is required'],
      index: true,
    },

    // Game session reference
    // Why: Links to the actual game session
    sessionId: {
      type: Schema.Types.ObjectId,
      ref: 'PlayerSession',
      required: [true, 'Session ID is required'],
      index: true,
    },

    // Assessment score
    // Why: Student's score on assessment
    score: {
      type: Number,
      required: [true, 'Score is required'],
      min: [0, 'Score cannot be negative'],
    },

    // Maximum possible score
    // Why: Used to calculate percentage and accuracy
    maxScore: {
      type: Number,
      required: [true, 'Max score is required'],
      min: [0, 'Max score cannot be negative'],
    },

    // Accuracy percentage (0-100)
    // Why: Percentage of correct answers/actions
    accuracy: {
      type: Number,
      min: [0, 'Accuracy cannot be negative'],
      max: [100, 'Accuracy cannot exceed 100'],
    },

    // AI-generated insights
    // Why: Automated analysis of student performance
    insights: {
      type: String,
      trim: true,
    },

    // Recommendations for student
    // Why: Suggested next steps based on performance
    recommendations: {
      type: [String],
      default: [],
    },

    // Assessment completion timestamp
    // Why: Track when assessment was completed
    completedAt: {
      type: Date,
      required: [true, 'Completed at is required'],
      default: Date.now,
      index: true,
    },

    // Flexible metadata field
    // Why: Allows storing game-specific assessment data
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    // Automatic timestamps
    // Why: Track when results are created and updated
    timestamps: true,
    
    // Strict mode to reject undefined fields
    // Why: Prevents data corruption from unexpected fields
    strict: true,
    
    // Collection name
    // Why: Explicitly named for clarity
    collection: 'assessment_results',
  }
);

// Indexes for efficient querying
// Why: AssessmentResults are queried by player, course, day, and game

AssessmentResultSchema.index({ playerId: 1 }, { name: 'assessment_result_player' });
AssessmentResultSchema.index({ courseId: 1 }, { name: 'assessment_result_course' });
AssessmentResultSchema.index({ courseProgressId: 1 }, { name: 'assessment_result_progress' });
AssessmentResultSchema.index({ lessonDay: 1 }, { name: 'assessment_result_day' });
AssessmentResultSchema.index({ gameId: 1 }, { name: 'assessment_result_game' });
AssessmentResultSchema.index({ sessionId: 1 }, { name: 'assessment_result_session', unique: true });
AssessmentResultSchema.index({ playerId: 1, courseId: 1, lessonDay: 1 }, { name: 'assessment_result_player_course_day' });

/**
 * Pre-save hook to calculate accuracy
 * 
 * Why: Automatically calculate accuracy if not provided
 */
AssessmentResultSchema.pre('save', function (next) {
  // Calculate accuracy if not provided
  if (this.accuracy === undefined && this.maxScore > 0) {
    this.accuracy = Math.round((this.score / this.maxScore) * 100);
  }
  next();
});

/**
 * AssessmentResult Model
 * 
 * Why: Export typed model for use in application
 */
const AssessmentResult: Model<IAssessmentResult> =
  mongoose.models.AssessmentResult || mongoose.model<IAssessmentResult>('AssessmentResult', AssessmentResultSchema);

export default AssessmentResult;
