/**
 * Gmail API email transport
 *
 * What: Sends email through the Gmail API using an OAuth refresh token
 * Why: Supports Gmail/Google Workspace delivery without SMTP or Nodemailer
 */

import type { EmailTransport, SendMailOptions, SendMailResult } from './types';

type GoogleTokenResponse = {
  access_token?: string;
  error?: string;
  error_description?: string;
};

type GmailSendResponse = {
  id?: string;
  message?: string;
  error?: {
    message?: string;
  };
};

const GMAIL_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GMAIL_SEND_URL = 'https://gmail.googleapis.com/gmail/v1/users/me/messages/send';

function isConfigured(): boolean {
  return Boolean(
    process.env.GMAIL_CLIENT_ID &&
    process.env.GMAIL_CLIENT_SECRET &&
    process.env.GMAIL_REFRESH_TOKEN
  );
}

function encodeHeader(value: string): string {
  return /[^\x00-\x7F]/.test(value)
    ? `=?UTF-8?B?${Buffer.from(value, 'utf8').toString('base64')}?=`
    : value;
}

function normalizeAddress(value: string): string {
  return value.replace(/[\r\n]+/g, ' ').trim();
}

function encodeBase64Url(value: string): string {
  return Buffer.from(value, 'utf8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function createRawMessage(options: SendMailOptions): string {
  const headers = [
    `From: ${normalizeAddress(options.from)}`,
    `To: ${normalizeAddress(options.to)}`,
    `Subject: ${encodeHeader(options.subject)}`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
  ];

  if (options.replyTo) {
    headers.push(`Reply-To: ${normalizeAddress(options.replyTo)}`);
  }

  return `${headers.join('\r\n')}\r\n\r\n${options.html}`;
}

async function getAccessToken(): Promise<{ accessToken?: string; error?: string }> {
  const response = await fetch(GMAIL_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GMAIL_CLIENT_ID || '',
      client_secret: process.env.GMAIL_CLIENT_SECRET || '',
      refresh_token: process.env.GMAIL_REFRESH_TOKEN || '',
      grant_type: 'refresh_token',
    }),
  });

  const payload = (await response.json()) as GoogleTokenResponse;
  if (!response.ok || !payload.access_token) {
    return {
      error: payload.error_description || payload.error || `Gmail token request failed with ${response.status}`,
    };
  }

  return { accessToken: payload.access_token };
}

export function createGmailTransport(): EmailTransport {
  return {
    isConfigured,
    async send(options: SendMailOptions): Promise<SendMailResult> {
      if (!isConfigured()) {
        return {
          success: false,
          error: 'Gmail not configured: set GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, and GMAIL_REFRESH_TOKEN',
        };
      }

      const token = await getAccessToken();
      if (!token.accessToken) {
        return { success: false, error: token.error || 'Gmail access token request failed' };
      }

      try {
        const response = await fetch(GMAIL_SEND_URL, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            raw: encodeBase64Url(createRawMessage(options)),
          }),
        });

        const payload = (await response.json()) as GmailSendResponse;
        if (!response.ok) {
          return {
            success: false,
            error: payload.error?.message || payload.message || `Gmail send failed with ${response.status}`,
          };
        }

        return { success: true, messageId: payload.id };
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return { success: false, error: message };
      }
    },
  };
}
