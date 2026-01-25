/**
 * Update Lesson 18 for GEO_SHOPIFY_30 (Hungarian) - Quality Fix
 */

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { Brand, Course, Lesson } from '../app/lib/models';

const COURSE_ID = 'GEO_SHOPIFY_30';

const UPDATED_LESSON_18 = {
  day: 18,
  title: 'Árak, ajánlatok, review-k biztonságosan',
  content: `<h1>Árak, ajánlatok, review-k biztonságosan</h1>
<p><em>Ma áttekinted, mikor és hogyan mutass árakat, kedvezményt, review-t anélkül, hogy félrevezetnél.</em></p>
<hr />
<h2>Mit fogsz ma megtanulni?</h2>
<p>Ma ezt a két dolgot fogod elérni:</p>
<ul>
<li>Egységesíted az ár/akció megjelenítését, hogy mindenhol ugyanaz legyen.</li>
<li>Átnézed a review blokkot és eltávolítod a gyenge vagy hamis elemeket.</li>
</ul>
<hr />
<h2>Miért fontos ez neked?</h2>
<p>Az AI érzékeny a hamis vagy elavult árra. Félrevezető review komoly kockázat, ami kizáráshoz vezethet. Fontos, hogy minden ár, akció és review pontos és valós legyen.</p>
<hr />
<h2>Ár és akció megjelenítés: mi kell bele?</h2>
<h3>Ár megjelenítés</h3>
<p>Használj compare-at-price mezőt, ne kézi szöveget:</p>
<ul>
<li>Rendszeres ár – compare-at-price mezőben</li>
<li>Akciós ár – price mezőben</li>
<li>Kedvezmény százalék – automatikusan számolva</li>
</ul>
<h3>Akció információk</h3>
<p>Ha van akció, mutasd:</p>
<ul>
<li>Kedvezmény okát (pl. "Nyitó akció", "Black Friday")</li>
<li>Időtartamát (pl. "2026. január 31-ig")</li>
<li>Érvényességét (dátum disclaimerek)</li>
</ul>
<h3>Review-k</h3>
<p>Review blokk átnézése:</p>
<ul>
<li>Valós review-k – nem kamuk</li>
<li>Ellenőrizhető források</li>
<li>Gyenge vagy hamis elemek eltávolítása</li>
</ul>
<hr />
<h2>Példák: mi működik, mi nem?</h2>
<h3>✅ Jó ár/akció/review megjelenítés</h3>
<p>Compare-at-price mező használata, akció ok és időtartam feltüntetve, valós review-k ellenőrizhető forrásokkal.</p>
<h3>❌ Rossz ár/akció/review megjelenítés</h3>
<p>Kézi szöveg az áraknál, nincs akció információ, hamis review-k, ellenőrizhetetlen források.</p>
<hr />
<h2>Gyakorlat: egységesítsd az árakat és review-kat (10-15 perc)</h2>
<p>Most egységesíted az ár/akció megjelenítést és átnézed a review blokkot. Íme a lépések:</p>
<ol>
<li>Válassz ki 5 termékoldalt a boltodban.</li>
<li>Ellenőrizd minden oldalon:
   <ul>
   <li>Ár megjelenítés (compare-at-price mező használata)</li>
   <li>Akció információk (ok, időtartam)</li>
   <li>Review-k (valós, ellenőrizhető)</li>
   </ul>
</li>
<li>Egységesítsd az ár/akció megjelenítést.</li>
<li>Eltávolítod a gyenge vagy hamis review elemeket.</li>
</ol>
<h2>Önálló gyakorlat: bővítsd további termékekre (5-10 perc)</h2>
<p>Most bővítsd az egységes ár/akció megjelenítést további 5-10 termékre is.</p>
<hr />
<h2>Önellenőrzés</h2>
<p>Mielőtt továbblépnél, ellenőrizd le:</p>
<ul>
<li>✅ Ár/akció megjelenítés egységes</li>
<li>✅ Compare-at-price mező használata</li>
<li>✅ Akció ok és időtartam feltüntetve</li>
<li>✅ Review blokk átnézve</li>
<li>✅ Gyenge vagy hamis elemek eltávolítva</li>
</ul>
<hr />
<h2>Ha mélyebbre szeretnél menni</h2>
<ul>
<li>Shopify pricing: <a href="https://help.shopify.com/en/manual/products/pricing" target="_blank" rel="noreferrer">https://help.shopify.com/en/manual/products/pricing</a></li>
<li>Google review guidelines: <a href="https://developers.google.com/search/docs/appearance/structured-data/review-snippet" target="_blank" rel="noreferrer">https://developers.google.com/search/docs/appearance/structured-data/review-snippet</a></li>
</ul>`,
  emailSubject: 'GEO Shopify – 18. nap: Árak és review-k',
  emailBody: `<h1>GEO Shopify – 18. nap</h1>
<h2>Árak, ajánlatok, review-k biztonságosan</h2>
<p>Ma áttekinted, mikor és hogyan mutass árakat, kedvezményt, review-t anélkül, hogy félrevezetnél.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`
};

async function updateLesson18() {
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

    const lessonId = `${COURSE_ID}_DAY_18`;
    const lesson = await Lesson.findOneAndUpdate(
      { lessonId },
      {
        $set: {
          lessonId, courseId: course._id, dayNumber: UPDATED_LESSON_18.day,
          language: 'hu', title: UPDATED_LESSON_18.title, content: UPDATED_LESSON_18.content,
          emailSubject: UPDATED_LESSON_18.emailSubject, emailBody: UPDATED_LESSON_18.emailBody, isActive: true,
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log(`✅ Lesson 18 updated successfully`);
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

updateLesson18();
