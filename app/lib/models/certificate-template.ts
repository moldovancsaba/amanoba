/**
 * CertificateTemplate Model (#10)
 *
 * What: A reusable, admin-managed certificate design in the template library.
 * Why: Lets admins define named designs (base layout + colors) once and assign
 *      them to courses / the global default by key, instead of free-text IDs.
 *
 * Rendering: a template's `key` is stored on issued certificates as designTemplateId;
 * the cert image routes resolve it to baseLayout + themeColors (see certification.ts).
 */

import mongoose, { Schema, Document, Model } from 'mongoose';

export type CertificateBaseLayout = 'default' | 'minimal';

export interface ICertificateTemplate extends Document {
  key: string; // stable slug used as designTemplateId
  name: string;
  baseLayout: CertificateBaseLayout;
  themeColors?: { accent?: string; primary?: string; secondary?: string };
  backgroundUrl?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const hexColor = {
  type: String,
  trim: true,
  validate: {
    validator: (v: string) => !v || /^#[0-9a-fA-F]{6}$/.test(v),
    message: 'Color must be a #RRGGBB hex value',
  },
};

const CertificateTemplateSchema = new Schema<ICertificateTemplate>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[a-z0-9][a-z0-9_-]{1,63}$/, 'Key must be a slug (a-z, 0-9, -, _)'],
    },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    baseLayout: { type: String, enum: ['default', 'minimal'], default: 'default' },
    themeColors: {
      accent: hexColor,
      primary: hexColor,
      secondary: hexColor,
    },
    backgroundUrl: { type: String, trim: true },
    description: { type: String, trim: true, maxlength: 500 },
  },
  { timestamps: true, strict: true, collection: 'certificate_templates' }
);

const CertificateTemplate: Model<ICertificateTemplate> =
  mongoose.models.CertificateTemplate ||
  mongoose.model<ICertificateTemplate>('CertificateTemplate', CertificateTemplateSchema);

export default CertificateTemplate;
