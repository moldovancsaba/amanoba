/**
 * Notification Model (#28)
 *
 * What: A simple in-app notification for a player (e.g. someone replied to your post).
 * Why: Gives learners a reason to return; first consumer is discussion replies.
 */

import mongoose, { Schema, Document, Model } from 'mongoose';

export type NotificationType = 'discussion_reply' | 'system';

export interface INotification extends Document {
  recipient: mongoose.Types.ObjectId;
  type: NotificationType;
  title: string;
  body?: string;
  link?: string; // in-app path to open when clicked
  refId?: string; // id of the related entity (e.g. discussion post)
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    recipient: { type: Schema.Types.ObjectId, ref: 'Player', required: true, index: true },
    type: { type: String, enum: ['discussion_reply', 'system'], required: true },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    body: { type: String, trim: true, maxlength: 1000 },
    link: { type: String, trim: true, maxlength: 500 },
    refId: { type: String, trim: true },
    isRead: { type: Boolean, default: false, index: true },
  },
  { timestamps: true, strict: true, collection: 'notifications' }
);

// List a recipient's newest notifications, unread first.
NotificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

const Notification: Model<INotification> =
  mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);

export default Notification;
