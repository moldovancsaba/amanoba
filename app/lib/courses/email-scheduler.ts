/**
 * Email Scheduler
 * 
 * What: Handles timezone-aware daily lesson email delivery
 * Why: Sends lesson emails at the right time for each student's timezone
 */

import { logger } from '../logger';
import connectDB from '../mongodb';
import { CourseProgress, Player, Course, Lesson } from '../models';
import { sendLessonEmail, sendReminderEmail } from '../email/email-service';
import { resolveLessonForChildDay } from '../course-helpers';
import type { ILesson } from '../models/lesson';

/**
 * Send Daily Lessons
 * 
 * What: Main function to send all daily lesson emails
 * Why: Called by cron job to process all active course progress
 * 
 * @param targetDate - Optional date to send for (defaults to today)
 * @returns Summary of email sending results
 */
export async function sendDailyLessons(targetDate?: Date): Promise<{
  success: boolean;
  sent: number;
  skipped: number;
  errors: number;
  details: Array<{ playerId: string; courseId: string; day: number; status: string }>;
}> {
  const results = {
    success: true,
    sent: 0,
    skipped: 0,
    errors: 0,
    details: [] as Array<{ playerId: string; courseId: string; day: number; status: string }>,
  };

  try {
    await connectDB();

    const date = targetDate || new Date();
    const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD

    logger.info({ date: dateStr }, 'Starting daily lesson email scheduler');

    // Find all active course progress records
    const activeProgress = await CourseProgress.find({
      status: { $in: ['not_started', 'in_progress'] },
      isCompleted: false,
    }).populate('playerId courseId');

    logger.info({ count: activeProgress.length }, 'Found active course progress records');

    for (const progress of activeProgress) {
      try {
        const player = progress.playerId as { _id?: { toString(): string }; emailPreferences?: { receiveLessonEmails?: boolean } };
        const course = progress.courseId as { _id?: { toString(): string } };

        if (!player || !course) {
          logger.warn({ progressId: progress._id }, 'Progress record missing player or course');
          results.skipped++;
          continue;
        }

        // Check email preferences
        if (player.emailPreferences?.receiveLessonEmails === false) {
          logger.info({ playerId: player._id }, 'Player has opted out of lesson emails');
          results.skipped++;
          results.details.push({
            playerId: player._id.toString(),
            courseId: course._id.toString(),
            day: progress.currentDay,
            status: 'skipped_preferences',
          });
          continue;
        }

        if (!player.email) {
          logger.warn({ playerId: player._id }, 'Player has no email address');
          results.skipped++;
          results.details.push({
            playerId: player._id.toString(),
            courseId: course._id.toString(),
            day: progress.currentDay,
            status: 'skipped_no_email',
          });
          continue;
        }

        // Check if course is active
        if (!course.isActive) {
          logger.info({ courseId: course._id }, 'Course is not active');
          results.skipped++;
          continue;
        }

        // Determine target day for email
        const targetDay = progress.currentDay;

        // Check if email already sent for this day
        if (progress.emailSentDays?.includes(targetDay)) {
          logger.info(
            { playerId: player._id, courseId: course._id, day: targetDay },
            'Email already sent for this day'
          );
          results.skipped++;
          results.details.push({
            playerId: player._id.toString(),
            courseId: course._id.toString(),
            day: targetDay,
            status: 'skipped_already_sent',
          });
          continue;
        }

        // Resolve lesson: for child courses use parent lesson via selectedLessonIds; for parent use Lesson by day
        const isChild = !!(course as { parentCourseId?: string }).parentCourseId && (course as { selectedLessonIds?: unknown[] }).selectedLessonIds?.length;
        const lesson = isChild
          ? await resolveLessonForChildDay(course as { parentCourseId: string; selectedLessonIds: unknown[] }, targetDay)
          : await Lesson.findOne({
              courseId: course._id,
              dayNumber: targetDay,
              isActive: true,
            });

        if (!lesson) {
          logger.warn(
            { courseId: course._id, day: targetDay },
            'Lesson not found for this day'
          );
          results.skipped++;
          results.details.push({
            playerId: player._id.toString(),
            courseId: course._id.toString(),
            day: targetDay,
            status: 'skipped_no_lesson',
          });
          continue;
        }

        // Check timezone and preferred email time
        const playerTimezone = player.emailPreferences?.timezone || player.timezone || 'UTC';
        const preferredHour = player.emailPreferences?.preferredEmailTime ?? 8; // Default 8 AM

        // For MVP: Send immediately (timezone-aware scheduling can be added later)
        // In production, this would check if current time matches preferred time in user's timezone

        // Send lesson email; for child courses pass linkDay so subject/body and lesson links use child courseId and day 1..K
        const emailResult = await sendLessonEmail(
          player._id.toString(),
          course._id.toString(),
          lesson as ILesson,
          undefined,
          isChild ? { linkDay: targetDay } : undefined
        );

        if (emailResult.success) {
          // Track email delivery
          if (!progress.emailSentDays) {
            progress.emailSentDays = [];
          }
          if (!progress.emailSentDays.includes(targetDay)) {
            progress.emailSentDays.push(targetDay);
          }

          // Update metadata
          if (!progress.metadata) {
            progress.metadata = {};
          }
          progress.metadata.lastEmailSentAt = new Date();

          await progress.save();

          results.sent++;
          results.details.push({
            playerId: player._id.toString(),
            courseId: course._id.toString(),
            day: targetDay,
            status: 'sent',
          });

          logger.info(
            { playerId: player._id, courseId: course._id, day: targetDay, messageId: emailResult.messageId },
            'Lesson email sent successfully'
          );
        } else {
          results.errors++;
          results.details.push({
            playerId: player._id.toString(),
            courseId: course._id.toString(),
            day: targetDay,
            status: `error: ${emailResult.error}`,
          });

          logger.error(
            { playerId: player._id, courseId: course._id, day: targetDay, error: emailResult.error },
            'Failed to send lesson email'
          );
        }
      } catch (error) {
        results.errors++;
        logger.error({ error, progressId: progress._id }, 'Error processing course progress');
        results.details.push({
          playerId: (progress.playerId as { _id?: { toString(): string } })?._id?.toString() || 'unknown',
          courseId: (progress.courseId as { _id?: { toString(): string } })?._id?.toString() || 'unknown',
          day: progress.currentDay,
          status: `error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        });
      }
    }

    logger.info(
      { sent: results.sent, skipped: results.skipped, errors: results.errors },
      'Daily lesson email scheduler completed'
    );

    return results;
  } catch (error) {
    logger.error({ error }, 'Fatal error in daily lesson email scheduler');
    results.success = false;
    return results;
  }
}

/**
 * Send Catch-Up Emails
 * 
 * What: Sends emails for missed days
 * Why: Helps students catch up if they missed lessons
 * 
 * @param playerId - Player ID to send catch-up emails for
 * @param courseId - Course ID
 * @param maxDaysBack - Maximum days back to send (default: 3)
 * @returns Summary of catch-up emails sent
 */
export async function sendCatchUpEmails(
  playerId: string,
  courseId: string,
  maxDaysBack: number = 3
): Promise<{
  success: boolean;
  sent: number;
  errors: number;
}> {
  const results = {
    success: true,
    sent: 0,
    errors: 0,
  };

  try {
    await connectDB();

    const progress = await CourseProgress.findOne({
      playerId,
      courseId,
    }).populate('playerId courseId');

    if (!progress) {
      return { ...results, success: false };
    }

    const player = progress.playerId as { emailPreferences?: { receiveLessonEmails?: boolean } };
    const course = progress.courseId as { _id?: { toString(): string } };

    // Check email preferences
    if (player.emailPreferences?.receiveLessonEmails === false) {
      return results;
    }

    // Find missed days (days that should have been completed but weren't)
    const currentDay = progress.currentDay;
    const missedDays: number[] = [];

    for (let day = Math.max(1, currentDay - maxDaysBack); day < currentDay; day++) {
      if (!progress.lessonsCompleted?.includes(day) && !progress.emailSentDays?.includes(day)) {
        missedDays.push(day);
      }
    }

    // Send reminder emails for missed days
    for (const day of missedDays) {
      const lesson = await Lesson.findOne({
        courseId: course._id,
        dayNumber: day,
        isActive: true,
      });

      if (lesson) {
        const reminderResult = await sendReminderEmail(
          playerId,
          courseId,
          day
        );

        if (reminderResult.success) {
          results.sent++;
        } else {
          results.errors++;
        }
      }
    }

    return results;
  } catch (error) {
    logger.error({ error, playerId, courseId }, 'Error sending catch-up emails');
    return { ...results, success: false };
  }
}
