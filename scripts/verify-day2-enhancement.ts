/**
 * Verify Day 2 Enhanced Quiz Questions
 * 
 * Purpose: Verify that Day 2 quizzes have been enhanced from 5 to 7 questions
 * Why: Quality assurance after seeding enhanced questions
 */

import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

import { default as connectDB } from '../app/lib/mongodb';
import { Course, Lesson, QuizQuestion } from '../app/lib/models';

const COURSE_ID_BASE = 'PRODUCTIVITY_2026';
const DAY_NUMBER = 2;
const LANGUAGES = ['HU', 'EN', 'TR', 'BG', 'PL', 'VI', 'ID', 'AR', 'PT', 'HI'];
const EXPECTED_QUESTIONS = 7;

interface VerificationResult {
  language: string;
  lessonId: string;
  questionCount: number;
  hasAllMetadata: boolean;
  allQuestionsHaveUUID: boolean;
  allQuestionsHaveHashtags: boolean;
  allQuestionsHaveType: boolean;
  status: 'PASS' | 'FAIL';
  issues: string[];
}

async function verifyDay2Enhancement() {
  try {
    await connectDB();
    console.log('🔍 VERIFYING DAY 2 ENHANCED QUIZ QUESTIONS\n');
    console.log('═══════════════════════════════════════════════════════════════\n');

    const results: VerificationResult[] = [];

    for (const lang of LANGUAGES) {
      const courseId = `${COURSE_ID_BASE}_${lang}`;
      const lessonId = `${COURSE_ID_BASE}_${lang}_DAY_02`;

      console.log(`\n🌍 Verifying: ${lang} (${courseId})`);

      // Find course
      const course = await Course.findOne({ courseId }).lean();
      if (!course) {
        console.log(`   ⚠️  Course not found`);
        results.push({
          language: lang,
          lessonId,
          questionCount: 0,
          hasAllMetadata: false,
          allQuestionsHaveUUID: false,
          allQuestionsHaveHashtags: false,
          allQuestionsHaveType: false,
          status: 'FAIL',
          issues: ['Course not found']
        });
        continue;
      }

      // Find lesson
      const lesson = await Lesson.findOne({ lessonId }).lean();
      if (!lesson) {
        console.log(`   ⚠️  Lesson not found`);
        results.push({
          language: lang,
          lessonId,
          questionCount: 0,
          hasAllMetadata: false,
          allQuestionsHaveUUID: false,
          allQuestionsHaveHashtags: false,
          allQuestionsHaveType: false,
          status: 'FAIL',
          issues: ['Lesson not found']
        });
        continue;
      }

      // Get quiz questions
      const questions = await QuizQuestion.find({
        lessonId,
        courseId: course._id,
        isCourseSpecific: true,
      })
        .sort({ question: 1 })
        .lean();

      const questionCount = questions.length;
      const issues: string[] = [];

      // Check question count
      if (questionCount !== EXPECTED_QUESTIONS) {
        issues.push(`Expected ${EXPECTED_QUESTIONS} questions, found ${questionCount}`);
      }

      // Check metadata
      let allHaveUUID = true;
      let allHaveHashtags = true;
      let allHaveType = true;

      for (const q of questions) {
        if (!q.uuid) {
          allHaveUUID = false;
          issues.push(`Question "${q.question.substring(0, 50)}..." missing UUID`);
        }
        if (!q.hashtags || q.hashtags.length === 0) {
          allHaveHashtags = false;
          issues.push(`Question "${q.question.substring(0, 50)}..." missing hashtags`);
        }
        if (!q.questionType) {
          allHaveType = false;
          issues.push(`Question "${q.question.substring(0, 50)}..." missing questionType`);
        }
      }

      const hasAllMetadata = allHaveUUID && allHaveHashtags && allHaveType;
      const status = (questionCount === EXPECTED_QUESTIONS && hasAllMetadata) ? 'PASS' : 'FAIL';

      const result: VerificationResult = {
        language: lang,
        lessonId,
        questionCount,
        hasAllMetadata,
        allQuestionsHaveUUID: allHaveUUID,
        allQuestionsHaveHashtags: allHaveHashtags,
        allQuestionsHaveType: allHaveType,
        status,
        issues
      };

      results.push(result);

      // Display result
      const statusIcon = status === 'PASS' ? '✅' : '❌';
      console.log(`   ${statusIcon} Questions: ${questionCount}/${EXPECTED_QUESTIONS}`);
      console.log(`   ${statusIcon} UUIDs: ${allHaveUUID ? 'All' : 'Missing'}`);
      console.log(`   ${statusIcon} Hashtags: ${allHaveHashtags ? 'All' : 'Missing'}`);
      console.log(`   ${statusIcon} Question Types: ${allHaveType ? 'All' : 'Missing'}`);
      
      if (issues.length > 0) {
        console.log(`   ⚠️  Issues:`);
        issues.forEach(issue => console.log(`      - ${issue}`));
      }
    }

    // Summary
    console.log(`\n${'═'.repeat(60)}\n`);
    console.log(`📊 VERIFICATION SUMMARY:\n`);
    
    const passed = results.filter(r => r.status === 'PASS').length;
    const failed = results.filter(r => r.status === 'FAIL').length;
    
    console.log(`   Total languages: ${results.length}`);
    console.log(`   ✅ Passed: ${passed}`);
    console.log(`   ❌ Failed: ${failed}`);
    
    const totalQuestions = results.reduce((sum, r) => sum + r.questionCount, 0);
    const expectedTotal = EXPECTED_QUESTIONS * LANGUAGES.length;
    console.log(`   Total questions: ${totalQuestions}/${expectedTotal}`);
    
    if (failed === 0) {
      console.log(`\n✅ ALL VERIFICATIONS PASSED!\n`);
    } else {
      console.log(`\n❌ SOME VERIFICATIONS FAILED - Review issues above\n`);
    }

    process.exit(failed === 0 ? 0 : 1);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

verifyDay2Enhancement();
