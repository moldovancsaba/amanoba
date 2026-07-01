/**
 * Web Push sender (#20)
 *
 * What: Sends a push notification to all of a player's subscribed browsers.
 * Why: The service worker already renders 'push' events; this is the server half.
 *
 * Env-gated: with no VAPID keys configured this is a safe no-op, so the rest of
 * the app can call it unconditionally. Payload shape matches public/service-worker.js.
 */

import webpush from 'web-push';
import connectDB from '@/app/lib/mongodb';
import { PushSubscription } from '@/app/lib/models';
import { logger } from '@/app/lib/logger';

let configured = false;

/** Returns true if VAPID keys are present and web-push is configured. */
function ensureConfigured(): boolean {
  if (configured) return true;
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT || 'mailto:admin@amanoba.com';
  if (!publicKey || !privateKey) return false;
  webpush.setVapidDetails(subject, publicKey, privateKey);
  configured = true;
  return true;
}

export interface PushPayload {
  title: string;
  body?: string;
  url?: string;
  tag?: string;
  requireInteraction?: boolean;
}

/**
 * Send a push to every subscription belonging to a player.
 * Expired subscriptions (404/410) are pruned. No-op if VAPID is unconfigured.
 */
export async function sendPushToPlayer(
  playerId: string | { toString(): string },
  payload: PushPayload
): Promise<{ sent: number; skipped: boolean }> {
  if (!ensureConfigured()) return { sent: 0, skipped: true };

  await connectDB();
  const subs = await PushSubscription.find({ playerId }).lean();
  if (subs.length === 0) return { sent: 0, skipped: false };

  const body = JSON.stringify(payload);
  let sent = 0;
  const staleEndpoints: string[] = [];

  await Promise.all(
    subs.map(async (sub) => {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: sub.keys as { p256dh: string; auth: string } },
          body
        );
        sent++;
      } catch (err) {
        const statusCode = (err as { statusCode?: number })?.statusCode;
        if (statusCode === 404 || statusCode === 410) {
          staleEndpoints.push(sub.endpoint);
        } else {
          logger.warn({ err, endpoint: sub.endpoint }, 'Push send failed');
        }
      }
    })
  );

  if (staleEndpoints.length > 0) {
    await PushSubscription.deleteMany({ endpoint: { $in: staleEndpoints } });
  }

  return { sent, skipped: false };
}
