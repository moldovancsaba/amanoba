/**
 * Metrics Aggregator
 * 
 * Calculates and updates engagement metrics for progressive course generation.
 * Aggregates data from CourseProgress to determine when triggers are met.
 */

import { CourseProgress, CourseGenerationTracker, Course } from '@/app/lib/models';
import type { ICourseGenerationTracker, IStageMetrics } from '@/app/lib/models';
import { logger } from '@/app/lib/logger';

/**
 * Course metrics result
 */
export interface CourseMetrics {
  enrollments: number;
  completions: number;
  averageScore: number;
  averageTimeMinutes: number;
  completionRate: number;
}

/**
 * Calculate metrics for a specific course
 * 
 * @param courseId - Course ID to calculate metrics for
 * @returns Aggregated course metrics
 */
export async function calculateCourseMetrics(courseId: string): Promise<CourseMetrics> {
  try {
    const course = await Course.findOne({ courseId }).lean();
    
    if (!course) {
      logger.warn({ courseId }, 'Course not found for metrics calculation');
      return {
        enrollments: 0,
        completions: 0,
        averageScore: 0,
        averageTimeMinutes: 0,
        completionRate: 0,
      };
    }

    const progressRecords = await CourseProgress.find({
      courseId: course._id,
    }).lean();

    const enrollments = progressRecords.length;
    const completions = progressRecords.filter(
      p => p.status === 'completed' || p.completedAt !== undefined
    ).length;
    const completionRate = enrollments > 0 ? (completions / enrollments) * 100 : 0;

    let totalScore = 0;
    let scoreCount = 0;
    let totalTimeMinutes = 0;
    let timeCount = 0;

    for (const progress of progressRecords) {
      if (progress.completedDays && course.durationDays) {
        const completionPercentage = (progress.completedDays.length / course.durationDays) * 100;
        totalScore += completionPercentage;
        scoreCount++;
      }

      if (progress.startedAt && progress.completedAt) {
        const durationMs = progress.completedAt.getTime() - progress.startedAt.getTime();
        const durationMinutes = durationMs / (1000 * 60);
        totalTimeMinutes += durationMinutes;
        timeCount++;
      }
    }

    const averageScore = scoreCount > 0 ? totalScore / scoreCount : 0;
    const averageTimeMinutes = timeCount > 0 ? totalTimeMinutes / timeCount : 0;

    return {
      enrollments,
      completions,
      averageScore: Math.round(averageScore * 100) / 100,
      averageTimeMinutes: Math.round(averageTimeMinutes * 100) / 100,
      completionRate: Math.round(completionRate * 100) / 100,
    };
  } catch (error) {
    logger.error({ error, courseId }, 'Error calculating course metrics');
    throw error;
  }
}

/**
 * Update tracker metrics for a specific stage
 * 
 * @param topicName - Topic name to update
 * @param stage - Stage number (1, 2, 3, or 4)
 * @returns Updated tracker or null if not found
 */
export async function updateTrackerMetrics(
  topicName: string,
  stage: 1 | 2 | 3 | 4
): Promise<ICourseGenerationTracker | null> {
  try {
    const tracker = await CourseGenerationTracker.findOne({ topicName });

    if (!tracker) {
      logger.warn({ topicName }, 'Tracker not found for metrics update');
      return null;
    }

    const courseIdKey = `stage${stage}CourseId` as keyof ICourseGenerationTracker;
    const courseId = tracker[courseIdKey] as string | undefined;

    if (!courseId) {
      logger.warn({ topicName, stage }, 'No course ID found for stage');
      return tracker;
    }

    const metrics = await calculateCourseMetrics(courseId);

    const metricsKey = `stage${stage}Metrics` as keyof ICourseGenerationTracker;
    const currentMetrics = tracker[metricsKey] as IStageMetrics | undefined;

    const triggerThreshold = currentMetrics?.triggerThreshold || getDefaultTriggerThreshold(stage);
    const triggerMet = metrics.completions >= triggerThreshold;

    const updatedMetrics: IStageMetrics = {
      enrollments: metrics.enrollments,
      completions: metrics.completions,
      averageScore: metrics.averageScore,
      averageTimeMinutes: metrics.averageTimeMinutes,
      completionRate: metrics.completionRate,
      triggerThreshold,
      triggerMet,
      triggeredAt: triggerMet && !currentMetrics?.triggerMet ? new Date() : currentMetrics?.triggeredAt,
    };

    tracker.set(metricsKey, updatedMetrics);
    tracker.lastMetricsUpdate = new Date();

    await tracker.save();

    logger.info(
      { topicName, stage, metrics: updatedMetrics },
      'Updated tracker metrics'
    );

    return tracker;
  } catch (error) {
    logger.error({ error, topicName, stage }, 'Error updating tracker metrics');
    throw error;
  }
}

/**
 * Get default trigger threshold for a stage
 * 
 * @param stage - Stage number
 * @returns Default completion threshold
 */
function getDefaultTriggerThreshold(stage: 1 | 2 | 3 | 4): number {
  switch (stage) {
    case 1:
      return 50;
    case 2:
      return 30;
    case 3:
      return 20;
    case 4:
      return 0;
    default:
      return 0;
  }
}

/**
 * Update metrics for all stages of a tracker
 * 
 * @param topicName - Topic name to update
 * @returns Updated tracker or null if not found
 */
export async function updateAllStagesMetrics(
  topicName: string
): Promise<ICourseGenerationTracker | null> {
  try {
    const tracker = await CourseGenerationTracker.findOne({ topicName });

    if (!tracker) {
      logger.warn({ topicName }, 'Tracker not found for full metrics update');
      return null;
    }

    for (let stage = 1; stage <= 4; stage++) {
      const stageNum = stage as 1 | 2 | 3 | 4;
      await updateTrackerMetrics(topicName, stageNum);
    }

    return CourseGenerationTracker.findOne({ topicName });
  } catch (error) {
    logger.error({ error, topicName }, 'Error updating all stages metrics');
    throw error;
  }
}

/**
 * Batch update metrics for all active trackers
 * 
 * @param limit - Maximum number of trackers to update (default: no limit)
 * @returns Number of trackers updated
 */
export async function refreshAllMetrics(limit?: number): Promise<number> {
  try {
    const query = CourseGenerationTracker.find({ status: 'active' });
    
    if (limit) {
      query.limit(limit);
    }

    const trackers = await query;

    let updatedCount = 0;

    for (const tracker of trackers) {
      try {
        await updateAllStagesMetrics(tracker.topicName);
        updatedCount++;
      } catch (error) {
        logger.error(
          { error, topicName: tracker.topicName },
          'Error updating tracker in batch'
        );
      }
    }

    logger.info({ updatedCount, total: trackers.length }, 'Batch metrics refresh completed');

    return updatedCount;
  } catch (error) {
    logger.error({ error }, 'Error in batch metrics refresh');
    throw error;
  }
}

/**
 * Find trackers with newly met triggers
 * 
 * @returns List of trackers with newly met triggers
 */
export async function findNewlyMetTriggers(): Promise<Array<{
  topicName: string;
  stage: 1 | 2 | 3;
  metrics: IStageMetrics;
}>> {
  try {
    const trackers = await CourseGenerationTracker.find({
      status: 'active',
      $or: [
        { 'stage1Metrics.triggerMet': true, currentStage: 1 },
        { 'stage2Metrics.triggerMet': true, currentStage: 2 },
        { 'stage3Metrics.triggerMet': true, currentStage: 3 },
      ],
    });

    const results: Array<{
      topicName: string;
      stage: 1 | 2 | 3;
      metrics: IStageMetrics;
    }> = [];

    for (const tracker of trackers) {
      const stage = tracker.currentStage as 1 | 2 | 3;
      const metricsKey = `stage${stage}Metrics` as keyof ICourseGenerationTracker;
      const metrics = tracker[metricsKey] as IStageMetrics | undefined;

      if (metrics?.triggerMet) {
        results.push({
          topicName: tracker.topicName,
          stage,
          metrics,
        });
      }
    }

    return results;
  } catch (error) {
    logger.error({ error }, 'Error finding newly met triggers');
    throw error;
  }
}
