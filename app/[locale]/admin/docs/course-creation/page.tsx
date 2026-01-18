'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';

type LoadState = 'loading' | 'ready' | 'error';

export default function CourseCreationGuidePage() {
  const locale = useLocale();
  const t = useTranslations('admin');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<LoadState>('loading');

  // Determine which guide to load based on locale
  const DOC_PATH = locale === 'hu' 
    ? '/admin-docs/course-creation-guide-hu.md'
    : '/admin-docs/course-creation-guide-en.md';

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const response = await fetch(DOC_PATH, { cache: 'no-store' });
        if (!response.ok) {
          throw new Error('Failed to load guide');
        }
        const text = await response.text();
        if (active) {
          setContent(text);
          setStatus('ready');
        }
      } catch (error) {
        if (active) {
          setStatus('error');
        }
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [DOC_PATH]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            {locale === 'hu' ? 'Kurzus létrehozási útmutató' : 'Course Creation Guide'}
          </h1>
          <p className="text-gray-400">
            {locale === 'hu' 
              ? 'Részletes útmutató az AI_30_NAP kurzus alapján'
              : 'Comprehensive guide based on the AI_30_NAP course'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/${locale}/admin/courses`}
            className="px-4 py-2 rounded-lg bg-brand-darkGrey text-brand-white hover:bg-brand-secondary-700"
          >
            {locale === 'hu' ? 'Vissza a kurzusokhoz' : 'Back to Courses'}
          </Link>
          <a
            href={DOC_PATH}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-lg bg-brand-accent text-brand-black hover:bg-brand-primary-400"
          >
            {locale === 'hu' ? 'Nyers fájl megnyitása' : 'Open Raw File'}
          </a>
        </div>
      </div>

      <div className="bg-brand-white rounded-xl p-6 border-2 border-brand-accent">
        {status === 'loading' && (
          <div className="text-brand-darkGrey">
            {locale === 'hu' ? 'Útmutató betöltése...' : 'Loading guide...'}
          </div>
        )}
        {status === 'error' && (
          <div className="text-red-600">
            {locale === 'hu' 
              ? 'Nem sikerült betölteni az útmutatót. Ellenőrizd az elérési utat.'
              : 'Failed to load guide. Please check the file path.'}
          </div>
        )}
        {status === 'ready' && (
          <div className="markdown-content text-brand-black">
            <pre className="whitespace-pre-wrap text-sm leading-6 font-mono">
              {content}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
