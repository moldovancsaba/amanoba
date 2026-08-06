/**
 * Certificate Image Generation + ImgBB Upload API
 * 
 * What: Generates certificate PNG and uploads to ImgBB for permanent hosting
 * Why: Provides reliable, shareable URLs for certificate images
 * 
 * Endpoint: POST /api/profile/[playerId]/certificate/[courseId]/generate-imgbb
 * 
 * Body: { variant: 'share_1200x627' | 'print_a4' }
 * 
 * Returns: { success: true, url: string, deleteUrl?: string }
 */

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import { CourseProgress } from '@/app/lib/models';
import { uploadBufferToImgBB } from '@/app/lib/imgbb/upload';

export const dynamic = 'force-dynamic';

interface GenerateBody {
  variant?: 'share_1200x627' | 'print_a4';
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ playerId: string; courseId: string }> }
) {
  try {
    const { playerId, courseId } = await params;

    if (!playerId || !courseId) {
      return NextResponse.json(
        { success: false, error: 'Player ID and Course ID are required' },
        { status: 400 }
      );
    }

    const body = (await request.json()) as GenerateBody;
    const variant = body.variant || 'share_1200x627';
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'en';

    // Check if already uploaded
    await connectDB();
    const progress = await CourseProgress.findOne({
      playerId,
      courseId,
    }).lean();

    if (progress?.certificateImages) {
      const existing = variant === 'print_a4'
        ? progress.certificateImages.print
        : progress.certificateImages.share;

      if (existing?.url) {
        return NextResponse.json({
          success: true,
          url: existing.url,
          deleteUrl: existing.deleteUrl,
          cached: true,
        });
      }
    }

    // Generate image by calling the image generation endpoint
    const baseUrl = request.url.includes('localhost')
      ? 'http://localhost:3000'
      : `https://${request.headers.get('host') || 'www.amanoba.com'}`;

    const imageUrl = `${baseUrl}/api/profile/${playerId}/certificate/${courseId}/image?variant=${variant}&locale=${encodeURIComponent(locale)}`;
    
    const imageResponse = await fetch(imageUrl);
    
    if (!imageResponse.ok) {
      return NextResponse.json(
        { success: false, error: 'Failed to generate certificate image' },
        { status: 500 }
      );
    }

    const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());

    // Upload to ImgBB
    const uploadResult = await uploadBufferToImgBB(
      imageBuffer,
      `certificate-${playerId}-${courseId}-${variant}`
    );

    if (!uploadResult.success || !uploadResult.url) {
      return NextResponse.json(
        { success: false, error: uploadResult.error || 'Failed to upload to ImgBB' },
        { status: 500 }
      );
    }

    // Store ImgBB URL in database
    const updateField = variant === 'print_a4'
      ? 'certificateImages.print'
      : 'certificateImages.share';

    await CourseProgress.findOneAndUpdate(
      { playerId, courseId },
      {
        $set: {
          [updateField]: {
            url: uploadResult.url,
            deleteUrl: uploadResult.deleteUrl,
            uploadedAt: new Date(),
          },
        },
      },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      url: uploadResult.url,
      deleteUrl: uploadResult.deleteUrl,
      viewerUrl: uploadResult.viewerUrl,
    });
  } catch (error) {
    console.error('Failed to generate and upload certificate:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
