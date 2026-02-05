/**
 * Admin Question Detail API
 * 
 * What: REST endpoints for individual question operations
 * Why: Allows admins to get, update, and delete specific questions
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { QuizQuestion, QuestionDifficulty, QuizQuestionType, Course } from '@/lib/models';
import { logger } from '@/lib/logger';
import { getAdminApiActor, requireAdmin } from '@/lib/rbac';
import mongoose from 'mongoose';

/**
 * GET /api/admin/questions/[questionId]
 * 
 * What: Get a specific question by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ questionId: string }> }
) {
  try {
    const session = await auth();
    const apiActor = await getAdminApiActor(request);
    if (!apiActor) {
      const adminCheck = requireAdmin(request, session);
      if (adminCheck) {
        return adminCheck;
      }
    }

    await connectDB();
    const { questionId } = await params;

    const question = await QuizQuestion.findById(questionId).lean();

    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      question,
    });
  } catch (error) {
    logger.error({ error, questionId: (await params).questionId }, 'Failed to fetch question');
    return NextResponse.json(
      { error: 'Failed to fetch question' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/questions/[questionId]
 * 
 * What: Update a specific question
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ questionId: string }> }
) {
  try {
    const session = await auth();
    const apiActor = await getAdminApiActor(request);
    if (!apiActor) {
      const adminCheck = requireAdmin(request, session);
      if (adminCheck) {
        return adminCheck;
      }
    }
    const actor = apiActor || session?.user?.email || session?.user?.id || 'unknown';

    await connectDB();
    const { questionId } = await params;
    const body = await request.json();

    const question = await QuizQuestion.findById(questionId);

    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    // Validate correctIndex if provided (non-negative; model validates against options.length on save)
    if (body.correctIndex !== undefined) {
      if (!Number.isInteger(body.correctIndex) || body.correctIndex < 0) {
        return NextResponse.json(
          { error: 'correctIndex must be a non-negative integer (0 to options.length - 1)' },
          { status: 400 }
        );
      }
    }

    // Validate options if provided (minimum 4)
    if (body.options) {
      if (!Array.isArray(body.options) || body.options.length < 4) {
        return NextResponse.json(
          { error: 'Must provide at least 4 options' },
          { status: 400 }
        );
      }

      // Validate options are unique
      const uniqueOptions = new Set(body.options);
      if (uniqueOptions.size !== body.options.length) {
        return NextResponse.json(
          { error: 'All options must be unique' },
          { status: 400 }
        );
      }
    }

    // Update fields
    const updateData: Record<string, unknown> = {
      'metadata.updatedAt': new Date(),
    };

    if (body.question !== undefined) {
      updateData.question = body.question.trim();
    }
    if (body.options !== undefined) {
      updateData.options = body.options.map((opt: string) => opt.trim());
    }
    if (body.correctIndex !== undefined) {
      updateData.correctIndex = body.correctIndex;
    }
    if (body.difficulty !== undefined) {
      updateData.difficulty = body.difficulty as QuestionDifficulty;
    }
    if (body.category !== undefined) {
      updateData.category = body.category;
    }
    if (body.questionType !== undefined) {
      updateData.questionType = body.questionType as QuizQuestionType;
    }
    if (body.hashtags !== undefined) {
      if (!Array.isArray(body.hashtags)) {
        return NextResponse.json(
          { error: 'hashtags must be an array' },
          { status: 400 }
        );
      }
      updateData.hashtags = body.hashtags.map((tag: string) => tag.trim());
    }
    if (body.isActive !== undefined) {
      updateData.isActive = body.isActive;
    }
    if (body.isCourseSpecific !== undefined) {
      updateData.isCourseSpecific = body.isCourseSpecific;
    }

    // Handle courseId
    if (body.courseId !== undefined) {
      if (body.courseId === '' || body.courseId === null) {
        updateData.courseId = undefined;
      } else {
        if (typeof body.courseId !== 'string') {
          return NextResponse.json(
            { error: 'courseId must be a string (Course.courseId or Course._id)' },
            { status: 400 }
          );
        }

        if (mongoose.Types.ObjectId.isValid(body.courseId)) {
          const maybeCourse = await Course.findById(body.courseId);
          if (!maybeCourse) {
            return NextResponse.json(
              { error: `Course not found (by _id): ${body.courseId}` },
              { status: 404 }
            );
          }
          updateData.courseId = maybeCourse._id;
        } else {
          const course = await Course.findOne({ courseId: body.courseId });
          if (!course) {
            return NextResponse.json(
              { error: `Course not found: ${body.courseId}` },
              { status: 404 }
            );
          }
          updateData.courseId = course._id;
        }
      }
    }

    // Handle lessonId
    if (body.lessonId !== undefined) {
      updateData.lessonId = body.lessonId || undefined;
    }

    // Handle relatedCourseIds
    if (body.relatedCourseIds !== undefined) {
      if (!Array.isArray(body.relatedCourseIds)) {
        return NextResponse.json(
          { error: 'relatedCourseIds must be an array' },
          { status: 400 }
        );
      }
      
      const resolvedRelatedCourseIds: mongoose.Types.ObjectId[] = [];
      for (const relatedId of body.relatedCourseIds) {
        const idStr = typeof relatedId === 'string' ? relatedId : String(relatedId);
        if (typeof relatedId === 'string') {
          if (mongoose.Types.ObjectId.isValid(relatedId)) {
            const course = await Course.findById(relatedId);
            if (course) {
              resolvedRelatedCourseIds.push(course._id as mongoose.Types.ObjectId);
            }
          } else {
            const course = await Course.findOne({ courseId: relatedId });
            if (course) {
              resolvedRelatedCourseIds.push(course._id as mongoose.Types.ObjectId);
            }
          }
        } else if (mongoose.Types.ObjectId.isValid(idStr)) {
          const course = await Course.findById(idStr);
          if (course) {
            resolvedRelatedCourseIds.push(course._id as mongoose.Types.ObjectId);
          }
        }
      }
      updateData.relatedCourseIds = resolvedRelatedCourseIds;
    }

    // Optional audit marker (recommended when editing content)
    if (body.audit === true) {
      updateData['metadata.auditedAt'] = new Date();
      updateData['metadata.auditedBy'] = actor;
    } else {
      // Allow explicit audit fields (e.g., migrating audit state)
      if (body.auditedAt !== undefined) {
        updateData['metadata.auditedAt'] = body.auditedAt ? new Date(body.auditedAt) : undefined;
      }
      if (body.auditedBy !== undefined) {
        updateData['metadata.auditedBy'] = body.auditedBy || undefined;
      }
    }

    // Apply update
    await QuizQuestion.findByIdAndUpdate(questionId, { $set: updateData });

    const updatedQuestion = await QuizQuestion.findById(questionId).lean();

    logger.info(
      {
        questionId,
        updatedBy: actor,
        fields: Object.keys(updateData),
        authMode: apiActor ? 'api-key' : 'session',
      },
      'Admin updated quiz question'
    );

    return NextResponse.json({
      success: true,
      question: updatedQuestion,
    });
  } catch (error: unknown) {
    logger.error({ error, questionId: (await params).questionId }, 'Failed to update question');

    if (error instanceof Error && error.message) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update question' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/questions/[questionId]
 * 
 * What: Delete a specific question (permanent)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ questionId: string }> }
) {
  try {
    const session = await auth();
    const apiActor = await getAdminApiActor(request);
    if (!apiActor) {
      const adminCheck = requireAdmin(request, session);
      if (adminCheck) {
        return adminCheck;
      }
    }
    const actor = apiActor || session?.user?.email || session?.user?.id || 'unknown';

    await connectDB();
    const { questionId } = await params;

    const question = await QuizQuestion.findById(questionId);

    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    await QuizQuestion.findByIdAndDelete(questionId);

    logger.info(
      {
        questionId,
        deletedBy: actor,
        authMode: apiActor ? 'api-key' : 'session',
      },
      'Admin deleted quiz question'
    );

    return NextResponse.json({
      success: true,
      message: 'Question deleted successfully',
    });
  } catch (error) {
    logger.error({ error, questionId: (await params).questionId }, 'Failed to delete question');
    return NextResponse.json(
      { error: 'Failed to delete question' },
      { status: 500 }
    );
  }
}
