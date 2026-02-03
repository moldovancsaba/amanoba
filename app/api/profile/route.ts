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
import { checkRateLimit, apiRateLimiter } from '@/lib/security';
import { locales, type Locale } from '@/app/lib/i18n/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/profile
 * 
 * What: Get current user's profile
 */
export async function GET(request: NextRequest) {
  // Rate limiting: 100 requests per 15 minutes per IP
  const rateLimitResponse = await checkRateLimit(request, apiRateLimiter);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

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
        profilePicture: player.profilePicture,
        profileVisibility: player.profileVisibility ?? 'private',
        profileSectionVisibility: player.profileSectionVisibility ?? {
          about: 'private',
          courses: 'private',
          achievements: 'private',
          certificates: 'private',
          stats: 'private',
        },
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
  // Rate limiting: 100 requests per 15 minutes per IP
  const rateLimitResponse = await checkRateLimit(request, apiRateLimiter);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

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
    const { emailPreferences, timezone, locale, displayName, profilePicture, profileVisibility, profileSectionVisibility } = body;

    const player = await Player.findById(playerId);

    if (!player) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }

    // Update display name (nickname)
    if (displayName !== undefined) {
      const trimmed = typeof displayName === 'string' ? displayName.trim() : '';
      if (trimmed.length === 0) {
        return NextResponse.json({ error: 'Display name cannot be empty' }, { status: 400 });
      }
      if (trimmed.length > 50) {
        return NextResponse.json({ error: 'Display name cannot exceed 50 characters' }, { status: 400 });
      }
      player.displayName = trimmed;
    }

    if (profilePicture !== undefined) {
      player.profilePicture = typeof profilePicture === 'string' ? profilePicture.trim() || undefined : undefined;
    }

    if (profileVisibility !== undefined) {
      if (profileVisibility !== 'public' && profileVisibility !== 'private') {
        return NextResponse.json({ error: 'profileVisibility must be "public" or "private"' }, { status: 400 });
      }
      player.profileVisibility = profileVisibility;
    }

    if (profileSectionVisibility !== undefined && typeof profileSectionVisibility === 'object') {
      const sectionKeys = ['about', 'courses', 'achievements', 'certificates', 'stats'] as const;
      if (!player.profileSectionVisibility) {
        player.profileSectionVisibility = { about: 'private', courses: 'private', achievements: 'private', certificates: 'private', stats: 'private' };
      }
      for (const key of sectionKeys) {
        const val = profileSectionVisibility[key];
        if (val === 'public' || val === 'private') {
          (player.profileSectionVisibility as Record<string, string>)[key] = val;
        }
      }
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

    // Update locale (only allow supported locales)
    if (locale !== undefined) {
      const normalized = String(locale).toLowerCase().trim();
      player.locale = locales.includes(normalized as Locale) ? normalized : player.locale;
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
        profilePicture: player.profilePicture,
        profileVisibility: player.profileVisibility ?? 'private',
        profileSectionVisibility: player.profileSectionVisibility ?? {
          about: 'private',
          courses: 'private',
          achievements: 'private',
          certificates: 'private',
          stats: 'private',
        },
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
