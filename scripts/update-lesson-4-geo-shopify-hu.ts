/**
 * Update Lesson 4 for GEO_SHOPIFY_30 (Hungarian) - Quality Fix
 * 
 * This script safely updates only lesson 4 with quality improvements:
 * - Conversational tone
 * - Better structure
 * - Date disclaimers
 * - Active voice
 * 
 * Safe: Uses findOneAndUpdate with upsert, only updates lesson 4
 */

import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { Brand, Course, Lesson } from '../app/lib/models';

const COURSE_ID = 'GEO_SHOPIFY_30';

const UPDATED_LESSON_4 = {
  day: 4,
  title: '„Sell in chat": befolyás vs tranzakció',
  content: `<h1>„Sell in chat": befolyás vs tranzakció</h1>
<p><em>Ma megtanulod, hogy a GEO-val elsősorban befolyásolsz, nem közvetlenül kasszázol – és mi a különbség.</em></p>
<hr />
<h2>Mit fogsz ma megtanulni?</h2>
<p>Ma ezt a három dolgot fogod elérni:</p>
<ul>
<li>Világosan látod, mi az AI-ban a befolyás és mi a tényleges checkout közötti különbség.</li>
<li>Összeírsz 5 olyan állítást vagy policy-t, amit az AI-nak biztonságosan idéznie kell.</li>
<li>Készítesz egy rövid „sell in chat" üzenetmintát, amit azonnal használhatsz.</li>
</ul>
<hr />
<h2>Miért fontos ez neked?</h2>
<p>A ChatGPT és Copilot válaszai befolyásolják a választást, de a tényleges tranzakció a boltodban történik. Ha az AI pontatlan információt ad (ár, készlet, szállítás), ez visszaüt a konverziódon és növeli a support terhelését.</p>
<hr />
<h2>Befolyás vs tranzakció: mi a különbség?</h2>
<h3>Befolyás (influence) – az AI felületén</h3>
<p>Az AI válaszokban ez történik:</p>
<ul>
<li>Ajánlás a termékedre</li>
<li>Rövid összegzés a főbb jellemzőkről</li>
<li>Összevetés más termékekkel</li>
</ul>
<p>Fontos, hogy az AI válaszban legyen:</p>
<ul>
<li>Világos értékajánlat</li>
<li>Kinek való és kinek nem</li>
<li>Bizonyíték vagy review információk</li>
</ul>
<h3>Tranzakció – a boltodban</h3>
<p>A tényleges vásárlás a webáruházadban zajlik. Itt kell:</p>
<ul>
<li>Pontos ár</li>
<li>Friss készlet információ</li>
<li>Részletes policy információk</li>
</ul>
<p>Megjegyzés: A merchant programok (ahol közvetlenül a chat-ben lehet vásárolni) régió és eligibility függők, és az AI felülettől függnek.</p>
<hr />
<h2>Példák: mi működik, mi nem?</h2>
<h3>✅ Jó „sell in chat" blokk</h3>
<p>Rövid ajánló: „[Termék] ideális [kinek], nem ajánlott [kinek nem]; ár [x], készlet: elérhető; szállítás: 3-5 nap, ingyenes visszaküldés 30 napig."</p>
<h3>❌ Rossz „sell in chat" blokk</h3>
<p>„Legjobb termék!" ár vagy készlet információ nélkül, homályos ígéretekkel.</p>
<hr />
<h2>Gyakorlat: készítsd el a kritikus állításaidat (10-15 perc)</h2>
<p>Most készíts 5 állítást vagy policy-t, amit az AI-nak tudnia kell. Íme a lépések:</p>
<ol>
<li>Írj 5 állítást/policy-t ezekkel a témákkal: ár, készlet, szállítás, visszaküldés, garancia.</li>
<li>Készíts egy 3-4 soros „sell in chat" blokkot egy termékedre. Tartalmazzon:
   <ul>
   <li>Kinek való</li>
   <li>Mire jó és mire nem</li>
   <li>Ár és készlet</li>
   <li>Policy információk</li>
   </ul>
</li>
</ol>
<h2>Önálló gyakorlat: helyezd el a blokkot (5-10 perc)</h2>
<p>Tedd be ezt a blokkot a PDP answer capsule-jébe, vagy készíts külön snippetet a chat használathoz.</p>
<hr />
<h2>Önellenőrzés</h2>
<p>Mielőtt továbblépnél, ellenőrizd le:</p>
<ul>
<li>✅ Megvan 5 kritikus állítás vagy policy</li>
<li>✅ Írtál 3-4 soros chat-blokkot egy termékre</li>
<li>✅ Elhelyezted vagy jegyzetelted, hova kerül a PDP-n</li>
</ul>
<hr />
<h2>Ha mélyebbre szeretnél menni</h2>
<ul>
<li>OpenAI merchants: <a href="https://chatgpt.com/merchants" target="_blank" rel="noreferrer">https://chatgpt.com/merchants</a></li>
<li>Copilot Merchant Program (2025 áprilisában bejelentve): <a href="https://www.microsoft.com/en-us/microsoft-copilot/blog/2025/04/18/introducing-the-copilot-merchant-program/" target="_blank" rel="noreferrer">https://www.microsoft.com/en-us/microsoft-copilot/blog/2025/04/18/introducing-the-copilot-merchant-program/</a></li>
</ul>`,
  emailSubject: 'GEO Shopify – 4. nap: Sell in chat',
  emailBody: `<h1>GEO Shopify – 4. nap</h1>
<h2>Sell in chat: befolyás vs tranzakció</h2>
<p>Ma megírod a chat-ajánlás blokkodat, és rögzíted a kritikus policy állításokat.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`
};

async function updateLesson4() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI not set');
    }

    const { default: connectDB } = await import('../app/lib/mongodb');
    await connectDB();
    console.log('✅ Connected to MongoDB');

    // Find or create course
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

    // Update lesson 4
    const lessonId = `${COURSE_ID}_DAY_04`;
    const lesson = await Lesson.findOneAndUpdate(
      { lessonId },
      {
        $set: {
          lessonId,
          courseId: course._id,
          dayNumber: UPDATED_LESSON_4.day,
          language: 'hu',
          title: UPDATED_LESSON_4.title,
          content: UPDATED_LESSON_4.content,
          emailSubject: UPDATED_LESSON_4.emailSubject,
          emailBody: UPDATED_LESSON_4.emailBody,
          isActive: true,
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log(`✅ Lesson 4 updated successfully`);
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

updateLesson4();
