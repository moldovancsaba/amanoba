/**
 * Admin Image Upload API
 * 
 * What: Server-side endpoint to upload images to IMGBB
 * Why: Keeps API key secure on server, handles image uploads for course thumbnails
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { uploadToImgBB, fileToBase64 } from '@/lib/utils/imgbb';
import { logger } from '@/lib/logger';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/admin/upload-image
 * 
 * What: Upload image to IMGBB CDN
 * Body: FormData with 'image' field (File)
 * Returns: { success: boolean, url: string, display_url: string }
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // TODO: Add admin role check when role system is implemented

    const apiKey = process.env.IMGBB_API_KEY;
    if (!apiKey) {
      logger.error({}, 'IMGBB_API_KEY not configured');
      return NextResponse.json(
        { error: 'Image upload service not configured' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const imageFile = formData.get('image') as File;

    if (!imageFile) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(imageFile.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: JPEG, PNG, WebP, GIF' },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (imageFile.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size: 10MB' },
        { status: 400 }
      );
    }

    // Upload to IMGBB
    const result = await uploadToImgBB(imageFile, apiKey);

    return NextResponse.json({
      success: true,
      url: result.data.url,
      display_url: result.data.display_url,
      thumb_url: result.data.thumb.url,
      medium_url: result.data.medium.url,
      delete_url: result.data.delete_url,
    });
  } catch (error) {
    logger.error({ error }, 'Failed to upload image');
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to upload image' },
      { status: 500 }
    );
  }
}
