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
const COURSE_NAME = '30-Day AI Catch-Up Program';
const COURSE_DESCRIPTION = '30 napos, gyakorlati AI-kurzus kezdőknek és lemaradóknak: rövid, fókuszált leckékkel, konkrét példákkal, önálló és vezetett gyakorlatokkal, hogy azonnal használható promptokat, workflow-kat és biztonsági rutinokat építs be a mindennapi munkádba.';

// Complete lesson plan based on the table of contents
const lessonPlan = [
  // 1-5. nap · Alapok & szemlélet
  {
    day: 1,
    title: 'Mi az AI valójában – és mire NEM való?',
    content: `<h1>Mi az AI valójában – és mire NEM való?</h1>
<p><em>Eszköz, nem varázslat</em></p>
<p>Ez a lecke segít tisztán látni, hogy az AI <strong>eszköz</strong>, amely jó input mellett jó outputot ad – de nem dönt helyetted, és nem vállal felelősséget. A cél, hogy tudatosan és biztonságosan használd.</p>

<hr />
<h2>Napi cél</h2>
<ul>
<li>Értsd meg, mire való és mire nem való az AI</li>
<li>Ismerd fel a kockázatos use case-eket</li>
<li>Tudd, miért ritkán tökéletes az első válasz</li>
<li>Írd össze a saját „AI használati térképed”</li>
</ul>

<hr />
<h2>Miért nem varázslat?</h2>
<p>Az AI nem „érti” a szándékod – csak a leírt szöveget. Jó input → jobb output.</p>
<ul>
<li>Nem dönt: javasol, neked kell ellenőrizni</li>
<li>Nem tudja a céges kontextust, ha nem adod meg</li>
<li>Nem vállal felelősséget: a QA a tiéd</li>
</ul>

<hr />
<h2>Mire NEM való?</h2>
<ul>
<li>Kritikus döntések (pénzügy, HR, egészségügy) emberi felülvizsgálat nélkül</li>
<li>Személyes adatok, jelszavak, bizalmas információk kezelése</li>
<li>Jogi vagy orvosi tanács helyettesítése</li>
</ul>

<hr />
<h2>Hogyan használd biztonságosan?</h2>
<ul>
<li>Anonimizáld az adatokat, ahol lehet</li>
<li>Kérj több változatot, majd válassz</li>
<li>Iterálj: pontosíts, adj példát, adj korlátot</li>
<li>Ellenőrizd a tényeket (számok, dátumok, források)</li>
</ul>

<hr />
<h2>Gyenge vs. jó prompt</h2>
<p><strong>Gyenge:</strong> „Írj egy emailt egy ügyfélnek.” (általános, semmitmondó)</p>
<p><strong>Jó:</strong> „Írj udvarias, rövid emailt egy panaszos ügyfélnek, aki tegnap reklamált. Stílus: empatikus, de professzionális. Hossz: max 4 mondat.”</p>

<hr />
<h2>Példák (hol hasznos / hol nem)</h2>
<ul>
<li><strong>Hasznos:</strong> vázlat, összefoglaló, ötletlista, első draft</li>
<li><strong>Nem elég:</strong> jogi nyilatkozat, orvosi diagnózis, bizalmas adat bevitele</li>
</ul>

<hr />
<h2>Gyakorlat (vezetett) – AI használati térkép</h2>
<ol>
<li>Írj le 3 feladatot, amit AI-val gyorsítanál.</li>
<li>Mindenhez add meg: mi a feladat, mit vársz az AI-tól, milyen kockázatot látsz.</li>
<li>Jelöld, hogy van-e benne érzékeny adat. Ha igen, anonimizáld.</li>
</ol>

<hr />
<h2>Gyakorlat (önálló) – Tiltólista</h2>
<p>Készíts listát 5 feladatról, amit nem bízol az AI-ra (pl. jelszavak, döntések, érzékeny ügyfelek). Írd mellé: miért nem, és mi legyen helyette (emberi review, manuális lépés).</p>

<hr />
<h2>Tippek</h2>
<ul>
<li>Az AI eszköz. Te vagy a rendező: adj kontextust, célt, korlátot.</li>
<li>Az első válasz csak kiindulópont. Iterálj.</li>
<li>Mindig legyen QA lépés: forrás, disclaimer, ellenőrzés.</li>
</ul>

<hr />
<h2>Opcionális mélyítés</h2>
<ul>
<li>OpenAI – Responsible AI: <a href="https://openai.com/policies/usage-policies" target="_blank" rel="noreferrer">https://openai.com/policies/usage-policies</a></li>
<li>Ethan Mollick – One Useful Thing: <a href="https://www.oneusefulthing.org" target="_blank" rel="noreferrer">https://www.oneusefulthing.org</a></li>
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
    content: `<h1>A jó prompt 4 eleme</h1>
<p><em>Hogyan irányítsd az AI válaszát</em></p>
<p>Ma megtanulod a jó prompt felépítését, és megérted, miért kapsz teljesen eltérő válaszokat ugyanarra a kérdésre. A cél: tudatosan irányítani a kimenetet.</p>

<hr />
<h2>Napi cél</h2>
<ul>
<li>Tudatosan megfogalmazni a promptot</li>
<li>Irányítani a válasz minőségét</li>
<li>Felismerni, miért „félreért” néha a modell</li>
<li>Pontosabb, használhatóbb outputot kérni</li>
</ul>

<hr />
<h2>Miért kapsz más választ ugyanarra a kérdésre?</h2>
<p>Az AI nem érti a szándékod, csak a leírt szöveget. Két hasonló kérés mögött más elvárás lehet.</p>
<p><strong>Gyenge:</strong> „Írj egy emailt egy ügyfélnek.”<br /><strong>Jobb:</strong> „Írj rövid, udvarias emailt egy panaszos ügyfélnek, aki tegnap reklamált.”</p>

<hr />
<h2>A jó prompt 4 eleme</h2>
<ol>
<li><strong>Cél</strong> – Mit akarsz elérni? (pl. „Írj emailt”, „Összegezz”, „Adj tanácsot”)</li>
<li><strong>Kontextus</strong> – Milyen helyzetben vagyunk? (pl. „30 perces online meeting”, „Ügyfélpanasz késés miatt”)</li>
<li><strong>Forma</strong> – Milyen formátumot vársz? (pl. bullet lista, táblázat, rövid bekezdés)</li>
<li><strong>Stílus</strong> – Milyen hangnemben szóljon? (pl. üzleti, barátságos, technikai, motiváló)</li>
</ol>

<hr />
<h2>Példák: gyenge vs. jó prompt</h2>
<p><strong>Gyenge:</strong> Írj egy emailt időpont-egyeztetéshez. <em>Eredmény:</em> általános, semmitmondó.</p>
<p><strong>Jó:</strong> Írj udvarias, rövid emailt időpont-egyeztetéshez. Kontextus: 30 perces online meeting jövő hét kedden 10:00-kor. Stílus: üzleti, professzionális. Formátum: egy rövid bekezdés, tiszta felkérés. <em>Eredmény:</em> konkrét, használható.</p>

<hr />
<h2>Konkrét prompt sablon</h2>
<pre><code>Cél: [mit kérsz]  
Kontextus: [helyzet, háttér]  
Forma: [bullet, táblázat, bekezdés]  
Stílus: [üzleti, barátságos, technikai]  
Hossz: [max X szó / mondat]  
CTA: [következő lépés / kérés]
</code></pre>

<hr />
<h2>Gyakorlat (vezetett)</h2>
<p>Fogalmazz meg egy promptot az alábbi helyzetre a 4 elem segítségével:</p>
<ul>
<li>Cél: Emlékeztető email írása</li>
<li>Kontextus: Az ügyfél még nem válaszolt egy korábbi ajánlatra</li>
<li>Forma: Rövid email</li>
<li>Stílus: Udvarias, nem tolakodó</li>
</ul>

<hr />
<h2>Gyakorlat (önálló)</h2>
<p>Válassz egy valós helyzetet a saját munkádból (munka, iskola, ügyintézés). Írj hozzá promptot a 4 elem alapján. Legyen olyan, amit ténylegesen használnál.</p>

<hr />
<h2>Tippek</h2>
<ul>
<li>Mindig add meg a célt, a kontextust, az elvárt formát.</li>
<li>Ha nem tetszik a válasz, pontosíts egy elemnél: forma vagy stílus.</li>
<li>Adj példát: „Így néz ki most, ilyet szeretnék, módosítsd.”</li>
</ul>

<hr />
<h2>Opcionális mélyítés</h2>
<ul>
<li>OpenAI – Prompt Engineering Guide: <a href="https://platform.openai.com/docs/guides/prompt-engineering" target="_blank" rel="noreferrer">https://platform.openai.com/docs/guides/prompt-engineering</a></li>
<li>Ethan Mollick – Prompt példák: <a href="https://www.oneusefulthing.org" target="_blank" rel="noreferrer">https://www.oneusefulthing.org</a></li>
<li>Reddit – r/ChatGPT prompt collection: <a href="https://www.reddit.com/r/ChatGPT/" target="_blank" rel="noreferrer">https://www.reddit.com/r/ChatGPT/</a></li>
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
    content: `<h1>Iteráció és visszakérdezés – hogyan lesz tényleg használható a válasz?</h1>
<p><em>Az „OK, de…” művészete</em></p>
<p>Ma az iterációt és a visszakérdezést tanulod: hogyan pontosítsd a választ, hogy tényleg használható legyen. Az AI nem találja ki a hiányzó részleteket – te irányítasz.</p>

<hr />
<h2>Napi cél</h2>
<ul>
<li>Felismersz minden olyan helyzetet, amikor pontosítani kell</li>
<li>Tudsz példát, korlátot, magyarázatot kérni</li>
<li>Háromlépéses iterációs hurkot használsz</li>
</ul>

<hr />
<h2>Mi az iteráció?</h2>
<p>Válasz → visszajelzés → pontosítás. A jó iteráció három kérdésből áll:</p>
<ol>
<li><strong>Adj változatot</strong>: „Adj 3 stílusvariánst (hivatalos, barátságos, technikai) max 50 szóban.”</li>
<li><strong>Pontosíts</strong>: „Rövidítsd 30%-kal, tartsd meg a 3 fő üzenetet.”</li>
<li><strong>Korlátozz</strong>: „Legyen bullet lista, max 5 pont, konkrét teendőkkel.”</li>
</ol>

<hr />
<h2>Példák: gyenge vs. jó visszajelzés</h2>
<p><strong>Gyenge:</strong> „Nem jó, csináld újra.”</p>
<p><strong>Jó:</strong> „Túl hosszú és általános. Rövidítsd 30%-kal, adj konkrét példát, és írj barátságos hangnemben.”</p>

<hr />
<h2>Gyakorlat (vezetett) – Ugyanaz a kérés, két verzió</h2>
<ol>
<li>„Írj emailt a határidő csúszásáról.”</li>
<li>„Írj emailt a határidő csúszásáról. Stílus: empatikus, de professzionális. Hossz: max 4 mondat. Adj alternatív megoldást.”</li>
</ol>
<p>Hasonlítsd össze a két választ: mit tett hozzá a pontosítás?</p>

<hr />
<h2>Gyakorlat (önálló) – Iterációs kör</h2>
<ul>
<li>Válassz egy saját promptot.</li>
<li>Kérj 3 stílusvariánst.</li>
<li>Kérj rövidítést vagy bővítést konkrét elvárással.</li>
<li>Kérj magyarázatot: „Miért ezt javaslod?”</li>
</ul>

<hr />
<h2>Prompt minta</h2>
<blockquote>
<p>Adj 3 alternatív választ listában. Mindegyik más stílusban (1) hivatalos, 2) barátságos, 3) technikai). Mindegyik max 50 szó, és tartalmazzon 2 konkrét teendőt.</p>
</blockquote>

<hr />
<h2>Tippek</h2>
<ul>
<li>Kérj példát és korlátot (hossz, formátum).</li>
<li>Kérj indoklást: „Miért ezt javaslod?”</li>
<li>Iterálj, amíg nem kapsz használható outputot – a jó visszajelzés = jó következő válasz.</li>
</ul>

<hr />
<h2>Opcionális mélyítés</h2>
<ul>
<li>OpenAI – Prompt Engineering Guide (iteráció rész): <a href="https://platform.openai.com/docs/guides/prompt-engineering" target="_blank" rel="noreferrer">https://platform.openai.com/docs/guides/prompt-engineering</a></li>
<li>One Useful Thing – Iteration in practice: <a href="https://www.oneusefulthing.org" target="_blank" rel="noreferrer">https://www.oneusefulthing.org</a></li>
</ul>`,
    emailSubject: 'AI 30 Nap – 3. nap: Hogyan kérdezz vissza az AI-tól?',
    emailBody: `<h1>AI 30 Nap – 3. nap</h1>
<h2>Hogyan kérdezz vissza az AI-tól?</h2>
<p>Ma megtanulod az iterációt és a pontosítást. Ez kulcsfontosságú, hogy egyre jobb válaszokat kapj.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a teljes leckét →</a></p>`
  },
  {
    day: 4,
    title: 'Stílus és hang – tanítsd meg "úgy írni, mint te"',
    content: `<h1>Stílus és hang – tanítsd meg „úgy írni, mint te”</h1>
<p><em>Következetes márkahang kevesebb utómunkával</em></p>
<p>Ma megtanítod az AI-nak a saját hangodat: hogyan írjon úgy, mint te, következetesen és felismerhetően. Nem csak hangnemet, hanem struktúrát is adsz, és visszajelzéssel pontosítasz.</p>

<hr />
<h2>Napi cél</h2>
<ul>
<li>Stílus-definíció (hang, mondathossz, formalitás)</li>
<li>Mintaszövegből taníttatod a modellt</li>
<li>Struktúrát és formát is adsz, nem csak hangnemet</li>
<li>Visszajelzést adsz és finomítasz</li>
</ul>

<hr />
<h2>Miért taníts stílust?</h2>
<ul>
<li>Márka- és személyes hang következetessége</li>
<li>Kevesebb kézi átírás, gyorsabb publikálás</li>
<li>Könnyebb delegálás: „írd úgy, ahogy én szoktam”</li>
</ul>

<hr />
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
<h2>Gyakorlat (vezetett) – Saját szöveg elemzése</h2>
<p>Add meg az AI-nak egy általad írt szöveget, kérd:</p>
<ul>
<li>Elemezd a hangot (formalitás, mondathossz, szóhasználat).</li>
<li>Foglalj össze 3 stílusjegyet.</li>
<li>Írj 3 tippet, hogyan lehet ezt másolni.</li>
</ul>

<hr />
<h2>Gyakorlat (önálló) – Új szöveg ugyanabban a stílusban</h2>
<p>Kérj új szöveget a fenti stílusban egy másik témára. Adj feedbacket és pontosíts.</p>

<hr />
<h2>Prompt minta</h2>
<blockquote>
<p>Íme a stílusom: [példa szöveg]. Hang: barátságos, tömör, példákkal. Struktúra: probléma, 3 bullet megoldás, CTA. Írj ugyanebben a stílusban egy emailt a következő témáról: [téma]. Ha eltérsz, jelezd, mit módosítottál.</p>
</blockquote>

<hr />
<h2>Tippek</h2>
<ul>
<li>Mindig adj mintát + stílusleírást + struktúrát.</li>
<li>Ha nem tetszik az első verzió, mondd meg, mi legyen több/kevesebb.</li>
<li>Kérj külön változatot blogra, emailre, social posztra – mindnek más a ritmusa.</li>
</ul>

<hr />
<h2>Opcionális mélyítés</h2>
<ul>
<li>Mailchimp Content Style Guide: <a href="https://styleguide.mailchimp.com" target="_blank" rel="noreferrer">https://styleguide.mailchimp.com</a></li>
<li>HubSpot Tone of Voice példa: <a href="https://blog.hubspot.com/marketing/brand-voice" target="_blank" rel="noreferrer">https://blog.hubspot.com/marketing/brand-voice</a></li>
<li>OpenAI – Style transfer tippek: <a href="https://platform.openai.com/docs/guides/prompt-engineering/style-guide" target="_blank" rel="noreferrer">https://platform.openai.com/docs/guides/prompt-engineering/style-guide</a></li>
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
    content: `<h1>Biztonság &amp; etika a gyakorlatban</h1>
<p><em>„Ne kerülj bajba” kézikönyv</em></p>
<p>Ma megtanulod, mit <em>nem</em> adunk be az AI-nak, hogyan anonimizálsz gyorsan, és hogyan maradsz etikus. Az AI erős, de a felelősség a tied.</p>

<hr />
<h2>Napi cél</h2>
<ul>
<li>Felismered az érzékeny adatokat</li>
<li>Helyőrzőkre cseréled (anonimizálás)</li>
<li>Beépítesz QA-lépést</li>
<li>Tudsz forrást/disclaimer-t kérni</li>
</ul>

<hr />
<h2>Mi minősül érzékeny adatnak?</h2>
<ul>
<li>Személyes adatok (név, email, telefonszám, cím)</li>
<li>Személyes egészségügyi/jogi/pénzügyi információk</li>
<li>Céges bizalmas infók, árazás, szerződések</li>
<li>Jelszavak, API kulcsok, privát linkek</li>
</ul>

<hr />
<h2>Hogyan anonimizálj?</h2>
<ul>
<li>Cseréld: „[NÉV]”, „[CÉG]”, „[ESEMÉNY]”, „[EMAIL]”, „[DÁTUM]”</li>
<li>Távolítsd el: felesleges részletek, amik nem kellenek a feladathoz</li>
<li>Használj fiktív adatokat: „Acme Kft.”, „teszt@example.com”</li>
</ul>
<p><strong>Gyors sablon</strong> (ragaszd be prompt elé):<br />„Nevek → [NÉV], cég → [CÉG], email → [EMAIL], dátum → [DÁTUM], számok → kerekített érték, link → [LINK]. Ne adj vissza személyes vagy bizalmas adatot.”</p>

<hr />
<h2>Forrás, disclaimer, QA</h2>
<ul>
<li>„Adj forrást vagy jelezd, ha nem vagy biztos.”</li>
<li>„Ha szám/statisztika: jelezd a bizonytalanságot.”</li>
<li>„Adj 3 forrást linkkel.”</li>
</ul>

<hr />
<h2>Gyakorlat (vezetett) – Anonimizálás</h2>
<p>Végy egy szöveget (email, meeting jegyzet), és cseréld ki az érzékeny részeket helyőrzőre. Add meg az AI-nak, és kérj összefoglalót.</p>

<hr />
<h2>Gyakorlat (önálló) – Etikai ellenőrzés</h2>
<p>Írj listát 5 olyan feladatról, amit <em>nem</em> adsz AI-ra. Mindenhez: miért nem, és mi a biztonságos alternatíva?</p>

<hr />
<h2>Prompt minta</h2>
<blockquote>
<p>Itt egy szöveg érzékeny adatokkal. Cseréld le a neveket [NÉV]-re, a cégeket [CÉG]-re, az emaileket [EMAIL]-re, a dátumokat [DÁTUM]-ra. A végén adj 3 forrásellenőrző kérdést.</p>
</blockquote>

<hr />
<h2>Tippek</h2>
<ul>
<li>Ha bizonytalan vagy, ne add be. Ha be kell adni, anonimizálj.</li>
<li>Kérj forrást/disclaimer-t mindenhol, ahol kockázat van.</li>
<li>Mindig legyen manuális QA, főleg számoknál, dátumoknál.</li>
</ul>

<hr />
<h2>Opcionális mélyítés</h2>
<ul>
<li>OpenAI – Usage policies: <a href="https://openai.com/policies/usage-policies" target="_blank" rel="noreferrer">https://openai.com/policies/usage-policies</a></li>
<li>NIST AI RMF (összefoglaló): <a href="https://www.nist.gov/itl/ai-risk-management-framework" target="_blank" rel="noreferrer">https://www.nist.gov/itl/ai-risk-management-framework</a></li>
<li>OWASP Top 10 for LLM Apps (PII szemlélet): <a href="https://owasp.org/www-project-top-10-for-large-language-model-applications/" target="_blank" rel="noreferrer">https://owasp.org/www-project-top-10-for-large-language-model-applications/</a></li>
</ul>`,
    emailSubject: '30-Day AI Catch-Up – 5. nap: Biztonság & etika',
    emailBody: `<h1>30-Day AI Catch-Up – 5. nap</h1>
<h2>Biztonság &amp; etika a gyakorlatban</h2>
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
<p>Ma létrehozod a saját prompt könyvtáradat: újrahasználható sablonokkal gyorsítasz, és konzisztens minőséget kapsz.</p>
<ul>
<li>kategorizált sablonok: email, összefoglaló, teendő, brief, ötletelés</li>
<li>minden sablon: Cél + Kontextus + Forma + Stílus + Változók</li>
<li>verziózás és jegyzetek, hogy lásd a fejlődést</li>
<li>egy helyen tárolod (Notion/Drive) és megosztod a csapattal</li>
</ul>

<hr />
<h2>Sablon felépítés</h2>
<ul>
<li><strong>Cél</strong>: mit akarsz (írj emailt, foglald össze, készíts vázlatot)</li>
<li><strong>Kontextus</strong>: háttér, ki/kinek, miről</li>
<li><strong>Forma</strong>: bullet, rövid bekezdés, táblázat</li>
<li><strong>Stílus</strong>: üzleti, barátságos, tömör</li>
<li><strong>Változók</strong>: [téma], [címzett], [hossz], [stílus]</li>
</ul>

<h2>Példa sablon</h2>
<p>„Írj rövid, udvarias emailt [címzett]-nek. Kontextus: [helyzet]. Stílus: [stílus]. Hossz: max [hossz]. Adj CTA-t a válaszra.”</p>

<hr />
<h2>Gyakorlat 1 – 5 sablon</h2>
<p>Készíts 5 sablont a saját munkádhoz (email, összefoglaló, teendőlista, dokumentum vázlat, ötletelés). Mindegyikhez: cél, kontextus, forma, stílus, változók.</p>

<h2>Gyakorlat 2 – Verziózás</h2>
<p>Válassz ki egy sablont, próbáld ki 2 helyzetben, írd le, mit finomítottál. Verziózd v1 → v2.</p>

<hr />
<h2>Tipp</h2>
<p>Kategorizálj (email, dokumentum, összefoglaló, stb.) és tartsd egy helyen. Írd mellé, mikor működött jól, mikor nem.</p>

<h2>Opcionális mélyítés</h2>
<ul>
<li>Prompt könyvtár struktúrák (Notion/Docs sablon)</li>
<li>„What worked / what to improve” mező a sablonokhoz</li>
</ul>`,
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
<p>Ma felépítesz egy újrahasználható AI-workflow-t: Input → Feldolgozás → Output → Ellenőrzés.</p>
<ul>
<li>Input: mit adsz be, anonimizálás, formátum</li>
<li>Feldolgozás: prompt + iterációs lépések</li>
<li>Output: milyen formában kéred (bullet, táblázat, rövid)</li>
<li>Ellenőrzés: hogyan validálsz (forrás, számok, döntések)</li>
</ul>

<hr />
<h2>Workflow lépések</h2>
<ol>
<li><strong>Input</strong>: adattisztítás, helyőrzők ([Név], [Email]), kontextus leírás.</li>
<li><strong>Feldolgozás</strong>: prompt v1 → feedback → prompt v2 (iteráció).</li>
<li><strong>Output</strong>: formátum, hossz, CTA, oszlopok.</li>
<li><strong>Ellenőrzés</strong>: tények, számok, következő lépések, felelősök.</li>
</ol>

<h2>Mini pipeline példa</h2>
<p>Meeting jegyzet → (1) tisztítás/anonimizálás → (2) összefoglaló + döntések + teendők → (3) export CSV → (4) ellenőrzés.</p>

<hr />
<h2>Gyakorlat 1 – Saját workflow</h2>
<p>Válassz feladatot (pl. jegyzet → akciólista). Írd le a 4 lépést, majd futtasd végig AI-val.</p>

<h2>Gyakorlat 2 – Ellenőrző lista</h2>
<p>Készíts checklistet: mit ellenőrzöl mindig? (számok, nevek, határidők, tények)</p>

<hr />
<h2>Prompt minta</h2>
<blockquote>
<p>Készíts workflow tervet [feladat]-hoz. 1) Input: mit gyűjtök, mit anonimizálok? 2) Feldolgozás: milyen prompt + iteráció? 3) Output: milyen formátum/hossz/CTA? 4) Ellenőrzés: mit és hogyan validálok?</p>
</blockquote>

<h2>Tipp</h2>
<p>Dokumentáld a bevált workflow-kat. Kis lépésekben javítsd: mindig tudd, melyik lépés hozta a jobb kimenetet.</p>

<h2>Opcionális mélyítés</h2>
<ul>
<li>Workflow sablonok: meeting, email, brief, táblázat</li>
<li>Automatizálás ötlet: ugyanazt a pipeline-t scriptelve futtatni</li>
</ul>`,
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
<p>Ma megtanulod felismerni és kezelni a hibákat/hallucinációkat: forráskérés, tényellenőrzés, korlátozás.</p>
<ul>
<li>tudod, mikor valószínű a hallucináció (számok, dátumok, nevek)</li>
<li>forrást kérsz és ellenőrzöl</li>
<li>„ha nem biztos, jelezd” szabályt használsz</li>
<li>alternatívákat kérsz és validálsz</li>
</ul>

<hr />
<h2>Hallucináció jelei</h2>
<ul>
<li>pontos dátum/szám forrás nélkül</li>
<li>nem létező esemény/szereplő</li>
<li>statisztika, ami túl kerek/általános</li>
<li>„forrás nélkül” vagy kitalált hivatkozás</li>
</ul>

<h2>Biztonságos információkérés</h2>
<p>„Adj információt [témában], csak ha >90% biztos vagy. Ha nem vagy biztos, jelezd. Adj forrást/linket, ha lehet.”</p>

<hr />
<h2>Gyakorlat 1 – Tényellenőrzés</h2>
<p>Kérj egy tényt (pl. alapítási év), ellenőrizd külső forrással, jelezd, ha eltérés van, és kérj javítást.</p>

<h2>Gyakorlat 2 – Forráskérés</h2>
<p>Kérd meg: „Adj 2 hivatkozható forrást a válaszhoz, vagy írd, hogy nincs forrásod.”</p>

<h2>Gyakorlat 3 – Alternatívák</h2>
<p>Kérj 3 alternatív megoldást és jelöld, melyik a legbiztosabb (1-3). Ellenőrizd a legjobb opciót.</p>

<hr />
<h2>Prompt minta</h2>
<blockquote>
<p>Adj választ [témában]. Ha nem vagy biztos, írd: „Nem találtam megbízható forrást”. Adj forrást/linket, ha elérhető. Ha nincs forrás, ne találj ki adatot.</p>
</blockquote>

<h2>Tipp</h2>
<p>„Forrás vagy disclaimer” szabály: vagy hivatkozol, vagy jelzed a bizonytalanságot. Kritikus infóknál mindig ellenőrizd emberrel.</p>

<h2>Opcionális mélyítés</h2>
<ul>
<li>Verifikációs lista: dátum, szám, név, link</li>
<li>Hallucinációs példák gyűjtése a saját területedről</li>
</ul>`,
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
<p>Ma kialakítod a saját AI-asszisztens hangodat: a modell következetesen úgy ír, mint te.</p>
<ul>
<li>stílusprofil: hang, mondathossz, formalitás, szóhasználat</li>
<li>struktúra: hogyan épül fel egy tipikus írásod</li>
<li>„do/don’t” list: mit használjon, mit kerüljön</li>
<li>hang-útmutató dokumentum, amit újrahasználsz</li>
</ul>

<hr />
<h2>Hangprofil lépései</h2>
<ol>
<li>Gyűjts 3–5 saját szöveget (email, jegyzet, poszt).</li>
<li>Elemeztesd: hang (barátságos/üzleti), mondathossz, szóhasználat, tempó.</li>
<li>Készíttess útmutatót: „így írj, ha X (én) hangján szólalsz meg”.</li>
<li>Adj visszajelzést, frissítsd a profilt.</li>
</ol>

<h2>Do/Don’t példa</h2>
<ul>
<li><strong>Do</strong>: rövid mondatok, konkrét példák, CTA a végén.</li>
<li><strong>Don’t</strong>: szleng, túl hosszú bekezdések, passzív hang.</li>
<li><strong>Szókincs</strong>: kedvenc kifejezések, kerülendő szavak.</li>
</ul>

<hr />
<h2>Gyakorlat 1 – Hangprofil</h2>
<p>Add meg 3 saját szöveget, kérj elemzést + útmutatót: hang, forma, szókincs, do/don’t, példák.</p>

<h2>Gyakorlat 2 – Új szöveg ugyanazzal a hanggal</h2>
<p>Kérj új szöveget (más téma), ugyanazzal a hanggal. Adj feedbacket és finomítsd a profilt.</p>

<hr />
<h2>Prompt minta</h2>
<blockquote>
<p>Íme 3 példa a stílusomra: [példák]. Elemezd: hang, formalitás, mondathossz, szóhasználat, struktúra. Készíts „hang útmutatót” (do/don’t, kedvenc kifejezések). Írj egy új szöveget ugyanebben a hangban: [téma].</p>
</blockquote>

<h2>Tipp</h2>
<p>A hangprofil élő dokumentum: frissítsd, amikor változik a stílusod. Minél több példa, annál pontosabb.</p>

<h2>Opcionális mélyítés</h2>
<ul>
<li>Voice & tone guide példák (Mailchimp, Gov.uk)</li>
<li>„Style transfer” promptok: hogyan vált hangnemet</li>
</ul>`,
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
<p>Ma újragyakorlod a rossz → jó prompt átalakítást: diagnózis, javítás, összehasonlítás.</p>
<ul>
<li>felismered a hibákat (hiányzó cél/kontextus/forma/stílus)</li>
<li>konkrét javítási lépéseket írsz</li>
<li>összehasonlítod a kimeneteket</li>
</ul>

<hr />
<h2>Rossz vs. jó</h2>
<p><strong>Rossz:</strong> „Írj emailt.” / „Összegezz.” / „Írj valamit.”</p>
<p><strong>Jó:</strong> cél + kontextus + forma + stílus + hossz + CTA (pl. státusz email, 4 mondat, üzleti, CTA: válasz időponttal).</p>

<h2>Debug lépések</h2>
<ol>
<li>Mi hiányzik? (cél/kontextus/forma/stílus/hossz)</li>
<li>Adj konkrét kérést (pl. „max 4 mondat”, „bullet”, „empatikus”)</li>
<li>Futtasd mindkét verziót, hasonlítsd össze</li>
<li>Adj visszajelzést és iterálj</li>
</ol>

<hr />
<h2>Gyakorlat 1 – 3 rossz prompt javítása</h2>
<p>Válassz 3 rossz promptot, írd át, futtasd mindkettőt, hasonlítsd: mi lett jobb?</p>

<h2>Gyakorlat 2 – Formátum váltás</h2>
<p>Ugyanaz a tartalom: kérd bekezdésben, majd bulletben. Melyik használhatóbb?</p>

<hr />
<h2>Prompt minta</h2>
<blockquote>
<p>Rossz: „Írj valamit a projektről.”<br/>Jó: „Írj projekt státusz emailt. Kontextus: [projekt], Státusz: [állapot], Következő lépések: [lépések]. Stílus: professzionális, rövid bekezdések. Hossz: max 200 szó. CTA: kérj visszajelzést.”</p>
</blockquote>

<h2>Tipp</h2>
<p>Készíts checklistát: Cél, Kontextus, Forma, Stílus, Hossz, CTA. Minden javításnál ezt pótold.</p>

<h2>Opcionális mélyítés</h2>
<ul>
<li>Prompt A/B teszt: két verzió összehasonlítása ugyanarra a feladatra</li>
<li>„Before/After” gyűjtemény készítése referenciának</li>
</ul>`,
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
<p>Ma személyre szabod az AI-használatot a szerepedre (Marketing/Sales/PM/Dev): feladatlista, gyorsítási pontok, prompt sablonok.</p>
<ul>
<li>azonosítod a napi feladatokat</li>
<li>kiválasztod, mit gyorsítasz AI-val</li>
<li>első szerep-specifikus sabloncsomagot állítasz össze</li>
</ul>

<hr />
<h2>Szerep-példák</h2>
<ul>
<li><strong>Marketing</strong>: kampány brief, persona, értékajánlat, posztvázlat</li>
<li><strong>Sales</strong>: cold email variáns, follow-up, objections, pitch outline</li>
<li><strong>PM</strong>: user story, PRD váz, priorizálás (RICE), release note</li>
<li><strong>Dev</strong>: kód-komment, docstring, teszt case váz, hiba triage</li>
</ul>

<hr />
<h2>Gyakorlat 1 – Napi feladat térkép</h2>
<p>Írd le a napi feladataidat, jelöld, mi gyorsítható AI-val, és mivel (összefoglaló, vázlat, sablon).</p>

<h2>Gyakorlat 2 – 3 prompt sablon</h2>
<p>Készíts 3 prompt sablont a szerepedre (cél, kontextus, forma, stílus, változók). Teszteld őket.</p>

<hr />
<h2>Prompt minta</h2>
<blockquote>
<p>Készíts AI-használati tervet [szerep]-hez. Struktúra: 1) Top 5 napi feladat, 2) AI-val gyorsítható elemek, 3) Prompt sablonok (Cél/Kontextus/Forma/Stílus), 4) Várt output.</p>
</blockquote>

<h2>Tipp</h2>
<p>Az AI nem ugyanaz minden szerepben: tedd konkréttá a feladataidra. Kezdd 3 sablonnal, majd bővíts.</p>

<h2>Opcionális mélyítés</h2>
<ul>
<li>Szerep-specifikus mérőszámok: mit javít az AI (idő, minőség, konzisztencia)</li>
<li>Megosztott csapatsablonok gyűjtése</li>
</ul>`,
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
<p>Ma elkészíted az első szerep-specifikus sabloncsomagod: 5 gyors sablon a leggyakoribb feladataidra.</p>
<ul>
<li>alap sablonok: email, összefoglaló, teendő, vázlat</li>
<li>szerep-specifikus: a legfontosabb feladatodra</li>
<li>variáció: ugyanaz más stílusban</li>
<li>iteráció: finomítási lépések</li>
<li>ellenőrző sablon: minőség-check</li>
</ul>

<hr />
<h2>Sabloncsomag v1 (5 db)</h2>
<ol>
<li><strong>Email</strong>: Cél/Kontextus/Forma/Stílus/Változók</li>
<li><strong>Összefoglaló</strong>: 5 pont, döntés, next step</li>
<li><strong>Szerep-specifikus</strong>: pl. kampány vázlat / user story / bug triage / pitch outline</li>
<li><strong>Variáció</strong>: ugyanaz két stílusban (üzleti vs. barátságos)</li>
<li><strong>Ellenőrző</strong>: „Hiányzik-e CTA, szám, határidő, felelős?”</li>
</ol>

<hr />
<h2>Gyakorlat 1 – 5 sablon</h2>
<p>Készítsd el az 5 sablont a szerepedre. Írd mellé, milyen változókat töltesz ki (pl. [téma], [címzett], [stílus], [hossz]).</p>

<h2>Gyakorlat 2 – Teszt és jegyzet</h2>
<p>Próbáld ki valós példán, jegyezd fel: mi működött, mit kell javítani (v1 → v2).</p>

<hr />
<h2>Prompt minta</h2>
<blockquote>
<p>Készíts prompt sablont [szerep]/[feladat]-hoz. Struktúra: Cél, Kontextus, Forma, Stílus, Változók ([x], [y], [z]). Adj 2 stílusvariánst.</p>
</blockquote>

<h2>Tipp</h2>
<p>Kicsiben kezdd (5 sablon), verziózd, tartsd egy helyen, és oszd meg a csapattal.</p>

<h2>Opcionális mélyítés</h2>
<ul>
<li>Sablon-nyilvántartás: mikor használtad, eredmény</li>
<li>„Fail log”: mi nem működött, miért</li>
</ul>`,
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
<p>Bővíted a csomagod haladó sablonokkal: komplex, integrációs, automatizálási promptok.</p>
<ul>
<li>komplex: több lépés, több output</li>
<li>integráció: adat + elemzés + ajánlás</li>
<li>automatizálás: ismétlődő rutin standardizálása</li>
</ul>

<hr />
<h2>Haladó sablon példák</h2>
<ol>
<li><strong>Komplex</strong>: kampányterv / PRD váz + acceptance criteria / debug-útvonal</li>
<li><strong>Integráció</strong>: adatbeolvasás + összefoglaló + döntési javaslat</li>
<li><strong>Automatizálás</strong>: napi standup összegzés, ticket triage, KPI riport</li>
</ol>

<h2>Kötelező elemek</h2>
<ul>
<li>Lépések: Input → Feldolgozás → Output → Ellenőrzés</li>
<li>Változók: [adatforrás], [formátum], [határidő], [stílus]</li>
<li>Minőség: „Ellenőrizd a számokat/konzisztenciát, jelezd a hiányt”</li>
</ul>

<hr />
<h2>Gyakorlat 1 – 3 haladó sablon</h2>
<p>Készíts komplex, integrációs, automatizálási sablont. Teszteld, jegyezd fel a javításokat (v1 → v2).</p>

<h2>Gyakorlat 2 – QA lépés</h2>
<p>Mindegyikhez írj QA lépést: „Ha nincs adat, jelezd; ha számot használsz, forrás/validáció.”</p>

<hr />
<h2>Prompt minta</h2>
<blockquote>
<p>Készíts haladó sablont [feladat]-ra. Struktúra: 1) Lépések, 2) Input, 3) Output (formátum/hossz), 4) Ellenőrzés. Változók: [adatforrás], [stílus], [határidő].</p>
</blockquote>

<h2>Tipp</h2>
<p>Válaszd szét a gyors sablonokat a komplexektől. Haladó sablonokat is verziózd.</p>

<h2>Opcionális mélyítés</h2>
<ul>
<li>Chaining: vázlat → bővítés → QA</li>
<li>Integráció: táblázat + összefoglaló + ajánlás egy promptban</li>
</ul>`,
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
<p>Ma feltárod a szerep-specifikus csapdákat, és írsz elkerülési/ellenőrzési stratégiát.</p>
<ul>
<li>csapdalista 5 tipikus hibával</li>
<li>felismerési jelek: mire figyelj</li>
<li>elkerülés: prompt-módosítás + ellenőrzés</li>
<li>ellenőrző kérdések: mit kérdezz mindig</li>
</ul>

<hr />
<h2>Példa csapdák</h2>
<ul>
<li><strong>Marketing</strong>: kitalált statok, nem mérhető output.</li>
<li><strong>Sales</strong>: generikus pitch, nincs persona-fit.</li>
<li><strong>PM</strong>: user nézőpont hiánya, csak technikai lista.</li>
<li><strong>Dev</strong>: hibás kód, edge case/teszt hiánya.</li>
</ul>

<h2>Elkerülés/ellenőrzés</h2>
<ul>
<li>„Ha szám/statisztika: adj forrást vagy jelezd a bizonytalanságot.”</li>
<li>„Adj 3 személyre szabott variánst [persona]-ra.”</li>
<li>„Kérj unit tesztet, edge case listát.”</li>
<li>„Használj mérőszámot vagy CTA-t, ne csak leírást.”</li>
</ul>

<hr />
<h2>Gyakorlat 1 – Csapdalista</h2>
<p>Írj 5 csapdát a szerepedre. Mindhez: jelzés, elkerülés, ellenőrzés.</p>

<h2>Gyakorlat 2 – Prompt javítás</h2>
<p>Válassz egy rossz promptot, javítsd csapda-ellenesre, hasonlítsd össze a kimenetet.</p>

<hr />
<h2>Prompt minta</h2>
<blockquote>
<p>Készíts „csapdalista” dokumentumot [szerep]-hez. Struktúra: 1) Tipikus hibák, 2) Felismerés jelei, 3) Elkerülés (prompt), 4) Ellenőrző kérdések. Adj példát mindegyikre.</p>
</blockquote>

<h2>Tipp</h2>
<p>Csapdalista = élő dokumentum. Frissítsd, ha új hiba jön elő, és linkeld a sabloncsomaghoz.</p>

<h2>Opcionális mélyítés</h2>
<ul>
<li>Hibagyűjtemény valós esetekkel</li>
<li>„Red flag” checklist per szerep</li>
</ul>`,
    emailSubject: 'AI 30 Nap – 19. nap: Tipikus csapdák',
    emailBody: `<h1>AI 30 Nap – 19. nap</h1>
<h2>Tipikus csapdák az adott szerepben</h2>
<p>Ma megtanulod, hogyan kerüld el a tipikus csapdákat. Ez segít a megbízható használatban.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a teljes leckét →</a></p>`
  },
  {
    day: 20,
    title: 'Skill-check & szintlépés',
    content: `<h1>Skill-check &amp; szintlépés</h1>
<p><em>Az eszközhasználattól a tudatos működésig</em></p>
<p>Ez a nap nem arról szól, hogy „újat tanulsz”. Arról szól, hogy <strong>láthatóvá teszed a fejlődésed</strong>, <strong>nevet adsz a hiányaidnak</strong>, és <strong>rendszerré alakítod azt, amit eddig ösztönből csináltál</strong>.</p>
<p>A legtöbben azért ragadnak meg egy szinten az AI használatában, mert soha nem állnak meg megkérdezni:</p>
<ul>
<li>Mit csinálok már jól?</li>
<li>Hol improvizálok még?</li>
<li>Mely szokásaim emelnék azonnal a kimenetek minőségét?</li>
</ul>
<p>Ma pontosan ezt teszed.</p>
<p>Átlépsz innen:<br />&gt; „Használom az AI-t”<br />ide:<br />&gt; „Tudatosan működtetem az AI-t.”</p>

<hr />
<h2>Napi cél</h2>
<p>A lecke végére:</p>
<ul>
<li>Tisztán látod a valódi szinted a kulcs AI-területeken</li>
<li>Azonosítod a személyes gyenge pontjaidat</li>
<li>Kijelölsz <strong>két konkrét fejlesztési célt</strong></li>
<li>Készítesz egy <strong>gyakorlatias akciótervet</strong>, amit már holnaptól használhatsz</li>
</ul>
<p>Ez a te <strong>szintlépési pontod</strong>.</p>

<hr />
<h2>Kulcsterületek</h2>
<p>Hét területen értékeled magad. Ezek a professzionális AI-használat pillérei.</p>
<h3>1. Prompt</h3>
<ul>
<li>Cél: mit szeretnél elérni?</li>
<li>Kontextus: milyen háttér szükséges?</li>
<li>Forma: milyen kimeneti formát vársz?</li>
<li>Stílus: milyen hangvétel, keret?</li>
<li>Hossz: mennyire legyen részletes?</li>
<li>CTA: mi legyen a következő lépés?</li>
</ul>
<p>A profi prompt nem kérés. Specifikáció.</p>

<hr />
<h3>2. Workflow gondolkodás</h3>
<ul>
<li>Input → Feldolgozás → Output → Ellenőrzés</li>
<li>Fel tudod-e bontani a komplex feladatokat?</li>
<li>Fázisokban vezeted-e a modellt?</li>
</ul>
<p>A kezdő egyszer kérdez. A profi vezényel.</p>

<hr />
<h3>3. Sablonrendszer</h3>
<ul>
<li>Vannak újrahasznosítható promptjaid?</li>
<li>Van személyes prompt-könyvtárad?</li>
<li>Verziózod és finomítod a legjobbakat?</li>
</ul>
<p>A sablon tőke. Nélküle minden feladat nulláról indul.</p>

<hr />
<h3>4. Hibakezelés és QA</h3>
<ul>
<li>Kérsz-e forrást vagy disclaimer-t, ha kell?</li>
<li>Ellenőrzöd-e a kimenetet?</li>
<li>Van-e ellenőrző listád?</li>
</ul>
<p>Az AI erős. Az ellenőrizetlen AI veszélyes.</p>

<hr />
<h3>5. Szerep-specifikus használat</h3>
<ul>
<li>Másképp használod-e vezetőként, tanárként, fejlesztőként?</li>
<li>Vannak szerep-alapú promptjaid?</li>
<li>Kontextushoz igazítod-e az utasítást?</li>
</ul>
<p>Az általános prompt általános kimenetet ad.</p>

<hr />
<h3>6. Iterációs készség</h3>
<ul>
<li>Adsz-e konkrét visszajelzést?</li>
<li>Megmondod-e, mi a gond és hogyan javítsa?</li>
<li>Finomítasz vagy újragenerálsz?</li>
</ul>
<p>A profi formál. A kezdő újrakezd.</p>

<hr />
<h3>7. Biztonság</h3>
<ul>
<li>Anonimizálsz-e érzékeny adatot?</li>
<li>Nem másolsz be privát információt?</li>
<li>Tudatosan véded a kontextust?</li>
</ul>
<p>A bizalom a kompetencia része.</p>

<hr />
<h2>Gyakorlat — Önelemzés</h2>
<h3>1. lépés</h3>
<p>Értékeld magad 1–5-ig:</p>
<ul>
<li>Prompt</li>
<li>Workflow</li>
<li>Sablon</li>
<li>QA és hibakezelés</li>
<li>Szerep-specifikus használat</li>
<li>Iteráció</li>
<li>Biztonság</li>
</ul>
<p>1 = alig figyelek rá<br />5 = tudatosan és következetesen csinálom</p>

<hr />
<h3>2. lépés</h3>
<p>Írd le:</p>
<ul>
<li>3 erősséged</li>
<li>3 fejlesztendő pontod</li>
</ul>
<p>Légy konkrét. Nem: „gyenge vagyok promptban”. Hanem: „gyakran nem adok meg formát és hosszúságot”.</p>

<hr />
<h3>3. lépés</h3>
<p>Válassz ki <strong>2 fejlesztendő területet</strong>, és alakítsd őket céllá.</p>
<p>Példák:</p>
<ul>
<li>„Minden összetett prompt végén kérek QA-t.”</li>
<li>„Kialakítok egy email sablon könyvtárat.”</li>
<li>„Minden nem triviális feladatot lépésekre bontok.”</li>
</ul>

<hr />
<h3>4. lépés</h3>
<p>Készíts egyszerű akciótervet:</p>
<table>
<thead>
<tr><th>Terület</th><th>Akció</th><th>Mikor</th><th>Bizonyíték</th></tr>
</thead>
<tbody>
<tr><td>QA</td><td>„Verify and flag uncertainty” hozzáadása</td><td>Holnaptól</td><td>Kevesebb hiba</td></tr>
<tr><td>Sablon</td><td>5 alap prompt létrehozása</td><td>Ezen a héten</td><td>Elmentve</td></tr>
</tbody>
</table>

<hr />
<h2>Önértékelő prompt</h2>
<pre><code>Készíts strukturált önértékelést az AI-készségeimről.

Struktúra:
1. 1–5 értékek: Prompt, Workflow, Sablon, QA, Szerep-specifikus használat, Iteráció, Biztonság
2. Három erősség
3. Három fejlesztendő terület
4. Két konkrét fejlesztési cél
5. Akcióterv konkrét lépésekkel és határidőkkel
</code></pre>
<p>Hasonlítsd össze az AI válaszát a sajátoddal. Az egyezés tisztánlátást jelent. Az eltérés vakfoltot jelez.</p>

<hr />
<h2>Tipp</h2>
<p>Válassz kevés célt. De vidd végig őket.</p>
<p>Kösd a mindennapi munkához:</p>
<ul>
<li>Minden email előtt QA kérdés</li>
<li>Minden komplex feladat lépésekre bontva</li>
<li>Minden jó prompt elmentve</li>
</ul>

<hr />
<h2>Opcionális mélyítés</h2>
<ul>
<li>Heti retro – mi működött, mi nem, mi javult?</li>
<li>Egyszerű KPI-k – mennyi időt spórolsz feladatonként, hány iteráció kell egy jó kimenethez, hányszor használsz újra sablont</li>
</ul>
<p>Amit mérsz, azt fejleszted.</p>`,
    emailSubject: '30-Day AI Catch-Up – 20. nap: Skill-check & szintlépés',
    emailBody: `<h1>30-Day AI Catch-Up – 20. nap</h1>
<h2>Skill-check &amp; szintlépés</h2>
<p>Ma láthatóvá teszed, hol tartasz, és kijelölöd a következő szintet. A lecke végén akciótervvel zársz.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a teljes leckét →</a></p>`
  },
  // 21-25. nap · AI a bevételhez
  {
    day: 21,
    title: 'Ötletvalidálás AI-val',
    content: `<h2>Napi cél</h2>
<p>Ma AI-val validálsz egy ötletet: piac, kockázat, erőforrás, értékajánlat – forrás/disclaimer szabállyal.</p>
<ul>
<li>piaci térkép: hasonló termékek/szolgáltatások</li>
<li>kockázatok: mi boríthatja</li>
<li>erőforrás: mire lesz szükség</li>
<li>értékajánlat: mi az egyedi</li>
</ul>

<hr />
<h2>Biztonságos validálás</h2>
<p>„Adj forrást/linket, vagy jelezd, ha nem vagy biztos. Ne találj ki adatot.”</p>

<h2>Struktúra</h2>
<ol>
<li>Ötlet rövid leírása (probléma, célközönség)</li>
<li>Piaci kutatás: 3–5 hasonló szereplő, fő különbség</li>
<li>Kockázatok: top 5, hatás/valószínűség</li>
<li>Erőforrás: idő, pénz, csapat/skill</li>
<li>Értékajánlat: 1–2 mondatos UVP</li>
</ol>

<hr />
<h2>Gyakorlat</h2>
<p>Válassz egy ötletet, kérj a fenti struktúrában validációt. Ellenőrizd a számokat/állításokat, jelöld, mi tűnik gyengének.</p>

<hr />
<h2>Prompt minta</h2>
<blockquote>
<p>Validáld ezt az ötletet: [ötlet]. Adj: 1) Piaci térkép (3–5 hasonló, különbségek), 2) Kockázatok (top 5, hatás/valószínűség), 3) Erőforrás igény (idő/pénz/skill), 4) Értékajánlat (1–2 mondat). Adj forrást vagy jelezd, ha nem vagy biztos. Formátum: lista + pro/kontra.</p>
</blockquote>

<h2>Tipp</h2>
<p>Az AI segít ötletelni, de a kritikus pontokat ellenőrizd emberrel/forrással.</p>

<h2>Opcionális mélyítés</h2>
<ul>
<li>Simple TAM/SAM/SOM becslés</li>
<li>Versenyelőny: mi másolható/nehezen másolható</li>
</ul>`,
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
<p>Ma AI-val készítesz personát és értékajánlatot: célcsoport, fájdalom-pontok, megoldás, üzenet.</p>

<h2>Persona</h2>
<ul>
<li>Demográfia: szerep, iparág, cégméret</li>
<li>Célok, kihívások, fájdalom-pontok</li>
<li>Döntési szempontok, kifogások</li>
</ul>

<h2>Értékajánlat</h2>
<ul>
<li>Probléma → Megoldás → Előny (kimenet/eredmény)</li>
<li>Miért mi? (egyedi tényező, proof, példa)</li>
<li>Üzenet: 1–2 mondatos UVP, CTA</li>
</ul>

<hr />
<h2>Gyakorlat</h2>
<ol>
<li>Válassz célcsoportot (persona) és írd le röviden.</li>
<li>Kérj personát: demó, célok, kihívások, kifogások.</li>
<li>Kérj értékajánlatot: Probléma→Megoldás→Előny, 1–2 mondatos UVP.</li>
<li>Adj 2 üzenetvariánst (pl. üzleti vs. barátságos).</li>
</ol>

<hr />
<h2>Prompt minta</h2>
<blockquote>
<p>Készíts personát [célcsoport]-ra: demográfia, célok, kihívások, kifogások. Majd írj értékajánlatot: Probléma→Megoldás→Előny, 1–2 mondatos UVP, 2 üzenetvariáns (üzleti/barátságos). Adj CTA-t. Ha nincs adat, jelezd.</p>
</blockquote>

<h2>Tipp</h2>
<p>Kérj kifogásokat és döntési szempontokat is. Teszteld a két üzenetvariánst, válaszd a jobbat.</p>

<h2>Opcionális mélyítés</h2>
<ul>
<li>Positioning: „For [persona] who [need], we provide [solution] that [outcome], unlike [alternatives].”</li>
<li>Fájdalom → érték leképezések (pain/value map)</li>
</ul>`,
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
<p>Ma AI-val készítesz landing vázlatot és szöveget: hero, értékajánlat, funkciók, CTA, variációk.</p>
<ul>
<li>vázlat → szöveg → variációk (rövid/részletes/bullet)</li>
<li>hero: cím, alcím, CTA</li>
<li>értékajánlat + funkciók listában</li>
</ul>

<hr />
<h2>Struktúra</h2>
<ol>
<li>Hero: cím, alcím, CTA</li>
<li>Értékajánlat: 1–2 mondat, proof/példa</li>
<li>Funkciók/előnyök: bullet 3–5</li>
<li>Social proof (ha van)</li>
<li>CTA ismétlés</li>
<li>FAQ (opcionális)</li>
</ol>

<h2>Variációk</h2>
<ul>
<li>Rövid (hero + 3 bullet + CTA)</li>
<li>Részletes (minden szekció)</li>
<li>Bullet-first verzió</li>
</ul>

<hr />
<h2>Gyakorlat</h2>
<p>Adj meg termék/szolgáltatás leírást, kérj vázlatot a fenti struktúrával, majd kérj 3 szövegvariánst. Válaszd ki a legjobbat és finomíts.</p>

<h2>Prompt minta</h2>
<blockquote>
<p>Készíts landing vázat és szöveget. Termék: [leírás]. Struktúra: Hero (cím, alcím, CTA), Értékajánlat, 3–5 bullet funkció, Social proof (ha nincs, írj helyőrzőt), CTA. Adj 3 variánst: rövid, részletes, bullet-first. Rövid, tömör, magyar nyelven.</p>
</blockquote>

<h2>Tipp</h2>
<p>Kezdj vázlattal, majd kérj rövid + részletes verziót. A CTA legyen konkrét (pl. „Próbáld ki ingyen”).</p>`,
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
<p>Ma AI-val készítesz árazási vázlatot: piaci kép, érték-alap, verseny, stratégia. Forrás/disclaimer kötelező.</p>
<ul>
<li>piaci kutatás: versenytárs árak/modellek</li>
<li>érték alapú megközelítés</li>
<li>versenyképességi összevetés</li>
<li>árstratégia (pl. free trial, subscription, tiered)</li>
</ul>

<hr />
<h2>Struktúra</h2>
<ol>
<li>Termék leírás, célcsoport</li>
<li>Piaci kutatás: 3–5 hasonló, ár/modellek</li>
<li>Érték alapú: milyen eredményt ad (idő/pénz/hatás)</li>
<li>Versenyképesség: hol pozícionálsz (alacsony/közép/prémium)</li>
<li>Stratégia javaslat: modellek, indoklás, pro/kontra</li>
</ol>

<hr />
<h2>Biztonsági kitétel</h2>
<p>„Adj forrást/linket, vagy jelezd, ha becslés; ne találj ki adatot.”</p>

<h2>Gyakorlat</h2>
<p>Kérj árazási elemzést a fenti struktúrában, pro/kontra táblával. Jelöld, mihez kell emberi validáció.</p>

<h2>Prompt minta</h2>
<blockquote>
<p>Készíts árazási elemzést. Termék: [leírás]. Struktúra: 1) Piaci kutatás (3–5 hasonló ár/modellek), 2) Érték alapú nézet (megtakarítás/eredmény), 3) Versenyképesség (pozíció), 4) Árazási stratégia javaslat (modellek + pro/kontra). Adj forrást vagy disclaimert, ha becslés. Formátum: táblázat + összefoglaló.</p>
</blockquote>

<h2>Tipp</h2>
<p>Ne fogadj el számot forrás nélkül. Kezeld AI-kimenetet vázlatként, validáld piaci adattal.</p>`,
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
<p>Ma MVP-t tervezel: mit csinálunk, mit NEM csinálunk, mi a legfontosabb érték.</p>
<ul>
<li>minimális funkciókészlet</li>
<li>kizárások listája</li>
<li>prioritás: mi kerül be első körben</li>
<li>érték: mit ad az MVP</li>
</ul>

<hr />
<h2>MVP váz</h2>
<ol>
<li>Termék/feature rövid leírása</li>
<li><strong>Mit csinálunk</strong>: top 3 funkció</li>
<li><strong>Mit NEM csinálunk</strong>: mit hagyunk ki (scope cut)</li>
<li><strong>Prioritás</strong>: miért ezek kerülnek be</li>
<li><strong>Érték</strong>: milyen problémát old meg, milyen mérőszámmal</li>
</ol>

<h2>Gyakorlat</h2>
<p>Kérj MVP tervet a fenti váz szerint, külön „mit nem csinálunk” blokkal. Ellenőrizd, hogy minden funkcióhoz van-e érték és mérőszám.</p>

<h2>Prompt minta</h2>
<blockquote>
<p>Készíts MVP tervet. Termék: [leírás]. Struktúra: 1) Mit csinálunk (top 3 funkció), 2) Mit NEM csinálunk (scope cut), 3) Prioritás indoklása, 4) Érték (probléma → megoldás → mérőszám). Formátum: lista.</p>
</blockquote>

<h2>Tipp</h2>
<p>A „mit nem” legalább olyan fontos, mint a „mit igen”. Ne engedd visszamászni a scope-ba.</p>`,
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
<p>Ma kialakítod a napi AI-rutinodat: reggel–napközben–este feladatok, sablonokkal és időkerettel.</p>
<ul>
<li>rutin blokk: Reggeli, Napi, Esti</li>
<li>feladat + prompt sablon + időkeret</li>
<li>ellenőrző lépés: mit nézel át minden kimenetnél</li>
</ul>

<hr />
<h2>Blokkok és példák</h2>
<ul>
<li><strong>Reggel</strong>: inbox triage, napi terv bulletben, 1 prior task prompt.</li>
<li><strong>Napközben</strong>: meeting összefoglaló → teendő, dokumentum vázlat → draft.</li>
<li><strong>Este</strong>: napi összegzés (3 tanulság), holnapi top 3 feladat prompttal.</li>
<li><strong>QA</strong>: számok/határidők/felelősök ellenőrzése.</li>
<li><strong>Biztonság</strong>: anonimizálás, nincs érzékeny adat.</li>
<li><strong>Kérj alternatívát</strong>: „Adj 2 stílusvariánst.”</li>
</ul>

<hr />
<h2>Gyakorlat 1 – Rutin váz</h2>
<p>Írj 3-3 feladatot blokkonként, mindhez: cél, prompt, idő (perc), QA lépés.</p>

<h2>Gyakorlat 2 – Teszt</h2>
<p>Futtasd a reggeli blokkot élesben, jegyezd fel: mennyi idő, mi volt hasznos, mit javítasz.</p>

<hr />
<h2>Prompt minta</h2>
<blockquote>
<p>Készíts napi AI-rutin tervet. Struktúra: 1) Reggel: [3 feladat + prompt + perc + QA], 2) Napközben: [3 feladat], 3) Este: [3 feladat]. Adj időbecslést, és írd le a QA lépést (számok/határidők/felelősök). Biztonság: anonimizálás.</p>
</blockquote>

<h2>Tipp</h2>
<p>Kezdj kicsiben (1–2 feladat/blokk), majd bővíts. A QA legyen része a rutinodnak.</p>`,
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
<p>Ma 60 mp-es pitch-et készítesz AI-val: vázlat → 3 verzió (rövid/részletes/bullet) → próba.</p>
<ul>
<li>struktúra: Probléma (10 mp) → Megoldás (30 mp) → Érték/eredmény (20 mp) + CTA</li>
<li>3 variáns: rövid, részletes, bullet-first</li>
<li>hang/próbálás: mondd ki hangosan, mérj időt</li>
</ul>

<hr />
<h2>Vázlat</h2>
<ul>
<li>Probléma: kinek, mi fáj?</li>
<li>Megoldás: mit adsz, hogyan működik?</li>
<li>Érték/Proof: milyen eredmény, példa, szám</li>
<li>CTA: mi a következő lépés?</li>
<li>Persona-fit: kinek szól?</li>
</ul>

<hr />
<h2>Gyakorlat</h2>
<ol>
<li>Írd le a termék/szolgáltatás röviden.</li>
<li>Kérj pitch vázlatot a fenti struktúrában.</li>
<li>Kérj 3 verziót (rövid/részletes/bullet).</li>
<li>Olvasd fel, mérj időt, rövidíts, ha kell.</li>
</ol>

<h2>Prompt minta</h2>
<blockquote>
<p>Készíts 60 mp pitch-et. Termék: [leírás]. Struktúra: Probléma (10 mp), Megoldás (30 mp), Érték/Proof (20 mp), CTA. Adj 3 verziót: 1) rövid, 2) részletes, 3) bullet-first. Tömör, magyar nyelven.</p>
</blockquote>

<h2>Tipp</h2>
<p>60 mp nagyon rövid: vágj felesleget, hagyj CTA-t a végén. Gyakorold, amíg belefér az időbe.</p>`,
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
<p>Ma portfólió-minőségű kimenetet készítesz AI-val: profi, konzisztens, teljes, jól formázott.</p>
<ul>
<li>minőség: hibamentes, tömör, érthető</li>
<li>konzisztencia: stílus/forma egységes</li>
<li>teljesség: minden szükséges infó benne</li>
<li>megjelenés: jól formázott, olvasható</li>
</ul>

<hr />
<h2>QA checklist</h2>
<ul>
<li>Hibák: helyesírás, számok, nevek, dátumok</li>
<li>Teljesség: hiányzó szekciók? CTA?</li>
<li>Konzisztencia: stílus/terminológia egységes?</li>
<li>Formázás: címsorok, bullet, táblázat, whitespace</li>
<li>Biztonság: nincs érzékeny adat</li>
</ul>

<hr />
<h2>Gyakorlat</h2>
<p>Válassz feladatot (pl. kampányterv, PRD váz, esettanulmány). Kérj portfólió-minőségű kimenetet a fenti kritériumokkal, majd futtasd le a QA checklistet és finomíts.</p>

<h2>Prompt minta</h2>
<blockquote>
<p>Készíts portfólió-minőségű anyagot. Feladat: [leírás]. Követelmények: profi, hibamentes, egységes stílus, teljes. Formázás: címsorok + bullet/táblázat, világos CTA. Adj ön-QA listát is (mire figyeljek átnézéskor).</p>
</blockquote>

<h2>Tipp</h2>
<p>Mindig futtasd a QA listát. Ha lehet, kérj „önellenőrzést” is a modelltől, majd olvasd át te.</p>`,
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
<p>Ma megrajzolod a személyes AI-fejlődési térképedet: hol tartasz, hova mész, hogyan méred, 4 hetes akciótervvel.</p>
<ul>
<li>jelenlegi szint 1–5 kulcsterületen</li>
<li>konkrét célok (mit szeretnél elérni)</li>
<li>lépések és eszközök (sablon, workflow, QA)</li>
<li>mérés: hogyan követed (KPI, review)</li>
</ul>

<hr />
<h2>Fejlődési térkép elemei</h2>
<ul>
<li><strong>Jelenlegi szint</strong>: prompt, workflow, sablon, QA/biztonság, szerep-specifikus</li>
<li><strong>Célok</strong>: pl. „komplex feladatok”, „automatizálás”, „portfólió anyag”</li>
<li><strong>Lépések</strong>: gyakorlás, sablonfrissítés, QA checklist használat</li>
<li><strong>Mérés</strong>: mennyi iteráció kell, időmegtakarítás, hibaarány</li>
</ul>

<hr />
<h2>Gyakorlat</h2>
<ol>
<li>Értékeld magad 1–5-re a kulcsterületeken.</li>
<li>Írj 3 célt (4 hetes távon).</li>
<li>Határozd meg a lépéseket (heti feladatok, eszközök).</li>
<li>Készíts 4 hetes akciótervet, mérőszámokkal.</li>
</ol>

<h2>Prompt minta</h2>
<blockquote>
<p>Készíts személyes AI-fejlődési térképet. Struktúra: 1) Jelenlegi szint (1–5: prompt, workflow, sablon, QA/biztonság, szerep-specifikus), 2) 3 cél (4 hétre), 3) Lépések (heti feladatok, eszközök), 4) Mérés (KPI: iterációk száma, időspórolás, hibaarány). Adj 4 hetes akciótervet.</p>
</blockquote>

<h2>Tipp</h2>
<p>Kis célok, rövid határidő (4 hét), mérhető lépések. A térképet frissítsd hetente.</p>`,
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
<p>Ma lezársz és pályára állítod a következő 4 heted: tanulságok, alkalmazás, fejlesztés, akcióterv.</p>
<ul>
<li>összegzed a top tanulságokat</li>
<li>kiválasztod a legjobb gyakorlatokat, amiket alkalmazol</li>
<li>kijelölöd a következő lépéseket (4 hetes terv)</li>
<li>megőrzöd a lendületet (rutin, mérés, megosztás)</li>
</ul>

<hr />
<h2>Összegzés</h2>
<p>Végigmentél az alap→haladó íven: prompt, iteráció, stílus, biztonság, workflow, sablonok, szerep-specifikus használat, bevételi fókusz, portfólió minőség.</p>

<h2>Merre tovább?</h2>
<ol>
<li><strong>Gyakorolj</strong>: napi rutin, sablonhasználat.</li>
<li><strong>Fejlessz</strong>: frissítsd a sablon- és QA-könyvtárat.</li>
<li><strong>Oszd meg</strong>: taníts másokat, kérj visszajelzést.</li>
<li><strong>Mérj</strong>: időspórolás, iterációk száma, hibaarány.</li>
</ol>

<hr />
<h2>Gyakorlat</h2>
<ol>
<li>Írj 3 fő tanulságot.</li>
<li>Írj 3 konkrét feladatot, ahol holnaptól alkalmazod.</li>
<li>Írj 3 fejlesztési lépést (pl. automatizálás, mélyebb QA, új szerep-sablon).</li>
<li>Készíts 4 hetes akciótervet mérőszámokkal.</li>
</ol>

<h2>Prompt minta</h2>
<blockquote>
<p>Készíts „merre tovább” tervet. Struktúra: 1) 3 fő tanulság, 2) 3 alkalmazási feladat, 3) 3 fejlesztési lépés, 4) 4 hetes akcióterv (mérőszámokkal: időspórolás/iteráció/hibaarány). Adj javaslatot a rutin fenntartására és tudásmegosztásra.</p>
</blockquote>

<h2>Tipp</h2>
<p>A kurzus lezárult, de a gyakorlat visz előre. Tartsd a napi rutint, mérd az eredményt, és frissítsd rendszeresen a könyvtáradat.</p>

<h2>Köszönjük!</h2>
<p>Köszönjük, hogy végigcsináltad! 🚀</p>`,
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
  } else if (day === 11) {
    // Day 11: Saját prompt könyvtár
    questions.push(
      {
        question: 'Miért érdemes prompt könyvtárat építeni?',
        options: [
          'Időt takarít meg, konzisztenciát ad, könnyen újrahasználható',
          'Hogy hosszabb legyen a munka',
          'Csak dísznek',
          'Mert tiltott az újrahasználat'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.EASY,
        category: 'Course Specific'
      },
      {
        question: 'Melyik elem kötelező egy sablonban?',
        options: [
          'Cél, Kontextus, Forma, Stílus, Változók',
          'Csak cím',
          'Csak hossz',
          'Csak stílus'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.EASY,
        category: 'Course Specific'
      },
      {
        question: 'Mi a jó példa sablonra?',
        options: [
          '„Írj rövid, udvarias emailt [címzett]-nek. Kontextus: [helyzet]. Stílus: [stílus]. Hossz: max [hossz]. Adj CTA-t.”',
          '„Írj emailt.”',
          '„Írj valamit.”',
          '„Adj bármit, forrás nélkül.”'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Miért jó változókat használni a sablonban?',
        options: [
          'Gyorsan kitölthető és helyzetre szabható',
          'Felesleges bonyolítás',
          'Csak hosszabb lesz',
          'Nem lehet velük iterálni'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Miért érdemes verziózni a sablonokat?',
        options: [
          'Lásd, mi működött jobban, és dokumentáld a fejlődést',
          'Mert kötelező a szám',
          'Csak dísz',
          'Nem szabad módosítani'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        category: 'Course Specific'
      },
      {
        question: 'Milyen kategóriák hasznosak a könyvtárban?',
        options: [
          'Email, összefoglaló, teendőlista, brief, ötletelés',
          'Csak email',
          'Csak versek',
          'Csak képek'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.EASY,
        category: 'Course Specific'
      }
    );
  } else if (day === 12) {
    // Day 12: Workflow: input → feldolgozás → output
    questions.push(
      {
        question: 'Mi a workflow 4 fő lépése?',
        options: [
          'Input, Feldolgozás, Output, Ellenőrzés',
          'Csak Input',
          'Csak Output',
          'Feldolgozás és kész'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.EASY,
        category: 'Course Specific'
      },
      {
        question: 'Miért kell anonimizálni az inputot?',
        options: [
          'Védelem: ne ossz meg személyes/bizalmas adatot',
          'Hogy hosszabb legyen a szöveg',
          'Mert kötelező szabály, de haszna nincs',
          'Hogy ne kelljen kontextust adni'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Mi tartozik a Feldolgozás lépéshez?',
        options: [
          'Prompt v1 → feedback → prompt v2 (iteráció)',
          'Csak a prompt leírása',
          'Csak a kimenet',
          'Csak az anonimizálás'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Mit ellenőrizel az Outputnál?',
        options: [
          'Formátum, hossz, CTA, felelősök/határidők, teljesség',
          'Csak a színt',
          'Csak a dátumot',
          'Csak a szóközöket'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Miért fontos az ellenőrzés lépése?',
        options: [
          'Tényeket validálsz, hibát szűrsz, döntéseket tisztázol',
          'Csak dísz',
          'Mindig hibátlan az AI',
          'Időpazarlás'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        category: 'Course Specific'
      },
      {
        question: 'Mi a mini pipeline példa meeting jegyzetnél?',
        options: [
          'Tisztítás → összefoglaló/döntés/teendő → export → ellenőrzés',
          'Jegyzet → küldés',
          'Csak összefoglaló',
          'Csak teendők'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      }
    );
  } else if (day === 13) {
    // Day 13: Hibák, hallucinációk kezelése
    questions.push(
      {
        question: 'Mikor valószínű a hallucináció?',
        options: [
          'Pontos dátum/szám forrás nélkül, nem létező esemény/nevek',
          'Ha sok forrás van',
          'Ha te írtad a szöveget',
          'Ha csak számokat kérsz'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.EASY,
        category: 'Course Specific'
      },
      {
        question: 'Mi a „forrás vagy disclaimer” szabály?',
        options: [
          'Vagy hivatkozol, vagy jelzed a bizonytalanságot; nem találsz ki adatot',
          'Mindig találj ki forrást',
          'Soha ne írj forrást',
          'Csak számokat írj'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Mit kérj az AI-tól biztonságos információkéréskor?',
        options: [
          'Bizonytalanság jelzése, forrás/link, ne találjon ki adatot',
          'Minél több kitalált példát',
          'Csak hosszú szöveget',
          'Semmit, hagyd rá'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Mi a helyes lépés, ha eltérést találsz a válaszban?',
        options: [
          'Jelezd, hogy hibás, kérj javítást és forrást',
          'Elfogadod',
          'Törlöd a kérést',
          'Új témára ugrasz'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Miért kérj alternatív megoldásokat és jelzést a biztosságról?',
        options: [
          'Lásd a választékot és válaszd a legbiztosabbat, majd validáld',
          'Hogy hosszabb legyen',
          'Csak dísz',
          'Nem érdemes'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        category: 'Course Specific'
      },
      {
        question: 'Melyik jelzi, hogy a modell kitalált forrást ad?',
        options: [
          'Nem létező hivatkozás, túl általános „források”, eltérés más forrásokkal',
          'Pontos link hivatalos oldalra',
          'Kép URL',
          'Nincs említés'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        category: 'Course Specific'
      }
    );
  } else if (day === 14) {
    // Day 14: Személyes "AI-asszisztens" hang kialakítása
    questions.push(
      {
        question: 'Miért építesz hangprofilt?',
        options: [
          'Hogy az AI következetesen úgy írjon, mint te',
          'Hogy hosszabb szöveget írjon',
          'Hogy elkerüld a példákat',
          'Csak dísz miatt'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.EASY,
        category: 'Course Specific'
      },
      {
        question: 'Mik a hangprofil fő elemei?',
        options: [
          'Hang, formalitás, mondathossz, szóhasználat, struktúra',
          'Csak cím',
          'Csak szóközök',
          'Csak dátum'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Mi tartozik a „do/don’t” listába?',
        options: [
          'Mit használjon (rövid mondatok, példák), mit kerüljön (szleng, hosszú bekezdések)',
          'Csak a címet',
          'Csak számokat',
          'Csak képeket'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Mi a jó prompt a hangprofil használatára?',
        options: [
          '„Íme 3 szövegem. Elemezd: hang, formalitás, mondathossz, szóhasználat, struktúra. Készíts hang-útmutatót (do/don’t), és írj új szöveget ugyanígy: [téma].”',
          '„Írj valamit.”',
          '„Legyen szebb.”',
          '„Adj egy mondatot.”'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Miért kell több minta a pontos hanghoz?',
        options: [
          'Minél több példa, annál pontosabban tanulja a stílust',
          'Felesleges, elég 1 szó',
          'Csak azért, hogy hosszabb legyen',
          'Nem kell minta'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.EASY,
        category: 'Course Specific'
      },
      {
        question: 'Mit jelent a „hangprofil élő dokumentum”?',
        options: [
          'Frissíted, ha változik a stílusod, és újrahasználod',
          'Soha nem változik',
          'Csak egyszer használod',
          'Nem tárolod el'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        category: 'Course Specific'
      }
    );
  } else if (day === 15) {
    // Day 15: Ismétlés: rossz prompt → jó prompt
    questions.push(
      {
        question: 'Mi a fő cél a rossz → jó prompt átalakításnál?',
        options: [
          'Hiányzó elemek pótlása (cél, kontextus, forma, stílus, hossz, CTA)',
          'Hosszabb szöveget írni',
          'Kevesebb információt adni',
          'Eltávolítani a kontextust'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.EASY,
        category: 'Course Specific'
      },
      {
        question: 'Mi a 3 lépés a javításnál?',
        options: [
          'Diagnózis → pontosítás → validálás/összehasonlítás',
          'Csak újrafuttatás',
          'Csak törlés',
          'Csak formázás'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.EASY,
        category: 'Course Specific'
      },
      {
        question: 'Miért érdemes formátumot váltani (bullet vs. bekezdés)?',
        options: [
          'Eltérő formátum gyakran használhatóbb/áttekinthetőbb',
          'Mindig rosszabb',
          'Felesleges',
          'Csak hosszabb lesz'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Mi jó feedback egy rossz válaszra?',
        options: [
          '„Hiányzik a CTA, túl hosszú. Rövidítsd 50%-kal, bulletben, üzleti stílusban.”',
          '„Nem jó.”',
          '„Legyen szebb.”',
          '„Írj valamit.”'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Miért hasznos „Before/After” gyűjteményt tartani?',
        options: [
          'Referenciának és tanuláshoz, hogy lásd a fejlődést',
          'Csak helyet foglal',
          'Nem hasznos',
          'Mert kötelező szabály'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        category: 'Course Specific'
      }
    );
  } else if (day === 16) {
    // Day 16: Marketing / Sales / PM / Dev – belépő nap
    questions.push(
      {
        question: 'Mi a napi cél ennél a leckénél?',
        options: [
          'Személyre szabni az AI-használatot a saját szerepedre (feladatlista, gyorsítási pontok, sablonok)',
          'Általános feladatokat írni',
          'Csak hosszabb szöveget kérni',
          'Semmit nem kell csinálni'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.EASY,
        category: 'Course Specific'
      },
      {
        question: 'Melyik példa tartozhat a Marketing szerephez?',
        options: [
          'Kampány brief, persona, értékajánlat, posztvázlat',
          'Bug report',
          'SQL query írás',
          'Firmware frissítés'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.EASY,
        category: 'Course Specific'
      },
      {
        question: 'Miért készíts szerep-specifikus prompt sablont?',
        options: [
          'Gyorsít és a te feladataidra optimalizál',
          'Csak hosszabb lesz',
          'Nem hasznos',
          'Mert kötelező számot írni'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Mi legyen a „Top 5 napi feladat” listában?',
        options: [
          'A tényleges napi feladataid, ahol az AI segíthet',
          'Bármi, ami eszedbe jut',
          'Csak hobbi',
          'Csak random ötletek'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Mit tartalmazzon a szerep-specifikus AI terv?',
        options: [
          'Feladatlista, AI-val gyorsítható elemek, prompt sablonok, várt output',
          'Csak egy címet',
          'Csak a stílust',
          'Csak a határidőt'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        category: 'Course Specific'
      },
      {
        question: 'Mi a tipp a szerep-specifikus használathoz?',
        options: [
          'Kezdj 3 sablonnal, teszteld, majd bővíts',
          'Mindig 0 sablonnal kezdj',
          'Ne tesztelj',
          'Ne adj kontextust'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        category: 'Course Specific'
      }
    );
  } else if (day === 17) {
    // Day 17: Szerephez illesztett sabloncsomag I.
    questions.push(
      {
        question: 'Miért készítesz szerep-specifikus sabloncsomagot?',
        options: [
          'Gyorsítja a visszatérő feladatokat és konzisztens minőséget ad',
          'Hogy hosszabb legyen a folyamat',
          'Csak dísznek',
          'Mert tilos újrahasználni'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.EASY,
        category: 'Course Specific'
      },
      {
        question: 'Melyik az 5 alap sablon ebben a csomagban?',
        options: [
          'Email, összefoglaló, teendő, vázlat, szerep-specifikus feladat',
          'Csak egy email sablon',
          'Csak egy blogposzt sablon',
          'Csak egy táblázat sablon'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.EASY,
        category: 'Course Specific'
      },
      {
        question: 'Miért adj két stílusvariánst ugyanarra a sablonra?',
        options: [
          'Hogy legyen választás (pl. üzleti vs. barátságos) és finomíthasd',
          'Csak hosszabb lesz',
          'Nem szükséges, mindig ugyanaz kell',
          'Mert kevesebb kontextus kell'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Mit tartalmazzon az ellenőrző sablon?',
        options: [
          'CTA, számok, határidő, felelős megléte',
          'Csak a címet',
          'Csak a színt',
          'Csak a hossz beállítását'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Miért érdemes jegyzetelni (v1 → v2) a sablon teszteléskor?',
        options: [
          'Lásd, mi működött, és javítsd tudatosan',
          'Nem szükséges, csak időpazarlás',
          'Mert kötelező űrlap',
          'Hogy ne tudd, mi változott'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        category: 'Course Specific'
      },
      {
        question: 'Milyen változókat érdemes beleírni a sablonba?',
        options: [
          '[téma], [címzett], [stílus], [hossz], [formátum]',
          'Semmit, mindig fix',
          'Csak a dátumot',
          'Csak a nevet'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      }
    );
  } else if (day === 18) {
    // Day 18: Szerephez illesztett sabloncsomag II.
    questions.push(
      {
        question: 'Mi jellemzi a haladó sablonokat?',
        options: [
          'Komplex, integrációs vagy automatizáló feladatok több lépéssel',
          'Csak egy mondatos kérések',
          'Mindig ugyanaz a kimenet',
          'Nincs benne ellenőrzés'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.EASY,
        category: 'Course Specific'
      },
      {
        question: 'Melyik jó példa integrációs sablonra?',
        options: [
          'Adatbeolvasás + összefoglaló + döntési javaslat egy promptban',
          'Csak email kérése',
          'Csak egy üres táblázat',
          'Csak köszönés'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Miért kell QA/ellenőrző lépés a haladó sablonokban?',
        options: [
          'Számok, források, konzisztencia ellenőrzése; jelezze a hiányt',
          'Felesleges, mindig hibátlan',
          'Csak lassít',
          'Nem lehet ellenőrizni'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Milyen változókat érdemes megadni?',
        options: [
          'Adatforrás, formátum, határidő, stílus',
          'Csak a cím',
          'Csak a dátum',
          'Nincs szükség változóra'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.EASY,
        category: 'Course Specific'
      },
      {
        question: 'Mi a három fő haladó sablontípus ebben a leckében?',
        options: [
          'Komplex, integrációs, automatizálási',
          'Email, email, email',
          'Táblázat, táblázat, táblázat',
          'Kép, hang, video'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.EASY,
        category: 'Course Specific'
      },
      {
        question: 'Mit jelent a chaining ebben a kontextusban?',
        options: [
          'Több prompt egymás után (pl. vázlat → bővítés → QA)',
          'Egy prompt végtelen ismétlése',
          'Nincs ilyen',
          'Képfűzés'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        category: 'Course Specific'
      }
    );
  } else if (day === 19) {
    // Day 19: Tipikus csapdák az adott szerepben
    questions.push(
      {
        question: 'Miért kell csapdalistát írni szerep szerint?',
        options: [
          'Hogy felismerd és elkerüld a tipikus hibákat a saját feladataidban',
          'Hogy hosszabb legyen a dokumentum',
          'Mert kötelező, de hasztalan',
          'Csak díszítés'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.EASY,
        category: 'Course Specific'
      },
      {
        question: 'Melyik jelzi, hogy marketing output hibás lehet?',
        options: [
          'Kitalált statisztikák, forrás nélkül',
          'Pontos, hivatkozott számok',
          'Persona-alapú üzenetek',
          'Valódi mérőszámokkal ellátott ajánlat'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Mi a jó elkerülés sales csapdára?',
        options: [
          'Kérj 3 személyre szabott variánst [persona]-ra',
          'Általános üzenet mindenkihez',
          'Csak terméklistát küldeni',
          'Semmi ellenőrzés'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Milyen ellenőrzést kérnél Dev feladatnál?',
        options: [
          'Unit teszt/edge case lista, hiba jelzése',
          'Csak kód magyarázat',
          'Semmi, küldd el',
          'Csak kommentek'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        category: 'Course Specific'
      },
      {
        question: 'Mi legyen minden csapdapontnál a dokumentumban?',
        options: [
          'Jelzés, elkerülés (prompt), ellenőrzés (kérdés)',
          'Csak a cím',
          'Csak a dátum',
          'Csak egy emoji'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Miért „élő” a csapdalista?',
        options: [
          'Folyamatosan frissíted új hibákkal, és összekötöd a sablonjaiddal',
          'Soha nem változik',
          'Csak egyszer írod meg',
          'Nem tárolod el'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        category: 'Course Specific'
      }
    );
  } else if (day === 20) {
    // Day 20: Skill-check & szintlépés
    questions.push(
      {
        question: 'Mi a skill-check célja?',
        options: [
          'Felmérni az erősségeket/hiányokat és kijelölni a következő célokat',
          'Csak hosszabb szöveget írni',
          'Mindig nulláról kezdeni',
          'Nem kell mérni a fejlődést'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.EASY,
        category: 'Course Specific'
      },
      {
        question: 'Mely területeket érdemes értékelni?',
        options: [
          'Prompt, workflow, sablon, QA/hibakezelés, szerep-specifikus, biztonság',
          'Csak a stílust',
          'Csak a dátumot',
          'Csak a hosszot'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Mi tartozik az akciótervbe?',
        options: [
          'Konkrét lépések, határidők, mely sablont/workflow-t frissíted',
          'Csak egy mondat',
          'Semmi, mert nincs szükség rá',
          'Csak a címsor'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Miért válassz kevés fejlesztendő célt egyszerre?',
        options: [
          'Könnyebb végigvinni és valódi fejlődést látni',
          'Hogy sose fejezd be',
          'Csak dísz',
          'Nem számít'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        category: 'Course Specific'
      },
      {
        question: 'Milyen KPI-ket érdemes nézni a fejlődéshez?',
        options: [
          'Időspórolás, iterációk száma, hibaarány',
          'Csak a logó mérete',
          'Csak a betűtípus',
          'Csak a dátum'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Miért jobb kevés fejlesztési célt választani?',
        options: [
          'Fókuszáltan tudsz haladni és valódi eredményt látsz',
          'Mert tilos a sok cél',
          'Mindig végtelen célt kell felvenni',
          'Csak dísz'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      }
    );
  } else if (day === 21) {
    // Day 21: Ötletvalidálás AI-val
    questions.push(
      {
        question: 'Melyik a helyes validációs struktúra?',
        options: [
          'Piaci térkép, kockázatok, erőforrás, értékajánlat',
          'Csak egy mondat',
          'Csak erőforrás',
          'Csak kockázat nélkül'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.EASY,
        category: 'Course Specific'
      },
      {
        question: 'Miért kérj forrást vagy disclaimert?',
        options: [
          'Hogy ne vegyél át kitalált adatot, és lásd a bizonytalanságot',
          'Hogy hosszabb legyen',
          'Felesleges, mindig igaz',
          'Csak dísz'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Mit tartalmazzon a kockázati lista?',
        options: [
          'Top 5 kockázat hatás/valószínűség szerint',
          'Csak a címet',
          'Semmit, mert nem fontos',
          'Csak dátumot'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Mi az értékajánlat rövid célja?',
        options: [
          'Probléma→Megoldás→Előny röviden, miért mi',
          'Hosszú regény',
          'Csak árlista',
          'Csak kifogások'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Hogyan kezeld a kockázatokat a validálásban?',
        options: [
          'Top 5 kockázat hatás/valószínűség szerint, és jelöld, mit kell ellenőrizni',
          'Hagyd figyelmen kívül',
          'Csak egyet írj le',
          'Ne értékeld a hatást'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Mit kérj az erőforrás becslésnél?',
        options: [
          'Idő, pénz, csapat/skill igény, bizonytalanság jelzése',
          'Csak pénz',
          'Csak idő',
          'Csak egy szám forrás nélkül'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      }
    );
  } else if (day === 22) {
    // Day 22: Persona & értékajánlat
    questions.push(
      {
        question: 'Mi legyen a persona-ban?',
        options: [
          'Demó, célok, fájdalom-pontok, kifogások, döntési szempontok',
          'Csak név',
          'Csak ár',
          'Csak dátum'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.EASY,
        category: 'Course Specific'
      },
      {
        question: 'Mi a jó értékajánlat felépítése?',
        options: [
          'Probléma → Megoldás → Előny (eredmény) + miért mi',
          'Csak terméklista',
          'Csak kifogások',
          'Csak ár'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Miért kérj két üzenetvariánst (üzleti vs. barátságos)?',
        options: [
          'Hogy lásd, melyik rezonál jobban, és választhass',
          'Csak időpazarlás',
          'Nem érdemes',
          'Mert így hosszabb lesz'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Mit tegyél, ha nincs elég adat a personához?',
        options: [
          'Jelezd a bizonytalanságot, és kérj alternatív feltételezéseket',
          'Találj ki adatot',
          'Hagyj mindent üresen',
          'Ne jelezz semmit'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        category: 'Course Specific'
      },
      {
        question: 'Miért kérj kifogásokat a personához?',
        options: [
          'Hogy az üzenetet és értékajánlatot a valós ellenvetésekre szabhasd',
          'Csak hosszabbításért',
          'Nem szükséges, mindig azonos',
          'Csak a színek miatt'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Mi legyen az üzenetvariánsok célja?',
        options: [
          'Tesztelni, melyik rezonál jobban (pl. üzleti vs. barátságos)',
          'Mindkettő legyen azonos',
          'Csak egy legyen, mindig',
          'Nem kell üzenet'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      }
    );
  } else if (day === 23) {
    // Day 23: Landing váz és szöveg
    questions.push(
      {
        question: 'Mi a landing alap struktúrája?',
        options: [
          'Hero, értékajánlat, funkciók/előnyök, social proof, CTA, (opcionális FAQ)',
          'Csak egy hosszú bekezdés',
          'Csak CTA',
          'Csak képek'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.EASY,
        category: 'Course Specific'
      },
      {
        question: 'Mit tegyél a hero szekcióba?',
        options: [
          'Cím, alcím, CTA – röviden a fő érték',
          'Részletes árlista',
          'Hosszú történet',
          'Csak lábléc'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Miért kérj több variánst (rövid/részletes/bullet)?',
        options: [
          'Hogy választhasd a legjobb formátumot és finomíthasd',
          'Csak időpazarlás',
          'Mindig elég egy verzió',
          'Felesleges, mert nem számít a forma'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Miért fontos a CTA pontossága?',
        options: [
          'Konkrét cselekvést kér (pl. “Próbáld ki ingyen”), növeli a konverziót',
          'Csak dísz',
          'Nem kell CTA',
          'Mindegy, mit írunk oda'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        category: 'Course Specific'
      },
      {
        question: 'Mikor érdemes social proof vagy FAQ blokkot kérni?',
        options: [
          'Ha növelni akarod a bizalmat, és vannak tipikus kérdések',
          'Soha',
          'Csak ha nincs CTA',
          'Csak ha nincs hero'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Miért legyen a hero tömör és egyértelmű?',
        options: [
          'Az első benyomás dönti el, érti-e a látogató az értéket',
          'Hogy hosszabb legyen az oldal',
          'Hogy elrejtse a CTA-t',
          'Nem számít a hero'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      }
    );
  } else if (day === 24) {
    // Day 24: Árazás alapjai
    questions.push(
      {
        question: 'Melyik árazási elem NEM maradhat ki?',
        options: [
          'Piaci kutatás, érték-alap, versenyképesség, stratégia javaslat',
          'Csak a logó',
          'Csak a színek',
          'Csak a dátum'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.EASY,
        category: 'Course Specific'
      },
      {
        question: 'Miért kell forrást vagy disclaimert kérni?',
        options: [
          'Hogy ne vegyél át kitalált adatot, lásd a bizonytalanságot',
          'Felesleges, mindig igaz',
          'Csak hogy hosszabb legyen',
          'Mert kötelező sablon'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Mit takar az érték-alapú árazás?',
        options: [
          'Az eredmény/idő/pénz értéke alapján pozícionálsz',
          'Csak a költséget nézed',
          'Csak a versenytárs árát nézed',
          'Csak a logót nézed'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Mit tartalmazzon az árstratégia javaslat?',
        options: [
          'Modellek (pl. subscription/tiered) + pro/kontra + indoklás',
          'Csak egy szám',
          'Csak a színek',
          'Csak a név'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        category: 'Course Specific'
      },
      {
        question: 'Miért kell pozícionálni (low/mid/premium)?',
        options: [
          'Hogy tudd, hol állsz a versenyhez képest és igazodjon az ár',
          'Csak színezés miatt',
          'Nem fontos',
          'Csak a logó miatt'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Mikor válassz subscription/tiered modellt?',
        options: [
          'Ha folyamatos értéket adsz és több szintű igény van',
          'Mindig csak egyszeri díj',
          'Mindig csak freemium',
          'Soha ne gondolkodj modellen'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        category: 'Course Specific'
      }
    );
  } else if (day === 25) {
    // Day 25: MVP gondolkodás – mit NEM csinálunk
    questions.push(
      {
        question: 'Mi az MVP lényege?',
        options: [
          'Minimális funkciókészlet, ami értéket ad, kizárásokkal',
          'Mindent építs meg egyszerre',
          'Csak a logót készítsd el',
          'Csak a roadmapet írd meg'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.EASY,
        category: 'Course Specific'
      },
      {
        question: 'Miért fontos a „mit NEM csinálunk” lista?',
        options: [
          'Védi a scope-ot és fókuszt, ne csússzon vissza minden',
          'Csak dísz',
          'Nem számít',
          'Csak hogy hosszabb legyen a dokumentum'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Milyen elemek legyenek egy MVP tervben?',
        options: [
          'Mit csinálunk (top funkciók), mit nem, prioritás, érték/mérőszám',
          'Csak egy cím',
          'Csak ár',
          'Csak kifogások'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Miért fontos priorizálni az MVP-ben?',
        options: [
          'Hogy először a legnagyobb értéket szállítsd',
          'Hogy mindent egyszerre csinálj',
          'Csak mert kötelező számot írni',
          'Nem fontos'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        category: 'Course Specific'
      },
      {
        question: 'Mi a scope cut szerepe az MVP-ben?',
        options: [
          'Kizárja a nem kritikus elemeket, hogy gyorsan szállíts értéket',
          'Mindent benne hagy',
          'Csak a dizájnt hagyja ki',
          'Nem kell scope cut'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Milyen mérőszámot érdemes az MVP-hez kötni?',
        options: [
          'Probléma-érték mérőszám (pl. időspórolás, konverzió)',
          'Csak a színkód',
          'Csak a logó mérete',
          'Semmilyet'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        category: 'Course Specific'
      }
    );
  } else if (day === 26) {
    // Day 26: Saját AI-rutin kialakítása
    questions.push(
      {
        question: 'Mi a napi AI-rutin fő célja?',
        options: [
          'Rendszeres, időkeretes feladatblokkok (reggel/napközben/este) QA-val',
          'Csak egyszeri prompt írás',
          'Csak kreatív írás',
          'Semmi, nincs cél'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.EASY,
        category: 'Course Specific'
      },
      {
        question: 'Mit tartalmazzon minden rutin feladat?',
        options: [
          'Cél, prompt, időkeret, QA lépés',
          'Csak egy cím',
          'Csak dátum',
          'Csak stílus'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Miért kell QA lépést beépíteni?',
        options: [
          'Számok/határidők/felelősök ellenőrzése nélkül könnyen hibázol',
          'Időpazarlás',
          'Felesleges, mindig jó az AI',
          'Csak dísz'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Mi a biztonsági szabály a rutinban?',
        options: [
          'Anonimizálás, ne adj be érzékeny adatot',
          'Add meg a jelszavakat',
          'Használd az összes adatot nyersen',
          'Nincs szabály'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Miért hasznos időkeretet adni a rutin feladatokra?',
        options: [
          'Fegyelmezi a használatot és megelőzi az időfolyást',
          'Csak dísz',
          'Nem számít az idő',
          'Mindig korlátlan idő kell'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Miért kérj alternatívát (2 stílus) rutinban is?',
        options: [
          'Hogy legyen választási lehetőség és gyorsan finomíts',
          'Csak hosszabbítja a folyamatot',
          'Nem szabad alternatívát kérni',
          'Csak ha nincs idő'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      }
    );
  } else if (day === 27) {
    // Day 27: 60 másodperces pitch AI-val
    questions.push(
      {
        question: 'Mi a 60 mp-es pitch alap struktúrája?',
        options: [
          'Probléma → Megoldás → Érték/Proof → CTA',
          'Csak értékajánlat',
          'Csak CTA',
          'Csak egy történet'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.EASY,
        category: 'Course Specific'
      },
      {
        question: 'Miért kell időt mérni és rövidíteni?',
        options: [
          '60 mp nagyon rövid, ki kell férnie lényegre törően',
          'Mindegy az idő',
          'Csak hosszabb legyen',
          'Csak vizuálisan számít'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Miért kérj 3 verziót (rövid/részletes/bullet)?',
        options: [
          'Hogy kiválaszd a legjobb formát és finomítsd',
          'Csak időpazarlás',
          'Mindig elég egy verzió',
          'Nem kell forma'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Mit tegyen a CTA a pitch végén?',
        options: [
          'Egyértelmű következő lépést kérjen',
          'Csak köszönjön el',
          'Ne legyen CTA',
          'Legyen véletlenszerű'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        category: 'Course Specific'
      },
      {
        question: 'Miért fontos a proof/eredmény említése a pitchben?',
        options: [
          'Bizalmat épít, megmutatja a hatást',
          'Csak dísz',
          'Nem kell proof',
          'Csak a CTA számít'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Mikor említs persona-fitet a pitchben?',
        options: [
          'Ha tudod, kinek szól, növeli a relevanciát',
          'Soha',
          'Mindig hagyd ki',
          'Csak a végén, ok nélkül'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        category: 'Course Specific'
      }
    );
  } else if (day === 28) {
    // Day 28: Portfólió-szintű kimenetek
    questions.push(
      {
        question: 'Mit jelent a portfólió-minőség?',
        options: [
          'Profi, hibamentes, egységes stílusú, teljes és jól formázott anyag',
          'Bármi, ami hosszú',
          'Csak a stílus számít',
          'Csak a hossz számít'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.EASY,
        category: 'Course Specific'
      },
      {
        question: 'Mi van a QA checklistben?',
        options: [
          'Hibák, teljesség, konzisztencia, formázás, biztonság',
          'Csak a színek',
          'Csak a logó',
          'Csak a hossz'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Miért kérj ön-QA listát a modelltől is?',
        options: [
          'Hogy lásd, mire figyelt, és te is ellenőrizhesd',
          'Felesleges, mindig jó',
          'Csak hosszabb lesz',
          'Nem lehet QA-t kérni'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Mikor érdemes portfólióba menteni egy anyagot?',
        options: [
          'Ha átment a QA-n és megfelel a minőség/konszisztencia/teljesség/forma elvárásnak',
          'Mindig, első verzióban',
          'Soha',
          'Csak ha véletlenül jó'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        category: 'Course Specific'
      },
      {
        question: 'Miért számít a formázás (cím, bullet, whitespace)?',
        options: [
          'Olvashatóságot és profi benyomást ad',
          'Csak esztétika, nem számít',
          'Nem kell formázni',
          'Csak a szín számít'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Mikor tedd portfólióba a kimenetet?',
        options: [
          'Ha QA után megfelel minőség/konszisztencia/teljesség/forma elvárásnak',
          'Mindig első verziót',
          'Soha',
          'Ha véletlenül rövid'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        category: 'Course Specific'
      }
    );
  } else if (day === 29) {
    // Day 29: Személyes fejlődési térkép
    questions.push(
      {
        question: 'Mi a fejlődési térkép célja?',
        options: [
          'Hol tartasz, hova mész, milyen lépésekkel és mérőszámokkal',
          'Csak egy cím írása',
          'Csak egy lista véletlenszerűen',
          'Nincs cél'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.EASY,
        category: 'Course Specific'
      },
      {
        question: 'Mely területeket érdemes értékelni 1–5-ig?',
        options: [
          'Prompt, workflow, sablon, QA/biztonság, szerep-specifikus használat',
          'Csak a stílust',
          'Csak a dátumokat',
          'Csak a színeket'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Mi tartozzon a 4 hetes akciótervbe?',
        options: [
          'Heti feladatok, eszközök, mérőszámok, határidők',
          'Csak egy mondat',
          'Semmi, mert felesleges',
          'Csak egy emoji'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Miért fontos mérni (időspórolás, iteráció, hibaarány)?',
        options: [
          'Hogy lásd a fejlődést és tudd, mi működik',
          'Csak díszítés',
          'Nem fontos',
          'Csak hosszabb lesz a dokumentum'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        category: 'Course Specific'
      },
      {
        question: 'Miért legyen heti retro a térkép része?',
        options: [
          'Hogy frissítsd a célokat/akciókat a tapasztalat alapján',
          'Csak dísz',
          'Nem szükséges frissíteni',
          'Csak havonta lehet'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Miért válassz kevés célt 4 hétre?',
        options: [
          'Reálisan végigvihető és mérhető',
          'Mert nem szabad tervezni',
          'Mindig 100 célt írj',
          'Csak hogy hosszabb legyen'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      }
    );
  } else if (day === 30) {
    // Day 30: Zárás – merre tovább?
    questions.push(
      {
        question: 'Mi a záró nap fő feladata?',
        options: [
          'Tanulságok összegzése, alkalmazási és fejlesztési lépések, 4 hetes terv',
          'Csak búcsú',
          'Semmi',
          'Csak CTA írása'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.EASY,
        category: 'Course Specific'
      },
      {
        question: 'Mit tartalmazzon a „merre tovább” terv?',
        options: [
          '3 tanulság, 3 alkalmazási feladat, 3 fejlesztési lépés, 4 hetes akcióterv',
          'Csak egy bekezdés',
          'Csak árlista',
          'Csak képek'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Miért fontos a rutin fenntartása a kurzus után is?',
        options: [
          'A gyakorlás hozza a valódi fejlődést és eredményt',
          'Nem számít',
          'Csak egyszer kell csinálni',
          'Csak dekoráció'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Mi a szerepe a mérőszámoknak a folytatásban?',
        options: [
          'Eredményt mutatnak (időspórolás, iteráció, hibaarány), segítik a fókuszt',
          'Csak hosszabbítják a szöveget',
          'Nem érdemes mérni',
          'Csak dísz'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        category: 'Course Specific'
      },
      {
        question: 'Miért ossz meg tudást/feedbacket a zárás után?',
        options: [
          'Tanulhatsz másoktól, és visszajelzést kapsz a fejlődéshez',
          'Nem számít',
          'Csak időpazarlás',
          'Nem szabad megosztani'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      },
      {
        question: 'Miért tartsd a rutint a kurzus után is?',
        options: [
          'A folyamatos gyakorlás hozza az eredményt',
          'Mert kötelező, de hasztalan',
          'Nem érdemes',
          'Csak egyszer kell csinálni'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        category: 'Course Specific'
      }
    );
  }

  // Return curated questions only (no filler)
  return questions;
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

    // Refresh course-specific quiz questions for this lesson (clear old, then insert curated)
    const deleted = await QuizQuestion.deleteMany({
      lessonId: lessonId,
      courseId: course._id,
      isCourseSpecific: true,
    });

    // Create quiz questions for this lesson
    const quizQuestions = generateQuizQuestions(entry, lessonId, course._id);
    let questionsCreated = 0;

    for (const q of quizQuestions) {
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

    console.log(`  Day ${entry.day}: ${questionsCreated} questions created (cleared ${deleted.deletedCount})`);
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
