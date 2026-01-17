/**
 * Translation Model
 * 
 * What: Stores all UI translations in MongoDB
 * Why: Allows dynamic translation management without code deployments
 */

import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Translation Document Interface
 */
export interface ITranslation extends Document {
  key: string; // Translation key (e.g., "common.appName")
  locale: string; // Language code (e.g., "hu", "en")
  value: string; // Translated text
  namespace?: string; // Optional namespace (e.g., "common", "admin")
  metadata?: {
    description?: string;
    lastUpdated?: Date;
    updatedBy?: string;
    [key: string]: unknown;
  };
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Translation Schema
 */
const TranslationSchema = new Schema<ITranslation>(
  {
    key: {
      type: String,
      required: [true, 'Translation key is required'],
      trim: true,
      index: true,
    },
    locale: {
      type: String,
      required: [true, 'Locale is required'],
      trim: true,
      lowercase: true,
      index: true,
    },
    value: {
      type: String,
      required: [true, 'Translation value is required'],
      trim: true,
    },
    namespace: {
      type: String,
      trim: true,
      index: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    strict: true,
    collection: 'translations',
  }
);

// Compound index for efficient lookups
TranslationSchema.index({ locale: 1, key: 1 }, { unique: true });
TranslationSchema.index({ locale: 1, namespace: 1 });

/**
 * Translation Model
 */
const Translation: Model<ITranslation> =
  mongoose.models.Translation || mongoose.model<ITranslation>('Translation', TranslationSchema);

export default Translation;
