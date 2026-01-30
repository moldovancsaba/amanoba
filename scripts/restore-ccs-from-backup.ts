/**
 * Restore CCS fields from a backup produced by scripts/backfill-ccs-idea-outline.ts
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/restore-ccs-from-backup.ts --file <backup.json>        # dry-run
 *   npx tsx --env-file=.env.local scripts/restore-ccs-from-backup.ts --file <backup.json> --apply
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { readFileSync } from 'fs';

config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../app/lib/mongodb';
import { CCS } from '../app/lib/models';

function getArgValue(flag: string) {
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return undefined;
  return process.argv[idx + 1];
}

type BackupFile = {
  generatedAt: string;
  env?: string;
  action?: string;
  ccs: Array<{
    ccsId: string;
    name?: string | null;
    idea?: string | null;
    outline?: string | null;
    relatedDocuments?: any[];
  }>;
};

async function main() {
  const file = getArgValue('--file');
  const apply = process.argv.includes('--apply');

  if (!file) {
    console.error('Missing required flag: --file <backup.json>');
    process.exit(1);
  }

  const backup: BackupFile = JSON.parse(readFileSync(file, 'utf8'));
  if (!backup || !Array.isArray(backup.ccs)) {
    console.error('Invalid backup file: missing ccs[]');
    process.exit(1);
  }

  if (!apply) {
    console.log('Dry-run (no DB writes). Use --apply to restore.\n');
  }

  await connectDB();

  let restored = 0;
  for (const item of backup.ccs) {
    const ccsId = String(item.ccsId || '').toUpperCase();
    if (!ccsId) continue;

    const $set: Record<string, unknown> = {};
    const $unset: Record<string, unknown> = {};

    if (item.name == null || String(item.name).trim() === '') $unset.name = '';
    else $set.name = String(item.name);

    if (item.idea == null || String(item.idea).trim() === '') $unset.idea = '';
    else $set.idea = String(item.idea);

    if (item.outline == null || String(item.outline).trim() === '') $unset.outline = '';
    else $set.outline = String(item.outline);

    if (item.relatedDocuments == null) $unset.relatedDocuments = '';
    else $set.relatedDocuments = item.relatedDocuments;

    if (apply) {
      const update: any = {};
      if (Object.keys($set).length > 0) update.$set = $set;
      if (Object.keys($unset).length > 0) update.$unset = $unset;
      if (Object.keys(update).length > 0) {
        await CCS.updateOne({ ccsId }, update);
      }
    }
    restored++;
  }

  console.log(`CCS records in backup: ${backup.ccs.length}`);
  console.log(`CCS processed: ${restored}`);

  if (!apply) console.log('\nRun with --apply to write to DB.');
  else console.log('\nRestore applied.');

  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

