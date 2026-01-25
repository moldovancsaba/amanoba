/**
 * Update Lesson 2 for GEO_SHOPIFY_30_EN (English) - Quality Fix
 */

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { Brand, Course, Lesson } from '../app/lib/models';

const COURSE_ID = 'GEO_SHOPIFY_30_EN';

const UPDATED_LESSON_5 = {
  day: 2,
  title: 'Platform map: ChatGPT, Copilot, Google AI',
  content: `<h1>Platform map: ChatGPT, Copilot, Google AI</h1>
<p><em>Today you'll review the main AI shopping surfaces, their differences, and constraints.</em></p>
<hr />
<h2>What you'll learn today</h2>
<p>Today you'll achieve these two things:</p>
<ul>
<li>You'll name the 3 platforms and their constraints, so you understand what each requires.</li>
<li>You'll create a 1-page "where can I show up?" summary that you can use right away.</li>
</ul>
<hr />
<h2>Why this matters to you</h2>
<p>Merchant programs and regions differ. Content expectations differ (structured data, policy, identifiers). Understanding each platform helps you optimize for where you can actually appear.</p>
<hr />
<h2>Platform overview: what each requires</h2>
<h3>ChatGPT</h3>
<p>ChatGPT shopping features:</p>
<ul>
<li>Shopping answers with merchant program</li>
<li>Keys: accurate data, quotability</li>
<li>Focus: clear product information, stable URLs</li>
</ul>
<h3>Copilot</h3>
<p>Microsoft Copilot merchant features:</p>
<ul>
<li>Merchant Program with regional rules</li>
<li>Keys: feed quality, policy clarity</li>
<li>Focus: high-quality feed, clear policies</li>
</ul>
<h3>Google AI</h3>
<p>Google AI shopping features:</p>
<ul>
<li>AI overview + classic SEO/merchant feed</li>
<li>Keys: product data, schema, policy</li>
<li>Focus: structured data, product schema, clear policies</li>
</ul>
<hr />
<h2>Examples: what works, what doesn't?</h2>
<h3>✅ Good platform optimization</h3>
<p>Uniform price/stock/policy everywhere, stable feed, clean schema, consistent data.</p>
<h3>❌ Poor platform optimization</h3>
<p>Conflicting prices, missing policy, unstructured feed, inconsistent data.</p>
<hr />
<h2>Practice: create your platform map (10-15 min)</h2>
<p>Now you'll create a 1-page summary of the platforms and mark what you need. Here are the steps:</p>
<ol>
<li>Create a 1-pager with these columns:
   <ul>
   <li>Platform (ChatGPT/Copilot/Google AI)</li>
   <li>Requirement</li>
   <li>Region/Program</li>
   <li>Actions (data/policy/URL)</li>
   </ul>
</li>
<li>Mark for your store: which platform you're closest to, what's missing.</li>
</ol>
<h2>Independent practice: plan your tasks (5-10 min)</h2>
<p>For one platform, write 3 tasks (e.g., GTIN check, policy block refresh, add answer capsule).</p>
<hr />
<h2>Self-check</h2>
<p>Before moving on, check that:</p>
<ul>
<li>✅ Platform map created (3 platforms)</li>
<li>✅ Requirements listed for each</li>
<li>✅ 3 tasks written for one platform</li>
</ul>
<hr />
<h2>If you want to go deeper</h2>
<ul>
<li>ChatGPT Shopping: <a href="https://help.openai.com/en/articles/11128490-shopping-with-chatgpt-search" target="_blank" rel="noreferrer">https://help.openai.com/en/articles/11128490-shopping-with-chatgpt-search</a></li>
<li>Copilot Merchant Program: <a href="https://www.microsoft.com/en-us/microsoft-copilot/blog/2025/04/18/introducing-the-copilot-merchant-program/" target="_blank" rel="noreferrer">https://www.microsoft.com/en-us/microsoft-copilot/blog/2025/04/18/introducing-the-copilot-merchant-program/</a></li>
</ul>`,
  emailSubject: 'GEO Shopify – Day 5: Platform map',
  emailBody: `<h1>GEO Shopify – Day 5</h1>
<h2>Platform map: ChatGPT, Copilot, Google AI</h2>
<p>Today you'll review the main AI shopping surfaces, their differences, and constraints.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`
};

async function updateLesson5() {
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

    const lessonId = `${COURSE_ID}_DAY_5`;
    const lesson = await Lesson.findOneAndUpdate(
      { lessonId },
      {
        $set: {
          lessonId, courseId: course._id, dayNumber: UPDATED_LESSON_5.day,
          language: 'en', title: UPDATED_LESSON_5.title, content: UPDATED_LESSON_5.content,
          emailSubject: UPDATED_LESSON_5.emailSubject, emailBody: UPDATED_LESSON_5.emailBody, isActive: true,
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

updateLesson5();
