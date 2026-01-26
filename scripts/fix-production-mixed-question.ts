/**
 * Fix Production Mixed Language Question - Direct Search
 * 
 * What: Directly searches for and fixes the exact question user reported
 * User reported: "Mi a kulcsfontosságú koncepció a "Вопросы квалификации и скрипты...""
 */

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { QuizQuestion, Course, Lesson } from '../app/lib/models';

async function fixProductionQuestion() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('🔍 DIRECT SEARCH FOR PRODUCTION MIXED LANGUAGE QUESTION\n');
    console.log('═══════════════════════════════════════════════════════════════\n');

    // Get ALL questions
    const allQuestions = await QuizQuestion.find({}).lean();
    console.log(`📊 Total questions in database: ${allQuestions.length}\n`);

    let fixedCount = 0;

    // Search for questions with Hungarian + Cyrillic
    for (const q of allQuestions) {
      const questionText = q.question;
      const hasHungarian = /Mi a kulcsfontosságú koncepció/i.test(questionText);
      const hasCyrillic = /[А-Яа-яЁё]/.test(questionText);
      
      if (hasHungarian && hasCyrillic) {
        console.log(`\n❌ FOUND MIXED LANGUAGE QUESTION:`);
        console.log(`   ID: ${q._id}`);
        console.log(`   UUID: ${q.uuid || 'N/A'}`);
        console.log(`   Active: ${q.isActive}`);
        console.log(`   Original: ${questionText}`);
        
        // Get course info
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
        console.log(`   Course: ${courseName} (${courseLanguage})`);
        
        // Fix: Remove Russian text between quotes
        let fixedText = questionText.replace(/["«][А-Яа-яЁё\s\-\–\—]+["»]/g, '').trim();
        
        // If too short, make it generic
        if (fixedText.length < 30) {
          fixedText = 'Mi a kulcsfontosságú koncepció ebből a témakörből?';
        }
        
        // Clean up
        fixedText = fixedText.replace(/\s+/g, ' ').trim();
        
        console.log(`   Fixed: ${fixedText}`);
        console.log(`   🔧 Fixing now...`);
        
        await QuizQuestion.findByIdAndUpdate(q._id, {
          $set: {
            question: fixedText,
            'metadata.updatedAt': new Date(),
            'metadata.auditedAt': new Date(),
            'metadata.auditedBy': 'Auto-fix script - Mixed language (Hungarian with Russian)',
          },
        });
        
        console.log(`   ✅ FIXED!`);
        fixedCount++;
      }
    }

    // Also check for any question with Cyrillic in non-Cyrillic courses
    console.log(`\n\n🔍 CHECKING ALL CYRILLIC QUESTIONS FOR WRONG COURSES...\n`);
    
    for (const q of allQuestions) {
      if (!/[А-Яа-яЁё]/.test(q.question)) continue;
      
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

      // If course is NOT Russian/Bulgarian but has Cyrillic = FIX IT
      if (courseLanguage && courseLanguage !== 'ru' && courseLanguage !== 'bg') {
        console.log(`\n❌ FOUND CYRILLIC IN NON-CYRILLIC COURSE:`);
        console.log(`   ID: ${q._id}`);
        console.log(`   Course: ${courseName} (${courseLanguage})`);
        console.log(`   Question: ${q.question.substring(0, 100)}...`);
        
        // Remove Cyrillic text
        let fixedText = q.question.replace(/["«][А-Яа-яЁё\s\-\–\—]+["»]/g, '').trim();
        fixedText = fixedText.replace(/[А-Яа-яЁё]+/g, '').trim();
        fixedText = fixedText.replace(/\s+/g, ' ').trim();
        
        if (fixedText.length > 10) {
          console.log(`   Fixed: ${fixedText.substring(0, 100)}...`);
          console.log(`   🔧 Fixing now...`);
          
          await QuizQuestion.findByIdAndUpdate(q._id, {
            $set: {
              question: fixedText,
              'metadata.updatedAt': new Date(),
              'metadata.auditedAt': new Date(),
              'metadata.auditedBy': 'Auto-fix script - Cyrillic in non-Cyrillic course',
            },
          });
          
          console.log(`   ✅ FIXED!`);
          fixedCount++;
        } else {
          console.log(`   ⚠️  Could not auto-fix (text too short)`);
        }
      }
    }

    if (fixedCount > 0) {
      console.log(`\n\n✅ SUCCESS! Fixed ${fixedCount} question(s).\n`);
    } else {
      console.log(`\n\n✅ No mixed language questions found to fix.`);
      console.log(`   All questions are in correct languages.\n`);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixProductionQuestion();
