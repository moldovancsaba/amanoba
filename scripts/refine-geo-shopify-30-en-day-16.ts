/**
 * GEO_SHOPIFY_30_EN — Refine Day 16 so it passes the lesson-quality gate (>=70).
 *
 * Why:
 * - Day 16 is below the 7-question minimum and currently blocked by lesson-quality issues
 *   (TOO_SHORT + NO_CLEAR_DEFINITIONS). Until it passes, the quiz-quality pipeline cannot
 *   generate the missing questions without lowering standards.
 *
 * Safety:
 * - Dry-run by default (no DB writes).
 * - On apply: creates a per-lesson backup under scripts/lesson-backups/GEO_SHOPIFY_30_EN/.
 * - Restore via scripts/restore-lesson-from-backup.ts
 *
 * Usage:
 * - Dry-run:
 *   npx tsx --env-file=.env.local scripts/refine-geo-shopify-30-en-day-16.ts
 * - Apply:
 *   npx tsx --env-file=.env.local scripts/refine-geo-shopify-30-en-day-16.ts --apply
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
const DAY = 16;

function isoStamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function appendDefinitionAndMetrics(content: string) {
  if (/\bDefinition\b/i.test(content) && /\bWhat it is\b/i.test(content)) return content;

  return `${content}\n<hr />\n<h2>Definition (what it is vs what it is not)</h2>\n<p><strong>Definition:</strong> A <em>guide-style</em> collection page means the page helps a shopper choose (and helps AI cite it) by explaining <strong>who the collection is for</strong>, <strong>how to choose</strong>, and <strong>which picks fit which scenario</strong>. A grid-only page is just a list of products.</p>\n<ul>\n<li><strong>What it is</strong>: a buying guide + curated picks + links to PDPs.</li>\n<li><strong>What it is not</strong>: a “category dump” with no decision help.</li>\n<li><strong>Guide vs grid</strong>: the guide explains the decision; the grid supports browsing.</li>\n</ul>\n<hr />\n<h2>Success criteria (metrics)</h2>\n<p>Use these criteria to verify the change is working (pick 2–3 metrics and track weekly):</p>\n<ul>\n<li><strong>Metric:</strong> clicks from the collection to PDPs for the “Top picks” section.</li>\n<li><strong>Metric:</strong> add-to-cart rate for products clicked from the collection page.</li>\n<li><strong>Metric:</strong> bounce rate / time on page after adding the guide blocks.</li>\n<li><strong>Criteria:</strong> a new shopper can answer “which one should I buy?” from this page in under 60 seconds.</li>\n</ul>\n<p><strong>KPI suggestion:</strong> improve PDP click-through from the collection page by +10–20% without increasing bounce rate.</p>\n`;
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
  const nextContent = appendDefinitionAndMetrics(old.content);
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

