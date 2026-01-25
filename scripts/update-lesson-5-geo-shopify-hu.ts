/**
 * Update Lesson 5 for GEO_SHOPIFY_30 (Hungarian) - Quality Fix
 * 
 * This script safely updates only lesson 5 with quality improvements:
 * - Conversational tone
 * - Better structure
 * - Date disclaimers
 * - Active voice
 * 
 * Safe: Uses findOneAndUpdate with upsert, only updates lesson 5
 */

import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { Brand, Course, Lesson } from '../app/lib/models';

const COURSE_ID = 'GEO_SHOPIFY_30';

const UPDATED_LESSON_5 = {
  day: 5,
  title: 'Platform térkép: ChatGPT, Copilot, Google AI',
  content: `<h1>Platform térkép: ChatGPT, Copilot, Google AI</h1>
<p><em>Ma áttekintjük a fő AI bevásárló felületeket, különbségeiket és korlátaikat.</em></p>
<hr />
<h2>Mit fogsz ma megtanulni?</h2>
<p>Ma ezt a két dolgot fogod elérni:</p>
<ul>
<li>Felsorolod a 3 fő platformot és a boltra vonatkozó korlátokat.</li>
<li>Készítesz egy 1 oldalas „hol jelenhetek meg?" összefoglalót, amit azonnal használhatsz.</li>
</ul>
<hr />
<h2>Miért fontos ez neked?</h2>
<p>Az eltérő merchant programok és régiós korlátok miatt fontos, hogy pontosan tudd, hol jelenhetsz meg. Az eltérő tartalmi elvárások (strukturált adat, policy, azonosítók) miatt minden platformhoz más készültségi szint kell.</p>
<hr />
<h2>A 3 fő platform áttekintése</h2>
<h3>ChatGPT</h3>
<p>Mit kínál:</p>
<ul>
<li>Shopping válaszok közvetlenül a chat-ben</li>
<li>Merchant program (régió és eligibility függő)</li>
</ul>
<p>Kulcs követelmények:</p>
<ul>
<li>Pontos termékadatok</li>
<li>Idézhetőség – az AI biztonságosan hivatkozhat a boltodra</li>
</ul>
<h3>Copilot</h3>
<p>Mit kínál:</p>
<ul>
<li>Merchant Program (2025 áprilisában bejelentve)</li>
<li>Regionális szabályok</li>
</ul>
<p>Kulcs követelmények:</p>
<ul>
<li>Feed minőség – strukturált, pontos termékfeed</li>
<li>Policy információk – világos szállítási és visszaküldési információk</li>
</ul>
<h3>Google AI</h3>
<p>Mit kínál:</p>
<ul>
<li>AI overview a keresési eredményekben</li>
<li>Hagyományos SEO és merchant feed alap</li>
</ul>
<p>Kulcs követelmények:</p>
<ul>
<li>Termékadat – pontos, strukturált adatok</li>
<li>Schema markup – strukturált adatok a HTML-ben</li>
<li>Policy információk – világos szállítási és visszaküldési információk</li>
</ul>
<hr />
<h2>Példák: mi működik, mi nem?</h2>
<h3>✅ Jó platform előkészítés</h3>
<ul>
<li>Egységes ár/készlet/policy mindenhol</li>
<li>Stabil feed, amely nem változik</li>
<li>Tiszta schema markup</li>
</ul>
<h3>❌ Rossz platform előkészítés</h3>
<ul>
<li>Ellentmondó árak különböző platformokon</li>
<li>Hiányzó policy információk</li>
<li>Nem strukturált feed</li>
</ul>
<hr />
<h2>Gyakorlat: készítsd el a platform térképedet (10-15 perc)</h2>
<p>Most készíts egy 1 oldalas összefoglalót. Íme a lépések:</p>
<ol>
<li>Készíts egy összefoglalót mindhárom platformhoz (ChatGPT, Copilot, Google AI):
   <ul>
   <li>Mit kér a platform?</li>
   <li>Mi a korlát (régió, program elérhetőség)?</li>
   <li>Mit kell tenned (adat, policy, URL)?</li>
   </ul>
</li>
<li>Jelöld a saját boltodra: melyik platformhoz vagy legközelebb, melyikhez hiányzik még adat.</li>
</ol>
<h2>Önálló gyakorlat: válassz egy platformot (5-10 perc)</h2>
<p>Most válassz ki egy platformot, és írj 3 konkrét teendőt, amit el kell végezned. Példák:</p>
<ul>
<li>„GTIN ellenőrzés minden terméknél"</li>
<li>„Policy blokk frissítése a PDP-n"</li>
<li>„Answer capsule hozzáadása a termékoldalak tetejére"</li>
</ul>
<hr />
<h2>Önellenőrzés</h2>
<p>Mielőtt továbblépnél, ellenőrizd le:</p>
<ul>
<li>✅ Megvan a 3 platform fő követelménye</li>
<li>✅ Készült 1 oldalas „hol jelenhetek meg?" összefoglaló</li>
<li>✅ Felírtál 3 konkrét teendőt egy választott platformra</li>
</ul>
<hr />
<h2>Ha mélyebbre szeretnél menni</h2>
<ul>
<li>OpenAI Shopping help: <a href="https://help.openai.com/en/articles/11128490-shopping-with-chatgpt-search" target="_blank" rel="noreferrer">https://help.openai.com/en/articles/11128490-shopping-with-chatgpt-search</a></li>
<li>Microsoft Copilot Merchant Program (2025 áprilisában bejelentve): <a href="https://www.microsoft.com/en-us/microsoft-copilot/blog/2025/04/18/introducing-the-copilot-merchant-program/" target="_blank" rel="noreferrer">https://www.microsoft.com/en-us/microsoft-copilot/blog/2025/04/18/introducing-the-copilot-merchant-program/</a></li>
<li>Google AI Overview: <a href="https://developers.google.com/search/docs/appearance/google-ai-overviews" target="_blank" rel="noreferrer">https://developers.google.com/search/docs/appearance/google-ai-overviews</a></li>
</ul>`,
  emailSubject: 'GEO Shopify – 5. nap: Platform térkép',
  emailBody: `<h1>GEO Shopify – 5. nap</h1>
<h2>Platform térkép: ChatGPT, Copilot, Google AI</h2>
<p>Ma áttekintjük a 3 fő AI platformot, és készítesz egy „hol jelenhetek meg?" összefoglalót.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`
};

async function updateLesson5() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI not set');
    }

    const { default: connectDB } = await import('../app/lib/mongodb');
    await connectDB();
    console.log('✅ Connected to MongoDB');

    // Find or create course
    let brand = await Brand.findOne({ slug: 'amanoba' });
    if (!brand) {
      brand = await Brand.create({
        name: 'Amanoba',
        slug: 'amanoba',
        displayName: 'Amanoba',
        description: 'Unified Learning Platform',
        logo: '/AMANOBA.png',
        themeColors: { primary: '#FAB908', secondary: '#2D2D2D', accent: '#FAB908' },
        allowedDomains: ['amanoba.com', 'www.amanoba.com', 'localhost'],
        supportedLanguages: ['hu', 'en'],
        defaultLanguage: 'hu',
        isActive: true
      });
      console.log('✅ Brand created');
    }

    const course = await Course.findOneAndUpdate(
      { courseId: COURSE_ID },
      {
        $set: {
          courseId: COURSE_ID,
          name: 'GEO Shopify – 30 napos kurzus',
          description: '30 napos, gyakorlati GEO-kurzus Shopify kereskedőknek: napi 20-30 percben építed fel a termék- és tartalom alapokat, hogy generatív rendszerek biztonságosan megtalálják, értelmezzék és idézzék a boltodat.',
          language: 'hu',
          durationDays: 30,
          isActive: true,
          requiresPremium: false,
          brandId: brand._id,
          pointsConfig: {
            completionPoints: 1000,
            lessonPoints: 50,
            perfectCourseBonus: 500
          },
          xpConfig: {
            completionXP: 500,
            lessonXP: 25
          },
          metadata: {
            category: 'education',
            difficulty: 'intermediate',
            estimatedHours: 10,
            tags: ['geo', 'shopify', 'ecommerce'],
            instructor: 'Amanoba'
          }
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`✅ Course ${COURSE_ID} found/created: ${course.name}`);

    // Update lesson 5
    const lessonId = `${COURSE_ID}_DAY_05`;
    const lesson = await Lesson.findOneAndUpdate(
      { lessonId },
      {
        $set: {
          lessonId,
          courseId: course._id,
          dayNumber: UPDATED_LESSON_5.day,
          language: 'hu',
          title: UPDATED_LESSON_5.title,
          content: UPDATED_LESSON_5.content,
          emailSubject: UPDATED_LESSON_5.emailSubject,
          emailBody: UPDATED_LESSON_5.emailBody,
          isActive: true,
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log(`✅ Lesson 5 updated successfully`);
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
