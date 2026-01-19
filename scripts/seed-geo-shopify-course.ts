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
  },
  {
    day: 13,
    title: 'Idézhető termékoldal blueprint',
    content: `<h1>Idézhető termékoldal blueprint</h1>
<p><em>Olyan PDP szerkezetet építesz, amit az AI biztonsággal idéz.</em></p>
<hr />
<h2>Napi cél</h2>
<ul>
<li>Felrajzolod a „GEO-ready” PDP blokk-sorrendet.</li>
<li>Átdolgozol 1 termékoldalt a blueprint szerint.</li>
</ul>
<hr />
<h2>Miért számít?</h2>
<ul>
<li>A generatív modellek a felső blokkokat olvassák először.</li>
<li>A tiszta szerkezet csökkenti a félreértelmezést (ár, policy, variáns).</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<h3>Ajánlott sorrend</h3>
<ul>
<li>Answer capsule (kinek, mire jó/nem jó, ár/stock röviden).</li>
<li>Fő kép + variáns vizuál.</li>
<li>Ár, készlet, kulcs USPs, CTA.</li>
<li>Policy blokk (szállítás/retour linkkel).</li>
<li>Részletes leírás, specifikáció.</li>
<li>Bizalom: review, garancia, support.</li>
</ul>
<hr />
<h2>Példák</h2>
<ul>
<li><strong>Jó</strong>: Rövid answer capsule, tiszta ár/készlet, policy link, specifikáció táblázat.</li>
<li><strong>Rossz</strong>: Hosszú bekezdés ár nélkül, szétszórt policy, hiányzó CTA.</li>
</ul>
<hr />
<h2>Gyakorlat (vezetett, 10-15 perc)</h2>
<ol>
<li>Fogj egy PDP-t: rendezd át a blokkokat a fenti sorrendben.</li>
<li>Add hozzá az answer capsule-t és a policy blokkot.</li>
</ol>
<h2>Gyakorlat (önálló, 5-10 perc)</h2>
<p>Ismételd meg egy másik termékoldalon; jegyezd, mit kellett hozzáadni.</p>
<hr />
<h2>Önellenőrzés</h2>
<ul>
<li>Answer capsule felkerült.</li>
<li>Ár/készlet/CTA jól látható.</li>
<li>Policy link stabil URL-lel.</li>
<li>Specifikáció táblázatban.</li>
<li>Trust elemek a hajtás felett.</li>
</ul>
<hr />
<h2>Opcionális mélyítés</h2>
<ul>
<li>Shopify PDP tartalom: <a href="https://shopify.dev/docs/apps/selling-strategies/product-data" target="_blank" rel="noreferrer">https://shopify.dev/docs/apps/selling-strategies/product-data</a></li>
<li>GEO alap: <a href="https://searchengineland.com/guide/what-is-geo" target="_blank" rel="noreferrer">https://searchengineland.com/guide/what-is-geo</a></li>
</ul>`,
    emailSubject: 'GEO Shopify – 13. nap: Idézhető PDP blueprint',
    emailBody: `<h1>GEO Shopify – 13. nap</h1>
<h2>Idézhető PDP blueprint</h2>
<p>Ma felrajzolod a GEO-ready PDP blokk-sorrendet és átdolgozol 2 oldalt.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`
  },
  {
    day: 14,
    title: 'Answer capsule: 5 soros összegzés a PDP tetején',
    content: `<h1>Answer capsule: 5 soros összegzés a PDP tetején</h1>
<p><em>Megírod a rövid blokkot, amit az AI biztonsággal idézhet.</em></p>
<hr />
<h2>Napi cél</h2>
<ul>
<li>Megírsz 2 answer capsule-t.</li>
<li>Beteszed őket a PDP-k tetejére.</li>
</ul>
<hr />
<h2>Miért számít?</h2>
<ul>
<li>A modell rövid válaszokat keres a hajtás felett.</li>
<li>Csökkenti a félreértést: kinek való/nem való, ár/policy egyértelmű.</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<h3>5 soros minta</h3>
<ol>
<li>Kinek és mire jó?</li>
<li>Kinek nem ajánlott?</li>
<li>Fő előny (1-2 bullet).</li>
<li>Ár + készlet státusz.</li>
<li>Szállítás/visszaküldés röviden + link.</li>
</ol>
<hr />
<h2>Példák</h2>
<ul>
<li><strong>Jó</strong>: „Futócipő haladóknak napi edzéshez. Nem ajánlott széles lábfejre. Előny: stabilitás, párnázás. Ár: 39 900 Ft, készlet: raktáron. Szállítás 3-5 nap, 30 napos visszaküldés: /policies/shipping.”</li>
<li><strong>Rossz</strong>: „Szuper cipő, vedd meg! Gyors szállítás.”</li>
</ul>
<hr />
<h2>Gyakorlat (vezetett, 10-15 perc)</h2>
<ol>
<li>Írj 2 answer capsule-t a legnézettebb termékeidre a fenti 5 sor alapján.</li>
<li>Illeszd be a PDP tetejére (rich text block vagy metafield).</li>
</ol>
<h2>Gyakorlat (önálló, 5-10 perc)</h2>
<p>Írj még 1 kapszulát egy eltérő kategóriára, és mentsd sablonként.</p>
<hr />
<h2>Önellenőrzés</h2>
<ul>
<li>Kinek/nem kinek megvan.</li>
<li>Ár/készlet/policy szerepel.</li>
<li>Link stabil URL-re mutat.</li>
<li>Blokk a hajtás felett.</li>
</ul>
<hr />
<h2>Opcionális mélyítés</h2>
<ul>
<li>OpenAI shopping help: <a href="https://help.openai.com/en/articles/11128490-shopping-with-chatgpt-search" target="_blank" rel="noreferrer">https://help.openai.com/en/articles/11128490-shopping-with-chatgpt-search</a></li>
</ul>`,
    emailSubject: 'GEO Shopify – 14. nap: Answer capsule',
    emailBody: `<h1>GEO Shopify – 14. nap</h1>
<h2>Answer capsule</h2>
<p>Ma 2 answer capsule-t írsz és a PDP tetejére helyezed őket.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`
  },
  {
    day: 15,
    title: 'Variáns tisztaság: méret/szín keveredés nélkül',
    content: `<h1>Variáns tisztaság: méret/szín keveredés nélkül</h1>
<p><em>Rögzíted, hogy a variánsadatok egyértelműek legyenek az AI számára.</em></p>
<hr />
<h2>Napi cél</h2>
<ul>
<li>Átnézel 10 variánst, és egységesíted a megnevezést.</li>
<li>Hozzárendeled a képeket variáns szinten.</li>
</ul>
<hr />
<h2>Miért számít?</h2>
<ul>
<li>A kevert variánsok félreajánláshoz vezetnek.</li>
<li>Az AI szívesebben idézi az egyértelmű variánsadatot.</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<h3>Jelölés</h3>
<ul>
<li>Variáns címben jelenjen meg a méret/szín egyértelműen.</li>
<li>Képek variáns szinten párosítva.</li>
<li>SKU/GTIN variáns-specifikus.</li>
</ul>
<hr />
<h2>Példák</h2>
<ul>
<li><strong>Jó</strong>: „Férfi, kék, 42” + kék cipő kép + egyedi SKU/GTIN.</li>
<li><strong>Rossz</strong>: „42 kék/fekete” egy kép, közös SKU.</li>
</ul>
<hr />
<h2>Gyakorlat (vezetett, 10-15 perc)</h2>
<ol>
<li>Válassz 5 terméket: állítsd be a variáns neveket (méret, szín külön mezőben), rendelj képet variáns szinten.</li>
<li>Ellenőrizd az SKU/GTIN mezőt variánsonként.</li>
</ol>
<h2>Gyakorlat (önálló, 5-10 perc)</h2>
<p>További 5 terméknél ismételd, és jegyezd fel a gyakori hibákat.</p>
<hr />
<h2>Önellenőrzés</h2>
<ul>
<li>Minden variánsnak egyedi SKU-ja van.</li>
<li>GTIN (ha van) variáns szinten.</li>
<li>Variáns név egyértelmű, nincs keverés.</li>
<li>Variáns képek párosítva.</li>
</ul>
<hr />
<h2>Opcionális mélyítés</h2>
<ul>
<li>Shopify variáns kezelés: <a href="https://help.shopify.com/hu/manual/products/variants" target="_blank" rel="noreferrer">https://help.shopify.com/hu/manual/products/variants</a></li>
</ul>`,
    emailSubject: 'GEO Shopify – 15. nap: Variáns tisztaság',
    emailBody: `<h1>GEO Shopify – 15. nap</h1>
<h2>Variáns tisztaság</h2>
<p>Ma egységesíted a variáns elnevezéseket és a képpárosításokat.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`
  },
  {
    day: 16,
    title: 'Kollekció-oldal mint guide, nem csak grid',
    content: `<h1>Kollekció-oldal mint guide, nem csak grid</h1>
<p><em>Úgy alakítod a kollekciót, hogy tanácsot adjon, ne csak listázzon.</em></p>
<hr />
<h2>Napi cél</h2>
<ul>
<li>Átstrukturálsz 1 kollekció-oldalt guide stílusra.</li>
<li>Hozzáadsz 3 blokkot: kinek való, hogyan válassz, top választások.</li>
</ul>
<hr />
<h2>Miért számít?</h2>
<ul>
<li>Az AI előszeretettel idéz jól tagolt, tanácsadó tartalmat.</li>
<li>A vásárló gyorsabban dönt, kevesebb a visszaküldés.</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<h3>Struktúra</h3>
<ul>
<li>Hero blokk: kinek, milyen helyzetre.</li>
<li>Választási szempontok (3-5 bullet).</li>
<li>Top 3 ajánlás linkkel (PDP-re).</li>
<li>Policy röviden + link.</li>
</ul>
<hr />
<h2>Példák</h2>
<ul>
<li><strong>Jó</strong>: „Futócipő kollekció: kezdő/haladó útmutató, top 3 modell, méret tippek.”</li>
<li><strong>Rossz</strong>: Csak termékgrid leírás nélkül.</li>
</ul>
<hr />
<h2>Gyakorlat (vezetett, 10-15 perc)</h2>
<ol>
<li>Válassz 1 kollekciót: adj hozzá guide blokkokat (hero + szempontok + top 3).</li>
<li>Linkeld a PDP-ket következetesen.</li>
</ol>
<h2>Gyakorlat (önálló, 5-10 perc)</h2>
<p>Dokumentáld a szekciókat egy sablonba, hogy más kollekcióknál is használd.</p>
<hr />
<h2>Önellenőrzés</h2>
<ul>
<li>Van hero blokk, benne kinek/mire jó.</li>
<li>Választási szempontok megjelennek.</li>
<li>Top 3 ajánlás linkkel.</li>
<li>Policy blokk röviden.</li>
</ul>
<hr />
<h2>Opcionális mélyítés</h2>
<ul>
<li>Shopify kollekció testreszabás: <a href="https://help.shopify.com/hu/manual/online-store/themes/customizing-themes/add-content/change-collection-page" target="_blank" rel="noreferrer">https://help.shopify.com/hu/manual/online-store/themes/customizing-themes/add-content/change-collection-page</a></li>
</ul>`,
    emailSubject: 'GEO Shopify – 16. nap: Kollekció mint guide',
    emailBody: `<h1>GEO Shopify – 16. nap</h1>
<h2>Kollekció mint guide</h2>
<p>Ma egy kollekció-oldalt alakítasz tanácsadó szerkezetre.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`
  },
  {
    day: 17,
    title: 'Strukturált adatok ellenőrzése (schema)',
    content: `<h1>Strukturált adatok ellenőrzése (schema)</h1>
<p><em>Ellenőrzöd a product/offer schema-t, hogy az AI helyesen értelmezze.</em></p>
<hr />
<h2>Napi cél</h2>
<ul>
<li>Validálod a product/offer schema-t 3 oldalon.</li>
<li>Listázod a hibákat/hiányokat.</li>
</ul>
<hr />
<h2>Miért számít?</h2>
<ul>
<li>A generatív motorok gyakran támaszkodnak a strukturált adatra.</li>
<li>Hibás schema → téves ár/készlet/azonosító.</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<h3>Mit nézz?</h3>
<ul>
<li>@type Product + Offer; price, priceCurrency, availability.</li>
<li>sku, gtin, brand, image, url, review (ha valós).</li>
<li>Ne tüntess fel hamis review-t.</li>
</ul>
<hr />
<h2>Példák</h2>
<ul>
<li><strong>Jó</strong>: Valid JSON-LD, ár/készlet megegyezik a PDP-vel.</li>
<li><strong>Rossz</strong>: Hiányzó availability, hibás ár, hamis review.</li>
</ul>
<hr />
<h2>Gyakorlat (vezetett, 10-15 perc)</h2>
<ol>
<li>Futtasd a Rich Results Testet 3 PDP-n.</li>
<li>Jegyezd a hibákat (missing field, invalid value).</li>
</ol>
<h2>Gyakorlat (önálló, 5-10 perc)</h2>
<p>Javíts 1 hibát (pl. availability vagy price), és ellenőrizd újra.</p>
<hr />
<h2>Önellenőrzés</h2>
<ul>
<li>3 oldal validálva.</li>
<li>Hibák listázva.</li>
<li>Legalább 1 hiba javítva.</li>
</ul>
<hr />
<h2>Opcionális mélyítés</h2>
<ul>
<li>Shopify structured data: <a href="https://shopify.dev/docs/themes/metadata/structured-data" target="_blank" rel="noreferrer">https://shopify.dev/docs/themes/metadata/structured-data</a></li>
<li>Rich Results Test: <a href="https://search.google.com/test/rich-results" target="_blank" rel="noreferrer">https://search.google.com/test/rich-results</a></li>
</ul>`,
    emailSubject: 'GEO Shopify – 17. nap: Schema ellenőrzés',
    emailBody: `<h1>GEO Shopify – 17. nap</h1>
<h2>Schema ellenőrzés</h2>
<p>Ma validálod a product/offer schema-t és javítasz egy hibát.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`
  },
  {
    day: 18,
    title: 'Árak, ajánlatok, review-k biztonságosan',
    content: `<h1>Árak, ajánlatok, review-k biztonságosan</h1>
<p><em>Áttekinted, mikor és hogyan mutass árakat, kedvezményt, review-t anélkül, hogy félrevezetnél.</em></p>
<hr />
<h2>Napi cél</h2>
<ul>
<li>Egységesíted az ár/akció megjelenítését.</li>
<li>Átnézed a review blokkot és eltávolítod a gyenge/hamis elemeket.</li>
</ul>
<hr />
<h2>Miért számít?</h2>
<ul>
<li>Az AI érzékeny a hamis vagy elavult árra.</li>
<li>Félrevezető review komoly kockázat.</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<h3>Ár/akció</h3>
<ul>
<li>Használj compare-at-price mezőt, ne kézi szöveget.</li>
<li>Mutasd a kedvezmény okát és időtartamát, ha van.</li>
</ul>
<h3>Review</h3>
<ul>
<li>Csak valós értékelést jeleníts meg.</li>
<li>Ne manipuláld a számokat; ne rejtsd el a negatívakat.</li>
</ul>
<hr />
<h2>Példák</h2>
<ul>
<li><strong>Jó</strong>: Ár: 39 900 Ft (eredeti 44 900 Ft), kedvezmény ok: „szezonvégi”, review 4.6/5 128 valós értékelésből.</li>
<li><strong>Rossz</strong>: „Most ingyen!” valótlan ár, hamis 5/5 értékelés.</li>
</ul>
<hr />
<h2>Gyakorlat (vezetett, 10-15 perc)</h2>
<ol>
<li>Válassz 5 terméket: ellenőrizd az ár/compare-at-price mezőt és a kedvezmény üzenetet.</li>
<li>Nézd át a review blokkot: távolítsd el a kétes tartalmat, jelöld a forrást.</li>
</ol>
<h2>Gyakorlat (önálló, 5-10 perc)</h2>
<p>Írj egy rövid policy sort a PDP-re: „Review forrása, frissítés dátuma”.</p>
<hr />
<h2>Önellenőrzés</h2>
<ul>
<li>Ár és akció mezők konzisztens.</li>
<li>Kedvezmény ok/határidő megadva, ha van.</li>
<li>Review blokk valós, forrás megjelölve.</li>
<li>Policy link él.</li>
</ul>
<hr />
<h2>Opcionális mélyítés</h2>
<ul>
<li>Google Merchant Center ár/akció szabályok: <a href="https://support.google.com/merchants/answer/7052112" target="_blank" rel="noreferrer">https://support.google.com/merchants/answer/7052112</a></li>
</ul>`,
    emailSubject: 'GEO Shopify – 18. nap: Árak és review-k',
    emailBody: `<h1>GEO Shopify – 18. nap</h1>
<h2>Árak és review-k</h2>
<p>Ma egységesíted az ár/akció megjelenítést és kitisztítod a review blokkot.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`
  },
  {
    day: 19,
    title: 'Képek és videó GEO: alt, fájlnév, variáns vizuál',
    content: `<h1>Képek és videó GEO: alt, fájlnév, variáns vizuál</h1>
<p><em>Optimalizálod a vizuális anyagokat, hogy érthetők legyenek a modelleknek.</em></p>
<hr />
<h2>Napi cél</h2>
<ul>
<li>10 kép alt/fájlnév/variáns hozzárendelés javítása.</li>
<li>1 rövid videó cím + leírás egységesítése.</li>
</ul>
<hr />
<h2>Miért számít?</h2>
<ul>
<li>Az AI a képcímkéket is felhasználhatja összegzéshez.</li>
<li>Variáns vizuál hiánya félreértett szín/méret ajánláshoz vezet.</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<ul>
<li>Alt szöveg: termék, variáns, fő jellemző.</li>
<li>Fájlnév: rövid, kötőjelekkel, variáns jelöléssel.</li>
<li>Videó: cím + rövid leírás, kinek, mire jó.</li>
</ul>
<hr />
<h2>Példák</h2>
<ul>
<li><strong>Jó</strong>: <code>runner-blue-42.jpg</code>, alt: „kék férfi futócipő 42-es stabil talppal”.</li>
<li><strong>Rossz</strong>: <code>IMG_1234.JPG</code>, alt: „image”.</li>
</ul>
<hr />
<h2>Gyakorlat (vezetett, 10-15 perc)</h2>
<ol>
<li>Javíts 10 képet: fájlnév + alt + variáns párosítás.</li>
<li>Adj címet/leírást 1 termékvideónak.</li>
</ol>
<h2>Gyakorlat (önálló, 5-10 perc)</h2>
<p>Készíts sablont az alt szövegre (termék + variáns + fő USP), és alkalmazd új képeknél.</p>
<hr />
<h2>Önellenőrzés</h2>
<ul>
<li>10 kép alt/fájlnév/variáns javítva.</li>
<li>Videó cím + leírás megadva.</li>
<li>Sablon rögzítve a jövőre.</li>
</ul>
<hr />
<h2>Opcionális mélyítés</h2>
<ul>
<li>Shopify alt szöveg: <a href="https://help.shopify.com/hu/manual/online-store/images/add-alt-text" target="_blank" rel="noreferrer">https://help.shopify.com/hu/manual/online-store/images/add-alt-text</a></li>
</ul>`,
    emailSubject: 'GEO Shopify – 19. nap: Kép/videó GEO',
    emailBody: `<h1>GEO Shopify – 19. nap</h1>
<h2>Kép/videó GEO</h2>
<p>Ma 10 képnél javítod az alt/fájlnév/variáns párosítást, és frissíted egy videó leírását.</p>
<p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/{{dayNumber}}">Olvasd el a leckét →</a></p>`
  },
  {
    day: 20,
    title: 'Minimum tartalom: nincs „thin” PDP',
    content: `<h1>Minimum tartalom: nincs „thin” PDP</h1>
<p><em>Felszámolod az alacsony tartalmú termékoldalakat.</em></p>
<hr />
<h2>Napi cél</h2>
<ul>
<li>Összeállítod a minimum tartalmi standardot.</li>
<li>Javítasz 3 „thin” oldalt.</li>
</ul>
<hr />
<h2>Miért számít?</h2>
<ul>
<li>A kevés tartalom kevésbé idézhető, és rossz ajánláshoz vezet.</li>
<li>Visszaküldés nő, ha a felhasználó nem kap elég infót.</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<ul>
<li>Minimum elemek: answer capsule, ár/készlet, policy, 3 USP, specifikáció, 2 kép variánssal.</li>
<li>Hiány esetén: bővítés sablonból, specifikáció táblázat.</li>
</ul>
<hr />
<h2>Példák</h2>
<ul>
<li><strong>Jó</strong>: Rövid kapszula + 3 USP + specifikáció + 4 kép.</li>
<li><strong>Rossz</strong>: 1 mondatos leírás, 1 kép, nincs policy.</li>
</ul>
<hr />
<h2>Gyakorlat (vezetett, 10-15 perc)</h2>
<ol>
<li>Állíts össze minimum standard listát (checkbox formában).</li>
<li>Válassz 3 „thin” PDP-t, és töltsd fel a hiányzó blokkokat.</li>
</ol>
<h2>Gyakorlat (önálló, 5-10 perc)</h2>
<p>Dokumentáld a standardot a csapatnak, hogy új termékeknél kötelező legyen.</p>
<hr />
<h2>Önellenőrzés</h2>
<ul>
<li>Minimum lista kész.</li>
<li>3 PDP bővítve.</li>
<li>Specifikáció táblázat mindenhol megvan.</li>
</ul>
<hr />
<h2>Opcionális mélyítés</h2>
<ul>
<li>Google tartalom irányelvek: <a href="https://developers.google.com/search/docs/fundamentals/creating-helpful-content" target="_blank" rel="noreferrer">https://developers.google.com/search/docs/fundamentals/creating-helpful-content</a></li>
</ul>`,
    emailSubject: 'GEO Shopify – 20. nap: Minimum tartalom',
    emailBody: `<h1>GEO Shopify – 20. nap</h1>
<h2>Minimum tartalom</h2>
<p>Ma standardot állítasz fel, és javítasz 3 thin PDP-t.</p>
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
    } else if (entry.day === 13) {
      quizzes.push(
        {
          question: 'Mi a GEO-ready PDP első blokkja?',
          options: [
            'Answer capsule a hajtás felett',
            'Hosszú leírás legalján',
            'Csak képgaléria',
            'Véletlen sorrend'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'Miért fontos a policy blokk a felső részen?',
          options: [
            'Az AI és a vevő gyorsan látja a szállítás/retour infót',
            'Csak dizájn',
            'Nem szükséges',
            'Csak SEO kulcsszó miatt'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'Mi legyen a PDP sorrendben a kapszula után?',
          options: [
            'Fő kép + variáns vizuál, majd ár/készlet/CTA',
            'Footer linkek',
            'Blog bejegyzések',
            'Csak véletlen sorrend'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'Mi a jó példa a blueprintre?',
          options: [
            'Kapszula + ár/készlet + policy + specifikáció táblázat',
            'Egy mondat ár nélkül',
            'Nincs CTA',
            'Csak képek'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'Miért kell a trust elemeket a hajtás felett elhelyezni?',
          options: [
            'Bizalom és idézhetőség nő',
            'Csak esztétika',
            'Nem számít',
            'Csak a footerben fontos'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.HARD,
          category: 'Course Specific'
        }
      );
    } else if (entry.day === 14) {
      quizzes.push(
        {
          question: 'Mi az answer capsule 5 sorának egyik kötelező eleme?',
          options: [
            'Kinek nem ajánlott a termék',
            'Véletlen szlogen',
            'Csak terméknév',
            'Csak egy emoji'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'Hova kerüljön az answer capsule?',
          options: [
            'PDP tetejére, hajtás fölé',
            'Footerbe',
            'Csak a blogba',
            'Rejtett elemként'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'Miért kell linkelni a policy-t a kapszulában?',
          options: [
            'Stabil URL-t kap az AI és a vevő',
            'Csak dísz',
            'Nem szükséges link',
            'Csak SEO miatt'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'Mi a rossz példa kapszulára?',
          options: [
            '„Szuper termék, vedd meg!” ár/policy nélkül',
            'Kinek/nem kinek + ár + készlet + policy',
            'Rövid, tömör összegzés',
            'Linkelt policy'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'Mi a jó gyakorlat kapszula sablonra?',
          options: [
            'Menteni és új termékeknél újra használni',
            'Mindenkor kézzel írni változtatás nélkül',
            'Nem dokumentálni',
            'Csak random szöveg'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        }
      );
    } else if (entry.day === 15) {
      quizzes.push(
        {
          question: 'Miért kell variáns szinten egyedi SKU?',
          options: [
            'Az AI és a feed pontosan azonosítson minden variánst',
            'Csak design okból',
            'Nem számít',
            'SEO kulcsszó miatt'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'Mi a jó variáns elnevezés példája?',
          options: [
            '„Férfi, kék, 42”',
            '„42 kék/fekete?”',
            '„Termék variáns”',
            'Nincs megadva'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'Miért kell variáns képpárosítás?',
          options: [
            'Elkerülni a szín/méret félreértést ajánláskor',
            'Csak esztétika',
            'Nem kell',
            'Csak SEO alt miatt'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'Mi a rossz gyakorlat variánsokra?',
          options: [
            'Közös SKU/GTIN, kevert megnevezés',
            'Egyedi SKU',
            'Egyértelmű név',
            'Párosított kép'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'Mit jegyezz fel a gyakori hibákhoz?',
          options: [
            'Összegyűjtöd és sablont készítesz a javításra',
            'Nem dokumentálod',
            'Elrejted',
            'Csak marketing szlogent írsz'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        }
      );
    } else if (entry.day === 16) {
      quizzes.push(
        {
          question: 'Mi a guide jellegű kollekció egyik fő blokkja?',
          options: [
            'Választási szempontok (3-5 bullet)',
            'Csak termékgrid',
            'Footer link',
            'Cookie banner'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'Miért jobb a guide, mint a sima grid?',
          options: [
            'Gyorsabb döntés, idézhetőbb tartalom',
            'Csak szebb',
            'Nem jobb',
            'Csak SEO miatt'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'Mi legyen a hero blokkban?',
          options: [
            'Kinek és milyen helyzetre szól a kollekció',
            'Csak egy kép',
            'Csak árlista',
            'Csak egy CTA gomb cím nélkül'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'Mi a jó top 3 ajánlás elem?',
          options: [
            'Rövid indoklás + link a PDP-re',
            'Csak terméknév',
            'Nincs link',
            'Véletlen sorrend'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'Miért dokumentáld a szekció sablont?',
          options: [
            'Hogy más kollekcióknál újrahasználd',
            'Nem kell dokumentálni',
            'Csak marketing miatt',
            'Csak design csere miatt'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        }
      );
    } else if (entry.day === 17) {
      quizzes.push(
        {
          question: 'Mely mezők kötelezőek egy product/offer schema-ban?',
          options: [
            'price, priceCurrency, availability, sku/gtin, brand',
            'Csak title',
            'Csak description',
            'Csak image'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'Mi a kockázat hibás availability mezőnél?',
          options: [
            'Téves ajánlás készlet nélkül',
            'Semmi',
            'Csak design hiba',
            'Csak SEO hossz miatt'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'Mi a jó gyakorlat review adatokkal schema-ban?',
          options: [
            'Csak valós review-t tüntess fel',
            'Hamis review is mehet',
            'Ne adj meg forrást',
            'Random számokat írj'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.HARD,
          category: 'Course Specific'
        },
        {
          question: 'Milyen eszközzel validálsz?',
          options: [
            'Rich Results Test (Google)',
            'Csak manuális olvasás',
            'Nincs validáció',
            'Backlink checker'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'Mit tegyél hiba esetén?',
          options: [
            'Javítsd a mezőt (pl. availability, price) és futtasd újra a tesztet',
            'Hagyd figyelmen kívül',
            'Töröld a schema-t',
            'Csak redesign'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        }
      );
    } else if (entry.day === 18) {
      quizzes.push(
        {
          question: 'Hogyan jeleníts meg kedvezményt helyesen?',
          options: [
            'compare-at-price mezővel és ok/időtartam feltüntetésével',
            'Csak kézi szöveg “akció”',
            'Hamis kedvezmény',
            'Keverd az árakat feedben és PDP-n'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'Miért veszélyes a hamis review?',
          options: [
            'Bizalomvesztés és szabályzat sértés',
            'Nem veszélyes',
            'Csak SEO büntetés',
            'Csak design gond'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.HARD,
          category: 'Course Specific'
        },
        {
          question: 'Mi legyen feltüntetve a review blokknál?',
          options: [
            'Forrás és frissítés dátuma, ha lehet',
            'Semmi',
            'Csak pozitív értékelések',
            'Csak egy csillag ikon'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'Mi a jó példa ár megjelenítésre?',
          options: [
            '39 900 Ft (eredeti 44 900 Ft), ok: „szezonvégi”',
            '„Ingyen!” valótlan ár',
            'Csak “akciós” szó',
            'Nincs ár'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'Mit kerülj a review blokknál?',
          options: [
            'Manipulált számok vagy hamis értékelés',
            'Valós értékelés',
            'Forrás megjelölés',
            'Átlátható pontszám'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        }
      );
    } else if (entry.day === 19) {
      quizzes.push(
        {
          question: 'Mi legyen az alt szövegben?',
          options: [
            'Termék + variáns + fő jellemző',
            'Csak “image” szó',
            'Emojik',
            'Üresen hagyni'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'Mi a jó fájlnév?',
          options: [
            'runner-blue-42.jpg',
            'IMG_1234.JPG',
            'photo_final_final.png',
            'random.jpeg'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'Miért párosíts képet variáns szinten?',
          options: [
            'Ne keverje az AI a színt/méretet',
            'Csak esztétika',
            'Nem kell',
            'Csak SEO alt miatt'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'Mit adj a videóhoz?',
          options: [
            'Cím + rövid leírás, kinek/mire jó',
            'Semmit',
            'Csak egy link',
            'Random szöveg forrás nélkül'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'Miért készíts alt sablont?',
          options: [
            'Következetes legyen minden új képnél',
            'Nem kell',
            'Csak design miatt',
            'Csak SEO miatt'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        }
      );
    } else if (entry.day === 20) {
      quizzes.push(
        {
          question: 'Mi a minimum tartalom része?',
          options: [
            'Answer capsule, ár/készlet, policy, 3 USP, specifikáció, 2 kép',
            'Csak egy mondat',
            'Nincs kép',
            'Csak meta title'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'Mi a kockázat a “thin” PDP-nél?',
          options: [
            'Kevesebb idézhetőség és rossz ajánlás',
            'Nincs kockázat',
            'Csak design gond',
            'Csak hossz miatt'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'Mit tegyél hiányzó specifikáció esetén?',
          options: [
            'Töltsd fel táblázatban, sablon alapján',
            'Hagyd üresen',
            'Csak marketing szöveget írj',
            'Random adatot adj meg'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.EASY,
          category: 'Course Specific'
        },
        {
          question: 'Miért dokumentáld a minimum standardot?',
          options: [
            'Új termékeknél kötelező legyen a minőség',
            'Nem kell dokumentálni',
            'Csak marketingnek',
            'Csak egyszeri használatra'
          ],
          correctIndex: 0,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific'
        },
        {
          question: 'Mi a jó lépés a „thin” oldalakhoz?',
          options: [
            'Válassz 3 oldalt és bővítsd a standard szerint',
            'Semmit nem csinálsz',
            'Csak képet növeled',
            'Csak meta descriptiont írsz'
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

  console.log('🎉 GEO Shopify course seeded (lessons updated).');
  await mongoose.disconnect();
  console.log('✅ Disconnected');
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
