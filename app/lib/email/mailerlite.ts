/**
 * MailerLite subscriber sync (#17)
 *
 * What: Upserts a learner into a MailerLite audience/group.
 * Why: Board item asks to "sync subscribers" to an ESP for marketing/campaigns.
 *
 * Env-gated: with no MAILERLITE_API_KEY this is a safe no-op, so callers can fire
 * it unconditionally. Uses the MailerLite "connect" API (upsert-by-email).
 * Campaign sending is intentionally out of scope for this MVP.
 */

import { logger } from '@/app/lib/logger';

const API_BASE = 'https://connect.mailerlite.com/api';

export function isMailerLiteConfigured(): boolean {
  return !!process.env.MAILERLITE_API_KEY;
}

export interface MailerLiteSubscriber {
  email: string;
  name?: string;
  fields?: Record<string, string | number | null>;
}

/**
 * Upsert a subscriber (create or update by email). No-op if unconfigured.
 * Returns true on success, false on skip/failure (never throws).
 */
export async function upsertMailerLiteSubscriber(sub: MailerLiteSubscriber): Promise<boolean> {
  const apiKey = process.env.MAILERLITE_API_KEY;
  if (!apiKey || !sub.email) return false;

  const groupId = process.env.MAILERLITE_GROUP_ID;
  const body: Record<string, unknown> = {
    email: sub.email,
    fields: { ...(sub.name ? { name: sub.name } : {}), ...(sub.fields || {}) },
  };
  if (groupId) body.groups = [groupId];

  try {
    const res = await fetch(`${API_BASE}/subscribers`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      logger.warn({ status: res.status, email: sub.email }, 'MailerLite subscriber upsert failed');
      return false;
    }
    return true;
  } catch (err) {
    logger.warn({ err, email: sub.email }, 'MailerLite subscriber upsert error');
    return false;
  }
}
