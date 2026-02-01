/**
 * Admin Course Detail API
 * 
 * What: REST endpoints for individual course operations
 * Why: Allows admins to get, update, and delete specific courses
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { Course, Lesson, CourseProgress, QuizQuestion, AssessmentResult } from '@/lib/models';
import { logger } from '@/lib/logger';
import { requireAdmin, requireAdminOrEditor, getPlayerIdFromSession, isAdmin, canAccessCourse } from '@/lib/rbac';

/**
 * GET /api/admin/courses/[courseId]
 *
 * What: Get a specific course by courseId (admins: any; editors: only their courses)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const session = await auth();
    const accessCheck = await requireAdminOrEditor(request, session);
    if (accessCheck) {
      return accessCheck;
    }

    await connectDB();
    const { courseId } = await params;

    const course = await Course.findOne({ courseId }).lean();

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    if (!isAdmin(session) && !canAccessCourse(course, getPlayerIdFromSession(session))) {
      return NextResponse.json({ error: 'Forbidden', message: 'You do not have access to this course' }, { status: 403 });
    }

    return NextResponse.json({ success: true, course });
  } catch (error) {
    logger.error({ error, courseId: (await params).courseId }, 'Failed to fetch course');
    return NextResponse.json({ error: 'Failed to fetch course' }, { status: 500 });
  }
}

/**
 * PATCH /api/admin/courses/[courseId]
 *
 * What: Update a specific course (admins: any field; editors: only their courses, cannot set assignedEditors/createdBy)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const session = await auth();
    const accessCheck = await requireAdminOrEditor(request, session);
    if (accessCheck) {
      return accessCheck;
    }

    await connectDB();
    const { courseId } = await params;
    const body = await request.json();

    const existing = await Course.findOne({ courseId }).lean();
    if (!existing) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    if (!isAdmin(session) && !canAccessCourse(existing, getPlayerIdFromSession(session))) {
      return NextResponse.json({ error: 'Forbidden', message: 'You do not have access to this course' }, { status: 403 });
    }

    // Only admins may change assignedEditors or createdBy
    const payload = { ...body };
    if (!isAdmin(session)) {
      delete payload.assignedEditors;
      delete payload.createdBy;
    }

    // Merge certification so partial updates (e.g. passThresholdPercent) don't wipe other fields
    if (payload.certification != null && typeof payload.certification === 'object') {
      const existingCert = (existing.certification && typeof existing.certification === 'object')
        ? { ...existing.certification } : {};
      payload.certification = { ...existingCert, ...payload.certification };
    }

    const course = await Course.findOneAndUpdate(
      { courseId },
      { $set: payload },
      { new: true, runValidators: true }
    );

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    logger.info({ courseId }, 'Admin updated course');

    return NextResponse.json({ success: true, course });
  } catch (error) {
    logger.error({ error, courseId: (await params).courseId }, 'Failed to update course');
    return NextResponse.json({ error: 'Failed to update course' }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/courses/[courseId]
 * 
 * What: Delete a specific course and all related data
 * Why: Cascading delete ensures data consistency
 */
export async function DELETE(
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

    // Find course to get its ObjectId
    const course = await Course.findOne({ courseId });
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const courseObjectId = course._id;

    // Delete all related data in parallel
    const [
      lessonsDeleted,
      progressDeleted,
      quizQuestionsDeleted,
      assessmentsDeleted,
    ] = await Promise.all([
      // Delete all lessons for this course
      Lesson.deleteMany({ courseId: courseObjectId }),
      
      // Delete all course progress records
      CourseProgress.deleteMany({ courseId: courseObjectId }),
      
      // Delete all course-specific quiz questions
      QuizQuestion.deleteMany({ 
        courseId: courseObjectId,
        isCourseSpecific: true 
      }),
      
      // Delete all assessment results for this course
      AssessmentResult.deleteMany({ courseId: courseObjectId }),
    ]);

    // Finally, delete the course itself
    await Course.findByIdAndDelete(courseObjectId);

    logger.info({ 
      courseId,
      lessonsDeleted: lessonsDeleted.deletedCount,
      progressDeleted: progressDeleted.deletedCount,
      quizQuestionsDeleted: quizQuestionsDeleted.deletedCount,
      assessmentsDeleted: assessmentsDeleted.deletedCount,
    }, 'Admin deleted course and all related data');

    return NextResponse.json({ 
      success: true, 
      message: 'Course deleted',
      deleted: {
        lessons: lessonsDeleted.deletedCount,
        progress: progressDeleted.deletedCount,
        quizQuestions: quizQuestionsDeleted.deletedCount,
        assessments: assessmentsDeleted.deletedCount,
      }
    });
  } catch (error) {
    logger.error({ error, courseId: (await params).courseId }, 'Failed to delete course');
    return NextResponse.json({ error: 'Failed to delete course' }, { status: 500 });
  }
}
