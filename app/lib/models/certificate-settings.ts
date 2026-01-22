/**
 * CertificateSettings Model
 *
 * What: Global certificate configuration for issuance
 * Why: Admins need a single source of truth for certificate defaults
 */

import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICertificateSettings extends Document {
  settingsId: string;
  isActive: boolean;
  autoIssueOnCompletion: boolean;
  locale: 'hu' | 'en' | 'ru';
  designTemplateId: string;
  credentialId: string;
  completionPhraseId: string;
  awardedPhraseId: string;
  deliverableBulletIds: string[];
  price?: {
    amount: number;
    currency: string;
  };
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CertificateSettingsSchema = new Schema<ICertificateSettings>(
  {
    settingsId: {
      type: String,
      required: true,
      unique: true,
      default: 'global',
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    autoIssueOnCompletion: {
      type: Boolean,
      default: false,
    },
    locale: {
      type: String,
      enum: ['hu', 'en', 'ru'],
      default: 'en',
      lowercase: true,
      trim: true,
    },
    designTemplateId: {
      type: String,
      required: true,
      trim: true,
    },
    credentialId: {
      type: String,
      required: true,
      trim: true,
    },
    completionPhraseId: {
      type: String,
      required: true,
      trim: true,
    },
    awardedPhraseId: {
      type: String,
      required: true,
      trim: true,
    },
    deliverableBulletIds: {
      type: [String],
      default: [],
    },
    price: {
      amount: {
        type: Number,
        min: 0,
      },
      currency: {
        type: String,
        uppercase: true,
        trim: true,
      },
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'Player',
    },
  },
  {
    timestamps: true,
    strict: true,
    collection: 'certificate_settings',
  }
);

CertificateSettingsSchema.index({ settingsId: 1 }, { unique: true, name: 'certificate_settings_unique' });

const CertificateSettings: Model<ICertificateSettings> =
  mongoose.models.CertificateSettings ||
  mongoose.model<ICertificateSettings>('CertificateSettings', CertificateSettingsSchema);

export default CertificateSettings;
