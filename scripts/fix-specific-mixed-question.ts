/**
 * Fix Specific Mixed Language Question
 * 
 * What: Searches for and fixes the specific Hungarian question with Russian text
 * Why: User reported seeing "Mi a kulcsfontosságú koncepció a "Вопросы квалификации...""
 * 
 * This script searches for questions matching this pattern and fixes them
 */

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { QuizQuestion, Course, Lesson } from '../app/lib/models';

// Remove Russian text from question
function removeRussianText(text: string): string {
  // Remove text between quotes if it contains Cyrillic
  // Pattern: "Russian text" or «Russian text»
  let fixed = text.replace(/["«][А-Яа-яЁё\s\-\–\—]+["»]/g, '').trim();
  
  // Clean up any double spaces or trailing punctuation
  fixed = fixed.replace(/\s+/g, ' ').trim();
  
  // If the question ends with "témakörből?" and has nothing before it, make it more generic
  if (fixed.endsWith('témakörből?') && fixed.length < 30) {
    fixed = 'Mi a kulcsfontosságú koncepció ebből a témakörből?';
  }
  
  return fixed;
}

async function fixSpecificMixedQuestion() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('🔍 SEARCHING FOR SPECIFIC MIXED LANGUAGE QUESTION\n');
    console.log('═══════════════════════════════════════════════════════════════\n');

    // Search for questions with the specific pattern
    const allQuestions = await QuizQuestion.find({ isActive: true }).lean();
    console.log(`📊 Total questions: ${allQuestions.length}\n`);

    const issues: Array<{
      question: any;
      courseLanguage: string;
      courseName: string;
      originalText: string;
      fixedText: string;
    }> = [];

    // Check each question
    for (const q of allQuestions) {
      // Look for Hungarian template with Cyrillic
      const hasHungarianTemplate = q.question.includes('Mi a kulcsfontosságú koncepció');
      const hasCyrillic = /[А-Яа-яЁё]/.test(q.question);
      
      if (hasHungarianTemplate && hasCyrillic) {
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

        // If it's a Hungarian course (or no course but Hungarian template), fix it
        if (courseLanguage === 'hu' || (!courseLanguage && hasHungarianTemplate)) {
          const fixedText = removeRussianText(q.question);
          
          issues.push({
            question: q,
            courseLanguage,
            courseName,
            originalText: q.question,
            fixedText,
          });
        }
      }
    }

    console.log(`\n❌ Found ${issues.length} mixed language question(s):\n`);

    if (issues.length > 0) {
      issues.forEach((issue, idx) => {
        const q = issue.question;
        console.log(`\n${idx + 1}. Question ID: ${q._id}`);
        console.log(`   UUID: ${q.uuid || 'N/A'}`);
        console.log(`   Course: ${issue.courseName || 'N/A'} (${issue.courseLanguage || 'N/A'})`);
        console.log(`   Lesson ID: ${q.lessonId || 'N/A'}`);
        console.log(`   Original: ${issue.originalText}`);
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
            'metadata.auditedBy': 'Auto-fix script - Mixed language (Hungarian with Russian)',
          },
        });
        console.log(`   ✓ Fixed question ${issue.question._id}`);
        console.log(`     "${issue.originalText.substring(0, 80)}..."`);
        console.log(`     → "${issue.fixedText.substring(0, 80)}..."`);
      }

      console.log(`\n✅ Fixed ${issues.length} question(s).`);
    } else {
      console.log('✅ No mixed language questions found with this pattern.');
      console.log('\n💡 The issue might be in production database.');
      console.log('   Run this script on production or check the question manually in admin UI.');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixSpecificMixedQuestion();
