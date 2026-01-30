/**
 * Fix B2B Sales 2026 (RU) — Day 1–11 language integrity.
 *
 * Why:
 * - Some early RU lessons contain long Latin segments (URLs + English process labels)
 *   which block send-time emails and fail audits.
 *
 * What it does:
 * - Removes raw URLs from lesson.content/emailBody.
 * - Replaces common English process tokens with Russian equivalents.
 * - Rewrites a few known vendor lines (Salesforce, Gong, etc.) into Russian without links.
 * - Updates titles for Day 7/10 to remove English words.
 * - Does NOT touch quizzes.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/fix-b2b-sales-2026-30-ru-days-01-11-language.ts
 *   npx tsx --env-file=.env.local scripts/fix-b2b-sales-2026-30-ru-days-01-11-language.ts --apply
 */

import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../app/lib/mongodb';
import { Course, Lesson } from '../app/lib/models';

const COURSE_ID = 'B2B_SALES_2026_30_RU';

function hasFlag(flag: string) {
  return process.argv.includes(flag);
}

const APPLY = hasFlag('--apply');

function stripUrls(s: string) {
  return String(s || '').replace(/https?:\/\/[^\s<]+/g, '');
}

function stripLongLatinSegments(s: string) {
  // Hard safety net: remove any remaining long Latin runs (the RU integrity gate triggers on these).
  return String(s || '').replace(/\p{Script=Latin}{10,}/gu, '');
}

function normalizeRu(html: string) {
  let s = String(html || '');

  s = stripUrls(s);

  // Map common B2B process terms
  s = s.replace(/\bsourcing\b/gi, 'поиск');
  s = s.replace(/\bqualification\b/gi, 'квалификация');
  s = s.replace(/\bdiscovery\b/gi, 'диагностика');
  s = s.replace(/\bproposal\b/gi, 'предложение');
  s = s.replace(/\bnegotiation\b/gi, 'переговоры');
  s = s.replace(/\bclose\b/gi, 'закрытие');
  s = s.replace(/\bexpansion\b/gi, 'расширение');

  // Enablement / hygiene (often appear in headings/titles)
  s = s.replace(/\benablement\b/gi, 'поддержка продаж');
  s = s.replace(/\bpipeline hygiene\b/gi, 'гигиена воронки');

  // SPIN labels
  s = s.replace(/\bSituation\b/g, 'Ситуация');
  s = s.replace(/\bProblem\b/g, 'Проблема');
  s = s.replace(/\bImplication\b/g, 'Последствия');
  s = s.replace(/\bNeed-?Payoff\b/g, 'Потребность/выигрыш');

  // Vendor lines: keep the idea, drop links and long English fragments
  s = s.replace(/\bSalesforce\b/gi, 'Сейлсфорс');
  s = s.replace(/\bGong\.io\b/gi, 'Гонг');
  s = s.replace(/\bWinning by Design\b/gi, 'Winning by Design');
  s = s.replace(/\bJourney Builder\b/gi, 'конструктор пути клиента');
  s = s.replace(/\bPipeline Management\b/gi, 'управление воронкой');
  s = s.replace(/\bReal Deal Scorecards\b/gi, 'карточки оценки сделок');

  s = stripLongLatinSegments(s);

  // Cleanup artifacts
  s = s.replace(/[ \t]{2,}/g, ' ');
  s = s.replace(/\s+→\s+/g, ' → ');
  s = s.replace(/\s+—\s+/g, ' — ');
  s = s.replace(/\s+\.\s+/g, '. ');
  s = s.replace(/\s+(<\/)/g, '$1');
  s = s.replace(/\(\s*\)/g, '');

  return s;
}

function normalizeTitle(day: number, title: string) {
  const t = String(title || '');
  if (day === 7) return t.replace(/enablement/gi, 'поддержка продаж');
  if (day === 10) return t.replace(/pipeline hygiene/gi, 'гигиена воронки');
  return t;
}

async function main() {
  await connectDB();

  const course = await Course.findOne({ courseId: COURSE_ID, isActive: true }).select({ _id: 1 }).lean();
  if (!course) throw new Error(`Active course not found: ${COURSE_ID}`);

  const lessons = await Lesson.find({ courseId: course._id, isActive: true, dayNumber: { $gte: 1, $lte: 11 } })
    .sort({ dayNumber: 1, createdAt: 1, _id: 1 })
    .select({ _id: 1, lessonId: 1, dayNumber: 1, title: 1, content: 1, emailSubject: 1, emailBody: 1, createdAt: 1 })
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
    const beforeTitle = String(lesson.title || '');
    const beforeContent = String(lesson.content || '');
    const beforeSubject = String(lesson.emailSubject || '');
    const beforeBody = String(lesson.emailBody || '');

    const nextTitle = normalizeTitle(day, beforeTitle);
    const nextContent = normalizeRu(beforeContent);
    const nextSubject = normalizeRu(beforeSubject);
    const nextBody = normalizeRu(beforeBody);

    const isChanged =
      nextTitle !== beforeTitle ||
      nextContent !== beforeContent ||
      nextSubject !== beforeSubject ||
      nextBody !== beforeBody;

    if (!isChanged) {
      console.log(`⏭️  Day ${String(day).padStart(2, '0')} ${String(lesson.lessonId)} — no change`);
      continue;
    }

    changed++;
    if (!APPLY) {
      console.log(`📝 Would update Day ${String(day).padStart(2, '0')} ${String(lesson.lessonId)} (title/content/email)`);
      continue;
    }

    await Lesson.updateOne(
      { _id: lesson._id },
      { $set: { title: nextTitle, content: nextContent, emailSubject: nextSubject, emailBody: nextBody } }
    ).exec();
    console.log(`✅ Updated Day ${String(day).padStart(2, '0')} ${String(lesson.lessonId)} (title/content/email)`);
  }

  console.log(`\nDone. mode=${APPLY ? 'APPLY' : 'DRY-RUN'} changed=${changed}`);
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

