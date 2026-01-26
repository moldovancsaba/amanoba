/**
 * Fix All Mixed Language Questions - Aggressive Search
 * 
 * What: Aggressively searches for and fixes ALL questions with mixed languages
 * Why: User reported mixed language issue, need to find and fix it
 * 
 * This script:
 * 1. Finds ALL questions with Cyrillic characters
 * 2. Checks if they belong to non-Cyrillic courses
 * 3. Fixes them by removing Russian text
 */

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { QuizQuestion, Course, Lesson } from '../app/lib/models';

// Check if text contains Cyrillic characters
function hasCyrillic(text: string): boolean {
  return /[А-Яа-яЁё]/.test(text);
}

// Remove Russian text from question (aggressive)
function removeRussianText(text: string): string {
  // Remove text between quotes if it contains Cyrillic
  let fixed = text.replace(/["«][А-Яа-яЁё\s\-\–\—]+["»]/g, '').trim();
  
  // Remove any standalone Cyrillic words
  fixed = fixed.replace(/[А-Яа-яЁё]+/g, '').trim();
  
  // Clean up spacing
  fixed = fixed.replace(/\s+/g, ' ').trim();
  
  // Fix common patterns
  if (fixed.includes('Mi a kulcsfontosságú koncepció') && fixed.length < 50) {
    // If question is too short after removing Russian, make it generic
    fixed = 'Mi a kulcsfontosságú koncepció ebből a témakörből?';
  }
  
  // Remove trailing punctuation issues
  fixed = fixed.replace(/\s+[?.,;:]\s*$/, '?').trim();
  
  return fixed;
}

async function fixAllMixedLanguage() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('🔍 AGGRESSIVE SEARCH FOR MIXED LANGUAGE QUESTIONS\n');
    console.log('═══════════════════════════════════════════════════════════════\n');

    // Get ALL questions (including inactive to see what's there)
    const allQuestions = await QuizQuestion.find({}).lean();
    console.log(`📊 Total questions (including inactive): ${allQuestions.length}\n`);

    const issues: Array<{
      question: any;
      courseLanguage: string;
      courseName: string;
      originalText: string;
      fixedText: string;
    }> = [];

    // Check each question
    for (const q of allQuestions) {
      if (!hasCyrillic(q.question)) {
        continue; // Skip if no Cyrillic
      }

      let courseLanguage = '';
      let courseName = '';
      let courseId = '';
      
      if (q.courseId) {
        const course = await Course.findById(q.courseId).lean();
        if (course) {
          courseLanguage = course.language || '';
          courseName = course.name || '';
          courseId = course.courseId || '';
        }
      } else if (q.lessonId) {
        const lesson = await Lesson.findOne({ lessonId: q.lessonId }).lean();
        if (lesson && lesson.courseId) {
          const course = await Course.findById(lesson.courseId).lean();
          if (course) {
            courseLanguage = course.language || '';
            courseName = course.name || '';
            courseId = course.courseId || '';
          }
        }
      }

      // If course is NOT Russian/Bulgarian but question has Cyrillic = ISSUE
      // OR if no course but question has Hungarian template with Cyrillic = ISSUE
      const hasHungarianTemplate = q.question.includes('Mi a kulcsfontosságú koncepció');
      const hasEnglishTemplate = q.question.includes('What is a key concept');
      
      if (courseLanguage && courseLanguage !== 'ru' && courseLanguage !== 'bg') {
        // Non-Cyrillic course with Cyrillic text = issue
        const fixedText = removeRussianText(q.question);
        
        issues.push({
          question: q,
          courseLanguage,
          courseName,
          originalText: q.question,
          fixedText,
        });
      } else if (!courseLanguage && (hasHungarianTemplate || hasEnglishTemplate) && hasCyrillic(q.question)) {
        // No course but has template with Cyrillic = issue
        const fixedText = removeRussianText(q.question);
        
        issues.push({
          question: q,
          courseLanguage: 'unknown',
          courseName: 'No course',
          originalText: q.question,
          fixedText,
        });
      }
    }

    console.log(`\n❌ Found ${issues.length} mixed language question(s):\n`);

    if (issues.length > 0) {
      issues.forEach((issue, idx) => {
        const q = issue.question;
        console.log(`\n${idx + 1}. Question ID: ${q._id}`);
        console.log(`   UUID: ${q.uuid || 'N/A'}`);
        console.log(`   Course: ${issue.courseName} (${issue.courseLanguage})`);
        console.log(`   Lesson ID: ${q.lessonId || 'N/A'}`);
        console.log(`   Active: ${q.isActive ? 'Yes' : 'No'}`);
        console.log(`   Original: ${issue.originalText}`);
        console.log(`   Fixed: ${issue.fixedText}`);
      });

      console.log(`\n\n🔧 FIXING QUESTIONS...\n`);

      let fixedCount = 0;
      // Fix each question
      for (const issue of issues) {
        try {
          await QuizQuestion.findByIdAndUpdate(issue.question._id, {
            $set: {
              question: issue.fixedText,
              'metadata.updatedAt': new Date(),
              'metadata.auditedAt': new Date(),
              'metadata.auditedBy': 'Auto-fix script - Mixed language removal',
            },
          });
          console.log(`   ✓ Fixed question ${issue.question._id}`);
          fixedCount++;
        } catch (error) {
          console.error(`   ✗ Failed to fix question ${issue.question._id}:`, error);
        }
      }

      console.log(`\n✅ Fixed ${fixedCount} out of ${issues.length} question(s).`);
    } else {
      console.log('✅ No mixed language issues found!');
      console.log('\n💡 All questions are in correct languages for their courses.');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixAllMixedLanguage();
