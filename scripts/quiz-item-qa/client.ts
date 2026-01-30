import { loadConfig, QuizItemQAConfig } from './config';

export interface QuizItem {
  _id: string;
  uuid?: string;
  question: string;
  options: string[];
  correctIndex: number;
  difficulty: string;
  category: string;
  questionType?: string;
  hashtags?: string[];
  isActive: boolean;
  isCourseSpecific: boolean;
  courseId?: string;
  lessonId?: string;
  relatedCourseIds?: string[];
  metadata: {
    createdAt: string;
    updatedAt: string;
    createdBy?: string;
    auditedAt?: string;
    auditedBy?: string;
    lastShownAt?: string;
  };
  showCount?: number;
  correctCount?: number;
}

interface ListResponse {
  success: boolean;
  questions: QuizItem[];
  count: number;
  total: number;
}

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  config: QuizItemQAConfig
): Promise<Response> {
  let attempt = 0;
  while (attempt < config.maxRetries) {
    try {
      const response = await fetch(url, {
        ...options,
        redirect: 'follow' // Follow redirects
      });
      if (!response.ok) {
        throw new Error(
          `Request failed ${(response.status || 0)}: ${response.statusText}`
        );
      }
      return response;
    } catch (error) {
      attempt += 1;
      if (attempt >= config.maxRetries) {
        throw error;
      }
      await delay(config.rateLimitMs * attempt);
    }
  }
  throw new Error('Failed to fetch after retries');
}

function buildHeaders(config: QuizItemQAConfig) {
  const headers: Record<string, string> = { ...DEFAULT_HEADERS };
  if (config.adminToken) {
    // Try X-Admin-Api-Key header first (for production), fallback to Authorization Bearer
    headers['X-Admin-Api-Key'] = config.adminToken;
  }
  return headers;
}

export async function listQuestions(
  overrides?: Partial<QuizItemQAConfig>,
  query?: { limit?: number; offset?: number }
) {
  const config = loadConfig(overrides);
  const limit = query?.limit ?? config.pageSize;
  const offset = query?.offset ?? 0;
  const url = new URL(config.apiBaseUrl);
  url.searchParams.set('limit', String(limit));
  url.searchParams.set('offset', String(offset));

  const response = await fetchWithRetry(url.toString(), {
    method: 'GET',
    headers: buildHeaders(config),
  }, config);
  const json = (await response.json()) as ListResponse;
  return { ...json, config };
}

export async function fetchAllQuestions(overrides?: Partial<QuizItemQAConfig>) {
  const config = loadConfig(overrides);
  const all: QuizItem[] = [];
  let offset = 0;
  let total = 0;
  do {
    const { questions, count, total: pageTotal } = await listQuestions(overrides, {
      limit: config.pageSize,
      offset,
    });
    total = pageTotal;
    all.push(...questions);
    offset += count;
    if (offset < total) {
      await delay(config.rateLimitMs);
    }
  } while (offset < total);
  return all;
}

export async function fetchQuestionById(
  questionId: string,
  overrides?: Partial<QuizItemQAConfig>
) {
  const config = loadConfig(overrides);
  const url = `${config.apiBaseUrl}/${questionId}`;
  const response = await fetchWithRetry(url, {
    method: 'GET',
    headers: buildHeaders(config),
  }, config);
  const json = (await response.json()) as { success: boolean; question: QuizItem };
  if (!json.success) {
    throw new Error('Failed to fetch question');
  }
  return json.question;
}

export async function patchQuestion(
  questionId: string,
  payload: Record<string, unknown>,
  overrides?: Partial<QuizItemQAConfig>
) {
  const config = loadConfig(overrides);
  const url = `${config.apiBaseUrl}/${questionId}`;
  const response = await fetchWithRetry(url, {
    method: 'PATCH',
    headers: buildHeaders(config),
    body: JSON.stringify(payload),
  }, config);
  const json = (await response.json()) as { success: boolean; question: QuizItem };
  if (!json.success) {
    throw new Error('Failed to apply patch');
  }
  return json.question;
}

export async function auditLastModified(overrides?: Partial<QuizItemQAConfig>) {
  const all = await fetchAllQuestions(overrides);
  if (all.length === 0) {
    return null;
  }
  const sorted = [...all].sort((a, b) => {
    const left = Date.parse(a.metadata.updatedAt);
    const right = Date.parse(b.metadata.updatedAt);
    return right - left;
  });
  return sorted[0];
}

export async function getOldestByUpdatedAt(overrides?: Partial<QuizItemQAConfig>) {
  const all = await fetchAllQuestions(overrides);
  if (all.length === 0) {
    return null;
  }
  return [...all].sort((a, b) => {
    const left = Date.parse(a.metadata.updatedAt);
    const right = Date.parse(b.metadata.updatedAt);
    return left - right;
  });
}
