/**
 * Admin Course Lessons API
 * 
 * What: REST endpoints for managing lessons within a course
 * Why: Allows admins to create, read, update, and delete lessons
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { Course, Lesson } from '@/lib/models';
import { logger } from '@/lib/logger';
import { requireAdmin } from '@/lib/rbac';
import mongoose from 'mongoose';

/**
 * GET /api/admin/courses/[courseId]/lessons
 * 
 * What: Get all lessons for a course
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const session = await auth();
    const adminCheck = requireAdmin(request, session);
    if (adminCheck) {
      return adminCheck;
    }

    await connectDB();
    const { courseId } = await params;

    // Find course first
    const course = await Course.findOne({ courseId });
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Get all lessons for this course, sorted by dayNumber
    const lessons = await Lesson.find({ courseId: course._id })
      .sort({ dayNumber: 1 })
      .lean();

    return NextResponse.json({
      success: true,
      lessons,
      count: lessons.length,
    });
  } catch (error) {
    logger.error({ error, courseId: (await params).courseId }, 'Failed to fetch lessons');
    return NextResponse.json({ error: 'Failed to fetch lessons' }, { status: 500 });
  }
}

/**
 * POST /api/admin/courses/[courseId]/lessons
 * 
 * What: Create a new lesson for a course
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const session = await auth();
    const adminCheck = requireAdmin(request, session);
    if (adminCheck) {
      return adminCheck;
    }

    await connectDB();
    const { courseId } = await params;

    // Find course
    const course = await Course.findOne({ courseId });
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const body = await request.json();
    const {
      lessonId,
      dayNumber,
      title,
      content,
      emailSubject,
      emailBody,
      assessmentGameId,
      pointsReward,
      xpReward,
      unlockConditions,
      metadata,
      language,
      translations,
    } = body;

    // Validate required fields
    if (!lessonId || !dayNumber || !title || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: lessonId, dayNumber, title, content' },
        { status: 400 }
      );
    }

    // Validate dayNumber (1-30)
    if (dayNumber < 1 || dayNumber > 30) {
      return NextResponse.json(
        { error: 'dayNumber must be between 1 and 30' },
        { status: 400 }
      );
    }

    // Check if lessonId already exists for this course
    const existing = await Lesson.findOne({ courseId: course._id, lessonId });
    if (existing) {
      return NextResponse.json(
        { error: 'Lesson ID already exists for this course' },
        { status: 400 }
      );
    }

    // Check if dayNumber already has a lesson
    const existingDay = await Lesson.findOne({ courseId: course._id, dayNumber });
    if (existingDay) {
      return NextResponse.json(
        { error: `Day ${dayNumber} already has a lesson` },
        { status: 400 }
      );
    }

    // Create lesson
    const lesson = new Lesson({
      lessonId,
      courseId: course._id,
      dayNumber,
      title,
      content,
      emailSubject: emailSubject || `Day ${dayNumber}: ${title}`,
      emailBody: emailBody || content,
      assessmentGameId: assessmentGameId && mongoose.Types.ObjectId.isValid(assessmentGameId)
        ? new mongoose.Types.ObjectId(assessmentGameId)
        : undefined,
      pointsReward: pointsReward || course.pointsConfig.lessonPoints,
      xpReward: xpReward || course.xpConfig.lessonXP,
      unlockConditions: unlockConditions || {
        requirePreviousLesson: dayNumber > 1,
        requireCourseStart: true,
      },
      isActive: true,
      displayOrder: dayNumber,
      language: language || course.language,
      translations: translations || {},
      metadata: metadata || {},
    });

    await lesson.save();

    logger.info({ courseId, lessonId, dayNumber }, 'Admin created lesson');

    return NextResponse.json({
      success: true,
      lesson,
    }, { status: 201 });
  } catch (error) {
    logger.error({ error, courseId: (await params).courseId }, 'Failed to create lesson');
    return NextResponse.json({ error: 'Failed to create lesson' }, { status: 500 });
  }
}
