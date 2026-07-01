/**
 * Email Activity Model
 *
 * What: Tracks sent transactional emails and open/click events for analytics
 * Why: Enables email analytics (open rate, click rate) and segment-specific reporting
 *
 * Used by: email-service (save after send), /api/email/open/[messageId], /api/email/click/[messageId], /api/admin/email-analytics
 */

import mongoose, { Schema, Document, Model } from 'mongoose';

export type EmailType = 'completion' | 'lesson' | 'reminder' | 'welcome' | 'payment';
export type EmailSegment = 'beginner' | 'intermediate' | 'advanced';

export interface IEmailActivity extends Document {
  messageId: string;
  playerId: mongoose.Types.ObjectId;
  brandId: mongoose.Types.ObjectId;
  emailType: EmailType;
  segment?: EmailSegment;
  experimentId?: string; // A/B experiment key, e.g. 'welcome_subject_v1'
  variant?: 'A' | 'B'; // Which variant was sent (for A/B analytics)
  courseId?: string;
  lessonDay?: number;
  sentAt: Date;
  openedAt?: Date;
  clickedAt?: Date;
  clickCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const EmailActivitySchema = new Schema<IEmailActivity>(
  {
    messageId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    playerId: {
      type: Schema.Types.ObjectId,
      ref: 'Player',
      required: true,
      index: true,
    },
    brandId: {
      type: Schema.Types.ObjectId,
      ref: 'Brand',
      required: true,
      index: true,
    },
    emailType: {
      type: String,
      enum: ['completion', 'lesson', 'reminder', 'welcome', 'payment'],
      required: true,
      index: true,
    },
    segment: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: undefined,
      index: true,
    },
    experimentId: { type: String, default: undefined, index: true },
    variant: { type: String, enum: ['A', 'B'], default: undefined },
    courseId: { type: String },
    lessonDay: { type: Number },
    sentAt: {
      type: Date,
      default: () => new Date(),
      required: true,
      index: true,
    },
    openedAt: { type: Date },
    clickedAt: { type: Date },
    clickCount: { type: Number, default: 0 },
  },
  { timestamps: true, strict: true }
);

EmailActivitySchema.index({ brandId: 1, sentAt: -1 });
EmailActivitySchema.index({ emailType: 1, sentAt: -1 });
EmailActivitySchema.index({ segment: 1, sentAt: -1 });
EmailActivitySchema.index({ experimentId: 1, variant: 1, sentAt: -1 });

const EmailActivity: Model<IEmailActivity> =
  mongoose.models.EmailActivity ||
  mongoose.model<IEmailActivity>('EmailActivity', EmailActivitySchema);

export default EmailActivity;
