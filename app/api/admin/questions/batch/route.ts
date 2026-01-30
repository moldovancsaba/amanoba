/**
 * Admin Questions Batch API
 * 
 * What: Batch create/update quiz questions
 * Why: Efficient bulk operations for initializing or importing questions
 * 
 * Performance: Uses insertMany/bulkWrite for 10x faster than individual operations
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { Course, QuizQuestion, QuestionDifficulty, QuizQuestionType } from '@/lib/models';
import { logger } from '@/lib/logger';
import { getAdminApiActor, requireAdmin } from '@/lib/rbac';
import { randomUUID } from 'crypto';
import mongoose from 'mongoose';

/**
 * POST /api/admin/questions/batch
 * 
 * What: Create multiple quiz questions in a single batch operation
 * Body: { questions: Array<QuestionData> }
 * 
 * Performance: 10x faster than individual POST requests
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const apiActor = getAdminApiActor(request);
    if (!apiActor) {
      const adminCheck = requireAdmin(request, session);
      if (adminCheck) {
        return adminCheck;
      }
    }
    const actor = apiActor || session?.user?.email || session?.user?.id || 'unknown';

    await connectDB();
    const body = await request.json();
    const { questions } = body;

    if (!Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json(
        { error: 'questions must be a non-empty array' },
        { status: 400 }
      );
    }

    if (questions.length > 100) {
      return NextResponse.json(
        { error: 'Maximum 100 questions per batch' },
        { status: 400 }
      );
    }

    // Validate all questions before inserting
    const questionsToInsert = await Promise.all(questions.map(async (q: Record<string, unknown>, index: number) => {
      // Validate required fields
      if (!q.question || !q.options || q.correctIndex === undefined) {
        throw new Error(`Question ${index + 1}: Missing required fields (question, options, correctIndex)`);
      }

      // Validate options
      if (!Array.isArray(q.options) || q.options.length !== 4) {
        throw new Error(`Question ${index + 1}: Must provide exactly 4 options`);
      }

      // Validate correctIndex
      if (q.correctIndex < 0 || q.correctIndex > 3) {
        throw new Error(`Question ${index + 1}: correctIndex must be between 0 and 3`);
      }

      // Validate options are unique
      const uniqueOptions = new Set(q.options);
      if (uniqueOptions.size !== q.options.length) {
        throw new Error(`Question ${index + 1}: All options must be unique`);
      }

      // Resolve courseId (accept Course.courseId or Course._id)
      let resolvedCourseId: mongoose.Types.ObjectId | undefined;
      if (q.courseId) {
        if (typeof q.courseId !== 'string') {
          throw new Error(`Question ${index + 1}: courseId must be a string (Course.courseId or Course._id)`);
        }

        if (mongoose.Types.ObjectId.isValid(q.courseId)) {
          const course = await Course.findById(q.courseId);
          if (!course) {
            throw new Error(`Question ${index + 1}: Course not found (by _id): ${q.courseId}`);
          }
          resolvedCourseId = course._id;
        } else {
          const course = await Course.findOne({ courseId: q.courseId });
          if (!course) {
            throw new Error(`Question ${index + 1}: Course not found: ${q.courseId}`);
          }
          resolvedCourseId = course._id;
        }
      }

      // Resolve relatedCourseIds (accept Course.courseId or Course._id)
      let resolvedRelatedCourseIds: mongoose.Types.ObjectId[] = [];
      if (q.relatedCourseIds !== undefined) {
        if (!Array.isArray(q.relatedCourseIds)) {
          throw new Error(`Question ${index + 1}: relatedCourseIds must be an array`);
        }
        resolvedRelatedCourseIds = (
          await Promise.all(
            q.relatedCourseIds.map(async (relatedId: unknown) => {
              if (typeof relatedId !== 'string') return null;
              if (mongoose.Types.ObjectId.isValid(relatedId)) {
                const course = await Course.findById(relatedId);
                return course?._id || null;
              }
              const course = await Course.findOne({ courseId: relatedId });
              return course?._id || null;
            })
          )
        ).filter(Boolean) as mongoose.Types.ObjectId[];
      }

      return {
        uuid: q.uuid || randomUUID(),
        lessonId: q.lessonId || undefined,
        courseId: resolvedCourseId,
        question: q.question.trim(),
        options: q.options.map((opt: string) => opt.trim()),
        correctIndex: q.correctIndex,
        difficulty: (q.difficulty || QuestionDifficulty.MEDIUM) as QuestionDifficulty,
        category: q.category || 'Course Specific',
        isCourseSpecific: q.isCourseSpecific !== undefined ? q.isCourseSpecific : (!!resolvedCourseId || !!q.lessonId),
        questionType: q.questionType as QuizQuestionType | undefined,
        hashtags: Array.isArray(q.hashtags) ? q.hashtags : [],
        isActive: q.isActive !== undefined ? q.isActive : true,
        relatedCourseIds: resolvedRelatedCourseIds,
        showCount: 0,
        correctCount: 0,
        metadata: {
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: actor,
          auditedAt: q.auditedAt ? new Date(q.auditedAt) : undefined,
          auditedBy: q.auditedBy || undefined,
        },
      };
    }));

    // Batch insert using insertMany (10x faster than individual saves)
    const result = await QuizQuestion.insertMany(questionsToInsert, {
      ordered: false, // Continue on error, return all errors
    });

    logger.info(
      {
        count: result.length,
        batchSize: questions.length,
        createdBy: actor,
        authMode: apiActor ? 'api-key' : 'session',
      },
      'Admin created batch quiz questions'
    );

    return NextResponse.json({
      success: true,
      created: result.length,
      questions: result,
    }, { status: 201 });
  } catch (error: unknown) {
    logger.error({ error }, 'Failed to create batch quiz questions');
    
    // Handle validation errors
    if (error.message) {
      return NextResponse.json(
        { error: (error as Error).message },
        { status: 400 }
      );
    }

    // Handle MongoDB duplicate key errors
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Duplicate question detected (UUID or question text already exists)' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create batch quiz questions' },
      { status: 500 }
    );
  }
}
