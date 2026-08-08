/**
 * Add high-quality quiz questions to Stage 1: AI for Dummies
 * Following content quality standards - standalone, scenario-based, application type
 */

import connectDB from '../app/lib/mongodb';
import { Lesson } from '../app/lib/models';
import { enforceQuizQuestionQuality } from '../app/lib/content-quality/enforcement';
import { EnforcementLevel } from '../app/lib/content-quality/enforcement';
import { randomUUID } from 'crypto';

const questions = [
  {
    difficulty: 'EASY',
    questionText: 'Your friend asks, "How does Netflix know what I want to watch?" Which explanation best describes the AI involved?',
    options: [
      'Netflix employees manually watch your viewing and recommend shows',
      'AI analyzes patterns in what you watch and finds similar content other users enjoyed',
      'The system randomly suggests popular shows to everyone',
      'Netflix uses a simple alphabetical sorting algorithm'
    ],
    correctAnswer: 'AI analyzes patterns in what you watch and finds similar content other users enjoyed',
    explanation: 'Recommendation systems use AI to find patterns in user behavior and preferences. They learn from what you watch, how long you watch, and what similar users enjoyed to make personalized suggestions.',
    category: 'Course Specific',
    questionType: 'application',
  },
  {
    difficulty: 'EASY',
    questionText: 'A small business owner says, "I want AI to help my shop." Which is the most practical first step?',
    options: [
      'Hire a team of data scientists immediately',
      'Identify specific repetitive tasks that could be automated',
      'Buy expensive AI hardware and servers',
      'Replace all employees with AI systems'
    ],
    correctAnswer: 'Identify specific repetitive tasks that could be automated',
    explanation: 'Starting with AI requires identifying clear, specific use cases. Look for repetitive tasks like inventory tracking, customer inquiry responses, or scheduling. This practical approach yields faster results than building infrastructure first.',
    category: 'Course Specific',
    questionType: 'application',
  },
  {
    difficulty: 'MEDIUM',
    questionText: 'Your manager asks, "Should we use AI or regular software for invoice processing?" The company processes 50 invoices weekly with varying formats. What factors suggest AI might help?',
    options: [
      'The invoices all follow exactly the same format',
      'Invoices come in many different formats and layouts',
      'The process never changes',
      'There are only 5 invoices per year'
    ],
    correctAnswer: 'Invoices come in many different formats and layouts',
    explanation: 'AI excels when dealing with variety and patterns. Different invoice formats make rule-based programming difficult, but AI can learn to extract key information regardless of layout. The volume (50/week) also provides enough data for the AI to learn patterns.',
    category: 'Course Specific',
    questionType: 'application',
  },
  {
    difficulty: 'MEDIUM',
    questionText: 'A colleague worries, "AI will take my customer service job." Based on how AI currently works, which response is most accurate?',
    options: [
      'AI will handle all customer interactions within months',
      'AI will likely handle routine questions, while humans focus on complex issues and emotional support',
      'AI cannot assist with customer service at all',
      'Customer service roles will completely disappear'
    ],
    correctAnswer: 'AI will likely handle routine questions, while humans focus on complex issues and emotional support',
    explanation: 'Current AI is good at handling routine, predictable queries but struggles with complex problems requiring empathy, creativity, or nuanced understanding. The realistic outcome is AI handling simple tasks while humans tackle sophisticated issues.',
    category: 'Course Specific',
    questionType: 'critical-thinking',
  },
  {
    difficulty: 'MEDIUM',
    questionText: 'You are testing an AI writing assistant. It produces good content but occasionally includes factually incorrect information. What does this tell you about AI limitations?',
    options: [
      'The AI is broken and should not be used',
      'AI can generate plausible-sounding content but lacks real understanding and may confabulate',
      'All AI writing assistants are completely unreliable',
      'The AI needs more training data to become perfect'
    ],
    correctAnswer: 'AI can generate plausible-sounding content but lacks real understanding and may confabulate',
    explanation: 'This is a known AI limitation called "hallucination" or confabulation. AI generates text based on patterns, not true understanding. Even with more data, AI can produce confident-sounding but incorrect information. Human verification remains essential.',
    category: 'Course Specific',
    questionType: 'critical-thinking',
  },
  {
    difficulty: 'HARD',
    questionText: 'A startup wants to build an AI that predicts which customers will cancel their subscription. They have 200 customer records. What is the main challenge?',
    options: [
      'AI cannot predict customer behavior',
      '200 examples may be too few for the AI to learn reliable patterns',
      'They need quantum computers for this task',
      'Subscription prediction is too simple for AI'
    ],
    correctAnswer: '200 examples may be too few for the AI to learn reliable patterns',
    explanation: 'Data quantity matters significantly. With only 200 records, the AI may struggle to find robust patterns, especially if customer behavior is complex. More data helps AI distinguish real patterns from noise. They might need hundreds or thousands of examples for reliable predictions.',
    category: 'Course Specific',
    questionType: 'critical-thinking',
  },
  {
    difficulty: 'HARD',
    questionText: 'Your team debates two approaches: (1) spending 3 months building custom AI or (2) using an existing AI tool with a monthly subscription. The task is standard text summarization. Which factors favor option 2?',
    options: [
      'Custom AI always performs better',
      'Time-to-value and avoiding reinventing common solutions',
      'Subscription costs are always higher long-term',
      'Existing tools cannot be customized'
    ],
    correctAnswer: 'Time-to-value and avoiding reinventing common solutions',
    explanation: 'For standard tasks like text summarization, existing tools offer immediate value. Building custom AI requires significant time, expertise, and ongoing maintenance. Unless the task is highly specialized, leveraging proven solutions often makes business sense.',
    category: 'Course Specific',
    questionType: 'critical-thinking',
  },
];

async function addQuestions() {
  console.log('\n📝 Adding Quality Quiz Questions to Stage 1\n');
  console.log('='.repeat(70));
  
  await connectDB();

  const lesson = await Lesson.findOne({ lessonId: 'AI_DUMMIES_1DAY_EN_L01' });
  if (!lesson) throw new Error('Lesson not found');

  console.log(`Found lesson: ${lesson.title}`);
  console.log(`\nValidating ${questions.length} questions...\n`);

  const validatedQuestions = [];
  let passed = 0;
  let failed = 0;

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    console.log(`Question ${i + 1}/${questions.length}:`);
    
    const questionData = {
      uuid: randomUUID(),
      question: q.questionText,
      correctAnswer: q.correctAnswer,
      wrongAnswers: q.options.filter(opt => opt !== q.correctAnswer),
      explanation: q.explanation,
      difficulty: q.difficulty,
      category: q.category,
      questionType: q.questionType,
      hashtags: ['#ai-basics', '#practical'],
      isActive: true,
      isCourseSpecific: true,
      lessonId: lesson.lessonId,
    };

    const result = enforceQuizQuestionQuality(questionData, {
      level: EnforcementLevel.STRICT,
      context: 'agent_generation',
      enforcedBy: 'agent',
      expectedLanguage: 'en',
    });

    if (result.allowed) {
      console.log(`  ✅ PASSED (score: ${result.validation.qualityScore}/100)`);
      validatedQuestions.push(q);
      passed++;
    } else {
      console.log(`  ❌ BLOCKED: ${result.enforcement.reason}`);
      console.log(`  Errors:`, result.validation.errors);
      failed++;
    }
  }

  console.log(`\n${'='.repeat(70)}`);
  console.log(`\n✅ Validated: ${passed} passed, ${failed} failed`);

  if (passed > 0) {
    lesson.quizQuestions = validatedQuestions as any;
    await lesson.save();
    console.log(`\n✅ Added ${passed} questions to lesson`);
  }

  console.log('\n');
  process.exit(0);
}

addQuestions();
