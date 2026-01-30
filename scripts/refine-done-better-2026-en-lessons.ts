/**
 * Refine DONE_BETTER_2026_EN lessons (quality lift to >=70)
 *
 * Purpose:
 * - Expand weak lessons so strict quiz generation can succeed (0 recall, >=7 valid, >=5 application).
 * - Keep a consistent, high-quality structure (definitions, procedure, example, checklist, metrics).
 *
 * Safety:
 * - Dry-run by default (no DB writes).
 * - On apply: creates per-lesson backups under scripts/lesson-backups/DONE_BETTER_2026_EN/.
 * - Restore via scripts/restore-lesson-from-backup.ts
 *
 * Usage:
 * - Dry-run:
 *   npx tsx --env-file=.env.local scripts/refine-done-better-2026-en-lessons.ts --from-day 1 --to-day 30
 * - Apply:
 *   npx tsx --env-file=.env.local scripts/refine-done-better-2026-en-lessons.ts --from-day 1 --to-day 30 --apply
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

const COURSE_ID = getArgValue('--course') || 'DONE_BETTER_2026_EN';
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

function escapeHtml(s: string) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function ul(items: string[]) {
  return `<ul>\n${items.map((i) => `  <li>${escapeHtml(i)}</li>`).join('\n')}\n</ul>\n`;
}

function ol(items: string[]) {
  return `<ol>\n${items.map((i) => `  <li>${escapeHtml(i)}</li>`).join('\n')}\n</ol>\n`;
}

type CanonicalConcept = { definition: string; notes?: string[] };
type CanonicalProcedure = { id: string; name: string; steps: string[] };
type CanonicalLesson = {
  dayNumber: number;
  canonicalTitle: string;
  intent: string;
  goals: string[];
  requiredConcepts?: string[];
  requiredProcedures?: string[];
  canonicalExample?: { scenario: string; diagnosis: string; betterApproach: string };
  commonMistakes?: string[];
};

function loadCanonical(): {
  lessons: CanonicalLesson[];
  concepts: Record<string, CanonicalConcept>;
  procedures: CanonicalProcedure[];
} {
  const p = join(process.cwd(), 'docs', 'canonical', 'DONE_BETTER_2026', 'DONE_BETTER_2026.canonical.json');
  const raw = readFileSync(p, 'utf8');
  const parsed = JSON.parse(raw);
  return {
    lessons: parsed.lessons || [],
    concepts: parsed.concepts || {},
    procedures: parsed.procedures || [],
  };
}

function buildChecklist(params: { goals: string[]; procedures: CanonicalProcedure[] }) {
  const items: string[] = [];
  for (const g of params.goals || []) {
    const trimmed = String(g || '').trim();
    if (trimmed) items.push(`Outcome: ${trimmed}`);
    if (items.length >= 4) break;
  }
  for (const p of params.procedures || []) {
    const firstStep = String(p.steps?.[0] || '').trim();
    if (firstStep) items.push(`Procedure (${p.name}): ${firstStep}`);
    if (items.length >= 6) break;
  }
  if (items.length < 4) {
    items.push('Write one sentence: what is the gap between current and desired state?');
    items.push('List 3 unknowns that block progress.');
    items.push('Choose one next testable step and schedule it.');
    items.push('Define what “done” means (test + evidence).');
  }
  return items.slice(0, 6);
}

function buildMetrics(params: { day: number; lesson: CanonicalLesson }) {
  const items: string[] = [];
  items.push('Output: 1 written problem statement (1 sentence).');
  items.push('Output: 3 options + 1 chosen next step.');
  items.push('Timebox: 20–30 minutes for the exercise.');
  items.push('Test: define evidence you would accept as “done”.');
  if ((params.lesson.requiredProcedures || []).includes('P8_REFLECT_AND_ADJUST')) {
    items.push('Cadence: schedule a weekly review (date + time).');
  }
  return items.slice(0, 6);
}

function buildLessonHtml(params: {
  day: number;
  title: string;
  intent: string;
  goals: string[];
  requiredConcepts: Array<{ id: string; concept: CanonicalConcept }>;
  requiredProcedures: CanonicalProcedure[];
  canonicalExample?: CanonicalLesson['canonicalExample'];
  commonMistakes: string[];
}) {
  const { day, title, intent, goals, requiredConcepts, requiredProcedures, canonicalExample, commonMistakes } = params;

  const conceptBlocks = requiredConcepts
    .map(({ id, concept }) => {
      const notes = (concept.notes || []).filter(Boolean).slice(0, 2);
      return (
        `<h3>${escapeHtml(id)}</h3>\n` +
        `<p><strong>Definition:</strong> ${escapeHtml(concept.definition || '')}</p>\n` +
        (notes.length ? `<p><strong>Notes:</strong></p>\n${ul(notes)}` : '')
      );
    })
    .join('\n');

  const procedureBlocks = requiredProcedures
    .map((p) => `<h3>${escapeHtml(p.name)}</h3>\n${ol((p.steps || []).map((s) => String(s || '').trim()).filter(Boolean))}`)
    .join('\n');

  const example = canonicalExample || {
    scenario: 'You are stuck on a task that keeps resurfacing.',
    diagnosis: 'You may be solving symptoms (urgent noise) instead of the underlying gap.',
    betterApproach: 'State the gap, list unknowns, pick one testable next step, and define evidence for done.',
  };

  const mistakes = (commonMistakes || []).filter(Boolean).slice(0, 6);
  const pitfalls = mistakes.length
    ? ul(mistakes.map((m) => `Pitfall: ${m}. Fix: write the test/criteria and run a small step first.`))
    : ul([
        'Pitfall: acting as a substitute for understanding. Fix: write unknowns first.',
        'Pitfall: vague “done”. Fix: define the test + evidence.',
        'Pitfall: too-big step. Fix: pick the next smallest testable move.',
      ]);

  const checklist = ul(buildChecklist({ goals, procedures: requiredProcedures }));
  const metrics = ul(buildMetrics({ day, lesson: { dayNumber: day, canonicalTitle: title, intent, goals } as any }));

  return (
    `<h1>${escapeHtml(`Done Better 2026 — Day ${day}`)}</h1>\n` +
    `<h2>${escapeHtml(title)}</h2>\n` +
    `<p><strong>Why it matters:</strong> ${escapeHtml(intent)}</p>\n` +
    `<h2>Goals</h2>\n` +
    ul(goals) +
    `<h2>Key concepts (definitions)</h2>\n` +
    (conceptBlocks || `<p><em>No concepts defined for this day.</em></p>\n`) +
    `<h2>Procedure (how to apply)</h2>\n` +
    (procedureBlocks || `<p><em>No procedure for today. Use the checklist below as your process.</em></p>\n`) +
    `<h2>Example (bad vs better)</h2>\n` +
    `<p><strong>Scenario:</strong> ${escapeHtml(example.scenario)}</p>\n` +
    `<p><strong>Bad (symptom-first):</strong> ${escapeHtml(example.diagnosis)}</p>\n` +
    `<p><strong>Better (gap + test):</strong> ${escapeHtml(example.betterApproach)}</p>\n` +
    `<h2>Checklist</h2>\n` +
    checklist +
    `<h2>Metrics / criteria</h2>\n` +
    metrics +
    `<h2>Common mistakes + fixes</h2>\n` +
    pitfalls
  );
}

async function main() {
  await connectDB();

  const course = await Course.findOne({ courseId: COURSE_ID, isActive: true }).lean();
  if (!course) throw new Error(`Course not found: ${COURSE_ID}`);
  if (String(course.language || '').toLowerCase() !== 'en') {
    throw new Error(`Course language is not EN for ${COURSE_ID} (found: ${course.language})`);
  }

  const canonical = loadCanonical();
  const ccsByDay = new Map<number, CanonicalLesson>();
  for (const l of canonical.lessons || []) ccsByDay.set(l.dayNumber, l);
  const conceptById = canonical.concepts || {};
  const procById = new Map<string, CanonicalProcedure>();
  for (const p of canonical.procedures || []) procById.set(p.id, p);

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
      planRows.push({ day, lessonId: lesson.lessonId, action: 'SKIP_NO_CCS', reason: 'Missing canonical entry' });
      continue;
    }

    const oldContent = String(lesson.content || '');
    const oldTitle = String(lesson.title || '');
    const oldScore = assessLessonQuality({ title: oldTitle, content: oldContent, language: 'en' });

    // Safety: never overwrite already-strong lessons unless language integrity fails (shouldn't for EN).
    const oldIntegrity = validateLessonRecordLanguageIntegrity({
      language: 'en',
      content: oldContent,
      emailSubject: lesson.emailSubject || null,
      emailBody: lesson.emailBody || null,
    });
    const forceRefine = !oldIntegrity.ok;
    if (oldScore.score >= 70 && !forceRefine) {
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

    const requiredConcepts = (ccsLesson.requiredConcepts || []).filter(Boolean).map((id) => ({ id, concept: conceptById[id] }));
    const requiredProcedures = (ccsLesson.requiredProcedures || []).filter(Boolean).map((id) => procById.get(id)).filter(Boolean) as CanonicalProcedure[];

    const nextTitle = String(ccsLesson.canonicalTitle || oldTitle || `Done Better 2026 — Day ${day}`).trim();
    const nextContent = buildLessonHtml({
      day,
      title: nextTitle,
      intent: String(ccsLesson.intent || '').trim(),
      goals: (ccsLesson.goals || []).filter(Boolean),
      requiredConcepts: requiredConcepts.filter((x) => x.concept && x.concept.definition),
      requiredProcedures,
      canonicalExample: ccsLesson.canonicalExample,
      commonMistakes: (ccsLesson.commonMistakes || []).filter(Boolean),
    });

    const nextScore = assessLessonQuality({ title: nextTitle, content: nextContent, language: 'en' });

    const emailSubject = `Done Better 2026 — Day ${day}: ${nextTitle}`;
    const emailBody =
      `<h1>Done Better 2026 — Day ${day}</h1>\n` +
      `<h2>${escapeHtml(nextTitle)}</h2>\n` +
      `<p>${escapeHtml(String(ccsLesson.intent || '').trim())}</p>\n` +
      `<p><a href=\"${appUrl}/en/courses/${COURSE_ID}/day/${day}\">Open lesson →</a></p>`;

    const integrity = validateLessonRecordLanguageIntegrity({
      language: 'en',
      content: nextContent,
      emailSubject,
      emailBody,
    });

    planRows.push({
      day,
      lessonId: lesson.lessonId,
      title: nextTitle,
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
    if (nextScore.score < 70) {
      throw new Error(`Refined lesson score is still below 70 for ${COURSE_ID} day ${day} (${lesson.lessonId})`);
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

    const update = await Lesson.updateOne(
      { _id: lesson._id },
      {
        $set: {
          title: nextTitle,
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

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

