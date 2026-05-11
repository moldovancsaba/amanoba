import fs from 'node:fs';
import path from 'node:path';
import { locales } from '../app/lib/i18n/locales';

type NewsSection = {
  heading: string;
  paragraphs: string[];
};

type LocalizedNewsPost = {
  headline: string;
  summary: string;
  body: NewsSection[];
};

type NewsPost = {
  slug: string;
  publishedAt: string;
  updatedAt: string;
  source: string;
  translations: Record<string, LocalizedNewsPost>;
};

type InputPost = {
  slug?: string;
  publishedAt?: string;
  updatedAt?: string;
  source?: string;
  translations?: Record<string, LocalizedNewsPost>;
} & LocalizedNewsPost;

const root = process.cwd();
const contentPath = path.join(root, 'content', 'news-posts.json');

function parseArgs() {
  const args = process.argv.slice(2);
  const out: Record<string, string | boolean> = {};
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (!arg.startsWith('--')) continue;
    const key = arg.slice(2);
    const next = args[index + 1];
    if (!next || next.startsWith('--')) {
      out[key] = true;
    } else {
      out[key] = next;
      index += 1;
    }
  }
  return out;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90);
}

function readInput(file?: string): InputPost {
  if (!file) {
    throw new Error('Missing --file path. Pass a JSON file containing headline, summary, and body.');
  }
  const fullPath = path.isAbsolute(file) ? file : path.join(root, file);
  const parsed = JSON.parse(fs.readFileSync(fullPath, 'utf8')) as InputPost | InputPost[];
  return Array.isArray(parsed) ? parsed[0] : parsed;
}

function normalizeBody(input: InputPost): NewsSection[] {
  if (Array.isArray(input.body) && input.body.length > 0) {
    return input.body;
  }
  if (input.translations?.en?.body && input.translations.en.body.length > 0) {
    return input.translations.en.body;
  }
  throw new Error('Input post must include a non-empty body array.');
}

function normalizeTranslations(input: InputPost, fallback: LocalizedNewsPost) {
  const provided = input.translations ?? {};
  const translations: Record<string, LocalizedNewsPost> = {};
  for (const locale of locales) {
    translations[locale] = provided[locale] ?? fallback;
  }
  translations.en = provided.en ?? fallback;
  return translations;
}

function main() {
  const args = parseArgs();
  const input = readInput(typeof args.file === 'string' ? args.file : undefined);
  const publishedAt = input.publishedAt ?? new Date().toISOString().slice(0, 10);
  const fallback = {
    headline: input.headline ?? input.translations?.en?.headline,
    summary: input.summary ?? input.translations?.en?.summary,
    body: normalizeBody(input),
  };
  if (!fallback.headline || !fallback.summary) {
    throw new Error('Input post must include headline and summary, or translations.en.headline and translations.en.summary.');
  }
  const slug = input.slug ?? `${publishedAt}-${slugify(fallback.headline)}`;
  const nextPost: NewsPost = {
    slug,
    publishedAt,
    updatedAt: input.updatedAt ?? publishedAt,
    source: input.source ?? 'amanoba-news',
    translations: normalizeTranslations(input, fallback),
  };

  const existing = fs.existsSync(contentPath)
    ? (JSON.parse(fs.readFileSync(contentPath, 'utf8')) as NewsPost[])
    : [];
  const withoutExisting = existing.filter((post) => post.slug !== nextPost.slug);
  const nextPosts = [nextPost, ...withoutExisting].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  if (args['dry-run'] !== true) {
    fs.mkdirSync(path.dirname(contentPath), { recursive: true });
    fs.writeFileSync(contentPath, `${JSON.stringify(nextPosts, null, 2)}\n`);
  }

  console.log(`${args['dry-run'] === true ? 'Validated' : 'Published'} Amanoba news post: ${nextPost.slug}`);
  console.log(`Locales available: ${locales.join(', ')}`);
}

main();
