/**
 * Profile API
 * 
 * What: Get and update current user's profile and preferences
 * Why: Allows users to manage their own profile settings
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { Player } from '@/lib/models';
import { logger } from '@/lib/logger';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/profile
 * 
 * What: Get current user's profile
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const user = session.user as { id?: string; playerId?: string };
    const playerId = user.playerId || user.id;

    if (!playerId) {
      return NextResponse.json({ error: 'Player ID not found' }, { status: 400 });
    }

    const player = await Player.findById(playerId).lean();

    if (!player) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      player: {
        _id: player._id,
        displayName: player.displayName,
        email: player.email,
        emailPreferences: player.emailPreferences,
        timezone: player.timezone,
        locale: player.locale,
      },
    });
  } catch (error) {
    logger.error({ error }, 'Failed to fetch profile');
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

/**
 * PATCH /api/profile
 * 
 * What: Update current user's profile and preferences
 * 
 * Request Body:
 * - emailPreferences?: Email preferences object
 * - timezone?: Timezone string
 * - locale?: Locale string
 */
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const user = session.user as { id?: string; playerId?: string };
    const playerId = user.playerId || user.id;

    if (!playerId) {
      return NextResponse.json({ error: 'Player ID not found' }, { status: 400 });
    }

    const body = await request.json();
    const { emailPreferences, timezone, locale } = body;

    const player = await Player.findById(playerId);

    if (!player) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }

    // Update email preferences
    if (emailPreferences) {
      if (!player.emailPreferences) {
        player.emailPreferences = {
          receiveLessonEmails: true,
          emailFrequency: 'daily',
        };
      }

      if (emailPreferences.receiveLessonEmails !== undefined) {
        player.emailPreferences.receiveLessonEmails = emailPreferences.receiveLessonEmails;
      }

      if (emailPreferences.emailFrequency) {
        player.emailPreferences.emailFrequency = emailPreferences.emailFrequency;
      }

      if (emailPreferences.preferredEmailTime !== undefined) {
        player.emailPreferences.preferredEmailTime = emailPreferences.preferredEmailTime;
      }

      if (emailPreferences.timezone) {
        player.emailPreferences.timezone = emailPreferences.timezone;
      }
    }

    // Update timezone
    if (timezone) {
      player.timezone = timezone;
    }

    // Update locale
    if (locale) {
      player.locale = locale;
    }

    await player.save();

    logger.info({ playerId: player._id }, 'Profile updated successfully');

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      player: {
        _id: player._id,
        displayName: player.displayName,
        email: player.email,
        emailPreferences: player.emailPreferences,
        timezone: player.timezone,
        locale: player.locale,
      },
    });
  } catch (error) {
    logger.error({ error }, 'Failed to update profile');
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
