import { appendFileSync, existsSync, readFileSync, writeFileSync } from 'fs';
import { loadConfig, QuizItemQAConfig } from './config';
import {
  fetchAllQuestions,
  fetchQuestionById,
  getOldestByUpdatedAt,
  patchQuestion,
  QuizItem,
  auditLastModified as mongoAuditLastModified,
} from './mongodb-client';
import { EvaluationResult, evaluateQuestion } from './evaluator';
import { loadState, saveState, QuizItemQAState } from './state';

const HANDOVER_DOC = 'docs/QUIZ_ITEM_QA_HANDOVER.md';
const HANDOVER_NEW2OLD_DOC = 'docs/QUIZ_ITEM_QA_HANDOVER_NEW2OLD.md';

function ensureNew2OldDocExists() {
  if (existsSync(HANDOVER_NEW2OLD_DOC)) return;

  // Best-effort: bootstrap from the main handover doc if present,
  // otherwise create a minimal file with just the run log section.
  if (existsSync(HANDOVER_DOC)) {
    const base = readFileSync(HANDOVER_DOC, 'utf-8');
    const marker = '\n## 2026';
    const idx = base.indexOf(marker);
    const header = (idx === -1 ? base : base.slice(0, idx)).trimEnd();
    writeFileSync(
      HANDOVER_NEW2OLD_DOC,
      `${header}\n\n## Run log (new-to-old)\n\n`,
      'utf-8'
    );
    return;
  }

  writeFileSync(
    HANDOVER_NEW2OLD_DOC,
    '# Quiz Item QA Handover (New-to-old)\n\n## Run log (new-to-old)\n\n',
    'utf-8'
  );
}

function recordNew2OldEntry(entryLines: string[], questionId: string) {
  ensureNew2OldDocExists();
  const raw = readFileSync(HANDOVER_NEW2OLD_DOC, 'utf-8');

  // Avoid accidental duplicates (e.g., re-running the same record call).
  // Allow multiple entries for the same questionId if they have different timestamps.
  if (raw.includes(`${entryLines[0]}\n`)) return;

  const heading = '## Run log (new-to-old)';
  const entryBlock = `${entryLines.join('\n')}\n\n`;

  const marker = `${heading}\n\n`;
  const markerIdx = raw.indexOf(marker);
  if (markerIdx !== -1) {
    const insertPos = markerIdx + marker.length;
    writeFileSync(
      HANDOVER_NEW2OLD_DOC,
      `${raw.slice(0, insertPos)}${entryBlock}${raw.slice(insertPos)}`,
      'utf-8'
    );
    return;
  }

  const headingIdx = raw.indexOf(heading);
  if (headingIdx === -1) {
    writeFileSync(
      HANDOVER_NEW2OLD_DOC,
      `${raw.trimEnd()}\n\n${marker}${entryBlock}`,
      'utf-8'
    );
    return;
  }

  // Heading exists but doesn't have the expected blank line formatting; normalize.
  const lineEnd = raw.indexOf('\n', headingIdx);
  const insertPos = lineEnd === -1 ? raw.length : lineEnd + 1;
  writeFileSync(
    HANDOVER_NEW2OLD_DOC,
    `${raw.slice(0, insertPos)}\n${entryBlock}${raw.slice(insertPos)}`,
    'utf-8'
  );
}

export function resolveNextFromList(
  sortedList: QuizItem[],
  state: QuizItemQAState
) {
  if (!sortedList || sortedList.length === 0) {
    return { next: null, reason: 'No quiz items found' };
  }
  const cursorUpdatedAt = state.cursorUpdatedAt || state.lastCompletedItemUpdatedAt;
  const cursorItemId = state.cursorItemId || state.lastCompletedItemId;
  if (!cursorUpdatedAt) {
    return { next: sortedList[0], reason: 'Initial run (oldest item)' };
  }
  const threshold = Date.parse(cursorUpdatedAt);
  const candidate = sortedList.find((item) => {
    const updated = Date.parse(item.metadata.updatedAt);
    if (updated > threshold) {
      return true;
    }
    if (item._id === cursorItemId && updated === threshold) {
      return false;
    }
    return false;
  });
  if (!candidate) {
    return { next: null, reason: 'No newer items found' };
  }
  return {
    next: candidate,
    reason: `Following cursor ${cursorItemId} @ ${cursorUpdatedAt}`,
  };
}

export async function auditLastModified(overrides?: Partial<QuizItemQAConfig>) {
  return await mongoAuditLastModified(overrides);
}

export async function pickNext(overrides?: Partial<QuizItemQAConfig>) {
  const state = loadState();
  const allSorted = await getOldestByUpdatedAt(overrides);
  if (!allSorted || allSorted.length === 0) {
    return { next: null, reason: 'No quiz items found' };
  }
  return resolveNextFromList(allSorted, state);
}

export async function evaluateItem(
  questionId: string,
  overrides?: Partial<QuizItemQAConfig>
) {
  const question = await fetchQuestionById(questionId, overrides);
  const evaluation = evaluateQuestion(question);
  return { question, evaluation };
}

export async function applyUpdate(
  questionId: string,
  patch: Record<string, unknown>,
  options?: { dryRun?: boolean; overrides?: Partial<QuizItemQAConfig> }
) {
  const config = loadConfig(options?.overrides);
  if (options?.dryRun || config.dryRun) {
    return { dryRun: true, patch, success: false, verified: false };
  }
  const updated = await patchQuestion(questionId, patch, config);
  const refreshed = await fetchQuestionById(questionId, config);
  const matches = Object.entries(patch).every(([key, value]) => {
    const existing = (refreshed as any)[key];
    if (Array.isArray(value)) {
      return (
        Array.isArray(existing) &&
        existing.length === value.length &&
        existing.every((v: any, idx: number) => v === value[idx])
      );
    }
    return existing === value;
  });
  if (!matches) {
    throw new Error('Verification failed: persisted values do not match patch');
  }
  return { dryRun: false, patch, success: true, verified: true, updated };
}

export function recordHandover(
  question: QuizItem,
  evaluation: EvaluationResult,
  notes?: string[],
  options?: { agent?: string; cursorUpdatedAt?: string; cursorItemId?: string }
) {
  const timestamp = new Date().toISOString();
  const entry = [
    `## ${timestamp} — ${question._id}`,
    `- Updated at: ${question.metadata.updatedAt}`,
    `- Question: ${question.question}`,
    `- Violations: ${evaluation.violations.length}`,
    `- State stored in \`.state/quiz_item_qa_state.json\``,
  ];
  if (notes && notes.length > 0) {
    entry.push(`- Notes:`);
    notes.forEach((note) => entry.push(`  - ${note}`));
  }
  entry.push('');
  if (!existsSync(HANDOVER_DOC)) {
    writeFileSync(
      HANDOVER_DOC,
      '# Quiz Item QA Handover\n\nDocumentation, workflow, and run state for quiz item QA.\n\n',
      'utf-8'
    );
  }
  appendFileSync(HANDOVER_DOC, `${entry.join('\n')}\n`);
  recordNew2OldEntry(entry, question._id);

  // Keep a stable scan cursor for pick:next even when updatedAt changes due to patching.
  const cursorUpdatedAt = options?.cursorUpdatedAt || question.metadata.updatedAt;
  const cursorItemId = options?.cursorItemId || question._id;
  const state: QuizItemQAState = {
    lastCompletedItemId: question._id,
    lastCompletedItemUpdatedAt: cursorUpdatedAt,
    cursorUpdatedAt,
    cursorItemId,
    runTimestamp: timestamp,
    agent: options?.agent,
    notes,
  };
  return saveState(state);
}

export async function loopRun(
  itemsToProcess: number,
  overrides?: Partial<QuizItemQAConfig>
) {
  const config = loadConfig(overrides);
  const allSorted = await getOldestByUpdatedAt(overrides);
  const courseQuestionCount = new Map<string, Map<string, number>>();
  for (const item of allSorted) {
    if (!item.isCourseSpecific || !item.courseId) continue;
    const perCourse = courseQuestionCount.get(item.courseId) || new Map<string, number>();
    perCourse.set(item.question, (perCourse.get(item.question) || 0) + 1);
    courseQuestionCount.set(item.courseId, perCourse);
  }

  const detectLangFromTags = (tags: string[] | undefined) => {
    const t = Array.isArray(tags) ? tags : [];
    if (t.includes('#hu')) return 'hu';
    if (t.includes('#pt')) return 'pt';
    if (t.includes('#en')) return 'en';
    if (t.includes('#tr')) return 'tr';
    if (t.includes('#pl')) return 'pl';
    if (t.includes('#bg')) return 'bg';
    if (t.includes('#ru')) return 'ru';
    if (t.includes('#ar')) return 'ar';
    if (t.includes('#vi')) return 'vi';
    if (t.includes('#id')) return 'id';
    if (t.includes('#hi')) return 'hi';
    return 'unknown';
  };

  const prefixesByLang: Record<string, string[]> = {
    bg: [
      'Представи си, че работиш по задача и трябва да вземеш решение.',
      'По време на планиране на екипа трябва да избереш следващи стъпки.',
      'Под натиск от срок трябва да вземеш практично решение.',
      'След преглед трябва да решиш какво да промениш.',
    ],
    hu: [
      'Egy csapat heti tervezesen helyzetet elemzel.',
      'Egy sprint vege fele priorizalnod kell feladatokat.',
      'Egy projekt kickoff utan tisztazod a kovetkezo lepest.',
      'Egy termekcsapatban kompromisszumot keresel idokeret mellett.',
      'Egy varatlan problema kozben gyors, de megalapozott dontest kell hoznod.',
    ],
    id: [
      'Dalam sebuah proyek, kamu perlu mengambil keputusan.',
      'Dalam rapat perencanaan tim, kamu perlu memilih langkah berikutnya.',
      'Di bawah tenggat waktu, kamu perlu keputusan yang praktis.',
      'Setelah review, kamu perlu memutuskan apa yang harus diubah.',
    ],
    en: [
      'You are leading a project and need to make a decision.',
      'In a team planning meeting, you need to choose next steps.',
      'During execution, a trade-off forces you to prioritize.',
      'You are under a deadline and need a practical decision.',
      'After a review, you need to decide what to change next.',
    ],
    pl: [
      'Wyobraz sobie, ze pracujesz nad zadaniem i musisz podjac decyzje.',
      'Podczas planowania zespolu musisz wybrac kolejne kroki.',
      'Pod presja terminu musisz podjac praktyczna decyzje.',
      'Po przegladzie musisz zdecydowac, co zmienic.',
    ],
    pt: [
      'Voce esta conduzindo um projeto e precisa tomar uma decisao.',
      'Em uma reuniao de planejamento, voce precisa escolher os proximos passos.',
      'Durante a execucao, um trade-off obriga voce a priorizar.',
      'Sob prazo, voce precisa tomar uma decisao pratica.',
      'Depois de uma revisao, voce precisa decidir o que mudar a seguir.',
    ],
    tr: [
      'Bir gorev uzerinde calisiyorsun ve bir karar vermen gerekiyor.',
      'Ekip planlamasinda sonraki adimlari secmen gerekiyor.',
      'Son teslim tarihi baskisi altinda pratik bir karar vermen gerekiyor.',
      'Bir incelemeden sonra neyi degistirecegine karar vermen gerekiyor.',
    ],
    unknown: [
      "You're in a real situation and need to choose next steps.",
      'You need to make a decision under constraints.',
      'You are working on a task and must pick an approach.',
    ],
  };

  for (let processed = 0; processed < itemsToProcess; processed += 1) {
    try {
      const state = loadState();
      const { next, reason } = resolveNextFromList(allSorted, state);
      if (!next) {
        // If we hit the end of the updatedAt-ordered stream, wrap once and keep going.
        // This enables continuous processing even when updates change updatedAt values.
        if (reason === 'No newer items found') {
          const current = loadState();
          saveState({
            ...current,
            lastCompletedItemUpdatedAt: undefined,
            cursorUpdatedAt: undefined,
            cursorItemId: undefined,
            runTimestamp: new Date().toISOString(),
            notes: [...(current.notes || []), 'Cursor wrapped (restarting from oldest)'],
          });
          console.log('Reached end of stream; wrapping cursor to restart from oldest');
          // Decrement counter so this iteration doesn't count toward the requested items.
          processed -= 1;
          continue;
        }
        console.log(`No next item: ${reason}`);
        return;
      }
      console.log(`Processing ${next._id} (${reason})`);
      const cursorUpdatedAt = next.metadata.updatedAt;
      const cursorItemId = next._id;
      const { question, evaluation } = await evaluateItem(next._id, overrides);

      // Hard rule: identical question text must not exist twice in the same course.
      if (question.isCourseSpecific && question.courseId) {
        const perCourse = courseQuestionCount.get(question.courseId);
        const count = perCourse?.get(question.question) || 0;
        if (count > 1) {
          evaluation.violations.push({
            code: 'DUPLICATE_QUESTION_IN_COURSE',
            message: `Duplicate question text exists in this course (${count} total occurrences in snapshot).`,
            fields: ['courseId', 'question'],
            severity: 'error',
            docRef: 'docs/QUIZ_QUALITY_PIPELINE_HANDOVER.md',
          });
          evaluation.needsUpdate = true;

          const lang = detectLangFromTags(question.hashtags);
          const prefixes = prefixesByLang[lang] || prefixesByLang.unknown;

          const seed = `${question.lessonId || ''}:${question._id}`;
          let hash = 0;
          for (let i = 0; i < seed.length; i += 1) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;

          const baseQuestion = typeof evaluation.autoPatch.question === 'string'
            ? (evaluation.autoPatch.question as string)
            : question.question;
          const normalize = (s: string) => String(s || '').replace(/\s+/g, ' ').trim();
          const baseNorm = normalize(baseQuestion);

          // Avoid stacking prefixes (e.g. prefix already present from earlier dedupe runs).
          const hasAnyPrefix = prefixes.some((p) => baseNorm.startsWith(normalize(p)));
          const idx = hash % prefixes.length;
          const prefix = hasAnyPrefix ? prefixes[(idx + 1) % prefixes.length] : prefixes[idx];
          const candidate = `${prefix} ${baseNorm}`.replace(/\s+/g, ' ').trim();
          if (candidate !== baseNorm) evaluation.autoPatch.question = candidate;
        }
      }
      if (!evaluation.needsUpdate) {
        console.log('No changes needed; recording state');
        recordHandover(question, evaluation, undefined, { cursorUpdatedAt, cursorItemId });
        continue;
      }
      if (Object.keys(evaluation.autoPatch).length === 0) {
        console.log('Needs manual intervention; logging entry');
        recordHandover(question, evaluation, ['Manual review required'], { cursorUpdatedAt, cursorItemId });
        continue;
      }
      const applyResult = await applyUpdate(next._id, evaluation.autoPatch, {
        dryRun: config.dryRun,
        overrides,
      });
      if (!applyResult.verified) {
        throw new Error('Verification failed after apply');
      }
      const refreshed = applyResult.updated || (await fetchQuestionById(next._id, overrides));
      const postEval = evaluateQuestion(refreshed);
      recordHandover(refreshed, postEval, undefined, { cursorUpdatedAt, cursorItemId });
    } catch (error) {
      console.error('Loop stopped:', error);
      return;
    }
  }
}
