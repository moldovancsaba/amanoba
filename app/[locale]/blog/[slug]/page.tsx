import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CalendarDays } from 'lucide-react';
import { LocaleLink } from '@/components/LocaleLink';
import Logo from '@/components/Logo';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { APP_URL } from '@/app/lib/constants/app-url';
import { locales, type Locale } from '@/app/lib/i18n/locales';
import { getBlogLanguages, getNewsPost, getNewsSlugs } from '@/app/lib/news';

const labels = {
  eyebrow: 'Amanoba blog',
  backToBlog: 'All blog posts',
  backDashboard: 'Dashboard',
};

export async function generateStaticParams() {
  return locales.flatMap((locale) => getNewsSlugs().map((slug) => ({ locale, slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const post = getNewsPost(slug, locale);
  if (!post) {
    notFound();
  }

  const base = APP_URL.replace(/\/$/, '');
  const canonical = `${base}/${locale}/blog/${slug}`;
  const languages = Object.fromEntries(
    Object.entries(getBlogLanguages(slug)).map(([key, path]) => [key, `${base}${path}`])
  );

  return {
    title: `${post.headline} | Amanoba Blog`,
    description: post.summary,
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      title: post.headline,
      description: post.summary,
      url: canonical,
      type: 'article',
      siteName: 'Amanoba',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const post = getNewsPost(slug, locale);
  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-brand-black">
      <header className="border-b-2 border-brand-accent bg-brand-darkGrey">
        <div className="mx-auto flex max-w-4xl flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Logo size="sm" showText={false} linkTo="/blog" className="flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-brand-accent">{labels.eyebrow}</p>
              <h1 className="text-xl font-bold text-brand-white">Amanoba Blog</h1>
            </div>
          </div>
          <nav className="flex flex-wrap items-center gap-3">
            <LanguageSwitcher />
            <LocaleLink
              href="/blog"
              className="rounded-lg border-2 border-brand-accent px-4 py-2 font-bold text-brand-white transition-colors hover:bg-brand-accent hover:text-brand-black"
            >
              {labels.backToBlog}
            </LocaleLink>
            <LocaleLink
              href="/dashboard"
              className="rounded-lg bg-brand-accent px-4 py-2 font-bold text-brand-black transition-colors hover:bg-brand-primary-400"
            >
              {labels.backDashboard}
            </LocaleLink>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        <article className="rounded-xl border-2 border-brand-accent bg-brand-white p-6 shadow-xl sm:p-10">
          <time className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-darkGrey" dateTime={post.publishedAt}>
            <CalendarDays className="h-4 w-4" />
            {post.publishedAt}
          </time>
          <h2 className="mb-4 text-3xl font-bold leading-tight text-brand-black sm:text-5xl">
            {post.headline}
          </h2>
          <p className="mb-8 text-lg leading-8 text-brand-darkGrey">{post.summary}</p>

          <div className="space-y-8">
            {post.body.map((section) => (
              <section key={section.heading}>
                <h3 className="mb-3 text-xl font-bold text-brand-black">{section.heading}</h3>
                <div className="space-y-3">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="leading-7 text-brand-darkGrey">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </article>
      </main>
    </div>
  );
}
