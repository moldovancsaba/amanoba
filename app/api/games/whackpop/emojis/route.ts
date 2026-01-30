/**
 * WHACKPOP Emojis API
 * 
 * What: GET endpoint that fetches all active emojis for WHACKPOP game
 * Why: Enables database-driven emoji management without hardcoding
 * 
 * Caching: 1 hour cache (emojis rarely change)
 */

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import { WhackPopEmoji } from '@/app/lib/models';
import logger from '@/app/lib/logger';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Response Emoji Interface
 * Why: Defines structure returned to client
 */
interface ResponseEmoji {
  id: string;
  emoji: string;
  name: string;
  category: string;
}

/**
 * GET /api/games/whackpop/emojis
 * 
 * Returns: Array of all active emojis
 * 
 * Cache: 1 hour (3600 seconds)
 */
export async function GET(_request: NextRequest) {
  try {
    // Why: Connect to database
    await connectDB();

    // Why: Fetch all active emojis
    const emojis = await WhackPopEmoji.find({
      isActive: true,
    })
      .select('emoji name category')
      .lean();

    // Why: Check if emojis exist
    if (emojis.length === 0) {
      logger.warn('No active emojis found in database');
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: 'NO_EMOJIS',
            message: 'No active emojis available',
          },
        },
        { status: 404 }
      );
    }

    // Why: Transform emojis for response
    const responseEmojis: ResponseEmoji[] = emojis.map(e => ({
      id: e._id.toString(),
      emoji: e.emoji,
      name: e.name,
      category: e.category,
    }));

    logger.info(
      { count: responseEmojis.length },
      'Emojis fetched successfully'
    );

    // Why: Return with cache headers (1 hour cache)
    // Emojis rarely change, so aggressive caching is safe
    return NextResponse.json(
      {
        ok: true,
        data: {
          emojis: responseEmojis,
          meta: {
            count: responseEmojis.length,
          },
        },
      },
      {
        headers: {
          // Why: Browser and CDN can cache for 1 hour
          'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        },
      }
    );

  } catch (error) {
    logger.error({ error }, 'Error fetching WhackPop emojis');
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'Failed to fetch emojis',
        },
      },
      { status: 500 }
    );
  }
}
