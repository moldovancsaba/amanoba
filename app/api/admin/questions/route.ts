/**
 * Admin Questions API
 * 
 * What: Global quiz question management endpoints
 * Why: Centralized question database with filtering and search
 * 
 * Features:
 * - List questions with advanced filtering
 * - Create individual questions
 * - Search by hashtags, language, course, lesson
 * - Support for both course-specific and reusable questions
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { QuizQuestion, QuestionDifficulty, QuestionType, Course } from '@/lib/models';
import mongoose from 'mongoose';
import { logger } from '@/lib/logger';
import { requireAdmin } from '@/lib/rbac';
import { randomUUID } from 'crypto';

/**
 * GET /api/admin/questions
 * 
 * What: List quiz questions with advanced filtering
 * Query params:
 *   - language: Filter by language hashtag (e.g., #hu, #en)
 *   - courseId: Filter by course ID
 *   - lessonId: Filter by lesson ID
 *   - hashtag: Filter by hashtag (can be multiple, AND logic)
 *   - questionType: Filter by cognitive level (recall, application, critical-thinking)
 *   - difficulty: Filter by difficulty (EASY, MEDIUM, HARD, EXPERT)
 *   - category: Filter by category
 *   - isActive: Filter by active status (true/false)
 *   - isCourseSpecific: Filter by course-specific vs reusable (true/false)
 *   - search: Search in question text
 *   - limit: Pagination limit (default: 50, max: 100)
 *   - offset: Pagination offset (default: 0)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const adminCheck = requireAdmin(request, session);
    if (adminCheck) {
      return adminCheck;
    }

    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const language = searchParams.get('language');
    const courseId = searchParams.get('courseId');
    const lessonId = searchParams.get('lessonId');
    const hashtag = searchParams.getAll('hashtag'); // Support multiple hashtags
    const questionType = searchParams.get('questionType');
    const difficulty = searchParams.get('difficulty');
    const category = searchParams.get('category');
    const isActive = searchParams.get('isActive');
    const isCourseSpecific = searchParams.get('isCourseSpecific');
    const search = searchParams.get('search');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build filter
    const filter: any = {};

    // Language filter (hashtag based)
    if (language) {
      filter.hashtags = { $in: [`#${language}`] };
    }

    // Course filter
    if (courseId) {
      const course = await Course.findOne({ courseId }).lean();
      if (course) {
        filter.courseId = course._id;
      } else {
        // Course not found, return empty result
        return NextResponse.json({
          success: true,
          questions: [],
          count: 0,
          total: 0,
        });
      }
    }

    // Lesson filter
    if (lessonId) {
      filter.lessonId = lessonId;
    }

    // Hashtag filter (supports multiple, AND logic)
    if (hashtag.length > 0) {
      if (filter.hashtags) {
        // Combine with existing hashtag filter (AND logic)
        filter.hashtags = {
          $all: [...(Array.isArray(filter.hashtags.$in) ? filter.hashtags.$in : []), ...hashtag],
        };
      } else {
        filter.hashtags = { $all: hashtag };
      }
    }

    // Question type filter
    if (questionType) {
      filter.questionType = questionType;
    }

    // Difficulty filter
    if (difficulty) {
      filter.difficulty = difficulty;
    }

    // Category filter
    if (category) {
      filter.category = category;
    }

    // Active status filter
    if (isActive !== null) {
      filter.isActive = isActive === 'true';
    }

    // Course-specific filter
    if (isCourseSpecific !== null) {
      filter.isCourseSpecific = isCourseSpecific === 'true';
    }

    // Search filter (case-insensitive regex)
    if (search) {
      filter.question = { $regex: search, $options: 'i' };
    }

    // Get total count (for pagination)
    const total = await QuizQuestion.countDocuments(filter);

    // Get questions with pagination
    // Populate relatedCourseIds to get course names
    const questions = await QuizQuestion.find(filter)
      .populate('relatedCourseIds', 'courseId name language')
      .sort({ 'metadata.createdAt': -1 }) // Newest first
      .limit(limit)
      .skip(offset)
      .lean();

    return NextResponse.json({
      success: true,
      questions,
      count: questions.length,
      total,
      limit,
      offset,
      hasMore: offset + questions.length < total,
    });
  } catch (error) {
    logger.error({ error }, 'Failed to fetch quiz questions');
    return NextResponse.json(
      { error: 'Failed to fetch quiz questions' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/questions
 * 
 * What: Create a new quiz question
 * Body: QuestionData
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const adminCheck = requireAdmin(request, session);
    if (adminCheck) {
      return adminCheck;
    }

    await connectDB();
    const body = await request.json();

    const {
      question,
      options,
      correctIndex,
      difficulty = QuestionDifficulty.MEDIUM,
      category = 'Course Specific',
      questionType,
      hashtags = [],
      isCourseSpecific = false,
      courseId,
      relatedCourseIds = [],
      lessonId,
    } = body;

    // Validate required fields
    if (!question || !options || correctIndex === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: question, options, correctIndex' },
        { status: 400 }
      );
    }

    // Validate options
    if (!Array.isArray(options) || options.length !== 4) {
      return NextResponse.json(
        { error: 'Must provide exactly 4 options' },
        { status: 400 }
      );
    }

    // Validate options are unique
    const uniqueOptions = new Set(options);
    if (uniqueOptions.size !== options.length) {
      return NextResponse.json(
        { error: 'All options must be unique' },
        { status: 400 }
      );
    }

    // Validate correctIndex
    if (correctIndex < 0 || correctIndex > 3) {
      return NextResponse.json(
        { error: 'correctIndex must be between 0 and 3' },
        { status: 400 }
      );
    }

    // Validate hashtags
    if (!Array.isArray(hashtags)) {
      return NextResponse.json(
        { error: 'hashtags must be an array' },
        { status: 400 }
      );
    }

    // Resolve courseId if courseId string provided
    let resolvedCourseId: mongoose.Types.ObjectId | undefined;
    if (courseId) {
      if (typeof courseId === 'string') {
        const course = await Course.findOne({ courseId });
        if (!course) {
          return NextResponse.json(
            { error: `Course not found: ${courseId}` },
            { status: 404 }
          );
        }
        resolvedCourseId = course._id;
      } else {
        resolvedCourseId = courseId;
      }
    }

    // Resolve relatedCourseIds if provided
    let resolvedRelatedCourseIds: mongoose.Types.ObjectId[] = [];
    if (relatedCourseIds && Array.isArray(relatedCourseIds) && relatedCourseIds.length > 0) {
      for (const relatedId of relatedCourseIds) {
        if (typeof relatedId === 'string') {
          const course = await Course.findOne({ courseId: relatedId });
          if (course) {
            resolvedRelatedCourseIds.push(course._id);
          }
        } else if (mongoose.Types.ObjectId.isValid(relatedId)) {
          resolvedRelatedCourseIds.push(new mongoose.Types.ObjectId(relatedId));
        }
      }
    }

    // Create quiz question
    const quizQuestion = new QuizQuestion({
      uuid: randomUUID(),
      question: question.trim(),
      options: options.map((opt: string) => opt.trim()),
      correctIndex,
      difficulty: difficulty as QuestionDifficulty,
      category,
      questionType: questionType as QuestionType | undefined,
      hashtags: hashtags.map((tag: string) => tag.trim()),
      isCourseSpecific: isCourseSpecific || !!resolvedCourseId || !!lessonId,
      courseId: resolvedCourseId,
      relatedCourseIds: resolvedRelatedCourseIds,
      lessonId: lessonId || undefined,
      showCount: 0,
      correctCount: 0,
      isActive: body.isActive !== undefined ? body.isActive : true,
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: session.user.email || session.user.id,
      },
    });

    await quizQuestion.save();

    logger.info(
      {
        questionId: quizQuestion._id,
        uuid: quizQuestion.uuid,
        createdBy: session.user.email || session.user.id,
      },
      'Admin created quiz question'
    );

    return NextResponse.json({
      success: true,
      question: quizQuestion,
    }, { status: 201 });
  } catch (error: any) {
    logger.error({ error }, 'Failed to create quiz question');

    // Handle duplicate UUID
    if (error.code === 11000 && error.keyPattern?.uuid) {
      return NextResponse.json(
        { error: 'Question with this UUID already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to create quiz question' },
      { status: 500 }
    );
  }
}
