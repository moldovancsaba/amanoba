/**
 * Update Lesson 2 for GEO_SHOPIFY_30_EN (English) - Quality Fix
 */

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { Brand, Course, Lesson } from '../app/lib/models';

const COURSE_ID = 'GEO_SHOPIFY_30_EN';

const UPDATED_LESSON_29 = {
  day: 29,
  title: 'Measurement system: weekly GEO run and report',
  content: `<h1>Measurement system: weekly GEO run and report</h1>
<p><em>Today you'll set a weekly test routine using your prompt set and log results.</em></p>
<hr />
<h2>What you'll learn today</h2>
<p>Today you'll achieve these two things:</p>
<ul>
<li>You'll schedule the weekly GEO test run so you can measure regularly.</li>
<li>You'll create a report template to track your results.</li>
</ul>
<hr />
<h2>Why this matters to you</h2>
<p>No measurement, no proof of progress. Shows consistency and errors. Without tracking, you can't see if your GEO efforts are working.</p>
<hr />
<h2>Measurement system: what to include</h2>
<h3>Prompt set usage</h3>
<p>Use the prompt set (best/vs/policy) for measurement:</p>
<ul>
<li>Best questions – best choice queries</li>
<li>Vs questions – comparison queries</li>
<li>Policy questions – policy information queries</li>
</ul>
<h3>Metrics to measure</h3>
<p>Measure these metrics:</p>
<ul>
<li>Inclusion – does your brand/product show up?</li>
<li>Citation – does the answer link to your domain?</li>
<li>Consistency – does it repeat across runs?</li>
<li>AI referral KPIs – how many referrals come from AI</li>
</ul>
<h3>Logging</h3>
<p>Log changes:</p>
<ul>
<li>Date – when the measurement was taken</li>
<li>Prompt – which prompt was used</li>
<li>Result – what the result was</li>
<li>Change – what changed from previous measurement</li>
</ul>
<hr />
<h2>Examples: what works, what doesn't?</h2>
<h3>✅ Good measurement system</h3>
<p>Weekly report: which prompts mention your store, linked or not, consistent tracking.</p>
<h3>❌ Poor measurement system</h3>
<p>"Feels better" with no record, no documentation, no regular measurement.</p>
<hr />
<h2>Practice: create your report template (10-15 min)</h2>
<p>Now you'll create a report template and schedule the weekly run. Here are the steps:</p>
<ol>
<li>Create a report template with these columns:
   <ul>
   <li>Prompt</li>
   <li>Inclusion</li>
   <li>Citation</li>
   <li>Consistency</li>
   <li>Notes</li>
   </ul>
</li>
<li>Schedule the weekly run (day, owner).</li>
</ol>
<h2>Independent practice: fill your first measurements (5-10 min)</h2>
<p>Now fill 5 prompts and note results.</p>
<hr />
<h2>Self-check</h2>
<p>Before moving on, check that:</p>
<ul>
<li>✅ Template ready</li>
<li>✅ Schedule set</li>
<li>✅ First 5 measurements logged</li>
</ul>
<hr />
<h2>If you want to go deeper</h2>
<ul>
<li>Measurement tools: <a href="https://clarity.microsoft.com/" target="_blank" rel="noreferrer">https://clarity.microsoft.com/</a></li>
<li>Analytics best practices: <a href="https://www.shopify.com/blog/ecommerce-analytics" target="_blank" rel="noreferrer">https://www.shopify.com/blog/ecommerce-analytics</a></li>
</ul>`,
  emailSubject: 'GEO Shopify – Day 29: Measurement',
  emailBody: `<h1>GEO Shopify – Day 29</h1>
<h2>Measurement system: weekly GEO run and report</h2>
<p>Today you'll set a weekly test routine using your prompt set and log results.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`
};

async function updateLesson29() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) throw new Error('MONGODB_URI not set');
    const { default: connectDB } = await import('../app/lib/mongodb');
    await connectDB();
    console.log('✅ Connected to MongoDB');

    let brand = await Brand.findOne({ slug: 'amanoba' });
    if (!brand) {
      brand = await Brand.create({
        name: 'Amanoba', slug: 'amanoba', displayName: 'Amanoba',
        description: 'Unified Learning Platform', logo: '/AMANOBA.png',
        themeColors: { primary: '#FAB908', secondary: '#2D2D2D', accent: '#FAB908' },
        allowedDomains: ['amanoba.com', 'www.amanoba.com', 'localhost'],
        supportedLanguages: ['hu', 'en'], defaultLanguage: 'hu', isActive: true
      });
      console.log('✅ Brand created');
    }

    const course = await Course.findOneAndUpdate(
      { courseId: COURSE_ID },
      {
        $set: {
          courseId: COURSE_ID,
          name: 'GEO Shopify – 30-day course',
          description: '30 days of practical GEO training for Shopify merchants: in 20–30 minutes a day you build product and content foundations so generative systems can safely find, parse, and cite your store.',
          language: 'en', durationDays: 30, isActive: true, requiresPremium: false,
          brandId: brand._id,
          pointsConfig: { completionPoints: 1000, lessonPoints: 50, perfectCourseBonus: 500 },
          xpConfig: { completionXP: 500, lessonXP: 25 },
          metadata: { category: 'education', difficulty: 'intermediate', estimatedHours: 10, tags: ['geo', 'shopify', 'ecommerce'], instructor: 'Amanoba' }
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`✅ Course ${COURSE_ID} found/created: ${course.name}`);

    const lessonId = `${COURSE_ID}_DAY_29`;
    const lesson = await Lesson.findOneAndUpdate(
      { lessonId },
      {
        $set: {
          lessonId, courseId: course._id, dayNumber: UPDATED_LESSON_29.day,
          language: 'en', title: UPDATED_LESSON_29.title, content: UPDATED_LESSON_29.content,
          emailSubject: UPDATED_LESSON_29.emailSubject, emailBody: UPDATED_LESSON_29.emailBody, isActive: true,
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log(`✅ Lesson 2 updated successfully`);
    console.log(`   Lesson ID: ${lesson.lessonId}`);
    console.log(`   Title: ${lesson.title}`);

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

updateLesson29();
