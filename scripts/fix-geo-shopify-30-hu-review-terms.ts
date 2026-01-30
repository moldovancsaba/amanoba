/**
 * Fix GEO Shopify HU lessons where "review" leaks as an English instruction-starter.
 *
 * Why:
 * - Our HU language-integrity gate flags lines starting with "review/Review" as injected English.
 * - These lessons should use Hungarian terminology ("értékelés") anyway.
 *
 * Safety:
 * - Dry-run by default (no DB writes).
 * - On apply: creates per-lesson backups under scripts/lesson-backups/GEO_SHOPIFY_30/.
 *
 * Usage:
 * - Dry-run:
 *   npx tsx --env-file=.env.local scripts/fix-geo-shopify-30-hu-review-terms.ts
 * - Apply:
 *   npx tsx --env-file=.env.local scripts/fix-geo-shopify-30-hu-review-terms.ts --apply
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
const COURSE_ID = 'GEO_SHOPIFY_30';
const DAYS = [17, 18];

function replaceReviewTerms(html: string) {
  let next = String(html || '');
  next = next.replace(/\breview\s*–\s*valós review-k\b/gi, 'értékelések – valós értékelések');
  next = next.replace(/\breview-k\b/g, 'értékelések');
  next = next.replace(/\bReview-k\b/g, 'Értékelések');
  next = next.replace(/\bReview blokk átnézése\b/g, 'Értékelés blokk áttekintése');
  next = next.replace(/\bReview blokk valós, forrás megjelölve\./g, 'Értékelés blokk valós, forrás megjelölve.');
  next = next.replace(/\bReview\b/g, 'Értékelés');
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

  const stamp = isoStamp();
  const backupDir = join(process.cwd(), 'scripts', 'lesson-backups', COURSE_ID);
  const applied: Array<{ day: number; lessonId: string; backupPath: string }> = [];

  for (const day of DAYS) {
    const lesson = byDay.get(day);
    if (!lesson) {
      console.log(`⚠️  Missing lesson for day ${day} in ${COURSE_ID}`);
      continue;
    }

    const oldContent = String(lesson.content || '');
    const oldEmailSubject = lesson.emailSubject || null;
    const oldEmailBody = lesson.emailBody || null;

    const nextContent = replaceReviewTerms(oldContent);
    const nextEmailSubject = oldEmailSubject ? replaceReviewTerms(oldEmailSubject) : null;
    const nextEmailBody = oldEmailBody ? replaceReviewTerms(oldEmailBody) : null;

    const integrity = validateLessonRecordLanguageIntegrity({
      language: 'hu',
      content: nextContent,
      emailSubject: nextEmailSubject,
      emailBody: nextEmailBody,
    });
    if (!integrity.ok) {
      throw new Error(
        `Language integrity still fails for ${COURSE_ID} day ${day} (${lesson.lessonId}): ${integrity.errors[0] || 'unknown'}`
      );
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

  console.log('✅ GEO Shopify review-term fix complete');
  console.log(`- Apply mode: ${APPLY ? 'YES' : 'NO'}`);
  if (APPLY) console.log(`- Backups: ${backupDir}`);
  if (APPLY) console.log(`- Updated lessons: ${applied.length}`);

  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
