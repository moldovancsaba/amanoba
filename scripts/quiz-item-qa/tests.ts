import assert from 'node:assert';
import { existsSync, unlinkSync } from 'fs';
import { resolveNextFromList } from './actions';
import { QuizItemQAState } from './state';

async function runTests() {
  console.log('Running Quiz Item QA tests...');
  testPickNext();
  testStatePersistence();
  await testDryRunSkipsNetwork();
  await testVerificationFailure();
  console.log('All tests passed.');
}

function testPickNext() {
  const items = [
    {
      _id: 'A',
      metadata: { updatedAt: '2024-01-01T00:00:00Z' },
    },
    {
      _id: 'B',
      metadata: { updatedAt: '2024-01-02T00:00:00Z' },
    },
    {
      _id: 'C',
      metadata: { updatedAt: '2024-01-03T00:00:00Z' },
    },
  ] as any[];
  const state: QuizItemQAState = {};
  let candidate = resolveNextFromList(items as any, state);
  assert.strictEqual(candidate.next?._id, 'A');
  assert.match(candidate.reason, /Initial run/);

  state.lastCompletedItemId = 'A';
  state.lastCompletedItemUpdatedAt = '2024-01-01T00:00:00Z';
  candidate = resolveNextFromList(items as any, state);
  assert.strictEqual(candidate.next?._id, 'B');

  state.lastCompletedItemId = 'C';
  state.lastCompletedItemUpdatedAt = '2024-01-03T00:00:00Z';
  candidate = resolveNextFromList(items as any, state);
  assert.strictEqual(candidate.next, null);
}

function testStatePersistence() {
  const state: QuizItemQAState = {
    lastCompletedItemId: 'test-123',
    lastCompletedItemUpdatedAt: new Date().toISOString(),
    agent: 'test-agent',
    notes: ['note'],
  };
  require('./state').saveState(state);
  const loaded = require('./state').loadState();
  assert.strictEqual(loaded.lastCompletedItemId, state.lastCompletedItemId);
  assert.strictEqual(loaded.agent, state.agent);
  const path = '.state/quiz_item_qa_state.json';
  if (existsSync(path)) {
    unlinkSync(path);
  }
}

async function testDryRunSkipsNetwork() {
  let fetchCalled = false;
  globalThis.fetch = async () => {
    fetchCalled = true;
    throw new Error('Network should not be called in dry run');
  };
  const applyUpdate = require('./actions').applyUpdate;
  await applyUpdate('dummy', {}, { dryRun: true });
  assert.strictEqual(fetchCalled, false);
}

async function testVerificationFailure() {
  const responses = [
    { success: true, question: { _id: 'X', foo: 'bar', question: 'ok' } },
    { success: true, question: { _id: 'X', foo: 'different', question: 'ok' } },
  ];
  let call = 0;
  globalThis.fetch = async () => {
    const body = responses[call++];
    return {
      ok: true,
      json: async () => body,
    } as any;
  };
  const applyUpdate = require('./actions').applyUpdate;
  let threw = false;
  try {
    await applyUpdate('X', { foo: 'bar' });
  } catch (error) {
    threw = true;
  }
  assert.strictEqual(threw, true);
}

runTests().catch((error) => {
  console.error('Tests failed:', error);
  process.exit(1);
});
