/**
 * Publish (activate) SCRUMMASTER_LESZEK_2026_HU Day 10 lesson (backup-first).
 *
 * Usage:
 * - Dry-run:
 *   npx tsx --env-file=.env.local scripts/publish-scrummaster-leszek-2026-hu-day-10.ts
 * - Apply (DB write + backup):
 *   npx tsx --env-file=.env.local scripts/publish-scrummaster-leszek-2026-hu-day-10.ts --apply
 */

import { config } from 'dotenv';
import { resolve, join } from 'path';
import { mkdirSync, writeFileSync } from 'fs';
import mongoose from 'mongoose';

config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../app/lib/mongodb';
import { Course, Lesson } from '../app/lib/models';

const COURSE_ID = 'SCRUMMASTER_LESZEK_2026_HU';
const LESSON_ID = 'SCRUMMASTER_LESZEK_2026_HU_DAY_10';

function hasFlag(flag: string) {
  return process.argv.includes(flag);
}

function isoStamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

const APPLY = hasFlag('--apply');

async function main() {
  await connectDB();

  const course = await Course.findOne({ courseId: COURSE_ID }).lean();
  if (!course) throw new Error(`Course not found: ${COURSE_ID}`);

  const lesson = await Lesson.findOne({ lessonId: LESSON_ID }).lean();
  if (!lesson) throw new Error(`Lesson not found: ${LESSON_ID}`);

  const stamp = isoStamp();
  const backupDir = join(process.cwd(), 'scripts', 'course-backups', COURSE_ID);
  const backupFile = join(backupDir, `publish-day-10__${stamp}.json`);

  const backupPayload = {
    generatedAt: new Date().toISOString(),
    courseId: COURSE_ID,
    lessonId: LESSON_ID,
    course: {
      courseId: String((course as any).courseId ?? ''),
      isActive: Boolean((course as any).isActive),
      requiresPremium: Boolean((course as any).requiresPremium),
    },
    lesson: {
      lessonId: String((lesson as any).lessonId ?? ''),
      isActive: Boolean((lesson as any).isActive),
      dayNumber: Number((lesson as any).dayNumber ?? -1),
      title: String((lesson as any).title ?? ''),
    },
  };

  if (!APPLY) {
    console.log('DRY RUN (no DB writes).');
    console.log(`- courseId: ${COURSE_ID}`);
    console.log(`- lessonId: ${LESSON_ID}`);
    console.log(`- current course.isActive: ${backupPayload.course.isActive}`);
    console.log(`- current lesson.isActive: ${backupPayload.lesson.isActive}`);
    console.log(`- would backup to: ${backupFile}`);
    console.log(`- would set lesson.isActive=true (course remains as-is)`);
    await mongoose.disconnect();
    return;
  }

  mkdirSync(backupDir, { recursive: true });
  writeFileSync(backupFile, JSON.stringify(backupPayload, null, 2));

  const lessonUpdate = await Lesson.updateOne({ lessonId: LESSON_ID }, { $set: { isActive: true } });

  console.log('✅ Published Day 10');
  console.log(`- courseId: ${COURSE_ID}`);
  console.log(`- lessonId: ${LESSON_ID}`);
  console.log(`- lesson matched: ${lessonUpdate.matchedCount}, modified: ${lessonUpdate.modifiedCount}`);
  console.log(`- backup: ${backupFile}`);

  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

