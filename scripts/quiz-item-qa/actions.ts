import { appendFileSync, existsSync, writeFileSync } from 'fs';
import { loadConfig, QuizItemQAConfig } from './config';
import {
  fetchAllQuestions,
  fetchQuestionById,
  getOldestByUpdatedAt,
  patchQuestion,
  QuizItem,
} from './client';
import { EvaluationResult, evaluateQuestion } from './evaluator';
import { loadState, saveState, QuizItemQAState } from './state';

const HANDOVER_DOC = 'docs/QUIZ_ITEM_QA_HANDOVER.md';

export function resolveNextFromList(
  sortedList: QuizItem[],
  state: QuizItemQAState
) {
  if (!sortedList || sortedList.length === 0) {
    return { next: null, reason: 'No quiz items found' };
  }
  if (!state.lastCompletedItemUpdatedAt) {
    return { next: sortedList[0], reason: 'Initial run (oldest item)' };
  }
  const threshold = Date.parse(state.lastCompletedItemUpdatedAt);
  const candidate = sortedList.find((item) => {
    const updated = Date.parse(item.metadata.updatedAt);
    if (updated > threshold) {
      return true;
    }
    if (item._id === state.lastCompletedItemId && updated === threshold) {
      return false;
    }
    return false;
  });
  if (!candidate) {
    return { next: null, reason: 'No newer items found' };
  }
  return {
    next: candidate,
    reason: `Following last update ${state.lastCompletedItemId} @ ${state.lastCompletedItemUpdatedAt}`,
  };
}

export async function auditLastModified(overrides?: Partial<QuizItemQAConfig>) {
  const list = await fetchAllQuestions(overrides);
  if (list.length === 0) {
    return null;
  }
  const sorted = [...list].sort((a, b) => {
    return Date.parse(b.metadata.updatedAt) - Date.parse(a.metadata.updatedAt);
  });
  return sorted[0];
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
  options?: { agent?: string }
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
  const state: QuizItemQAState = {
    lastCompletedItemId: question._id,
    lastCompletedItemUpdatedAt: question.metadata.updatedAt,
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
  for (let processed = 0; processed < itemsToProcess; processed += 1) {
    try {
      const { next, reason } = await pickNext(overrides);
      if (!next) {
        console.log(`No next item: ${reason}`);
        return;
      }
      console.log(`Processing ${next._id} (${reason})`);
      const { question, evaluation } = await evaluateItem(next._id, overrides);
      if (!evaluation.needsUpdate) {
        console.log('No changes needed; recording state');
        recordHandover(question, evaluation);
        continue;
      }
      if (Object.keys(evaluation.autoPatch).length === 0) {
        console.log('Needs manual intervention; logging entry');
        recordHandover(question, evaluation, ['Manual review required']);
        continue;
      }
      const applyResult = await applyUpdate(next._id, evaluation.autoPatch, {
        dryRun: config.dryRun,
        overrides,
      });
      if (!applyResult.verified) {
        throw new Error('Verification failed after apply');
      }
      recordHandover(applyResult.updated || question, evaluation);
    } catch (error) {
      console.error('Loop stopped:', error);
      return;
    }
  }
}
