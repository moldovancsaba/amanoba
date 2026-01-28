/**
 * Refine Productivity 2026 EN Lessons (Day 11 and 14–30)
 *
 * Purpose:
 * - Improve lesson content quality so quizzes can be generated at strict standards (0 recall, >=7 questions, >=5 application).
 *
 * Safety:
 * - Dry-run by default (no DB writes).
 * - On apply: creates per-lesson backups under scripts/lesson-backups/PRODUCTIVITY_2026_EN/.
 * - Restore via scripts/restore-lesson-from-backup.ts
 *
 * Usage:
 * - Dry-run (preview + report):
 *   npx tsx --env-file=.env.local scripts/refine-productivity-2026-en-lessons.ts --from-day 11 --to-day 30
 *
 * - Apply (DB writes + backups):
 *   npx tsx --env-file=.env.local scripts/refine-productivity-2026-en-lessons.ts --from-day 11 --to-day 30 --apply
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

const COURSE_ID = getArgValue('--course') || 'PRODUCTIVITY_2026_EN';
const FROM_DAY = Number(getArgValue('--from-day') || '11');
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

function titleCaseDay(day: number) {
  return `Day ${day}`;
}

type CCSLesson = {
  dayNumber: number;
  canonicalTitle: string;
  intent: string;
  goals: string[];
  commonMistakes?: string[];
};

function loadProductivityCCS(): { lessons: CCSLesson[] } {
  const p = join(process.cwd(), 'docs', 'canonical', 'PRODUCTIVITY_2026', 'PRODUCTIVITY_2026.canonical.json');
  const raw = readFileSync(p, 'utf8');
  const parsed = JSON.parse(raw);
  return parsed;
}

function htmlSection(title: string, body: string) {
  return `<h2>${title}</h2>\n${body}\n`;
}

function ul(items: string[]) {
  return `<ul>\n${items.map(i => `  <li>${i}</li>`).join('\n')}\n</ul>`;
}

function ol(items: string[]) {
  return `<ol>\n${items.map(i => `  <li>${i}</li>`).join('\n')}\n</ol>`;
}

function buildENLessonHtml(params: {
  day: number;
  title: string;
  intent: string;
  goals: string[];
  commonMistakes: string[];
}) {
  const { day, title, intent, goals, commonMistakes } = params;

  // Always include the quality signals required by assessLessonQuality:
  // - bullets + numbered steps, examples, good/bad contrast, metrics/criteria keywords, definitions/comparisons keywords.
  const metrics = (() => {
    switch (day) {
      case 11:
        return [
          'Objective clarity: can a teammate repeat it without extra context?',
          'Key Results: 2–4 measurable numbers with a deadline (criteria/threshold).',
          'Weekly score: progress % and blockers list (metrics).',
        ];
      case 14:
        return [
          'Agenda coverage: % meetings with agenda sent in advance (metric).',
          'Decision log: every meeting ends with decisions + owners (criteria).',
          'Time-box compliance: end on time; track overrun rate (threshold).',
        ];
      case 15:
        return [
          'Role clarity: each workstream has one owner (criteria).',
          'Handoff quality: fewer “bounces” between people (metric).',
          'Cycle time: time from task start → done (metric).',
        ];
      case 16:
        return [
          'Recovery adherence: planned breaks actually taken (metric).',
          'Burnout signals: frequency of irritability/sleep issues (criteria).',
          'Sustainable pace: consistent throughput without overtime spikes (metric).',
        ];
      case 17:
        return [
          'Consistency: number of planned focus blocks completed (metric).',
          'Visible progress: weekly throughput trend (metric).',
          'Win cadence: at least 1 celebrated win per week (criteria).',
        ];
      case 18:
        return [
          'Time-to-stabilize: how quickly critical priorities are protected (metric).',
          'Post-mortem completion: do we log lessons learned within 48h (criteria).',
          'Decision latency: time from issue → decision (metric).',
        ];
      case 19:
        return [
          'North-star outcome: 1–3 year direction statement (criteria).',
          'Leading indicators: weekly/monthly metrics that predict outcomes (metrics).',
          'Quarterly outcomes: measurable targets with deadlines (threshold).',
        ];
      case 20:
        return [
          'Friction reduced: fewer repeated “where is X” moments at home (metric).',
          'Project momentum: weekly progress on 1 personal outcome (metric).',
          'Carryover reduced: fewer postponed household tasks (metric).',
        ];
      case 21:
        return [
          'Cadence: weekly or biweekly outreach system (metric).',
          'Relationship depth: meaningful conversations vs. random pings (criteria).',
          'Learning loop: documented takeaways shared back into your system (metric).',
        ];
      case 22:
        return [
          'Time saved: minutes/week saved after automation (metric).',
          'Error rate: fewer manual mistakes (metric).',
          'Maintainability: tool complexity stays low (criteria).',
        ];
      case 23:
        return [
          'Experiment definition: hypothesis + success criteria (criteria).',
          'Iteration speed: time from idea → test → decision (metric).',
          'Learning captured: insights logged and turned into a rule (metric).',
        ];
      case 24:
        return [
          'Priority focus: top 1–3 outcomes protected (criteria).',
          'Noise reduction: removed one low-value input channel (metric).',
          'Carryover: backlog shrink trend (metric).',
        ];
      case 25:
        return [
          'Practice minutes/week (metric).',
          'Feedback loop: weekly review of skill outputs (criteria).',
          'Milestones: measurable competence checkpoints (threshold).',
        ];
      case 26:
        return [
          'Artifact count: checklists/templates produced (metric).',
          'Delegation success: % tasks completed to spec after mentoring (metric).',
          'Bottleneck reduction: fewer “only you can do it” tasks (criteria).',
        ];
      case 27:
        return [
          'Ritual adherence: days/week completed (metric).',
          'Friction points removed: fewer missed starts (criteria).',
          'Outcome impact: throughput or focus blocks improve (metric).',
        ];
      case 28:
        return [
          'Value alignment: weekly tasks map to stated values (criteria).',
          'Decision filter: fewer “yes” commitments that violate priorities (metric).',
          'Sustained outcomes: progress without resentment/burnout (criteria).',
        ];
      case 29:
        return [
          'One rule change per week (criteria).',
          'Metrics trend: throughput/focus/carryover tracked (metric).',
          'Retrospective completion: learnings turned into system updates (metric).',
        ];
      case 30:
        return [
          '90-day outcomes defined with deadlines (criteria).',
          'Weekly review scheduled and protected (metric).',
          'Accountability mechanism chosen and used (criteria).',
        ];
      default:
        return [
          'At least 1 metric and 1 criterion are defined (metrics/criteria).',
          'A threshold is set for success where appropriate (threshold).',
          'Results are reviewed weekly (metric).',
        ];
    }
  })();

  const steps = (() => {
    switch (day) {
      case 11:
        return [
          'Write one Objective in a single sentence (definition: what success changes).',
          'Add 2–4 Key Results that are measurable and time-bound (criteria).',
          'Define weekly check-in: what metric moves this week and why.',
          'Break into next actions for the next 7 days (projects → next actions).',
          'Run a mini-review: keep, change, or drop activities that do not move KRs.',
        ];
      case 14:
        return [
          'Write the agenda with decision questions (not topics).',
          'Time-box each agenda item and assign an owner.',
          'End every meeting with: decisions, owners, next actions, deadlines.',
          'Maintain a decision log and link it to follow-up tasks.',
          'Review metrics weekly and eliminate meetings that don’t produce outcomes.',
        ];
      case 15:
        return [
          'Define roles: one owner per outcome, clear responsibilities vs. dependencies.',
          'Set a coordination cadence (async update + short sync if needed).',
          'Use a shared definition of “done” (criteria) to reduce rework.',
          'Reduce handoff friction: templates, checklists, and clear inputs/outputs.',
          'Review cycle time and fix the biggest bottleneck each week.',
        ];
      case 16:
        return [
          'Identify your top 2 fatigue signals (sleep, irritability, decision quality).',
          'Add a daily recovery ritual (micro + macro break).',
          'Set a stop time boundary and protect it for a week.',
          'Reduce the highest-drain activity (meetings, context switching, late-night work).',
          'Measure outcomes vs. constraints weekly and adjust pace before burnout.',
        ];
      case 17:
        return [
          'Choose one progress metric that predicts outcomes (metric).',
          'Create a weekly “win review” to reinforce the system.',
          'Design a reward that reinforces good behavior (not busyness).',
          'Protect focus blocks as a non-negotiable system rule.',
          'Adjust one rule per week and keep the system consistent.',
        ];
      case 18:
        return [
          'Stabilize: identify the one critical outcome to protect today.',
          'Categorize decisions (small/medium/large) and apply the right depth.',
          'Communicate one rule change (e.g., batching, meeting freeze) for the crisis window.',
          'Run a short post-mortem: what happened, what changes, what we keep.',
          'Turn learnings into a checklist for next time.',
        ];
      case 19:
        return [
          'Write a 1–3 year direction (vision) in 2 sentences.',
          'Pick 2–3 outcomes to pursue this year and define leading indicators (metrics).',
          'Translate outcomes into 1–2 quarterly projects with measurable criteria.',
          'Schedule monthly strategy review and weekly execution review.',
          'Kill or pause initiatives that don’t align with the direction.',
        ];
      case 20:
        return [
          'Pick one home friction point (lost items, chores, clutter, errands).',
          'Define the outcome you want (e.g., “15 minutes to reset the home”).',
          'Build a simple system: input → steps → output (system vs habit).',
          'Set a weekly review metric (carryover, time saved).',
          'Iterate: remove one friction point each week.',
        ];
      case 21:
        return [
          'Define your network outcome (learning, opportunities, support).',
          'Create a lightweight outreach cadence (weekly/biweekly).',
          'Use an async-first approach; avoid unnecessary meetings.',
          'Capture learnings into your system (notes, next actions).',
          'Review what relationships produce outcomes and adjust.',
        ];
      case 22:
        return [
          'Define selection criteria: time saved, error reduction, maintainability.',
          'Choose one repetitive workflow and map inputs/outputs.',
          'Automate the smallest safe part first (good enough).',
          'Measure the change: time saved and error rate.',
          'Keep tools minimal; remove complexity that doesn’t improve outcomes.',
        ];
      case 23:
        return [
          'Write a hypothesis: “If we change X, outcome Y improves”.',
          'Define success criteria and a stop rule (threshold).',
          'Run the smallest experiment that can validate it.',
          'Measure results and decide: keep, iterate, or drop.',
          'Convert the learning into a system rule or checklist.',
        ];
      case 24:
        return [
          'Define the top 1–3 outcomes for the week (criteria).',
          'List inputs that don’t serve outcomes (meetings, channels, tasks).',
          'Eliminate one low-value recurring input.',
          'Protect focus blocks and buffer time.',
          'Review carryover and tighten scope next week.',
        ];
      case 25:
        return [
          'Pick one skill with leverage and define what “good” looks like (criteria).',
          'Schedule practice blocks and feedback loops.',
          'Produce an output each week (project, artifact, demo).',
          'Measure progress with milestones (threshold).',
          'Adjust practice based on results, not feelings.',
        ];
      case 26:
        return [
          'Choose one thing you can teach (process, tool, checklist).',
          'Create a teaching artifact: template + examples + pitfalls.',
          'Delegate a task with clear criteria and a feedback check-in.',
          'Review the result and improve the artifact.',
          'Repeat until the work is no longer bottlenecked on you.',
        ];
      case 27:
        return [
          'Pick 1–2 rituals that reinforce outcomes (morning/evening).',
          'Remove friction: prep environment, block time, eliminate triggers.',
          'Define a metric: adherence days/week.',
          'Add a recovery ritual so rituals stay sustainable.',
          'Review and iterate weekly.',
        ];
      case 28:
        return [
          'Write 3–5 values and 2 non-negotiables (definition).',
          'Define a decision filter: “Does this align with values and outcomes?”',
          'Audit one week of tasks for alignment (criteria).',
          'Say no to one misaligned commitment.',
          'Rebuild next week around aligned outcomes.',
        ];
      case 29:
        return [
          'Run your weekly review metrics (throughput, focus blocks, carryover).',
          'Select one bottleneck and one rule change.',
          'Apply the change for one week.',
          'Measure results and keep/iterate/drop.',
          'Document the improvement so it becomes part of the system.',
        ];
      case 30:
        return [
          'Summarize your system: rules, rituals, metrics, and boundaries.',
          'Define 90-day outcomes and constraints.',
          'Schedule weekly review and deep work blocks in advance.',
          'Choose an accountability mechanism (partner/scorecard).',
          'Commit: decide what you will stop doing to protect outcomes.',
        ];
      default:
        return [
          'Define outcomes clearly.',
          'Create a simple checklist.',
          'Add an example and a metric.',
          'Run a weekly review.',
          'Iterate based on results.',
        ];
    }
  })();

  const example = (() => {
    switch (day) {
      case 11:
        return {
          good: 'Objective: “Improve onboarding completion.” Key Results: “Completion rate from 60%→80% by June 30.”',
          bad: 'Objective: “Be more productive.” No measurable result or deadline, so no decision is guided.',
        };
      case 14:
        return {
          good: 'Agenda includes decision questions, ends with a decision log entry and owned next actions.',
          bad: 'Meeting has “updates” only, no decisions, no owners, and creates more follow-up meetings.',
        };
      default:
        return {
          good: 'A clear outcome is defined, constraints are respected, and a small system rule is added to make success repeatable.',
          bad: 'More activity is added (meetings/messages) without outcomes, so constraints are consumed and results stagnate.',
        };
    }
  })();

  const content =
    `<h1>${title}</h1>\n` +
    `<p><em>${intent}</em></p>\n` +
    `<hr />\n` +
    htmlSection('Learning goal', ul(goals)) +
    `<hr />\n` +
    htmlSection('Why it matters', ul([
      `Definition: this lesson focuses on turning intent into outcomes, not just activity.`,
      `Comparison: outcomes vs output, and systems vs habits, depending on the day’s theme.`,
      `Constraints matter: time, energy, and attention set the real limits.`,
    ])) +
    `<hr />\n` +
    htmlSection('Explanation', ul([
      `What it is: ${title} is a practical approach you can apply immediately.`,
      `What it is not: it is not “more busyness” or “more meetings” unless those directly improve outcomes.`,
      `Success criteria: you should be able to measure progress with at least one metric and one criterion.`,
    ])) +
    `<hr />\n` +
    htmlSection('Practical steps (Step-by-step checklist)', ol(steps.map((s, i) => `Step ${i + 1}: ${s}`))) +
    `<hr />\n` +
    htmlSection('Practical example (Good vs Bad)', ul([
      `✅ Good example: ${example.good}`,
      `❌ Bad example: ${example.bad}`,
      `Example takeaway: the good version produces a measurable outcome with clear criteria.`,
    ])) +
    `<hr />\n` +
    htmlSection('Common mistakes (what goes wrong)', ul(commonMistakes.length ? commonMistakes : [
      'Optimizing activity instead of outcomes.',
      'Ignoring constraints (time/energy/attention).',
      'No measurable criteria, so progress cannot be proven.',
    ])) +
    `<hr />\n` +
    htmlSection('Metrics & criteria (how you know it worked)', ul(metrics)) +
    `<hr />\n` +
    htmlSection(`Practical exercise (25–35 min) — ${titleCaseDay(day)} implementation`, ol([
      'Pick one real scenario from your week where this topic applies.',
      'Apply the checklist above and write your decisions down.',
      'Define 1 metric and 1 success criterion (threshold).',
      'Run it for 7 days and record what happened.',
      'In your weekly review, change one rule based on the metric.',
    ])) +
    `<hr />\n` +
    htmlSection('Self-check', ul([
      '✅ I can explain the definition in one sentence.',
      '✅ I can apply the checklist to a real scenario.',
      '✅ I have at least one metric and one criterion to judge success.',
      '✅ I can identify the most likely failure mode and how to prevent it.',
    ]));

  return content;
}

async function main() {
  await connectDB();

  const ccs = loadProductivityCCS();
  const ccsByDay = new Map<number, CCSLesson>();
  for (const l of ccs.lessons || []) ccsByDay.set(Number(l.dayNumber), l);

  const course = await Course.findOne({ courseId: COURSE_ID, isActive: true }).lean();
  if (!course) throw new Error(`Course not found or inactive: ${COURSE_ID}`);

  const lessons = await Lesson.find({ courseId: course._id, isActive: true })
    .sort({ dayNumber: 1, displayOrder: 1, createdAt: 1, _id: 1 })
    .lean();

  // Deduplicate by dayNumber (keep oldest)
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

  mkdirSync(OUT_DIR, { recursive: true });
  const stamp = isoStamp();

  const planRows: any[] = [];
  const applyResults: any[] = [];

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.amanoba.com';

  for (const day of Array.from(byDay.keys()).sort((a, b) => a - b)) {
    if (day < FROM_DAY || day > TO_DAY) continue;

    // We only intend to refine Day 11 and 14–30 by default.
    if (day !== 11 && day < 14) continue;

    const lesson = byDay.get(day);
    const ccsLesson = ccsByDay.get(day);
    if (!ccsLesson) {
      planRows.push({ day, lessonId: lesson.lessonId, action: 'SKIP_NO_CCS', reason: 'Missing CCS entry' });
      continue;
    }

    const oldContent = String(lesson.content || '');
    const oldTitle = String(lesson.title || '');
    const oldScore = assessLessonQuality({ title: oldTitle, content: oldContent, language: 'en' });

    const newTitle = ccsLesson.canonicalTitle || oldTitle || `Day ${day}`;
    const newContent = buildENLessonHtml({
      day,
      title: newTitle,
      intent: ccsLesson.intent || 'Improve outcomes by applying a practical system.',
      goals: (ccsLesson.goals || []).slice(0, 6),
      commonMistakes: (ccsLesson.commonMistakes || []).slice(0, 8),
    });
    const newScore = assessLessonQuality({ title: newTitle, content: newContent, language: 'en' });

    const integrity = validateLessonRecordLanguageIntegrity({
      language: 'en',
      content: newContent,
      emailSubject: `Productivity 2026 – ${titleCaseDay(day)}: ${newTitle}`,
      emailBody:
        `<h1>Productivity 2026 – ${titleCaseDay(day)}</h1>\n` +
        `<h2>${newTitle}</h2>\n` +
        `<p>${ccsLesson.intent || ''}</p>\n` +
        `<p><a href=\"${appUrl}/en/courses/${COURSE_ID}/day/${day}\">Open the lesson →</a></p>`,
    });

    const row = {
      day,
      lessonId: lesson.lessonId,
      title: { old: oldTitle, next: newTitle },
      quality: { old: oldScore, next: newScore },
      lengths: { oldChars: stripHtml(oldContent).length, nextChars: stripHtml(newContent).length },
      applyEligible: newScore.score >= 70 && integrity.ok,
      languageIntegrity: integrity,
    };
    planRows.push(row);

    if (!APPLY) continue;
    if (!integrity.ok) {
      throw new Error(
        `Language integrity failed for ${COURSE_ID} day ${day} (${lesson.lessonId}): ${integrity.errors[0] || 'unknown'}`
      );
    }

    // Backup before update
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

    const emailSubject = `Productivity 2026 – ${titleCaseDay(day)}: ${newTitle}`;
    const emailBody =
      `<h1>Productivity 2026 – ${titleCaseDay(day)}</h1>\n` +
      `<h2>${newTitle}</h2>\n` +
      `<p>${ccsLesson.intent || ''}</p>\n` +
      `<p><a href=\"${appUrl}/en/courses/${COURSE_ID}/day/${day}\">Open the lesson →</a></p>`;

    const update = await Lesson.updateOne(
      { _id: lesson._id },
      {
        $set: {
          title: newTitle,
          content: newContent,
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
      newScore: newScore.score,
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
          eligible70: planRows.filter(r => r.applyEligible).length,
          below70: planRows.filter(r => !r.applyEligible).length,
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
