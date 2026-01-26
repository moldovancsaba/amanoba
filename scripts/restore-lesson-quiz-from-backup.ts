/**
 * Restore Lesson Quiz From Backup
 *
 * Purpose: Roll back a lesson quiz to a previously backed-up state.
 *
 * Input: A backup JSON created by the quiz pipeline / course processor:
 *   scripts/quiz-backups/<COURSE_ID>/<LESSON_ID>__<timestamp>.json
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/restore-lesson-quiz-from-backup.ts --file scripts/quiz-backups/COURSE_ID/LESSON_ID__TIMESTAMP.json
 *
 * Safety:
 * - Deletes current course-specific questions for that (course, lessonId), then inserts backup questions.
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { readFileSync } from 'fs';
import { randomUUID } from 'crypto';

config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../app/lib/mongodb';
import { Course, QuizQuestion } from '../app/lib/models';

function getArgValue(flag: string): string | undefined {
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return undefined;
  return process.argv[idx + 1];
}

type BackupFile = {
  backedUpAt?: string;
  course: { courseId: string; name?: string; language?: string };
  lesson: { dayNumber?: number; title?: string; lessonId: string };
  questionCount: number;
  questions: Array<{
    uuid?: string;
    questionType?: string;
    difficulty?: string;
    question: string;
    options: string[];
    correctIndex: number;
    hashtags?: string[];
  }>;
};

async function main() {
  const file = getArgValue('--file');
  if (!file) {
    console.error('❌ Missing --file');
    console.log('Usage: npx tsx --env-file=.env.local scripts/restore-lesson-quiz-from-backup.ts --file <path>');
    process.exit(1);
  }

  const data = JSON.parse(readFileSync(file, 'utf8')) as BackupFile;
  if (!data?.course?.courseId || !data?.lesson?.lessonId || !Array.isArray(data.questions)) {
    throw new Error('Invalid backup file format');
  }

  await connectDB();

  const course = await Course.findOne({ courseId: data.course.courseId }).lean();
  if (!course) throw new Error(`Course not found: ${data.course.courseId}`);

  const lessonId = data.lesson.lessonId;

  console.log(`🔁 Restoring quiz from backup`);
  console.log(`- File: ${file}`);
  console.log(`- Course: ${course.courseId}`);
  console.log(`- Lesson: ${lessonId}`);
  console.log(`- Questions in backup: ${data.questions.length}`);

  // Delete current questions for that lesson/course
  const del = await QuizQuestion.deleteMany({
    isCourseSpecific: true,
    courseId: course._id,
    lessonId,
  });

  const toInsert = data.questions.map(q => ({
    uuid: q.uuid || randomUUID(),
    lessonId,
    courseId: course._id,
    question: q.question,
    options: q.options,
    correctIndex: q.correctIndex,
    difficulty: q.difficulty || 'MEDIUM',
    category: 'Course Specific',
    isCourseSpecific: true,
    questionType: q.questionType,
    hashtags: Array.isArray(q.hashtags) ? q.hashtags : [],
    isActive: true,
    showCount: 0,
    correctCount: 0,
    metadata: {
      createdAt: new Date(),
      updatedAt: new Date(),
      auditedAt: new Date(),
      auditedBy: 'restore-lesson-quiz-from-backup',
    },
  }));

  const ins = await QuizQuestion.insertMany(toInsert, { ordered: true });

  console.log(`✅ Restore complete`);
  console.log(`- Deleted: ${del.deletedCount || 0}`);
  console.log(`- Inserted: ${ins.length}`);
}

main().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});

