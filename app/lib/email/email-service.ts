/**
 * Email Service
 * 
 * What: Handles sending emails for course lessons and notifications
 * Why: Centralized email delivery using Resend API for daily lesson emails
 */

import { Resend } from 'resend';
import { logger } from '../logger';
import connectDB from '../mongodb';
import { Player, Course, Lesson } from '@/app/lib/models';
import type { ILesson } from '@/app/lib/models/lesson';
import type { IPlayer } from '@/app/lib/models/player';
import { locales, type Locale } from '@/app/lib/i18n/locales';
import { generateSecureToken } from '../security';
import { APP_URL } from '@/app/lib/constants/app-url';
import {
  renderLessonUnsubscribeFooterHtml,
  renderPaymentUnsubscribeFooterHtml,
  renderWelcomeEmailHtml,
  renderWelcomeEmailSubject,
  renderCompletionEmailHtml,
  renderCompletionEmailSubject,
  renderReminderEmailHtml,
  renderReminderEmailSubject,
  renderPaymentConfirmationEmail,
} from './email-localization';
import { validateLessonTextLanguageIntegrity } from '@/app/lib/quality/language-integrity';

// Initialize Resend client
// Why: Resend is modern, developer-friendly email service
// Note: API key may be missing during build - will fail gracefully at runtime
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

/**
 * Email Configuration
 * 
 * Why: Centralized email settings from environment variables
 */
const EMAIL_CONFIG = {
  from: process.env.EMAIL_FROM || 'noreply@amanoba.com',
  fromName: process.env.EMAIL_FROM_NAME || 'Amanoba Learning',
  replyTo: process.env.EMAIL_REPLY_TO || 'support@amanoba.com',
};

/** Brand CTA and email design tokens (align with design-system.css) */
const EMAIL_TOKENS = {
  ctaBg: '#FAB908',
  ctaText: '#111827',
  bodyText: '#333333',
  muted: '#666666',
  border: '#dddddd',
} as const;

function normalizeLocale(candidate: unknown, fallback: unknown): Locale {
  const cand = String(candidate || '').toLowerCase();
  if (locales.includes(cand as Locale)) return cand as Locale;
  const fb = String(fallback || '').toLowerCase();
  if (locales.includes(fb as Locale)) return fb as Locale;
  return 'en';
}

function scrubForLanguageIntegrity(text: string, exemptStrings?: Array<string | null | undefined>) {
  let s = String(text || '');
  for (const raw of exemptStrings || []) {
    const token = String(raw || '').trim();
    if (!token) continue;
    s = s.split(token).join(' ');
  }
  return s;
}

function ensureEmailLanguageIntegrity(params: {
  locale: Locale;
  subject: string;
  html: string;
  context: string;
  exemptStrings?: Array<string | null | undefined>;
}) {
  const { locale, subject, html, context, exemptStrings } = params;
  const scrubbedSubject = scrubForLanguageIntegrity(subject, exemptStrings);
  const scrubbedHtml = scrubForLanguageIntegrity(html, exemptStrings);

  const subjectCheck = validateLessonTextLanguageIntegrity({
    language: locale,
    text: scrubbedSubject,
    contextLabel: `${context}.subject`,
  });
  if (!subjectCheck.ok) return subjectCheck;

  const bodyCheck = validateLessonTextLanguageIntegrity({
    language: locale,
    text: scrubbedHtml,
    contextLabel: `${context}.html`,
  });
  return bodyCheck;
}

/**
 * Get or generate unsubscribe token for a player
 * 
 * What: Ensures player has an unsubscribe token for email links
 * Why: Token-based unsubscribe is more secure than email-based
 * 
 * @param player - Player document instance
 * @returns Unsubscribe token
 */
async function getOrGenerateUnsubscribeToken(player: IPlayer & { save: () => Promise<IPlayer> }): Promise<string> {
  if (!player.unsubscribeToken) {
    player.unsubscribeToken = generateSecureToken(32);
    await player.save();
    logger.info({ playerId: player._id }, 'Generated unsubscribe token for player');
  }
  return player.unsubscribeToken;
}

/**
 * Send Lesson Email
 * 
 * What: Sends daily lesson email to student
 * Why: Primary method of lesson delivery for 30-day courses
 * 
 * @param playerId - Student's player ID
 * @param courseId - Course ID (Mongo _id of enrolled course)
 * @param lesson - Lesson document to send
 * @param locale - Language code for email content (defaults to player's locale)
 * @param options - When enrolled in a child course, pass { linkDay } so subject/body and lesson links use child's day and courseId
 * @returns Email send result
 */
export async function sendLessonEmail(
  playerId: string,
  courseId: string,
  lesson: ILesson,
  locale?: Locale,
  options?: { linkDay?: number }
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    await connectDB();

    // Fetch player and course for email personalization
    const player = await Player.findById(playerId);
    const course = await Course.findById(courseId);

    if (!player) {
      logger.error({ playerId }, 'Player not found for lesson email');
      return { success: false, error: 'Player not found' };
    }

    if (!course) {
      logger.error({ courseId }, 'Course not found for lesson email');
      return { success: false, error: 'Course not found' };
    }

    // Check email preferences
    if (player.emailPreferences?.receiveLessonEmails === false) {
      logger.info({ playerId }, 'Player has opted out of lesson emails');
      return { success: false, error: 'Email preferences disabled' };
    }

    if (!player.email) {
      logger.warn({ playerId }, 'Player has no email address');
      return { success: false, error: 'No email address' };
    }

    // Determine language for email (use provided locale, player locale, or lesson language)
    const emailLocale = normalizeLocale(locale || player.locale, lesson.language || 'en');

    // Get translated content if available
    let emailSubject = lesson.emailSubject;
    let emailBody = lesson.emailBody;
    let lessonTitle = lesson.title;
    let lessonContent = lesson.content;
    let courseName = course.name;

    // Check for translations
    if (emailLocale !== lesson.language && lesson.translations?.has(emailLocale)) {
      const translation = lesson.translations.get(emailLocale);
      if (translation) {
        emailSubject = translation.emailSubject;
        emailBody = translation.emailBody;
        lessonTitle = translation.title;
        lessonContent = translation.content;
      }
    }

    if (emailLocale !== course.language && course.translations?.has(emailLocale)) {
      const translation = course.translations.get(emailLocale);
      if (translation) {
        courseName = translation.name;
      }
    }

    // Get or generate unsubscribe token
    const unsubscribeToken = await getOrGenerateUnsubscribeToken(player);
    const unsubscribeUrl = `${APP_URL}/api/email/unsubscribe?token=${unsubscribeToken}`;

    // For child courses, use linkDay so subject/body and lesson links use enrolled course day (1..K), not parent lesson day
    const displayDay = options?.linkDay ?? lesson.dayNumber;

    // Personalize email subject and body
    const subject = emailSubject
      .replace('{{playerName}}', player.displayName)
      .replace('{{courseName}}', courseName)
      .replace('{{dayNumber}}', displayDay.toString());

    // Add unsubscribe link to email body if not already present
    let body = emailBody
      .replace('{{playerName}}', player.displayName)
      .replace('{{courseName}}', courseName)
      .replace('{{dayNumber}}', displayDay.toString())
      .replace('{{lessonTitle}}', lessonTitle)
      .replace('{{lessonContent}}', lessonContent);

    // When enrolled in a child course, lesson links in the template may point to parent; rewrite path to child courseId and day
    if (options?.linkDay != null && typeof course.courseId === 'string') {
      body = body.replace(
        /\/courses\/[^/"'\s]+\/day\/\d+/g,
        `/courses/${course.courseId}/day/${displayDay}`
      );
    }

    // Ensure unsubscribe URL is present. Prefer explicit placeholder; otherwise append a localized footer.
    if (body.includes('{{unsubscribeUrl}}')) {
      body = body.replace('{{unsubscribeUrl}}', unsubscribeUrl);
    } else {
      const hasUnsubscribeLink = /\/api\/email\/unsubscribe\?token=/.test(body);
      if (!hasUnsubscribeLink) {
        body =
          body +
          renderLessonUnsubscribeFooterHtml({
            locale: emailLocale,
            unsubscribeUrl,
            courseName,
            tokens: EMAIL_TOKENS,
          });
      }
    }

    // Delivery hard gate: do not send if language integrity fails for the final subject/body.
    const integrity = ensureEmailLanguageIntegrity({ locale: emailLocale, subject, html: body, context: 'sendLessonEmail' });
    if (!integrity.ok) {
      logger.error(
        { playerId, courseId, lessonId: lesson._id, locale: emailLocale, errors: integrity.errors, findings: integrity.findings },
        'Blocked lesson email send due to language integrity failure'
      );
      return { success: false, error: integrity.errors[0] || 'Language integrity failure' };
    }

    // Check if Resend is initialized
    if (!resend) {
      logger.error({ playerId, courseId }, 'Resend API key not configured');
      return { success: false, error: 'Email service not configured' };
    }

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: `${EMAIL_CONFIG.fromName} <${EMAIL_CONFIG.from}>`,
      to: player.email,
      subject,
      html: body,
      replyTo: EMAIL_CONFIG.replyTo,
    });

    if (error) {
      logger.error({ error, playerId, courseId, lessonId: lesson._id }, 'Failed to send lesson email');
      return { success: false, error: error.message };
    }

    logger.info(
      { playerId, courseId, lessonId: lesson._id, messageId: data?.id },
      'Lesson email sent successfully'
    );

    return { success: true, messageId: data?.id };
  } catch (error) {
    logger.error({ error, playerId, courseId }, 'Error sending lesson email');
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Send Welcome Email
 * 
 * What: Sends course enrollment confirmation email
 * Why: Welcome students to course and set expectations
 * 
 * @param playerId - Student's player ID
 * @param courseId - Course ID
 * @returns Email send result
 */
export async function sendWelcomeEmail(
  playerId: string,
  courseId: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    await connectDB();

    const player = await Player.findById(playerId);
    const course = await Course.findById(courseId);

    if (!player || !course) {
      return { success: false, error: 'Player or course not found' };
    }

    if (!player.email) {
      return { success: false, error: 'No email address' };
    }

    const emailLocale = normalizeLocale(player.locale, course.language || 'en');

    let courseName = course.name;
    if (emailLocale !== course.language && course.translations?.has(emailLocale)) {
      const translation = course.translations.get(emailLocale);
      if (translation) courseName = translation.name;
    }

    const subject = renderWelcomeEmailSubject({ locale: emailLocale, courseName });
    const body = renderWelcomeEmailHtml({
      locale: emailLocale,
      playerName: player.displayName,
      courseName,
      durationDays: Number(course.durationDays || 30) || 30,
      appUrl: APP_URL,
      tokens: EMAIL_TOKENS,
    });

    const integrity = ensureEmailLanguageIntegrity({
      locale: emailLocale,
      subject,
      html: body,
      context: 'sendWelcomeEmail',
      exemptStrings: [player.displayName, courseName],
    });
    if (!integrity.ok) {
      logger.error(
        { playerId, courseId, locale: emailLocale, errors: integrity.errors, findings: integrity.findings },
        'Blocked welcome email send due to language integrity failure'
      );
      return { success: false, error: integrity.errors[0] || 'Language integrity failure' };
    }

    // Check if Resend is initialized
    if (!resend) {
      logger.error({ playerId, courseId }, 'Resend API key not configured');
      return { success: false, error: 'Email service not configured' };
    }

    const { data, error } = await resend.emails.send({
      from: `${EMAIL_CONFIG.fromName} <${EMAIL_CONFIG.from}>`,
      to: player.email,
      subject,
      html: body,
      replyTo: EMAIL_CONFIG.replyTo,
    });

    if (error) {
      logger.error({ error, playerId, courseId }, 'Failed to send welcome email');
      return { success: false, error: error.message };
    }

    logger.info({ playerId, courseId, messageId: data?.id }, 'Welcome email sent successfully');
    return { success: true, messageId: data?.id };
  } catch (error) {
    logger.error({ error, playerId, courseId }, 'Error sending welcome email');
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Send Completion Email
 * 
 * What: Sends course completion celebration email
 * Why: Celebrate student achievement and provide next steps
 * 
 * @param playerId - Student's player ID
 * @param courseId - Course ID
 * @returns Email send result
 */
export async function sendCompletionEmail(
  playerId: string,
  courseId: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    await connectDB();

    const player = await Player.findById(playerId);
    const course = await Course.findById(courseId);

    if (!player || !course) {
      return { success: false, error: 'Player or course not found' };
    }

    if (!player.email) {
      return { success: false, error: 'No email address' };
    }

    const emailLocale = normalizeLocale(player.locale, course.language || 'en');

    let courseName = course.name;
    if (emailLocale !== course.language && course.translations?.has(emailLocale)) {
      const translation = course.translations.get(emailLocale);
      if (translation) courseName = translation.name;
    }

    const subject = renderCompletionEmailSubject({ locale: emailLocale, courseName });
    const body = renderCompletionEmailHtml({
      locale: emailLocale,
      playerName: player.displayName,
      courseName,
      durationDays: Number(course.durationDays || 30) || 30,
      appUrl: APP_URL,
      tokens: EMAIL_TOKENS,
    });

    const integrity = ensureEmailLanguageIntegrity({
      locale: emailLocale,
      subject,
      html: body,
      context: 'sendCompletionEmail',
      exemptStrings: [player.displayName, courseName],
    });
    if (!integrity.ok) {
      logger.error(
        { playerId, courseId, locale: emailLocale, errors: integrity.errors, findings: integrity.findings },
        'Blocked completion email send due to language integrity failure'
      );
      return { success: false, error: integrity.errors[0] || 'Language integrity failure' };
    }

    // Check if Resend is initialized
    if (!resend) {
      logger.error({ playerId, courseId }, 'Resend API key not configured');
      return { success: false, error: 'Email service not configured' };
    }

    const { data, error } = await resend.emails.send({
      from: `${EMAIL_CONFIG.fromName} <${EMAIL_CONFIG.from}>`,
      to: player.email,
      subject,
      html: body,
      replyTo: EMAIL_CONFIG.replyTo,
    });

    if (error) {
      logger.error({ error, playerId, courseId }, 'Failed to send completion email');
      return { success: false, error: error.message };
    }

    logger.info({ playerId, courseId, messageId: data?.id }, 'Completion email sent successfully');
    return { success: true, messageId: data?.id };
  } catch (error) {
    logger.error({ error, playerId, courseId }, 'Error sending completion email');
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Send Reminder Email
 * 
 * What: Sends daily lesson reminder email
 * Why: Encourage students to complete missed lessons
 * 
 * @param playerId - Student's player ID
 * @param courseId - Course ID
 * @param dayNumber - Day number to remind about
 * @returns Email send result
 */
export async function sendReminderEmail(
  playerId: string,
  courseId: string,
  dayNumber: number
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    await connectDB();

    const player = await Player.findById(playerId);
    const course = await Course.findById(courseId);

    if (!player || !course) {
      return { success: false, error: 'Player or course not found' };
    }

    if (!player.email) {
      return { success: false, error: 'No email address' };
    }

    const emailLocale = normalizeLocale(player.locale, course.language || 'en');

    let courseName = course.name;
    if (emailLocale !== course.language && course.translations?.has(emailLocale)) {
      const translation = course.translations.get(emailLocale);
      if (translation) courseName = translation.name;
    }

    const courseSlug = typeof course.courseId === 'string' ? course.courseId : null;
    if (!courseSlug) return { success: false, error: 'Course slug missing' };

    const subject = renderReminderEmailSubject({ locale: emailLocale, dayNumber, courseName });
    const body = renderReminderEmailHtml({
      locale: emailLocale,
      playerName: player.displayName,
      courseName,
      dayNumber,
      courseSlug,
      appUrl: APP_URL,
      tokens: EMAIL_TOKENS,
    });

    const integrity = ensureEmailLanguageIntegrity({
      locale: emailLocale,
      subject,
      html: body,
      context: 'sendReminderEmail',
      exemptStrings: [player.displayName, courseName],
    });
    if (!integrity.ok) {
      logger.error(
        { playerId, courseId, dayNumber, locale: emailLocale, errors: integrity.errors, findings: integrity.findings },
        'Blocked reminder email send due to language integrity failure'
      );
      return { success: false, error: integrity.errors[0] || 'Language integrity failure' };
    }

    // Check if Resend is initialized
    if (!resend) {
      logger.error({ playerId, courseId, dayNumber }, 'Resend API key not configured');
      return { success: false, error: 'Email service not configured' };
    }

    const { data, error } = await resend.emails.send({
      from: `${EMAIL_CONFIG.fromName} <${EMAIL_CONFIG.from}>`,
      to: player.email,
      subject,
      html: body,
      replyTo: EMAIL_CONFIG.replyTo,
    });

    if (error) {
      logger.error({ error, playerId, courseId, dayNumber }, 'Failed to send reminder email');
      return { success: false, error: error.message };
    }

    logger.info({ playerId, courseId, dayNumber, messageId: data?.id }, 'Reminder email sent successfully');
    return { success: true, messageId: data?.id };
  } catch (error) {
    logger.error({ error, playerId, courseId, dayNumber }, 'Error sending reminder email');
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Send Payment Confirmation Email
 * 
 * What: Sends payment confirmation email after successful Stripe payment
 * Why: Provide receipt and confirm premium access activation
 * 
 * @param playerId - Player's ID
 * @param courseId - Course ID (optional, may be general premium purchase)
 * @param amount - Payment amount in cents
 * @param currency - Currency code (e.g., 'usd', 'eur', 'huf')
 * @param premiumExpiresAt - Premium expiration date
 * @param transactionId - Payment transaction ID for reference
 * @param locale - Language code for email content (defaults to player's locale)
 * @returns Email send result
 */
export async function sendPaymentConfirmationEmail(
  playerId: string,
  courseId: string | null,
  amount: number,
  currency: string,
  premiumExpiresAt: Date,
  transactionId: string,
  locale?: Locale
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    await connectDB();

    const player = await Player.findById(playerId);
    if (!player) {
      return { success: false, error: 'Player not found' };
    }

    if (!player.email) {
      return { success: false, error: 'No email address' };
    }

    // Get course if provided
    let course = null;
    if (courseId) {
      course = await Course.findOne({ courseId });
    }

    // Determine language for email
    const emailLocale = normalizeLocale(locale || player.locale, 'en');

    // Format amount based on locale/currency
    const formattedAmount = new Intl.NumberFormat(emailLocale, {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);

    // Format premium expiration date based on locale
    const formattedExpiryDate = new Intl.DateTimeFormat(emailLocale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(premiumExpiresAt);

    // Get course name
    let courseName = course?.name || 'Premium Access';
    if (course && emailLocale !== course.language && course.translations?.has(emailLocale)) {
      const translation = course.translations.get(emailLocale);
      if (translation) {
        courseName = translation.name;
      }
    }

    const courseSlug = course?.courseId ? String(course.courseId) : null;
    const rendered = renderPaymentConfirmationEmail({
      locale: emailLocale,
      playerName: player.displayName,
      courseName,
      courseSlug: courseSlug,
      appUrl: APP_URL,
      tokens: {
        border: EMAIL_TOKENS.border,
        muted: EMAIL_TOKENS.muted,
        bodyText: EMAIL_TOKENS.bodyText,
        ctaBg: EMAIL_TOKENS.ctaBg,
        ctaText: EMAIL_TOKENS.ctaText,
      },
      formattedAmount,
      formattedExpiryDate,
      transactionId,
      supportEmail: EMAIL_CONFIG.replyTo,
    });

    // Get or generate unsubscribe token
    const unsubscribeToken = await getOrGenerateUnsubscribeToken(player);
    const unsubscribeUrl = `${APP_URL}/api/email/unsubscribe?token=${unsubscribeToken}`;

    const finalBody =
      rendered.html +
      renderPaymentUnsubscribeFooterHtml({
        locale: emailLocale,
        unsubscribeUrl,
        tokens: EMAIL_TOKENS,
      });

    const integrity = ensureEmailLanguageIntegrity({
      locale: emailLocale,
      subject: rendered.subject,
      html: finalBody,
      context: 'sendPaymentConfirmationEmail',
      exemptStrings: [
        player.displayName,
        courseName,
        formattedAmount,
        formattedExpiryDate,
        transactionId,
        EMAIL_CONFIG.replyTo,
      ],
    });
    if (!integrity.ok) {
      logger.error(
        { playerId, courseId, transactionId, locale: emailLocale, errors: integrity.errors, findings: integrity.findings },
        'Blocked payment confirmation email send due to language integrity failure'
      );
      return { success: false, error: integrity.errors[0] || 'Language integrity failure' };
    }

    // Check if Resend is initialized
    if (!resend) {
      logger.error({ playerId, courseId }, 'Resend API key not configured');
      return { success: false, error: 'Email service not configured' };
    }

    const { data, error } = await resend.emails.send({
      from: `${EMAIL_CONFIG.fromName} <${EMAIL_CONFIG.from}>`,
      to: player.email,
      subject: rendered.subject,
      html: finalBody,
      replyTo: EMAIL_CONFIG.replyTo,
    });

    if (error) {
      logger.error({ error, playerId, courseId, transactionId }, 'Failed to send payment confirmation email');
      return { success: false, error: error.message };
    }

    logger.info({ playerId, courseId, transactionId, messageId: data?.id }, 'Payment confirmation email sent successfully');
    return { success: true, messageId: data?.id };
  } catch (error) {
    logger.error({ error, playerId, courseId }, 'Error sending payment confirmation email');
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
