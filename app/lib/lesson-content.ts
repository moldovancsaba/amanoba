/**
 * Lesson content format helpers
 *
 * What: Canonical format is Markdown. Legacy content may be HTML.
 * Why: Single format in editor, exports, and imports; render to HTML only for display/email.
 */

import { marked } from 'marked';
import TurndownService from 'turndown';

const LOOKS_LIKE_HTML = /<\/?[a-z][\s\S]*>/i;

let _turndown: TurndownService | null = null;
function getTurndown(): TurndownService {
  if (!_turndown) _turndown = new TurndownService({ headingStyle: 'atx' });
  return _turndown;
}

/**
 * Converts HTML to Markdown. Use when exporting so package content is always Markdown.
 */
export function htmlToMarkdown(html: string | null | undefined): string {
  const trimmed = (html || '').trim();
  if (!trimmed) return '';
  if (!LOOKS_LIKE_HTML.test(trimmed)) return trimmed;
  try {
    return getTurndown().turndown(trimmed) || trimmed;
  } catch {
    return trimmed;
  }
}

/**
 * Ensures content is in Markdown form: if it looks like HTML, convert to Markdown; otherwise return as-is.
 * Use when building course exports so the package is always Markdown.
 */
export function contentToMarkdown(content: string | null | undefined): string {
  const trimmed = (content || '').trim();
  if (!trimmed) return '';
  if (LOOKS_LIKE_HTML.test(trimmed)) return htmlToMarkdown(trimmed);
  return trimmed;
}

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
