/**
 * Email transport factory — choose provider via EMAIL_PROVIDER
 *
 * What: Returns the configured email transport (Resend, Gmail API, or Mailgun)
 * Why: Single place to add provider-specific email clients without SMTP dependencies
 */

import type { EmailTransport, EmailProviderType } from './types';
import { createGmailTransport } from './gmail-transport';
import { createResendTransport } from './resend-transport';
import { createMailgunTransport } from './mailgun-transport';

let cachedTransport: EmailTransport | null = null;

function getProviderType(): EmailProviderType {
  const p = (process.env.EMAIL_PROVIDER || 'resend').toLowerCase();
  if (p === 'gmail') return 'gmail';
  if (p === 'mailgun') return 'mailgun';
  return 'resend';
}

/**
 * Get the active email transport. Uses EMAIL_PROVIDER (resend | gmail | mailgun).
 * Resend: RESEND_API_KEY. Gmail: GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN. Mailgun: MAILGUN_API_KEY, MAILGUN_DOMAIN.
 */
export function getEmailTransport(): EmailTransport {
  if (cachedTransport) return cachedTransport;
  const provider = getProviderType();
  if (provider === 'gmail') {
    cachedTransport = createGmailTransport();
  } else if (provider === 'mailgun') {
    cachedTransport = createMailgunTransport();
  } else {
    cachedTransport = createResendTransport();
  }
  return cachedTransport;
}

export type { EmailTransport, SendMailOptions, SendMailResult } from './types';
