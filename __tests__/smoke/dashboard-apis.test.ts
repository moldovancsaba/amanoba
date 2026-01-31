/**
 * Smoke tests: APIs used by the dashboard
 * Asserts /api/profile and /api/my-courses return 401 when unauthenticated.
 */
import { describe, it, expect, vi } from 'vitest';

vi.mock('@/lib/mongodb', () => ({
  default: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@/auth', () => ({
  auth: vi.fn().mockResolvedValue(null),
}));

vi.mock('@/lib/security', () => ({
  checkRateLimit: vi.fn().mockResolvedValue(null),
  apiRateLimiter: {},
}));

describe('Dashboard APIs (unauthenticated)', () => {
  it('GET /api/profile returns 401 when not logged in', async () => {
    const { GET } = await import('../../app/api/profile/route');
    const req = new Request('http://localhost/api/profile');
    const res = await GET(req as never);
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data).toHaveProperty('error', 'Unauthorized');
  });

  it('GET /api/my-courses returns 401 when not logged in', async () => {
    const { GET } = await import('../../app/api/my-courses/route');
    const req = new Request('http://localhost/api/my-courses');
    const res = await GET(req as never);
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data).toHaveProperty('error', 'Unauthorized');
  });
});
