/**
 * Seed GEO for Shopify 30-day course (Hungarian)
 *
 * Creates/updates the GEO_SHOPIFY_30 course with the first 3 lessons.
 * Lessons follow the mandatory structure: goal, why, explanation, examples,
 * guided/independent exercises, self-check (binary), optional deepening links.
 */

import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import {
  Brand,
  Course,
  Lesson,
  QuizQuestion,
  QuestionDifficulty
} from '../app/lib/models';

const COURSE_ID = 'GEO_SHOPIFY_30';
const COURSE_NAME = 'GEO Shopify – 30 napos kurzus';
const COURSE_DESCRIPTION =
  '30 napos, gyakorlati GEO-kurzus Shopify kereskedőknek: napi 20-30 percben építed fel a termék- és tartalom alapokat, hogy generatív rendszerek biztonságosan megtalálják, értelmezzék és idézzék a boltodat.';

type LessonEntry = {
  day: number;
  title: string;
  content: string;
  emailSubject?: string;
  emailBody?: string;
};

const lessonPlan: LessonEntry[] = [
  {
    day: 1,
    title: 'Mi a GEO, és mi nem az (Shopify kontextusban)',
    content: `<h1>Mi a GEO, és mi nem az (Shopify)</h1>
<p><em>Megérted, hogy a GEO hogyan különbözik az SEO-tól, és mit jelent az AI-válaszokban való megjelenés.</em></p>
<hr />
<h2>Napi cél</h2>
<ul>
<li>Tisztán különválasztod a GEO és az SEO fogalmát.</li>
<li>Azonosítod, milyen eredményt vársz GEO-tól (idézet, bevonás, következetesség).</li>
<li>Készítesz 5 próba promptot a saját boltodra.</li>
</ul>
<hr />
<h2>Miért számít?</h2>
<ul>
<li>Az AI-válaszokban a boltok csak akkor jelennek meg, ha az információ könnyen előhívható és biztonságosan idézhető.</li>
<li>A GEO növeli az esélyt a megjelenésre; nem garantálja a tranzakciót.</li>
<li>A jó GEO-alap csökkenti a félreértett ajánlások kockázatát (téves ár, készlet, szállítás).</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<h3>GEO vs SEO</h3>
<ul>
<li><strong>SEO</strong>: keresőmotor rangsor a 10 kék linkben.</li>
<li><strong>GEO</strong>: generatív motor válaszaiban való szereplés, idézhetőség.</li>
</ul>
<h3>Mit várhatsz GEO-tól?</h3>
<ul>
<li>Inklúzió: bekerül-e a termék/brand az AI válaszba.</li>
<li>Idézés: hivatkozik-e a domainre.</li>
<li>Konzisztencia: ismétlődik-e több futtatásban.</li>
</ul>
<hr />
<h2>Példák</h2>
<ul>
<li><strong>Jó</strong>: Egyértelmű termékadatok (GTIN, ár, készlet), világos szállítás/retour, tiszta HTML, stabil URL.</li>
<li><strong>Rossz</strong>: Hiányzó azonosítók, félrevezető ár, dinamikus vagy duplikált URL-ek, átláthatatlan szállítás.</li>
</ul>
<hr />
<h2>Gyakorlat (vezetett, 10-15 perc)</h2>
<ol>
<li>Írj 5 GEO promptot a boltodra (pl. „Legjobb [termékkategória] 2025-ben [ország]”).</li>
<li>Jegyezd fel, mit vársz: inklúzió, idézés, konzisztencia.</li>
<li>Mentés egy táblázatba (Prompt, Várt kimenet, Jegyzet).</li>
</ol>
<h2>Gyakorlat (önálló, 5-10 perc)</h2>
<p>Futtasd kézzel a 5 promptot ChatGPT/Copilot/Google AI felületen, jegyezd: megjelenik-e a boltod, hivatkozik-e rád.</p>
<hr />
<h2>Önellenőrzés (igen/nem)</h2>
<ul>
<li>Megvan 5 saját GEO prompt.</li>
<li>Érted a különbséget GEO és SEO között.</li>
<li>Felírtad, mit vársz a GEO-tól (inklúzió, idézés, konzisztencia).</li>
<li>Elvégezted az első manuális futtatást és jegyzeteltél.</li>
</ul>
<hr />
<h2>Opcionális mélyítés</h2>
<ul>
<li>arXiv: GEO (Generative Engine Optimization): <a href="https://arxiv.org/abs/2311.09735" target="_blank" rel="noreferrer">https://arxiv.org/abs/2311.09735</a></li>
<li>Search Engine Land – What is GEO: <a href="https://searchengineland.com/guide/what-is-geo" target="_blank" rel="noreferrer">https://searchengineland.com/guide/what-is-geo</a></li>
</ul>`,
    emailSubject: 'GEO Shopify – 1. nap: Mi a GEO, és mi nem az',
    emailBody: `<h1>GEO Shopify – 1. nap</h1>
<h2>Mi a GEO, és mi nem az</h2>
<p>Ma megérted a GEO és az SEO különbségét, és 5 saját GEO promptot írsz a boltodra.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`
  },
  {
    day: 2,
    title: 'GEO vs SEO Shopify-n: mire figyelj?',
    content: `<h1>GEO vs SEO Shopify-n: mire figyelj?</h1>
<p><em>Rávilágítunk, mely elemek számítanak a generatív felületekben, és hogyan egészítik ki az SEO-t.</em></p>
<hr />
<h2>Napi cél</h2>
<ul>
<li>Listázod, mi SEO-first és mi GEO-first.</li>
<li>Készítesz egy 10 pontos ellenőrzőlistát Shopify-hoz GEO szempontból.</li>
</ul>
<hr />
<h2>Miért számít?</h2>
<ul>
<li>Az AI válaszok gyakran összefoglalják a fő termékadatokat: ha hiányos, kimaradsz.</li>
<li>A GEO nem csak rangsor: a világos, idézhető tartalom a cél.</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<h3>SEO-first elemek</h3>
<ul>
<li>Meta title/description, belső linkek, canonical, page speed.</li>
<li>Backlinkek, strukturált tartalom hosszabb formában.</li>
</ul>
<h3>GEO-first elemek</h3>
<ul>
<li>Pontos termékadatok (ár, készlet, azonosítók) egyértelműen olvashatóan.</li>
<li>Visszaigazolható policy-k (szállítás, visszaküldés), stabil URL-ek.</li>
<li>Tiszta, rövid válaszképes blokkok (answer capsule).</li>
</ul>
<hr />
<h2>Példák</h2>
<ul>
<li><strong>Jó</strong>: Termékoldal tetején tömör összegzés, jól strukturált ár/stock, GTIN és SKU feltüntetve.</li>
<li><strong>Rossz</strong>: Hosszú, rendezetlen leírás, hiányzó azonosítók, összemosott variánsadatok.</li>
</ul>
<hr />
<h2>Gyakorlat (vezetett, 10-15 perc)</h2>
<ol>
<li>Készíts 10 pontos GEO checklistet Shopify-hoz (ár, készlet, GTIN/SKU, policy, answer capsule, stabil URL, alt text, structured data, belső link, reviews szabály).</li>
<li>Jelöld, mi van rendben, mi hiányzik egy minta PDP-n.</li>
</ol>
<h2>Gyakorlat (önálló, 5-10 perc)</h2>
<p>Alkalmazd a checklistet 1 további termékoldalra, és írd fel 3 hiányosságot.</p>
<hr />
<h2>Önellenőrzés</h2>
<ul>
<li>Megvan a 10 pontos GEO checklist.</li>
<li>Egy PDP-n kipipáltad, mi van rendben/hiányzik.</li>
<li>Felírtál 3 javítandó elemet egy másik PDP-n.</li>
</ul>
<hr />
<h2>Opcionális mélyítés</h2>
<ul>
<li>Google Search Central – GenAI content: <a href="https://developers.google.com/search/docs/fundamentals/using-gen-ai-content" target="_blank" rel="noreferrer">https://developers.google.com/search/docs/fundamentals/using-gen-ai-content</a></li>
<li>Shopify termékadat: <a href="https://shopify.dev/docs/apps/selling-strategies/product-data" target="_blank" rel="noreferrer">https://shopify.dev/docs/apps/selling-strategies/product-data</a></li>
</ul>`,
    emailSubject: 'GEO Shopify – 2. nap: GEO vs SEO Shopify-n',
    emailBody: `<h1>GEO Shopify – 2. nap</h1>
<h2>GEO vs SEO Shopify-n</h2>
<p>Ma összeállítod a 10 pontos GEO checklistet, és két termékoldalon alkalmazod.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`
  },
  {
    day: 3,
    title: 'Hogyan változtatja meg az AI a vásárlói utat?',
    content: `<h1>Hogyan változtatja meg az AI a vásárlói utat?</h1>
<p><em>A keresőlistáról az „answer + ajánlás” élményre váltunk – mit jelent ez a boltodnak.</em></p>
<hr />
<h2>Napi cél</h2>
<ul>
<li>Feltérképezed a jelenlegi vásárlói utat és az AI-hatást.</li>
<li>Készítesz 5 fő „AI touchpoint”-ot a boltodra.</li>
</ul>
<hr />
<h2>Miért számít?</h2>
<ul>
<li>Az AI válasz gyakran előzi a hagyományos listát: ha nem vagy benne, lemaradsz.</li>
<li>A válasz tömör: félreértett adatok károsak (ár/stock/policy).</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<h3>Régi vs új út</h3>
<ul>
<li><strong>Régi</strong>: keresés → listanézet → kattintás.</li>
<li><strong>Új</strong>: kérdés → AI összegzés + ajánlás → kattintás vagy chat-folytatás.</li>
</ul>
<h3>Hatások Shopify-ra</h3>
<ul>
<li>Rövid, biztonságosan idézhető blokk kell a PDP tetején (answer capsule).</li>
<li>Felhasználó gyakran „később” érkezik a site-ra, célzott szándékkal.</li>
</ul>
<hr />
<h2>Példák</h2>
<ul>
<li><strong>Jó</strong>: PDP elején rövid összegzés „Kinek, mire jó, mire nem, ár/stock” tisztán.</li>
<li><strong>Rossz</strong>: Hosszú, strukturálatlan leírás, hiányzó policy linkek.</li>
</ul>
<hr />
<h2>Gyakorlat (vezetett, 10-15 perc)</h2>
<ol>
<li>Rajzold fel a jelenlegi vásárlói utat 5 lépésben.</li>
<li>Jelöld be, hol találkozhat AI válasszal (előtte: keresés/chat; közben: ajánlás; utána: visszakérés).</li>
<li>Írj 5 AI touchpointot (pl. „Legjobb [X]”, „Melyik méretet válasszam?”, „Van-e ingyenes visszaküldés?”).</li>
</ol>
<h2>Gyakorlat (önálló, 5-10 perc)</h2>
<p>Egy termékoldalon készíts egy 3-5 soros answer capsule-t, ami választ ad a fő touchpointokra.</p>
<hr />
<h2>Önellenőrzés</h2>
<ul>
<li>Megvan a vásárlói út 5 lépésben.</li>
<li>Felírtál 5 AI touchpointot.</li>
<li>Készítettél egy rövid answer capsule-t egy PDP tetejére.</li>
</ul>
<hr />
<h2>Opcionális mélyítés</h2>
<ul>
<li>OpenAI Shopping help: <a href="https://help.openai.com/en/articles/11128490-shopping-with-chatgpt-search" target="_blank" rel="noreferrer">https://help.openai.com/en/articles/11128490-shopping-with-chatgpt-search</a></li>
<li>Copilot Merchant Program: <a href="https://www.microsoft.com/en-us/microsoft-copilot/blog/2025/04/18/introducing-the-copilot-merchant-program/" target="_blank" rel="noreferrer">https://www.microsoft.com/en-us/microsoft-copilot/blog/2025/04/18/introducing-the-copilot-merchant-program/</a></li>
</ul>`,
    emailSubject: 'GEO Shopify – 3. nap: AI és a vásárlói út',
    emailBody: `<h1>GEO Shopify – 3. nap</h1>
<h2>AI és a vásárlói út</h2>
<p>Ma feltérképezed az AI touchpointokat, és írsz egy rövid answer capsule-t egy PDP-re.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`
  }
  ,
  {
    day: 4,
    title: '„Sell in chat”: befolyás vs tranzakció',
    content: `<h1>„Sell in chat”: befolyás vs tranzakció</h1>
<p><em>Megérted, hogy GEO-val elsősorban befolyásolsz, nem közvetlenül kasszázol.</em></p>
<hr />
<h2>Napi cél</h2>
<ul>
<li>Világosan látod, mi az AI-ban a befolyás vs. tényleges checkout.</li>
<li>Összeírsz 5 olyan állítást/policy-t, amit az AI-nak biztonságosan idéznie kell.</li>
<li>Készítesz egy rövid „sell in chat” üzenetmintát.</li>
</ul>
<hr />
<h2>Miért számít?</h2>
<ul>
<li>A ChatGPT/Copilot válaszai befolyásolják a választást, de a tranzakció a boltodban történik.</li>
<li>Ha az AI pontatlan infót ad (ár, készlet, szállítás), visszaüt a konverzió és a support.</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<h3>Befolyás (influence)</h3>
<ul>
<li>Ajánlás, rövid összegzés, összevetés: AI felületén történik.</li>
<li>Fontos: világos értékajánlat, kinek való/kinek nem, bizonyíték.</li>
</ul>
<h3>Tranzakció</h3>
<ul>
<li>A checkout a webáruházadban zajlik; szükséges a pontos ár/stock/policy.</li>
<li>Merchant programok régió/eligibility függők (AI felülettől függ).</li>
</ul>
<hr />
<h2>Példák</h2>
<ul>
<li><strong>Jó</strong>: Rövid ajánló: „[Termék] ideális [kinek], nem ajánlott [kinek nem]; ár [x], készlet: elérhető; szállítás: 3-5 nap, ingyenes visszaküldés 30 napig.”</li>
<li><strong>Rossz</strong>: „Legjobb termék!” ár/készlet nélkül, homályos ígéretekkel.</li>
</ul>
<hr />
<h2>Gyakorlat (vezetett, 10-15 perc)</h2>
<ol>
<li>Írj 5 állítást/policy-t, amit az AI-nak tudnia kell (ár, készlet, szállítás, visszaküldés, garancia).</li>
<li>Készíts egy 3-4 soros „sell in chat” blokkot egy termékedre (kinek, mire jó, mire nem, ár/stock, policy).</li>
</ol>
<h2>Gyakorlat (önálló, 5-10 perc)</h2>
<p>Tedd be ezt a blokkot a PDP answer capsule-jébe (vagy készíts külön snippetet a chat használathoz).</p>
<hr />
<h2>Önellenőrzés</h2>
<ul>
<li>Megvan 5 kritikus állítás/policy.</li>
<li>Írtál 3-4 soros chat-blokkot egy termékre.</li>
<li>Elhelyezted vagy jegyzetelted, hova kerül a PDP-n.</li>
</ul>
<hr />
<h2>Opcionális mélyítés</h2>
<ul>
<li>OpenAI merchants: <a href="https://chatgpt.com/merchants" target="_blank" rel="noreferrer">https://chatgpt.com/merchants</a></li>
<li>Copilot Merchant Program: <a href="https://www.microsoft.com/en-us/microsoft-copilot/blog/2025/04/18/introducing-the-copilot-merchant-program/" target="_blank" rel="noreferrer">https://www.microsoft.com/en-us/microsoft-copilot/blog/2025/04/18/introducing-the-copilot-merchant-program/</a></li>
</ul>`,
    emailSubject: 'GEO Shopify – 4. nap: Sell in chat',
    emailBody: `<h1>GEO Shopify – 4. nap</h1>
<h2>Sell in chat: befolyás vs tranzakció</h2>
<p>Ma megírod a chat-ajánlás blokkodat, és rögzíted a kritikus policy állításokat.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`
  },
  {
    day: 5,
    title: 'Platform térkép: ChatGPT, Copilot, Google AI',
    content: `<h1>Platform térkép: ChatGPT, Copilot, Google AI</h1>
<p><em>Áttekinted a fő AI bevásárló felületeket, különbségeiket és korlátaikat.</em></p>
<hr />
<h2>Napi cél</h2>
<ul>
<li>Felsorolod a 3 fő platformot és a boltra vonatkozó korlátokat.</li>
<li>Készítesz egy 1 oldalas „hol jelenhetek meg?” összefoglalót.</li>
</ul>
<hr />
<h2>Miért számít?</h2>
<ul>
<li>Eltérő merchant programok és régiós korlátok.</li>
<li>Eltérő tartalmi elvárások (strukturált adat, policy, azonosítók).</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<h3>ChatGPT</h3>
<ul>
<li>Shopping válaszok, merchant program. Kulcs: pontos adat, idézhetőség.</li>
</ul>
<h3>Copilot</h3>
<ul>
<li>Merchant Program, regionális szabályok. Kulcs: feed minőség, policy.</li>
</ul>
<h3>Google AI</h3>
<ul>
<li>AI overview, hagyományos SEO/merchant feed alap. Kulcs: termékadat, schema, policy.</li>
</ul>
<hr />
<h2>Példák</h2>
<ul>
<li><strong>Jó</strong>: Egységes ár/készlet/policy mindenhol, stabil feed, tiszta schema.</li>
<li><strong>Rossz</strong>: Ellentmondó árak, hiányzó policy, nem strukturált feed.</li>
</ul>
<hr />
<h2>Gyakorlat (vezetett, 10-15 perc)</h2>
<ol>
<li>Készíts 1 oldalas összefoglalót: ChatGPT/Copilot/Google AI – mit kér, mi a korlát (régió, program), mit kell tenned (adat/policy/URL).</li>
<li>Jelöld a saját boltodra: melyik platformhoz vagy legközelebb, melyikhez hiányzik még adat.</li>
</ol>
<h2>Gyakorlat (önálló, 5-10 perc)</h2>
<p>Egy választott platformra írj 3 konkrét teendőt (pl. „GTIN ellenőrzés”, „policy blokk frissítése”, „answer capsule hozzáadása”).</p>
<hr />
<h2>Önellenőrzés</h2>
<ul>
<li>Megvan a 3 platform fő követelménye.</li>
<li>Készült 1 oldalas „hol jelenhetek meg?” összefoglaló.</li>
<li>Felírtál 3 konkrét teendőt egy kiválasztott platformra.</li>
</ul>
<hr />
<h2>Opcionális mélyítés</h2>
<ul>
<li>OpenAI merchants: <a href="https://chatgpt.com/merchants" target="_blank" rel="noreferrer">https://chatgpt.com/merchants</a></li>
<li>Google Merchant Center specifikáció: <a href="https://support.google.com/merchants/answer/7052112" target="_blank" rel="noreferrer">https://support.google.com/merchants/answer/7052112</a></li>
</ul>`,
    emailSubject: 'GEO Shopify – 5. nap: Platform térkép',
    emailBody: `<h1>GEO Shopify – 5. nap</h1>
<h2>Platform térkép</h2>
<p>Ma áttekinted ChatGPT/Copilot/Google AI különbségeit, és készítesz egy 1 oldalas összefoglalót.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`
  },
  {
    day: 6,
    title: 'Sikerdefiníció: GEO prompt set + KPI-k',
    content: `<h1>Sikerdefiníció: GEO prompt set + KPI-k</h1>
<p><em>Összeállítod a 30–50 promptból álló GEO tesztkészletet és a KPI baseline-t.</em></p>
<hr />
<h2>Napi cél</h2>
<ul>
<li>Elkészíted a GEO prompt set-et (30–50 prompt).</li>
<li>Összeállítod a GEO/KPI baseline sheetet.</li>
</ul>
<hr />
<h2>Miért számít?</h2>
<ul>
<li>Mérés nélkül nincs fejlődés: inklúzió, idézés, konzisztencia kell.</li>
<li>Kereskedelmi hatás: AI referral forgalom, konverzió, visszaküldés.</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<h3>Prompt set</h3>
<ul>
<li>Best, vs, alternatives, policy, méret, szállítás kérdések.</li>
<li>30–50 kérdés, a bolt kategóriáira szabva.</li>
</ul>
<h3>KPI-k</h3>
<ul>
<li>GEO: inklúzió, idézés, lefedettség, konzisztencia (heti).</li>
<li>Ker.: AI referral forgalom, konverzió, add-to-cart, visszaküldési arány.</li>
</ul>
<hr />
<h2>Példák</h2>
<ul>
<li><strong>Jó</strong>: 40 kérdés, kategóriákra bontva (best/vs/policy), táblázatban mérő oszlopokkal.</li>
<li><strong>Rossz</strong>: 5 általános kérdés, nincs mérőpont.</li>
</ul>
<hr />
<h2>Gyakorlat (vezetett, 10-15 perc)</h2>
<ol>
<li>Készíts táblázatot: Prompt | Típus (best/vs/policy) | Várt inklúzió/idézés | Jegyzet.</li>
<li>Töltsd ki 20 kérdéssel (best, vs, policy vegyesen).</li>
<li>Készíts KPI sheetet: GEO (inklúzió, idézés, konzisztencia), ker. (AI referral, konverzió, visszaküldés).</li>
</ol>
<h2>Gyakorlat (önálló, 5-10 perc)</h2>
<p>Bővítsd 30–50 kérdésre, és jelöld a prioritásokat (A/B/C).</p>
<hr />
<h2>Önellenőrzés</h2>
<ul>
<li>Megvan a 30–50 prompt lista.</li>
<li>Elkészült a KPI baseline sheet GEO + ker. mutatókkal.</li>
<li>Prioritást adtál a promptoknak.</li>
</ul>
<hr />
<h2>Opcionális mélyítés</h2>
<ul>
<li>Measurement eszközök: <a href="https://developers.google.com/webmaster-tools/search-console-api-original" target="_blank" rel="noreferrer">Search Console API</a>, <a href="https://clarity.microsoft.com/" target="_blank" rel="noreferrer">Microsoft Clarity</a></li>
</ul>`,
    emailSubject: 'GEO Shopify – 6. nap: Prompt set + KPI-k',
    emailBody: `<h1>GEO Shopify – 6. nap</h1>
<h2>Prompt set + KPI-k</h2>
<p>Ma elkészíted a 30–50 kérdéses GEO prompt listát és a KPI baseline sheetet.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`
  },
  {
    day: 7,
    title: 'Shopify termékadat audit: cím, leírás, variánsok',
    content: `<h1>Shopify termékadat audit: cím, leírás, variánsok</h1>
<p><em>Feltárod a termékadataid hiányosságait: title, description, variánsok, azonosítók.</em></p>
<hr />
<h2>Napi cél</h2>
<ul>
<li>Audit sablont készítesz 10–20 termékre.</li>
<li>Felméred: cím/alcím, leírás, variánsok, azonosítók állapota.</li>
</ul>
<hr />
<h2>Miért számít?</h2>
<ul>
<li>Az AI csak tiszta, egyértelmű adatot idéz szívesen.</li>
<li>A rossz variánsjelölés félreértett ajánláshoz vezethet.</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<h3>Mit ellenőrizz?</h3>
<ul>
<li>Cím/alcím: rövid, egyértelmű, kulcs jellemzőkkel.</li>
<li>Leírás: tömör, fontos jellemzők előre, policy linkek.</li>
<li>Variánsok: méret/szín/széria tiszta jelölése, nincs keveredés.</li>
<li>Azonosítók: SKU/GTIN/brand mezők kitöltve.</li>
</ul>
<hr />
<h2>Példák</h2>
<ul>
<li><strong>Jó</strong>: „Futócipő Pro, férfi, kék, GTIN: …, SKU: …, alcím: stabilitás, párnázás, 3-5 nap szállítás.”</li>
<li><strong>Rossz</strong>: „Pro cipő” – hiányzó variáns info, nincs azonosító.</li>
</ul>
<hr />
<h2>Gyakorlat (vezetett, 10-15 perc)</h2>
<ol>
<li>Készíts audit táblát: Termék | Cím | Leírás | Variáns jelölés | SKU | GTIN | Brand | Jegyzet.</li>
<li>Töltsd ki 10 termékre.</li>
</ol>
<h2>Gyakorlat (önálló, 5-10 perc)</h2>
<p>Azonosíts 5 hiányosságot (pl. hiányzó SKU/GTIN, zavaros variáns), és jelöld javításra.</p>
<hr />
<h2>Önellenőrzés</h2>
<ul>
<li>Megvan az audit sablon.</li>
<li>10 terméket felmértél.</li>
<li>Legalább 5 hiányosságot rögzítettél javításra.</li>
</ul>
<hr />
<h2>Opcionális mélyítés</h2>
<ul>
<li>Shopify termékadat: <a href="https://shopify.dev/docs/apps/selling-strategies/product-data" target="_blank" rel="noreferrer">https://shopify.dev/docs/apps/selling-strategies/product-data</a></li>
</ul>`,
    emailSubject: 'GEO Shopify – 7. nap: Termékadat audit',
    emailBody: `<h1>GEO Shopify – 7. nap</h1>
<h2>Termékadat audit</h2>
<p>Ma 10 terméken felméred a cím/leírás/variáns/azonosító állapotot, és hiányokat gyűjtesz.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`
  },
  {
    day: 8,
    title: 'Miért fontos a feed és az „offer truth”',
    content: `<h1>Miért fontos a feed és az „offer truth”</h1>
<p><em>Megérted, miért kell a feednek egyeznie a valós ajánlattal (ár, készlet, szállítás).</em></p>
<hr />
<h2>Napi cél</h2>
<ul>
<li>Listázod az offer truth elemeit (ár, készlet, szállítás, visszaküldés, azonosítók).</li>
<li>Felméred a feed és a PDP közti eltéréseket 5 terméken.</li>
</ul>
<hr />
<h2>Miért számít?</h2>
<ul>
<li>Az AI és a merchant programok a feedre és a PDP-re támaszkodnak.</li>
<li>Ellentmondó ár/stock/policy → kizárás vagy rossz ajánlás.</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<h3>Offer truth</h3>
<ul>
<li>Ár: pontos, kedvezmény kezelése.</li>
<li>Készlet: aktuális, variáns szinten.</li>
<li>Szállítás/visszaküldés: világos, linkelve.</li>
<li>Azonosítók: GTIN/SKU/brand konzisztens.</li>
</ul>
<hr />
<h2>Példák</h2>
<ul>
<li><strong>Jó</strong>: Feed és PDP ugyanazt az árat/készletet mutatja, policy link ugyanaz.</li>
<li><strong>Rossz</strong>: Feedben más ár, PDP-n más készlet, hiányzó policy.</li>
</ul>
<hr />
<h2>Gyakorlat (vezetett, 10-15 perc)</h2>
<ol>
<li>Válassz 5 terméket: hasonlítsd össze feed adatot (GMC export vagy app) és PDP-t ár/készlet/policy szerint.</li>
<li>Jegyezd az eltéréseket és a javítandókat.</li>
</ol>
<h2>Gyakorlat (önálló, 5-10 perc)</h2>
<p>Írj 3 feladatot a feed-PDP egyezés javítására (pl. ár sync, készlet sync, policy blokk egységesítése).</p>
<hr />
<h2>Önellenőrzés</h2>
<ul>
<li>Felsoroltad az offer truth elemeit.</li>
<li>5 terméknél feltártad a feed–PDP eltéréseket.</li>
<li>3 javítási feladatot felírtál.</li>
</ul>
<hr />
<h2>Opcionális mélyítés</h2>
<ul>
<li>GMC product data spec: <a href="https://support.google.com/merchants/answer/7052112" target="_blank" rel="noreferrer">https://support.google.com/merchants/answer/7052112</a></li>
</ul>`,
    emailSubject: 'GEO Shopify – 8. nap: Feed és offer truth',
    emailBody: `<h1>GEO Shopify – 8. nap</h1>
<h2>Feed és offer truth</h2>
<p>Ma feltárod a feed–PDP eltéréseket ár/készlet/policy téren, és javítási feladatokat írsz.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`
  },
  {
    day: 9,
    title: 'Azonosítók rendben: SKU, GTIN, brand, variáns',
    content: `<h1>Azonosítók rendben: SKU, GTIN, brand, variáns</h1>
<p><em>Rendbe teszed a termékazonosítókat, hogy az AI és a feedek ne keverjék össze a termékeket.</em></p>
<hr />
<h2>Napi cél</h2>
<ul>
<li>Auditálod 10 termék SKU/GTIN/brand/variáns adatait.</li>
<li>Listázod a hiányzó/hibás azonosítókat.</li>
</ul>
<hr />
<h2>Miért számít?</h2>
<ul>
<li>Az AI és a feed azonosítóval különböztet: hibás ID → rossz ajánlás.</li>
<li>Brand/variáns tisztaság csökkenti a félreértést (méret/szín).</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<h3>Mit ellenőrizz?</h3>
<ul>
<li>SKU minden variánsnál egyedi.</li>
<li>GTIN (ha van) helyes, nem duplikált.</li>
<li>Brand mező kitöltve, következetes.</li>
<li>Variáns név: méret/szín egyértelmű, nincs keverés.</li>
</ul>
<hr />
<h2>Példák</h2>
<ul>
<li><strong>Jó</strong>: „SKU: RUNPRO-BLU-42, GTIN: 123…., Brand: RunPro, Variáns: férfi, kék, 42”.</li>
<li><strong>Rossz</strong>: Hiányzó GTIN, duplikált SKU, variáns név: „42 kék vagy fekete?”.</li>
</ul>
<hr />
<h2>Gyakorlat (vezetett, 10-15 perc)</h2>
<ol>
<li>Audit tábla: Termék | Variáns | SKU | GTIN | Brand | Jegyzet.</li>
<li>Töltsd ki 10 termékre/variánsra.</li>
</ol>
<h2>Gyakorlat (önálló, 5-10 perc)</h2>
<p>Írj 5 korrekciós feladatot (pl. duplikált SKU javítása, GTIN pótlás, variáns elnevezés tisztítás).</p>
<hr />
<h2>Önellenőrzés</h2>
<ul>
<li>Megvan az azonosító audit tábla.</li>
<li>10 termék/variáns felmérve.</li>
<li>5 korrekciós feladat rögzítve.</li>
</ul>
<hr />
<h2>Opcionális mélyítés</h2>
<ul>
<li>GTIN útmutató (GS1): <a href="https://www.gs1.org/standards/id-keys/gtin" target="_blank" rel="noreferrer">https://www.gs1.org/standards/id-keys/gtin</a></li>
</ul>`,
    emailSubject: 'GEO Shopify – 9. nap: Azonosítók',
    emailBody: `<h1>GEO Shopify – 9. nap</h1>
<h2>Azonosítók rendben</h2>
<p>Ma auditálod az SKU/GTIN/brand/variáns adatokat, és felírod a javításokat.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`
  },
  {
    day: 10,
    title: 'Szállítás és visszaküldés: egyértelműség',
    content: `<h1>Szállítás és visszaküldés: egyértelműség</h1>
<p><em>Letisztázod a szállítási és visszaküldési szabályokat, hogy az AI ne adjon téves ígéretet.</em></p>
<hr />
<h2>Napi cél</h2>
<ul>
<li>Frissíted/ellenőrzöd a shipping/returns blokkot a PDP-ken.</li>
<li>Egységesíted a policy linkeket.</li>
</ul>
<hr />
<h2>Miért számít?</h2>
<ul>
<li>A félreértett szállítás/retour rontja a konverziót és növeli a supportot.</li>
<li>Az AI idézheti a policy-t: legyen pontos és könnyen megtalálható.</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<h3>Mit tegyél?</h3>
<ul>
<li>Adj rövid blokkot: szállítási idő/ár, visszaküldés határideje/költsége.</li>
<li>Linkeld a teljes policy-t (egy stabil URL-en).</li>
<li>Ugyanez a feedben, ha támogatott.</li>
</ul>
<hr />
<h2>Példák</h2>
<ul>
<li><strong>Jó</strong>: „Szállítás: 3-5 nap, 1500 Ft; Ingyenes visszaküldés 30 napig. Részletek: /policies/shipping”.</li>
<li><strong>Rossz</strong>: „Gyors szállítás”, nincs határidő, nincs link.</li>
</ul>
<hr />
<h2>Gyakorlat (vezetett, 10-15 perc)</h2>
<ol>
<li>Írj egységes shipping/returns blokkot (2-3 sor) és illeszd be 3 PDP-re.</li>
<li>Ellenőrizd, hogy a link stabil és ugyanaz mindenhol.</li>
</ol>
<h2>Gyakorlat (önálló, 5-10 perc)</h2>
<p>Frissítsd a feedet/policy URL-t, ha eltér.</p>
<hr />
<h2>Önellenőrzés</h2>
<ul>
<li>3 PDP frissítve shipping/returns blokkal.</li>
<li>Policy link stabil és egységes.</li>
<li>Feed/PDP egyezik.</li>
</ul>
<hr />
<h2>Opcionális mélyítés</h2>
<ul>
<li>Shopify policy oldalak: <a href="https://help.shopify.com/en/manual/checkout-settings/refund-returns" target="_blank" rel="noreferrer">https://help.shopify.com/en/manual/checkout-settings/refund-returns</a></li>
</ul>`,
    emailSubject: 'GEO Shopify – 10. nap: Szállítás és visszaküldés',
    emailBody: `<h1>GEO Shopify – 10. nap</h1>
<h2>Szállítás és visszaküldés</h2>
<p>Ma egységesíted a shipping/returns blokkot, és biztosítod a feed–PDP egyezést.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`
  },
  {
    day: 11,
    title: 'Bizalom és bizonyíték: identity, support, proof',
    content: `<h1>Bizalom és bizonyíték: identity, support, proof</h1>
<p><em>Felépíted a bizalmi elemeket: cégazonosság, support, bizonyíték (reviews/garancia).</em></p>
<hr />
<h2>Napi cél</h2>
<ul>
<li>Összegyűjtöd és egységesíted a trust elemeket.</li>
<li>Elhelyezed őket a kulcsoldalakon.</li>
</ul>
<hr />
<h2>Miért számít?</h2>
<ul>
<li>Az AI biztonságos, megbízható forrást idéz szívesen.</li>
<li>A vásárló gyorsan ellenőrzi: ki vagy, hogyan segítesz, mit ígérsz.</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<h3>Trust elemek</h3>
<ul>
<li>Identity: cég/brand bemutatás, elérhetőség.</li>
<li>Support: elérhetőség, válaszidő, csatornák.</li>
<li>Proof: valós reviews, garancia, díjak.</li>
</ul>
<hr />
<h2>Példák</h2>
<ul>
<li><strong>Jó</strong>: „Cég: XY Kft., email/telefon, support: 24–48 óra, garancia: 1 év, valós review-k linkje.”</li>
<li><strong>Rossz</strong>: Nincs elérhetőség, kamureview, üres „rólunk”.</li>
</ul>
<hr />
<h2>Gyakorlat (vezetett, 10-15 perc)</h2>
<ol>
<li>Készíts trust blokkot (identity/support/proof) és helyezd el 3 oldalon (PDP/collection/rólunk).</li>
<li>Ellenőrizd a review-k valóságát és a garancia szöveg pontosságát.</li>
</ol>
<h2>Gyakorlat (önálló, 5-10 perc)</h2>
<p>Frissítsd a feedben (ha támogatott) a brand/garancia mezőket.</p>
<hr />
<h2>Önellenőrzés</h2>
<ul>
<li>3 oldalon elhelyezted a trust blokkot.</li>
<li>Valós, ellenőrzött proof-okat használsz.</li>
<li>Support elérhetőség és válaszidő feltüntetve.</li>
</ul>
<hr />
<h2>Opcionális mélyítés</h2>
<ul>
<li>Google spam policies (review-k): <a href="https://developers.google.com/search/docs/essentials/spam-policies" target="_blank" rel="noreferrer">https://developers.google.com/search/docs/essentials/spam-policies</a></li>
</ul>`,
    emailSubject: 'GEO Shopify – 11. nap: Bizalom és bizonyíték',
    emailBody: `<h1>GEO Shopify – 11. nap</h1>
<h2>Bizalom és bizonyíték</h2>
<p>Ma felépíted a trust blokkokat (identity/support/proof), és elhelyezed kulcsoldalakon.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`
  },
  {
    day: 12,
    title: 'Merchant readiness checklist: top 10 javítás',
    content: `<h1>Merchant readiness checklist: top 10 javítás</h1>
<p><em>Összefoglalod a legfontosabb javítandókat, és ütemezed a top 10-et.</em></p>
<hr />
<h2>Napi cél</h2>
<ul>
<li>Kész merchant readiness checklist.</li>
<li>Top 10 javítás ütemezve felelős/időponttal.</li>
</ul>
<hr />
<h2>Miért számít?</h2>
<ul>
<li>Prioritást adsz a legnagyobb hatású hibák javításának.</li>
<li>Átlátható lesz, mi kész GEO szempontból.</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<h3>Checklist elemek (minta)</h3>
<ul>
<li>Ár/készlet/policy egyezés.</li>
<li>SKU/GTIN/brand kitöltve.</li>
<li>Shipping/returns blokk egységes.</li>
<li>Answer capsule a PDP elején.</li>
<li>Trust blokk (identity/support/proof).</li>
</ul>
<hr />
<h2>Példák</h2>
<ul>
<li><strong>Jó</strong>: Checklist kész, top 10 javítás felelős + határidővel.</li>
<li><strong>Rossz</strong>: Hosszú lista, nincs prioritás, nincs felelős.</li>
</ul>
<hr />
<h2>Gyakorlat (vezetett, 10-15 perc)</h2>
<ol>
<li>Készíts readiness checklistet (20–30 elem).</li>
<li>Válaszd ki a top 10-et, rendelj felelőst és határidőt.</li>
</ol>
<h2>Gyakorlat (önálló, 5-10 perc)</h2>
<p>Oszd meg a listát a csapattal, és kövesd a státuszt hetente.</p>
<hr />
<h2>Önellenőrzés</h2>
<ul>
<li>Checklist kész.</li>
<li>Top 10 javítás kijelölve felelőssel/időponttal.</li>
<li>Megosztottad a csapattal.</li>
</ul>
<hr />
<h2>Opcionális mélyítés</h2>
<ul>
<li>GEO alap cikk: <a href="https://searchengineland.com/guide/what-is-geo" target="_blank" rel="noreferrer">https://searchengineland.com/guide/what-is-geo</a></li>
</ul>`,
    emailSubject: 'GEO Shopify – 12. nap: Readiness checklist',
    emailBody: `<h1>GEO Shopify – 12. nap</h1>
<h2>Readiness checklist</h2>
<p>Ma összeállítod a merchant readiness checklistet és kijelölöd a top 10 javítást.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`
  }
];

function buildLessonContent(entry: LessonEntry) {
  return entry.content;
}

async function seed() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI not set');
  }
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.amanoba.com';

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
          difficulty: 'intermediate',
          estimatedHours: 10,
          tags: ['geo', 'shopify', 'ecommerce'],
          instructor: 'Amanoba'
        }
      }
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  console.log(`✅ Course ${COURSE_ID} created/updated`);

  for (const entry of lessonPlan) {
    const lessonId = `${COURSE_ID}_DAY_${String(entry.day).padStart(2, '0')}`;
    const content = buildLessonContent(entry);

    const emailSubject = entry.emailSubject || `{{courseName}} – {{dayNumber}}. nap: {{lessonTitle}}`;
    let emailBody = entry.emailBody;
    if (!emailBody) {
      emailBody = [
        `<h1>{{courseName}}</h1>`,
        `<h2>{{dayNumber}}. nap: {{lessonTitle}}</h2>`,
        '<div>{{lessonContent}}</div>',
        `<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Megnyitom a leckét →</a></p>`
      ].join('');
    }
    emailBody = emailBody
      .replace(/\{\{APP_URL\}\}/g, appUrl)
      .replace(/\{\{COURSE_ID\}\}/g, COURSE_ID);

    const lesson = await Lesson.findOneAndUpdate(
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
          quizConfig: {
            enabled: true,
            successThreshold: 100,
            questionCount: 5,
            poolSize: 5,
            required: true
          },
          metadata: {
            estimatedMinutes: 20,
            difficulty: 'intermediate' as const,
            tags: ['geo', 'shopify']
          }
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Build quizzes (5 per lesson, content-aligned)
    const quizzes: Array<{
      question: string;
      options: string[];
      correctIndex: number;
      difficulty: QuestionDifficulty;
      category: string;
    }> = [];

    if (entry.day === 1) {
      quizzes.push(
        {
          question: 'Mi a GEO fő célja Shopify bolt esetén?',
          options: [
            'Az AI válaszokban való megjelenés és idézhetőség',
            'Csak a Google rangsor növelése',
            'Csak a page speed javítása',
            'Csak a backlink gyűjtés'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'Mi a három fő GEO-kimenet, amit nézni kell?',
          options: [
            'Inklúzió, idézés, konzisztencia',
            'Bounce rate, bármilyen link, social like',
            'Meta title, meta description, H1',
            'Csak átkattintási arány'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'Mi különbözteti meg a GEO-t az SEO-tól?',
          options: [
            'GEO az AI válaszokra, SEO a 10 kék link rangsorra fókuszál',
            'GEO csak a backlinkről szól',
            'SEO csak AI-ra vonatkozik',
            'Nincs különbség'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'Miért kritikus a pontos termékadat GEO-ban?',
          options: [
            'Az AI csak biztonságos, tiszta adatot idéz szívesen',
            'Csak a design számít',
            'Mert a készlet nem fontos',
            'Az árak mindegy, hogy pontosak-e'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'Mit tartalmazzon az első prompt lista?',
          options: [
            'Legalább 5 saját boltra szabott GEO promptot',
            'Csak egy általános promptot',
            'Csak meta title ötleteket',
            'Csak képeket'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        }
      );
    } else if (entry.day === 2) {
      quizzes.push(
        {
          question: 'Mi GEO-first elem a Shopify PDP-n?',
          options: [
            'Ár/készlet/azonosítók tiszta megjelenítése',
            'Csak hosszú meta description',
            'Csak backlink',
            'Csak page speed'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'Miért kell answer capsule a GEO-ban?',
          options: [
            'Tömör, idézhető blokkot ad a modellnek a PDP tetején',
            'Csak design elem',
            'Nem szükséges',
            'Csak SEO kulcsszavak miatt'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'Melyik jó tétel egy 10 pontos GEO checklisthez?',
          options: [
            'GTIN/SKU megadva és olvasható',
            'Rejtett ár',
            'Nincs készlet jelzés',
            'Duplikált URL-ek'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'Mi az SEO-first példa a listából?',
          options: [
            'Meta title/description finomhangolás',
            'Készletjelzés kiírása',
            'Visszaküldési policy feltüntetése',
            'Answer capsule írása'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'Miért fontos a tiszta variánsadat GEO-ban?',
          options: [
            'Az AI ne keverje össze a méretet/színt összegzéskor',
            'Csak kényelmi okból',
            'Nem számít',
            'Csak SEO kulcsszó miatt'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.HARD,
          category: 'Course Specific'
        }
      );
    } else if (entry.day === 3) {
      quizzes.push(
        {
          question: 'Mi az AI által befolyásolt új vásárlói út egyik jellemzője?',
          options: [
            'Válasz + ajánlás érkezik a listanézet előtt',
            'Mindig csak 10 kék linket lát a user',
            'Nincs hatása az útra',
            'Csak page speed számít'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'Mi az answer capsule célja a PDP tetején?',
          options: [
            'Kinek, mire jó, mire nem, ár/stock röviden, idézhetően',
            'Csak hosszabb leírás másolása',
            'Dekoráció',
            'SEO kulcsszó halmozás'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'Miért készíts AI touchpoint listát?',
          options: [
            'Hogy tudd, milyen kérdésekre kell választ adnod a PDP-n',
            'Csak marketing okból',
            'Nem szükséges',
            'Csak belső használatra, de nem befolyásol semmit'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'Melyik lépés része a vezetett gyakorlatnak?',
          options: [
            'Rajzold fel a jelenlegi vásárlói utat és jelöld az AI érintési pontokat',
            'Csak meta title írása',
            'Csak backlink keresés',
            'Semmit nem kell tenni'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'Mi a legnagyobb kockázat, ha nincs tiszta policy a PDP-n?',
          options: [
            'Az AI félrevezetheti a vásárlót ár/stock/policy tekintetében',
            'Semmi kockázat',
            'Csak SEO büntetés',
            'Csak design gond'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.HARD,
          category: 'Course Specific'
        }
      );
    } else if (entry.day === 4) {
      quizzes.push(
        {
          question: 'Mi a „sell in chat” lényege GEO szempontból?',
          options: [
            'Befolyásolod a választást, de a tranzakció a boltban történik',
            'Közvetlenül a chatben történik a checkout',
            'Csak SEO kulcsszavakról szól',
            'Nem számít a bolt adata'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'Mit kell az AI-nak biztonságosan idézni?',
          options: [
            'Ár, készlet, szállítás, visszaküldés, garancia',
            'Csak a meta title-t',
            'Csak a design elemeket',
            'Csak a backlinkeket'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'Mi a jó chat-blokk tartalma?',
          options: [
            'Kinek jó, mire jó/nem jó, ár/stock, policy röviden',
            'Hosszú marketing szöveg ár nélkül',
            'Csak képek',
            'Csak egy szlogen'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'Mi a fő kockázat pontatlan policy esetén?',
          options: [
            'Félrevezető AI válasz → rossz élmény, support terhelés',
            'Nincs kockázat',
            'Csak SEO büntetés',
            'Csak design hiba'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.HARD,
          category: 'Course Specific'
        },
        {
          question: 'Mit tegyél a chat-blokkal a PDP-n?',
          options: [
            'Helyezd el az answer capsule-ban vagy snippetként',
            'Csak megosztod Slackben',
            'Nem kell elhelyezni',
            'Csak a footerben tünteted fel'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        }
      );
    } else if (entry.day === 5) {
      quizzes.push(
        {
          question: 'Miért fontos ismerni a platform korlátokat (ChatGPT/Copilot/Google AI)?',
          options: [
            'Eltérő programok, régiós szabályok, adat/policy elvárások',
            'Nincs különbség, mindegyik ugyanaz',
            'Csak a design számít',
            'Csak a backlinkek számítanak'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'Mit tegyél egy 1 oldalas platform összefoglalóba?',
          options: [
            'Követelmények, korlátok, teendők (adat/policy/URL) platformonként',
            'Csak árlistát',
            'Csak logókat',
            'Csak SEO kulcsszavakat'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'Mi a jó teendő egy kiválasztott platformra?',
          options: [
            'Konkrét feladat: pl. GTIN ellenőrzés, policy blokk frissítés, answer capsule',
            'Csak általános „dolgozz rajta”',
            'Semmi konkrét',
            'Csak page speed mérés'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'Mi a jó gyakorlat adatkonzisztenciára?',
          options: [
            'Egységes ár/készlet/policy minden platformon',
            'Mindenhol más ár',
            'Policy elrejtése',
            'Duplikált feed'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.HARD,
          category: 'Course Specific'
        },
        {
          question: 'Miért kell tudni, hol jelenhetsz meg?',
          options: [
            'Hogy célzottan javítsd az adat/policy megfelelést',
            'Csak érdekesség',
            'Nem fontos',
            'Csak design miatt'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        }
      );
    } else if (entry.day === 6) {
      quizzes.push(
        {
          question: 'Hány promptot céloz a GEO prompt set?',
          options: [
            '30–50 kérdést a bolt kategóriáira szabva',
            '5 általános kérdést',
            'Csak 1 kérdést',
            '200 random kérdést'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'Milyen kérdéstípusokat érdemes beletenni?',
          options: [
            'best/vs/alternatives/policy/méret/szállítás',
            'Csak brand név',
            'Csak meta title',
            'Csak backlink forrás'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'Milyen KPI-ket mérj GEO esetén?',
          options: [
            'Inklúzió, idézés, lefedettség, konzisztencia',
            'Csak bounce rate',
            'Csak page speed',
            'Csak meta title hossza'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'Milyen kereskedelmi KPI-ket kövess AI referralra?',
          options: [
            'AI referral forgalom, konverzió, add-to-cart, visszaküldés',
            'Csak social like',
            'Csak backlink szám',
            'Csak meta description hossza'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.HARD,
          category: 'Course Specific'
        },
        {
          question: 'Miért adj prioritást a promptoknak (A/B/C)?',
          options: [
            'Hogy tud, melyek a legfontosabb kérdések a teszteléshez',
            'Csak színezés miatt',
            'Nem kell prioritás',
            'Csak dísz'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        }
      );
    } else if (entry.day === 7) {
      quizzes.push(
        {
          question: 'Mit ellenőrizz a termékadat audit során?',
          options: [
            'Cím/alcím, leírás, variáns jelölés, SKU/GTIN/brand',
            'Csak a meta title-t',
            'Csak a backlinkeket',
            'Csak a page speed-et'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'Miért fontos a variáns tisztaság?',
          options: [
            'Az AI ne keverje a méret/szín ajánlásokat',
            'Csak design okból',
            'Nem számít',
            'Csak SEO kulcsszavak miatt'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'Mi a jó audit tábla mezői közül?',
          options: [
            'Termék, variáns, SKU, GTIN, brand, jegyzet',
            'Csak termék neve',
            'Csak ár',
            'Csak képek'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'Mi a tipikus rossz példa?',
          options: [
            'Rövid cím, hiányzó variáns infó, nincs azonosító',
            'Minden azonosító kitöltve',
            'Tiszta variáns jelölés',
            'Egységes SKU/GTIN'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'Mi legyen az audit eredménye?',
          options: [
            'Hiányosságok listája, javítási feladatokkal',
            'Csak egy marketing szlogen',
            'Csak egy screenshot',
            'Semmi'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        }
      );
    } else if (entry.day === 8) {
      quizzes.push(
        {
          question: 'Mi az „offer truth” lényege?',
          options: [
            'Ár/készlet/policy egyezzen feedben és PDP-n',
            'Csak meta title',
            'Csak backlink',
            'Csak design'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'Mi a kockázata az eltérő árnak feed vs PDP?',
          options: [
            'Kizárás vagy félrevezető AI ajánlás',
            'Semmi',
            'Csak page speed lassul',
            'Csak SEO büntetés'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'Mit nézz meg 5 terméknél?',
          options: [
            'Ár, készlet, policy egyezés feed és PDP között',
            'Csak a képek ALT-ja',
            'Csak a meta description hossza',
            'Csak a page speed'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'Mi a jó javítási feladat minta?',
          options: [
            'Ár sync, készlet sync, policy blokk egységesítés',
            'Backlink vásárlás',
            'Kulcsszó tömés',
            'Csak design csere'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.HARD,
          category: 'Course Specific'
        },
        {
          question: 'Miért kell azonosítók egyezése a feedben is?',
          options: [
            'Az AI és a merchant program pontosan azonosítsa a terméket',
            'Nem számít',
            'Csak SEO miatt',
            'Csak marketing szöveg'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        }
      );
    } else if (entry.day === 9) {
      quizzes.push(
        {
          question: 'Mit ellenőrizz az azonosító auditban?',
          options: [
            'SKU egyedi, GTIN helyes/nem duplikált, brand kitöltve, variáns név tiszta',
            'Csak ár',
            'Csak képek',
            'Csak meta title'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'Miért fontos a variáns elnevezés tisztasága?',
          options: [
            'Hogy az AI ne keverje a méret/szín variánsokat',
            'Csak design kedvéért',
            'Nem fontos',
            'Csak SEO miatt'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'Mi a rossz példa az azonosítóknál?',
          options: [
            'Hiányzó GTIN, duplikált SKU, zavaros variáns név',
            'Minden kitöltve',
            'Egyedi SKU',
            'Tiszta variáns jelölés'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'Mi legyen a korrekciós feladatokban?',
          options: [
            'Duplikált SKU javítás, GTIN pótlás, variáns név tisztítás',
            'Csak meta title hossz',
            'Csak backlink',
            'Semmi'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'Miért fontos a brand mező következetessége?',
          options: [
            'Az AI és a feed azonosítsa a gyártót/brandet egyértelműen',
            'Nem számít',
            'Csak design',
            'Csak SEO kulcsszó miatt'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.HARD,
          category: 'Course Specific'
        }
      );
    } else if (entry.day === 10) {
      quizzes.push(
        {
          question: 'Mit tartalmazzon a shipping/returns blokk?',
          options: [
            'Szállítási idő/ár, visszaküldés határideje/költsége, policy link',
            'Csak egy „gyors” szó',
            'Nincs infó',
            'Csak backlink'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'Mi a kockázat, ha nincs pontos policy?',
          options: [
            'AI téves ígéret → rossz élmény, support terhelés',
            'Semmi',
            'Csak design gond',
            'Csak SEO büntetés'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'Mi a jó példa shipping blokkra?',
          options: [
            '„3-5 nap, 1500 Ft; ingyenes visszaküldés 30 napig; részletek: /policies/shipping”',
            '„Gyors”',
            'Nincs link',
            'Csak egy emotikon'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'Mit ellenőrizz a feedben is?',
          options: [
            'Policy URL/infók egyezése, ha támogatott',
            'Csak meta title-t',
            'Csak képeket',
            'Semmit'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'Miért kell egységes link a policy-ra?',
          options: [
            'Az AI és a user mindig ugyanoda érkezzen, stabil URL-en',
            'Nem fontos',
            'Csak design',
            'Csak SEO miatt'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.HARD,
          category: 'Course Specific'
        }
      );
    } else if (entry.day === 11) {
      quizzes.push(
        {
          question: 'Melyek a trust blokk fő elemei?',
          options: [
            'Identity, support, proof (reviews/garancia)',
            'Csak meta title',
            'Csak képek',
            'Csak backlink'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'Miért kell valós proof?',
          options: [
            'Az AI és a user megbízhat benne; hamis proof kockázatos',
            'Nem számít',
            'Csak design',
            'Csak SEO kulcsszó'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'Mi a rossz példa trustra?',
          options: [
            'Nincs elérhetőség, kamureview, üres „rólunk”',
            'Valós review',
            'Elérhetőség megadva',
            'Garancia feltüntetve'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'Hol helyezd el a trust blokkot?',
          options: [
            'PDP/collection/rólunk oldalakon',
            'Csak a footerben elrejtve',
            'Sehol',
            'Csak a blogon'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'Miért tüntesd fel a support válaszidőt?',
          options: [
            'Átláthatóság, bizalom, AI idézheti',
            'Nem kell',
            'Csak marketing',
            'Csak SEO miatt'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.HARD,
          category: 'Course Specific'
        }
      );
    } else if (entry.day === 12) {
      quizzes.push(
        {
          question: 'Mi a readiness checklist célja?',
          options: [
            'Legfontosabb hibák/javítások átlátható listája',
            'Csak dekoráció',
            'Nem kell lista',
            'Csak egy szlogen'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'Mit tartalmazzon a top 10 javítás?',
          options: [
            'Felelős és határidő minden tételhez',
            'Csak ötlet',
            'Csak backlink',
            'Csak meta title'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'Mi a jó checklist elem minta?',
          options: [
            'Ár/készlet/policy egyezés, SKU/GTIN/brand, answer capsule, trust blokk',
            'Csak képek',
            'Csak page speed',
            'Csak meta description hossz'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'Mi a rossz példa a checklistre?',
          options: [
            'Hosszú lista prioritás nélkül, felelős nélkül',
            'Rövid, priorizált lista',
            'Felelős megadva',
            'Határidő megadva'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'Miért oszd meg a csapattal?',
          options: [
            'Átlátható státusz és követés érdekében',
            'Nem kell megosztani',
            'Csak marketing',
            'Csak SEO miatt'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.HARD,
          category: 'Course Specific'
        }
      );
    }

    await QuizQuestion.deleteMany({ lessonId });
    await QuizQuestion.insertMany(
      quizzes.map((q, index) => ({
        ...q,
        lessonId,
        courseId: course._id,
        language: 'hu',
        isActive: true,
        isCourseSpecific: true,
        displayOrder: index + 1,
        showCount: 0,
        correctCount: 0,
        incorrectCount: 0,
        averageResponseTime: 0
      }))
    );
    console.log(`✅ Lesson ${lessonId} upserted with ${quizzes.length} questions`);
  }

  console.log('🎉 GEO Shopify course seeded (days 1-3).');
  await mongoose.disconnect();
  console.log('✅ Disconnected');
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
