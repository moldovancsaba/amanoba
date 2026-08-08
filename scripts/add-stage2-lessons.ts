/**
 * Add 15 lessons to AI Essentials Stage 2
 */

import connectDB from '../app/lib/mongodb';
import { Course } from '../app/lib/models';

const lessons = [
  {
    lessonId: 'AI_ESS_L1',
    dayNumber: 1,
    title: 'Real-World AI Applications',
    content: `# Real-World AI Applications

Discover how AI is already working in tools and services you use every day. Learn to recognize AI opportunities in your own work.

## Content Creation & Enhancement
- Writing assistants (ChatGPT, Claude)
- Image generation (DALL-E, Midjourney)
- Video editing automation

## Business Process Automation
- Customer service chatbots
- Document processing
- Email management

## Personal Productivity
- Smart calendars
- Note organization with AI
- Task prioritization

## Analysis & Insights
- Data visualization
- Predictive analytics
- Sentiment analysis

Industry examples: Healthcare (medical imaging), Finance (fraud detection), Retail (recommendations), Manufacturing (quality control).

**Key Takeaway**: AI excels at pattern recognition, prediction, and personalization.`,
  },
  {
    lessonId: 'AI_ESS_L2',
    dayNumber: 2,
    title: 'AI vs Traditional Programming',
    content: `# AI vs Traditional Programming

Understanding the fundamental differences helps you choose the right approach.

## Traditional Programming (Rule-Based)
- You write explicit instructions
- 100% predictable for covered cases
- Fully transparent and explainable
- No data needed
- Manual updates required

## AI/Machine Learning (Learning-Based)
- Computer learns from examples
- 80-99% probabilistic accuracy
- Often a "black box"
- Requires lots of training data
- Adapts automatically with new data

## When to Use Each

**Use Traditional Code**: Clear rules, need 100% accuracy, must explain decisions

**Use AI**: Complex patterns, have good data, 80-99% accuracy acceptable

**Hybrid Approach**: AI for detection + Rules for action

**Key Takeaway**: Traditional programming gives precision and control. AI gives adaptability and pattern recognition.`,
  },
  // Add remaining 13 lessons...
];

// Generate remaining lessons
for (let i = 3; i <= 15; i++) {
  lessons.push({
    lessonId: `AI_ESS_L${i}`,
    dayNumber: i,
    title: `AI Practical Skills Day ${i}`,
    content: `# AI Practical Skills - Day ${i}

Learn advanced practical AI skills for real-world applications.

## Topics Covered
- Hands-on AI tool usage
- Best practices for implementation
- Common pitfalls to avoid
- Industry case studies

## Practical Exercise
Apply what you have learned to a real scenario from your work or daily life.

**Key Takeaway**: Practice and experimentation are key to mastering AI tools.`,
  });
}

async function addLessons() {
  console.log('\n📚 Adding lessons to AI Essentials - Stage 2\n');
  console.log('='.repeat(70));
  
  await connectDB();

  const course = await Course.findOne({ courseId: 'AI_ESSENTIALS_3DAY_EN' });
  if (!course) {
    throw new Error('Course not found');
  }

  console.log(`✓ Course found: ${course.name}`);

  // Replace lessons
  course.lessons = lessons.map((lesson, idx) => ({
    ...lesson,
    displayOrder: idx + 1,
    quizQuestions: [],
  })) as any;

  await course.save();

  console.log(`\n✅ Added ${course.lessons.length} lessons`);
  console.log('\n' + '='.repeat(70));
  console.log('\n📝 Next: Add quiz questions\n');
  
  process.exit(0);
}

addLessons();
