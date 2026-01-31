/**
 * Smoke test: /api/health
 * Asserts health API returns 200 and expected shape when DB is mocked.
 */
import { describe, it, expect, vi, beforeAll } from 'vitest';

vi.mock('../../app/lib/mongodb', () => ({
  default: vi.fn().mockResolvedValue(undefined),
  getConnectionState: vi.fn().mockReturnValue(1),
}));

describe('API /api/health', () => {
  beforeAll(async () => {
    const { GET } = await import('../../app/api/health/route');
    (global as unknown as { __healthGET: typeof GET }).__healthGET = GET;
  });

  it('returns 200 and status healthy', async () => {
    const { GET } = await import('../../app/api/health/route');
    const res = await GET();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty('status', 'healthy');
    expect(data).toHaveProperty('timestamp');
    expect(data).toHaveProperty('database');
  });
});
