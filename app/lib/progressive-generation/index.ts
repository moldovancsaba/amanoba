/**
 * Progressive Course Generation
 * 
 * Central export for progressive course generation system.
 */

export {
  calculateCourseMetrics,
  updateTrackerMetrics,
  updateAllStagesMetrics,
  refreshAllMetrics,
  findNewlyMetTriggers,
  type CourseMetrics,
} from './metrics-aggregator';

export {
  evaluateTriggers,
  evaluateAllTrackers,
  markTriggerMet,
  getDefaultTriggerThresholds,
  getProgressionStatus,
  type TriggerEvaluation,
  type TriggerThresholds,
} from './trigger-evaluator';

export {
  linkCourseToProgression,
  getProgressionPath,
  isProgressionCourse,
  createProgressionTracker,
  advanceToNextStage,
  getProgressiveCourses,
  type ProgressionPath,
} from './helpers';
