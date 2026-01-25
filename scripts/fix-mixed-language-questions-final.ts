/**
 * Fix Mixed Language Questions - Production Fix
 * 
 * What: Finds and fixes questions with mixed languages (e.g., Hungarian question with Russian text)
 * Why: Quality issue - questions should be in a single, consistent language
 * 
 * This script:
 * 1. Finds questions with Cyrillic characters in non-Cyrillic courses
 * 2. Removes or translates the Russian text
 * 3. Updates the question in the database
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

// Extract Russian text from question (between quotes)
function extractRussianText(text: string): string | null {
  const match = text.match(/["«]([А-Яа-яЁё\s\-\–\—]+)["»]/);
  return match ? match[1] : null;
}

// Remove Russian text from question
function removeRussianText(text: string): string {
  // Remove text between quotes if it contains Cyrillic
  return text.replace(/["«][А-Яа-яЁё\s\-\–\—]+["»]/g, '').trim();
}

async function fixMixedLanguageQuestions() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('🔍 FINDING AND FIXING MIXED LANGUAGE QUESTIONS\n');
    console.log('═══════════════════════════════════════════════════════════════\n');

    const allQuestions = await QuizQuestion.find({ isActive: true }).lean();
    console.log(`📊 Total questions: ${allQuestions.length}\n`);

    const issues: Array<{
      question: any;
      courseLanguage: string;
      courseName: string;
      russianText: string | null;
      fixedText: string;
    }> = [];

    // Check each question
    for (const q of allQuestions) {
      if (!hasCyrillic(q.question)) {
        continue; // Skip if no Cyrillic
      }

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

      // If course is not Russian/Bulgarian but question has Cyrillic = issue
      if (courseLanguage && courseLanguage !== 'ru' && courseLanguage !== 'bg' && hasCyrillic(q.question)) {
        const russianText = extractRussianText(q.question);
        const fixedText = removeRussianText(q.question);
        
        issues.push({
          question: q,
          courseLanguage,
          courseName,
          russianText,
          fixedText,
        });
      }
    }

    console.log(`\n❌ Found ${issues.length} mixed language question(s):\n`);

    if (issues.length > 0) {
      issues.forEach((issue, idx) => {
        const q = issue.question;
        console.log(`\n${idx + 1}. Question ID: ${q._id}`);
        console.log(`   Course: ${issue.courseName} (${issue.courseLanguage})`);
        console.log(`   Original: ${q.question}`);
        if (issue.russianText) {
          console.log(`   Russian text: "${issue.russianText}"`);
        }
        console.log(`   Fixed: ${issue.fixedText}`);
      });

      console.log(`\n\n🔧 FIXING QUESTIONS...\n`);

      // Fix each question
      for (const issue of issues) {
        await QuizQuestion.findByIdAndUpdate(issue.question._id, {
          $set: {
            question: issue.fixedText,
            'metadata.updatedAt': new Date(),
            'metadata.auditedAt': new Date(),
            'metadata.auditedBy': 'Auto-fix script - Mixed language',
          },
        });
        console.log(`   ✓ Fixed question ${issue.question._id}`);
      }

      console.log(`\n✅ Fixed ${issues.length} question(s).`);
    } else {
      console.log('✅ No mixed language issues found!\n');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixMixedLanguageQuestions();
