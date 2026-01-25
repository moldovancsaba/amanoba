/**
 * Admin Question Detail API
 * 
 * What: REST endpoints for individual question operations
 * Why: Allows admins to get, update, and delete specific questions
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { QuizQuestion, QuestionDifficulty, QuestionType, Course } from '@/lib/models';
import { logger } from '@/lib/logger';
import { requireAdmin } from '@/lib/rbac';
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
    const adminCheck = requireAdmin(request, session);
    if (adminCheck) {
      return adminCheck;
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
    const adminCheck = requireAdmin(request, session);
    if (adminCheck) {
      return adminCheck;
    }

    await connectDB();
    const { questionId } = await params;
    const body = await request.json();

    const question = await QuizQuestion.findById(questionId);

    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    // Validate options if provided
    if (body.options) {
      if (!Array.isArray(body.options) || body.options.length !== 4) {
        return NextResponse.json(
          { error: 'Must provide exactly 4 options' },
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

      // Validate correctIndex
      if (body.correctIndex !== undefined) {
        if (body.correctIndex < 0 || body.correctIndex > 3) {
          return NextResponse.json(
            { error: 'correctIndex must be between 0 and 3' },
            { status: 400 }
          );
        }
      }
    }

    // Update fields
    const updateData: any = {
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
      updateData.questionType = body.questionType as QuestionType;
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

    // Handle lessonId
    if (body.lessonId !== undefined) {
      updateData.lessonId = body.lessonId || undefined;
    }

    // Apply update
    await QuizQuestion.findByIdAndUpdate(questionId, { $set: updateData });

    const updatedQuestion = await QuizQuestion.findById(questionId).lean();

    logger.info(
      {
        questionId,
        updatedBy: session.user.email || session.user.id,
        fields: Object.keys(updateData),
      },
      'Admin updated quiz question'
    );

    return NextResponse.json({
      success: true,
      question: updatedQuestion,
    });
  } catch (error: any) {
    logger.error({ error, questionId: (await params).questionId }, 'Failed to update question');

    if (error.message) {
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
    const adminCheck = requireAdmin(request, session);
    if (adminCheck) {
      return adminCheck;
    }

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
        deletedBy: session.user.email || session.user.id,
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
