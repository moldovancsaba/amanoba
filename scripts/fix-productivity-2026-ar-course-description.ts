/**
 * Fix PRODUCTIVITY_2026_AR catalog description to satisfy Arabic language integrity.
 *
 * Problem:
 * - Latin words inside Arabic description (e.g., "GTD", "Kanban") cause catalog + email gating failures.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/fix-productivity-2026-ar-course-description.ts
 *   npx tsx --env-file=.env.local scripts/fix-productivity-2026-ar-course-description.ts --apply
 */

import { config } from 'dotenv';
import { resolve, join } from 'path';
import { mkdirSync, writeFileSync } from 'fs';

config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../app/lib/mongodb';
import { Course } from '../app/lib/models';

const COURSE_ID = 'PRODUCTIVITY_2026_AR';

function hasFlag(flag: string) {
  return process.argv.includes(flag);
}

function isoStamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

async function main() {
  const apply = hasFlag('--apply');

  await connectDB();

  const course = await Course.findOne({ courseId: COURSE_ID }).select({ courseId: 1, language: 1, description: 1 }).lean();
  if (!course) throw new Error(`Course not found: ${COURSE_ID}`);

  const prevDescription = String((course as any).description || '');

  const nextDescription =
    'دورة عملية لمدة 30 يومًا حول أساسيات الإنتاجية وإدارة المهام (جي تي دي) والأولويات وكانبان والطرق الرشيقة والتخطيط الاستراتيجي. دروس يومية من 20-30 دقيقة مع أدوات وقوالب ملموسة.';

  const outDir = join(process.cwd(), 'scripts', 'course-backups');
  mkdirSync(outDir, { recursive: true });
  const stamp = isoStamp();
  const backupPath = join(outDir, `course-catalog__${COURSE_ID}__${stamp}.json`);

  writeFileSync(
    backupPath,
    JSON.stringify(
      {
        backedUpAt: new Date().toISOString(),
        courseId: COURSE_ID,
        language: course.language || null,
        description: prevDescription,
      },
      null,
      2
    )
  );

  if (!apply) {
    console.log('DRY-RUN (no DB writes)');
    console.log(`- Backup: ${backupPath}`);
    console.log(`- Would update ${COURSE_ID} description`);
    console.log(`- Rollback: npx tsx --env-file=.env.local scripts/restore-course-catalog-from-backup.ts --file ${backupPath} --apply`);
    process.exit(0);
  }

  await Course.updateOne({ courseId: COURSE_ID }, { $set: { description: nextDescription } }).exec();

  console.log('✅ Updated course description');
  console.log(`- courseId: ${COURSE_ID}`);
  console.log(`- Backup: ${backupPath}`);
  console.log(`- Rollback: npx tsx --env-file=.env.local scripts/restore-course-catalog-from-backup.ts --file ${backupPath} --apply`);
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

