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

export interface ICourseVariantInLevel {
  language: string; // ISO 639-1 code (lowercase)
  courseId: string; // Reference to Course.courseId
  translationStatus: 'draft' | 'review' | 'published';
  translatedAt?: Date;
  translatedBy?: string;
  qualityScore?: number;
}

export interface ICourseLevel {
  level: number; // Sequential: 1, 2, 3, 4, ...
  levelType: string; // Descriptive: '1day_beginner', '3day_essentials', '30day_advanced'
  difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  estimatedHours?: number;
  description?: string;
  courseVariants: ICourseVariantInLevel[]; // All language variants at this level
}

export interface ICCS extends Document {
  ccsId: string; // unique slug, e.g. PRODUCTIVITY_2026
  name?: string; // display name
  idea?: string; // markdown, at creation
  outline?: string; // 30-Day Advanced Outline, markdown
  relatedDocuments?: IRelatedDocument[];
  
  // Language variant tracking (legacy, kept for backward compat)
  originalLanguage: string; // ISO 639-1 code, default 'en'
  originalCourseId: string; // Reference to the original course
  availableLanguages: string[]; // Array of available language codes
  languageVariants: ILanguageVariantRef[]; // Array of translation metadata
  
  // Course matrix: level progression tracking
  courseLevels?: ICourseLevel[]; // Ordered array of levels (NEW!)
  totalLevels?: number; // Computed: courseLevels.length
  
  createdAt: Date;
  updatedAt: Date;
  
  // Language helper methods (legacy)
  addLanguageVariant(courseId: string, language: string, translatedBy?: string): Promise<void>;
  updateVariantStatus(language: string, status: 'draft' | 'review' | 'published', qualityScore?: number): Promise<void>;
  removeLanguageVariant(language: string): Promise<void>;
  getVariantByLanguage(language: string): ILanguageVariantRef | undefined;
  hasLanguage(language: string): boolean;
  
  // Level navigation methods (NEW!)
  getLevelByNumber(level: number): ICourseLevel | undefined;
  getLevelByCourseId(courseId: string): { level: ICourseLevel; levelNumber: number } | undefined;
  getNextLevel(currentLevel: number): ICourseLevel | undefined;
  getPreviousLevel(currentLevel: number): ICourseLevel | undefined;
  getCourseAtLevel(level: number, language: string): string | undefined;
  hasLevel(level: number): boolean;
  addCourseToLevel(level: number, courseId: string, language: string, translatedBy?: string): Promise<void>;
  createLevel(level: number, levelType: string, difficulty?: string, estimatedHours?: number): Promise<void>;
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

const CourseVariantInLevelSchema = new Schema<ICourseVariantInLevel>(
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
      default: 'published',
    },
    translatedAt: { type: Date },
    translatedBy: { type: String, trim: true },
    qualityScore: {
      type: Number,
      min: 0,
      max: 100,
    },
  },
  { _id: false }
);

const CourseLevelSchema = new Schema<ICourseLevel>(
  {
    level: {
      type: Number,
      required: [true, 'Level number is required'],
      min: 1,
    },
    levelType: {
      type: String,
      required: [true, 'Level type is required'],
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    },
    estimatedHours: {
      type: Number,
      min: 0,
    },
    description: {
      type: String,
      trim: true,
    },
    courseVariants: {
      type: [CourseVariantInLevelSchema],
      default: [],
      validate: {
        validator: function(variants: ICourseVariantInLevel[]) {
          const languages = variants.map(v => v.language);
          return languages.length === new Set(languages).size;
        },
        message: 'Each language can only appear once per level',
      },
    },
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
    courseLevels: {
      type: [CourseLevelSchema],
      default: undefined,
      validate: {
        validator: function(levels: ICourseLevel[]) {
          if (!levels || levels.length === 0) return true;
          const levelNumbers = levels.map(l => l.level);
          return levelNumbers.length === new Set(levelNumbers).size;
        },
        message: 'Each level number must be unique',
      },
    },
    totalLevels: {
      type: Number,
      default: 0,
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
CCSSchema.index({ 'courseLevels.level': 1 }, { name: 'ccs_course_levels' });
CCSSchema.index({ 'courseLevels.courseVariants.courseId': 1 }, { name: 'ccs_level_course_id' });

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

// Level Navigation Methods

CCSSchema.methods.getLevelByNumber = function(level: number): ICourseLevel | undefined {
  return this.courseLevels?.find((l: ICourseLevel) => l.level === level);
};

CCSSchema.methods.getLevelByCourseId = function(courseId: string): { level: ICourseLevel; levelNumber: number } | undefined {
  if (!this.courseLevels) return undefined;
  
  for (const level of this.courseLevels) {
    const variant = level.courseVariants.find((v: ICourseVariantInLevel) => v.courseId === courseId);
    if (variant) {
      return { level, levelNumber: level.level };
    }
  }
  
  return undefined;
};

CCSSchema.methods.getNextLevel = function(currentLevel: number): ICourseLevel | undefined {
  if (!this.courseLevels) return undefined;
  
  const sortedLevels = this.courseLevels.sort((a: ICourseLevel, b: ICourseLevel) => a.level - b.level);
  const currentIndex = sortedLevels.findIndex((l: ICourseLevel) => l.level === currentLevel);
  
  if (currentIndex === -1 || currentIndex === sortedLevels.length - 1) {
    return undefined;
  }
  
  return sortedLevels[currentIndex + 1];
};

CCSSchema.methods.getPreviousLevel = function(currentLevel: number): ICourseLevel | undefined {
  if (!this.courseLevels) return undefined;
  
  const sortedLevels = this.courseLevels.sort((a: ICourseLevel, b: ICourseLevel) => a.level - b.level);
  const currentIndex = sortedLevels.findIndex((l: ICourseLevel) => l.level === currentLevel);
  
  if (currentIndex <= 0) {
    return undefined;
  }
  
  return sortedLevels[currentIndex - 1];
};

CCSSchema.methods.getCourseAtLevel = function(level: number, language: string): string | undefined {
  const levelData = this.getLevelByNumber(level);
  if (!levelData) return undefined;
  
  const variant = levelData.courseVariants.find((v: ICourseVariantInLevel) => v.language === language);
  return variant?.courseId;
};

CCSSchema.methods.hasLevel = function(level: number): boolean {
  return this.courseLevels?.some((l: ICourseLevel) => l.level === level) || false;
};

CCSSchema.methods.addCourseToLevel = async function(
  level: number,
  courseId: string,
  language: string,
  translatedBy?: string
): Promise<void> {
  if (!this.courseLevels) {
    throw new Error(`CCS ${this.ccsId} has no course levels defined`);
  }
  
  const levelData = this.getLevelByNumber(level);
  if (!levelData) {
    throw new Error(`Level ${level} not found in CCS ${this.ccsId}`);
  }
  
  if (levelData.courseVariants.some((v: ICourseVariantInLevel) => v.language === language)) {
    throw new Error(`Language '${language}' already exists at level ${level} in CCS ${this.ccsId}`);
  }
  
  levelData.courseVariants.push({
    language,
    courseId,
    translationStatus: 'published',
    translatedAt: new Date(),
    translatedBy,
  });
  
  this.markModified('courseLevels');
  await this.save();
};

CCSSchema.methods.createLevel = async function(
  level: number,
  levelType: string,
  difficulty?: string,
  estimatedHours?: number
): Promise<void> {
  if (!this.courseLevels) {
    this.courseLevels = [];
  }
  
  if (this.hasLevel(level)) {
    throw new Error(`Level ${level} already exists in CCS ${this.ccsId}`);
  }
  
  this.courseLevels.push({
    level,
    levelType,
    difficulty: difficulty as 'beginner' | 'intermediate' | 'advanced' | 'expert' | undefined,
    estimatedHours,
    courseVariants: [],
  });
  
  this.courseLevels.sort((a: ICourseLevel, b: ICourseLevel) => a.level - b.level);
  this.totalLevels = this.courseLevels.length;
  
  await this.save();
};

const CCS: Model<ICCS> =
  mongoose.models.CCS || mongoose.model<ICCS>('CCS', CCSSchema);

export default CCS;
