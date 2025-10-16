/**
 * Brand Model
 * 
 * What: Represents a white-labeled brand configuration in the multi-tenant system
 * Why: Enables multiple brands (PlayMass, Madoku, future brands) to share the same codebase
 * with brand-specific customization for theming, domains, and feature flags
 */

import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Brand Document Interface
 * 
 * Why: TypeScript type safety for Brand documents
 */
export interface IBrand extends Document {
  name: string;
  slug: string;
  displayName: string;
  description?: string;
  logo?: string;
  favicon?: string;
  themeColors: {
    primary: string;
    secondary: string;
    accent?: string;
  };
  allowedDomains: string[];
  isActive: boolean;
  supportedLanguages: string[];
  defaultLanguage: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
  };
  contactEmail?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Brand Schema
 * 
 * Why: Defines structure, validation, and indexes for Brand collection
 */
const BrandSchema = new Schema<IBrand>(
  {
    // Unique internal name for brand
    // Why: Used in code logic for brand-specific behavior
    name: {
      type: String,
      required: [true, 'Brand name is required'],
      unique: true,
      trim: true,
      maxlength: [50, 'Brand name cannot exceed 50 characters'],
    },

    // URL-friendly slug
    // Why: Used in subdomain or path-based routing
    slug: {
      type: String,
      required: [true, 'Brand slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'],
    },

    // Human-readable brand name for UI display
    // Why: Users see this name, not the internal name
    displayName: {
      type: String,
      required: [true, 'Display name is required'],
      trim: true,
      maxlength: [100, 'Display name cannot exceed 100 characters'],
    },

    // Brand description for marketing or about pages
    // Why: Optional context about the brand
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },

    // Logo URL or path
    // Why: Displayed in header, favicon, meta tags
    logo: {
      type: String,
      trim: true,
    },

    // Favicon URL or path
    // Why: Browser tab icon
    favicon: {
      type: String,
      trim: true,
    },

    // Theme colors for brand customization
    // Why: Each brand has unique color scheme applied via CSS variables
    themeColors: {
      primary: {
        type: String,
        required: [true, 'Primary color is required'],
        match: [/^#[0-9a-fA-F]{6}$/, 'Primary color must be valid hex color'],
      },
      secondary: {
        type: String,
        required: [true, 'Secondary color is required'],
        match: [/^#[0-9a-fA-F]{6}$/, 'Secondary color must be valid hex color'],
      },
      accent: {
        type: String,
        match: [/^#[0-9a-fA-F]{6}$/, 'Accent color must be valid hex color'],
      },
    },

    // Allowed domains for this brand
    // Why: Used for CORS, brand detection, and security
    allowedDomains: {
      type: [String],
      required: [true, 'At least one allowed domain is required'],
      validate: {
        validator: (domains: string[]) => domains.length > 0,
        message: 'At least one domain must be specified',
      },
    },

    // Brand activation status
    // Why: Allows temporarily disabling a brand without deleting data
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    // Supported language codes (ISO 639-1)
    // Why: Determines available translations and localization
    supportedLanguages: {
      type: [String],
      required: [true, 'At least one language is required'],
      validate: {
        validator: (langs: string[]) => langs.length > 0,
        message: 'At least one language must be specified',
      },
    },

    // Default language code
    // Why: Fallback when user language is not supported
    defaultLanguage: {
      type: String,
      required: [true, 'Default language is required'],
      default: 'en',
    },

    // Social media links
    // Why: Displayed in footer or about page
    socialLinks: {
      facebook: String,
      twitter: String,
      instagram: String,
    },

    // Contact email for support
    // Why: Displayed in UI, used for system notifications
    contactEmail: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Contact email must be valid'],
    },

    // Flexible metadata field for brand-specific config
    // Why: Allows adding brand-specific settings without schema changes
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    // Automatic timestamps
    // Why: Track when brands are created and updated
    timestamps: true,
    
    // Strict mode to reject undefined fields
    // Why: Prevents data corruption from unexpected fields
    strict: true,
    
    // Collection name
    // Why: Explicitly named for clarity
    collection: 'brands',
  }
);

// Indexes for efficient querying
// Why: Brands are queried frequently by slug (subdomain/path routing) and active status

BrandSchema.index({ slug: 1 }, { name: 'brand_slug_unique', unique: true });
BrandSchema.index({ isActive: 1 }, { name: 'brand_active' });
BrandSchema.index({ 'allowedDomains': 1 }, { name: 'brand_domains' });

/**
 * Pre-save hook to ensure defaultLanguage is in supportedLanguages
 * 
 * Why: Data consistency - default language must be supported
 */
BrandSchema.pre('save', function (next) {
  if (!this.supportedLanguages.includes(this.defaultLanguage)) {
    return next(new Error('Default language must be included in supported languages'));
  }
  next();
});

/**
 * Brand Model
 * 
 * Why: Export typed model for use in application
 */
const Brand: Model<IBrand> =
  mongoose.models.Brand || mongoose.model<IBrand>('Brand', BrandSchema);

export default Brand;
