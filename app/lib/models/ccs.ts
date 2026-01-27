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

export interface ICCS extends Document {
  ccsId: string; // unique slug, e.g. PRODUCTIVITY_2026
  name?: string; // display name
  idea?: string; // markdown, at creation
  outline?: string; // 30-Day Advanced Outline, markdown
  relatedDocuments?: IRelatedDocument[];
  createdAt: Date;
  updatedAt: Date;
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
  },
  {
    timestamps: true,
    strict: true,
    collection: 'ccs',
  }
);

CCSSchema.index({ ccsId: 1 }, { name: 'ccs_id_unique', unique: true });

const CCS: Model<ICCS> =
  mongoose.models.CCS || mongoose.model<ICCS>('CCS', CCSSchema);

export default CCS;
