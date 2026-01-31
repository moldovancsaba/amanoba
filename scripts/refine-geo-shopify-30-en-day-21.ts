/**
 * GEO_SHOPIFY_30_EN — Refine Day 21 so it passes the lesson-quality gate (>=70).
 *
 * Day 21 currently fails on: TOO_SHORT + NO_METRICS_OR_CRITERIA
 * (it’s a useful outline, but it lacks measurable success criteria).
 *
 * Safety:
 * - Dry-run by default (no DB writes).
 * - On apply: creates a per-lesson backup under scripts/lesson-backups/GEO_SHOPIFY_30_EN/.
 * - Restore via scripts/restore-lesson-from-backup.ts
 *
 * Usage:
 * - Dry-run:
 *   npx tsx --env-file=.env.local scripts/refine-geo-shopify-30-en-day-21.ts
 * - Apply:
 *   npx tsx --env-file=.env.local scripts/refine-geo-shopify-30-en-day-21.ts --apply
 */

import { config } from 'dotenv';
import { resolve, join } from 'path';
import { mkdirSync, writeFileSync } from 'fs';

config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../app/lib/mongodb';
import { Course, Lesson } from '../app/lib/models';
import { assessLessonQuality } from './lesson-quality';
import { validateLessonRecordLanguageIntegrity } from './language-integrity';

const APPLY = process.argv.includes('--apply');
const COURSE_ID = 'GEO_SHOPIFY_30_EN';
const DAY = 21;

function isoStamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function appendSuccessCriteria(content: string) {
  if (/<h2>\s*Success criteria/i.test(content) || /\bKPI\b/i.test(content)) return content;
  return `${content}\n<hr />\n<h2>Success criteria (metrics)</h2>\n<ul>\n<li><strong>Output:</strong> at least <strong>30–40</strong> prompts, with <strong>every</strong> prompt mapped to a target page (PDP / collection / guide / policy).</li>\n<li><strong>Coverage:</strong> each intent bucket has at least <strong>5</strong> prompts (<em>best</em>, <em>vs</em>, <em>alternatives</em>, <em>policy/fit</em>).</li>\n<li><strong>Priority:</strong> at least <strong>10</strong> prompts marked “A” with a clear next action (create page / improve page / add answer capsule).</li>\n<li><strong>Quality check:</strong> for A-priority prompts, the target page answers the prompt in the first screen (a short capsule summary + links).</li>\n</ul>\n<p><strong>KPI suggestion (weekly):</strong> increase clicks into the mapped target pages from your “guide/capsule” content without increasing bounce rate.</p>\n`;
}

async function main() {
  await connectDB();

  const course = await Course.findOne({ courseId: COURSE_ID, isActive: true }).lean();
  if (!course) throw new Error(`Course not found or inactive: ${COURSE_ID}`);

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

  const lesson = byDay.get(DAY);
  if (!lesson) throw new Error(`Lesson not found: ${COURSE_ID} day ${DAY}`);

  const old = {
    title: String(lesson.title || ''),
    content: String(lesson.content || ''),
    emailSubject: String(lesson.emailSubject || ''),
    emailBody: String(lesson.emailBody || ''),
  };

  const oldQuality = assessLessonQuality({ title: old.title, content: old.content, language: 'en' });
  const nextContent = appendSuccessCriteria(old.content);
  const nextQuality = assessLessonQuality({ title: old.title, content: nextContent, language: 'en' });

  const integrity = validateLessonRecordLanguageIntegrity({
    language: 'en',
    content: nextContent,
    emailSubject: old.emailSubject,
    emailBody: old.emailBody,
  });
  if (!integrity.ok) throw new Error(`Language integrity unexpectedly failed: ${integrity.errors[0] || 'unknown'}`);

  const changed = nextContent !== old.content;
  console.log(`- ${COURSE_ID} Day ${DAY} (${lesson.lessonId}): ${changed ? 'WILL_UPDATE' : 'NO_CHANGE'}`);
  console.log(`  - oldScore=${oldQuality.score} issues=${oldQuality.issues.join(',') || 'none'}`);
  console.log(`  - newScore=${nextQuality.score} issues=${nextQuality.issues.join(',') || 'none'}`);

  if (nextQuality.score < 70) {
    throw new Error(`Refinement did not reach >=70 (got ${nextQuality.score}). Aborting.`);
  }

  if (!changed) process.exit(0);
  if (!APPLY) process.exit(0);

  const stamp = isoStamp();
  const backupsRoot = join(process.cwd(), 'scripts', 'lesson-backups', COURSE_ID);
  mkdirSync(backupsRoot, { recursive: true });
  const backupPath = join(backupsRoot, `${lesson.lessonId}__${stamp}.json`);
  writeFileSync(
    backupPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        courseId: COURSE_ID,
        lessonId: lesson.lessonId,
        title: old.title,
        content: old.content,
        emailSubject: old.emailSubject,
        emailBody: old.emailBody,
      },
      null,
      2
    ),
    'utf8'
  );

  const res = await Lesson.updateOne({ _id: lesson._id }, { $set: { content: nextContent } });
  if (res.matchedCount !== 1) throw new Error(`Update failed: matched=${res.matchedCount}`);

  console.log(`✅ Updated ${lesson.lessonId}`);
  console.log(`- backup: ${backupPath}`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

