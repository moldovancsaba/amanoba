/**
 * LiveSession Model (#4, #22)
 *
 * What: A scheduled live/webinar session attached to a course.
 * Why: Courses can offer live sessions (Q&A, workshops) alongside async lessons.
 *
 * MVP scope: provider is a plain join URL ("manual"). Zoom/Meet auto-provisioning
 * (server OAuth) is deferred — a facilitator pastes the meeting link.
 */

import mongoose, { Schema, Document, Model } from 'mongoose';

export type LiveSessionProvider = 'manual' | 'zoom' | 'meet' | 'other';
export type LiveSessionStatus = 'scheduled' | 'live' | 'ended' | 'cancelled';

export interface ILiveSession extends Document {
  courseId: mongoose.Types.ObjectId;
  brandId?: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  provider: LiveSessionProvider;
  joinUrl: string;
  scheduledStartAt: Date;
  scheduledEndAt?: Date;
  timezone?: string;
  status: LiveSessionStatus;
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const LiveSessionSchema = new Schema<ILiveSession>(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course ID is required'],
      index: true,
    },
    brandId: {
      type: Schema.Types.ObjectId,
      ref: 'Brand',
      index: true,
    },
    title: { type: String, required: [true, 'Title is required'], trim: true, maxlength: 200 },
    description: { type: String, trim: true, maxlength: 2000 },
    provider: {
      type: String,
      enum: ['manual', 'zoom', 'meet', 'other'],
      default: 'manual',
    },
    joinUrl: { type: String, required: [true, 'Join URL is required'], trim: true },
    scheduledStartAt: { type: Date, required: [true, 'Start time is required'], index: true },
    scheduledEndAt: { type: Date },
    timezone: { type: String, trim: true },
    status: {
      type: String,
      enum: ['scheduled', 'live', 'ended', 'cancelled'],
      default: 'scheduled',
      index: true,
    },
    createdBy: { type: Schema.Types.ObjectId, ref: 'Player' },
  },
  { timestamps: true, strict: true, collection: 'live_sessions' }
);

// Fetch a course's upcoming sessions ordered by start time.
LiveSessionSchema.index({ courseId: 1, status: 1, scheduledStartAt: 1 });

const LiveSession: Model<ILiveSession> =
  mongoose.models.LiveSession || mongoose.model<ILiveSession>('LiveSession', LiveSessionSchema);

export default LiveSession;
