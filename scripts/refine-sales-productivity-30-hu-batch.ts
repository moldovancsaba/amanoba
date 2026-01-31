/**
 * SALES_PRODUCTIVITY_30_HU — Batch refine below-min days so they pass the lesson-quality gate (>=70).
 *
 * These days are typically at 6 questions and blocked by lesson-quality issues.
 * This script adds missing definition/contrast/examples/metrics in HU without changing the core intent.
 *
 * Safety:
 * - Dry-run by default (no DB writes).
 * - On apply: per-lesson backups under scripts/lesson-backups/SALES_PRODUCTIVITY_30_HU/.
 * - Restore via scripts/restore-lesson-from-backup.ts
 *
 * Usage:
 * - Dry-run (defaults to known below-min days):
 *   npx tsx --env-file=.env.local scripts/refine-sales-productivity-30-hu-batch.ts
 * - Apply:
 *   npx tsx --env-file=.env.local scripts/refine-sales-productivity-30-hu-batch.ts --apply
 * - Custom days:
 *   npx tsx --env-file=.env.local scripts/refine-sales-productivity-30-hu-batch.ts --days 14,15,16
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
const COURSE_ID = 'SALES_PRODUCTIVITY_30_HU';

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
    // Known below-min days: 9 and 14–30
    return [9, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
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
  if (hasSection(content, 'Definíció')) return content;
  return `${content}\n<hr />\n<h2>Definíció (mit jelent / mi nem)</h2>\n<p><strong>Mit jelent:</strong> A(z) <em>${title}</em> egy olyan működési elv vagy gyakorlat, amit konkrét kimenetben tudsz ellenőrizni (mit csinálunk, mikor, milyen bizonyítékkal).</p>\n<ul>\n<li><strong>Mi nem:</strong> “majd valahogy” vagy “csak érzésre” működtetett sales.</li>\n<li><strong>Különbség:</strong> a jó gyakorlat mérhető (kritériumok), a rossz csak szándék.</li>\n</ul>\n`;
}

function ensureSuccessCriteria(content: string) {
  if (hasSection(content, 'Siker-kritériumok')) return content;
  return `${content}\n<hr />\n<h2>Siker-kritériumok (metrikák)</h2>\n<ul>\n<li><strong>Kritérium:</strong> a következő lépés, felelős és határidő minden beszélgetés végén rögzítve van.</li>\n<li><strong>Metrika:</strong> heti követő (follow-up) arány és válaszarány mérve.</li>\n<li><strong>Metrika:</strong> stage-to-stage konverzió javul (nem csak aktivitás nő).</li>\n<li><strong>Küszöb:</strong> 1 hét után tudod megmondani, mi működött és min javítanál.</li>\n</ul>\n`;
}

function ensureGoodBad(content: string) {
  if (hasSection(content, 'Jó vs rossz')) return content;
  return `${content}\n<hr />\n<h2>Jó vs rossz (gyors kontraszt)</h2>\n<ul>\n<li><strong>Jó</strong>: konkrét csere, konkrét határidő, ellenőrizhető kimenet.</li>\n<li><strong>Rossz</strong>: általános ígéret, nincs csere, nincs következő lépés.</li>\n</ul>\n`;
}

function ensureExamples(content: string) {
  if (hasSection(content, 'Példa')) return content;
  return `${content}\n<hr />\n<h2>Példa</h2>\n<ul>\n<li><strong>Példa</strong>: “Ha előrehozzuk a döntést péntekig, akkor adunk pilotot 2 hétre. Ha nem, marad a standard csomag és ütemezés.”</li>\n</ul>\n`;
}

function ensureActionSteps(content: string) {
  if (/(\\n|\\s)1\\.\\s/.test(content) || /<ol>/i.test(content)) return content;
  return `${content}\n<hr />\n<h2>Lépések (5 perc)</h2>\n<ol>\n<li>Írd le 1 mondatban a kívánt kimenetet.</li>\n<li>Adj 3 kritériumot (mikor jó, mikor nem).</li>\n<li>Írj 2 “jó” és 2 “rossz” példát.</li>\n<li>Határozd meg a következő lépést + határidőt.</li>\n</ol>\n`;
}

function ensurePitfalls(content: string) {
  if (hasSection(content, 'Gyakori hibák')) return content;
  return `${content}\n<hr />\n<h2>Gyakori hibák</h2>\n<ul>\n<li>Engedmény ellenszolgáltatás nélkül (“ajándék”).</li>\n<li>Túl sok opció egyszerre → döntés elhal.</li>\n<li>Nincs rögzített következő lépés → pipeline nem mozdul.</li>\n</ul>\n`;
}

function refineContent(params: { title: string; content: string; issues: LessonQualityIssue[] }) {
  let next = params.content;
  if (params.issues.includes('NO_CLEAR_DEFINITIONS')) next = ensureDefinitionBlock(next, params.title);
  if (params.issues.includes('NO_METRICS_OR_CRITERIA')) next = ensureSuccessCriteria(next);
  if (params.issues.includes('NO_CONTRASTS_GOOD_BAD')) next = ensureGoodBad(next);
  if (params.issues.includes('NO_EXAMPLES')) next = ensureExamples(next);
  if (params.issues.includes('NO_ACTIONABLE_STEPS')) next = ensureActionSteps(next);
  if (params.issues.includes('TOO_SHORT')) next = ensurePitfalls(next);
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
    const oldQuality = assessLessonQuality({ title, content, language: 'hu' });
    const nextContent = refineContent({ title, content, issues: oldQuality.issues });
    const newQuality = assessLessonQuality({ title, content: nextContent, language: 'hu' });

    const integrity = validateLessonRecordLanguageIntegrity({
      language: 'hu',
      content: nextContent,
      emailSubject: lesson.emailSubject || null,
      emailBody: lesson.emailBody || null,
    });
    if (!integrity.ok) throw new Error(`Language integrity failed after refine for ${lesson.lessonId}: ${integrity.errors[0] || 'unknown'}`);

    const changed = nextContent !== content;
    console.log(`- Day ${day} (${lesson.lessonId}): ${changed ? 'WILL_UPDATE' : 'NO_CHANGE'} oldScore=${oldQuality.score} newScore=${newQuality.score}`);

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
          emailSubject: lesson.emailSubject || null,
          emailBody: lesson.emailBody || null,
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

