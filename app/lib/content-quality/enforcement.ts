/**
 * Content Quality Enforcement
 *
 * What: Middleware layer that enforces quality standards before content enters the database
 * Why: Prevents inconsistent, dummy, or low-quality content from polluting the platform
 *
 * This is the ROCK-SOLID foundation layer that ensures:
 * 1. All content meets minimum quality gates
 * 2. Agents receive clear, actionable feedback
 * 3. Database remains clean and consistent
 * 4. Progressive course strategy has reliable baseline
 */

import {
  validateLesson,
  validateQuizQuestion,
  validateQuizDistribution,
  type LessonValidatorInput,
  type QuizQuestionValidatorInput,
  type LessonValidationResult,
  type QuizQuestionValidationResult,
  type QuizDistributionValidationResult,
} from '@/lib/validators/content-standards';
import { logger } from '@/lib/logger';

// ============================================================================
// QUALITY ENFORCEMENT LEVELS
// ============================================================================

/**
 * Enforcement levels for different contexts
 */
export enum EnforcementLevel {
  /**
   * STRICT: Block all content that doesn't meet quality gates
   * Use for: Production imports, agent-generated content, new courses
   */
  STRICT = 'strict',

  /**
   * MODERATE: Block critical errors, allow warnings with logging
   * Use for: Course updates, content migrations, human-authored content
   */
  MODERATE = 'moderate',

  /**
   * PERMISSIVE: Log all issues but allow content (legacy compatibility)
   * Use for: Backward compatibility, emergency fixes, data migrations
   */
  PERMISSIVE = 'permissive',
}

/**
 * Quality gate thresholds
 */
export const QUALITY_THRESHOLDS = {
  lesson: {
    minQualityScore: 70, // Minimum acceptable quality score (0-100)
    blockingScore: 50, // Below this score, always block regardless of level
  },
  quiz: {
    minQualityScore: 75, // Higher standard for quizzes (user-facing assessments)
    blockingScore: 60, // Below this score, always block
    minQuestionsPerLesson: 7,
    minHigherOrderQuestions: 5, // application + critical-thinking
  },
} as const;

// ============================================================================
// ENFORCEMENT RESULT TYPES
// ============================================================================

export interface EnforcementResult<T> {
  /**
   * Whether content passes quality gates
   */
  allowed: boolean;

  /**
   * The original or sanitized content
   */
  content: T;

  /**
   * Validation result details
   */
  validation: LessonValidationResult | QuizQuestionValidationResult | QuizDistributionValidationResult;

  /**
   * Enforcement decision details
   */
  enforcement: {
    level: EnforcementLevel;
    action: 'allow' | 'block' | 'warn';
    reason: string;
    suggestions: string[];
  };

  /**
   * Metadata for logging and auditing
   */
  metadata: {
    timestamp: Date;
    enforcedBy: string; // System, agent, or user identifier
    context: string; // Import, update, create, etc.
  };
}

// ============================================================================
// LESSON ENFORCEMENT
// ============================================================================

/**
 * Enforce quality gates for lesson content
 */
export function enforceLessonQuality(
  lesson: Partial<LessonValidatorInput>,
  options: {
    level?: EnforcementLevel;
    context?: string;
    enforcedBy?: string;
  } = {}
): EnforcementResult<Partial<LessonValidatorInput>> {
  const level = options.level || EnforcementLevel.STRICT;
  const context = options.context || 'unknown';
  const enforcedBy = options.enforcedBy || 'system';

  // Run validation
  const validation = validateLesson(lesson);

  // Determine action based on validation result and enforcement level
  let action: 'allow' | 'block' | 'warn' = 'allow';
  let reason = '';
  const suggestions: string[] = [];

  // Critical blocking conditions (always block, regardless of level)
  if (validation.qualityScore < QUALITY_THRESHOLDS.lesson.blockingScore) {
    action = 'block';
    reason = `Quality score ${validation.qualityScore} is below blocking threshold ${QUALITY_THRESHOLDS.lesson.blockingScore}`;
  } else if (validation.errors.length > 0) {
    // Handle based on enforcement level
    switch (level) {
      case EnforcementLevel.STRICT:
        if (validation.qualityScore < QUALITY_THRESHOLDS.lesson.minQualityScore) {
          action = 'block';
          reason = `Quality score ${validation.qualityScore} below minimum ${QUALITY_THRESHOLDS.lesson.minQualityScore} (STRICT mode)`;
        } else if (validation.errors.length > 0) {
          action = 'block';
          reason = `${validation.errors.length} critical error(s) detected (STRICT mode)`;
        }
        break;

      case EnforcementLevel.MODERATE:
        // Only block if score is below threshold
        if (validation.qualityScore < QUALITY_THRESHOLDS.lesson.minQualityScore) {
          action = 'block';
          reason = `Quality score ${validation.qualityScore} below minimum (MODERATE mode)`;
        } else {
          action = 'warn';
          reason = `${validation.errors.length} error(s) logged, but allowed (MODERATE mode)`;
        }
        break;

      case EnforcementLevel.PERMISSIVE:
        action = 'warn';
        reason = `${validation.errors.length} error(s) and ${validation.warnings.length} warning(s) logged (PERMISSIVE mode)`;
        break;
    }
  } else if (validation.warnings.length > 0) {
    action = 'warn';
    reason = `${validation.warnings.length} warning(s) detected`;
  } else {
    action = 'allow';
    reason = `All quality gates passed (score: ${validation.qualityScore})`;
  }

  // Generate suggestions
  if (validation.errors.length > 0) {
    suggestions.push('Critical Errors:', ...validation.errors);
  }
  if (validation.warnings.length > 0) {
    suggestions.push('Warnings:', ...validation.warnings);
  }
  if (!validation.details.contentQuality.hasDeliverable) {
    suggestions.push('✓ Add a clear **Deliverable:** that names the artifact the learner will create');
  }
  if (!validation.details.contentQuality.hasExercises) {
    suggestions.push('✓ Include all three exercise types: Guided exercise, Independent exercise, Self-check');
  }
  if (validation.details.missingSections.length > 0) {
    suggestions.push(`✓ Add missing sections: ${validation.details.missingSections.slice(0, 5).join(', ')}`);
  }

  // Log enforcement decision
  logger.info({
    type: 'content_enforcement',
    contentType: 'lesson',
    lessonId: lesson.lessonId,
    action,
    level,
    qualityScore: validation.qualityScore,
    errors: validation.errors.length,
    warnings: validation.warnings.length,
    context,
    enforcedBy,
  });

  if (action === 'block') {
    logger.warn({
      type: 'content_blocked',
      contentType: 'lesson',
      lessonId: lesson.lessonId,
      reason,
      errors: validation.errors,
      context,
      enforcedBy,
    });
  }

  return {
    allowed: action !== 'block',
    content: lesson,
    validation,
    enforcement: {
      level,
      action,
      reason,
      suggestions,
    },
    metadata: {
      timestamp: new Date(),
      enforcedBy,
      context,
    },
  };
}

// ============================================================================
// QUIZ QUESTION ENFORCEMENT
// ============================================================================

/**
 * Enforce quality gates for quiz question
 */
export function enforceQuizQuestionQuality(
  question: Partial<QuizQuestionValidatorInput>,
  options: {
    level?: EnforcementLevel;
    context?: string;
    enforcedBy?: string;
    expectedLanguage?: string;
  } = {}
): EnforcementResult<Partial<QuizQuestionValidatorInput>> {
  const level = options.level || EnforcementLevel.STRICT;
  const context = options.context || 'unknown';
  const enforcedBy = options.enforcedBy || 'system';

  // Run validation
  const validation = validateQuizQuestion(question, options.expectedLanguage);

  // Determine action
  let action: 'allow' | 'block' | 'warn' = 'allow';
  let reason = '';
  const suggestions: string[] = [];

  // Critical blocking conditions
  if (validation.qualityScore < QUALITY_THRESHOLDS.quiz.blockingScore) {
    action = 'block';
    reason = `Quality score ${validation.qualityScore} below blocking threshold ${QUALITY_THRESHOLDS.quiz.blockingScore}`;
  } else if (!validation.details.standaloneComprehensible) {
    // ALWAYS block non-standalone questions (critical quality issue)
    action = 'block';
    reason = 'Question is NOT standalone - contains context-dependent phrases (CRITICAL)';
  } else if (validation.errors.length > 0) {
    // Handle based on enforcement level
    switch (level) {
      case EnforcementLevel.STRICT:
        if (validation.qualityScore < QUALITY_THRESHOLDS.quiz.minQualityScore) {
          action = 'block';
          reason = `Quality score ${validation.qualityScore} below minimum ${QUALITY_THRESHOLDS.quiz.minQualityScore} (STRICT mode)`;
        } else {
          action = 'block';
          reason = `${validation.errors.length} critical error(s) detected (STRICT mode)`;
        }
        break;

      case EnforcementLevel.MODERATE:
        if (validation.qualityScore < QUALITY_THRESHOLDS.quiz.minQualityScore) {
          action = 'block';
          reason = `Quality score ${validation.qualityScore} below minimum (MODERATE mode)`;
        } else {
          action = 'warn';
          reason = `${validation.errors.length} error(s) logged, but allowed (MODERATE mode)`;
        }
        break;

      case EnforcementLevel.PERMISSIVE:
        action = 'warn';
        reason = `${validation.errors.length} error(s) and ${validation.warnings.length} warning(s) logged (PERMISSIVE mode)`;
        break;
    }
  } else if (validation.warnings.length > 0) {
    action = 'warn';
    reason = `${validation.warnings.length} warning(s) detected`;
  } else {
    action = 'allow';
    reason = `All quality gates passed (score: ${validation.qualityScore})`;
  }

  // Generate suggestions
  if (validation.errors.length > 0) {
    suggestions.push('Critical Errors:', ...validation.errors);
  }
  if (validation.warnings.length > 0) {
    suggestions.push('Warnings:', ...validation.warnings);
  }
  if (!validation.details.standaloneComprehensible) {
    suggestions.push('✓ Remove context-dependent phrases: "in this lesson", "Day X", "as mentioned", etc.');
    suggestions.push('✓ Rewrite as a complete, standalone scenario that can be understood without the lesson');
  }
  if (!validation.details.naturalLanguage) {
    suggestions.push('✓ Use natural scenario language: "A builder says...", "You must choose...", etc.');
    suggestions.push('✓ Avoid administrative openings like "The goal is..." or "The main risk is..."');
  }
  if (!validation.details.plausibleDistractors) {
    suggestions.push('✓ Make wrong answers plausible - they should be reasonable but incorrect, not silly');
  }

  // Log enforcement decision
  logger.info({
    type: 'content_enforcement',
    contentType: 'quiz_question',
    questionId: question.uuid,
    action,
    level,
    qualityScore: validation.qualityScore,
    errors: validation.errors.length,
    warnings: validation.warnings.length,
    context,
    enforcedBy,
  });

  if (action === 'block') {
    logger.warn({
      type: 'content_blocked',
      contentType: 'quiz_question',
      questionId: question.uuid,
      questionPreview: question.question?.substring(0, 100),
      reason,
      errors: validation.errors,
      context,
      enforcedBy,
    });
  }

  return {
    allowed: action !== 'block',
    content: question,
    validation,
    enforcement: {
      level,
      action,
      reason,
      suggestions,
    },
    metadata: {
      timestamp: new Date(),
      enforcedBy,
      context,
    },
  };
}

// ============================================================================
// BATCH ENFORCEMENT (For Course Imports)
// ============================================================================

export interface BatchEnforcementResult {
  /**
   * Whether the entire batch passes quality gates
   */
  allowed: boolean;

  /**
   * Per-lesson enforcement results
   */
  lessons: Array<EnforcementResult<Partial<LessonValidatorInput>> & { lessonId: string }>;

  /**
   * Per-question enforcement results (grouped by lesson)
   */
  questions: Record<string, Array<EnforcementResult<Partial<QuizQuestionValidatorInput>>>>;

  /**
   * Course-level quiz distribution validation
   */
  quizDistribution: Record<string, QuizDistributionValidationResult>;

  /**
   * Summary statistics
   */
  summary: {
    totalLessons: number;
    passedLessons: number;
    blockedLessons: number;
    totalQuestions: number;
    passedQuestions: number;
    blockedQuestions: number;
    overallQualityScore: number; // Weighted average
  };

  /**
   * Recommendations for improving the batch
   */
  recommendations: string[];
}

/**
 * Enforce quality gates for a complete course import
 */
export function enforceCourseQuality(
  lessons: Array<Partial<LessonValidatorInput> & { quizQuestions?: Partial<QuizQuestionValidatorInput>[] }>,
  options: {
    level?: EnforcementLevel;
    context?: string;
    enforcedBy?: string;
    expectedLanguage?: string;
  } = {}
): BatchEnforcementResult {
  const level = options.level || EnforcementLevel.STRICT;
  const lessonResults: Array<EnforcementResult<Partial<LessonValidatorInput>> & { lessonId: string }> = [];
  const questionResults: Record<string, Array<EnforcementResult<Partial<QuizQuestionValidatorInput>>>> = {};
  const quizDistributionResults: Record<string, QuizDistributionValidationResult> = {};

  let totalQualityScore = 0;
  let totalLessons = 0;
  let passedLessons = 0;
  let blockedLessons = 0;
  let totalQuestions = 0;
  let passedQuestions = 0;
  let blockedQuestions = 0;

  // Enforce lesson quality
  for (const lesson of lessons) {
    const lessonResult = enforceLessonQuality(lesson, { level, ...options });
    lessonResults.push({
      ...lessonResult,
      lessonId: lesson.lessonId || 'unknown',
    });

    totalLessons++;
    totalQualityScore += lessonResult.validation.qualityScore;

    if (lessonResult.allowed) {
      passedLessons++;
    } else {
      blockedLessons++;
    }

    // Enforce quiz question quality for this lesson
    if (lesson.quizQuestions && lesson.quizQuestions.length > 0) {
      const lessonId = lesson.lessonId || 'unknown';
      questionResults[lessonId] = [];

      for (const question of lesson.quizQuestions) {
        const questionResult = enforceQuizQuestionQuality(question, {
          level,
          ...options,
          expectedLanguage: options.expectedLanguage || lesson.language,
        });

        questionResults[lessonId].push(questionResult);

        totalQuestions++;
        totalQualityScore += questionResult.validation.qualityScore;

        if (questionResult.allowed) {
          passedQuestions++;
        } else {
          blockedQuestions++;
        }
      }

      // Validate quiz distribution for this lesson
      const distributionResult = validateQuizDistribution(lesson.quizQuestions);
      quizDistributionResults[lessonId] = distributionResult;
    }
  }

  // Calculate overall quality score
  const overallQualityScore =
    totalLessons + totalQuestions > 0 ? totalQualityScore / (totalLessons + totalQuestions) : 0;

  // Determine if batch is allowed
  let allowed = true;
  const recommendations: string[] = [];

  // Strict mode: Block if any content is blocked
  if (level === EnforcementLevel.STRICT) {
    if (blockedLessons > 0 || blockedQuestions > 0) {
      allowed = false;
      recommendations.push(
        `❌ STRICT mode: ${blockedLessons} lesson(s) and ${blockedQuestions} question(s) blocked`
      );
    }
  }

  // Check quiz distribution quality gates
  for (const [lessonId, distribution] of Object.entries(quizDistributionResults)) {
    if (!distribution.isValid) {
      if (level === EnforcementLevel.STRICT) {
        allowed = false;
      }
      recommendations.push(`❌ Lesson ${lessonId}: ${distribution.errors.join(', ')}`);
    }
  }

  // Add general recommendations
  if (overallQualityScore < 80) {
    recommendations.push(`⚠️ Overall quality score ${overallQualityScore.toFixed(1)} is below excellent (80+)`);
  }

  if (blockedLessons > 0) {
    recommendations.push(`⚠️ ${blockedLessons}/${totalLessons} lessons blocked - review and improve`);
  }

  if (blockedQuestions > 0) {
    recommendations.push(`⚠️ ${blockedQuestions}/${totalQuestions} questions blocked - review and improve`);
  }

  // Log batch enforcement
  logger.info({
    type: 'batch_enforcement',
    level,
    totalLessons,
    passedLessons,
    blockedLessons,
    totalQuestions,
    passedQuestions,
    blockedQuestions,
    overallQualityScore,
    allowed,
    context: options.context,
    enforcedBy: options.enforcedBy,
  });

  return {
    allowed,
    lessons: lessonResults,
    questions: questionResults,
    quizDistribution: quizDistributionResults,
    summary: {
      totalLessons,
      passedLessons,
      blockedLessons,
      totalQuestions,
      passedQuestions,
      blockedQuestions,
      overallQualityScore,
    },
    recommendations,
  };
}

// ============================================================================
// EXPORT
// ============================================================================

export default {
  enforceLessonQuality,
  enforceQuizQuestionQuality,
  enforceCourseQuality,
  EnforcementLevel,
  QUALITY_THRESHOLDS,
};
