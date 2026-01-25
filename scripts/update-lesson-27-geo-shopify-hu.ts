/**
 * Update Lesson 27 for GEO_SHOPIFY_30 (Hungarian) - Quality Fix
 */

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { Brand, Course, Lesson } from '../app/lib/models';

const COURSE_ID = 'GEO_SHOPIFY_30';

const UPDATED_LESSON_27 = {
  day: 27,
  title: 'Feed műveletek: frissítés, monitor, hibakezelés',
  content: `<h1>Feed műveletek: frissítés, monitor, hibakezelés</h1>
<p><em>Ma felépíted a feed ütemezést és a hibakezelési rutint.</em></p>
<hr />
<h2>Mit fogsz ma megtanulni?</h2>
<p>Ma ezt a két dolgot fogod elérni:</p>
<ul>
<li>Ütemezed a feed frissítést, hogy mindig naprakész legyen.</li>
<li>Hibalistát és logolást állítasz be, hogy követni tudd a hibákat.</li>
</ul>
<hr />
<h2>Miért fontos ez neked?</h2>
<p>Elavult feed → téves ajánlás. Hibák figyelmen kívül hagyása kizáráshoz vezethet. Fontos, hogy a feed mindig naprakész legyen és a hibákat rendszeresen kezeld.</p>
<hr />
<h2>Feed műveletek: mi kell bele?</h2>
<h3>Frissítés</h3>
<p>Feed frissítési ütemezés:</p>
<ul>
<li>Napi/órás frissítés a készlet és ár alapján</li>
<li>Automatizált frissítés, ahol lehetséges</li>
<li>Manuális ellenőrzés rendszeresen</li>
</ul>
<h3>Monitor</h3>
<p>Feed monitorozás:</p>
<ul>
<li>Hibakódok követése</li>
<li>Missing field (hiányzó mezők) ellenőrzése</li>
<li>Disapproval (elutasítás) követése</li>
</ul>
<h3>Log</h3>
<p>Hibalog tartalma:</p>
<ul>
<li>Dátum – mikor történt a hiba</li>
<li>Hiba típusa – milyen hiba</li>
<li>Termék – melyik terméknél</li>
<li>Megoldás – hogyan javítottad</li>
<li>SLA – mennyi idő alatt javítottad</li>
</ul>
<hr />
<h2>Példák: mi működik, mi nem?</h2>
<h3>✅ Jó feed műveletek</h3>
<p>Heti riport hibákról, SLA a javításra, automatizált frissítés, rendszeres monitorozás.</p>
<h3>❌ Rossz feed műveletek</h3>
<p>"Majd ránézünk" hozzáállás, nincs log, nincs monitorozás, elavult feed.</p>
<hr />
<h2>Gyakorlat: állítsd be a feed műveleteket (10-15 perc)</h2>
<p>Most ütemezed a feed frissítést és készítesz egy hibalog sablont. Íme a lépések:</p>
<ol>
<li>Állíts be frissítési gyakoriságot (pl. napi), és jegyezd fel.</li>
<li>Készíts hibalog sablont ezekkel az oszlopokkal:
   <ul>
   <li>Dátum</li>
   <li>Hiba</li>
   <li>Termék</li>
   <li>Megoldás</li>
   <li>SLA</li>
   </ul>
</li>
</ol>
<h2>Önálló gyakorlat: töltsd fel a hibalogot (5-10 perc)</h2>
<p>Most tölts fel 3 hiba példát a sablonba.</p>
<hr />
<h2>Önellenőrzés</h2>
<p>Mielőtt továbblépnél, ellenőrizd le:</p>
<ul>
<li>✅ Feed frissítési ütemezés beállítva</li>
<li>✅ Hibalog sablon kész</li>
<li>✅ 3 hiba példa feltöltve</li>
</ul>
<hr />
<h2>Ha mélyebbre szeretnél menni</h2>
<ul>
<li>Google Merchant Center feed management: <a href="https://support.google.com/merchants/answer/188494" target="_blank" rel="noreferrer">https://support.google.com/merchants/answer/188494</a></li>
<li>Shopify feed optimization: <a href="https://help.shopify.com/en/manual/products/import-export" target="_blank" rel="noreferrer">https://help.shopify.com/en/manual/products/import-export</a></li>
</ul>`,
  emailSubject: 'GEO Shopify – 27. nap: Feed műveletek',
  emailBody: `<h1>GEO Shopify – 27. nap</h1>
<h2>Feed műveletek: frissítés, monitor, hibakezelés</h2>
<p>Ma felépíted a feed ütemezést és a hibakezelési rutint.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`
};

async function updateLesson27() {
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
          xpConfig: { completionXP: 500, lessonXP: 27 },
          metadata: { category: 'education', difficulty: 'intermediate', estimatedHours: 10, tags: ['geo', 'shopify', 'ecommerce'], instructor: 'Amanoba' }
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`✅ Course ${COURSE_ID} found/created: ${course.name}`);

    const lessonId = `${COURSE_ID}_DAY_27`;
    const lesson = await Lesson.findOneAndUpdate(
      { lessonId },
      {
        $set: {
          lessonId, courseId: course._id, dayNumber: UPDATED_LESSON_27.day,
          language: 'hu', title: UPDATED_LESSON_27.title, content: UPDATED_LESSON_27.content,
          emailSubject: UPDATED_LESSON_27.emailSubject, emailBody: UPDATED_LESSON_27.emailBody, isActive: true,
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log(`✅ Lesson 27 updated successfully`);
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

updateLesson27();
