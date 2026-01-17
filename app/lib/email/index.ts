/**
 * Email Service Exports
 * 
 * What: Central export point for email service functions
 * Why: Simplifies imports throughout the application
 */

export {
  sendLessonEmail,
  sendWelcomeEmail,
  sendCompletionEmail,
  sendReminderEmail,
} from './email-service';
