/**
 * Search for Exact Mixed Language Question
 * 
 * What: Searches for the exact question pattern user reported
 * Pattern: "Mi a kulcsfontosságú koncepció a "Вопросы квалификации...""
 */

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { QuizQuestion, Course, Lesson } from '../app/lib/models';

async function searchExactQuestion() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('🔍 SEARCHING FOR EXACT MIXED LANGUAGE QUESTION\n');
    console.log('═══════════════════════════════════════════════════════════════\n');
    console.log('Database URI:', process.env.MONGODB_URI?.substring(0, 30) + '...\n');

    // Search for questions with the Hungarian template
    const questionsWithTemplate = await QuizQuestion.find({
      question: { $regex: /Mi a kulcsfontosságú koncepció/, $options: 'i' }
    }).lean();
    
    console.log(`📊 Found ${questionsWithTemplate.length} question(s) with Hungarian template:\n`);

    for (const q of questionsWithTemplate) {
      const hasCyrillic = /[А-Яа-яЁё]/.test(q.question);
      
      let courseInfo = 'No course';
      if (q.courseId) {
        const course = await Course.findById(q.courseId).lean();
        if (course) {
          courseInfo = `${course.name} (${course.courseId}) - Language: ${course.language}`;
        }
      } else if (q.lessonId) {
        const lesson = await Lesson.findOne({ lessonId: q.lessonId }).lean();
        if (lesson && lesson.courseId) {
          const course = await Course.findById(lesson.courseId).lean();
          if (course) {
            courseInfo = `${course.name} (${course.courseId}) - Language: ${course.language}`;
          }
        }
      }

      console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`Question ID: ${q._id}`);
      console.log(`UUID: ${q.uuid || 'N/A'}`);
      console.log(`Active: ${q.isActive ? 'Yes' : 'No'}`);
      console.log(`Course: ${courseInfo}`);
      console.log(`Has Cyrillic: ${hasCyrillic ? '❌ YES - ISSUE!' : '✅ No'}`);
      console.log(`\nQuestion Text:`);
      console.log(`  ${q.question}`);
      console.log(`\nOptions:`);
      q.options.forEach((opt, idx) => {
        console.log(`  ${idx + 1}. ${opt}`);
      });

      if (hasCyrillic) {
        console.log(`\n⚠️  THIS QUESTION HAS MIXED LANGUAGES!`);
        console.log(`   Fixing it now...`);
        
        // Remove Russian text
        const fixedText = q.question.replace(/["«][А-Яа-яЁё\s\-\–\—]+["»]/g, '').trim();
        const finalText = fixedText.length > 10 ? fixedText : 'Mi a kulcsfontosságú koncepció ebből a témakörből?';
        
        await QuizQuestion.findByIdAndUpdate(q._id, {
          $set: {
            question: finalText,
            'metadata.updatedAt': new Date(),
            'metadata.auditedAt': new Date(),
            'metadata.auditedBy': 'Auto-fix script - Mixed language',
          },
        });
        
        console.log(`   ✅ FIXED!`);
        console.log(`   Original: ${q.question}`);
        console.log(`   Fixed: ${finalText}`);
      }
    }

    // Also search for any question with Cyrillic in non-Russian courses
    console.log(`\n\n🔍 SEARCHING FOR ALL QUESTIONS WITH CYRILLIC...\n`);
    const allQuestions = await QuizQuestion.find({}).lean();
    const cyrillicQuestions = allQuestions.filter(q => /[А-Яа-яЁё]/.test(q.question));
    
    console.log(`📊 Found ${cyrillicQuestions.length} question(s) with Cyrillic characters:\n`);
    
    for (const q of cyrillicQuestions) {
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

      // Check if it's an issue
      if (courseLanguage && courseLanguage !== 'ru' && courseLanguage !== 'bg') {
        console.log(`\n❌ ISSUE FOUND:`);
        console.log(`   ID: ${q._id}`);
        console.log(`   Course: ${courseName} (${courseLanguage})`);
        console.log(`   Question: ${q.question.substring(0, 100)}...`);
        console.log(`   Fixing...`);
        
        const fixedText = q.question.replace(/["«][А-Яа-яЁё\s\-\–\—]+["»]/g, '').trim();
        const finalText = fixedText.length > 10 ? fixedText : q.question.replace(/[А-Яа-яЁё]+/g, '').trim();
        
        if (finalText.length > 10) {
          await QuizQuestion.findByIdAndUpdate(q._id, {
            $set: {
              question: finalText,
              'metadata.updatedAt': new Date(),
              'metadata.auditedAt': new Date(),
              'metadata.auditedBy': 'Auto-fix script - Mixed language',
            },
          });
          console.log(`   ✅ FIXED!`);
        } else {
          console.log(`   ⚠️  Could not auto-fix (text too short after removal)`);
        }
      }
    }

    console.log(`\n✅ Search and fix complete!\n`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

searchExactQuestion();
