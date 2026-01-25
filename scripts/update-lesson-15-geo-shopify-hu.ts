/**
 * Update Lesson 15 for GEO_SHOPIFY_30 (Hungarian) - Quality Fix
 */

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { Brand, Course, Lesson } from '../app/lib/models';

const COURSE_ID = 'GEO_SHOPIFY_30';

const UPDATED_LESSON_15 = {
  day: 15,
  title: 'Variáns tisztaság: méret/szín keveredés nélkül',
  content: `<h1>Variáns tisztaság: méret/szín keveredés nélkül</h1>
<p><em>Ma rögzíted, hogy a variánsadatok egyértelműek legyenek az AI számára.</em></p>
<hr />
<h2>Mit fogsz ma megtanulni?</h2>
<p>Ma ezt a két dolgot fogod elérni:</p>
<ul>
<li>Átnézel 10 variánst, és egységesíted a megnevezést.</li>
<li>Hozzárendeled a képeket variáns szinten, hogy minden variáns egyértelműen azonosítható legyen.</li>
</ul>
<hr />
<h2>Miért fontos ez neked?</h2>
<p>A kevert variánsok félreajánláshoz vezetnek. Az AI szívesebben idézi az egyértelmű variánsadatot, ami növeli az esélyt, hogy pontosan ajánlja a termékedet.</p>
<hr />
<h2>Variáns jelölés: mi kell bele?</h2>
<h3>Variáns cím</h3>
<p>A variáns címben jelenjen meg egyértelműen:</p>
<ul>
<li>Méret (pl. "42", "L", "XL")</li>
<li>Szín (pl. "kék", "fekete")</li>
<li>Egyéb jellemzők (ha vannak)</li>
</ul>
<h3>Képek</h3>
<p>Képek variáns szinten párosítva:</p>
<ul>
<li>Minden variánshoz saját kép</li>
<li>Kép egyértelműen mutatja a variánst</li>
<li>Nincs keveredés a képek között</li>
</ul>
<h3>SKU és GTIN</h3>
<p>SKU/GTIN variáns-specifikus:</p>
<ul>
<li>Minden variánshoz egyedi SKU</li>
<li>GTIN ahol elérhető</li>
<li>Nincs duplikáció</li>
</ul>
<hr />
<h2>Példák: mi működik, mi nem?</h2>
<h3>✅ Jó variáns jelölés</h3>
<p>"Férfi, kék, 42" + kék cipő kép + egyedi SKU/GTIN minden variánshoz.</p>
<h3>❌ Rossz variáns jelölés</h3>
<p>"42 kék vagy fekete?" – keveredés, nincs egyértelmű variáns, képek nem párosítva.</p>
<hr />
<h2>Gyakorlat: egységesítsd a variánsokat (10-15 perc)</h2>
<p>Most átnézel 10 variánst és egységesíted a megnevezést. Íme a lépések:</p>
<ol>
<li>Válassz ki 10 variánst különböző termékekből.</li>
<li>Ellenőrizd minden variánsnál:
   <ul>
   <li>Variáns cím egyértelmű (méret/szín)</li>
   <li>Kép variáns szinten párosítva</li>
   <li>SKU/GTIN variáns-specifikus</li>
   </ul>
</li>
<li>Egységesítsd a megnevezést, ha szükséges.</li>
<li>Párosítsd a képeket a variánsokhoz.</li>
</ol>
<h2>Önálló gyakorlat: bővítsd további termékekre (5-10 perc)</h2>
<p>Most bővítsd a variáns tisztaságot további 5-10 termékre is.</p>
<hr />
<h2>Önellenőrzés</h2>
<p>Mielőtt továbblépnél, ellenőrizd le:</p>
<ul>
<li>✅ 10 variáns átnézve</li>
<li>✅ Variáns megnevezés egységes</li>
<li>✅ Képek variáns szinten párosítva</li>
<li>✅ SKU/GTIN variáns-specifikus</li>
</ul>
<hr />
<h2>Ha mélyebbre szeretnél menni</h2>
<ul>
<li>Shopify variáns kezelés: <a href="https://help.shopify.com/en/manual/products/products/product-variants" target="_blank" rel="noreferrer">https://help.shopify.com/en/manual/products/products/product-variants</a></li>
<li>Google Merchant Center – Variáns követelmények: <a href="https://support.google.com/merchants/answer/6324484" target="_blank" rel="noreferrer">https://support.google.com/merchants/answer/6324484</a></li>
</ul>`,
  emailSubject: 'GEO Shopify – 15. nap: Variáns tisztaság',
  emailBody: `<h1>GEO Shopify – 15. nap</h1>
<h2>Variáns tisztaság: méret/szín keveredés nélkül</h2>
<p>Ma rögzíted, hogy a variánsadatok egyértelműek legyenek az AI számára.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`
};

async function updateLesson15() {
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

    const lessonId = `${COURSE_ID}_DAY_15`;
    const lesson = await Lesson.findOneAndUpdate(
      { lessonId },
      {
        $set: {
          lessonId, courseId: course._id, dayNumber: UPDATED_LESSON_15.day,
          language: 'hu', title: UPDATED_LESSON_15.title, content: UPDATED_LESSON_15.content,
          emailSubject: UPDATED_LESSON_15.emailSubject, emailBody: UPDATED_LESSON_15.emailBody, isActive: true,
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log(`✅ Lesson 15 updated successfully`);
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

updateLesson15();
