/**
 * QUIZZZ Question Answers API (MVP)
 * 
 * What: Returns correctIndex for given question IDs
 * Why: Game logic needs to check answers - this is an MVP solution
 * 
 * Security Note: This exposes correct answers but is acceptable for MVP
 * Future: Implement server-side answer validation or encryption
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import connectDB from '@/app/lib/mongodb';
import { QuizQuestion } from '@/app/lib/models';
import logger from '@/app/lib/logger';

/**
 * Query Parameters Schema
 */
const QuerySchema = z.object({
  ids: z.string().transform(str => str.split(',')).pipe(z.array(z.string()).min(1).max(50)),
});

/**
 * GET /api/games/quizzz/questions/answers?ids=id1,id2,id3
 * 
 * Returns: Array of correctIndex values for given question IDs
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const rawParams = {
      ids: searchParams.get('ids'),
    };

    const validation = QuerySchema.safeParse(rawParams);
    
    if (!validation.success) {
      return NextResponse.json(
        { 
          ok: false, 
          error: {
            code: 'INVALID_PARAMS',
            message: 'Invalid question IDs',
          }
        },
        { status: 400 }
      );
    }

    const { ids } = validation.data;

    await connectDB();

    // Why: Fetch only _id and correctIndex fields
    const questions = await QuizQuestion.find({
      _id: { $in: ids },
    })
      .select('_id correctIndex')
      .lean();

    // Why: Maintain order of input IDs
    const answersMap = new Map(questions.map(q => [q._id.toString(), q.correctIndex]));
    const answers = ids.map(id => ({
      id,
      correctIndex: answersMap.get(id) ?? 0, // Why: Default to 0 if not found
    }));

    logger.info({ count: answers.length }, 'Question answers fetched');

    return NextResponse.json({
      ok: true,
      data: {
        answers,
      },
    });

  } catch (error) {
    logger.error({ error }, 'Error fetching question answers');
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'Failed to fetch answers',
        },
      },
      { status: 500 }
    );
  }
}
