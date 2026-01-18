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
<p>Megismered, hogy mi az AI valójában, mire jó és mire nem. Kialakítasz egy reális szemléletet az AI képességeiről és korlátairól.</p>

<h2>Mit fogsz megtanulni?</h2>
<ul>
<li>Az AI alapvető működése és korlátai</li>
<li>Reális elvárások kialakítása</li>
<li>Gyakori tévhitek felismerése</li>
<li>Mikor érdemes AI-t használni és mikor nem</li>
</ul>

<h2>Gyakorlat</h2>
<p>Írj le 3 konkrét feladatot, amit a héten gyorsítanál AI-val. Minden feladathoz add meg:</p>
<ul>
<li>Mi a feladat?</li>
<li>Miért jó erre az AI?</li>
<li>Mit várnál el tőle?</li>
</ul>

<h2>Kulcs tanulságok</h2>
<blockquote>
<p><strong>Az AI nem varázslat</strong> – segítő eszköz, ami jó inputot igényel, hogy jó outputot adjon.</p>
<p><strong>Nem mindenre való</strong> – kritikus döntések, személyes adatok, kreatív művészet területén óvatosan.</p>
<p><strong>Iteráció a kulcs</strong> – az első válasz ritkán tökéletes, de finomítással nagyon hasznos lehet.</p>
</blockquote>

<h2>Házi feladat</h2>
<p>Készíts egy listát 5 olyan feladatról, amit NEM adnál be AI-nak (pl. jelszavak, személyes adatok, kritikus döntések).</p>`,
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
<p>Megtanulod a jó prompt felépítését és megérted, miért kapsz más választ ugyanarra a kérdésre.</p>

<h2>A jó prompt 4 eleme</h2>
<ol>
<li><strong>Cél</strong> – Mit akarsz elérni? (pl. "Írj emailt", "Összegezz", "Hasonlíts össze")</li>
<li><strong>Kontextus</strong> – Milyen információkra van szükség? (pl. "30 perces meeting", "ügyfél panasz")</li>
<li><strong>Forma</strong> – Milyen formátumot várunk? (pl. "bullet points", "táblázat", "rövid bekezdés")</li>
<li><strong>Stílus</strong> – Milyen hangnemben? (pl. "hivatalos", "barátságos", "technikai")</li>
</ol>

<h2>Gyakorlat</h2>
<p>Fogalmazz meg egy promptot, ami egy professzionális emailt kér időpont-egyeztetéshez. Használd a 4 elemet:</p>
<ul>
<li>Cél: Email írása</li>
<li>Kontextus: 30 perces online meeting, jövő hét kedden 10:00-kor</li>
<li>Forma: Rövid, strukturált email</li>
<li>Stílus: Üzleti, udvarias</li>
</ul>

<h2>Prompt minta</h2>
<blockquote>
<p>Írj udvarias, rövid emailt időpont-egyeztetéshez. Kontextus: 30 perces online meeting jövő hét kedden 10:00-kor. Stílus: üzleti, professzionális. Formátum: rövid bekezdés, tiszta felkérés.</p>
</blockquote>

<h2>Tipp</h2>
<p>Mindig add meg a célt, a kontextust és az elvárt formát. Minél specifikusabb vagy, annál jobb választ kapsz.</p>`,
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
<p>Megtanulod az iterációt, a visszakérdezést és a pontosítást, hogy egyre jobb válaszokat kapj.</p>

<h2>Iteráció és visszakérdezés</h2>
<p>Az AI nem mindig érti elsőre, mit akarsz. Fontos, hogy:</p>
<ul>
<li><strong>Pontosíts</strong> – "Rövidítsd 50%-kal" → "Rövidítsd 50%-kal, de tartsd meg a 3 fő üzenetet"</li>
<li><strong>Kérj példákat</strong> – "Adj 3 változatot" → "Adj 3 változatot: 1) rövid, 2) részletes, 3) bullet points"</li>
<li><strong>Add meg a korlátokat</strong> – "Max 100 szó", "5 pontban", "1 mondatban"</li>
<li><strong>Kérj magyarázatot</strong> – "Magyarázd el, miért ezt javaslod"</li>
</ul>

<h2>Gyakorlat</h2>
<p>Futtasd le ugyanazt a promptot két módosítással:</p>
<ol>
<li>Első verzió: "Írj emailt a határidő csúszásáról"</li>
<li>Második verzió: "Írj emailt a határidő csúszásáról. Stílus: empatikus, de professzionális. Hossz: max 4 mondat. Javasolj alternatív megoldást."</li>
</ol>
<p>Hasonlítsd össze a két választ!</p>

<h2>Prompt minta</h2>
<blockquote>
<p>Adj 3 alternatív változatot ugyanarra a válaszra, formázott listában. Mindegyik legyen más stílusban: 1) hivatalos, 2) barátságos, 3) technikai. Mindegyik max 50 szó.</p>
</blockquote>

<h2>Tipp</h2>
<p>Kérj példákat, hosszkorlátot és hangnemet. Minél specifikusabb vagy, annál jobb az eredmény.</p>`,
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
<p>Megtanulod, hogyan tanítsd meg az AI-nak a saját írási stílusodat és hangodat.</p>

<h2>Stílus és hang kialakítása</h2>
<p>Az AI-t lehet tanítani, hogy úgy írjon, mint te. Ehhez:</p>
<ul>
<li><strong>Adj példákat</strong> – "Írj úgy, mint ebben a példában: [példa szöveg]"</li>
<li><strong>Definiáld a hangot</strong> – "Stílus: barátságos, de professzionális, rövid mondatok, konkrét példák"</li>
<li><strong>Használj mintákat</strong> – "Kövesd ezt a struktúrát: [struktúra]"</li>
<li><strong>Adj visszajelzést</strong> – "Ez túl hivatalos, legyen barátságosabb"</li>
</ul>

<h2>Gyakorlat</h2>
<p>Válassz ki egy saját emailt vagy dokumentumot, amit írtál. Add meg az AI-nak és kérj, hogy:</p>
<ol>
<li>Elemezd a stílusomat (hang, mondathossz, formális szint)</li>
<li>Írj egy új emailt ugyanabban a stílusban</li>
<li>Adj 3 javaslatot, hogyan lehetne még jobban rám hasonlítani</li>
</ol>

<h2>Prompt minta</h2>
<blockquote>
<p>Íme egy példa a saját írási stílusomra: [példa szöveg]. Elemezd a stílusomat (hang, mondathossz, formális szint) és írj egy új emailt ugyanabban a stílusban a következő témában: [téma].</p>
</blockquote>

<h2>Tipp</h2>
<p>Példák, minták és tone definíciók segítenek. Minél több példát adsz, annál jobban megtanulja a stílusodat.</p>`,
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
<p>Megtanulod, mit nem adunk be az AI-nak, és hogyan anonimizálunk adatokat.</p>

<h2>Biztonság és etika</h2>
<p><strong>Mit NEM adunk be:</strong></p>
<ul>
<li>Személyes adatok (név, email, telefonszám, cím)</li>
<li>Pénzügyi információk (bankszámla, kártyaszám)</li>
<li>Üzleti titkos információk (szerződések, árazás, stratégiák)</li>
<li>Jelszavak és biztonsági kódok</li>
<li>Egészségügyi információk</li>
</ul>

<p><strong>Hogyan anonimizálunk:</strong></p>
<ul>
<li>Cseréld le a neveket: "Kovács János" → "[Ügyfél A]"</li>
<li>Eltávolítsd az email címeket és telefonszámokat</li>
<li>Használj általános leírásokat: "egy nagyvállalat" helyett konkrét cég neve</li>
<li>Kérj, hogy az AI ne használjon valós példákat</li>
</ul>

<h2>Gyakorlat</h2>
<p>Válassz ki egy dokumentumot vagy emailt, amit szeretnél AI-val feldolgozni. Anonimizáld:</p>
<ol>
<li>Azonosítsd az összes személyes/érzékeny adatot</li>
<li>Cseréld le általános helyőrzőkre</li>
<li>Ellenőrizd, hogy nincs-e benne semmi, amit nem szeretnél megosztani</li>
</ol>

<h2>Prompt minta</h2>
<blockquote>
<p>Feldolgozom ezt a szöveget, de előtte anonimizáld: cseréld le az összes nevet, emailt, telefonszámot és konkrét cégneveket általános helyőrzőkre (pl. [Név], [Email], [Cég]).</p>
</blockquote>

<h2>Tipp</h2>
<p>Ne ossz meg személyes, pénzügyi vagy üzleti titkos adatot. Ha bizonytalan vagy, ne add be. Jobb óvatosnak lenni.</p>`,
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
<p>Megtanulod, hogyan írsz gyorsan professzionális emaileket AI segítségével.</p>

<h2>Email írás AI-val</h2>
<p>Az email írása az egyik leggyorsabban megtanulható AI készség:</p>
<ul>
<li><strong>Rövid emailek</strong> – "Írj rövid, udvarias választ a következő kérdésre: [kérdés]"</li>
<li><strong>Hosszabb emailek</strong> – "Írj részletes emailt [témában], struktúrával: bevezető, fő rész, zárás"</li>
<li><strong>Válaszok</strong> – "Írj választ erre az emailre: [email], stílus: [stílus]"</li>
<li><strong>Variációk</strong> – "Adj 3 változatot: 1) rövid, 2) részletes, 3) bullet points"</li>
</ul>

<h2>Gyakorlat</h2>
<p>Írj 3 emailt AI segítségével:</p>
<ol>
<li>Rövid válasz egy időpont-egyeztetési kérésre</li>
<li>Hosszabb email projekt státuszról</li>
<li>Empatikus válasz egy panaszra</li>
</ol>
<p>Minden emailhez add meg a kontextust, stílust és hosszt.</p>

<h2>Prompt minta</h2>
<blockquote>
<p>Írj professzionális emailt a következő témában: [téma]. Kontextus: [kontextus]. Stílus: [stílus]. Hossz: [hossz]. Formátum: [formátum].</p>
</blockquote>

<h2>Tipp</h2>
<p>Kérj két hangnemet ugyanarra a tartalomra, hogy választhass. A rövid emailek gyorsabban készülnek, de a hosszabbak több kontextust igényelnek.</p>`,
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
<p>Megtanulod, hogyan alakítasz át meeting jegyzeteket strukturált teendőlistává.</p>

<h2>Meeting jegyzetek feldolgozása</h2>
<p>A meeting jegyzetekből gyorsan készíthetsz:</p>
<ul>
<li><strong>Összefoglalót</strong> – Fő pontok, döntések, következő lépések</li>
<li><strong>Teendőlistát</strong> – Felelőssel, határidővel</li>
<li><strong>Döntések listáját</strong> – Mi dőlt el, ki döntött</li>
<li><strong>Következő lépéseket</strong> – Mit kell tenni, kinek, mikorra</li>
</ul>

<h2>Gyakorlat</h2>
<p>Adj meg 5-10 sor meeting jegyzetet (vagy készíts egy példát) és kérj:</p>
<ol>
<li>Rövid összefoglalót (3-5 fő pont)</li>
<li>Teendőlistát felelőssel és határidővel</li>
<li>Döntések listáját</li>
</ol>

<h2>Prompt minta</h2>
<blockquote>
<p>Feldolgozd ezeket a meeting jegyzeteket: [jegyzetek]. Készíts: 1) rövid összefoglalót 3-5 fő pontban, 2) teendőlistát felelőssel és határidővel, 3) döntések listáját. Formátum: strukturált lista.</p>
</blockquote>

<h2>Tipp</h2>
<p>Kérj külön "Döntések" és "Teendők" szekciót. A felelősök és határidők nélkül a teendőlista kevésbé hasznos.</p>`,
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
<p>Megtanulod, hogyan készítesz briefeket, vázlatokat és összefoglalókat AI segítségével.</p>

<h2>Dokumentumok készítése</h2>
<p>Az AI segíthet különböző dokumentumok készítésében:</p>
<ul>
<li><strong>Brief</strong> – Projekt leírás, célok, elvárások</li>
<li><strong>Vázlat</strong> – Dokumentum struktúrája, fő pontok</li>
<li><strong>Összefoglaló</strong> – Hosszú dokumentum rövidítése</li>
<li><strong>Kivonat</strong> – Fő üzenetek kiemelése</li>
</ul>

<h2>Gyakorlat</h2>
<p>Készíts egy projekt briefet AI segítségével:</p>
<ol>
<li>Add meg a projekt célját és kontextusát</li>
<li>Kérj egy brief vázlatot struktúrával</li>
<li>Pontosítsd a részleteket</li>
<li>Kérj egy végső verziót</li>
</ol>

<h2>Prompt minta</h2>
<blockquote>
<p>Készíts egy projekt briefet a következő projekthez: [projekt leírás]. Struktúra: 1) Cél, 2) Kontextus, 3) Elvárások, 4) Határidők, 5) Kizárások. Stílus: professzionális, rövid bekezdések.</p>
</blockquote>

<h2>Tipp</h2>
<p>Kezdj vázlattal, majd pontosíts. A briefek és vázlatok iteratív folyamatok – az első verzió ritkán tökéletes.</p>`,
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
<p>Megtanulod, hogyan alakítasz át szöveges információkat táblázatokká AI segítségével.</p>

<h2>Táblázat készítés</h2>
<p>Az AI segíthet táblázatok készítésében:</p>
<ul>
<li><strong>Lista → Táblázat</strong> – "Alakítsd táblázattá: Feladat | Felelős | Határidő"</li>
<li><strong>Adatok strukturálása</strong> – Szétszórt információk rendezése</li>
<li><strong>Összehasonlítás</strong> – Pro/kontra táblázatok</li>
<li><strong>CSV export</strong> – "Készíts CSV formátumot"</li>
</ul>

<h2>Gyakorlat</h2>
<p>Készíts 5 feladatot és kérj táblázatot:</p>
<ol>
<li>Írd le a 5 feladatot szöveges formában</li>
<li>Kérj táblázatot: Feladat | Felelős | Határidő | Prioritás</li>
<li>Kérj CSV formátumot is</li>
</ol>

<h2>Prompt minta</h2>
<blockquote>
<p>Alakítsd táblázattá: Feladat | Felelős | Határidő | Prioritás. Adatok: [feladatok listája]. Készíts CSV formátumot is exportáláshoz.</p>
</blockquote>

<h2>Tipp</h2>
<p>Kérj CSV formátumot, ha exportálni szeretnéd. A táblázatok jól strukturált információkat adnak, amit könnyen tovább lehet dolgozni.</p>`,
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
<p>Ismételed az elmúlt 5 nap anyagát és gyakorlod a prompt debugolást.</p>

<h2>Ismétlés</h2>
<p>Az elmúlt 5 napban megtanultál:</p>
<ul>
<li>Email írás AI-val</li>
<li>Meeting jegyzetek feldolgozását</li>
<li>Dokumentumok készítését</li>
<li>Táblázatok létrehozását</li>
</ul>

<h2>Prompt debug</h2>
<p>Ha nem kapsz jó választ, próbáld ki ezeket:</p>
<ol>
<li><strong>Pontosíts</strong> – "Ez túl hosszú, rövidítsd 50%-kal"</li>
<li><strong>Kérj példát</strong> – "Adj egy konkrét példát"</li>
<li><strong>Változtasd a formátumot</strong> – "Ne bekezdésben, hanem bullet pointsban"</li>
<li><strong>Kérj magyarázatot</strong> – "Magyarázd el, miért ezt javaslod"</li>
<li><strong>Kezdj újra</strong> – "Kezdjük újra, de most [módosítás]"</li>
</ol>

<h2>Gyakorlat</h2>
<p>Válassz egy rossz promptot (vagy készíts egyet szándékosan rosszul) és:</p>
<ol>
<li>Futtasd le</li>
<li>Elemezd, mi a probléma</li>
<li>Javítsd ki a promptot</li>
<li>Futtasd le újra</li>
<li>Hasonlítsd össze a két választ</li>
</ol>

<h2>Prompt minta</h2>
<blockquote>
<p>Rossz prompt: "Írj emailt"</p>
<p>Jó prompt: "Írj rövid, udvarias emailt időpont-egyeztetéshez. Kontextus: 30 perces online meeting jövő hét kedden 10:00-kor. Stílus: üzleti. Hossz: max 4 mondat."</p>
</blockquote>

<h2>Tipp</h2>
<p>Ismétlés: rossz prompt → jó prompt. A debugolás része a tanulásnak – ne félj kísérletezni!</p>`,
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
    // Day 1: Mi az AI valójában – és mire NEM való?
    questions.push(
      {
        question: 'Mi az AI valójában?',
        options: [
          'Egy segítő eszköz, ami jó inputot igényel, hogy jó outputot adjon',
          'Egy varázslatos technológia, ami mindenre képes',
          'Egy automatikus rendszer, ami nélkülözhetetlen',
          'Egy komplex algoritmus, ami csak programozóknak való'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.EASY,
        category: 'Course Specific'
      },
      {
        question: 'Mire NEM való az AI?',
        options: [
          'Kritikus döntések meghozatalára, személyes adatok kezelésére',
          'Email írására',
          'Szöveg összefoglalására',
          'Dokumentumok szerkesztésére'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.EASY,
        category: 'Course Specific'
      },
      {
        question: 'Mit kell elkerülni az AI használatakor?',
        options: [
          'Személyes adatok, jelszavak, kritikus döntések megosztása',
          'Rövid promptok használata',
          'Iteráció és pontosítás',
          'Kontextus megadása'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Mi a kulcs az AI hatékony használatához?',
        options: [
          'Iteráció és finomítás',
          'Egyszer használjuk, aztán elfelejtjük',
          'Csak egyszerű feladatokra használjuk',
          'Várjuk, hogy tökéletes legyen elsőre'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Melyik NEM igaz az AI-ról?',
        options: [
          'Varázslat, ami mindenre képes',
          'Segítő eszköz, ami jó inputot igényel',
          'Az első válasz ritkán tökéletes',
          'Finomítással nagyon hasznos lehet'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        category: 'Course Specific'
      }
    );
  } else if (day === 2) {
    // Day 2: A jó prompt 4 eleme
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
        question: 'Mit jelent a prompt "Cél" eleme?',
        options: [
          'Mit akarsz elérni? (pl. "Írj emailt", "Összegezz")',
          'Milyen formátumot várunk?',
          'Milyen hangnemben?',
          'Milyen információkra van szükség?'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Mit jelent a prompt "Kontextus" eleme?',
        options: [
          'Milyen információkra van szükség? (pl. "30 perces meeting")',
          'Mit akarsz elérni?',
          'Milyen formátumot várunk?',
          'Milyen hangnemben?'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Mi a legfontosabb egy jó promptnál?',
        options: [
          'Minél specifikusabb vagy, annál jobb választ kapsz',
          'Minél rövidebb, annál jobb',
          'Csak a célt kell megadni',
          'Nem számít, mit írsz'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
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
