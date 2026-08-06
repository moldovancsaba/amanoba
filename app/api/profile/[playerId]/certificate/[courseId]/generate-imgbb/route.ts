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
import { CourseProgress, Course } from '@/app/lib/models';
import { uploadToImgBB } from '@/lib/utils/imgbb';

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
    
    // Look up Course by courseId string to get its MongoDB _id
    const course = await Course.findOne({ courseId }).lean();
    if (!course) {
      return NextResponse.json(
        { success: false, error: 'Course not found' },
        { status: 404 }
      );
    }
    
    // Query CourseProgress using the course's _id
    const progress = await CourseProgress.findOne({
      playerId,
      courseId: course._id,
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

    const apiKey = process.env.IMGBB_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'IMGBB_API_KEY not configured' },
        { status: 500 }
      );
    }

    const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
    const base64Image = imageBuffer.toString('base64');

    // Upload to ImgBB using existing utility
    const uploadResult = await uploadToImgBB(base64Image, apiKey);

    if (!uploadResult.success) {
      return NextResponse.json(
        { success: false, error: 'Failed to upload to ImgBB' },
        { status: 500 }
      );
    }

    // Store ImgBB URL in database (using course._id)
    const updateField = variant === 'print_a4'
      ? 'certificateImages.print'
      : 'certificateImages.share';

    await CourseProgress.findOneAndUpdate(
      { playerId, courseId: course._id },
      {
        $set: {
          [updateField]: {
            url: uploadResult.data.url,
            deleteUrl: uploadResult.data.delete_url,
            uploadedAt: new Date(),
          },
        },
      },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      url: uploadResult.data.url,
      deleteUrl: uploadResult.data.delete_url,
      viewerUrl: uploadResult.data.url_viewer,
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
