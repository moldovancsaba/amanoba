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
import { Course, Lesson, QuizQuestion } from '../../app/lib/models';
import { generateContentBasedQuestions } from '../content-based-question-generator';
import { validateQuestionQuality } from '../question-quality-validator';

const HANDOVER_DOC = 'docs/QUIZ_ITEM_QA_HANDOVER.md';
const HANDOVER_NEW2OLD_DOC = 'docs/QUIZ_ITEM_QA_HANDOVER_NEW2OLD.md';

function loadLoggedIdsFromNew2Old(): Set<string> {
  if (!existsSync(HANDOVER_NEW2OLD_DOC)) return new Set();
  const raw = readFileSync(HANDOVER_NEW2OLD_DOC, 'utf-8');
  const re = /^##\s+\d{4}-\d{2}-\d{2}T.*—\s+([0-9a-f]{24})\s*$/gim;
  const ids = new Set<string>();
  for (const match of raw.matchAll(re)) {
    ids.add(match[1]);
  }
  return ids;
}

function ensureNew2OldDocExists() {
  if (existsSync(HANDOVER_NEW2OLD_DOC)) return;

  // Keep this file intentionally minimal: it's a run log, not the workflow doc.
  writeFileSync(
    HANDOVER_NEW2OLD_DOC,
    [
      '# Quiz Item QA Handover (new-to-old)',
      '',
      'This file is a run log written by `scripts/quiz-item-qa` (`handover:record` / `loop:run`). New entries are prepended under **Run log (new-to-old)**.',
      '',
      'References:',
      `- Canonical workflow + commands: \`${HANDOVER_DOC}\``,
      '- Quality rules: `docs/QUIZ_QUALITY_PIPELINE_PLAYBOOK.md#gold-standard-question-type`, `docs/COURSE_BUILDING_RULES.md#gold-standard-only-acceptable-form`',
      '- Cursor/state SSOT: `.state/quiz_item_qa_state.json` (do not edit manually)',
      '',
      '## Run log (new-to-old)',
      '',
      '',
    ].join('\n'),
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
  const config = loadConfig(overrides);
  const state = loadState();
  const allSorted = await getOldestByUpdatedAt(overrides);
  if (!allSorted || allSorted.length === 0) {
    return { next: null, reason: 'No quiz items found' };
  }
  if (config.skipAlreadyLoggedIds) {
    const loggedIds = loadLoggedIdsFromNew2Old();
    const filtered = allSorted.filter((q) => !loggedIds.has(q._id));
    if (filtered.length === 0) {
      return { next: null, reason: 'All course-specific items are already logged in NEW2OLD' };
    }
    const resolved = resolveNextFromList(filtered, state);
    if (!resolved.next && resolved.reason === 'No newer items found') {
      return { next: filtered[0], reason: 'Wrapped (skip-logged coverage: starting from oldest unchecked)' };
    }
    return resolved;
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
  options?: { agent?: string; cursorUpdatedAt?: string; cursorItemId?: string; updateState?: boolean }
) {
  const timestamp = new Date().toISOString();
  const cursorUpdatedAt = options?.cursorUpdatedAt;
  const cursorItemId = options?.cursorItemId;
  const entry = [
    `## ${timestamp} — ${question._id}`,
    `- Updated at (current): ${question.metadata.updatedAt}`,
    ...(cursorUpdatedAt && cursorUpdatedAt !== question.metadata.updatedAt
      ? [`- Cursor updatedAt (pre-fix): ${cursorUpdatedAt}`]
      : []),
    ...(cursorItemId && cursorItemId !== question._id ? [`- Cursor itemId: ${cursorItemId}`] : []),
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

  if (options?.updateState === false) {
    return loadState();
  }

  // Keep a stable scan cursor for pick:next even when updatedAt changes due to patching.
  const resolvedCursorUpdatedAt = options?.cursorUpdatedAt || question.metadata.updatedAt;
  const resolvedCursorItemId = options?.cursorItemId || question._id;
  const state: QuizItemQAState = {
    lastCompletedItemId: question._id,
    lastCompletedItemUpdatedAt: resolvedCursorUpdatedAt,
    cursorUpdatedAt: resolvedCursorUpdatedAt,
    cursorItemId: resolvedCursorItemId,
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
  const loggedIds = config.skipAlreadyLoggedIds ? loadLoggedIdsFromNew2Old() : null;
  const processingList = loggedIds ? allSorted.filter((q) => !loggedIds.has(q._id)) : allSorted;
  let wrappedUncheckedOnce = false;
  const courseQuestionCount = new Map<string, Map<string, number>>();
  const courseQuestionIds = new Map<string, Map<string, string[]>>();
  for (const item of processingList) {
    if (!item.isCourseSpecific || !item.courseId) continue;
    const perCourse = courseQuestionCount.get(item.courseId) || new Map<string, number>();
    perCourse.set(item.question, (perCourse.get(item.question) || 0) + 1);
    courseQuestionCount.set(item.courseId, perCourse);

    const perCourseIds = courseQuestionIds.get(item.courseId) || new Map<string, string[]>();
    const ids = perCourseIds.get(item.question) || [];
    ids.push(item._id);
    perCourseIds.set(item.question, ids);
    courseQuestionIds.set(item.courseId, perCourseIds);
  }
  // Deterministic keeper selection: the earliest ObjectId string is the keeper.
  for (const [, qmap] of courseQuestionIds) {
    for (const [q, ids] of qmap) {
      ids.sort((a, b) => a.localeCompare(b));
      qmap.set(q, ids);
    }
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
      const { next, reason } = resolveNextFromList(processingList, state);
      if (!next) {
        // If we hit the end of the updatedAt-ordered stream, wrap once and keep going.
        // This enables continuous processing even when updates change updatedAt values.
        if (reason === 'No newer items found') {
          // In "skip already logged" mode, we may need to wrap once if the cursor is beyond
          // all unchecked items. After one wrap, stop to avoid re-processing the snapshot list.
          if (config.skipAlreadyLoggedIds) {
            if (wrappedUncheckedOnce) {
              console.log('Reached end of unchecked stream; stopping (skip-logged mode)');
              return;
            }
            wrappedUncheckedOnce = true;
            const current = loadState();
            saveState({
              ...current,
              lastCompletedItemUpdatedAt: undefined,
              cursorUpdatedAt: undefined,
              cursorItemId: undefined,
              runTimestamp: new Date().toISOString(),
              notes: [...(current.notes || []), 'Cursor wrapped (skip-logged: restarting from oldest unchecked)'],
            });
            console.log('Cursor wrapped (skip-logged mode): restarting from oldest unchecked');
            processed -= 1;
            continue;
          }
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

          const ids = courseQuestionIds.get(question.courseId)?.get(question.question) || [];
          const keeperId = ids[0];
          const isKeeper = keeperId && keeperId === question._id;

          // Keep exactly one copy (the "keeper") and replace all other exact duplicates in-place.
          if (!isKeeper) {
            const course = await Course.findById(question.courseId).select({ courseId: 1, language: 1 }).lean();
            const lesson = question.lessonId
              ? await Lesson.findOne({ lessonId: question.lessonId }).select({ dayNumber: 1, title: 1, content: 1 }).lean()
              : null;
            if (course && lesson) {
              const lessonExisting = await QuizQuestion.find({
                isActive: true,
                isCourseSpecific: true,
                courseId: question.courseId,
                lessonId: question.lessonId,
                _id: { $ne: question._id },
              })
                .select({ question: 1, options: 1 })
                .lean();

              const courseTextSet = new Set<string>(
                (courseQuestionIds.get(question.courseId)?.keys() ? Array.from(courseQuestionIds.get(question.courseId)!.keys()) : [])
              );

              const candidates = generateContentBasedQuestions(
                (lesson as any).dayNumber,
                (lesson as any).title || '',
                (lesson as any).content || '',
                String((course as any).language || 'en'),
                String((course as any).courseId || ''),
                lessonExisting as any,
                24,
                { seed: `${question.courseId}::${question.lessonId}::dedupe::${question._id}` }
              );

              const pick = candidates.find((c: any) => {
                if (!c || typeof c.question !== 'string') return false;
                if (courseTextSet.has(c.question)) return false;
                const v = validateQuestionQuality(
                  c.question,
                  c.options,
                  c.questionType as any,
                  c.difficulty as any,
                  String((course as any).language || 'en'),
                  (lesson as any).title || '',
                  (lesson as any).content || ''
                );
                return v.isValid;
              });

              if (pick) {
                evaluation.autoPatch.question = pick.question;
                evaluation.autoPatch.options = pick.options;
                evaluation.autoPatch.correctIndex = pick.correctIndex;
                evaluation.autoPatch.difficulty = pick.difficulty;
                evaluation.autoPatch.questionType = pick.questionType;
                evaluation.autoPatch.hashtags = pick.hashtags;
              } else {
                // Fallback: prefixing still fixes the hard rule (but is less ideal than replacement).
                const lang = detectLangFromTags(question.hashtags);
                const prefixes = prefixesByLang[lang] || prefixesByLang.unknown;
                const seed = `${question.lessonId || ''}:${question._id}`;
                let hash = 0;
                for (let i = 0; i < seed.length; i += 1) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
                const normalize = (s: string) => String(s || '').replace(/\s+/g, ' ').trim();
                const baseNorm = normalize(question.question);
                const hasAnyPrefix = prefixes.some((p) => baseNorm.startsWith(normalize(p)));
                const idx = hash % prefixes.length;
                const prefix = hasAnyPrefix ? prefixes[(idx + 1) % prefixes.length] : prefixes[idx];
                const candidate = `${prefix} ${baseNorm}`.replace(/\s+/g, ' ').trim();
                if (candidate !== baseNorm) evaluation.autoPatch.question = candidate;
              }
            }
          }
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
      let refreshed = applyResult.updated || (await fetchQuestionById(next._id, overrides));
      let postEval = evaluateQuestion(refreshed);

      // Post-fix stabilization: some patches unlock follow-up auto-fixes (e.g. prefixes/length cleanups).
      // Apply at most a few times to avoid loops.
      for (let attempt = 0; attempt < 3; attempt += 1) {
        if (!postEval.needsUpdate) break;
        if (!postEval.autoPatch || Object.keys(postEval.autoPatch).length === 0) break;
        const followUp = await applyUpdate(next._id, postEval.autoPatch, {
          dryRun: config.dryRun,
          overrides,
        });
        if (!followUp.verified) {
          throw new Error('Verification failed after follow-up apply');
        }
        refreshed = followUp.updated || (await fetchQuestionById(next._id, overrides));
        postEval = evaluateQuestion(refreshed);
      }

      if (postEval.needsUpdate && (!postEval.autoPatch || Object.keys(postEval.autoPatch).length === 0)) {
        recordHandover(refreshed, postEval, ['Manual review required'], { cursorUpdatedAt, cursorItemId });
      } else {
        recordHandover(refreshed, postEval, undefined, { cursorUpdatedAt, cursorItemId });
      }
    } catch (error) {
      console.error('Loop stopped:', error);
      return;
    }
  }
}
