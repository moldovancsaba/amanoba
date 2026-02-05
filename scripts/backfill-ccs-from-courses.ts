/**
 * Backfill CCS from existing courses
 *
 * What: Derives course families from courseId (e.g. PRODUCTIVITY_2026_HU → PRODUCTIVITY_2026),
 *       creates CCS docs if missing, sets course.ccsId on each course.
 * Why: Admin "By course family (CCS)" was empty because courses had no ccsId and the ccs
 *      collection was never seeded. See docs/_archive/delivery/2026-01/2026-01-27_CCS_AUDIT_AND_BACKFILL_PLAN.md
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/backfill-ccs-from-courses.ts         # dry-run
 *   npx tsx --env-file=.env.local scripts/backfill-ccs-from-courses.ts --apply # write to DB
 */

import { config } from 'dotenv';
import { resolve, join } from 'path';
import { mkdirSync, writeFileSync } from 'fs';
config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../app/lib/mongodb';
import { CCS, Course } from '../app/lib/models';
import { locales } from '../app/lib/i18n/locales';

const LOCALE_SUFFIXES = locales.map(l => String(l).toLowerCase());

function deriveCcsId(courseId: string): string | null {
  if (!courseId || typeof courseId !== 'string') return null;
  const upper = courseId.toUpperCase().trim();
  for (const lang of LOCALE_SUFFIXES) {
    const suffix = `_${lang.toUpperCase()}`;
    if (upper.endsWith(suffix)) {
      return upper.slice(0, -suffix.length);
    }
  }
  return null;
}

function isValidCcsId(id: string) {
  return /^[A-Z0-9_]+$/.test(String(id || ''));
}

async function main() {
  const apply = process.argv.includes('--apply');
  const backupDirArgIdx = process.argv.indexOf('--backup-dir');
  const backupDir =
    backupDirArgIdx !== -1 ? process.argv[backupDirArgIdx + 1] : join(process.cwd(), 'scripts', 'course-backups');

  if (!apply) {
    console.log('Dry-run (no DB writes). Use --apply to write.\n');
  }

  await connectDB();

  const courses = await Course.find({})
    .select('courseId ccsId name language parentCourseId durationDays')
    .lean();

  const existingCcs = await CCS.find({}).select('ccsId name').lean();
  const existingIds = new Set((existingCcs as { ccsId: string }[]).map((x) => x.ccsId));

  const byCourseId = new Map<string, any>();
  for (const c of courses) byCourseId.set(String((c as any).courseId || '').toUpperCase(), c);

  const byFamily = new Map<string, { courseId: string; currentCcsId?: string }[]>();
  const unmapped: Array<{ courseId: string; language?: string; parentCourseId?: string | null }> = [];

  for (const c of courses) {
    const cid = (c as { courseId: string }).courseId;
    const currentCcsId = (c as { ccsId?: string }).ccsId;

    let inferred = currentCcsId || deriveCcsId(cid);

    // Handle base courses where courseId itself is the CCS id (e.g. GEO_SHOPIFY_30).
    if (!inferred) {
      const upperCourseId = String(cid || '').toUpperCase();
      if (existingIds.has(upperCourseId)) inferred = upperCourseId;
    }

    // Shorts inherit CCS from their parent courseId (if present).
    if (!inferred && (c as any).parentCourseId) {
      const parent = byCourseId.get(String((c as any).parentCourseId || '').toUpperCase());
      const parentCcsId = parent?.ccsId ? String(parent.ccsId).toUpperCase() : null;
      inferred = parentCcsId || deriveCcsId(String((c as any).parentCourseId));
    }

    if (!inferred || !isValidCcsId(inferred)) {
      unmapped.push({
        courseId: String(cid),
        language: String((c as any).language || ''),
        parentCourseId: (c as any).parentCourseId || null,
      });
      continue;
    }

    const ccsId = String(inferred).toUpperCase();
    if (!byFamily.has(ccsId)) byFamily.set(ccsId, []);
    byFamily.get(ccsId)!.push({ courseId: cid, currentCcsId });
  }

  console.log('Families to backfill:', byFamily.size);

  const planned = Array.from(byFamily.entries()).map(([ccsId, variants]) => {
    const createCcs = !existingIds.has(ccsId);
    const toUpdate = variants
      .filter((v) => v.currentCcsId !== ccsId)
      .map((v) => ({
        courseId: v.courseId,
        prevCcsId: v.currentCcsId ?? null,
        nextCcsId: ccsId,
      }));
    return { ccsId, createCcs, toUpdate };
  });

  const backupPayload = {
    generatedAt: new Date().toISOString(),
    env: 'production (via .env.local)',
    action: 'backfill-ccs-from-courses',
    createdCcsIds: planned.filter((p) => p.createCcs).map((p) => p.ccsId),
    updates: planned.flatMap((p) => p.toUpdate),
  };

  if (apply) {
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    mkdirSync(backupDir, { recursive: true });
    const backupPath = join(backupDir, `backfill-ccs-from-courses__${stamp}.json`);
    writeFileSync(backupPath, JSON.stringify(backupPayload, null, 2));
    console.log(`Backup written: ${backupPath}`);
    console.log(`Rollback (dry-run): npx tsx --env-file=.env.local scripts/restore-courses-from-backup.ts --file ${backupPath}`);
    console.log(`Rollback (apply):   npx tsx --env-file=.env.local scripts/restore-courses-from-backup.ts --file ${backupPath} --apply`);
    console.log('');
  }

  for (const p of planned) {
    const { ccsId, createCcs, toUpdate } = p;
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

  if (unmapped.length > 0) {
    console.log(`\nUnmapped courses (could not infer ccsId): ${unmapped.length}`);
    for (const u of unmapped) {
      console.log(`  - ${u.courseId} (${u.language || 'unknown'}) parentCourseId=${u.parentCourseId || '—'}`);
    }
  }
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
