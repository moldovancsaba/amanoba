/**
 * Refine Productivity 2026 BG Lessons (low-quality days)
 *
 * Purpose:
 * - Improve lesson content quality so quizzes can be generated at strict standards (0 recall, >=7 questions, >=5 application).
 *
 * Safety:
 * - Dry-run by default (no DB writes).
 * - On apply: creates per-lesson backups under scripts/lesson-backups/PRODUCTIVITY_2026_BG/.
 * - Restore via scripts/restore-lesson-from-backup.ts
 *
 * Usage:
 * - Dry-run (preview + report):
 *   npx tsx --env-file=.env.local scripts/refine-productivity-2026-bg-lessons.ts --from-day 1 --to-day 30
 *
 * - Apply (DB writes + backups):
 *   npx tsx --env-file=.env.local scripts/refine-productivity-2026-bg-lessons.ts --from-day 1 --to-day 30 --apply
 */

import { config } from 'dotenv';
import { resolve, join } from 'path';
import { mkdirSync, readFileSync, writeFileSync } from 'fs';

config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../app/lib/mongodb';
import { Course, Lesson } from '../app/lib/models';
import { assessLessonQuality } from './lesson-quality';
import { validateLessonRecordLanguageIntegrity } from './language-integrity';

function getArgValue(flag: string): string | undefined {
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return undefined;
  return process.argv[idx + 1];
}

const COURSE_ID = getArgValue('--course') || 'PRODUCTIVITY_2026_BG';
const FROM_DAY = Number(getArgValue('--from-day') || '1');
const TO_DAY = Number(getArgValue('--to-day') || '30');
const APPLY = process.argv.includes('--apply');
const OUT_DIR = getArgValue('--out-dir') || join(process.cwd(), 'scripts', 'reports');
const BACKUP_DIR = getArgValue('--backup-dir') || join(process.cwd(), 'scripts', 'lesson-backups');

function isoStamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function stripHtml(input: string) {
  return String(input || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

type CCSLesson = {
  dayNumber: number;
  canonicalTitle: string;
  intent: string;
  goals: string[];
  requiredConcepts?: string[];
  requiredProcedures?: string[];
  canonicalExample?: string;
  commonMistakes?: string[];
};

type CCSProcedure = {
  id: string;
  name: string;
  steps: string[];
};

function loadProductivityCCS(): { lessons: CCSLesson[]; procedures: CCSProcedure[] } {
  const p = join(process.cwd(), 'docs', 'canonical', 'PRODUCTIVITY_2026', 'PRODUCTIVITY_2026.canonical.json');
  const raw = readFileSync(p, 'utf8');
  const parsed = JSON.parse(raw);
  return { lessons: parsed.lessons || [], procedures: parsed.procedures || [] };
}

function ul(items: string[]) {
  return `<ul>\n${items.map(i => `  <li>${i}</li>`).join('\n')}\n</ul>`;
}

function ol(items: string[]) {
  return `<ol>\n${items.map(i => `  <li>${i}</li>`).join('\n')}\n</ol>`;
}

function escapeHtml(s: string) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function procedureNameBg(id: string, fallback: string) {
  const map: Record<string, string> = {
    P1_PERSONAL_PRODUCTIVITY_DEFINITION: 'Лична дефиниция за продуктивност (output → outcome → ограничения)',
    P2_WEEKLY_REVIEW_THROUGHPUT_FOCUS_CARRYOVER: 'Седмичен преглед (throughput / фокус блокове / carryover)',
    P3_DEEP_WORK_DAY_DESIGN: 'Дизайн на ден за дълбока работа (блокове + защита + буфер)',
    P4_TASK_AUDIT_DELEGATE_ELIMINATE: 'Одит на задачи (делегирай vs елиминирай)',
    P5_DECISION_MATRIX_AND_CATEGORIES: 'Матрица за решения + категории решения',
  };
  return map[id] || fallback;
}

function translateProcedureStepBg(step: string) {
  const s = String(step || '').trim();
  const map: Array<[RegExp, string]> = [
    [/^Count throughput:/i, 'Преброй throughput:'],
    [/^Count focus blocks:/i, 'Преброй фокус блоковете:'],
    [/^Count carryover:/i, 'Преброй carryover:'],
    [/^Write 2 insights:/i, 'Запиши 2 извода:'],
    [/^Make 1 rule change/i, 'Избери 1 промяна на правило за следващата седмица:'],
  ];
  for (const [re, rep] of map) {
    if (re.test(s)) return s.replace(re, rep);
  }
  return s;
}

function buildIntentBg(requiredProcedureIds: string[]) {
  if (requiredProcedureIds.includes('P3_DEEP_WORK_DAY_DESIGN')) {
    return 'Днес проектираш деня си така, че да защити 2+ фокус блока и да превърне времето в измерим outcome (а не само активност).';
  }
  if (requiredProcedureIds.includes('P2_WEEKLY_REVIEW_THROUGHPUT_FOCUS_CARRYOVER')) {
    return 'Днес изграждаш обратна връзка (feedback loop): измерваш throughput, фокус блокове и carryover, за да коригираш 1 правило за следващата седмица.';
  }
  if (requiredProcedureIds.includes('P4_TASK_AUDIT_DELEGATE_ELIMINATE')) {
    return 'Днес намаляваш натоварването чрез ясен одит: какво да делегираш, какво да елиминираш и какво да оставиш, така че ограниченията да не се изчерпват без резултат.';
  }
  if (requiredProcedureIds.includes('P5_DECISION_MATRIX_AND_CATEGORIES')) {
    return 'Днес намаляваш забавянето в решенията: задаваш критерии и прагове, категоризираш решенията и предотвратяваш “заседнали” задачи.';
  }
  return 'Днес превръщаш активността в измерим резултат: дефинираш критерий “готово”, метрика и праг и тестваш с малък пилот.';
}

function buildGoalsBg(requiredProcedureIds: string[]) {
  const goals: string[] = [];
  if (requiredProcedureIds.includes('P2_WEEKLY_REVIEW_THROUGHPUT_FOCUS_CARRYOVER')) {
    goals.push('Измери throughput (завършени важни резултати), фокус блокове и carryover и запиши 2 извода.');
    goals.push('Избери 1 промяна на правило за следващата седмица и дефинирай как ще провериш ефекта.');
  }
  if (requiredProcedureIds.includes('P3_DEEP_WORK_DAY_DESIGN')) {
    goals.push('Планирай 2 защитени фокус блока + 20–30% буфер, за да намалиш прекъсванията и стреса.');
    goals.push('Дефинирай “готово” за 1 ключов output и какъв outcome трябва да произведе.');
  }
  if (requiredProcedureIds.includes('P4_TASK_AUDIT_DELEGATE_ELIMINATE')) {
    goals.push('Класифицирай задачи: делегирай / елиминирай / остави, и създай правило за входящи заявки.');
  }
  if (requiredProcedureIds.includes('P5_DECISION_MATRIX_AND_CATEGORIES')) {
    goals.push('Определи критерий + праг за 1 решение и постави срок/собственик, за да избегнеш отлагане.');
  }
  if (goals.length < 3) {
    goals.push('Избери 1 метрика и 1 праг за успех и направи малък тест (pilot), вместо да променяш всичко наведнъж.');
  }
  return goals.slice(0, 6);
}

function buildMetricsBg() {
  return [
    'Метрика: throughput (брой завършени важни резултати).',
    'Метрика: фокус блокове (брой непрекъснати блокове за дълбока работа).',
    'Метрика: carryover (брой/дял на прехвърлените задачи).',
    'Критерий: ясна дефиниция за “готово” (проверима).',
    'Праг (threshold): предварително дефиниран минимум за успех.',
  ];
}

function buildBGLessonHtml(params: {
  day: number;
  title: string;
  intent: string;
  goals: string[];
  requiredProcedures: CCSProcedure[];
  canonicalExample?: string;
  commonMistakes: string[];
}) {
  const { day, title, intent, goals, requiredProcedures, canonicalExample, commonMistakes } = params;

  const procedureBlocks = requiredProcedures
    .map((p) => {
      const stepsBg = (p.steps || []).map(translateProcedureStepBg);
      return (
        `<h3>${escapeHtml(procedureNameBg(p.id, p.name))}</h3>\n` +
        `<p><em>Цел:</em> произведи измерим output и го вържи към outcome (критерий + метрика + праг).</p>\n` +
        ol(stepsBg.map((s) => escapeHtml(s)))
      );
    })
    .join('\n');

  const exampleText =
    canonicalExample ||
    '✅ Добър пример: 2 фокус блока + 1 важен output + нисък carryover. ❌ Лош пример: много активност, но 0 завършен резултат и нарушени ограничения.';

  const mistakes = commonMistakes.length
    ? commonMistakes.map((m) => `❌ Грешка: ${m}. ✅ Корекция: напиши критерий/метрика, тествай малко, промени 1 правило.`)
    : [
        '❌ Грешка: променяш всичко наведнъж. ✅ Корекция: 1 правило, 1 метрика, 1 седмичен тест.',
        '❌ Грешка: няма критерий “готово”. ✅ Корекция: дефинирай проверимо “done” и измери преди/след.',
      ];

  const content =
    `<h1>${escapeHtml(`Продуктивност 2026 — Ден ${day}`)}</h1>\n` +
    `<h2>${escapeHtml(title)}</h2>\n` +
    `<p><strong>Защо е важно?</strong> ${escapeHtml(intent)}</p>\n` +
    `<h2>Цели за деня (outcome)</h2>\n` +
    ul(goals.map((g) => escapeHtml(g))) +
    `<h2>Стъпки (процес) + контрол</h2>\n` +
    (procedureBlocks || `<p>Днес: избери 1 правило, 1 метрика, малък пилот и провери резултата.</p>`) +
    `<h2>Пример (добро vs лошо)</h2>\n` +
    `<p>${escapeHtml(exampleText)}</p>\n` +
    `<h2>Чести грешки и корекции</h2>\n` +
    ul(mistakes.map((m) => escapeHtml(m))) +
    `<h2>Метрики, критерии, прагове</h2>\n` +
    ul(buildMetricsBg().map((m) => escapeHtml(m)));

  return content;
}

async function main() {
  await connectDB();

  const course = await Course.findOne({ courseId: COURSE_ID, isActive: true }).lean();
  if (!course) throw new Error(`Course not found: ${COURSE_ID}`);
  if (String(course.language || '').toLowerCase() !== 'bg') {
    throw new Error(`Course language is not BG for ${COURSE_ID} (found: ${course.language})`);
  }

  const lessons = await Lesson.find({ courseId: course._id, isActive: true })
    .sort({ dayNumber: 1, displayOrder: 1, createdAt: 1, _id: 1 })
    .select({ _id: 1, lessonId: 1, dayNumber: 1, title: 1, content: 1, emailSubject: 1, emailBody: 1, createdAt: 1 })
    .lean();

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

  const ccs = loadProductivityCCS();
  const ccsByDay = new Map<number, CCSLesson>();
  for (const l of ccs.lessons) ccsByDay.set(l.dayNumber, l);

  const procById = new Map<string, CCSProcedure>();
  for (const p of ccs.procedures) procById.set(p.id, p);

  const stamp = isoStamp();
  mkdirSync(OUT_DIR, { recursive: true });

  const planRows: any[] = [];
  const applyResults: any[] = [];

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.amanoba.com';

  for (let day = FROM_DAY; day <= TO_DAY; day++) {
    const lesson = byDay.get(day);
    if (!lesson) {
      planRows.push({ day, action: 'SKIP_NO_LESSON', reason: 'Missing lesson in DB for that day' });
      continue;
    }

    const ccsLesson = ccsByDay.get(day);
    if (!ccsLesson) {
      planRows.push({ day, lessonId: lesson.lessonId, action: 'SKIP_NO_CCS', reason: 'Missing CCS entry' });
      continue;
    }

    const oldContent = String(lesson.content || '');
    const oldTitle = String(lesson.title || '');
    const oldScore = assessLessonQuality({ title: oldTitle, content: oldContent, language: 'bg' });
    const oldText = stripHtml(oldContent);
    const forceRefineForLanguage =
      /[A-Za-z]{15,}/.test(oldText) ||
      /\b(Replace|Distinguish|Identify|Write|Establish)\b/.test(oldText);

    if (oldScore.score >= 70 && !forceRefineForLanguage) {
      planRows.push({
        day,
        lessonId: lesson.lessonId,
        title: oldTitle,
        action: 'SKIP_ALREADY_OK',
        quality: { old: oldScore, next: oldScore },
        lengths: { oldChars: stripHtml(oldContent).length, nextChars: stripHtml(oldContent).length },
        applyEligible: true,
      });
      continue;
    }

    const requiredProcedures = (ccsLesson.requiredProcedures || [])
      .filter(Boolean)
      .map((id) => procById.get(id))
      .filter(Boolean) as CCSProcedure[];
    const requiredProcedureIds = (ccsLesson.requiredProcedures || []).filter(Boolean);

    const nextContent = buildBGLessonHtml({
      day,
      title: oldTitle || `Продуктивност 2026 — Ден ${day}`,
      intent: buildIntentBg(requiredProcedureIds),
      goals: buildGoalsBg(requiredProcedureIds),
      requiredProcedures,
      canonicalExample: undefined,
      commonMistakes: [],
    });
    const nextScore = assessLessonQuality({ title: oldTitle, content: nextContent, language: 'bg' });
    const integrity = validateLessonRecordLanguageIntegrity({
      language: 'bg',
      content: nextContent,
      emailSubject: `Продуктивност 2026 – Ден ${day}: ${oldTitle}`,
      emailBody:
        `<h1>Продуктивност 2026 – Ден ${day}</h1>\n` +
        `<h2>${escapeHtml(oldTitle)}</h2>\n` +
        `<p>${escapeHtml(buildIntentBg(requiredProcedureIds))}</p>\n` +
        `<p><a href=\"${appUrl}/bg/courses/${COURSE_ID}/day/${day}\">Отвори урока →</a></p>`,
    });

    planRows.push({
      day,
      lessonId: lesson.lessonId,
      title: oldTitle,
      action: 'REFINE',
      quality: { old: oldScore, next: nextScore },
      lengths: { oldChars: stripHtml(oldContent).length, nextChars: stripHtml(nextContent).length },
      applyEligible: nextScore.score >= 70 && integrity.ok,
      languageIntegrity: integrity,
    });

    if (!APPLY) continue;
    if (!integrity.ok) {
      throw new Error(
        `Language integrity failed for ${COURSE_ID} day ${day} (${lesson.lessonId}): ${integrity.errors[0] || 'unknown'}`
      );
    }

    const courseFolder = join(BACKUP_DIR, COURSE_ID);
    mkdirSync(courseFolder, { recursive: true });
    const backupPath = join(courseFolder, `${lesson.lessonId}__${stamp}.json`);
    writeFileSync(
      backupPath,
      JSON.stringify(
        {
          backedUpAt: new Date().toISOString(),
          courseId: COURSE_ID,
          lessonId: lesson.lessonId,
          dayNumber: lesson.dayNumber,
          title: oldTitle,
          content: oldContent,
          emailSubject: lesson.emailSubject || null,
          emailBody: lesson.emailBody || null,
        },
        null,
        2
      )
    );

    const emailSubject = `Продуктивност 2026 – Ден ${day}: ${oldTitle}`;
    const emailBody =
      `<h1>Продуктивност 2026 – Ден ${day}</h1>\n` +
      `<h2>${escapeHtml(oldTitle)}</h2>\n` +
      `<p>${escapeHtml(buildIntentBg(requiredProcedureIds))}</p>\n` +
      `<p><a href=\"${appUrl}/bg/courses/${COURSE_ID}/day/${day}\">Отвори урока →</a></p>`;

    const update = await Lesson.updateOne(
      { _id: lesson._id },
      {
        $set: {
          content: nextContent,
          emailSubject,
          emailBody,
          'metadata.updatedAt': new Date(),
        },
      }
    );

    applyResults.push({
      day,
      lessonId: lesson.lessonId,
      backupPath,
      matched: update.matchedCount,
      modified: update.modifiedCount,
      newScore: nextScore.score,
    });
  }

  const reportPath = join(OUT_DIR, `lesson-refine-preview__${COURSE_ID}__${stamp}.json`);
  writeFileSync(
    reportPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        courseId: COURSE_ID,
        fromDay: FROM_DAY,
        toDay: TO_DAY,
        apply: APPLY,
        totals: {
          considered: planRows.length,
          eligible70: planRows.filter((r) => r.applyEligible).length,
          below70: planRows.filter((r) => !r.applyEligible).length,
          applied: applyResults.length,
        },
        planRows,
        applyResults,
      },
      null,
      2
    )
  );

  console.log('✅ Lesson refinement preview complete');
  console.log(`- Apply mode: ${APPLY ? 'YES (DB writes + backups)' : 'NO (dry-run only)'}`);
  console.log(`- Report: ${reportPath}`);
  if (APPLY) console.log(`- Backups: ${join(BACKUP_DIR, COURSE_ID)}`);
  if (APPLY) console.log(`- Applied lessons: ${applyResults.length}`);

  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
