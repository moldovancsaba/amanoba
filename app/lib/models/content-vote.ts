/**
 * ContentVote Model
 *
 * What: Stores up/down votes for courses, lessons, and questions.
 * Why: Enables course/content voting per ROADMAP (CourseVote, LessonVote, QuestionVote).
 */

import mongoose, { Schema, Document, Model } from 'mongoose';

export type VoteTargetType = 'course' | 'lesson' | 'question';

export interface IContentVote extends Document {
  targetType: VoteTargetType;
  targetId: string;
  playerId: mongoose.Types.ObjectId;
  value: 1 | -1;
  createdAt: Date;
  updatedAt: Date;
}

const ContentVoteSchema = new Schema<IContentVote>(
  {
    targetType: {
      type: String,
      enum: { values: ['course', 'lesson', 'question'], message: 'targetType must be course, lesson, or question' },
      required: true,
      index: true,
    },
    targetId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    playerId: {
      type: Schema.Types.ObjectId,
      ref: 'Player',
      required: true,
      index: true,
    },
    value: {
      type: Number,
      enum: { values: [1, -1], message: 'value must be 1 or -1' },
      required: true,
    },
  },
  { timestamps: true, strict: true, collection: 'contentvotes' }
);

ContentVoteSchema.index({ targetType: 1, targetId: 1, playerId: 1 }, { unique: true });
ContentVoteSchema.index({ targetType: 1, targetId: 1 });

const ContentVote: Model<IContentVote> =
  mongoose.models.ContentVote || mongoose.model<IContentVote>('ContentVote', ContentVoteSchema);

export default ContentVote;
