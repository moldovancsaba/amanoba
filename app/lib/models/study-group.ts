/**
 * StudyGroup Model
 *
 * What: Represents a study group for a course.
 * Why: Enables learners to join/create study groups per course per TASKLIST Community Phase 2.
 */

import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IStudyGroup extends Document {
  courseId: string;
  name: string;
  createdBy: mongoose.Types.ObjectId;
  capacity?: number;
  createdAt: Date;
  updatedAt: Date;
}

const StudyGroupSchema = new Schema<IStudyGroup>(
  {
    courseId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'Player',
      required: true,
      index: true,
    },
    capacity: {
      type: Number,
      min: 2,
      default: null,
    },
  },
  { timestamps: true, strict: true, collection: 'studygroups' }
);

StudyGroupSchema.index({ courseId: 1, createdAt: -1 });

const StudyGroup: Model<IStudyGroup> =
  mongoose.models.StudyGroup || mongoose.model<IStudyGroup>('StudyGroup', StudyGroupSchema);

export default StudyGroup;
