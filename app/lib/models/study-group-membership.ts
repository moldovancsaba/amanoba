/**
 * StudyGroupMembership Model
 *
 * What: Links players to study groups (membership).
 * Why: Enables join/leave and list members per TASKLIST Community Phase 2.
 */

import mongoose, { Schema, Document, Model } from 'mongoose';

export type StudyGroupRole = 'member' | 'leader';

export interface IStudyGroupMembership extends Document {
  groupId: mongoose.Types.ObjectId;
  playerId: mongoose.Types.ObjectId;
  role: StudyGroupRole;
  joinedAt: Date;
}

const StudyGroupMembershipSchema = new Schema<IStudyGroupMembership>(
  {
    groupId: {
      type: Schema.Types.ObjectId,
      ref: 'StudyGroup',
      required: true,
      index: true,
    },
    playerId: {
      type: Schema.Types.ObjectId,
      ref: 'Player',
      required: true,
      index: true,
    },
    role: {
      type: String,
      enum: { values: ['member', 'leader'], message: 'role must be member or leader' },
      default: 'member',
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { strict: true, collection: 'studygroupmemberships' }
);

StudyGroupMembershipSchema.index({ groupId: 1, playerId: 1 }, { unique: true });
StudyGroupMembershipSchema.index({ playerId: 1, groupId: 1 });

const StudyGroupMembership: Model<IStudyGroupMembership> =
  mongoose.models.StudyGroupMembership ||
  mongoose.model<IStudyGroupMembership>('StudyGroupMembership', StudyGroupMembershipSchema);

export default StudyGroupMembership;
