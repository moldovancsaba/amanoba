/**
 * SystemVersion Model
 * 
 * Purpose: Tracks database schema migrations and system versions
 * Why: Ensures database compatibility and provides migration history
 * 
 * Features:
 * - Schema version tracking
 * - Migration script execution log
 * - Rollback capability metadata
 * - System health indicators
 */

import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Interface: SystemVersion document structure
 * Why: Type-safe access to version properties
 */
export interface ISystemVersion extends Document {
  version: string; // Semantic version (e.g., "1.0.0")
  schemaVersion: number; // Incremental schema version
  appliedAt: Date;
  description: string;
  migrations: Array<{
    name: string;
    executedAt: Date;
    duration: number; // milliseconds
    success: boolean;
    errorMessage?: string;
  }>;
  rollback?: {
    availableScript?: string;
    notes?: string;
  };
  metadata: {
    createdAt: Date;
    appliedBy: string; // Admin user or system
  };
}

/**
 * Schema: SystemVersion
 * Why: Enforces immutable version history
 */
const SystemVersionSchema = new Schema<ISystemVersion>(
  {
    version: {
      type: String,
      required: [true, 'Version is required'],
      unique: true,
      trim: true,
      match: [/^\d+\.\d+\.\d+$/, 'Version must follow semantic versioning (e.g., 1.0.0)'],
      immutable: true,
      // Why: Semantic version identifier
    },
    schemaVersion: {
      type: Number,
      required: [true, 'Schema version is required'],
      unique: true,
      min: [1, 'Schema version must be at least 1'],
      immutable: true,
      // Why: Incremental counter for database schema changes
    },
    appliedAt: {
      type: Date,
      required: [true, 'Applied at timestamp is required'],
      default: () => new Date(),
      immutable: true,
      // Why: ISO 8601 timestamp when version was deployed
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
      immutable: true,
      // Why: Human-readable version changes summary
    },
    migrations: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
          // Why: Migration script identifier
        },
        executedAt: {
          type: Date,
          required: true,
          default: () => new Date(),
          // Why: ISO 8601 timestamp for migration execution
        },
        duration: {
          type: Number,
          required: true,
          min: 0,
          // Why: Migration execution time in milliseconds
        },
        success: {
          type: Boolean,
          required: true,
          // Why: Whether migration completed successfully
        },
        errorMessage: {
          type: String,
          trim: true,
          maxlength: [2000, 'Error message cannot exceed 2000 characters'],
          // Why: Error details if migration failed
        },
      },
    ],
    rollback: {
      availableScript: {
        type: String,
        trim: true,
        // Why: Name of rollback script if available
      },
      notes: {
        type: String,
        trim: true,
        maxlength: [1000, 'Rollback notes cannot exceed 1000 characters'],
        // Why: Instructions for manual rollback if needed
      },
    },
    metadata: {
      createdAt: {
        type: Date,
        default: () => new Date(),
        immutable: true,
        // Why: ISO 8601 timestamp for record creation
      },
      appliedBy: {
        type: String,
        required: [true, 'Applied by is required'],
        trim: true,
        immutable: true,
        // Why: Who deployed this version (admin user or 'system')
      },
    },
  },
  {
    timestamps: false, // Using custom immutable timestamps
    strict: true,
  }
);

/**
 * Indexes
 * Why: Optimizes version queries
 */
SystemVersionSchema.index({ schemaVersion: -1 });
// Why: Get latest schema version

SystemVersionSchema.index({ appliedAt: -1 });
// Why: Recent deployments

/**
 * Export Model
 * Why: Singleton pattern prevents multiple model compilations
 */
const SystemVersion: Model<ISystemVersion> =
  mongoose.models.SystemVersion ||
  mongoose.model<ISystemVersion>('SystemVersion', SystemVersionSchema);

export default SystemVersion;
