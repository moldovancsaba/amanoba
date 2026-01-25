/**
 * Fix Mixed Language Questions (Production)
 * 
 * What: Finds and fixes questions with mixed languages
 * Why: Questions should be in a single, consistent language matching the course
 * 
 * Usage: Run this script to find and optionally fix mixed language questions
 * 
 * IMPORTANT: Review the output before applying fixes!
 */

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { QuizQuestion, Course, Lesson } from '../app/lib/models';

// Extract Russian text from question
function extractRussianText(text: string): string | null {
  const match = text.match(/["«]([А-Яа-яЁё\s\-\–\—]+)["»]/);
  return match ? match[1] : null;
}

// Check if question has mixed languages
function hasMixedLanguages(question: string, courseLanguage: string): boolean {
  const hasCyrillic = /[А-Яа-яЁё]/.test(question);
  const hasHungarianTemplate = question.includes('Mi a kulcsfontosságú koncepció');
  const hasEnglishTemplate = question.includes('What is a key concept');
  
  // Hungarian course with Cyrillic = mixed
  if (courseLanguage === 'hu' && hasCyrillic) {
    return true;
  }
  // English course with Cyrillic = mixed (unless it's a Russian course)
  if (courseLanguage === 'en' && hasCyrillic) {
    return true;
  }
  
  return false;
}

async function fixMixedLanguageQuestions(dryRun: boolean = true) {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log(`🔍 ${dryRun ? 'SEARCHING FOR' : 'FIXING'} MIXED LANGUAGE QUESTIONS\n`);
    console.log('═══════════════════════════════════════════════════════════════\n');

    const allQuestions = await QuizQuestion.find({ isActive: true }).lean();
    console.log(`📊 Total questions: ${allQuestions.length}\n`);

    const issues: Array<{
      question: any;
      courseLanguage: string;
      courseName: string;
      russianText: string | null;
    }> = [];

    // Check each question
    for (const q of allQuestions) {
      let courseLanguage = '';
      let courseName = '';
      
      if (q.courseId) {
        const course = await Course.findById(q.courseId).lean();
        if (course) {
          courseLanguage = course.language || '';
          courseName = course.name || '';
        }
      } else if (q.lessonId) {
        const lesson = await Lesson.findOne({ lessonId: q.lessonId }).lean();
        if (lesson && lesson.courseId) {
          const course = await Course.findById(lesson.courseId).lean();
          if (course) {
            courseLanguage = course.language || '';
            courseName = course.name || '';
          }
        }
      }

      if (courseLanguage && hasMixedLanguages(q.question, courseLanguage)) {
        const russianText = extractRussianText(q.question);
        issues.push({
          question: q,
          courseLanguage,
          courseName,
          russianText,
        });
      }
    }

    console.log(`\n❌ Found ${issues.length} mixed language question(s):\n`);

    if (issues.length > 0) {
      issues.forEach((issue, idx) => {
        const q = issue.question;
        console.log(`\n${idx + 1}. Question ID: ${q._id}`);
        console.log(`   Course: ${issue.courseName} (${issue.courseLanguage})`);
        console.log(`   Lesson ID: ${q.lessonId || 'N/A'}`);
        console.log(`   Question: ${q.question}`);
        if (issue.russianText) {
          console.log(`   Russian text found: "${issue.russianText}"`);
        }
        console.log(`   Options: ${q.options.join(' | ')}`);
      });

      if (dryRun) {
        console.log(`\n\n⚠️  DRY RUN MODE - No changes made`);
        console.log(`   To fix these questions:`);
        console.log(`   1. Use the admin UI at /admin/questions to edit them manually`);
        console.log(`   2. Or run this script with dryRun=false (NOT RECOMMENDED - review first!)`);
        console.log(`\n   Recommended fix: Remove the Russian text from the question or translate it.`);
      } else {
        console.log(`\n\n⚠️  FIXING MODE - This will deactivate problematic questions`);
        console.log(`   Questions will be marked as inactive for manual review.`);
        
        // Deactivate questions (don't delete - allow manual review)
        for (const issue of issues) {
          await QuizQuestion.findByIdAndUpdate(issue.question._id, {
            $set: {
              isActive: false,
              'metadata.updatedAt': new Date(),
            },
          });
          console.log(`   ✓ Deactivated question ${issue.question._id}`);
        }
        
        console.log(`\n✅ Deactivated ${issues.length} question(s).`);
        console.log(`   Review and fix them in the admin UI, then reactivate.`);
      }
    } else {
      console.log('✅ No mixed language issues found!\n');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Run in dry-run mode by default
const dryRun = process.argv[2] !== '--fix';
fixMixedLanguageQuestions(dryRun);
