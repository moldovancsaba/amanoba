/**
 * Email transport factory — choose provider via EMAIL_PROVIDER
 *
 * What: Returns the configured email transport (Resend, SMTP, or Mailgun)
 * Why: Single place to add Resend, SMTP (Gmail/Mailgun SMTP), Mailgun API, or future providers
 */

import type { EmailTransport, EmailProviderType } from './types';
import { createResendTransport } from './resend-transport';
import { createSmtpTransport } from './smtp-transport';
import { createMailgunTransport } from './mailgun-transport';

let cachedTransport: EmailTransport | null = null;

function getProviderType(): EmailProviderType {
  const p = (process.env.EMAIL_PROVIDER || 'resend').toLowerCase();
  if (p === 'smtp') return 'smtp';
  if (p === 'mailgun') return 'mailgun';
  return 'resend';
}

/**
 * Get the active email transport. Uses EMAIL_PROVIDER (resend | smtp | mailgun).
 * Resend: RESEND_API_KEY. SMTP: SMTP_HOST, SMTP_USER, SMTP_PASS. Mailgun: MAILGUN_API_KEY, MAILGUN_DOMAIN.
 */
export function getEmailTransport(): EmailTransport {
  if (cachedTransport) return cachedTransport;
  const provider = getProviderType();
  if (provider === 'smtp') {
    cachedTransport = createSmtpTransport();
  } else if (provider === 'mailgun') {
    cachedTransport = createMailgunTransport();
  } else {
    cachedTransport = createResendTransport();
  }
  return cachedTransport;
}

export type { EmailTransport, SendMailOptions, SendMailResult } from './types';
