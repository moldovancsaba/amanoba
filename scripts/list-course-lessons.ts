/**
 * List lessons for a given course (read-only helper).
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/list-course-lessons.ts --course <COURSE_ID>
 */

import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../app/lib/mongodb';
import { Course, Lesson } from '../app/lib/models';

function getArgValue(flag: string): string | undefined {
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return undefined;
  return process.argv[idx + 1];
}

async function main() {
  const courseIdRaw = getArgValue('--course');
  if (!courseIdRaw) throw new Error('Missing --course <COURSE_ID>');
  const courseId = String(courseIdRaw).toUpperCase();

  await connectDB();
  const course = await Course.findOne({ courseId }).select('_id courseId language durationDays').lean();
  if (!course) throw new Error(`Course not found: ${courseId}`);

  const lessons = await Lesson.find({ courseId: course._id })
    .select({ _id: 0, lessonId: 1, dayNumber: 1, title: 1, isActive: 1, createdAt: 1 })
    .sort({ dayNumber: 1, createdAt: 1, lessonId: 1 })
    .lean();

  console.log(`courseId=${courseId} language=${String(course.language || '')} durationDays=${Number(course.durationDays || 0)}`);
  for (const l of lessons as any[]) {
    console.log(
      `Day ${String(l.dayNumber).padStart(2, '0')} active=${Boolean(l.isActive)} lessonId=${String(l.lessonId || '')} — ${String(l.title || '')}`
    );
  }
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

