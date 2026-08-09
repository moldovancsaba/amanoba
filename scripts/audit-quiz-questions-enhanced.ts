/**
 * Enhanced Quiz Question Audit Script
 * 
 * Comprehensive audit that includes both quantitative and qualitative checks:
 * - Quantitative: Count and minimum requirements
 * - Qualitative: Content quality, language integrity, difficulty distribution
 */

import connectDB from '../app/lib/mongodb';
import { Course, QuizQuestion } from '../app/lib/models';
import { enforceQuizQuestionQuality, EnforcementLevel } from '../app/lib/content-quality/enforcement';
import { QuestionDifficulty } from '../app/lib/models/quiz-question';

interface QuizIssue {
  courseId: string;
  name: string;
  language: string;
  current: number;
  needed: number;
  shortage: number;
}

interface QualityIssue {
  questionId: string;
  questionText: string;
  issueType: string;
  severity: 'high' | 'medium' | 'low';
  details: string;
}

interface CourseQualityMetrics {
  courseId: string;
  name: string;
  language: string;
  quantitative: {
    total: number;
    needed: number;
    status: 'pass' | 'fail';
    shortage?: number;
  };
  qualitative: {
    averageScore: number;
    passedValidation: number;
    failedValidation: number;
    issues: QualityIssue[];
  };
  difficulty: {
    EASY: number;
    MEDIUM: number;
    HARD: number;
    EXPERT: number;
    distribution: string;
  };
  languageIntegrity: {
    questionsChecked: number;
    englishLeakageFound: number;
    leakageQuestions: string[];
  };
}

// Common English words to detect leakage in non-English content
const COMMON_ENGLISH_WORDS = [
  'the', 'is', 'are', 'was', 'were', 'will', 'would', 'should', 'could',
  'have', 'has', 'had', 'do', 'does', 'did', 'can', 'may', 'might',
  'this', 'that', 'these', 'those', 'what', 'which', 'who', 'when', 'where',
  'how', 'why', 'and', 'or', 'but', 'if', 'then', 'else', 'while',
  'Learning goal', 'Success criteria', 'What is', 'How to', 'Why it matters',
  'in this lesson', 'today we', 'you learned', 'as mentioned'
];

function detectEnglishLeakage(text: string, expectedLanguage: string): boolean {
  if (expectedLanguage === 'en') return false; // Skip for English content
  
  const lowerText = text.toLowerCase();
  
  // Check for common English phrases
  for (const word of COMMON_ENGLISH_WORDS) {
    if (lowerText.includes(word.toLowerCase())) {
      return true;
    }
  }
  
  return false;
}

function assessDifficultyDistribution(distribution: Record<string, number>): string {
  const total = Object.values(distribution).reduce((sum, count) => sum + count, 0);
  if (total === 0) return 'No questions';
  
  const percentages = {
    EASY: Math.round((distribution.EASY / total) * 100),
    MEDIUM: Math.round((distribution.MEDIUM / total) * 100),
    HARD: Math.round((distribution.HARD / total) * 100),
    EXPERT: Math.round((distribution.EXPERT / total) * 100),
  };
  
  // Ideal distribution: 30% EASY, 40% MEDIUM, 20% HARD, 10% EXPERT
  if (percentages.EASY >= 25 && percentages.EASY <= 40 &&
      percentages.MEDIUM >= 35 && percentages.MEDIUM <= 50) {
    return '✅ Balanced';
  } else if (percentages.EASY > 50) {
    return '⚠️  Too Easy';
  } else if (percentages.HARD + percentages.EXPERT > 50) {
    return '⚠️  Too Hard';
  } else if (percentages.MEDIUM > 70) {
    return '⚠️  Lacks Variety';
  }
  
  return '⚠️  Unbalanced';
}

async function auditCourseQuestions(courseId: string, courseName: string, language: string, lessonQuizCount: number): Promise<CourseQualityMetrics> {
  const course = await Course.findOne({ courseId }).lean();
  if (!course) {
    throw new Error(`Course ${courseId} not found`);
  }
  
  const quizQuestions = await QuizQuestion.find({ courseId: course._id }).lean();
  const totalQuestions = quizQuestions.length;
  const minRequired = lessonQuizCount + 10;
  
  // Quantitative check
  const quantitative = {
    total: totalQuestions,
    needed: minRequired,
    status: (totalQuestions >= minRequired ? 'pass' : 'fail') as 'pass' | 'fail',
    shortage: totalQuestions < minRequired ? minRequired - totalQuestions : undefined,
  };
  
  // Qualitative checks
  const qualityIssues: QualityIssue[] = [];
  let totalScore = 0;
  let passedValidation = 0;
  let failedValidation = 0;
  
  // Difficulty distribution
  const difficultyDistribution: Record<string, number> = {
    EASY: 0,
    MEDIUM: 0,
    HARD: 0,
    EXPERT: 0,
  };
  
  // Language integrity
  let englishLeakageCount = 0;
  const leakageQuestions: string[] = [];
  
  // Check each question
  for (const question of quizQuestions) {
    // Count difficulty
    difficultyDistribution[question.difficulty as string] = (difficultyDistribution[question.difficulty as string] || 0) + 1;
    
    // Quality validation
    try {
      const validationResult = enforceQuizQuestionQuality(question as any, {
        level: EnforcementLevel.STRICT,
        context: 'audit',
        enforcedBy: 'enhanced-audit',
        expectedLanguage: language,
      });
      
      totalScore += validationResult.validation.score;
      
      if (validationResult.allowed) {
        passedValidation++;
      } else {
        failedValidation++;
        
        qualityIssues.push({
          questionId: question.uuid || String(question._id),
          questionText: question.question.substring(0, 100),
          issueType: 'validation_failed',
          severity: 'high',
          details: validationResult.enforcement.reason || 'Failed quality validation',
        });
      }
      
      // Check for specific issues
      if (validationResult.validation.errors && validationResult.validation.errors.length > 0) {
        validationResult.validation.errors.forEach(error => {
          qualityIssues.push({
            questionId: question.uuid || String(question._id),
            questionText: question.question.substring(0, 100),
            issueType: 'validation_error',
            severity: 'medium',
            details: error,
          });
        });
      }
    } catch (error) {
      failedValidation++;
      qualityIssues.push({
        questionId: question.uuid || String(question._id),
        questionText: question.question.substring(0, 100),
        issueType: 'validation_exception',
        severity: 'high',
        details: `Exception during validation: ${error}`,
      });
    }
    
    // Language integrity check
    if (language !== 'en') {
      const questionContent = `${question.question} ${question.explanation || ''} ${(question.options || []).join(' ')} ${question.correctAnswer || ''} ${(question.wrongAnswers || []).join(' ')}`;
      
      if (detectEnglishLeakage(questionContent, language)) {
        englishLeakageCount++;
        leakageQuestions.push(question.question.substring(0, 80) + '...');
        
        qualityIssues.push({
          questionId: question.uuid || String(question._id),
          questionText: question.question.substring(0, 100),
          issueType: 'english_leakage',
          severity: 'high',
          details: `Detected English content in ${language} question`,
        });
      }
    }
  }
  
  const averageScore = totalQuestions > 0 ? Math.round(totalScore / totalQuestions) : 0;
  
  return {
    courseId,
    name: courseName,
    language,
    quantitative,
    qualitative: {
      averageScore,
      passedValidation,
      failedValidation,
      issues: qualityIssues,
    },
    difficulty: {
      ...difficultyDistribution,
      distribution: assessDifficultyDistribution(difficultyDistribution),
    },
    languageIntegrity: {
      questionsChecked: totalQuestions,
      englishLeakageFound: englishLeakageCount,
      leakageQuestions,
    },
  };
}

(async () => {
  await connectDB();
  
  console.log('📊 ENHANCED QUIZ QUESTION AUDIT');
  console.log('Quantitative + Qualitative Analysis');
  console.log('=' .repeat(70));
  console.log('');
  
  const courses = await Course.find({}).sort({ courseId: 1 });
  
  const allMetrics: CourseQualityMetrics[] = [];
  const quantitativeIssues: QuizIssue[] = [];
  
  for (const course of courses) {
    const lessonQuizCount = course.lessonQuizPolicy?.questionCount || 3;
    
    console.log(`\n🔍 ${course.courseId} (${course.language || 'en'})`);
    console.log('─'.repeat(70));
    
    const metrics = await auditCourseQuestions(
      course.courseId,
      course.name,
      course.language || 'en',
      lessonQuizCount
    );
    
    allMetrics.push(metrics);
    
    // Quantitative
    const quantStatus = metrics.quantitative.status === 'pass' ? '✅' : '❌';
    console.log(`\n${quantStatus} QUANTITATIVE CHECK`);
    console.log(`   Total Questions: ${metrics.quantitative.total}`);
    console.log(`   Minimum Needed: ${metrics.quantitative.needed} (${lessonQuizCount} lesson + 10 exam)`);
    
    if (metrics.quantitative.status === 'fail') {
      console.log(`   ⚠️  SHORTAGE: ${metrics.quantitative.shortage} questions needed`);
      quantitativeIssues.push({
        courseId: course.courseId,
        name: course.name,
        language: course.language || 'en',
        current: metrics.quantitative.total,
        needed: metrics.quantitative.needed,
        shortage: metrics.quantitative.shortage || 0,
      });
    }
    
    // Qualitative
    const qualStatus = metrics.qualitative.averageScore >= 75 ? '✅' : metrics.qualitative.averageScore >= 60 ? '⚠️ ' : '❌';
    console.log(`\n${qualStatus} QUALITATIVE CHECK`);
    console.log(`   Average Quality Score: ${metrics.qualitative.averageScore}/100`);
    console.log(`   Passed Validation: ${metrics.qualitative.passedValidation}/${metrics.quantitative.total}`);
    console.log(`   Failed Validation: ${metrics.qualitative.failedValidation}`);
    console.log(`   Quality Issues: ${metrics.qualitative.issues.length}`);
    
    // Difficulty distribution
    const diffStatus = metrics.difficulty.distribution.includes('✅') ? '✅' : '⚠️ ';
    console.log(`\n${diffStatus} DIFFICULTY DISTRIBUTION`);
    console.log(`   EASY: ${metrics.difficulty.EASY} (${Math.round((metrics.difficulty.EASY / metrics.quantitative.total) * 100)}%)`);
    console.log(`   MEDIUM: ${metrics.difficulty.MEDIUM} (${Math.round((metrics.difficulty.MEDIUM / metrics.quantitative.total) * 100)}%)`);
    console.log(`   HARD: ${metrics.difficulty.HARD} (${Math.round((metrics.difficulty.HARD / metrics.quantitative.total) * 100)}%)`);
    console.log(`   EXPERT: ${metrics.difficulty.EXPERT} (${Math.round((metrics.difficulty.EXPERT / metrics.quantitative.total) * 100)}%)`);
    console.log(`   Assessment: ${metrics.difficulty.distribution}`);
    
    // Language integrity (for non-English courses)
    if (course.language && course.language !== 'en') {
      const langStatus = metrics.languageIntegrity.englishLeakageFound === 0 ? '✅' : '❌';
      console.log(`\n${langStatus} LANGUAGE INTEGRITY`);
      console.log(`   Questions Checked: ${metrics.languageIntegrity.questionsChecked}`);
      console.log(`   English Leakage Found: ${metrics.languageIntegrity.englishLeakageFound}`);
      
      if (metrics.languageIntegrity.englishLeakageFound > 0) {
        console.log(`   Affected Questions:`);
        metrics.languageIntegrity.leakageQuestions.slice(0, 3).forEach(q => {
          console.log(`     - "${q}"`);
        });
        if (metrics.languageIntegrity.leakageQuestions.length > 3) {
          console.log(`     ... and ${metrics.languageIntegrity.leakageQuestions.length - 3} more`);
        }
      }
    }
    
    // Show top quality issues
    if (metrics.qualitative.issues.length > 0) {
      console.log(`\n⚠️  TOP QUALITY ISSUES:`);
      const highSeverityIssues = metrics.qualitative.issues
        .filter(i => i.severity === 'high')
        .slice(0, 5);
      
      highSeverityIssues.forEach((issue, idx) => {
        console.log(`   ${idx + 1}. ${issue.issueType}: "${issue.questionText}..."`);
        console.log(`      ${issue.details}`);
      });
      
      if (metrics.qualitative.issues.length > 5) {
        console.log(`   ... and ${metrics.qualitative.issues.length - 5} more issues`);
      }
    }
  }
  
  // Overall summary
  console.log('\n\n' + '='.repeat(70));
  console.log('📋 OVERALL SUMMARY');
  console.log('='.repeat(70));
  
  const totalCourses = allMetrics.length;
  const quantPassed = allMetrics.filter(m => m.quantitative.status === 'pass').length;
  const qualPassed = allMetrics.filter(m => m.qualitative.averageScore >= 75).length;
  const qualWarning = allMetrics.filter(m => m.qualitative.averageScore >= 60 && m.qualitative.averageScore < 75).length;
  const qualFailed = allMetrics.filter(m => m.qualitative.averageScore < 60).length;
  
  console.log(`\nTotal Courses Audited: ${totalCourses}`);
  console.log('');
  console.log('Quantitative (Count):');
  console.log(`  ✅ Pass: ${quantPassed}`);
  console.log(`  ❌ Fail: ${totalCourses - quantPassed}`);
  console.log('');
  console.log('Qualitative (Content Quality):');
  console.log(`  ✅ Excellent (≥75): ${qualPassed}`);
  console.log(`  ⚠️  Good (60-74): ${qualWarning}`);
  console.log(`  ❌ Needs Improvement (<60): ${qualFailed}`);
  
  // Recommendations
  console.log('\n\n' + '='.repeat(70));
  console.log('💡 RECOMMENDATIONS');
  console.log('='.repeat(70));
  
  if (quantitativeIssues.length > 0) {
    console.log('\n📊 Quantitative Issues:');
    quantitativeIssues.forEach(issue => {
      console.log(`  - ${issue.courseId}: Add ${issue.shortage} more questions`);
    });
  }
  
  const highQualityIssues = allMetrics.filter(m => m.qualitative.failedValidation > 0);
  if (highQualityIssues.length > 0) {
    console.log('\n✍️  Quality Issues:');
    highQualityIssues.forEach(m => {
      console.log(`  - ${m.courseId}: ${m.qualitative.failedValidation} questions failed validation`);
    });
  }
  
  const languageIssues = allMetrics.filter(m => m.languageIntegrity.englishLeakageFound > 0);
  if (languageIssues.length > 0) {
    console.log('\n🌍 Language Integrity Issues:');
    languageIssues.forEach(m => {
      console.log(`  - ${m.courseId}: ${m.languageIntegrity.englishLeakageFound} questions have English leakage`);
    });
  }
  
  const difficultyIssues = allMetrics.filter(m => m.difficulty.distribution.includes('⚠️'));
  if (difficultyIssues.length > 0) {
    console.log('\n📈 Difficulty Distribution Issues:');
    difficultyIssues.forEach(m => {
      console.log(`  - ${m.courseId}: ${m.difficulty.distribution}`);
    });
  }
  
  if (quantitativeIssues.length === 0 && highQualityIssues.length === 0 && 
      languageIssues.length === 0 && difficultyIssues.length === 0) {
    console.log('\n✅ All courses meet both quantitative and qualitative standards!');
  }
  
  console.log('');
  
  process.exit(0);
})();
