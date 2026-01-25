/**
 * Update Lesson 10 for GEO_SHOPIFY_30 (Hungarian) - Quality Fix
 */

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { Brand, Course, Lesson } from '../app/lib/models';

const COURSE_ID = 'GEO_SHOPIFY_30';

const UPDATED_LESSON_10 = {
  day: 10,
  title: 'Szállítás és visszaküldés: egyértelműség',
  content: `<h1>Szállítás és visszaküldés: egyértelműség</h1>
<p><em>Ma letisztázod a szállítási és visszaküldési szabályokat, hogy az AI ne adjon téves ígéretet.</em></p>
<hr />
<h2>Mit fogsz ma megtanulni?</h2>
<p>Ma ezt a két dolgot fogod elérni:</p>
<ul>
<li>Frissíted vagy ellenőrzöd a shipping/returns blokkot a termékoldalakon (PDP).</li>
<li>Egységesíted a policy linkeket, hogy mindenhol ugyanaz legyen.</li>
</ul>
<hr />
<h2>Miért fontos ez neked?</h2>
<p>A félreértett szállítás vagy visszaküldési információ rontja a konverziót és növeli a support terhelését. Az AI idézheti a policy-t, ezért fontos, hogy pontos és könnyen megtalálható legyen.</p>
<hr />
<h2>Mit tegyél a szállítási és visszaküldési információkhoz?</h2>
<h3>Rövid blokk a termékoldalon</h3>
<p>Minden termékoldalon legyen egy rövid, egyértelmű blokk, ami tartalmazza:</p>
<ul>
<li><strong>Szállítási idő</strong>: pl. "3-5 nap"</li>
<li><strong>Szállítási ár</strong>: pl. "1500 Ft" vagy "Ingyenes"</li>
<li><strong>Visszaküldés határideje</strong>: pl. "30 napig"</li>
<li><strong>Visszaküldés költsége</strong>: pl. "Ingyenes" vagy "1500 Ft"</li>
</ul>
<h3>Policy link</h3>
<p>Linkeld a teljes policy-t egy stabil URL-en. Fontos, hogy:</p>
<ul>
<li>Ugyanaz a link minden termékoldalon</li>
<li>Stabil URL, amely nem változik</li>
<li>Könnyen megtalálható</li>
</ul>
<h3>Feed konzisztencia</h3>
<p>Ha a feed támogatja, ugyanez az információ legyen a feed-ben is, hogy a feed és a PDP egyezzen.</p>
<hr />
<h2>Példák: mi működik, mi nem?</h2>
<h3>✅ Jó shipping/returns blokk</h3>
<p>"Szállítás: 3-5 nap, 1500 Ft; Ingyenes visszaküldés 30 napig. Részletek: /policies/shipping"</p>
<h3>❌ Rossz shipping/returns blokk</h3>
<p>"Gyors szállítás" – nincs határidő, nincs ár, nincs link.</p>
<hr />
<h2>Gyakorlat: készítsd el az egységes blokkot (10-15 perc)</h2>
<p>Most készíts egy egységes shipping/returns blokkot. Íme a lépések:</p>
<ol>
<li>Írj egy egységes shipping/returns blokkot (2-3 sor), ami tartalmazza:
   <ul>
   <li>Szállítási idő és ár</li>
   <li>Visszaküldés határideje és költsége</li>
   <li>Policy link</li>
   </ul>
</li>
<li>Illeszd be 3 termékoldalra (PDP).</li>
<li>Ellenőrizd, hogy a link stabil és ugyanaz mindenhol.</li>
</ol>
<h2>Önálló gyakorlat: frissítsd a feed-et (5-10 perc)</h2>
<p>Most frissítsd a feed-et vagy a policy URL-t, ha eltér a PDP-től.</p>
<hr />
<h2>Önellenőrzés</h2>
<p>Mielőtt továbblépnél, ellenőrizd le:</p>
<ul>
<li>✅ 3 PDP frissítve shipping/returns blokkal</li>
<li>✅ Policy link stabil és egységes</li>
<li>✅ Feed és PDP egyezik</li>
</ul>
<hr />
<h2>Ha mélyebbre szeretnél menni</h2>
<ul>
<li>Shopify policy oldalak: <a href="https://help.shopify.com/en/manual/checkout-settings/refund-returns" target="_blank" rel="noreferrer">https://help.shopify.com/en/manual/checkout-settings/refund-returns</a></li>
<li>Google Merchant Center – Shipping információk: <a href="https://support.google.com/merchants/answer/6324484" target="_blank" rel="noreferrer">https://support.google.com/merchants/answer/6324484</a></li>
</ul>`,
  emailSubject: 'GEO Shopify – 10. nap: Szállítás és visszaküldés',
  emailBody: `<h1>GEO Shopify – 10. nap</h1>
<h2>Szállítás és visszaküldés: egyértelműség</h2>
<p>Ma letisztázod a szállítási és visszaküldési szabályokat, hogy az AI ne adjon téves ígéretet.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`
};

async function updateLesson10() {
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

    const lessonId = `${COURSE_ID}_DAY_10`;
    const lesson = await Lesson.findOneAndUpdate(
      { lessonId },
      {
        $set: {
          lessonId, courseId: course._id, dayNumber: UPDATED_LESSON_10.day,
          language: 'hu', title: UPDATED_LESSON_10.title, content: UPDATED_LESSON_10.content,
          emailSubject: UPDATED_LESSON_10.emailSubject, emailBody: UPDATED_LESSON_10.emailBody, isActive: true,
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log(`✅ Lesson 10 updated successfully`);
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

updateLesson10();
