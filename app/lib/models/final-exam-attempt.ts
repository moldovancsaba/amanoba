/**
 * FinalExamAttempt Model
 * Purpose: Stores a single certification final exam attempt for a player/course.
 */
import mongoose, { Schema, Document, Model } from 'mongoose';

export type FinalExamStatus = 'IN_PROGRESS' | 'SUBMITTED' | 'GRADED' | 'DISCARDED' | 'PENDING_GRADE';

export interface IFinalExamAttempt extends Document {
  playerId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  poolCourseId: mongoose.Types.ObjectId; // Resolved pool course (_id)
  questionIds: string[]; // 50 question IDs
  questionOrder: string[]; // ordered list of question IDs
  /** For 3-option display: questionId -> index (0–2) of correct option in displayed order. Used for grading. */
  correctIndexInDisplayByQuestion?: Record<string, number>;
  answerOrderByQuestion?: Record<string, number[]>; // legacy: questionId -> shuffled indices (4 options)
  answers: Record<string, unknown>[]; // client payloads per question
  correctCount: number;
  scorePercentRaw?: number;
  scorePercentInteger?: number;
  status: FinalExamStatus;
  passed?: boolean;
  startedAtISO: string;
  submittedAtISO?: string;
  discardedAtISO?: string;
  discardReason?: string;
}

const FinalExamAttemptSchema = new Schema<IFinalExamAttempt>(
  {
    playerId: { type: Schema.Types.ObjectId, ref: 'Player', required: true, index: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    poolCourseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    questionIds: { type: [String], required: true },
    questionOrder: { type: [String], required: true },
    correctIndexInDisplayByQuestion: { type: Schema.Types.Mixed },
    answerOrderByQuestion: { type: Schema.Types.Mixed },
    answers: { type: Schema.Types.Mixed, default: [] },
    correctCount: { type: Number, default: 0 },
    scorePercentRaw: { type: Number },
    scorePercentInteger: { type: Number },
    status: {
      type: String,
      enum: ['IN_PROGRESS', 'SUBMITTED', 'GRADED', 'DISCARDED', 'PENDING_GRADE'],
      default: 'IN_PROGRESS',
      index: true,
    },
    passed: { type: Boolean },
    startedAtISO: { type: String, required: true },
    submittedAtISO: { type: String },
    discardedAtISO: { type: String },
    discardReason: { type: String },
  },
  { timestamps: true }
);

FinalExamAttemptSchema.index({ playerId: 1, courseId: 1, status: 1 }, { name: 'attempt_player_course_status' });

const FinalExamAttempt: Model<IFinalExamAttempt> =
  mongoose.models.FinalExamAttempt ||
  mongoose.model<IFinalExamAttempt>('FinalExamAttempt', FinalExamAttemptSchema);

export default FinalExamAttempt;
