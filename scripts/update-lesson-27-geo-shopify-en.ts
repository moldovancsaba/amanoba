/**
 * Update Lesson 2 for GEO_SHOPIFY_30_EN (English) - Quality Fix
 */

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { Brand, Course, Lesson } from '../app/lib/models';

const COURSE_ID = 'GEO_SHOPIFY_30_EN';

const UPDATED_LESSON_27 = {
  day: 27,
  title: 'Feed operations: refresh, monitor, error handling',
  content: `<h1>Feed operations: refresh, monitor, error handling</h1>
<p><em>Today you'll set the cadence and error-handling routine for your feed.</em></p>
<hr />
<h2>What you'll learn today</h2>
<p>Today you'll achieve these two things:</p>
<ul>
<li>You'll schedule feed refresh so it's always up to date.</li>
<li>You'll set up error list and logging to track issues.</li>
</ul>
<hr />
<h2>Why this matters to you</h2>
<p>Stale feed → wrong recommendations. Ignoring errors can lead to exclusion. Without proper feed operations, AI can't accurately quote your products.</p>
<hr />
<h2>Feed operations: what to include</h2>
<h3>Refresh</h3>
<p>Feed refresh schedule:</p>
<ul>
<li>Daily/hourly based on stock/price changes</li>
<li>Automated refresh where possible</li>
<li>Manual check regularly</li>
</ul>
<h3>Monitor</h3>
<p>Feed monitoring:</p>
<ul>
<li>Error codes tracking</li>
<li>Missing fields check</li>
<li>Disapprovals tracking</li>
</ul>
<h3>Log</h3>
<p>Error log content:</p>
<ul>
<li>Date – when the error occurred</li>
<li>Error type – what kind of error</li>
<li>Product – which product</li>
<li>Fix – how you fixed it</li>
<li>SLA – how long it took to fix</li>
</ul>
<hr />
<h2>Examples: what works, what doesn't?</h2>
<h3>✅ Good feed operations</h3>
<p>Weekly error report, SLA to fix, automated refresh, regular monitoring.</p>
<h3>❌ Poor feed operations</h3>
<p>"We'll check later" attitude, no log, no monitoring, stale feed.</p>
<hr />
<h2>Practice: set up your feed operations (10-15 min)</h2>
<p>Now you'll schedule feed refresh and create an error log template. Here are the steps:</p>
<ol>
<li>Set refresh frequency (e.g., daily) and note it.</li>
<li>Create an error log template with these columns:
   <ul>
   <li>Date</li>
   <li>Error</li>
   <li>Product</li>
   <li>Fix</li>
   <li>SLA</li>
   </ul>
</li>
</ol>
<h2>Independent practice: log sample errors (5-10 min)</h2>
<p>Now log 3 sample errors.</p>
<hr />
<h2>Self-check</h2>
<p>Before moving on, check that:</p>
<ul>
<li>✅ Refresh cadence set</li>
<li>✅ Error log template ready</li>
<li>✅ 3 errors recorded</li>
</ul>
<hr />
<h2>If you want to go deeper</h2>
<ul>
<li>Google Merchant Center feed management: <a href="https://support.google.com/merchants/answer/188494" target="_blank" rel="noreferrer">https://support.google.com/merchants/answer/188494</a></li>
<li>Shopify feed optimization: <a href="https://help.shopify.com/en/manual/products/import-export" target="_blank" rel="noreferrer">https://help.shopify.com/en/manual/products/import-export</a></li>
</ul>`,
  emailSubject: 'GEO Shopify – Day 27: Feed operations',
  emailBody: `<h1>GEO Shopify – Day 27</h1>
<h2>Feed operations: refresh, monitor, error handling</h2>
<p>Today you'll set the cadence and error-handling routine for your feed.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`
};

async function updateLesson27() {
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

    const lessonId = `${COURSE_ID}_DAY_27`;
    const lesson = await Lesson.findOneAndUpdate(
      { lessonId },
      {
        $set: {
          lessonId, courseId: course._id, dayNumber: UPDATED_LESSON_27.day,
          language: 'en', title: UPDATED_LESSON_27.title, content: UPDATED_LESSON_27.content,
          emailSubject: UPDATED_LESSON_27.emailSubject, emailBody: UPDATED_LESSON_27.emailBody, isActive: true,
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

updateLesson27();
