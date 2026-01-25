/**
 * Update Lesson 13 for GEO_SHOPIFY_30 (Hungarian) - Quality Fix
 */

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { Brand, Course, Lesson } from '../app/lib/models';

const COURSE_ID = 'GEO_SHOPIFY_30';

const UPDATED_LESSON_13 = {
  day: 13,
  title: 'Idézhető termékoldal blueprint',
  content: `<h1>Idézhető termékoldal blueprint</h1>
<p><em>Ma olyan PDP szerkezetet építesz, amit az AI biztonsággal idéz.</em></p>
<hr />
<h2>Mit fogsz ma megtanulni?</h2>
<p>Ma ezt a két dolgot fogod elérni:</p>
<ul>
<li>Felrajzolod a „GEO-ready" PDP blokk-sorrendet, amit azonnal használhatsz.</li>
<li>Átdolgozol 1 termékoldalt a blueprint szerint.</li>
</ul>
<hr />
<h2>Miért fontos ez neked?</h2>
<p>A generatív modellek a felső blokkokat olvassák először. A tiszta szerkezet csökkenti a félreértelmezést (ár, policy, variáns), és növeli az esélyt, hogy az AI pontosan idézze a boltodat.</p>
<hr />
<h2>Ajánlott PDP blokk-sorrend</h2>
<p>Egy GEO-ready termékoldal ebben a sorrendben tartalmazza az elemeket:</p>
<ol>
<li><strong>Answer capsule</strong> (kinek, mire jó/nem jó, ár/stock röviden) – a legfontosabb az oldal tetején</li>
<li><strong>Fő kép + variáns vizuál</strong> – termék képek, variáns választó</li>
<li><strong>Ár, készlet, kulcs USPs, CTA</strong> – vásárlásra ösztönző információk</li>
<li><strong>Policy blokk</strong> (szállítás/retour linkkel) – egyértelmű információk</li>
<li><strong>Részletes leírás, specifikáció</strong> – részletes termék információk</li>
<li><strong>Bizalom</strong>: review, garancia, support – bizalmi elemek</li>
</ol>
<hr />
<h2>Példák: mi működik, mi nem?</h2>
<h3>✅ Jó GEO-ready PDP</h3>
<p>Rövid answer capsule az oldal tetején, tiszta ár/készlet, policy link, specifikáció táblázat, trust blokk.</p>
<h3>❌ Rossz GEO-ready PDP</h3>
<p>Hosszú leírás az elején, ár/készlet nehezen megtalálható, nincs policy link, összemosott struktúra.</p>
<hr />
<h2>Gyakorlat: készítsd el a blueprintet (10-15 perc)</h2>
<p>Most készíts egy GEO-ready PDP blueprintet és alkalmazd egy termékoldalon. Íme a lépések:</p>
<ol>
<li>Felrajzold a „GEO-ready" PDP blokk-sorrendet a fenti 6 elemmel.</li>
<li>Válassz ki 1 termékoldalt a boltodban.</li>
<li>Átdolgozod a termékoldalt a blueprint szerint:
   <ul>
   <li>Answer capsule az oldal tetején</li>
   <li>Fő kép és variáns választó</li>
   <li>Ár, készlet, USPs, CTA</li>
   <li>Policy blokk</li>
   <li>Részletes leírás</li>
   <li>Trust blokk</li>
   </ul>
</li>
</ol>
<h2>Önálló gyakorlat: alkalmazd más termékekre (5-10 perc)</h2>
<p>Most alkalmazd a blueprintet 2-3 további termékoldalra is.</p>
<hr />
<h2>Önellenőrzés</h2>
<p>Mielőtt továbblépnél, ellenőrizd le:</p>
<ul>
<li>✅ Megvan a GEO-ready PDP blueprint</li>
<li>✅ 1 termékoldal átdolgozva a blueprint szerint</li>
<li>✅ Minden blokk a helyén van</li>
</ul>
<hr />
<h2>Ha mélyebbre szeretnél menni</h2>
<ul>
<li>Shopify theme customization: <a href="https://help.shopify.com/en/manual/online-store/themes/customizing-themes" target="_blank" rel="noreferrer">https://help.shopify.com/en/manual/online-store/themes/customizing-themes</a></li>
<li>Google Merchant Center – Product page best practices: <a href="https://support.google.com/merchants/answer/7052112" target="_blank" rel="noreferrer">https://support.google.com/merchants/answer/7052112</a></li>
</ul>`,
  emailSubject: 'GEO Shopify – 13. nap: Idézhető PDP blueprint',
  emailBody: `<h1>GEO Shopify – 13. nap</h1>
<h2>Idézhető termékoldal blueprint</h2>
<p>Ma olyan PDP szerkezetet építesz, amit az AI biztonsággal idéz.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`
};

async function updateLesson13() {
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

    const lessonId = `${COURSE_ID}_DAY_13`;
    const lesson = await Lesson.findOneAndUpdate(
      { lessonId },
      {
        $set: {
          lessonId, courseId: course._id, dayNumber: UPDATED_LESSON_13.day,
          language: 'hu', title: UPDATED_LESSON_13.title, content: UPDATED_LESSON_13.content,
          emailSubject: UPDATED_LESSON_13.emailSubject, emailBody: UPDATED_LESSON_13.emailBody, isActive: true,
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log(`✅ Lesson 13 updated successfully`);
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

updateLesson13();
