/**
 * Progressive Generation Helpers
 * 
 * Utility functions for managing course progressions and linking courses.
 */

import { Course, CourseGenerationTracker } from '@/app/lib/models';
import type { ICourse, ICourseGenerationTracker } from '@/app/lib/models';
import { logger } from '@/app/lib/logger';
import { getDefaultTriggerThresholds } from './trigger-evaluator';

/**
 * Progression path result
 */
export interface ProgressionPath {
  topicName: string;
  currentStage: 1 | 2 | 3 | 4;
  courses: Array<{
    stage: 1 | 2 | 3 | 4;
    courseId: string;
    courseName: string;
    isCurrentStage: boolean;
    isAvailable: boolean;
  }>;
}

/**
 * Link a course to a progression stage
 * 
 * @param topicName - Topic name
 * @param stage - Stage number (1, 2, 3, or 4)
 * @param courseId - Course ID to link
 * @returns Updated tracker or null if not found
 */
export async function linkCourseToProgression(
  topicName: string,
  stage: 1 | 2 | 3 | 4,
  courseId: string
): Promise<ICourseGenerationTracker | null> {
  try {
    const tracker = await CourseGenerationTracker.findOne({ topicName });

    if (!tracker) {
      logger.warn({ topicName, stage, courseId }, 'Tracker not found for course linking');
      return null;
    }

    const course = await Course.findOne({ courseId });

    if (!course) {
      logger.warn({ topicName, stage, courseId }, 'Course not found for linking');
      return null;
    }

    const courseIdKey = `stage${stage}CourseId` as keyof ICourseGenerationTracker;
    tracker.set(courseIdKey, courseId);

    if (!tracker[`stage${stage}Metrics` as keyof ICourseGenerationTracker]) {
      const thresholds = getDefaultTriggerThresholds();
      const metricsKey = `stage${stage}Metrics` as keyof ICourseGenerationTracker;
      
      let triggerThreshold = 0;
      if (stage === 1) triggerThreshold = thresholds.stage1to2;
      else if (stage === 2) triggerThreshold = thresholds.stage2to3;
      else if (stage === 3) triggerThreshold = thresholds.stage3to4;

      tracker.set(metricsKey, {
        enrollments: 0,
        completions: 0,
        averageScore: 0,
        averageTimeMinutes: 0,
        completionRate: 0,
        triggerThreshold,
        triggerMet: false,
      });
    }

    await tracker.save();

    course.progressionMetadata = {
      generationType: 'progressive',
      generationStage: stage,
      topicName,
      isProgressionRoot: stage === 1,
    };

    const prevStage = stage - 1;
    const nextStage = stage + 1;

    if (prevStage >= 1) {
      const prevCourseId = tracker[`stage${prevStage}CourseId` as keyof ICourseGenerationTracker] as string | undefined;
      if (prevCourseId) {
        course.progressionMetadata.previousStageCourseId = prevCourseId;
      }
    }

    if (nextStage <= 4) {
      const nextCourseId = tracker[`stage${nextStage}CourseId` as keyof ICourseGenerationTracker] as string | undefined;
      if (nextCourseId) {
        course.progressionMetadata.nextStageCourseId = nextCourseId;
      }
    }

    await course.save();

    if (prevStage >= 1) {
      const prevCourseId = tracker[`stage${prevStage}CourseId` as keyof ICourseGenerationTracker] as string | undefined;
      if (prevCourseId) {
        const prevCourse = await Course.findOne({ courseId: prevCourseId });
        if (prevCourse && prevCourse.progressionMetadata) {
          prevCourse.progressionMetadata.nextStageCourseId = courseId;
          await prevCourse.save();
        }
      }
    }

    logger.info({ topicName, stage, courseId }, 'Linked course to progression');

    return tracker;
  } catch (error) {
    logger.error({ error, topicName, stage, courseId }, 'Error linking course to progression');
    throw error;
  }
}

/**
 * Get progression path for a course
 * 
 * @param courseId - Course ID
 * @returns Progression path with all related courses
 */
export async function getProgressionPath(courseId: string): Promise<ProgressionPath | null> {
  try {
    const course = await Course.findOne({ courseId }).lean();

    if (!course || !course.progressionMetadata) {
      return null;
    }

    const { topicName, generationStage } = course.progressionMetadata;

    const tracker = await CourseGenerationTracker.findOne({ topicName }).lean();

    if (!tracker) {
      logger.warn({ courseId, topicName }, 'Tracker not found for progression path');
      return null;
    }

    const courses: ProgressionPath['courses'] = [];

    for (let stage = 1; stage <= 4; stage++) {
      const stageNum = stage as 1 | 2 | 3 | 4;
      const stageCourseIdKey = `stage${stageNum}CourseId` as keyof ICourseGenerationTracker;
      const stageCourseId = tracker[stageCourseIdKey] as string | undefined;

      if (stageCourseId) {
        const stageCourse = await Course.findOne({ courseId: stageCourseId }).lean();

        if (stageCourse) {
          courses.push({
            stage: stageNum,
            courseId: stageCourseId,
            courseName: stageCourse.name,
            isCurrentStage: stageNum === generationStage,
            isAvailable: true,
          });
        }
      }
    }

    return {
      topicName,
      currentStage: tracker.currentStage,
      courses,
    };
  } catch (error) {
    logger.error({ error, courseId }, 'Error getting progression path');
    throw error;
  }
}

/**
 * Check if a course is part of a progression
 * 
 * @param courseId - Course ID
 * @returns True if course is part of a progression
 */
export async function isProgressionCourse(courseId: string): Promise<boolean> {
  try {
    const course = await Course.findOne({ courseId }).select('progressionMetadata').lean();
    return !!(course?.progressionMetadata?.generationType === 'progressive');
  } catch (error) {
    logger.error({ error, courseId }, 'Error checking if course is part of progression');
    return false;
  }
}

/**
 * Create a new course progression tracker
 * 
 * @param topicName - Unique topic name
 * @param topicCategory - Category (e.g., "Programming", "Business")
 * @param stage1CourseId - Optional initial course ID for Stage 1
 * @returns Created tracker
 */
export async function createProgressionTracker(
  topicName: string,
  topicCategory: string,
  stage1CourseId?: string
): Promise<ICourseGenerationTracker> {
  try {
    const existing = await CourseGenerationTracker.findOne({ topicName });

    if (existing) {
      logger.warn({ topicName }, 'Tracker already exists for topic');
      throw new Error(`Tracker already exists for topic: ${topicName}`);
    }

    const thresholds = getDefaultTriggerThresholds();

    const tracker = await CourseGenerationTracker.create({
      topicName,
      topicCategory,
      currentStage: 1,
      stage1CourseId,
      status: 'active',
      stage1Metrics: {
        enrollments: 0,
        completions: 0,
        averageScore: 0,
        averageTimeMinutes: 0,
        completionRate: 0,
        triggerThreshold: thresholds.stage1to2,
        triggerMet: false,
      },
    });

    if (stage1CourseId) {
      await linkCourseToProgression(topicName, 1, stage1CourseId);
    }

    logger.info({ topicName, topicCategory, stage1CourseId }, 'Created progression tracker');

    return tracker;
  } catch (error) {
    logger.error({ error, topicName, topicCategory }, 'Error creating progression tracker');
    throw error;
  }
}

/**
 * Advance tracker to next stage
 * 
 * @param topicName - Topic name
 * @param nextStageCourseId - Course ID for the new stage
 * @returns Updated tracker or null if not found
 */
export async function advanceToNextStage(
  topicName: string,
  nextStageCourseId: string
): Promise<ICourseGenerationTracker | null> {
  try {
    const tracker = await CourseGenerationTracker.findOne({ topicName });

    if (!tracker) {
      logger.warn({ topicName }, 'Tracker not found for stage advancement');
      return null;
    }

    if (tracker.currentStage >= 4) {
      logger.warn({ topicName }, 'Already at final stage, cannot advance');
      return tracker;
    }

    const nextStage = (tracker.currentStage + 1) as 2 | 3 | 4;

    tracker.currentStage = nextStage;

    await linkCourseToProgression(topicName, nextStage, nextStageCourseId);

    logger.info({ topicName, nextStage, nextStageCourseId }, 'Advanced tracker to next stage');

    return tracker;
  } catch (error) {
    logger.error({ error, topicName, nextStageCourseId }, 'Error advancing to next stage');
    throw error;
  }
}

/**
 * Get all progressive courses for a topic
 * 
 * @param topicName - Topic name
 * @returns Array of courses in the progression
 */
export async function getProgressiveCourses(topicName: string): Promise<Array<unknown>> {
  try {
    const courses = await Course.find({
      'progressionMetadata.topicName': topicName,
    }).sort({ 'progressionMetadata.generationStage': 1 }).lean();

    return courses;
  } catch (error) {
    logger.error({ error, topicName }, 'Error getting progressive courses');
    throw error;
  }
}
