/**
 * Productivity 2026 — Spot fixes for remaining lesson language-integrity failures.
 *
 * Focus:
 * - Remove English book-title leakage ("How to Fail at Almost Everything") from non-EN lessons.
 * - Replace English instruction-starter tokens ("Plan:", "Design ...:") that trip our integrity gate.
 *
 * Safety:
 * - Dry-run by default (no DB writes).
 * - On apply: per-lesson backups under scripts/lesson-backups/<COURSE_ID>/.
 *
 * Usage:
 * - Dry-run:
 *   npx tsx --env-file=.env.local scripts/fix-productivity-2026-language-integrity-spot-fixes.ts
 * - Apply:
 *   npx tsx --env-file=.env.local scripts/fix-productivity-2026-language-integrity-spot-fixes.ts --apply
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
    courseId: 'PRODUCTIVITY_2026_PL',
    language: 'pl',
    day: 4,
    replacements: [
      {
        label: 'Remove English book title',
        apply: (s) =>
          s.replace(
            /Scott Adams:\s*["“][^"”]+["”]\s*—\s*o systemach/gi,
            'Scott Adams: o budowaniu systemów zamiast motywacji'
          ),
      },
    ],
  },
  {
    courseId: 'PRODUCTIVITY_2026_PL',
    language: 'pl',
    day: 5,
    replacements: [
      { label: '<strong>Plan</strong> -> <strong>Zadanie</strong>', apply: (s) => s.replace(/<strong>\s*Plan\s*<\/strong>/g, '<strong>Zadanie</strong>') },
      { label: 'Plan -> Zadanie', apply: (s) => s.replace(/\bPlan\s*:\s*/g, 'Zadanie: ') },
    ],
  },
  {
    courseId: 'PRODUCTIVITY_2026_PL',
    language: 'pl',
    day: 9,
    replacements: [
      { label: '<strong>Plan</strong> -> <strong>Zadanie</strong>', apply: (s) => s.replace(/<strong>\s*Plan\s*<\/strong>/g, '<strong>Zadanie</strong>') },
      { label: 'Plan -> Zadanie', apply: (s) => s.replace(/\bPlan\s*:\s*/g, 'Zadanie: ') },
    ],
  },
  {
    courseId: 'PRODUCTIVITY_2026_PT',
    language: 'pt',
    day: 2,
    replacements: [
      {
        label: '<strong>Design do ambiente</strong> -> <strong>Projeto do ambiente</strong>',
        apply: (s) => s.replace(/<strong>\s*Design do ambiente\s*<\/strong>/gi, '<strong>Projeto do ambiente</strong>'),
      },
      { label: 'Design do ambiente -> Projeto do ambiente', apply: (s) => s.replace(/\bDesign do ambiente\s*:\s*/gi, 'Projeto do ambiente: ') },
      {
        label: '<strong>Design de agenda diária</strong> -> <strong>Projeto de agenda diária</strong>',
        apply: (s) => s.replace(/<strong>\s*Design de agenda diária\s*<\/strong>/gi, '<strong>Projeto de agenda diária</strong>'),
      },
      { label: 'Design de agenda diária -> Projeto de agenda diária', apply: (s) => s.replace(/\bDesign de agenda diária\s*:\s*/gi, 'Projeto de agenda diária: ') },
    ],
  },
  {
    courseId: 'PRODUCTIVITY_2026_PT',
    language: 'pt',
    day: 4,
    replacements: [
      {
        label: '<strong>Design do sistema</strong> -> <strong>Projeto do sistema</strong>',
        apply: (s) => s.replace(/<strong>\s*Design do sistema\s*<\/strong>/gi, '<strong>Projeto do sistema</strong>'),
      },
      { label: 'Design do sistema -> Projeto do sistema', apply: (s) => s.replace(/\bDesign do sistema\s*:\s*/gi, 'Projeto do sistema: ') },
      {
        label: 'Remove English book title',
        apply: (s) =>
          s.replace(
            /Scott Adams:\s*["“][^"”]+["”]\s*—\s*sobre sistemas/gi,
            'Scott Adams: sobre construir sistemas sem depender da motivação'
          ),
      },
    ],
  },
  {
    courseId: 'PRODUCTIVITY_2026_ID',
    language: 'id',
    day: 4,
    replacements: [
      {
        label: 'Remove English book title',
        apply: (s) =>
          s.replace(
            /Scott Adams:\s*["“][^"”]+["”]\s*—\s*tentang sistem/gi,
            'Scott Adams: tentang membangun sistem, bukan mengandalkan motivasi'
          ),
      },
    ],
  },
  {
    courseId: 'PRODUCTIVITY_2026_VI',
    language: 'vi',
    day: 4,
    replacements: [
      {
        label: 'Remove English book title',
        apply: (s) =>
          s.replace(
            /Scott Adams:\s*["“][^"”]+["”]\s*—\s*về hệ thống/gi,
            'Scott Adams: về cách xây hệ thống thay vì dựa vào động lực'
          ),
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

    const courseBackupDir = join(backupsRoot, fix.courseId);
    mkdirSync(courseBackupDir, { recursive: true });
    const backupPath = join(courseBackupDir, `${lesson.lessonId}__${stamp}.json`);
    writeFileSync(
      backupPath,
      JSON.stringify(
        {
          backedUpAt: new Date().toISOString(),
          courseId: fix.courseId,
          lessonId: lesson.lessonId,
          dayNumber: lesson.dayNumber,
          title: old.title,
          content: old.content,
          emailSubject: old.emailSubject,
          emailBody: old.emailBody,
        },
        null,
        2
      )
    );

    const res = await Lesson.updateOne(
      { _id: lesson._id },
      {
        $set: {
          content: next.content,
          ...(old.emailSubject ? { emailSubject: next.emailSubject } : {}),
          ...(old.emailBody ? { emailBody: next.emailBody } : {}),
          'metadata.updatedAt': new Date(),
        },
      }
    );
    if (res.matchedCount !== 1) throw new Error(`Update failed for ${lesson.lessonId}: matched=${res.matchedCount}`);

    updated.push({ courseId: fix.courseId, day: fix.day, lessonId: lesson.lessonId, backupPath });
  }

  console.log('✅ Productivity 2026 spot-fixes complete');
  console.log(`- Apply mode: ${APPLY ? 'YES' : 'NO'}`);
  console.log(`- Lessons updated: ${updated.length}`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
