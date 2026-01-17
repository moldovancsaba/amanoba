'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';

const DOC_PATH = '/admin-docs/course-creation-checklist.md';

type LoadState = 'loading' | 'ready' | 'error';

export default function CourseCreationGuidePage() {
  const locale = useLocale();
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<LoadState>('loading');

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
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Course Creation Guide</h1>
          <p className="text-gray-400">Public admin doc for the first course</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/${locale}/admin/courses`}
            className="px-4 py-2 rounded-lg bg-brand-darkGrey text-brand-white hover:bg-brand-secondary-700"
          >
            Back to Courses
          </Link>
          <a
            href={DOC_PATH}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-lg bg-brand-accent text-brand-black hover:bg-brand-primary-400"
          >
            Open Raw File
          </a>
        </div>
      </div>

      <div className="bg-brand-white rounded-xl p-6 border-2 border-brand-accent">
        {status === 'loading' && (
          <div className="text-brand-darkGrey">Loading guide...</div>
        )}
        {status === 'error' && (
          <div className="text-red-600">Failed to load guide. Check the file path.</div>
        )}
        {status === 'ready' && (
          <pre className="whitespace-pre-wrap text-sm leading-6 text-brand-black">
            {content}
          </pre>
        )}
      </div>
    </div>
  );
}
