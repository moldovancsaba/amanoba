import connectDB from '../app/lib/mongodb';
import { Lesson } from '../app/lib/models';

// Self-check questions for each lesson
const selfCheckData = [
  {
    dayNumber: 1,
    selfCheck: {
      instruction: 'Review the AI applications covered in this lesson and reflect on your understanding.',
      questions: [
        'Can you identify at least 3 AI applications you use in your daily life?',
        'What patterns do successful AI applications share?',
        'Which industry AI application surprised you the most and why?',
        'How would you explain the difference between AI-powered and rule-based systems to a friend?',
      ],
    },
  },
  {
    dayNumber: 2,
    selfCheck: {
      instruction: 'Test your understanding of when to use AI vs traditional programming.',
      questions: [
        'Can you name 3 scenarios where traditional programming is better than AI?',
        'Can you name 3 scenarios where AI is better than traditional programming?',
        'What are the main trade-offs between AI and traditional approaches?',
        'How would you decide which approach to use for a new project?',
      ],
    },
  },
  {
    dayNumber: 3,
    selfCheck: {
      instruction: 'Apply the AI decision framework to real-world scenarios.',
      questions: [
        'Can you list the 5 key factors in the AI suitability checklist?',
        'Think of a problem at work - would AI be suitable? Why or why not?',
        'What data would you need to solve that problem with AI?',
        'How would you measure success for an AI solution?',
      ],
    },
  },
  {
    dayNumber: 4,
    selfCheck: {
      instruction: 'Reflect on practical AI tool usage and best practices.',
      questions: [
        'What are 3 best practices for using AI tools effectively?',
        'Can you identify common pitfalls when implementing AI solutions?',
        'How would you validate an AI tool\'s output quality?',
        'What would you do if an AI tool gives unexpected results?',
      ],
    },
  },
  {
    dayNumber: 5,
    selfCheck: {
      instruction: 'Consider how you would apply today\'s concepts to your work.',
      questions: [
        'What task in your daily work could benefit from AI assistance?',
        'What data is already available for that task?',
        'What level of accuracy would be acceptable?',
        'What are the potential risks or concerns?',
      ],
    },
  },
  {
    dayNumber: 6,
    selfCheck: {
      instruction: 'Review your understanding of AI implementation strategies.',
      questions: [
        'What are the key steps in implementing an AI solution?',
        'How would you test an AI system before deployment?',
        'What monitoring would you put in place?',
        'How would you handle AI system failures?',
      ],
    },
  },
  {
    dayNumber: 7,
    selfCheck: {
      instruction: 'Evaluate your knowledge of AI ethics and responsible use.',
      questions: [
        'What ethical considerations apply to AI systems?',
        'How can you ensure AI systems are fair and unbiased?',
        'What transparency should users have about AI decisions?',
        'How would you explain an AI decision to a stakeholder?',
      ],
    },
  },
  {
    dayNumber: 8,
    selfCheck: {
      instruction: 'Assess your understanding of AI data requirements.',
      questions: [
        'What makes training data "good quality"?',
        'How much data is typically needed for AI projects?',
        'What are common data quality issues?',
        'How would you improve data quality for an AI project?',
      ],
    },
  },
  {
    dayNumber: 9,
    selfCheck: {
      instruction: 'Think about AI performance evaluation.',
      questions: [
        'What metrics would you use to evaluate AI performance?',
        'How do you balance accuracy vs speed vs cost?',
        'What does "80% accurate" really mean in practice?',
        'When is 80% accuracy good enough vs when do you need 99%?',
      ],
    },
  },
  {
    dayNumber: 10,
    selfCheck: {
      instruction: 'Consider AI in production environments.',
      questions: [
        'What challenges arise when deploying AI to production?',
        'How would you handle AI model updates?',
        'What backup plans should exist for AI failures?',
        'How do you maintain AI systems over time?',
      ],
    },
  },
  {
    dayNumber: 11,
    selfCheck: {
      instruction: 'Reflect on AI team collaboration and communication.',
      questions: [
        'How would you communicate AI capabilities to non-technical stakeholders?',
        'What roles are needed on an AI project team?',
        'How do you set realistic expectations for AI projects?',
        'What would you do if an AI project isn\'t meeting goals?',
      ],
    },
  },
  {
    dayNumber: 12,
    selfCheck: {
      instruction: 'Think about AI cost-benefit analysis.',
      questions: [
        'What costs should you consider for an AI project?',
        'How do you calculate ROI for AI implementations?',
        'What hidden costs might emerge?',
        'How long does it typically take to see value from AI?',
      ],
    },
  },
  {
    dayNumber: 13,
    selfCheck: {
      instruction: 'Review advanced AI implementation patterns.',
      questions: [
        'What are hybrid AI approaches and when should you use them?',
        'How can you combine multiple AI models?',
        'What is the role of human oversight in AI systems?',
        'How do you handle edge cases that AI can\'t solve?',
      ],
    },
  },
  {
    dayNumber: 14,
    selfCheck: {
      instruction: 'Consider future trends and continuous learning.',
      questions: [
        'What AI trends are emerging in your industry?',
        'How will you stay current with AI developments?',
        'What skills should you develop next?',
        'How would you prepare your team for AI adoption?',
      ],
    },
  },
  {
    dayNumber: 15,
    selfCheck: {
      instruction: 'Synthesize your learning and create an action plan.',
      questions: [
        'What are the 3 most important things you learned?',
        'What will you do differently after this course?',
        'What AI project will you start first?',
        'How will you share this knowledge with your team?',
      ],
    },
  },
];

async function addSelfChecks() {
  console.log('\n📝 Adding Self-Check Questions to Stage 2 Lessons\n');
  console.log('='.repeat(70));
  
  await connectDB();

  const lessons = await Lesson.find({ lessonId: /^AI_ESS_L/ }).sort({ dayNumber: 1 });
  
  console.log(`\nFound ${lessons.length} Stage 2 lessons`);

  let updated = 0;
  for (const lesson of lessons) {
    const selfCheckForDay = selfCheckData.find(s => s.dayNumber === lesson.dayNumber);
    
    if (selfCheckForDay) {
      lesson.selfCheck = selfCheckForDay.selfCheck;
      await lesson.save();
      console.log(`  ✓ Day ${lesson.dayNumber}: Added ${selfCheckForDay.selfCheck.questions.length} questions`);
      updated++;
    }
  }

  console.log(`\n✅ Updated ${updated} lessons with self-check questions`);
  console.log('\n' + '='.repeat(70));
  console.log('\n📚 All lessons now have meaningful self-check questionnaires!\n');
  
  process.exit(0);
}

addSelfChecks();
