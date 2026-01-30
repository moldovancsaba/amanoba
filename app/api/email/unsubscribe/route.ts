/**
 * Email Unsubscribe API
 * 
 * What: Handles one-click email unsubscribe
 * Why: Allows students to opt out of lesson emails
 */

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Player } from '@/lib/models';
import { logger } from '@/lib/logger';
import { locales, type Locale } from '@/app/lib/i18n/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SUPPORTED_LOCALES = new Set<string>(locales);
const DEFAULT_LOCALE: Locale = 'en';

/** Resolve locale from Accept-Language header (first match in supported list). */
function localeFromAcceptLanguage(header: string | null): Locale {
  if (!header) return DEFAULT_LOCALE;
  const parts = header.split(',').map((p) => p.split(';')[0].trim().toLowerCase().slice(0, 2));
  for (const part of parts) {
    if (SUPPORTED_LOCALES.has(part)) return part as Locale;
  }
  return DEFAULT_LOCALE;
}

type UnsubscribeMessages = {
  errorTitle: string;
  errorHeading: string;
  errorInvalid: string;
  errorContactSupport: string;
  successTitle: string;
  successHeading: string;
  successMessage: string;
  successReenable: string;
};

async function getUnsubscribeMessages(locale: string): Promise<UnsubscribeMessages> {
  const fallback: UnsubscribeMessages = {
    errorTitle: 'Invalid Unsubscribe Link',
    errorHeading: 'Invalid Unsubscribe Link',
    errorInvalid: 'The unsubscribe link is invalid or has expired.',
    errorContactSupport: 'Please contact support if you need to unsubscribe from emails.',
    successTitle: 'Unsubscribed',
    successHeading: '✓ Successfully Unsubscribed',
    successMessage: 'You have been unsubscribed from lesson emails.',
    successReenable: 'You can re-enable emails in your account settings.',
  };
  const effectiveLocale = SUPPORTED_LOCALES.has(locale) ? locale : DEFAULT_LOCALE;
  try {
    const data = (await import(`@/messages/${effectiveLocale}.json`)).default as {
      email?: { unsubscribe?: UnsubscribeMessages };
    };
    const u = data?.email?.unsubscribe;
    if (u && typeof u === 'object') {
      return {
        errorTitle: String(u.errorTitle ?? fallback.errorTitle),
        errorHeading: String(u.errorHeading ?? fallback.errorHeading),
        errorInvalid: String(u.errorInvalid ?? fallback.errorInvalid),
        errorContactSupport: String(u.errorContactSupport ?? fallback.errorContactSupport),
        successTitle: String(u.successTitle ?? fallback.successTitle),
        successHeading: String(u.successHeading ?? fallback.successHeading),
        successMessage: String(u.successMessage ?? fallback.successMessage),
        successReenable: String(u.successReenable ?? fallback.successReenable),
      };
    }
  } catch {
    // ignore; use fallback
  }
  return fallback;
}

function htmlErrorPage(m: UnsubscribeMessages, lang: string): string {
  return `<!DOCTYPE html>
<html lang="${escapeHtml(lang)}">
<head>
  <title>${escapeHtml(m.errorTitle)}</title>
  <style>
    body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #000; color: #fff; }
    .container { text-align: center; padding: 2rem; background: #2D2D2D; border-radius: 8px; border: 2px solid #FAB908; }
    h1 { color: #FAB908; } .error { color: #ff4444; }
  </style>
</head>
<body>
  <div class="container">
    <h1 class="error">${escapeHtml(m.errorHeading)}</h1>
    <p>${escapeHtml(m.errorInvalid)}</p>
    <p>${escapeHtml(m.errorContactSupport)}</p>
  </div>
</body>
</html>`;
}

function htmlSuccessPage(m: UnsubscribeMessages, lang: string): string {
  return `<!DOCTYPE html>
<html lang="${escapeHtml(lang)}">
<head>
  <title>${escapeHtml(m.successTitle)}</title>
  <style>
    body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #000; color: #fff; }
    .container { text-align: center; padding: 2rem; background: #2D2D2D; border-radius: 8px; border: 2px solid #FAB908; }
    h1 { color: #FAB908; }
  </style>
</head>
<body>
  <div class="container">
    <h1>${escapeHtml(m.successHeading)}</h1>
    <p>${escapeHtml(m.successMessage)}</p>
    <p>${escapeHtml(m.successReenable)}</p>
  </div>
</body>
</html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * POST /api/email/unsubscribe
 * 
 * What: Unsubscribe player from lesson emails
 * Why: Respects user preferences and CAN-SPAM compliance
 * 
 * Request Body:
 * - playerId: Player ID (optional, can use token)
 * - token: Unsubscribe token (optional, for email links)
 * - email: Email address (optional, for email-based unsubscribe)
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { playerId, token, email } = body;

    // Find player by ID, token, or email
    let player = null;

    if (playerId) {
      player = await Player.findById(playerId);
    } else if (token) {
      // Token-based lookup (for email links)
      player = await Player.findOne({ unsubscribeToken: token });
      if (!player) {
        return NextResponse.json(
          { error: 'Invalid unsubscribe token' },
          { status: 400 }
        );
      }
    } else if (email) {
      player = await Player.findOne({ email: email.toLowerCase() });
    }

    if (!player) {
      return NextResponse.json(
        { error: 'Player not found' },
        { status: 404 }
      );
    }

    // Update email preferences
    if (!player.emailPreferences) {
      player.emailPreferences = {
        receiveLessonEmails: false,
        emailFrequency: 'never',
      };
    } else {
      player.emailPreferences.receiveLessonEmails = false;
      player.emailPreferences.emailFrequency = 'never';
    }

    await player.save();

    logger.info({ playerId: player._id }, 'Player unsubscribed from lesson emails');

    return NextResponse.json({
      success: true,
      message: 'Successfully unsubscribed from lesson emails',
    });
  } catch (error) {
    logger.error({ error }, 'Failed to unsubscribe player');

    return NextResponse.json(
      { error: 'Failed to unsubscribe' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/email/unsubscribe
 * 
 * What: Unsubscribe via URL (for email links)
 * Why: One-click unsubscribe from email
 * 
 * Query Params:
 * - token: Unsubscribe token
 * - email: Email address
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    if (!token && !email) {
      return NextResponse.json(
        { error: 'Token or email required' },
        { status: 400 }
      );
    }

    // Find player
    let player = null;

    if (token) {
      // Token-based lookup (for email links)
      player = await Player.findOne({ unsubscribeToken: token });
      if (!player) {
        const locale = localeFromAcceptLanguage(request.headers.get('accept-language'));
        const m = await getUnsubscribeMessages(locale);
        return new NextResponse(htmlErrorPage(m, locale), {
          headers: { 'Content-Type': 'text/html' },
          status: 400,
        });
      }
    } else if (email) {
      player = await Player.findOne({ email: email.toLowerCase() });
    }

    if (!player) {
      return NextResponse.json(
        { error: 'Player not found' },
        { status: 404 }
      );
    }

    // Update email preferences
    if (!player.emailPreferences) {
      player.emailPreferences = {
        receiveLessonEmails: false,
        emailFrequency: 'never',
      };
    } else {
      player.emailPreferences.receiveLessonEmails = false;
      player.emailPreferences.emailFrequency = 'never';
    }

    await player.save();

    logger.info({ playerId: player._id }, 'Player unsubscribed from lesson emails via link');

    const locale = (player.locale && SUPPORTED_LOCALES.has(player.locale))
      ? (player.locale as Locale)
      : DEFAULT_LOCALE;
    const m = await getUnsubscribeMessages(locale);
    return new NextResponse(htmlSuccessPage(m, locale), {
      headers: { 'Content-Type': 'text/html' },
    });
  } catch (error) {
    logger.error({ error }, 'Failed to unsubscribe player via link');

    return NextResponse.json(
      { error: 'Failed to unsubscribe' },
      { status: 500 }
    );
  }
}
