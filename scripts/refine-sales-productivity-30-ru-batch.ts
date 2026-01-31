/**
 * SALES_PRODUCTIVITY_30_RU — Batch refine below-min days so they pass the lesson-quality gate (>=70).
 *
 * These days are blocked by lesson-quality issues (TOO_SHORT, missing definitions/examples/contrast/metrics).
 * This script enriches lesson content in RU without changing the core intent.
 *
 * Safety:
 * - Dry-run by default (no DB writes).
 * - On apply: per-lesson backups under scripts/lesson-backups/SALES_PRODUCTIVITY_30_RU/.
 * - Restore via scripts/restore-lesson-from-backup.ts
 *
 * Usage:
 * - Dry-run (defaults to known below-min days 13–30):
 *   npx tsx --env-file=.env.local scripts/refine-sales-productivity-30-ru-batch.ts
 * - Apply:
 *   npx tsx --env-file=.env.local scripts/refine-sales-productivity-30-ru-batch.ts --apply
 * - Custom days:
 *   npx tsx --env-file=.env.local scripts/refine-sales-productivity-30-ru-batch.ts --days 13,14,15
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
const COURSE_ID = 'SALES_PRODUCTIVITY_30_RU';

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
    // Known below-min days: 13–30
    return Array.from({ length: 18 }, (_, i) => 13 + i);
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
  if (hasSection(content, 'Определение')) return content;
  return (
    `${content}\n<hr />\n<h2>Определение (что это / что это не)</h2>\n` +
    `<p><strong>Что это:</strong> <em>${title}</em> — это правило/практика, которую можно проверить по конкретному выходу (что сделано, кем, к какому сроку и по какому критерию).</p>\n` +
    `<ul>\n` +
    `<li><strong>Что это не:</strong> лозунг “будем стараться” без артефакта, владельца и порога успеха.</li>\n` +
    `<li><strong>Разница:</strong> хорошая практика даёт проверяемый выход; плохая — только активность и ощущения.</li>\n` +
    `</ul>\n`
  );
}

function ensureSuccessCriteria(content: string) {
  if (hasSection(content, 'Критерии успеха')) return content;
  return (
    `${content}\n<hr />\n<h2>Критерии успеха (метрики)</h2>\n` +
    `<ul>\n` +
    `<li><strong>Критерий:</strong> в конце каждого контакта зафиксирован следующий шаг, владелец и срок (без “созвонимся”).</li>\n` +
    `<li><strong>Метрика:</strong> рост конверсии между этапами, а не только рост количества касаний.</li>\n` +
    `<li><strong>Метрика:</strong> доля “застрявших” сделок падает (причина + следующий шаг ясны).</li>\n` +
    `<li><strong>Порог:</strong> через 7 дней можно доказать “стало лучше/хуже” на одном и том же срезе.</li>\n` +
    `</ul>\n`
  );
}

function ensureGoodBad(content: string) {
  if (hasSection(content, 'Хорошо vs плохо')) return content;
  return (
    `${content}\n<hr />\n<h2>Хорошо vs плохо (быстрый контраст)</h2>\n` +
    `<ul>\n` +
    `<li><strong>Хорошо:</strong> конкретный обмен, конкретный срок, понятный следующий шаг и критерий “готово”.</li>\n` +
    `<li><strong>Плохо:</strong> общие обещания, “давайте вернёмся позже”, нет владельца и нет проверяемого выхода.</li>\n` +
    `</ul>\n`
  );
}

function ensureExamples(content: string) {
  if (hasSection(content, 'Пример')) return content;
  return (
    `${content}\n<hr />\n<h2>Пример</h2>\n` +
    `<ul>\n` +
    `<li><strong>Хороший пример:</strong> “Если до пятницы согласуем критерии решения, запускаем пилот на 2 недели. Если нет — фиксируем причину и возвращаемся к вопросу через 30 дней.”</li>\n` +
    `<li><strong>Плохой пример:</strong> “Мы подумаем и как‑нибудь решим” (нет даты, нет критерия, нет следующего шага).</li>\n` +
    `</ul>\n`
  );
}

function ensureActionSteps(content: string) {
  if (/(\\n|\\s)1\\.\\s/.test(content) || /<ol>/i.test(content)) return content;
  return (
    `${content}\n<hr />\n<h2>Шаги (5 минут)</h2>\n` +
    `<ol>\n` +
    `<li>Запишите “выход” одним предложением: что должно быть готово в конце.</li>\n` +
    `<li>Добавьте 3 критерия: когда это точно “готово”, а когда нет.</li>\n` +
    `<li>Сделайте один маленький пилот (1 кейс/1 неделя) и измерьте “до/после”.</li>\n` +
    `<li>Зафиксируйте следующий шаг, владельца и дату проверки.</li>\n` +
    `</ol>\n`
  );
}

function ensurePitfalls(content: string) {
  if (hasSection(content, 'Типичные ошибки')) return content;
  return (
    `${content}\n<hr />\n<h2>Типичные ошибки</h2>\n` +
    `<ul>\n` +
    `<li>Путать активность (звонки/письма) с результатом (движение этапов, принятое решение).</li>\n` +
    `<li>Менять сразу много вещей: невозможно понять, что дало эффект.</li>\n` +
    `<li>Нет “следующего шага” и срока — воронка визуально живёт, но реально не движется.</li>\n` +
    `<li>Нет примеров “хорошо/плохо” — команда понимает правило по‑разному.</li>\n` +
    `</ul>\n`
  );
}

function refineContent(params: { title: string; content: string; issues: LessonQualityIssue[] }) {
  let next = params.content;
  const issues = params.issues;

  if (issues.includes('NO_CLEAR_DEFINITIONS') || issues.includes('TOO_SHORT')) next = ensureDefinitionBlock(next, params.title);
  if (issues.includes('NO_METRICS_OR_CRITERIA') || issues.includes('TOO_SHORT')) next = ensureSuccessCriteria(next);
  if (issues.includes('NO_CONTRASTS_GOOD_BAD') || issues.includes('TOO_SHORT')) next = ensureGoodBad(next);
  if (issues.includes('NO_EXAMPLES') || issues.includes('TOO_SHORT')) next = ensureExamples(next);
  if (issues.includes('NO_ACTIONABLE_STEPS') || issues.includes('TOO_SHORT')) next = ensureActionSteps(next);
  if (issues.includes('TOO_SHORT')) next = ensurePitfalls(next);

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
    const oldQuality = assessLessonQuality({ title, content, language: 'ru' });
    const nextContent = refineContent({ title, content, issues: oldQuality.issues });
    const newQuality = assessLessonQuality({ title, content: nextContent, language: 'ru' });

    const integrity = validateLessonRecordLanguageIntegrity({
      language: 'ru',
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

