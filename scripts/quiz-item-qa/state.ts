import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'fs';
import { dirname } from 'path';

export interface QuizItemQAState {
  lastCompletedItemId?: string;
  lastCompletedItemUpdatedAt?: string;
  runTimestamp?: string;
  agent?: string;
  notes?: string[];
}

const STATE_PATH = '.state/quiz_item_qa_state.json';

function ensureStateDir() {
  const dir = dirname(STATE_PATH);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

export function loadState(): QuizItemQAState {
  if (!existsSync(STATE_PATH)) {
    return {};
  }
  const raw = readFileSync(STATE_PATH, 'utf-8');
  try {
    return JSON.parse(raw);
  } catch (error) {
    throw new Error(`Failed to parse state file: ${error}`);
  }
}

export function saveState(state: QuizItemQAState) {
  ensureStateDir();
  writeFileSync(STATE_PATH, JSON.stringify(state, null, 2));
  return state;
}
