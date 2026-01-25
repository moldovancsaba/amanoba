/**
 * Certificate Image Generation API
 * 
 * What: Generates PNG certificate images using next/og ImageResponse
 * Why: Allows users to download and share certificate images
 * 
 * Endpoint: GET /api/profile/[playerId]/certificate/[courseId]/image
 * 
 * Query Parameters:
 * - variant: 'share_1200x627' (default) or 'print_a4'
 * 
 * Returns: PNG image
 */

import { NextRequest } from 'next/server';
import { ImageResponse } from 'next/og';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';
import {
  Player,
  Course,
  CourseProgress,
  FinalExamAttempt,
} from '@/lib/models';
import { logger } from '@/lib/logger';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/profile/[playerId]/certificate/[courseId]/image
 * 
 * Generates a PNG certificate image.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ playerId: string; courseId: string }> }
) {
  try {
    const { playerId, courseId } = await params;

    if (!playerId || !courseId) {
      return new Response('Player ID and Course ID are required', { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const variant = searchParams.get('variant') || 'share_1200x627';

    // Dimensions based on variant
    const dimensions = variant === 'print_a4' 
      ? { width: 1200, height: 1697 } // A4 ratio (1:1.414)
      : { width: 1200, height: 627 }; // LinkedIn/social ratio (1.91:1)

    logger.info({ playerId, courseId, variant }, 'Generating certificate image');

    await connectDB();

    // Fetch data
    const [player, course, progress] = await Promise.all([
      Player.findById(playerId).lean(),
      Course.findOne({ courseId }).lean(),
      CourseProgress.findOne({
        playerId: new mongoose.Types.ObjectId(playerId),
        courseId: new mongoose.Types.ObjectId(courseId),
      }).lean(),
    ]);

    if (!player || !course) {
      return new Response('Player or course not found', { status: 404 });
    }

    // Get final exam score
    const finalExamAttempt = await FinalExamAttempt.findOne({
      playerId: new mongoose.Types.ObjectId(playerId),
      courseId: course._id,
      status: 'GRADED',
    })
      .sort({ submittedAtISO: -1 })
      .lean();

    const finalExamScore = finalExamAttempt?.scorePercentInteger || null;
    const playerName = player.displayName || 'Unknown';
    const courseTitle = course.title || course.courseId;
    const issuedDate = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    // Generate certificate ID
    const certificateId = `${playerId.slice(-8)}-${courseId.slice(-8)}`.toUpperCase();

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
            position: 'relative',
            padding: '80px',
          }}
        >
          {/* Decorative border */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              border: '8px solid #FFD700',
              borderRadius: '16px',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '8px',
              left: '8px',
              right: '8px',
              bottom: '8px',
              border: '4px solid rgba(255, 215, 0, 0.3)',
              borderRadius: '12px',
            }}
          />

          {/* Main content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              textAlign: 'center',
            }}
          >
            {/* Certificate Title */}
            <div
              style={{
                fontSize: variant === 'print_a4' ? 72 : 56,
                fontWeight: 'bold',
                background: 'linear-gradient(90deg, #FFD700 0%, #FFA500 100%)',
                backgroundClip: 'text',
                color: 'transparent',
                marginBottom: '40px',
                lineHeight: 1.2,
              }}
            >
              Certificate of Completion
            </div>

            {/* Decorative line */}
            <div
              style={{
                width: '200px',
                height: '4px',
                background: 'linear-gradient(90deg, transparent 0%, #FFD700 50%, transparent 100%)',
                marginBottom: '60px',
              }}
            />

            {/* Course Title */}
            <div
              style={{
                fontSize: variant === 'print_a4' ? 48 : 36,
                fontWeight: 'bold',
                color: '#FFFFFF',
                marginBottom: '40px',
                lineHeight: 1.3,
                maxWidth: '90%',
              }}
            >
              {courseTitle}
            </div>

            {/* Awarded to */}
            <div
              style={{
                fontSize: variant === 'print_a4' ? 32 : 24,
                color: '#CCCCCC',
                marginBottom: '20px',
              }}
            >
              This is to certify that
            </div>

            {/* Player Name */}
            <div
              style={{
                fontSize: variant === 'print_a4' ? 56 : 42,
                fontWeight: 'bold',
                color: '#FFD700',
                marginBottom: '20px',
                lineHeight: 1.2,
              }}
            >
              {playerName}
            </div>

            {/* Completion text */}
            <div
              style={{
                fontSize: variant === 'print_a4' ? 32 : 24,
                color: '#CCCCCC',
                marginBottom: '60px',
              }}
            >
              has successfully completed the course
            </div>

            {/* Score (if available) */}
            {finalExamScore !== null && (
              <div
                style={{
                  fontSize: variant === 'print_a4' ? 40 : 32,
                  color: '#FFD700',
                  marginBottom: '40px',
                  fontWeight: 'bold',
                }}
              >
                Final Exam Score: {finalExamScore}%
              </div>
            )}

            {/* Footer */}
            <div
              style={{
                position: 'absolute',
                bottom: '60px',
                left: 0,
                right: 0,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0 80px',
                fontSize: variant === 'print_a4' ? 20 : 16,
                color: '#999999',
              }}
            >
              <div>ID: {certificateId}</div>
              <div>{issuedDate}</div>
            </div>
          </div>
        </div>
      ),
      {
        ...dimensions,
      }
    );
  } catch (error) {
    logger.error({ error }, 'Failed to generate certificate image');
    return new Response('Failed to generate certificate image', { status: 500 });
  }
}
