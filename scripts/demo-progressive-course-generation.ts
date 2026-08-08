/**
 * Demo: Progressive Course Generation
 * 
 * Shows how to use the progressive course builder to create Stage 2
 * from Stage 1 with question reuse and difficulty scaling
 */

import connectDB from '../app/lib/mongodb';
import { 
  ProgressiveCourseBuilder,
  type ProgressiveCourseConfig,
  extractQuestionPool,
  calculateDifficultyDistribution,
} from '../app/lib/course-generation/progressive-course-builder';

async function demo() {
  console.log('\n🚀 Progressive Course Generation Demo\n');
  console.log('='.repeat(70));
  
  await connectDB();

  // Configuration for AI Essentials (Stage 2)
  const config: ProgressiveCourseConfig = {
    sourceStage: 1,
    targetStage: 2,
    topicName: 'AI Foundations',
    sourceCourseName: 'AI for Dummies in a Day',
    targetCourseName: 'AI Essentials - 3 Days to Practical Skills',
    sourceCourseId: 'AI_DUMMIES_1DAY_EN',
    targetCourseId: 'AI_ESSENTIALS_3DAY_EN',
    reuseContent: {
      questions: true,
      concepts: true,
      prerequisites: true,
    },
    additions: {
      newLessons: 15,
      newQuestions: 50,
      difficultyScaling: {
        easy: 30,
        medium: 50,
        hard: 20,
        expert: 0,
      },
    },
  };

  console.log('\n📚 Configuration:');
  console.log(`  Source: ${config.sourceCourseName} (Stage ${config.sourceStage})`);
  console.log(`  Target: ${config.targetCourseName} (Stage ${config.targetStage})`);
  console.log(`  New Lessons: ${config.additions.newLessons}`);
  console.log(`  New Questions: ${config.additions.newQuestions}`);
  console.log(`  Reuse Questions: ${config.reuseContent.questions}`);

  // Step 1: Extract source question pool
  console.log('\n📊 Step 1: Extract Source Question Pool');
  console.log('-'.repeat(70));
  
  const questionPool = await extractQuestionPool(config.sourceCourseId);
  console.log(`  ✓ Extracted ${questionPool.length} questions from Stage 1`);
  
  if (questionPool.length > 0) {
    const difficulties = questionPool.reduce((acc: Record<string, number>, q) => {
      acc[q.difficulty] = (acc[q.difficulty] || 0) + 1;
      return acc;
    }, {});
    console.log(`  Difficulty breakdown:`, difficulties);
  }

  // Step 2: Build progressive course
  console.log('\n🏗️  Step 2: Build Progressive Course Outline');
  console.log('-'.repeat(70));
  
  const builder = new ProgressiveCourseBuilder();
  const result = await builder.buildNextStage(config);

  console.log(`  ✓ Generated outline for: ${result.outline.courseName}`);
  console.log(`  ✓ Total lessons: ${result.outline.lessons.length}`);
  console.log(`  ✓ Total reuse questions: ${result.reuseStrategy.questionPool.length}`);
  console.log(`  ✓ Total new questions needed: ${config.additions.newQuestions}`);

  // Step 3: Show difficulty targets
  console.log('\n🎯 Step 3: Difficulty Targets for New Questions');
  console.log('-'.repeat(70));
  
  Object.entries(result.difficultyTarget).forEach(([difficulty, count]) => {
    if (count > 0) {
      const percentage = ((count / config.additions.newQuestions) * 100).toFixed(0);
      console.log(`  ${difficulty}: ${count} questions (${percentage}%)`);
    }
  });

  // Step 4: Show lesson distribution
  console.log('\n📖 Step 4: Lesson Structure with Question Distribution');
  console.log('-'.repeat(70));
  
  result.outline.lessons.slice(0, 5).forEach((lesson, idx) => {
    const reuseQuestions = result.reuseStrategy.distribution.get(lesson.dayNumber);
    console.log(`\n  Day ${lesson.dayNumber}: ${lesson.title}`);
    console.log(`    ├─ Reused questions: ${reuseQuestions?.length || 0}`);
    console.log(`    ├─ New questions needed: ${lesson.newQuestions}`);
    console.log(`    └─ Total pool: ${(reuseQuestions?.length || 0) + lesson.newQuestions}`);
  });

  if (result.outline.lessons.length > 5) {
    console.log(`\n  ... (${result.outline.lessons.length - 5} more lessons)`);
  }

  // Step 5: Summary
  console.log('\n✅ Summary');
  console.log('='.repeat(70));
  
  const totalReuseQuestions = Array.from(result.reuseStrategy.distribution.values())
    .reduce((sum, arr) => sum + arr.length, 0);
  const totalNewQuestions = result.outline.lessons
    .reduce((sum, l) => sum + l.newQuestions, 0);
  const totalQuestionPool = totalReuseQuestions + totalNewQuestions;

  console.log(`  📊 Question Pool Statistics:`);
  console.log(`     Total questions: ${totalQuestionPool}`);
  console.log(`     - Reused from Stage 1: ${totalReuseQuestions} (${((totalReuseQuestions/totalQuestionPool)*100).toFixed(1)}%)`);
  console.log(`     - New for Stage 2: ${totalNewQuestions} (${((totalNewQuestions/totalQuestionPool)*100).toFixed(1)}%)`);
  
  console.log(`\n  🎓 Course Requirements:`);
  console.log(`     Minimum questions for certification: 100`);
  console.log(`     Actual pool size: ${totalQuestionPool}`);
  console.log(`     Status: ${totalQuestionPool >= 100 ? '✅ Meets requirement' : '❌ Below requirement'}`);

  console.log(`\n  🔗 Progression Chain:`);
  console.log(`     Stage 1: ${config.sourceCourseId}`);
  console.log(`     Stage 2: ${config.targetCourseId} (requires Stage 1)`);
  console.log(`     Prerequisite enforcement: ${config.reuseContent.prerequisites ? 'Enabled' : 'Disabled'}`);

  console.log('\n💡 Next Steps:');
  console.log('   1. Generate lesson content for each day');
  console.log('   2. Create 50 new quiz questions with target difficulty mix');
  console.log('   3. Distribute reused questions across lessons');
  console.log('   4. Link prerequisite chain');
  console.log('   5. Enable certification');
  console.log('   6. Validate and deploy');

  console.log('\n' + '='.repeat(70));
  console.log('Demo complete! 🎉\n');

  process.exit(0);
}

demo().catch(error => {
  console.error('❌ Demo failed:', error);
  process.exit(1);
});
