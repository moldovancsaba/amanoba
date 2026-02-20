/**
 * Create CCS (course family) for Generative AI 2026 and link all related courses.
 * Run once so "By course family (CCS)" in Admin → Courses shows the family.
 *
 * Usage: npx tsx --env-file=.env.local scripts/seed-ccs-generative-ai-2026.ts [--apply]
 */

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../app/lib/mongodb';
import { CCS, Course } from '../app/lib/models';

const CCS_ID = 'GENERATIVE_AI_APPS_AGENTS_2026';
const CCS_NAME = 'Generative AI 2026: Build AI Apps and Agents';

async function main() {
  const apply = process.argv.includes('--apply');
  if (!apply) {
    console.log('Dry-run. Use --apply to create CCS and set course.ccsId.\n');
  }

  await connectDB();

  const existing = await CCS.findOne({ ccsId: CCS_ID }).lean();
  const courses = await Course.find({
    $or: [
      { courseId: new RegExp(`^${CCS_ID}`, 'i') },
      { courseId: CCS_ID },
    ],
  })
    .select('courseId name ccsId language durationDays')
    .lean();

  console.log(`CCS: ${CCS_ID} (${CCS_NAME})`);
  console.log(`  CCS document: ${existing ? 'exists' : 'will CREATE'}`);
  console.log(`  Courses matching pattern: ${courses.length}`);
  courses.forEach((c: { courseId: string; ccsId?: string; name?: string }) => {
    console.log(`    - ${c.courseId} (ccsId: ${c.ccsId || '—'})`);
  });

  if (apply) {
    if (!existing) {
      await CCS.create({ ccsId: CCS_ID, name: CCS_NAME });
      console.log(`  Created CCS ${CCS_ID}`);
    }
    if (courses.length) {
      const updated = await Course.updateMany(
        { courseId: new RegExp(`^${CCS_ID}`, 'i') },
        { $set: { ccsId: CCS_ID } }
      );
      console.log(`  Updated ${updated.modifiedCount} course(s) with ccsId=${CCS_ID}`);
    }
    console.log('\nDone. Refresh Admin → Courses → By course family (CCS) to see the family.');
  } else {
    console.log('\nRun with --apply to write to DB.');
  }
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
