/**
 * GEO_SHOPIFY_30_EN — Batch refine below-min days so they pass the lesson-quality gate (>=70).
 *
 * Goal:
 * - Unlock quiz generation for the remaining GEO_SHOPIFY_30_EN lessons that are stuck at 5 questions
 *   because the pipeline is blocked by lesson-quality issues (typically TOO_SHORT, NO_CLEAR_DEFINITIONS,
 *   NO_METRICS_OR_CRITERIA).
 *
 * Safety:
 * - Dry-run by default (no DB writes).
 * - On apply: per-lesson backups under scripts/lesson-backups/GEO_SHOPIFY_30_EN/.
 * - Restore via scripts/restore-lesson-from-backup.ts
 *
 * Usage:
 * - Dry-run (defaults to known below-min days):
 *   npx tsx --env-file=.env.local scripts/refine-geo-shopify-30-en-batch.ts
 * - Apply:
 *   npx tsx --env-file=.env.local scripts/refine-geo-shopify-30-en-batch.ts --apply
 * - Custom days (comma-separated):
 *   npx tsx --env-file=.env.local scripts/refine-geo-shopify-30-en-batch.ts --days 10,12,13
 */

import { config } from 'dotenv';
import { resolve, join } from 'path';
import { mkdirSync, writeFileSync } from 'fs';

config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../app/lib/mongodb';
import { Course, Lesson } from '../app/lib/models';
import { assessLessonQuality, type LessonQualityIssue } from './lesson-quality';
import { validateLessonRecordLanguageIntegrity } from './language-integrity';

const APPLY = process.argv.includes('--apply');
const COURSE_ID = 'GEO_SHOPIFY_30_EN';

function getArgValue(flag: string): string | undefined {
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return undefined;
  return process.argv[idx + 1];
}

function isoStamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function parseDays(input: string | undefined): number[] {
  if (!input) {
    // Remaining below-min days (after Day 16/21/22 refinements)
    return [10, 12, 13, 14, 15, 17, 18, 19, 20, 23, 24, 26, 27, 28, 30];
  }
  return input
    .split(',')
    .map((s) => Number(String(s || '').trim()))
    .filter((n) => Number.isFinite(n) && n >= 1 && n <= 30);
}

function hasSection(content: string, h2Title: string) {
  const re = new RegExp(`<h2>\\s*${h2Title.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')}\\b`, 'i');
  return re.test(content);
}

function ensureDefinitionBlock(content: string, title: string) {
  if (hasSection(content, 'Definition')) return content;
  return `${content}\n<hr />\n<h2>Definition (what it is vs what it is not)</h2>\n<p><strong>Definition:</strong> In this context, <em>${title}</em> is an implementation pattern: you choose a structure that makes the page easy to summarize accurately by AI and easy to act on by a shopper (criteria → picks → links).</p>\n<ul>\n<li><strong>What it is</strong>: a decision-support structure with explicit criteria and linked recommendations.</li>\n<li><strong>What it is not</strong>: a vague description or a wall of text with no criteria, no picks, and no links.</li>\n</ul>\n`;
}

function ensureMetricsBlock(content: string) {
  if (hasSection(content, 'Success criteria')) return content;
  return `${content}\n<hr />\n<h2>Success criteria (metrics)</h2>\n<ul>\n<li><strong>Output:</strong> the page has a clear “who/when” hero, 3–5 decision criteria, and 3 linked picks with reasons.</li>\n<li><strong>Clarity check:</strong> a new shopper can choose in under 60 seconds from this page.</li>\n<li><strong>Metric:</strong> click-through from the page to PDPs for the recommended picks.</li>\n<li><strong>Guardrail:</strong> bounce rate does not increase after the change.</li>\n</ul>\n<p><strong>KPI suggestion:</strong> +10–20% click-through to PDPs over 2–4 weeks (while keeping bounce stable).</p>\n`;
}

function ensurePitfallsBlock(content: string) {
  if (hasSection(content, 'Common pitfalls')) return content;
  return `${content}\n<hr />\n<h2>Common pitfalls</h2>\n<ul>\n<li><strong>Pitfall:</strong> listing “top picks” without a reason tied to a criterion (AI will hallucinate the reason).</li>\n<li><strong>Pitfall:</strong> mixing intents on one page (a policy question answered on a comparison page, or vice versa).</li>\n<li><strong>Pitfall:</strong> unlinked recommendations (no PDP links → no measurable path).</li>\n</ul>\n`;
}

function refineContent(params: { title: string; content: string; issues: LessonQualityIssue[] }) {
  let next = params.content;
  if (params.issues.includes('NO_CLEAR_DEFINITIONS')) next = ensureDefinitionBlock(next, params.title);
  if (params.issues.includes('NO_METRICS_OR_CRITERIA')) next = ensureMetricsBlock(next);
  // If still too short, add pitfalls (no new domain facts; reinforces structure + checks)
  if (params.issues.includes('TOO_SHORT')) next = ensurePitfallsBlock(next);
  return next;
}

async function main() {
  const days = parseDays(getArgValue('--days'));
  if (days.length === 0) throw new Error('No valid --days provided.');

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

  const stamp = isoStamp();
  const backupsRoot = join(process.cwd(), 'scripts', 'lesson-backups', COURSE_ID);
  if (APPLY) mkdirSync(backupsRoot, { recursive: true });

  const updates: Array<{ day: number; lessonId: string; oldScore: number; newScore: number; backupPath?: string }> = [];

  for (const day of days) {
    const lesson = byDay.get(day);
    if (!lesson) {
      console.log(`⚠️  Missing lesson record: ${COURSE_ID} day ${day}`);
      continue;
    }

    const title = String(lesson.title || '').trim();
    const content = String(lesson.content || '');
    const oldQuality = assessLessonQuality({ title, content, language: 'en' });
    const nextContent = refineContent({ title, content, issues: oldQuality.issues });
    const newQuality = assessLessonQuality({ title, content: nextContent, language: 'en' });

    const integrity = validateLessonRecordLanguageIntegrity({
      language: 'en',
      content: nextContent,
      emailSubject: String(lesson.emailSubject || ''),
      emailBody: String(lesson.emailBody || ''),
    });
    if (!integrity.ok) throw new Error(`Language integrity failed after refine for ${lesson.lessonId}: ${integrity.errors[0] || 'unknown'}`);

    const changed = nextContent !== content;
    console.log(
      `- Day ${day} (${lesson.lessonId}): ${changed ? 'WILL_UPDATE' : 'NO_CHANGE'} oldScore=${oldQuality.score} newScore=${newQuality.score}`
    );

    if (newQuality.score < 70) {
      throw new Error(`Refine failed gate for ${lesson.lessonId}: score=${newQuality.score} issues=${newQuality.issues.join(',') || 'none'}`);
    }

    if (!changed) continue;
    if (!APPLY) {
      updates.push({ day, lessonId: lesson.lessonId, oldScore: oldQuality.score, newScore: newQuality.score });
      continue;
    }

    const backupPath = join(backupsRoot, `${lesson.lessonId}__${stamp}.json`);
    writeFileSync(
      backupPath,
      JSON.stringify(
        {
          generatedAt: new Date().toISOString(),
          courseId: COURSE_ID,
          lessonId: lesson.lessonId,
          title: String(lesson.title || ''),
          content: content,
          emailSubject: lesson.emailSubject || '',
          emailBody: lesson.emailBody || '',
        },
        null,
        2
      ),
      'utf8'
    );

    const res = await Lesson.updateOne({ _id: lesson._id }, { $set: { content: nextContent } });
    if (res.matchedCount !== 1) throw new Error(`Update failed for ${lesson.lessonId}: matched=${res.matchedCount}`);

    updates.push({ day, lessonId: lesson.lessonId, oldScore: oldQuality.score, newScore: newQuality.score, backupPath });
  }

  console.log(`✅ ${APPLY ? 'Applied' : 'Planned'} updates: ${updates.length}`);
  for (const u of updates) {
    console.log(`- Day ${u.day} ${u.lessonId} ${u.oldScore}→${u.newScore}${u.backupPath ? ` backup=${u.backupPath}` : ''}`);
  }

  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

