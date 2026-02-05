/**
 * Lesson content format helpers
 *
 * What: Canonical format is Markdown. Legacy content may be HTML.
 * Why: Single format in editor, exports, and imports; render to HTML only for display/email.
 */

import { marked } from 'marked';

const LOOKS_LIKE_HTML = /<\/?[a-z][\s\S]*>/i;

/**
 * Renders lesson content (markdown or legacy HTML) to HTML for display or email.
 * - If content looks like HTML, return as-is (legacy).
 * - Otherwise treat as Markdown and convert to HTML.
 */
export function contentToHtml(content: string | null | undefined): string {
  const trimmed = (content || '').trim();
  if (!trimmed) return '';
  if (LOOKS_LIKE_HTML.test(trimmed)) return trimmed;
  return marked.parse(trimmed) as string;
}
