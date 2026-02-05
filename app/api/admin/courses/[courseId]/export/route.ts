/**
 * Admin Course Export API
 *
 * What: Exports a complete course to JSON or ZIP package (v2 format).
 * Why: Backup and share complete courses; ZIP = manifest + course + lessons (human/machine readable).
 * Query: ?format=zip → application/zip; otherwise JSON.
 */

import { NextRequest, NextResponse } from 'next/server';
import JSZip from 'jszip';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { Course, Lesson, QuizQuestion, Brand } from '@/lib/models';
import { logger } from '@/lib/logger';
import { requireAdminOrEditor, getPlayerIdFromSession, isAdmin, canAccessCourse } from '@/lib/rbac';

/**
 * GET /api/admin/courses/[courseId]/export
 *
 * What: Export course to JSON or ZIP (admins and editors with course access).
 * Query: format=zip → ZIP package (manifest.json, course.json, lessons.json).
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const session = await auth();
    const accessCheck = await requireAdminOrEditor(request, session);
    if (accessCheck) return accessCheck;
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

    // Get brand info (optional - export should work even if brand is missing)
    let _brand = null;
    if (course.brandId) {
      try {
        _brand = await Brand.findById(course.brandId).lean();
      } catch (error) {
        logger.warn({ courseId, brandId: course.brandId, error }, 'Failed to fetch brand for export, continuing without brand info');
      }
    }

    // Get all lessons for this course
    const lessons = await Lesson.find({ courseId: course._id })
      .sort({ dayNumber: 1, displayOrder: 1 })
      .lean();

    // Get all quiz questions for this course
    const quizQuestions = await QuizQuestion.find({
      courseId: course._id,
      isCourseSpecific: true,
    }).lean();

    // Helper function to safely convert Map to object
    const mapToObject = (map: Map<string, unknown> | Record<string, unknown> | null | undefined): Record<string, unknown> => {
      if (!map) return {};
      if (map instanceof Map) {
        return Object.fromEntries(map);
      }
      if (typeof map === 'object') {
        return map as Record<string, unknown>;
      }
      return {};
    };

    // Build export structure (package format v2 — see docs/COURSE_PACKAGE_FORMAT.md)
    const exportData = {
      packageVersion: '2.0',
      version: '2.0',
      exportedAt: new Date().toISOString(),
      exportedBy: session.user.email || 'admin',
      course: {
        courseId: course.courseId,
        name: course.name || '',
        description: course.description || '',
        language: course.language || 'hu',
        thumbnail: course.thumbnail || undefined,
        durationDays: course.durationDays || 30,
        isActive: course.isActive !== undefined ? course.isActive : true,
        requiresPremium: course.requiresPremium !== undefined ? course.requiresPremium : false,
        pointsConfig: course.pointsConfig || {
          completionPoints: 1000,
          lessonPoints: 50,
          perfectCourseBonus: 500,
        },
        xpConfig: course.xpConfig || {
          completionXP: 500,
          lessonXP: 25,
        },
        metadata: course.metadata || {},
        translations: mapToObject(course.translations),
        discussionEnabled: course.discussionEnabled ?? false,
        leaderboardEnabled: course.leaderboardEnabled ?? false,
        studyGroupsEnabled: course.studyGroupsEnabled ?? false,
        ccsId: course.ccsId ?? undefined,
        prerequisiteCourseIds: Array.isArray(course.prerequisiteCourseIds) && course.prerequisiteCourseIds.length > 0
          ? course.prerequisiteCourseIds.map((id: unknown) => String(id))
          : undefined,
        prerequisiteEnforcement: course.prerequisiteEnforcement ?? undefined,
        quizMaxWrongAllowed: (course as { quizMaxWrongAllowed?: number }).quizMaxWrongAllowed ?? undefined,
        certification: course.certification ?? undefined,
      },
      lessons: lessons.map((lesson) => {
        const lessonQuestions = quizQuestions.filter(
          (q) => q.lessonId === lesson.lessonId
        );

        return {
          lessonId: lesson.lessonId,
          dayNumber: lesson.dayNumber || 1,
          language: lesson.language || 'hu',
          title: lesson.title || '',
          content: lesson.content || '',
          emailSubject: lesson.emailSubject || '',
          emailBody: lesson.emailBody || '',
          quizConfig: lesson.quizConfig || null,
          unlockConditions: lesson.unlockConditions || {},
          pointsReward: lesson.pointsReward || 0,
          xpReward: lesson.xpReward || 0,
          isActive: lesson.isActive !== undefined ? lesson.isActive : true,
          displayOrder: lesson.displayOrder || lesson.dayNumber || 1,
          metadata: lesson.metadata || {},
          translations: mapToObject(lesson.translations),
          quizQuestions: lessonQuestions.map((q) => ({
            uuid: q.uuid ?? undefined,
            questionType: q.questionType ?? undefined,
            hashtags: q.hashtags ?? undefined,
            question: q.question || '',
            options: q.options || [],
            correctIndex: q.correctIndex !== undefined ? q.correctIndex : 0,
            correctAnswer: (q as { correctAnswer?: string }).correctAnswer ?? undefined,
            wrongAnswers: Array.isArray((q as { wrongAnswers?: string[] }).wrongAnswers) ? (q as { wrongAnswers: string[] }).wrongAnswers : undefined,
            difficulty: q.difficulty || 'MEDIUM',
            category: q.category || 'Course Specific',
            isActive: q.isActive !== undefined ? q.isActive : true,
          })),
        };
      }),
      canonicalSpec: null,
      courseIdea: null,
    };

    logger.info({ courseId, lessonsCount: lessons.length, questionsCount: quizQuestions.length }, 'Admin exported course');

    const dateStr = new Date().toISOString().split('T')[0];
    const formatZip = request.nextUrl.searchParams.get('format') === 'zip';

    if (formatZip) {
      const zip = new JSZip();
      // Single JSON: manifest metadata at top, then course, then lessons (see docs/COURSE_PACKAGE_FORMAT.md)
      zip.file('package.json', JSON.stringify(exportData, null, 2));
      if (exportData.canonicalSpec != null) {
        zip.file('canonical.json', typeof exportData.canonicalSpec === 'object' ? JSON.stringify(exportData.canonicalSpec, null, 2) : String(exportData.canonicalSpec));
      }
      if (exportData.courseIdea != null && exportData.courseIdea !== '') {
        zip.file('course_idea.md', String(exportData.courseIdea));
      }
      const zipBuffer = await zip.generateAsync({ type: 'uint8array' });
      const blob = new Blob([zipBuffer as BlobPart], { type: 'application/zip' });
      return new NextResponse(blob, {
        status: 200,
        headers: {
          'Content-Type': 'application/zip',
          'Content-Disposition': `attachment; filename="${course.courseId}_package_${dateStr}.zip"`,
        },
      });
    }

    return NextResponse.json(exportData, {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${course.courseId}_export_${dateStr}.json"`,
      },
    });
  } catch (error) {
    const courseId = (await params).courseId;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error({ error, courseId, errorMessage }, 'Failed to export course');
    return NextResponse.json(
      { 
        error: 'Failed to export course',
        details: errorMessage,
        courseId 
      },
      { status: 500 }
    );
  }
}
