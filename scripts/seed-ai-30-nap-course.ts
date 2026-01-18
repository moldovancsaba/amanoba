/**
 * Seed AI 30 Nap Course
 *
 * What: Creates a complete 30-day AI course with all lessons based on the provided table of contents
 * Why: Provides a default, production-ready course for the platform
 *
 * Usage: npm run seed:ai-course
 */

import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { Brand, Course, Lesson, QuizQuestion, QuestionDifficulty } from '../app/lib/models';

const COURSE_ID = 'AI_30_NAP';
const COURSE_NAME = 'AI 30 Nap – tematikus tanulási út';
const COURSE_DESCRIPTION = '30 napos, strukturált AI-kurzus, amely az alapoktól a haladó használatig vezet. Napi 10-15 perces leckékkel építsd be az AI-t a munkádba és a mindennapi életedbe.';

// Complete lesson plan based on the table of contents
const lessonPlan = [
  // 1-5. nap · Alapok & szemlélet
  {
    day: 1,
    title: 'Mi az AI valójában – és mire NEM való?',
    content: `<h2>Napi cél</h2>
<p>Ma tisztázzuk, hogy az AI eszköz, nem varázslat. Megérted, mire való, mire nem, és hogyan kérj tőle felelősen.</p>
<ul>
<li>tudatosan használod az AI-t, nem „vak” automataként</li>
<li>felismered a kockázatos use case-eket</li>
<li>tudod, hogy az első válasz miért ritkán tökéletes</li>
<li>elindítod a saját „AI használati térképed” összeírását</li>
</ul>

<hr />
<h2>Miért nem varázslat?</h2>
<p>Az AI nem „érti”, mit szeretnél – csak azt látja, amit leírsz. Jó input → jobb output.</p>
<ul>
<li>Nem dönt helyetted, csak javasol</li>
<li>Nem ismeri a céges kontextust, ha nem adod meg</li>
<li>Nem vállal felelősséget: neked kell ellenőrizni</li>
</ul>

<hr />
<h2>Mire NEM való?</h2>
<ul>
<li>kritikus döntések (pénzügy, HR, egészségügy) emberi felülvizsgálat nélkül</li>
<li>személyes adatok, jelszavak, bizalmas üzleti információk kezelése</li>
<li>jogi, orvosi tanács helyettesítése</li>
</ul>

<hr />
<h2>Hogyan használd biztonságosan?</h2>
<ul>
<li>anonimizáld az adatokat, ahol lehet</li>
<li>kérj több változatot és válassz</li>
<li>mindig iterálj: pontosíts, adj példát, adj korlátot</li>
<li>ellenőrizd a tényeket, főleg számoknál/dátumoknál</li>
</ul>

<hr />
<h2>Gyenge vs. jó prompt</h2>
<p><strong>Gyenge:</strong> „Írj egy emailt egy ügyfélnek.” (általános, semmitmondó)</p>
<p><strong>Jó:</strong> „Írj udvarias, rövid emailt egy panaszos ügyfélnek, aki tegnap reklamált. Stílus: empatikus, de professzionális. Hossz: max 4 mondat.”</p>

<hr />
<h2>Gyakorlat 1 – Használati térkép</h2>
<p>Írj le 3 konkrét feladatot, amit a héten gyorsítanál AI-val. Mindenhez add meg: mi a feladat, mit vársz az AI-tól, milyen kockázatot látsz.</p>

<h2>Gyakorlat 2 – Tiltólista</h2>
<p>Készíts listát 5 feladatról, amit nem bízol az AI-ra (pl. jelszavak, döntések, érzékeny ügyfelek).</p>

<hr />
<h2>Tipp</h2>
<p>Az AI eszköz. Te vagy a rendező: adj kontextust, célt, korlátot. Az első válasz csak kiindulópont.</p>

<h2>Opcionális mélyítés</h2>
<ul>
<li>OpenAI: Responsible AI use (blog)</li>
<li>Ethan Mollick: How to use AI well</li>
</ul>`,
    emailSubject: 'AI 30 Nap – 1. nap: Mi az AI valójában?',
    emailBody: `<h1>{{courseName}}</h1>
<h2>{{dayNumber}}. nap: {{lessonTitle}}</h2>
<p>Üdvözölünk az AI 30 Napos kurzusban! Ma az alapokkal kezdünk.</p>
<div>{{lessonContent}}</div>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a teljes leckét →</a></p>`
  },
  {
    day: 2,
    title: 'A jó prompt 4 eleme',
    content: `<h2>Napi cél</h2>
<p>Ma megtanulod, hogyan épül fel egy jó prompt, és miért kapsz teljesen eltérő válaszokat ugyanarra a kérdésre.</p>
<ul>
<li>tudatosan megfogalmazod a promptot</li>
<li>irányítod a válasz minőségét</li>
<li>felismered, miért „félreért” néha a modell</li>
<li>pontosabb, használhatóbb outputot kérsz</li>
</ul>

<hr />
<h2>Miért kapsz más választ ugyanarra a kérdésre?</h2>
<p>Az AI nem érti a szándékod, csak a leírt szöveget. Két hasonló kérés mögött más-más elvárás lehet.</p>
<p><strong>Gyenge:</strong> „Írj egy emailt egy ügyfélnek.”<br/><strong>Jobb:</strong> „Írj rövid, udvarias emailt egy panaszos ügyfélnek, aki tegnap reklamált.”</p>

<hr />
<h2>A jó prompt 4 eleme</h2>
<ol>
<li><strong>Cél</strong> – Mit akarsz elérni? (pl. „Írj emailt”, „Összegezz”, „Adj tanácsot”)</li>
<li><strong>Kontextus</strong> – Milyen helyzetben vagyunk? (pl. „30 perces online meeting”, „Ügyfélpanasz egy késés miatt”)</li>
<li><strong>Forma</strong> – Milyen formátumot vársz? (pl. bullet lista, táblázat, rövid bekezdés)</li>
<li><strong>Stílus</strong> – Milyen hangnemben szóljon? (pl. üzleti, barátságos, technikai, motiváló)</li>
</ol>

<hr />
<h2>Példák: gyenge vs. jó prompt</h2>
<p><strong>Gyenge:</strong> Írj egy emailt időpont-egyeztetéshez. <em>Eredmény:</em> általános, semmitmondó.</p>
<p><strong>Jó:</strong> Írj udvarias, rövid emailt időpont-egyeztetéshez. Kontextus: 30 perces online meeting jövő hét kedden 10:00-kor. Stílus: üzleti, professzionális. Formátum: egy rövid bekezdés, tiszta felkérés. <em>Eredmény:</em> konkrét, használható.</p>

<hr />
<h2>Gyakorlat 1 – Irányított</h2>
<p>Írj promptot a következőhöz a 4 elem alapján:</p>
<ul>
<li>Cél: Emlékeztető email írása</li>
<li>Kontextus: Ügyfél nem válaszolt egy korábbi ajánlatra</li>
<li>Forma: Rövid email</li>
<li>Stílus: Udvarias, nem tolakodó</li>
</ul>

<h2>Gyakorlat 2 – Saját életből</h2>
<p>Válassz egy valós helyzetet (munka, iskola, család, ügyintézés), és írj promptot a 4 elem alapján.</p>

<hr />
<h2>Tipp</h2>
<p>Mindig add meg legalább a célt, a kontextust és a formát. Az AI nem gondolatolvasó: te vagy a rendező.</p>

<h2>Opcionális mélyítés</h2>
<ul>
<li>OpenAI Guide: Prompt Engineering Basics</li>
<li>One Useful Thing (Ethan Mollick): Prompt példák</li>
</ul>`,
    emailSubject: 'AI 30 Nap – 2. nap: A jó prompt 4 eleme',
    emailBody: `<h1>AI 30 Nap – 2. nap</h1>
<h2>A jó prompt 4 eleme</h2>
<p>Ma megtanulod, hogyan építs fel egy jó promptot. Ez az első "aha" pillanat: miért kapsz más választ ugyanarra a kérdésre.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a teljes leckét →</a></p>`
  },
  {
    day: 3,
    title: 'Hogyan kérdezz vissza az AI-tól?',
    content: `<h2>Napi cél</h2>
<p>Ma az iterációt és a visszakérdezést tanulod: hogyan pontosítsd a választ, hogy tényleg használható legyen.</p>
<ul>
<li>felismered, mikor kell pontosítani</li>
<li>tudsz példákat és korlátokat kérni</li>
<li>háromlépéses iterációs hurkot használsz</li>
</ul>

<hr />
<h2>Mi az iteráció?</h2>
<p>Válasz → visszajelzés → pontosítás. Az AI nem találja ki a hiányzó részleteket: te irányítasz.</p>

<h2>Iterációs hurok (3 lépés)</h2>
<ol>
<li><strong>Kérj változatot</strong>: „Adj 3 stílusvariánst (hivatalos, barátságos, technikai) max 50 szóban.”</li>
<li><strong>Pontosíts</strong>: „Rövidítsd 30%-kal, de tartsd meg a 3 fő üzenetet.”</li>
<li><strong>Korlátozz</strong>: „Legyen bullet lista, max 5 pont, konkrét teendőkkel.”</li>
</ol>

<hr />
<h2>Példák: gyenge vs. jó pontosítás</h2>
<p><strong>Gyenge:</strong> „Nem jó, csináld újra.”<br/><strong>Jó:</strong> „Túl hosszú és általános. Rövidítsd 30%-kal, adj konkrét példát, és írj barátságos hangnemben.”</p>

<hr />
<h2>Gyakorlat 1 – Ugyanaz a kérés, két verzió</h2>
<ol>
<li>„Írj emailt a határidő csúszásáról.”</li>
<li>„Írj emailt a határidő csúszásáról. Stílus: empatikus, de professzionális. Hossz: max 4 mondat. Adj alternatív megoldást.”</li>
</ol>
<p>Hasonlítsd össze a két választ: mit tett hozzá a pontosítás?</p>

<h2>Gyakorlat 2 – Iterációs kör</h2>
<p>Válassz egy saját promptot, majd:</p>
<ul>
<li>kérj 3 stílusvariánst</li>
<li>kérj rövidítést vagy bővítést konkrét elvárással</li>
<li>kérj magyarázatot: „Miért ezt javaslod?”</li>
</ul>

<hr />
<h2>Prompt minta</h2>
<blockquote>
<p>Adj 3 alternatív választ listában. Mindegyik más stílusban (1) hivatalos, 2) barátságos, 3) technikai). Mindegyik max 50 szó, és tartalmazzon 2 konkrét teendőt.</p>
</blockquote>

<h2>Tipp</h2>
<p>Kérj példát, korlátot (hossz, formátum), és indoklást. A jó visszajelzés = jobb következő válasz.</p>`,
    emailSubject: 'AI 30 Nap – 3. nap: Hogyan kérdezz vissza az AI-tól?',
    emailBody: `<h1>AI 30 Nap – 3. nap</h1>
<h2>Hogyan kérdezz vissza az AI-tól?</h2>
<p>Ma megtanulod az iterációt és a pontosítást. Ez kulcsfontosságú, hogy egyre jobb válaszokat kapj.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a teljes leckét →</a></p>`
  },
  {
    day: 4,
    title: 'Stílus és hang – tanítsd meg "úgy írni, mint te"',
    content: `<h2>Napi cél</h2>
<p>Ma megtanítod az AI-nak a saját hangodat: hogyan írjon úgy, mint te, következetesen és felismerhetően.</p>
<ul>
<li>stílus-definíciót adsz (hang, mondathossz, formalitás)</li>
<li>mintaszövegből taníttatod a modellt</li>
<li>struktúrát és formát is adsz, nem csak hangnemet</li>
<li>visszajelzést adsz, finomítasz</li>
</ul>

<hr />
<h2>Miért taníts stílust?</h2>
<ul>
<li>márka- és személyes hang következetessége</li>
<li>kevesebb kézi átírás, gyorsabb publikálás</li>
<li>könnyebb delegálás: „írd úgy, ahogy én szoktam”</li>
</ul>

<h2>4 lépés a stílustanításhoz</h2>
<ol>
<li><strong>Mutasd meg</strong>: adj 1-2 saját szöveget példának.</li>
<li><strong>Nevezd meg</strong>: írd le a hangot (pl. barátságos, tömör, példákkal teli).</li>
<li><strong>Adj struktúrát</strong>: bevezető–fő rész–zárás, vagy bullet/CTA.</li>
<li><strong>Adj feedbacket</strong>: „túl hivatalos, legyen közvetlenebb”, „legyen rövidebb”.</li>
</ol>

<hr />
<h2>Példa: gyenge vs. jó stílus brief</h2>
<p><strong>Gyenge:</strong> „Írj úgy, mint én.”</p>
<p><strong>Jó:</strong> „Írj úgy, mint ebben a példában: [szöveg]. Hang: barátságos, tárgyilagos, rövid mondatok. Struktúra: 1) probléma röviden, 2) megoldás 3 bulletben, 3) záró CTA.”</p>

<hr />
<h2>Gyakorlat 1 – Saját szöveg elemzése</h2>
<p>Add meg az AI-nak egy általad írt szöveget, kérd:</p>
<ul>
<li>Elemezd a hangot (formalitás, mondathossz, szóhasználat).</li>
<li>Foglalj össze 3 stílusjegyet.</li>
<li>Írj 3 tippet, hogyan lehet ezt másolni.</li>
</ul>

<h2>Gyakorlat 2 – Új szöveg ugyanabban a stílusban</h2>
<p>Kérj új szöveget a fenti stílusban egy másik témára. Adj feedbacket és pontosíts.</p>

<hr />
<h2>Prompt minta</h2>
<blockquote>
<p>Íme a stílusom: [példa szöveg]. Hang: barátságos, tömör, példákkal. Struktúra: probléma, 3 bullet megoldás, CTA. Írj ugyanebben a stílusban egy emailt a következő témáról: [téma]. Ha eltérsz, jelezd, mit módosítottál.</p>
</blockquote>

<h2>Tipp</h2>
<p>Mindig adj mintát + stílusleírást + struktúrát. Ha nem tetszik az első verzió, mondd meg, mi legyen több/kevesebb.</p>

<h2>Opcionális mélyítés</h2>
<ul>
<li>Brand voice guide példák (HubSpot, Mailchimp style guides)</li>
<li>„Tone of voice” cikkek: hogyan építsd fel a sajátodat</li>
</ul>`,
    emailSubject: 'AI 30 Nap – 4. nap: Stílus és hang',
    emailBody: `<h1>AI 30 Nap – 4. nap</h1>
<h2>Stílus és hang – tanítsd meg "úgy írni, mint te"</h2>
<p>Ma megtanulod, hogyan tanítsd meg az AI-nak a saját írási stílusodat. Ez kulcsfontosságú a konzisztens kommunikációhoz.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a teljes leckét →</a></p>`
  },
  {
    day: 5,
    title: 'Biztonság & etika a gyakorlatban',
    content: `<h2>Napi cél</h2>
<p>Ma megtanulod, mit <em>nem</em adunk be az AI-nak, hogyan anonimizálj gyorsan, és hogyan maradj etikus.</p>
<ul>
<li>felismered az érzékeny adatokat</li>
<li>tudsz helyőrzőkre cserélni (anonimizálás)</li>
<li>kockázat alapján döntesz: mit lehet, mit nem</li>
</ul>

<hr />
<h2>Mit ne adj be?</h2>
<ul>
<li>személyes adatok: név, email, telefonszám, cím</li>
<li>pénzügyi: bankszámla, kártyaszám, árazás, szerződés</li>
<li>bizalmas üzleti info: stratégia, nem publikus termékterv</li>
<li>jelszavak, tokenek, biztonsági kódok</li>
<li>egészségügyi, jogi, HR-es érzékeny részletek</li>
</ul>

<h2>Anonimizálás gyorsan</h2>
<ul>
<li>Nevek → [Név], cégek → [Cég], email → [Email], telefon → [Telefon]</li>
<li>Specifikusum helyett általános: „egy nagyvállalat”, „B2B ügyfél”</li>
<li>Kérd meg az AI-t is: „Ne tárold, ne idézd vissza a nyers adatot.”</li>
</ul>

<h2>Kockázati szintek</h2>
<ul>
<li><strong>Alacsony</strong>: publikus infó, marketing copy → OK</li>
<li><strong>Közepes</strong>: belső folyamatleírás → anonimizálva, óvatosan</li>
<li><strong>Magas</strong>: jogi, pénzügyi, személyes adatok → ne add be</li>
</ul>

<hr />
<h2>Gyakorlat 1 – Anonimizálás</h2>
<p>Vegyél egy rövid szöveget (email/jegyzőkönyv), cseréld a szenzitív részeket helyőrzőkre. Ellenőrizd újra.</p>

<h2>Gyakorlat 2 – Biztonságos prompt</h2>
<p>Írj promptot, ami kéri az AI-t: „Anonimizáld a bemenetet, ne használj valós neveket, és csak összefoglalót adj vissza.” Teszteld egy mintaszövegen.</p>

<hr />
<h2>Prompt minta</h2>
<blockquote>
<p>Anonimizáld a következő szöveget: [szöveg]. Cseréld a neveket [Név], cégeket [Cég], emailt [Email], telefont [Telefon]. Ezután készíts 5 pontos összefoglalót. Ne idézd vissza az eredeti adatokat.</p>
</blockquote>

<h2>Tipp</h2>
<p>Ha bizonytalan vagy, ne add be. Anonimizálj, rövidíts, és kérj összefoglalót teljes szöveg helyett.</p>

<h2>Opcionális mélyítés</h2>
<ul>
<li>GDPR alapok röviden</li>
<li>OpenAI data usage statement</li>
</ul>`,
    emailSubject: 'AI 30 Nap – 5. nap: Biztonság & etika',
    emailBody: `<h1>AI 30 Nap – 5. nap</h1>
<h2>Biztonság & etika a gyakorlatban</h2>
<p>Ma megtanulod, mit nem adunk be az AI-nak és hogyan anonimizálunk. Ez kritikus fontosságú a biztonságos használathoz.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a teljes leckét →</a></p>`
  },
  // 6-10. nap · Napi munka megkönnyítése
  {
    day: 6,
    title: 'Email percek alatt – profi hangon',
    content: `<h2>Napi cél</h2>
<p>Ma megtanulod, hogyan írsz 2-3 percen belül professzionális emaileket AI-val, több hangnemben.</p>
<ul>
<li>gyors email-vázat adsz céllal/kontextussal/stílussal</li>
<li>kérsz több változatot és formátumot</li>
<li>iterálsz: rövidíts, bővíts, hangnemet váltasz</li>
</ul>

<hr />
<h2>Email prompt váz</h2>
<ul>
<li><strong>Cél</strong>: írd le, mit akar az email (tájékoztat, kér, bocsánatot kér, egyeztet).</li>
<li><strong>Kontextus</strong>: mi történt, kinek, mikorra.</li>
<li><strong>Forma</strong>: rövid bekezdés, bullet lista, CTA a végén.</li>
<li><strong>Stílus</strong>: üzleti, empatikus, rövid, tárgyilagos stb.</li>
</ul>

<h2>Példák: gyenge vs. jó</h2>
<p><strong>Gyenge:</strong> „Írj emailt a határidő módosításáról.”</p>
<p><strong>Jó:</strong> „Írj udvarias, rövid emailt a határidő módosításáról. Kontextus: 2 nappal csúszunk, ok: külső beszállító. Stílus: empatikus, de határozott. Hossz: max 4 mondat. Adj alternatív dátumot és CTA-t a visszajelzésre.”</p>

<hr />
<h2>Gyakorlat 1 – 3 email</h2>
<ol>
<li>Rövid válasz időpont-egyeztetésre (2-3 mondat, udvarias).</li>
<li>Projekt státusz email (bevezető, helyzet, kockázat, következő lépés).</li>
<li>Empatikus válasz panaszra (elismerés, megoldási javaslat, CTA).</li>
</ol>
<p>Mindennél add meg: kontextus, stílus, hossz, formátum.</p>

<h2>Gyakorlat 2 – Két hangnem</h2>
<p>Kérd ugyanazt az emailt két hangnemben (pl. üzleti vs. barátságos). Válaszd ki a jobb változatot és pontosíts.</p>

<hr />
<h2>Prompt minta</h2>
<blockquote>
<p>Írj professzionális emailt a következő témában: [téma]. Kontextus: [kontextus]. Stílus: [stílus]. Hossz: [hossz]. Formátum: [formátum]. Adj 2 változatot: 1) rövid, 2) részletes bullet lista.</p>
</blockquote>

<h2>Tipp</h2>
<p>Kérj több változatot, majd mondd meg, mi tetszik/mi nem (rövidebb, empatikusabb, több szám). A CTA-t mindig írasd bele.</p>

<h2>Opcionális mélyítés</h2>
<ul>
<li>Email keretek: AIDA, PAS – kérd meg, hogy ezeket kövesse.</li>
<li>Sign-off könyvtár: „Üdvözlettel”, „Köszönöm az együttműködést” – kérj 3 alternatívát.</li>
</ul>`,
    emailSubject: 'AI 30 Nap – 6. nap: Email percek alatt',
    emailBody: `<h1>AI 30 Nap – 6. nap</h1>
<h2>Email percek alatt – profi hangon</h2>
<p>Ma megtanulod, hogyan írsz gyorsan professzionális emaileket. Ez az egyik legnagyobb időmegtakarítás.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a teljes leckét →</a></p>`
  },
  {
    day: 7,
    title: 'Meeting jegyzetből teendőlista',
    content: `<h2>Napi cél</h2>
<p>Ma megtanulod, hogyan lesz nyers meeting jegyzetből tiszta összefoglaló és teendőlista felelőssel, határidővel.</p>
<ul>
<li>3 blokkban gondolkodsz: Összefoglaló – Döntések – Teendők</li>
<li>feladatokra felelős + határidő + státusz kerül</li>
<li>kevésbé használható jegyzetből is akcióképes listát készítesz</li>
</ul>

<hr />
<h2>Mi legyen a kimenet?</h2>
<ul>
<li><strong>Összefoglaló</strong>: 3–5 fő pont (tények, kontextus)</li>
<li><strong>Döntések</strong>: mi dőlt el, ki döntött</li>
<li><strong>Teendők</strong>: feladat | felelős | határidő | státusz/next</li>
</ul>

<h2>Jó bemenet: mit adj meg?</h2>
<ul>
<li>nyers jegyzet (bullet vagy transcript részlet)</li>
<li>résztvevők/felelősök neve</li>
<li>határidők, ha elhangzottak (vagy kérd, hogy javasoljon)</li>
<li>projekt/téma neve</li>
</ul>

<hr />
<h2>Példa: gyenge vs. jó prompt</h2>
<p><strong>Gyenge:</strong> „Foglaljad össze a meetinget.”</p>
<p><strong>Jó:</strong> „Foglaljad össze 3–5 pontban. Adj külön szekciót: Döntések, Teendők (feladat | felelős | határidő | státusz). Jegyzet: [szöveg]. Projekt: [név].”</p>

<hr />
<h2>Gyakorlat 1 – Saját jegyzet</h2>
<p>Adj meg 5–10 sor jegyzetet (vagy kreálj példát) és kérd a 3 szekciós kimenetet.</p>

<h2>Gyakorlat 2 – Hiányzó határidő</h2>
<p>Ha nincs határidő, kérd: „Javasolj reális határidőt és felelőst” – majd ellenőrizd és módosítsd.</p>

<hr />
<h2>Prompt minta</h2>
<blockquote>
<p>Jegyzet: [szöveg]. Készíts 3 szekciót: 1) Összefoglaló (3–5 pont), 2) Döntések (döntés | döntéshozó), 3) Teendők (feladat | felelős | határidő | státusz/next). Rövid, bullet formátum.</p>
</blockquote>

<h2>Tipp</h2>
<p>Kérd külön a „Döntések” blokkot, hogy ne vesszen el; a teendő mindig kapjon felelőst és határidőt.</p>

<h2>Opcionális mélyítés</h2>
<ul>
<li>Használj meeting template-et (Agenda, Notes, Decisions, Action Items)</li>
<li>Adj státusz jelzést: TODO / IN PROGRESS / BLOCKED / DONE</li>
</ul>`,
    emailSubject: 'AI 30 Nap – 7. nap: Meeting jegyzetből teendőlista',
    emailBody: `<h1>AI 30 Nap – 7. nap</h1>
<h2>Meeting jegyzetből teendőlista</h2>
<p>Ma megtanulod, hogyan alakítasz át meeting jegyzeteket strukturált teendőlistává. Ez rengeteg időt takarít meg.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a teljes leckét →</a></p>`
  },
  {
    day: 8,
    title: 'Dokumentumok: brief, váz, összefoglaló',
    content: `<h2>Napi cél</h2>
<p>Ma megtanulod, hogyan kérsz AI-tól briefet, vázlatot és összefoglalót: gyors váz → pontosítás → kész verzió.</p>
<ul>
<li>brief: cél, kontextus, elvárás, kizárás</li>
<li>vázlat: fő pontok sorrendje</li>
<li>összefoglaló: lényeg 5 pontban, döntések, következő lépések</li>
</ul>

<hr />
<h2>Miért kezdj vázlattal?</h2>
<ul>
<li>gyorsan látod, hiányzik-e valami</li>
<li>könnyebb iterálni struktúrán, mint kész szövegen</li>
<li>csökken az „elszállt” tartalom kockázata</li>
</ul>

<h2>Brief kötelező elemei</h2>
<ul>
<li>Cél, Kontextus, Célközönség</li>
<li>Elvárások (scope), Kizárások</li>
<li>Határidők, Mérőszámok</li>
</ul>

<hr />
<h2>Példa prompt – Brief</h2>
<p>„Készíts projekt briefet: [projekt]. Struktúra: 1) Cél, 2) Kontextus, 3) Célközönség, 4) Elvárások, 5) Kizárások, 6) Határidők/Mérőszámok. Stílus: tömör, bullet first.”</p>

<h2>Példa prompt – Vázlat</h2>
<p>„Adj vázlatot egy blogposzthoz [téma], max 6 pont, mindegyikhez 1 mondat.”</p>

<h2>Példa prompt – Összefoglaló</h2>
<p>„Foglalj össze 5 pontban: fő üzenetek, döntések, következő lépések. Hossz: max 120 szó.”</p>

<hr />
<h2>Gyakorlat 1 – Brief iteráció</h2>
<ol>
<li>Kérj brief vázlatot a saját projektedhez.</li>
<li>Adj feedbacket: mi hiányzik, mi felesleges.</li>
<li>Kérj végső briefet.</li>
</ol>

<h2>Gyakorlat 2 – Összefoglaló</h2>
<p>Válassz egy 2–3 bekezdéses szöveget, kérj 5 pontos összefoglalót + 1 döntés/1 következő lépés kiemelést.</p>

<hr />
<h2>Tipp</h2>
<p>Kezdd vázlattal, majd pontosíts. A brief/outline/summary hármasával gyorsan variálhatsz tartalmat.</p>

<h2>Opcionális mélyítés</h2>
<ul>
<li>Struktúra-sablonok: PRD, kreatív brief, kampány brief</li>
<li>„Too long; didn’t read” összefoglalók külön vezetői nézetre</li>
</ul>`,
    emailSubject: 'AI 30 Nap – 8. nap: Dokumentumok készítése',
    emailBody: `<h1>AI 30 Nap – 8. nap</h1>
<h2>Dokumentumok: brief, váz, összefoglaló</h2>
<p>Ma megtanulod, hogyan készítesz briefeket, vázlatokat és összefoglalókat. Ezek a dokumentumok sok időt vesznek igénybe manuálisan.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a teljes leckét →</a></p>`
  },
  {
    day: 9,
    title: 'Táblázat-gondolkodás AI-val',
    content: `<h2>Napi cél</h2>
<p>Ma megtanulod, hogyan rendezed szöveges adatot táblázatba: gyors struktúra, összehasonlítás, export (CSV).</p>
<ul>
<li>oszlopok definiálása (címkék előre)</li>
<li>feladat → felelős → határidő → státusz/prioritás</li>
<li>összehasonlító/pro-kontra táblák</li>
</ul>

<hr />
<h2>Alap minta</h2>
<p>„Alakítsd táblázattá: [oszlop1] | [oszlop2] | … Adatok: [lista]. Adj CSV-t is.”</p>

<h2>Oszlopok, amik működnek</h2>
<ul>
<li>Feladat | Felelős | Határidő | Prioritás | Státusz</li>
<li>Opció | Előny | Hátrány | Kockázat | Ajánlás</li>
<li>Feature | Impact | Effort | ETA | Owner</li>
</ul>

<hr />
<h2>Példa: gyenge vs. jó prompt</h2>
<p><strong>Gyenge:</strong> „Csinálj táblázatot.”</p>
<p><strong>Jó:</strong> „Alakítsd táblázattá: Feladat | Felelős | Határidő | Prioritás | Státusz. Adatok: [lista]. Adj CSV-t is exporthoz.”</p>

<hr />
<h2>Gyakorlat 1 – Feladatlista táblázat</h2>
<ol>
<li>Írj 5 feladatot szövegben.</li>
<li>Kérj táblázatot a fenti oszlopokkal.</li>
<li>Kérj CSV-t, majd ellenőrizd a pontos oszlopneveket.</li>
</ol>

<h2>Gyakorlat 2 – Pro/kontra tábla</h2>
<p>Válassz egy döntést (pl. eszközválasztás) és kérj pro/kontra táblát + ajánlást.</p>

<hr />
<h2>Tipp</h2>
<p>Előre definiált oszlopnevek = kevesebb utómunka. Mindig kérj CSV-t, ha exportálnád.</p>

<h2>Opcionális mélyítés</h2>
<ul>
<li>Táblázat → JSON/CSV konverzió</li>
<li>Rendezés/szűrés: „Rendezd prioritás szerint”</li>
</ul>`,
    emailSubject: 'AI 30 Nap – 9. nap: Táblázat-gondolkodás',
    emailBody: `<h1>AI 30 Nap – 9. nap</h1>
<h2>Táblázat-gondolkodás AI-val</h2>
<p>Ma megtanulod, hogyan alakítasz át szöveges információkat táblázatokká. Ez nagyon hasznos adatok strukturálásához.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a teljes leckét →</a></p>`
  },
  {
    day: 10,
    title: 'Ismétlés & prompt-debug nap',
    content: `<h2>Napi cél</h2>
<p>Ma visszanézed az első hét anyagát, és megtanulod a prompt-debug lépéseit: miért rossz, hogyan javítsd.</p>
<ul>
<li>azonosítod a tipikus hibákat (hiányzó kontextus, cél, forma, stílus)</li>
<li>3 lépéses debug folyamatot használsz</li>
<li>jó/rossz példákat hasonlítasz össze</li>
</ul>

<hr />
<h2>Tipikus hibák</h2>
<ul>
<li>túl általános: „Írj emailt”</li>
<li>nincs kontextus: miről, kinek, mikorra?</li>
<li>nincs forma: bullet vs. bekezdés</li>
<li>nincs stílus: üzleti, empatikus, tömör?</li>
</ul>

<h2>Debug lépések (3)</h2>
<ol>
<li><strong>Diagnózis</strong>: mi hiányzik? (cél/kontextus/forma/stílus/hossz)</li>
<li><strong>Pontosítás</strong>: adj konkrét kérést (pl. „max 4 mondat”, „bullet”, „empatikus”)</li>
<li><strong>Validálás</strong>: hasonlítsd össze a két választ, kérj újrát, ha kell</li>
</ol>

<hr />
<h2>Gyakorlat 1 – Rossz → Jó</h2>
<p>Válassz egy rossz promptot, írd át 4 elemre, futtasd mindkettőt, hasonlítsd.</p>

<h2>Gyakorlat 2 – Formátum váltás</h2>
<p>Ugyanaz a tartalom: kérd először bekezdésben, majd bulletben; melyik használhatóbb?</p>

<hr />
<h2>Prompt minta</h2>
<blockquote>
<p>Rossz: „Írj emailt.”<br/>Jó: „Írj rövid, udvarias emailt időpont-egyeztetéshez. Kontextus: 30 perces meeting jövő hét kedden 10:00-kor. Stílus: üzleti. Hossz: max 4 mondat. Adj CTA-t a visszajelzésre.”</p>
</blockquote>

<h2>Tipp</h2>
<p>A debug is tanulás: mondd meg, mi hiányzik (túl hosszú, nincs CTA), és kérd újra. A legjobb prompt iterációval készül.</p>

<h2>Opcionális mélyítés</h2>
<ul>
<li>Prompt checklist: Cél, Kontextus, Forma, Stílus, Hossz, CTA</li>
<li>A/B tesztelj 2 promptot, mérd az eredményt</li>
</ul>`,
    emailSubject: 'AI 30 Nap – 10. nap: Ismétlés & prompt-debug',
    emailBody: `<h1>AI 30 Nap – 10. nap</h1>
<h2>Ismétlés & prompt-debug nap</h2>
<p>Ma ismételed az elmúlt 5 nap anyagát és gyakorlod a prompt debugolást. Ez fontos a fejlődéshez.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a teljes leckét →</a></p>`
  },
  // 11-15. nap · Rendszerépítés
  {
    day: 11,
    title: 'Saját prompt könyvtár létrehozása',
    content: `<h2>Napi cél</h2>
<p>Létrehozod a saját prompt könyvtáradat, amit újra és újra használhatsz.</p>

<h2>Prompt könyvtár építése</h2>
<p>A prompt könyvtár segít:</p>
<ul>
<li><strong>Időt takarít</strong> – Nem kell mindig újra megfogalmaznod</li>
<li><strong>Konzisztencia</strong> – Ugyanazt a minőséget kapod</li>
<li><strong>Fejlődés</strong> – Finomítod és javítod a promptokat</li>
</ul>

<h2>Gyakorlat</h2>
<p>Írj 5 prompt sablont a saját munkádhoz:</p>
<ol>
<li>Email írás (3 változat: rövid, részletes, bullet points)</li>
<li>Összefoglaló készítés</li>
<li>Teendőlista generálás</li>
<li>Dokumentum vázlat</li>
<li>Ötletelés</li>
</ol>
<p>Minden sablonhoz add meg: cél, kontextus, forma, stílus.</p>

<h2>Prompt minta</h2>
<blockquote>
<p>Készíts prompt sablont email íráshoz. Struktúra: Cél: [cél], Kontextus: [kontextus], Stílus: [stílus], Hossz: [hossz]. Használható változókkal, amit mindig kitöltesz.</p>
</blockquote>

<h2>Tipp</h2>
<p>Kategorizáld a sablonokat (email, dokumentum, összefoglaló, stb.). Tartsd egy helyen (pl. Notion, Google Docs) és frissítsd, amikor jobbat találsz.</p>`,
    emailSubject: 'AI 30 Nap – 11. nap: Saját prompt könyvtár',
    emailBody: `<h1>AI 30 Nap – 11. nap</h1>
<h2>Saját prompt könyvtár létrehozása</h2>
<p>Ma létrehozod a saját prompt könyvtáradat. Ez rengeteg időt takarít meg a jövőben.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a teljes leckét →</a></p>`
  },
  {
    day: 12,
    title: 'Workflow: input → feldolgozás → output',
    content: `<h2>Napi cél</h2>
<p>Kialakítasz egy hatékony workflow-t az AI használatához.</p>

<h2>Workflow építése</h2>
<p>Egy jó workflow három lépésből áll:</p>
<ol>
<li><strong>Input</strong> – Mit adsz be? (adatgyűjtés, anonimizálás)</li>
<li><strong>Feldolgozás</strong> – Hogyan dolgozza fel? (prompt, iteráció)</li>
<li><strong>Output</strong> – Mit kapsz ki? (ellenőrzés, finomítás, használat)</li>
</ol>

<h2>Gyakorlat</h2>
<p>Állíts össze egy workflow-t egy konkrét feladathoz (pl. meeting jegyzetek feldolgozása):</p>
<ol>
<li>Input: Mit gyűjtesz be? (jegyzetek, kontextus)</li>
<li>Feldolgozás: Milyen promptot használsz? (struktúra, formátum)</li>
<li>Output: Mit kapsz? (összefoglaló, teendők, döntések)</li>
<li>Ellenőrzés: Hogyan ellenőrzöd? (pontosság, teljesség)</li>
</ol>

<h2>Prompt minta</h2>
<blockquote>
<p>Készíts workflow tervet [feladat] feldolgozásához. Struktúra: 1) Input (mit gyűjtesz), 2) Feldolgozás (milyen prompt), 3) Output (mit kapsz), 4) Ellenőrzés (hogyan ellenőrzöd).</p>
</blockquote>

<h2>Tipp</h2>
<p>A workflow iteratív – finomítsd, amikor jobbat találsz. Dokumentáld a sikeres workflow-kat, hogy újra használhasd őket.</p>`,
    emailSubject: 'AI 30 Nap – 12. nap: Workflow építése',
    emailBody: `<h1>AI 30 Nap – 12. nap</h1>
<h2>Workflow: input → feldolgozás → output</h2>
<p>Ma kialakítasz egy hatékony workflow-t. Ez kulcsfontosságú a hatékonysághoz.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a teljes leckét →</a></p>`
  },
  {
    day: 13,
    title: 'Hibák, hallucinációk kezelése',
    content: `<h2>Napi cél</h2>
<p>Megtanulod, hogyan ismersz fel és kezelsz hibákat és hallucinációkat.</p>

<h2>Hallucinációk felismerése</h2>
<p>Az AI néha "hallucinál" – információt ad, ami nem igaz. Jelei:</p>
<ul>
<li><strong>Konkrét dátumok/számok</strong> – Ellenőrizd forrásokkal</li>
<li><strong>Valós események</strong> – Keresd meg, hogy tényleg megtörtént-e</li>
<li><strong>Statisztikák</strong> – Mindig ellenőrizd</li>
<li><strong>Konkrét nevek/cégek</strong> – Keresd meg, hogy léteznek-e</li>
</ul>

<h2>Hibakezelés</h2>
<p>Hogyan kezeld a hibákat:</p>
<ol>
<li><strong>Ellenőrizd</strong> – Mindig ellenőrizd a kritikus információkat</li>
<li><strong>Kérj forrást</strong> – "Melyik forrásból származik ez az információ?"</li>
<li><strong>Pontosíts</strong> – "Ez biztosan igaz? Ellenőrizd forrásokkal"</li>
<li><strong>Kérj alternatívát</strong> – "Adj 3 alternatív megoldást"</li>
</ol>

<h2>Gyakorlat</h2>
<p>Kérj az AI-tól egy információt (pl. "Mikor alapították a ChatGPT-t?") és:</p>
<ol>
<li>Ellenőrizd forrásokkal (Google, hivatalos oldalak)</li>
<li>Ha hibás, pontosítsd: "Ez nem helyes, keresd meg a helyes választ"</li>
<li>Kérj forrást: "Melyik forrásból származik ez?"</li>
</ol>

<h2>Prompt minta</h2>
<blockquote>
<p>Adj információt [témában], de csak akkor, ha 100%-ban biztos vagy. Ha nem vagy biztos, jelezd. Adj forrást is, ha lehetséges.</p>
</blockquote>

<h2>Tipp</h2>
<p>Hibák, hallucinációk kezelése: mindig ellenőrizd a kritikus információkat. Ne bízz meg vakon – az AI segít, de te vagy a felelős.</p>`,
    emailSubject: 'AI 30 Nap – 13. nap: Hibák kezelése',
    emailBody: `<h1>AI 30 Nap – 13. nap</h1>
<h2>Hibák, hallucinációk kezelése</h2>
<p>Ma megtanulod, hogyan ismersz fel és kezelsz hibákat. Ez kritikus fontosságú a megbízható használathoz.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a teljes leckét →</a></p>`
  },
  {
    day: 14,
    title: 'Személyes "AI-asszisztens" hang kialakítása',
    content: `<h2>Napi cél</h2>
<p>Kialakítod a saját "AI-asszisztens" hangodat, ami konzisztensen úgy ír, mint te.</p>

<h2>AI-asszisztens hang</h2>
<p>Az AI-asszisztens hang az, amikor az AI úgy ír, mintha te írtad volna:</p>
<ul>
<li><strong>Stílus</strong> – Ugyanaz a hang, mint a tiéd</li>
<li><strong>Forma</strong> – Ugyanaz a struktúra, mint amit te használsz</li>
<li><strong>Szókincs</strong> – Ugyanazok a szavak, kifejezések</li>
<li><strong>Hossz</strong> – Ugyanaz a mondathossz, bekezdéshossz</li>
</ul>

<h2>Gyakorlat</h2>
<p>Készíts egy "hang profil" dokumentumot:</p>
<ol>
<li>Gyűjts 3-5 példát a saját írásodból (email, dokumentum)</li>
<li>Add meg az AI-nak és kérj elemzést: hang, stílus, forma</li>
<li>Kérj egy "hang útmutatót": hogyan írjon úgy, mint te</li>
<li>Mentsd el ezt az útmutatót és használd újra</li>
</ol>

<h2>Prompt minta</h2>
<blockquote>
<p>Íme 3 példa a saját írási stílusomra: [példák]. Elemezd: hang, stílus, forma, szókincs, mondathossz. Készíts egy "hang útmutatót", amit újra használhatok, hogy úgy írjon, mint én.</p>
</blockquote>

<h2>Tipp</h2>
<p>Személyes "AI-asszisztens" hang kialakítása: minél több példát adsz, annál jobban megtanulja. Frissítsd, amikor változik a stílusod.</p>`,
    emailSubject: 'AI 30 Nap – 14. nap: AI-asszisztens hang',
    emailBody: `<h1>AI 30 Nap – 14. nap</h1>
<h2>Személyes "AI-asszisztens" hang kialakítása</h2>
<p>Ma kialakítod a saját AI-asszisztens hangodat. Ez segít a konzisztens kommunikációban.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a teljes leckét →</a></p>`
  },
  {
    day: 15,
    title: 'Ismétlés: rossz prompt → jó prompt',
    content: `<h2>Napi cél</h2>
<p>Ismételed a prompt írás készségeidet és gyakorlod a javítást.</p>

<h2>Rossz vs. jó prompt</h2>
<p><strong>Rossz prompt:</strong></p>
<ul>
<li>"Írj emailt" – túl általános</li>
<li>"Összegezz" – nincs kontextus</li>
<li>"Írj valamit" – nincs cél</li>
</ul>

<p><strong>Jó prompt:</strong></p>
<ul>
<li>"Írj rövid, udvarias emailt időpont-egyeztetéshez. Kontextus: 30 perces meeting jövő hét kedden 10:00-kor. Stílus: üzleti. Hossz: max 4 mondat."</li>
<li>"Összegezd ezt a dokumentumot 5 pontban. Fő üzenetek, döntések, következő lépések."</li>
<li>"Írj projekt briefet. Cél: [cél], Kontextus: [kontextus], Elvárások: [elvárások]."</li>
</ul>

<h2>Gyakorlat</h2>
<p>Válassz 3 rossz promptot és javítsd ki:</p>
<ol>
<li>Írd le a rossz promptot</li>
<li>Elemezd, mi a probléma</li>
<li>Javítsd ki: add hozzá a cél, kontextus, forma, stílus elemeit</li>
<li>Futtasd le mindkét verziót és hasonlítsd össze</li>
</ol>

<h2>Prompt minta</h2>
<blockquote>
<p>Rossz: "Írj valamit a projektről"</p>
<p>Jó: "Írj projekt státusz emailt. Kontextus: [projekt leírás], Státusz: [státusz], Következő lépések: [lépések]. Stílus: professzionális, rövid bekezdések. Hossz: max 200 szó."</p>
</blockquote>

<h2>Tipp</h2>
<p>Ismétlés: rossz prompt → jó prompt. A gyakorlat teszi a mestert – minél többet gyakorolsz, annál jobbak lesznek a promptjaid.</p>`,
    emailSubject: 'AI 30 Nap – 15. nap: Ismétlés',
    emailBody: `<h1>AI 30 Nap – 15. nap</h1>
<h2>Ismétlés: rossz prompt → jó prompt</h2>
<p>Ma ismételed a prompt írás készségeidet. Ez fontos a fejlődéshez.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a teljes leckét →</a></p>`
  },
  // 16-20. nap · Szerep-specifikus használat
  {
    day: 16,
    title: 'Marketing / Sales / PM / Dev – belépő nap',
    content: `<h2>Napi cél</h2>
<p>Megismered, hogyan használhatod az AI-t a saját szerepedben (Marketing, Sales, Product Manager, Developer).</p>

<h2>Szerep-specifikus AI használat</h2>
<p>Minden szerepnek más AI igényei vannak:</p>
<ul>
<li><strong>Marketing</strong> – Tartalom, kampányok, persona, értékajánlat</li>
<li><strong>Sales</strong> – Ügyfélkommunikáció, pitch, értékajánlat, tárgyalás előkészítés</li>
<li><strong>Product Manager</strong> – Specifikáció, user story, prioritás, roadmap</li>
<li><strong>Developer</strong> – Kód dokumentáció, specifikáció, tesztelés, hibakeresés</li>
</ul>

<h2>Gyakorlat</h2>
<p>Válaszd ki a saját szerepedet és készíts egy listát:</p>
<ol>
<li>Milyen feladatokat csinálsz naponta?</li>
<li>Melyikeket lehetne AI-val gyorsítani?</li>
<li>Milyen promptokat használnál?</li>
<li>Milyen outputot várnál?</li>
</ol>

<h2>Prompt minta</h2>
<blockquote>
<p>Készíts egy AI használati tervet [szerep] szerephez. Struktúra: 1) Napi feladatok, 2) AI-val gyorsítható feladatok, 3) Prompt sablonok, 4) Várható output. Konkrét példákkal.</p>
</blockquote>

<h2>Tipp</h2>
<p>Marketing / Sales / PM / Dev – belépő nap: minden szerepnek más igényei vannak. Találd meg, mi a te szereped specifikus igénye.</p>`,
    emailSubject: 'AI 30 Nap – 16. nap: Szerep-specifikus használat',
    emailBody: `<h1>AI 30 Nap – 16. nap</h1>
<h2>Marketing / Sales / PM / Dev – belépő nap</h2>
<p>Ma megtanulod, hogyan használhatod az AI-t a saját szerepedben. Ez személyre szabja a tanulást.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a teljes leckét →</a></p>`
  },
  {
    day: 17,
    title: 'Szerephez illesztett sabloncsomag I.',
    content: `<h2>Napi cél</h2>
<p>Készítesz szerep-specifikus prompt sablonokat az első csomaghoz.</p>

<h2>Sabloncsomag építése</h2>
<p>Egy sabloncsomag tartalmazza a leggyakrabban használt promptokat a szerepedhez:</p>
<ul>
<li><strong>Alap promptok</strong> – Email, dokumentum, összefoglaló</li>
<li><strong>Szerep-specifikus promptok</strong> – A te szerepedhez specifikus feladatok</li>
<li><strong>Variációk</strong> – Ugyanaz a feladat, más stílusban</li>
</ul>

<h2>Gyakorlat</h2>
<p>Készíts 5 prompt sablont a saját szerepedhez:</p>
<ol>
<li>Egy alap prompt (pl. email írás)</li>
<li>Egy szerep-specifikus prompt (pl. marketing: kampány vázlat)</li>
<li>Egy variáció (ugyanaz, más stílusban)</li>
<li>Egy iterációs prompt (finomítás, pontosítás)</li>
<li>Egy output ellenőrző prompt (minőségellenőrzés)</li>
</ol>

<h2>Prompt minta</h2>
<blockquote>
<p>Készíts prompt sablont [szerep] szerephez [feladat] feladathoz. Struktúra: Cél, Kontextus, Forma, Stílus. Használható változókkal, amit mindig kitöltesz.</p>
</blockquote>

<h2>Tipp</h2>
<p>Szerephez illesztett sabloncsomag I.: kezdj 5 sablonnal, majd bővítsd, ahogy rájössz, mi hasznos. Dokumentáld és oszd meg a csapattal.</p>`,
    emailSubject: 'AI 30 Nap – 17. nap: Sabloncsomag I.',
    emailBody: `<h1>AI 30 Nap – 17. nap</h1>
<h2>Szerephez illesztett sabloncsomag I.</h2>
<p>Ma készítesz szerep-specifikus prompt sablonokat. Ez személyre szabja az AI használatodat.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a teljes leckét →</a></p>`
  },
  {
    day: 18,
    title: 'Szerephez illesztett sabloncsomag II.',
    content: `<h2>Napi cél</h2>
<p>Bővíted a sabloncsomagodat további promptokkal.</p>

<h2>Sabloncsomag bővítése</h2>
<p>A második csomag haladó promptokat tartalmaz:</p>
<ul>
<li><strong>Komplex feladatok</strong> – Több lépéses folyamatok</li>
<li><strong>Integrációk</strong> – Különböző eszközök kombinálása</li>
<li><strong>Automatizálás</strong> – Ismétlődő feladatok automatizálása</li>
</ul>

<h2>Gyakorlat</h2>
<p>Készíts 3 haladó prompt sablont:</p>
<ol>
<li>Egy komplex feladat (pl. teljes kampány terv)</li>
<li>Egy integrációs prompt (pl. adatok + elemzés + jelentés)</li>
<li>Egy automatizálási prompt (pl. napi rutin automatizálása)</li>
</ol>
<p>Minden sablonhoz add meg: lépések, input, output, ellenőrzés.</p>

<h2>Prompt minta</h2>
<blockquote>
<p>Készíts komplex prompt sablont [feladat] feladathoz. Struktúra: 1) Lépések, 2) Input (mit adsz be), 3) Output (mit kapsz), 4) Ellenőrzés (hogyan ellenőrzöd). Használható változókkal.</p>
</blockquote>

<h2>Tipp</h2>
<p>Szerephez illesztett sabloncsomag II.: a haladó promptok időt takarítanak meg, de több időt igényelnek a kialakításuk. Érdemes befektetni.</p>`,
    emailSubject: 'AI 30 Nap – 18. nap: Sabloncsomag II.',
    emailBody: `<h1>AI 30 Nap – 18. nap</h1>
<h2>Szerephez illesztett sabloncsomag II.</h2>
<p>Ma bővíted a sabloncsomagodat haladó promptokkal. Ez még hatékonyabbá teszi az AI használatodat.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a teljes leckét →</a></p>`
  },
  {
    day: 19,
    title: 'Tipikus csapdák az adott szerepben',
    content: `<h2>Napi cél</h2>
<p>Megismered a tipikus csapdákat a saját szerepedben és megtanulod, hogyan kerüld el őket.</p>

<h2>Tipikus csapdák</h2>
<p>Minden szerepnek más csapdái vannak:</p>
<ul>
<li><strong>Marketing</strong> – Túl kreatív, nem mérhető; hallucinációk statisztikákban</li>
<li><strong>Sales</strong> – Túl általános pitch; nem személyre szabott</li>
<li><strong>Product Manager</strong> – Túl technikai specifikáció; hiányzó user perspective</li>
<li><strong>Developer</strong> – Hibás kód; nem tesztelt megoldások</li>
</ul>

<h2>Gyakorlat</h2>
<p>Készíts egy "csapda lista" dokumentumot a saját szerepedhez:</p>
<ol>
<li>Milyen tipikus hibákat követ el az AI a szerepedben?</li>
<li>Hogyan ismersz fel hibákat?</li>
<li>Hogyan kerüld el őket? (prompt módosítás, ellenőrzés)</li>
<li>Milyen ellenőrző kérdéseket teszel fel?</li>
</ol>

<h2>Prompt minta</h2>
<blockquote>
<p>Készíts egy "csapda lista" dokumentumot [szerep] szerephez. Struktúra: 1) Tipikus hibák, 2) Felismerés, 3) Elkerülés, 4) Ellenőrző kérdések. Konkrét példákkal.</p>
</blockquote>

<h2>Tipp</h2>
<p>Tipikus csapdák az adott szerepben: ismerd fel a csapdákat, hogy elkerüld őket. Az ellenőrzés kulcsfontosságú.</p>`,
    emailSubject: 'AI 30 Nap – 19. nap: Tipikus csapdák',
    emailBody: `<h1>AI 30 Nap – 19. nap</h1>
<h2>Tipikus csapdák az adott szerepben</h2>
<p>Ma megtanulod, hogyan kerüld el a tipikus csapdákat. Ez segít a megbízható használatban.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a teljes leckét →</a></p>`
  },
  {
    day: 20,
    title: 'Skill-check & szintlépés',
    content: `<h2>Napi cél</h2>
<p>Ellenőrzöd a fejlődésedet és meghatározod a következő szintet.</p>

<h2>Skill-check</h2>
<p>Ellenőrizd a fejlődésedet:</p>
<ul>
<li><strong>Alap készségek</strong> – Tudsz-e jó promptot írni?</li>
<li><strong>Workflow</strong> – Van-e hatékony workflow-d?</li>
<li><strong>Sablonok</strong> – Használsz-e prompt sablonokat?</li>
<li><strong>Hibakezelés</strong> – Tudsz-e felismerni és kezelni hibákat?</li>
</ul>

<h2>Gyakorlat</h2>
<p>Készíts egy önértékelést:</p>
<ol>
<li>Mely készségeket sajátítottad el? (1-5 skála)</li>
<li>Melyeket kell még fejleszteni?</li>
<li>Mi a következő célod? (pl. komplex feladatok, automatizálás)</li>
<li>Hogyan éred el? (gyakorlat, sablonok, workflow)</li>
</ol>

<h2>Prompt minta</h2>
<blockquote>
<p>Készíts egy önértékelést az AI használati készségeimről. Struktúra: 1) Sajátított készségek (1-5), 2) Fejlesztendő készségek, 3) Következő célok, 4) Akcióterv. Konkrét példákkal.</p>
</blockquote>

<h2>Tipp</h2>
<p>Skill-check & szintlépés: a fejlődés folyamatos. Ne állj meg – mindig van mit tanulni és fejleszteni.</p>`,
    emailSubject: 'AI 30 Nap – 20. nap: Skill-check',
    emailBody: `<h1>AI 30 Nap – 20. nap</h1>
<h2>Skill-check & szintlépés</h2>
<p>Ma ellenőrzöd a fejlődésedet és meghatározod a következő szintet. Ez fontos a folyamatos fejlődéshez.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a teljes leckét →</a></p>`
  },
  // 21-25. nap · AI a bevételhez
  {
    day: 21,
    title: 'Ötletvalidálás AI-val',
    content: `<h2>Napi cél</h2>
<p>Megtanulod, hogyan validálod az ötleteidet AI segítségével.</p>

<h2>Ötletvalidálás</h2>
<p>Az AI segíthet ötletek validálásában:</p>
<ul>
<li><strong>Piaci kutatás</strong> – "Milyen hasonló termékek/szolgáltatások vannak?"</li>
<li><strong>Kockázatelemzés</strong> – "Mik a lehetséges kockázatok?"</li>
<li><strong>Erőforrás igény</strong> – "Milyen erőforrásokra van szükség?"</li>
<li><strong>Értékajánlat</strong> – "Mi az egyedi értékajánlat?"</li>
</ul>

<h2>Gyakorlat</h2>
<p>Válassz egy ötletet (vagy készíts egyet) és validáld AI-val:</p>
<ol>
<li>Írd le az ötletet</li>
<li>Kérj piaci kutatást: hasonló termékek, versenytársak</li>
<li>Kérj kockázatelemzést: lehetséges problémák</li>
<li>Kérj értékajánlat elemzést: mi az egyedi érték</li>
<li>Készíts egy validációs összefoglalót</li>
</ol>

<h2>Prompt minta</h2>
<blockquote>
<p>Validáld ezt az ötletet: [ötlet leírás]. Készíts: 1) Piaci kutatás (hasonló termékek), 2) Kockázatelemzés, 3) Erőforrás igény, 4) Értékajánlat elemzés. Formátum: strukturált lista, pro/kontra.</p>
</blockquote>

<h2>Tipp</h2>
<p>Ötletvalidálás AI-val: az AI segít, de ne bízz meg vakon. Ellenőrizd a kritikus információkat és kérj több forrást.</p>`,
    emailSubject: 'AI 30 Nap – 21. nap: Ötletvalidálás',
    emailBody: `<h1>AI 30 Nap – 21. nap</h1>
<h2>Ötletvalidálás AI-val</h2>
<p>Ma megtanulod, hogyan validálod az ötleteidet. Ez segít a jó döntések meghozatalában.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a teljes leckét →</a></p>`
  },
  {
    day: 22,
    title: 'Persona & értékajánlat',
    content: `<h2>Napi cél</h2>
<p>Megtanulod, hogyan készítesz personát és értékajánlatot AI segítségével.</p>

<h2>Persona és értékajánlat</h2>
<p>Az AI segíthet persona és értékajánlat készítésében:</p>
<ul>
<li><strong>Persona</strong> – "Készíts personát: demográfia, igények, problémák, megoldások"</li>
<li><strong>Értékajánlat</strong> – "Mi az egyedi érték? Miért választanak minket?"</li>
<li><strong>Üzenet</strong> – "Hogyan kommunikáljuk az értékajánlatot?"</li>
</ul>

<h2>Gyakorlat</h2>
<p>Készíts egy personát és értékajánlatot:</p>
<ol>
<li>Válassz egy célcsoportot (vagy készíts egyet)</li>
<li>Kérj personát: demográfia, igények, problémák</li>
<li>Kérj értékajánlatot: mi az egyedi érték, miért választanak minket</li>
<li>Kérj üzenetet: hogyan kommunikáljuk</li>
<li>Készíts egy összefoglalót</li>
</ol>

<h2>Prompt minta</h2>
<blockquote>
<p>Készíts personát és értékajánlatot. Persona: [célcsoport leírás]. Értékajánlat: [termék/szolgáltatás]. Struktúra: 1) Persona (demográfia, igények, problémák), 2) Értékajánlat (egyedi érték, miért választanak), 3) Üzenet (hogyan kommunikáljuk).</p>
</blockquote>

<h2>Tipp</h2>
<p>Persona & értékajánlat: az AI segít, de a valós adatok fontosabbak. Használd az AI-t vázlatként, majd finomítsd valós adatokkal.</p>`,
    emailSubject: 'AI 30 Nap – 22. nap: Persona & értékajánlat',
    emailBody: `<h1>AI 30 Nap – 22. nap</h1>
<h2>Persona & értékajánlat</h2>
<p>Ma megtanulod, hogyan készítesz personát és értékajánlatot. Ez kulcsfontosságú a marketinghez és értékesítéshez.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a teljes leckét →</a></p>`
  },
  {
    day: 23,
    title: 'Landing váz és szöveg',
    content: `<h2>Napi cél</h2>
<p>Megtanulod, hogyan készítesz landing page vázlatot és szöveget AI segítségével.</p>

<h2>Landing page készítés</h2>
<p>Az AI segíthet landing page készítésében:</p>
<ul>
<li><strong>Vázlat</strong> – "Készíts landing page vázlatot: hero, értékajánlat, funkciók, CTA"</li>
<li><strong>Szöveg</strong> – "Írj landing page szöveget: hero szöveg, alcímek, CTA gombok"</li>
<li><strong>Variációk</strong> – "Adj 3 változatot: 1) rövid, 2) részletes, 3) bullet points"</li>
</ul>

<h2>Gyakorlat</h2>
<p>Készíts egy landing page vázlatot és szöveget:</p>
<ol>
<li>Add meg a termék/szolgáltatás leírását</li>
<li>Kérj vázlatot: struktúra, szekciók</li>
<li>Kérj szöveget: hero, értékajánlat, funkciók, CTA</li>
<li>Kérj 3 változatot: rövid, részletes, bullet points</li>
<li>Válaszd ki a legjobbat és finomítsd</li>
</ol>

<h2>Prompt minta</h2>
<blockquote>
<p>Készíts landing page vázlatot és szöveget. Termék: [termék leírás]. Struktúra: 1) Hero (cím, alcím, CTA), 2) Értékajánlat, 3) Funkciók, 4) CTA. Adj 3 változatot: rövid, részletes, bullet points.</p>
</blockquote>

<h2>Tipp</h2>
<p>Landing váz és szöveg: kezdj vázlattal, majd pontosíts. A szöveg iteratív – az első verzió ritkán tökéletes.</p>`,
    emailSubject: 'AI 30 Nap – 23. nap: Landing page',
    emailBody: `<h1>AI 30 Nap – 23. nap</h1>
<h2>Landing váz és szöveg</h2>
<p>Ma megtanulod, hogyan készítesz landing page vázlatot és szöveget. Ez hasznos a marketinghez.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a teljes leckét →</a></p>`
  },
  {
    day: 24,
    title: 'Árazás alapjai',
    content: `<h2>Napi cél</h2>
<p>Megtanulod, hogyan gondolkodsz árazásról AI segítségével.</p>

<h2>Árazás</h2>
<p>Az AI segíthet árazásban:</p>
<ul>
<li><strong>Piaci kutatás</strong> – "Milyen árazási modellek vannak a piacon?"</li>
<li><strong>Érték alapú árazás</strong> – "Mennyit ér a termék/szolgáltatás?"</li>
<li><strong>Versenyképesség</strong> – "Hogyan állunk az árazásban a versenytársakhoz képest?"</li>
<li><strong>Stratégia</strong> – "Milyen árazási stratégiát használjunk?"</li>
</ul>

<h2>Gyakorlat</h2>
<p>Készíts egy árazási elemzést:</p>
<ol>
<li>Add meg a termék/szolgáltatás leírását</li>
<li>Kérj piaci kutatást: hasonló termékek árai</li>
<li>Kérj érték alapú árazást: mennyit ér</li>
<li>Kérj versenyképességi elemzést: hogyan állunk</li>
<li>Kérj árazási stratégiát: milyen modellt használjunk</li>
</ol>

<h2>Prompt minta</h2>
<blockquote>
<p>Készíts árazási elemzést. Termék: [termék leírás]. Struktúra: 1) Piaci kutatás (hasonló termékek árai), 2) Érték alapú árazás, 3) Versenyképességi elemzés, 4) Árazási stratégia. Formátum: pro/kontra táblázat.</p>
</blockquote>

<h2>Tipp</h2>
<p>Árazás alapjai: az AI segít, de a valós piaci adatok fontosabbak. Használd az AI-t vázlatként, majd finomítsd valós adatokkal.</p>`,
    emailSubject: 'AI 30 Nap – 24. nap: Árazás',
    emailBody: `<h1>AI 30 Nap – 24. nap</h1>
<h2>Árazás alapjai</h2>
<p>Ma megtanulod, hogyan gondolkodsz árazásról. Ez fontos a bevételhez.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a teljes leckét →</a></p>`
  },
  {
    day: 25,
    title: 'MVP gondolkodás – mit NEM csinálunk',
    content: `<h2>Napi cél</h2>
<p>Megtanulod az MVP (Minimum Viable Product) gondolkodást és meghatározod, mit NEM csinálsz.</p>

<h2>MVP gondolkodás</h2>
<p>Az MVP az a minimális verzió, ami még értéket ad:</p>
<ul>
<li><strong>Mit csinálunk</strong> – "Mi a minimális funkciókészlet?"</li>
<li><strong>Mit NEM csinálunk</strong> – "Mit hagyjunk ki az első verzióból?"</li>
<li><strong>Prioritás</strong> – "Mi a legfontosabb?"</li>
<li><strong>Érték</strong> – "Mi az érték, amit adunk?"</li>
</ul>

<h2>Gyakorlat</h2>
<p>Készíts egy MVP tervet:</p>
<ol>
<li>Add meg a termék/szolgáltatás leírását</li>
<li>Kérj MVP definíciót: mit csinálunk, mit nem</li>
<li>Kérj prioritást: mi a legfontosabb</li>
<li>Kérj érték elemzést: mi az érték</li>
<li>Készíts egy MVP tervet</li>
</ol>

<h2>Prompt minta</h2>
<blockquote>
<p>Készíts MVP tervet. Termék: [termék leírás]. Struktúra: 1) MVP definíció (mit csinálunk, mit nem), 2) Prioritás (legfontosabb funkciók), 3) Érték (mi az érték), 4) Kizárások (mit nem csinálunk). Formátum: strukturált lista.</p>
</blockquote>

<h2>Tipp</h2>
<p>MVP gondolkodás – mit NEM csinálunk: a kizárások ugyanolyan fontosak, mint a belevételek. Ne próbálj mindent megcsinálni egyszerre.</p>`,
    emailSubject: 'AI 30 Nap – 25. nap: MVP gondolkodás',
    emailBody: `<h1>AI 30 Nap – 25. nap</h1>
<h2>MVP gondolkodás – mit NEM csinálunk</h2>
<p>Ma megtanulod az MVP gondolkodást. Ez segít a fókuszban és a prioritásokban.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a teljes leckét →</a></p>`
  },
  // 26-30. nap · Lezárás & következő szint
  {
    day: 26,
    title: 'Saját AI-rutin kialakítása',
    content: `<h2>Napi cél</h2>
<p>Kialakítod a saját napi AI-rutinodat, amit következetesen használsz.</p>

<h2>AI-rutin építése</h2>
<p>Egy jó AI-rutin tartalmazza:</p>
<ul>
<li><strong>Reggeli rutin</strong> – Mit csinálsz reggel AI-val? (pl. email válaszok, napi terv)</li>
<li><strong>Napi rutin</strong> – Mit csinálsz napközben? (pl. dokumentumok, összefoglalók)</li>
<li><strong>Esti rutin</strong> – Mit csinálsz este? (pl. napi összefoglaló, holnapi terv)</li>
</ul>

<h2>Gyakorlat</h2>
<p>Állíts össze egy napi AI-rutint:</p>
<ol>
<li>Reggeli rutin: 3 feladat, amit AI-val csinálsz reggel</li>
<li>Napi rutin: 3 feladat, amit AI-val csinálsz napközben</li>
<li>Esti rutin: 3 feladat, amit AI-val csinálsz este</li>
<li>Minden feladathoz add meg a promptot</li>
<li>Készíts egy rutin tervet</li>
</ol>

<h2>Prompt minta</h2>
<blockquote>
<p>Készíts napi AI-rutin tervet. Struktúra: 1) Reggeli rutin (3 feladat + promptok), 2) Napi rutin (3 feladat + promptok), 3) Esti rutin (3 feladat + promptok). Időbecsléssel.</p>
</blockquote>

<h2>Tipp</h2>
<p>Saját AI-rutin kialakítása: kezdj kicsiben – 1-2 feladattal naponta. Bővítsd, ahogy rájössz, mi hasznos.</p>`,
    emailSubject: 'AI 30 Nap – 26. nap: AI-rutin',
    emailBody: `<h1>AI 30 Nap – 26. nap</h1>
<h2>Saját AI-rutin kialakítása</h2>
<p>Ma kialakítod a saját napi AI-rutinodat. Ez segít a következetes használatban.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a teljes leckét →</a></p>`
  },
  {
    day: 27,
    title: '60 másodperces pitch AI-val',
    content: `<h2>Napi cél</h2>
<p>Megtanulod, hogyan készítesz 60 másodperces pitch-et AI segítségével.</p>

<h2>Pitch készítés</h2>
<p>Az AI segíthet pitch készítésében:</p>
<ul>
<li><strong>Struktúra</strong> – "Készíts pitch vázlatot: probléma, megoldás, érték"</li>
<li><strong>Szöveg</strong> – "Írj 60 másodperces pitch szöveget"</li>
<li><strong>Variációk</strong> – "Adj 3 változatot: 1) rövid, 2) részletes, 3) bullet points"</li>
</ul>

<h2>Gyakorlat</h2>
<p>Készíts egy 60 másodperces pitch-et:</p>
<ol>
<li>Add meg a termék/szolgáltatás leírását</li>
<li>Kérj pitch vázlatot: probléma, megoldás, érték</li>
<li>Kérj 60 másodperces pitch szöveget</li>
<li>Kérj 3 változatot: rövid, részletes, bullet points</li>
<li>Gyakorold felhangosan és mérj időt</li>
</ol>

<h2>Prompt minta</h2>
<blockquote>
<p>Készíts 60 másodperces pitch-et. Termék: [termék leírás]. Struktúra: 1) Probléma (10 mp), 2) Megoldás (30 mp), 3) Érték (20 mp). Adj 3 változatot: rövid, részletes, bullet points.</p>
</blockquote>

<h2>Tipp</h2>
<p>60 másodperces pitch AI-val: a pitch rövid és tömör. Gyakorold felhangosan és mérj időt – a 60 másodperc rövidebb, mint gondolnád.</p>`,
    emailSubject: 'AI 30 Nap – 27. nap: 60 másodperces pitch',
    emailBody: `<h1>AI 30 Nap – 27. nap</h1>
<h2>60 másodperces pitch AI-val</h2>
<p>Ma megtanulod, hogyan készítesz 60 másodperces pitch-et. Ez hasznos a prezentációkhoz és értékesítéshez.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a teljes leckét →</a></p>`
  },
  {
    day: 28,
    title: 'Portfólió-szintű kimenetek',
    content: `<h2>Napi cél</h2>
<p>Megtanulod, hogyan készítesz portfólió-szintű kimeneteket AI segítségével.</p>

<h2>Portfólió-szintű kimenetek</h2>
<p>Portfólió-szintű kimenetek azok, amiket megmutathatsz:</p>
<ul>
<li><strong>Minőség</strong> – Profi, hibamentes, jól strukturált</li>
<li><strong>Konzisztencia</strong> – Ugyanaz a stílus, forma</li>
<li><strong>Teljesség</strong> – Minden információ megvan</li>
<li><strong>Megjelenés</strong> – Jól formázott, olvasható</li>
</ul>

<h2>Gyakorlat</h2>
<p>Készíts egy portfólió-szintű kimenetet:</p>
<ol>
<li>Válassz egy feladatot (pl. projekt dokumentum, kampány terv)</li>
<li>Kérj portfólió-szintű kimenetet: minőség, konzisztencia, teljesség</li>
<li>Ellenőrizd: hibák, teljesség, megjelenés</li>
<li>Finomítsd: pontosíts, javíts</li>
<li>Mentsd el portfólióként</li>
</ol>

<h2>Prompt minta</h2>
<blockquote>
<p>Készíts portfólió-szintű kimenetet. Feladat: [feladat leírás]. Követelmények: 1) Minőség (profi, hibamentes), 2) Konzisztencia (ugyanaz a stílus), 3) Teljesség (minden információ), 4) Megjelenés (jól formázott).</p>
</blockquote>

<h2>Tipp</h2>
<p>Portfólió-szintű kimenetek: az ellenőrzés és finomítás kulcsfontosságú. Ne bízz meg vakon – mindig ellenőrizd és javítsd.</p>`,
    emailSubject: 'AI 30 Nap – 28. nap: Portfólió-szintű kimenetek',
    emailBody: `<h1>AI 30 Nap – 28. nap</h1>
<h2>Portfólió-szintű kimenetek</h2>
<p>Ma megtanulod, hogyan készítesz portfólió-szintű kimeneteket. Ezek megmutathatók és használhatók.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a teljes leckét →</a></p>`
  },
  {
    day: 29,
    title: 'Személyes fejlődési térkép',
    content: `<h2>Napi cél</h2>
<p>Készítesz egy személyes fejlődési térképet, ami mutatja, merre tovább.</p>

<h2>Fejlődési térkép</h2>
<p>Egy fejlődési térkép tartalmazza:</p>
<ul>
<li><strong>Jelenlegi szint</strong> – Hol vagy most?</li>
<li><strong>Célok</strong> – Hová akarsz eljutni?</li>
<li><strong>Lépések</strong> – Hogyan éred el?</li>
<li><strong>Mérés</strong> – Hogyan mérheted a fejlődést?</li>
</ul>

<h2>Gyakorlat</h2>
<p>Készíts egy személyes fejlődési térképet:</p>
<ol>
<li>Jelenlegi szint: milyen készségeid vannak? (1-5 skála)</li>
<li>Célok: mit akarsz elérni? (pl. komplex feladatok, automatizálás)</li>
<li>Lépések: hogyan éred el? (gyakorlat, sablonok, workflow)</li>
<li>Mérés: hogyan mérheted? (mérőszámok, review)</li>
<li>Készíts egy 4 hetes akciótervet</li>
</ol>

<h2>Prompt minta</h2>
<blockquote>
<p>Készíts személyes fejlődési térképet. Struktúra: 1) Jelenlegi szint (készségek 1-5), 2) Célok (mit akarsz elérni), 3) Lépések (hogyan éred el), 4) Mérés (mérőszámok). Készíts 4 hetes akciótervet is.</p>
</blockquote>

<h2>Tipp</h2>
<p>Személyes fejlődési térkép: a fejlődés folyamatos. Ne állj meg – mindig van mit tanulni és fejleszteni.</p>`,
    emailSubject: 'AI 30 Nap – 29. nap: Fejlődési térkép',
    emailBody: `<h1>AI 30 Nap – 29. nap</h1>
<h2>Személyes fejlődési térkép</h2>
<p>Ma készítesz egy személyes fejlődési térképet. Ez segít a folyamatos fejlődésben.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a teljes leckét →</a></p>`
  },
  {
    day: 30,
    title: 'Zárás – merre tovább?',
    content: `<h2>Napi cél</h2>
<p>Lezárod a 30 napos kurzust és meghatározod a következő lépéseket.</p>

<h2>Zárás</h2>
<p>Gratulálunk! Elvégezted a 30 napos AI kurzust! 🎉</p>

<h2>Mit tanultál?</h2>
<ul>
<li>Az AI alapjai és korlátai</li>
<li>A jó prompt 4 eleme</li>
<li>Iteráció és pontosítás</li>
<li>Stílus és hang kialakítása</li>
<li>Biztonság és etika</li>
<li>Napi munka megkönnyítése</li>
<li>Rendszerépítés</li>
<li>Szerep-specifikus használat</li>
<li>AI a bevételhez</li>
<li>Fejlődési térkép</li>
</ul>

<h2>Merre tovább?</h2>
<p>Most, hogy elvégezted a kurzust:</p>
<ol>
<li><strong>Gyakorolj</strong> – Használd az AI-t naponta, alkalmazd a tanultakat</li>
<li><strong>Fejleszd</strong> – Finomítsd a promptjaidat, bővítsd a sablonjaidat</li>
<li><strong>Oszd meg</strong> – Oszd meg a tapasztalataidat másokkal</li>
<li><strong>Tanulj tovább</strong> – Mindig van mit tanulni, kövesd a fejlesztéseket</li>
</ol>

<h2>Gyakorlat</h2>
<p>Készíts egy "merre tovább" tervet:</p>
<ol>
<li>Mit tanultál a kurzusban? (3 fő tanulság)</li>
<li>Mit fogsz alkalmazni? (3 konkrét feladat)</li>
<li>Hogyan fogod fejleszteni? (3 következő lépés)</li>
<li>Készíts egy 4 hetes akciótervet</li>
</ol>

<h2>Prompt minta</h2>
<blockquote>
<p>Készíts "merre tovább" tervet. Struktúra: 1) Tanultak (3 fő tanulság), 2) Alkalmazás (3 konkrét feladat), 3) Fejlesztés (3 következő lépés), 4) 4 hetes akcióterv. Konkrét példákkal.</p>
</blockquote>

<h2>Tipp</h2>
<p>Zárás – merre tovább?: a kurzus csak a kezdet. A valódi tanulás a gyakorlatban történik. Használd az AI-t naponta és fejleszd a készségeidet!</p>

<h2>Köszönjük!</h2>
<p>Köszönjük, hogy elvégezted a 30 napos AI kurzust! Reméljük, hogy hasznos volt és segített beépíteni az AI-t a munkádba és a mindennapi életedbe.</p>
<p>Folytasd a tanulást, gyakorolj és oszd meg a tapasztalataidat! 🚀</p>`,
    emailSubject: 'AI 30 Nap – 30. nap: Zárás',
    emailBody: `<h1>AI 30 Nap – 30. nap</h1>
<h2>Zárás – merre tovább?</h2>
<p>Gratulálunk! Elvégezted a 30 napos AI kurzust! 🎉</p>
<p>Ma lezárjuk a kurzust és meghatározzuk a következő lépéseket.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a teljes leckét →</a></p>
<p>Köszönjük, hogy elvégezted a kurzust! Folytasd a tanulást! 🚀</p>`
  }
];


// Helper function to generate lesson content
function buildLessonContent(entry: typeof lessonPlan[number]) {
  return entry.content;
}

/**
 * Generate 15 quiz questions for a lesson based on its content
 * 
 * What: Creates quiz questions covering key concepts from the lesson
 * Why: Provides assessment questions for lesson quizzes
 * 
 * Note: This generates questions based on lesson structure and key concepts.
 * Questions are tailored to each lesson's specific content.
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

  // Extract key concepts from lesson content
  const content = lesson.content.toLowerCase();
  const title = lesson.title;
  const day = lesson.day;

  // Generate questions based on lesson day and content structure
  // Each lesson gets 15 unique, meaningful questions
  
  // Base questions that work for most lessons
  const baseQuestions = [
    {
      question: `Mi a fő célja a(z) "${title}" leckének?`,
      correctAnswers: [
        `A lecke célja, hogy elsajátítsd a ${title.toLowerCase()} alapjait`,
        `Megtanulod, hogyan használd az AI-t a ${title.toLowerCase()} területén`,
        `Kialakítasz egy reális szemléletet a ${title.toLowerCase()} kapcsán`,
        `Gyakorlati készségeket szerzel a ${title.toLowerCase()} területén`
      ],
      wrongAnswers: [
        'Nincs konkrét cél',
        'Csak elméleti tudás',
        'Nem kell semmit tanulni',
        'Csak olvasni kell'
      ]
    },
    {
      question: `Mit tanulsz meg a(z) "${title}" leckében?`,
      correctAnswers: [
        'Gyakorlati készségeket és módszereket',
        'Hogyan használd az AI-t hatékonyan',
        'Kulcsfontosságú koncepciókat és technikákat',
        'Reális elvárásokat és korlátokat'
      ],
      wrongAnswers: [
        'Csak elméleti információkat',
        'Nem tanulsz semmit',
        'Csak általános ismereteket',
        'Felesleges információkat'
      ]
    }
  ];

  // Day-specific questions
  if (day === 1) {
    // Day 1: Mi az AI valójában – és mire NEM való? (curated 10)
    questions.push(
      {
        question: 'Mi az AI szerepe a mindennapi munkában?',
        options: [
          'Segítő eszköz, ami jó inputból jobb outputot ad',
          'Varázspálca, ami helyetted dönt',
          'Önálló stratégiai döntéshozó',
          'Csak fejlesztők használhatják'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.EASY,
        category: 'Course Specific'
      },
      {
        question: 'Mire NEM való az AI?',
        options: [
          'Kritikus döntésekre és személyes adatok kezelésére',
          'Gyors vázlat vagy első verzió írására',
          'Szöveg összefoglalására',
          'Dokumentumok átírására'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.EASY,
        category: 'Course Specific'
      },
      {
        question: 'Mi a legfontosabb szabály adatmegadáskor?',
        options: [
          'Ne adj meg személyes adatot, jelszót vagy bizalmas üzleti infót',
          'Minél több érzékeny adatot adj meg',
          'Mindig kérj kritikus döntést az AI-tól',
          'Nem számít, mit osztasz meg'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Miért kell iterálni az AI-válaszokon?',
        options: [
          'Az első válasz ritkán tökéletes, finomítással lesz használható',
          'Iteráció csak időpazarlás',
          'Az AI mindig elsőre tökéletes',
          'Iterálni csak fejlesztők tudnak'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Mi a különbség eszköz és varázslat között az AI-nál?',
        options: [
          'Az AI eszköz, ami inputot igényel; nem varázslat, ami mindent kitalál',
          'Az AI varázslat, ami tippből is érti a lényeget',
          'Az AI mindig pontos minden kontextus nélkül',
          'Nincs különbség, mindkettő ugyanaz'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Melyik állítás igaz az AI korlátairól?',
        options: [
          'A modell nem tud dönteni helyetted, csak javasolni',
          'Az AI jogilag vállalja a felelősséget',
          'Az AI mindig naprakész a legfrissebb adatokkal',
          'Az AI garantáltan hibátlan'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        category: 'Course Specific'
      },
      {
        question: 'Mi a helyes hozzáállás az AI válaszaihoz?',
        options: [
          'Ellenőrizd, pontosítsd, iteráld',
          'Vedd készpénznek és továbbítsd',
          'Mindig utasítsd vissza',
          'Ne adj feedbacket, mert nem számít'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        category: 'Course Specific'
      },
      {
        question: 'Mikor veszélyes az AI-t használni?',
        options: [
          'Ha emberi felülvizsgálat nélkül döntesz pénzügyi/HR/egészségügyi ügyekben',
          'Ha vázlatot kérsz egy emailhez',
          'Ha ötleteléshez használod',
          'Ha nyelvi hibákat javíttatsz'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        category: 'Course Specific'
      },
      {
        question: 'Miért fontos a jó input?',
        options: [
          'Jó input nélkül az AI könnyen melléfog',
          'Az input minősége nem számít',
          'Az AI kitalálja a hiányzó adatokat',
          'A rossz input is mindig jó outputot ad'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Mi a fő tanulság az első napról?',
        options: [
          'Az AI hasznos eszköz, de felelősen kell használni és iterálni',
          'Az AI mindent megold helyetted',
          'Az AI-t nem kell felügyelni',
          'Az AI minden döntést átvehet'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      }
    );
  } else if (day === 2) {
    // Day 2: A jó prompt 4 eleme (curated 10)
    questions.push(
      {
        question: 'Hány eleme van egy jó promptnak?',
        options: ['3', '4', '5', '6'],
        correctIndex: 1,
        difficulty: QuestionDifficulty.EASY,
        category: 'Course Specific'
      },
      {
        question: 'Melyik NEM tartozik a jó prompt 4 eleméhez?',
        options: ['Cél', 'Kontextus', 'Forma', 'Szín'],
        correctIndex: 3,
        difficulty: QuestionDifficulty.EASY,
        category: 'Course Specific'
      },
      {
        question: 'Mi a "Cél" elem szerepe?',
        options: [
          'Megmondja, mit szeretnél elérni (pl. írj emailt, összegezz, hasonlíts)',
          'Leírja a kért hangnemet',
          'Kiválasztja a formátumot',
          'Háttérinformációt ad'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Mi a "Kontextus" elem szerepe?',
        options: [
          'Háttér és részletek (pl. 30 perces meeting, ügyfél panasz)',
          'Megadja a kért hangnemet',
          'Formátumot határoz meg',
          'Csak a célt ismétli'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Mi a "Forma" elem szerepe?',
        options: [
          'Milyen struktúrát kérsz (bullet, táblázat, rövid bekezdés)',
          'Hangnem meghatározása',
          'Cél kijelölése',
          'Kontextus részletezése'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Mi a "Stílus" elem szerepe?',
        options: [
          'Hangnem/hangulat (hivatalos, barátságos, technikai)',
          'Formátum kijelölése',
          'Cél pontosítása',
          'Kontextus adása'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Melyik prompt tartalmazza mind a 4 elemet?',
        options: [
          'Írj udvarias, rövid emailt időpont-egyeztetéshez. Kontextus: 30 perces online meeting jövő hét kedden 10:00-kor. Stílus: üzleti. Forma: rövid bekezdés.',
          'Írj emailt időpont-egyeztetéshez.',
          'Email 30 perces meetinghez.',
          'Hivatalos email.'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        category: 'Course Specific'
      },
      {
        question: 'Miért fontos mind a 4 elem megadása?',
        options: [
          'Pontos válasz, kevesebb körözés, jobb minőség',
          'Rövidebb prompt mindig jobb',
          'Csak a cél számít',
          'Az AI kitalálja a hiányzó részeket'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        category: 'Course Specific'
      },
      {
        question: 'Melyik példára illik legjobban a "Kontextus" elem?',
        options: [
          'Ügyfél panasz emailje, 3 napja vár válaszra',
          'Írj emailt',
          'Hivatalos hangnem',
          'Bullet points formátum'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Mi a napi cél a 2. leckében?',
        options: [
          'Megérteni és gyakorolni a 4 elemet, hogy következetes válaszokat kapj',
          'Csak elméletet olvasni',
          'Megtanulni egyetlen prompt sablont',
          'Promptokat véletlenszerűen próbálgatni'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      }
    );
  } else if (day === 3) {
    // Day 3: Hogyan kérdezz vissza az AI-tól?
    questions.push(
      {
        question: 'Mi az iteráció az AI használatában?',
        options: [
          'A visszakérdezés és pontosítás folyamata',
          'Egyszer használjuk az AI-t',
          'Várjuk, hogy tökéletes legyen',
          'Nem kell semmit csinálni'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.EASY,
        category: 'Course Specific'
      },
      {
        question: 'Hogyan pontosíthatunk egy promptot?',
        options: [
          '"Rövidítsd 50%-kal" → "Rövidítsd 50%-kal, de tartsd meg a 3 fő üzenetet"',
          'Egyszerűen újra kérdezzük',
          'Nem lehet pontosítani',
          'Töröljük és kezdjük újra'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Mit jelent "Kérj példákat"?',
        options: [
          '"Adj 3 változatot: 1) rövid, 2) részletes, 3) bullet points"',
          'Kérj egy példát',
          'Ne kérj semmit',
          'Várj, amíg az AI ad egyet'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Miért fontos megadni a korlátokat?',
        options: [
          'Hogy az AI pontosan azt adja, amit szeretnénk (pl. "Max 100 szó")',
          'Hogy ne legyen túl hosszú',
          'Hogy ne legyen túl rövid',
          'Nem fontos'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        category: 'Course Specific'
      },
      {
        question: 'Melyik NEM tartozik az iterációhoz?',
        options: [
          'Egyszer használjuk, aztán elfelejtjük',
          'Pontosítunk',
          'Kérünk példákat',
          'Megadjuk a korlátokat'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        category: 'Course Specific'
      }
    );
  } else if (day === 4) {
    // Day 4: Stílus és hang – tanítsd meg "úgy írni, mint te"
    questions.push(
      {
        question: 'Miért tanítsd meg az AI-nak a stílusodat?',
        options: [
          'Következetes márkahang és kevesebb kézi átírás',
          'Hogy az AI önállóan döntsön helyetted',
          'Hogy hosszabb szövegeket írjon',
          'Hogy ne kelljen példát adnod'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.EASY,
        category: 'Course Specific'
      },
      {
        question: 'Mi az első lépés stílustanításnál?',
        options: [
          'Adj 1-2 saját mintaszöveget példának',
          'Azonnal kérj új szöveget',
          'Csak egy szóban írd le a hangot',
          'Kérj forrást a modellhez'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.EASY,
        category: 'Course Specific'
      },
      {
        question: 'Melyik jó stílus brief?',
        options: [
          '„Írj úgy, mint ebben a példában: [szöveg]. Hang: barátságos, tömör, példákkal. Struktúra: probléma, 3 bullet megoldás, CTA.”',
          '„Írj úgy, mint én.”',
          '„Legyen jobb a szöveg.”',
          '„Ne írj semmit.”'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Miért adj struktúrát (pl. bevezető–fő rész–zárás)?',
        options: [
          'Hogy az AI ne improvizáljon formátumot és kevesebb legyen az utómunka',
          'Hogy hosszabb legyen a szöveg',
          'Hogy elkerüld a CTA-t',
          'Hogy ne kelljen példát adni'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Melyik a jó visszajelzés stílus finomítására?',
        options: [
          '„Túl hivatalos, legyen közvetlenebb és rövidebb.”',
          '„Nem tetszik.”',
          '„Írj mást.”',
          '„Hosszabb legyen, de nem tudom hogyan.”'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Mi tartozik egy stílusprofilhoz?',
        options: [
          'Hang, mondathossz, szóhasználat, forma',
          'Csak a témakör',
          'Csak a CTA',
          'Csak a képek felsorolása'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Mit kérj a modell elemzésétől a mintaszövegre?',
        options: [
          'Hang, formalitás, mondathossz, szóhasználat, szókincs',
          'Csak a szavak számát',
          'Csak a dátumot',
          'Csak a címet'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.EASY,
        category: 'Course Specific'
      },
      {
        question: 'Mi a jó gyakorlat a stílustanításnál?',
        options: [
          'Adj több mintát, nevezd meg a hangot, adj struktúrát, majd adj feedbacket',
          'Ne adj mintát, csak kérést',
          'Kerüld a visszajelzést',
          'Mindig újrakezdés minta nélkül'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        category: 'Course Specific'
      },
      {
        question: 'Mi a haszna a „hang útmutatónak”?',
        options: [
          'Újrahasználható brief, hogy konzisztensen úgy írjon, mint te',
          'Csak egyszeri szöveghez jó',
          'Csak kézzel írható',
          'Nem érdemes elmenteni'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        category: 'Course Specific'
      },
      {
        question: 'Mit jelez egy jó stílus briefben a „CTA” rész?',
        options: [
          'Milyen cselekvést kérsz a végén (pl. válasz, időpont, letöltés)',
          'Hogy mennyi legyen a szöveg hossza',
          'Hogy milyen legyen a dátumformátum',
          'Hogy mit ne írjon bele'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      }
    );
  } else if (day === 5) {
    // Day 5: Biztonság & etika a gyakorlatban
    questions.push(
      {
        question: 'Melyik adatot nem adod be az AI-nak?',
        options: [
          'Jelszavak, tokenek, bankkártyaadatok',
          'Publikus marketing szöveg',
          'Általános iparági trendek',
          'Fikciós karakter neve'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.EASY,
        category: 'Course Specific'
      },
      {
        question: 'Mi a helyes anonimizálás névre?',
        options: [
          '"Kovács János" → "[Név]"',
          '"Kovács János" → "Jani barátom"',
          '"Kovács János" → "XY cég"',
          '"Kovács János" → "random"'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.EASY,
        category: 'Course Specific'
      },
      {
        question: 'Melyik közepes kockázatú tartalom?',
        options: [
          'Belső folyamatleírás anonimizálva',
          'Publikus blogcikk',
          'Bankkártyaszám',
          'Jelszólista'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Mikor kerüld az AI használatát?',
        options: [
          'Ha HR/jogi/pénzügyi döntést hoznál emberi felülvizsgálat nélkül',
          'Ha publikus szöveget akarsz összefoglalni',
          'Ha bullet listát kérsz saját jegyzethez',
          'Ha tárgyötleteket gyűjtesz'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Miért kérd meg az AI-t is anonimizálásra?',
        options: [
          'Kettős védelem: te is cserélsz, az AI is figyel, hogy ne idézze vissza a nyerset',
          'Felesleges, csak te tudod megoldani',
          'Hosszabb szöveg lesz tőle',
          'Így nem kell kontextust adni'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Mi az alap szabály, ha bizonytalan vagy?',
        options: [
          'Ne add be, vagy anonimizálj és rövidíts',
          'Mindig add be nyersen',
          'Kérj döntést az AI-tól',
          'Másold be a teljes adatbázist'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.EASY,
        category: 'Course Specific'
      },
      {
        question: 'Melyik jó prompt-rész biztonsághoz?',
        options: [
          '„Ne tárold és ne idézd vissza a nyers adatot; csak összefoglalót adj.”',
          '„Írj bármit, forrás nélkül.”',
          '„Használd a neveket pontosan.”',
          '„Adj meg minél több személyes adatot.”'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Miért jobb összefoglalót kérni nyers szöveg helyett?',
        options: [
          'Kevesebb adatot osztasz meg, kisebb a kitettség',
          'Hosszabb lesz a válasz',
          'Több személyes adat marad benne',
          'Nem lehet vele iterálni'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Melyik a helyes placeholder párosítás?',
        options: [
          'Email → [Email], Telefonszám → [Telefon]',
          'Email → [Cég], Telefonszám → [Dátum]',
          'Email → [Token], Telefonszám → [Jelszó]',
          'Email → [Ár], Telefonszám → [Összeg]'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.EASY,
        category: 'Course Specific'
      },
      {
        question: 'Melyik alacsony kockázatú tartalom?',
        options: [
          'Publikus blogbejegyzés újrafogalmazása',
          'HR döntés személyes adattal',
          'Szerződés nyers másolata',
          'Titkos pénzügyi előrejelzés'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        category: 'Course Specific'
      }
    );
  } else if (day === 6) {
    // Day 6: Email percek alatt – profi hangon
    questions.push(
      {
        question: 'Mi tartozik egy jó email promptba?',
        options: [
          'Cél, kontextus, forma, stílus, hossz',
          'Csak a téma',
          'Csak a hossz',
          'Csak a köszönés'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.EASY,
        category: 'Course Specific'
      },
      {
        question: 'Miért kérj CTA-t az email végére?',
        options: [
          'Hogy a címzett tudja, mit tegyen (válasz, időpont, jóváhagyás)',
          'Hogy hosszabb legyen az email',
          'Hogy elkerüld a válaszadást',
          'Csak dísznek'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Melyik jó prompt határidő módosításra?',
        options: [
          '„Írj udvarias, rövid emailt a határidő módosításáról. Kontextus: 2 nap csúszás, ok: beszállító. Stílus: empatikus, de határozott. Hossz: max 4 mondat. Adj új dátumot és CTA-t.”',
          '„Írj emailt a határidőről.”',
          '„Írj valamit.”',
          '„Írj hosszú regényt a csúszásról.”'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Miért jó két hangnemet kérni ugyanarra az emailre?',
        options: [
          'Hogy választhass a stílusok közül és pontosíthass',
          'Csak duplázza a munkát',
          'Felesleges, mert az első mindig jó',
          'Hogy elkerüld a CTA-t'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Mi egy jó projekt státusz email struktúrája?',
        options: [
          'Bevezető, helyzet, kockázat, következő lépés/CTA',
          'Csak köszönés és aláírás',
          'Csak dátum',
          'Hosszú történet kontextus nélkül'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Mikor használsz bullet listát emailben?',
        options: [
          'Ha teendőket, kockázatokat vagy opciókat kell tisztán felsorolni',
          'Ha nincs információ',
          'Ha regényt akarsz',
          'Ha el akarod rejteni a lényeget'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Mi a jó lépés, ha túl hosszú az AI emailje?',
        options: [
          'Kérd, hogy rövidítse X%-kal vagy max N mondatra',
          'Fogadd el és küldd el',
          'Dobd ki az egészet',
          'Írj egy teljesen más témát'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.EASY,
        category: 'Course Specific'
      },
      {
        question: 'Miért érdemes sign-off alternatívákat kérni?',
        options: [
          'Hogy illeszkedjen a címzetthez és a helyzethez',
          'Hogy hosszabb legyen a levél',
          'Hogy elkerüld a CTA-t',
          'Csak díszítésként'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        category: 'Course Specific'
      },
      {
        question: 'Mi gyorsítja az email írást legjobban?',
        options: [
          'Prompt sablon cél/kontextus/stílus/hossz változókkal',
          'Mindig nulláról kezdeni',
          'Hosszú magyarázat nélkül',
          'Csak a tárgy megadása'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Mi a legfontosabb megadni email promptnál?',
        options: [
          'Mit akarsz elérni és kinek szól (cél + kontextus)',
          'Csak a formátumot',
          'Csak a dátumot',
          'Csak az aláírást'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.EASY,
        category: 'Course Specific'
      }
    );
  } else if (day === 7) {
    // Day 7: Meeting jegyzetből teendőlista
    questions.push(
      {
        question: 'Melyik a három ajánlott kimeneti blokk meeting jegyzetből?',
        options: [
          'Összefoglaló, Döntések, Teendők',
          'Bevezető, Marketing, Footer',
          'Csak egy hosszú bekezdés',
          'Kizárólag teendők'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.EASY,
        category: 'Course Specific'
      },
      {
        question: 'Mi legyen a teendő sorban?',
        options: [
          'Feladat | Felelős | Határidő | Státusz/Next',
          'Csak a feladat neve',
          'Csak a dátum',
          'Csak a felelős'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Miért fontos külön „Döntések” szekció?',
        options: [
          'Hogy ne keveredjen a teendőkkel és visszakereshető legyen, mi dőlt el',
          'Hogy hosszabb legyen a dokumentum',
          'Hogy ne kelljen teendőket írni',
          'Csak díszítés miatt'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Mi a jó prompt minta meeting összefoglalóra?',
        options: [
          '„Összefoglaló 3–5 pontban, külön Döntések, külön Teendők (feladat | felelős | határidő | státusz). Jegyzet: [szöveg].”',
          '„Foglalj össze mindent.”',
          '„Írj valamit.”',
          '„Adj egy random listát.”'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Miért érdemes hiányzó határidőt javasoltatni az AI-val?',
        options: [
          'Gyors baseline, amit ember átnéz és jóváhagy',
          'Hogy az AI döntsön helyetted véglegesen',
          'Hogy elkerüld a felelős kijelölését',
          'Mert mindegy, mikorra készül el'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        category: 'Course Specific'
      },
      {
        question: 'Melyik input segít jó kimenetet adni?',
        options: [
          'Résztvevők/felelősök neve, téma, jegyzetek',
          'Csak a meeting címe',
          'Semmi, elég egy szó',
          'Csak a dátum'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.EASY,
        category: 'Course Specific'
      },
      {
        question: 'Mikor hasznos státusz mező (TODO/IN PROGRESS/BLOCKED)?',
        options: [
          'Ha követni akarod a feladat állapotát az akciólista mellett',
          'Ha nincs feladat',
          'Csak kreatív íráshoz',
          'Sosem hasznos'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        category: 'Course Specific'
      },
      {
        question: 'Miért jobb bullet formát kérni?',
        options: [
          'Átláthatóbb, gyorsan scannelhető',
          'Mindig hosszabb lesz',
          'Csak esztétika miatt',
          'Nem jobb, mindig bekezdés kell'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      }
    );
  } else if (day === 8) {
    // Day 8: Dokumentumok: brief, váz, összefoglaló
    questions.push(
      {
        question: 'Miért kezdj vázlattal dokumentumkészítéskor?',
        options: [
          'Könnyebb iterálni a szerkezeten és hiányokat felismerni',
          'Hogy az AI hosszabb szöveget írjon',
          'Csak időpazarlás',
          'Mert kötelező szabály'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.EASY,
        category: 'Course Specific'
      },
      {
        question: 'Melyik elem kötelező egy briefben?',
        options: [
          'Cél, Kontextus, Célközönség, Elvárások, Kizárások, Határidők',
          'Csak cím',
          'Csak határidő',
          'Csak egy bekezdésnyi leírás'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Mi a jó prompt egy blogvázlathoz?',
        options: [
          '„Adj vázlatot [téma] témában, max 6 pont, mindegyikhez 1 mondat.”',
          '„Írj blogot.”',
          '„Adj egy hosszú szöveget.”',
          '„Csak címet adj.”'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.EASY,
        category: 'Course Specific'
      },
      {
        question: 'Mi legyen egy jó összefoglalóban?',
        options: [
          'Fő üzenetek, döntések, következő lépések, tömör terjedelem',
          'Minden részlet szó szerint',
          'Semmi konkrétum',
          'Csak vélemények'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Miért kérj kizárásokat a briefben?',
        options: [
          'Hogy tiszta legyen, mi <em>nem</em scope, csökkenjen a félreértés',
          'Hogy hosszabb legyen',
          'Mert kötelező űrlap',
          'Hogy ne legyen cél megadva'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Melyik jó struktúra prompt briefhez?',
        options: [
          '„Struktúra: Cél, Kontextus, Célközönség, Elvárások, Kizárások, Határidők/Mérőszámok.”',
          '„Írj valamit erről.”',
          '„Csak kontextust írj.”',
          '„Adj egy sort.”'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Miért hasznos 5 pontos összefoglalót kérni?',
        options: [
          'Rövid, scannelhető, a lényegre fókuszál',
          'Hosszabb szöveget ad',
          'Csak esztétika',
          'Mert mindig jobb, ha sok szó van'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        category: 'Course Specific'
      }
    );
  } else if (day === 9) {
    // Day 9: Táblázat-gondolkodás AI-val
    questions.push(
      {
        question: 'Mi az első lépés táblázat kérésénél?',
        options: [
          'Oszlopok definiálása (fejlécek)',
          'Azonnal CSV export kérése oszlopok nélkül',
          'Véletlenszerű formátum',
          'Nincs szükség bemenetre'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.EASY,
        category: 'Course Specific'
      },
      {
        question: 'Melyik oszlopkészlet ad jó feladat táblát?',
        options: [
          'Feladat | Felelős | Határidő | Prioritás | Státusz',
          'Csak Feladat',
          'Csak Határidő',
          'Csak Prioritás'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.EASY,
        category: 'Course Specific'
      },
      {
        question: 'Miért kérj CSV-t is?',
        options: [
          'Könnyű export/spreadsheet import',
          'Hosszabb szövegért',
          'Hogy elrejtsd az adatot',
          'Nem érdemes kérni'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Mi a jó prompt pro/kontra táblára?',
        options: [
          '„Adj pro/kontra táblát: Opció | Előny | Hátrány | Kockázat | Ajánlás.”',
          '„Írj valamit.”',
          '„Csak előnyöket írj.”',
          '„Csak hátrányokat írj.”'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Miért hasznos előre megadni prioritást/státuszt oszlopként?',
        options: [
          'Jobban átlátható és azonnal használható, kevesebb kézi munka',
          'Hogy több hibát okozzon',
          'Csak dísz',
          'Nem hasznos'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        category: 'Course Specific'
      },
      {
        question: 'Mitől lesz használható a táblázat?',
        options: [
          'Pontos oszlopnevek, teljes sorok, jól formázott adat',
          'Véletlenszerű elrendezés',
          'Hiányzó felelősök',
          'Csak szöveges bekezdés'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      }
    );
  } else if (day === 10) {
    // Day 10: Ismétlés & prompt-debug nap
    questions.push(
      {
        question: 'Mi a leggyakoribb prompt hiba?',
        options: [
          'Hiányzik a kontextus/cél/forma/stílus',
          'Túl sok kontextus',
          'Mindig rossz a hossz',
          'Nincs ilyen'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.EASY,
        category: 'Course Specific'
      },
      {
        question: 'Mi a 3 lépéses debug folyamat első lépése?',
        options: [
          'Diagnózis: mi hiányzik a promptból',
          'Kérj új választ magyarázat nélkül',
          'Adj véletlen feedbacket',
          'Másold be ugyanazt újra'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.EASY,
        category: 'Course Specific'
      },
      {
        question: 'Melyik jó pontosítás hosszra?',
        options: [
          '„Rövidítsd 30%-kal, max 4 mondat.”',
          '„Írj hosszabbat.”',
          '„Legyen sokkal több szó.”',
          '„Írj, amit akarsz.”'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Miért érdemes A/B tesztelni két promptot?',
        options: [
          'Hogy lásd, melyik ad jobb, használhatóbb választ',
          'Hogy hosszabb legyen a folyamat',
          'Nem érdemes, elég egy',
          'Mert az AI úgyis mindegy'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        category: 'Course Specific'
      },
      {
        question: 'Melyik jó feedback egy „rossz” válaszra?',
        options: [
          '„Hiányzik a CTA és túl hosszú. Rövidítsd 50%-kal, adj egyértelmű kérést a végére.”',
          '„Nem jó.”',
          '„Írj mást.”',
          '„Legyen szebb.”'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Miért kérj formátumváltást (bullet vs bekezdés)?',
        options: [
          'Más formátum gyakran használhatóbb, gyorsabban áttekinthető',
          'Mindig rosszabb',
          'Felesleges',
          'Csak díszítés miatt'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Mit vizsgálj két válasz összehasonlításakor?',
        options: [
          'Pontosság, tömörség, hiányzó elemek (cél/kontextus/forma/stílus/CTA)',
          'Csak a hosszt',
          'Csak a dátumot',
          'Csak a szóközöket'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        category: 'Course Specific'
      }
    );
  }

  // Fill remaining questions with lesson-specific questions
  // These are based on the lesson structure and key concepts
  const remainingCount = 15 - questions.length;
  for (let i = 0; i < remainingCount; i++) {
    const qNum = questions.length + 1;
    const difficulty = qNum <= 5 ? QuestionDifficulty.EASY : qNum <= 10 ? QuestionDifficulty.MEDIUM : QuestionDifficulty.HARD;
    
    // Create questions based on lesson content structure
    if (content.includes('napi cél')) {
      questions.push({
        question: `Mi a napi cél a(z) "${title}" leckében?`,
        options: [
          'Gyakorlati készségek elsajátítása',
          'Csak elméleti ismeretek',
          'Nincs konkrét cél',
          'Nem kell semmit tanulni'
        ],
        correctIndex: 0,
        difficulty,
        category: 'Course Specific'
      });
    } else if (content.includes('kulcs tanulság')) {
      questions.push({
        question: `Mi a kulcs tanulság a(z) "${title}" leckéből?`,
        options: [
          'A lecke fő üzenete és gyakorlati alkalmazása',
          'Nincs tanulság',
          'Csak elmélet',
          'Nem fontos'
        ],
        correctIndex: 0,
        difficulty,
        category: 'Course Specific'
      });
    } else {
      // Generic question based on lesson title
      questions.push({
        question: `Mi a legfontosabb a(z) "${title}" leckében?`,
        options: [
          'A gyakorlati alkalmazás és megértés',
          'Csak az elméleti tudás',
          'Nincs fontos dolog',
          'Nem kell semmit megtanulni'
        ],
        correctIndex: 0,
        difficulty,
        category: 'Course Specific'
      });
    }
  }

  return questions.slice(0, 15); // Ensure exactly 15 questions
}

async function seed() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI not set');
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.amanoba.com';

  // Process email bodies to replace placeholders with actual values
  // This needs to happen after appUrl is defined
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
          category: 'ai',
          difficulty: 'beginner',
          estimatedHours: 7.5,
          tags: ['ai', 'productivity', 'workflows', 'business'],
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
    
    // Process email body: replace template literal placeholders with actual values
    // Keep {{dayNumber}}, {{courseName}}, {{lessonTitle}}, {{lessonContent}} for email service
    let emailBody = entry.emailBody;
    if (emailBody) {
      // Replace {{APP_URL}} and ${COURSE_ID} with actual values (they appear as literal strings in the template)
      emailBody = emailBody.replace(/\$\{appUrl\}/g, appUrl);
      emailBody = emailBody.replace(/\$\{COURSE_ID\}/g, COURSE_ID);
      // Replace any hardcoded day numbers in URLs with placeholder
      emailBody = emailBody.replace(new RegExp(`/day/${entry.day}"`, 'g'), '/day/{{dayNumber}}"');
      emailBody = emailBody.replace(new RegExp(`/day/${entry.day}>`, 'g'), '/day/{{dayNumber}}>');
    } else {
      // Default template
      emailBody = [
        `<h1>{{courseName}}</h1>`,
        `<h2>{{dayNumber}}. nap: {{lessonTitle}}</h2>`,
        '<div>{{lessonContent}}</div>',
        `<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Megnyitom a leckét →</a></p>`
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
            successThreshold: 100, // Need all 5 correct answers
            questionCount: 5, // Show 5 questions
            poolSize: 15, // 15 questions in pool (system selects 5 randomly)
            required: true, // Quiz is required to complete lesson
          },
          metadata: {
            estimatedMinutes: 10,
            difficulty: 'beginner' as const,
            tags: ['ai', 'napi-gyakorlat']
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

  await mongoose.disconnect();
  console.log('✅ Disconnected from MongoDB');
  console.log(`\n🎉 Course ${COURSE_ID} seeded successfully!`);
}

seed().catch((error) => {
  console.error('❌ Seed failed:', error);
  process.exit(1);
});
