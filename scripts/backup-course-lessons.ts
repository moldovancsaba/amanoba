/**
 * Backup all lessons for a course into scripts/lesson-backups/<COURSE_ID>/.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/backup-course-lessons.ts --course <COURSE_ID>
 *   npx tsx --env-file=.env.local scripts/backup-course-lessons.ts --course <COURSE_ID> --out-dir scripts/lesson-backups
 */

import { config } from 'dotenv';
import { resolve, join } from 'path';
import { mkdirSync, writeFileSync } from 'fs';

config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../app/lib/mongodb';
import { Course, Lesson } from '../app/lib/models';

function getArgValue(flag: string): string | undefined {
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return undefined;
  return process.argv[idx + 1];
}

function isoStamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

async function main() {
  const courseIdRaw = getArgValue('--course');
  const outDir = getArgValue('--out-dir') || join(process.cwd(), 'scripts', 'lesson-backups');
  if (!courseIdRaw) throw new Error('Missing --course <COURSE_ID>');
  const courseId = String(courseIdRaw).toUpperCase();

  await connectDB();

  const course = await Course.findOne({ courseId }).select('_id courseId').lean();
  if (!course) throw new Error(`Course not found: ${courseId}`);

  const lessons = await Lesson.find({ courseId: course._id })
    .select({ _id: 0, lessonId: 1, title: 1, content: 1, emailSubject: 1, emailBody: 1 })
    .sort({ dayNumber: 1, displayOrder: 1, createdAt: 1, lessonId: 1 })
    .lean();

  const stamp = isoStamp();
  const courseFolder = join(outDir, courseId);
  mkdirSync(courseFolder, { recursive: true });

  for (const l of lessons as any[]) {
    const lessonId = String(l.lessonId || '');
    if (!lessonId) continue;
    const payload = {
      generatedAt: new Date().toISOString(),
      courseId,
      lessonId,
      title: l.title || '',
      content: String(l.content || ''),
      emailSubject: String(l.emailSubject || ''),
      emailBody: String(l.emailBody || ''),
    };
    const filePath = join(courseFolder, `${lessonId}__${stamp}.json`);
    writeFileSync(filePath, JSON.stringify(payload, null, 2));
  }

  console.log('✅ Lesson backups complete');
  console.log(`- courseId: ${courseId}`);
  console.log(`- lessons: ${lessons.length}`);
  console.log(`- outDir: ${courseFolder}`);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
