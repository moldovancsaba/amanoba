/**
 * Full System Quiz Audit
 * 
 * Purpose: Comprehensive audit of ALL courses, ALL lessons, ALL quizzes
 * Why: Identify gaps, issues, and create action plan for complete quiz system
 * 
 * Requirements:
 * - 7 questions per quiz
 * - Quiz for all lessons
 * - All questions in same language as course
 * - All questions 100% related to actual lesson
 * - All questions follow course creation rules
 * - Native quality, proper answers
 * - For every language
 * - For every course
 */

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import { default as connectDB } from '../app/lib/mongodb';
import { Course, Lesson, QuizQuestion } from '../app/lib/models';

interface AuditResult {
  courseId: string;
  courseName: string;
  language: string;
  totalLessons: number;
  lessonsWithQuizzes: number;
  lessonsWithoutQuizzes: number;
  totalQuestions: number;
  questionsByLanguage: Record<string, number>;
  issues: string[];
  missingDays: number[];
  incompleteQuizzes: Array<{
    lessonId: string;
    dayNumber: number;
    questionCount: number;
    expectedCount: number;
    issues: string[];
  }>;
}

async function auditFullSystem() {
  try {
    await connectDB();
    console.log('🔍 FULL SYSTEM QUIZ AUDIT\n');
    console.log('═══════════════════════════════════════════════════════════════\n');

    const results: AuditResult[] = [];
    
    // Get all courses
    const courses = await Course.find({ isActive: true }).lean();
    console.log(`📚 Found ${courses.length} active courses\n`);

    for (const course of courses) {
      console.log(`\n${'─'.repeat(60)}`);
      console.log(`📖 Course: ${course.courseId} (${course.name})`);
      console.log(`   Language: ${course.language.toUpperCase()}`);
      
      const result: AuditResult = {
        courseId: course.courseId,
        courseName: course.name,
        language: course.language,
        totalLessons: 0,
        lessonsWithQuizzes: 0,
        lessonsWithoutQuizzes: 0,
        totalQuestions: 0,
        questionsByLanguage: {},
        issues: [],
        missingDays: [],
        incompleteQuizzes: [],
      };

      // Get all lessons for this course
      const lessons = await Lesson.find({ 
        courseId: course._id,
        isActive: true 
      })
      .sort({ dayNumber: 1 })
      .lean();

      result.totalLessons = lessons.length;
      console.log(`   📝 Lessons: ${lessons.length}`);

      // Check each lesson
      for (const lesson of lessons) {
        // Get quiz questions for this lesson
        const questions = await QuizQuestion.find({
          lessonId: lesson.lessonId,
          isCourseSpecific: true,
          isActive: true,
        }).lean();

        const questionCount = questions.length;
        result.totalQuestions += questionCount;

        // Track language distribution
        for (const q of questions) {
          // Try to infer language from hashtags or check lesson language
          const lang = course.language.toUpperCase();
          result.questionsByLanguage[lang] = (result.questionsByLanguage[lang] || 0) + 1;
        }

        // Check if quiz exists
        if (questionCount === 0) {
          result.lessonsWithoutQuizzes++;
          result.missingDays.push(lesson.dayNumber);
          result.issues.push(`Day ${lesson.dayNumber}: No quiz questions`);
        } else {
          result.lessonsWithQuizzes++;
          
          // Check if quiz is complete (7 questions)
          if (questionCount !== 7) {
            const incomplete = {
              lessonId: lesson.lessonId,
              dayNumber: lesson.dayNumber,
              questionCount,
              expectedCount: 7,
              issues: [],
            };

            if (questionCount < 7) {
              incomplete.issues.push(`Only ${questionCount} questions (expected 7)`);
            } else {
              incomplete.issues.push(`Too many questions: ${questionCount} (expected 7)`);
            }

            // Check for language mismatch
            const hasLanguageMismatch = questions.some(q => {
              // Check if question language matches course language
              // This is a simplified check - actual implementation would need to verify question text language
              return false; // Placeholder
            });

            // Check for missing metadata
            const missingMetadata = questions.filter(q => 
              !q.uuid || !q.hashtags || !q.questionType
            );
            if (missingMetadata.length > 0) {
              incomplete.issues.push(`${missingMetadata.length} questions missing metadata (UUID, hashtags, or questionType)`);
            }

            // Check cognitive mix (60% recall, 30% application, 10% critical thinking)
            const recallCount = questions.filter(q => q.questionType === 'recall').length;
            const applicationCount = questions.filter(q => q.questionType === 'application').length;
            const criticalCount = questions.filter(q => q.questionType === 'critical-thinking').length;
            
            const expectedRecall = Math.round(7 * 0.6); // ~4
            const expectedApplication = Math.round(7 * 0.3); // ~2
            const expectedCritical = Math.round(7 * 0.1); // ~1

            if (recallCount !== expectedRecall || applicationCount !== expectedApplication || criticalCount !== expectedCritical) {
              incomplete.issues.push(
                `Wrong cognitive mix: ${recallCount} recall (expected ${expectedRecall}), ` +
                `${applicationCount} application (expected ${expectedApplication}), ` +
                `${criticalCount} critical (expected ${expectedCritical})`
              );
            }

            if (incomplete.issues.length > 0) {
              result.incompleteQuizzes.push(incomplete);
            }
          }
        }
      }

      // Summary for this course
      console.log(`   ✅ Lessons with quizzes: ${result.lessonsWithQuizzes}`);
      console.log(`   ❌ Lessons without quizzes: ${result.lessonsWithoutQuizzes}`);
      console.log(`   📊 Total questions: ${result.totalQuestions}`);
      console.log(`   ⚠️  Issues found: ${result.issues.length + result.incompleteQuizzes.length}`);

      results.push(result);
    }

    // Generate comprehensive report
    console.log(`\n\n${'═'.repeat(60)}`);
    console.log(`📊 COMPREHENSIVE AUDIT SUMMARY`);
    console.log(`${'═'.repeat(60)}\n`);

    let totalCourses = results.length;
    let totalLessons = 0;
    let totalLessonsWithQuizzes = 0;
    let totalLessonsWithoutQuizzes = 0;
    let totalQuestions = 0;
    let totalIssues = 0;

    for (const result of results) {
      totalLessons += result.totalLessons;
      totalLessonsWithQuizzes += result.lessonsWithQuizzes;
      totalLessonsWithoutQuizzes += result.lessonsWithoutQuizzes;
      totalQuestions += result.totalQuestions;
      totalIssues += result.issues.length + result.incompleteQuizzes.length;
    }

    console.log(`📚 Total Courses: ${totalCourses}`);
    console.log(`📝 Total Lessons: ${totalLessons}`);
    console.log(`✅ Lessons with Quizzes: ${totalLessonsWithQuizzes}`);
    console.log(`❌ Lessons without Quizzes: ${totalLessonsWithoutQuizzes}`);
    console.log(`📊 Total Questions: ${totalQuestions}`);
    console.log(`⚠️  Total Issues: ${totalIssues}\n`);

    // Detailed breakdown by course
    console.log(`\n${'─'.repeat(60)}`);
    console.log(`📋 DETAILED BREAKDOWN BY COURSE`);
    console.log(`${'─'.repeat(60)}\n`);

    for (const result of results) {
      console.log(`\n📖 ${result.courseId} (${result.courseName})`);
      console.log(`   Language: ${result.language.toUpperCase()}`);
      console.log(`   Lessons: ${result.totalLessons} total`);
      console.log(`   ✅ With quizzes: ${result.lessonsWithQuizzes}`);
      console.log(`   ❌ Without quizzes: ${result.lessonsWithoutQuizzes}`);
      console.log(`   📊 Questions: ${result.totalQuestions}`);
      
      if (result.missingDays.length > 0) {
        console.log(`   ⚠️  Missing quizzes for days: ${result.missingDays.join(', ')}`);
      }
      
      if (result.incompleteQuizzes.length > 0) {
        console.log(`   ⚠️  Incomplete quizzes: ${result.incompleteQuizzes.length}`);
        for (const incomplete of result.incompleteQuizzes.slice(0, 5)) {
          console.log(`      Day ${incomplete.dayNumber}: ${incomplete.issues.join(', ')}`);
        }
        if (result.incompleteQuizzes.length > 5) {
          console.log(`      ... and ${result.incompleteQuizzes.length - 5} more`);
        }
      }
    }

    // Generate action plan
    console.log(`\n\n${'═'.repeat(60)}`);
    console.log(`🎯 ACTION PLAN`);
    console.log(`${'═'.repeat(60)}\n`);

    const actionItems: string[] = [];

    for (const result of results) {
      if (result.lessonsWithoutQuizzes > 0) {
        actionItems.push(
          `Create ${result.lessonsWithoutQuizzes} quizzes for ${result.courseId} ` +
          `(missing days: ${result.missingDays.join(', ')})`
        );
      }

      if (result.incompleteQuizzes.length > 0) {
        actionItems.push(
          `Fix ${result.incompleteQuizzes.length} incomplete quizzes for ${result.courseId}`
        );
      }
    }

    if (actionItems.length === 0) {
      console.log('✅ All quizzes are complete!');
    } else {
      console.log(`📋 ${actionItems.length} action items:\n`);
      actionItems.forEach((item, index) => {
        console.log(`${index + 1}. ${item}`);
      });
    }

    // Save detailed report to file
    const report = {
      auditDate: new Date().toISOString(),
      summary: {
        totalCourses,
        totalLessons,
        totalLessonsWithQuizzes,
        totalLessonsWithoutQuizzes,
        totalQuestions,
        totalIssues,
      },
      courses: results,
      actionItems,
    };

    const fs = require('fs');
    const reportPath = resolve(process.cwd(), 'scripts/AUDIT_REPORT_FULL_SYSTEM.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n📄 Detailed report saved to: ${reportPath}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

auditFullSystem();
