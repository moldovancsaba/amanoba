/**
 * Progressive Course Builder
 * 
 * What: Automatically builds next-stage courses by reusing and extending previous stage content
 * Why: Enables scalable, data-driven course progression with consistent quality
 */

import { Course, CourseGenerationTracker } from '@/lib/models';
import { logger } from '@/lib/logger';
import type { ILesson, IQuizQuestion } from '@/lib/models/course';

export interface ProgressiveCourseConfig {
  sourceStage: number;
  targetStage: number;
  topicName: string;
  sourceCourseName: string;
  targetCourseName: string;
  sourceCourseId: string;
  targetCourseId: string;
  reuseContent: {
    questions: boolean;
    concepts: boolean;
    prerequisites: boolean;
  };
  additions: {
    newLessons: number;
    newQuestions: number;
    difficultyScaling: {
      easy: number;
      medium: number;
      hard: number;
      expert: number;
    };
  };
}

export interface QuestionReusageStrategy {
  distribution: 'early' | 'mixed' | 'spaced';  // How to distribute reused questions
  maxReusePerLesson: number;  // Max reused questions per lesson
  difficultyFilter?: string[];  // Filter by difficulty (e.g., ['EASY', 'MEDIUM'])
}

export interface CourseOutline {
  courseName: string;
  courseId: string;
  description: string;
  lessons: Array<{
    title: string;
    dayNumber: number;
    content: string;
    objectives: string[];
    reuseQuestions: number;  // Number of questions to reuse
    newQuestions: number;  // Number of new questions needed
  }>;
}

/**
 * Extract all quiz questions from a source course
 */
export async function extractQuestionPool(sourceCourseId: string): Promise<IQuizQuestion[]> {
  const course = await Course.findOne({ courseId: sourceCourseId }).lean();
  
  if (!course || !course.lessons) {
    logger.warn({ sourceCourseId }, 'Source course not found or has no lessons');
    return [];
  }

  const questionPool: IQuizQuestion[] = [];
  
  course.lessons.forEach((lesson: ILesson) => {
    if (lesson.quizQuestions && lesson.quizQuestions.length > 0) {
      lesson.quizQuestions.forEach((question: IQuizQuestion) => {
        questionPool.push({
          ...question,
          // @ts-ignore - Add metadata for tracking
          _sourceLesson: lesson.title,
          _sourceCourse: sourceCourseId,
          _isReused: true,
        });
      });
    }
  });

  logger.info({ 
    sourceCourseId, 
    questionCount: questionPool.length 
  }, 'Extracted question pool from source course');

  return questionPool;
}

/**
 * Filter questions by difficulty for targeted reuse
 */
export function filterQuestionsByDifficulty(
  questions: IQuizQuestion[], 
  difficulties: string[]
): IQuizQuestion[] {
  return questions.filter(q => difficulties.includes(q.difficulty));
}

/**
 * Distribute reused questions across lessons
 */
export function distributeReuseQuestions(
  questionPool: IQuizQuestion[],
  lessons: CourseOutline['lessons'],
  strategy: QuestionReusageStrategy
): Map<number, IQuizQuestion[]> {
  const distribution = new Map<number, IQuizQuestion[]>();
  let questionIndex = 0;

  lessons.forEach((lesson, idx) => {
    const questionsForThisLesson: IQuizQuestion[] = [];
    const maxReuse = Math.min(lesson.reuseQuestions, strategy.maxReusePerLesson);

    for (let i = 0; i < maxReuse && questionIndex < questionPool.length; i++) {
      questionsForThisLesson.push(questionPool[questionIndex]);
      questionIndex++;
    }

    distribution.set(lesson.dayNumber, questionsForThisLesson);
  });

  return distribution;
}

/**
 * Calculate difficulty distribution for new questions
 */
export function calculateDifficultyDistribution(
  targetStage: number,
  totalNewQuestions: number
): Record<string, number> {
  // Stage-based difficulty mix
  const difficultyMix: Record<number, Record<string, number>> = {
    1: { EASY: 0.70, MEDIUM: 0.30, HARD: 0, EXPERT: 0 },
    2: { EASY: 0.30, MEDIUM: 0.50, HARD: 0.20, EXPERT: 0 },
    3: { EASY: 0, MEDIUM: 0.20, HARD: 0.60, EXPERT: 0.20 },
    4: { EASY: 0, MEDIUM: 0, HARD: 0.40, EXPERT: 0.60 },
  };

  const mix = difficultyMix[targetStage] || difficultyMix[2];
  
  return {
    EASY: Math.round(totalNewQuestions * mix.EASY),
    MEDIUM: Math.round(totalNewQuestions * mix.MEDIUM),
    HARD: Math.round(totalNewQuestions * mix.HARD),
    EXPERT: Math.round(totalNewQuestions * mix.EXPERT),
  };
}

/**
 * Generate course outline for next stage
 */
export async function generateProgression(config: ProgressiveCourseConfig): Promise<CourseOutline> {
  logger.info({ config }, 'Generating progressive course outline');

  // Extract source course data
  const sourceCourse = await Course.findOne({ courseId: config.sourceCourseId }).lean();
  
  if (!sourceCourse) {
    throw new Error(`Source course ${config.sourceCourseId} not found`);
  }

  // Calculate content distribution
  const totalLessons = config.additions.newLessons;
  const totalReuseQuestions = config.reuseContent.questions 
    ? sourceCourse.lessons?.reduce((sum: number, l: ILesson) => sum + (l.quizQuestions?.length || 0), 0) || 0
    : 0;
  const totalNewQuestions = config.additions.newQuestions;

  // Create lesson outline
  const lessons: CourseOutline['lessons'] = [];
  const questionsPerLesson = Math.ceil((totalReuseQuestions + totalNewQuestions) / totalLessons);
  
  // Early lessons have more reused questions (review)
  // Later lessons have more new questions (advancement)
  for (let i = 0; i < totalLessons; i++) {
    const progressionRatio = i / totalLessons;
    const reuseRatio = 1 - progressionRatio;  // Start high, decrease
    
    const reuseCount = Math.round((totalReuseQuestions / totalLessons) * reuseRatio * 1.5);
    const newCount = questionsPerLesson - reuseCount;

    lessons.push({
      title: `Lesson ${i + 1} - ${config.targetCourseName} (Day ${i + 1})`,
      dayNumber: i + 1,
      content: '',  // To be filled by content generator
      objectives: [],
      reuseQuestions: Math.max(0, reuseCount),
      newQuestions: Math.max(5, newCount),  // Minimum 5 new questions per lesson
    });
  }

  const outline: CourseOutline = {
    courseName: config.targetCourseName,
    courseId: config.targetCourseId,
    description: `Building on ${config.sourceCourseName}, this ${config.targetStage}-stage course deepens your understanding with practical applications and advanced concepts.`,
    lessons,
  };

  logger.info({ 
    outline: {
      courseId: outline.courseId,
      lessonCount: outline.lessons.length,
      totalReuseQuestions,
      totalNewQuestions,
    }
  }, 'Generated progressive course outline');

  return outline;
}

/**
 * Validate progressive course quality
 */
export async function validateProgressiveCourse(
  courseId: string,
  requiredQuestionPool: number
): Promise<{ valid: boolean; errors: string[] }> {
  const errors: string[] = [];
  
  const course = await Course.findOne({ courseId }).lean();
  
  if (!course) {
    errors.push('Course not found');
    return { valid: false, errors };
  }

  // Check question pool size
  const totalQuestions = course.lessons?.reduce((sum: number, l: ILesson) => 
    sum + (l.quizQuestions?.length || 0), 0) || 0;
  
  if (totalQuestions < requiredQuestionPool) {
    errors.push(`Question pool too small: ${totalQuestions} < ${requiredQuestionPool} required`);
  }

  // Check lesson count
  if (!course.lessons || course.lessons.length < 10) {
    errors.push(`Too few lessons: ${course.lessons?.length || 0} < 10 required`);
  }

  // Check prerequisite chain
  if (!course.prerequisiteCourseIds || course.prerequisiteCourseIds.length === 0) {
    errors.push('No prerequisite courses configured');
  }

  // Check certification enabled
  if (!course.certification?.enabled) {
    errors.push('Certification not enabled');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Link courses in progression chain
 */
export async function linkProgressionChain(
  sourceCourseId: string,
  targetCourseId: string
): Promise<void> {
  // Update target course to require source as prerequisite
  await Course.findOneAndUpdate(
    { courseId: targetCourseId },
    {
      $addToSet: { prerequisiteCourseIds: sourceCourseId },
      $set: {
        'progressionMetadata.parentCourseId': sourceCourseId,
        'progressionMetadata.stage': 2,  // Could be dynamic based on source stage
      },
    }
  );

  logger.info({ 
    sourceCourseId, 
    targetCourseId 
  }, 'Linked courses in progression chain');
}

/**
 * Main builder function
 */
export class ProgressiveCourseBuilder {
  async buildNextStage(config: ProgressiveCourseConfig): Promise<{
    outline: CourseOutline;
    reuseStrategy: {
      questionPool: IQuizQuestion[];
      distribution: Map<number, IQuizQuestion[]>;
    };
    difficultyTarget: Record<string, number>;
  }> {
    logger.info({ config }, 'Starting progressive course build');

    // Step 1: Generate outline
    const outline = await generateProgression(config);

    // Step 2: Extract reusable content
    const questionPool = await extractQuestionPool(config.sourceCourseId);

    // Step 3: Distribute reused questions
    const reuseStrategy: QuestionReusageStrategy = {
      distribution: 'spaced',
      maxReusePerLesson: 10,
    };

    const distribution = distributeReuseQuestions(
      questionPool,
      outline.lessons,
      reuseStrategy
    );

    // Step 4: Calculate new question difficulty targets
    const difficultyTarget = calculateDifficultyDistribution(
      config.targetStage,
      config.additions.newQuestions
    );

    logger.info({ 
      outline: outline.courseId,
      reuseQuestions: questionPool.length,
      newQuestionsNeeded: config.additions.newQuestions,
      difficultyTarget,
    }, 'Progressive course build complete');

    return {
      outline,
      reuseStrategy: {
        questionPool,
        distribution,
      },
      difficultyTarget,
    };
  }
}
