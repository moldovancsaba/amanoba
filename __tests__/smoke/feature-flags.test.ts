/**
 * Smoke test: /api/feature-flags
 * Asserts feature-flags API returns 200 and expected shape when DB is mocked.
 */
import { describe, it, expect, vi } from 'vitest';

vi.mock('@/lib/mongodb', () => ({
  default: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@/lib/models', () => ({
  FeatureFlags: { findOne: vi.fn().mockResolvedValue(null) },
  Brand: { findOne: vi.fn().mockResolvedValue(null) },
}));

describe('API /api/feature-flags', () => {
  it('returns 200 and success with featureFlags', async () => {
    const { GET } = await import('../../app/api/feature-flags/route');
    const req = new Request('http://localhost/api/feature-flags');
    const res = await GET(req as never);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty('success', true);
    expect(data).toHaveProperty('featureFlags');
    expect(data.featureFlags).toHaveProperty('features');
  });
});
