import connectDB from '../../app/lib/mongodb';
import { disconnectDB } from '../../app/lib/mongodb';
import Course from '../../app/lib/models/course';
import Lesson from '../../app/lib/models/lesson';
import QuizQuestion from '../../app/lib/models/quiz-question';
import { readFileSync } from 'fs';

const MIN_PER_LESSON = 7;

function parseLatestViolationsFromNew2Old(path: string): Map<string, number> {
  const text = readFileSync(path, 'utf-8');
  const lines = text.split(/\r?\n/);
  const headerRe = /^##\s+\d{4}-\d{2}-\d{2}T.*—\s+([0-9a-f]{24})\s*$/;
  const violRe = /^-\s+Violations:\s+(\d+)\s*$/;

  // NEW2OLD is newest-first: first time an id appears is its latest entry.
  const latest = new Map<string, number>();
  let currentId: string | null = null;

  for (const line of lines) {
    const h = line.match(headerRe);
    if (h) {
      const id = h[1];
      currentId = latest.has(id) ? null : id;
      continue;
    }
    const v = line.match(violRe);
    if (v && currentId) {
      latest.set(currentId, Number(v[1]));
      currentId = null;
    }
  }

  return latest;
}

async function main() {
  await connectDB();

  const coursesActive = await Course.countDocuments({ isActive: true });
  const coursesTotal = await Course.countDocuments({});

  const lessonsActive = await Lesson.find({ isActive: true })
    .select({ lessonId: 1, courseId: 1 })
    .lean();
  const lessonsTotal = await Lesson.countDocuments({});

  const questionCountsByLesson = await QuizQuestion.aggregate([
    {
      $match: {
        isActive: true,
        isCourseSpecific: true,
        lessonId: { $exists: true, $type: 'string', $ne: '' },
        courseId: { $exists: true, $ne: null },
      },
    },
    {
      $group: {
        _id: { courseId: '$courseId', lessonId: '$lessonId' },
        count: { $sum: 1 },
      },
    },
  ]);

  const key = (courseId: unknown, lessonId: string) => `${String(courseId)}::${lessonId}`;
  const countMap = new Map<string, number>();
  for (const row of questionCountsByLesson as any[]) {
    countMap.set(key(row._id.courseId, row._id.lessonId), row.count);
  }

  let requiredMinQuestions = 0;
  let missingQuestions = 0;
  let lessonsBelowMin = 0;

  const courseMissing = new Map<string, { lessonsBelowMin: number; questionsMissing: number }>();
  const missingLessons: Array<{
    courseObjectId: string;
    courseId?: string;
    lessonId: string;
    existing: number;
    missing: number;
  }> = [];

  const courses = await Course.find({}).select({ _id: 1, courseId: 1 }).lean();
  const courseIdByObjectId = new Map<string, string>();
  for (const c of courses as any[]) {
    courseIdByObjectId.set(String(c._id), String(c.courseId || ''));
  }

  for (const lesson of lessonsActive as any[]) {
    requiredMinQuestions += MIN_PER_LESSON;
    const courseObjectId = String(lesson.courseId);
    const existing = countMap.get(key(courseObjectId, lesson.lessonId)) || 0;
    const miss = Math.max(0, MIN_PER_LESSON - existing);
    if (miss > 0) lessonsBelowMin += 1;
    missingQuestions += miss;

    if (miss > 0) {
      const agg = courseMissing.get(courseObjectId) || { lessonsBelowMin: 0, questionsMissing: 0 };
      agg.lessonsBelowMin += 1;
      agg.questionsMissing += miss;
      courseMissing.set(courseObjectId, agg);

      missingLessons.push({
        courseObjectId,
        courseId: courseIdByObjectId.get(courseObjectId) || undefined,
        lessonId: String(lesson.lessonId || ''),
        existing,
        missing: miss,
      });
    }
  }

  const activeCourseSpecificQuestions = await QuizQuestion.countDocuments({
    isActive: true,
    isCourseSpecific: true,
  });

  const latestViol = parseLatestViolationsFromNew2Old('docs/QUIZ_ITEM_QA_HANDOVER_NEW2OLD.md');

  const dbIds = await QuizQuestion.find({ isActive: true, isCourseSpecific: true })
    .select({ _id: 1 })
    .lean();

  let checked = 0;
  let passed = 0;
  let failed = 0;

  for (const d of dbIds as any[]) {
    const id = String(d._id);
    const v = latestViol.get(id);
    if (v === undefined) continue;
    checked += 1;
    if (v === 0) passed += 1;
    else failed += 1;
  }

  const toCheck = activeCourseSpecificQuestions - checked;

  const topCoursesByMissing = Array.from(courseMissing.entries())
    .map(([courseObjectId, v]) => ({
      courseObjectId,
      courseId: courseIdByObjectId.get(courseObjectId) || undefined,
      lessonsBelowMin: v.lessonsBelowMin,
      questionsMissing: v.questionsMissing,
    }))
    .sort((a, b) => b.questionsMissing - a.questionsMissing || b.lessonsBelowMin - a.lessonsBelowMin);

  const topMissingLessons = missingLessons
    .filter((l) => l.lessonId)
    .sort((a, b) => b.missing - a.missing || a.lessonId.localeCompare(b.lessonId))
    .slice(0, 50);

  console.log(
    JSON.stringify(
      {
        scope: {
          courses: { active: coursesActive, total: coursesTotal },
          lessons: { active: lessonsActive.length, total: lessonsTotal, minQuestionsPerLesson: MIN_PER_LESSON },
        },
        minimumRequiredQuestions: {
          forActiveLessons: requiredMinQuestions,
          explanation: 'Sum over active lessons: MIN(7) each (no carry-over from lessons with >7).',
        },
        missingQuestionsToReachMinimum: {
          lessonsBelowMin,
          questionsMissing: missingQuestions,
          explanation: 'Sum over active lessons of max(0, 7 - activeCourseSpecificQuestionsForThatLesson).',
        },
        inventory: {
          activeCourseSpecificQuestionsInDb: activeCourseSpecificQuestions,
        },
        qaStatusFromNew2OldLog: {
          checkedAndPassed: passed,
          checkedButFailingLatest: failed,
          checkedTotal: checked,
          toCheck,
          note: '“Passed” = latest NEW2OLD entry for that questionId has Violations: 0.',
        },
        questionsToCreate: {
          count: missingQuestions,
          note: 'New questions required to bring every active lesson up to 7 active course-specific questions.',
        },
        missingBreakdown: {
          topCoursesByMissingQuestions: topCoursesByMissing.slice(0, 25),
          sampleLessonsBelowMin: topMissingLessons,
          note:
            'Use this to pick a courseId for `scripts/quiz-quality-pipeline.ts --course <COURSE_ID>` and to spot-check the worst-deficit lessons.',
        },
      },
      null,
      2
    )
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectDB();
  });
