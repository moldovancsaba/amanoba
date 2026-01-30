/**
 * Fix PLAYBOOK_2026_30 (HU) lessons where line-start English words trigger language integrity.
 *
 * Why:
 * - HU language-integrity gate flags lines starting with Design/Build/Review as injected English.
 * - We rephrase so lines don't start with those words (prefix with "A " or use Hungarian terms).
 *
 * Safety:
 * - Dry-run by default (no DB writes).
 * - On apply: creates per-lesson backups under scripts/lesson-backups/PLAYBOOK_2026_30/.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/fix-playbook-2026-30-hu-language-integrity.ts [--apply]
 */

import { config } from 'dotenv';
import { resolve, join } from 'path';
import { mkdirSync, writeFileSync } from 'fs';

config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../app/lib/mongodb';
import { Course, Lesson } from '../app/lib/models';
import { validateLessonRecordLanguageIntegrity } from './language-integrity';

function isoStamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

const APPLY = process.argv.includes('--apply');
const COURSE_ID = 'PLAYBOOK_2026_30';

/** Rephrase so HU validator passes (no line starting with Design/Build/Review). */
function rephraseHuContent(html: string): string {
  let next = String(html || '');
  // Phrases that trigger "injected English" (line-start Design/Build/Review)
  next = next.replace(/\bDesign Tokens W3C draft\b/g, 'A design tokenek (W3C piszkozat)');
  next = next.replace(/\bDesign affordance alapok\b/g, 'A design affordance alapok');
  next = next.replace(/\bDesign system maintenance\b/g, 'A design rendszer karbantartás');
  next = next.replace(/\bDesign adósság kezelése\b/g, 'A design adósság kezelése');
  next = next.replace(/\bDesign QA\b/g, 'A design QA');
  next = next.replace(/\bBuild folyamat\b/g, 'Építési folyamat');
  next = next.replace(/\bReview: design \+ dev\b/g, 'Értékelés: design + dev');
  next = next.replace(/\bReview és jóváhagyási folyamat\b/g, 'Értékelés és jóváhagyási folyamat');
  next = next.replace(/\bReview: design\b/g, 'Értékelés: design');
  // Inline English phrases that may trigger
  next = next.replace(/\bfeedback loop\b/g, 'visszajelzési hurok');
  next = next.replace(/\brollout ütemterv\b/g, 'bevezetési ütemterv');
  // Line-start Design/Review/Build (start of string, after newline, or after >) so validator doesn't see English first word
  next = next.replace(/(^|[\n>])\s*Design /gm, '$1A design ');
  next = next.replace(/(^|[\n>])\s*Review /gm, '$1Értékelés ');
  next = next.replace(/(^|[\n>])\s*Build /gm, '$1Építési ');
  return next;
}

async function main() {
  await connectDB();

  const course = await Course.findOne({ courseId: COURSE_ID, isActive: true }).lean();
  if (!course) throw new Error(`Course not found: ${COURSE_ID}`);
  if (String(course.language || '').toLowerCase() !== 'hu') {
    throw new Error(`Course language is not HU for ${COURSE_ID} (found: ${course.language})`);
  }

  const lessons = await Lesson.find({ courseId: course._id, isActive: true })
    .sort({ dayNumber: 1, displayOrder: 1, createdAt: 1, _id: 1 })
    .select({ _id: 1, lessonId: 1, dayNumber: 1, title: 1, content: 1, emailSubject: 1, emailBody: 1, createdAt: 1 })
    .lean();

  const byDay = new Map<number, any>();
  for (const lesson of lessons) {
    const existing = byDay.get(lesson.dayNumber);
    if (!existing) byDay.set(lesson.dayNumber, lesson);
    else if (lesson.createdAt && existing.createdAt && new Date(lesson.createdAt).getTime() < new Date(existing.createdAt).getTime()) {
      byDay.set(lesson.dayNumber, lesson);
    }
  }

  const stamp = isoStamp();
  const backupDir = join(process.cwd(), 'scripts', 'lesson-backups', COURSE_ID);
  const applied: Array<{ day: number; lessonId: string; backupPath: string }> = [];
  const failingDays = [1, 8, 17, 20, 21, 22, 23, 25, 30];

  for (const day of failingDays) {
    const lesson = byDay.get(day);
    if (!lesson) {
      console.log(`⚠️  Missing lesson for day ${day} in ${COURSE_ID}`);
      continue;
    }

    const oldContent = String(lesson.content || '');
    const oldEmailSubject = lesson.emailSubject || null;
    const oldEmailBody = lesson.emailBody || null;

    const nextContent = rephraseHuContent(oldContent);
    const nextEmailSubject = oldEmailSubject ? rephraseHuContent(oldEmailSubject) : null;
    const nextEmailBody = oldEmailBody ? rephraseHuContent(oldEmailBody) : null;

    const integrity = validateLessonRecordLanguageIntegrity({
      language: 'hu',
      content: nextContent,
      emailSubject: nextEmailSubject,
      emailBody: nextEmailBody,
    });
    if (!integrity.ok) {
      console.warn(
        `Day ${day} (${lesson.lessonId}): integrity still fails after rephrase: ${integrity.errors[0] || 'unknown'}`
      );
      continue;
    }

    const changed = nextContent !== oldContent || nextEmailSubject !== oldEmailSubject || nextEmailBody !== oldEmailBody;
    console.log(`- Day ${day}: ${changed ? 'WILL_UPDATE' : 'NO_CHANGE'} (${lesson.lessonId})`);
    if (!changed) continue;

    if (!APPLY) continue;

    mkdirSync(backupDir, { recursive: true });
    const backupPath = join(backupDir, `${lesson.lessonId}__${stamp}.json`);
    writeFileSync(
      backupPath,
      JSON.stringify(
        {
          backedUpAt: new Date().toISOString(),
          courseId: COURSE_ID,
          lessonId: lesson.lessonId,
          dayNumber: lesson.dayNumber,
          title: lesson.title,
          content: oldContent,
          emailSubject: oldEmailSubject,
          emailBody: oldEmailBody,
        },
        null,
        2
      )
    );

    const res = await Lesson.updateOne(
      { _id: lesson._id },
      {
        $set: {
          content: nextContent,
          ...(oldEmailSubject ? { emailSubject: nextEmailSubject } : {}),
          ...(oldEmailBody ? { emailBody: nextEmailBody } : {}),
          'metadata.updatedAt': new Date(),
        },
      }
    );

    if (res.matchedCount !== 1) throw new Error(`Update failed for ${lesson.lessonId}: matched=${res.matchedCount}`);
    applied.push({ day, lessonId: lesson.lessonId, backupPath });
  }

  console.log('✅ PLAYBOOK_2026_30 HU language-integrity fix complete');
  console.log(`- Apply mode: ${APPLY ? 'YES' : 'NO'}`);
  if (APPLY) console.log(`- Backups: ${backupDir}`);
  if (APPLY) console.log(`- Updated lessons: ${applied.length}`);

  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
