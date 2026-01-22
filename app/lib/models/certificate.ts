/**
 * Certificate Model
 *
 * What: Stores issued course certificates (immutable snapshot)
 * Why: Enables verification, sharing, and record-keeping
 */

import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICertificate extends Document {
  certificateId: string;
  certificateNumber?: string;
  playerId: mongoose.Types.ObjectId;
  recipientName: string;
  courseId: string;
  courseRef?: mongoose.Types.ObjectId;
  courseTitle: string;
  locale: 'hu' | 'en' | 'ru';
  designTemplateId: string;
  designTemplateLabel: string;
  credentialId: string;
  credentialTitle: string;
  completionPhraseId: string;
  completionPhrase: string;
  awardedPhraseId: string;
  awardedPhrase: string;
  deliverableBulletIds: string[];
  deliverableBullets: string[];
  issuedAt: Date;
  issuedAtISO: string;
  verificationSlug: string;
  imageUrl?: string;
  imageDeleteUrl?: string;
  finalExamScorePercentInteger?: number;
  isRevoked: boolean;
  revokedAt?: Date;
  revokedReason?: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CertificateSchema = new Schema<ICertificate>(
  {
    certificateId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    certificateNumber: {
      type: String,
      trim: true,
    },
    playerId: {
      type: Schema.Types.ObjectId,
      ref: 'Player',
      required: true,
      index: true,
    },
    recipientName: {
      type: String,
      required: true,
      trim: true,
    },
    courseId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    courseRef: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      index: true,
    },
    courseTitle: {
      type: String,
      required: true,
      trim: true,
    },
    locale: {
      type: String,
      enum: ['hu', 'en', 'ru'],
      required: true,
      lowercase: true,
      trim: true,
    },
    designTemplateId: {
      type: String,
      required: true,
      trim: true,
    },
    designTemplateLabel: {
      type: String,
      required: true,
      trim: true,
    },
    credentialId: {
      type: String,
      required: true,
      trim: true,
    },
    credentialTitle: {
      type: String,
      required: true,
      trim: true,
    },
    completionPhraseId: {
      type: String,
      required: true,
      trim: true,
    },
    completionPhrase: {
      type: String,
      required: true,
      trim: true,
    },
    awardedPhraseId: {
      type: String,
      required: true,
      trim: true,
    },
    awardedPhrase: {
      type: String,
      required: true,
      trim: true,
    },
    deliverableBulletIds: {
      type: [String],
      default: [],
    },
    deliverableBullets: {
      type: [String],
      default: [],
    },
    issuedAt: {
      type: Date,
      required: true,
      index: true,
    },
    issuedAtISO: {
      type: String,
      required: true,
      trim: true,
    },
    verificationSlug: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    imageDeleteUrl: {
      type: String,
      trim: true,
    },
    finalExamScorePercentInteger: {
      type: Number,
      min: 0,
      max: 100,
    },
    isRevoked: {
      type: Boolean,
      default: false,
      index: true,
    },
    revokedAt: {
      type: Date,
    },
    revokedReason: {
      type: String,
      trim: true,
    },
    isPublic: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    strict: true,
    collection: 'certificates',
  }
);

CertificateSchema.index({ playerId: 1, courseId: 1 }, { unique: true, name: 'certificate_player_course' });

const Certificate: Model<ICertificate> =
  mongoose.models.Certificate || mongoose.model<ICertificate>('Certificate', CertificateSchema);

export default Certificate;
