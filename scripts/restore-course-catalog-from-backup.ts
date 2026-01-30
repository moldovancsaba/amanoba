/**
 * Restore course catalog fields (name/description/translations) from a backup.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/restore-course-catalog-from-backup.ts --file <backup.json>        # dry-run
 *   npx tsx --env-file=.env.local scripts/restore-course-catalog-from-backup.ts --file <backup.json> --apply
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { readFileSync } from 'fs';

config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../app/lib/mongodb';
import { Course } from '../app/lib/models';

function getArgValue(flag: string): string | undefined {
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return undefined;
  return process.argv[idx + 1];
}

type Backup = {
  backedUpAt: string;
  courseId: string;
  language?: string | null;
  name?: string | null;
  description?: string | null;
  translations?: any;
};

async function main() {
  const file = getArgValue('--file');
  const apply = process.argv.includes('--apply');

  if (!file) throw new Error('Missing --file <backup.json>');

  const backup: Backup = JSON.parse(readFileSync(file, 'utf8'));
  const courseId = String(backup.courseId || '').toUpperCase();
  if (!courseId) throw new Error('Invalid backup file: missing courseId');

  if (!apply) {
    console.log('Dry-run (no DB writes). Use --apply to restore.\n');
  }

  await connectDB();

  const update: any = { $set: {}, $unset: {} };
  if (backup.name === null || typeof backup.name === 'undefined') update.$unset.name = '';
  else update.$set.name = backup.name;

  if (backup.description === null || typeof backup.description === 'undefined') update.$unset.description = '';
  else update.$set.description = backup.description;

  if (backup.translations === null || typeof backup.translations === 'undefined') update.$unset.translations = '';
  else update.$set.translations = backup.translations;

  if (Object.keys(update.$set).length === 0) delete update.$set;
  if (Object.keys(update.$unset).length === 0) delete update.$unset;

  if (apply) {
    await Course.updateOne({ courseId }, update).exec();
  }

  console.log('✅ Course catalog restore processed');
  console.log(`- courseId: ${courseId}`);
  console.log(`- mode: ${apply ? 'APPLY' : 'DRY-RUN'}`);
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

