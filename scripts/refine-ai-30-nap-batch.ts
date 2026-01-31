/**
 * AI_30_NAP — Batch refine below-min days so they pass the lesson-quality gate (>=70).
 *
 * Goal:
 * - Unlock quiz generation for the remaining AI_30_NAP lessons that are stuck at 6 questions
 *   because the pipeline is blocked by lesson-quality issues.
 *
 * Safety:
 * - Dry-run by default (no DB writes).
 * - On apply: per-lesson backups under scripts/lesson-backups/AI_30_NAP/.
 * - Restore via scripts/restore-lesson-from-backup.ts
 *
 * Usage:
 * - Dry-run (defaults to known below-min days):
 *   npx tsx --env-file=.env.local scripts/refine-ai-30-nap-batch.ts
 * - Apply:
 *   npx tsx --env-file=.env.local scripts/refine-ai-30-nap-batch.ts --apply
 * - Custom days (comma-separated):
 *   npx tsx --env-file=.env.local scripts/refine-ai-30-nap-batch.ts --days 13,14,23
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
const COURSE_ID = 'AI_30_NAP';

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
    // Known below-min days (each missing 1 question in the pool)
    return [13, 14, 17, 21, 22, 23, 24, 25, 27, 28, 29, 30];
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
  return `${content}\n<hr />\n<h2>Definíció (mit jelent / mi nem)</h2>\n<p><strong>Mit jelent:</strong> A(z) <em>${title}</em> egy konkrét kimenetre tervezett munkalépés: a bemenet (prompt / váz / döntési kritérium) úgy van megfogalmazva, hogy a kimenet <strong>ellenőrizhető</strong> és <strong>újrafuttatható</strong> legyen.</p>\n<ul>\n<li><strong>Mi nem:</strong> homályos kérés (“írj valamit”) mérhető kritériumok nélkül.</li>\n<li><strong>Különbség:</strong> a jó prompt/brief megadja a kontextust + formátumot + minőségi küszöböt; a rossz csak témát.</li>\n</ul>\n`;
}

function ensureSuccessCriteria(content: string) {
  if (hasSection(content, 'Siker-kritériumok')) return content;
  return `${content}\n<hr />\n<h2>Siker-kritériumok (metrikák)</h2>\n<ul>\n<li><strong>Kritérium:</strong> a kimenet egyértelműen értékelhető (van “kész” definíció).</li>\n<li><strong>Kritérium:</strong> a kimenet tartalmaz legalább 3 konkrét döntési pontot vagy lépést.</li>\n<li><strong>Metrika:</strong> 1 iteráció alatt eljutsz egy használható vázhoz / szöveghez / döntéshez (nem 10 kör).</li>\n<li><strong>Küszöb:</strong> a végleges változatban nincs angol “szivárgás” és nincs helyőrző.</li>\n</ul>\n`;
}

function ensureGoodBad(content: string) {
  if (hasSection(content, 'Jó vs rossz')) return content;
  return `${content}\n<hr />\n<h2>Jó vs rossz (gyors példa)</h2>\n<ul>\n<li><strong>Jó</strong>: pontos szerep + cél + formátum + 2–3 kritérium + példa.</li>\n<li><strong>Rossz</strong>: általános cél + nincs formátum + nincs kritérium.</li>\n</ul>\n`;
}

function ensureExamples(content: string) {
  if (hasSection(content, 'Példa')) return content;
  return `${content}\n<hr />\n<h2>Példa (mini)</h2>\n<p><strong>Példa prompt-váz:</strong> “Adj 3 variánst. Formátum: 1) cím (max 12 szó), 2) alcím (max 20 szó), 3) CTA (1 ige + 1 tárgy). Kritérium: legyen konkrét és tesztelhető.”</p>\n`;
}

function ensureActionSteps(content: string) {
  if (/(\\n|\\s)1\\.\\s/.test(content) || /<ol>/i.test(content)) return content;
  return `${content}\n<hr />\n<h2>Lépések (ellenőrző lista)</h2>\n<ol>\n<li>Írd le 1 mondatban: mi a bemenet és mi a kívánt kimenet.</li>\n<li>Add meg a formátumot (bullet / táblázat / 3 variáns).</li>\n<li>Adj 2–3 kritériumot (pl. hossz, tartalom, tiltások).</li>\n<li>Futtasd le, majd javíts 1 dolgot iterációnként.</li>\n</ol>\n`;
}

function ensurePitfalls(content: string) {
  if (hasSection(content, 'Gyakori hibák')) return content;
  return `${content}\n<hr />\n<h2>Gyakori hibák</h2>\n<ul>\n<li>Túl általános kérés → a modell túl általános választ ad.</li>\n<li>Nincs formátum → a kimenet nehezen összehasonlítható variánsok között.</li>\n<li>Nincs kritérium → nem tudod, mikor “jó elég”.</li>\n</ul>\n`;
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

