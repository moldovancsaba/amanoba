/**
 * Update Lesson 20 for GEO_SHOPIFY_30 (Hungarian) - Quality Fix
 */

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { Brand, Course, Lesson } from '../app/lib/models';

const COURSE_ID = 'GEO_SHOPIFY_30';

const UPDATED_LESSON_20 = {
  day: 20,
  title: 'Minimum tartalom: nincs „thin" PDP',
  content: `<h1>Minimum tartalom: nincs „thin" PDP</h1>
<p><em>Ma felszámolod az alacsony tartalmú termékoldalakat.</em></p>
<hr />
<h2>Mit fogsz ma megtanulni?</h2>
<p>Ma ezt a két dolgot fogod elérni:</p>
<ul>
<li>Összeállítod a minimum tartalmi standardot, amit azonnal használhatsz.</li>
<li>Javítasz 3 „thin" oldalt, hogy megfeleljenek a standardnak.</li>
</ul>
<hr />
<h2>Miért fontos ez neked?</h2>
<p>A kevés tartalom kevésbé idézhető, és rossz ajánláshoz vezethet. Visszaküldés nő, ha a felhasználó nem kap elég információt a termékről. Fontos, hogy minden termékoldal tartalmazza a minimum tartalmi elemeket.</p>
<hr />
<h2>Minimum tartalmi elemek: mi kell bele?</h2>
<p>Egy jó termékoldal (PDP) tartalmazza ezeket az elemeket minimum:</p>
<ul>
<li><strong>Answer capsule</strong> – rövid összegzés az oldal tetején</li>
<li><strong>Ár/készlet</strong> – pontos ár és készlet információ</li>
<li><strong>Policy</strong> – szállítás és visszaküldés információk</li>
<li><strong>3 USP</strong> – 3 fő előny (Unique Selling Proposition)</li>
<li><strong>Specifikáció</strong> – termék specifikációk táblázatban</li>
<li><strong>2 kép variánssal</strong> – legalább 2 kép, variáns hozzárendeléssel</li>
</ul>
<h3>Hiány esetén mit tegyél?</h3>
<p>Ha hiányzik valami:</p>
<ul>
<li>Bővíts sablonból – használj előre elkészített sablonokat</li>
<li>Specifikáció táblázat – készíts egy specifikáció táblázatot</li>
<li>Képek hozzáadása – adj hozzá legalább 2 képet</li>
</ul>
<hr />
<h2>Példák: mi működik, mi nem?</h2>
<h3>✅ Jó tartalommal rendelkező PDP</h3>
<p>Answer capsule, ár/készlet, policy, 3 USP, specifikáció táblázat, 2+ kép variánssal.</p>
<h3>❌ „Thin" PDP (kevés tartalom)</h3>
<p>Csak termék név és ár, nincs leírás, nincs specifikáció, nincs kép vagy csak 1 kép.</p>
<hr />
<h2>Gyakorlat: javítsd a „thin" oldalakat (10-15 perc)</h2>
<p>Most összeállítod a minimum tartalmi standardot és javítasz 3 „thin" oldalt. Íme a lépések:</p>
<ol>
<li>Összeállítod a minimum tartalmi standardot a fenti elemekkel.</li>
<li>Válassz ki 3 „thin" oldalt a boltodban (kevés tartalommal).</li>
<li>Minden oldalhoz:
   <ul>
   <li>Ellenőrizd, mi hiányzik</li>
   <li>Bővítsd a hiányzó elemekkel</li>
   <li>Használj sablonokat, ha szükséges</li>
   </ul>
</li>
</ol>
<h2>Önálló gyakorlat: bővítsd további oldalakra (5-10 perc)</h2>
<p>Most bővítsd a minimum tartalmi standardot további 5-10 termékoldalra is.</p>
<hr />
<h2>Önellenőrzés</h2>
<p>Mielőtt továbblépnél, ellenőrizd le:</p>
<ul>
<li>✅ Minimum tartalmi standard összeállítva</li>
<li>✅ 3 „thin" oldal javítva</li>
<li>✅ Minden oldal tartalmazza a minimum elemeket</li>
</ul>
<hr />
<h2>Ha mélyebbre szeretnél menni</h2>
<ul>
<li>Shopify product page optimization: <a href="https://help.shopify.com/en/manual/online-store/themes/customizing-themes" target="_blank" rel="noreferrer">https://help.shopify.com/en/manual/online-store/themes/customizing-themes</a></li>
<li>Content quality guidelines: <a href="https://developers.google.com/search/docs/fundamentals/creating-helpful-content" target="_blank" rel="noreferrer">https://developers.google.com/search/docs/fundamentals/creating-helpful-content</a></li>
</ul>`,
  emailSubject: 'GEO Shopify – 20. nap: Minimum tartalom',
  emailBody: `<h1>GEO Shopify – 20. nap</h1>
<h2>Minimum tartalom: nincs „thin" PDP</h2>
<p>Ma felszámolod az alacsony tartalmú termékoldalakat.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`
};

async function updateLesson20() {
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

    const lessonId = `${COURSE_ID}_DAY_20`;
    const lesson = await Lesson.findOneAndUpdate(
      { lessonId },
      {
        $set: {
          lessonId, courseId: course._id, dayNumber: UPDATED_LESSON_20.day,
          language: 'hu', title: UPDATED_LESSON_20.title, content: UPDATED_LESSON_20.content,
          emailSubject: UPDATED_LESSON_20.emailSubject, emailBody: UPDATED_LESSON_20.emailBody, isActive: true,
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log(`✅ Lesson 20 updated successfully`);
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

updateLesson20();
