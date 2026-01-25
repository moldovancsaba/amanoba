/**
 * Update Lesson 2 for GEO_SHOPIFY_30_EN (English) - Quality Fix
 */

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { Brand, Course, Lesson } from '../app/lib/models';

const COURSE_ID = 'GEO_SHOPIFY_30_EN';

const UPDATED_LESSON_25 = {
  day: 25,
  title: 'Off-site GEO: when it helps, when it harms',
  content: `<h1>Off-site GEO: when it helps, when it harms</h1>
<p><em>Today you'll list external mentions that support citation, and avoid spam.</em></p>
<hr />
<h2>What you'll learn today</h2>
<p>Today you'll achieve these two things:</p>
<ul>
<li>You'll list useful off-site sources (reviews, media, partners) that support citation.</li>
<li>You'll avoid spammy mentions that can hurt your store.</li>
</ul>
<hr />
<h2>Why this matters to you</h2>
<p>AI may consider external mentions. Spammy links can hurt and lead to exclusion. Understanding what helps vs harms helps you build a strong off-site presence.</p>
<hr />
<h2>Off-site sources: what helps, what harms</h2>
<h3>Useful sources</h3>
<p>These sources support citability:</p>
<ul>
<li>Credible review sites – real reviews</li>
<li>Relevant media – articles, tests</li>
<li>Partner blogs – relevant partner content</li>
</ul>
<h3>Harmful sources</h3>
<p>These sources can hurt:</p>
<ul>
<li>Link farms – spam links</li>
<li>Paid spam – paid, unqualified links</li>
<li>Irrelevant directories – not relevant directories</li>
</ul>
<hr />
<h2>Examples: what works, what doesn't?</h2>
<h3>✅ Good off-site source</h3>
<p>Real test article link, partner Q&A, credible review site.</p>
<h3>❌ Poor off-site source</h3>
<p>Link farm, keyword-stuffed page, paid spam.</p>
<hr />
<h2>Practice: create your source lists (10-15 min)</h2>
<p>Now you'll create lists of useful and avoid sources. Here are the steps:</p>
<ol>
<li>Create lists: useful vs avoid sources.</li>
<li>Select 2 credible sources and draft placement.</li>
</ol>
<h2>Independent practice: write outreach draft (5-10 min)</h2>
<p>Now write an outreach draft for a partner article or Q&A.</p>
<hr />
<h2>Self-check</h2>
<p>Before moving on, check that:</p>
<ul>
<li>✅ Useful/avoid lists ready</li>
<li>✅ 2 credible sources picked</li>
<li>✅ Outreach draft ready</li>
</ul>
<hr />
<h2>If you want to go deeper</h2>
<ul>
<li>Google spam policies: <a href="https://developers.google.com/search/docs/essentials/spam-policies" target="_blank" rel="noreferrer">https://developers.google.com/search/docs/essentials/spam-policies</a></li>
<li>Link building best practices: <a href="https://developers.google.com/search/docs/fundamentals/seo-starter-guide" target="_blank" rel="noreferrer">https://developers.google.com/search/docs/fundamentals/seo-starter-guide</a></li>
</ul>`,
  emailSubject: 'GEO Shopify – Day 25: Off-site GEO',
  emailBody: `<h1>GEO Shopify – Day 25</h1>
<h2>Off-site GEO: when it helps, when it harms</h2>
<p>Today you'll list external mentions that support citation, and avoid spam.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`
};

async function updateLesson25() {
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

    const lessonId = `${COURSE_ID}_DAY_25`;
    const lesson = await Lesson.findOneAndUpdate(
      { lessonId },
      {
        $set: {
          lessonId, courseId: course._id, dayNumber: UPDATED_LESSON_25.day,
          language: 'en', title: UPDATED_LESSON_25.title, content: UPDATED_LESSON_25.content,
          emailSubject: UPDATED_LESSON_25.emailSubject, emailBody: UPDATED_LESSON_25.emailBody, isActive: true,
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

updateLesson25();
