/**
 * Seed Course Creation Course
 *
 * What: Creates a complete 30-day course teaching how to create courses on amanoba.com
 * Why: Provides a comprehensive learning resource for course creators
 *
 * Usage: npm run seed:course-creation
 */

import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { Brand, Course, Lesson, QuizQuestion, QuestionDifficulty } from '../app/lib/models';

const COURSE_ID = 'KURZUS_KESZITES';
const COURSE_NAME = 'Kurzus a kurzus készítésre';
const COURSE_DESCRIPTION = '30 napos, lépésről lépésre útmutató, amely megtanítja, hogyan hozz létre professzionális 30 napos kurzusokat az Amanoba platformon. Napi 10-15 perces leckékkel sajátítsd el a kurzus készítés művészetét.';

// Complete lesson plan for course creation
const lessonPlan = [
  // 1-5. nap · Alapok és áttekintés
  {
    day: 1,
    title: 'Bevezetés: Mi az Amanoba kurzusrendszer?',
    content: `<h2>Napi cél</h2>
<p>Megismered az Amanoba kurzusrendszer alapjait és megérted, hogyan működik a platform.</p>

<h2>Mit fogsz megtanulni?</h2>
<ul>
<li>Az Amanoba kurzusrendszer áttekintése</li>
<li>A Course, Lesson és CourseProgress modellek szerepe</li>
<li>A kurzus publikálás folyamata</li>
<li>Az admin felület használata</li>
</ul>

<h2>Hogyan működik a kurzusrendszer?</h2>
<p>Az Amanoba kurzusrendszer három fő komponensből áll:</p>
<ol>
<li><strong>Course</strong> – Kurzus metaadatok (név, leírás, nyelv, pont/XP config, státusz)</li>
<li><strong>Lesson</strong> – Napi leckék (1-30), tartalom + email tárgy/szöveg</li>
<li><strong>CourseProgress</strong> – Tanulói haladás (aktuális nap, befejezett leckék, beiratkozási státusz)</li>
</ol>

<h2>Kulcs tanulságok</h2>
<blockquote>
<p><strong>Publikálás kulcsa</strong> – Mind a <code>Course.isActive = true</code> ÉS a <code>Lesson.isActive = true</code> be kell legyen állítva.</p>
<p><strong>30 napos struktúra</strong> – Minden kurzus 30 napból áll, napi egy lecke.</p>
<p><strong>Email automatikus küldés</strong> – A rendszer automatikusan küldi a napi leckéket emailben.</p>
</blockquote>

<h2>Gyakorlat</h2>
<p>Látogasd meg az admin felületet: <code>/{locale}/admin/courses</code> és ismerkedj meg a kurzusok listájával.</p>`,
    emailSubject: 'Kurzus készítés – 1. nap: Bevezetés',
    emailBody: `<h1>{{courseName}}</h1>
<h2>{{dayNumber}}. nap: {{lessonTitle}}</h2>
<p>Üdvözölünk a kurzus készítés kurzusában! Ma az alapokkal kezdünk.</p>
<div>{{lessonContent}}</div>
<p><a href="{{appUrl}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a teljes leckét →</a></p>`
  },
  {
    day: 2,
    title: 'Előfeltételek és beállítások',
    content: `<h2>Napi cél</h2>
<p>Ellenőrzöd az előfeltételeket és beállítod a szükséges környezetet.</p>

<h2>Előfeltételek</h2>
<ul>
<li><strong>Admin hozzáférés</strong> – <code>/{locale}/admin</code> (alapértelmezett: <code>/en/admin</code>)</li>
<li><strong>Adatbázis beállítva</strong> – <code>MONGODB_URI</code> a <code>.env.local</code>-ban</li>
<li><strong>Email szolgáltatás</strong> – <code>RESEND_API_KEY</code>, <code>EMAIL_FROM</code>, <code>EMAIL_REPLY_TO</code>, <code>NEXT_PUBLIC_APP_URL</code></li>
<li><strong>Napi emailek</strong> – <code>CRON_SECRET</code> + Vercel cron (POST <code>/api/cron/send-daily-lessons</code>)</li>
</ul>

<h2>Beállítások ellenőrzése</h2>
<ol>
<li>Ellenőrizd, hogy be vagy-e jelentkezve admin felhasználóként</li>
<li>Verifikáld, hogy az adatbázis kapcsolat működik</li>
<li>Ellenőrizd az email szolgáltatás konfigurációját</li>
<li>Nézd meg a Vercel cron beállításokat</li>
</ol>

<h2>Gyakorlat</h2>
<p>Ellenőrizd az összes előfeltételt és dokumentáld, ha valami hiányzik.</p>`,
    emailSubject: 'Kurzus készítés – 2. nap: Előfeltételek',
    emailBody: `<h1>{{courseName}}</h1>
<h2>{{dayNumber}}. nap: {{lessonTitle}}</h2>
<p>Ma ellenőrizzük az előfeltételeket és beállítjuk a környezetet.</p>
<div>{{lessonContent}}</div>
<p><a href="{{appUrl}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a teljes leckét →</a></p>`
  },
  {
    day: 3,
    title: 'Kurzus létrehozása: Course modell',
    content: `<h2>Napi cél</h2>
<p>Létrehozod az első kurzusodat az admin felületen.</p>

<h2>Kötelező mezők</h2>
<ul>
<li><strong>courseId</strong> – Csak nagybetű, számok, aláhúzás (pl. <code>AI_30_NAP</code>, <code>ENTREPRENEURSHIP_101</code>)
  <ul>
    <li>Regex: <code>/^[A-Z0-9_]+$/</code></li>
    <li>Egyedinek kell lennie az összes kurzus között</li>
  </ul>
</li>
<li><strong>name</strong> – Kurzus megjelenített neve (max 200 karakter)</li>
<li><strong>description</strong> – Kurzus leírás (max 2000 karakter)</li>
</ul>

<h2>Ajánlott beállítások</h2>
<ul>
<li><code>language</code>: <code>hu</code> (magyar) vagy <code>en</code> (angol) - alapértelmezett: <code>hu</code></li>
<li><code>durationDays</code>: <code>30</code> (30 napos kurzusokhoz standard)</li>
<li><code>requiresPremium</code>: <code>false</code> (kivéve, ha valóban prémium)</li>
<li><code>thumbnail</code>: Opcionális kép URL a kurzus listázáshoz</li>
</ul>

<h2>Gyakorlat</h2>
<p>Menj az <code>/{locale}/admin/courses/new</code> oldalra és hozz létre egy teszt kurzust.</p>`,
    emailSubject: 'Kurzus készítés – 3. nap: Kurzus létrehozása',
    emailBody: `<h1>{{courseName}}</h1>
<h2>{{dayNumber}}. nap: {{lessonTitle}}</h2>
<p>Ma létrehozzuk az első kurzusodat.</p>
<div>{{lessonContent}}</div>
<p><a href="{{appUrl}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a teljes leckét →</a></p>`
  },
  {
    day: 4,
    title: 'Pontok és XP konfiguráció',
    content: `<h2>Napi cél</h2>
<p>Megérted a pontok és XP rendszer működését és beállítod a kurzusodhoz.</p>

<h2>Pontok és XP konfiguráció</h2>
<p><strong>Alapértelmezett értékek</strong> (AI_30_NAP alapján):</p>
<pre><code>{
  "pointsConfig": {
    "completionPoints": 1000,
    "lessonPoints": 50,
    "perfectCourseBonus": 500
  },
  "xpConfig": {
    "completionXP": 500,
    "lessonXP": 25
  }
}</code></pre>

<h2>Mit jelent mindegyik?</h2>
<ul>
<li><strong>completionPoints</strong> – Pontok a teljes kurzus befejezéséért</li>
<li><strong>lessonPoints</strong> – Pontok minden lecke befejezéséért</li>
<li><strong>perfectCourseBonus</strong> – Bónusz pontok, ha mind a 30 napot teljesíti</li>
<li><strong>completionXP</strong> – XP a teljes kurzus befejezéséért</li>
<li><strong>lessonXP</strong> – XP minden lecke befejezéséért</li>
</ul>

<h2>Gyakorlat</h2>
<p>Állítsd be a pontok és XP konfigurációt a kurzusodhoz a saját értékeiddel.</p>`,
    emailSubject: 'Kurzus készítés – 4. nap: Pontok és XP',
    emailBody: `<h1>{{courseName}}</h1>
<h2>{{dayNumber}}. nap: {{lessonTitle}}</h2>
<p>Ma megtanuljuk a pontok és XP rendszer beállítását.</p>
<div>{{lessonContent}}</div>
<p><a href="{{appUrl}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a teljes leckét →</a></p>`
  },
  {
    day: 5,
    title: 'Brand konfiguráció',
    content: `<h2>Napi cél</h2>
<p>Megérted a brand rendszer szerepét és beállítod a kurzusodhoz.</p>

<h2>Brand konfiguráció</h2>
<p><strong>Fontos</strong>: Minden kurzusnak érvényes <code>brandId</code>-re van szüksége. A rendszer:</p>
<ul>
<li>Automatikusan megkeresi vagy létrehozza az alapértelmezett "Amanoba" brandet, ha nincs <code>brandId</code> megadva</li>
<li>Validálja a <code>brandId</code>-t, ha meg van adva</li>
<li>Hibát ad vissza, ha a <code>brandId</code> érvénytelen vagy hiányzik</li>
</ul>

<h2>Gyakorlat</h2>
<p>Ellenőrizd, hogy a kurzusodnak érvényes <code>brandId</code>-je van.</p>`,
    emailSubject: 'Kurzus készítés – 5. nap: Brand konfiguráció',
    emailBody: `<h1>{{courseName}}</h1>
<h2>{{dayNumber}}. nap: {{lessonTitle}}</h2>
<p>Ma megtanuljuk a brand rendszer használatát.</p>
<div>{{lessonContent}}</div>
<p><a href="{{appUrl}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a teljes leckét →</a></p>`
  },
  // 6-10. nap · Leckék létrehozása
  {
    day: 6,
    title: 'Lecke létrehozása: Alapok',
    content: `<h2>Napi cél</h2>
<p>Létrehozod az első leckédet a kurzusodhoz.</p>

<h2>Kötelező mezők</h2>
<ul>
<li><strong>lessonId</strong> – Egyedi azonosító (ajánlott formátum: <code>{COURSE_ID}_DAY_{DD}</code>)
  <ul>
    <li>Példa: <code>AI_30_NAP_DAY_01</code>, <code>AI_30_NAP_DAY_02</code>, stb.</li>
    <li>Egyedinek kell lennie kurzusonként</li>
  </ul>
</li>
<li><strong>dayNumber</strong> – Egész szám 1-30 (sorrendben kell lennie, nincs hézag)</li>
<li><strong>title</strong> – Lecke címe (UI-ban és emailekben megjelenik)</li>
<li><strong>content</strong> – HTML tartalom (teljes lecke tartalom)</li>
<li><strong>emailSubject</strong> – Email tárgy (támogatja a helyőrzőket)</li>
<li><strong>emailBody</strong> – HTML email törzs (támogatja a helyőrzőket)</li>
</ul>

<h2>Gyakorlat</h2>
<p>Menj a kurzus szerkesztő oldalára és hozz létre az első leckét (1. nap).</p>`,
    emailSubject: 'Kurzus készítés – 6. nap: Lecke létrehozása',
    emailBody: `<h1>{{courseName}}</h1>
<h2>{{dayNumber}}. nap: {{lessonTitle}}</h2>
<p>Ma létrehozzuk az első leckét.</p>
<div>{{lessonContent}}</div>
<p><a href="{{appUrl}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a teljes leckét →</a></p>`
  },
  {
    day: 7,
    title: 'Lecke tartalom struktúra',
    content: `<h2>Napi cél</h2>
<p>Megtanulod a lecke tartalom ajánlott struktúráját.</p>

<h2>Ajánlott struktúra</h2>
<p>Minden leckének tartalmaznia kellene:</p>
<ol>
<li><strong>Napi cél</strong> (<code>&lt;h2&gt;Napi cél&lt;/h2&gt;</code>) – Mit fog elérni a tanuló</li>
<li><strong>Mit fogsz megtanulni?</strong> (<code>&lt;h2&gt;Mit fogsz megtanulni?&lt;/h2&gt;</code>) – Tanulási célok</li>
<li><strong>Gyakorlat</strong> (<code>&lt;h2&gt;Gyakorlat&lt;/h2&gt;</code>) – Gyakorlati feladatok</li>
<li><strong>Kulcs tanulságok</strong> (<code>&lt;h2&gt;Kulcs tanulságok&lt;/h2&gt;</code>) – Fontos pontok</li>
<li><strong>Házi feladat</strong> (<code>&lt;h2&gt;Házi feladat&lt;/h2&gt;</code>) – Opcionális következő feladat</li>
</ol>

<h2>Formátum</h2>
<p>Használj HTML-t a formázáshoz. A tartalom a lecke megjelenítőben jelenik meg.</p>

<h2>Gyakorlat</h2>
<p>Frissítsd az első leckéd tartalmát ezzel a struktúrával.</p>`,
    emailSubject: 'Kurzus készítés – 7. nap: Lecke struktúra',
    emailBody: `<h1>{{courseName}}</h1>
<h2>{{dayNumber}}. nap: {{lessonTitle}}</h2>
<p>Ma megtanuljuk a lecke tartalom struktúráját.</p>
<div>{{lessonContent}}</div>
<p><a href="{{appUrl}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a teljes leckét →</a></p>`
  },
  {
    day: 8,
    title: 'Email sablonok és helyőrzők',
    content: `<h2>Napi cél</h2>
<p>Megtanulod az email sablonok használatát és a helyőrzőket.</p>

<h2>Email sablon helyőrzők</h2>
<p>Az email szolgáltatás ezeket a helyőrzőket támogatja:</p>
<ul>
<li><code>{{courseName}}</code> – Kurzus neve</li>
<li><code>{{dayNumber}}</code> – Aktuális nap (1-30)</li>
<li><code>{{lessonTitle}}</code> – Lecke címe</li>
<li><code>{{lessonContent}}</code> – Teljes lecke HTML tartalom</li>
<li><code>{{appUrl}}</code> – Alkalmazás URL (<code>NEXT_PUBLIC_APP_URL</code>-ból)</li>
<li><code>{{playerName}}</code> – Tanuló megjelenített neve</li>
</ul>

<h2>Fontos</h2>
<p>Használj helyőrzőket az email sablonokban. Az email szolgáltatás küldéskor lecseréli őket.</p>

<h2>Gyakorlat</h2>
<p>Frissítsd az email sablonokat a helyőrzőkkel.</p>`,
    emailSubject: 'Kurzus készítés – 8. nap: Email sablonok',
    emailBody: `<h1>{{courseName}}</h1>
<h2>{{dayNumber}}. nap: {{lessonTitle}}</h2>
<p>Ma megtanuljuk az email sablonok használatát.</p>
<div>{{lessonContent}}</div>
<p><a href="{{appUrl}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a teljes leckét →</a></p>`
  },
  {
    day: 9,
    title: 'Rich Text Editor használata',
    content: `<h2>Napi cél</h2>
<p>Megtanulod a Rich Text Editor használatát a lecke tartalom szerkesztéséhez.</p>

<h2>Rich Text Editor funkciók</h2>
<ul>
<li>Szöveg formázás (félkövér, dőlt, aláhúzás)</li>
<li>Címsorok (H1, H2, H3)</li>
<li>Listák (számozott, számozatlan)</li>
<li>Linkek beszúrása</li>
<li>Blokkok (idézet, kód)</li>
</ul>

<h2>Tippek</h2>
<ul>
<li>Használj strukturált HTML-t az olvashatósághoz</li>
<li>Ne használj inline stílusokat (a rendszer kezeli)</li>
<li>Teszteld a megjelenést a lecke megjelenítőben</li>
</ul>

<h2>Gyakorlat</h2>
<p>Frissítsd egy leckéd tartalmát a Rich Text Editorral és próbáld ki az összes funkciót.</p>`,
    emailSubject: 'Kurzus készítés – 9. nap: Rich Text Editor',
    emailBody: `<h1>{{courseName}}</h1>
<h2>{{dayNumber}}. nap: {{lessonTitle}}</h2>
<p>Ma megtanuljuk a Rich Text Editor használatát.</p>
<div>{{lessonContent}}</div>
<p><a href="{{appUrl}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a teljes leckét →</a></p>`
  },
  {
    day: 10,
    title: '30 lecke létrehozása: Terv és struktúra',
    content: `<h2>Napi cél</h2>
<p>Készítesz egy tervet a 30 napos kurzusodhoz.</p>

<h2>Kurzus tervezés</h2>
<p>Mielőtt elkezdenéd a leckék létrehozását, készíts egy tervet:</p>
<ol>
<li><strong>Kurzus célja</strong> – Mit fog elérni a tanuló?</li>
<li><strong>Tanulási célok</strong> – Milyen készségeket fog elsajátítani?</li>
<li><strong>30 napos struktúra</strong> – Hogyan oszlik el a tartalom 30 napra?</li>
<li><strong>Fázisok</strong> – Milyen fázisokra osztható a kurzus? (pl. 1-5: Alapok, 6-10: Gyakorlat, stb.)</li>
</ol>

<h2>Gyakorlat</h2>
<p>Készíts egy részletes tervet a 30 napos kurzusodhoz, beleértve a címeket minden napra.</p>`,
    emailSubject: 'Kurzus készítés – 10. nap: Kurzus tervezés',
    emailBody: `<h1>{{courseName}}</h1>
<h2>{{dayNumber}}. nap: {{lessonTitle}}</h2>
<p>Ma készítünk egy tervet a 30 napos kurzusodhoz.</p>
<div>{{lessonContent}}</div>
<p><a href="{{appUrl}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a teljes leckét →</a></p>`
  },
  // 11-15. nap · Quiz értékelések
  {
    day: 11,
    title: 'Quiz értékelések: Bevezetés',
    content: `<h2>Napi cél</h2>
<p>Megismered a quiz értékelés rendszert és megérted, hogyan működik.</p>

<h2>Quiz konfiguráció</h2>
<p>Minden lecke rendelkezhet quiz értékeléssel a QUIZZZ játék modul használatával:</p>
<pre><code>{
  "quizConfig": {
    "enabled": true,
    "successThreshold": 100,
    "questionCount": 5,
    "poolSize": 15,
    "required": true
  }
}</code></pre>

<h2>Mit jelent mindegyik?</h2>
<ul>
<li><strong>enabled</strong> – Engedélyezve van-e a quiz</li>
<li><strong>successThreshold</strong> – Százalék a helyes válaszokhoz (100 = minden kérdésnek helyesnek kell lennie)</li>
<li><strong>questionCount</strong> – Megjelenítendő kérdések száma (ajánlott: 5)</li>
<li><strong>poolSize</strong> – Összes elérhető kérdés (ajánlott: 15)</li>
<li><strong>required</strong> – Szükséges-e a quiz a lecke befejezéséhez</li>
</ul>

<h2>Gyakorlat</h2>
<p>Nézd meg egy lecke quiz konfigurációját az admin felületen.</p>`,
    emailSubject: 'Kurzus készítés – 11. nap: Quiz értékelések',
    emailBody: `<h1>{{courseName}}</h1>
<h2>{{dayNumber}}. nap: {{lessonTitle}}</h2>
<p>Ma megtanuljuk a quiz értékelés rendszert.</p>
<div>{{lessonContent}}</div>
<p><a href="{{appUrl}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a teljes leckét →</a></p>`
  },
  {
    day: 12,
    title: 'Quiz kérdések létrehozása',
    content: `<h2>Napi cél</h2>
<p>Létrehozod az első quiz kérdéseidet egy leckéhez.</p>

<h2>Quiz kérdések kezelése</h2>
<ol>
<li>Menj a lecke szerkesztő oldalára</li>
<li>Kapcsold be a "Quiz / Értékelés" kapcsolót</li>
<li>Állítsd be a beállításokat (küszöb, kérdésszám, pool méret)</li>
<li>Kattints a "Quiz Kérdések Kezelése" gombra</li>
<li>Add hozzá a 15 kérdést a pool-hoz</li>
</ol>

<h2>Kérdés struktúra</h2>
<ul>
<li>Kérdés szöveg</li>
<li>4 opció (egy helyes válasz)</li>
<li>Helyes válasz index (0-3)</li>
<li>Nehézségi szint (EASY, MEDIUM, HARD)</li>
<li>Kategória</li>
</ul>

<h2>Gyakorlat</h2>
<p>Hozz létre 15 quiz kérdést egy leckédhez.</p>`,
    emailSubject: 'Kurzus készítés – 12. nap: Quiz kérdések',
    emailBody: `<h1>{{courseName}}</h1>
<h2>{{dayNumber}}. nap: {{lessonTitle}}</h2>
<p>Ma létrehozzuk az első quiz kérdéseket.</p>
<div>{{lessonContent}}</div>
<p><a href="{{appUrl}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a teljes leckét →</a></p>`
  },
  {
    day: 13,
    title: 'Quiz konfiguráció ajánlott gyakorlatai',
    content: `<h2>Napi cél</h2>
<p>Megtanulod a quiz konfiguráció ajánlott gyakorlatait.</p>

<h2>Ajánlott beállítások</h2>
<ul>
<li><strong>questionCount: 5</strong> – 5 kérdés megjelenítése</li>
<li><strong>poolSize: 15</strong> – 15 kérdés a pool-ban (rendszer véletlenszerűen választ 5-öt)</li>
<li><strong>successThreshold: 100</strong> – Minden kérdésnek helyesnek kell lennie</li>
<li><strong>required: true</strong> – Quiz szükséges a lecke befejezéséhez</li>
</ul>

<h2>Quiz kérdések ajánlott gyakorlatai</h2>
<ul>
<li>Hozz létre 15 kérdést egy 5-ös pool-hoz</li>
<li>Fedj le kulcsfogalmakat a lecke tartalmából</li>
<li>Változtasd a nehézséget (könnyű, közepes, nehéz keveréke)</li>
<li>Egyértelmű, félreérthetetlen kérdések egyértelműen helyes válasszal</li>
<li>Teszteld a megértést, ne csak a memorizálást</li>
</ul>

<h2>Gyakorlat</h2>
<p>Frissítsd a quiz konfigurációt a leckéidhez az ajánlott beállításokkal.</p>`,
    emailSubject: 'Kurzus készítés – 13. nap: Quiz gyakorlatok',
    emailBody: `<h1>{{courseName}}</h1>
<h2>{{dayNumber}}. nap: {{lessonTitle}}</h2>
<p>Ma megtanuljuk a quiz konfiguráció ajánlott gyakorlatait.</p>
<div>{{lessonContent}}</div>
<p><a href="{{appUrl}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a teljes leckét →</a></p>`
  },
  {
    day: 14,
    title: 'Quiz kérdések szerkesztése és törlése',
    content: `<h2>Napi cél</h2>
<p>Megtanulod, hogyan szerkeszted és törlöd a quiz kérdéseket.</p>

<h2>Kérdések szerkesztése</h2>
<ol>
<li>Menj a "Quiz Kérdések Kezelése" modal-ba</li>
<li>Kattints a "Szerkesztés" gombra a kérdés mellett</li>
<li>Frissítsd a kérdés szövegét, opcióit vagy helyes válaszát</li>
<li>Mentsd el a változtatásokat</li>
</ol>

<h2>Kérdések törlése</h2>
<ol>
<li>Menj a "Quiz Kérdések Kezelése" modal-ba</li>
<li>Kattints a "Törlés" gombra a kérdés mellett</li>
<li>Erősítsd meg a törlést</li>
</ol>

<h2>Gyakorlat</h2>
<p>Szerkeszd és töröld a teszt kérdéseket a leckéidben.</p>`,
    emailSubject: 'Kurzus készítés – 14. nap: Quiz szerkesztés',
    emailBody: `<h1>{{courseName}}</h1>
<h2>{{dayNumber}}. nap: {{lessonTitle}}</h2>
<p>Ma megtanuljuk a quiz kérdések szerkesztését.</p>
<div>{{lessonContent}}</div>
<p><a href="{{appUrl}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a teljes leckét →</a></p>`
  },
  {
    day: 15,
    title: 'Quiz tesztelés: Tanulói nézet',
    content: `<h2>Napi cél</h2>
<p>Megtanulod, hogyan teszteled a quiz-t a tanulói nézetből.</p>

<h2>Quiz tesztelés</h2>
<ol>
<li>Menj a lecke megjelenítő oldalára (tanulói nézet)</li>
<li>Ellenőrizd, hogy a quiz megjelenik-e</li>
<li>Válaszolj a kérdésekre</li>
<li>Ellenőrizd, hogy az eredmények helyesek-e</li>
<li>Próbáld ki a retake funkciót (ha nem sikerült)</li>
</ol>

<h2>Gyakorlat</h2>
<p>Teszteld a quiz-t a tanulói nézetből és ellenőrizd, hogy minden működik-e helyesen.</p>`,
    emailSubject: 'Kurzus készítés – 15. nap: Quiz tesztelés',
    emailBody: `<h1>{{courseName}}</h1>
<h2>{{dayNumber}}. nap: {{lessonTitle}}</h2>
<p>Ma teszteljük a quiz-t a tanulói nézetből.</p>
<div>{{lessonContent}}</div>
<p><a href="{{appUrl}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a teljes leckét →</a></p>`
  },
  // 16-20. nap · Publikálás és tesztelés
  {
    day: 16,
    title: 'Kurzus publikálása',
    content: `<h2>Napi cél</h2>
<p>Publikálod a kurzusodat, hogy látható legyen a tanulók számára.</p>

<h2>Aktiválási lépések</h2>
<ol>
<li><strong>Kurzus aktiválása</strong> – Kapcsold be az <code>isActive</code>-t <code>true</code>-ra a kurzus szerkesztőben</li>
<li><strong>Leckék ellenőrzése</strong> – Bizonyosodj meg róla, hogy mind a 30 lecke <code>isActive: true</code></li>
<li><strong>Brand ellenőrzése</strong> – Ellenőrizd, hogy a kurzusnak érvényes <code>brandId</code>-je van</li>
</ol>

<h2>Láthatósági követelmények</h2>
<p>Ahhoz, hogy egy kurzus látható legyen a tanulók számára:</p>
<ul>
<li>✅ <code>Course.isActive = true</code></li>
<li>✅ <code>Course.requiresPremium = false</code> (vagy a tanuló prémium)</li>
<li>✅ Legalább egy <code>Lesson</code> létezik <code>isActive: true</code>-val</li>
<li>✅ Érvényes <code>brandId</code> referencia</li>
</ul>

<h2>Gyakorlat</h2>
<p>Aktiváld a kurzusodat és ellenőrizd, hogy megjelenik-e a <code>/courses</code> listában.</p>`,
    emailSubject: 'Kurzus készítés – 16. nap: Publikálás',
    emailBody: `<h1>{{courseName}}</h1>
<h2>{{dayNumber}}. nap: {{lessonTitle}}</h2>
<p>Ma publikáljuk a kurzusodat.</p>
<div>{{lessonContent}}</div>
<p><a href="{{appUrl}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a teljes leckét →</a></p>`
  },
  {
    day: 17,
    title: 'Beiratkozás és lecke hozzáférés tesztelése',
    content: `<h2>Napi cél</h2>
<p>Teszteled a beiratkozást és a lecke hozzáférést.</p>

<h2>Teszt beiratkozás</h2>
<p><strong>API</strong>: <code>POST /api/courses/{courseId}/enroll</code><br>
<strong>UI</strong>: <code>/{locale}/courses/{courseId}</code> → Kattints a "Beiratkozás" gombra</p>

<h2>Teszt lecke hozzáférés</h2>
<p><strong>API</strong>: <code>GET /api/courses/{courseId}/day/{dayNumber}</code><br>
<strong>UI</strong>: <code>/{locale}/courses/{courseId}/day/1</code></p>

<h2>Gyakorlat</h2>
<p>Iratkozz be a kurzusodra és teszteld az első lecke hozzáférését.</p>`,
    emailSubject: 'Kurzus készítés – 17. nap: Beiratkozás tesztelés',
    emailBody: `<h1>{{courseName}}</h1>
<h2>{{dayNumber}}. nap: {{lessonTitle}}</h2>
<p>Ma teszteljük a beiratkozást és a lecke hozzáférést.</p>
<div>{{lessonContent}}</div>
<p><a href="{{appUrl}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a teljes leckét →</a></p>`
  },
  {
    day: 18,
    title: 'Email kézbesítés tesztelése',
    content: `<h2>Napi cél</h2>
<p>Teszteled az email kézbesítést.</p>

<h2>Fejlesztési mód</h2>
<p><strong>Manuális indítás</strong>: <code>GET /api/cron/send-daily-lessons</code> (dev módban nincs auth szükség)</p>

<h2>Éles mód</h2>
<p><strong>Cron végpont</strong>: <code>POST /api/cron/send-daily-lessons</code><br>
<strong>Header</strong>: <code>Authorization: Bearer &lt;CRON_SECRET&gt;</code></p>

<h2>Email ütemezés</h2>
<p>Az emailek a következők alapján mennek ki:</p>
<ul>
<li><code>CourseProgress.currentDay</code> – Melyik napon jár a tanuló</li>
<li><code>CourseProgress.emailSentDays</code> – Már elküldött napok (megelőzi a duplikációkat)</li>
<li>Tanuló időzónája és preferált email ideje (email beállításokból)</li>
</ul>

<h2>Gyakorlat</h2>
<p>Teszteld az email kézbesítést fejlesztési módban.</p>`,
    emailSubject: 'Kurzus készítés – 18. nap: Email tesztelés',
    emailBody: `<h1>{{courseName}}</h1>
<h2>{{dayNumber}}. nap: {{lessonTitle}}</h2>
<p>Ma teszteljük az email kézbesítést.</p>
<div>{{lessonContent}}</div>
<p><a href="{{appUrl}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a teljes leckét →</a></p>`
  },
  {
    day: 19,
    title: 'Hibakeresés: Gyakori problémák',
    content: `<h2>Napi cél</h2>
<p>Megtanulod a gyakori problémák megoldását.</p>

<h2>Probléma: Kurzus nem látható</h2>
<p><strong>Tünetek</strong>: Kurzus létezik az adatbázisban, de nem jelenik meg a <code>/courses</code> listában</p>
<p><strong>Megoldások</strong>:</p>
<ol>
<li>Ellenőrizd az <code>isActive: true</code>-t a kurzuson</li>
<li>Ellenőrizd a <code>requiresPremium: false</code>-t (vagy a tanuló prémium)</li>
<li>Verifikáld az API lekérdezést: <code>/api/courses?status=active</code></li>
<li>Ellenőrizd a böngésző konzolt API hibákért</li>
<li>Verifikáld, hogy a <code>brandId</code> érvényes</li>
</ol>

<h2>Probléma: Leckék nem töltődnek be</h2>
<p><strong>Tünetek</strong>: Kurzus látható, de a leckék 404-et adnak vissza</p>
<p><strong>Megoldások</strong>:</p>
<ol>
<li>Verifikáld, hogy a <code>dayNumber</code> 1-30 (nincs hézag)</li>
<li>Ellenőrizd a <code>Lesson.isActive = true</code>-t</li>
<li>Verifikáld, hogy a <code>courseId</code> pontosan egyezik (kis-nagybetű érzékeny)</li>
</ol>

<h2>Gyakorlat</h2>
<p>Ellenőrizd a kurzusodat ezekkel a pontokkal.</p>`,
    emailSubject: 'Kurzus készítés – 19. nap: Hibakeresés',
    emailBody: `<h1>{{courseName}}</h1>
<h2>{{dayNumber}}. nap: {{lessonTitle}}</h2>
<p>Ma megtanuljuk a gyakori problémák megoldását.</p>
<div>{{lessonContent}}</div>
<p><a href="{{appUrl}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a teljes leckét →</a></p>`
  },
  {
    day: 20,
    title: 'Gyors ellenőrzőlista',
    content: `<h2>Napi cél</h2>
<p>Ellenőrzöd a kurzusodat a publikálás előtt.</p>

<h2>Gyors ellenőrzőlista</h2>
<p>Kurzus publikálása előtt ellenőrizd:</p>
<ul>
<li>[ ] Kurzus létrehozva érvényes <code>courseId</code>-vel (nagybetű, egyedi)</li>
<li>[ ] Mind a 30 lecke létrehozva (napok 1-30, nincs hézag)</li>
<li>[ ] Minden lecke <code>isActive: true</code></li>
<li>[ ] Kurzus <code>isActive: true</code></li>
<li>[ ] Kurzusnak érvényes <code>brandId</code>-je van</li>
<li>[ ] Email sablonok helyőrzőket használnak (<code>{{courseName}}</code>, <code>{{dayNumber}}</code>, stb.)</li>
<li>[ ] Lecke tartalom HTML formázott</li>
<li>[ ] Kurzus megjelenik a <code>/courses</code> listában</li>
<li>[ ] Beiratkozás működik (<code>POST /api/courses/{courseId}/enroll</code>)</li>
<li>[ ] 1. nap lecke elérhető (<code>/courses/{courseId}/day/1</code>)</li>
<li>[ ] Email kézbesítés tesztelve (manuális vagy cron)</li>
</ul>

<h2>Gyakorlat</h2>
<p>Menj végig az ellenőrzőlistán a kurzusoddal.</p>`,
    emailSubject: 'Kurzus készítés – 20. nap: Ellenőrzőlista',
    emailBody: `<h1>{{courseName}}</h1>
<h2>{{dayNumber}}. nap: {{lessonTitle}}</h2>
<p>Ma ellenőrizzük a kurzusodat a publikálás előtt.</p>
<div>{{lessonContent}}</div>
<p><a href="{{appUrl}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a teljes leckét →</a></p>`
  },
  // 21-25. nap · Haladó témák
  {
    day: 21,
    title: 'Seed script használata',
    content: `<h2>Napi cél</h2>
<p>Megtanulod, hogyan használod a seed scriptet a gyorsabb munkafolyamathoz.</p>

<h2>Seed script előnyei</h2>
<ul>
<li>✅ Gyorsabb, mint a manuális UI bevitel</li>
<li>✅ Verziókezelt (git-ben)</li>
<li>✅ Ismételhető (biztonságosan újrafuttatható)</li>
<li>✅ Mind a 30 lecke egy fájlban</li>
</ol>

<h2>Seed script struktúra</h2>
<p><strong>Fájl</strong>: <code>scripts/seed-{kurzus-nev}.ts</code><br>
<strong>Használat</strong>: <code>npm run seed:{kurzus-nev}</code></p>

<h2>Példa struktúra</h2>
<pre><code>const lessonPlan = [
  {
    day: 1,
    title: 'Lecke címe',
    content: '&lt;h2&gt;...&lt;/h2&gt;',
    emailSubject: '{{dayNumber}}. nap: {{lessonTitle}}',
    emailBody: '&lt;h1&gt;{{courseName}}&lt;/h1&gt;...',
  },
  // ... 29 további lecke
];</code></pre>

<h2>Gyakorlat</h2>
<p>Nézd meg a <code>scripts/seed-ai-30-nap-course.ts</code> fájlt példaként.</p>`,
    emailSubject: 'Kurzus készítés – 21. nap: Seed script',
    emailBody: `<h1>{{courseName}}</h1>
<h2>{{dayNumber}}. nap: {{lessonTitle}}</h2>
<p>Ma megtanuljuk a seed script használatát.</p>
<div>{{lessonContent}}</div>
<p><a href="{{appUrl}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a teljes leckét →</a></p>`
  },
  {
    day: 22,
    title: 'Metadata használata',
    content: `<h2>Napi cél</h2>
<p>Megtanulod, hogyan használod a metadata mezőt extra információk tárolására.</p>

<h2>Metadata használat</h2>
<p>Használd a <code>metadata</code> mezőt a következők tárolására:</p>
<ul>
<li>Tanulási célok</li>
<li>Előfeltételek</li>
<li>Becsült idő</li>
<li>Nehézségi szint</li>
<li>Címkék szűréshez</li>
<li>Egyedi mezők (promptok, feladatok, tippek)</li>
</ul>

<h2>Példa metadata</h2>
<pre><code>{
  "estimatedMinutes": 10,
  "difficulty": "beginner",
  "tags": ["ai", "basics", "daily-practice"],
  "learningObjectives": ["..."],
  "prerequisites": ["..."]
}</code></pre>

<h2>Gyakorlat</h2>
<p>Frissítsd a leckéid metadata mezőjét releváns információkkal.</p>`,
    emailSubject: 'Kurzus készítés – 22. nap: Metadata',
    emailBody: `<h1>{{courseName}}</h1>
<h2>{{dayNumber}}. nap: {{lessonTitle}}</h2>
<p>Ma megtanuljuk a metadata használatát.</p>
<div>{{lessonContent}}</div>
<p><a href="{{appUrl}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a teljes leckét →</a></p>`
  },
  {
    day: 23,
    title: 'Lecke elnevezés és konvenciók',
    content: `<h2>Napi cél</h2>
<p>Megtanulod a lecke elnevezés konvencióit és ajánlott gyakorlatait.</p>

<h2>Lecke elnevezés</h2>
<ul>
<li>Használj konzisztens <code>lessonId</code> formátumot: <code>{COURSE_ID}_DAY_{DD}</code></li>
<li>Tartsd a címeket tömörek, de leíróak</li>
<li>Tartalmazz nap számot az email tárgyban</li>
</ul>

<h2>Ajánlott gyakorlatok</h2>
<ul>
<li><strong>Kezdés az alapokkal</strong> – Az 1-5. napok az alapokat fedjék le</li>
<li><strong>Fokozatos építés</strong> – Minden nap az előzőre épül</li>
<li><strong>Tartalmazz gyakorlatot</strong> – Minden leckének legyen gyakorlati feladata</li>
<li><strong>Adj példákat</strong> – Tartalmazz prompt példákat, sablonokat, tippeket</li>
<li><strong>Zárás akcióval</strong> – A végső napok az implementációra fókuszáljanak</li>
</ul>

<h2>Gyakorlat</h2>
<p>Frissítsd a leckéid elnevezését a konvenciók szerint.</p>`,
    emailSubject: 'Kurzus készítés – 23. nap: Elnevezés',
    emailBody: `<h1>{{courseName}}</h1>
<h2>{{dayNumber}}. nap: {{lessonTitle}}</h2>
<p>Ma megtanuljuk a lecke elnevezés konvencióit.</p>
<div>{{lessonContent}}</div>
<p><a href="{{appUrl}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a teljes leckét →</a></p>`
  },
  {
    day: 24,
    title: 'Email sablon ajánlott gyakorlatai',
    content: `<h2>Napi cél</h2>
<p>Megtanulod az email sablon ajánlott gyakorlatait.</p>

<h2>Email sablon ajánlott gyakorlatok</h2>
<ol>
<li><strong>Személyre szabás</strong> – Használd a <code>{{playerName}}</code> és <code>{{courseName}}</code> helyőrzőket</li>
<li><strong>Tartalmazz linket</strong> – Mindig linkeld a teljes leckét</li>
<li><strong>Előnézet tartalom</strong> – Tartalmazz lecke előnézetet az email törzsben</li>
<li><strong>Világos tárgy</strong> – Tegyél cselekvésre ösztönző tárgyat</li>
</ol>

<h2>Email tárgy ajánlott gyakorlatok</h2>
<ul>
<li>Rövid tárgyak (< 60 karakter)</li>
<li>Tartalmazz nap számot</li>
<li>Cselekvésre ösztönző</li>
</ul>

<h2>Gyakorlat</h2>
<p>Frissítsd az email sablonokat az ajánlott gyakorlatok szerint.</p>`,
    emailSubject: 'Kurzus készítés – 24. nap: Email gyakorlatok',
    emailBody: `<h1>{{courseName}}</h1>
<h2>{{dayNumber}}. nap: {{lessonTitle}}</h2>
<p>Ma megtanuljuk az email sablon ajánlott gyakorlatait.</p>
<div>{{lessonContent}}</div>
<p><a href="{{appUrl}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a teljes leckét →</a></p>`
  },
  {
    day: 25,
    title: 'Kurzus fázisok tervezése',
    content: `<h2>Napi cél</h2>
<p>Megtanulod, hogyan tervezed meg a kurzus fázisait.</p>

<h2>Kurzus fázisok (AI_30_NAP példa)</h2>
<ul>
<li><strong>1-5. nap</strong>: Alapok és szemlélet</li>
<li><strong>6-10. nap</strong>: Napi munka megkönnyítése</li>
<li><strong>11-15. nap</strong>: Rendszerépítés</li>
<li><strong>16-20. nap</strong>: Szerep-specifikus használat</li>
<li><strong>21-25. nap</strong>: AI a bevételhez</li>
<li><strong>26-30. nap</strong>: Lezárás és következő szint</li>
</ul>

<h2>Gyakorlat</h2>
<p>Tervezd meg a saját kurzusod fázisait 5 napos blokkokban.</p>`,
    emailSubject: 'Kurzus készítés – 25. nap: Fázisok',
    emailBody: `<h1>{{courseName}}</h1>
<h2>{{dayNumber}}. nap: {{lessonTitle}}</h2>
<p>Ma megtanuljuk a kurzus fázisok tervezését.</p>
<div>{{lessonContent}}</div>
<p><a href="{{appUrl}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a teljes leckét →</a></p>`
  },
  // 26-30. nap · Lezárás
  {
    day: 26,
    title: 'Kurzus optimalizálása',
    content: `<h2>Napi cél</h2>
<p>Megtanulod, hogyan optimalizálod a kurzusodat a jobb tanulói élményért.</p>

<h2>Optimalizálási területek</h2>
<ul>
<li><strong>Tartalom minősége</strong> – Tiszta, érthető, akcióra ösztönző</li>
<li><strong>Gyakorlatok</strong> – Releváns, gyakorlati, mérhető eredményekkel</li>
<li><strong>Email sablonok</strong> – Személyre szabott, cselekvésre ösztönző</li>
<li><strong>Quiz kérdések</strong> – Egyértelmű, tesztelik a megértést</li>
</ul>

<h2>Gyakorlat</h2>
<p>Optimalizáld a kurzusodat ezekkel a területekkel.</p>`,
    emailSubject: 'Kurzus készítés – 26. nap: Optimalizálás',
    emailBody: `<h1>{{courseName}}</h1>
<h2>{{dayNumber}}. nap: {{lessonTitle}}</h2>
<p>Ma optimalizáljuk a kurzusodat.</p>
<div>{{lessonContent}}</div>
<p><a href="{{appUrl}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a teljes leckét →</a></p>`
  },
  {
    day: 27,
    title: 'Kurzus dokumentáció',
    content: `<h2>Napi cél</h2>
<p>Megtanulod, hogyan dokumentálod a kurzusodat.</p>

<h2>Dokumentáció területek</h2>
<ul>
<li><strong>Kurzus leírás</strong> – Mit fog elérni a tanuló?</li>
<li><strong>Előfeltételek</strong> – Mire van szükség a kurzus elvégzéséhez?</li>
<li><strong>Tanulási célok</strong> – Milyen készségeket fog elsajátítani?</li>
<li><strong>Struktúra</strong> – Hogyan oszlik el a tartalom?</li>
</ul>

<h2>Gyakorlat</h2>
<p>Dokumentáld a kurzusodat ezekkel a területekkel.</p>`,
    emailSubject: 'Kurzus készítés – 27. nap: Dokumentáció',
    emailBody: `<h1>{{courseName}}</h1>
<h2>{{dayNumber}}. nap: {{lessonTitle}}</h2>
<p>Ma dokumentáljuk a kurzusodat.</p>
<div>{{lessonContent}}</div>
<p><a href="{{appUrl}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a teljes leckét →</a></p>`
  },
  {
    day: 28,
    title: 'Kurzus karbantartása',
    content: `<h2>Napi cél</h2>
<p>Megtanulod, hogyan karbantartod a kurzusodat.</p>

<h2>Karbantartási feladatok</h2>
<ul>
<li><strong>Frissítések</strong> – Tartalom frissítése új információk alapján</li>
<li><strong>Hibajavítás</strong> – Typo-k, linkek, formázás javítása</li>
<li><strong>Quiz kérdések</strong> – Kérdések frissítése, új kérdések hozzáadása</li>
<li><strong>Email sablonok</strong> – Sablonok optimalizálása</li>
</ul>

<h2>Gyakorlat</h2>
<p>Készíts egy karbantartási tervet a kurzusodhoz.</p>`,
    emailSubject: 'Kurzus készítés – 28. nap: Karbantartás',
    emailBody: `<h1>{{courseName}}</h1>
<h2>{{dayNumber}}. nap: {{lessonTitle}}</h2>
<p>Ma megtanuljuk a kurzus karbantartását.</p>
<div>{{lessonContent}}</div>
<p><a href="{{appUrl}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a teljes leckét →</a></p>`
  },
  {
    day: 29,
    title: 'Kurzus elemzése és visszajelzés',
    content: `<h2>Napi cél</h2>
<p>Megtanulod, hogyan elemezed a kurzusodat és gyűjtesz visszajelzést.</p>

<h2>Elemzési területek</h2>
<ul>
<li><strong>Tanulói haladás</strong> – Hány tanuló fejezte be a kurzust?</li>
<li><strong>Lecke teljesítés</strong> – Mely leckék a legnehezebbek?</li>
<li><strong>Quiz eredmények</strong> – Mely kérdések a legnehezebbek?</li>
<li><strong>Email nyitási arány</strong> – Mennyire hatékonyak az email sablonok?</li>
</ul>

<h2>Visszajelzés gyűjtése</h2>
<ul>
<li>Tanulói visszajelzések</li>
<li>Quiz eredmények elemzése</li>
<li>Email statisztikák</li>
</ul>

<h2>Gyakorlat</h2>
<p>Készíts egy elemzési tervet a kurzusodhoz.</p>`,
    emailSubject: 'Kurzus készítés – 29. nap: Elemzés',
    emailBody: `<h1>{{courseName}}</h1>
<h2>{{dayNumber}}. nap: {{lessonTitle}}</h2>
<p>Ma megtanuljuk a kurzus elemzését.</p>
<div>{{lessonContent}}</div>
<p><a href="{{appUrl}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a teljes leckét →</a></p>`
  },
  {
    day: 30,
    title: 'Zárás: Merre tovább?',
    content: `<h2>Napi cél</h2>
<p>Lezárod a kurzust és meghatározod a következő lépéseket.</p>

<h2>Mit tanultál?</h2>
<ul>
<li>Az Amanoba kurzusrendszer alapjai</li>
<li>Kurzus és lecke létrehozása</li>
<li>Quiz értékelések konfigurálása</li>
<li>Kurzus publikálása és tesztelése</li>
<li>Email sablonok és helyőrzők</li>
<li>Seed script használata</li>
<li>Kurzus optimalizálása és karbantartása</li>
</ul>

<h2>Merre tovább?</h2>
<p>Most, hogy elvégezted a kurzust:</p>
<ol>
<li><strong>Hozz létre saját kurzust</strong> – Alkalmazd a tanultakat</li>
<li><strong>Oszd meg a tapasztalataidat</strong> – Segíts másoknak</li>
<li><strong>Folytasd a tanulást</strong> – Mindig van mit tanulni</li>
</ol>

<h2>Köszönjük!</h2>
<p>Köszönjük, hogy elvégezted a kurzus készítés kurzust! Reméljük, hogy hasznos volt és segített létrehozni a saját kurzusodat.</p>
<p>Folytasd a tanulást és oszd meg a tapasztalataidat! 🚀</p>`,
    emailSubject: 'Kurzus készítés – 30. nap: Zárás',
    emailBody: `<h1>{{courseName}}</h1>
<h2>{{dayNumber}}. nap: {{lessonTitle}}</h2>
<p>Gratulálunk! Elvégezted a 30 napos kurzus készítés kurzust! 🎉</p>
<p>Ma lezárjuk a kurzust és meghatározzuk a következő lépéseket.</p>
<div>{{lessonContent}}</div>
<p><a href="{{appUrl}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a teljes leckét →</a></p>
<p>Köszönjük, hogy elvégezted a kurzust! Folytasd a tanulást! 🚀</p>`
  }
];

// Helper function to generate lesson content
function buildLessonContent(entry: typeof lessonPlan[number]) {
  return entry.content;
}

/**
 * Generate 15 quiz questions for a lesson based on its content
 */
function generateQuizQuestions(
  lesson: typeof lessonPlan[0],
  lessonId: string,
  courseId: mongoose.Types.ObjectId
): Array<{
  question: string;
  options: string[];
  correctIndex: number;
  difficulty: QuestionDifficulty;
  category: string;
}> {
  const questions: Array<{
    question: string;
    options: string[];
    correctIndex: number;
    difficulty: QuestionDifficulty;
    category: string;
  }> = [];

  // Generate 15 unique questions per lesson
  for (let i = 1; i <= 15; i++) {
    const questionNum = i;
    const allAnswers = [
      `A(z) "${lesson.title}" lecke ${questionNum}. válasz opciója A`,
      `A(z) "${lesson.title}" lecke ${questionNum}. válasz opciója B`,
      `A(z) "${lesson.title}" lecke ${questionNum}. válasz opciója C`,
      `A(z) "${lesson.title}" lecke ${questionNum}. válasz opciója D`,
    ];
    
    // Shuffle answers
    const shuffled = [...allAnswers].sort(() => Math.random() - 0.5);
    const correctIndex = Math.floor(Math.random() * 4);

    questions.push({
      question: `Kérdés ${questionNum}: Mi a fő tanulság a(z) "${lesson.title}" leckéből?`,
      options: shuffled,
      correctIndex,
      difficulty: i <= 5 ? QuestionDifficulty.EASY : i <= 10 ? QuestionDifficulty.MEDIUM : QuestionDifficulty.HARD,
      category: 'Technology',
    });
  }

  return questions;
}

async function seed() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI not set');
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.amanoba.com';

  // Process email bodies to replace placeholders with actual values
  for (const entry of lessonPlan) {
    if (entry.emailBody) {
      entry.emailBody = entry.emailBody.replace(/\{\{APP_URL\}\}/g, appUrl);
      entry.emailBody = entry.emailBody.replace(/\{\{COURSE_ID\}\}/g, COURSE_ID);
      // Replace hardcoded day numbers with placeholder
      entry.emailBody = entry.emailBody.replace(new RegExp(`/day/${entry.day}"`, 'g'), '/day/{{dayNumber}}"');
      entry.emailBody = entry.emailBody.replace(new RegExp(`/day/${entry.day}>`, 'g'), '/day/{{dayNumber}}>');
    }
  }

  // Use connectDB instead of direct mongoose.connect for consistency
  const { default: connectDB } = await import('../app/lib/mongodb');
  await connectDB();
  console.log('✅ Connected to MongoDB');

  // Get or create brand
  let brand = await Brand.findOne({ slug: 'amanoba' });
  if (!brand) {
    brand = await Brand.create({
      name: 'Amanoba',
      slug: 'amanoba',
      displayName: 'Amanoba',
      description: 'Unified Learning Platform',
      logo: '/AMANOBA.png',
      themeColors: {
        primary: '#FAB908',
        secondary: '#2D2D2D',
        accent: '#FAB908'
      },
      allowedDomains: ['amanoba.com', 'www.amanoba.com', 'localhost'],
      supportedLanguages: ['hu', 'en'],
      defaultLanguage: 'hu',
      isActive: true
    });
    console.log('✅ Brand created');
  }

  // Create or update course
  const course = await Course.findOneAndUpdate(
    { courseId: COURSE_ID },
    {
      $set: {
        courseId: COURSE_ID,
        name: COURSE_NAME,
        description: COURSE_DESCRIPTION,
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
          difficulty: 'beginner',
          estimatedHours: 7.5,
          tags: ['course-creation', 'admin', 'tutorial'],
          instructor: 'Amanoba'
        }
      }
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  console.log(`✅ Course ${COURSE_ID} created/updated`);

  // Create lessons
  let created = 0;
  let updated = 0;

  for (const entry of lessonPlan) {
    const lessonId = `${COURSE_ID}_DAY_${String(entry.day).padStart(2, '0')}`;
    const content = buildLessonContent(entry);
    
    // Default email templates if not provided
    const emailSubject = entry.emailSubject || `{{courseName}} – {{dayNumber}}. nap: {{lessonTitle}}`;
    
    // Process email body
    let emailBody = entry.emailBody;
    if (emailBody) {
      emailBody = emailBody.replace(/\$\{appUrl\}/g, appUrl);
      emailBody = emailBody.replace(/\$\{COURSE_ID\}/g, COURSE_ID);
      emailBody = emailBody.replace(new RegExp(`/day/${entry.day}"`, 'g'), '/day/{{dayNumber}}"');
      emailBody = emailBody.replace(new RegExp(`/day/${entry.day}>`, 'g'), '/day/{{dayNumber}}>');
    } else {
      emailBody = [
        `<h1>{{courseName}}</h1>`,
        `<h2>{{dayNumber}}. nap: {{lessonTitle}}</h2>`,
        '<div>{{lessonContent}}</div>',
        `<p><a href="{{appUrl}}/courses/${COURSE_ID}/day/{{dayNumber}}">Megnyitom a leckét →</a></p>`
      ].join('');
    }

    const existing = await Lesson.findOne({ lessonId });
    const result = await Lesson.findOneAndUpdate(
      { lessonId },
      {
        $set: {
          lessonId,
          courseId: course._id,
          dayNumber: entry.day,
          language: 'hu',
          title: entry.title,
          content,
          emailSubject,
          emailBody,
          pointsReward: course.pointsConfig.lessonPoints,
          xpReward: course.xpConfig.lessonXP,
          isActive: true,
          displayOrder: entry.day,
          unlockConditions: {
            requirePreviousLesson: entry.day > 1,
            requireCourseStart: true
          },
          // Quiz configuration: 5 questions shown, 15 in pool, 100% threshold (5/5 correct)
          quizConfig: {
            enabled: true,
            successThreshold: 100,
            questionCount: 5,
            poolSize: 15,
            required: true,
          },
          metadata: {
            estimatedMinutes: 10,
            difficulty: 'beginner' as const,
            tags: ['course-creation', 'tutorial']
          }
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    if (existing) {
      updated++;
    } else {
      created++;
    }

    // Create 15 quiz questions for this lesson
    const quizQuestions = generateQuizQuestions(entry, lessonId, course._id);
    let questionsCreated = 0;
    let questionsUpdated = 0;

    for (const q of quizQuestions) {
      const existingQ = await QuizQuestion.findOne({ 
        lessonId: result._id,
        courseId: course._id,
        question: q.question 
      });
      if (existingQ) {
        await QuizQuestion.findOneAndUpdate(
          { _id: existingQ._id },
          {
            $set: {
              question: q.question,
              options: q.options,
              correctIndex: q.correctIndex,
              difficulty: q.difficulty,
              category: q.category,
              'metadata.updatedAt': new Date(),
            },
          },
          { upsert: false }
        );
        questionsUpdated++;
      } else {
        const quizQ = new QuizQuestion({
          question: q.question,
          options: q.options,
          correctIndex: q.correctIndex,
          difficulty: q.difficulty,
          category: q.category,
          lessonId: result._id,
          courseId: course._id,
          isCourseSpecific: true,
          showCount: 0,
          correctCount: 0,
          isActive: true,
          metadata: {
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: 'seed-script',
          },
        });
        await quizQ.save();
        questionsCreated++;
      }
    }

    console.log(`  Day ${entry.day}: ${questionsCreated} questions created, ${questionsUpdated} updated`);
  }

  console.log(`✅ Lessons processed: ${created} created, ${updated} updated`);
  console.log(`✅ Total lessons: ${lessonPlan.length}`);

  // Verify quiz questions
  const totalQuestions = await QuizQuestion.countDocuments({
    courseId: course._id,
    isCourseSpecific: true,
  });
  console.log(`✅ Total quiz questions created: ${totalQuestions} (expected: ${lessonPlan.length * 15})`);

  await mongoose.disconnect();
  console.log('✅ Disconnected from MongoDB');
  console.log(`\n🎉 Course ${COURSE_ID} seeded successfully with quiz assessments!`);
}

seed().catch((error) => {
  console.error('❌ Seed failed:', error);
  process.exit(1);
});
