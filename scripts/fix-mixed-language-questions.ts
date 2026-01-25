/**
 * Fix Mixed Language Questions
 * 
 * What: Finds and fixes quiz questions with mixed languages (e.g., Hungarian question with Russian text)
 * Why: Quality issue - questions should be in a single, consistent language
 * 
 * This script:
 * 1. Finds questions with Cyrillic characters in Hungarian/English questions
 * 2. Identifies the source language
 * 3. Either fixes the question or marks it for manual review
 */

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { QuizQuestion, Course, Lesson } from '../app/lib/models';

// Detect if text contains Cyrillic characters
function hasCyrillic(text: string): boolean {
  return /[\u0400-\u04FF]/.test(text);
}

// Detect if text contains Arabic characters
function hasArabic(text: string): boolean {
  return /[\u0600-\u06FF]/.test(text);
}

// Detect if text contains Devanagari (Hindi)
function hasDevanagari(text: string): boolean {
  return /[\u0900-\u097F]/.test(text);
}

// Get primary language of text
function detectLanguage(text: string): string {
  if (hasCyrillic(text)) return 'cyrillic'; // Russian, Bulgarian
  if (hasArabic(text)) return 'arabic';
  if (hasDevanagari(text)) return 'devanagari'; // Hindi
  if (/[àáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ]/.test(text)) return 'latin-extended'; // European languages
  return 'latin'; // English, basic Latin
}

async function fixMixedLanguageQuestions() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('🔍 SEARCHING FOR MIXED LANGUAGE QUESTIONS\n');
    console.log('═══════════════════════════════════════════════════════════════\n');

    // Get all questions
    const questions = await QuizQuestion.find({ isActive: true }).lean();
    console.log(`📊 Total questions: ${questions.length}\n`);

    const issues: Array<{
      _id: string;
      question: string;
      lessonId?: string;
      courseId?: string;
      detectedLanguage: string;
      issue: string;
    }> = [];

    // Check each question
    for (const q of questions) {
      const questionText = q.question;
      const detectedLang = detectLanguage(questionText);
      
      // Get course language if available
      let courseLanguage = '';
      if (q.courseId) {
        const course = await Course.findById(q.courseId).lean();
        if (course) {
          courseLanguage = course.language || '';
        }
      } else if (q.lessonId) {
        const lesson = await Lesson.findOne({ lessonId: q.lessonId }).lean();
        if (lesson && lesson.courseId) {
          const course = await Course.findById(lesson.courseId).lean();
          if (course) {
            courseLanguage = course.language || '';
          }
        }
      }

      // Check for mixed languages
      if (courseLanguage) {
        // Hungarian course but has Cyrillic
        if (courseLanguage === 'hu' && hasCyrillic(questionText)) {
          issues.push({
            _id: q._id.toString(),
            question: questionText,
            lessonId: q.lessonId,
            courseId: q.courseId?.toString(),
            detectedLanguage: detectedLang,
            issue: 'Hungarian course with Cyrillic (Russian/Bulgarian) text',
          });
        }
        // English course but has Cyrillic
        else if (courseLanguage === 'en' && hasCyrillic(questionText)) {
          issues.push({
            _id: q._id.toString(),
            question: questionText,
            lessonId: q.lessonId,
            courseId: q.courseId?.toString(),
            detectedLanguage: detectedLang,
            issue: 'English course with Cyrillic (Russian/Bulgarian) text',
          });
        }
        // Any course with unexpected script
        else if (courseLanguage !== 'ru' && courseLanguage !== 'bg' && hasCyrillic(questionText)) {
          issues.push({
            _id: q._id.toString(),
            question: questionText,
            lessonId: q.lessonId,
            courseId: q.courseId?.toString(),
            detectedLanguage: detectedLang,
            issue: `Non-Cyrillic course (${courseLanguage}) with Cyrillic text`,
          });
        }
      } else {
        // No course language, but has mixed scripts
        const hasMultipleScripts = [
          hasCyrillic(questionText),
          hasArabic(questionText),
          hasDevanagari(questionText),
        ].filter(Boolean).length > 1;

        if (hasMultipleScripts || (hasCyrillic(questionText) && questionText.match(/[a-zA-Z]/))) {
          issues.push({
            _id: q._id.toString(),
            question: questionText,
            lessonId: q.lessonId,
            courseId: q.courseId?.toString(),
            detectedLanguage: detectedLang,
            issue: 'Mixed scripts detected (no course language)',
          });
        }
      }
    }

    console.log(`\n❌ Found ${issues.length} issues:\n`);
    
    if (issues.length > 0) {
      issues.forEach((issue, idx) => {
        console.log(`${idx + 1}. ${issue.issue}`);
        console.log(`   Question ID: ${issue._id}`);
        console.log(`   Lesson ID: ${issue.lessonId || 'N/A'}`);
        console.log(`   Question: ${issue.question.substring(0, 100)}...`);
        console.log('');
      });

      // Ask if user wants to deactivate these questions
      console.log('\n⚠️  These questions should be reviewed and fixed manually.');
      console.log('   You can use the admin UI at /admin/questions to edit them.');
      console.log('   Or deactivate them until they are fixed.\n');
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
