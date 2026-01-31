/**
 * AI_30_NAP — Spot fixes for remaining lesson language-integrity failures.
 *
 * Focus:
 * - Remove/translate injected English sentence fragments that trip the integrity gate.
 *
 * Safety:
 * - Dry-run by default (no DB writes).
 * - On apply: per-lesson backups under scripts/lesson-backups/AI_30_NAP/.
 * - Restore via scripts/restore-lesson-from-backup.ts
 *
 * Usage:
 * - Dry-run:
 *   npx tsx --env-file=.env.local scripts/fix-ai-30-nap-language-integrity-spot-fixes.ts
 * - Apply:
 *   npx tsx --env-file=.env.local scripts/fix-ai-30-nap-language-integrity-spot-fixes.ts --apply
 */

import { config } from 'dotenv';
import { resolve, join } from 'path';
import { mkdirSync, writeFileSync } from 'fs';

config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../app/lib/mongodb';
import { Course, Lesson } from '../app/lib/models';
import { validateLessonRecordLanguageIntegrity } from './language-integrity';

const APPLY = process.argv.includes('--apply');

function isoStamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

type Fix = {
  courseId: string;
  language: string;
  day: number;
  replacements: Array<{ label: string; apply: (s: string) => string }>;
};

const FIXES: Fix[] = [
  {
    courseId: 'AI_30_NAP',
    language: 'hu',
    day: 11,
    replacements: [
      {
        label: 'Translate injected English phrase: "What worked / what to improve"',
        apply: (s) =>
          s
            // straight quotes
            .replace(/"What worked\s*\/\s*what to improve"/g, '"Mi működött / min javítanál"')
            // curly quotes
            .replace(/„What worked\s*\/\s*what to improve”/g, '„Mi működött / min javítanál”')
            .replace(/“What worked\s*\/\s*what to improve”/g, '“Mi működött / min javítanál”'),
      },
    ],
  },
];

function applyReplacements(input: string | null | undefined, replacements: Fix['replacements']) {
  let next = String(input ?? '');
  for (const r of replacements) next = r.apply(next);
  return next;
}

async function main() {
  await connectDB();

  const stamp = isoStamp();
  const backupsRoot = join(process.cwd(), 'scripts', 'lesson-backups');
  const updated: Array<{ courseId: string; day: number; lessonId: string; backupPath?: string }> = [];

  for (const fix of FIXES) {
    const course = await Course.findOne({ courseId: fix.courseId, isActive: true }).lean();
    if (!course) throw new Error(`Course not found: ${fix.courseId}`);

    const lessons = await Lesson.find({ courseId: course._id, isActive: true })
      .sort({ dayNumber: 1, displayOrder: 1, createdAt: 1, _id: 1 })
      .select({ _id: 1, lessonId: 1, dayNumber: 1, title: 1, content: 1, emailSubject: 1, emailBody: 1, createdAt: 1 })
      .lean();

    // Deduplicate by dayNumber (keep oldest record per day)
    const byDay = new Map<number, any>();
    for (const lesson of lessons) {
      const existing = byDay.get(lesson.dayNumber);
      if (!existing) {
        byDay.set(lesson.dayNumber, lesson);
        continue;
      }
      const a = existing.createdAt ? new Date(existing.createdAt).getTime() : 0;
      const b = lesson.createdAt ? new Date(lesson.createdAt).getTime() : 0;
      if (b < a) byDay.set(lesson.dayNumber, lesson);
    }

    const lesson = byDay.get(fix.day);
    if (!lesson) {
      console.log(`⚠️  Missing lesson: ${fix.courseId} day ${fix.day}`);
      continue;
    }

    const old = {
      title: String(lesson.title || ''),
      content: String(lesson.content || ''),
      emailSubject: lesson.emailSubject || null,
      emailBody: lesson.emailBody || null,
    };

    const next = {
      title: old.title,
      content: applyReplacements(old.content, fix.replacements),
      emailSubject: old.emailSubject ? applyReplacements(old.emailSubject, fix.replacements) : null,
      emailBody: old.emailBody ? applyReplacements(old.emailBody, fix.replacements) : null,
    };

    const integrity = validateLessonRecordLanguageIntegrity({
      language: fix.language,
      content: next.content,
      emailSubject: next.emailSubject,
      emailBody: next.emailBody,
    });
    if (!integrity.ok) {
      throw new Error(
        `Language integrity still fails for ${fix.courseId} day ${fix.day} (${lesson.lessonId}): ${integrity.errors[0] || 'unknown'}`
      );
    }

    const changed =
      next.content !== old.content || next.emailSubject !== old.emailSubject || next.emailBody !== old.emailBody || next.title !== old.title;
    console.log(`- ${fix.courseId} Day ${fix.day}: ${changed ? 'WILL_UPDATE' : 'NO_CHANGE'} (${lesson.lessonId})`);
    if (!changed) continue;

    if (!APPLY) {
      updated.push({ courseId: fix.courseId, day: fix.day, lessonId: lesson.lessonId });
      continue;
    }

    const backupDir = join(backupsRoot, fix.courseId);
    mkdirSync(backupDir, { recursive: true });
    const backupPath = join(backupDir, `${lesson.lessonId}__${stamp}.json`);
    writeFileSync(
      backupPath,
      JSON.stringify(
        {
          courseId: fix.courseId,
          language: fix.language,
          dayNumber: fix.day,
          lessonId: lesson.lessonId,
          title: old.title,
          content: old.content,
          emailSubject: old.emailSubject,
          emailBody: old.emailBody,
          createdAt: lesson.createdAt,
        },
        null,
        2
      ),
      'utf8'
    );

    const res = await Lesson.updateOne(
      { _id: lesson._id },
      { $set: { title: next.title, content: next.content, emailSubject: next.emailSubject, emailBody: next.emailBody } }
    );
    if (res.matchedCount !== 1) throw new Error(`Update failed for ${lesson.lessonId}: matched=${res.matchedCount}`);

    updated.push({ courseId: fix.courseId, day: fix.day, lessonId: lesson.lessonId, backupPath });
  }

  if (updated.length === 0) {
    console.log('✅ No updates needed.');
    process.exit(0);
  }

  console.log(`✅ ${APPLY ? 'Applied' : 'Planned'} ${updated.length} update(s).`);
  for (const u of updated) {
    console.log(`- ${u.courseId} day ${u.day} (${u.lessonId})${u.backupPath ? ` backup=${u.backupPath}` : ''}`);
  }

  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
