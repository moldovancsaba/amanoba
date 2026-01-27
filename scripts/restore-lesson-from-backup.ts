/**
 * Restore a Lesson from a Backup JSON file
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/restore-lesson-from-backup.ts --file scripts/lesson-backups/COURSE_ID/LESSON_ID__TIMESTAMP.json
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { readFileSync } from 'fs';

config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../app/lib/mongodb';
import { Lesson } from '../app/lib/models';

function getArgValue(flag: string): string | undefined {
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return undefined;
  return process.argv[idx + 1];
}

const FILE = getArgValue('--file');

async function main() {
  if (!FILE) throw new Error('Missing --file <backup.json>');

  const raw = readFileSync(FILE, 'utf8');
  const backup = JSON.parse(raw);

  if (!backup.lessonId) throw new Error('Backup file missing lessonId');
  if (typeof backup.content !== 'string') throw new Error('Backup file missing content');

  await connectDB();

  const update = await Lesson.updateOne(
    { lessonId: backup.lessonId },
    {
      $set: {
        title: backup.title,
        content: backup.content,
        emailSubject: backup.emailSubject,
        emailBody: backup.emailBody,
        'metadata.updatedAt': new Date(),
      },
    }
  );

  console.log('✅ Lesson restore complete');
  console.log(`- File: ${FILE}`);
  console.log(`- lessonId: ${backup.lessonId}`);
  console.log(`- matched: ${update.matchedCount}`);
  console.log(`- modified: ${update.modifiedCount}`);

  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

