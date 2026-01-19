/**
 * Onboarding Survey Seed Script
 * 
 * Purpose: Seeds the default onboarding survey for new users
 * Why: Provides personalized course recommendations based on user preferences
 * 
 * Usage: npm run seed:survey
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../app/lib/mongodb';
import { Survey, Brand, QuestionType } from '../app/lib/models';
import logger from '../app/lib/logger';

/**
 * Seed Onboarding Survey
 * Why: Creates default survey with 5-10 questions for course recommendations
 */
async function seedOnboardingSurvey() {
  logger.info('🌱 Seeding onboarding survey...');

  try {
    await connectDB();

    // Get default brand (Amanoba)
    const brand = await Brand.findOne({ slug: 'amanoba' });
    if (!brand) {
      throw new Error('Default brand (amanoba) not found. Please seed brands first.');
    }

    // Check if survey already exists
    const existingSurvey = await Survey.findOne({ surveyId: 'onboarding', brandId: brand._id });
    if (existingSurvey) {
      logger.info('✓ Onboarding survey already exists, updating...');
      // Update existing survey
      existingSurvey.name = 'Onboarding Survey';
      existingSurvey.description = 'Help us understand your learning goals and preferences to recommend the best courses for you.';
      existingSurvey.questions = getDefaultQuestions();
      existingSurvey.isActive = true;
      existingSurvey.isDefault = true;
      existingSurvey.metadata = {
        completionMessage: 'Thank you! We\'ve saved your preferences and will recommend courses based on your answers.',
        redirectUrl: '/dashboard',
        estimatedMinutes: 3,
      };
      await existingSurvey.save();
      logger.info('✅ Onboarding survey updated successfully');
      return;
    }

    // Create new survey
    const survey = new Survey({
      surveyId: 'onboarding',
      name: 'Onboarding Survey',
      description: 'Help us understand your learning goals and preferences to recommend the best courses for you.',
      brandId: brand._id,
      questions: getDefaultQuestions(),
      isActive: true,
      isDefault: true,
      metadata: {
        completionMessage: 'Thank you! We\'ve saved your preferences and will recommend courses based on your answers.',
        redirectUrl: '/dashboard',
        estimatedMinutes: 3,
      },
    });

    await survey.save();
    logger.info('✅ Onboarding survey created successfully');
    logger.info(`   Survey ID: ${survey.surveyId}`);
    logger.info(`   Questions: ${survey.questions.length}`);
  } catch (error) {
    logger.error({ error }, '❌ Failed to seed onboarding survey');
    throw error;
  }
}

/**
 * Get Default Survey Questions
 * Why: Defines 5-10 questions for course recommendations
 */
function getDefaultQuestions() {
  return [
    {
      questionId: 'learning_goal',
      type: QuestionType.SINGLE_CHOICE,
      question: 'What is your primary learning goal?',
      description: 'Select the option that best describes what you want to achieve',
      options: [
        {
          value: 'career_advancement',
          label: 'Career Advancement',
          metadata: { tags: ['career', 'professional'] },
        },
        {
          value: 'skill_development',
          label: 'Skill Development',
          metadata: { tags: ['skills', 'learning'] },
        },
        {
          value: 'personal_growth',
          label: 'Personal Growth',
          metadata: { tags: ['personal', 'growth'] },
        },
        {
          value: 'business_owner',
          label: 'Start or Grow a Business',
          metadata: { tags: ['business', 'entrepreneurship'] },
        },
        {
          value: 'hobby_interest',
          label: 'Hobby or Interest',
          metadata: { tags: ['hobby', 'interest'] },
        },
      ],
      required: true,
      order: 1,
      metadata: {
        category: 'learning_goal',
        tags: ['goal', 'motivation'],
      },
    },
    {
      questionId: 'skill_level',
      type: QuestionType.SINGLE_CHOICE,
      question: 'What is your current skill level?',
      description: 'Be honest - this helps us recommend the right courses for you',
      options: [
        {
          value: 'beginner',
          label: 'Beginner',
          metadata: { skillLevel: 'beginner' },
        },
        {
          value: 'intermediate',
          label: 'Intermediate',
          metadata: { skillLevel: 'intermediate' },
        },
        {
          value: 'advanced',
          label: 'Advanced',
          metadata: { skillLevel: 'advanced' },
        },
      ],
      required: true,
      order: 2,
      metadata: {
        category: 'skill_level',
        tags: ['skill', 'level'],
      },
    },
    {
      questionId: 'interests',
      type: QuestionType.MULTIPLE_CHOICE,
      question: 'What topics interest you most? (Select all that apply)',
      description: 'Choose multiple topics to help us recommend relevant courses',
      options: [
        {
          value: 'artificial_intelligence',
          label: 'Artificial Intelligence & Machine Learning',
          metadata: { tags: ['ai', 'ml', 'technology'] },
        },
        {
          value: 'web_development',
          label: 'Web Development',
          metadata: { tags: ['web', 'development', 'coding'] },
        },
        {
          value: 'business',
          label: 'Business & Entrepreneurship',
          metadata: { tags: ['business', 'entrepreneurship'] },
        },
        {
          value: 'marketing',
          label: 'Marketing & Sales',
          metadata: { tags: ['marketing', 'sales'] },
        },
        {
          value: 'design',
          label: 'Design & Creativity',
          metadata: { tags: ['design', 'creativity'] },
        },
        {
          value: 'data_science',
          label: 'Data Science & Analytics',
          metadata: { tags: ['data', 'analytics'] },
        },
        {
          value: 'productivity',
          label: 'Productivity & Time Management',
          metadata: { tags: ['productivity', 'time-management'] },
        },
        {
          value: 'language',
          label: 'Language Learning',
          metadata: { tags: ['language', 'learning'] },
        },
      ],
      required: true,
      order: 3,
      metadata: {
        category: 'interests',
        tags: ['interests', 'topics'],
      },
    },
    {
      questionId: 'time_commitment',
      type: QuestionType.SINGLE_CHOICE,
      question: 'How much time can you dedicate to learning daily?',
      description: 'This helps us recommend courses that fit your schedule',
      options: [
        {
          value: '15_min',
          label: '15 minutes',
          metadata: { minutes: 15 },
        },
        {
          value: '30_min',
          label: '30 minutes',
          metadata: { minutes: 30 },
        },
        {
          value: '1_hour',
          label: '1 hour',
          metadata: { minutes: 60 },
        },
        {
          value: 'more_than_1_hour',
          label: 'More than 1 hour',
          metadata: { minutes: 90 },
        },
      ],
      required: true,
      order: 4,
      metadata: {
        category: 'time_commitment',
        tags: ['time', 'schedule'],
      },
    },
    {
      questionId: 'learning_style',
      type: QuestionType.SINGLE_CHOICE,
      question: 'What is your preferred learning style?',
      description: 'How do you learn best?',
      options: [
        {
          value: 'visual',
          label: 'Visual (I learn by seeing and reading)',
          metadata: { tags: ['visual', 'reading'] },
        },
        {
          value: 'hands_on',
          label: 'Hands-on (I learn by doing and practicing)',
          metadata: { tags: ['practice', 'hands-on'] },
        },
        {
          value: 'structured',
          label: 'Structured (I prefer step-by-step lessons)',
          metadata: { tags: ['structured', 'step-by-step'] },
        },
        {
          value: 'flexible',
          label: 'Flexible (I prefer to learn at my own pace)',
          metadata: { tags: ['flexible', 'self-paced'] },
        },
      ],
      required: true,
      order: 5,
      metadata: {
        category: 'learning_style',
        tags: ['style', 'preference'],
      },
    },
    {
      questionId: 'experience_with_online_learning',
      type: QuestionType.RATING,
      question: 'How experienced are you with online learning platforms?',
      description: 'Rate your experience from 1 (very new) to 5 (very experienced)',
      required: false,
      order: 6,
      metadata: {
        category: 'experience',
        tags: ['online-learning', 'experience'],
        min: 1,
        max: 5,
      },
    },
  ];
}

/**
 * Main seed function
 */
async function seed() {
  try {
    await seedOnboardingSurvey();
    logger.info('✅ Onboarding survey seeding completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error({ error }, '❌ Seeding failed');
    process.exit(1);
  }
}

// Run seed if called directly
if (require.main === module) {
  seed();
}

export default seed;
