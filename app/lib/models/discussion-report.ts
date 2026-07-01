/**
 * DiscussionReport Model (#30)
 *
 * What: A learner-submitted report/flag against a discussion post.
 * Why: Feeds the admin moderation queue (report -> review -> hide/delete).
 */

import mongoose, { Schema, Document, Model } from 'mongoose';

export type DiscussionReportStatus = 'open' | 'reviewed' | 'dismissed';

export interface IDiscussionReport extends Document {
  postId: mongoose.Types.ObjectId;
  courseId: string;
  reporter: mongoose.Types.ObjectId;
  reason: string;
  status: DiscussionReportStatus;
  createdAt: Date;
  updatedAt: Date;
}

const DiscussionReportSchema = new Schema<IDiscussionReport>(
  {
    postId: { type: Schema.Types.ObjectId, ref: 'DiscussionPost', required: true, index: true },
    courseId: { type: String, required: true, trim: true, index: true },
    reporter: { type: Schema.Types.ObjectId, ref: 'Player', required: true },
    reason: { type: String, trim: true, maxlength: 500, default: '' },
    status: { type: String, enum: ['open', 'reviewed', 'dismissed'], default: 'open', index: true },
  },
  { timestamps: true, strict: true, collection: 'discussion_reports' }
);

// One report per reporter per post (re-reporting updates the same row).
DiscussionReportSchema.index({ postId: 1, reporter: 1 }, { unique: true });
// Admin queue: newest open reports first.
DiscussionReportSchema.index({ status: 1, createdAt: -1 });

const DiscussionReport: Model<IDiscussionReport> =
  mongoose.models.DiscussionReport ||
  mongoose.model<IDiscussionReport>('DiscussionReport', DiscussionReportSchema);

export default DiscussionReport;
