/**
 * Certificate Model
 * Why: Stores issued course certificates (immutable snapshot) for verification and sharing.
 */
import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ICertificate extends Document {
  certificateId: string; // UUID
  certificateNumber?: string;
  playerId: string;
  recipientName: string;
  courseId: string;
  courseTitle: string;
  locale: 'en' | 'hu';

  designTemplateId: string;
  credentialId: string;
  completionPhraseId: string;
  deliverableBulletIds: string[];

  issuedAtISO: string;
  awardedPhraseId: string;

  verificationSlug: string;
  pdfAssetPath?: string;
  imageAssetPath?: string;

  finalExamScorePercentInteger?: number;
  lastAttemptId?: string;
  isPublic?: boolean;
  isRevoked?: boolean;
  revokedAtISO?: string;
  revokedReason?: string;
}

const CertificateSchema = new Schema<ICertificate>(
  {
    certificateId: { type: String, required: true, index: true, unique: true },
    certificateNumber: { type: String },
    playerId: { type: String, required: true, index: true },
    recipientName: { type: String, required: true },
    courseId: { type: String, required: true, index: true },
    courseTitle: { type: String, required: true },
    locale: { type: String, enum: ['en', 'hu'], default: 'en' },

    designTemplateId: { type: String, required: true },
    credentialId: { type: String, required: true },
    completionPhraseId: { type: String, required: true },
    deliverableBulletIds: { type: [String], default: [] },

    issuedAtISO: { type: String, required: true },
    awardedPhraseId: { type: String, default: 'awarded_verified_mastery' },

    verificationSlug: { type: String, required: true, unique: true, index: true },
    pdfAssetPath: { type: String },
    imageAssetPath: { type: String },

    finalExamScorePercentInteger: { type: Number },
    lastAttemptId: { type: String },
    isPublic: { type: Boolean, default: true },
    isRevoked: { type: Boolean, default: false },
    revokedAtISO: { type: String },
    revokedReason: { type: String },
  },
  {
    timestamps: true,
  }
);

CertificateSchema.index({ playerId: 1, courseId: 1, verificationSlug: 1 });

const Certificate: Model<ICertificate> =
  mongoose.models.Certificate ||
  mongoose.model<ICertificate>('Certificate', CertificateSchema);

export default Certificate;
