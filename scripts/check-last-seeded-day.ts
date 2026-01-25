/**
 * Check Last Seeded Day
 * 
 * Purpose: Determine what was the last day that was actually seeded into the database
 * Why: After rollback, need to verify current state
 */

import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

import { default as connectDB } from '../app/lib/mongodb';
import { Course, Lesson, QuizQuestion } from '../app/lib/models';

const COURSE_ID_BASE = 'PRODUCTIVITY_2026';
const LANGUAGES = ['HU', 'EN', 'TR', 'BG', 'PL', 'VI', 'ID', 'AR', 'PT', 'HI'];

interface DayStatus {
  day: number;
  languagesWith7Questions: number;
  languagesWith5Questions: number;
  languagesWithOther: number;
  languagesMissing: number;
  status: 'COMPLETE' | 'PARTIAL' | 'MISSING' | 'OLD';
}

async function checkLastSeededDay() {
  try {
    await connectDB();
    console.log('🔍 CHECKING LAST SEEDED DAY\n');
    console.log('═══════════════════════════════════════════════════════════════\n');

    const dayStatuses: DayStatus[] = [];

    // Check days 1-30
    for (let day = 1; day <= 30; day++) {
      let languagesWith7Questions = 0;
      let languagesWith5Questions = 0;
      let languagesWithOther = 0;
      let languagesMissing = 0;

      for (const lang of LANGUAGES) {
        const courseId = `${COURSE_ID_BASE}_${lang}`;
        const lessonId = `${COURSE_ID_BASE}_${lang}_DAY_${day.toString().padStart(2, '0')}`;

        // Find course
        const course = await Course.findOne({ courseId }).lean();
        if (!course) {
          languagesMissing++;
          continue;
        }

        // Find lesson
        const lesson = await Lesson.findOne({ lessonId }).lean();
        if (!lesson) {
          languagesMissing++;
          continue;
        }

        // Get quiz questions
        const questions = await QuizQuestion.find({
          lessonId,
          courseId: course._id,
          isCourseSpecific: true,
        }).lean();

        const questionCount = questions.length;

        if (questionCount === 7) {
          languagesWith7Questions++;
        } else if (questionCount === 5) {
          languagesWith5Questions++;
        } else if (questionCount > 0) {
          languagesWithOther++;
        } else {
          languagesMissing++;
        }
      }

      let status: 'COMPLETE' | 'PARTIAL' | 'MISSING' | 'OLD';
      if (languagesWith7Questions === LANGUAGES.length) {
        status = 'COMPLETE';
      } else if (languagesWith7Questions > 0) {
        status = 'PARTIAL';
      } else if (languagesWith5Questions === LANGUAGES.length) {
        status = 'OLD';
      } else if (languagesWith5Questions > 0 || languagesWithOther > 0) {
        status = 'PARTIAL';
      } else {
        status = 'MISSING';
      }

      dayStatuses.push({
        day,
        languagesWith7Questions,
        languagesWith5Questions,
        languagesWithOther,
        languagesMissing,
        status
      });
    }

    // Display results
    console.log('📊 DAY STATUS SUMMARY:\n');
    console.log('Day | Status      | 7Q | 5Q | Other | Missing');
    console.log('----|-------------|----|----|----|--------');

    let lastCompleteDay = 0;
    let lastOldDay = 0;

    for (const status of dayStatuses) {
      const statusIcon = 
        status.status === 'COMPLETE' ? '✅' :
        status.status === 'PARTIAL' ? '🟡' :
        status.status === 'OLD' ? '⚪' :
        '❌';

      console.log(
        `${status.day.toString().padStart(2)}  | ${statusIcon} ${status.status.padEnd(10)} | ${status.languagesWith7Questions.toString().padStart(2)} | ${status.languagesWith5Questions.toString().padStart(2)} | ${status.languagesWithOther.toString().padStart(5)} | ${status.languagesMissing.toString().padStart(7)}`
      );

      if (status.status === 'COMPLETE') {
        lastCompleteDay = status.day;
      }
      if (status.status === 'OLD' && status.day > lastOldDay) {
        lastOldDay = status.day;
      }
    }

    console.log(`\n${'═'.repeat(60)}\n`);
    console.log('📌 SUMMARY:\n');
    
    if (lastCompleteDay > 0) {
      console.log(`   ✅ Last day with 7 questions (enhanced): Day ${lastCompleteDay}`);
    } else {
      console.log(`   ⚠️  No days found with 7 questions (enhanced)`);
    }

    if (lastOldDay > 0) {
      console.log(`   ⚪ Last day with 5 questions (old format): Day ${lastOldDay}`);
    } else {
      console.log(`   ⚠️  No days found with 5 questions (old format)`);
    }

    // Find the transition point
    const firstEnhancedDay = dayStatuses.find(s => s.status === 'COMPLETE' || s.status === 'PARTIAL');
    const lastOldFormatDay = dayStatuses.slice().reverse().find(s => s.status === 'OLD');

    console.log(`\n   📍 Database State:`);
    if (lastCompleteDay > 0) {
      console.log(`      - Days 1-${lastCompleteDay}: Enhanced (7 questions)`);
    }
    if (lastOldFormatDay && lastOldFormatDay.day > lastCompleteDay) {
      console.log(`      - Days ${lastCompleteDay + 1}-${lastOldFormatDay.day}: Old format (5 questions)`);
    }
    if (dayStatuses[dayStatuses.length - 1].status === 'MISSING') {
      const firstMissing = dayStatuses.find(s => s.status === 'MISSING');
      if (firstMissing) {
        console.log(`      - Days ${firstMissing.day}+: Missing or not seeded`);
      }
    }

    console.log(`\n✅ CHECK COMPLETE!\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkLastSeededDay();
