/**
 * Admin Translations API
 * 
 * What: REST endpoints for translation management
 * Why: Allows admins to manage translations in the database
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { Translation } from '@/lib/models';
import { logger } from '@/lib/logger';

/**
 * GET /api/admin/translations
 * 
 * What: List all translations with optional filtering
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale');
    const namespace = searchParams.get('namespace');
    const search = searchParams.get('search');

    const query: Record<string, unknown> = {};

    if (locale) {
      query.locale = locale;
    }

    if (namespace) {
      query.namespace = namespace;
    }

    if (search) {
      query.$or = [
        { key: { $regex: search, $options: 'i' } },
        { value: { $regex: search, $options: 'i' } },
      ];
    }

    const translations = await Translation.find(query)
      .sort({ locale: 1, namespace: 1, key: 1 })
      .limit(1000)
      .lean();

    return NextResponse.json({
      success: true,
      translations,
      count: translations.length,
    });
  } catch (error) {
    logger.error({ error }, 'Failed to fetch translations');
    return NextResponse.json({ error: 'Failed to fetch translations' }, { status: 500 });
  }
}

/**
 * POST /api/admin/translations
 * 
 * What: Create or update translations
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { translations } = body; // Array of { key, locale, value, namespace? }

    if (!Array.isArray(translations)) {
      return NextResponse.json({ error: 'Translations must be an array' }, { status: 400 });
    }

    const results = [];

    for (const translation of translations) {
      const { key, locale, value, namespace } = translation;

      if (!key || !locale || !value) {
        continue; // Skip invalid entries
      }

      const result = await Translation.findOneAndUpdate(
        { locale, key },
        {
          key,
          locale,
          value,
          namespace,
          metadata: {
            lastUpdated: new Date(),
            updatedBy: session.user.id,
          },
        },
        { upsert: true, new: true }
      );

      results.push(result);
    }

    return NextResponse.json({
      success: true,
      translations: results,
      count: results.length,
    });
  } catch (error) {
    logger.error({ error }, 'Failed to save translations');
    return NextResponse.json({ error: 'Failed to save translations' }, { status: 500 });
  }
}
