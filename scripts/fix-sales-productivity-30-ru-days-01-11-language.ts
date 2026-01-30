/**
 * Fix Sales Productivity 30 (RU) — Day 1–11 language integrity.
 *
 * What it does:
 * - Removes raw URLs from lesson.content (those often trip RU language-integrity checks).
 * - Replaces a small set of known injected English fragments with Russian equivalents.
 * - Does NOT touch quizzes.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/fix-sales-productivity-30-ru-days-01-11-language.ts
 *   npx tsx --env-file=.env.local scripts/fix-sales-productivity-30-ru-days-01-11-language.ts --apply
 *
 * Safety:
 * - Run `scripts/backup-course-lessons.ts --course SALES_PRODUCTIVITY_30_RU` before applying (already required by the audit workflow).
 */

import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../app/lib/mongodb';
import { Course, Lesson } from '../app/lib/models';

const COURSE_ID = 'SALES_PRODUCTIVITY_30_RU';

function hasFlag(flag: string) {
  return process.argv.includes(flag);
}

const APPLY = hasFlag('--apply');

function normalizeContent(html: string) {
  let s = String(html || '');

  // Remove raw URLs that appear as text (not as href="...").
  s = s.replace(/https?:\/\/[^\s<]+/g, '');

  // Replace a few common injected English fragments seen in this course.
  s = s.replace(/Key Performance Indicator/gi, 'ключевой показатель эффективности');
  s = s.replace(/Conversion Rate Optimization/gi, 'оптимизация коэффициента конверсии');
  s = s.replace(/Distributors\/Partners/gi, 'Дистрибьюторы/партнёры');
  s = s.replace(/\benterprise\b/gi, 'крупные');
  s = s.replace(/\bwhitepaper\b/gi, 'белую книгу');
  s = s.replace(/\bSalesforce\b/gi, 'Сейлсфорс');
  s = s.replace(/\bHubSpot\b/gi, 'Хабспот');
  s = s.replace(/\bSales KPIs\b/gi, 'показатели эффективности продаж');

  // Cleanup: collapse multiple spaces and remove spaced punctuation artifacts created by URL removal.
  s = s.replace(/[ \t]{2,}/g, ' ');
  s = s.replace(/:\s*[–—-]\s*(?=<)/g, ': ');
  s = s.replace(/\s+[–—-]\s*(?=<)/g, ' ');
  s = s.replace(/\s+(<\/)/g, '$1');

  return s;
}

async function main() {
  await connectDB();

  const course = await Course.findOne({ courseId: COURSE_ID, isActive: true }).select({ _id: 1, courseId: 1, language: 1 }).lean();
  if (!course) throw new Error(`Active course not found: ${COURSE_ID}`);

  const lessons = await Lesson.find({ courseId: course._id, isActive: true, dayNumber: { $gte: 1, $lte: 11 } })
    .sort({ dayNumber: 1, createdAt: 1, _id: 1 })
    .select({ _id: 1, lessonId: 1, dayNumber: 1, content: 1, createdAt: 1 })
    .lean();

  // Deduplicate by dayNumber (keep oldest lesson per day)
  const byDay = new Map<number, any>();
  for (const lesson of lessons as any[]) {
    const existing = byDay.get(lesson.dayNumber);
    if (!existing) {
      byDay.set(lesson.dayNumber, lesson);
      continue;
    }
    const a = existing.createdAt ? new Date(existing.createdAt).getTime() : 0;
    const b = lesson.createdAt ? new Date(lesson.createdAt).getTime() : 0;
    if (b < a) byDay.set(lesson.dayNumber, lesson);
  }

  let changed = 0;

  for (const day of Array.from(byDay.keys()).sort((a, b) => a - b)) {
    const lesson = byDay.get(day);
    const before = String(lesson.content || '');
    const after = normalizeContent(before);

    if (after === before) {
      console.log(`⏭️  Day ${String(day).padStart(2, '0')} ${String(lesson.lessonId)} — no change`);
      continue;
    }

    changed++;
    if (!APPLY) {
      console.log(`📝 Would update Day ${String(day).padStart(2, '0')} ${String(lesson.lessonId)} (content)`);
      continue;
    }

    await Lesson.updateOne({ _id: lesson._id }, { $set: { content: after } }).exec();
    console.log(`✅ Updated Day ${String(day).padStart(2, '0')} ${String(lesson.lessonId)} (content)`);
  }

  console.log(`\nDone. mode=${APPLY ? 'APPLY' : 'DRY-RUN'} changed=${changed}`);
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
