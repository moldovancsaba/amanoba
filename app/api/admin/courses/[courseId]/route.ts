/**
 * Admin Course Detail API
 * 
 * What: REST endpoints for individual course operations
 * Why: Allows admins to get, update, and delete specific courses
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { Course } from '@/lib/models';
import { logger } from '@/lib/logger';

/**
 * GET /api/admin/courses/[courseId]
 * 
 * What: Get a specific course by courseId
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { courseId } = await params;

    const course = await Course.findOne({ courseId }).lean();

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
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
 * What: Update a specific course
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { courseId } = await params;
    const body = await request.json();

    const course = await Course.findOneAndUpdate(
      { courseId },
      { $set: body },
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
 * What: Delete a specific course
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { courseId } = await params;

    const course = await Course.findOneAndDelete({ courseId });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    logger.info({ courseId }, 'Admin deleted course');

    return NextResponse.json({ success: true, message: 'Course deleted' });
  } catch (error) {
    logger.error({ error, courseId: (await params).courseId }, 'Failed to delete course');
    return NextResponse.json({ error: 'Failed to delete course' }, { status: 500 });
  }
}
