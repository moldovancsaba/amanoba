/**
 * B2B_SALES_2026_30_EN — Refine Day 17 so it passes the lesson-quality gate (>=70).
 *
 * Day 17 currently fails on: TOO_SHORT + NO_CLEAR_DEFINITIONS + NO_METRICS_OR_CRITERIA
 *
 * Safety:
 * - Dry-run by default (no DB writes).
 * - On apply: creates a per-lesson backup under scripts/lesson-backups/B2B_SALES_2026_30_EN/.
 * - Restore via scripts/restore-lesson-from-backup.ts
 *
 * Usage:
 * - Dry-run:
 *   npx tsx --env-file=.env.local scripts/refine-b2b-sales-2026-30-en-day-17.ts
 * - Apply:
 *   npx tsx --env-file=.env.local scripts/refine-b2b-sales-2026-30-en-day-17.ts --apply
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
const COURSE_ID = 'B2B_SALES_2026_30_EN';
const DAY = 17;

function isoStamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function appendDefinitionAndMetrics(content: string) {
  const hasDefinition = /<h2>\s*Definition\b/i.test(content) || /\bWhat it is\b/i.test(content) || /\bDefinition:/i.test(content);
  const hasMetrics = /<h2>\s*Success criteria\b/i.test(content) || /\bKPI\b/i.test(content) || /\bMetric\b/i.test(content);
  if (hasDefinition && hasMetrics) return content;

  return `${content}\n<hr />\n<h2>Definition (what it is vs what it is not)</h2>\n<p><strong>Definition:</strong> A <em>next step + commitment</em> is a concrete agreement that answers: <strong>what</strong> will happen next, <strong>who</strong> owns it, <strong>when</strong> it happens, and <strong>what “done” evidence</strong> looks like. It turns a good conversation into a measurable pipeline move.</p>\n<ul>\n<li><strong>What it is</strong>: a scheduled action with an owner and a clear deliverable (email, intro, meeting, review).</li>\n<li><strong>What it is not</strong>: “Let’s follow up sometime” or a vague promise with no date.</li>\n<li><strong>Commitment vs interest</strong>: interest is verbal; commitment shows up as a time-bound action.</li>\n</ul>\n<hr />\n<h2>Success criteria (metrics)</h2>\n<ul>\n<li><strong>Output:</strong> every call ends with a next step written as <em>who + what + when + evidence</em>.</li>\n<li><strong>Metric:</strong> % of calls with a scheduled next step (target: &gt;80%).</li>\n<li><strong>Metric:</strong> time-to-next-meeting (median days) decreases week over week.</li>\n<li><strong>Guardrail:</strong> commitments are realistic (no “calendar spam” — fewer, higher-quality steps).</li>\n</ul>\n<p><strong>KPI suggestion:</strong> improve your stage-to-stage conversion by making next steps explicit and verifiable.</p>\n<hr />\n<h2>Examples (good vs poor)</h2>\n<ul>\n<li><strong>Good</strong>: “You’ll introduce us to your data owner by Friday (email cc’d). If that happens, we schedule a technical review next week.”</li>\n<li><strong>Poor</strong>: “Send me something and we’ll see.”</li>\n</ul>\n`;
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

  if (nextQuality.score < 70) throw new Error(`Refinement did not reach >=70 (got ${nextQuality.score}). Aborting.`);
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

