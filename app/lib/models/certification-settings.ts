/**
 * CertificationSettings Model
 * 
 * Purpose: Stores global defaults for the certification system.
 * Why: Allows admin-level configuration of exam thresholds, gating, and messaging.
 */
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICertificationSettings extends Document {
  questionCount: number;
  passPercentExclusive: number;
  randomizeSelection: boolean;
  randomizeQuestionOrder: boolean;
  randomizeAnswerOrder: boolean;
  oneSittingOnly: boolean;
  discardOnLeave: boolean;
  showWrongQuestionsOnFail: boolean;
  showCorrectAnswersOnFail: boolean;
  certificateScorePolicy: 'MOST_RECENT_ATTEMPT' | 'HIGHEST_ATTEMPT';
  revokeAtOrBelowPercent: number;
  shareImageSize: string;
  verificationPrivacyMode: 'USER_CHOICE' | 'FORCE_PUBLIC' | 'FORCE_PRIVATE';
  paywallEnabled: boolean;
  paywallCopy: {
    title: string;
    helper: string;
    legalNote?: string;
  };
  premiumIncludesCertification: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CertificationSettingsSchema = new Schema<ICertificationSettings>(
  {
    questionCount: { type: Number, default: 50 },
    passPercentExclusive: { type: Number, default: 50 },
    randomizeSelection: { type: Boolean, default: true },
    randomizeQuestionOrder: { type: Boolean, default: true },
    randomizeAnswerOrder: { type: Boolean, default: true },
    oneSittingOnly: { type: Boolean, default: true },
    discardOnLeave: { type: Boolean, default: true },
    showWrongQuestionsOnFail: { type: Boolean, default: true },
    showCorrectAnswersOnFail: { type: Boolean, default: false },
    certificateScorePolicy: { type: String, default: 'MOST_RECENT_ATTEMPT' },
    revokeAtOrBelowPercent: { type: Number, default: 50 },
    shareImageSize: { type: String, default: '1200x627' },
    verificationPrivacyMode: {
      type: String,
      enum: ['USER_CHOICE', 'FORCE_PUBLIC', 'FORCE_PRIVATE'],
      default: 'USER_CHOICE',
    },
    paywallEnabled: { type: Boolean, default: true },
    paywallCopy: {
      title: { type: String, default: 'Unlock your certificate' },
      helper: { type: String, default: 'Purchase certification access to start the final exam.' },
      legalNote: { type: String, default: '' },
    },
    premiumIncludesCertification: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    collection: 'certification_settings',
  }
);

const CertificationSettings: Model<ICertificationSettings> =
  mongoose.models.CertificationSettings ||
  mongoose.model<ICertificationSettings>('CertificationSettings', CertificationSettingsSchema);

export default CertificationSettings;
