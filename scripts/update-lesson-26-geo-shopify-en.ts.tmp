/**
 * Update Lesson 2 for GEO_SHOPIFY_30_EN (English) - Quality Fix
 */

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { Brand, Course, Lesson } from '../app/lib/models';

const COURSE_ID = 'GEO_SHOPIFY_30_EN';

const UPDATED_LESSON_26 = {
  day: 26,
  title: 'Anti-spam and quality for AI-assisted content',
  content: `<h1>Anti-spam and quality for AI-assisted content</h1>
<p><em>Today you'll write with AI safely: no spam, all quality.</em></p>
<hr />
<h2>What you'll learn today</h2>
<p>Today you'll achieve these two things:</p>
<ul>
<li>You'll build a quality/anti-spam checklist that you can use right away.</li>
<li>You'll apply it to one guide and fix any issues.</li>
</ul>
<hr />
<h2>Why this matters to you</h2>
<p>Spammy AI content is risky and can get you excluded. Quality = citability + trust. Without quality content, AI may not safely quote your store.</p>
<hr />
<h2>Anti-spam and quality: what to include</h2>
<h3>Avoid these practices</h3>
<p>These practices are spammy and harmful:</p>
<ul>
<li>Keyword stuffing – too many keywords</li>
<li>False claims – claims without evidence</li>
<li>Source-less data – unverifiable information</li>
</ul>
<h3>Use these practices</h3>
<p>These practices create quality content:</p>
<ul>
<li>Cite sources – source for every claim</li>
<li>Short blocks – concise, understandable text</li>
<li>Real data – verifiable information</li>
</ul>
<hr />
<h2>Examples: what works, what doesn't?</h2>
<h3>✅ Good AI-assisted content</h3>
<p>Short, sourced claims, real data, verifiable information.</p>
<h3>❌ Poor AI-assisted content</h3>
<p>"Best in the world" with no evidence, keyword stuffing, false claims.</p>
<hr />
<h2>Practice: create your checklist (10-15 min)</h2>
<p>Now you'll create a quality/anti-spam checklist and apply it to a guide. Here are the steps:</p>
<ol>
<li>Create a 10-point quality/anti-spam checklist with:
   <ul>
   <li>Avoid elements (keyword stuffing, false claims, source-less data)</li>
   <li>Use elements (cite sources, short blocks, real data)</li>
   </ul>
</li>
<li>Apply it to an existing guide and mark fixes.</li>
</ol>
<h2>Independent practice: update one section (5-10 min)</h2>
<p>Now update one section using the checklist.</p>
<hr />
<h2>Self-check</h2>
<p>Before moving on, check that:</p>
<ul>
<li>✅ Checklist done (10 points)</li>
<li>✅ Guide reviewed</li>
<li>✅ One section improved</li>
</ul>
<hr />
<h2>If you want to go deeper</h2>
<ul>
<li>Google helpful content guidelines: <a href="https://developers.google.com/search/docs/fundamentals/creating-helpful-content" target="_blank" rel="noreferrer">https://developers.google.com/search/docs/fundamentals/creating-helpful-content</a></li>
<li>Google spam policies: <a href="https://developers.google.com/search/docs/essentials/spam-policies" target="_blank" rel="noreferrer">https://developers.google.com/search/docs/essentials/spam-policies</a></li>
</ul>`,
  emailSubject: 'GEO Shopify – Day 26: Anti-spam and quality',
  emailBody: `<h1>GEO Shopify – Day 26</h1>
<h2>Anti-spam and quality for AI-assisted content</h2>
<p>Today you'll write with AI safely: no spam, all quality.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`
};

async function updateLesson26() {
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

    const lessonId = `${COURSE_ID}_DAY_26`;
    const lesson = await Lesson.findOneAndUpdate(
      { lessonId },
      {
        $set: {
          lessonId, courseId: course._id, dayNumber: UPDATED_LESSON_26.day,
          language: 'en', title: UPDATED_LESSON_26.title, content: UPDATED_LESSON_26.content,
          emailSubject: UPDATED_LESSON_26.emailSubject, emailBody: UPDATED_LESSON_26.emailBody, isActive: true,
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

updateLesson26();
