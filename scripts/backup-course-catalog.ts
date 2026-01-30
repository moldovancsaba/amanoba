/**
 * Backup course catalog fields (name/description/translations) for safe rollback.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/backup-course-catalog.ts --course <COURSE_ID>
 */

import { config } from 'dotenv';
import { resolve, join } from 'path';
import { mkdirSync, writeFileSync } from 'fs';

config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../app/lib/mongodb';
import { Course } from '../app/lib/models';

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
  if (!courseIdRaw) throw new Error('Missing --course <COURSE_ID>');
  const courseId = String(courseIdRaw).toUpperCase();

  const outDir = getArgValue('--out-dir') || join(process.cwd(), 'scripts', 'course-backups');
  mkdirSync(outDir, { recursive: true });

  await connectDB();

  const course = await Course.findOne({ courseId })
    .select({ _id: 0, courseId: 1, language: 1, name: 1, description: 1, translations: 1 })
    .lean();
  if (!course) throw new Error(`Course not found: ${courseId}`);

  const stamp = isoStamp();
  const filePath = join(outDir, `course-catalog__${courseId}__${stamp}.json`);

  writeFileSync(
    filePath,
    JSON.stringify(
      {
        backedUpAt: new Date().toISOString(),
        courseId,
        language: course.language || null,
        name: course.name || null,
        description: course.description || null,
        translations: (course as any).translations || null,
      },
      null,
      2
    )
  );

  console.log('✅ Course catalog backup complete');
  console.log(`- courseId: ${courseId}`);
  console.log(`- file: ${filePath}`);
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

