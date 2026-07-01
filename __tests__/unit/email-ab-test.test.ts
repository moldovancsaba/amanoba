import { describe, it, expect } from 'vitest';
import { pickEmailVariant } from '@/lib/email/ab-test';

describe('pickEmailVariant', () => {
  it('is deterministic for the same player + experiment', () => {
    const a = pickEmailVariant('player-123', 'welcome_subject_v1');
    const b = pickEmailVariant('player-123', 'welcome_subject_v1');
    expect(a).toBe(b);
  });

  it('can differ across experiments for the same player', () => {
    // Not guaranteed to differ, but must stay stable within each experiment.
    expect(pickEmailVariant('player-123', 'exp-a')).toMatch(/^[AB]$/);
    expect(pickEmailVariant('player-123', 'exp-b')).toMatch(/^[AB]$/);
  });

  it('produces both variants across a population (roughly even)', () => {
    let a = 0;
    let b = 0;
    for (let i = 0; i < 1000; i++) {
      if (pickEmailVariant(`player-${i}`, 'welcome_subject_v1') === 'A') a++;
      else b++;
    }
    expect(a).toBeGreaterThan(300);
    expect(b).toBeGreaterThan(300);
    expect(a + b).toBe(1000);
  });
});
