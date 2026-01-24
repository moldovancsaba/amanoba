/**
 * Migration Script: Add Audit Fields to QuizQuestions
 * 
 * Purpose: Add new fields (uuid, hashtags, questionType, auditedAt, auditedBy)
 * to all existing quiz questions in the database
 * 
 * This allows the schema update to work with existing data
 * 
 * NEW FIELDS ADDED:
 * - uuid: Unique v4 UUID (generated fresh for each question)
 * - hashtags: Empty array by default (will be populated by audit team)
 * - questionType: undefined by default (will be set during audit)
 * - metadata.auditedAt: undefined by default
 * - metadata.auditedBy: undefined by default
 */

import { v4 as uuidv4 } from 'uuid';
import connectDB from '../app/lib/mongodb';
import QuizQuestion from '../app/lib/models/quiz-question';

async function migrateAuditFields() {
  try {
    console.log('🔄 Starting migration: Add audit fields to QuizQuestions...\n');

    // Connect to database
    await connectDB();
    console.log('✅ Connected to MongoDB\n');

    // Get total count
    const totalQuestions = await QuizQuestion.countDocuments();
    console.log(`📊 Total questions in database: ${totalQuestions}\n`);

    // Find all questions and add missing fields
    const questions = await QuizQuestion.find({}).select('_id uuid hashtags questionType metadata');
    
    let updated = 0;
    let skipped = 0;

    for (const question of questions) {
      try {
        let needsUpdate = false;

        // Add UUID if missing
        if (!question.uuid) {
          question.uuid = uuidv4();
          needsUpdate = true;
        }

        // Add hashtags if missing
        if (!question.hashtags) {
          question.hashtags = [];
          needsUpdate = true;
        }

        // Add questionType if missing (undefined is okay)
        if (!question.questionType) {
          // Leave undefined - will be set during audit
          needsUpdate = true;
        }

        // Add audit metadata fields if missing
        if (!question.metadata) {
          question.metadata = {};
        }
        
        if (!question.metadata.auditedAt) {
          question.metadata.auditedAt = undefined;
          needsUpdate = true;
        }

        if (!question.metadata.auditedBy) {
          question.metadata.auditedBy = undefined;
          needsUpdate = true;
        }

        if (needsUpdate) {
          await question.save();
          updated++;

          if (updated % 100 === 0) {
            console.log(`  ✓ Updated ${updated} questions...`);
          }
        } else {
          skipped++;
        }
      } catch (error) {
        console.error(`  ✗ Error updating question ${question._id}:`, error);
      }
    }

    console.log(`\n✅ Migration Complete!`);
    console.log(`   Updated: ${updated} questions`);
    console.log(`   Skipped: ${skipped} questions (already had fields)`);
    console.log(`   Total:   ${totalQuestions} questions\n`);

    // Verify the migration
    const sampleQuestion = await QuizQuestion.findOne({ uuid: { $exists: true } });
    if (sampleQuestion) {
      console.log('📋 Sample migrated question:');
      console.log(`   UUID: ${sampleQuestion.uuid}`);
      console.log(`   Hashtags: ${JSON.stringify(sampleQuestion.hashtags)}`);
      console.log(`   Question Type: ${sampleQuestion.questionType || 'undefined (set during audit)'}`);
      console.log(`   Audited At: ${sampleQuestion.metadata?.auditedAt || 'undefined'}`);
      console.log(`   Audited By: ${sampleQuestion.metadata?.auditedBy || 'undefined'}\n`);
    }

    console.log('🎉 Migration successful! Schema is now ready for audit data.\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrateAuditFields();
