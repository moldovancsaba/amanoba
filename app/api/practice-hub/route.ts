/**
 * Practice Hub API
 *
 * What: Returns Practice Hub recommendation modes for the signed-in learner
 * Why: Powers the learner-facing review shell with explainable course and quiz signals
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import {
  CourseProgress,
  Lesson,
  Player,
  QuizQuestion,
} from '@/lib/models';
import { logger } from '@/lib/logger';
import { resolveCourseQuizPolicy } from '@/lib/course-quiz-policy';
import { resolveCourseNameForLocale } from '@/app/lib/utils/course-i18n';
import type { Locale } from '@/app/lib/i18n/locales';
import { appendPracticeContextToHref, type PracticeModeId } from '@/app/lib/practice-hub';

const VALID_LOCALES: Locale[] = ['hu', 'en', 'ar', 'hi', 'id', 'pt', 'vi', 'tr', 'bg', 'pl', 'ru', 'sw', 'zh', 'es', 'fr', 'bn', 'ur'];
const STALE_REFRESH_DAYS = 7;

type PracticeModeStatus = 'available' | 'empty';

type CourseDocument = {
  _id: { toString(): string };
  courseId: string;
  name: string;
  description: string;
  language: string;
  durationDays?: number;
  isDraft?: boolean;
  lessonQuizPolicy?: {
    enabled?: boolean;
    required?: boolean;
    questionCount?: number;
    shownAnswerCount?: number;
    maxWrongAllowed?: number;
    successThreshold?: number;
  };
  translations?: unknown;
};

type LessonDocument = {
  lessonId: string;
  dayNumber: number;
  title: string;
};

type PracticeRecommendation = {
  mode: PracticeModeId;
  courseId: string;
  courseName: string;
  courseLanguage: string;
  lessonDay: number;
  lessonId?: string;
  title: string;
  reasonLabel: string;
  priorityScore: number;
  sourceSignals: string[];
  actionHref: string;
  actionLabel: string;
  quizAvailable?: boolean;
};

type PracticeModeResponse = {
  id: PracticeModeId;
  title: string;
  description: string;
  status: PracticeModeStatus;
  items: PracticeRecommendation[];
  emptyStateTitle: string;
  emptyStateDescription: string;
};

function parseLocale(value: string | null): Locale | null {
  if (!value) return null;
  return VALID_LOCALES.includes(value as Locale) ? (value as Locale) : null;
}

function normalizeStatus(value: string | undefined): string {
  return (value ?? '').toLowerCase();
}

function calculateCurrentDay(completedDays: number[], totalDays: number): number {
  if (!completedDays || completedDays.length === 0) {
    return 1;
  }

  const sortedCompleted = [...completedDays].sort((a, b) => a - b);
  for (let day = 1; day <= totalDays; day++) {
    if (!sortedCompleted.includes(day)) {
      return day;
    }
  }

  return totalDays + 1;
}

function getAssessmentResultKeys(
  assessmentResults: unknown
): Set<string> {
  if (!assessmentResults) return new Set<string>();
  if (assessmentResults instanceof Map) {
    return new Set(Array.from(assessmentResults.keys()).map(String));
  }
  if (typeof assessmentResults === 'object') {
    return new Set(Object.keys(assessmentResults as Record<string, unknown>));
  }
  return new Set<string>();
}

function toTimestamp(value: Date | string | undefined): number {
  if (!value) return 0;
  const date = value instanceof Date ? value : new Date(value);
  const time = date.getTime();
  return Number.isFinite(time) ? time : 0;
}

function createMode(
  id: PracticeModeId,
  title: string,
  description: string,
  items: PracticeRecommendation[],
  emptyStateTitle: string,
  emptyStateDescription: string
): PracticeModeResponse {
  return {
    id,
    title,
    description,
    status: items.length > 0 ? 'available' : 'empty',
    items,
    emptyStateTitle,
    emptyStateDescription,
  };
}

/**
 * GET /api/practice-hub
 *
 * What: Returns explainable practice recommendations for the current learner
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const user = session.user as { id?: string; playerId?: string };
    const playerId = user.playerId || user.id;
    const player = await Player.findById(playerId).lean();
    if (!player) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const locale =
      parseLocale(searchParams.get('locale')) ??
      (VALID_LOCALES.includes((player.locale as Locale) ?? '') ? (player.locale as Locale) : 'en');

    const progressList = await CourseProgress.find({ playerId: player._id })
      .populate('courseId', 'courseId name description language durationDays isDraft translations lessonQuizPolicy')
      .sort({ startedAt: -1 })
      .lean();

    const continueNextItems: PracticeRecommendation[] = [];
    const quizRecoveryItems: PracticeRecommendation[] = [];
    const staleRefreshItems: PracticeRecommendation[] = [];

    for (const progressEntry of progressList) {
      const progress = progressEntry as unknown as {
        courseId?: CourseDocument;
        completedDays?: number[];
        assessmentResults?: unknown;
        currentDay?: number;
        status?: string;
        lastAccessedAt?: Date;
        startedAt?: Date;
      };
      const course = progress.courseId;

      if (!course || typeof course !== 'object' || course.isDraft === true) {
        continue;
      }

      const courseDbId = course._id.toString();
      const totalDays = Math.max(course.durationDays || 30, 1);
      const completedDays = Array.isArray(progress.completedDays)
        ? [...progress.completedDays].sort((a, b) => a - b)
        : [];
      const resolvedCurrentDay = calculateCurrentDay(completedDays, totalDays);
      const normalizedStatus = normalizeStatus(progress.status);
      const lastAccessedTimestamp = Math.max(
        toTimestamp(progress.lastAccessedAt),
        toTimestamp(progress.startedAt)
      );
      const assessmentResultKeys = getAssessmentResultKeys(progress.assessmentResults);

      const lessonDocs = await Lesson.find({
        courseId: courseDbId,
        isActive: true,
      })
        .select('lessonId dayNumber title')
        .sort({ dayNumber: 1 })
        .lean();

      const lessonsByDay = new Map<number, LessonDocument>();
      for (const lesson of lessonDocs as LessonDocument[]) {
        lessonsByDay.set(lesson.dayNumber, lesson);
      }

      const policy = resolveCourseQuizPolicy(course as Parameters<typeof resolveCourseQuizPolicy>[0]);
      const quizCounts = policy.enabled
        ? await QuizQuestion.aggregate<{ _id: string; count: number }>([
            {
              $match: {
                courseId: course._id,
                isCourseSpecific: true,
                isActive: true,
              },
            },
            {
              $group: {
                _id: '$lessonId',
                count: { $sum: 1 },
              },
            },
          ])
        : [];

      const quizCountsByLessonId = new Map<string, number>();
      for (const item of quizCounts) {
        quizCountsByLessonId.set(item._id, item.count);
      }

      const courseName = resolveCourseNameForLocale(course as Parameters<typeof resolveCourseNameForLocale>[0], locale);

      if (normalizedStatus !== 'completed' && normalizedStatus !== 'abandoned') {
        const continueDay = Math.min(Math.max(resolvedCurrentDay, 1), totalDays);
        const continueLesson = lessonsByDay.get(continueDay);
        if (continueLesson) {
          continueNextItems.push({
            mode: 'continue-next',
            courseId: course.courseId,
            courseName,
            courseLanguage: course.language,
            lessonDay: continueDay,
            lessonId: continueLesson.lessonId,
            title: continueLesson.title,
            reasonLabel: `Resume Day ${continueDay} in ${courseName}`,
            priorityScore: (totalDays - continueDay) * 1000 + lastAccessedTimestamp,
            sourceSignals: ['CourseProgress.status', 'CourseProgress.currentDay', 'CourseProgress.completedDays'],
            actionHref: appendPracticeContextToHref(
              `/${course.language}/courses/${course.courseId}/day/${continueDay}`,
              {
                mode: 'continue-next',
                courseId: course.courseId,
                lessonDay: continueDay,
              }
            ),
            actionLabel: 'Continue lesson',
          });
        }
      }

      if (policy.enabled) {
        const unresolvedQuizDay = completedDays.find((dayNumber) => {
          const lesson = lessonsByDay.get(dayNumber);
          if (!lesson) return false;
          const availableQuestionCount = quizCountsByLessonId.get(lesson.lessonId) ?? 0;
          return availableQuestionCount > 0 && !assessmentResultKeys.has(String(dayNumber));
        });

        if (unresolvedQuizDay != null) {
          const unresolvedLesson = lessonsByDay.get(unresolvedQuizDay);
          if (unresolvedLesson) {
            quizRecoveryItems.push({
              mode: 'quiz-recovery',
              courseId: course.courseId,
              courseName,
              courseLanguage: course.language,
              lessonDay: unresolvedQuizDay,
              lessonId: unresolvedLesson.lessonId,
              title: unresolvedLesson.title,
              reasonLabel: `Finish the quiz for Day ${unresolvedQuizDay}`,
              priorityScore: lastAccessedTimestamp - unresolvedQuizDay,
              sourceSignals: ['Course.lessonQuizPolicy', 'CourseProgress.assessmentResults', 'QuizQuestion lesson availability'],
              actionHref: appendPracticeContextToHref(
                `/${course.language}/courses/${course.courseId}/day/${unresolvedQuizDay}/quiz`,
                {
                  mode: 'quiz-recovery',
                  courseId: course.courseId,
                  lessonDay: unresolvedQuizDay,
                }
              ),
              actionLabel: 'Open quiz',
              quizAvailable: true,
            });
          }
        }
      }

      const staleLessonDay = completedDays[0];
      const daysSinceLastAccess = lastAccessedTimestamp > 0
        ? Math.floor((Date.now() - lastAccessedTimestamp) / (1000 * 60 * 60 * 24))
        : STALE_REFRESH_DAYS + 1;

      if (staleLessonDay != null && daysSinceLastAccess >= STALE_REFRESH_DAYS) {
        const staleLesson = lessonsByDay.get(staleLessonDay);
        if (staleLesson) {
          staleRefreshItems.push({
            mode: 'stale-refresh',
            courseId: course.courseId,
            courseName,
            courseLanguage: course.language,
            lessonDay: staleLessonDay,
            lessonId: staleLesson.lessonId,
            title: staleLesson.title,
            reasonLabel: `Refresh a lesson you have not touched in ${daysSinceLastAccess} days`,
            priorityScore: daysSinceLastAccess * 1000 - staleLessonDay,
            sourceSignals: ['CourseProgress.completedDays', 'CourseProgress.lastAccessedAt'],
            actionHref: appendPracticeContextToHref(
              `/${course.language}/courses/${course.courseId}/day/${staleLessonDay}`,
              {
                mode: 'stale-refresh',
                courseId: course.courseId,
                lessonDay: staleLessonDay,
              }
            ),
            actionLabel: 'Refresh lesson',
          });
        }
      }
    }

    continueNextItems.sort((a, b) => b.priorityScore - a.priorityScore);
    quizRecoveryItems.sort((a, b) => b.priorityScore - a.priorityScore);
    staleRefreshItems.sort((a, b) => b.priorityScore - a.priorityScore);

    const modes: PracticeModeResponse[] = [
      createMode(
        'continue-next',
        'Continue Next',
        'Resume the clearest unfinished course step.',
        continueNextItems.slice(0, 6),
        'Nothing to resume right now',
        'Start a course or complete the next lesson to create a continuation path.'
      ),
      createMode(
        'quiz-recovery',
        'Quiz Recovery',
        'Recover lesson quizzes that are still unresolved in progress.',
        quizRecoveryItems.slice(0, 6),
        'No unresolved quizzes',
        'You do not currently have any completed lesson days with an outstanding quiz result.'
      ),
      createMode(
        'stale-refresh',
        'Stale Refresh',
        'Revisit lessons from courses that have gone cold.',
        staleRefreshItems.slice(0, 6),
        'No stale refresh candidates',
        `Come back after ${STALE_REFRESH_DAYS}+ days away from a course to see refresh candidates here.`
      ),
    ];

    const availableRecommendationCount = modes.reduce((sum, mode) => sum + mode.items.length, 0);
    const availableModeCount = modes.filter((mode) => mode.status === 'available').length;
    const nextRecommendation = modes.find((mode) => mode.items.length > 0)?.items[0] ?? null;

    return NextResponse.json({
      success: true,
      summary: {
        availableRecommendationCount,
        availableModeCount,
        hasWork: availableRecommendationCount > 0,
        nextRecommendation,
      },
      modes,
      unavailableModes: [
        {
          id: 'mistake-review',
          title: 'Mistake Review',
          reason: 'Learner-specific wrong-answer history is not stored yet, so mistake-based sessions would be misleading in MVP.',
        },
      ],
    });
  } catch (error) {
    logger.error({ error }, 'Failed to build Practice Hub');
    return NextResponse.json({ error: 'Failed to load Practice Hub' }, { status: 500 });
  }
}
