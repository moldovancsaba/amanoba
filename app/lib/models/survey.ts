/**
 * Survey Model
 * 
 * What: Stores survey questions and configuration
 * Why: Allows admins to create and manage onboarding surveys for course recommendations
 */

import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Question Type Enum
 * Why: Defines supported question types for survey questions
 */
export enum QuestionType {
  SINGLE_CHOICE = 'single_choice',
  MULTIPLE_CHOICE = 'multiple_choice',
  TEXT = 'text',
  RATING = 'rating',
  SCALE = 'scale',
}

/**
 * Survey Question Interface
 * Why: Type-safe structure for survey questions
 */
export interface ISurveyQuestion {
  questionId: string; // Unique identifier for the question
  type: QuestionType;
  question: string; // Question text (can be translated)
  description?: string; // Optional description/help text
  options?: Array<{
    value: string;
    label: string; // Can be translated
    metadata?: Record<string, unknown>; // Additional data (e.g., course tags, skill level)
  }>;
  required: boolean;
  order: number; // Display order
  metadata?: {
    category?: string; // e.g., 'learning_goal', 'skill_level', 'interests'
    tags?: string[]; // Tags for course matching
    min?: number; // For scale/rating questions
    max?: number; // For scale/rating questions
  };
}

/**
 * Survey Document Interface
 * Why: TypeScript type safety for Survey documents
 */
export interface ISurvey extends Document {
  surveyId: string; // Unique identifier (e.g., 'onboarding')
  name: string; // Survey name
  description?: string; // Survey description
  brandId: mongoose.Types.ObjectId; // Brand this survey belongs to
  questions: ISurveyQuestion[];
  isActive: boolean;
  isDefault: boolean; // Default survey for new users
  metadata?: {
    completionMessage?: string; // Message shown after completion
    redirectUrl?: string; // Where to redirect after completion
    estimatedMinutes?: number; // Estimated time to complete
  };
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Survey Schema
 * Why: Defines structure, validation, and indexes for Survey collection
 */
const SurveySchema = new Schema<ISurvey>(
  {
    surveyId: {
      type: String,
      required: [true, 'Survey ID is required'],
      unique: true,
      trim: true,
      index: true,
      match: [/^[a-z0-9_-]+$/, 'Survey ID must be lowercase alphanumeric with hyphens/underscores'],
    },
    name: {
      type: String,
      required: [true, 'Survey name is required'],
      trim: true,
      maxlength: [100, 'Survey name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    brandId: {
      type: Schema.Types.ObjectId,
      ref: 'Brand',
      required: [true, 'Brand ID is required'],
      index: true,
    },
    questions: {
      type: [
        {
          questionId: {
            type: String,
            required: true,
            trim: true,
          },
          type: {
            type: String,
            enum: Object.values(QuestionType),
            required: true,
          },
          question: {
            type: String,
            required: true,
            trim: true,
            maxlength: [500, 'Question text cannot exceed 500 characters'],
          },
          description: {
            type: String,
            trim: true,
            maxlength: [500, 'Description cannot exceed 500 characters'],
          },
          options: {
            type: [
              {
                value: {
                  type: String,
                  required: true,
                  trim: true,
                },
                label: {
                  type: String,
                  required: true,
                  trim: true,
                },
                metadata: {
                  type: Schema.Types.Mixed,
                  default: {},
                },
              },
            ],
            default: [],
          },
          required: {
            type: Boolean,
            default: false,
          },
          order: {
            type: Number,
            required: true,
            min: [0, 'Order must be non-negative'],
          },
          metadata: {
            type: {
              category: String,
              tags: [String],
              min: Number,
              max: Number,
            },
            default: {},
          },
        },
      ],
      required: true,
      validate: {
        validator: (questions: ISurveyQuestion[]) => questions.length > 0,
        message: 'Survey must have at least one question',
      },
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
      index: true,
    },
    metadata: {
      type: {
        completionMessage: String,
        redirectUrl: String,
        estimatedMinutes: Number,
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
SurveySchema.index({ brandId: 1, isActive: 1 });
SurveySchema.index({ brandId: 1, isDefault: 1 });
SurveySchema.index({ surveyId: 1, brandId: 1 });

/**
 * Pre-save Hook: Validate question order
 * Why: Ensure questions are ordered correctly
 */
SurveySchema.pre('save', function (next) {
  if (this.questions && this.questions.length > 0) {
    // Sort questions by order
    this.questions.sort((a, b) => a.order - b.order);
    
    // Validate unique question IDs
    const questionIds = this.questions.map((q) => q.questionId);
    const uniqueIds = new Set(questionIds);
    if (questionIds.length !== uniqueIds.size) {
      return next(new Error('Question IDs must be unique'));
    }
  }
  next();
});

/**
 * Export Model
 * Why: Singleton pattern prevents multiple model compilations
 */
const Survey: Model<ISurvey> =
  mongoose.models.Survey || mongoose.model<ISurvey>('Survey', SurveySchema);

export default Survey;
