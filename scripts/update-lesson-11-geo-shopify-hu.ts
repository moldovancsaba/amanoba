/**
 * Update Lesson 11 for GEO_SHOPIFY_30 (Hungarian) - Quality Fix
 */

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { Brand, Course, Lesson } from '../app/lib/models';

const COURSE_ID = 'GEO_SHOPIFY_30';

const UPDATED_LESSON_11 = {
  day: 11,
  title: 'Bizalom és bizonyíték: identity, support, proof',
  content: `<h1>Bizalom és bizonyíték: identity, support, proof</h1>
<p><em>Ma felépíted a bizalmi elemeket: cégazonosság, support, bizonyíték (reviews/garancia).</em></p>
<hr />
<h2>Mit fogsz ma megtanulni?</h2>
<p>Ma ezt a két dolgot fogod elérni:</p>
<ul>
<li>Összegyűjtöd és egységesíted a trust elemeket.</li>
<li>Elhelyezed őket a kulcsoldalakon, hogy az AI és a vásárlók könnyen megtalálják.</li>
</ul>
<hr />
<h2>Miért fontos ez neked?</h2>
<p>Az AI biztonságos, megbízható forrást idéz szívesen. A vásárló gyorsan ellenőrzi: ki vagy, hogyan segítesz, mit ígérsz. Ha ezek hiányoznak vagy pontatlanok, az AI nem fogja biztonságosan idézni a boltodat.</p>
<hr />
<h2>Trust elemek: mi kell bele?</h2>
<h3>Identity (Cégazonosság)</h3>
<p>Minden oldalon legyen egyértelmű:</p>
<ul>
<li>Cég vagy brand bemutatás</li>
<li>Elérhetőség (email, telefon, cím)</li>
<li>Rólunk oldal link</li>
</ul>
<h3>Support (Támogatás)</h3>
<p>Világos információ a támogatásról:</p>
<ul>
<li>Elérhetőség (email, chat, telefon)</li>
<li>Válaszidő (pl. "24-48 óra")</li>
<li>Támogatási csatornák</li>
</ul>
<h3>Proof (Bizonyíték)</h3>
<p>Valós bizonyítékok, amelyek növelik a bizalmat:</p>
<ul>
<li>Valós review-k (nem kamuk)</li>
<li>Garancia információk</li>
<li>Díjak vagy elismerések (ha vannak)</li>
</ul>
<hr />
<h2>Példák: mi működik, mi nem?</h2>
<h3>✅ Jó trust blokk</h3>
<p>"Cég: XY Kft., email/telefon, support: 24–48 óra, garancia: 1 év, valós review-k linkje."</p>
<h3>❌ Rossz trust blokk</h3>
<p>Nincs elérhetőség, kamureview-k, üres "rólunk" oldal.</p>
<hr />
<h2>Gyakorlat: készítsd el a trust blokkot (10-15 perc)</h2>
<p>Most készíts egy trust blokkot és helyezd el a kulcsoldalakon. Íme a lépések:</p>
<ol>
<li>Készíts egy trust blokkot, ami tartalmazza:
   <ul>
   <li>Identity: cég/brand bemutatás, elérhetőség</li>
   <li>Support: elérhetőség, válaszidő, csatornák</li>
   <li>Proof: valós reviews, garancia, díjak</li>
   </ul>
</li>
<li>Helyezd el 3 oldalon: termékoldal (PDP), kollekció oldal, rólunk oldal.</li>
<li>Ellenőrizd a review-k valóságát és a garancia szöveg pontosságát.</li>
</ol>
<h2>Önálló gyakorlat: frissítsd a feed-et (5-10 perc)</h2>
<p>Most frissítsd a feed-ben (ha támogatott) a brand és garancia mezőket.</p>
<hr />
<h2>Önellenőrzés</h2>
<p>Mielőtt továbblépnél, ellenőrizd le:</p>
<ul>
<li>✅ 3 oldalon elhelyezted a trust blokkot</li>
<li>✅ Review-k valósak és ellenőrizhetők</li>
<li>✅ Garancia szöveg pontos</li>
<li>✅ Feed-ben frissítve a brand/garancia mezők</li>
</ul>
<hr />
<h2>Ha mélyebbre szeretnél menni</h2>
<ul>
<li>Shopify trust badges: <a href="https://help.shopify.com/en/manual/checkout-settings/trust-badges" target="_blank" rel="noreferrer">https://help.shopify.com/en/manual/checkout-settings/trust-badges</a></li>
<li>Google Merchant Center – Trust signals: <a href="https://support.google.com/merchants/answer/7052112" target="_blank" rel="noreferrer">https://support.google.com/merchants/answer/7052112</a></li>
</ul>`,
  emailSubject: 'GEO Shopify – 11. nap: Bizalom és bizonyíték',
  emailBody: `<h1>GEO Shopify – 11. nap</h1>
<h2>Bizalom és bizonyíték: identity, support, proof</h2>
<p>Ma felépíted a bizalmi elemeket, és elhelyezed őket a kulcsoldalakon.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`
};

async function updateLesson11() {
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

    const lessonId = `${COURSE_ID}_DAY_11`;
    const lesson = await Lesson.findOneAndUpdate(
      { lessonId },
      {
        $set: {
          lessonId, courseId: course._id, dayNumber: UPDATED_LESSON_11.day,
          language: 'hu', title: UPDATED_LESSON_11.title, content: UPDATED_LESSON_11.content,
          emailSubject: UPDATED_LESSON_11.emailSubject, emailBody: UPDATED_LESSON_11.emailBody, isActive: true,
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log(`✅ Lesson 11 updated successfully`);
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

updateLesson11();
