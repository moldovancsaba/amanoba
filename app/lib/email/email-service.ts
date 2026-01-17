/**
 * Email Service
 * 
 * What: Handles sending emails for course lessons and notifications
 * Why: Centralized email delivery using Resend API for daily lesson emails
 */

import { Resend } from 'resend';
import { logger } from '../logger';
import { connectDB } from '../mongodb';
import { Player, Course, Lesson } from '@/app/lib/models';
import type { ILesson } from '@/app/lib/models/lesson';
import type { Locale } from '@/i18n';

// Initialize Resend client
// Why: Resend is modern, developer-friendly email service
const resend = new Resend(process.env.RESEND_API_KEY);

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

/**
 * Send Lesson Email
 * 
 * What: Sends daily lesson email to student
 * Why: Primary method of lesson delivery for 30-day courses
 * 
 * @param playerId - Student's player ID
 * @param courseId - Course ID
 * @param lesson - Lesson document to send
 * @param locale - Language code for email content (defaults to player's locale)
 * @returns Email send result
 */
export async function sendLessonEmail(
  playerId: string,
  courseId: string,
  lesson: ILesson,
  locale?: Locale
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
    const emailLocale = locale || (player.locale as Locale) || lesson.language || 'hu';

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

    // Personalize email subject and body
    const subject = emailSubject
      .replace('{{playerName}}', player.displayName)
      .replace('{{courseName}}', courseName)
      .replace('{{dayNumber}}', lesson.dayNumber.toString());

    const body = emailBody
      .replace('{{playerName}}', player.displayName)
      .replace('{{courseName}}', courseName)
      .replace('{{dayNumber}}', lesson.dayNumber.toString())
      .replace('{{lessonTitle}}', lessonTitle)
      .replace('{{lessonContent}}', lessonContent);

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

    const subject = `Welcome to ${course.name}!`;
    const body = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h1>Welcome to ${course.name}!</h1>
          <p>Hi ${player.displayName},</p>
          <p>You've successfully enrolled in <strong>${course.name}</strong>. Get ready for an amazing 30-day learning journey!</p>
          <p>Starting tomorrow, you'll receive daily lessons via email. Each lesson takes about 10-15 minutes to complete.</p>
          <p><strong>What to expect:</strong></p>
          <ul>
            <li>📧 Daily lesson emails at 8 AM (your timezone)</li>
            <li>📚 30 structured lessons</li>
            <li>🎮 Interactive assessments</li>
            <li>🏆 Points and XP rewards</li>
            <li>📊 Progress tracking</li>
          </ul>
          <p>You can also access all lessons in your <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://amanoba.com'}/my-courses">course dashboard</a>.</p>
          <p>Happy learning!</p>
          <p>— The Amanoba Team</p>
        </body>
      </html>
    `;

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

    const subject = `🎉 Congratulations! You've completed ${course.name}!`;
    const body = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h1>🎉 Congratulations, ${player.displayName}!</h1>
          <p>You've successfully completed <strong>${course.name}</strong>!</p>
          <p>You've completed all 30 days of learning. That's an incredible achievement!</p>
          <p><strong>What's next?</strong></p>
          <ul>
            <li>📚 Explore more courses in your <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://amanoba.com'}/courses">course library</a></li>
            <li>🏆 Check out your achievements and progress</li>
            <li>💬 Share your success with friends</li>
          </ul>
          <p>Thank you for being part of the Amanoba learning community!</p>
          <p>— The Amanoba Team</p>
        </body>
      </html>
    `;

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

    const subject = `📚 Don't miss Day ${dayNumber} of ${course.name}`;
    const body = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h1>Hi ${player.displayName}!</h1>
          <p>You haven't completed Day ${dayNumber} of <strong>${course.name}</strong> yet.</p>
          <p>Keep your learning streak going! Complete today's lesson to earn points and XP.</p>
          <p><a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://amanoba.com'}/courses/${courseId}/day/${dayNumber}" style="background-color: #6366f1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Complete Day ${dayNumber}</a></p>
          <p>Happy learning!</p>
          <p>— The Amanoba Team</p>
        </body>
      </html>
    `;

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
