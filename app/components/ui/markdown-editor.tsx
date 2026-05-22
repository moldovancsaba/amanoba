/**
 * Markdown Editor Component
 *
 * What: Edit lesson content as Markdown with optional preview.
 * Why: Canonical format is Markdown in DB, exports, and imports; no HTML in editor.
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { Box, Paper, SegmentedControl, Stack, Textarea } from '@mantine/core';
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
  minHeight?: string;
}

export default function MarkdownEditor({
  content,
  onChange,
  placeholder = 'Write your content in **Markdown** (headings, lists, **bold**, *italic*, [links](url))…',
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
    <Paper withBorder radius="md" className="overflow-hidden">
      <Stack gap={0}>
        <Box p="xs" bg="ink.8">
          <SegmentedControl
            value={activeTab}
            onChange={(value) => setActiveTab(value as 'edit' | 'preview')}
            data={[
              { value: 'edit', label: 'Edit' },
              { value: 'preview', label: 'Preview' },
            ]}
          />
        </Box>
        {activeTab === 'edit' ? (
          <Textarea
            value={content}
            onChange={(event) => onChange(event.currentTarget.value)}
            placeholder={placeholder}
            spellCheck="true"
            autosize
            minRows={10}
            styles={{ input: { border: 0, borderRadius: 0, minHeight, fontFamily: 'var(--mantine-font-family-monospace)' } }}
          />
        ) : (
          <Box
            p="md"
            c="dark.9"
            mih={minHeight}
            dangerouslySetInnerHTML={{ __html: previewHtml }}
          />
        )}
      </Stack>
    </Paper>
  );
}
