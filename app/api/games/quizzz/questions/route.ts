/**
 * QUIZZZ Questions API - Intelligent Selection
 * 
 * What: GET endpoint that fetches questions with smart rotation algorithm
 * Why: Ensures fair question distribution and tracks usage for difficulty analysis
 * 
 * Selection Algorithm (Priority Order):
 * 1. Filter by difficulty and isActive
 * 2. Sort by showCount ASC (least shown first)
 * 3. Sort by correctnessRate ASC (correctCount/showCount) among equal showCount
 * 4. Randomize within ties to avoid repetition bias
 * 5. Atomically increment showCount for selected questions
 * 
 * Security: Never returns correctIndex to prevent cheating
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import mongoose from 'mongoose';
import connectDB, { getConnectionState } from '@/app/lib/mongodb';
import { QuizQuestion, QuestionDifficulty, Course } from '@/app/lib/models';
import { buildQuizOptions } from '@/app/lib/quiz-questions';
import logger from '@/app/lib/logger';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Query Parameters Schema
 * Why: Type-safe validation of request parameters
 */
const QuerySchema = z.object({
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD', 'EXPERT']).optional(),
  count: z.string().transform(Number).pipe(z.number().min(1).max(50)),
  exclude: z.string().optional(), // comma-separated ids to exclude
  runId: z.string().optional(),   // unique per-game id for debugging/variance
  // Lesson-specific quiz mode
  lessonId: z.string().optional(), // Lesson ID for course-specific assessments
  courseId: z.string().optional(), // Course ID for course-specific assessments
  shownAnswerCount: z.string().transform(Number).pipe(z.number().min(2).max(4)).optional(),
});

/**
 * Response Question Interface
 * Why: Defines structure returned to client (without correctIndex for security)
 */
interface ResponseQuestion {
  id: string;
  question: string;
  options: string[];
  difficulty: string;
  category: string;
}

/**
 * GET /api/games/quizzz/questions
 * 
 * Query Params:
 * - difficulty: EASY | MEDIUM | HARD | EXPERT
 * - count: number (1-50, typically 5-20)
 * 
 * Returns: Array of questions WITHOUT correctIndex
 * 
 * Category Diversity:
 * - Selects proportionally from all available categories
 * - Ensures maximum variety in each game
 * - Example: 10 questions = ~1-2 per category
 */
export async function GET(request: NextRequest) {
  try {
    // Why: Extract and validate query parameters
    const searchParams = request.nextUrl.searchParams;
    const rawParams = {
      difficulty: searchParams.get('difficulty') || undefined,
      count: searchParams.get('count') || '10',
      exclude: searchParams.get('exclude') || undefined,
      runId: searchParams.get('runId') || undefined,
      lessonId: searchParams.get('lessonId') || undefined,
      courseId: searchParams.get('courseId') || undefined,
      shownAnswerCount: searchParams.get('shownAnswerCount') || undefined,
    };

    // Why: Validate parameters with Zod
    const validation = QuerySchema.safeParse(rawParams);
    
    if (!validation.success) {
      logger.warn({ error: validation.error }, 'Invalid query parameters for question selection');
      return NextResponse.json(
        { 
          ok: false, 
          error: {
            code: 'INVALID_PARAMS',
            message: 'Invalid query parameters',
            details: validation.error.format(),
          }
        },
        { status: 400 }
      );
    }

    const { difficulty, count, exclude, runId, lessonId, courseId, shownAnswerCount } = validation.data;

    // Parse exclude ids (robust handling of invalid IDs)
    const excludeIds = (exclude ? exclude.split(',') : [])
      .map(id => id?.trim())
      .filter(Boolean)
      .filter(id => {
        try {
          return mongoose.isValidObjectId(id);
        } catch {
          return false;
        }
      });

    // Why: Connect to database
    await connectDB();
    if (getConnectionState() !== 1) {
      return NextResponse.json(
        {
          ok: false,
          error: { code: 'DB_UNAVAILABLE', message: 'Database not connected' },
        },
        { status: 503 }
      );
    }

    // Why: Determine if this is a lesson-specific quiz or general QUIZZZ
    const isLessonMode = !!(lessonId || courseId);

    // Why: Fetch MORE questions than needed to ensure category diversity
    // Use aggregation to randomize within same showCount using $rand, and support excludeIds
    const matchStage: Record<string, unknown> = {
      isActive: true,
    };

    // Lesson-specific mode: filter by lesson/course
    if (isLessonMode) {
      matchStage.isCourseSpecific = true;
      if (lessonId) {
        matchStage.lessonId = lessonId;
      }
      if (courseId) {
        // If courseId is a valid ObjectId, use it directly
        if (mongoose.Types.ObjectId.isValid(courseId)) {
          matchStage.courseId = new mongoose.Types.ObjectId(courseId);
        } else {
          // If courseId is a string (like "AI_30_NAP"), look up the course first
          const course = await Course.findOne({ courseId: courseId }).lean();
          if (course && course._id) {
            matchStage.courseId = course._id;
          } else {
            logger.warn({ courseId }, 'Course not found for lesson quiz');
            return NextResponse.json(
              {
                ok: false,
                error: {
                  code: 'COURSE_NOT_FOUND',
                  message: 'Course not found',
                },
              },
              { status: 404 }
            );
          }
        }
      }
      // In lesson mode, difficulty is optional (can be any difficulty)
      if (difficulty) {
        matchStage.difficulty = difficulty as QuestionDifficulty;
      }
    } else {
      // General QUIZZZ mode: only general questions, difficulty required
      matchStage.isCourseSpecific = false;
      if (!difficulty) {
        return NextResponse.json(
          {
            ok: false,
            error: {
              code: 'MISSING_DIFFICULTY',
              message: 'Difficulty is required for general QUIZZZ mode',
            },
          },
          { status: 400 }
        );
      }
      matchStage.difficulty = difficulty as QuestionDifficulty;
    }

    if (excludeIds.length > 0) {
      try {
        matchStage._id = { $nin: excludeIds.map(id => new mongoose.Types.ObjectId(id)) };
      } catch (err) {
        logger.warn({ error: err, excludeIds }, 'Failed to parse exclude IDs, ignoring exclude filter');
      }
    }

    const questionsPool = await QuizQuestion.aggregate([
      { $match: matchStage },
      { 
        $addFields: { 
          __rand: { $rand: {} },
          correctnessRate: {
            $cond: [
              { $gt: ["$showCount", 0] },
              { $divide: ["$correctCount", "$showCount"] },
              0.5
            ]
          }
        } 
      },
      { $sort: { showCount: 1, correctnessRate: 1, __rand: 1 } },
      { $limit: count * 3 },
    ]);
    
    // Why: Group questions by category for diversity
    const questionsByCategory = questionsPool.reduce((acc, q) => {
      if (!acc[q.category]) acc[q.category] = [];
      acc[q.category].push(q);
      return acc;
    }, {} as Record<string, typeof questionsPool>);
    
    const categories = Object.keys(questionsByCategory);
    const questionsPerCategory = Math.ceil(count / categories.length);
    
    // Why: Select proportionally from each category for maximum diversity
    const selectedQuestions: typeof questionsPool = [];
    categories.forEach(category => {
      const categoryQuestions = questionsByCategory[category];
      const takeCount = Math.min(questionsPerCategory, categoryQuestions.length);
      selectedQuestions.push(...categoryQuestions.slice(0, takeCount));
    });
    
    // Why: If we need more questions, fill from remaining pool
    const questions = selectedQuestions.slice(0, count);

    // Why: Log pool exhaustion warning if we couldn't get requested count
    if (questions.length < count && excludeIds.length > 0) {
      logger.warn(
        { 
          difficulty, 
          requestedCount: count, 
          foundCount: questions.length,
          excludedCount: excludeIds.length,
          runId 
        }, 
        'Pool exhaustion detected - fewer questions available than requested after exclusions'
      );
    }

    // Why: Check if we have enough questions
    if (questions.length === 0) {
      logger.warn({ difficulty, count, lessonId, courseId, isLessonMode }, 'No questions found for criteria');
      const message = isLessonMode
        ? 'No questions available for this lesson. Questions may not be ready yet for this course.'
        : `No questions available for difficulty: ${difficulty ?? 'unknown'}`;
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: 'NO_QUESTIONS',
            message,
          },
        },
        { status: 404 }
      );
    }

    // Why: Atomically increment showCount for selected questions
    const questionIds = questions.map(q => q._id);
    await QuizQuestion.updateMany(
      { _id: { $in: questionIds } },
      { $inc: { showCount: 1 } }
    );

    // Why: Update lastShownAt timestamp
    const now = new Date();
    await QuizQuestion.updateMany(
      { _id: { $in: questionIds } },
      { $set: { 'metadata.lastShownAt': now } }
    );

    // Why: Ensure no duplicates (deduplicate by question text)
    const uniqueQuestions = questions.filter((q, index, self) => 
      index === self.findIndex((t) => t.question === q.question)
    );
    
    // Why: Log warning if duplicates were found
    if (uniqueQuestions.length < questions.length) {
      logger.warn(
        { 
          difficulty, 
          requested: count, 
          found: questions.length, 
          unique: uniqueQuestions.length 
        },
        'Duplicate questions detected and removed'
      );
    }
    
    // Why: Shuffle helper
    const shuffle = <T,>(arr: T[]): T[] => {
      const copy = [...arr];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    };
    
    // Why: Shuffle questions; each question shows configured options (default 3), shuffled
    const shuffled = shuffle(uniqueQuestions);
    const responseQuestions: ResponseQuestion[] = [];
    const effectiveShownAnswerCount = shownAnswerCount ?? 3;
    for (const q of shuffled) {
      const configured = buildQuizOptions(q, effectiveShownAnswerCount);
      if (!configured || configured.options.length !== effectiveShownAnswerCount) continue;
      responseQuestions.push({
        id: q._id.toString(),
        question: q.question,
        options: configured.options,
        difficulty: q.difficulty,
        category: q.category,
      });
    }

    logger.info(
      { 
        difficulty,
        runId,
        excludeCount: excludeIds.length,
        count: responseQuestions.length,
        requestedCount: count 
      }, 
      'Questions selected and showCount incremented'
    );

    return NextResponse.json(
      {
        ok: true,
        data: {
          questions: responseQuestions,
          meta: {
            difficulty,
            count: responseQuestions.length,
            requestedCount: count,
            shownAnswerCount: effectiveShownAnswerCount,
          },
        },
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
          'Pragma': 'no-cache',
        },
      }
    );

  } catch (error) {
    logger.error({ error }, 'Error fetching quiz questions');
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'Failed to fetch questions',
        },
      },
      { status: 500 }
    );
  }
}
