/**
 * Update Lesson 28 for GEO_SHOPIFY_30 (Hungarian) - Quality Fix
 */

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { Brand, Course, Lesson } from '../app/lib/models';

const COURSE_ID = 'GEO_SHOPIFY_30';

const UPDATED_LESSON_28 = {
  day: 28,
  title: 'Merchant programok: jogosultság és onboarding',
  content: `<h1>Merchant programok: jogosultság és onboarding</h1>
<p><em>Ma felméred, hogy mely AI/kereskedő programok érhetők el, és mit kérnek.</em></p>
<hr />
<h2>Mit fogsz ma megtanulni?</h2>
<p>Ma ezt a két dolgot fogod elérni:</p>
<ul>
<li>Összeveted a fő programokat (ChatGPT/Copilot/Google).</li>
<li>Checklistet készítesz az elvárásokra, hogy követni tudd a státuszt.</li>
</ul>
<hr />
<h2>Miért fontos ez neked?</h2>
<p>Jogosultság hiányában nem jelenik meg a bolt. Onboarding hibák késleltetik a megjelenést. Fontos, hogy minden program követelményét teljesítsd.</p>
<hr />
<h2>Merchant programok: mi kell bele?</h2>
<h3>Elvárások</h3>
<p>Fő követelmények a programokhoz:</p>
<ul>
<li>Feed minőség – pontos, naprakész feed</li>
<li>Policy – szállítás, visszaküldés információk</li>
<li>Régió – támogatott régiók</li>
<li>Brand/GTIN – márka és azonosítók</li>
<li>Ár/készlet – pontos ár és készlet információk</li>
</ul>
<h3>Onboarding</h3>
<p>Onboarding folyamat:</p>
<ul>
<li>Verifikáció – domain és bolt verifikáció</li>
<li>Domain – regisztrált domain</li>
<li>Support elérhetőség – támogatási információk</li>
</ul>
<hr />
<h2>Példák: mi működik, mi nem?</h2>
<h3>✅ Jó merchant program kezelés</h3>
<p>Checklist a programhoz, státusz nyomon követve, felelősök hozzárendelve.</p>
<h3>❌ Rossz merchant program kezelés</h3>
<p>"Majd jelentkezünk" dokumentáció nélkül, nincs követés, nincs felelős.</p>
<hr />
<h2>Gyakorlat: készítsd el a program táblázatot (10-15 perc)</h2>
<p>Most összeveted a fő programokat és készítesz egy checklistet. Íme a lépések:</p>
<ol>
<li>Készíts egy táblázatot ezekkel az oszlopokkal:
   <ul>
   <li>Program</li>
   <li>Régió</li>
   <li>Követelmény</li>
   <li>Státusz</li>
   <li>Felelős</li>
   </ul>
</li>
<li>Töltsd ki a három fő platformra (ChatGPT, Copilot, Google).</li>
</ol>
<h2>Önálló gyakorlat: jelöld a hiányosságokat (5-10 perc)</h2>
<p>Most jelölj 3 hiányt és feladatot az onboardinghoz.</p>
<hr />
<h2>Önellenőrzés</h2>
<p>Mielőtt továbblépnél, ellenőrizd le:</p>
<ul>
<li>✅ Program táblázat kész</li>
<li>✅ Hiányok kijelölve</li>
<li>✅ Felelősök megvannak</li>
</ul>
<hr />
<h2>Ha mélyebbre szeretnél menni</h2>
<ul>
<li>ChatGPT Shopping: <a href="https://help.openai.com/en/articles/11128490-shopping-with-chatgpt-search" target="_blank" rel="noreferrer">https://help.openai.com/en/articles/11128490-shopping-with-chatgpt-search</a></li>
<li>Microsoft Copilot Merchant Program: <a href="https://www.microsoft.com/en-us/microsoft-copilot/blog/2025/04/18/introducing-the-copilot-merchant-program/" target="_blank" rel="noreferrer">https://www.microsoft.com/en-us/microsoft-copilot/blog/2025/04/18/introducing-the-copilot-merchant-program/</a></li>
</ul>`,
  emailSubject: 'GEO Shopify – 28. nap: Merchant programok',
  emailBody: `<h1>GEO Shopify – 28. nap</h1>
<h2>Merchant programok: jogosultság és onboarding</h2>
<p>Ma felméred, hogy mely AI/kereskedő programok érhetők el, és mit kérnek.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`
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
          name: 'GEO Shopify – 30 napos kurzus',
          description: '30 napos, gyakorlati GEO-kurzus Shopify kereskedőknek: napi 20-30 percben építed fel a termék- és tartalom alapokat, hogy generatív rendszerek biztonságosan megtalálják, értelmezzék és idézzék a boltodat.',
          language: 'hu', durationDays: 30, isActive: true, requiresPremium: false,
          brandId: brand._id,
          pointsConfig: { completionPoints: 1000, lessonPoints: 50, perfectCourseBonus: 500 },
          xpConfig: { completionXP: 500, lessonXP: 28 },
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
          language: 'hu', title: UPDATED_LESSON_28.title, content: UPDATED_LESSON_28.content,
          emailSubject: UPDATED_LESSON_28.emailSubject, emailBody: UPDATED_LESSON_28.emailBody, isActive: true,
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log(`✅ Lesson 28 updated successfully`);
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
