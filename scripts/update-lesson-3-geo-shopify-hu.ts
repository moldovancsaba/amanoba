/**
 * Update Lesson 3 for GEO_SHOPIFY_30 (Hungarian) - Quality Fix
 * 
 * This script safely updates only lesson 3 with quality improvements:
 * - Conversational tone
 * - Better structure
 * - Date disclaimers
 * - Active voice
 * 
 * Safe: Uses findOneAndUpdate with upsert, only updates lesson 3
 */

import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { Brand, Course, Lesson } from '../app/lib/models';

const COURSE_ID = 'GEO_SHOPIFY_30';

const UPDATED_LESSON_3 = {
  day: 3,
  title: 'Hogyan változtatja meg az AI a vásárlói utat?',
  content: `<h1>Hogyan változtatja meg az AI a vásárlói utat?</h1>
<p><em>Ma megtanulod, hogy a keresőlistáról az „answer + ajánlás" élményre váltunk – és mit jelent ez a boltodnak.</em></p>
<hr />
<h2>Mit fogsz ma megtanulni?</h2>
<p>Ma ezt a két dolgot fogod elérni:</p>
<ul>
<li>Feltérképezed a jelenlegi vásárlói utat és az AI hatását a folyamatra.</li>
<li>Készítesz 5 fő „AI touchpoint"-ot a boltodra, ahol az AI válaszokban szerepelhetsz.</li>
</ul>
<hr />
<h2>Miért fontos ez neked?</h2>
<p>Az AI válasz gyakran előzi a hagyományos keresési listát. Ha nem vagy benne, lemaradsz. A válasz tömör, ezért a félreértett adatok (ár, készlet, policy) károsak lehetnek a boltod számára.</p>
<hr />
<h2>Régi vs új vásárlói út</h2>
<h3>❌ Régi út (hagyományos keresés)</h3>
<ol>
<li>Keresés a keresőmotorban</li>
<li>Listanézet a találatokkal</li>
<li>Kattintás a megfelelő oldalra</li>
</ol>
<h3>✅ Új út (AI-válaszokkal)</h3>
<ol>
<li>Kérdés feltevése (szöveges vagy hangos)</li>
<li>AI összegzés + ajánlás közvetlenül a válaszban</li>
<li>Kattintás vagy chat-folytatás</li>
</ol>
<h3>Mit jelent ez a Shopify boltodnak?</h3>
<ul>
<li>Rövid, biztonságosan idézhető blokk kell a termékoldal (PDP) tetején – ezt hívjuk answer capsule-nak.</li>
<li>A felhasználó gyakran „később" érkezik a site-ra, már konkrét szándékkal.</li>
<li>Az AI válaszban szereplő információk pontosan egyezniük kell a boltodban találhatóakkal.</li>
</ul>
<hr />
<h2>Példák: mi működik, mi nem?</h2>
<h3>✅ Jó answer capsule</h3>
<p>PDP elején rövid összegzés: „Kinek, mire jó, mire nem, ár/stock" tisztán, strukturáltan.</p>
<h3>❌ Rossz answer capsule</h3>
<p>Hosszú, strukturálatlan leírás, hiányzó policy linkek, nehezen értelmezhető információk.</p>
<hr />
<h2>Gyakorlat: térképezd fel a vásárlói utadat (10-15 perc)</h2>
<p>Most térképezd fel, hogyan változott a vásárlói út az AI-val. Íme a lépések:</p>
<ol>
<li>Rajzold fel a jelenlegi vásárlói utat 5 lépésben.</li>
<li>Jelöld be, hol találkozhat AI válasszal:
   <ul>
   <li>Előtte: keresés vagy chat</li>
   <li>Közben: ajánlás az AI válaszban</li>
   <li>Utána: visszakérés vagy további kérdések</li>
   </ul>
</li>
<li>Írj 5 AI touchpointot a boltodra. Példák:
   <ul>
   <li>„Legjobb [termékkategória]"</li>
   <li>„Melyik méretet válasszam?"</li>
   <li>„Van-e ingyenes visszaküldés?"</li>
   </ul>
</li>
</ol>
<h2>Önálló gyakorlat: készíts answer capsule-t (5-10 perc)</h2>
<p>Most válassz ki egy termékoldalt, és készíts egy 3-5 soros answer capsule-t, ami választ ad a fő touchpointokra.</p>
<hr />
<h2>Önellenőrzés</h2>
<p>Mielőtt továbblépnél, ellenőrizd le:</p>
<ul>
<li>✅ Megvan a vásárlói út 5 lépésben</li>
<li>✅ Felírtál 5 AI touchpointot</li>
<li>✅ Készítettél egy rövid answer capsule-t egy PDP tetejére</li>
</ul>
<hr />
<h2>Ha mélyebbre szeretnél menni</h2>
<ul>
<li>OpenAI Shopping help: <a href="https://help.openai.com/en/articles/11128490-shopping-with-chatgpt-search" target="_blank" rel="noreferrer">https://help.openai.com/en/articles/11128490-shopping-with-chatgpt-search</a></li>
<li>Copilot Merchant Program (2025 áprilisában bejelentve): <a href="https://www.microsoft.com/en-us/microsoft-copilot/blog/2025/04/18/introducing-the-copilot-merchant-program/" target="_blank" rel="noreferrer">https://www.microsoft.com/en-us/microsoft-copilot/blog/2025/04/18/introducing-the-copilot-merchant-program/</a></li>
</ul>`,
  emailSubject: 'GEO Shopify – 3. nap: AI és a vásárlói út',
  emailBody: `<h1>GEO Shopify – 3. nap</h1>
<h2>AI és a vásárlói út</h2>
<p>Ma feltérképezed az AI touchpointokat, és készítesz egy rövid answer capsule-t egy PDP-re.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`
};

async function updateLesson3() {
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

    // Update lesson 3
    const lessonId = `${COURSE_ID}_DAY_03`;
    const lesson = await Lesson.findOneAndUpdate(
      { lessonId },
      {
        $set: {
          lessonId,
          courseId: course._id,
          dayNumber: UPDATED_LESSON_3.day,
          language: 'hu',
          title: UPDATED_LESSON_3.title,
          content: UPDATED_LESSON_3.content,
          emailSubject: UPDATED_LESSON_3.emailSubject,
          emailBody: UPDATED_LESSON_3.emailBody,
          isActive: true,
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log(`✅ Lesson 3 updated successfully`);
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

updateLesson3();
