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
    content: `<h1>Bevezetés: Mi az Amanoba kurzusrendszer?</h1>
<p><em>Átlátod a modellt, a publikálás lépéseit és az admin felületet.</em></p>

<hr />
<h2>Napi cél</h2>
<ul>
<li>Megérted a három fő modellt: Course, Lesson, CourseProgress.</li>
<li>Tudod, mi kell a publikáláshoz (isActive a kurzuson és a leckéken).</li>
<li>Felderíted az admin felület alap nézeteit.</li>
</ul>

<hr />
<h2>Platform felépítése</h2>
<ol>
<li><strong>Course</strong>: metaadatok (név, leírás, nyelv, pont/XP, státusz).</li>
<li><strong>Lesson</strong>: napi tartalom + email tárgy/szöveg, 30 napos keret.</li>
<li><strong>CourseProgress</strong>: tanulói haladás (aktuális nap, befejezett leckék, státusz).</li>
</ol>

<h2>Publikálási alapok</h2>
<ul>
<li><code>Course.isActive = true</code> <strong>ÉS</strong> minden lecke <code>isActive = true</code>.</li>
<li>30 napos struktúra, napi egy lecke.</li>
<li>Napi emailküldés automatizált (cron + Resend).</li>
</ul>

<hr />
<h2>Gyakorlat (vezetett)</h2>
<p>Látogasd meg az admin felületet: <code>/{locale}/admin/courses</code>. Nézd meg a listát, nyisd meg egy kurzus részleteit.</p>

<h2>Gyakorlat (önálló)</h2>
<p>Jegyezd le: hol állítható az <strong>isActive</strong> a kurzusnál és a leckéknél? Hol látod a 30 napos leckelistát?</p>

<hr />
<h2>Hasznos hivatkozások</h2>
<ul>
<li>Admin kurzus lista: <code>/{locale}/admin/courses</code></li>
<li>Daily cron endpoint: <code>/api/cron/send-daily-lessons</code></li>
</ul>`,
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
    content: `<h1>Előfeltételek és beállítások</h1>
<p><em>Admin jog, adatbázis, email, cron – nélkülük nincs kurzus.</em></p>

<hr />
<h2>Napi cél</h2>
<ul>
<li>Ellenőrzöd az összes előfeltételt (admin, DB, email, cron).</li>
<li>Rögzíted, ha hiányzik valami.</li>
</ul>

<hr />
<h2>Előfeltételek</h2>
<ul>
<li><strong>Admin hozzáférés</strong>: <code>/{locale}/admin</code> (alap: <code>/en/admin</code>).</li>
<li><strong>Adatbázis</strong>: <code>MONGODB_URI</code> a <code>.env.local</code>-ban.</li>
<li><strong>Email</strong>: <code>RESEND_API_KEY</code>, <code>EMAIL_FROM</code>, <code>EMAIL_REPLY_TO</code>, <code>NEXT_PUBLIC_APP_URL</code>.</li>
<li><strong>Napi emailek</strong>: <code>CRON_SECRET</code> + Vercel cron (POST <code>/api/cron/send-daily-lessons</code>).</li>
</ul>

<hr />
<h2>Beállítás-ellenőrzés</h2>
<ol>
<li>Lépj be adminnal.</li>
<li>Ellenőrizd a DB kapcsolatot (pl. helyi <code>npm run seed:course-creation</code> próbával).</li>
<li>Verifikáld az email kulcsokat és feladót.</li>
<li>Nézd meg a Vercel cron beállítást a napi küldéshez.</li>
</ol>

<hr />
<h2>Gyakorlat (vezetett)</h2>
<p>Töltsd ki egy checklistben: Admin ok? DB ok? Resend kulcsok ok? Cron beállítva?</p>

<h2>Gyakorlat (önálló)</h2>
<p>Ha bármi hiányzik, írd le, ki tudja pótolni és mikor.</p>

<hr />
<h2>Hasznos hivatkozások</h2>
<ul>
<li>Resend beállítás: <a href="https://resend.com/docs" target="_blank" rel="noreferrer">https://resend.com/docs</a></li>
<li>Vercel cron: <a href="https://vercel.com/docs/cron-jobs" target="_blank" rel="noreferrer">https://vercel.com/docs/cron-jobs</a></li>
</ul>`,
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
    content: `<h1>Kurzus létrehozása: Course modell</h1>
<p><em>courseId, meta, státusz – ez a kurzus váza.</em></p>

<hr />
<h2>Napi cél</h2>
<ul>
<li>Létrehozol egy kurzust az adminban.</li>
<li>Megfelelsz a kötelező mezőknek és formátumoknak.</li>
</ul>

<hr />
<h2>Kötelező mezők</h2>
<ul>
<li><strong>courseId</strong>: nagybetű/szám/aláhúzás (pl. <code>AI_30_NAP</code>), regex: <code>/^[A-Z0-9_]+$/</code>, egyedi.</li>
<li><strong>name</strong>: max 200 karakter.</li>
<li><strong>description</strong>: max 2000 karakter.</li>
</ul>

<h2>Ajánlott beállítások</h2>
<ul>
<li><code>language</code>: <code>hu</code> vagy <code>en</code> (default: <code>hu</code>).</li>
<li><code>durationDays</code>: <code>30</code> (standard).</li>
<li><code>requiresPremium</code>: <code>false</code>, ha nem prémium.</li>
<li><code>thumbnail</code>: opcionális, listához.</li>
</ul>

<hr />
<h2>Gyakorlat (vezetett)</h2>
<p>Menj az <code>/{locale}/admin/courses/new</code> oldalra, hozz létre egy teszt kurzust szabályos <code>courseId</code>-val.</p>

<h2>Gyakorlat (önálló)</h2>
<p>Ellenőrizd: isActive = true? Nyelv helyes? Leírás tömör és max 2000? Ha kész, mentsd piszkozatként vagy aktiváld.</p>

<hr />
<h2>Tippek</h2>
<ul>
<li>A courseId legyen végleges, mert sok helyen hivatkozunk rá.</li>
<li>Használj tömör, értékalapú leírást (1–2 bekezdés).</li>
</ul>`,
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
    content: `<h1>Pontok és XP konfiguráció</h1>
<p><em>Motiváció és jutalmazás – világos szabályokkal.</em></p>

<hr />
<h2>Napi cél</h2>
<ul>
<li>Megérted a pont/XP mezőket.</li>
<li>Beállítod a kurzusodra illesztve.</li>
</ul>

<hr />
<h2>Alap értékek (példa)</h2>
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

<h2>Mezők jelentése</h2>
<ul>
<li><strong>completionPoints</strong>: pont a kurzus befejezéséért.</li>
<li><strong>lessonPoints</strong>: pont lecke befejezéséért.</li>
<li><strong>perfectCourseBonus</strong>: bónusz, ha mind a 30 nap kész.</li>
<li><strong>completionXP</strong>: XP a teljes kurzusért.</li>
<li><strong>lessonXP</strong>: XP lecke befejezéséért.</li>
</ul>

<hr />
<h2>Gyakorlat (vezetett)</h2>
<p>Nyisd meg a kurzus beállításait, és állítsd be a pont/XP értékeket. Dokumentáld az okot (miért ennyi?).</p>

<h2>Gyakorlat (önálló)</h2>
<p>Hozz létre egy rövid szabályt: mi számít „perfect course” teljesítésnek (pl. minden nap + minden kvíz 100%).</p>

<hr />
<h2>Tipp</h2>
<ul>
<li>Tedd transzparenssé a jutalmazást a leírásban.</li>
<li>Ha emelsz pontot, nézd meg a kvíz nehézségét is.</li>
</ul>`,
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
    content: `<h1>Brand konfiguráció</h1>
<p><em>Minden kurzus brandhez kötött – nélkül nincs publikálás.</em></p>

<hr />
<h2>Napi cél</h2>
<ul>
<li>Megérted, miért kell <code>brandId</code>.</li>
<li>Ellenőrzöd, hogy érvényes brandhez kapcsol a kurzus.</li>
</ul>

<hr />
<h2>Miért fontos?</h2>
<ul>
<li>Stílus/identitás: logó, színek, domain.</li>
<li>Jogosultság: csak engedélyezett domaineken érhető el.</li>
<li>Validáció: érvénytelen brand = hiba.</li>
</ul>

<h2>Alapértelmezés</h2>
<p>Ha nincs megadva, a script létrehozza vagy megtalálja az „Amanoba” brandet (<code>slug: amanoba</code>).</p>

<hr />
<h2>Gyakorlat (vezetett)</h2>
<p>Ellenőrizd a kurzusodat: van <code>brandId</code>? Érvényes? A brand slug/domains megfelel?</p>

<h2>Gyakorlat (önálló)</h2>
<p>Hozz létre egy új brandet tesztelésre (másik logó/szín), és kapcsold rá egy teszt kurzust. Nézd meg a változást a UI-ban.</p>

<hr />
<h2>Tippek</h2>
<ul>
<li>Brand slug legyen egyedi, kisbetűs, kötőjeles.</li>
<li>Ellenőrizd az <code>allowedDomains</code> listát (pl. <code>amanoba.com</code>, <code>localhost</code>).</li>
</ul>`,
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
    content: `<h1>Lecke létrehozása: Alapok</h1>
<p><em>Az első lecke technikai váza: azonosító, nap, cím, tartalom, email.</em></p>

<hr />
<h2>Napi cél</h2>
<ul>
<li>Létrehozol egy leckét az adminban.</li>
<li>Helyes azonosító, nap, cím, tartalom, email mezők.</li>
</ul>

<hr />
<h2>Kötelező mezők</h2>
<ul>
<li><strong>lessonId</strong>: egyedi; ajánlott: <code>{COURSE_ID}_DAY_{DD}</code> (pl. <code>AI_30_NAP_DAY_01</code>).</li>
<li><strong>dayNumber</strong>: 1–30, sorrendben, hézag nélkül.</li>
<li><strong>title</strong>: megjelenik UI-ban és emailben.</li>
<li><strong>content</strong>: HTML/Markdown-ból generált HTML (teljes lecke).</li>
<li><strong>emailSubject</strong>, <strong>emailBody</strong>: tárgy és törzs helyőrzőkkel.</li>
</ul>

<hr />
<h2>Gyakorlat (vezetett)</h2>
<p>Nyisd meg az <code>/{locale}/admin/courses/{COURSE_ID}/lessons/new</code> oldalt, hozz létre az 1. napi leckét szabályos <code>lessonId</code>-val és <code>dayNumber</code>-rel.</p>

<h2>Gyakorlat (önálló)</h2>
<p>Ellenőrizd: a <code>lessonId</code> és <code>dayNumber</code> egyeznek? Van cím? Az email mezőkben vannak helyőrzők?</p>

<hr />
<h2>Prompt minta</h2>
<blockquote>
<p>Készíts lecke-meta draftot. Név: [kurzus]. Nap: [01-30]. Adj lessonId-t <code>{COURSE_ID}_DAY_{DD}</code> formában, címet, emailSubject-et, emailBody-t (helyőrzőkkel: {{courseName}}, {{dayNumber}}, {{lessonTitle}}, {{appUrl}}).</p>
</blockquote>

<hr />
<h2>Tipp</h2>
<ul>
<li>lessonId maradjon végleges – sok hivatkozás épül rá.</li>
<li>dayNumber ne ugráljon; a haladás erre épít.</li>
</ul>`,
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
    content: `<h1>Lecke tartalom struktúra</h1>
<p><em>Átlátható, tanítható blokkok – minden lecke ugyanazt a vázat követi.</em></p>

<hr />
<h2>Napi cél</h2>
<ul>
<li>Egységes, jól tagolt lecke-sablont használsz.</li>
<li>Világos célok, példák, gyakorlatok, tippek.</li>
</ul>

<hr />
<h2>Ajánlott sorrend</h2>
<ol>
<li><strong>Napi cél</strong> – mit ér el a tanuló.</li>
<li><strong>Magyarázat</strong> – rövid, lényegi leírás.</li>
<li><strong>Példák</strong> – 2–3 konkrét példa.</li>
<li><strong>Gyakorlat (vezetett)</strong> – lépésről lépésre.</li>
<li><strong>Gyakorlat (önálló)</strong> – saját esetre alkalmazás.</li>
<li><strong>Tippek</strong> – 3–5 praktikus javaslat.</li>
<li><strong>Opcionális mélyítés</strong> – linkek, további olvasmány.</li>
</ol>

<hr />
<h2>Formátum</h2>
<ul>
<li>Használj címsorokat (<code>&lt;h2&gt;</code>, <code>&lt;h3&gt;</code>), listákat, blockquote-ot.</li>
<li>Ne használj inline stílust; a globális CSS formáz.</li>
<li>Tartsd rövid bekezdésekben, szellős tördeléssel.</li>
</ul>

<hr />
<h2>Gyakorlat (vezetett)</h2>
<p>Vedd az 1. leckét és rendezd át a fenti blokkok szerint (címekkel, listákkal, példákkal).</p>

<h2>Gyakorlat (önálló)</h2>
<p>Készíts egy új szakaszt „Tippek” és „Opcionális mélyítés” címmel, valós linkekkel.</p>

<hr />
<h2>Tipp</h2>
<ul>
<li>Legyen minden blokk rövid, önállóan olvasható.</li>
<li>Minden lecke kövesse ugyanazt a vázat: ez ad profizmust.</li>
</ul>`,
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
    content: `<h1>Email sablonok és helyőrzők</h1>
<p><em>Dinamikus tartalom, helyes helyőrzőkkel, tiszta HTML-ben.</em></p>

<hr />
<h2>Napi cél</h2>
<ul>
<li>Ismered az összes helyőrzőt.</li>
<li>Tiszta, rövid email sablonokat készítesz.</li>
</ul>

<hr />
<h2>Támogatott helyőrzők</h2>
<ul>
<li><code>{{courseName}}</code>, <code>{{dayNumber}}</code>, <code>{{lessonTitle}}</code></li>
<li><code>{{lessonContent}}</code></li>
<li><code>{{appUrl}}</code></li>
<li><code>{{playerName}}</code></li>
</ul>

<h2>Best practice</h2>
<ul>
<li>Rövid tárgy, 1–2 bekezdés, 1 CTA.</li>
<li>Használj helyőrzőt a linkhez: <code>{{appUrl}}/courses/${COURSE_ID}/day/{{dayNumber}}</code>.</li>
<li>Ne használj inline stílust; hagyd a globális stílusokra.</li>
</ul>

<hr />
<h2>Gyakorlat (vezetett)</h2>
<p>Frissíts egy lecke emailSubject/emailBody mezőit, hogy tartalmazza a helyőrzőket és egy CTA linket.</p>

<h2>Gyakorlat (önálló)</h2>
<p>Ellenőrizd a preview-t: helyesen cserélődnek a változók? A link a megfelelő napra mutat?</p>

<hr />
<h2>Tipp</h2>
<ul>
<li>Adj maximum 1 CTA-t – legyen világos, hova kattintson.</li>
<li>Kerüld a nagy képeket; a levél legyen könnyen olvasható.</li>
</ul>`,
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
    content: `<h1>Rich Text Editor használata</h1>
<p><em>Strukturált, olvasható, egységes tartalom – minimális formázással.</em></p>

<hr />
<h2>Napi cél</h2>
<ul>
<li>Megismered a RTE fő funkcióit.</li>
<li>Alkalmazod a helyes szintaxist (címek, listák, linkek, blockquote).</li>
</ul>

<hr />
<h2>Funkciók</h2>
<ul>
<li>Címsorok (H1–H3), félkövér, dőlt.</li>
<li>Listák (számozott, számozatlan).</li>
<li>Linkek, idézet (blockquote), kódblokkok.</li>
</ul>

<h2>Best practice</h2>
<ul>
<li>Használj egységes címhierarchiát (H1 a lecke cím, H2 a szekciók).</li>
<li>Nincs inline stílus; bízd a globális CSS-re.</li>
<li>Rövid bekezdések, whitespace a könnyű olvasásért.</li>
</ul>

<hr />
<h2>Gyakorlat (vezetett)</h2>
<p>Nyisd meg egy leckédet, és formázd: H2 címek, bullet listák, egy blockquote, egy link.</p>

<h2>Gyakorlat (önálló)</h2>
<p>Nézd meg az előnézetet a lecke megjelenítőben: nincs-e túl hosszú bekezdés, működnek-e a linkek?</p>

<hr />
<h2>Tipp</h2>
<ul>
<li>Használj Markdown → HTML konverziót, ha kényelmesebb (editor támogatja).</li>
<li>Kerüld a táblázatot, ha egyszerű listával is megoldható.</li>
</ul>`,
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
    content: `<h1>30 lecke létrehozása: Terv és struktúra</h1>
<p><em>Fázisokra bontott 30 napos váz, előre megírt címekkel.</em></p>

<hr />
<h2>Napi cél</h2>
<ul>
<li>Megtervezed a 30 napos ívet fázisokra bontva.</li>
<li>Előre megadod a napi címeket/fozó témákat.</li>
</ul>

<hr />
<h2>Tervezési lépések</h2>
<ol>
<li><strong>Kurzus cél</strong>: mit ér el a tanuló?</li>
<li><strong>Tanulási célok</strong>: készségek, kimenetek.</li>
<li><strong>Fázisok</strong>: pl. 1–5 alap, 6–10 tartalom/struktúra, 11–15 quiz, 16–20 minőség/stílus, 21–25 közzététel/teszt, 26–30 karbantartás/iteráció.</li>
<li><strong>Napi címek</strong>: 30 napra előre.</li>
</ol>

<hr />
<h2>Gyakorlat (vezetett)</h2>
<p>Készíts egy táblázatot: Nap (1–30) + Cím + Fázis. Töltsd ki mind a 30 sort.</p>

<h2>Gyakorlat (önálló)</h2>
<p>Azonosítsd a „kritikus napokat” (pl. quiz beállítás, email sablon, publikálás) és jelöld ki kiemeltként.</p>

<hr />
<h2>Prompt minta</h2>
<blockquote>
<p>Adj 30 napos kurzusvázat fázisokra bontva. Struktúra: Nap, Cím, Fázis. Fázisok: [fázisok listája]. Adj rövid (1 soros) fókuszt minden naphoz.</p>
</blockquote>

<hr />
<h2>Tipp</h2>
<ul>
<li>A jó váz minimalizálja a későbbi átírást.</li>
<li>Később a címet finomíthatod, de legyen meg a fókusz minden napra.</li>
</ul>`,
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
    content: `<h1>Quiz értékelések: Bevezetés</h1>
<p><em>Mit jelent a quizConfig, és hogyan állítsd be biztonságosan?</em></p>

<hr />
<h2>Napi cél</h2>
<ul>
<li>Megérted a quizConfig mezőket.</li>
<li>Tudod, mikor és hogyan engedélyezd a kvízt.</li>
</ul>

<hr />
<h2>Quiz konfiguráció</h2>
<pre><code>{
  "quizConfig": {
    "enabled": true,
    "successThreshold": 100,
    "questionCount": 5,
    "poolSize": 15,
    "required": true
  }
}</code></pre>

<h3>Mezők</h3>
<ul>
<li><strong>enabled</strong>: legyen-e kvíz.</li>
<li><strong>successThreshold</strong>: elvárt %-os pont (100 = mind helyes).</li>
<li><strong>questionCount</strong>: hány kérdés látszik (ajánlott 5).</li>
<li><strong>poolSize</strong>: teljes kérdéskészlet (ajánlott 15).</li>
<li><strong>required</strong>: kötelező-e a lecke befejezéséhez.</li>
</ul>

<hr />
<h2>Gyakorlat (vezetett)</h2>
<p>Nyisd meg egy leckét az adminban, kapcsold be a kvízt, állítsd be: 5 kérdés, pool 15, threshold 100%, required = true.</p>

<h2>Gyakorlat (önálló)</h2>
<p>Ellenőrizd egy másik lecke beállítását, dokumentáld az eltéréseket, és igazítsd az ajánlott értékekhez.</p>

<hr />
<h2>Tipp</h2>
<ul>
<li>100% threshold → tanulás fókusz, ne büntetés.</li>
<li>Ha kevés kérdésed van, a <code>questionCount</code> legyen &le; poolSize.</li>
</ul>`,
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
    content: `<h1>Quiz kérdések létrehozása</h1>
<p><em>Valós, tartalom-alapú kérdések, egyértelmű válaszokkal.</em></p>

<hr />
<h2>Napi cél</h2>
<ul>
<li>Összeállítasz min. 15 releváns kérdést a leckéhez.</li>
<li>Helyes struktúrával (kérdés, 4 opció, 1 helyes).</li>
</ul>

<hr />
<h2>Lépések</h2>
<ol>
<li>Lecke szerkesztő → „Quiz / Értékelés” bekapcsolása.</li>
<li>Beállítások: threshold/kérdésszám/pool.</li>
<li>„Quiz Kérdések Kezelése” → 15 kérdés felvétele.</li>
</ol>

<h3>Kérdés struktúra</h3>
<ul>
<li>Kérdés: konkrét, félreérthetetlen.</li>
<li>4 opció, 1 helyes.</li>
<li>Helyes index: 0–3.</li>
<li>Nehézség: EASY/MEDIUM/HARD keverve.</li>
<li>Kategória: Course Specific.</li>
</ul>

<hr />
<h2>Gyakorlat (vezetett)</h2>
<p>Készíts 15 kérdést a 6. napi lecke tartalmára. Mind tartalmi, ne legyen „válasz opciója” típusú dummy.</p>

<h2>Gyakorlat (önálló)</h2>
<p>Ellenőrizd: nincs ismétlődés, minden válasz egyedi, helyes index rendben.</p>

<hr />
<h2>Tipp</h2>
<ul>
<li>Teszteld: tényleg a lecke megértését méri?</li>
<li>Dokumentáld a kérdéskészlet forrását (melyik szakaszt fedi).</li>
</ul>`,
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
    content: `<h1>Quiz konfiguráció ajánlott gyakorlatai</h1>
<p><em>Stabil beállítások, kiegyensúlyozott kérdéskészlet.</em></p>

<hr />
<h2>Napi cél</h2>
<ul>
<li>Alkalmazod az ajánlott quizConfig-et.</li>
<li>Összeállítasz kiegyensúlyozott kérdéskészletet.</li>
</ul>

<hr />
<h2>Ajánlott beállítás</h2>
<ul>
<li>questionCount: 5</li>
<li>poolSize: 15</li>
<li>successThreshold: 100</li>
<li>required: true</li>
</ul>

<h2>Kérdéskészlet elvek</h2>
<ul>
<li>Fedi a lecke kulcspontjait.</li>
<li>Nehézség keverve (E/M/H).</li>
<li>Egyértelmű kérdés + egy helyes válasz.</li>
<li>Megértést mér, nem bemagolást.</li>
</ul>

<hr />
<h2>Gyakorlat (vezetett)</h2>
<p>Állítsd be a 6–10. lecke kvízeit az ajánlott értékekre. Ellenőrizd, hogy questionCount &le; poolSize.</p>

<h2>Gyakorlat (önálló)</h2>
<p>Nézz meg 5 kérdést: mind releváns? Ha nem, cseréld ki a leképezett tartalom alapján.</p>

<hr />
<h2>Tipp</h2>
<ul>
<li>Ha kevés a tartalom, csökkentsd a poolSize-t, de legyen tartalmi fedés.</li>
<li>A 100% küszöb támogatja a tanulást – legyen támogató feedback.</li>
</ul>`,
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
    content: `<h1>Quiz kérdések szerkesztése és törlése</h1>
<p><em>Higiénia: rossz kérdések javítása, duplikátumok törlése.</em></p>

<hr />
<h2>Napi cél</h2>
<ul>
<li>Tudod javítani a kérdés szövegét/opcióit/helyes válaszát.</li>
<li>Tudsz törölni irreleváns vagy hibás kérdéseket.</li>
</ul>

<hr />
<h2>Szerkesztés lépései</h2>
<ol>
<li>„Quiz Kérdések Kezelése” modal.</li>
<li>Szerkesztés → szöveg/opciók/helyes index frissítése.</li>
<li>Mentés, majd teszt egy próbafeladvánnyal.</li>
<li>Nehézség/kategória felülvizsgálata (Course Specific).</li>
</ol>

<h2>Törlés</h2>
<ol>
<li>„Quiz Kérdések Kezelése” modal.</li>
<li>Törlés a kérdésnél → megerősítés.</li>
<li>Pool méret ellenőrzése (maradjon ≥ questionCount).</li>
</ol>

<hr />
<h2>Gyakorlat (vezetett)</h2>
<p>Keresd meg a gyenge kérdéseket (általános, nem lecke-fókuszú), javítsd vagy töröld, pótold releváns kérdéssel.</p>

<h2>Gyakorlat (önálló)</h2>
<p>Ellenőrizd, hogy a pool mérete és a questionCount összhangban maradt-e. Teszteld egy tanulói próbával.</p>

<hr />
<h2>Tipp</h2>
<ul>
<li>Ha változik a lecke, frissítsd a kérdéseket is.</li>
<li>Mindig nézd a helyes indexet mentés előtt.</li>
</ul>`,
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
    content: `<h1>Quiz tesztelés: Tanulói nézet</h1>
<p><em>Valódi felhasználói élmény ellenőrzése: megjelenés, működés, retake.</em></p>

<hr />
<h2>Napi cél</h2>
<ul>
<li>Végigviszed a kvízt tanulói nézetben.</li>
<li>Ellenőrzöd a kérdések helyességét és a retake viselkedést.</li>
</ul>

<hr />
<h2>Teszt lépések</h2>
<ol>
<li>Nyisd meg a lecke tanulói nézetét.</li>
<li>Ellenőrizd, hogy a quiz megjelenik.</li>
<li>Töltsd ki a kérdéseket, figyeld az eredményt.</li>
<li>Próbáld ki a retake-et (fail → újrapróba): ugyanaz-e a pool, random-e a sorrend?</li>
</ol>

<hr />
<h2>Gyakorlat (vezetett)</h2>
<p>Futtasd végig a 6–10. nap kvízeit. Írd fel: volt-e rossz kérdés/hibás index, működött-e a retake.</p>

<h2>Gyakorlat (önálló)</h2>
<p>Ha hibát találsz, javítsd a kérdést, majd futtasd újra a tesztet.</p>

<hr />
<h2>Tipp</h2>
<ul>
<li>Nézd a kérdéskiválasztás randomitását: ne mindig ugyanaz az 5 jöjjön.</li>
<li>Feedback legyen támogató, ne büntető.</li>
</ul>`,
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
    content: `<h1>Kurzus publikálása</h1>
<p><em>Aktiválás, láthatóság, ellenőrző lépések.</em></p>

<hr />
<h2>Napi cél</h2>
<ul>
<li>Aktiválod a kurzust és a leckéket.</li>
<li>Ellenőrzöd a láthatósági feltételeket.</li>
</ul>

<hr />
<h2>Aktiválási lépések</h2>
<ol>
<li><strong>Kurzus aktiválása</strong>: <code>isActive = true</code> a kurzuson.</li>
<li><strong>Leckék ellenőrzése</strong>: mind a 30 lecke <code>isActive = true</code>.</li>
<li><strong>Brand</strong>: érvényes <code>brandId</code> hivatkozás.</li>
</ol>

<h2>Láthatósági követelmények</h2>
<ul>
<li>✅ <code>Course.isActive = true</code></li>
<li>✅ <code>Course.requiresPremium = false</code> (vagy tanuló prémium)</li>
<li>✅ Legalább egy <code>Lesson.isActive = true</code></li>
<li>✅ Érvényes <code>brandId</code></li>
</ul>

<hr />
<h2>Gyakorlat (vezetett)</h2>
<p>Aktiváld a kurzust és leckéket, majd nézd meg a <code>/courses</code> listában. Ellenőrizd az API-t is: <code>/api/courses?status=active</code>.</p>

<h2>Gyakorlat (önálló)</h2>
<p>Állítsd be ideiglenesen <code>requiresPremium = true</code>, majd vissza <code>false</code>-ra, és nézd meg a láthatóság változását.</p>

<hr />
<h2>Tipp</h2>
<ul>
<li>Ha nem látható: ellenőrizd a brandId-t és az isActive státuszokat.</li>
<li>Teszteld incognito ablakban is.</li>
</ul>`,
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
    content: `<h1>Beiratkozás és lecke hozzáférés tesztelése</h1>
<p><em>API + UI teszt, hogy a tanuló valóban be tud lépni és olvasni.</em></p>

<hr />
<h2>Napi cél</h2>
<ul>
<li>Teszteled az enroll flow-t (API és UI).</li>
<li>Ellenőrzöd az első lecke elérhetőségét.</li>
</ul>

<hr />
<h2>Teszt beiratkozás</h2>
<p><strong>API</strong>: <code>POST /api/courses/{courseId}/enroll</code><br>
<strong>UI</strong>: <code>/{locale}/courses/{courseId}</code> → „Beiratkozás”</p>

<h2>Lecke hozzáférés</h2>
<p><strong>API</strong>: <code>GET /api/courses/{courseId}/day/{dayNumber}</code><br>
<strong>UI</strong>: <code>/{locale}/courses/{courseId}/day/1</code></p>

<hr />
<h2>Gyakorlat (vezetett)</h2>
<p>Iratkozz be a kurzusodra UI-n, majd nyisd meg az 1. napot. Jegyezd fel, ha 401/403/404 jön.</p>

<h2>Gyakorlat (önálló)</h2>
<p>Próbáld meg API-ból is (curl vagy API client), ellenőrizd a response-okat, és hasonlítsd a UI viselkedéshez.</p>

<hr />
<h2>Tipp</h2>
<ul>
<li>Ha 403: nézd meg a prémium flag-et vagy az auth state-et.</li>
<li>Ha 404: ellenőrizd a lesson dayNumber-t és isActive-t.</li>
</ul>`,
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
    content: `<h1>Email kézbesítés tesztelése</h1>
<p><em>Manual dev trigger + éles cron, duplikációk elkerülése.</em></p>

<hr />
<h2>Napi cél</h2>
<ul>
<li>Manuálisan lefuttatod dev-ben a napi emaileket.</li>
<li>Éles cron beállítást ellenőrzöd.</li>
</ul>

<hr />
<h2>Fejlesztési mód</h2>
<p><strong>Manuális indítás</strong>: <code>GET /api/cron/send-daily-lessons</code> (dev-ben auth nélkül).</p>

<h2>Éles mód</h2>
<p><strong>Cron végpont</strong>: <code>POST /api/cron/send-daily-lessons</code><br>
<strong>Header</strong>: <code>Authorization: Bearer &lt;CRON_SECRET&gt;</code></p>

<h2>Ütemezés logika</h2>
<ul>
<li><code>CourseProgress.currentDay</code> határozza meg a napot.</li>
<li><code>CourseProgress.emailSentDays</code> védi a duplikációt.</li>
<li>Időzóna + preferált idő (email beállításokból).</li>
</ul>

<hr />
<h2>Gyakorlat (vezetett)</h2>
<p>Dev-ben futtasd a GET cron végpontot, nézd meg a logot/konzolt, érkezett-e email a teszt usernek.</p>

<h2>Gyakorlat (önálló)</h2>
<p>Élesnél ellenőrizd a Vercel cron beállítást, és egy napig figyeld a kézbesítési logokat. Jelöld, ha duplázódik.</p>

<hr />
<h2>Tipp</h2>
<ul>
<li>Ha nem érkezik email: ellenőrizd a CRON_SECRET-et és a Resend kulcsokat.</li>
<li>Fejlesztéskor használj teszt címeket, ne éles usert.</li>
</ul>`,
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
    content: `<h1>Hibakeresés: Gyakori problémák</h1>
<p><em>Láthatóság, elérés, tipikus hibák gyors diagnózisa.</em></p>

<hr />
<h2>Napi cél</h2>
<ul>
<li>Ismersz 2–3 tipikus hibát és a javításukat.</li>
<li>Tudod, milyen API/DB pontokat ellenőrizz.</li>
</ul>

<hr />
<h2>Kurzus nem látható</h2>
<p><strong>Tünet</strong>: kurzus létezik, de nincs a <code>/courses</code> listában.</p>
<p><strong>Lépések</strong>:</p>
<ol>
<li><code>Course.isActive = true</code>.</li>
<li><code>requiresPremium</code> ellenőrzése.</li>
<li>API: <code>/api/courses?status=active</code>.</li>
<li>Konzol/Network hibák.</li>
<li><code>brandId</code> érvényes?</li>
</ol>

<h2>Leckék 404</h2>
<p><strong>Tünet</strong>: kurzus látható, de a lecke 404.</p>
<p><strong>Lépések</strong>:</p>
<ol>
<li><code>dayNumber</code> 1–30, nincs hézag.</li>
<li><code>Lesson.isActive = true</code>.</li>
<li><code>courseId</code> pontos egyezés (case sensitive).</li>
</ol>

<hr />
<h2>Gyakorlat (vezetett)</h2>
<p>Szimulálj egy hibát (pl. kapcsold ki egy lecke isActive-ját), nézd meg a tünetet, majd javítsd.</p>

<h2>Gyakorlat (önálló)</h2>
<p>Írj egy rövid „troubleshooting” jegyzetet: hiba, tünet, lépések, fix.</p>

<hr />
<h2>Tipp</h2>
<ul>
<li>Mindig nézd az API válaszokat (status code, payload).</li>
<li>Case-sensitive mezőknél figyelj az ID-kra.</li>
</ul>`,
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
    content: `<h1>Gyors ellenőrzőlista</h1>
<p><em>Publikálás előtti végső checklist.</em></p>

<hr />
<h2>Napi cél</h2>
<ul>
<li>Végigmész a publikálás előtti listán.</li>
<li>Javítasz minden blokkot, ami hiányzik.</li>
</ul>

<hr />
<h2>Ellenőrzőlista</h2>
<ul>
<li>[ ] Érvényes, egyedi <code>courseId</code> (nagybetű).</li>
<li>[ ] 30 lecke, 1–30, nincs hézag.</li>
<li>[ ] Minden lecke <code>isActive = true</code>.</li>
<li>[ ] Kurzus <code>isActive = true</code>.</li>
<li>[ ] Érvényes <code>brandId</code>.</li>
<li>[ ] Email sablonok helyőrzőket használnak.</li>
<li>[ ] Tartalom formázva (címek, listák).</li>
<li>[ ] Kurzus látszik a <code>/courses</code> listán.</li>
<li>[ ] Beiratkozás működik (API/UI).</li>
<li>[ ] 1. nap elérhető.</li>
<li>[ ] Email kézbesítés tesztelve.</li>
</ul>

<hr />
<h2>Gyakorlat (vezetett)</h2>
<p>Végig a listán, pipáld ki, ami kész. Amit nem tudsz kipipálni, dokumentáld a teendőt.</p>

<h2>Gyakorlat (önálló)</h2>
<p>Kérj valakit, hogy incognito módban tesztelje a kurzust és jelezze, ha valami hiányzik.</p>

<hr />
<h2>Tipp</h2>
<ul>
<li>Készíts belső „go-live” dokumentumot ezzel a listával.</li>
<li>Frissítsd, ha változik a folyamat.</li>
</ul>`,
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
    content: `<h1>Seed script használata</h1>
<p><em>Gyors, verziózott, ismételhető kurzus-feltöltés.</em></p>

<hr />
<h2>Napi cél</h2>
<ul>
<li>Megérted a seed script felépítését.</li>
<li>Tudod futtatni és módosítani a saját kurzusodra.</li>
</ul>

<hr />
<h2>Előnyök</h2>
<ul>
<li>Gyorsabb, mint a manuális UI.</li>
<li>Verziózott (git), visszakereshető.</li>
<li>Ismételhető, idempotens futások.</li>
<li>30 lecke egy helyen.</li>
</ul>

<h2>Struktúra</h2>
<p><strong>Fájl</strong>: <code>scripts/seed-{kurzus-nev}.ts</code><br>
<strong>Használat</strong>: <code>npm run seed:{kurzus-nev}</code></p>

<h3>Példa</h3>
<pre><code>const lessonPlan = [
  { day: 1, title: 'Lecke címe', content: '&lt;h2&gt;...&lt;/h2&gt;', emailSubject: '...', emailBody: '...' },
  // ... további 29
];</code></pre>

<hr />
<h2>Gyakorlat (vezetett)</h2>
<p>Nézd meg a <code>scripts/seed-ai-30-nap-course.ts</code> fájlt: hogyan épül fel a <code>lessonPlan</code>, a <code>quizConfig</code>, és a brand/course beállítás.</p>

<h2>Gyakorlat (önálló)</h2>
<p>Másold ki, készíts saját seedet (<code>seed-{sajat}.ts</code>), módosítsd a courseId-t, címeket, tartalmakat, majd futtasd <code>npm run seed:{sajat}</code>.</p>

<hr />
<h2>Tipp</h2>
<ul>
<li>Tartsd a seedet naprakészen, hogy UI-törlés/rollback esetén gyorsan újratölthesd.</li>
<li>Ne keverj dummy kérdéseket a seedbe.</li>
</ul>`,
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
    content: `<h1>Metadata használata</h1>
<p><em>Strukturált plusz információk: célok, címkék, idő, nehézség.</em></p>

<hr />
<h2>Napi cél</h2>
<ul>
<li>Kitöltöd a metadata mezőt minden leckén.</li>
<li>Használsz címkéket és becsléseket a szűréshez.</li>
</ul>

<hr />
<h2>Mit tárolj?</h2>
<ul>
<li>estimatedMinutes</li>
<li>difficulty</li>
<li>tags (szűréshez)</li>
<li>learningObjectives</li>
<li>prerequisites</li>
</ul>

<h3>Példa</h3>
<pre><code>{
  "estimatedMinutes": 10,
  "difficulty": "beginner",
  "tags": ["ai", "basics", "daily-practice"],
  "learningObjectives": ["..."],
  "prerequisites": ["..."]
}</code></pre>

<hr />
<h2>Gyakorlat (vezetett)</h2>
<p>Frissíts 3 leckét: adj estimatedMinutes, difficulty-t, 3-5 tag-et, és 2-3 learning objective-et.</p>

<h2>Gyakorlat (önálló)</h2>
<p>Állíts be globális címketaxót (pl. „quiz”, „email”, „publikálás”) és használd következetesen.</p>

<hr />
<h2>Tipp</h2>
<ul>
<li>Címkézz következetesen, később a keresésben segít.</li>
<li>A becsült idő segít a tanulóknak tervezni.</li>
</ul>`,
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
    content: `<h1>Lecke elnevezés és konvenciók</h1>
<p><em>Konzisztens lessonId és címek, hogy kereshető és érthető legyen.</em></p>

<hr />
<h2>Napi cél</h2>
<ul>
<li>Egységes lessonId és cím konvenciókat alkalmazol.</li>
<li>Címek rövidek, de leíróak.</li>
</ul>

<hr />
<h2>Szabályok</h2>
<ul>
<li><code>lessonId</code>: <code>{COURSE_ID}_DAY_{DD}</code>.</li>
<li>Cím: tömör, nap fókuszt jelzi.</li>
<li>Email tárgyban szerepeljen a nap szám.</li>
</ul>

<h2>Szakaszolás</h2>
<ul>
<li>1–5: alapok</li>
<li>6–10: struktúra/tartalom</li>
<li>11–15: quiz</li>
<li>16–20: publikálás/teszt</li>
<li>21–25: haladó/automatizálás</li>
<li>26–30: zárás/karbantartás</li>
</ul>

<hr />
<h2>Gyakorlat (vezetett)</h2>
<p>Nézd át a lessonId-kat és címeket: következetesek? Javítsd, ha eltér.</p>

<h2>Gyakorlat (önálló)</h2>
<p>Finomítsd a címeket, hogy a tanuló azonnal értse a fókuszt (pl. „Quiz tesztelés: tanulói nézet”).</p>

<hr />
<h2>Tipp</h2>
<ul>
<li>A jó cím segíti a navigációt és a kommunikációt (email tárgy).</li>
<li>Használj fázisnév + konkrét téma kombinációt.</li>
</ul>`,
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
    content: `<h1>Email sablon ajánlott gyakorlatai</h1>
<p><em>Rövid, személyre szabott, egy CTA, tiszta tárgy.</em></p>

<hr />
<h2>Napi cél</h2>
<ul>
<li>Optimalizálod a lecke emaileket.</li>
<li>Személyre szabás + világos CTA.</li>
</ul>

<hr />
<h2>Gyakorlatok</h2>
<ol>
<li><strong>Személyre szabás</strong>: <code>{{playerName}}</code>, <code>{{courseName}}</code>.</li>
<li><strong>Link</strong>: mindig a teljes lecke (<code>{{appUrl}}/courses/${COURSE_ID}/day/{{dayNumber}}</code>).</li>
<li><strong>Előnézet</strong>: rövid teaser a törzsben.</li>
<li><strong>Tárgy</strong>: &lt;60 karakter, tartalmazza a nap számát, CTA jellegű.</li>
</ol>

<hr />
<h2>Gyakorlat (vezetett)</h2>
<p>Válassz 3 lecke emailt: tedd személyre szabottá, rövidítsd, adj egyetlen CTA-t.</p>

<h2>Gyakorlat (önálló)</h2>
<p>Teszt küldés: nézd meg mobilon és asztalin, jól tördelődik-e, a link jó helyre mutat-e.</p>

<hr />
<h2>Tipp</h2>
<ul>
<li>Kerüld a több CTA-t; egy fő cselekvés elég.</li>
<li>Legyen világos, mit kap, ha kattint.</li>
</ul>`,
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
    content: `<h1>Kurzus fázisok tervezése</h1>
<p><em>5 napos blokkok, világos fókusz, előre látható ív.</em></p>

<hr />
<h2>Napi cél</h2>
<ul>
<li>Megtervezed a 30 nap fázisait.</li>
<li>Minden fázishoz fókusz és napcímek.</li>
</ul>

<hr />
<h2>Fázis példa (AI_30_NAP)</h2>
<ul>
<li>1–5: alapok, szemlélet.</li>
<li>6–10: napi munka, struktúra.</li>
<li>11–15: quiz.</li>
<li>16–20: publikálás/teszt.</li>
<li>21–25: haladó/automatizálás.</li>
<li>26–30: karbantartás/zárás.</li>
</ul>

<hr />
<h2>Gyakorlat (vezetett)</h2>
<p>Készíts fázislistát 5 napos blokkokkal, mindhez 1–2 fókuszponttal.</p>

<h2>Gyakorlat (önálló)</h2>
<p>Írd mellé a napcímeket is (30 napra), hogy lásd a teljes ívet.</p>

<hr />
<h2>Tipp</h2>
<ul>
<li>A fázisok segítségével következetes tempót tartasz.</li>
<li>Könnyebb így újraválogatni napokat, ha módosítasz.</li>
</ul>`,
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
    content: `<h1>Kurzus optimalizálása</h1>
<p><em>Minőségjavítás: tartalom, gyakorlat, email, kvíz.</em></p>

<hr />
<h2>Napi cél</h2>
<ul>
<li>Feltárod a gyenge pontokat (tartalom, gyakorlat, email, kvíz).</li>
<li>Írsz egy gyors optimalizációs tervet.</li>
</ul>

<hr />
<h2>Fókuszterületek</h2>
<ul>
<li><strong>Tartalom</strong>: tiszta, érthető, akcióra ösztönző.</li>
<li><strong>Gyakorlat</strong>: releváns, mérhető kimenettel.</li>
<li><strong>Email</strong>: személyre szabott, rövid, 1 CTA.</li>
<li><strong>Kvíz</strong>: tartalomra épül, egyértelmű válasz.</li>
</ul>

<hr />
<h2>Gyakorlat (vezetett)</h2>
<p>Válassz 1–2 lecke-t: javítsd a szöveg tömörségét, adj jobb példát, finomítsd a CTA-t az emailben, cseréld a gyenge kvízkérdést.</p>

<h2>Gyakorlat (önálló)</h2>
<p>Készíts 3 pontos optimalizációs listát (mit, mikor, ki), és tedd a karbantartási backlogba.</p>

<hr />
<h2>Tipp</h2>
<ul>
<li>Kezdd a legnagyobb hatású elemmel (kvíz vagy gyakorlat).</li>
<li>Használj A/B-t: előtte/utána példák.</li>
</ul>`,
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
    content: `<h1>Kurzus dokumentáció</h1>
<p><em>Átlátható leírás, előfeltétel, célok, struktúra.</em></p>

<hr />
<h2>Napi cél</h2>
<ul>
<li>Összerakod a kurzus dokumentációját.</li>
<li>Világos a cél, előfeltétel, tanulási eredmény, struktúra.</li>
</ul>

<hr />
<h2>Dokumentáció tartalom</h2>
<ul>
<li>Kurzus leírás: mit ér el a tanuló?</li>
<li>Előfeltételek.</li>
<li>Tanulási célok/kimenetek.</li>
<li>Struktúra: fázisok, napok.</li>
</ul>

<hr />
<h2>Gyakorlat (vezetett)</h2>
<p>Készíts egy összefoglaló doksit (1–2 oldal): cél, előfeltétel, tanulási célok, fázis/nap bontás.</p>

<h2>Gyakorlat (önálló)</h2>
<p>Adj hozzá egy „FAQ” részt (4–5 kérdés/ válasz), tipikus tanulói kérdésekre.</p>

<hr />
<h2>Tipp</h2>
<ul>
<li>Doksi legyen élő: frissítsd változáskor.</li>
<li>Használd belső megosztáshoz és támogatáshoz.</li>
</ul>`,
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
    content: `<h1>Kurzus karbantartása</h1>
<p><em>Rendszeres frissítés: tartalom, kvíz, email, linkek.</em></p>

<hr />
<h2>Napi cél</h2>
<ul>
<li>Karbantartási ritmust állítasz be.</li>
<li>Listázod a rendszeres feladatokat.</li>
</ul>

<hr />
<h2>Karbantartási feladatok</h2>
<ul>
<li>Frissítések: új info, változás a folyamatban.</li>
<li>Hibajavítás: typo, link, formázás.</li>
<li>Kvíz: kérdések frissítése, új kérdések.</li>
<li>Email: tárgy/törzs finomítása.</li>
</ul>

<hr />
<h2>Gyakorlat (vezetett)</h2>
<p>Készíts havi karbantartási listát: mit, ki, mikor (pl. hónap első hete: link audit, kvíz QA, email rövidítés).</p>

<h2>Gyakorlat (önálló)</h2>
<p>Jelöld meg a következő sprintre 3 karbantartási feladatot a backlogban.</p>

<hr />
<h2>Tipp</h2>
<ul>
<li>Kicsi, gyakori frissítések elég; ne várj nagy release-re.</li>
<li>Vezess changelogot (mit, mikor, miért).</li>
</ul>`,
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
    content: `<h1>Kurzus elemzése és visszajelzés</h1>
<p><em>Mit mérj, hogyan gyűjts visszajelzést, és hova írd.</em></p>

<hr />
<h2>Napi cél</h2>
<ul>
<li>Összerakod az alap mérőszámokat.</li>
<li>Beállítasz egy visszajelzési csatornát.</li>
</ul>

<hr />
<h2>Mérőszámok</h2>
<ul>
<li>Tanulói haladás: befejezési arány.</li>
<li>Lecke teljesítés: mely napok esnek ki.</li>
<li>Kvíz eredmény: legnehezebb kérdések.</li>
<li>Email: nyitási/kattintási arány.</li>
</ul>

<h2>Visszajelzés</h2>
<ul>
<li>Tanulói űrlap vagy rövid kérdőív.</li>
<li>Kvíz eredmények elemzése.</li>
<li>Email statisztika.</li>
</ul>

<hr />
<h2>Gyakorlat (vezetett)</h2>
<p>Készíts egy mérőszám-listát: mit, hol nézed (pl. admin dashboard, email szolgáltató), milyen gyakran.</p>

<h2>Gyakorlat (önálló)</h2>
<p>Készíts egy 5 kérdéses visszajelző űrlapot, és illeszd be a kurzus végére/emailbe.</p>

<hr />
<h2>Tipp</h2>
<ul>
<li>Fókuszálj kevés, hasznos mérőszámra (pl. drop-off napok).</li>
<li>Jegyezd fel a tanulságokat és a következő lépéseket (iteráció).</li>
</ul>`,
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
    content: `<h1>Zárás: Merre tovább?</h1>
<p><em>Összegzés, alkalmazás, iteráció, megosztás.</em></p>

<hr />
<h2>Napi cél</h2>
<ul>
<li>Összegzed a tanultakat.</li>
<li>Kijelölsz következő lépéseket és iterációkat.</li>
</ul>

<hr />
<h2>Mit tanultál?</h2>
<ul>
<li>Modell, lecke, kvíz, publikálás, email, seed, optimalizálás.</li>
</ul>

<h2>Merre tovább?</h2>
<ol>
<li><strong>Hozz létre saját kurzust</strong> – alkalmazd a tanultakat.</li>
<li><strong>Oszd meg</strong> – tanítsd meg másnak, kérj feedbacket.</li>
<li><strong>Iterálj</strong> – tartsd karban, mérj, fejlessz.</li>
</ol>

<hr />
<h2>Gyakorlat (vezetett)</h2>
<p>Írj 3 tanulságot, 3 alkalmazási feladatot, 3 fejlesztési lépést (következő 4 hétre), és készíts egy mini roadmapet.</p>

<h2>Gyakorlat (önálló)</h2>
<p>Oszd meg a roadmapet a csapattal, kérj visszajelzést, és időzítsd be a következő iterációt.</p>

<hr />
<h2>Köszönjük!</h2>
<p>Köszönjük, hogy végigcsináltad! 🚀</p>`,
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
const curatedQuestions: Record<
  number,
  Array<{
    question: string;
    options: string[];
    correctIndex: number;
    difficulty: QuestionDifficulty;
    category: string;
  }>
> = {
  1: [
    {
      question: 'Melyik a három fő modell az Amanoba kurzusrendszerben?',
      options: [
        'Course, Lesson, CourseProgress',
        'User, Payment, Invoice',
        'BlogPost, Comment, Tag',
        'Storage, CDN, Cache'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: 'Course Specific'
    },
    {
      question: 'Mit kell publikáláshoz bekapcsolni?',
      options: [
        'Course.isActive ÉS minden Lesson.isActive',
        'Csak a Course.isActive',
        'Csak a Lesson.isActive az első napon',
        'Semmit, automatikus'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.MEDIUM,
      category: 'Course Specific'
    },
    {
      question: 'Hány napos a standard kurzus struktúra?',
      options: ['30 nap, napi 1 lecke', '7 nap, napi 3 lecke', '14 nap, heti 2 lecke', 'Nincs fix szám'],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: 'Course Specific'
    },
    {
      question: 'Mi küldi ki a napi leckéket emailben?',
      options: [
        'Automatikus cron + Resend',
        'Manuális admin jóváhagyás',
        'Felhasználói kérés',
        'Nincs emailküldés'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.MEDIUM,
      category: 'Course Specific'
    },
    {
      question: 'Hol látod az összes kurzust az adminban?',
      options: [
        '/{locale}/admin/courses',
        '/{locale}/admin/settings',
        '/{locale}/courses',
        '/api/courses'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: 'Course Specific'
    },
    {
      question: 'Mit tárol a CourseProgress modell?',
      options: [
        'Aktuális nap, befejezett leckék, státusz',
        'Csak a felhasználó nevét',
        'Csak a kurzus leírását',
        'Csak a fizetési adatokat'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.MEDIUM,
      category: 'Course Specific'
    },
    {
      question: 'Mi történik, ha a Lesson.isActive = false?',
      options: [
        'Nem publikálódik és nem megy ki emailben',
        'Csak késleltetve megy ki',
        'Duplán megy ki',
        'Semmi hatása'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.HARD,
      category: 'Course Specific'
    }
  ],
  2: [
    {
      question: 'Melyik változó kell az adatbázis kapcsolathoz?',
      options: ['MONGODB_URI', 'DATABASE_SQL', 'REDIS_URL', 'FIREBASE_KEY'],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: 'Course Specific'
    },
    {
      question: 'Mi kell az emailküldéshez?',
      options: [
        'RESEND_API_KEY, EMAIL_FROM, EMAIL_REPLY_TO, NEXT_PUBLIC_APP_URL',
        'SMTP_USER, de semmi más',
        'Csak egy Gmail fiók',
        'Semmi, az email nem támogatott'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.MEDIUM,
      category: 'Course Specific'
    },
    {
      question: 'Mi a cron feladata?',
      options: [
        'POST /api/cron/send-daily-lessons végrehajtása napi levelekhez',
        'Felhasználók törlése',
        'Brand frissítése',
        'Képek optimalizálása'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.MEDIUM,
      category: 'Course Specific'
    },
    {
      question: 'Hol ellenőrzöd az admin hozzáférést?',
      options: [
        '/{locale}/admin',
        '/{locale}/signin',
        '/{locale}/dashboard',
        '/{locale}/courses'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: 'Course Specific'
    },
    {
      question: 'Mit teszel, ha egy előfeltétel hiányzik?',
      options: [
        'Dokumentálod, felelőst és határidőt rendelsz',
        'Kihagyod és tovább mész',
        'Törlöd a kurzust',
        'Kikapcsolod az összes cron-t'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.MEDIUM,
      category: 'Course Specific'
    }
  ],
  3: [
    {
      question: 'Milyen formátumú lehet a courseId?',
      options: [
        'Csak nagybetű, szám, aláhúzás (pl. AI_30_NAP)',
        'Tetszőleges Unicode',
        'Szóközöket tartalmazhat',
        'Kisbetű és emoji is lehet'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: 'Course Specific'
    },
    {
      question: 'Mi a courseId regex-e?',
      options: ['/^[A-Z0-9_]+$/', '/^[a-z-]+$/', '/.*$/', '/^[0-9]+$/'],
      correctIndex: 0,
      difficulty: QuestionDifficulty.MEDIUM,
      category: 'Course Specific'
    },
    {
      question: 'Mi a minimális kötelező mező a kurzushoz?',
      options: [
        'courseId, name, description',
        'brandId nélkül semmi kell',
        'Csak name',
        'Csak description'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: 'Course Specific'
    },
    {
      question: 'Mi az ajánlott durationDays?',
      options: ['30', '7', '14', 'Nincs ajánlás'],
      correctIndex: 0,
      difficulty: QuestionDifficulty.MEDIUM,
      category: 'Course Specific'
    },
    {
      question: 'Mikor állítsd requiresPremium = true?',
      options: [
        'Ha tényleg prémium kurzus',
        'Minden kurzusnál',
        'Soha',
        'Csak ha 7 napos kurzus'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.MEDIUM,
      category: 'Course Specific'
    },
    {
      question: 'Miért legyen tömör a description?',
      options: [
        'Max 2000 karakter, értékalapú, listázásban is megjelenik',
        'Nem számít a hossza',
        'SEO miatt tele kulcsszóval',
        'Csak belső mező, senki nem látja'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.MEDIUM,
      category: 'Course Specific'
    }
  ],
  4: [
    {
      question: 'Mit jelent a completionPoints mező?',
      options: [
        'Pont a teljes kurzus befejezéséért',
        'Pont minden bejelentkezésért',
        'Pont minden kvízkérdésért',
        'Pont a brand módosításáért'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: 'Course Specific'
    },
    {
      question: 'Mit jelent a lessonPoints?',
      options: [
        'Pont minden lecke befejezéséért',
        'Pont a kurzus létrehozásért',
        'Pont a loginért',
        'Pont a cron futtatásért'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: 'Course Specific'
    },
    {
      question: 'Mikor jár perfectCourseBonus?',
      options: [
        'Ha mind a 30 nap teljesítve',
        'Ha csak az első nap kész',
        'Ha 50% kész',
        'Minden nap automatikusan'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.MEDIUM,
      category: 'Course Specific'
    },
    {
      question: 'Mi az XP mezők célja?',
      options: [
        'Előrehaladás és motiváció mérése',
        'Marketing email számolása',
        'Fizetés feldolgozása',
        'Brand váltás'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.MEDIUM,
      category: 'Course Specific'
    },
    {
      question: 'Miért dokumentáld a pont/XP értékeket?',
      options: [
        'Átláthatóság és későbbi módosítás indoklása miatt',
        'Felesleges',
        'Mert kötelező a törvény',
        'Nem lehet módosítani'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.HARD,
      category: 'Course Specific'
    }
  ],
  5: [
    {
      question: 'Miért kell brandId a kurzushoz?',
      options: [
        'Stílus, domain, jogosultság miatt kötelező kötés',
        'Csak dísz',
        'Nem kell, opcionális',
        'Csak a thumbnailhez'
  ],
  6: [
    {
      question: 'Mi a javasolt lessonId formátum?',
      options: [
        '{COURSE_ID}_DAY_{DD} (pl. AI_30_NAP_DAY_01)',
        'Szabad szöveg szóközökkel',
        'Emoji + szám',
        'Kisbetű + szóköz'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: 'Course Specific'
    },
    {
      question: 'Miért fontos, hogy a dayNumber és lessonId egyezzen?',
      options: [
        'A haladás és emailküldés erre épít',
        'Csak esztétikai okból',
        'Nincs jelentősége',
        'Csak a brand miatt'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.MEDIUM,
      category: 'Course Specific'
    },
    {
      question: 'Mely mezők kötelezők egy leckéhez?',
      options: [
        'lessonId, dayNumber, title, content, emailSubject, emailBody',
        'Csak title',
        'Csak content',
        'Csak emailSubject'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: 'Course Specific'
    },
    {
      question: 'Miért legyen végleges a lessonId?',
      options: [
        'Sok hivatkozás épül rá, utólagos változtatás kockázatos',
        'Bármikor átírható veszély nélkül',
        'Csak dekoráció',
        'Emailhez nem szükséges'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.MEDIUM,
      category: 'Course Specific'
    },
    {
      question: 'Mi legyen az emailSubject/emailBody-ban?',
      options: [
        'Helyőrzők ({{courseName}}, {{dayNumber}}, {{lessonTitle}}, {{appUrl}}), rövid CTA',
        'Hosszú HTML inline stílussal',
        'Csak képek',
        'Üres mezők'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.MEDIUM,
      category: 'Course Specific'
    }
  ],
  7: [
    {
      question: 'Mi az ajánlott blokk-sorrend egy leckében?',
      options: [
        'Napi cél → Magyarázat → Példák → Gyakorlat (vezetett/önálló) → Tippek → Opcionális mélyítés',
        'Véletlenszerű bekezdések',
        'Csak egy hosszú szöveg',
        'Csak FAQ'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: 'Course Specific'
    },
    {
      question: 'Miért jó egységes vázat használni minden leckére?',
      options: [
        'Következetes élmény, könnyebb szerkesztés és olvasás',
        'Felesleges, minden lecke legyen más',
        'Csak időpocsékolás',
        'SEO miatt tilos'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.MEDIUM,
      category: 'Course Specific'
    },
    {
      question: 'Mit kerülj a tartalom formázásánál?',
      options: [
        'Inline stílusokat, rendezetlen hierarchiát',
        'Címsorok használatát',
        'Listákat',
        'Tippek szekciót'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.MEDIUM,
      category: 'Course Specific'
    },
    {
      question: 'Miért legyen rövid, szellős a szöveg?',
      options: [
        'Könnyebben olvasható és scannelhető',
        'Jobb, ha egy blokkban minden',
        'Csak mobil miatt',
        'Nincs jelentősége'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: 'Course Specific'
    }
  ],
  8: [
    {
      question: 'Milyen helyőrzőket használhatsz emailben?',
      options: [
        '{{courseName}}, {{dayNumber}}, {{lessonTitle}}, {{lessonContent}}, {{appUrl}}, {{playerName}}',
        '{{password}}, {{creditCard}}',
        'Bármilyen tetszőleges kulcs',
        'Csak {{courseName}}'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: 'Course Specific'
    },
    {
      question: 'Mi az ajánlott email felépítés?',
      options: [
        'Rövid tárgy, 1–2 bekezdés, 1 CTA link helyőrzővel',
        'Hosszú HTML inline stílussal és több CTA-val',
        'Csak képek és melléklet',
        'Üres törzs'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.MEDIUM,
      category: 'Course Specific'
    },
    {
      question: 'Miért kell helyőrzőt használni a linkben?',
      options: [
        'Hogy a megfelelő napra mutasson ({{appUrl}}/courses/{COURSE_ID}/day/{{dayNumber}})',
        'Dekoráció',
        'Nem szükséges, statikus link is jó',
        'Csak fejlesztéskor kell'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.MEDIUM,
      category: 'Course Specific'
    },
    {
      question: 'Mit kerülj email sablonban?',
      options: [
        'Inline stílus, túl hosszú tartalom, több CTA',
        'Helyőrzők használata',
        'Rövid tárgy',
        'Egy CTA link'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: 'Course Specific'
    }
  ],
  9: [
    {
      question: 'Milyen címhierarchiát használj a lecke tartalomban?',
      options: [
        'H1 a lecke cím, H2 a szekciók, H3 a subsections',
        'Mindenhol H1',
        'Nincs cím, csak bekezdések',
        'H6 mindenhez'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: 'Course Specific'
    },
    {
      question: 'Mit kerülj a Rich Text Editorban?',
      options: [
        'Inline stílusokat és rendezetlen formázást',
        'Blockquote használatát',
        'Listákat',
        'Linkeket'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.MEDIUM,
      category: 'Course Specific'
    },
    {
      question: 'Miért fontos a whitespace és rövid bekezdés?',
      options: [
        'Jobb olvashatóság, könnyebb scannelés',
        'Csak mobilon számít',
        'Nem fontos',
        'SEO tiltja'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: 'Course Specific'
    },
    {
      question: 'Miért érdemes preview-t nézni a lecke megjelenítőben?',
      options: [
        'Hogy lásd a valós UI-t és a tördelést',
        'Felesleges, az editor elég',
        'Csak kód kell',
        'Mindig ugyanolyan'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.MEDIUM,
      category: 'Course Specific'
    }
  ],
  10: [
    {
      question: 'Mi a 30 napos terv fő célja?',
      options: [
        'Előre rögzített fázisok és napi címek, hogy minimalizáld a későbbi átírást',
        'Ad hoc írás naponta',
        'Csak 7 napra tervezni',
        'Csak a címet kitalálni'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.MEDIUM,
      category: 'Course Specific'
    },
    {
      question: 'Milyen fázisokra bonthatod a kurzust példaként?',
      options: [
        '1–5 alap, 6–10 tartalom/struktúra, 11–15 quiz, 16–20 minőség/stílus, 21–25 közzététel/teszt, 26–30 karbantartás',
        'Csak egy fázis: „egyéb”',
        'Minden nap véletlen téma',
        'Fázisok nélkül'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: 'Course Specific'
    },
    {
      question: 'Miért jelöld a „kritikus napokat”?',
      options: [
        'Quiz, email, publikálás körüli napok kiemelése a fókusz miatt',
        'Nincs értelme kiemelni',
        'Csak dísz',
        'SEO miatt'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.MEDIUM,
      category: 'Course Specific'
    },
    {
      question: 'Mit tartalmazzon a 30 napos táblázat?',
      options: [
        'Nap, Cím, Fázis, rövid fókusz',
        'Csak nap és emoji',
        'Csak nap és random szöveg',
        'Csak fázis'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.MEDIUM,
      category: 'Course Specific'
    }
  ],
  11: [
    {
      question: 'Mit jelent a successThreshold = 100?',
      options: [
        'Minden megjelenített kérdésre helyes választ kell adni',
        'Elég 50% a továbbhaladáshoz',
        'A kérdések száma 100 lesz',
        'Nem jelenik meg kvíz'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.MEDIUM,
      category: 'Course Specific'
    },
    {
      question: 'Mi az ajánlott questionCount/poolSize beállítás?',
      options: ['5 kérdés / 15-ös pool', '10 kérdés / 5-ös pool', '1 kérdés / 1-es pool', '15 kérdés / 5-ös pool'],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: 'Course Specific'
    },
    {
      question: 'Mikor legyen enabled = true a kvíz?',
      options: [
        'Ha a lecke ellenőrzést vagy gyakorlást igényel',
        'Soha',
        'Csak az első napon',
        'Csak premium kurzusnál'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: 'Course Specific'
    },
    {
      question: 'Miért legyen required = true?',
      options: [
        'Hogy a tanuló ténylegesen átfusson a tartalmon',
        'Felesleges, mindig false',
        'Csak marketing okból',
        'Csak a 30. napon'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.MEDIUM,
      category: 'Course Specific'
    },
    {
      question: 'Miért fontos, hogy questionCount ≤ poolSize?',
      options: [
        'Különben elfogynak a kérdések és hibázik a kiválasztás',
        'Nincs jelentősége',
        'Csak a UI miatt',
        'A poolSize-t figyelmen kívül hagyja a rendszer'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.HARD,
      category: 'Course Specific'
    }
  ],
  12: [
    {
      question: 'Hány válaszlehetőség legyen egy kérdésnél?',
      options: ['4 opció, 1 helyes', '2 opció, 2 helyes', '5 opció, 3 helyes', 'Bármennyi, akár 0'],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: 'Course Specific'
    },
    {
      question: 'Miért kell egyértelmű kérdés + válasz?',
      options: [
        'Hogy a megértést mérje, ne lehessen félreérteni',
        'Hogy trükkös legyen',
        'Csak a véletlenen múljon',
        'Mert a rendszer kitalálja'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.MEDIUM,
      category: 'Course Specific'
    },
    {
      question: 'Mit tartalmazzon egy kérdés rekord?',
      options: [
        'Kérdés szöveg, 4 opció, helyes index, nehézség, kategória',
        'Csak kérdést',
        'Csak opciókat',
        'Csak nehézséget'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: 'Course Specific'
    },
    {
      question: 'Miért legyen keverve a nehézség (E/M/H)?',
      options: [
        'Kiegyensúlyozott mérés és gyakorlás miatt',
        'Mindig csak HARD kell',
        'Mindig csak EASY kell',
        'Nincs hatása'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.MEDIUM,
      category: 'Course Specific'
    },
    {
      question: 'Miért kerüld a dummy szöveget (pl. „válasz opciója”)?',
      options: [
        'Nem mér megértést, rontja a minőséget',
        'Helyettesíti a tartalmat',
        'SEO miatt kell',
        'Kötelező minta'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.HARD,
      category: 'Course Specific'
    }
  ],
  13: [
    {
      question: 'Mi az ajánlott questionCount/poolSize beállítás?',
      options: ['5 / 15', '10 / 5', '1 / 1', '15 / 5'],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: 'Course Specific'
    },
    {
      question: 'Miért legyen vegyes nehézség a poolban?',
      options: [
        'Különböző szinteket és megértést mér',
        'Csak színesíti a UI-t',
        'Nem számít',
        'Mert véletlen'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.MEDIUM,
      category: 'Course Specific'
    },
    {
      question: 'Miért kell tartalmi fedés a kérdéseknél?',
      options: [
        'Fő pontokat mérje, ne irreleváns témát',
        'Mindegy, miről szól a kérdés',
        'Csak általános tudás kell',
        'Csak random kérdések kellenek'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.MEDIUM,
      category: 'Course Specific'
    },
    {
      question: 'Mit tegyél, ha kevés a tartalom egy leckében?',
      options: [
        'Csökkentsd a poolSize-t, tartsd meg a relevanciát',
        'Emeld 30-ra a kérdéseket',
        'Töltsd meg dummy kérdésekkel',
        'Kapcsold ki a kvízt örökre'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.HARD,
      category: 'Course Specific'
    },
    {
      question: 'Miért fontos a questionCount ≤ poolSize szabály?',
      options: [
        'Hogy a random kiválasztás működjön és ne fogyjon el a kérdés',
        'Nincs jelentősége',
        'Csak esztétika',
        'A rendszer automatikusan pótolja'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.HARD,
      category: 'Course Specific'
    }
  ],
  14: [
    {
      question: 'Mi a fő oka a kérdések szerkesztésének?',
      options: [
        'Hibás/irreleváns kérdés javítása vagy frissítése a lecke tartalmához',
        'Csak szórakozás',
        'Mindig törölni kell mindent',
        'Nincs oka'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: 'Course Specific'
    },
    {
      question: 'Mit ellenőrizz szerkesztés után?',
      options: [
        'Helyes válasz index, nehézség, kategória, pool méret',
        'Csak a színt',
        'Csak a betűméretet',
        'Semmit, automatikus'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.MEDIUM,
      category: 'Course Specific'
    },
    {
      question: 'Mikor törölj egy kérdést?',
      options: [
        'Ha irreleváns vagy hibás, és nem érdemes javítani',
        'Soha',
        'Ha túl rövid',
        'Ha túl hosszú a válasz'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.MEDIUM,
      category: 'Course Specific'
    },
    {
      question: 'Miért kell figyelni a poolSize-re törlés után?',
      options: [
        'Ne legyen kisebb, mint a questionCount',
        'Mert mindig 0-ra áll',
        'Nincs hatása',
        'Csak a UI kedvéért'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.HARD,
      category: 'Course Specific'
    }
  ],
  15: [
    {
      question: 'Mit kell ellenőrizni tanulói nézetben?',
      options: [
        'Megjelenik-e a kvíz, működik-e a kitöltés és retake',
        'Csak a háttérszínt',
        'Csak az admin linket',
        'Semmit'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: 'Course Specific'
    },
    {
      question: 'Miért próbáld ki a retake-et?',
      options: [
        'Hogy lásd, a random kérdésválasztás működik-e, és a feedback helyes-e',
        'Felesleges',
        'Csak admin látja',
        'Nincs retake'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.MEDIUM,
      category: 'Course Specific'
    },
    {
      question: 'Mit tegyél, ha hibás kérdést találsz teszt közben?',
      options: [
        'Javítsd/töröld az adminban, majd teszteld újra',
        'Hagyd úgy',
        'Csak jegyezd meg',
        'Kapcsold ki a kvízt'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.MEDIUM,
      category: 'Course Specific'
    },
    {
      question: 'Miért fontos a támogató feedback?',
      options: [
        'A tanulást segíti, nem büntet',
        'Nem számít',
        'Csak az admin látja',
        'SEO okból'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.HARD,
      category: 'Course Specific'
    }
  ],
  16: [
    {
      question: 'Mi kell a kurzus láthatóságához?',
      options: [
        'Course.isActive = true, legalább 1 Lesson.isActive = true, brandId érvényes, prémium feltétel teljesül',
        'Csak Course.isActive',
        'Csak brandId',
        'Semmi, automatikus'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.MEDIUM,
      category: 'Course Specific'
    },
    {
      question: 'Mit tegyél, ha a kurzus nem látszik a listában?',
      options: [
        'Ellenőrizd isActive státuszokat, brandId-t, prémium flag-et, API listát',
        'Várj 1 napot és hátha',
        'Töröld a kurzust',
        'Kapcsold ki az összes leckét'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.MEDIUM,
      category: 'Course Specific'
    },
    {
      question: 'Miért teszteld incognito módban is?',
      options: [
        'Hogy lásd a valós felhasználói láthatóságot cache nélkül',
        'Csak divat',
        'Nincs értelme',
        'Csak admin lát mindent'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: 'Course Specific'
    }
  ],
  17: [
    {
      question: 'Hogyan teszteled az enroll-t UI-n?',
      options: [
        'Kurzus oldal → „Beiratkozás” gomb',
        'Admin → Brand lista',
        'Emailből',
        'Nincs UI enroll'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: 'Course Specific'
    },
    {
      question: 'Mi az enroll API endpoint?',
      options: [
        'POST /api/courses/{courseId}/enroll',
        'GET /api/courses',
        'POST /api/cron/send-daily-lessons',
        'DELETE /api/courses/{courseId}'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.MEDIUM,
      category: 'Course Specific'
    },
    {
      question: 'Mit tegyél, ha 403-at kapsz?',
      options: [
        'Ellenőrizd a prémium flag-et és az auth state-et',
        'Semmit, ez normális',
        'Kapcsold ki az authot',
        'Töröld a kurzust'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.HARD,
      category: 'Course Specific'
    }
  ],
  18: [
    {
      question: 'Mi a dev teszt végpont a napi emailekhez?',
      options: [
        'GET /api/cron/send-daily-lessons',
        'POST /api/courses/{courseId}/enroll',
        'GET /api/courses',
        'POST /api/courses'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: 'Course Specific'
    },
    {
      question: 'Mi az éles cron hívás auth-ja?',
      options: [
        'POST + Authorization: Bearer <CRON_SECRET>',
        'GET auth nélkül',
        'Cookie alapú',
        'Nem kell auth'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.MEDIUM,
      category: 'Course Specific'
    },
    {
      question: 'Hogyan kerüli el a duplikált emaileket a rendszer?',
      options: [
        'CourseProgress.emailSentDays alapján',
        'Nem kerüli el',
        'Véletlenszerűen küld',
        'Csak az első napot küldi'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.HARD,
      category: 'Course Specific'
    }
  ],
  19: [
    {
      question: 'Mi a teendő, ha a kurzus nem látható?',
      options: [
        'isActive, requiresPremium, brandId, API /courses?status=active ellenőrzés',
        'Várni',
        'Új kurzust csinálni azonnal',
        'Semmi'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.MEDIUM,
      category: 'Course Specific'
    },
    {
      question: 'Mit nézz, ha a lecke 404-et ad?',
      options: [
        'dayNumber 1–30, Lesson.isActive, courseId egyezés',
        'Csak a színt',
        'Mindig 404 a leckéknél',
        'Brand logót'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: 'Course Specific'
    },
    {
      question: 'Miért írj troubleshooting jegyzetet?',
      options: [
        'Gyors hibajavítás és ismételhetőség miatt',
        'Felesleges papírmunka',
        'SEO miatt',
        'Nem segít'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.MEDIUM,
      category: 'Course Specific'
    }
  ],
  20: [
    {
      question: 'Mi az ellenőrzőlista fő célja?',
      options: [
        'Publikálás előtti gyors validáció',
        'Dekoráció',
        'Csak admin látja',
        'Nincs cél'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: 'Course Specific'
    },
    {
      question: 'Mit ellenőrizz a beiratkozásnál?',
      options: [
        'API/UI működik-e, user látja-e a nap 1-et',
        'Csak a logót',
        'Csak a brand színét',
        'Semmit'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.MEDIUM,
      category: 'Course Specific'
    },
    {
      question: 'Miért kérj incognito tesztet?',
      options: [
        'Valós user szemszögből, cache/auth nélkül',
        'Csak móka',
        'Nincs értelme',
        'Csak mobilon fontos'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.MEDIUM,
      category: 'Course Specific'
    }
  ],
  21: [
    {
      question: 'Mi a seed script fő előnye?',
      options: [
        'Gyors, verziózott, ismételhető feltöltés',
        'Csak dísz',
        'Nem használható több kurzusra',
        'Csak UI helyettesítés nélkül'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: 'Course Specific'
    },
    {
      question: 'Hol van a seed script és hogyan fut?',
      options: [
        'scripts/seed-{kurzus}.ts, npm run seed:{kurzus}',
        'app/page.tsx, npm start',
        'public/index.html, npm test',
        'styles/globals.css, npm run lint'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.MEDIUM,
      category: 'Course Specific'
    },
    {
      question: 'Mit ne tegyél a seed scriptbe?',
      options: [
        'Dummy kérdéseket (pl. „válasz opciója”)',
        'Valós tartalmat',
        'QuizConfig-et',
        'Brand beállítást'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.HARD,
      category: 'Course Specific'
    }
  ],
  22: [
    {
      question: 'Mit tárolhatsz a metadata mezőben?',
      options: [
        'estimatedMinutes, difficulty, tags, learningObjectives, prerequisites',
        'Csak képeket',
        'Jelszavakat',
        'Nem használható'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: 'Course Specific'
    },
    {
      question: 'Miért hasznosak a tag-ek?',
      options: [
        'Szűréshez és kereséshez',
        'Csak dekoráció',
        'Nem számítanak',
        'SEO miatt tilos'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.MEDIUM,
      category: 'Course Specific'
    },
    {
      question: 'Miért adj estimatedMinutes értéket?',
      options: [
        'Segít a tanulónak tervezni az időt',
        'Nincs jelentősége',
        'Csak admin látja, de felesleges',
        'Törli a leckét'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.MEDIUM,
      category: 'Course Specific'
    }
  ],
  23: [
    {
      question: 'Mi a javasolt lessonId formátum?',
      options: [
        '{COURSE_ID}_DAY_{DD}',
        'Szabad szöveg szóközökkel',
        'Emoji + szám',
        'Kisbetű + szóköz'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: 'Course Specific'
    },
    {
      question: 'Miért legyen rövid és leíró a cím?',
      options: [
        'Könnyebb navigáció, email tárgyban is szerepel',
        'Mindegy a hossz',
        'Csak admin látja',
        'SEO tiltja'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.MEDIUM,
      category: 'Course Specific'
    },
    {
      question: 'Miért hasznosak a fázisok a címadásnál?',
      options: [
        'Könnyen látszik a kurzus íve és fókusza',
        'Nem számít',
        'Csak hosszabb lesz',
        'Csak mobilon jó'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.MEDIUM,
      category: 'Course Specific'
    }
  ],
  24: [
    {
      question: 'Mi az ajánlott email tárgy hossza?',
      options: [
        '< 60 karakter, nap számával, CTA jelleggel',
        '200 karakter, nap szám nélkül',
        'Csak emoji',
        'Nem számít'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.MEDIUM,
      category: 'Course Specific'
    },
    {
      question: 'Hány CTA legyen egy emailben?',
      options: ['1 fő CTA', '3-4 CTA', '0 CTA', 'Bármennyi'],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: 'Course Specific'
    },
    {
      question: 'Miért tegyél teaser előnézetet az email törzsbe?',
      options: [
        'Kedvet csinál a kattintáshoz',
        'Nincs értelme',
        'Csak helyet foglal',
        'Tilos teaser-t adni'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.MEDIUM,
      category: 'Course Specific'
    }
  ],
  25: [
    {
      question: 'Miért bontsd 5 napos fázisokra a 30 napot?',
      options: [
        'Jobb fókusz, könnyebb tervezés és átrendezés',
        'Csak dísz',
        'Nem számít',
        'Felesleges idő'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.MEDIUM,
      category: 'Course Specific'
    },
    {
      question: 'Mit tartalmazzon egy fázis-definíció?',
      options: [
        'Nap-blokk és 1–2 fókuszpont',
        'Csak egy szó',
        'Csak a brand logó',
        'Csak a nehézség'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: 'Course Specific'
    },
    {
      question: 'Miért adj előre napcímeket a fázisokhoz?',
      options: [
        'Látod a teljes ívet és minimalizálod az átírást',
        'Nem számít',
        'Felesleges',
        'Csak dísz'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.MEDIUM,
      category: 'Course Specific'
    }
  ],
  26: [
    {
      question: 'Mely területekre fókuszálj optimalizáláskor?',
      options: [
        'Tartalom, gyakorlat, email, kvíz',
        'Csak a logó',
        'Csak a brand szín',
        'Semmire'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: 'Course Specific'
    },
    {
      question: 'Miért kezdd a legnagyobb hatású elemmel?',
      options: [
        'Gyorsan javítja az élményt (pl. kvíz vagy gyakorlat)',
        'Mindig mindent egyszerre kell',
        'Nem számít a sorrend',
        'Csak design számít'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.MEDIUM,
      category: 'Course Specific'
    },
    {
      question: 'Miért hasznos A/B vagy before/after példa?',
      options: [
        'Látod, mi javult, és mérhető a hatás',
        'Felesleges',
        'Csak szöveget hosszabbít',
        'Kötelező törölni'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.MEDIUM,
      category: 'Course Specific'
    }
  ],
  27: [
    {
      question: 'Mit tartalmazzon a kurzus dokumentáció?',
      options: [
        'Cél, előfeltétel, tanulási célok, struktúra (fázis/nap)',
        'Csak a logó',
        'Csak a kvízkérdések',
        'Semmit'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: 'Course Specific'
    },
    {
      question: 'Miért legyen a doksi „élő” dokumentum?',
      options: [
        'Változáskor frissíted, így naprakész marad',
        'Soha nem változik',
        'Csak nyomtatva használható',
        'Felesleges frissíteni'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.MEDIUM,
      category: 'Course Specific'
    },
    {
      question: 'Mit tegyél FAQ-ba?',
      options: [
        '4–5 tipikus tanulói kérdést és választ',
        'Csak egy linket',
        'Semmit',
        'Csak képeket'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.MEDIUM,
      category: 'Course Specific'
    }
  ],
  28: [
    {
      question: 'Mi a karbantartás fő célja?',
      options: [
        'Rendszeres frissítés: tartalom, kvíz, email, linkek',
        'Csak új logó feltöltése',
        'Hogy hosszabb legyen a kurzus',
        'Semmi'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: 'Course Specific'
    },
    {
      question: 'Milyen gyakran érdemes karbantartani?',
      options: [
        'Kicsi, gyakori frissítések (pl. havi ritmus)',
        'Csak évente egyszer',
        'Soha',
        'Naponta teljes újraírás'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.MEDIUM,
      category: 'Course Specific'
    },
    {
      question: 'Miért vezess changelogot?',
      options: [
        'Lásd, mit/mikor/miért módosítottál',
        'Nem kell nyilvántartás',
        'Csak marketing miatt',
        'Csak designhoz jó'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.HARD,
      category: 'Course Specific'
    }
  ],
  29: [
    {
      question: 'Mely mérőszámok hasznosak?',
      options: [
        'Befejezési arány, drop-off napok, kvíz nehéz kérdések, email nyitás/kattintás',
        'Csak a logó mérete',
        'Csak a CSS fájl hossza',
        'Semmi'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: 'Course Specific'
    },
    {
      question: 'Miért érdemes rövid visszajelző űrlapot beilleszteni?',
      options: [
        'Gyorsan kapsz tanulói insightot',
        'Csak lassít',
        'Tilos visszajelzést kérni',
        'Nem olvassák el'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.MEDIUM,
      category: 'Course Specific'
    },
    {
      question: 'Hogyan használd a mérőszámokat?',
      options: [
        'Jegyezd a tanulságokat, határozz meg következő lépést/iterációt',
        'Ne tedd semmire',
        'Csak posztold Slackre',
        'Mindig töröld'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.MEDIUM,
      category: 'Course Specific'
    }
  ],
  30: [
    {
      question: 'Mi a záró nap célja?',
      options: [
        'Összegzés + következő lépések/iterációk kijelölése',
        'Csak köszönés',
        'Csak új kurzus törlése',
        'Semmi'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: 'Course Specific'
    },
    {
      question: 'Mit írj a roadmapre a záráskor?',
      options: [
        '3 tanulság, 3 alkalmazás, 3 fejlesztési lépés (4 hétre)',
        'Csak egy emoji',
        'Csak brand logót',
        'Semmit'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.MEDIUM,
      category: 'Course Specific'
    },
    {
      question: 'Miért oszd meg a roadmapet a csapattal?',
      options: [
        'Feedbacket kapsz és ütemezed az iterációt',
        'Felesleges',
        'Titokban kell tartani',
        'Csak marketingnek jó'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.MEDIUM,
      category: 'Course Specific'
    }
  ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: 'Course Specific'
    },
    {
      question: 'Mi történik, ha nincs brandId?',
      options: [
        'Hiba vagy automatikus Amanoba brand használat (seed script)',
        'Publikálódik brand nélkül',
        'Önálló brand jön létre random névvel',
        'Semmi, ignorálja'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.MEDIUM,
      category: 'Course Specific'
    },
    {
      question: 'Mit ellenőrizz az allowedDomains mezőben?',
      options: [
        'Tartalmazza-e az amanoba.com-ot (és localhostot tesztkor)',
        'Csak .gov domaineket',
        'Csak belső IP-ket',
        'Semmit, nem fontos'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.MEDIUM,
      category: 'Course Specific'
    },
    {
      question: 'Mi legyen a brand slug formátuma?',
      options: [
        'Egyedi, kisbetűs, kötőjeles',
        'Bármi, akár emoji',
        'Csupa nagybetű szóközzel',
        'Számok és speciális jelek'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.MEDIUM,
      category: 'Course Specific'
    },
    {
      question: 'Miért jó külön brandet létrehozni teszteléshez?',
      options: [
        'Elkülönített stílus/színek, biztonságos kísérletezés',
        'Felesleges, minden megy az éles brandre',
        'Csak drágább',
        'Nem lehetséges'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.HARD,
      category: 'Course Specific'
    }
  ]
};

function generateQuizQuestions(
  lesson: typeof lessonPlan[0]
): Array<{
  question: string;
  options: string[];
  correctIndex: number;
  difficulty: QuestionDifficulty;
  category: string;
}> {
  if (curatedQuestions[lesson.day]) {
    return curatedQuestions[lesson.day];
  }

  // Fallback: simple generic questions without dummy text
  return [
    {
      question: `Mi a(z) "${lesson.title}" lecke fő célja?`,
      options: [
        'Megérteni és alkalmazni a lecke témáját',
        'Nincs konkrét cél',
        'Csak kitölteni az oldalt',
        'Véletlenszerű feladatok végrehajtása'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: 'Course Specific'
    },
    {
      question: `Mit kell tenned a(z) "${lesson.title}" lecke után?`,
      options: [
        'Alkalmazni a tanultakat egy rövid gyakorlatban',
        'Semmit',
        'Csak elolvasni még egyszer',
        'Törölni a kurzust'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.MEDIUM,
      category: 'Course Specific'
    },
    {
      question: `Melyik állítás igaz a(z) "${lesson.title}" leckére?`,
      options: [
        'Konkrét lépéseket és ellenőrzőlistát ad',
        'Nincs benne útmutató',
        'Nem kapcsolódik a kurzushoz',
        'Csak véletlen példákat tartalmaz'
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.MEDIUM,
      category: 'Course Specific'
    }
  ];
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

  // Purge existing quiz questions for this course to remove legacy/dummy items
  const purgeResult = await QuizQuestion.deleteMany({ courseId: course._id });
  console.log(`🧹 Removed existing quiz questions for ${COURSE_ID}: ${purgeResult.deletedCount}`);

  // Create lessons
  let created = 0;
  let updated = 0;

  for (const entry of lessonPlan) {
    const lessonId = `${COURSE_ID}_DAY_${String(entry.day).padStart(2, '0')}`;
    const content = buildLessonContent(entry);
    const quizQuestions = generateQuizQuestions(entry);
    const poolSize = quizQuestions.length;
    const questionCount = Math.min(5, poolSize);
    
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
          // Quiz configuration: 5 questions shown (or all, ha kevesebb), pool = elérhető kérdések
          quizConfig: {
            enabled: true,
            successThreshold: 100,
            questionCount,
            poolSize,
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

    // Create curated quiz questions for this lesson
    let questionsCreated = 0;
    let questionsUpdated = 0;

    for (const q of quizQuestions) {
      const existingQ = await QuizQuestion.findOne({ 
        lessonId: lessonId,
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
          lessonId: lessonId,
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
