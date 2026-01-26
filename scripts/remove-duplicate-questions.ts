/**
 * Remove Duplicate Questions
 * 
 * Purpose: Remove duplicate questions (same question text) keeping only one
 * Why: Duplicates waste space, confuse users, and indicate data quality issues
 * 
 * Strategy: Keep the first question (by _id), delete all others
 */

import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

import { default as connectDB } from '../app/lib/mongodb';
import { QuizQuestion } from '../app/lib/models';

async function removeDuplicates() {
  try {
    await connectDB();
    console.log(`🗑️  REMOVING DUPLICATE QUESTIONS\n`);
    console.log('═══════════════════════════════════════════════════════════════\n');

    // Get all active questions
    const allQuestions = await QuizQuestion.find({ isActive: true }).lean();
    
    console.log(`📊 Analyzing ${allQuestions.length} questions...\n`);

    // Group by normalized question text
    const questionMap = new Map<string, any[]>();
    
    for (const q of allQuestions) {
      const normalized = q.question.trim().toLowerCase();
      if (!questionMap.has(normalized)) {
        questionMap.set(normalized, []);
      }
      questionMap.get(normalized)!.push(q);
    }

    // Find duplicates
    const duplicates: any[] = [];
    for (const [text, questions] of questionMap.entries()) {
      if (questions.length > 1) {
        // Sort by _id to keep the first one
        questions.sort((a, b) => a._id.toString().localeCompare(b._id.toString()));
        
        duplicates.push({
          question: questions[0].question,
          count: questions.length,
          keepId: questions[0]._id.toString(),
          deleteIds: questions.slice(1).map(q => q._id.toString())
        });
      }
    }

    console.log(`❌ Found ${duplicates.length} sets of duplicate questions\n`);

    if (duplicates.length === 0) {
      console.log('✅ No duplicates found. All questions are unique.\n');
      process.exit(0);
    }

    // Show sample
    console.log('Sample duplicates to be removed:\n');
    duplicates.slice(0, 10).forEach((dup, i) => {
      console.log(`${i + 1}. "${dup.question.substring(0, 60)}..."`);
      console.log(`   Keeping: ${dup.keepId}`);
      console.log(`   Deleting: ${dup.count - 1} duplicates\n`);
    });

    if (duplicates.length > 10) {
      console.log(`... and ${duplicates.length - 10} more duplicate sets\n`);
    }

    // Collect all IDs to delete
    const idsToDelete: string[] = [];
    for (const dup of duplicates) {
      idsToDelete.push(...dup.deleteIds);
    }

    const totalToDelete = idsToDelete.length;
    console.log(`\n📊 Will delete ${totalToDelete} duplicate questions\n`);

    // Delete duplicates
    const deleteResult = await QuizQuestion.deleteMany({
      _id: { $in: idsToDelete }
    });

    console.log(`\n${'═'.repeat(60)}`);
    console.log(`📊 DELETION SUMMARY`);
    console.log(`${'═'.repeat(60)}\n`);
    console.log(`✅ Deleted ${deleteResult.deletedCount} duplicate questions`);
    console.log(`✅ Kept ${duplicates.length} unique questions (one from each duplicate set)`);
    console.log(`\n⚠️  IMPORTANT: Make sure question generation scripts don't create duplicates!`);
    console.log(`   - Check for existing questions before creating new ones`);
    console.log(`   - Use unique identifiers or question text validation\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

removeDuplicates();
