/**
 * Update Lesson 16 for GEO_SHOPIFY_30 (Hungarian) - Quality Fix
 */

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { Brand, Course, Lesson } from '../app/lib/models';

const COURSE_ID = 'GEO_SHOPIFY_30';

const UPDATED_LESSON_16 = {
  day: 16,
  title: 'Kollekció-oldal mint guide, nem csak grid',
  content: `<h1>Kollekció-oldal mint guide, nem csak grid</h1>
<p><em>Ma úgy alakítod a kollekciót, hogy tanácsot adjon, ne csak listázzon.</em></p>
<hr />
<h2>Mit fogsz ma megtanulni?</h2>
<p>Ma ezt a két dolgot fogod elérni:</p>
<ul>
<li>Átstrukturálsz 1 kollekció-oldalt guide stílusra, amit azonnal használhatsz.</li>
<li>Hozzáadsz 3 blokkot: kinek való, hogyan válassz, top választások.</li>
</ul>
<hr />
<h2>Miért fontos ez neked?</h2>
<p>Az AI előszeretettel idéz jól tagolt, tanácsadó tartalmat. A vásárló gyorsabban dönt, kevesebb a visszaküldés, ha világos útmutatást kap.</p>
<hr />
<h2>Kollekció-oldal struktúra: mi kell bele?</h2>
<p>Egy jó guide-stílusú kollekció-oldal ezeket a blokkokat tartalmazza:</p>
<ol>
<li><strong>Hero blokk</strong>: kinek való, milyen helyzetre – rövid, egyértelmű bemutatás</li>
<li><strong>Választási szempontok</strong> (3-5 bullet) – mire figyelj a választásnál</li>
<li><strong>Top 3 ajánlás</strong> linkkel (PDP-re) – legjobb választások</li>
<li><strong>Policy röviden + link</strong> – szállítás, visszaküldés</li>
<li><strong>Termék grid</strong> – a termékek listája</li>
</ol>
<hr />
<h2>Példák: mi működik, mi nem?</h2>
<h3>✅ Jó guide-stílusú kollekció</h3>
<p>"Futócipő kollekció: kezdő/haladó útmutató, top 3 modell, méret tippek."</p>
<h3>❌ Rossz kollekció</h3>
<p>Csak termékgrid leírás nélkül, nincs útmutatás, nincs ajánlás.</p>
<hr />
<h2>Gyakorlat: átstrukturáld a kollekciót (10-15 perc)</h2>
<p>Most átstrukturálsz 1 kollekció-oldalt guide stílusra. Íme a lépések:</p>
<ol>
<li>Válassz ki 1 kollekció-oldalt a boltodban.</li>
<li>Hozzáadsz 3 blokkot:
   <ul>
   <li>Kinek való – célközönség és használati terület</li>
   <li>Hogyan válassz – választási szempontok</li>
   <li>Top választások – legjobb 3 termék ajánlása</li>
   </ul>
</li>
<li>Átstrukturálod az oldalt, hogy a guide tartalom legyen előre, a termék grid utána.</li>
</ol>
<h2>Önálló gyakorlat: alkalmazd más kollekciókra (5-10 perc)</h2>
<p>Most alkalmazd a guide struktúrát 2-3 további kollekció-oldalra is.</p>
<hr />
<h2>Önellenőrzés</h2>
<p>Mielőtt továbblépnél, ellenőrizd le:</p>
<ul>
<li>✅ 1 kollekció-oldal átstrukturálva guide stílusra</li>
<li>✅ 3 blokk hozzáadva (kinek való, hogyan válassz, top választások)</li>
<li>✅ Guide tartalom előre, termék grid utána</li>
</ul>
<hr />
<h2>Ha mélyebbre szeretnél menni</h2>
<ul>
<li>Shopify collection pages: <a href="https://help.shopify.com/en/manual/online-store/collections" target="_blank" rel="noreferrer">https://help.shopify.com/en/manual/online-store/collections</a></li>
<li>Content marketing best practices: <a href="https://www.shopify.com/blog/content-marketing" target="_blank" rel="noreferrer">https://www.shopify.com/blog/content-marketing</a></li>
</ul>`,
  emailSubject: 'GEO Shopify – 16. nap: Kollekció mint guide',
  emailBody: `<h1>GEO Shopify – 16. nap</h1>
<h2>Kollekció-oldal mint guide, nem csak grid</h2>
<p>Ma úgy alakítod a kollekciót, hogy tanácsot adjon, ne csak listázzon.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`
};

async function updateLesson16() {
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

    const lessonId = `${COURSE_ID}_DAY_16`;
    const lesson = await Lesson.findOneAndUpdate(
      { lessonId },
      {
        $set: {
          lessonId, courseId: course._id, dayNumber: UPDATED_LESSON_16.day,
          language: 'hu', title: UPDATED_LESSON_16.title, content: UPDATED_LESSON_16.content,
          emailSubject: UPDATED_LESSON_16.emailSubject, emailBody: UPDATED_LESSON_16.emailBody, isActive: true,
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log(`✅ Lesson 16 updated successfully`);
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

updateLesson16();
