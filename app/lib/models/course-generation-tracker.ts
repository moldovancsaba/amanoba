/**
 * CourseGenerationTracker Model
 * 
 * Tracks progressive course generation metrics and triggers.
 * Each tracker represents one topic progressing through 4 stages:
 * - Stage 1: 1-day rapid introduction
 * - Stage 2: 3-day skills deep-dive
 * - Stage 3: 7-day expert training
 * - Stage 4: 30-day extended mastery
 */

import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Stage metrics interface
 * Tracks engagement and completion data for a specific stage
 */
export interface IStageMetrics {
  enrollments: number;
  completions: number;
  averageScore: number;
  averageTimeMinutes: number;
  completionRate: number;
  triggerThreshold: number;
  triggerMet: boolean;
  triggeredAt?: Date;
}

/**
 * CourseGenerationTracker Document Interface
 */
export interface ICourseGenerationTracker extends Document {
  topicName: string;
  topicCategory: string;
  currentStage: 1 | 2 | 3 | 4;
  
  stage1CourseId?: string;
  stage2CourseId?: string;
  stage3CourseId?: string;
  stage4CourseId?: string;
  
  stage1Metrics?: IStageMetrics;
  stage2Metrics?: IStageMetrics;
  stage3Metrics?: IStageMetrics;
  stage4Metrics?: IStageMetrics;
  
  status: 'active' | 'paused' | 'completed';
  
  createdAt: Date;
  updatedAt: Date;
  lastMetricsUpdate: Date;
}

/**
 * Stage Metrics Schema
 */
const StageMetricsSchema = new Schema<IStageMetrics>(
  {
    enrollments: {
      type: Number,
      default: 0,
      min: [0, 'Enrollments cannot be negative'],
    },
    completions: {
      type: Number,
      default: 0,
      min: [0, 'Completions cannot be negative'],
    },
    averageScore: {
      type: Number,
      default: 0,
      min: [0, 'Average score cannot be negative'],
      max: [100, 'Average score cannot exceed 100'],
    },
    averageTimeMinutes: {
      type: Number,
      default: 0,
      min: [0, 'Average time cannot be negative'],
    },
    completionRate: {
      type: Number,
      default: 0,
      min: [0, 'Completion rate cannot be negative'],
      max: [100, 'Completion rate cannot exceed 100'],
    },
    triggerThreshold: {
      type: Number,
      required: [true, 'Trigger threshold is required'],
      min: [1, 'Trigger threshold must be at least 1'],
    },
    triggerMet: {
      type: Boolean,
      default: false,
    },
    triggeredAt: {
      type: Date,
    },
  },
  { _id: false }
);

/**
 * CourseGenerationTracker Schema
 */
const CourseGenerationTrackerSchema = new Schema<ICourseGenerationTracker>(
  {
    topicName: {
      type: String,
      required: [true, 'Topic name is required'],
      trim: true,
      unique: true,
      maxlength: [200, 'Topic name cannot exceed 200 characters'],
    },
    
    topicCategory: {
      type: String,
      required: [true, 'Topic category is required'],
      trim: true,
      maxlength: [100, 'Topic category cannot exceed 100 characters'],
    },
    
    currentStage: {
      type: Number,
      required: [true, 'Current stage is required'],
      enum: {
        values: [1, 2, 3, 4],
        message: 'Current stage must be 1, 2, 3, or 4',
      },
      default: 1,
    },
    
    stage1CourseId: {
      type: String,
      uppercase: true,
      trim: true,
    },
    
    stage2CourseId: {
      type: String,
      uppercase: true,
      trim: true,
    },
    
    stage3CourseId: {
      type: String,
      uppercase: true,
      trim: true,
    },
    
    stage4CourseId: {
      type: String,
      uppercase: true,
      trim: true,
    },
    
    stage1Metrics: {
      type: StageMetricsSchema,
    },
    
    stage2Metrics: {
      type: StageMetricsSchema,
    },
    
    stage3Metrics: {
      type: StageMetricsSchema,
    },
    
    stage4Metrics: {
      type: StageMetricsSchema,
    },
    
    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: {
        values: ['active', 'paused', 'completed'],
        message: 'Status must be active, paused, or completed',
      },
      default: 'active',
    },
    
    lastMetricsUpdate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    collection: 'course_generation_trackers',
  }
);

/**
 * Indexes
 */
CourseGenerationTrackerSchema.index({ topicName: 1 }, { unique: true });
CourseGenerationTrackerSchema.index({ currentStage: 1 });
CourseGenerationTrackerSchema.index({ status: 1 });
CourseGenerationTrackerSchema.index({ 'stage1Metrics.triggerMet': 1 });
CourseGenerationTrackerSchema.index({ 'stage2Metrics.triggerMet': 1 });
CourseGenerationTrackerSchema.index({ 'stage3Metrics.triggerMet': 1 });
CourseGenerationTrackerSchema.index({ topicCategory: 1 });
CourseGenerationTrackerSchema.index({ lastMetricsUpdate: 1 });

/**
 * Instance Methods
 */

/**
 * Get metrics for a specific stage
 */
CourseGenerationTrackerSchema.methods.getStageMetrics = function(
  stage: 1 | 2 | 3 | 4
): IStageMetrics | undefined {
  const metricsKey = `stage${stage}Metrics` as keyof ICourseGenerationTracker;
  return this[metricsKey] as IStageMetrics | undefined;
};

/**
 * Get course ID for a specific stage
 */
CourseGenerationTrackerSchema.methods.getStageCourseId = function(
  stage: 1 | 2 | 3 | 4
): string | undefined {
  const courseIdKey = `stage${stage}CourseId` as keyof ICourseGenerationTracker;
  return this[courseIdKey] as string | undefined;
};

/**
 * Check if a specific stage has met its trigger threshold
 */
CourseGenerationTrackerSchema.methods.isTriggerMet = function(
  stage: 1 | 2 | 3
): boolean {
  const metrics = this.getStageMetrics(stage);
  return metrics?.triggerMet || false;
};

/**
 * Get all stages with unmet triggers
 */
CourseGenerationTrackerSchema.methods.getUnmetTriggers = function(): Array<1 | 2 | 3> {
  const unmet: Array<1 | 2 | 3> = [];
  
  if (this.currentStage >= 1 && !this.isTriggerMet(1)) {
    unmet.push(1);
  }
  if (this.currentStage >= 2 && !this.isTriggerMet(2)) {
    unmet.push(2);
  }
  if (this.currentStage >= 3 && !this.isTriggerMet(3)) {
    unmet.push(3);
  }
  
  return unmet;
};

/**
 * Static Methods
 */

/**
 * Find trackers with met triggers that haven't been processed
 */
CourseGenerationTrackerSchema.statics.findReadyForProgression = async function(): Promise<ICourseGenerationTracker[]> {
  return this.find({
    status: 'active',
    $or: [
      { 'stage1Metrics.triggerMet': true, currentStage: 1 },
      { 'stage2Metrics.triggerMet': true, currentStage: 2 },
      { 'stage3Metrics.triggerMet': true, currentStage: 3 },
    ],
  });
};

/**
 * Find trackers by category
 */
CourseGenerationTrackerSchema.statics.findByCategory = async function(
  category: string
): Promise<ICourseGenerationTracker[]> {
  return this.find({ topicCategory: category, status: 'active' });
};

/**
 * Get active trackers needing metrics update
 */
CourseGenerationTrackerSchema.statics.findNeedingMetricsUpdate = async function(
  olderThanHours: number = 1
): Promise<ICourseGenerationTracker[]> {
  const threshold = new Date(Date.now() - olderThanHours * 60 * 60 * 1000);
  return this.find({
    status: 'active',
    lastMetricsUpdate: { $lt: threshold },
  });
};

/**
 * Export Model
 */
export const CourseGenerationTracker: Model<ICourseGenerationTracker> =
  mongoose.models.CourseGenerationTracker ||
  mongoose.model<ICourseGenerationTracker>('CourseGenerationTracker', CourseGenerationTrackerSchema);

export default CourseGenerationTracker;
