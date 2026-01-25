/**
 * Update Lesson 14 for GEO_SHOPIFY_30 (Hungarian) - Quality Fix
 */

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { Brand, Course, Lesson } from '../app/lib/models';

const COURSE_ID = 'GEO_SHOPIFY_30';

const UPDATED_LESSON_14 = {
  day: 14,
  title: 'Answer capsule: 5 soros összegzés a PDP tetején',
  content: `<h1>Answer capsule: 5 soros összegzés a PDP tetején</h1>
<p><em>Ma megírod a rövid blokkot, amit az AI biztonsággal idézhet.</em></p>
<hr />
<h2>Mit fogsz ma megtanulni?</h2>
<p>Ma ezt a két dolgot fogod elérni:</p>
<ul>
<li>Megírsz 2 answer capsule-t, amit azonnal használhatsz.</li>
<li>Beteszed őket a termékoldalak (PDP) tetejére.</li>
</ul>
<hr />
<h2>Miért fontos ez neked?</h2>
<p>A modell rövid válaszokat keres a hajtás felett. Az answer capsule csökkenti a félreértést: kinek való/nem való, ár/policy egyértelmű. Ez növeli az esélyt, hogy az AI pontosan idézze a boltodat.</p>
<hr />
<h2>5 soros answer capsule minta</h2>
<p>Egy jó answer capsule ebben a sorrendben tartalmazza az információkat:</p>
<ol>
<li><strong>Kinek és mire jó?</strong> – célközönség és használati terület</li>
<li><strong>Kinek nem ajánlott?</strong> – kiknek nem való ez a termék</li>
<li><strong>Fő előny</strong> (1-2 bullet) – legfontosabb előnyök</li>
<li><strong>Ár + készlet státusz</strong> – aktuális ár és elérhetőség</li>
<li><strong>Szállítás/visszaküldés röviden + link</strong> – rövid információ és policy link</li>
</ol>
<hr />
<h2>Példák: mi működik, mi nem?</h2>
<h3>✅ Jó answer capsule</h3>
<p>"Futócipő ideális kezdő futóknak, akik napi 3-5 km-t futnak. Nem ajánlott versenyfutóknak vagy extrém terepre. Fő előnyök: párnázás, stabilitás. Ár: 15.990 Ft, készleten. Szállítás: 3-5 nap, 1500 Ft. Ingyenes visszaküldés 30 napig. Részletek: /policies/shipping"</p>
<h3>❌ Rossz answer capsule</h3>
<p>"Nagyszerű termék! Gyors szállítás!" – nincs konkrét információ, nincs ár, nincs link.</p>
<hr />
<h2>Gyakorlat: írd meg az answer capsule-okat (10-15 perc)</h2>
<p>Most írj meg 2 answer capsule-t és helyezd el őket a termékoldalakon. Íme a lépések:</p>
<ol>
<li>Válassz ki 2 terméket a boltodban.</li>
<li>Minden termékhez írj egy 5 soros answer capsule-t a fenti minta szerint.</li>
<li>Beteszed őket a termékoldalak (PDP) tetejére.</li>
<li>Ellenőrizd, hogy minden információ pontos és a linkek működnek.</li>
</ol>
<h2>Önálló gyakorlat: bővítsd további termékekre (5-10 perc)</h2>
<p>Most bővítsd az answer capsule-okat további 3-5 termékre is.</p>
<hr />
<h2>Önellenőrzés</h2>
<p>Mielőtt továbblépnél, ellenőrizd le:</p>
<ul>
<li>✅ 2 answer capsule megírva</li>
<li>✅ Answer capsule-ok elhelyezve a PDP-k tetején</li>
<li>✅ Minden információ pontos</li>
<li>✅ Linkek működnek</li>
</ul>
<hr />
<h2>Ha mélyebbre szeretnél menni</h2>
<ul>
<li>GEO answer capsule best practices: <a href="https://searchengineland.com/guide/what-is-geo" target="_blank" rel="noreferrer">https://searchengineland.com/guide/what-is-geo</a></li>
<li>Shopify theme sections: <a href="https://help.shopify.com/en/manual/online-store/themes/theme-structure/sections" target="_blank" rel="noreferrer">https://help.shopify.com/en/manual/online-store/themes/theme-structure/sections</a></li>
</ul>`,
  emailSubject: 'GEO Shopify – 14. nap: Answer capsule',
  emailBody: `<h1>GEO Shopify – 14. nap</h1>
<h2>Answer capsule: 5 soros összegzés a PDP tetején</h2>
<p>Ma megírod a rövid blokkot, amit az AI biztonsággal idézhet.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`
};

async function updateLesson14() {
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

    const lessonId = `${COURSE_ID}_DAY_14`;
    const lesson = await Lesson.findOneAndUpdate(
      { lessonId },
      {
        $set: {
          lessonId, courseId: course._id, dayNumber: UPDATED_LESSON_14.day,
          language: 'hu', title: UPDATED_LESSON_14.title, content: UPDATED_LESSON_14.content,
          emailSubject: UPDATED_LESSON_14.emailSubject, emailBody: UPDATED_LESSON_14.emailBody, isActive: true,
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log(`✅ Lesson 14 updated successfully`);
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

updateLesson14();
