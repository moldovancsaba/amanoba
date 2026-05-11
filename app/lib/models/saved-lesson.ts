/**
 * SavedLesson Model
 *
 * What: Stores learner-saved lesson days for intentional revisit and resume
 * Why: Powers a continuity-focused saved library without inventing a generic bookmark dump
 */

import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ISavedLesson extends Document {
  playerId: mongoose.Types.ObjectId;
  brandId?: mongoose.Types.ObjectId;
  courseId: string;
  lessonDay: number;
  lessonId?: string;
  savedAt: Date;
  metadata: {
    createdAt: Date;
    updatedAt: Date;
  };
}

const SavedLessonSchema = new Schema<ISavedLesson>(
  {
    playerId: {
      type: Schema.Types.ObjectId,
      ref: 'Player',
      required: [true, 'Player ID is required'],
      index: true,
    },
    brandId: {
      type: Schema.Types.ObjectId,
      ref: 'Brand',
      index: true,
    },
    courseId: {
      type: String,
      required: [true, 'Course ID is required'],
      trim: true,
      uppercase: true,
      index: true,
    },
    lessonDay: {
      type: Number,
      required: [true, 'Lesson day is required'],
      min: [1, 'Lesson day must be at least 1'],
    },
    lessonId: {
      type: String,
      trim: true,
      default: undefined,
    },
    savedAt: {
      type: Date,
      required: [true, 'Saved at is required'],
      default: () => new Date(),
      index: true,
    },
    metadata: {
      createdAt: {
        type: Date,
        default: () => new Date(),
      },
      updatedAt: {
        type: Date,
        default: () => new Date(),
      },
    },
  },
  {
    timestamps: false,
    strict: true,
    collection: 'saved_lessons',
  }
);

SavedLessonSchema.index(
  { playerId: 1, courseId: 1, lessonDay: 1 },
  { unique: true, name: 'saved_lesson_player_course_day_unique' }
);

SavedLessonSchema.pre('save', function (next) {
  if (!this.isNew) {
    this.metadata.updatedAt = new Date();
  }
  next();
});

const SavedLesson: Model<ISavedLesson> =
  mongoose.models.SavedLesson ||
  mongoose.model<ISavedLesson>('SavedLesson', SavedLessonSchema);

export default SavedLesson;
