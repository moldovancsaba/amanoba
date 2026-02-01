/**
 * DiscussionPost Model
 *
 * What: Stores forum posts for course/lesson discussions.
 * Why: Enables community discussion per course (and optionally per lesson) per TASKLIST Community Phase 1.
 */

import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDiscussionPost extends Document {
  courseId: string;
  lessonId?: string;
  author: mongoose.Types.ObjectId;
  parentPostId?: mongoose.Types.ObjectId;
  body: string;
  hiddenByAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DiscussionPostSchema = new Schema<IDiscussionPost>(
  {
    courseId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    lessonId: {
      type: String,
      trim: true,
      index: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'Player',
      required: true,
      index: true,
    },
    parentPostId: {
      type: Schema.Types.ObjectId,
      ref: 'DiscussionPost',
      default: null,
      index: true,
    },
    body: {
      type: String,
      required: true,
      trim: true,
      maxlength: 10000,
    },
    hiddenByAdmin: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true, strict: true, collection: 'discussionposts' }
);

DiscussionPostSchema.index({ courseId: 1, lessonId: 1, createdAt: -1 });
DiscussionPostSchema.index({ parentPostId: 1, createdAt: 1 });

const DiscussionPost: Model<IDiscussionPost> =
  mongoose.models.DiscussionPost || mongoose.model<IDiscussionPost>('DiscussionPost', DiscussionPostSchema);

export default DiscussionPost;
