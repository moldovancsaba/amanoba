/**
 * CCS (Canonical Course Spec) / Course Family Model
 *
 * What: Parent of all language variants and grandparent of short courses.
 * Why: Stores Course Idea, 30-Day Outline, and related documents (Course Prompt, Audited & Fixed) per §10.
 */

import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IRelatedDocument {
  type: 'course_prompt' | 'audited_fixed' | string;
  url?: string;
  content?: string;
  title?: string;
}

export interface ILanguageVariantRef {
  language: string; // ISO 639-1 code (lowercase)
  courseId: string; // Reference to Course.courseId
  translationStatus: 'draft' | 'review' | 'published';
  translatedAt?: Date;
  translatedBy?: string; // Agent or user identifier
  qualityScore?: number; // 0-100 from audit
  notes?: string; // Optional translator notes
}

export interface ICCS extends Document {
  ccsId: string; // unique slug, e.g. PRODUCTIVITY_2026
  name?: string; // display name
  idea?: string; // markdown, at creation
  outline?: string; // 30-Day Advanced Outline, markdown
  relatedDocuments?: IRelatedDocument[];
  
  // Language variant tracking
  originalLanguage: string; // ISO 639-1 code, default 'en'
  originalCourseId: string; // Reference to the original course
  availableLanguages: string[]; // Array of available language codes
  languageVariants: ILanguageVariantRef[]; // Array of translation metadata
  
  createdAt: Date;
  updatedAt: Date;
  
  // Helper methods
  addLanguageVariant(courseId: string, language: string, translatedBy?: string): Promise<void>;
  updateVariantStatus(language: string, status: 'draft' | 'review' | 'published', qualityScore?: number): Promise<void>;
  removeLanguageVariant(language: string): Promise<void>;
  getVariantByLanguage(language: string): ILanguageVariantRef | undefined;
  hasLanguage(language: string): boolean;
}

const RelatedDocumentSchema = new Schema<IRelatedDocument>(
  {
    type: { type: String, required: true, trim: true },
    url: { type: String, trim: true },
    content: { type: String, trim: true },
    title: { type: String, trim: true },
  },
  { _id: true }
);

const LanguageVariantRefSchema = new Schema<ILanguageVariantRef>(
  {
    language: {
      type: String,
      required: [true, 'Language code is required'],
      lowercase: true,
      trim: true,
      match: [/^[a-z]{2}$/, 'Language code must be a 2-letter ISO 639-1 code'],
    },
    courseId: {
      type: String,
      required: [true, 'Course ID is required'],
      trim: true,
    },
    translationStatus: {
      type: String,
      enum: ['draft', 'review', 'published'],
      default: 'draft',
    },
    translatedAt: { type: Date },
    translatedBy: { type: String, trim: true },
    qualityScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    notes: { type: String, trim: true },
  },
  { _id: false }
);

const CCSSchema = new Schema<ICCS>(
  {
    ccsId: {
      type: String,
      required: [true, 'CCS ID is required'],
      unique: true,
      uppercase: true,
      trim: true,
      match: [/^[A-Z0-9_]+$/, 'CCS ID must contain only uppercase letters, numbers, and underscores'],
    },
    name: { type: String, trim: true, maxlength: 200 },
    idea: { type: String, trim: true },
    outline: { type: String, trim: true },
    relatedDocuments: {
      type: [RelatedDocumentSchema],
      default: [],
    },
    originalLanguage: {
      type: String,
      required: [true, 'Original language is required'],
      lowercase: true,
      trim: true,
      default: 'en',
      match: [/^[a-z]{2}$/, 'Original language must be a 2-letter ISO 639-1 code'],
    },
    originalCourseId: {
      type: String,
      required: [true, 'Original course ID is required'],
      trim: true,
    },
    availableLanguages: {
      type: [String],
      default: function(this: any) {
        return [this.originalLanguage || 'en'];
      },
    },
    languageVariants: {
      type: [LanguageVariantRefSchema],
      default: [],
      validate: {
        validator: function(variants: ILanguageVariantRef[]) {
          const languages = variants.map(v => v.language);
          return languages.length === new Set(languages).size;
        },
        message: 'Each language can only appear once in languageVariants',
      },
    },
  },
  {
    timestamps: true,
    strict: true,
    collection: 'ccs',
  }
);

// Indexes
CCSSchema.index({ ccsId: 1 }, { name: 'ccs_id_unique', unique: true });
CCSSchema.index({ originalCourseId: 1 }, { name: 'ccs_original_course' });
CCSSchema.index({ 'languageVariants.courseId': 1 }, { name: 'ccs_variant_course' });
CCSSchema.index({ 'languageVariants.language': 1 }, { name: 'ccs_variant_language' });
CCSSchema.index({ availableLanguages: 1 }, { name: 'ccs_available_languages' });

// Helper Methods
CCSSchema.methods.addLanguageVariant = async function(
  courseId: string,
  language: string,
  translatedBy?: string
): Promise<void> {
  // Validate language not already present
  if (this.languageVariants.some((v: ILanguageVariantRef) => v.language === language)) {
    throw new Error(`Language variant '${language}' already exists for CCS ${this.ccsId}`);
  }
  
  // Add variant
  this.languageVariants.push({
    language,
    courseId,
    translationStatus: 'draft',
    translatedAt: new Date(),
    translatedBy,
  });
  
  // Update available languages if not already present
  if (!this.availableLanguages.includes(language)) {
    this.availableLanguages.push(language);
  }
  
  await this.save();
};

CCSSchema.methods.updateVariantStatus = async function(
  language: string,
  status: 'draft' | 'review' | 'published',
  qualityScore?: number
): Promise<void> {
  const variant = this.languageVariants.find((v: ILanguageVariantRef) => v.language === language);
  
  if (!variant) {
    throw new Error(`Language variant '${language}' not found for CCS ${this.ccsId}`);
  }
  
  variant.translationStatus = status;
  if (qualityScore !== undefined) {
    variant.qualityScore = qualityScore;
  }
  
  await this.save();
};

CCSSchema.methods.removeLanguageVariant = async function(language: string): Promise<void> {
  const index = this.languageVariants.findIndex((v: ILanguageVariantRef) => v.language === language);
  
  if (index === -1) {
    throw new Error(`Language variant '${language}' not found for CCS ${this.ccsId}`);
  }
  
  this.languageVariants.splice(index, 1);
  
  // Update available languages
  this.availableLanguages = [
    this.originalLanguage,
    ...this.languageVariants.map((v: ILanguageVariantRef) => v.language),
  ];
  
  await this.save();
};

CCSSchema.methods.getVariantByLanguage = function(language: string): ILanguageVariantRef | undefined {
  return this.languageVariants.find((v: ILanguageVariantRef) => v.language === language);
};

CCSSchema.methods.hasLanguage = function(language: string): boolean {
  return this.availableLanguages.includes(language);
};

const CCS: Model<ICCS> =
  mongoose.models.CCS || mongoose.model<ICCS>('CCS', CCSSchema);

export default CCS;
