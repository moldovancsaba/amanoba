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
import type { Locale } from '@/app/lib/i18n/locales';
import { generateSecureToken } from '../security';

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

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://www.amanoba.com';

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

    // Append unsubscribe footer if not already in body
    if (!body.includes('unsubscribe') && !body.includes('{{unsubscribeUrl}}')) {
      const unsubscribeFooter = `
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
        <p style="font-size: 12px; color: #666; text-align: center;">
          You're receiving this email because you're enrolled in ${courseName}. 
          <a href="${unsubscribeUrl}" style="color: #666;">Unsubscribe from lesson emails</a>
        </p>
      `;
      body = body + unsubscribeFooter;
    } else {
      // Replace placeholder if present
      body = body.replace('{{unsubscribeUrl}}', unsubscribeUrl);
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
    const emailLocale = locale || (player.locale as Locale) || 'hu';

    // Format amount based on currency
    const formattedAmount = new Intl.NumberFormat(
      emailLocale === 'hu' ? 'hu-HU' : 'en-US',
      {
        style: 'currency',
        currency: currency.toUpperCase(),
      }
    ).format(amount / 100);

    // Format premium expiration date
    const formattedExpiryDate = new Intl.DateTimeFormat(
      emailLocale === 'hu' ? 'hu-HU' : 'en-US',
      {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }
    ).format(premiumExpiresAt);

    // Get course name
    let courseName = course?.name || 'Premium Access';
    if (course && emailLocale !== course.language && course.translations?.has(emailLocale)) {
      const translation = course.translations.get(emailLocale);
      if (translation) {
        courseName = translation.name;
      }
    }

    // Email content based on locale
    const isHungarian = emailLocale === 'hu';
    
    const subject = isHungarian
      ? `✅ Fizetés megerősítve - ${courseName}`
      : `✅ Payment Confirmed - ${courseName}`;

    const body = isHungarian
      ? `
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #FAB908; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: #000; margin: 0;">✅ Fizetés sikeres!</h1>
            </div>
            <div style="background-color: #fff; padding: 30px; border: 2px solid #FAB908; border-top: none; border-radius: 0 0 8px 8px;">
              <p>Kedves ${player.displayName},</p>
              <p>Köszönjük a fizetésed! A prémium hozzáférésed aktiválva lett.</p>
              
              <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h2 style="margin-top: 0; color: #000;">Fizetési részletek</h2>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #666;"><strong>Termék:</strong></td>
                    <td style="padding: 8px 0; text-align: right; color: #000;">${courseName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666;"><strong>Összeg:</strong></td>
                    <td style="padding: 8px 0; text-align: right; color: #000; font-weight: bold;">${formattedAmount}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666;"><strong>Prémium lejárat:</strong></td>
                    <td style="padding: 8px 0; text-align: right; color: #000;">${formattedExpiryDate}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666;"><strong>Tranzakció ID:</strong></td>
                    <td style="padding: 8px 0; text-align: right; color: #666; font-size: 12px;">${transactionId}</td>
                  </tr>
                </table>
              </div>

              ${courseId ? `
                <p style="margin-top: 30px;">
                  <a href="${APP_URL}/courses/${courseId}" style="background-color: #FAB908; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Kurzus megtekintése</a>
                </p>
              ` : `
                <p style="margin-top: 30px;">
                  <a href="${APP_URL}/courses" style="background-color: #FAB908; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Kurzusok böngészése</a>
                </p>
              `}

              <p style="margin-top: 30px; font-size: 14px; color: #666;">
                Ha bármilyen kérdésed van, vedd fel velünk a kapcsolatot: 
                <a href="mailto:${EMAIL_CONFIG.replyTo}" style="color: #FAB908;">${EMAIL_CONFIG.replyTo}</a>
              </p>

              <p style="margin-top: 20px;">Köszönjük, hogy az Amanobával tanulsz!</p>
              <p>— Az Amanoba csapat</p>
            </div>
          </body>
        </html>
      `
      : `
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #FAB908; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: #000; margin: 0;">✅ Payment Successful!</h1>
            </div>
            <div style="background-color: #fff; padding: 30px; border: 2px solid #FAB908; border-top: none; border-radius: 0 0 8px 8px;">
              <p>Hi ${player.displayName},</p>
              <p>Thank you for your payment! Your premium access has been activated.</p>
              
              <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h2 style="margin-top: 0; color: #000;">Payment Details</h2>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #666;"><strong>Product:</strong></td>
                    <td style="padding: 8px 0; text-align: right; color: #000;">${courseName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666;"><strong>Amount:</strong></td>
                    <td style="padding: 8px 0; text-align: right; color: #000; font-weight: bold;">${formattedAmount}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666;"><strong>Premium expires:</strong></td>
                    <td style="padding: 8px 0; text-align: right; color: #000;">${formattedExpiryDate}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666;"><strong>Transaction ID:</strong></td>
                    <td style="padding: 8px 0; text-align: right; color: #666; font-size: 12px;">${transactionId}</td>
                  </tr>
                </table>
              </div>

              ${courseId ? `
                <p style="margin-top: 30px;">
                  <a href="${APP_URL}/courses/${courseId}" style="background-color: #FAB908; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">View Course</a>
                </p>
              ` : `
                <p style="margin-top: 30px;">
                  <a href="${APP_URL}/courses" style="background-color: #FAB908; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Browse Courses</a>
                </p>
              `}

              <p style="margin-top: 30px; font-size: 14px; color: #666;">
                If you have any questions, please contact us at: 
                <a href="mailto:${EMAIL_CONFIG.replyTo}" style="color: #FAB908;">${EMAIL_CONFIG.replyTo}</a>
              </p>

              <p style="margin-top: 20px;">Thank you for learning with Amanoba!</p>
              <p>— The Amanoba Team</p>
            </div>
          </body>
        </html>
      `;

    // Get or generate unsubscribe token
    const unsubscribeToken = await getOrGenerateUnsubscribeToken(player);
    const unsubscribeUrl = `${APP_URL}/api/email/unsubscribe?token=${unsubscribeToken}`;

    // Append unsubscribe footer
    const unsubscribeFooter = `
      <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
      <p style="font-size: 12px; color: #666; text-align: center;">
        ${isHungarian 
          ? `Ezt az emailt azért kaptad, mert fizetést végeztél az Amanobán. <a href="${unsubscribeUrl}" style="color: #666;">Leiratkozás az email értesítésekről</a>`
          : `You're receiving this email because you made a payment on Amanoba. <a href="${unsubscribeUrl}" style="color: #666;">Unsubscribe from email notifications</a>`
        }
      </p>
    `;

    const finalBody = body + unsubscribeFooter;

    // Check if Resend is initialized
    if (!resend) {
      logger.error({ playerId, courseId }, 'Resend API key not configured');
      return { success: false, error: 'Email service not configured' };
    }

    const { data, error } = await resend.emails.send({
      from: `${EMAIL_CONFIG.fromName} <${EMAIL_CONFIG.from}>`,
      to: player.email,
      subject,
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
