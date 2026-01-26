/**
 * Update Lesson 2 for GEO_SHOPIFY_30_EN (English) - Quality Fix
 */

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { Brand, Course, Lesson } from '../app/lib/models';

const COURSE_ID = 'GEO_SHOPIFY_30_EN';

const UPDATED_LESSON_28 = {
  day: 28,
  title: 'Merchant programs: eligibility and onboarding',
  content: `<h1>Merchant programs: eligibility and onboarding</h1>
<p><em>Today you'll assess which AI/commerce programs you can join and what they require.</em></p>
<hr />
<h2>What you'll learn today</h2>
<p>Today you'll achieve these two things:</p>
<ul>
<li>You'll compare key programs (ChatGPT/Copilot/Google) to understand what each requires.</li>
<li>You'll create a requirement checklist to track your status.</li>
</ul>
<hr />
<h2>Why this matters to you</h2>
<p>No eligibility, no presence. Onboarding errors delay visibility. Understanding each program's requirements helps you optimize for where you can actually appear.</p>
<hr />
<h2>Merchant programs: what's required</h2>
<h3>Requirements</h3>
<p>Main requirements for programs:</p>
<ul>
<li>Feed quality – accurate, up-to-date feed</li>
<li>Policy – shipping, returns information</li>
<li>Region – supported regions</li>
<li>Brand/GTIN – brand and identifiers</li>
<li>Price/stock – accurate price and stock information</li>
</ul>
<h3>Onboarding</h3>
<p>Onboarding process:</p>
<ul>
<li>Verification – domain and store verification</li>
<li>Domain – registered domain</li>
<li>Support contact – support information</li>
</ul>
<hr />
<h2>Examples: what works, what doesn't?</h2>
<h3>✅ Good merchant program management</h3>
<p>Checklist per program with status, requirements tracked, owners assigned.</p>
<h3>❌ Poor merchant program management</h3>
<p>"We'll apply later" with no documentation, no tracking, no owner.</p>
<hr />
<h2>Practice: create your program table (10-15 min)</h2>
<p>Now you'll compare the programs and create a checklist. Here are the steps:</p>
<ol>
<li>Create a table with these columns:
   <ul>
   <li>Program</li>
   <li>Region</li>
   <li>Requirement</li>
   <li>Status</li>
   <li>Owner</li>
   </ul>
</li>
<li>Fill for the three main platforms.</li>
</ol>
<h2>Independent practice: mark gaps (5-10 min)</h2>
<p>Now mark 3 gaps and tasks for onboarding.</p>
<hr />
<h2>Self-check</h2>
<p>Before moving on, check that:</p>
<ul>
<li>✅ Program table ready</li>
<li>✅ Gaps identified</li>
<li>✅ Owners set</li>
</ul>
<hr />
<h2>If you want to go deeper</h2>
<ul>
<li>OpenAI merchants: <a href="https://chatgpt.com/merchants" target="_blank" rel="noreferrer">https://chatgpt.com/merchants</a></li>
<li>Copilot merchant: <a href="https://www.microsoft.com/en-us/microsoft-copilot/blog/2025/04/18/introducing-the-copilot-merchant-program/" target="_blank" rel="noreferrer">https://www.microsoft.com/en-us/microsoft-copilot/blog/2025/04/18/introducing-the-copilot-merchant-program/</a></li>
</ul>`,
  emailSubject: 'GEO Shopify – Day 28: Merchant programs',
  emailBody: `<h1>GEO Shopify – Day 28</h1>
<h2>Merchant programs: eligibility and onboarding</h2>
<p>Today you'll assess which AI/commerce programs you can join and what they require.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`
};

async function updateLesson28() {
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

    const lessonId = `${COURSE_ID}_DAY_28`;
    const lesson = await Lesson.findOneAndUpdate(
      { lessonId },
      {
        $set: {
          lessonId, courseId: course._id, dayNumber: UPDATED_LESSON_28.day,
          language: 'en', title: UPDATED_LESSON_28.title, content: UPDATED_LESSON_28.content,
          emailSubject: UPDATED_LESSON_28.emailSubject, emailBody: UPDATED_LESSON_28.emailBody, isActive: true,
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

updateLesson28();
