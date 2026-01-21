/**
 * CertificateEntitlement Model
 * Purpose: Gates access to the final certification exam per course and player.
 */
import mongoose, { Schema, Document, Model } from 'mongoose';

export type EntitlementSource = 'PAID' | 'POINTS' | 'INCLUDED_IN_PREMIUM';

export interface ICertificateEntitlement extends Document {
  playerId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  source: EntitlementSource;
  money?: {
    amount: number;
    currency: string;
    paymentReference?: string;
  };
  pointsSpent?: number;
  entitledAtISO: string;
  metadata?: Record<string, unknown>;
}

const CertificateEntitlementSchema = new Schema<ICertificateEntitlement>(
  {
    playerId: { type: Schema.Types.ObjectId, ref: 'Player', required: true, index: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    source: {
      type: String,
      enum: ['PAID', 'POINTS', 'INCLUDED_IN_PREMIUM'],
      required: true,
    },
    money: {
      amount: { type: Number },
      currency: { type: String, uppercase: true, trim: true },
      paymentReference: { type: String, trim: true },
    },
    pointsSpent: { type: Number },
    entitledAtISO: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

CertificateEntitlementSchema.index(
  { playerId: 1, courseId: 1 },
  { unique: true, name: 'entitlement_player_course_unique' }
);

const CertificateEntitlement: Model<ICertificateEntitlement> =
  mongoose.models.CertificateEntitlement ||
  mongoose.model<ICertificateEntitlement>('CertificateEntitlement', CertificateEntitlementSchema);

export default CertificateEntitlement;
