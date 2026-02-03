/**
 * SMTP email transport (industry standard)
 *
 * What: Sends email via SMTP using Nodemailer
 * Why: Works with Gmail, Mailgun SMTP, SendGrid SMTP, and any SMTP server
 */

import nodemailer from 'nodemailer';
import type { EmailTransport, SendMailOptions, SendMailResult } from './types';

function createTransporter(): ReturnType<typeof nodemailer.createTransport> | null {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER ?? process.env.SMTP_USERNAME;
  const pass = process.env.SMTP_PASS ?? process.env.SMTP_PASSWORD;
  if (!host || !user || !pass) return null;
  const secure = process.env.SMTP_SECURE === 'true' || process.env.SMTP_SECURE === '1';
  return nodemailer.createTransport({
    host,
    port: port ? parseInt(port, 10) : secure ? 465 : 587,
    secure,
    auth: { user, pass },
  });
}

const transporter = createTransporter();

export function createSmtpTransport(): EmailTransport {
  return {
    isConfigured(): boolean {
      return !!transporter;
    },
    async send(options: SendMailOptions): Promise<SendMailResult> {
      if (!transporter) {
        return {
          success: false,
          error: 'SMTP not configured: set SMTP_HOST, SMTP_USER, SMTP_PASS (or SMTP_PASSWORD)',
        };
      }
      try {
        const info = await transporter.sendMail({
          from: options.from,
          to: options.to,
          subject: options.subject,
          html: options.html,
          replyTo: options.replyTo,
        });
        return { success: true, messageId: info.messageId };
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return { success: false, error: message };
      }
    },
  };
}
