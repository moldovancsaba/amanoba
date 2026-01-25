/**
 * Update Lesson 22 for GEO_SHOPIFY_30 (Hungarian) - Quality Fix
 */

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { Brand, Course, Lesson } from '../app/lib/models';

const COURSE_ID = 'GEO_SHOPIFY_30';

const UPDATED_LESSON_22 = {
  day: 22,
  title: 'Buying guide: AI-barát szerkezet',
  content: `<h1>Buying guide: AI-barát szerkezet</h1>
<p><em>Ma olyan útmutatót írsz, amit az AI könnyen összegez.</em></p>
<hr />
<h2>Mit fogsz ma megtanulni?</h2>
<p>Ma ezt a két dolgot fogod elérni:</p>
<ul>
<li>Megírsz 1 buying guide vázat, amit azonnal használhatsz.</li>
<li>Hozzárendeled 3 PDP-t linkkel, hogy a guide konkrét termékekre mutasson.</li>
</ul>
<hr />
<h2>Miért fontos ez neked?</h2>
<p>A guide-ok jó források az AI-nak, ha tiszták a szekciók. Ez csökkenti a félreértést és erősíti a bizalmat. Az AI szívesebben idéz jól strukturált buying guide-okat.</p>
<hr />
<h2>Buying guide struktúra: mi kell bele?</h2>
<p>Egy jó AI-barát buying guide ezeket a szekciókat tartalmazza:</p>
<ol>
<li><strong>Hero blokk</strong>: kinek való, milyen helyzetre – rövid, egyértelmű bemutatás</li>
<li><strong>Döntési szempontok</strong> (3-5 bullet) – mire figyelj a választásnál</li>
<li><strong>Top választások</strong> indoklással – legjobb termékek ajánlása</li>
<li><strong>Policy röviden + link</strong> – szállítás, visszaküldés</li>
<li><strong>Termék linkek</strong> – konkrét PDP linkek a top választásokhoz</li>
</ol>
<hr />
<h2>Példák: mi működik, mi nem?</h2>
<h3>✅ Jó buying guide</h3>
<p>Hero blokk, döntési szempontok, top választások indoklással, policy link, termék linkek.</p>
<h3>❌ Rossz buying guide</h3>
<p>Hosszú, strukturálatlan szöveg, nincs szekció, nincs link, nincs ajánlás.</p>
<hr />
<h2>Gyakorlat: írd meg a buying guide-ot (10-15 perc)</h2>
<p>Most megírsz 1 buying guide vázat és hozzárendelsz 3 PDP-t. Íme a lépések:</p>
<ol>
<li>Válassz ki egy termékkategóriát a boltodban.</li>
<li>Írj egy buying guide vázat a fenti struktúra szerint:
   <ul>
   <li>Hero blokk (kinek, milyen helyzetre)</li>
   <li>Döntési szempontok (3-5 bullet)</li>
   <li>Top választások indoklással</li>
   <li>Policy röviden + link</li>
   </ul>
</li>
<li>Hozzárendelsz 3 PDP-t linkkel a top választásokhoz.</li>
</ol>
<h2>Önálló gyakorlat: bővítsd további kategóriákra (5-10 perc)</h2>
<p>Most bővítsd a buying guide-okat további 2-3 kategóriára is.</p>
<hr />
<h2>Önellenőrzés</h2>
<p>Mielőtt továbblépnél, ellenőrizd le:</p>
<ul>
<li>✅ 1 buying guide váz megírva</li>
<li>✅ 3 PDP hozzárendelve linkkel</li>
<li>✅ Minden szekció a helyén van</li>
<li>✅ Guide AI-barát struktúrával</li>
</ul>
<hr />
<h2>Ha mélyebbre szeretnél menni</h2>
<ul>
<li>Content marketing best practices: <a href="https://www.shopify.com/blog/content-marketing" target="_blank" rel="noreferrer">https://www.shopify.com/blog/content-marketing</a></li>
<li>Google helpful content guidelines: <a href="https://developers.google.com/search/docs/fundamentals/creating-helpful-content" target="_blank" rel="noreferrer">https://developers.google.com/search/docs/fundamentals/creating-helpful-content</a></li>
</ul>`,
  emailSubject: 'GEO Shopify – 22. nap: Buying guide',
  emailBody: `<h1>GEO Shopify – 22. nap</h1>
<h2>Buying guide: AI-barát szerkezet</h2>
<p>Ma olyan útmutatót írsz, amit az AI könnyen összegez.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`
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
          name: 'GEO Shopify – 30 napos kurzus',
          description: '30 napos, gyakorlati GEO-kurzus Shopify kereskedőknek: napi 20-30 percben építed fel a termék- és tartalom alapokat, hogy generatív rendszerek biztonságosan megtalálják, értelmezzék és idézzék a boltodat.',
          language: 'hu', durationDays: 30, isActive: true, requiresPremium: false,
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
          language: 'hu', title: UPDATED_LESSON_22.title, content: UPDATED_LESSON_22.content,
          emailSubject: UPDATED_LESSON_22.emailSubject, emailBody: UPDATED_LESSON_22.emailBody, isActive: true,
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log(`✅ Lesson 22 updated successfully`);
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
