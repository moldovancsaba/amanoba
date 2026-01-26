/**
 * Update Lesson 2 for GEO_SHOPIFY_30_EN (English) - Quality Fix
 */

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { Brand, Course, Lesson } from '../app/lib/models';

const COURSE_ID = 'GEO_SHOPIFY_30_EN';

const UPDATED_LESSON_22 = {
  day: 22,
  title: 'Buying guide: AI-friendly structure',
  content: `<h1>Buying guide: AI-friendly structure</h1>
<p><em>Today you'll write a guide the AI can summarize without distortion.</em></p>
<hr />
<h2>What you'll learn today</h2>
<p>Today you'll achieve these two things:</p>
<ul>
<li>You'll draft one buying guide outline that you can use right away.</li>
<li>You'll link 3 PDPs with reasons so the guide points to specific products.</li>
</ul>
<hr />
<h2>Why this matters to you</h2>
<p>Guides are strong sources if sections are clear. Reduces misread and builds trust. AI prefers well-structured guides that it can easily summarize and cite.</p>
<hr />
<h2>Buying guide structure: what to include</h2>
<p>A good AI-friendly buying guide includes these sections:</p>
<ol>
<li><strong>Hero</strong>: who, which situation – short, clear introduction</li>
<li><strong>Decision criteria</strong> (3–5 bullets) – what to consider when choosing</li>
<li><strong>Top picks</strong> with reasons and links – best product recommendations</li>
<li><strong>Policy short + link</strong> – shipping, returns</li>
</ol>
<hr />
<h2>Examples: what works, what doesn't?</h2>
<h3>✅ Good buying guide</h3>
<p>Structured, linked PDPs, short reasons, clear sections, policy link.</p>
<h3>❌ Poor buying guide</h3>
<p>Wall of text, no links, no structure, no recommendations.</p>
<hr />
<h2>Practice: write your buying guide (10-15 min)</h2>
<p>Now you'll write a buying guide outline and link products. Here are the steps:</p>
<ol>
<li>Write a guide outline for your top category using the blocks above.</li>
<li>Add 3 PDP links with short reasons.</li>
</ol>
<h2>Independent practice: draft another guide (5-10 min)</h2>
<p>Now draft a second outline for another category.</p>
<hr />
<h2>Self-check</h2>
<p>Before moving on, check that:</p>
<ul>
<li>✅ Guide blocks present</li>
<li>✅ Top picks linked with reasons</li>
<li>✅ Policy block included</li>
</ul>
<hr />
<h2>If you want to go deeper</h2>
<ul>
<li>Content marketing best practices: <a href="https://www.shopify.com/blog/content-marketing" target="_blank" rel="noreferrer">https://www.shopify.com/blog/content-marketing</a></li>
<li>Google helpful content guidelines: <a href="https://developers.google.com/search/docs/fundamentals/creating-helpful-content" target="_blank" rel="noreferrer">https://developers.google.com/search/docs/fundamentals/creating-helpful-content</a></li>
</ul>`,
  emailSubject: 'GEO Shopify – Day 22: Buying guide',
  emailBody: `<h1>GEO Shopify – Day 22</h1>
<h2>Buying guide: AI-friendly structure</h2>
<p>Today you'll write a guide the AI can summarize without distortion.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`
};

async function updateLesson22() {
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

    const lessonId = `${COURSE_ID}_DAY_22`;
    const lesson = await Lesson.findOneAndUpdate(
      { lessonId },
      {
        $set: {
          lessonId, courseId: course._id, dayNumber: UPDATED_LESSON_22.day,
          language: 'en', title: UPDATED_LESSON_22.title, content: UPDATED_LESSON_22.content,
          emailSubject: UPDATED_LESSON_22.emailSubject, emailBody: UPDATED_LESSON_22.emailBody, isActive: true,
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

updateLesson22();
