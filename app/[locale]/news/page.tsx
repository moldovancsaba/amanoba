import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CalendarDays, Sparkles } from 'lucide-react';
import { LocaleLink } from '@/components/LocaleLink';
import Logo from '@/components/Logo';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { APP_URL } from '@/app/lib/constants/app-url';
import { locales, type Locale } from '@/app/lib/i18n/locales';
import { getAllNewsPosts, getLatestNewsPost, getNewsLanguages } from '@/app/lib/news';

const labels = {
  eyebrow: "What's new",
  title: "What's new at Amanoba",
  description: "Learner-facing product updates, shipped improvements, and release-note highlights.",
  latest: "Latest update",
  allPosts: "All updates",
  readPost: "Read post",
  backHome: "Home",
  backDashboard: "Dashboard",
};

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const latest = getLatestNewsPost(locale);
  const base = APP_URL.replace(/\/$/, '');
  const canonical = `${base}/${locale}/news`;
  const languages = Object.fromEntries(
    Object.entries(getNewsLanguages()).map(([key, path]) => [key, `${base}${path}`])
  );

  return {
    title: latest ? `${labels.title} | ${latest.headline}` : labels.title,
    description: latest?.summary ?? labels.description,
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      title: labels.title,
      description: latest?.summary ?? labels.description,
      url: canonical,
      type: 'website',
      siteName: 'Amanoba',
    },
  };
}

export default async function NewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const posts = getAllNewsPosts(locale);
  const latest = posts[0];

  if (!latest) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-brand-black">
      <header className="border-b-2 border-brand-accent bg-brand-darkGrey">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Logo size="sm" showText={false} linkTo="/" className="flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-brand-accent">{labels.eyebrow}</p>
              <h1 className="text-2xl font-bold text-brand-white">{labels.title}</h1>
            </div>
          </div>
          <nav className="flex flex-wrap items-center gap-3">
            <LanguageSwitcher />
            <LocaleLink
              href="/"
              className="rounded-lg border-2 border-brand-accent px-4 py-2 font-bold text-brand-white transition-colors hover:bg-brand-accent hover:text-brand-black"
            >
              {labels.backHome}
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

      <main className="mx-auto max-w-6xl px-6 py-10">
        <section className="mb-10 grid gap-8 lg:grid-cols-[1.4fr_0.8fr] lg:items-start">
          <article className="rounded-xl border-2 border-brand-accent bg-brand-white p-6 shadow-xl sm:p-8">
            <div className="mb-5 flex flex-wrap items-center gap-3 text-sm font-semibold text-brand-darkGrey">
              <span className="inline-flex items-center gap-2 rounded-lg bg-brand-darkGrey px-3 py-2 text-brand-white">
                <Sparkles className="h-4 w-4 text-brand-accent" />
                {labels.latest}
              </span>
              <time className="inline-flex items-center gap-2" dateTime={latest.publishedAt}>
                <CalendarDays className="h-4 w-4" />
                {latest.publishedAt}
              </time>
            </div>
            <h2 className="mb-4 text-3xl font-bold leading-tight text-brand-black sm:text-4xl">
              {latest.headline}
            </h2>
            <p className="mb-8 text-lg leading-8 text-brand-darkGrey">{latest.summary}</p>

            <div className="space-y-8">
              {latest.body.map((section) => (
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

          <aside className="rounded-xl border-2 border-brand-accent bg-brand-darkGrey p-6 shadow-xl">
            <h2 className="mb-3 text-xl font-bold text-brand-white">{labels.allPosts}</h2>
            <div className="space-y-4">
              {posts.map((post) => (
                <LocaleLink
                  key={post.slug}
                  href={`/news/${post.slug}`}
                  className="block rounded-lg border border-brand-white/15 bg-brand-black/30 p-4 transition-colors hover:border-brand-accent"
                >
                  <time className="text-xs font-semibold uppercase tracking-wide text-brand-accent" dateTime={post.publishedAt}>
                    {post.publishedAt}
                  </time>
                  <h3 className="mt-2 text-base font-bold text-brand-white">{post.headline}</h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-brand-white/75">{post.summary}</p>
                  <span className="mt-3 inline-block text-sm font-bold text-brand-accent">{labels.readPost}</span>
                </LocaleLink>
              ))}
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
