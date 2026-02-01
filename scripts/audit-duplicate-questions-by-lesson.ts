/**
 * Audit: Duplicate and similar questions/answers, lesson by lesson.
 *
 * Repeatable process: for each lesson we always investigate the ACTUAL (current) lesson's questions
 * and the PREVIOUS lesson's questions (within-lesson + cross-lesson comparison; sliding window
 * of min 14 questions for similar-answer detection).
 *
 * Rules:
 * 1. Process 1 lesson at a time.
 * 2. Within a lesson: find question pairs with content-meaning similarity > 85% → create new question.
 * 3. Within the last 2 lessons (window of min 14 questions): find answers that appear in 3+ questions → rewrite answers.
 * 4. Compare each lesson's questions to the previous lesson (same similarity rules).
 * 5. Sliding window: when moving to next lesson, drop oldest min 7 questions, add current lesson's min 7.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/audit-duplicate-questions-by-lesson.ts
 *   COURSE_ID=PRODUCTIVITY_2026_HU  (optional: single course)
 *   SIMILARITY_THRESHOLD=0.85       (default 0.85)
 *   MIN_WINDOW=14   MIN_PREV=7      (window size and previous-lesson pool)
 *   OUT=docs/audit-duplicate-questions-report.json
 */

import { config } from 'dotenv';
import { resolve, join } from 'path';
import { writeFileSync, mkdirSync } from 'fs';

config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../app/lib/mongodb';
import { Course, Lesson, QuizQuestion } from '../app/lib/models';

const COURSE_ID = process.env.COURSE_ID || '';
const SIMILARITY_THRESHOLD = parseFloat(process.env.SIMILARITY_THRESHOLD || '0.85');
const MIN_WINDOW = Math.max(7, parseInt(process.env.MIN_WINDOW || '14', 10));
const MIN_PREV = Math.max(1, parseInt(process.env.MIN_PREV || '7', 10));
const OUT_PATH = process.env.OUT || resolve(process.cwd(), 'docs/audit-duplicate-questions-report.json');

// ---- Text similarity (content meaning proxy: word-set overlap) ----
function normalizeForSimilarity(text: string): string[] {
  const s = String(text || '')
    .toLowerCase()
    .replace(/\p{P}/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return s ? s.split(' ').filter((w) => w.length > 1) : [];
}

/** Jaccard on word sets: |A ∩ B| / |A ∪ B|. Returns 0..1. */
function wordSetSimilarity(a: string, b: string): number {
  const wa = new Set(normalizeForSimilarity(a));
  const wb = new Set(normalizeForSimilarity(b));
  if (wa.size === 0 && wb.size === 0) return 1;
  if (wa.size === 0 || wb.size === 0) return 0;
  let intersection = 0;
  for (const w of wa) {
    if (wb.has(w)) intersection++;
  }
  const union = wa.size + wb.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

/** Content-meaning similarity: use word-set Jaccard; optional boost for long overlap. */
function contentSimilarity(a: string, b: string): number {
  const sim = wordSetSimilarity(a, b);
  return sim;
}

// ---- Types ----
interface QDoc {
  _id: string;
  question: string;
  options: string[];
  lessonId: string;
}

interface DuplicatePair {
  questionIdA: string;
  questionIdB: string;
  lessonIdA: string;
  lessonIdB: string;
  similarity: number;
  snippetA: string;
  snippetB: string;
  action: 'create_new_question';
}

interface SimilarAnswerGroup {
  optionText: string;
  questionIds: string[];
  /** For fix script: which option index to rewrite in each question */
  optionOccurrences: Array<{ questionId: string; optionIndex: number }>;
  lessonIds: string[];
  count: number;
  action: 'rewrite_answers';
}

interface LessonReport {
  lessonId: string;
  dayNumber: number;
  courseId: string;
  questionCount: number;
  duplicatePairs: DuplicatePair[];
  similarAnswerGroups: SimilarAnswerGroup[];
}

interface AuditReport {
  runAt: string;
  courseIdFilter: string;
  similarityThreshold: number;
  minWindow: number;
  minPrev: number;
  byLesson: LessonReport[];
  summary: {
    lessonsProcessed: number;
    totalDuplicatePairs: number;
    totalSimilarAnswerGroups: number;
  };
}

// ---- Answer similarity: group options by similarity across the window ----
function findSimilarAnswerGroups(
  windowQuestions: Array<{ _id: string; lessonId: string; options: string[] }>,
  threshold: number
): SimilarAnswerGroup[] {
  const optionToQuestions: Array<{ text: string; questionId: string; lessonId: string; optionIndex: number }> = [];
  for (const q of windowQuestions) {
    (q.options || []).forEach((opt: string, idx: number) => {
      const t = String(opt || '').trim();
      if (t.length > 2) optionToQuestions.push({ text: t, questionId: q._id, lessonId: q.lessonId, optionIndex: idx });
    });
  }
  const groups: SimilarAnswerGroup[] = [];
  const used = new Set<number>();
  for (let i = 0; i < optionToQuestions.length; i++) {
    if (used.has(i)) continue;
    const a = optionToQuestions[i];
    const similar: typeof optionToQuestions = [a];
    used.add(i);
    for (let j = i + 1; j < optionToQuestions.length; j++) {
      if (used.has(j)) continue;
      const b = optionToQuestions[j];
      if (contentSimilarity(a.text, b.text) >= threshold) {
        similar.push(b);
        used.add(j);
      }
    }
    const uniqueByQuestion = new Map<string, { questionId: string; optionIndex: number }>();
    similar.forEach((s) => uniqueByQuestion.set(s.questionId, { questionId: s.questionId, optionIndex: s.optionIndex }));
    const uniqueLessonIds = [...new Set(similar.map((s) => s.lessonId))];
    if (uniqueByQuestion.size >= 3) {
      groups.push({
        optionText: a.text.slice(0, 80) + (a.text.length > 80 ? '…' : ''),
        questionIds: [...uniqueByQuestion.keys()],
        optionOccurrences: [...uniqueByQuestion.values()],
        lessonIds: uniqueLessonIds,
        count: uniqueByQuestion.size,
        action: 'rewrite_answers',
      });
    }
  }
  return groups;
}

async function main() {
  await connectDB();

  const courseFilter = COURSE_ID ? { courseId: COURSE_ID, isActive: true } : { isActive: true };
  const courses = await (Course as any).find(courseFilter).sort({ createdAt: 1 }).lean();
  const report: AuditReport = {
    runAt: new Date().toISOString(),
    courseIdFilter: COURSE_ID || '(all)',
    similarityThreshold: SIMILARITY_THRESHOLD,
    minWindow: MIN_WINDOW,
    minPrev: MIN_PREV,
    byLesson: [],
    summary: { lessonsProcessed: 0, totalDuplicatePairs: 0, totalSimilarAnswerGroups: 0 },
  };

  for (const course of courses) {
    const co = course as { _id: string; courseId: string };
    const lessons = await (Lesson as any)
      .find({ courseId: co._id, isActive: true })
      .sort({ dayNumber: 1, displayOrder: 1 })
      .select({ lessonId: 1, dayNumber: 1 })
      .lean();

    let prevWindow: QDoc[] = [];

    for (let i = 0; i < lessons.length; i++) {
      const les = lessons[i] as { lessonId: string; dayNumber: number };
      const currQuestions = await (QuizQuestion as any)
        .find({ lessonId: les.lessonId, isActive: true, isCourseSpecific: true })
        .select({ _id: 1, question: 1, options: 1, lessonId: 1 })
        .lean();

      const curr: QDoc[] = (currQuestions as any[]).map((d: any) => ({
        _id: d._id?.toString?.() || String(d._id),
        question: d.question || '',
        options: (d.options || []).map(String),
        lessonId: d.lessonId || les.lessonId,
      }));

      const window = [...prevWindow, ...curr];
      const duplicatePairs: DuplicatePair[] = [];

      // Within current lesson: pairwise question similarity
      for (let p = 0; p < curr.length; p++) {
        for (let q = p + 1; q < curr.length; q++) {
          const sim = contentSimilarity(curr[p].question, curr[q].question);
          if (sim >= SIMILARITY_THRESHOLD) {
            duplicatePairs.push({
              questionIdA: curr[p]._id,
              questionIdB: curr[q]._id,
              lessonIdA: curr[p].lessonId,
              lessonIdB: curr[q].lessonId,
              similarity: Math.round(sim * 1000) / 1000,
              snippetA: curr[p].question.slice(0, 80) + '…',
              snippetB: curr[q].question.slice(0, 80) + '…',
              action: 'create_new_question',
            });
          }
        }
      }

      // Current vs previous: pairwise question similarity
      for (const cq of curr) {
        for (const pq of prevWindow) {
          const sim = contentSimilarity(cq.question, pq.question);
          if (sim >= SIMILARITY_THRESHOLD) {
            duplicatePairs.push({
              questionIdA: pq._id,
              questionIdB: cq._id,
              lessonIdA: pq.lessonId,
              lessonIdB: cq.lessonId,
              similarity: Math.round(sim * 1000) / 1000,
              snippetA: pq.question.slice(0, 80) + '…',
              snippetB: cq.question.slice(0, 80) + '…',
              action: 'create_new_question',
            });
          }
        }
      }

      // Similar answers: only if window has at least MIN_WINDOW questions
      const windowForAnswers = window.length >= MIN_WINDOW ? window : [...prevWindow, ...curr];
      const similarAnswerGroups =
        windowForAnswers.length >= MIN_WINDOW
          ? findSimilarAnswerGroups(
              windowForAnswers.map((q) => ({ _id: q._id, lessonId: q.lessonId, options: q.options })),
              SIMILARITY_THRESHOLD
            )
          : [];

      report.byLesson.push({
        lessonId: les.lessonId,
        dayNumber: les.dayNumber,
        courseId: co.courseId,
        questionCount: curr.length,
        duplicatePairs,
        similarAnswerGroups,
      });
      report.summary.lessonsProcessed++;
      report.summary.totalDuplicatePairs += duplicatePairs.length;
      report.summary.totalSimilarAnswerGroups += similarAnswerGroups.length;

      // Sliding window for next lesson: previous = last MIN_PREV questions from this lesson
      prevWindow = curr.length >= MIN_PREV ? curr.slice(-MIN_PREV) : curr;
    }
  }

  const dir = resolve(OUT_PATH, '..');
  mkdirSync(dir, { recursive: true });
  writeFileSync(OUT_PATH, JSON.stringify(report, null, 2), 'utf-8');

  console.log('\nAudit: Duplicate/similar questions by lesson\n');
  console.log('Similarity threshold:', SIMILARITY_THRESHOLD);
  console.log('Min window:', MIN_WINDOW, '  Min prev:', MIN_PREV);
  console.log('Lessons processed:', report.summary.lessonsProcessed);
  console.log('Duplicate pairs (create new question):', report.summary.totalDuplicatePairs);
  console.log('Similar answer groups (rewrite answers):', report.summary.totalSimilarAnswerGroups);
  console.log('\nReport written to:', OUT_PATH);

  const withDuplicates = report.byLesson.filter((l) => l.duplicatePairs.length > 0);
  const withSimilarAnswers = report.byLesson.filter((l) => l.similarAnswerGroups.length > 0);
  if (withDuplicates.length > 0) {
    console.log('\nLessons with duplicate/similar questions:', withDuplicates.length);
    withDuplicates.slice(0, 5).forEach((l) => {
      console.log('  ', l.lessonId, 'day', l.dayNumber, '—', l.duplicatePairs.length, 'pairs');
    });
  }
  if (withSimilarAnswers.length > 0) {
    console.log('\nLessons with similar answers (3+ questions):', withSimilarAnswers.length);
    withSimilarAnswers.slice(0, 5).forEach((l) => {
      console.log('  ', l.lessonId, 'day', l.dayNumber, '—', l.similarAnswerGroups.length, 'groups');
    });
  }
  console.log('');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
