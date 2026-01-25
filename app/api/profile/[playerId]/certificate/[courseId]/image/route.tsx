/**
 * Certificate Image Generation API
 * 
 * What: Generates PNG certificate images using next/og ImageResponse
 * Why: V2.0 feature - allows users to download/share certificate images
 * 
 * Endpoint: GET /api/profile/[playerId]/certificate/[courseId]/image
 * 
 * Returns: PNG image (1200x627 for sharing, or 1200x1697 for A4 print)
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
 * 
 * Query Parameters:
 * - variant (optional): 'share_1200x627' (default) or 'print_a4'
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
      ? { width: 1200, height: 1697 } // A4 ratio
      : { width: 1200, height: 627 }; // LinkedIn/social sharing ratio

    logger.info({ playerId, courseId, variant }, 'Generating certificate image');

    await connectDB();

    // Fetch player and course
    const [player, course] = await Promise.all([
      Player.findById(playerId).lean(),
      Course.findOne({ courseId }).lean(),
    ]);

    if (!player || !course) {
      return new Response('Player or course not found', { status: 404 });
    }

    // Fetch progress and final exam
    const progress = await CourseProgress.findOne({
      playerId: new mongoose.Types.ObjectId(playerId),
      courseId: course._id,
    }).lean();

    const finalExamAttempt = await FinalExamAttempt.findOne({
      playerId: new mongoose.Types.ObjectId(playerId),
      courseId: course._id,
      status: 'GRADED',
    })
      .sort({ submittedAtISO: -1 })
      .lean();

    // Check eligibility
    const enrolled = !!progress;
    const allLessonsCompleted = enrolled && progress && 
      (progress.completedDays?.length || 0) >= (course.durationDays || 0);
    const assessmentResults = progress?.assessmentResults || new Map();
    const allQuizzesPassed = course.durationDays > 0 && 
      Array.from({ length: course.durationDays }, (_, i) => (i + 1).toString())
        .every((dayStr) => assessmentResults.has(dayStr));
    const finalExamPassed = !!finalExamAttempt?.passed;
    const certificateEligible = enrolled && allLessonsCompleted && allQuizzesPassed && finalExamPassed;

    if (!certificateEligible) {
      return new Response('Certificate not eligible', { status: 403 });
    }

    const playerName = player.displayName || 'Unknown';
    const courseTitle = course.title || course.courseId;
    const finalExamScore = finalExamAttempt?.scorePercentInteger || 0;
    const issuedDate = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    // Generate certificate image
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
            padding: '80px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
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

          {/* Main content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              width: '100%',
            }}
          >
            {/* Title */}
            <div
              style={{
                fontSize: variant === 'print_a4' ? '72px' : '56px',
                fontWeight: 'bold',
                background: 'linear-gradient(90deg, #FFD700 0%, #FFA500 100%)',
                backgroundClip: 'text',
                color: 'transparent',
                marginBottom: '40px',
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

            {/* Course title */}
            <div
              style={{
                fontSize: variant === 'print_a4' ? '48px' : '36px',
                fontWeight: 'bold',
                color: '#FFFFFF',
                marginBottom: '40px',
              }}
            >
              {courseTitle}
            </div>

            {/* Awarded to */}
            <div
              style={{
                fontSize: variant === 'print_a4' ? '32px' : '24px',
                color: '#CCCCCC',
                marginBottom: '20px',
              }}
            >
              This is to certify that
            </div>

            {/* Player name */}
            <div
              style={{
                fontSize: variant === 'print_a4' ? '48px' : '40px',
                fontWeight: 'bold',
                color: '#FFD700',
                marginBottom: '20px',
              }}
            >
              {playerName}
            </div>

            {/* Completion text */}
            <div
              style={{
                fontSize: variant === 'print_a4' ? '32px' : '24px',
                color: '#CCCCCC',
                marginBottom: '60px',
              }}
            >
              has successfully completed the course
            </div>

            {/* Score */}
            {finalExamScore > 0 && (
              <div
                style={{
                  fontSize: variant === 'print_a4' ? '36px' : '28px',
                  color: '#FFD700',
                  marginBottom: '60px',
                  fontWeight: 'bold',
                }}
              >
                Final Exam Score: {finalExamScore}%
              </div>
            )}

            {/* Footer */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
                marginTop: 'auto',
                paddingTop: '60px',
                borderTop: '2px solid #FFD700',
                fontSize: '18px',
                color: '#999999',
              }}
            >
              <div>Issued: {issuedDate}</div>
              <div>Amanoba Learning Platform</div>
            </div>
          </div>
        </div>
      ),
      {
        ...dimensions,
      }
    );
  } catch (error) {
    logger.error({ error, playerId, courseId }, 'Failed to generate certificate image');
    return new Response('Failed to generate certificate image', { status: 500 });
  }
}
