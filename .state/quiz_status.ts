import connectDB from '../app/lib/mongodb';
import QuizQuestion from '../app/lib/models/quiz-question';
import { evaluateQuestion } from '../scripts/quiz-item-qa/evaluator';
import { readFileSync, existsSync } from 'fs';

function loadProcessedIds(): Set<string> {
  const path = 'docs/QUIZ_ITEM_QA_HANDOVER_NEW2OLD.md';
  if (!existsSync(path)) return new Set();
  const raw = readFileSync(path, 'utf-8');
  const re = /^## \d{4}-\d{2}-\d{2}T[^\n]* — ([0-9a-f]{24})\s*$/gm;
  const ids = new Set<string>();
  let m: RegExpExecArray | null;
  while ((m = re.exec(raw))) ids.add(m[1]);
  return ids;
}

(async () => {
  await connectDB();

  const processedIds = loadProcessedIds();

  const totalActiveCourseSpecific = await QuizQuestion.countDocuments({
    isActive: true,
    isCourseSpecific: true,
  });

  const totalActiveAll = await QuizQuestion.countDocuments({ isActive: true });

  const cursor = QuizQuestion.find({ isActive: true, isCourseSpecific: true })
    .select({
      _id: 1,
      uuid: 1,
      question: 1,
      options: 1,
      correctIndex: 1,
      difficulty: 1,
      category: 1,
      questionType: 1,
      hashtags: 1,
      isActive: 1,
      isCourseSpecific: 1,
      courseId: 1,
      lessonId: 1,
      relatedCourseIds: 1,
      metadata: 1,
      showCount: 1,
      correctCount: 1,
    })
    .lean()
    .cursor();

  let evaluated = 0;
  let needsUpdate = 0;
  let needsUpdateUnprocessed = 0;
  const byViolation: Record<string, number> = {};

  const perCourseTextCount = new Map<string, Map<string, number>>();

  for await (const doc of cursor) {
    evaluated += 1;

    const item = {
      _id: doc._id.toString(),
      uuid: doc.uuid,
      question: doc.question,
      options: doc.options,
      correctIndex: doc.correctIndex,
      difficulty: doc.difficulty,
      category: doc.category,
      questionType: doc.questionType,
      hashtags: doc.hashtags,
      isActive: doc.isActive,
      isCourseSpecific: doc.isCourseSpecific,
      courseId: doc.courseId?.toString(),
      lessonId: doc.lessonId,
      relatedCourseIds: (doc.relatedCourseIds || []).map((x: any) => x.toString()),
      metadata: {
        createdAt: doc.metadata?.createdAt?.toISOString?.() ?? String(doc.metadata?.createdAt ?? ''),
        updatedAt: doc.metadata?.updatedAt?.toISOString?.() ?? String(doc.metadata?.updatedAt ?? ''),
        createdBy: doc.metadata?.createdBy,
        auditedAt: doc.metadata?.auditedAt?.toISOString?.() ?? (doc.metadata?.auditedAt ? String(doc.metadata.auditedAt) : undefined),
        auditedBy: doc.metadata?.auditedBy,
        lastShownAt: doc.metadata?.lastShownAt?.toISOString?.() ?? (doc.metadata?.lastShownAt ? String(doc.metadata.lastShownAt) : undefined),
      },
      showCount: doc.showCount,
      correctCount: doc.correctCount,
    };

    if (item.courseId) {
      const courseMap = perCourseTextCount.get(item.courseId) || new Map<string, number>();
      courseMap.set(item.question, (courseMap.get(item.question) || 0) + 1);
      perCourseTextCount.set(item.courseId, courseMap);
    }

    const res = evaluateQuestion(item as any);
    if (res.needsUpdate) {
      needsUpdate += 1;
      if (!processedIds.has(item._id)) needsUpdateUnprocessed += 1;
      for (const v of res.violations) {
        byViolation[v.code] = (byViolation[v.code] || 0) + 1;
      }
    }
  }

  let duplicateSetsInCourse = 0;
  let totalQuestionsParticipatingInDuplicateSets = 0;
  for (const [, qmap] of perCourseTextCount) {
    for (const [, count] of qmap) {
      if (count > 1) {
        duplicateSetsInCourse += 1;
        totalQuestionsParticipatingInDuplicateSets += count;
      }
    }
  }

  const processedUnique = processedIds.size;
  const remainingUnprocessed = Math.max(0, totalActiveCourseSpecific - processedUnique);

  console.log(
    JSON.stringify(
      {
        totals: {
          activeAllQuestions: totalActiveAll,
          activeCourseSpecificQuestions: totalActiveCourseSpecific,
          processedUniqueCourseSpecificIdsInHandover: processedUnique,
          remainingUnprocessedCourseSpecificApprox: remainingUnprocessed,
        },
        quality: {
          evaluatedCourseSpecificActive: evaluated,
          needsUpdateCourseSpecificActive: needsUpdate,
          needsUpdateUnprocessedApprox: needsUpdateUnprocessed,
          byViolation,
        },
        duplicates: {
          exactDuplicateSetsInCourse: duplicateSetsInCourse,
          totalQuestionsParticipatingInDuplicateSets,
        },
        notes: {
          processedIdsSource: 'docs/QUIZ_ITEM_QA_HANDOVER_NEW2OLD.md (unique IDs)',
        },
      },
      null,
      2
    )
  );

  process.exit(0);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
