/**
 * Saved lessons API
 *
 * What: Lists, creates, and removes learner-saved lesson days
 * Why: Provides a continuity-focused save/resume surface for Amanoba learners
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { Course, CourseProgress, Lesson, Player, SavedLesson } from '@/lib/models';
import { logger } from '@/lib/logger';
import { resolveCourseLength } from '@/lib/course-helpers';

async function resolveAuthedPlayer() {
  const session = await auth();
  if (!session?.user) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }

  const user = session.user as { id?: string; playerId?: string };
  const playerId = user.playerId || user.id;
  const player = await Player.findById(playerId);
  if (!player) {
    return { error: NextResponse.json({ error: 'Player not found' }, { status: 404 }) };
  }

  return { player };
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const resolved = await resolveAuthedPlayer();
    if (resolved.error) return resolved.error;
    const { player } = resolved;

    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId')?.trim().toUpperCase();
    const lessonDayValue = searchParams.get('lessonDay');
    if (courseId && lessonDayValue) {
      const lessonDay = Number(lessonDayValue);
      if (!Number.isInteger(lessonDay) || lessonDay < 1) {
        return NextResponse.json({ error: 'lessonDay must be a positive integer' }, { status: 400 });
      }

      const existing = await SavedLesson.findOne({
        playerId: player._id,
        courseId,
        lessonDay,
      })
        .select('_id')
        .lean();

      return NextResponse.json({
        success: true,
        isSaved: existing != null,
      });
    }

    const savedLessons = await SavedLesson.find({ playerId: player._id })
      .sort({ savedAt: -1 })
      .lean();

    if (savedLessons.length === 0) {
      return NextResponse.json({ success: true, savedLessons: [] });
    }

    const publicCourseIds = Array.from(new Set(savedLessons.map((item) => item.courseId)));
    const courses = await Course.find({ courseId: { $in: publicCourseIds } })
      .select('courseId name language durationDays thumbnail description parentCourseId selectedLessonIds ccsId')
      .lean();
    const courseMap = new Map(courses.map((course) => [course.courseId, course]));
    const courseLengthMap = new Map(
      await Promise.all(
        courses.map(async (course) => {
          const { totalDays } = await resolveCourseLength(course);
          return [course.courseId, totalDays] as const;
        })
      )
    );
    const courseObjectIdMap = new Map(
      courses.map((course) => [course.courseId, String(course._id)])
    );

    const lessons = await Lesson.find({
      courseId: { $in: courses.map((course) => course._id) },
      dayNumber: { $in: savedLessons.map((item) => item.lessonDay) },
    })
      .select('courseId lessonId dayNumber title')
      .lean();

    const lessonMap = new Map(
      lessons.map((lesson) => [`${String(lesson.courseId)}:${lesson.dayNumber}`, lesson])
    );

    const progressList = await CourseProgress.find({
      playerId: player._id,
      courseId: { $in: courses.map((course) => course._id) },
    })
      .select('courseId currentDay completedDays lastAccessedAt status')
      .lean();

    const progressMap = new Map(
      progressList.map((progress) => [String(progress.courseId), progress])
    );

    return NextResponse.json({
      success: true,
      savedLessons: savedLessons
        .map((item) => {
          const course = courseMap.get(item.courseId);
          if (!course) return null;
          const courseObjectId = courseObjectIdMap.get(item.courseId);
          if (!courseObjectId) return null;
          const lesson = lessonMap.get(`${courseObjectId}:${item.lessonDay}`);
          const progress = progressMap.get(courseObjectId);
          const completedDays = Array.isArray(progress?.completedDays) ? progress.completedDays : [];
          const safeDurationDays = Math.max(courseLengthMap.get(course.courseId) || course.durationDays || 1, 1);
          const resumeDay = Math.min(Math.max(progress?.currentDay || item.lessonDay, 1), safeDurationDays);

          return {
            course: {
              courseId: course.courseId,
              name: course.name,
              description: course.description,
              language: course.language,
              thumbnail: course.thumbnail,
              durationDays: safeDurationDays,
            },
            lesson: {
              dayNumber: item.lessonDay,
              lessonId: lesson?.lessonId || item.lessonId || null,
              title: lesson?.title || `Day ${item.lessonDay}`,
            },
            savedAt: item.savedAt,
            progress: {
              currentDay: progress?.currentDay || 1,
              completedDays: completedDays.length,
              isSavedLessonCompleted: completedDays.includes(item.lessonDay),
              lastAccessedAt: progress?.lastAccessedAt || null,
              resumeDay,
              resumeHref: `/${course.language}/courses/${course.courseId}/day/${resumeDay}`,
              savedLessonHref: `/${course.language}/courses/${course.courseId}/day/${item.lessonDay}`,
            },
          };
        })
        .filter(Boolean),
    });
  } catch (error) {
    logger.error({ error }, 'Failed to fetch saved lessons');
    return NextResponse.json({ error: 'Failed to fetch saved lessons' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const resolved = await resolveAuthedPlayer();
    if (resolved.error) return resolved.error;
    const { player } = resolved;

    const body = await request.json();
    const courseId = typeof body?.courseId === 'string' ? body.courseId.trim().toUpperCase() : '';
    const lessonId = typeof body?.lessonId === 'string' ? body.lessonId.trim() : undefined;
    const lessonDay = Number(body?.lessonDay);

    if (!courseId || !Number.isInteger(lessonDay) || lessonDay < 1) {
      return NextResponse.json(
        { error: 'courseId and lessonDay are required' },
        { status: 400 }
      );
    }

    const course = await Course.findOne({ courseId }).select('_id').lean();
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const lesson = await Lesson.findOne({ courseId: course._id, dayNumber: lessonDay })
      .select('lessonId')
      .lean();

    await SavedLesson.findOneAndUpdate(
      {
        playerId: player._id,
        courseId,
        lessonDay,
      },
      {
        $set: {
          playerId: player._id,
          brandId: player.brandId,
          courseId,
          lessonDay,
          lessonId: lesson?.lessonId || lessonId,
          savedAt: new Date(),
          'metadata.updatedAt': new Date(),
        },
        $setOnInsert: {
          'metadata.createdAt': new Date(),
        },
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    return NextResponse.json({ success: true, saved: true });
  } catch (error) {
    logger.error({ error }, 'Failed to save lesson');
    return NextResponse.json({ error: 'Failed to save lesson' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();

    const resolved = await resolveAuthedPlayer();
    if (resolved.error) return resolved.error;
    const { player } = resolved;

    const body = await request.json();
    const courseId = typeof body?.courseId === 'string' ? body.courseId.trim().toUpperCase() : '';
    const lessonDay = Number(body?.lessonDay);

    if (!courseId || !Number.isInteger(lessonDay) || lessonDay < 1) {
      return NextResponse.json(
        { error: 'courseId and lessonDay are required' },
        { status: 400 }
      );
    }

    await SavedLesson.deleteOne({
      playerId: player._id,
      courseId,
      lessonDay,
    });

    return NextResponse.json({ success: true, saved: false });
  } catch (error) {
    logger.error({ error }, 'Failed to remove saved lesson');
    return NextResponse.json({ error: 'Failed to remove saved lesson' }, { status: 500 });
  }
}
