/**
 * Smoke test: /api/courses
 * Asserts courses API returns 200 and expected shape when DB is mocked.
 */
import { describe, it, expect, vi } from 'vitest';

vi.mock('@/lib/mongodb', () => ({
  default: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@/lib/models', () => ({
  Course: {
    find: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      sort: vi.fn().mockReturnThis(),
      lean: vi.fn().mockResolvedValue([]),
    }),
  },
  Brand: {
    findOne: vi.fn().mockResolvedValue(null),
  },
}));

describe('API /api/courses', () => {
  it('returns 200 and success with courses array', async () => {
    const { GET } = await import('../../app/api/courses/route');
    const req = new Request('http://localhost/api/courses');
    const res = await GET(req as never);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty('success', true);
    expect(data).toHaveProperty('courses');
    expect(Array.isArray(data.courses)).toBe(true);
  });
});
