/**
 * Email transport types — industry-standard send interface
 *
 * What: Common interface for sending email via any provider (Resend, SMTP, Mailgun, etc.)
 * Why: Allows switching providers via env (EMAIL_PROVIDER) without changing call sites
 */

export type SendMailOptions = {
  from: string;
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
};

export type SendMailResult = {
  success: boolean;
  messageId?: string;
  error?: string;
};

export type EmailTransport = {
  send(options: SendMailOptions): Promise<SendMailResult>;
  isConfigured(): boolean;
};

export type EmailProviderType = 'resend' | 'smtp' | 'mailgun';
