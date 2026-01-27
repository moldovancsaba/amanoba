/**
 * Backfill CCS from existing courses
 *
 * What: Derives course families from courseId (e.g. PRODUCTIVITY_2026_HU → PRODUCTIVITY_2026),
 *       creates CCS docs if missing, sets course.ccsId on each course.
 * Why: Admin "By course family (CCS)" was empty because courses had no ccsId and the ccs
 *      collection was never seeded. See docs/2026-01-27_CCS_AUDIT_AND_BACKFILL_PLAN.md
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/backfill-ccs-from-courses.ts         # dry-run
 *   npx tsx --env-file=.env.local scripts/backfill-ccs-from-courses.ts --apply # write to DB
 */

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../app/lib/mongodb';
import { CCS, Course } from '../app/lib/models';

const LANG_SUFFIXES = ['hu', 'en', 'tr', 'bg', 'pl', 'vi', 'id', 'ar', 'pt', 'hi'];

function deriveCcsId(courseId: string): string | null {
  if (!courseId || typeof courseId !== 'string') return null;
  const upper = courseId.toUpperCase().trim();
  for (const lang of LANG_SUFFIXES) {
    const suffix = `_${lang.toUpperCase()}`;
    if (upper.endsWith(suffix)) {
      return upper.slice(0, -suffix.length);
    }
  }
  return null;
}

async function main() {
  const apply = process.argv.includes('--apply');
  if (!apply) {
    console.log('Dry-run (no DB writes). Use --apply to write.\n');
  }

  await connectDB();

  const courses = await Course.find({
    $or: [
      { parentCourseId: { $in: [null, undefined, ''] } },
      { parentCourseId: { $exists: false } },
    ],
  })
    .select('courseId ccsId name language')
    .lean();

  const byFamily = new Map<string, { courseId: string; currentCcsId?: string }[]>();
  for (const c of courses) {
    const cid = (c as { courseId: string }).courseId;
    const currentCcsId = (c as { ccsId?: string }).ccsId;
    const ccsId = currentCcsId || deriveCcsId(cid);
    if (!ccsId) continue;
    if (!byFamily.has(ccsId)) byFamily.set(ccsId, []);
    byFamily.get(ccsId)!.push({ courseId: cid, currentCcsId });
  }

  const existingCcs = await CCS.find({}).select('ccsId name').lean();
  const existingIds = new Set((existingCcs as { ccsId: string }[]).map((x) => x.ccsId));

  console.log('Families to backfill:', byFamily.size);
  for (const [ccsId, variants] of byFamily) {
    const createCcs = !existingIds.has(ccsId);
    const toUpdate = variants.filter((v) => v.currentCcsId !== ccsId);
    console.log(`  ${ccsId}: CCS ${createCcs ? 'CREATE' : 'exists'}, ${toUpdate.length} courses to set ccsId`);
    if (apply) {
      if (createCcs) {
        await CCS.create({ ccsId, name: ccsId });
        existingIds.add(ccsId);
      }
      if (toUpdate.length) {
        await Course.updateMany(
          { courseId: { $in: toUpdate.map((u) => u.courseId) } },
          { $set: { ccsId } }
        );
      }
    }
  }

  if (!apply) {
    console.log('\nRun with --apply to write to DB.');
  } else {
    console.log('\nBackfill applied.');
  }
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
