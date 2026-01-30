/**
 * Profile Photo Upload API
 *
 * What: Upload profile photo to IMGBB and save URL to current user's Player
 * Why: User-facing profile customization (see ROADMAP § User profile customization)
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { Player } from '@/lib/models';
import { uploadToImgBB } from '@/lib/utils/imgbb';
import { logger } from '@/lib/logger';
import { checkRateLimit, apiRateLimiter } from '@/lib/security';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB for profile photos

export async function POST(request: NextRequest) {
  const rateLimitResponse = await checkRateLimit(request, apiRateLimiter);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = session.user as { id?: string; playerId?: string };
    const playerId = user.playerId || user.id;
    if (!playerId) {
      return NextResponse.json({ error: 'Player ID not found' }, { status: 400 });
    }

    const apiKey = process.env.IMGBB_API_KEY;
    if (!apiKey) {
      logger.error({}, 'IMGBB_API_KEY not configured');
      return NextResponse.json(
        { error: 'Image upload service not configured' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const imageFile = formData.get('image') as File | null;
    if (!imageFile || typeof imageFile === 'string') {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(imageFile.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: JPEG, PNG, WebP, GIF' },
        { status: 400 }
      );
    }
    if (imageFile.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size: 5MB' },
        { status: 400 }
      );
    }

    await connectDB();

    const result = await uploadToImgBB(imageFile, apiKey);
    const imageUrl = result.data.url;

    const player = await Player.findByIdAndUpdate(
      playerId,
      { $set: { profilePicture: imageUrl } },
      { new: true }
    );

    if (!player) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }

    logger.info({ playerId, imageId: result.data.id }, 'Profile photo updated');

    return NextResponse.json({
      success: true,
      url: imageUrl,
      player: {
        _id: player._id,
        displayName: player.displayName,
        profilePicture: player.profilePicture,
      },
    });
  } catch (error) {
    logger.error({ error }, 'Profile photo upload failed');
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to upload photo' },
      { status: 500 }
    );
  }
}
