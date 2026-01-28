/**
 * Restore Course fields from a backup produced by scripts/backfill-ccs-from-courses.ts
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/restore-courses-from-backup.ts --file <backup.json>        # dry-run
 *   npx tsx --env-file=.env.local scripts/restore-courses-from-backup.ts --file <backup.json> --apply
 *   npx tsx --env-file=.env.local scripts/restore-courses-from-backup.ts --file <backup.json> --apply --delete-created-ccs
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { readFileSync } from 'fs';

config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../app/lib/mongodb';
import { CCS, Course } from '../app/lib/models';

function getArgValue(flag: string) {
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return undefined;
  return process.argv[idx + 1];
}

type BackupFile = {
  generatedAt: string;
  env?: string;
  action?: string;
  createdCcsIds?: string[];
  updates: Array<{
    courseId: string;
    prevCcsId: string | null;
    nextCcsId?: string;
  }>;
};

async function main() {
  const file = getArgValue('--file');
  const apply = process.argv.includes('--apply');
  const deleteCreatedCcs = process.argv.includes('--delete-created-ccs');

  if (!file) {
    console.error('Missing required flag: --file <backup.json>');
    process.exit(1);
  }

  const backup: BackupFile = JSON.parse(readFileSync(file, 'utf8'));
  if (!backup || !Array.isArray(backup.updates)) {
    console.error('Invalid backup file: missing updates[]');
    process.exit(1);
  }

  if (!apply) {
    console.log('Dry-run (no DB writes). Use --apply to restore.\n');
  }

  await connectDB();

  let restored = 0;
  for (const u of backup.updates) {
    const courseId = String(u.courseId || '').toUpperCase();
    const prev = u.prevCcsId ? String(u.prevCcsId).toUpperCase() : null;

    if (!courseId) continue;

    if (apply) {
      if (prev) {
        await Course.updateOne({ courseId }, { $set: { ccsId: prev } });
      } else {
        await Course.updateOne({ courseId }, { $unset: { ccsId: '' } });
      }
    }
    restored++;
  }

  console.log(`Courses processed: ${backup.updates.length}`);
  console.log(`Courses restored: ${restored}`);

  if (apply && deleteCreatedCcs && Array.isArray(backup.createdCcsIds) && backup.createdCcsIds.length > 0) {
    let deleted = 0;
    let skipped = 0;
    for (const ccsIdRaw of backup.createdCcsIds) {
      const ccsId = String(ccsIdRaw || '').toUpperCase();
      if (!ccsId) continue;
      const stillReferenced = await Course.exists({ ccsId });
      if (stillReferenced) {
        skipped++;
        continue;
      }
      await CCS.deleteOne({ ccsId });
      deleted++;
    }
    console.log(`CCS deleted: ${deleted}`);
    console.log(`CCS skipped (still referenced): ${skipped}`);
  }

  if (!apply) {
    console.log('\nRun with --apply to write to DB.');
  } else {
    console.log('\nRestore applied.');
  }
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

