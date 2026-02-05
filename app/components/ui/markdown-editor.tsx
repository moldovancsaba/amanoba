/**
 * Markdown Editor Component
 *
 * What: Edit lesson content as Markdown with optional preview.
 * Why: Canonical format is Markdown in DB, exports, and imports; no HTML in editor.
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { contentToHtml } from '@/app/lib/lesson-content';

const LOOKS_LIKE_HTML = /<\/?[a-z][\s\S]*>/i;

async function htmlToMarkdownAsync(html: string): Promise<string> {
  if (typeof window === 'undefined') return html;
  try {
    const { default: TurndownService } = await import('turndown');
    const td = new TurndownService({ headingStyle: 'atx' });
    return td.turndown(html.trim()) || html;
  } catch {
    return html;
  }
}

interface MarkdownEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
}

export default function MarkdownEditor({
  content,
  onChange,
  placeholder = 'Write your content in **Markdown** (headings, lists, **bold**, *italic*, [links](url))…',
  className = '',
  minHeight = '300px',
}: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const hasConvertedLegacy = useRef(false);

  useEffect(() => {
    const trimmed = (content || '').trim();
    if (!trimmed || hasConvertedLegacy.current) return;
    if (LOOKS_LIKE_HTML.test(trimmed)) {
      hasConvertedLegacy.current = true;
      void htmlToMarkdownAsync(trimmed).then((md) => onChange(md));
    }
  }, [content, onChange]);

  const previewHtml = contentToHtml(content);

  return (
    <div className={`border-2 border-brand-darkGrey rounded-lg bg-brand-white overflow-hidden ${className}`}>
      <div className="flex gap-2 p-2 border-b border-brand-darkGrey/20 bg-brand-darkGrey/5">
        <button
          type="button"
          onClick={() => setActiveTab('edit')}
          className={`px-3 py-1.5 rounded font-medium text-sm transition-colors ${
            activeTab === 'edit' ? 'bg-brand-accent text-brand-black' : 'text-brand-black hover:bg-brand-darkGrey/20'
          }`}
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('preview')}
          className={`px-3 py-1.5 rounded font-medium text-sm transition-colors ${
            activeTab === 'preview' ? 'bg-brand-accent text-brand-black' : 'text-brand-black hover:bg-brand-darkGrey/20'
          }`}
        >
          Preview
        </button>
      </div>
      <div style={{ minHeight }} className="relative">
        {activeTab === 'edit' ? (
          <textarea
            value={content}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full min-h-full p-4 bg-brand-white text-brand-black placeholder:text-brand-darkGrey/50 focus:outline-none resize-y font-mono text-sm"
            spellCheck="true"
          />
        ) : (
          <div
            className="prose prose-base max-w-none p-4 text-brand-black lesson-prose"
            dangerouslySetInnerHTML={{ __html: previewHtml }}
          />
        )}
      </div>
    </div>
  );
}
