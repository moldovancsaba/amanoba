/**
 * Certificate Status API
 * 
 * What: Returns certificate eligibility status for a player and course
 * Why: Provides simple certificate status check using existing data models
 * 
 * Endpoint: GET /api/profile/[playerId]/certificate-status?courseId=[courseId]
 * 
 * Returns:
 * {
 *   success: true,
 *   data: {
 *     enrolled: boolean,
 *     allLessonsCompleted: boolean,
 *     allQuizzesPassed: boolean,
 *     finalExamPassed: boolean,
 *     finalExamScore: number | null,
 *     certificateEligible: boolean,
 *     courseTitle: string,
 *     playerName: string
 *   }
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
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
 * GET /api/profile/[playerId]/certificate-status
 * 
 * Fetches certificate eligibility status for a player and course.
 * 
 * Query Parameters:
 * - courseId (required): The course ID to check certificate status for
 * 
 * Returns certificate eligibility based on:
 * 1. Enrollment (CourseProgress exists)
 * 2. All lessons completed (completedDays.length >= course.durationDays)
 * 3. All quizzes passed (assessmentResults has entries for all days)
 * 4. Final exam passed (FinalExamAttempt with status='GRADED' and passed=true)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ playerId: string }> }
) {
  try {
    const { playerId } = await params;

    if (!playerId) {
      return NextResponse.json(
        { success: false, error: 'Player ID is required' },
        { status: 400 }
      );
    }

    // Get courseId from query parameters
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');

    if (!courseId) {
      return NextResponse.json(
        { success: false, error: 'Course ID is required' },
        { status: 400 }
      );
    }

    logger.info({ playerId, courseId }, 'Fetching certificate status');

    await connectDB();

    // Fetch player and course first (courseId is a string, not ObjectId)
    const [player, course] = await Promise.all([
      Player.findById(playerId).lean(),
      Course.findOne({ courseId }).lean(),
    ]);

    if (!player) {
      logger.warn({ playerId }, 'Player not found');
      return NextResponse.json(
        { success: false, error: 'Player not found' },
        { status: 404 }
      );
    }

    if (!course) {
      logger.warn({ courseId }, 'Course not found');
      return NextResponse.json(
        { success: false, error: 'Course not found' },
        { status: 404 }
      );
    }

    // Fetch progress using course._id (ObjectId) and playerId
    const progress = await CourseProgress.findOne({
      playerId: new mongoose.Types.ObjectId(playerId),
      courseId: course._id, // CourseProgress.courseId is ObjectId reference to Course._id
    }).lean();

    // Check enrollment
    const enrolled = !!progress;

    if (!enrolled) {
      return NextResponse.json({
        success: true,
        data: {
          enrolled: false,
          allLessonsCompleted: false,
          allQuizzesPassed: false,
          finalExamPassed: false,
          finalExamScore: null,
          certificateEligible: false,
          courseTitle: course.title || course.courseId,
          playerName: player.displayName || 'Unknown',
        },
      });
    }

    // Check if all lessons are completed
    const completedDays = progress?.completedDays || [];
    const durationDays = course.durationDays || 0;
    const allLessonsCompleted = completedDays.length >= durationDays;

    // Check if all quizzes are passed
    // assessmentResults is a Map<string, ObjectId> where key is dayNumber as string
    const assessmentResults = progress?.assessmentResults || new Map();
    const allQuizzesPassed = durationDays > 0 && 
      Array.from({ length: durationDays }, (_, i) => (i + 1).toString())
        .every((dayStr) => assessmentResults.has(dayStr));

    // Check final exam status
    // FinalExamAttempt.courseId is ObjectId reference to Course._id
    const finalExamAttempt = await FinalExamAttempt.findOne({
      playerId: new mongoose.Types.ObjectId(playerId),
      courseId: course._id,
      status: 'GRADED',
    })
      .sort({ submittedAtISO: -1 }) // Get most recent attempt
      .lean();

    const finalExamPassed = !!finalExamAttempt?.passed;
    const finalExamScore = finalExamAttempt?.scorePercentInteger || null;

    // Certificate is eligible if all requirements are met
    const certificateEligible = enrolled && 
      allLessonsCompleted && 
      allQuizzesPassed && 
      finalExamPassed;

    logger.info({
      playerId,
      courseId,
      enrolled,
      allLessonsCompleted,
      allQuizzesPassed,
      finalExamPassed,
      certificateEligible,
    }, 'Certificate status fetched');

    return NextResponse.json({
      success: true,
      data: {
        enrolled,
        allLessonsCompleted,
        allQuizzesPassed,
        finalExamPassed,
        finalExamScore,
        certificateEligible,
        courseTitle: course.title || course.courseId,
        playerName: player.displayName || 'Unknown',
      },
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (error) {
    logger.error({ error }, 'Failed to fetch certificate status');

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
