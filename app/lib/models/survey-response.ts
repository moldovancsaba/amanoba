/**
 * SurveyResponse Model
 * 
 * What: Stores student survey responses
 * Why: Tracks survey answers for course recommendations and segmentation
 */

import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Answer Value Type
 * Why: Flexible answer storage for different question types
 */
export type AnswerValue = string | string[] | number | Record<string, unknown>;

/**
 * Survey Response Answer Interface
 * Why: Type-safe structure for individual question answers
 */
export interface ISurveyAnswer {
  questionId: string; // References Survey.questions[].questionId
  value: AnswerValue; // Answer value (string, array, number, or object)
  metadata?: Record<string, unknown>; // Additional answer metadata
}

/**
 * SurveyResponse Document Interface
 * Why: TypeScript type safety for SurveyResponse documents
 */
export interface ISurveyResponse extends Document {
  playerId: mongoose.Types.ObjectId; // Player who answered
  surveyId: mongoose.Types.ObjectId; // Survey reference
  brandId: mongoose.Types.ObjectId; // Brand reference
  answers: ISurveyAnswer[]; // Array of answers
  completedAt: Date; // When survey was completed
  metadata?: {
    timeSpentSeconds?: number; // Time taken to complete
    deviceType?: string; // Mobile/Desktop/Tablet
    userAgent?: string; // Browser user agent
    ipAddress?: string; // IP address (for analytics)
    sessionId?: string; // Session identifier
  };
  createdAt: Date;
  updatedAt: Date;
}

/**
 * SurveyResponse Schema
 * Why: Defines structure, validation, and indexes for SurveyResponse collection
 */
const SurveyResponseSchema = new Schema<ISurveyResponse>(
  {
    playerId: {
      type: Schema.Types.ObjectId,
      ref: 'Player',
      required: [true, 'Player ID is required'],
      index: true,
    },
    surveyId: {
      type: Schema.Types.ObjectId,
      ref: 'Survey',
      required: [true, 'Survey ID is required'],
      index: true,
    },
    brandId: {
      type: Schema.Types.ObjectId,
      ref: 'Brand',
      required: [true, 'Brand ID is required'],
      index: true,
    },
    answers: {
      type: [
        {
          questionId: {
            type: String,
            required: true,
            trim: true,
          },
          value: {
            type: Schema.Types.Mixed,
            required: true,
          },
          metadata: {
            type: Schema.Types.Mixed,
            default: {},
          },
        },
      ],
      required: true,
      validate: {
        validator: (answers: ISurveyAnswer[]) => answers.length > 0,
        message: 'Survey response must have at least one answer',
      },
    },
    completedAt: {
      type: Date,
      default: () => new Date(),
      required: true,
      index: true,
    },
    metadata: {
      type: {
        timeSpentSeconds: {
          type: Number,
          min: [0, 'Time spent cannot be negative'],
        },
        deviceType: String,
        userAgent: String,
        ipAddress: String,
        sessionId: String,
      },
      default: {},
    },
  },
  {
    timestamps: true,
    strict: true,
  }
);

/**
 * Indexes
 * Why: Optimize common query patterns
 */
SurveyResponseSchema.index({ playerId: 1, surveyId: 1 }, { unique: true }); // One response per player per survey
SurveyResponseSchema.index({ playerId: 1, completedAt: -1 });
SurveyResponseSchema.index({ surveyId: 1, completedAt: -1 });
SurveyResponseSchema.index({ brandId: 1, completedAt: -1 });

/**
 * Pre-save Hook: Validate answers
 * Why: Ensure answers match question requirements
 */
SurveyResponseSchema.pre('save', function (next) {
  // Validate that completedAt is set
  if (!this.completedAt) {
    this.completedAt = new Date();
  }
  next();
});

/**
 * Export Model
 * Why: Singleton pattern prevents multiple model compilations
 */
const SurveyResponse: Model<ISurveyResponse> =
  mongoose.models.SurveyResponse ||
  mongoose.model<ISurveyResponse>('SurveyResponse', SurveyResponseSchema);

export default SurveyResponse;
