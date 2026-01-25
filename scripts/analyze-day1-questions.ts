/**
 * Analyze Day 1 Questions Across All Languages
 * Step 1: Understand current state before enhancement
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../app/lib/mongodb';
import { Lesson, QuizQuestion, Course } from '../app/lib/models';

const LANGUAGES = ['HU', 'EN', 'TR', 'BG', 'PL', 'VI', 'ID', 'AR', 'PT', 'HI'];
const COURSE_BASE = 'PRODUCTIVITY_2026';
const DAY_NUMBER = 1;

interface QuestionAnalysis {
  lessonId: string;
  language: string;
  lessonTitle: string;
  lessonContent: string;
  questionCount: number;
  questions: Array<{
    question: string;
    options: string[];
    correctIndex: number;
    difficulty: string;
    category: string;
    questionType?: string;
    uuid?: string;
    hashtags?: string[];
  }>;
}

async function analyzeDay1() {
  try {
    await connectDB();
    console.log('🔍 ANALYZING DAY 1 QUESTIONS ACROSS ALL LANGUAGES\n');
    console.log('═══════════════════════════════════════════════════════════════\n');

    const analyses: QuestionAnalysis[] = [];

    for (const lang of LANGUAGES) {
      const courseId = `${COURSE_BASE}_${lang}`;
      const lessonId = `${COURSE_BASE}_${lang}_DAY_01`;

      console.log(`\n🌍 Processing: ${lang} (${courseId})`);
      console.log(`   Lesson ID: ${lessonId}`);

      // Find course
      const course = await Course.findOne({ courseId }).lean();
      if (!course) {
        console.log(`   ⚠️  Course not found, skipping...`);
        continue;
      }

      // Find lesson
      const lesson = await Lesson.findOne({ lessonId }).lean();
      if (!lesson) {
        console.log(`   ⚠️  Lesson not found, skipping...`);
        continue;
      }

      console.log(`   ✅ Lesson found: "${lesson.title}"`);
      console.log(`   📖 Content preview: ${lesson.content?.substring(0, 100)}...`);

      // Get quiz questions
      const questions = await QuizQuestion.find({
        lessonId,
        courseId: course._id,
        isCourseSpecific: true,
      })
        .sort({ question: 1 })
        .lean();

      console.log(`   📝 Questions found: ${questions.length}`);

      const analysis: QuestionAnalysis = {
        lessonId,
        language: lang.toLowerCase(),
        lessonTitle: lesson.title,
        lessonContent: lesson.content || '',
        questionCount: questions.length,
        questions: questions.map(q => ({
          question: q.question,
          options: q.options,
          correctIndex: q.correctIndex,
          difficulty: q.difficulty,
          category: q.category,
          questionType: q.questionType,
          uuid: q.uuid,
          hashtags: q.hashtags,
        })),
      };

      analyses.push(analysis);

      // Display questions
      questions.forEach((q, idx) => {
        console.log(`\n   ❓ Q${idx + 1}: ${q.question.substring(0, 70)}${q.question.length > 70 ? '...' : ''}`);
        console.log(`      Difficulty: ${q.difficulty}, Category: ${q.category}`);
        console.log(`      Type: ${q.questionType || 'NOT SET'}, UUID: ${q.uuid ? 'SET' : 'NOT SET'}`);
        console.log(`      Hashtags: ${q.hashtags?.length || 0} tags`);
      });
    }

    console.log(`\n${'═'.repeat(60)}\n`);
    console.log(`📊 SUMMARY:\n`);
    console.log(`   Languages analyzed: ${analyses.length}`);
    console.log(`   Average questions per language: ${(analyses.reduce((sum, a) => sum + a.questionCount, 0) / analyses.length).toFixed(1)}`);
    console.log(`   Languages with 5 questions: ${analyses.filter(a => a.questionCount === 5).length}`);
    console.log(`   Languages with 7 questions: ${analyses.filter(a => a.questionCount === 7).length}`);
    console.log(`   Languages needing enhancement: ${analyses.filter(a => a.questionCount < 7).length}`);

    // Save analysis to file for reference
    const fs = require('fs');
    const path = require('path');
    const outputPath = path.join(__dirname, '../docs/day1-analysis.json');
    fs.writeFileSync(outputPath, JSON.stringify(analyses, null, 2));
    console.log(`\n💾 Analysis saved to: ${outputPath}`);

    // Return first lesson content for question creation
    if (analyses.length > 0) {
      const firstAnalysis = analyses.find(a => a.language === 'en') || analyses[0];
      console.log(`\n📚 Using lesson content from: ${firstAnalysis.language.toUpperCase()}`);
      console.log(`   Title: ${firstAnalysis.lessonTitle}`);
      console.log(`   Content length: ${firstAnalysis.lessonContent.length} characters`);
      
      return {
        analyses,
        referenceLesson: firstAnalysis,
      };
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

analyzeDay1().then(result => {
  if (result) {
    console.log('\n✅ Analysis complete! Ready for question creation.');
  }
  process.exit(0);
});
