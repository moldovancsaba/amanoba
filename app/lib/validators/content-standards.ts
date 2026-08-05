/**
 * Content Standards Validator
 *
 * What: Rock-solid validation layer for lesson and quiz content
 * Why: Eliminates inconsistency, dummy content, and quality issues
 *
 * Based on:
 * - Amanoba Course Content Standard v1.0
 * - Trinity Architecture quality gates
 * - Progressive course generation strategy
 *
 * Usage:
 * import { validateLesson, validateQuizQuestion } from '@/lib/validators/content-standards';
 * const result = validateLesson(lessonData);
 * if (!result.isValid) {
 *   console.error(result.errors);
 * }
 */

import { z } from 'zod';
import { QuestionDifficulty, QuestionType } from '@/lib/models/quiz-question';

// ============================================================================
// FORBIDDEN PATTERNS (Eliminate Dummy Content)
// ============================================================================

/**
 * Forbidden phrases that indicate dummy, placeholder, or context-dependent content
 */
export const FORBIDDEN_QUIZ_PHRASES = [
  /\bin this lesson\b/i,
  /\btoday'?s?\b/i,
  /\bday \d+\b/i,
  /\bas mentioned (above|earlier|before|previously)\b/i,
  /\bin the course\b/i,
  /\bthis course\b/i,
  /\bmodule \d+\b/i,
  /\byesterday\b/i,
  /\btomorrow\b/i,
  /\bnext (lesson|day|module)\b/i,
  /\bprevious (lesson|day|module)\b/i,
  /\bwe (learned|discussed|covered)\b/i,
  /\byou (learned|saw)\b/i,
  /\[TODO\]/i,
  /\[PLACEHOLDER\]/i,
  /\[TBD\]/i,
  /\[INSERT\]/i,
  /lorem ipsum/i,
  /test question/i,
  /example question/i,
  /dummy (content|text|data)/i,
];

/**
 * Administrative phrases that should be avoided in quiz questions
 * (Natural language scenarios are preferred)
 */
export const ADMINISTRATIVE_PHRASES = [
  /^(The|A|An) (goal|objective|purpose|aim) (is|was)/i,
  /^(The|A|An) (main|primary|key) (risk|challenge|problem) (is|was)/i,
  /^(The|A|An) (best|correct|right) (answer|option|choice) (is|was)/i,
];

/**
 * Patterns that suggest low-quality or trick questions
 */
export const LOW_QUALITY_PATTERNS = [
  /all of the above/i,
  /none of the above/i,
  /both a and b/i,
  /neither a nor b/i,
  /^(True|False)$/,
  /\b(always|never|impossible|definitely)\b/i, // Absolutist language
];

/**
 * Check if text contains forbidden patterns
 */
export function containsForbiddenPatterns(text: string): {
  hasForbidden: boolean;
  matches: string[];
} {
  const matches: string[] = [];

  for (const pattern of FORBIDDEN_QUIZ_PHRASES) {
    if (pattern.test(text)) {
      matches.push(pattern.source);
    }
  }

  for (const pattern of ADMINISTRATIVE_PHRASES) {
    if (pattern.test(text)) {
      matches.push(`Administrative phrase: ${pattern.source}`);
    }
  }

  for (const pattern of LOW_QUALITY_PATTERNS) {
    if (pattern.test(text)) {
      matches.push(`Low-quality pattern: ${pattern.source}`);
    }
  }

  return {
    hasForbidden: matches.length > 0,
    matches,
  };
}

/**
 * Detect English text in non-English content
 * Simple heuristic: Check for common English words
 */
export function detectEnglishLeakage(
  text: string,
  expectedLanguage: string
): {
  hasLeakage: boolean;
  suspiciousWords: string[];
} {
  // Only check for non-English languages
  if (expectedLanguage === 'en') {
    return { hasLeakage: false, suspiciousWords: [] };
  }

  // Common English words that shouldn't appear in non-English content
  const englishIndicators = [
    /\b(the|and|or|but|is|are|was|were|have|has|had|do|does|did)\b/g,
    /\b(what|when|where|why|who|how|which)\b/gi,
    /\b(will|would|should|could|can|may|might|must)\b/gi,
    /\b(this|that|these|those|here|there)\b/gi,
  ];

  const suspiciousWords: string[] = [];
  for (const pattern of englishIndicators) {
    const matches = text.match(pattern);
    if (matches && matches.length > 3) {
      // Threshold: more than 3 occurrences suggests leakage
      suspiciousWords.push(...matches);
    }
  }

  return {
    hasLeakage: suspiciousWords.length > 0,
    suspiciousWords: Array.from(new Set(suspiciousWords)),
  };
}

// ============================================================================
// LESSON VALIDATION
// ============================================================================

/**
 * 5W1H Section Requirements
 * Based on Amanoba Course Content Standard v1.0
 */
export const REQUIRED_LESSON_SECTIONS = {
  header: [
    'One-liner',
    'Time',
    'Deliverable',
  ],
  learningGoal: [
    'Learning goal',
    'Success criteria',
    'Output you will produce',
  ],
  who: ['Who', 'Primary persona'],
  what: ['What', 'What it is', 'What it is not', '2-minute theory', 'Key terms'],
  where: ['Where', 'Applies in', 'Does not apply in', 'Touchpoints'],
  when: ['When', 'Use it when', 'Frequency', 'Late signals'],
  why: ['Why it matters', 'Practical benefits', 'Risks of ignoring', 'Expectations'],
  how: ['How', 'Step-by-step method', 'Do and don\'t', 'Common mistakes'],
  exercises: ['Guided exercise', 'Independent exercise', 'Self-check'],
  sources: ['Bibliography', 'Read more'],
} as const;

/**
 * Check if lesson content contains all required 5W1H sections
 */
export function validateLessonStructure(content: string): {
  isValid: boolean;
  missingSections: string[];
  presentSections: string[];
} {
  const lowerContent = content.toLowerCase();
  const missingSections: string[] = [];
  const presentSections: string[] = [];

  // Flatten all required sections
  const allSections = Object.values(REQUIRED_LESSON_SECTIONS).flat();

  for (const section of allSections) {
    const sectionLower = section.toLowerCase();
    // Check for section as heading (## or ###) or bold (**Section:**)
    const hasHeading =
      lowerContent.includes(`## ${sectionLower}`) ||
      lowerContent.includes(`### ${sectionLower}`) ||
      lowerContent.includes(`**${sectionLower}:`);

    if (hasHeading) {
      presentSections.push(section);
    } else {
      missingSections.push(section);
    }
  }

  return {
    isValid: missingSections.length === 0,
    missingSections,
    presentSections,
  };
}

/**
 * Lesson Validator Schema
 */
export const LessonValidatorSchema = z.object({
  lessonId: z.string().min(1, 'Lesson ID is required'),
  dayNumber: z.number().int().min(1, 'Day number must be at least 1'),
  language: z.string().min(2, 'Language code is required (e.g., en, hu)'),
  title: z.string().min(10, 'Title must be at least 10 characters').max(200, 'Title too long'),
  content: z.string().min(500, 'Content must be at least 500 characters (comprehensive lesson)'),
  emailSubject: z.string().min(10, 'Email subject is required').max(200, 'Email subject too long'),
  emailBody: z.string().min(200, 'Email body must be at least 200 characters'),
  pointsReward: z.number().int().min(0, 'Points reward must be non-negative'),
  xpReward: z.number().int().min(0, 'XP reward must be non-negative'),
  isActive: z.boolean().default(true),
  displayOrder: z.number().int().min(0).default(0),
  metadata: z
    .object({
      estimatedMinutes: z.number().int().min(1).max(180).optional(),
      difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
      tags: z.array(z.string()).optional(),
      resources: z
        .array(
          z.object({
            title: z.string().min(1),
            url: z.string().url(),
            type: z.enum(['article', 'video', 'document', 'external']),
          })
        )
        .optional(),
    })
    .optional(),
});

export type LessonValidatorInput = z.infer<typeof LessonValidatorSchema>;

/**
 * Comprehensive Lesson Validation Result
 */
export interface LessonValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  qualityScore: number; // 0-100
  details: {
    schemaValid: boolean;
    structureValid: boolean;
    contentQuality: {
      hasDeliverable: boolean;
      hasSuccessCriteria: boolean;
      hasExercises: boolean;
      hasBibliography: boolean;
      wordCount: number;
      estimatedMinutes: number;
    };
    forbiddenPatterns: string[];
    missingSections: string[];
  };
}

/**
 * Validate Lesson (Comprehensive)
 */
export function validateLesson(lesson: Partial<LessonValidatorInput>): LessonValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  let qualityScore = 100;

  // 1. Schema Validation
  const schemaResult = LessonValidatorSchema.safeParse(lesson);
  if (!schemaResult.success) {
    errors.push(...schemaResult.error.errors.map((e) => `${e.path?.join('.') || 'root'}: ${e.message}`));
    qualityScore -= 30;
  }

  // 2. Structure Validation (5W1H)
  const structureResult = validateLessonStructure(lesson.content || '');
  if (!structureResult.isValid) {
    errors.push(`Missing required sections: ${structureResult.missingSections.join(', ')}`);
    qualityScore -= 20;
  }

  // 3. Content Quality Checks
  const content = lesson.content || '';
  const wordCount = content.split(/\s+/).length;
  const estimatedMinutes = Math.ceil(wordCount / 200); // Average reading speed

  const hasDeliverable = /\*\*Deliverable:\*\*/i.test(content);
  const hasSuccessCriteria = /success criteria/i.test(content) && /\[.\]/g.test(content); // Has checkboxes
  const hasExercises =
    /guided exercise/i.test(content) &&
    /independent exercise/i.test(content) &&
    /self-check/i.test(content);
  const hasBibliography = /bibliography/i.test(content) || /sources used/i.test(content);

  if (!hasDeliverable) {
    errors.push('Missing **Deliverable:** (every lesson must produce an artifact)');
    qualityScore -= 15;
  }

  if (!hasSuccessCriteria) {
    warnings.push('Missing success criteria checkboxes [ ]');
    qualityScore -= 5;
  }

  if (!hasExercises) {
    errors.push('Missing all three exercises: Guided, Independent, Self-check');
    qualityScore -= 15;
  }

  if (!hasBibliography) {
    warnings.push('Missing Bibliography section');
    qualityScore -= 5;
  }

  // 4. Word Count / Time Estimate
  if (estimatedMinutes < 15) {
    warnings.push(`Content may be too short (${estimatedMinutes} min estimated, target 20-30 min)`);
    qualityScore -= 5;
  } else if (estimatedMinutes > 40) {
    warnings.push(`Content may be too long (${estimatedMinutes} min estimated, target 20-30 min)`);
    qualityScore -= 3;
  }

  // 5. Forbidden Patterns
  const forbiddenCheck = containsForbiddenPatterns(content);
  if (forbiddenCheck.hasForbidden) {
    warnings.push(`Content contains potentially problematic patterns: ${forbiddenCheck.matches.join(', ')}`);
    qualityScore -= 5;
  }

  // 6. Language Integrity
  if (lesson.language && lesson.language !== 'en') {
    const leakageCheck = detectEnglishLeakage(content, lesson.language);
    if (leakageCheck.hasLeakage) {
      errors.push(
        `English leakage detected in ${lesson.language} content: ${leakageCheck.suspiciousWords.slice(0, 10).join(', ')}`
      );
      qualityScore -= 20;
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    qualityScore: Math.max(0, qualityScore),
    details: {
      schemaValid: schemaResult.success,
      structureValid: structureResult.isValid,
      contentQuality: {
        hasDeliverable,
        hasSuccessCriteria,
        hasExercises,
        hasBibliography,
        wordCount,
        estimatedMinutes,
      },
      forbiddenPatterns: forbiddenCheck.matches,
      missingSections: structureResult.missingSections,
    },
  };
}

// ============================================================================
// QUIZ QUESTION VALIDATION
// ============================================================================

/**
 * Quiz Question Validator Schema
 */
export const QuizQuestionValidatorSchema = z.object({
  uuid: z.string().uuid().optional(),
  question: z.string().min(20, 'Question must be at least 20 characters').max(1000, 'Question too long'),
  explanation: z.string().min(10, 'Explanation is required').max(2000, 'Explanation too long').optional(),
  // Legacy format
  options: z.array(z.string().min(1)).min(4, 'At least 4 options required for legacy format').optional(),
  correctIndex: z.number().int().min(0).optional(),
  // New format
  correctAnswer: z.string().min(1, 'Correct answer is required').optional(),
  wrongAnswers: z.array(z.string().min(1)).min(2, 'At least 2 wrong answers required').optional(),
  // Required fields
  difficulty: z.nativeEnum(QuestionDifficulty),
  category: z.string().min(1, 'Category is required'),
  questionType: z.nativeEnum(QuestionType),
  hashtags: z.array(z.string()).optional(),
  isActive: z.boolean().default(true),
  lessonId: z.string().optional(),
  isCourseSpecific: z.boolean(),
}).refine(
  (data) => {
    // Must have either legacy format (options + correctIndex) or new format (correctAnswer + wrongAnswers)
    const hasLegacy = data.options && data.options.length >= 4 && typeof data.correctIndex === 'number';
    const hasNew = data.correctAnswer && data.wrongAnswers && data.wrongAnswers.length >= 2;
    return hasLegacy || hasNew;
  },
  {
    message: 'Must have either (options + correctIndex) or (correctAnswer + wrongAnswers)',
  }
);

export type QuizQuestionValidatorInput = z.infer<typeof QuizQuestionValidatorSchema>;

/**
 * Comprehensive Quiz Question Validation Result
 */
export interface QuizQuestionValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  qualityScore: number; // 0-100
  details: {
    schemaValid: boolean;
    standaloneComprehensible: boolean;
    naturalLanguage: boolean;
    plausibleDistractors: boolean;
    forbiddenPatterns: string[];
    questionType: QuestionType | null;
    difficulty: QuestionDifficulty | null;
  };
}

/**
 * Check if quiz question distractors are plausible (not silly)
 */
function validateDistractors(
  correctAnswer: string,
  wrongAnswers: string[]
): {
  isPlausible: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  // Check length similarity (plausible distractors should be similar length to correct answer)
  const correctLength = correctAnswer.length;
  for (const wrong of wrongAnswers) {
    const lengthRatio = wrong.length / correctLength;
    if (lengthRatio < 0.3 || lengthRatio > 3) {
      issues.push(`Distractor length mismatch: "${wrong.substring(0, 50)}..." (too different from correct answer)`);
    }
  }

  // Check for obviously silly answers
  const sillyPatterns = [
    /definitely not/i,
    /obviously wrong/i,
    /makes no sense/i,
    /random answer/i,
    /😂|😄|😜|lol|haha/i,
  ];

  for (const wrong of wrongAnswers) {
    for (const pattern of sillyPatterns) {
      if (pattern.test(wrong)) {
        issues.push(`Silly distractor detected: "${wrong.substring(0, 50)}..."`);
      }
    }
  }

  return {
    isPlausible: issues.length === 0,
    issues,
  };
}

/**
 * Check if question uses natural scenario-based language
 */
function validateNaturalLanguage(question: string): {
  isNatural: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  // Administrative opening patterns (not preferred)
  for (const pattern of ADMINISTRATIVE_PHRASES) {
    if (pattern.test(question)) {
      issues.push(`Administrative language detected. Prefer natural scenario: "${question.substring(0, 100)}..."`);
    }
  }

  // Check for scenario elements (preferred)
  const hasScenarioElements =
    /\b(builder|founder|team|user|customer|client|freelancer|designer|developer)\b/i.test(question) &&
    /\b(says|writes|needs|wants|must|should|decides|chooses)\b/i.test(question);

  if (!hasScenarioElements) {
    issues.push('Consider adding a concrete scenario (e.g., "A builder says..." or "You must choose...")');
  }

  return {
    isNatural: issues.length === 0,
    issues,
  };
}

/**
 * Validate Quiz Question (Comprehensive)
 */
export function validateQuizQuestion(
  question: Partial<QuizQuestionValidatorInput>,
  expectedLanguage?: string
): QuizQuestionValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  let qualityScore = 100;

  // 1. Schema Validation
  const schemaResult = QuizQuestionValidatorSchema.safeParse(question);
  if (!schemaResult.success) {
    errors.push(...schemaResult.error.errors.map((e) => `${e.path?.join('.') || 'root'}: ${e.message}`));
    qualityScore -= 30;
  }

  // 2. Standalone Comprehensibility (Forbidden Patterns)
  const questionText = question.question || '';
  const forbiddenCheck = containsForbiddenPatterns(questionText);
  if (forbiddenCheck.hasForbidden) {
    errors.push(`Question is NOT standalone - contains context-dependent phrases: ${forbiddenCheck.matches.join(', ')}`);
    qualityScore -= 40; // Critical error
  }

  // 3. Natural Language Check
  const naturalCheck = validateNaturalLanguage(questionText);
  if (!naturalCheck.isNatural) {
    warnings.push(...naturalCheck.issues);
    qualityScore -= 10;
  }

  // 4. Distractor Quality
  let plausibleDistractors = true;
  if (question.correctAnswer && question.wrongAnswers) {
    const distractorCheck = validateDistractors(question.correctAnswer, question.wrongAnswers);
    if (!distractorCheck.isPlausible) {
      warnings.push(...distractorCheck.issues);
      qualityScore -= 15;
      plausibleDistractors = false;
    }
  } else if (question.options && typeof question.correctIndex === 'number') {
    const correct = question.options[question.correctIndex];
    const wrongOptions = question.options.filter((_, i) => i !== question.correctIndex);
    const distractorCheck = validateDistractors(correct, wrongOptions);
    if (!distractorCheck.isPlausible) {
      warnings.push(...distractorCheck.issues);
      qualityScore -= 15;
      plausibleDistractors = false;
    }
  }

  // 5. Question Type Validation
  if (question.questionType === QuestionType.RECALL) {
    errors.push('RECALL question type is FORBIDDEN - must be application, critical-thinking, or higher-order');
    qualityScore -= 50; // Critical error
  }

  // 6. Language Integrity
  if (expectedLanguage && expectedLanguage !== 'en') {
    const leakageCheck = detectEnglishLeakage(questionText, expectedLanguage);
    if (leakageCheck.hasLeakage) {
      errors.push(
        `English leakage detected in ${expectedLanguage} question: ${leakageCheck.suspiciousWords.slice(0, 5).join(', ')}`
      );
      qualityScore -= 30;
    }

    // Check options/answers too
    const allAnswers = question.options || [
      question.correctAnswer || '',
      ...(question.wrongAnswers || []),
    ];
    for (const answer of allAnswers) {
      const answerLeakageCheck = detectEnglishLeakage(answer, expectedLanguage);
      if (answerLeakageCheck.hasLeakage) {
        errors.push(
          `English leakage in answer option: "${answer.substring(0, 50)}..." (${answerLeakageCheck.suspiciousWords.slice(0, 3).join(', ')})`
        );
        qualityScore -= 10;
      }
    }
  }

  // 7. Explanation Quality
  if (question.explanation) {
    if (question.explanation.length < 30) {
      warnings.push('Explanation is too brief (aim for 30+ characters with clear reasoning)');
      qualityScore -= 5;
    }
  } else {
    warnings.push('Explanation is recommended for better learning experience');
    qualityScore -= 3;
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    qualityScore: Math.max(0, qualityScore),
    details: {
      schemaValid: schemaResult.success,
      standaloneComprehensible: !forbiddenCheck.hasForbidden,
      naturalLanguage: naturalCheck.isNatural,
      plausibleDistractors,
      forbiddenPatterns: forbiddenCheck.matches,
      questionType: question.questionType || null,
      difficulty: question.difficulty || null,
    },
  };
}

// ============================================================================
// COURSE-LEVEL VALIDATION
// ============================================================================

/**
 * Validate Quiz Distribution (Quality Gates)
 *
 * Based on Amanoba standards:
 * - Minimum 7 valid questions per lesson
 * - Minimum 5 application/critical-thinking questions
 * - Zero recall questions
 */
export interface QuizDistributionValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  details: {
    totalQuestions: number;
    validQuestions: number;
    applicationQuestions: number;
    criticalThinkingQuestions: number;
    recallQuestions: number;
    questionTypeDistribution: Record<string, number>;
    difficultyDistribution: Record<string, number>;
  };
}

export function validateQuizDistribution(
  questions: Partial<QuizQuestionValidatorInput>[]
): QuizDistributionValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const totalQuestions = questions.length;
  const validQuestions = questions.filter((q) => validateQuizQuestion(q).isValid).length;

  const applicationQuestions = questions.filter(
    (q) => q.questionType === QuestionType.APPLICATION
  ).length;
  const criticalThinkingQuestions = questions.filter(
    (q) => q.questionType === QuestionType.CRITICAL_THINKING
  ).length;
  const recallQuestions = questions.filter((q) => q.questionType === QuestionType.RECALL).length;

  // Quality Gate 1: Minimum 7 valid questions
  if (validQuestions < 7) {
    errors.push(`Insufficient valid questions: ${validQuestions}/7 minimum required`);
  }

  // Quality Gate 2: Minimum 5 application/critical-thinking
  const higherOrderQuestions = applicationQuestions + criticalThinkingQuestions;
  if (higherOrderQuestions < 5) {
    errors.push(
      `Insufficient higher-order questions: ${higherOrderQuestions}/5 minimum required (application + critical-thinking)`
    );
  }

  // Quality Gate 3: Zero recall questions
  if (recallQuestions > 0) {
    errors.push(`FORBIDDEN: ${recallQuestions} recall question(s) detected - recall questions are not allowed`);
  }

  // Distribution analysis
  const questionTypeDistribution: Record<string, number> = {};
  const difficultyDistribution: Record<string, number> = {};

  for (const q of questions) {
    if (q.questionType) {
      questionTypeDistribution[q.questionType] = (questionTypeDistribution[q.questionType] || 0) + 1;
    }
    if (q.difficulty) {
      difficultyDistribution[q.difficulty] = (difficultyDistribution[q.difficulty] || 0) + 1;
    }
  }

  // Balance warnings
  if (applicationQuestions < 3) {
    warnings.push('Consider adding more application-type questions (target: 3+)');
  }
  if (criticalThinkingQuestions < 2) {
    warnings.push('Consider adding more critical-thinking questions (target: 2+)');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    details: {
      totalQuestions,
      validQuestions,
      applicationQuestions,
      criticalThinkingQuestions,
      recallQuestions,
      questionTypeDistribution,
      difficultyDistribution,
    },
  };
}

// ============================================================================
// EXPORT
// ============================================================================

export default {
  validateLesson,
  validateQuizQuestion,
  validateQuizDistribution,
  validateLessonStructure,
  containsForbiddenPatterns,
  detectEnglishLeakage,
  FORBIDDEN_QUIZ_PHRASES,
  ADMINISTRATIVE_PHRASES,
  LOW_QUALITY_PATTERNS,
  REQUIRED_LESSON_SECTIONS,
};
