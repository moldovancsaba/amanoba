import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Translation Glossary Entry
 * 
 * Stores standardized translations for AI/ML technical terms across all 17 languages.
 * Used to ensure terminology consistency across course translations.
 */

export interface IGlossaryEntry extends Document {
  term_en: string;
  category: 'technical' | 'business' | 'general';
  context?: string;
  translations: {
    hu?: string;  // Hungarian
    en?: string;  // English
    es?: string;  // Spanish
    zh?: string;  // Chinese (Simplified)
    hi?: string;  // Hindi
    ar?: string;  // Arabic
    pt?: string;  // Portuguese
    vi?: string;  // Vietnamese
    tr?: string;  // Turkish
    bg?: string;  // Bulgarian
    pl?: string;  // Polish
    ru?: string;  // Russian
    sw?: string;  // Swahili
    fr?: string;  // French
    bn?: string;  // Bengali
    ur?: string;  // Urdu
    id?: string;  // Indonesian
  };
  approved_by?: string;
  last_updated: Date;
}

const GlossaryEntrySchema = new Schema<IGlossaryEntry>({
  term_en: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  category: {
    type: String,
    enum: ['technical', 'business', 'general'],
    required: true,
    default: 'technical'
  },
  context: {
    type: String
  },
  translations: {
    hu: String,
    en: String,
    es: String,
    zh: String,
    hi: String,
    ar: String,
    pt: String,
    vi: String,
    tr: String,
    bg: String,
    pl: String,
    ru: String,
    sw: String,
    fr: String,
    bn: String,
    ur: String,
    id: String
  },
  approved_by: {
    type: String
  },
  last_updated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for fast glossary lookups
GlossaryEntrySchema.index({ term_en: 1 });
GlossaryEntrySchema.index({ category: 1 });

const GlossaryEntry: Model<IGlossaryEntry> = 
  mongoose.models.GlossaryEntry || 
  mongoose.model<IGlossaryEntry>('GlossaryEntry', GlossaryEntrySchema);

export default GlossaryEntry;
