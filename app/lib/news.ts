import newsPosts from '@/content/news-posts.json';
import { locales, type Locale } from '@/app/lib/i18n/locales';

export type NewsSection = {
  heading: string;
  paragraphs: string[];
};

export type LocalizedNewsPost = {
  headline: string;
  summary: string;
  body: NewsSection[];
};

export type NewsPost = {
  slug: string;
  publishedAt: string;
  updatedAt: string;
  source: string;
  translations: Partial<Record<Locale, LocalizedNewsPost>> & {
    en: LocalizedNewsPost;
  };
};

export type NewsPostForLocale = Omit<NewsPost, 'translations'> & LocalizedNewsPost;

const posts = newsPosts as NewsPost[];

export function getAllNewsPosts(locale: string): NewsPostForLocale[] {
  return [...posts]
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .map((post) => localizeNewsPost(post, locale));
}

export function getNewsPost(slug: string, locale: string): NewsPostForLocale | null {
  const post = posts.find((item) => item.slug === slug);
  return post ? localizeNewsPost(post, locale) : null;
}

export function getLatestNewsPost(locale: string): NewsPostForLocale | null {
  return getAllNewsPosts(locale)[0] ?? null;
}

export function getNewsSlugs(): string[] {
  return posts.map((post) => post.slug);
}

export function getNewsLanguages(slug?: string) {
  const base = slug ? `/news/${slug}` : '/news';
  return Object.fromEntries(locales.map((locale) => [locale, `/${locale}${base}`]));
}

function localizeNewsPost(post: NewsPost, locale: string): NewsPostForLocale {
  const normalizedLocale = locales.includes(locale as Locale) ? (locale as Locale) : 'en';
  const translation = post.translations[normalizedLocale] ?? post.translations.en;
  const { translations: _translations, ...metadata } = post;
  return {
    ...metadata,
    ...translation,
  };
}
