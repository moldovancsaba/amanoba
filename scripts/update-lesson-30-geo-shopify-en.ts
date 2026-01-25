/**
 * Update Lesson 2 for GEO_SHOPIFY_30_EN (English) - Quality Fix
 */

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { Brand, Course, Lesson } from '../app/lib/models';

const COURSE_ID = 'GEO_SHOPIFY_30_EN';

const UPDATED_LESSON_30 = {
  day: 30,
  title: 'Capstone sprint: one collection end-to-end',
  content: `<h1>Capstone sprint: one collection end-to-end</h1>
<p><em>Today you'll run a full GEO sprint on a 10-product collection.</em></p>
<hr />
<h2>What you'll learn today</h2>
<p>Today you'll achieve these two things:</p>
<ul>
<li>You'll pick one collection (10 products).</li>
<li>You'll apply blueprint + capsule + feed + measurement steps to see the full process in action.</li>
</ul>
<hr />
<h2>Why this matters to you</h2>
<p>Prove the process works. Set the foundation to scale. Completing a full cycle helps you see that every step works together.</p>
<hr />
<h2>Full GEO cycle: what to include</h2>
<p>A full GEO sprint includes these steps:</p>
<ol>
<li><strong>Data fix</strong>: IDs, price/stock, policy – check and fix base data</li>
<li><strong>PDP blueprint + capsule + images</strong> – optimize product pages</li>
<li><strong>Collection guide + links</strong> – turn collection into a guide</li>
<li><strong>Feed check + measurement</strong> via prompt set – validate feed and measure</li>
</ol>
<hr />
<h2>Examples: what works, what doesn't?</h2>
<h3>✅ Good capstone sprint</h3>
<p>Every product meets standard, measurement documented, backlog ready.</p>
<h3>❌ Poor capstone sprint</h3>
<p>Ad hoc fixes, no measurement, no documentation.</p>
<hr />
<h2>Practice: run your full sprint (10-15 min)</h2>
<p>Now you'll run a full GEO sprint on a collection. Here are the steps:</p>
<ol>
<li>Select the collection, list the 10 products.</li>
<li>Apply blueprint/capsule to all 10.</li>
<li>Run feed/measurement checks.</li>
</ol>
<h2>Independent practice: document results (5-10 min)</h2>
<p>Now write a one-page before/after note and next sprint backlog.</p>
<hr />
<h2>Self-check</h2>
<p>Before moving on, check that:</p>
<ul>
<li>✅ 10 products meet the standard</li>
<li>✅ Measurement run logged</li>
<li>✅ Backlog for next 30 days ready</li>
</ul>
<hr />
<h2>If you want to go deeper</h2>
<ul>
<li>GEO best practices: <a href="https://searchengineland.com/guide/what-is-geo" target="_blank" rel="noreferrer">https://searchengineland.com/guide/what-is-geo</a></li>
<li>E-commerce optimization: <a href="https://www.shopify.com/blog/ecommerce-optimization" target="_blank" rel="noreferrer">https://www.shopify.com/blog/ecommerce-optimization</a></li>
</ul>`,
  emailSubject: 'GEO Shopify – Day 30: Capstone sprint',
  emailBody: `<h1>GEO Shopify – Day 30</h1>
<h2>Capstone sprint: one collection end-to-end</h2>
<p>Today you'll run a full GEO sprint on a 10-product collection.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`
};

async function updateLesson30() {
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

    const lessonId = `${COURSE_ID}_DAY_30`;
    const lesson = await Lesson.findOneAndUpdate(
      { lessonId },
      {
        $set: {
          lessonId, courseId: course._id, dayNumber: UPDATED_LESSON_30.day,
          language: 'en', title: UPDATED_LESSON_30.title, content: UPDATED_LESSON_30.content,
          emailSubject: UPDATED_LESSON_30.emailSubject, emailBody: UPDATED_LESSON_30.emailBody, isActive: true,
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

updateLesson30();
