/**
 * Trigger Evaluator
 * 
 * Determines when course progressions should trigger the next stage.
 * Evaluates completion thresholds and marks triggers as met.
 */

import { CourseGenerationTracker } from '@/app/lib/models';
import type { ICourseGenerationTracker, IStageMetrics } from '@/app/lib/models';
import { logger } from '@/app/lib/logger';

/**
 * Trigger thresholds for each stage transition
 */
export interface TriggerThresholds {
  stage1to2: number;
  stage2to3: number;
  stage3to4: number;
}

/**
 * Trigger evaluation result
 */
export interface TriggerEvaluation {
  topicName: string;
  currentStage: 1 | 2 | 3 | 4;
  shouldTrigger: boolean;
  triggerReason?: string;
  metrics?: IStageMetrics;
  nextStage?: 2 | 3 | 4;
}

/**
 * Get default trigger thresholds
 * 
 * Based on the Progressive Course Strategy:
 * - Stage 1 → Stage 2: 50 completions
 * - Stage 2 → Stage 3: 30 completions
 * - Stage 3 → Stage 4: 20 completions
 * 
 * @returns Default trigger thresholds
 */
export function getDefaultTriggerThresholds(): TriggerThresholds {
  return {
    stage1to2: 50,
    stage2to3: 30,
    stage3to4: 20,
  };
}

/**
 * Evaluate if a course progression should trigger next stage
 * 
 * @param topicName - Topic name to evaluate
 * @returns Evaluation result with trigger decision
 */
export async function evaluateTriggers(topicName: string): Promise<TriggerEvaluation | null> {
  try {
    const tracker = await CourseGenerationTracker.findOne({ topicName });

    if (!tracker) {
      logger.warn({ topicName }, 'Tracker not found for trigger evaluation');
      return null;
    }

    if (tracker.status !== 'active') {
      logger.info({ topicName, status: tracker.status }, 'Tracker not active, skipping evaluation');
      return {
        topicName,
        currentStage: tracker.currentStage,
        shouldTrigger: false,
        triggerReason: 'Tracker status is not active',
      };
    }

    if (tracker.currentStage === 4) {
      return {
        topicName,
        currentStage: 4,
        shouldTrigger: false,
        triggerReason: 'Already at final stage',
      };
    }

    const metricsKey = `stage${tracker.currentStage}Metrics` as keyof ICourseGenerationTracker;
    const metrics = tracker[metricsKey] as IStageMetrics | undefined;

    if (!metrics) {
      return {
        topicName,
        currentStage: tracker.currentStage,
        shouldTrigger: false,
        triggerReason: 'No metrics available for current stage',
      };
    }

    const completions = metrics.completions;
    const threshold = metrics.triggerThreshold;
    const shouldTrigger = completions >= threshold && !metrics.triggerMet;

    const nextStage = (tracker.currentStage + 1) as 2 | 3 | 4;

    if (shouldTrigger) {
      logger.info(
        { topicName, currentStage: tracker.currentStage, completions, threshold },
        'Trigger threshold met for stage progression'
      );

      return {
        topicName,
        currentStage: tracker.currentStage,
        shouldTrigger: true,
        triggerReason: `Completions (${completions}) met threshold (${threshold})`,
        metrics,
        nextStage,
      };
    }

    return {
      topicName,
      currentStage: tracker.currentStage,
      shouldTrigger: false,
      triggerReason: `Completions (${completions}) below threshold (${threshold})`,
      metrics,
    };
  } catch (error) {
    logger.error({ error, topicName }, 'Error evaluating triggers');
    throw error;
  }
}

/**
 * Mark trigger as met for a specific stage
 * 
 * This is used for manual trigger marking in Phase 1.
 * In Phase 2, triggers will be automatically marked when content generation begins.
 * 
 * @param topicName - Topic name
 * @param stage - Stage number (1, 2, or 3)
 * @returns Updated tracker or null if not found
 */
export async function markTriggerMet(
  topicName: string,
  stage: 1 | 2 | 3
): Promise<ICourseGenerationTracker | null> {
  try {
    const tracker = await CourseGenerationTracker.findOne({ topicName });

    if (!tracker) {
      logger.warn({ topicName, stage }, 'Tracker not found for manual trigger marking');
      return null;
    }

    const metricsKey = `stage${stage}Metrics` as keyof ICourseGenerationTracker;
    const metrics = tracker[metricsKey] as IStageMetrics | undefined;

    if (!metrics) {
      logger.warn({ topicName, stage }, 'No metrics found for stage, cannot mark trigger');
      return null;
    }

    if (metrics.triggerMet) {
      logger.info({ topicName, stage }, 'Trigger already met, no action needed');
      return tracker;
    }

    metrics.triggerMet = true;
    metrics.triggeredAt = new Date();

    tracker.set(metricsKey, metrics);
    await tracker.save();

    logger.info({ topicName, stage }, 'Manually marked trigger as met');

    return tracker;
  } catch (error) {
    logger.error({ error, topicName, stage }, 'Error marking trigger as met');
    throw error;
  }
}

/**
 * Evaluate all active trackers and return those ready for progression
 * 
 * @returns Array of trackers with met triggers
 */
export async function evaluateAllTrackers(): Promise<TriggerEvaluation[]> {
  try {
    const trackers = await CourseGenerationTracker.find({ status: 'active' });

    const evaluations: TriggerEvaluation[] = [];

    for (const tracker of trackers) {
      try {
        const evaluation = await evaluateTriggers(tracker.topicName);
        if (evaluation) {
          evaluations.push(evaluation);
        }
      } catch (error) {
        logger.error(
          { error, topicName: tracker.topicName },
          'Error evaluating tracker in batch'
        );
      }
    }

    const readyForProgression = evaluations.filter(e => e.shouldTrigger);

    logger.info(
      {
        total: evaluations.length,
        readyForProgression: readyForProgression.length,
      },
      'Batch trigger evaluation completed'
    );

    return evaluations;
  } catch (error) {
    logger.error({ error }, 'Error in batch trigger evaluation');
    throw error;
  }
}

/**
 * Get progression status for a topic
 * 
 * @param topicName - Topic name
 * @returns Detailed progression status
 */
export async function getProgressionStatus(topicName: string): Promise<{
  topicName: string;
  currentStage: 1 | 2 | 3 | 4;
  status: string;
  stages: Array<{
    stage: 1 | 2 | 3 | 4;
    courseId?: string;
    metrics?: IStageMetrics;
    isReady: boolean;
  }>;
} | null> {
  try {
    const tracker = await CourseGenerationTracker.findOne({ topicName });

    if (!tracker) {
      return null;
    }

    const stages: Array<{
      stage: 1 | 2 | 3 | 4;
      courseId?: string;
      metrics?: IStageMetrics;
      isReady: boolean;
    }> = [];

    for (let stage = 1; stage <= 4; stage++) {
      const stageNum = stage as 1 | 2 | 3 | 4;
      const courseIdKey = `stage${stageNum}CourseId` as keyof ICourseGenerationTracker;
      const metricsKey = `stage${stageNum}Metrics` as keyof ICourseGenerationTracker;

      const courseId = tracker[courseIdKey] as string | undefined;
      const metrics = tracker[metricsKey] as IStageMetrics | undefined;

      const isReady = stageNum < 4
        ? (metrics?.triggerMet || false)
        : (tracker.currentStage === 4);

      stages.push({
        stage: stageNum,
        courseId,
        metrics,
        isReady,
      });
    }

    return {
      topicName: tracker.topicName,
      currentStage: tracker.currentStage,
      status: tracker.status,
      stages,
    };
  } catch (error) {
    logger.error({ error, topicName }, 'Error getting progression status');
    throw error;
  }
}
