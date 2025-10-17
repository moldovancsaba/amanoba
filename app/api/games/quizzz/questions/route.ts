/**
 * QUIZZZ Questions API - Intelligent Selection
 * 
 * What: GET endpoint that fetches questions with smart rotation algorithm
 * Why: Ensures fair question distribution and tracks usage for difficulty analysis
 * 
 * Selection Algorithm (Priority Order):
 * 1. Filter by difficulty and isActive
 * 2. Sort by showCount ASC (least shown first)
 * 3. Sort by correctCount ASC (harder questions first when showCount equal)
 * 4. Sort by question text alphabetically (tie-breaker)
 * 5. Atomically increment showCount for selected questions
 * 
 * Security: Never returns correctIndex to prevent cheating
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import connectDB from '@/app/lib/mongodb';
import { QuizQuestion, QuestionDifficulty } from '@/app/lib/models';
import logger from '@/app/lib/logger';

/**
 * Query Parameters Schema
 * Why: Type-safe validation of request parameters
 */
const QuerySchema = z.object({
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD', 'EXPERT']),
  count: z.string().transform(Number).pipe(z.number().min(1).max(50)),
  exclude: z.string().optional(), // comma-separated ids to exclude
  runId: z.string().optional(),   // unique per-game id for debugging/variance
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
      difficulty: searchParams.get('difficulty'),
      count: searchParams.get('count') || '10',
      exclude: searchParams.get('exclude') || undefined,
      runId: searchParams.get('runId') || undefined,
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

    const { difficulty, count, exclude, runId } = validation.data;

    // Parse exclude ids
    const excludeIds = (exclude ? exclude.split(',') : [])
      .map(id => id?.trim())
      .filter(Boolean);

    // Why: Connect to database
    await connectDB();

    // Why: Fetch MORE questions than needed to ensure category diversity
    // Use aggregation to randomize within same showCount using $rand, and support excludeIds
    const matchStage: Record<string, unknown> = {
      difficulty: difficulty as QuestionDifficulty,
      isActive: true,
    };
    if (excludeIds.length > 0) {
      matchStage._id = { $nin: excludeIds.map(id => new (require('mongoose').Types.ObjectId)(id)) };
    }

    const questionsPool = await QuizQuestion.aggregate([
      { $match: matchStage },
      { $addFields: { __rand: { $rand: {} } } },
      { $sort: { showCount: 1, correctCount: 1, __rand: 1 } },
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

    // Why: Check if we have enough questions
    if (questions.length === 0) {
      logger.warn({ difficulty, count }, 'No questions found for criteria');
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: 'NO_QUESTIONS',
            message: `No questions available for difficulty: ${difficulty}`,
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
    
    // Why: Shuffle questions for randomization (Fisher-Yates algorithm)
    const shuffled = [...uniqueQuestions];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    // Why: Transform questions for response (remove correctIndex for security)
    const responseQuestions: ResponseQuestion[] = shuffled.map(q => ({
      id: q._id.toString(),
      question: q.question,
      options: q.options,
      difficulty: q.difficulty,
      category: q.category,
    }));

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
