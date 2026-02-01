/**
 * CertificationSettings Model
 * Purpose: Stores global defaults for certification templates and pricing.
 */
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICertificationSettings extends Document {
  key: 'global';
  backgroundUrl?: string;
  priceMoney?: { amount: number; currency: string };
  pricePoints?: number;
  templateId?: string;
  /** A/B: list of template IDs for certificate variant assignment (global fallback). */
  templateVariantIds?: string[];
  templateVariantWeights?: number[];
  credentialTitleId?: string;
  completionPhraseId?: string;
  deliverableBulletIds?: string[];
}

const CertificationSettingsSchema = new Schema<ICertificationSettings>(
  {
    key: { type: String, required: true, unique: true, default: 'global', index: true },
    backgroundUrl: { type: String, trim: true },
    priceMoney: {
      amount: { type: Number },
      currency: { type: String, uppercase: true, trim: true },
    },
    pricePoints: { type: Number },
    templateId: { type: String, trim: true },
    templateVariantIds: { type: [String], default: undefined },
    templateVariantWeights: { type: [Number], default: undefined },
    credentialTitleId: { type: String, trim: true },
    completionPhraseId: { type: String, trim: true },
    deliverableBulletIds: { type: [String], default: [] },
  },
  { timestamps: true }
);

CertificationSettingsSchema.index({ key: 1 }, { unique: true, name: 'cert_settings_key_unique' });

const CertificationSettings: Model<ICertificationSettings> =
  mongoose.models.CertificationSettings ||
  mongoose.model<ICertificationSettings>('CertificationSettings', CertificationSettingsSchema);

export default CertificationSettings;
