/**
 * Email transport factory — choose provider via EMAIL_PROVIDER
 *
 * What: Returns the configured email transport (Resend or Mailgun)
 * Why: Single place to add provider-specific email clients without SMTP dependencies
 */

import type { EmailTransport, EmailProviderType } from './types';
import { createResendTransport } from './resend-transport';
import { createMailgunTransport } from './mailgun-transport';

let cachedTransport: EmailTransport | null = null;

function getProviderType(): EmailProviderType {
  const p = (process.env.EMAIL_PROVIDER || 'resend').toLowerCase();
  if (p === 'mailgun') return 'mailgun';
  return 'resend';
}

/**
 * Get the active email transport. Uses EMAIL_PROVIDER (resend | mailgun).
 * Resend: RESEND_API_KEY. Mailgun: MAILGUN_API_KEY, MAILGUN_DOMAIN.
 */
export function getEmailTransport(): EmailTransport {
  if (cachedTransport) return cachedTransport;
  const provider = getProviderType();
  if (provider === 'mailgun') {
    cachedTransport = createMailgunTransport();
  } else {
    cachedTransport = createResendTransport();
  }
  return cachedTransport;
}

export type { EmailTransport, SendMailOptions, SendMailResult } from './types';
