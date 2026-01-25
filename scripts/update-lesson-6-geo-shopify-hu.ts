/**
 * Update Lesson 6 for GEO_SHOPIFY_30 (Hungarian) - Quality Fix
 */

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { Brand, Course, Lesson } from '../app/lib/models';

const COURSE_ID = 'GEO_SHOPIFY_30';

const UPDATED_LESSON_6 = {
  day: 6,
  title: 'Sikerdefiníció: GEO prompt set + KPI-k',
  content: `<h1>Sikerdefiníció: GEO prompt set + KPI-k</h1>
<p><em>Ma összeállítod a 30–50 promptból álló GEO tesztkészletet és a KPI baseline-t.</em></p>
<hr />
<h2>Mit fogsz ma megtanulni?</h2>
<p>Ma ezt a két dolgot fogod elérni:</p>
<ul>
<li>Elkészíted a GEO prompt set-et (30–50 prompt), amit azonnal használhatsz.</li>
<li>Összeállítod a GEO/KPI baseline sheetet, amivel mérheted a haladást.</li>
</ul>
<hr />
<h2>Miért fontos ez neked?</h2>
<p>Mérés nélkül nincs fejlődés. A GEO méréshez inklúzió, idézés és konzisztencia adatok kellenek. A kereskedelmi hatás méréséhez pedig az AI referral forgalom, konverzió és visszaküldési arány adatok.</p>
<hr />
<h2>GEO prompt set: mi kell bele?</h2>
<h3>Prompt típusok</h3>
<p>A prompt set-ednek tartalmaznia kell:</p>
<ul>
<li><strong>Best kérdések</strong>: „Legjobb [termékkategória]"</li>
<li><strong>Vs kérdések</strong>: „[Termék A] vs [Termék B]"</li>
<li><strong>Alternatíva kérdések</strong>: „Alternatíva [termékhez]"</li>
<li><strong>Policy kérdések</strong>: „Van-e ingyenes visszaküldés?"</li>
<li><strong>Méret kérdések</strong>: „Melyik méretet válasszam?"</li>
<li><strong>Szállítás kérdések</strong>: „Mennyi a szállítási idő?"</li>
</ul>
<p>Összesen 30–50 kérdés, a boltod kategóriáira szabva.</p>
<h3>KPI-k: mit mérjünk?</h3>
<p><strong>GEO KPI-k (heti mérés):</strong></p>
<ul>
<li><strong>Inklúzió</strong>: Hányszor jelenik meg a boltod az AI válaszokban?</li>
<li><strong>Idézés</strong>: Hányszor hivatkozik az AI a domainre?</li>
<li><strong>Lefedettség</strong>: Hány promptból szerepelsz?</li>
<li><strong>Konzisztencia</strong>: Ugyanaz a válasz több futtatásban is?</li>
</ul>
<p><strong>Kereskedelmi KPI-k:</strong></p>
<ul>
<li><strong>AI referral forgalom</strong>: Mennyi látogató jön az AI válaszokból?</li>
<li><strong>Konverzió</strong>: Mennyi az AI referral forgalomból vásárol?</li>
<li><strong>Add-to-cart</strong>: Mennyi termék kerül a kosárba?</li>
<li><strong>Visszaküldési arány</strong>: Mennyi a visszaküldés az AI referral vásárlásokból?</li>
</ul>
<hr />
<h2>Példák: mi működik, mi nem?</h2>
<h3>✅ Jó prompt set és KPI sheet</h3>
<ul>
<li>40 kérdés, kategóriákra bontva (best/vs/policy)</li>
<li>Táblázatban mérő oszlopokkal</li>
<li>Heti mérési rutin</li>
</ul>
<h3>❌ Rossz prompt set és KPI sheet</h3>
<ul>
<li>5 általános kérdés</li>
<li>Nincs mérőpont</li>
<li>Nincs rendszeres mérés</li>
</ul>
<hr />
<h2>Gyakorlat: készítsd el a prompt set-edet (10-15 perc)</h2>
<p>Most készíts egy prompt set-et és KPI sheetet. Íme a lépések:</p>
<ol>
<li>Készíts egy táblázatot ezekkel az oszlopokkal: Prompt | Típus (best/vs/policy) | Várt inklúzió/idézés | Jegyzet.</li>
<li>Töltsd ki 20 kérdéssel (best, vs, policy vegyesen).</li>
<li>Készíts egy KPI sheetet két oszlopban:
   <ul>
   <li><strong>GEO KPI-k</strong>: inklúzió, idézés, konzisztencia</li>
   <li><strong>Kereskedelmi KPI-k</strong>: AI referral forgalom, konverzió, visszaküldés</li>
   </ul>
</li>
</ol>
<h2>Önálló gyakorlat: bővítsd a prompt set-et (5-10 perc)</h2>
<p>Most bővítsd a prompt set-et 30–50 kérdésre, és állíts be egy heti mérési rutint.</p>
<hr />
<h2>Önellenőrzés</h2>
<p>Mielőtt továbblépnél, ellenőrizd le:</p>
<ul>
<li>✅ Megvan a prompt set (30–50 kérdés)</li>
<li>✅ Készült a KPI baseline sheet</li>
<li>✅ Beállítottad a heti mérési rutint</li>
</ul>
<hr />
<h2>Ha mélyebbre szeretnél menni</h2>
<ul>
<li>OpenAI merchants: <a href="https://chatgpt.com/merchants" target="_blank" rel="noreferrer">https://chatgpt.com/merchants</a></li>
<li>Google Merchant Center specifikáció: <a href="https://support.google.com/merchants/answer/7052112" target="_blank" rel="noreferrer">https://support.google.com/merchants/answer/7052112</a></li>
</ul>`,
  emailSubject: 'GEO Shopify – 6. nap: Prompt set + KPI-k',
  emailBody: `<h1>GEO Shopify – 6. nap</h1>
<h2>Sikerdefiníció: GEO prompt set + KPI-k</h2>
<p>Ma elkészíted a GEO prompt set-edet és a KPI baseline sheetet.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`
};

async function updateLesson6() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI not set');
    }

    const { default: connectDB } = await import('../app/lib/mongodb');
    await connectDB();
    console.log('✅ Connected to MongoDB');

    let brand = await Brand.findOne({ slug: 'amanoba' });
    if (!brand) {
      brand = await Brand.create({
        name: 'Amanoba',
        slug: 'amanoba',
        displayName: 'Amanoba',
        description: 'Unified Learning Platform',
        logo: '/AMANOBA.png',
        themeColors: { primary: '#FAB908', secondary: '#2D2D2D', accent: '#FAB908' },
        allowedDomains: ['amanoba.com', 'www.amanoba.com', 'localhost'],
        supportedLanguages: ['hu', 'en'],
        defaultLanguage: 'hu',
        isActive: true
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
          language: 'hu',
          durationDays: 30,
          isActive: true,
          requiresPremium: false,
          brandId: brand._id,
          pointsConfig: {
            completionPoints: 1000,
            lessonPoints: 50,
            perfectCourseBonus: 500
          },
          xpConfig: {
            completionXP: 500,
            lessonXP: 25
          },
          metadata: {
            category: 'education',
            difficulty: 'intermediate',
            estimatedHours: 10,
            tags: ['geo', 'shopify', 'ecommerce'],
            instructor: 'Amanoba'
          }
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`✅ Course ${COURSE_ID} found/created: ${course.name}`);

    const lessonId = `${COURSE_ID}_DAY_06`;
    const lesson = await Lesson.findOneAndUpdate(
      { lessonId },
      {
        $set: {
          lessonId,
          courseId: course._id,
          dayNumber: UPDATED_LESSON_6.day,
          language: 'hu',
          title: UPDATED_LESSON_6.title,
          content: UPDATED_LESSON_6.content,
          emailSubject: UPDATED_LESSON_6.emailSubject,
          emailBody: UPDATED_LESSON_6.emailBody,
          isActive: true,
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log(`✅ Lesson 6 updated successfully`);
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

updateLesson6();
