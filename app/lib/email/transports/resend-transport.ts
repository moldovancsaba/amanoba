/**
 * Resend email transport
 *
 * What: Sends email via Resend API
 * Why: Resend is a modern transactional email provider
 */

import { Resend } from 'resend';
import type { EmailTransport, SendMailOptions, SendMailResult } from './types';

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export function createResendTransport(): EmailTransport {
  return {
    isConfigured(): boolean {
      return !!resend;
    },
    async send(options: SendMailOptions): Promise<SendMailResult> {
      if (!resend) {
        return { success: false, error: 'Resend API key not configured' };
      }
      const { data, error } = await resend.emails.send({
        from: options.from,
        to: options.to,
        subject: options.subject,
        html: options.html,
        replyTo: options.replyTo,
      });
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true, messageId: data?.id ?? undefined };
    },
  };
}
