/**
 * Update Lesson 1 for GEO_SHOPIFY_30_EN (English) - Quality Fix
 */

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { Brand, Course, Lesson } from '../app/lib/models';

const COURSE_ID = 'GEO_SHOPIFY_30_EN';

const UPDATED_LESSON_1 = {
  day: 1,
  title: 'What GEO is (and is not) for Shopify',
  content: `<h1>What GEO is (and is not) for Shopify</h1>
<p><em>Today you'll understand how GEO differs from SEO and what "showing up in AI answers" really means.</em></p>
<hr />
<h2>What you'll learn today</h2>
<p>Today you'll achieve these three things:</p>
<ul>
<li>You'll clearly understand the difference between GEO and SEO.</li>
<li>You'll know exactly what to expect from GEO: citation, inclusion, and consistency.</li>
<li>You'll create 5 GEO prompts for your store that you can use right away.</li>
</ul>
<hr />
<h2>Why this matters to you</h2>
<p>AI answers only list stores if information is easy to fetch and safe to quote. GEO increases your chance of being mentioned, but it doesn't guarantee a sale. Good GEO foundations reduce the risk of appearing in misleading recommendations (wrong price, stock, or shipping information).</p>
<hr />
<h2>GEO vs SEO: what's the difference?</h2>
<h3>SEO (Search Engine Optimization)</h3>
<p>SEO focuses on:</p>
<ul>
<li>Ranking in the 10 blue links</li>
<li>Traditional search results</li>
<li>Keyword optimization</li>
</ul>
<h3>GEO (Generative Engine Optimization)</h3>
<p>GEO focuses on:</p>
<ul>
<li>Appearing and being cited in generative answers</li>
<li>AI-powered search results</li>
<li>Data clarity and quotability</li>
</ul>
<h3>What to expect from GEO</h3>
<p>When you optimize for GEO, you can expect:</p>
<ul>
<li><strong>Inclusion</strong>: Does your brand/product show up in AI answers?</li>
<li><strong>Citation</strong>: Does the answer link to your domain?</li>
<li><strong>Consistency</strong>: Does it repeat across multiple runs?</li>
</ul>
<hr />
<h2>Examples: what works, what doesn't?</h2>
<h3>✅ Good GEO foundation</h3>
<p>Clear product data (GTIN, price, stock), transparent shipping/returns, clean HTML, stable URLs.</p>
<h3>❌ Poor GEO foundation</h3>
<p>Missing identifiers, misleading price, dynamic/duplicate URLs, hidden shipping information.</p>
<hr />
<h2>Practice: create your GEO prompts (10-15 min)</h2>
<p>Now you'll write 5 GEO prompts for your store and clarify what you expect. Here are the steps:</p>
<ol>
<li>Write 5 GEO prompts for your store (e.g., "Best [category] 2025 in [country]").</li>
<li>Note what you expect for each: inclusion, citation, consistency.</li>
<li>Save them in a table with columns: Prompt | Expected outcome | Notes.</li>
</ol>
<h2>Independent practice: test your prompts (5-10 min)</h2>
<p>Now run the 5 prompts in ChatGPT/Copilot/Google AI and note if your store appears and is cited.</p>
<hr />
<h2>Self-check</h2>
<p>Before moving on, check that:</p>
<ul>
<li>✅ You have 5 prompts written</li>
<li>✅ You can state GEO vs SEO differences clearly</li>
<li>✅ You wrote expected outcomes for each prompt</li>
<li>✅ You ran the first manual test and took notes</li>
</ul>
<hr />
<h2>If you want to go deeper</h2>
<ul>
<li>arXiv: GEO (Generative Engine Optimization): <a href="https://arxiv.org/abs/2311.09735" target="_blank" rel="noreferrer">https://arxiv.org/abs/2311.09735</a></li>
<li>Search Engine Land – What is GEO: <a href="https://searchengineland.com/guide/what-is-geo" target="_blank" rel="noreferrer">https://searchengineland.com/guide/what-is-geo</a></li>
</ul>`,
  emailSubject: 'GEO Shopify – Day 1: What GEO is (and is not)',
  emailBody: `<h1>GEO Shopify – Day 1</h1>
<h2>What GEO is (and is not) for Shopify</h2>
<p>Today you'll write 5 GEO prompts for your store and clarify GEO vs SEO.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Read the lesson →</a></p>`
};

async function updateLesson1() {
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

    const lessonId = `${COURSE_ID}_DAY_1`;
    const lesson = await Lesson.findOneAndUpdate(
      { lessonId },
      {
        $set: {
          lessonId, courseId: course._id, dayNumber: UPDATED_LESSON_1.day,
          language: 'en', title: UPDATED_LESSON_1.title, content: UPDATED_LESSON_1.content,
          emailSubject: UPDATED_LESSON_1.emailSubject, emailBody: UPDATED_LESSON_1.emailBody, isActive: true,
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log(`✅ Lesson 1 updated successfully`);
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

updateLesson1();
