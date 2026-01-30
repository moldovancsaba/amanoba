import { env } from 'process';

export interface QuizItemQAConfig {
  apiBaseUrl: string;
  adminToken?: string;
  pageSize: number;
  rateLimitMs: number;
  maxRetries: number;
  itemsPerRun: number;
  dryRun: boolean;
  courseSpecificOnly: boolean;
  // Optional MongoDB ObjectId (24-hex) to restrict processing to a single course.
  courseObjectId?: string;
}

const DEFAULT_BASE = 'https://amanoba.com/api/admin/questions';

function parseNumber(envVar: string | undefined, fallback: number): number {
  if (!envVar) return fallback;
  const parsed = Number(envVar);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function loadConfig(overrides?: Partial<QuizItemQAConfig>): QuizItemQAConfig {
  const config: QuizItemQAConfig = {
    apiBaseUrl: env.QUIZ_ITEM_API_BASE_URL?.trim() || DEFAULT_BASE,
    adminToken: env.QUIZ_ITEM_ADMIN_TOKEN?.trim() || env.ADMIN_API_TOKEN?.trim() || undefined,
    pageSize: parseNumber(env.QUIZ_ITEM_PAGE_SIZE, 100),
    rateLimitMs: parseNumber(env.QUIZ_ITEM_RATE_LIMIT_MS, 200),
    maxRetries: Math.max(1, parseNumber(env.QUIZ_ITEM_MAX_RETRIES, 3)),
    itemsPerRun: Math.max(1, parseNumber(env.QUIZ_ITEM_ITEMS_PER_RUN, 1)),
    dryRun: env.QUIZ_ITEM_DRY_RUN === 'true',
    courseSpecificOnly: env.QUIZ_ITEM_QA_COURSE_ONLY !== 'false',
    courseObjectId: env.QUIZ_ITEM_QA_COURSE_ID?.trim() || undefined,
  };

  return { ...config, ...overrides };
}
