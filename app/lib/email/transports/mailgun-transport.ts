/**
 * Mailgun email transport (API)
 *
 * What: Sends email via Mailgun HTTP API
 * Why: Alternative to Resend/SMTP; use when you prefer Mailgun dashboard and API
 */

import Mailgun from 'mailgun.js';
import formData from 'form-data';
import type { EmailTransport, SendMailOptions, SendMailResult } from './types';

interface MailgunClient {
  messages: { create: (domain: string, payload: Record<string, unknown>) => Promise<{ id?: string }> };
}

function createMailgunClient(): MailgunClient | null {
  const apiKey = process.env.MAILGUN_API_KEY;
  const domain = process.env.MAILGUN_DOMAIN;
  if (!apiKey || !domain) return null;
  const mailgun = new Mailgun(formData);
  return mailgun.client({
    username: 'api',
    key: apiKey,
    url: process.env.MAILGUN_HOST || 'https://api.mailgun.net', // EU: https://api.eu.mailgun.net
  });
}

const client = createMailgunClient();
const domain = process.env.MAILGUN_DOMAIN || '';

export function createMailgunTransport(): EmailTransport {
  return {
    isConfigured(): boolean {
      return !!client && !!domain;
    },
    async send(options: SendMailOptions): Promise<SendMailResult> {
      if (!client || !domain) {
        return {
          success: false,
          error: 'Mailgun not configured: set MAILGUN_API_KEY and MAILGUN_DOMAIN',
        };
      }
      try {
        const payload: Record<string, unknown> = {
          from: options.from,
          to: [options.to],
          subject: options.subject,
          html: options.html,
        };
        if (options.replyTo) payload['h:Reply-To'] = options.replyTo;
        const msg = await client.messages.create(domain, payload);
        const id = (msg as { id?: string }).id;
        return { success: true, messageId: id };
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return { success: false, error: message };
      }
    },
  };
}
