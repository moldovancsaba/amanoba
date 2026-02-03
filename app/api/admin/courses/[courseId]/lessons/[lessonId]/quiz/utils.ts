/**
 * Quiz Admin Helpers
 *
 * What: Shared helpers for quiz question routes
 * Why: Keep actor resolution and editable field lists in one place so both quiz routes stay consistent.
 */

import type { Session } from 'next-auth';

export const quizEditableFields = [
  'question',
  'options',
  'correctIndex',
  'difficulty',
  'category',
  'isActive',
] as const;

export function getEditorActorId(session: Session | null): string {
  const candidate = session?.user?.email || session?.user?.id;
  return candidate ? String(candidate) : 'editor';
}
