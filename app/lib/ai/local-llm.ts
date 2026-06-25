/**
 * Local LLM client helpers.
 *
 * What: Shared chat helpers for Ollama-first local AI workflows.
 * Why: Course automation and maintenance should reuse one provider abstraction.
 */

export type LocalLLMProvider = 'ollama' | 'openai';

export interface LocalLLMChatOptions {
  system: string;
  user: string;
  jsonMode?: boolean;
  provider?: LocalLLMProvider;
  model?: string;
  baseUrl?: string;
  temperature?: number;
}

function cleanJsonResponse(text: string): string {
  const stripped = String(text || '')
    .replace(/```json\s*/gi, '')
    .replace(/```\s*$/g, '')
    .trim();

  const match = stripped.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
  return match ? match[0] : stripped;
}

function resolveProvider(explicit?: LocalLLMProvider): LocalLLMProvider {
  if (explicit) return explicit;

  const configured = process.env.LLM_PROVIDER?.toLowerCase();
  if (configured === 'ollama' || configured === 'openai') {
    return configured as LocalLLMProvider;
  }

  if (process.env.OLLAMA_BASE_URL || process.env.OLLAMA_MODEL) {
    return 'ollama';
  }

  if (process.env.OPENAI_API_KEY) {
    return 'openai';
  }

  return 'ollama';
}

async function callOllama(options: LocalLLMChatOptions): Promise<string> {
  const baseUrl = (options.baseUrl || process.env.OLLAMA_BASE_URL || 'http://localhost:11434').replace(/\/$/, '');
  const model = options.model || process.env.OLLAMA_MODEL || 'llama3.2';
  const body: Record<string, unknown> = {
    model,
    messages: [
      { role: 'system', content: options.system },
      { role: 'user', content: options.user },
    ],
    stream: false,
    temperature: options.temperature ?? 0.2,
  };

  if (options.jsonMode) {
    body.format = 'json';
  }

  const response = await fetch(`${baseUrl}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Ollama API error ${response.status}: ${errorText}`);
  }

  const payload = (await response.json()) as {
    message?: { content?: string };
    done?: boolean;
  };
  const content = String(payload?.message?.content || '').trim();

  if (!content) {
    throw new Error('Empty Ollama response');
  }

  return options.jsonMode ? cleanJsonResponse(content) : content;
}

async function callOpenAI(options: LocalLLMChatOptions): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is required for OpenAI provider');
  }

  const body: Record<string, unknown> = {
    model: options.model || process.env.OPENAI_MODEL || 'gpt-4o-mini',
    messages: [
      { role: 'system', content: options.system },
      { role: 'user', content: options.user },
    ],
    temperature: options.temperature ?? 0.2,
  };

  if (options.jsonMode) {
    body.response_format = { type: 'json_object' };
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API error ${response.status}: ${errorText}`);
  }

  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = String(payload.choices?.[0]?.message?.content || '').trim();

  if (!content) {
    throw new Error('Empty OpenAI response');
  }

  return options.jsonMode ? cleanJsonResponse(content) : content;
}

export async function chatCompletion(options: LocalLLMChatOptions): Promise<string> {
  const provider = resolveProvider(options.provider);
  if (provider === 'ollama') {
    return callOllama(options);
  }
  return callOpenAI(options);
}

export async function chatJson<T>(options: LocalLLMChatOptions): Promise<T> {
  const raw = await chatCompletion({ ...options, jsonMode: true });
  return JSON.parse(raw) as T;
}

export function resolveLocalLLMProvider(explicit?: LocalLLMProvider): LocalLLMProvider {
  return resolveProvider(explicit);
}

