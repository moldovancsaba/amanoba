/**
 * Seed: Sales Productivity 30-Day Course (HU, EN, RU)
 *
 * What:
 * - Creates course "SALES_PRODUCTIVITY_30" in Hungarian, English, and Russian
 * - "Build Your Sales – 30 Days to More Deals"
 * - Complete 30-day B2B sales course for beginners (sales reps and entrepreneurs)
 * - Covers: Number Games, Lead Qualification, Pricing & Freebies
 * - Each lesson includes quiz (5 questions from pool of 15)
 *
 * Why:
 * - Professional sales training course
 * - Practical, actionable content
 * - Templates and tools included
 * - All three languages (HU, EN, RU)
 *
 * How to run:
 * - Ensure `.env.local` has `MONGODB_URI` and `DB_NAME=amanoba`
 * - Run: `npx tsx --env-file=.env.local scripts/seed-sales-productivity-30.ts`
 */

import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { Brand, Course, Lesson, QuizQuestion, QuestionDifficulty } from '../app/lib/models';

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI missing');

  const dbName = process.env.DB_NAME || 'amanoba';
  await mongoose.connect(uri, { dbName });
  console.log(`✅ Connected to MongoDB (dbName=${dbName})`);
}

const COURSE_ID_HU = 'SALES_PRODUCTIVITY_30_HU';
const COURSE_ID_EN = 'SALES_PRODUCTIVITY_30_EN';
const COURSE_ID_RU = 'SALES_PRODUCTIVITY_30_RU';

const COURSE_NAME_HU = 'Építsd fel az eladásod – 30 nap több üzlethez';
const COURSE_NAME_EN = 'Build Your Sales – 30 Days to More Deals';
const COURSE_NAME_RU = 'Постройте свои продажи – 30 дней к большему количеству сделок';

const COURSE_DESCRIPTION_HU = '30 napos, gyakorlati B2B értékesítési kurzus kezdőknek. Tanulj meg számokkal játszani, minősíteni a lead-eket, és értékalapú árazást alkalmazni – minden napi gyakorlati feladatokkal és sablonokkal.';
const COURSE_DESCRIPTION_EN = '30-day practical B2B sales course for beginners. Learn to play the numbers game, qualify leads, and use value-based pricing – all with daily practical exercises and templates.';
const COURSE_DESCRIPTION_RU = '30-дневный практический курс B2B-продаж для начинающих. Научитесь играть в цифры, квалифицировать лиды и использовать ценностное ценообразование – все с ежедневными практическими упражнениями и шаблонами.';

type LessonContent = {
  day: number;
  title: {
    hu: string;
    en: string;
    ru: string;
  };
  content: {
    hu: string;
    en: string;
    ru: string;
  };
  emailSubject: {
    hu: string;
    en: string;
    ru: string;
  };
  emailBody: {
    hu: string;
    en: string;
    ru: string;
  };
  quiz: Array<{
    q: { hu: string; en: string; ru: string };
    options: { hu: string[]; en: string[]; ru: string[] };
    correct: number;
  }>;
};

// Day 1: Sales Funnel Fundamentals - The Numbers Game
const lessonPlan: LessonContent[] = [
  {
    day: 1,
    title: {
      hu: 'Az értékesítési tölcsér alapjai – Miért számítanak a számok?',
      en: 'Sales Funnel Fundamentals – Why Numbers Matter',
      ru: 'Основы воронки продаж – Почему важны цифры',
    },
    content: {
      hu: `
<h1>Az értékesítési tölcsér alapjai – Miért számítanak a számok?</h1>
<p><em>Ma megtanulod, hogyan működik az értékesítési tölcsér, és miért kritikus a számok követése. Ez a kurzus alapja – minden, amit tanulsz, erre épül.</em></p>
<hr />

<h2>Napi cél</h2>
<ul>
  <li>Megérteni, mi az értékesítési tölcsér és miért fontos</li>
  <li>Azonosítani a tölcsér 5 fő szintjét (Lead → Minősített → Kapcsolat → Ajánlat elküldve → Lezárás)</li>
  <li>Létrehozni a saját tölcsér sablonodat táblázatban</li>
  <li>Beállítani a napi/heti/havi célokat az első szinthez</li>
</ul>
<hr />

<h2>Miért fontos ez?</h2>
<ul>
  <li><strong>Nincs számok = nincs kontroll.</strong> Ha nem méred, nem tudod javítani.</li>
  <li><strong>Előrejelzés:</strong> A számok ismeretében megjósolhatod, hány üzletet fogsz bezárni.</li>
  <li><strong>Gyors javítás:</strong> Ha látod, hogy egy szinten elakadsz, azonnal tudod, hol kell javítani.</li>
  <li><strong>Motiváció:</strong> A napi célok elérése motivál, és elkerüli a "reménykedést".</li>
</ul>
<hr />

<h2>Elmagyarázás</h2>

<h3>Mi az értékesítési tölcsér?</h3>
<p>Az értékesítési tölcsér egy modell, amely bemutatja, hogyan haladnak a potenciális ügyfelek a "nem ismerlek" szinttől a "vásárolt" szintig.</p>

<p><strong>Egyszerű példa:</strong></p>
<ul>
  <li>100 ember megnézi a weboldaladat (Lead)</li>
  <li>20 ember kitölti a kapcsolatfelvételi űrlapot (Minősített)</li>
  <li>10 emberrel beszélsz telefonon (Kapcsolat)</li>
  <li>5 ember részt vesz egy bemutatón (Ajánlat elküldve)</li>
  <li>2 ember vásárol (Lezárás)</li>
</ul>

<p>Ez azt jelenti: <strong>2% konverzió</strong> a lead-től a lezárásig.</p>

<h3>A tölcsér 5 szintje (B2B értékesítéshez)</h3>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <thead>
    <tr style="background-color: #FAB908; color: #000;">
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Szint</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Mit jelent</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Példa</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>1. Lead</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Valaki, aki potenciálisan érdeklődik</td>
      <td style="padding: 12px; border: 1px solid #ddd;">LinkedIn kapcsolat, email lista, weboldal látogató</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>2. Minősített</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Lead, aki megfelel az ideális ügyfélprofilnak (ICP)</td>
      <td style="padding: 12px; border: 1px solid #ddd;">Megfelelő cégméret, költségvetés, szükséglet</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>3. Kapcsolat</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Első beszélgetés megtörtént</td>
      <td style="padding: 12px; border: 1px solid #ddd;">Telefonhívás, email váltás, LinkedIn üzenet</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>4. Ajánlat elküldve</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Bemutató/demo megtörtént, érdeklődés van</td>
      <td style="padding: 12px; border: 1px solid #ddd;">Demo megtartva, ajánlat elküldve</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>5. Lezárás</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Üzlet lezárva, szerződés aláírva</td>
      <td style="padding: 12px; border: 1px solid #ddd;">Fizetés megérkezett, projekt elindult</td>
    </tr>
  </tbody>
</table>

<h3>Konverziós arányok (B2B típusú átlagok)</h3>
<p>Ezek nem szentírás, de jó kiindulási pontok:</p>
<ul>
  <li><strong>Lead → Minősített:</strong> 20-30% (100 lead-ből 20-30 minősített)</li>
  <li><strong>Minősített → Kapcsolat:</strong> 40-50% (20 minősített-ből 8-10 kapcsolat)</li>
  <li><strong>Kapcsolat → Ajánlat elküldve:</strong> 30-40% (10 kapcsolat-ból 3-4 ajánlat)</li>
  <li><strong>Ajánlat elküldve → Lezárás:</strong> 20-30% (4 ajánlat-ból 1 lezárás)</li>
</ul>

<p><strong>Összesen:</strong> 100 lead → ~1 lezárás (1% konverzió lead-től lezárásig)</p>

<hr />

<h2>Példák</h2>

<h3>Jó példa: Mérhető tölcsér</h3>
<p><strong>Havi célok:</strong></p>
<ul>
  <li>400 új lead (napi 20)</li>
  <li>200 minősített (napi 10)</li>
  <li>48 bemutató (heti 12)</li>
  <li>12 lezárás (havi 12)</li>
</ul>
<p><strong>Miért jó:</strong> Minden szinten van konkrét szám, napi/heti/havi bontásban. Tudod, ha elmaradsz, és hol kell gyorsítani.</p>

<h3>Rossz példa: "Reménykedés"</h3>
<p><strong>Havi célok:</strong></p>
<ul>
  <li>"Sok lead"</li>
  <li>"Jó üzletek"</li>
  <li>"Remélem, lezárunk 5-öt"</li>
</ul>
<p><strong>Miért rossz:</strong> Nincs mérhető cél, nincs kontroll, nincs előrejelzés. Csak reménykedsz.</p>

<hr />

<h2>Gyakorlat 1 – Tölcsér sablon létrehozása (15 perc)</h2>
<p>Hozd létre a saját tölcsér sablonodat Excel-ben vagy Google Táblázatban:</p>

<ol>
  <li><strong>Nyiss egy új táblázatot</strong> és hozd létre ezt a struktúrát:</li>
</ol>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <thead>
    <tr style="background-color: #FAB908; color: #000;">
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Szint</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Napi cél</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Heti cél</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Havi cél</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Konverzió</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>1. Lead</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">20</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">100</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">400</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">100%</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>2. Minősített</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">10</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">50</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">200</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">50%</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>3. Kapcsolat</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">2</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">12</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">48</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">24%</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>4. Ajánlat elküldve</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">4</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">16</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">33%</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>5. Lezárás</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">1</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">4</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">25%</td>
    </tr>
  </tbody>
</table>

<ol start="2">
  <li><strong>Számítsd ki a konverziós arányokat:</strong> Minden szinthez add meg, hány százalék halad tovább.</li>
  <li><strong>Állítsd be a célokat:</strong> Kezdj a lezárással (pl. "havi 4 üzlet"), és számold visszafelé.</li>
  <li><strong>Mentsd el sablonként:</strong> Ezt fogod használni minden nap.</li>
</ol>

<h2>Gyakorlat 2 – Napi követés beállítása (10 perc)</h2>
<p>Hozz létre egy egyszerű napi követő táblázatot:</p>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <thead>
    <tr style="background-color: #FAB908; color: #000;">
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Dátum</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Új lead</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Minősített</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Kapcsolat</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Bemutató</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Lezárás</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">2026-01-22</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0</td>
    </tr>
  </tbody>
</table>

<p><strong>Feladat:</strong> Töltsd ki ezt a táblázatot minden nap, és nézd meg a heti/havi összesítést.</p>

<hr />

<h2>Kulcs tanulságok</h2>
<ul>
  <li><strong>A tölcsér = előrejelzés.</strong> Ha ismered a számokat, tudod, hány üzletet fogsz bezárni.</li>
  <li><strong>Minden szinten kell cél.</strong> Nem elég csak a lezárásra koncentrálni – minden szinten kell aktivitás.</li>
  <li><strong>Napi követés = kontroll.</strong> Ha nem méred naponta, elveszíted a kontrollt.</li>
  <li><strong>Konverziós arányok változnak.</strong> Mérj, javíts, optimalizálj folyamatosan.</li>
</ul>

<hr />

<h2>További anyagok (választható)</h2>
<ul>
  <li><strong>HubSpot – Sales Funnel Guide:</strong> <a href="https://blog.hubspot.com/sales/sales-funnel" target="_blank" rel="noopener noreferrer">https://blog.hubspot.com/sales/sales-funnel</a> – Alapfogalmak és best practice-ek</li>
  <li><strong>Salesforce – Funnel Metrics:</strong> <a href="https://www.salesforce.com/resources/articles/sales-funnel/" target="_blank" rel="noopener noreferrer">https://www.salesforce.com/resources/articles/sales-funnel/</a> – Mérőszámok és KPI-k</li>
  <li><strong>Harvard Business Review – Sales Metrics:</strong> <a href="https://hbr.org/topic/sales" target="_blank" rel="noopener noreferrer">https://hbr.org/topic/sales</a> – Akadémiai háttér</li>
</ul>
      `.trim(),
      en: `
<h1>Sales Funnel Fundamentals – Why Numbers Matter</h1>
<p><em>Today you'll learn how sales funnels work and why tracking numbers is critical. This is the foundation of the course – everything you learn builds on this.</em></p>
<hr />

<h2>Daily Goal</h2>
<ul>
  <li>Understand what a sales funnel is and why it matters</li>
  <li>Identify the 5 main funnel stages (Lead → Qualified → Connected → Engaged → Closed)</li>
  <li>Create your own funnel template in a spreadsheet</li>
  <li>Set daily/weekly/monthly targets for the first stage</li>
</ul>
<hr />

<h2>Why it matters</h2>
<ul>
  <li><strong>No numbers = no control.</strong> If you don't measure, you can't improve.</li>
  <li><strong>Forecasting:</strong> With numbers, you can predict how many deals you'll close.</li>
  <li><strong>Quick fixes:</strong> If you see you're stuck at one stage, you immediately know where to improve.</li>
  <li><strong>Motivation:</strong> Hitting daily targets motivates and eliminates "hoping".</li>
</ul>
<hr />

<h2>Explanation</h2>

<h3>What is a sales funnel?</h3>
<p>A sales funnel is a model that shows how potential customers move from "don't know you" to "bought".</p>

<p><strong>Simple example:</strong></p>
<ul>
  <li>100 people visit your website (Lead)</li>
  <li>20 people fill out a contact form (Qualified)</li>
  <li>10 people talk to you on the phone (Connected)</li>
  <li>5 people attend a demo (Engaged)</li>
  <li>2 people buy (Closed)</li>
</ul>

<p>This means: <strong>2% conversion</strong> from lead to close.</p>

<h3>The 5 funnel stages (for B2B sales)</h3>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <thead>
    <tr style="background-color: #FAB908; color: #000;">
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Stage</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">What it means</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Example</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>1. Lead</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Someone who might be interested</td>
      <td style="padding: 12px; border: 1px solid #ddd;">LinkedIn connection, email list, website visitor</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>2. Qualified</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Lead who fits your ideal customer profile (ICP)</td>
      <td style="padding: 12px; border: 1px solid #ddd;">Right company size, budget, need</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>3. Connected</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">First conversation happened</td>
      <td style="padding: 12px; border: 1px solid #ddd;">Phone call, email exchange, LinkedIn message</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>4. Engaged</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Demo/presentation happened, interest shown</td>
      <td style="padding: 12px; border: 1px solid #ddd;">Demo completed, proposal sent</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>5. Closed</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Deal closed, contract signed</td>
      <td style="padding: 12px; border: 1px solid #ddd;">Payment received, project started</td>
    </tr>
  </tbody>
</table>

<h3>Conversion rates (B2B averages)</h3>
<p>These aren't gospel, but good starting points:</p>
<ul>
  <li><strong>Lead → Qualified:</strong> 20-30% (20-30 qualified out of 100 leads)</li>
  <li><strong>Qualified → Connected:</strong> 40-50% (8-10 connected out of 20 qualified)</li>
  <li><strong>Connected → Engaged:</strong> 30-40% (3-4 engaged out of 10 connected)</li>
  <li><strong>Engaged → Closed:</strong> 20-30% (1 closed out of 4 engaged)</li>
</ul>

<p><strong>Total:</strong> 100 leads → ~1 close (1% conversion from lead to close)</p>

<hr />

<h2>Examples</h2>

<h3>Good example: Measurable funnel</h3>
<p><strong>Monthly targets:</strong></p>
<ul>
  <li>400 new leads (20 daily)</li>
  <li>200 qualified (10 daily)</li>
  <li>48 demos (12 weekly)</li>
  <li>12 closes (12 monthly)</li>
</ul>
<p><strong>Why it's good:</strong> Every stage has a concrete number, broken down daily/weekly/monthly. You know if you're behind and where to accelerate.</p>

<h3>Bad example: "Hoping"</h3>
<p><strong>Monthly targets:</strong></p>
<ul>
  <li>"Many leads"</li>
  <li>"Good deals"</li>
  <li>"Hope we close 5"</li>
</ul>
<p><strong>Why it's bad:</strong> No measurable target, no control, no forecasting. You're just hoping.</p>

<hr />

<h2>Practice 1 – Create funnel template (15 min)</h2>
<p>Create your own funnel template in Excel or Google Sheets:</p>

<ol>
  <li><strong>Open a new spreadsheet</strong> and create this structure:</li>
</ol>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <thead>
    <tr style="background-color: #FAB908; color: #000;">
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Stage</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Daily Target</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Weekly Target</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Monthly Target</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Conversion</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>1. Lead</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">20</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">100</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">400</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">100%</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>2. Qualified</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">10</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">50</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">200</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">50%</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>3. Connected</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">2</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">12</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">48</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">24%</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>4. Engaged</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">4</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">16</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">33%</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>5. Closed</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">1</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">4</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">25%</td>
    </tr>
  </tbody>
</table>

<ol start="2">
  <li><strong>Calculate conversion rates:</strong> For each stage, determine what percentage moves forward.</li>
  <li><strong>Set your targets:</strong> Start with closes (e.g., "4 deals monthly"), and work backwards.</li>
  <li><strong>Save as template:</strong> You'll use this every day.</li>
</ol>

<h2>Practice 2 – Set up daily tracking (10 min)</h2>
<p>Create a simple daily tracking table:</p>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <thead>
    <tr style="background-color: #FAB908; color: #000;">
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Date</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">New Leads</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Qualified</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Connected</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Demo</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Closed</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">2026-01-22</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0</td>
    </tr>
  </tbody>
</table>

<p><strong>Task:</strong> Fill this table every day and review weekly/monthly totals.</p>

<hr />

<h2>Key Takeaways</h2>
<ul>
  <li><strong>Funnel = forecasting.</strong> If you know the numbers, you know how many deals you'll close.</li>
  <li><strong>Every stage needs a target.</strong> It's not enough to focus only on closing – you need activity at every stage.</li>
  <li><strong>Daily tracking = control.</strong> If you don't measure daily, you lose control.</li>
  <li><strong>Conversion rates change.</strong> Measure, improve, optimize continuously.</li>
</ul>

<hr />

<h2>Optional Resources</h2>
<ul>
  <li><strong>HubSpot – Sales Funnel Guide:</strong> <a href="https://blog.hubspot.com/sales/sales-funnel" target="_blank" rel="noopener noreferrer">https://blog.hubspot.com/sales/sales-funnel</a> – Fundamentals and best practices</li>
  <li><strong>Salesforce – Funnel Metrics:</strong> <a href="https://www.salesforce.com/resources/articles/sales-funnel/" target="_blank" rel="noopener noreferrer">https://www.salesforce.com/resources/articles/sales-funnel/</a> – Metrics and KPIs</li>
  <li><strong>Harvard Business Review – Sales Metrics:</strong> <a href="https://hbr.org/topic/sales" target="_blank" rel="noopener noreferrer">https://hbr.org/topic/sales</a> – Academic background</li>
</ul>
      `.trim(),
      ru: `
<h1>Основы воронки продаж – Почему важны цифры</h1>
<p><em>Сегодня вы узнаете, как работает воронка продаж и почему отслеживание цифр критично. Это основа курса – всё, что вы изучаете, строится на этом.</em></p>
<hr />

<h2>Цель дня</h2>
<ul>
  <li>Понять, что такое воронка продаж и почему это важно</li>
  <li>Определить 5 основных этапов воронки (Лид → Квалифицированный → Связанный → Заинтересованный → Закрыт)</li>
  <li>Создать свой шаблон воронки в таблице</li>
  <li>Установить дневные/недельные/месячные цели для первого этапа</li>
</ul>
<hr />

<h2>Почему это важно</h2>
<ul>
  <li><strong>Нет цифр = нет контроля.</strong> Если не измеряете, не можете улучшить.</li>
  <li><strong>Прогнозирование:</strong> Зная цифры, вы можете предсказать, сколько сделок закроете.</li>
  <li><strong>Быстрые исправления:</strong> Если видите, что застряли на одном этапе, сразу знаете, где улучшить.</li>
  <li><strong>Мотивация:</strong> Достижение дневных целей мотивирует и устраняет "надежду".</li>
</ul>
<hr />

<h2>Объяснение</h2>

<h3>Что такое воронка продаж?</h3>
<p>Воронка продаж – это модель, показывающая, как потенциальные клиенты движутся от "не знают вас" до "купили".</p>

<p><strong>Простой пример:</strong></p>
<ul>
  <li>100 человек посещают ваш сайт (Лид)</li>
  <li>20 человек заполняют контактную форму (Квалифицированный)</li>
  <li>10 человек разговаривают с вами по телефону (Связанный)</li>
  <li>5 человек посещают демо (Заинтересованный)</li>
  <li>2 человека покупают (Закрыт)</li>
</ul>

<p>Это означает: <strong>2% конверсия</strong> от лида до закрытия.</p>

<h3>5 этапов воронки (для B2B продаж)</h3>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <thead>
    <tr style="background-color: #FAB908; color: #000;">
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Этап</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Что означает</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Пример</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>1. Лид</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Кто-то, кто потенциально заинтересован</td>
      <td style="padding: 12px; border: 1px solid #ddd;">LinkedIn контакт, email список, посетитель сайта</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>2. Квалифицированный</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Лид, который соответствует вашему идеальному профилю клиента (ICP)</td>
      <td style="padding: 12px; border: 1px solid #ddd;">Правильный размер компании, бюджет, потребность</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>3. Связанный</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Первый разговор состоялся</td>
      <td style="padding: 12px; border: 1px solid #ddd;">Телефонный звонок, обмен email, сообщение в LinkedIn</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>4. Заинтересованный</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Демо/презентация состоялась, интерес проявлен</td>
      <td style="padding: 12px; border: 1px solid #ddd;">Демо завершено, предложение отправлено</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>5. Закрыт</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Сделка закрыта, контракт подписан</td>
      <td style="padding: 12px; border: 1px solid #ddd;">Платеж получен, проект начат</td>
    </tr>
  </tbody>
</table>

<h3>Коэффициенты конверсии (B2B средние значения)</h3>
<p>Это не догма, но хорошие отправные точки:</p>
<ul>
  <li><strong>Лид → Квалифицированный:</strong> 20-30% (20-30 квалифицированных из 100 лидов)</li>
  <li><strong>Квалифицированный → Связанный:</strong> 40-50% (8-10 связанных из 20 квалифицированных)</li>
  <li><strong>Связанный → Заинтересованный:</strong> 30-40% (3-4 заинтересованных из 10 связанных)</li>
  <li><strong>Заинтересованный → Закрыт:</strong> 20-30% (1 закрыт из 4 заинтересованных)</li>
</ul>

<p><strong>Итого:</strong> 100 лидов → ~1 закрытие (1% конверсия от лида до закрытия)</p>

<hr />

<h2>Примеры</h2>

<h3>Хороший пример: Измеримая воронка</h3>
<p><strong>Месячные цели:</strong></p>
<ul>
  <li>400 новых лидов (20 ежедневно)</li>
  <li>200 квалифицированных (10 ежедневно)</li>
  <li>48 демо (12 еженедельно)</li>
  <li>12 закрытий (12 ежемесячно)</li>
</ul>
<p><strong>Почему это хорошо:</strong> На каждом этапе есть конкретное число, разбитое по дням/неделям/месяцам. Вы знаете, если отстаете, и где нужно ускориться.</p>

<h3>Плохой пример: "Надежда"</h3>
<p><strong>Месячные цели:</strong></p>
<ul>
  <li>"Много лидов"</li>
  <li>"Хорошие сделки"</li>
  <li>"Надеемся закрыть 5"</li>
</ul>
<p><strong>Почему это плохо:</strong> Нет измеримой цели, нет контроля, нет прогнозирования. Вы просто надеетесь.</p>

<hr />

<h2>Практика 1 – Создание шаблона воронки (15 мин)</h2>
<p>Создайте свой шаблон воронки в Excel или Google Таблицах:</p>

<ol>
  <li><strong>Откройте новую таблицу</strong> и создайте эту структуру:</li>
</ol>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <thead>
    <tr style="background-color: #FAB908; color: #000;">
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Этап</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Дневная цель</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Недельная цель</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Месячная цель</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Конверсия</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>1. Лид</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">20</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">100</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">400</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">100%</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>2. Квалифицированный</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">10</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">50</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">200</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">50%</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>3. Связанный</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">2</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">12</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">48</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">24%</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>4. Заинтересованный</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">4</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">16</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">33%</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>5. Закрыт</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">1</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">4</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">25%</td>
    </tr>
  </tbody>
</table>

<ol start="2">
  <li><strong>Рассчитайте коэффициенты конверсии:</strong> Для каждого этапа определите, какой процент переходит дальше.</li>
  <li><strong>Установите цели:</strong> Начните с закрытий (например, "4 сделки в месяц"), и работайте в обратном направлении.</li>
  <li><strong>Сохраните как шаблон:</strong> Вы будете использовать это каждый день.</li>
</ol>

<h2>Практика 2 – Настройка ежедневного отслеживания (10 мин)</h2>
<p>Создайте простую таблицу ежедневного отслеживания:</p>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <thead>
    <tr style="background-color: #FAB908; color: #000;">
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Дата</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Новые лиды</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Квалифицированные</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Связанные</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Демо</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Закрытые</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">2026-01-22</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0</td>
    </tr>
  </tbody>
</table>

<p><strong>Задача:</strong> Заполняйте эту таблицу каждый день и просматривайте недельные/месячные итоги.</p>

<hr />

<h2>Ключевые выводы</h2>
<ul>
  <li><strong>Воронка = прогнозирование.</strong> Если знаете цифры, знаете, сколько сделок закроете.</li>
  <li><strong>На каждом этапе нужна цель.</strong> Недостаточно фокусироваться только на закрытии – нужна активность на каждом этапе.</li>
  <li><strong>Ежедневное отслеживание = контроль.</strong> Если не измеряете ежедневно, теряете контроль.</li>
  <li><strong>Коэффициенты конверсии меняются.</strong> Измеряйте, улучшайте, оптимизируйте постоянно.</li>
</ul>

<hr />

<h2>Доп. материалы (по желанию)</h2>
<ul>
  <li><strong>HubSpot – Руководство по воронке продаж:</strong> <a href="https://blog.hubspot.com/sales/sales-funnel" target="_blank" rel="noopener noreferrer">https://blog.hubspot.com/sales/sales-funnel</a> – Основы и лучшие практики</li>
  <li><strong>Salesforce – Метрики воронки:</strong> <a href="https://www.salesforce.com/resources/articles/sales-funnel/" target="_blank" rel="noopener noreferrer">https://www.salesforce.com/resources/articles/sales-funnel/</a> – Метрики и KPI</li>
  <li><strong>Harvard Business Review – Метрики продаж:</strong> <a href="https://hbr.org/topic/sales" target="_blank" rel="noopener noreferrer">https://hbr.org/topic/sales</a> – Академический фон</li>
</ul>
      `.trim(),
    },
    emailSubject: {
      hu: '{{courseName}} – 1. nap: Az értékesítési tölcsér alapjai',
      en: '{{courseName}} – Day 1: Sales Funnel Fundamentals',
      ru: '{{courseName}} – День 1: Основы воронки продаж',
    },
    emailBody: {
      hu: `
<h1>{{courseName}}</h1>
<h2>1. nap: Az értékesítési tölcsér alapjai</h2>
<p>Üdvözöllek! Ma megtanulod, hogyan működik az értékesítési tölcsér és miért kritikus a számok követése. Ez a kurzus alapja.</p>
<p><a href="{{appUrl}}/courses/{{courseId}}/day/1">Olvasd el a teljes leckét →</a></p>
      `.trim(),
      en: `
<h1>{{courseName}}</h1>
<h2>Day 1: Sales Funnel Fundamentals</h2>
<p>Welcome! Today you'll learn how sales funnels work and why tracking numbers is critical. This is the foundation of the course.</p>
<p><a href="{{appUrl}}/courses/{{courseId}}/day/1">Read the full lesson →</a></p>
      `.trim(),
      ru: `
<h1>{{courseName}}</h1>
<h2>День 1: Основы воронки продаж</h2>
<p>Добро пожаловать! Сегодня вы узнаете, как работает воронка продаж и почему отслеживание цифр критично. Это основа курса.</p>
<p><a href="{{appUrl}}/courses/{{courseId}}/day/1">Прочитать полный урок →</a></p>
      `.trim(),
    },
    quiz: [
      {
        q: {
          hu: 'Mi az értékesítési tölcsér fő célja?',
          en: 'What is the main purpose of a sales funnel?',
          ru: 'Какова основная цель воронки продаж?',
        },
        options: {
          hu: [
            'Csak a lezárások számolása',
            'A lead-ek tárolása egy helyen',
            'Előrejelzés és kontroll – tudni, hány üzletet fogsz bezárni',
            'Csak a marketing aktivitások követése',
          ],
          en: [
            'Just counting closes',
            'Storing leads in one place',
            'Forecasting and control – knowing how many deals you\'ll close',
            'Just tracking marketing activities',
          ],
          ru: [
            'Просто подсчет закрытий',
            'Хранение лидов в одном месте',
            'Прогнозирование и контроль – знать, сколько сделок вы закроете',
            'Просто отслеживание маркетинговых активностей',
          ],
        },
        correct: 2,
      },
      {
        q: {
          hu: 'Hány fő szintje van egy B2B értékesítési tölcsérnek?',
          en: 'How many main stages does a B2B sales funnel have?',
          ru: 'Сколько основных этапов у воронки B2B продаж?',
        },
        options: {
          hu: ['3 szint', '5 szint', '10 szint', 'Nincs fix szám'],
          en: ['3 stages', '5 stages', '10 stages', 'No fixed number'],
          ru: ['3 этапа', '5 этапов', '10 этапов', 'Нет фиксированного числа'],
        },
        correct: 1,
      },
      {
        q: {
          hu: 'Melyik a helyes sorrend a tölcsérben?',
          en: 'What is the correct order in the funnel?',
          ru: 'Какой правильный порядок в воронке?',
        },
        options: {
          hu: [
            'Lezárás → Lead → Minősített',
            'Lead → Minősített → Kapcsolat → Ajánlat elküldve → Lezárás',
            'Kapcsolat → Lead → Lezárás',
            'Ajánlat elküldve → Lead → Minősített',
          ],
          en: [
            'Closed → Lead → Qualified',
            'Lead → Qualified → Connected → Engaged → Closed',
            'Connected → Lead → Closed',
            'Engaged → Lead → Qualified',
          ],
          ru: [
            'Закрыт → Лид → Квалифицированный',
            'Лид → Квалифицированный → Связанный → Заинтересованный → Закрыт',
            'Связанный → Лид → Закрыт',
            'Заинтересованный → Лид → Квалифицированный',
          ],
        },
        correct: 1,
      },
      {
        q: {
          hu: 'Mi a tipikus konverziós arány Lead-től Lezárásig B2B értékesítésben?',
          en: 'What is the typical conversion rate from Lead to Closed in B2B sales?',
          ru: 'Какой типичный коэффициент конверсии от Лида до Закрытия в B2B продажах?',
        },
        options: {
          hu: ['50%', '10%', '1-2%', '100%'],
          en: ['50%', '10%', '1-2%', '100%'],
          ru: ['50%', '10%', '1-2%', '100%'],
        },
        correct: 2,
      },
      {
        q: {
          hu: 'Miért fontos napi célokat beállítani minden tölcsér szinthez?',
          en: 'Why is it important to set daily targets for every funnel stage?',
          ru: 'Почему важно устанавливать дневные цели для каждого этапа воронки?',
        },
        options: {
          hu: [
            'Csak hogy legyen valami cél',
            'Kontroll és előrejelzés – tudni, hol vagy és mit kell javítani',
            'Csak a vezetőségnek kell',
            'Nem fontos, csak a lezárás számít',
          ],
          en: [
            'Just to have some target',
            'Control and forecasting – knowing where you are and what to improve',
            'Only management needs it',
            'Not important, only closes matter',
          ],
          ru: [
            'Просто чтобы была какая-то цель',
            'Контроль и прогнозирование – знать, где вы находитесь и что улучшить',
            'Только руководству нужно',
            'Не важно, важны только закрытия',
          ],
        },
        correct: 1,
      },
    ],
  },
  // Day 2: Setting KPIs and Targets
  {
    day: 2,
    title: {
      hu: 'KPI-k és célok beállítása – Hogyan számolj visszafelé?',
      en: 'Setting KPIs and Targets – How to Work Backwards',
      ru: 'Установка KPI и целей – Как работать в обратном направлении',
    },
    content: {
      hu: `
<h1>KPI-k és célok beállítása – Hogyan számolj visszafelé?</h1>
<p><em>Ma megtanulod, hogyan állíts be mérhető célokat, amelyek valóban működnek. A kulcs: kezdj a végeredménnyel, és számolj visszafelé.</em></p>
<hr />

<h2>Napi cél</h2>
<ul>
  <li>Megérteni, mi a KPI és miért fontos</li>
  <li>Megtanulni a "visszafelé számolás" módszert</li>
  <li>Beállítani a saját KPI-kat minden tölcsér szinthez</li>
  <li>Létrehozni egy KPI követő táblázatot</li>
</ul>
<hr />

<h2>Miért fontos ez?</h2>
<ul>
  <li><strong>Rossz cél = rossz eredmény.</strong> Ha a célod "sok üzlet", soha nem fogod elérni.</li>
  <li><strong>Visszafelé számolás:</strong> Ha tudod, hány üzletet akarsz bezárni, tudod, hány lead-re van szükséged.</li>
  <li><strong>Mérhetőség:</strong> KPI-k nélkül nem tudod, jól haladsz-e vagy sem.</li>
  <li><strong>Motiváció:</strong> Konkrét számok motiválnak, nem a "reménykedés".</li>
</ul>
<hr />

<h2>Elmagyarázás</h2>

<h3>Mi az a KPI?</h3>
<p><strong>KPI = Key Performance Indicator</strong> (Kulcs Teljesítmény Mutató)</p>
<p>Ez egy mérhető érték, amely megmutatja, mennyire közel vagy a célodhoz.</p>

<p><strong>Példák:</strong></p>
<ul>
  <li>Napi új lead-ek száma</li>
  <li>Heti bemutatók száma</li>
  <li>Havi bezárások száma</li>
  <li>Konverziós arányok (%)</li>
</ul>

<h3>A "visszafelé számolás" módszer</h3>
<p>Ez a legerősebb módszer a célok beállításához:</p>

<ol>
  <li><strong>Kezdj a végeredménnyel:</strong> Hány üzletet akarsz bezárni havonta? (pl. 4 üzlet)</li>
  <li><strong>Számold vissza a konverziós arányokkal:</strong>
    <ul>
      <li>4 lezárás ÷ 25% (Ajánlat elküldve → Lezárás) = 16 ajánlat kell</li>
      <li>16 ajánlat ÷ 33% (Kapcsolat → Ajánlat elküldve) = 48 kapcsolat kell</li>
      <li>48 kapcsolat ÷ 24% (Minősített → Kapcsolat) = 200 minősített kell</li>
      <li>200 minősített ÷ 50% (Lead → Minősített) = 400 lead kell</li>
    </ul>
  </li>
  <li><strong>Bontsd le napi/heti célokra:</strong>
    <ul>
      <li>400 lead ÷ 20 munkanap = 20 lead/nap</li>
      <li>48 kapcsolat ÷ 4 hét = 12 kapcsolat/hét</li>
    </ul>
  </li>
</ol>

<h3>KPI-k beállítása minden szinthez</h3>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <thead>
    <tr style="background-color: #FAB908; color: #000;">
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Szint</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">KPI</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Napi cél</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Havi cél</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>Lead</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">Új lead-ek száma</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">20</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">400</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>Minősített</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">Minősített lead-ek száma</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">10</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">200</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>Kapcsolat</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">Első beszélgetések száma</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">2</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">48</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>Ajánlat elküldve</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">Bemutatók száma</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">16</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>Lezárás</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">Lezárt üzletek száma</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">4</td>
    </tr>
  </tbody>
</table>

<hr />

<h2>Példák</h2>

<h3>Jó példa: Konkrét KPI-k</h3>
<p><strong>Havi cél: 4 lezárás</strong></p>
<ul>
  <li>Napi 20 új lead (LinkedIn, email, weboldal)</li>
  <li>Heti 12 kapcsolat (telefon, email válasz)</li>
  <li>Havi 16 bemutató (demo, ajánlat)</li>
  <li>Havi 4 lezárás</li>
</ul>
<p><strong>Miért jó:</strong> Minden KPI mérhető, konkrét, és összefügg a végeredménnyel.</p>

<h3>Rossz példa: Homályos célok</h3>
<p><strong>Havi cél: "Sok üzlet"</strong></p>
<ul>
  <li>"Több lead"</li>
  <li>"Jó kapcsolatok"</li>
  <li>"Remélem, lezárunk néhányat"</li>
</ul>
<p><strong>Miért rossz:</strong> Nincs mérhető KPI, nincs kontroll, nincs előrejelzés.</p>

<hr />

<h2>Gyakorlat 1 – Visszafelé számolás (20 perc)</h2>
<ol>
  <li><strong>Állíts be egy havi lezárási célt:</strong> Mennyit akarsz lezárni? (pl. 4 üzlet)</li>
  <li><strong>Használd a konverziós arányokat:</strong>
    <ul>
      <li>Ajánlat elküldve → Lezárás: 25%</li>
      <li>Kapcsolat → Ajánlat elküldve: 33%</li>
      <li>Minősített → Kapcsolat: 24%</li>
      <li>Lead → Minősített: 50%</li>
    </ul>
  </li>
  <li><strong>Számold vissza:</strong> Mennyi lead, minősített, kapcsolat, engedélyezett kell?</li>
  <li><strong>Bontsd le napi/heti célokra:</strong> Mennyi kell naponta/hetente?</li>
</ol>

<h2>Gyakorlat 2 – KPI követő táblázat (15 perc)</h2>
<p>Hozz létre egy KPI követő táblázatot:</p>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <thead>
    <tr style="background-color: #FAB908; color: #000;">
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">KPI</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Cél</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Tényleges</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">%</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">Napi új lead</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">20</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0%</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">Havi lezárás</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">4</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0%</td>
    </tr>
  </tbody>
</table>

<p><strong>Feladat:</strong> Töltsd ki ezt a táblázatot minden nap, és nézd meg, hol vagy a célhoz képest.</p>

<hr />

<h2>Kulcs tanulságok</h2>
<ul>
  <li><strong>Kezdj a végeredménnyel.</strong> Ha tudod, hány üzletet akarsz, tudod, hány lead-re van szükséged.</li>
  <li><strong>Minden szinten kell KPI.</strong> Nem elég csak a lezárásra koncentrálni.</li>
  <li><strong>Napi követés = kontroll.</strong> Ha nem méred naponta, elveszíted a kontrollt.</li>
  <li><strong>Állítsd be újra, ha kell.</strong> Ha a konverziós arányok változnak, módosítsd a KPI-kat.</li>
</ul>

<hr />

<h2>További anyagok (választható)</h2>
<ul>
  <li><strong>SMART Goals Framework:</strong> <a href="https://www.mindtools.com/pages/article/smart-goals.htm" target="_blank" rel="noopener noreferrer">https://www.mindtools.com/pages/article/smart-goals.htm</a> – Hogyan állíts be mérhető célokat</li>
  <li><strong>Salesforce – Sales KPIs:</strong> <a href="https://www.salesforce.com/resources/articles/sales-kpis/" target="_blank" rel="noopener noreferrer">https://www.salesforce.com/resources/articles/sales-kpis/</a> – Melyik KPI-k számítanak</li>
  <li><strong>HubSpot – Sales Metrics:</strong> <a href="https://blog.hubspot.com/sales/sales-metrics" target="_blank" rel="noopener noreferrer">https://blog.hubspot.com/sales/sales-metrics</a> – Teljes KPI lista</li>
</ul>
      `.trim(),
      en: `
<h1>Setting KPIs and Targets – How to Work Backwards</h1>
<p><em>Today you'll learn how to set measurable targets that actually work. The key: start with the end result and work backwards.</em></p>
<hr />

<h2>Daily Goal</h2>
<ul>
  <li>Understand what a KPI is and why it matters</li>
  <li>Learn the "work backwards" method</li>
  <li>Set your own KPIs for every funnel stage</li>
  <li>Create a KPI tracking table</li>
</ul>
<hr />

<h2>Why it matters</h2>
<ul>
  <li><strong>Bad target = bad result.</strong> If your target is "many deals", you'll never achieve it.</li>
  <li><strong>Work backwards:</strong> If you know how many deals you want to close, you know how many leads you need.</li>
  <li><strong>Measurability:</strong> Without KPIs, you don't know if you're doing well or not.</li>
  <li><strong>Motivation:</strong> Concrete numbers motivate, not "hoping".</li>
</ul>
<hr />

<h2>Explanation</h2>

<h3>What is a KPI?</h3>
<p><strong>KPI = Key Performance Indicator</strong></p>
<p>This is a measurable value that shows how close you are to your goal.</p>

<p><strong>Examples:</strong></p>
<ul>
  <li>Daily new leads count</li>
  <li>Weekly demos count</li>
  <li>Monthly closes count</li>
  <li>Conversion rates (%)</li>
</ul>

<h3>The "work backwards" method</h3>
<p>This is the most powerful method for setting targets:</p>

<ol>
  <li><strong>Start with the end result:</strong> How many deals do you want to close monthly? (e.g., 4 deals)</li>
  <li><strong>Work backwards with conversion rates:</strong>
    <ul>
      <li>4 closes ÷ 25% (Engaged → Closed) = 16 engaged needed</li>
      <li>16 engaged ÷ 33% (Connected → Engaged) = 48 connected needed</li>
      <li>48 connected ÷ 24% (Qualified → Connected) = 200 qualified needed</li>
      <li>200 qualified ÷ 50% (Lead → Qualified) = 400 leads needed</li>
    </ul>
  </li>
  <li><strong>Break down into daily/weekly targets:</strong>
    <ul>
      <li>400 leads ÷ 20 workdays = 20 leads/day</li>
      <li>48 connected ÷ 4 weeks = 12 connected/week</li>
    </ul>
  </li>
</ol>

<h3>Setting KPIs for every stage</h3>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <thead>
    <tr style="background-color: #FAB908; color: #000;">
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Stage</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">KPI</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Daily Target</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Monthly Target</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>Lead</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">New leads count</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">20</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">400</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>Qualified</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">Qualified leads count</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">10</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">200</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>Connected</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">First conversations count</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">2</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">48</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>Engaged</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">Demos count</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">16</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>Closed</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">Closed deals count</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">4</td>
    </tr>
  </tbody>
</table>

<hr />

<h2>Examples</h2>

<h3>Good example: Concrete KPIs</h3>
<p><strong>Monthly target: 4 closes</strong></p>
<ul>
  <li>Daily 20 new leads (LinkedIn, email, website)</li>
  <li>Weekly 12 connected (phone, email response)</li>
  <li>Monthly 16 demos (demo, proposal)</li>
  <li>Monthly 4 closes</li>
</ul>
<p><strong>Why it's good:</strong> Every KPI is measurable, concrete, and connected to the end result.</p>

<h3>Bad example: Vague targets</h3>
<p><strong>Monthly target: "Many deals"</strong></p>
<ul>
  <li>"More leads"</li>
  <li>"Good connections"</li>
  <li>"Hope we close some"</li>
</ul>
<p><strong>Why it's bad:</strong> No measurable KPI, no control, no forecasting.</p>

<hr />

<h2>Practice 1 – Work backwards (20 min)</h2>
<ol>
  <li><strong>Set a monthly closing target:</strong> How many do you want to close? (e.g., 4 deals)</li>
  <li><strong>Use conversion rates:</strong>
    <ul>
      <li>Engaged → Closed: 25%</li>
      <li>Connected → Engaged: 33%</li>
      <li>Qualified → Connected: 24%</li>
      <li>Lead → Qualified: 50%</li>
    </ul>
  </li>
  <li><strong>Work backwards:</strong> How many leads, qualified, connected, engaged do you need?</li>
  <li><strong>Break down into daily/weekly targets:</strong> How much do you need daily/weekly?</li>
</ol>

<h2>Practice 2 – KPI tracking table (15 min)</h2>
<p>Create a KPI tracking table:</p>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <thead>
    <tr style="background-color: #FAB908; color: #000;">
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">KPI</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Target</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Actual</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">%</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">Daily new leads</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">20</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0%</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">Monthly closes</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">4</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0%</td>
    </tr>
  </tbody>
</table>

<p><strong>Task:</strong> Fill this table every day and see where you are relative to your target.</p>

<hr />

<h2>Key Takeaways</h2>
<ul>
  <li><strong>Start with the end result.</strong> If you know how many deals you want, you know how many leads you need.</li>
  <li><strong>Every stage needs a KPI.</strong> It's not enough to focus only on closing.</li>
  <li><strong>Daily tracking = control.</strong> If you don't measure daily, you lose control.</li>
  <li><strong>Adjust if needed.</strong> If conversion rates change, update your KPIs.</li>
</ul>

<hr />

<h2>Optional Resources</h2>
<ul>
  <li><strong>SMART Goals Framework:</strong> <a href="https://www.mindtools.com/pages/article/smart-goals.htm" target="_blank" rel="noopener noreferrer">https://www.mindtools.com/pages/article/smart-goals.htm</a> – How to set measurable goals</li>
  <li><strong>Salesforce – Sales KPIs:</strong> <a href="https://www.salesforce.com/resources/articles/sales-kpis/" target="_blank" rel="noopener noreferrer">https://www.salesforce.com/resources/articles/sales-kpis/</a> – Which KPIs matter</li>
  <li><strong>HubSpot – Sales Metrics:</strong> <a href="https://blog.hubspot.com/sales/sales-metrics" target="_blank" rel="noopener noreferrer">https://blog.hubspot.com/sales/sales-metrics</a> – Complete KPI list</li>
</ul>
      `.trim(),
      ru: `
<h1>Установка KPI и целей – Как работать в обратном направлении</h1>
<p><em>Сегодня вы узнаете, как устанавливать измеримые цели, которые действительно работают. Ключ: начните с конечного результата и работайте в обратном направлении.</em></p>
<hr />

<h2>Цель дня</h2>
<ul>
  <li>Понять, что такое KPI и почему это важно</li>
  <li>Изучить метод "работы в обратном направлении"</li>
  <li>Установить свои KPI для каждого этапа воронки</li>
  <li>Создать таблицу отслеживания KPI</li>
</ul>
<hr />

<h2>Почему это важно</h2>
<ul>
  <li><strong>Плохая цель = плохой результат.</strong> Если ваша цель "много сделок", вы никогда её не достигнете.</li>
  <li><strong>Работа в обратном направлении:</strong> Если знаете, сколько сделок хотите закрыть, знаете, сколько лидов вам нужно.</li>
  <li><strong>Измеримость:</strong> Без KPI вы не знаете, хорошо ли вы работаете или нет.</li>
  <li><strong>Мотивация:</strong> Конкретные цифры мотивируют, а не "надежда".</li>
</ul>
<hr />

<h2>Объяснение</h2>

<h3>Что такое KPI?</h3>
<p><strong>KPI = Key Performance Indicator</strong> (Ключевой показатель эффективности)</p>
<p>Это измеримое значение, которое показывает, насколько вы близки к своей цели.</p>

<p><strong>Примеры:</strong></p>
<ul>
  <li>Количество новых лидов в день</li>
  <li>Количество демо в неделю</li>
  <li>Количество закрытий в месяц</li>
  <li>Коэффициенты конверсии (%)</li>
</ul>

<h3>Метод "работы в обратном направлении"</h3>
<p>Это самый мощный метод для установки целей:</p>

<ol>
  <li><strong>Начните с конечного результата:</strong> Сколько сделок вы хотите закрыть в месяц? (например, 4 сделки)</li>
  <li><strong>Работайте в обратном направлении с коэффициентами конверсии:</strong>
    <ul>
      <li>4 закрытия ÷ 25% (Заинтересованный → Закрыт) = нужно 16 заинтересованных</li>
      <li>16 заинтересованных ÷ 33% (Связанный → Заинтересованный) = нужно 48 связанных</li>
      <li>48 связанных ÷ 24% (Квалифицированный → Связанный) = нужно 200 квалифицированных</li>
      <li>200 квалифицированных ÷ 50% (Лид → Квалифицированный) = нужно 400 лидов</li>
    </ul>
  </li>
  <li><strong>Разбейте на дневные/недельные цели:</strong>
    <ul>
      <li>400 лидов ÷ 20 рабочих дней = 20 лидов/день</li>
      <li>48 связанных ÷ 4 недели = 12 связанных/неделю</li>
    </ul>
  </li>
</ol>

<h3>Установка KPI для каждого этапа</h3>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <thead>
    <tr style="background-color: #FAB908; color: #000;">
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Этап</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">KPI</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Дневная цель</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Месячная цель</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>Лид</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">Количество новых лидов</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">20</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">400</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>Квалифицированный</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">Количество квалифицированных лидов</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">10</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">200</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>Связанный</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">Количество первых разговоров</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">2</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">48</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>Заинтересованный</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">Количество демо</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">16</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>Закрыт</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">Количество закрытых сделок</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">4</td>
    </tr>
  </tbody>
</table>

<hr />

<h2>Примеры</h2>

<h3>Хороший пример: Конкретные KPI</h3>
<p><strong>Месячная цель: 4 закрытия</strong></p>
<ul>
  <li>20 новых лидов в день (LinkedIn, email, сайт)</li>
  <li>12 связанных в неделю (телефон, ответ на email)</li>
  <li>16 демо в месяц (демо, предложение)</li>
  <li>4 закрытия в месяц</li>
</ul>
<p><strong>Почему это хорошо:</strong> Каждый KPI измерим, конкретен и связан с конечным результатом.</p>

<h3>Плохой пример: Размытые цели</h3>
<p><strong>Месячная цель: "Много сделок"</strong></p>
<ul>
  <li>"Больше лидов"</li>
  <li>"Хорошие связи"</li>
  <li>"Надеемся закрыть несколько"</li>
</ul>
<p><strong>Почему это плохо:</strong> Нет измеримого KPI, нет контроля, нет прогнозирования.</p>

<hr />

<h2>Практика 1 – Работа в обратном направлении (20 мин)</h2>
<ol>
  <li><strong>Установите месячную цель закрытия:</strong> Сколько вы хотите закрыть? (например, 4 сделки)</li>
  <li><strong>Используйте коэффициенты конверсии:</strong>
    <ul>
      <li>Заинтересованный → Закрыт: 25%</li>
      <li>Связанный → Заинтересованный: 33%</li>
      <li>Квалифицированный → Связанный: 24%</li>
      <li>Лид → Квалифицированный: 50%</li>
    </ul>
  </li>
  <li><strong>Работайте в обратном направлении:</strong> Сколько лидов, квалифицированных, связанных, заинтересованных вам нужно?</li>
  <li><strong>Разбейте на дневные/недельные цели:</strong> Сколько вам нужно ежедневно/еженедельно?</li>
</ol>

<h2>Практика 2 – Таблица отслеживания KPI (15 мин)</h2>
<p>Создайте таблицу отслеживания KPI:</p>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <thead>
    <tr style="background-color: #FAB908; color: #000;">
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">KPI</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Цель</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Фактическое</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">%</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">Новые лиды в день</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">20</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0%</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">Закрытия в месяц</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">4</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0%</td>
    </tr>
  </tbody>
</table>

<p><strong>Задача:</strong> Заполняйте эту таблицу каждый день и смотрите, где вы находитесь относительно цели.</p>

<hr />

<h2>Ключевые выводы</h2>
<ul>
  <li><strong>Начните с конечного результата.</strong> Если знаете, сколько сделок хотите, знаете, сколько лидов вам нужно.</li>
  <li><strong>На каждом этапе нужен KPI.</strong> Недостаточно фокусироваться только на закрытии.</li>
  <li><strong>Ежедневное отслеживание = контроль.</strong> Если не измеряете ежедневно, теряете контроль.</li>
  <li><strong>Корректируйте при необходимости.</strong> Если коэффициенты конверсии меняются, обновите свои KPI.</li>
</ul>

<hr />

<h2>Доп. материалы (по желанию)</h2>
<ul>
  <li><strong>SMART Goals Framework:</strong> <a href="https://www.mindtools.com/pages/article/smart-goals.htm" target="_blank" rel="noopener noreferrer">https://www.mindtools.com/pages/article/smart-goals.htm</a> – Как устанавливать измеримые цели</li>
  <li><strong>Salesforce – Sales KPIs:</strong> <a href="https://www.salesforce.com/resources/articles/sales-kpis/" target="_blank" rel="noopener noreferrer">https://www.salesforce.com/resources/articles/sales-kpis/</a> – Какие KPI важны</li>
  <li><strong>HubSpot – Sales Metrics:</strong> <a href="https://blog.hubspot.com/sales/sales-metrics" target="_blank" rel="noopener noreferrer">https://blog.hubspot.com/sales/sales-metrics</a> – Полный список KPI</li>
</ul>
      `.trim(),
    },
    emailSubject: {
      hu: '{{courseName}} – 2. nap: KPI-k és célok beállítása',
      en: '{{courseName}} – Day 2: Setting KPIs and Targets',
      ru: '{{courseName}} – День 2: Установка KPI и целей',
    },
    emailBody: {
      hu: `
<h1>{{courseName}}</h1>
<h2>2. nap: KPI-k és célok beállítása</h2>
<p>Ma megtanulod, hogyan állíts be mérhető célokat, amelyek valóban működnek. A kulcs: kezdj a végeredménnyel, és számolj visszafelé.</p>
<p><a href="{{appUrl}}/courses/{{courseId}}/day/2">Olvasd el a teljes leckét →</a></p>
      `.trim(),
      en: `
<h1>{{courseName}}</h1>
<h2>Day 2: Setting KPIs and Targets</h2>
<p>Today you'll learn how to set measurable targets that actually work. The key: start with the end result and work backwards.</p>
<p><a href="{{appUrl}}/courses/{{courseId}}/day/2">Read the full lesson →</a></p>
      `.trim(),
      ru: `
<h1>{{courseName}}</h1>
<h2>День 2: Установка KPI и целей</h2>
<p>Сегодня вы узнаете, как устанавливать измеримые цели, которые действительно работают. Ключ: начните с конечного результата и работайте в обратном направлении.</p>
<p><a href="{{appUrl}}/courses/{{courseId}}/day/2">Прочитать полный урок →</a></p>
      `.trim(),
    },
    quiz: [
      {
        q: {
          hu: 'Mi a KPI?',
          en: 'What is a KPI?',
          ru: 'Что такое KPI?',
        },
        options: {
          hu: [
            'Egy tetszőleges szám',
            'Key Performance Indicator – mérhető érték, amely megmutatja, mennyire közel vagy a célodhoz',
            'Csak a lezárások száma',
            'Nem fontos',
          ],
          en: [
            'Any random number',
            'Key Performance Indicator – a measurable value that shows how close you are to your goal',
            'Just the number of closes',
            'Not important',
          ],
          ru: [
            'Любое случайное число',
            'Key Performance Indicator – измеримое значение, которое показывает, насколько вы близки к своей цели',
            'Просто количество закрытий',
            'Не важно',
          ],
        },
        correct: 1,
      },
      {
        q: {
          hu: 'Mi a "visszafelé számolás" módszer lényege?',
          en: 'What is the essence of the "work backwards" method?',
          ru: 'В чем суть метода "работы в обратном направлении"?',
        },
        options: {
          hu: [
            'Kezdj a lead-ekkel és számolj előre',
            'Kezdj a végeredménnyel (pl. lezárások) és számolj visszafelé a lead-ekig',
            'Csak a lezárásokra koncentrálj',
            'Ne számolj semmit',
          ],
          en: [
            'Start with leads and work forward',
            'Start with the end result (e.g., closes) and work backwards to leads',
            'Just focus on closes',
            'Don\'t count anything',
          ],
          ru: [
            'Начните с лидов и работайте вперед',
            'Начните с конечного результата (например, закрытия) и работайте в обратном направлении к лидам',
            'Просто фокусируйтесь на закрытиях',
            'Ничего не считайте',
          ],
        },
        correct: 1,
      },
      {
        q: {
          hu: 'Ha 4 lezárást akarsz havonta, és a konverziós arányok: Ajánlat elküldve → Lezárás 25%, Kapcsolat → Ajánlat elküldve 33%, Minősített → Kapcsolat 24%, Lead → Minősített 50%, hány lead-re van szükséged?',
          en: 'If you want 4 closes monthly, and conversion rates are: Engaged → Closed 25%, Connected → Engaged 33%, Qualified → Connected 24%, Lead → Qualified 50%, how many leads do you need?',
          ru: 'Если вы хотите 4 закрытия в месяц, и коэффициенты конверсии: Заинтересованный → Закрыт 25%, Связанный → Заинтересованный 33%, Квалифицированный → Связанный 24%, Лид → Квалифицированный 50%, сколько лидов вам нужно?',
        },
        options: {
          hu: ['100', '200', '400', '800'],
          en: ['100', '200', '400', '800'],
          ru: ['100', '200', '400', '800'],
        },
        correct: 2,
      },
      {
        q: {
          hu: 'Miért fontos minden tölcsér szinten KPI-t beállítani?',
          en: 'Why is it important to set KPIs for every funnel stage?',
          ru: 'Почему важно устанавливать KPI для каждого этапа воронки?',
        },
        options: {
          hu: [
            'Csak a lezárás számít',
            'Kontroll és előrejelzés – tudni, hol vagy és mit kell javítani minden szinten',
            'Csak a vezetőségnek kell',
            'Nem fontos',
          ],
          en: [
            'Only closes matter',
            'Control and forecasting – knowing where you are and what to improve at every stage',
            'Only management needs it',
            'Not important',
          ],
          ru: [
            'Важны только закрытия',
            'Контроль и прогнозирование – знать, где вы находитесь и что улучшить на каждом этапе',
            'Только руководству нужно',
            'Не важно',
          ],
        },
        correct: 1,
      },
      {
        q: {
          hu: 'Hogyan bontod le a havi célokat napi célokra?',
          en: 'How do you break down monthly targets into daily targets?',
          ru: 'Как вы разбиваете месячные цели на дневные цели?',
        },
        options: {
          hu: [
            'Oszd el a havi célt a munkanapok számával',
            'Csak a havi cél számít',
            'Ne bontsd le',
            'Oszd el 30-cal',
          ],
          en: [
            'Divide the monthly target by the number of workdays',
            'Only the monthly target matters',
            'Don\'t break it down',
            'Divide by 30',
          ],
          ru: [
            'Разделите месячную цель на количество рабочих дней',
            'Важна только месячная цель',
            'Не разбивайте',
            'Разделите на 30',
          ],
        },
        correct: 0,
      },
    ],
  },
  // Day 3: Multi-Channel Lead Generation
  {
    day: 3,
    title: {
      hu: 'Többcsatornás lead generálás – Hol találod meg az ügyfeleket?',
      en: 'Multi-Channel Lead Generation – Where Do You Find Customers?',
      ru: 'Многоканальная генерация лидов – Где найти клиентов?',
    },
    content: {
      hu: `
<h1>Többcsatornás lead generálás – Hol találod meg az ügyfeleket?</h1>
<p><em>Ma megtanulod, hogyan generálsz lead-eket több csatornán keresztül. A kulcs: ne egy csatornára támaszkodj – diversifikálj!</em></p>
<hr />

<h2>Napi cél</h2>
<ul>
  <li>Megérteni a lead generálás 5 fő csatornáját</li>
  <li>Beállítani napi célokat minden csatornához</li>
  <li>Létrehozni egy lead forrás követő táblázatot</li>
  <li>Kiválasztani 2-3 prioritás csatornát a saját üzletedhez</li>
</ul>
<hr />

<h2>Miért fontos ez?</h2>
<ul>
  <li><strong>Egy csatorna = kockázat.</strong> Ha csak LinkedIn-re támaszkodsz, és az leáll, nincs lead.</li>
  <li><strong>Diversifikáció:</strong> Több csatorna = stabil lead flow, még akkor is, ha egy csatorna lelassul.</li>
  <li><strong>Költséghatékonyság:</strong> Néhány csatorna ingyenes vagy alacsony költségű.</li>
  <li><strong>Skálázhatóság:</strong> Ha egy csatorna jól működik, növelheted a volumenét.</li>
</ul>
<hr />

<h2>Elmagyarázás</h2>

<h3>A lead generálás 5 fő csatornája</h3>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <thead>
    <tr style="background-color: #FAB908; color: #000;">
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Csatorna</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Mit jelent</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Példa</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Költség</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>1. Cold Outreach</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Közvetlen kapcsolatfelvétel ismeretlen ügyfelekkel</td>
      <td style="padding: 12px; border: 1px solid #ddd;">LinkedIn üzenet, hideg email, telefonhívás</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">Alacsony</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>2. CRM/Referral</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Meglévő kapcsolatok és ajánlások</td>
      <td style="padding: 12px; border: 1px solid #ddd;">Ügyfél ajánlás, partner hálózat, korábbi lead-ek újraaktiválása</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">Nagyon alacsony</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>3. Email Marketing (eDM)</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Email kampányok és hírlevelek</td>
      <td style="padding: 12px; border: 1px solid #ddd;">Hírlevél, termék bemutató, case study küldése</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">Alacsony</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>4. Distributors/Partners</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Partner hálózat és értékesítők</td>
      <td style="padding: 12px; border: 1px solid #ddd;">Partner ajánlás, értékesítői hálózat, integrációk</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">Közepes</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>5. Inbound/Content</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Weboldal, SEO, tartalom marketing</td>
      <td style="padding: 12px; border: 1px solid #ddd;">Weboldal űrlap, blog, whitepaper letöltés</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">Közepes-Magas</td>
    </tr>
  </tbody>
</table>

<h3>Hogyan oszd el a lead generálást?</h3>
<p><strong>Jó példa – Diversifikált mix:</strong></p>
<ul>
  <li>40% Cold Outreach (LinkedIn, email)</li>
  <li>20% CRM/Referral (meglévő kapcsolatok)</li>
  <li>20% Email Marketing (hírlevelek)</li>
  <li>15% Partners (distributors)</li>
  <li>5% Inbound (weboldal, SEO)</li>
</ul>

<p><strong>Rossz példa – Egy csatorna:</strong></p>
<ul>
  <li>100% LinkedIn</li>
  <li>0% más csatorna</li>
</ul>
<p><strong>Miért rossz:</strong> Ha LinkedIn leáll vagy változik, nincs lead.</p>

<hr />

<h2>Gyakorlat 1 – Lead forrás követő táblázat (20 perc)</h2>
<p>Hozz létre egy táblázatot, amely követi, honnan jönnek a lead-ek:</p>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <thead>
    <tr style="background-color: #FAB908; color: #000;">
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Csatorna</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Napi cél</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Tényleges</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Konverzió</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">Cold Outreach</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">8</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0%</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">CRM/Referral</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">4</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0%</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">Email Marketing</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">4</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0%</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">Partners</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">3</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0%</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">Inbound</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">1</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0%</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>Összesen</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;"><strong>20</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;"><strong>0</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;"><strong>0%</strong></td>
    </tr>
  </tbody>
</table>

<h2>Gyakorlat 2 – Prioritás csatornák kiválasztása (15 perc)</h2>
<ol>
  <li><strong>Írd le a 3 legfontosabb csatornát</strong> a saját üzletedhez</li>
  <li><strong>Állíts be napi célokat</strong> mindháromhoz</li>
  <li><strong>Írd le, hogyan fogod elindítani</strong> minden csatornát (konkrét lépések)</li>
</ol>

<hr />

<h2>Kulcs tanulságok</h2>
<ul>
  <li><strong>Diversifikáció = stabilitás.</strong> Ne támaszkodj egy csatornára.</li>
  <li><strong>Mérj minden csatornát.</strong> Tudni kell, melyik működik és melyik nem.</li>
  <li><strong>Kezdj 2-3 csatornával.</strong> Ne próbálj mindent egyszerre.</li>
  <li><strong>Skálázd a működőket.</strong> Ha egy csatorna jól működik, növeld a volumenét.</li>
</ul>

<hr />

<h2>További anyagok (választható)</h2>
<ul>
  <li><strong>HubSpot – Lead Generation:</strong> <a href="https://blog.hubspot.com/marketing/lead-generation" target="_blank" rel="noopener noreferrer">https://blog.hubspot.com/marketing/lead-generation</a> – Lead generálás alapok</li>
  <li><strong>Salesforce – Multi-Channel Strategy:</strong> <a href="https://www.salesforce.com/resources/articles/multi-channel-sales/" target="_blank" rel="noopener noreferrer">https://www.salesforce.com/resources/articles/multi-channel-sales/</a> – Többcsatornás stratégia</li>
</ul>
      `.trim(),
      en: `
<h1>Multi-Channel Lead Generation – Where Do You Find Customers?</h1>
<p><em>Today you'll learn how to generate leads across multiple channels. The key: don't rely on one channel – diversify!</em></p>
<hr />

<h2>Daily Goal</h2>
<ul>
  <li>Understand the 5 main lead generation channels</li>
  <li>Set daily targets for each channel</li>
  <li>Create a lead source tracking table</li>
  <li>Select 2-3 priority channels for your business</li>
</ul>
<hr />

<h2>Why it matters</h2>
<ul>
  <li><strong>One channel = risk.</strong> If you only rely on LinkedIn and it stops working, you have no leads.</li>
  <li><strong>Diversification:</strong> Multiple channels = stable lead flow, even if one channel slows down.</li>
  <li><strong>Cost efficiency:</strong> Some channels are free or low-cost.</li>
  <li><strong>Scalability:</strong> If a channel works well, you can increase its volume.</li>
</ul>
<hr />

<h2>Explanation</h2>

<h3>The 5 main lead generation channels</h3>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <thead>
    <tr style="background-color: #FAB908; color: #000;">
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Channel</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">What it means</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Example</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Cost</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>1. Cold Outreach</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Direct contact with unknown customers</td>
      <td style="padding: 12px; border: 1px solid #ddd;">LinkedIn message, cold email, phone call</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">Low</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>2. CRM/Referral</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Existing contacts and referrals</td>
      <td style="padding: 12px; border: 1px solid #ddd;">Customer referral, partner network, reactivating old leads</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">Very Low</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>3. Email Marketing (eDM)</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Email campaigns and newsletters</td>
      <td style="padding: 12px; border: 1px solid #ddd;">Newsletter, product demo, case study send</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">Low</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>4. Distributors/Partners</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Partner network and resellers</td>
      <td style="padding: 12px; border: 1px solid #ddd;">Partner referral, reseller network, integrations</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">Medium</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>5. Inbound/Content</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Website, SEO, content marketing</td>
      <td style="padding: 12px; border: 1px solid #ddd;">Website form, blog, whitepaper download</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">Medium-High</td>
    </tr>
  </tbody>
</table>

<h3>How to split lead generation?</h3>
<p><strong>Good example – Diversified mix:</strong></p>
<ul>
  <li>40% Cold Outreach (LinkedIn, email)</li>
  <li>20% CRM/Referral (existing contacts)</li>
  <li>20% Email Marketing (newsletters)</li>
  <li>15% Partners (distributors)</li>
  <li>5% Inbound (website, SEO)</li>
</ul>

<p><strong>Bad example – One channel:</strong></p>
<ul>
  <li>100% LinkedIn</li>
  <li>0% other channels</li>
</ul>
<p><strong>Why it's bad:</strong> If LinkedIn stops working or changes, you have no leads.</p>

<hr />

<h2>Practice 1 – Lead source tracking table (20 min)</h2>
<p>Create a table that tracks where leads come from:</p>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <thead>
    <tr style="background-color: #FAB908; color: #000;">
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Channel</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Daily Target</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Actual</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Conversion</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">Cold Outreach</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">8</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0%</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">CRM/Referral</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">4</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0%</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">Email Marketing</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">4</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0%</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">Partners</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">3</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0%</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">Inbound</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">1</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0%</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>Total</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;"><strong>20</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;"><strong>0</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;"><strong>0%</strong></td>
    </tr>
  </tbody>
</table>

<h2>Practice 2 – Select priority channels (15 min)</h2>
<ol>
  <li><strong>Write down the 3 most important channels</strong> for your business</li>
  <li><strong>Set daily targets</strong> for all three</li>
  <li><strong>Write down how you'll start</strong> each channel (concrete steps)</li>
</ol>

<hr />

<h2>Key Takeaways</h2>
<ul>
  <li><strong>Diversification = stability.</strong> Don't rely on one channel.</li>
  <li><strong>Measure every channel.</strong> You need to know which works and which doesn't.</li>
  <li><strong>Start with 2-3 channels.</strong> Don't try everything at once.</li>
  <li><strong>Scale what works.</strong> If a channel works well, increase its volume.</li>
</ul>

<hr />

<h2>Optional Resources</h2>
<ul>
  <li><strong>HubSpot – Lead Generation:</strong> <a href="https://blog.hubspot.com/marketing/lead-generation" target="_blank" rel="noopener noreferrer">https://blog.hubspot.com/marketing/lead-generation</a> – Lead generation fundamentals</li>
  <li><strong>Salesforce – Multi-Channel Strategy:</strong> <a href="https://www.salesforce.com/resources/articles/multi-channel-sales/" target="_blank" rel="noopener noreferrer">https://www.salesforce.com/resources/articles/multi-channel-sales/</a> – Multi-channel strategy</li>
</ul>
      `.trim(),
      ru: `
<h1>Многоканальная генерация лидов – Где найти клиентов?</h1>
<p><em>Сегодня вы узнаете, как генерировать лиды через несколько каналов. Ключ: не полагайтесь на один канал – диверсифицируйте!</em></p>
<hr />

<h2>Цель дня</h2>
<ul>
  <li>Понять 5 основных каналов генерации лидов</li>
  <li>Установить дневные цели для каждого канала</li>
  <li>Создать таблицу отслеживания источников лидов</li>
  <li>Выбрать 2-3 приоритетных канала для вашего бизнеса</li>
</ul>
<hr />

<h2>Почему это важно</h2>
<ul>
  <li><strong>Один канал = риск.</strong> Если полагаетесь только на LinkedIn и он перестает работать, у вас нет лидов.</li>
  <li><strong>Диверсификация:</strong> Несколько каналов = стабильный поток лидов, даже если один канал замедляется.</li>
  <li><strong>Эффективность затрат:</strong> Некоторые каналы бесплатны или имеют низкую стоимость.</li>
  <li><strong>Масштабируемость:</strong> Если канал работает хорошо, вы можете увеличить его объем.</li>
</ul>
<hr />

<h2>Объяснение</h2>

<h3>5 основных каналов генерации лидов</h3>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <thead>
    <tr style="background-color: #FAB908; color: #000;">
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Канал</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Что означает</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Пример</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Стоимость</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>1. Cold Outreach</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Прямой контакт с неизвестными клиентами</td>
      <td style="padding: 12px; border: 1px solid #ddd;">Сообщение в LinkedIn, холодный email, телефонный звонок</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">Низкая</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>2. CRM/Referral</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Существующие контакты и рекомендации</td>
      <td style="padding: 12px; border: 1px solid #ddd;">Рекомендация клиента, партнерская сеть, реактивация старых лидов</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">Очень низкая</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>3. Email Marketing (eDM)</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Email кампании и рассылки</td>
      <td style="padding: 12px; border: 1px solid #ddd;">Рассылка, демо продукта, отправка кейса</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">Низкая</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>4. Distributors/Partners</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Партнерская сеть и реселлеры</td>
      <td style="padding: 12px; border: 1px solid #ddd;">Партнерская рекомендация, сеть реселлеров, интеграции</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">Средняя</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>5. Inbound/Content</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Сайт, SEO, контент-маркетинг</td>
      <td style="padding: 12px; border: 1px solid #ddd;">Форма на сайте, блог, загрузка whitepaper</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">Средняя-Высокая</td>
    </tr>
  </tbody>
</table>

<h3>Как распределить генерацию лидов?</h3>
<p><strong>Хороший пример – Диверсифицированная смесь:</strong></p>
<ul>
  <li>40% Cold Outreach (LinkedIn, email)</li>
  <li>20% CRM/Referral (существующие контакты)</li>
  <li>20% Email Marketing (рассылки)</li>
  <li>15% Partners (дистрибьюторы)</li>
  <li>5% Inbound (сайт, SEO)</li>
</ul>

<p><strong>Плохой пример – Один канал:</strong></p>
<ul>
  <li>100% LinkedIn</li>
  <li>0% других каналов</li>
</ul>
<p><strong>Почему это плохо:</strong> Если LinkedIn перестанет работать или изменится, у вас нет лидов.</p>

<hr />

<h2>Практика 1 – Таблица отслеживания источников лидов (20 мин)</h2>
<p>Создайте таблицу, которая отслеживает, откуда приходят лиды:</p>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <thead>
    <tr style="background-color: #FAB908; color: #000;">
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Канал</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Дневная цель</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Фактическое</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Конверсия</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">Cold Outreach</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">8</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0%</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">CRM/Referral</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">4</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0%</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">Email Marketing</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">4</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0%</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">Partners</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">3</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0%</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">Inbound</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">1</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0%</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>Итого</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;"><strong>20</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;"><strong>0</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;"><strong>0%</strong></td>
    </tr>
  </tbody>
</table>

<h2>Практика 2 – Выбор приоритетных каналов (15 мин)</h2>
<ol>
  <li><strong>Запишите 3 самых важных канала</strong> для вашего бизнеса</li>
  <li><strong>Установите дневные цели</strong> для всех трех</li>
  <li><strong>Запишите, как вы начнете</strong> каждый канал (конкретные шаги)</li>
</ol>

<hr />

<h2>Ключевые выводы</h2>
<ul>
  <li><strong>Диверсификация = стабильность.</strong> Не полагайтесь на один канал.</li>
  <li><strong>Измеряйте каждый канал.</strong> Вам нужно знать, какой работает, а какой нет.</li>
  <li><strong>Начните с 2-3 каналов.</strong> Не пытайтесь все сразу.</li>
  <li><strong>Масштабируйте то, что работает.</strong> Если канал работает хорошо, увеличьте его объем.</li>
</ul>

<hr />

<h2>Доп. материалы (по желанию)</h2>
<ul>
  <li><strong>HubSpot – Генерация лидов:</strong> <a href="https://blog.hubspot.com/marketing/lead-generation" target="_blank" rel="noopener noreferrer">https://blog.hubspot.com/marketing/lead-generation</a> – Основы генерации лидов</li>
  <li><strong>Salesforce – Многоканальная стратегия:</strong> <a href="https://www.salesforce.com/resources/articles/multi-channel-sales/" target="_blank" rel="noopener noreferrer">https://www.salesforce.com/resources/articles/multi-channel-sales/</a> – Многоканальная стратегия</li>
</ul>
      `.trim(),
    },
    emailSubject: {
      hu: '{{courseName}} – 3. nap: Többcsatornás lead generálás',
      en: '{{courseName}} – Day 3: Multi-Channel Lead Generation',
      ru: '{{courseName}} – День 3: Многоканальная генерация лидов',
    },
    emailBody: {
      hu: `
<h1>{{courseName}}</h1>
<h2>3. nap: Többcsatornás lead generálás</h2>
<p>Ma megtanulod, hogyan generálsz lead-eket több csatornán keresztül. A kulcs: ne egy csatornára támaszkodj – diversifikálj!</p>
<p><a href="{{appUrl}}/courses/{{courseId}}/day/3">Olvasd el a teljes leckét →</a></p>
      `.trim(),
      en: `
<h1>{{courseName}}</h1>
<h2>Day 3: Multi-Channel Lead Generation</h2>
<p>Today you'll learn how to generate leads across multiple channels. The key: don't rely on one channel – diversify!</p>
<p><a href="{{appUrl}}/courses/{{courseId}}/day/3">Read the full lesson →</a></p>
      `.trim(),
      ru: `
<h1>{{courseName}}</h1>
<h2>День 3: Многоканальная генерация лидов</h2>
<p>Сегодня вы узнаете, как генерировать лиды через несколько каналов. Ключ: не полагайтесь на один канал – диверсифицируйте!</p>
<p><a href="{{appUrl}}/courses/{{courseId}}/day/3">Прочитать полный урок →</a></p>
      `.trim(),
    },
    quiz: [
      {
        q: {
          hu: 'Miért fontos több csatornát használni a lead generáláshoz?',
          en: 'Why is it important to use multiple channels for lead generation?',
          ru: 'Почему важно использовать несколько каналов для генерации лидов?',
        },
        options: {
          hu: [
            'Csak egy csatorna elég',
            'Diversifikáció = stabilitás, ha egy csatorna leáll, van másik',
            'Csak a legolcsóbb csatornát kell használni',
            'Nem fontos',
          ],
          en: [
            'One channel is enough',
            'Diversification = stability, if one channel stops, you have others',
            'Only use the cheapest channel',
            'Not important',
          ],
          ru: [
            'Одного канала достаточно',
            'Диверсификация = стабильность, если один канал останавливается, есть другие',
            'Используйте только самый дешевый канал',
            'Не важно',
          ],
        },
        correct: 1,
      },
      {
        q: {
          hu: 'Hány fő csatornát érdemes használni a lead generáláshoz?',
          en: 'How many main channels should you use for lead generation?',
          ru: 'Сколько основных каналов следует использовать для генерации лидов?',
        },
        options: {
          hu: ['1', '2-3 prioritás, de többet is lehet', '10', 'Nincs fix szám'],
          en: ['1', '2-3 priority, but can use more', '10', 'No fixed number'],
          ru: ['1', '2-3 приоритетных, но можно использовать больше', '10', 'Нет фиксированного числа'],
        },
        correct: 1,
      },
      {
        q: {
          hu: 'Melyik a leggyakoribb lead generálási csatorna B2B értékesítésben?',
          en: 'What is the most common lead generation channel in B2B sales?',
          ru: 'Какой самый распространенный канал генерации лидов в B2B продажах?',
        },
        options: {
          hu: [
            'Csak Inbound',
            'Cold Outreach (LinkedIn, email) általában a legnagyobb rész',
            'Csak Partners',
            'Csak Email Marketing',
          ],
          en: [
            'Only Inbound',
            'Cold Outreach (LinkedIn, email) usually the largest portion',
            'Only Partners',
            'Only Email Marketing',
          ],
          ru: [
            'Только Inbound',
            'Cold Outreach (LinkedIn, email) обычно самая большая часть',
            'Только Partners',
            'Только Email Marketing',
          ],
        },
        correct: 1,
      },
      {
        q: {
          hu: 'Miért fontos mérni minden csatornát?',
          en: 'Why is it important to measure every channel?',
          ru: 'Почему важно измерять каждый канал?',
        },
        options: {
          hu: [
            'Nem fontos',
            'Tudni kell, melyik működik és melyik nem, hogy optimalizálhass',
            'Csak az összes számít',
            'Csak a legdrágábbat kell mérni',
          ],
          en: [
            'Not important',
            'Need to know which works and which doesn\'t to optimize',
            'Only the total matters',
            'Only measure the most expensive',
          ],
          ru: [
            'Не важно',
            'Нужно знать, какой работает, а какой нет, чтобы оптимизировать',
            'Важна только общая сумма',
            'Измеряйте только самый дорогой',
          ],
        },
        correct: 1,
      },
      {
        q: {
          hu: 'Hogyan skálázod a működő csatornákat?',
          en: 'How do you scale channels that work?',
          ru: 'Как вы масштабируете каналы, которые работают?',
        },
        options: {
          hu: [
            'Ne skálázd',
            'Növeld a volumenét és a költségvetését',
            'Csak az új csatornákat próbáld',
            'Csökkentsd a volumenét',
          ],
          en: [
            'Don\'t scale',
            'Increase its volume and budget',
            'Only try new channels',
            'Decrease its volume',
          ],
          ru: [
            'Не масштабируйте',
            'Увеличьте его объем и бюджет',
            'Только пробуйте новые каналы',
            'Уменьшите его объем',
          ],
        },
        correct: 1,
      },
    ],
  },
  // Day 4: Conversion Rate Optimization
  {
    day: 4,
    title: {
      hu: 'Konverziós arány optimalizálás – Hogyan javítsd a számokat?',
      en: 'Conversion Rate Optimization – How to Improve Your Numbers',
      ru: 'Оптимизация коэффициента конверсии – Как улучшить цифры',
    },
    content: {
      hu: `
<h1>Konverziós arány optimalizálás – Hogyan javítsd a számokat?</h1>
<p><em>Ma megtanulod, hogyan optimalizálod a konverziós arányokat minden tölcsér szinten. A kulcs: mérj, tesztelj, javíts, ismételd.</em></p>
<hr />

<h2>Napi cél</h2>
<ul>
  <li>Megérteni, mi a konverziós arány optimalizálás (CRO)</li>
  <li>Azonosítani a leggyengébb láncszemet a tölcsérben</li>
  <li>Létrehozni egy CRO akciótervet</li>
  <li>Beállítani mérési pontokat minden szinthez</li>
</ul>
<hr />

<h2>Miért fontos ez?</h2>
<ul>
  <li><strong>Kis javítás = nagy hatás.</strong> 1% javítás minden szinten = 10-20% több bezárás.</li>
  <li><strong>Gyors eredmény:</strong> CRO gyorsabban hoz eredményt, mint új lead generálás.</li>
  <li><strong>Költséghatékonyság:</strong> Jobb, ha a meglévő lead-ekből többet zársz le, mint újakat keresni.</li>
  <li><strong>Versenyelőny:</strong> Aki jobban optimalizál, az több üzletet zár le ugyanannyi lead-del.</li>
</ul>
<hr />

<h2>Elmagyarázás</h2>

<h3>Mi a konverziós arány optimalizálás (CRO)?</h3>
<p><strong>CRO = Conversion Rate Optimization</strong></p>
<p>Ez a folyamat, amelynek célja, hogy több embert mozgasson tovább a tölcsér minden szintjén ugyanannyi input-tal.</p>

<h3>Hogyan azonosítod a leggyengébb láncszemet?</h3>
<p>Nézd meg a konverziós arányokat minden szinten:</p>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <thead>
    <tr style="background-color: #FAB908; color: #000;">
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Szint</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Jelenlegi konverzió</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Cél konverzió</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Prioritás</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">Lead → Minősített</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">20%</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">30%</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">Magas</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">Minősített → Kapcsolat</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">40%</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">50%</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">Közepes</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">Kapcsolat → Ajánlat</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">25%</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">40%</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">Magas</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">Ajánlat → Lezárás</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">15%</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">30%</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">Nagyon magas</td>
    </tr>
  </tbody>
</table>

<p><strong>Példa:</strong> Ha az "Ajánlat → Lezárás" konverzió 15%-ról 30%-ra nő, dupla annyi üzletet zársz le ugyanannyi ajánlattal!</p>

<h3>A CRO folyamat: Mérj → Tesztelj → Javíts → Ismételd</h3>
<ol>
  <li><strong>Mérj:</strong> Gyűjts adatokat minden szintről (hány lead, hány minősített, stb.)</li>
  <li><strong>Azonosítsd a problémát:</strong> Melyik szinten van a legnagyobb veszteség?</li>
  <li><strong>Tesztelj:</strong> Próbálj ki változtatásokat (pl. új email sablon, más időzítés)</li>
  <li><strong>Mérj újra:</strong> Nézd meg, javult-e a konverzió</li>
  <li><strong>Javíts vagy változtass:</strong> Ha működik, skálázd. Ha nem, próbálj mást.</li>
  <li><strong>Ismételd:</strong> Folyamatos optimalizálás</li>
</ol>

<hr />

<h2>Gyakorlat 1 – Leggyengébb láncszem azonosítása (15 perc)</h2>
<ol>
  <li><strong>Nézd meg a saját konverziós arányaidat</strong> minden tölcsér szinten</li>
  <li><strong>Számítsd ki a veszteséget:</strong> Hány lead/ajánlat vesz el minden szinten?</li>
  <li><strong>Rangsorold:</strong> Melyik szinten van a legnagyobb potenciál a javításra?</li>
  <li><strong>Írd le 3 konkrét változtatást,</strong> amit kipróbálhatsz</li>
</ol>

<h2>Gyakorlat 2 – CRO akcióterv (20 perc)</h2>
<p>Hozz létre egy akciótervet:</p>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <thead>
    <tr style="background-color: #FAB908; color: #000;">
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Szint</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Jelenlegi konverzió</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Cél konverzió</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Akció</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">Lead → Minősített</td>
      <td style="padding: 12px; border: 1px solid #ddd;">20%</td>
      <td style="padding: 12px; border: 1px solid #ddd;">30%</td>
      <td style="padding: 12px; border: 1px solid #ddd;">Jobb ICP definíció, jobb lead scoring</td>
    </tr>
  </tbody>
</table>

<hr />

<h2>Kulcs tanulságok</h2>
<ul>
  <li><strong>Kis javítás = nagy hatás.</strong> 1% javítás minden szinten exponenciálisan növeli a bezárásokat.</li>
  <li><strong>Fókuszálj a leggyengébb láncszemre.</strong> Ott van a legnagyobb potenciál.</li>
  <li><strong>Folyamatos mérés.</strong> Ha nem méred, nem tudod, működik-e.</li>
  <li><strong>Tesztelj egy változót egyszerre.</strong> Így tudod, mi működik.</li>
</ul>

<hr />

<h2>További anyagok (választható)</h2>
<ul>
  <li><strong>HubSpot – Conversion Rate Optimization:</strong> <a href="https://blog.hubspot.com/marketing/conversion-rate-optimization" target="_blank" rel="noopener noreferrer">https://blog.hubspot.com/marketing/conversion-rate-optimization</a> – CRO alapok</li>
  <li><strong>Salesforce – Sales Funnel Optimization:</strong> <a href="https://www.salesforce.com/resources/articles/sales-funnel-optimization/" target="_blank" rel="noopener noreferrer">https://www.salesforce.com/resources/articles/sales-funnel-optimization/</a> – Tölcsér optimalizálás</li>
</ul>
      `.trim(),
      en: `
<h1>Conversion Rate Optimization – How to Improve Your Numbers</h1>
<p><em>Today you'll learn how to optimize conversion rates at every funnel stage. The key: measure, test, improve, repeat.</em></p>
<hr />

<h2>Daily Goal</h2>
<ul>
  <li>Understand what conversion rate optimization (CRO) is</li>
  <li>Identify the weakest link in your funnel</li>
  <li>Create a CRO action plan</li>
  <li>Set measurement points for every stage</li>
</ul>
<hr />

<h2>Why it matters</h2>
<ul>
  <li><strong>Small improvement = big impact.</strong> 1% improvement at every stage = 10-20% more closes.</li>
  <li><strong>Quick results:</strong> CRO delivers results faster than generating new leads.</li>
  <li><strong>Cost efficiency:</strong> Better to close more of your existing leads than to find new ones.</li>
  <li><strong>Competitive advantage:</strong> Those who optimize better close more deals with the same number of leads.</li>
</ul>
<hr />

<h2>Explanation</h2>

<h3>What is conversion rate optimization (CRO)?</h3>
<p><strong>CRO = Conversion Rate Optimization</strong></p>
<p>This is the process of moving more people forward at every funnel stage with the same input.</p>

<h3>How to identify the weakest link?</h3>
<p>Look at conversion rates at every stage:</p>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <thead>
    <tr style="background-color: #FAB908; color: #000;">
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Stage</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Current Conversion</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Target Conversion</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Priority</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">Lead → Qualified</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">20%</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">30%</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">High</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">Qualified → Connected</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">40%</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">50%</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">Medium</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">Connected → Proposal</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">25%</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">40%</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">High</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">Proposal → Closed</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">15%</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">30%</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">Very High</td>
    </tr>
  </tbody>
</table>

<p><strong>Example:</strong> If "Proposal → Closed" conversion increases from 15% to 30%, you close twice as many deals with the same number of proposals!</p>

<h3>The CRO process: Measure → Test → Improve → Repeat</h3>
<ol>
  <li><strong>Measure:</strong> Collect data from every stage (how many leads, how many qualified, etc.)</li>
  <li><strong>Identify the problem:</strong> Which stage has the biggest loss?</li>
  <li><strong>Test:</strong> Try changes (e.g., new email template, different timing)</li>
  <li><strong>Measure again:</strong> See if conversion improved</li>
  <li><strong>Improve or change:</strong> If it works, scale it. If not, try something else.</li>
  <li><strong>Repeat:</strong> Continuous optimization</li>
</ol>

<hr />

<h2>Practice 1 – Identify weakest link (15 min)</h2>
<ol>
  <li><strong>Look at your own conversion rates</strong> at every funnel stage</li>
  <li><strong>Calculate the loss:</strong> How many leads/proposals are lost at each stage?</li>
  <li><strong>Rank them:</strong> Which stage has the biggest improvement potential?</li>
  <li><strong>Write down 3 concrete changes</strong> you can test</li>
</ol>

<h2>Practice 2 – CRO action plan (20 min)</h2>
<p>Create an action plan:</p>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <thead>
    <tr style="background-color: #FAB908; color: #000;">
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Stage</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Current Conversion</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Target Conversion</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Action</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">Lead → Qualified</td>
      <td style="padding: 12px; border: 1px solid #ddd;">20%</td>
      <td style="padding: 12px; border: 1px solid #ddd;">30%</td>
      <td style="padding: 12px; border: 1px solid #ddd;">Better ICP definition, better lead scoring</td>
    </tr>
  </tbody>
</table>

<hr />

<h2>Key Takeaways</h2>
<ul>
  <li><strong>Small improvement = big impact.</strong> 1% improvement at every stage exponentially increases closes.</li>
  <li><strong>Focus on the weakest link.</strong> That's where the biggest potential is.</li>
  <li><strong>Continuous measurement.</strong> If you don't measure, you don't know if it works.</li>
  <li><strong>Test one variable at a time.</strong> This way you know what works.</li>
</ul>

<hr />

<h2>Optional Resources</h2>
<ul>
  <li><strong>HubSpot – Conversion Rate Optimization:</strong> <a href="https://blog.hubspot.com/marketing/conversion-rate-optimization" target="_blank" rel="noopener noreferrer">https://blog.hubspot.com/marketing/conversion-rate-optimization</a> – CRO fundamentals</li>
  <li><strong>Salesforce – Sales Funnel Optimization:</strong> <a href="https://www.salesforce.com/resources/articles/sales-funnel-optimization/" target="_blank" rel="noopener noreferrer">https://www.salesforce.com/resources/articles/sales-funnel-optimization/</a> – Funnel optimization</li>
</ul>
      `.trim(),
      ru: `
<h1>Оптимизация коэффициента конверсии – Как улучшить цифры</h1>
<p><em>Сегодня вы узнаете, как оптимизировать коэффициенты конверсии на каждом этапе воронки. Ключ: измеряйте, тестируйте, улучшайте, повторяйте.</em></p>
<hr />

<h2>Цель дня</h2>
<ul>
  <li>Понять, что такое оптимизация коэффициента конверсии (CRO)</li>
  <li>Определить самое слабое звено в вашей воронке</li>
  <li>Создать план действий по CRO</li>
  <li>Установить точки измерения для каждого этапа</li>
</ul>
<hr />

<h2>Почему это важно</h2>
<ul>
  <li><strong>Небольшое улучшение = большой эффект.</strong> Улучшение на 1% на каждом этапе = на 10-20% больше закрытий.</li>
  <li><strong>Быстрые результаты:</strong> CRO дает результаты быстрее, чем генерация новых лидов.</li>
  <li><strong>Эффективность затрат:</strong> Лучше закрыть больше существующих лидов, чем искать новые.</li>
  <li><strong>Конкурентное преимущество:</strong> Те, кто лучше оптимизирует, закрывают больше сделок с тем же количеством лидов.</li>
</ul>
<hr />

<h2>Объяснение</h2>

<h3>Что такое оптимизация коэффициента конверсии (CRO)?</h3>
<p><strong>CRO = Conversion Rate Optimization</strong></p>
<p>Это процесс продвижения большего количества людей на каждом этапе воронки с тем же входом.</p>

<h3>Как определить самое слабое звено?</h3>
<p>Посмотрите на коэффициенты конверсии на каждом этапе:</p>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <thead>
    <tr style="background-color: #FAB908; color: #000;">
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Этап</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Текущая конверсия</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Целевая конверсия</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Приоритет</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">Лид → Квалифицированный</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">20%</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">30%</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">Высокий</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">Квалифицированный → Связанный</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">40%</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">50%</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">Средний</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">Связанный → Предложение</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">25%</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">40%</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">Высокий</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">Предложение → Закрыт</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">15%</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">30%</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">Очень высокий</td>
    </tr>
  </tbody>
</table>

<p><strong>Пример:</strong> Если конверсия "Предложение → Закрыт" увеличится с 15% до 30%, вы закроете в два раза больше сделок с тем же количеством предложений!</p>

<h3>Процесс CRO: Измеряйте → Тестируйте → Улучшайте → Повторяйте</h3>
<ol>
  <li><strong>Измеряйте:</strong> Собирайте данные с каждого этапа (сколько лидов, сколько квалифицированных и т.д.)</li>
  <li><strong>Определите проблему:</strong> На каком этапе самая большая потеря?</li>
  <li><strong>Тестируйте:</strong> Попробуйте изменения (например, новый шаблон email, другое время)</li>
  <li><strong>Измеряйте снова:</strong> Посмотрите, улучшилась ли конверсия</li>
  <li><strong>Улучшайте или меняйте:</strong> Если работает, масштабируйте. Если нет, попробуйте что-то другое.</li>
  <li><strong>Повторяйте:</strong> Непрерывная оптимизация</li>
</ol>

<hr />

<h2>Практика 1 – Определение самого слабого звена (15 мин)</h2>
<ol>
  <li><strong>Посмотрите на свои коэффициенты конверсии</strong> на каждом этапе воронки</li>
  <li><strong>Рассчитайте потери:</strong> Сколько лидов/предложений теряется на каждом этапе?</li>
  <li><strong>Ранжируйте:</strong> На каком этапе самый большой потенциал для улучшения?</li>
  <li><strong>Запишите 3 конкретных изменения,</strong> которые вы можете протестировать</li>
</ol>

<h2>Практика 2 – План действий по CRO (20 мин)</h2>
<p>Создайте план действий:</p>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <thead>
    <tr style="background-color: #FAB908; color: #000;">
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Этап</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Текущая конверсия</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Целевая конверсия</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Действие</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">Лид → Квалифицированный</td>
      <td style="padding: 12px; border: 1px solid #ddd;">20%</td>
      <td style="padding: 12px; border: 1px solid #ddd;">30%</td>
      <td style="padding: 12px; border: 1px solid #ddd;">Лучшее определение ICP, лучший скоринг лидов</td>
    </tr>
  </tbody>
</table>

<hr />

<h2>Ключевые выводы</h2>
<ul>
  <li><strong>Небольшое улучшение = большой эффект.</strong> Улучшение на 1% на каждом этапе экспоненциально увеличивает закрытия.</li>
  <li><strong>Фокусируйтесь на самом слабом звене.</strong> Там самый большой потенциал.</li>
  <li><strong>Непрерывное измерение.</strong> Если не измеряете, не знаете, работает ли.</li>
  <li><strong>Тестируйте одну переменную за раз.</strong> Так вы знаете, что работает.</li>
</ul>

<hr />

<h2>Доп. материалы (по желанию)</h2>
<ul>
  <li><strong>HubSpot – Оптимизация коэффициента конверсии:</strong> <a href="https://blog.hubspot.com/marketing/conversion-rate-optimization" target="_blank" rel="noopener noreferrer">https://blog.hubspot.com/marketing/conversion-rate-optimization</a> – Основы CRO</li>
  <li><strong>Salesforce – Оптимизация воронки продаж:</strong> <a href="https://www.salesforce.com/resources/articles/sales-funnel-optimization/" target="_blank" rel="noopener noreferrer">https://www.salesforce.com/resources/articles/sales-funnel-optimization/</a> – Оптимизация воронки</li>
</ul>
      `.trim(),
    },
    emailSubject: {
      hu: '{{courseName}} – 4. nap: Konverziós arány optimalizálás',
      en: '{{courseName}} – Day 4: Conversion Rate Optimization',
      ru: '{{courseName}} – День 4: Оптимизация коэффициента конверсии',
    },
    emailBody: {
      hu: `
<h1>{{courseName}}</h1>
<h2>4. nap: Konverziós arány optimalizálás</h2>
<p>Ma megtanulod, hogyan optimalizálod a konverziós arányokat minden tölcsér szinten. A kulcs: mérj, tesztelj, javíts, ismételd.</p>
<p><a href="{{appUrl}}/courses/{{courseId}}/day/4">Olvasd el a teljes leckét →</a></p>
      `.trim(),
      en: `
<h1>{{courseName}}</h1>
<h2>Day 4: Conversion Rate Optimization</h2>
<p>Today you'll learn how to optimize conversion rates at every funnel stage. The key: measure, test, improve, repeat.</p>
<p><a href="{{appUrl}}/courses/{{courseId}}/day/4">Read the full lesson →</a></p>
      `.trim(),
      ru: `
<h1>{{courseName}}</h1>
<h2>День 4: Оптимизация коэффициента конверсии</h2>
<p>Сегодня вы узнаете, как оптимизировать коэффициенты конверсии на каждом этапе воронки. Ключ: измеряйте, тестируйте, улучшайте, повторяйте.</p>
<p><a href="{{appUrl}}/courses/{{courseId}}/day/4">Прочитать полный урок →</a></p>
      `.trim(),
    },
    quiz: [
      {
        q: {
          hu: 'Mi a CRO?',
          en: 'What is CRO?',
          ru: 'Что такое CRO?',
        },
        options: {
          hu: [
            'Customer Relationship Optimization',
            'Conversion Rate Optimization – a folyamat, amely több embert mozgat tovább a tölcsérben',
            'Csak a bezárások számolása',
            'Nem fontos',
          ],
          en: [
            'Customer Relationship Optimization',
            'Conversion Rate Optimization – the process of moving more people forward in the funnel',
            'Just counting closes',
            'Not important',
          ],
          ru: [
            'Customer Relationship Optimization',
            'Conversion Rate Optimization – процесс продвижения большего количества людей в воронке',
            'Просто подсчет закрытий',
            'Не важно',
          ],
        },
        correct: 1,
      },
      {
        q: {
          hu: 'Miért fontos a CRO?',
          en: 'Why is CRO important?',
          ru: 'Почему важен CRO?',
        },
        options: {
          hu: [
            'Nem fontos',
            'Kis javítás = nagy hatás. 1% javítás minden szinten exponenciálisan növeli a bezárásokat',
            'Csak az új lead-ek számítanak',
            'Csak a költségeket csökkenti',
          ],
          en: [
            'Not important',
            'Small improvement = big impact. 1% improvement at every stage exponentially increases closes',
            'Only new leads matter',
            'Only reduces costs',
          ],
          ru: [
            'Не важно',
            'Небольшое улучшение = большой эффект. Улучшение на 1% на каждом этапе экспоненциально увеличивает закрытия',
            'Важны только новые лиды',
            'Только снижает затраты',
          ],
        },
        correct: 1,
      },
      {
        q: {
          hu: 'Hogyan azonosítod a leggyengébb láncszemet?',
          en: 'How do you identify the weakest link?',
          ru: 'Как вы определяете самое слабое звено?',
        },
        options: {
          hu: [
            'Véletlenszerűen',
            'Nézd meg a konverziós arányokat minden szinten, és azonosítsd, hol van a legnagyobb veszteség',
            'Csak a bezárásokra koncentrálj',
            'Ne azonosítsd',
          ],
          en: [
            'Randomly',
            'Look at conversion rates at every stage and identify where the biggest loss is',
            'Just focus on closes',
            'Don\'t identify it',
          ],
          ru: [
            'Случайно',
            'Посмотрите на коэффициенты конверсии на каждом этапе и определите, где самая большая потеря',
            'Просто фокусируйтесь на закрытиях',
            'Не определяйте',
          ],
        },
        correct: 1,
      },
      {
        q: {
          hu: 'Mi a CRO folyamat?',
          en: 'What is the CRO process?',
          ru: 'Какой процесс CRO?',
        },
        options: {
          hu: [
            'Csak mérj',
            'Mérj → Tesztelj → Javíts → Ismételd',
            'Csak tesztelj',
            'Csak javíts',
          ],
          en: [
            'Just measure',
            'Measure → Test → Improve → Repeat',
            'Just test',
            'Just improve',
          ],
          ru: [
            'Просто измеряйте',
            'Измеряйте → Тестируйте → Улучшайте → Повторяйте',
            'Просто тестируйте',
            'Просто улучшайте',
          ],
        },
        correct: 1,
      },
      {
        q: {
          hu: 'Hány változót tesztelj egyszerre?',
          en: 'How many variables do you test at once?',
          ru: 'Сколько переменных вы тестируете одновременно?',
        },
        options: {
          hu: [
            'Mindent egyszerre',
            'Egy változót egyszerre, hogy tudjad, mi működik',
            'Ne tesztelj semmit',
            'Csak a legdrágábbat',
          ],
          en: [
            'Everything at once',
            'One variable at a time so you know what works',
            'Don\'t test anything',
            'Only the most expensive',
          ],
          ru: [
            'Все сразу',
            'Одну переменную за раз, чтобы знать, что работает',
            'Ничего не тестируйте',
            'Только самое дорогое',
          ],
        },
        correct: 1,
      },
    ],
  },
  // Day 5: Weekly/Monthly Forecasting
  {
    day: 5,
    title: {
      hu: 'Heti/havi előrejelzés – Hogyan jósold meg a jövőt?',
      en: 'Weekly/Monthly Forecasting – How to Predict the Future',
      ru: 'Недельное/месячное прогнозирование – Как предсказать будущее',
    },
    content: {
      hu: `
<h1>Heti/havi előrejelzés – Hogyan jósold meg a jövőt?</h1>
<p><em>Ma megtanulod, hogyan készíts előrejelzést a tölcsér adatai alapján. A kulcs: a múltból tanulva jósold meg a jövőt.</em></p>
<hr />

<h2>Napi cél</h2>
<ul>
  <li>Megérteni, mi az előrejelzés és miért fontos</li>
  <li>Létrehozni egy heti előrejelzési sablont</li>
  <li>Létrehozni egy havi előrejelzési sablont</li>
  <li>Beállítani előrejelzési rutint</li>
</ul>
<hr />

<h2>Miért fontos ez?</h2>
<ul>
  <li><strong>Előrejelzés = kontroll.</strong> Ha tudod, mi fog történni, előre készülhetsz.</li>
  <li><strong>Vezetőségi kommunikáció:</strong> A vezetőség előrejelzéseket vár, nem "reménykedést".</li>
  <li><strong>Erőforrás tervezés:</strong> Ha tudod, hány üzletet fogsz bezárni, tudod, mennyi erőforrásra van szükséged.</li>
  <li><strong>Korai figyelmeztetés:</strong> Ha látod, hogy lemaradsz, korán tudsz javítani.</li>
</ul>
<hr />

<h2>Elmagyarázás</h2>

<h3>Mi az előrejelzés?</h3>
<p><strong>Előrejelzés = a jövőbeli bezárások becslése a jelenlegi tölcsér adatok alapján.</strong></p>
<p>Példa: Ha most van 16 ajánlat elküldve, és a konverzió 25%, akkor ~4 üzletet fogsz bezárni.</p>

<h3>Hogyan készíts előrejelzést?</h3>
<ol>
  <li><strong>Nézd meg a jelenlegi tölcsér állapotát:</strong>
    <ul>
      <li>Hány lead van?</li>
      <li>Hány minősített?</li>
      <li>Hány kapcsolat?</li>
      <li>Hány ajánlat elküldve?</li>
    </ul>
  </li>
  <li><strong>Használd a konverziós arányokat:</strong>
    <ul>
      <li>Lead → Minősített: 25%</li>
      <li>Minősített → Kapcsolat: 40%</li>
      <li>Kapcsolat → Ajánlat: 33%</li>
      <li>Ajánlat → Lezárás: 25%</li>
    </ul>
  </li>
  <li><strong>Számold ki a várható bezárásokat:</strong>
    <ul>
      <li>16 ajánlat × 25% = 4 várható bezárás</li>
    </ul>
  </li>
  <li><strong>Hasonlítsd össze a céloddal:</strong>
    <ul>
      <li>Cél: 4 bezárás</li>
      <li>Előrejelzés: 4 bezárás</li>
      <li>Státusz: ✅ Terv szerint</li>
    </ul>
  </li>
</ol>

<h3>Heti előrejelzés sablon</h3>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <thead>
    <tr style="background-color: #FAB908; color: #000;">
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Szint</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Jelenlegi</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Konverzió</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Várható</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">Ajánlat elküldve</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">16</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">25%</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">4 bezárás</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">Kapcsolat</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">48</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">33%</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">16 ajánlat</td>
    </tr>
  </tbody>
</table>

<h3>Havi előrejelzés sablon</h3>
<p>Ugyanaz a logika, de havi időkerettel:</p>
<ul>
  <li>Havi cél: 4 bezárás</li>
  <li>Jelenlegi ajánlat: 16</li>
  <li>Várható bezárás: 4 (16 × 25%)</li>
  <li>Státusz: ✅ Terv szerint</li>
</ul>

<hr />

<h2>Gyakorlat 1 – Heti előrejelzés (20 perc)</h2>
<ol>
  <li><strong>Nézd meg a jelenlegi tölcsér állapotodat</strong> (hány lead, minősített, kapcsolat, ajánlat)</li>
  <li><strong>Használd a konverziós arányaidat</strong> (vagy az átlagokat, ha még nincs saját)</li>
  <li><strong>Számold ki a várható bezárásokat</strong> a következő hétre</li>
  <li><strong>Hasonlítsd össze a céloddal</strong> – lemaradsz vagy előrébb vagy?</li>
</ol>

<h2>Gyakorlat 2 – Havi előrejelzés (15 perc)</h2>
<ol>
  <li><strong>Készíts havi előrejelzést</strong> ugyanazzal a módszerrel</li>
  <li><strong>Írd le, mit kell változtatnod,</strong> ha lemaradsz a célhoz képest</li>
  <li><strong>Állíts be korrekciós lépéseket</strong> (pl. több lead generálás, jobb konverzió)</li>
</ol>

<hr />

<h2>Kulcs tanulságok</h2>
<ul>
  <li><strong>Előrejelzés = kontroll.</strong> Ha tudod, mi fog történni, előre készülhetsz.</li>
  <li><strong>Használd a múltbeli adatokat.</strong> A saját konverziós arányaid a legpontosabbak.</li>
  <li><strong>Frissítsd hetente.</strong> A tölcsér állapota változik, az előrejelzésnek is változnia kell.</li>
  <li><strong>Légy konzervatív.</strong> Jobb, ha alulbecsülöd, mint ha túlbecsülöd.</li>
</ul>

<hr />

<h2>További anyagok (választható)</h2>
<ul>
  <li><strong>HubSpot – Sales Forecasting:</strong> <a href="https://blog.hubspot.com/sales/sales-forecasting" target="_blank" rel="noopener noreferrer">https://blog.hubspot.com/sales/sales-forecasting</a> – Előrejelzés alapok</li>
  <li><strong>Salesforce – Forecasting Best Practices:</strong> <a href="https://www.salesforce.com/resources/articles/sales-forecasting/" target="_blank" rel="noopener noreferrer">https://www.salesforce.com/resources/articles/sales-forecasting/</a> – Előrejelzés best practice-ek</li>
</ul>
      `.trim(),
      en: `
<h1>Weekly/Monthly Forecasting – How to Predict the Future</h1>
<p><em>Today you'll learn how to create forecasts based on funnel data. The key: learn from the past to predict the future.</em></p>
<hr />

<h2>Daily Goal</h2>
<ul>
  <li>Understand what forecasting is and why it matters</li>
  <li>Create a weekly forecasting template</li>
  <li>Create a monthly forecasting template</li>
  <li>Set up a forecasting routine</li>
</ul>
<hr />

<h2>Why it matters</h2>
<ul>
  <li><strong>Forecasting = control.</strong> If you know what will happen, you can prepare in advance.</li>
  <li><strong>Management communication:</strong> Management expects forecasts, not "hoping".</li>
  <li><strong>Resource planning:</strong> If you know how many deals you'll close, you know how many resources you need.</li>
  <li><strong>Early warning:</strong> If you see you're behind, you can fix it early.</li>
</ul>
<hr />

<h2>Explanation</h2>

<h3>What is forecasting?</h3>
<p><strong>Forecasting = estimating future closes based on current funnel data.</strong></p>
<p>Example: If you have 16 proposals sent now, and conversion is 25%, you'll close ~4 deals.</p>

<h3>How to create a forecast?</h3>
<ol>
  <li><strong>Look at current funnel status:</strong>
    <ul>
      <li>How many leads?</li>
      <li>How many qualified?</li>
      <li>How many connected?</li>
      <li>How many proposals sent?</li>
    </ul>
  </li>
  <li><strong>Use conversion rates:</strong>
    <ul>
      <li>Lead → Qualified: 25%</li>
      <li>Qualified → Connected: 40%</li>
      <li>Connected → Proposal: 33%</li>
      <li>Proposal → Closed: 25%</li>
    </ul>
  </li>
  <li><strong>Calculate expected closes:</strong>
    <ul>
      <li>16 proposals × 25% = 4 expected closes</li>
    </ul>
  </li>
  <li><strong>Compare to your target:</strong>
    <ul>
      <li>Target: 4 closes</li>
      <li>Forecast: 4 closes</li>
      <li>Status: ✅ On track</li>
    </ul>
  </li>
</ol>

<h3>Weekly forecast template</h3>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <thead>
    <tr style="background-color: #FAB908; color: #000;">
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Stage</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Current</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Conversion</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Expected</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">Proposal sent</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">16</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">25%</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">4 closes</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">Connected</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">48</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">33%</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">16 proposals</td>
    </tr>
  </tbody>
</table>

<h3>Monthly forecast template</h3>
<p>Same logic, but with monthly timeframe:</p>
<ul>
  <li>Monthly target: 4 closes</li>
  <li>Current proposals: 16</li>
  <li>Expected closes: 4 (16 × 25%)</li>
  <li>Status: ✅ On track</li>
</ul>

<hr />

<h2>Practice 1 – Weekly forecast (20 min)</h2>
<ol>
  <li><strong>Look at your current funnel status</strong> (how many leads, qualified, connected, proposals)</li>
  <li><strong>Use your conversion rates</strong> (or averages if you don't have your own yet)</li>
  <li><strong>Calculate expected closes</strong> for the next week</li>
  <li><strong>Compare to your target</strong> – are you behind or ahead?</li>
</ol>

<h2>Practice 2 – Monthly forecast (15 min)</h2>
<ol>
  <li><strong>Create monthly forecast</strong> using the same method</li>
  <li><strong>Write down what you need to change</strong> if you're behind target</li>
  <li><strong>Set correction steps</strong> (e.g., more lead generation, better conversion)</li>
</ol>

<hr />

<h2>Key Takeaways</h2>
<ul>
  <li><strong>Forecasting = control.</strong> If you know what will happen, you can prepare in advance.</li>
  <li><strong>Use historical data.</strong> Your own conversion rates are the most accurate.</li>
  <li><strong>Update weekly.</strong> Funnel status changes, forecast should change too.</li>
  <li><strong>Be conservative.</strong> Better to underestimate than overestimate.</li>
</ul>

<hr />

<h2>Optional Resources</h2>
<ul>
  <li><strong>HubSpot – Sales Forecasting:</strong> <a href="https://blog.hubspot.com/sales/sales-forecasting" target="_blank" rel="noopener noreferrer">https://blog.hubspot.com/sales/sales-forecasting</a> – Forecasting fundamentals</li>
  <li><strong>Salesforce – Forecasting Best Practices:</strong> <a href="https://www.salesforce.com/resources/articles/sales-forecasting/" target="_blank" rel="noopener noreferrer">https://www.salesforce.com/resources/articles/sales-forecasting/</a> – Forecasting best practices</li>
</ul>
      `.trim(),
      ru: `
<h1>Недельное/месячное прогнозирование – Как предсказать будущее</h1>
<p><em>Сегодня вы узнаете, как создавать прогнозы на основе данных воронки. Ключ: учитесь на прошлом, чтобы предсказать будущее.</em></p>
<hr />

<h2>Цель дня</h2>
<ul>
  <li>Понять, что такое прогнозирование и почему это важно</li>
  <li>Создать шаблон недельного прогнозирования</li>
  <li>Создать шаблон месячного прогнозирования</li>
  <li>Настроить рутину прогнозирования</li>
</ul>
<hr />

<h2>Почему это важно</h2>
<ul>
  <li><strong>Прогнозирование = контроль.</strong> Если знаете, что произойдет, можете подготовиться заранее.</li>
  <li><strong>Коммуникация с руководством:</strong> Руководство ожидает прогнозы, а не "надежду".</li>
  <li><strong>Планирование ресурсов:</strong> Если знаете, сколько сделок закроете, знаете, сколько ресурсов нужно.</li>
  <li><strong>Раннее предупреждение:</strong> Если видите, что отстаете, можете исправить рано.</li>
</ul>
<hr />

<h2>Объяснение</h2>

<h3>Что такое прогнозирование?</h3>
<p><strong>Прогнозирование = оценка будущих закрытий на основе текущих данных воронки.</strong></p>
<p>Пример: Если у вас сейчас 16 отправленных предложений, и конверсия 25%, вы закроете ~4 сделки.</p>

<h3>Как создать прогноз?</h3>
<ol>
  <li><strong>Посмотрите на текущее состояние воронки:</strong>
    <ul>
      <li>Сколько лидов?</li>
      <li>Сколько квалифицированных?</li>
      <li>Сколько связанных?</li>
      <li>Сколько отправлено предложений?</li>
    </ul>
  </li>
  <li><strong>Используйте коэффициенты конверсии:</strong>
    <ul>
      <li>Лид → Квалифицированный: 25%</li>
      <li>Квалифицированный → Связанный: 40%</li>
      <li>Связанный → Предложение: 33%</li>
      <li>Предложение → Закрыт: 25%</li>
    </ul>
  </li>
  <li><strong>Рассчитайте ожидаемые закрытия:</strong>
    <ul>
      <li>16 предложений × 25% = 4 ожидаемых закрытия</li>
    </ul>
  </li>
  <li><strong>Сравните с вашей целью:</strong>
    <ul>
      <li>Цель: 4 закрытия</li>
      <li>Прогноз: 4 закрытия</li>
      <li>Статус: ✅ По плану</li>
    </ul>
  </li>
</ol>

<h3>Шаблон недельного прогноза</h3>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <thead>
    <tr style="background-color: #FAB908; color: #000;">
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Этап</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Текущее</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Конверсия</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Ожидаемое</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">Предложение отправлено</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">16</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">25%</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">4 закрытия</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">Связанный</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">48</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">33%</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">16 предложений</td>
    </tr>
  </tbody>
</table>

<h3>Шаблон месячного прогноза</h3>
<p>Та же логика, но с месячным временным рамкой:</p>
<ul>
  <li>Месячная цель: 4 закрытия</li>
  <li>Текущие предложения: 16</li>
  <li>Ожидаемые закрытия: 4 (16 × 25%)</li>
  <li>Статус: ✅ По плану</li>
</ul>

<hr />

<h2>Практика 1 – Недельный прогноз (20 мин)</h2>
<ol>
  <li><strong>Посмотрите на текущее состояние вашей воронки</strong> (сколько лидов, квалифицированных, связанных, предложений)</li>
  <li><strong>Используйте свои коэффициенты конверсии</strong> (или средние, если у вас еще нет своих)</li>
  <li><strong>Рассчитайте ожидаемые закрытия</strong> на следующую неделю</li>
  <li><strong>Сравните с вашей целью</strong> – отстаете или опережаете?</li>
</ol>

<h2>Практика 2 – Месячный прогноз (15 мин)</h2>
<ol>
  <li><strong>Создайте месячный прогноз</strong> используя тот же метод</li>
  <li><strong>Запишите, что нужно изменить,</strong> если отстаете от цели</li>
  <li><strong>Установите корректирующие шаги</strong> (например, больше генерации лидов, лучшая конверсия)</li>
</ol>

<hr />

<h2>Ключевые выводы</h2>
<ul>
  <li><strong>Прогнозирование = контроль.</strong> Если знаете, что произойдет, можете подготовиться заранее.</li>
  <li><strong>Используйте исторические данные.</strong> Ваши собственные коэффициенты конверсии самые точные.</li>
  <li><strong>Обновляйте еженедельно.</strong> Состояние воронки меняется, прогноз тоже должен меняться.</li>
  <li><strong>Будьте консервативны.</strong> Лучше недооценить, чем переоценить.</li>
</ul>

<hr />

<h2>Доп. материалы (по желанию)</h2>
<ul>
  <li><strong>HubSpot – Прогнозирование продаж:</strong> <a href="https://blog.hubspot.com/sales/sales-forecasting" target="_blank" rel="noopener noreferrer">https://blog.hubspot.com/sales/sales-forecasting</a> – Основы прогнозирования</li>
  <li><strong>Salesforce – Лучшие практики прогнозирования:</strong> <a href="https://www.salesforce.com/resources/articles/sales-forecasting/" target="_blank" rel="noopener noreferrer">https://www.salesforce.com/resources/articles/sales-forecasting/</a> – Лучшие практики прогнозирования</li>
</ul>
      `.trim(),
    },
    emailSubject: {
      hu: '{{courseName}} – 5. nap: Heti/havi előrejelzés',
      en: '{{courseName}} – Day 5: Weekly/Monthly Forecasting',
      ru: '{{courseName}} – День 5: Недельное/месячное прогнозирование',
    },
    emailBody: {
      hu: `
<h1>{{courseName}}</h1>
<h2>5. nap: Heti/havi előrejelzés</h2>
<p>Ma megtanulod, hogyan készíts előrejelzést a tölcsér adatai alapján. A kulcs: a múltból tanulva jósold meg a jövőt.</p>
<p><a href="{{appUrl}}/courses/{{courseId}}/day/5">Olvasd el a teljes leckét →</a></p>
      `.trim(),
      en: `
<h1>{{courseName}}</h1>
<h2>Day 5: Weekly/Monthly Forecasting</h2>
<p>Today you'll learn how to create forecasts based on funnel data. The key: learn from the past to predict the future.</p>
<p><a href="{{appUrl}}/courses/{{courseId}}/day/5">Read the full lesson →</a></p>
      `.trim(),
      ru: `
<h1>{{courseName}}</h1>
<h2>День 5: Недельное/месячное прогнозирование</h2>
<p>Сегодня вы узнаете, как создавать прогнозы на основе данных воронки. Ключ: учитесь на прошлом, чтобы предсказать будущее.</p>
<p><a href="{{appUrl}}/courses/{{courseId}}/day/5">Прочитать полный урок →</a></p>
      `.trim(),
    },
    quiz: [
      {
        q: {
          hu: 'Mi az előrejelzés?',
          en: 'What is forecasting?',
          ru: 'Что такое прогнозирование?',
        },
        options: {
          hu: [
            'Csak a múltbeli adatok',
            'A jövőbeli bezárások becslése a jelenlegi tölcsér adatok alapján',
            'Csak a célok',
            'Nem fontos',
          ],
          en: [
            'Just historical data',
            'Estimating future closes based on current funnel data',
            'Just targets',
            'Not important',
          ],
          ru: [
            'Просто исторические данные',
            'Оценка будущих закрытий на основе текущих данных воронки',
            'Просто цели',
            'Не важно',
          ],
        },
        correct: 1,
      },
      {
        q: {
          hu: 'Miért fontos az előrejelzés?',
          en: 'Why is forecasting important?',
          ru: 'Почему важно прогнозирование?',
        },
        options: {
          hu: [
            'Nem fontos',
            'Előrejelzés = kontroll. Ha tudod, mi fog történni, előre készülhetsz',
            'Csak a vezetőségnek kell',
            'Csak a múlt számít',
          ],
          en: [
            'Not important',
            'Forecasting = control. If you know what will happen, you can prepare in advance',
            'Only management needs it',
            'Only the past matters',
          ],
          ru: [
            'Не важно',
            'Прогнозирование = контроль. Если знаете, что произойдет, можете подготовиться заранее',
            'Только руководству нужно',
            'Важно только прошлое',
          ],
        },
        correct: 1,
      },
      {
        q: {
          hu: 'Hogyan készíts előrejelzést?',
          en: 'How do you create a forecast?',
          ru: 'Как вы создаете прогноз?',
        },
        options: {
          hu: [
            'Véletlenszerűen',
            'Nézd meg a jelenlegi tölcsér állapotot, használd a konverziós arányokat, számold ki a várható bezárásokat',
            'Csak a célokat nézd',
            'Ne készíts előrejelzést',
          ],
          en: [
            'Randomly',
            'Look at current funnel status, use conversion rates, calculate expected closes',
            'Just look at targets',
            'Don\'t create forecast',
          ],
          ru: [
            'Случайно',
            'Посмотрите на текущее состояние воронки, используйте коэффициенты конверсии, рассчитайте ожидаемые закрытия',
            'Просто посмотрите на цели',
            'Не создавайте прогноз',
          ],
        },
        correct: 1,
      },
      {
        q: {
          hu: 'Milyen gyakran frissítsd az előrejelzést?',
          en: 'How often should you update the forecast?',
          ru: 'Как часто следует обновлять прогноз?',
        },
        options: {
          hu: [
            'Évente',
            'Hetente, mert a tölcsér állapota változik',
            'Soha',
            'Csak havonta',
          ],
          en: [
            'Yearly',
            'Weekly, because funnel status changes',
            'Never',
            'Only monthly',
          ],
          ru: [
            'Ежегодно',
            'Еженедельно, потому что состояние воронки меняется',
            'Никогда',
            'Только ежемесячно',
          ],
        },
        correct: 1,
      },
      {
        q: {
          hu: 'Milyen előrejelzést érdemes készíteni?',
          en: 'What kind of forecast should you create?',
          ru: 'Какой прогноз следует создавать?',
        },
        options: {
          hu: [
            'Túl optimista',
            'Konzervatív, jobb alulbecsülni, mint túlbecsülni',
            'Túl pesszimista',
            'Ne készíts előrejelzést',
          ],
          en: [
            'Too optimistic',
            'Conservative, better to underestimate than overestimate',
            'Too pessimistic',
            'Don\'t create forecast',
          ],
          ru: [
            'Слишком оптимистичный',
            'Консервативный, лучше недооценить, чем переоценить',
            'Слишком пессимистичный',
            'Не создавайте прогноз',
          ],
        },
        correct: 1,
      },
    ],
  },
  // Day 6: Qualification Framework (BANT, MEDDIC)
  {
    day: 6,
    title: {
      hu: 'Minősítési keretrendszer (BANT, MEDDIC) – Hogyan minősítsd a lead-eket?',
      en: 'Qualification Framework (BANT, MEDDIC) – How to Qualify Leads?',
      ru: 'Фреймворк квалификации (BANT, MEDDIC) – Как квалифицировать лиды?',
    },
    content: {
      hu: `
<h1>Minősítési keretrendszer (BANT, MEDDIC) – Hogyan minősítsd a lead-eket?</h1>
<p><em>Ma megtanulod a BANT és MEDDIC minősítési keretrendszereket. A kulcs: ne pazarold az idődet rossz lead-ekre – minősítsd őket korán!</em></p>
<hr />

<h2>Napi cél</h2>
<ul>
  <li>Megérteni a BANT keretrendszert (Budget, Authority, Need, Timeline)</li>
  <li>Megérteni a MEDDIC keretrendszert (Metrics, Economic Buyer, Decision Criteria, Decision Process, Identify Pain, Champion)</li>
  <li>Kiválasztani, melyiket használod</li>
  <li>Létrehozni egy minősítési checklist-et</li>
</ul>
<hr />

<h2>Miért fontos ez?</h2>
<ul>
  <li><strong>Idő megtakarítás:</strong> Ne pazarold az idődet olyan lead-ekre, akik nem fognak vásárolni.</li>
  <li><strong>Jobb konverzió:</strong> Minősített lead-ek = magasabb bezárási arány.</li>
  <li><strong>Előrejelzés:</strong> Ha minősíted a lead-eket, pontosabb az előrejelzésed.</li>
  <li><strong>Erőforrás optimalizálás:</strong> Fókuszálj azokra a lead-ekre, akik valóban vásárolni fognak.</li>
</ul>
<hr />

<h2>Elmagyarázás</h2>

<h3>BANT keretrendszer</h3>
<p><strong>BANT = Budget, Authority, Need, Timeline</strong></p>
<p>Egyszerű, gyors minősítési módszer kis- és középvállalatokhoz.</p>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <thead>
    <tr style="background-color: #FAB908; color: #000;">
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Kritérium</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Mit jelent</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Példa kérdés</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>B - Budget</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Van költségvetés?</td>
      <td style="padding: 12px; border: 1px solid #ddd;">"Milyen költségvetés áll rendelkezésre erre a projektre?"</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>A - Authority</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Döntési jogkör?</td>
      <td style="padding: 12px; border: 1px solid #ddd;">"Ki hozza meg a végső döntést?"</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>N - Need</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Valódi szükséglet?</td>
      <td style="padding: 12px; border: 1px solid #ddd;">"Mi a fő probléma, amit meg kell oldani?"</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>T - Timeline</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Időkeret?</td>
      <td style="padding: 12px; border: 1px solid #ddd;">"Mikorra kell megoldani ezt a problémát?"</td>
    </tr>
  </tbody>
</table>

<h3>MEDDIC keretrendszer</h3>
<p><strong>MEDDIC = Metrics, Economic Buyer, Decision Criteria, Decision Process, Identify Pain, Champion</strong></p>
<p>Részletesebb, komplex B2B üzletekhez (Enterprise).</p>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <thead>
    <tr style="background-color: #FAB908; color: #000;">
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Kritérium</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Mit jelent</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>M - Metrics</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Hogyan mérjük a sikerességet? (ROI, időmegtakarítás, stb.)</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>E - Economic Buyer</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Ki a pénzügyi döntéshozó? (nem csak a felhasználó)</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>D - Decision Criteria</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Milyen kritériumok alapján döntenek?</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>D - Decision Process</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Hogyan zajlik a döntési folyamat? (lépések, résztvevők)</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>I - Identify Pain</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Mi a konkrét probléma/fájdalom?</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>C - Champion</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Van-e belső szószólód, aki támogatja a megoldásodat?</td>
    </tr>
  </tbody>
</table>

<h3>Melyiket használd?</h3>
<ul>
  <li><strong>BANT:</strong> Kis- és középvállalatok, egyszerűbb üzletek, gyors minősítés</li>
  <li><strong>MEDDIC:</strong> Enterprise üzletek, komplex döntési folyamatok, hosszabb értékesítési ciklusok</li>
</ul>

<hr />

<h2>Gyakorlat 1 – BANT checklist (15 perc)</h2>
<p>Készíts egy BANT checklist-et:</p>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <thead>
    <tr style="background-color: #FAB908; color: #000;">
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Kritérium</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Igen/Nem</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Megjegyzés</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">Budget</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">☐</td>
      <td style="padding: 12px; border: 1px solid #ddd;"></td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">Authority</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">☐</td>
      <td style="padding: 12px; border: 1px solid #ddd;"></td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">Need</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">☐</td>
      <td style="padding: 12px; border: 1px solid #ddd;"></td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">Timeline</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">☐</td>
      <td style="padding: 12px; border: 1px solid #ddd;"></td>
    </tr>
  </tbody>
</table>

<h2>Gyakorlat 2 – Válaszd ki a keretrendszert (10 perc)</h2>
<ol>
  <li><strong>Írd le, milyen típusú üzleteket zársz le</strong> (kisvállalat, enterprise, stb.)</li>
  <li><strong>Válaszd ki a megfelelő keretrendszert</strong> (BANT vagy MEDDIC)</li>
  <li><strong>Írd le, miért ezt választottad</strong></li>
</ol>

<hr />

<h2>Kulcs tanulságok</h2>
<ul>
  <li><strong>Minősíts korán.</strong> Ne pazarold az idődet rossz lead-ekre.</li>
  <li><strong>Használj egy keretrendszert.</strong> BANT egyszerűbb, MEDDIC részletesebb.</li>
  <li><strong>Ne legyél túl merev.</strong> A keretrendszer útmutató, nem dogma.</li>
  <li><strong>Dokumentáld a minősítést.</strong> Írd le, miért minősített vagy nem minősített egy lead-et.</li>
</ul>

<hr />

<h2>További anyagok (választható)</h2>
<ul>
  <li><strong>HubSpot – BANT Qualification:</strong> <a href="https://blog.hubspot.com/sales/bant-qualification" target="_blank" rel="noopener noreferrer">https://blog.hubspot.com/sales/bant-qualification</a> – BANT alapok</li>
  <li><strong>Salesforce – MEDDIC Framework:</strong> <a href="https://www.salesforce.com/resources/articles/meddic-sales-qualification/" target="_blank" rel="noopener noreferrer">https://www.salesforce.com/resources/articles/meddic-sales-qualification/</a> – MEDDIC keretrendszer</li>
</ul>
      `.trim(),
      en: `
<h1>Qualification Framework (BANT, MEDDIC) – How to Qualify Leads?</h1>
<p><em>Today you'll learn the BANT and MEDDIC qualification frameworks. The key: don't waste time on bad leads – qualify them early!</em></p>
<hr />

<h2>Daily Goal</h2>
<ul>
  <li>Understand the BANT framework (Budget, Authority, Need, Timeline)</li>
  <li>Understand the MEDDIC framework (Metrics, Economic Buyer, Decision Criteria, Decision Process, Identify Pain, Champion)</li>
  <li>Choose which one to use</li>
  <li>Create a qualification checklist</li>
</ul>
<hr />

<h2>Why it matters</h2>
<ul>
  <li><strong>Time savings:</strong> Don't waste time on leads who won't buy.</li>
  <li><strong>Better conversion:</strong> Qualified leads = higher close rate.</li>
  <li><strong>Forecasting:</strong> If you qualify leads, your forecast is more accurate.</li>
  <li><strong>Resource optimization:</strong> Focus on leads who will actually buy.</li>
</ul>
<hr />

<h2>Explanation</h2>

<h3>BANT Framework</h3>
<p><strong>BANT = Budget, Authority, Need, Timeline</strong></p>
<p>Simple, quick qualification method for small and medium businesses.</p>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <thead>
    <tr style="background-color: #FAB908; color: #000;">
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Criterion</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">What it means</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Example question</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>B - Budget</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Is there a budget?</td>
      <td style="padding: 12px; border: 1px solid #ddd;">"What budget is available for this project?"</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>A - Authority</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Decision-making power?</td>
      <td style="padding: 12px; border: 1px solid #ddd;">"Who makes the final decision?"</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>N - Need</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Real need?</td>
      <td style="padding: 12px; border: 1px solid #ddd;">"What is the main problem that needs to be solved?"</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>T - Timeline</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Timeframe?</td>
      <td style="padding: 12px; border: 1px solid #ddd;">"When does this problem need to be solved?"</td>
    </tr>
  </tbody>
</table>

<h3>MEDDIC Framework</h3>
<p><strong>MEDDIC = Metrics, Economic Buyer, Decision Criteria, Decision Process, Identify Pain, Champion</strong></p>
<p>More detailed, for complex B2B deals (Enterprise).</p>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <thead>
    <tr style="background-color: #FAB908; color: #000;">
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Criterion</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">What it means</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>M - Metrics</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">How do we measure success? (ROI, time savings, etc.)</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>E - Economic Buyer</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Who is the financial decision maker? (not just the user)</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>D - Decision Criteria</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">What criteria do they use to decide?</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>D - Decision Process</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">How does the decision process work? (steps, participants)</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>I - Identify Pain</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">What is the concrete problem/pain?</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>C - Champion</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Do you have an internal advocate who supports your solution?</td>
    </tr>
  </tbody>
</table>

<h3>Which one to use?</h3>
<ul>
  <li><strong>BANT:</strong> Small and medium businesses, simpler deals, quick qualification</li>
  <li><strong>MEDDIC:</strong> Enterprise deals, complex decision processes, longer sales cycles</li>
</ul>

<hr />

<h2>Practice 1 – BANT checklist (15 min)</h2>
<p>Create a BANT checklist:</p>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <thead>
    <tr style="background-color: #FAB908; color: #000;">
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Criterion</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Yes/No</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Notes</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">Budget</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">☐</td>
      <td style="padding: 12px; border: 1px solid #ddd;"></td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">Authority</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">☐</td>
      <td style="padding: 12px; border: 1px solid #ddd;"></td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">Need</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">☐</td>
      <td style="padding: 12px; border: 1px solid #ddd;"></td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">Timeline</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">☐</td>
      <td style="padding: 12px; border: 1px solid #ddd;"></td>
    </tr>
  </tbody>
</table>

<h2>Practice 2 – Choose your framework (10 min)</h2>
<ol>
  <li><strong>Write down what type of deals you close</strong> (small business, enterprise, etc.)</li>
  <li><strong>Choose the appropriate framework</strong> (BANT or MEDDIC)</li>
  <li><strong>Write down why you chose it</strong></li>
</ol>

<hr />

<h2>Key Takeaways</h2>
<ul>
  <li><strong>Qualify early.</strong> Don't waste time on bad leads.</li>
  <li><strong>Use a framework.</strong> BANT is simpler, MEDDIC is more detailed.</li>
  <li><strong>Don't be too rigid.</strong> The framework is a guide, not dogma.</li>
  <li><strong>Document qualification.</strong> Write down why you qualified or didn't qualify a lead.</li>
</ul>

<hr />

<h2>Optional Resources</h2>
<ul>
  <li><strong>HubSpot – BANT Qualification:</strong> <a href="https://blog.hubspot.com/sales/bant-qualification" target="_blank" rel="noopener noreferrer">https://blog.hubspot.com/sales/bant-qualification</a> – BANT fundamentals</li>
  <li><strong>Salesforce – MEDDIC Framework:</strong> <a href="https://www.salesforce.com/resources/articles/meddic-sales-qualification/" target="_blank" rel="noopener noreferrer">https://www.salesforce.com/resources/articles/meddic-sales-qualification/</a> – MEDDIC framework</li>
</ul>
      `.trim(),
      ru: `
<h1>Фреймворк квалификации (BANT, MEDDIC) – Как квалифицировать лиды?</h1>
<p><em>Сегодня вы узнаете фреймворки квалификации BANT и MEDDIC. Ключ: не тратьте время на плохие лиды – квалифицируйте их рано!</em></p>
<hr />

<h2>Цель дня</h2>
<ul>
  <li>Понять фреймворк BANT (Budget, Authority, Need, Timeline)</li>
  <li>Понять фреймворк MEDDIC (Metrics, Economic Buyer, Decision Criteria, Decision Process, Identify Pain, Champion)</li>
  <li>Выбрать, какой использовать</li>
  <li>Создать чеклист квалификации</li>
</ul>
<hr />

<h2>Почему это важно</h2>
<ul>
  <li><strong>Экономия времени:</strong> Не тратьте время на лиды, которые не купят.</li>
  <li><strong>Лучшая конверсия:</strong> Квалифицированные лиды = более высокая конверсия закрытия.</li>
  <li><strong>Прогнозирование:</strong> Если квалифицируете лиды, ваш прогноз более точный.</li>
  <li><strong>Оптимизация ресурсов:</strong> Фокусируйтесь на лидах, которые действительно купят.</li>
</ul>
<hr />

<h2>Объяснение</h2>

<h3>Фреймворк BANT</h3>
<p><strong>BANT = Budget, Authority, Need, Timeline</strong></p>
<p>Простой, быстрый метод квалификации для малого и среднего бизнеса.</p>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <thead>
    <tr style="background-color: #FAB908; color: #000;">
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Критерий</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Что означает</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Пример вопроса</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>B - Budget</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Есть ли бюджет?</td>
      <td style="padding: 12px; border: 1px solid #ddd;">"Какой бюджет доступен для этого проекта?"</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>A - Authority</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Право принятия решений?</td>
      <td style="padding: 12px; border: 1px solid #ddd;">"Кто принимает окончательное решение?"</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>N - Need</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Реальная потребность?</td>
      <td style="padding: 12px; border: 1px solid #ddd;">"В чем основная проблема, которую нужно решить?"</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>T - Timeline</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Временные рамки?</td>
      <td style="padding: 12px; border: 1px solid #ddd;">"Когда нужно решить эту проблему?"</td>
    </tr>
  </tbody>
</table>

<h3>Фреймворк MEDDIC</h3>
<p><strong>MEDDIC = Metrics, Economic Buyer, Decision Criteria, Decision Process, Identify Pain, Champion</strong></p>
<p>Более детальный, для сложных B2B сделок (Enterprise).</p>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <thead>
    <tr style="background-color: #FAB908; color: #000;">
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Критерий</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Что означает</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>M - Metrics</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Как мы измеряем успех? (ROI, экономия времени и т.д.)</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>E - Economic Buyer</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Кто финансовый лицо, принимающее решение? (не только пользователь)</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>D - Decision Criteria</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">По каким критериям они принимают решение?</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>D - Decision Process</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Как работает процесс принятия решения? (шаги, участники)</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>I - Identify Pain</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">В чем конкретная проблема/боль?</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>C - Champion</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Есть ли у вас внутренний защитник, который поддерживает ваше решение?</td>
    </tr>
  </tbody>
</table>

<h3>Какой использовать?</h3>
<ul>
  <li><strong>BANT:</strong> Малый и средний бизнес, более простые сделки, быстрая квалификация</li>
  <li><strong>MEDDIC:</strong> Enterprise сделки, сложные процессы принятия решений, более длинные циклы продаж</li>
</ul>

<hr />

<h2>Практика 1 – Чеклист BANT (15 мин)</h2>
<p>Создайте чеклист BANT:</p>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <thead>
    <tr style="background-color: #FAB908; color: #000;">
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Критерий</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Да/Нет</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Заметки</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">Budget</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">☐</td>
      <td style="padding: 12px; border: 1px solid #ddd;"></td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">Authority</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">☐</td>
      <td style="padding: 12px; border: 1px solid #ddd;"></td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">Need</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">☐</td>
      <td style="padding: 12px; border: 1px solid #ddd;"></td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">Timeline</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">☐</td>
      <td style="padding: 12px; border: 1px solid #ddd;"></td>
    </tr>
  </tbody>
</table>

<h2>Практика 2 – Выберите фреймворк (10 мин)</h2>
<ol>
  <li><strong>Запишите, какой тип сделок вы закрываете</strong> (малый бизнес, enterprise и т.д.)</li>
  <li><strong>Выберите подходящий фреймворк</strong> (BANT или MEDDIC)</li>
  <li><strong>Запишите, почему вы его выбрали</strong></li>
</ol>

<hr />

<h2>Ключевые выводы</h2>
<ul>
  <li><strong>Квалифицируйте рано.</strong> Не тратьте время на плохие лиды.</li>
  <li><strong>Используйте фреймворк.</strong> BANT проще, MEDDIC более детальный.</li>
  <li><strong>Не будьте слишком жесткими.</strong> Фреймворк - это руководство, а не догма.</li>
  <li><strong>Документируйте квалификацию.</strong> Запишите, почему вы квалифицировали или не квалифицировали лид.</li>
</ul>

<hr />

<h2>Доп. материалы (по желанию)</h2>
<ul>
  <li><strong>HubSpot – Квалификация BANT:</strong> <a href="https://blog.hubspot.com/sales/bant-qualification" target="_blank" rel="noopener noreferrer">https://blog.hubspot.com/sales/bant-qualification</a> – Основы BANT</li>
  <li><strong>Salesforce – Фреймворк MEDDIC:</strong> <a href="https://www.salesforce.com/resources/articles/meddic-sales-qualification/" target="_blank" rel="noopener noreferrer">https://www.salesforce.com/resources/articles/meddic-sales-qualification/</a> – Фреймворк MEDDIC</li>
</ul>
      `.trim(),
    },
    emailSubject: {
      hu: '{{courseName}} – 6. nap: Minősítési keretrendszer',
      en: '{{courseName}} – Day 6: Qualification Framework',
      ru: '{{courseName}} – День 6: Фреймворк квалификации',
    },
    emailBody: {
      hu: `
<h1>{{courseName}}</h1>
<h2>6. nap: Minősítési keretrendszer</h2>
<p>Ma megtanulod a BANT és MEDDIC minősítési keretrendszereket. A kulcs: ne pazarold az idődet rossz lead-ekre – minősítsd őket korán!</p>
<p><a href="{{appUrl}}/courses/{{courseId}}/day/6">Olvasd el a teljes leckét →</a></p>
      `.trim(),
      en: `
<h1>{{courseName}}</h1>
<h2>Day 6: Qualification Framework</h2>
<p>Today you'll learn the BANT and MEDDIC qualification frameworks. The key: don't waste time on bad leads – qualify them early!</p>
<p><a href="{{appUrl}}/courses/{{courseId}}/day/6">Read the full lesson →</a></p>
      `.trim(),
      ru: `
<h1>{{courseName}}</h1>
<h2>День 6: Фреймворк квалификации</h2>
<p>Сегодня вы узнаете фреймворки квалификации BANT и MEDDIC. Ключ: не тратьте время на плохие лиды – квалифицируйте их рано!</p>
<p><a href="{{appUrl}}/courses/{{courseId}}/day/6">Прочитать полный урок →</a></p>
      `.trim(),
    },
    quiz: [
      {
        q: {
          hu: 'Mit jelent a BANT?',
          en: 'What does BANT stand for?',
          ru: 'Что означает BANT?',
        },
        options: {
          hu: [
            'Business, Action, Need, Time',
            'Budget, Authority, Need, Timeline',
            'Buy, Act, Negotiate, Trade',
            'Nem fontos',
          ],
          en: [
            'Business, Action, Need, Time',
            'Budget, Authority, Need, Timeline',
            'Buy, Act, Negotiate, Trade',
            'Not important',
          ],
          ru: [
            'Business, Action, Need, Time',
            'Budget, Authority, Need, Timeline',
            'Buy, Act, Negotiate, Trade',
            'Не важно',
          ],
        },
        correct: 1,
      },
      {
        q: {
          hu: 'Mikor használd a BANT-ot?',
          en: 'When do you use BANT?',
          ru: 'Когда использовать BANT?',
        },
        options: {
          hu: [
            'Csak Enterprise üzletekhez',
            'Kis- és középvállalatokhoz, egyszerűbb üzletekhez, gyors minősítéshez',
            'Csak nagy üzletekhez',
            'Soha',
          ],
          en: [
            'Only for Enterprise deals',
            'For small and medium businesses, simpler deals, quick qualification',
            'Only for large deals',
            'Never',
          ],
          ru: [
            'Только для Enterprise сделок',
            'Для малого и среднего бизнеса, более простых сделок, быстрой квалификации',
            'Только для крупных сделок',
            'Никогда',
          ],
        },
        correct: 1,
      },
      {
        q: {
          hu: 'Mit jelent a MEDDIC?',
          en: 'What does MEDDIC stand for?',
          ru: 'Что означает MEDDIC?',
        },
        options: {
          hu: [
            'Metrics, Economic Buyer, Decision Criteria, Decision Process, Identify Pain, Champion',
            'Money, Energy, Decision, Process, Idea, Customer',
            'Marketing, Email, Decision, Process, Idea, Close',
            'Nem fontos',
          ],
          en: [
            'Metrics, Economic Buyer, Decision Criteria, Decision Process, Identify Pain, Champion',
            'Money, Energy, Decision, Process, Idea, Customer',
            'Marketing, Email, Decision, Process, Idea, Close',
            'Not important',
          ],
          ru: [
            'Metrics, Economic Buyer, Decision Criteria, Decision Process, Identify Pain, Champion',
            'Money, Energy, Decision, Process, Idea, Customer',
            'Marketing, Email, Decision, Process, Idea, Close',
            'Не важно',
          ],
        },
        correct: 0,
      },
      {
        q: {
          hu: 'Miért fontos korán minősíteni?',
          en: 'Why is it important to qualify early?',
          ru: 'Почему важно квалифицировать рано?',
        },
        options: {
          hu: [
            'Nem fontos',
            'Idő megtakarítás – ne pazarold az idődet rossz lead-ekre',
            'Csak a bezárások számítanak',
            'Csak a vezetőségnek kell',
          ],
          en: [
            'Not important',
            'Time savings – don\'t waste time on bad leads',
            'Only closes matter',
            'Only management needs it',
          ],
          ru: [
            'Не важно',
            'Экономия времени – не тратьте время на плохие лиды',
            'Важны только закрытия',
            'Только руководству нужно',
          ],
        },
        correct: 1,
      },
      {
        q: {
          hu: 'Hány minősítési keretrendszert használj egyszerre?',
          en: 'How many qualification frameworks should you use at once?',
          ru: 'Сколько фреймворков квалификации следует использовать одновременно?',
        },
        options: {
          hu: [
            'Mindkettőt mindig',
            'Egyet válassz ki, amelyik a legjobban illik az üzletedhez',
            'Ne használj semmit',
            '10-et',
          ],
          en: [
            'Both always',
            'Choose one that best fits your deals',
            'Don\'t use any',
            '10',
          ],
          ru: [
            'Оба всегда',
            'Выберите один, который лучше всего подходит для ваших сделок',
            'Не используйте никакой',
            '10',
          ],
        },
        correct: 1,
      },
    ],
  },
  // Day 7: Ideal Customer Profile (ICP)
  {
    day: 7,
    title: {
      hu: 'Ideális ügyfélprofil (ICP) – Kik azok, akikkel dolgozol?',
      en: 'Ideal Customer Profile (ICP) – Who Do You Work With?',
      ru: 'Идеальный профиль клиента (ICP) – С кем вы работаете?',
    },
    content: {
      hu: `
<h1>Ideális ügyfélprofil (ICP) – Kik azok, akikkel dolgozol?</h1>
<p><em>Ma megtanulod, hogyan definiálod az ideális ügyfélprofilodat (ICP). A kulcs: ne próbálj mindenkinek eladni – fókuszálj azokra, akik valóban vásárolni fognak.</em></p>
<hr />

<h2>Napi cél</h2>
<ul>
  <li>Megérteni, mi az ICP és miért fontos</li>
  <li>Létrehozni az ICP definíciódat (cégméret, iparág, szükséglet, stb.)</li>
  <li>Azonosítani 3-5 konkrét példa céget, amelyek megfelelnek az ICP-nek</li>
  <li>Létrehozni egy ICP követő táblázatot</li>
</ul>
<hr />

<h2>Miért fontos ez?</h2>
<ul>
  <li><strong>Fókusz = jobb eredmények.</strong> Ha tudod, kik az ideális ügyfeleid, jobban célzhatsz.</li>
  <li><strong>Magasabb konverzió:</strong> ICP lead-ek = magasabb minősítési és bezárási arány.</li>
  <li><strong>Gyorsabb értékesítés:</strong> Az ideális ügyfelekkel gyorsabban zárulsz le.</li>
  <li><strong>Jobb ügyfélélmény:</strong> Az ideális ügyfelek jobban illeszkednek a megoldásodhoz.</li>
</ul>
<hr />

<h2>Elmagyarázás</h2>

<h3>Mi az ICP?</h3>
<p><strong>ICP = Ideal Customer Profile</strong> (Ideális Ügyfélprofil)</p>
<p>Ez egy részletes leírás arról, milyen típusú cégek az ideális ügyfeleid – azok, akik valószínűleg vásárolni fognak és hosszú távon megmaradnak.</p>

<h3>Hogyan definiálod az ICP-t?</h3>
<p>Az ICP 5 fő komponense:</p>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <thead>
    <tr style="background-color: #FAB908; color: #000;">
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Komponens</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Mit jelent</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Példa</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>1. Cégméret</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Hány alkalmazott?</td>
      <td style="padding: 12px; border: 1px solid #ddd;">50-200 alkalmazott</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>2. Iparág</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Milyen iparágban működnek?</td>
      <td style="padding: 12px; border: 1px solid #ddd;">Tech, SaaS, E-commerce</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>3. Földrajzi hely</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Hol találhatók?</td>
      <td style="padding: 12px; border: 1px solid #ddd;">Észak-Amerika, EU</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>4. Szükséglet/Probléma</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Milyen problémát oldanak meg?</td>
      <td style="padding: 12px; border: 1px solid #ddd;">Lead generálás, értékesítési automatizálás</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>5. Költségvetés</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Mekkora költségvetésük van?</td>
      <td style="padding: 12px; border: 1px solid #ddd;">$10K-$50K/év</td>
    </tr>
  </tbody>
</table>

<h3>Példa ICP definíció</h3>
<p><strong>ICP példa:</strong></p>
<ul>
  <li><strong>Cégméret:</strong> 50-200 alkalmazott</li>
  <li><strong>Iparág:</strong> Tech, SaaS, E-commerce</li>
  <li><strong>Földrajz:</strong> Észak-Amerika, EU</li>
  <li><strong>Szükséglet:</strong> Lead generálás, értékesítési automatizálás</li>
  <li><strong>Költségvetés:</strong> $10K-$50K/év</li>
  <li><strong>Technológia:</strong> Használnak CRM-et (Salesforce, HubSpot)</li>
</ul>

<hr />

<h2>Gyakorlat 1 – ICP definíció (25 perc)</h2>
<ol>
  <li><strong>Nézd meg a legjobb ügyfeleidet:</strong> Kik azok, akikkel a legjobban dolgozol?</li>
  <li><strong>Írd le a közös jellemzőket:</strong> Cégméret, iparág, szükséglet, stb.</li>
  <li><strong>Hozd létre az ICP definíciódat</strong> ezek alapján</li>
  <li><strong>Azonosíts 3-5 konkrét példa céget,</strong> amelyek megfelelnek az ICP-nek</li>
</ol>

<h2>Gyakorlat 2 – ICP követő táblázat (10 perc)</h2>
<p>Hozz létre egy táblázatot, amely követi, mennyi lead felel meg az ICP-nek:</p>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <thead>
    <tr style="background-color: #FAB908; color: #000;">
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Dátum</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Összes lead</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">ICP lead</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">%</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">2026-01-22</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">20</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0%</td>
    </tr>
  </tbody>
</table>

<hr />

<h2>Kulcs tanulságok</h2>
<ul>
  <li><strong>ICP = fókusz.</strong> Ha tudod, kik az ideális ügyfeleid, jobban célzhatsz.</li>
  <li><strong>Használd a múltbeli adatokat.</strong> Nézd meg a legjobb ügyfeleidet, és azonosítsd a közös jellemzőket.</li>
  <li><strong>Légy specifikus.</strong> Minél specifikusabb az ICP, annál jobb a célzás.</li>
  <li><strong>Frissítsd rendszeresen.</strong> Az ICP változhat, ahogy a vállalatod fejlődik.</li>
</ul>

<hr />

<h2>További anyagok (választható)</h2>
<ul>
  <li><strong>HubSpot – Ideal Customer Profile:</strong> <a href="https://blog.hubspot.com/sales/ideal-customer-profile" target="_blank" rel="noopener noreferrer">https://blog.hubspot.com/sales/ideal-customer-profile</a> – ICP alapok</li>
  <li><strong>Salesforce – Building Your ICP:</strong> <a href="https://www.salesforce.com/resources/articles/ideal-customer-profile/" target="_blank" rel="noopener noreferrer">https://www.salesforce.com/resources/articles/ideal-customer-profile/</a> – ICP építés</li>
</ul>
      `.trim(),
      en: `
<h1>Ideal Customer Profile (ICP) – Who Do You Work With?</h1>
<p><em>Today you'll learn how to define your Ideal Customer Profile (ICP). The key: don't try to sell to everyone – focus on those who will actually buy.</em></p>
<hr />

<h2>Daily Goal</h2>
<ul>
  <li>Understand what ICP is and why it matters</li>
  <li>Create your ICP definition (company size, industry, need, etc.)</li>
  <li>Identify 3-5 concrete example companies that fit the ICP</li>
  <li>Create an ICP tracking table</li>
</ul>
<hr />

<h2>Why it matters</h2>
<ul>
  <li><strong>Focus = better results.</strong> If you know who your ideal customers are, you can target better.</li>
  <li><strong>Higher conversion:</strong> ICP leads = higher qualification and close rates.</li>
  <li><strong>Faster sales:</strong> You close faster with ideal customers.</li>
  <li><strong>Better customer experience:</strong> Ideal customers fit better with your solution.</li>
</ul>
<hr />

<h2>Explanation</h2>

<h3>What is ICP?</h3>
<p><strong>ICP = Ideal Customer Profile</strong></p>
<p>This is a detailed description of what type of companies are your ideal customers – those who are likely to buy and stay long-term.</p>

<h3>How to define your ICP?</h3>
<p>The ICP has 5 main components:</p>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <thead>
    <tr style="background-color: #FAB908; color: #000;">
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Component</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">What it means</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Example</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>1. Company Size</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">How many employees?</td>
      <td style="padding: 12px; border: 1px solid #ddd;">50-200 employees</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>2. Industry</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">What industry do they operate in?</td>
      <td style="padding: 12px; border: 1px solid #ddd;">Tech, SaaS, E-commerce</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>3. Geographic Location</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Where are they located?</td>
      <td style="padding: 12px; border: 1px solid #ddd;">North America, EU</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>4. Need/Problem</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">What problem are they solving?</td>
      <td style="padding: 12px; border: 1px solid #ddd;">Lead generation, sales automation</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>5. Budget</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">What budget do they have?</td>
      <td style="padding: 12px; border: 1px solid #ddd;">$10K-$50K/year</td>
    </tr>
  </tbody>
</table>

<h3>Example ICP definition</h3>
<p><strong>ICP example:</strong></p>
<ul>
  <li><strong>Company Size:</strong> 50-200 employees</li>
  <li><strong>Industry:</strong> Tech, SaaS, E-commerce</li>
  <li><strong>Geography:</strong> North America, EU</li>
  <li><strong>Need:</strong> Lead generation, sales automation</li>
  <li><strong>Budget:</strong> $10K-$50K/year</li>
  <li><strong>Technology:</strong> Use CRM (Salesforce, HubSpot)</li>
</ul>

<hr />

<h2>Practice 1 – ICP definition (25 min)</h2>
<ol>
  <li><strong>Look at your best customers:</strong> Who are the ones you work with best?</li>
  <li><strong>Write down common characteristics:</strong> Company size, industry, need, etc.</li>
  <li><strong>Create your ICP definition</strong> based on these</li>
  <li><strong>Identify 3-5 concrete example companies</strong> that fit the ICP</li>
</ol>

<h2>Practice 2 – ICP tracking table (10 min)</h2>
<p>Create a table that tracks how many leads match your ICP:</p>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <thead>
    <tr style="background-color: #FAB908; color: #000;">
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Date</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Total Leads</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">ICP Leads</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">%</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">2026-01-22</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">20</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0%</td>
    </tr>
  </tbody>
</table>

<hr />

<h2>Key Takeaways</h2>
<ul>
  <li><strong>ICP = focus.</strong> If you know who your ideal customers are, you can target better.</li>
  <li><strong>Use historical data.</strong> Look at your best customers and identify common characteristics.</li>
  <li><strong>Be specific.</strong> The more specific the ICP, the better the targeting.</li>
  <li><strong>Update regularly.</strong> ICP can change as your company evolves.</li>
</ul>

<hr />

<h2>Optional Resources</h2>
<ul>
  <li><strong>HubSpot – Ideal Customer Profile:</strong> <a href="https://blog.hubspot.com/sales/ideal-customer-profile" target="_blank" rel="noopener noreferrer">https://blog.hubspot.com/sales/ideal-customer-profile</a> – ICP fundamentals</li>
  <li><strong>Salesforce – Building Your ICP:</strong> <a href="https://www.salesforce.com/resources/articles/ideal-customer-profile/" target="_blank" rel="noopener noreferrer">https://www.salesforce.com/resources/articles/ideal-customer-profile/</a> – Building ICP</li>
</ul>
      `.trim(),
      ru: `
<h1>Идеальный профиль клиента (ICP) – С кем вы работаете?</h1>
<p><em>Сегодня вы узнаете, как определить ваш Идеальный профиль клиента (ICP). Ключ: не пытайтесь продавать всем – фокусируйтесь на тех, кто действительно купит.</em></p>
<hr />

<h2>Цель дня</h2>
<ul>
  <li>Понять, что такое ICP и почему это важно</li>
  <li>Создать определение вашего ICP (размер компании, отрасль, потребность и т.д.)</li>
  <li>Определить 3-5 конкретных примеров компаний, которые соответствуют ICP</li>
  <li>Создать таблицу отслеживания ICP</li>
</ul>
<hr />

<h2>Почему это важно</h2>
<ul>
  <li><strong>Фокус = лучшие результаты.</strong> Если знаете, кто ваши идеальные клиенты, можете лучше таргетировать.</li>
  <li><strong>Более высокая конверсия:</strong> Лиды ICP = более высокая квалификация и конверсия закрытия.</li>
  <li><strong>Быстрее продажи:</strong> Вы закрываете быстрее с идеальными клиентами.</li>
  <li><strong>Лучший опыт клиента:</strong> Идеальные клиенты лучше подходят к вашему решению.</li>
</ul>
<hr />

<h2>Объяснение</h2>

<h3>Что такое ICP?</h3>
<p><strong>ICP = Ideal Customer Profile</strong> (Идеальный профиль клиента)</p>
<p>Это детальное описание того, какие типы компаний являются вашими идеальными клиентами – теми, кто вероятно купит и останется надолго.</p>

<h3>Как определить ваш ICP?</h3>
<p>ICP имеет 5 основных компонентов:</p>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <thead>
    <tr style="background-color: #FAB908; color: #000;">
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Компонент</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Что означает</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Пример</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>1. Размер компании</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Сколько сотрудников?</td>
      <td style="padding: 12px; border: 1px solid #ddd;">50-200 сотрудников</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>2. Отрасль</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">В какой отрасли они работают?</td>
      <td style="padding: 12px; border: 1px solid #ddd;">Tech, SaaS, E-commerce</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>3. Географическое местоположение</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Где они находятся?</td>
      <td style="padding: 12px; border: 1px solid #ddd;">Северная Америка, ЕС</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>4. Потребность/Проблема</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Какую проблему они решают?</td>
      <td style="padding: 12px; border: 1px solid #ddd;">Генерация лидов, автоматизация продаж</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>5. Бюджет</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Какой у них бюджет?</td>
      <td style="padding: 12px; border: 1px solid #ddd;">$10K-$50K/год</td>
    </tr>
  </tbody>
</table>

<h3>Пример определения ICP</h3>
<p><strong>Пример ICP:</strong></p>
<ul>
  <li><strong>Размер компании:</strong> 50-200 сотрудников</li>
  <li><strong>Отрасль:</strong> Tech, SaaS, E-commerce</li>
  <li><strong>География:</strong> Северная Америка, ЕС</li>
  <li><strong>Потребность:</strong> Генерация лидов, автоматизация продаж</li>
  <li><strong>Бюджет:</strong> $10K-$50K/год</li>
  <li><strong>Технология:</strong> Используют CRM (Salesforce, HubSpot)</li>
</ul>

<hr />

<h2>Практика 1 – Определение ICP (25 мин)</h2>
<ol>
  <li><strong>Посмотрите на ваших лучших клиентов:</strong> С кем вы работаете лучше всего?</li>
  <li><strong>Запишите общие характеристики:</strong> Размер компании, отрасль, потребность и т.д.</li>
  <li><strong>Создайте определение вашего ICP</strong> на основе этого</li>
  <li><strong>Определите 3-5 конкретных примеров компаний,</strong> которые соответствуют ICP</li>
</ol>

<h2>Практика 2 – Таблица отслеживания ICP (10 мин)</h2>
<p>Создайте таблицу, которая отслеживает, сколько лидов соответствует вашему ICP:</p>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <thead>
    <tr style="background-color: #FAB908; color: #000;">
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Дата</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Всего лидов</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Лиды ICP</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">%</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">2026-01-22</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">20</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0%</td>
    </tr>
  </tbody>
</table>

<hr />

<h2>Ключевые выводы</h2>
<ul>
  <li><strong>ICP = фокус.</strong> Если знаете, кто ваши идеальные клиенты, можете лучше таргетировать.</li>
  <li><strong>Используйте исторические данные.</strong> Посмотрите на ваших лучших клиентов и определите общие характеристики.</li>
  <li><strong>Будьте конкретны.</strong> Чем конкретнее ICP, тем лучше таргетирование.</li>
  <li><strong>Обновляйте регулярно.</strong> ICP может меняться по мере развития вашей компании.</li>
</ul>

<hr />

<h2>Доп. материалы (по желанию)</h2>
<ul>
  <li><strong>HubSpot – Идеальный профиль клиента:</strong> <a href="https://blog.hubspot.com/sales/ideal-customer-profile" target="_blank" rel="noopener noreferrer">https://blog.hubspot.com/sales/ideal-customer-profile</a> – Основы ICP</li>
  <li><strong>Salesforce – Построение вашего ICP:</strong> <a href="https://www.salesforce.com/resources/articles/ideal-customer-profile/" target="_blank" rel="noopener noreferrer">https://www.salesforce.com/resources/articles/ideal-customer-profile/</a> – Построение ICP</li>
</ul>
      `.trim(),
    },
    emailSubject: {
      hu: '{{courseName}} – 7. nap: Ideális ügyfélprofil',
      en: '{{courseName}} – Day 7: Ideal Customer Profile',
      ru: '{{courseName}} – День 7: Идеальный профиль клиента',
    },
    emailBody: {
      hu: `
<h1>{{courseName}}</h1>
<h2>7. nap: Ideális ügyfélprofil</h2>
<p>Ma megtanulod, hogyan definiálod az ideális ügyfélprofilodat (ICP). A kulcs: ne próbálj mindenkinek eladni – fókuszálj azokra, akik valóban vásárolni fognak.</p>
<p><a href="{{appUrl}}/courses/{{courseId}}/day/7">Olvasd el a teljes leckét →</a></p>
      `.trim(),
      en: `
<h1>{{courseName}}</h1>
<h2>Day 7: Ideal Customer Profile</h2>
<p>Today you'll learn how to define your Ideal Customer Profile (ICP). The key: don't try to sell to everyone – focus on those who will actually buy.</p>
<p><a href="{{appUrl}}/courses/{{courseId}}/day/7">Read the full lesson →</a></p>
      `.trim(),
      ru: `
<h1>{{courseName}}</h1>
<h2>День 7: Идеальный профиль клиента</h2>
<p>Сегодня вы узнаете, как определить ваш Идеальный профиль клиента (ICP). Ключ: не пытайтесь продавать всем – фокусируйтесь на тех, кто действительно купит.</p>
<p><a href="{{appUrl}}/courses/{{courseId}}/day/7">Прочитать полный урок →</a></p>
      `.trim(),
    },
    quiz: [
      {
        q: {
          hu: 'Mit jelent az ICP?',
          en: 'What does ICP stand for?',
          ru: 'Что означает ICP?',
        },
        options: {
          hu: [
            'Ideal Customer Profile – részletes leírás arról, milyen típusú cégek az ideális ügyfeleid',
            'Internal Customer Process',
            'Ideal Company Profile',
            'Nem fontos',
          ],
          en: [
            'Ideal Customer Profile – detailed description of what type of companies are your ideal customers',
            'Internal Customer Process',
            'Ideal Company Profile',
            'Not important',
          ],
          ru: [
            'Ideal Customer Profile – детальное описание того, какие типы компаний являются вашими идеальными клиентами',
            'Internal Customer Process',
            'Ideal Company Profile',
            'Не важно',
          ],
        },
        correct: 0,
      },
      {
        q: {
          hu: 'Hány fő komponense van az ICP-nek?',
          en: 'How many main components does ICP have?',
          ru: 'Сколько основных компонентов у ICP?',
        },
        options: {
          hu: ['3', '5', '10', 'Nincs fix szám'],
          en: ['3', '5', '10', 'No fixed number'],
          ru: ['3', '5', '10', 'Нет фиксированного числа'],
        },
        correct: 1,
      },
      {
        q: {
          hu: 'Miért fontos az ICP?',
          en: 'Why is ICP important?',
          ru: 'Почему важен ICP?',
        },
        options: {
          hu: [
            'Nem fontos',
            'Fókusz = jobb eredmények. Ha tudod, kik az ideális ügyfeleid, jobban célzhatsz',
            'Csak a vezetőségnek kell',
            'Csak a marketingnek kell',
          ],
          en: [
            'Not important',
            'Focus = better results. If you know who your ideal customers are, you can target better',
            'Only management needs it',
            'Only marketing needs it',
          ],
          ru: [
            'Не важно',
            'Фокус = лучшие результаты. Если знаете, кто ваши идеальные клиенты, можете лучше таргетировать',
            'Только руководству нужно',
            'Только маркетингу нужно',
          ],
        },
        correct: 1,
      },
      {
        q: {
          hu: 'Hogyan definiálod az ICP-t?',
          en: 'How do you define your ICP?',
          ru: 'Как вы определяете ваш ICP?',
        },
        options: {
          hu: [
            'Véletlenszerűen',
            'Nézd meg a legjobb ügyfeleidet, és azonosítsd a közös jellemzőket',
            'Csak a cégméret számít',
            'Ne definiáld',
          ],
          en: [
            'Randomly',
            'Look at your best customers and identify common characteristics',
            'Only company size matters',
            'Don\'t define it',
          ],
          ru: [
            'Случайно',
            'Посмотрите на ваших лучших клиентов и определите общие характеристики',
            'Важен только размер компании',
            'Не определяйте',
          ],
        },
        correct: 1,
      },
      {
        q: {
          hu: 'Milyen gyakran frissítsd az ICP-t?',
          en: 'How often should you update your ICP?',
          ru: 'Как часто следует обновлять ваш ICP?',
        },
        options: {
          hu: [
            'Soha',
            'Rendszeresen, ahogy a vállalatod fejlődik',
            'Csak évente',
            'Csak havonta',
          ],
          en: [
            'Never',
            'Regularly, as your company evolves',
            'Only yearly',
            'Only monthly',
          ],
          ru: [
            'Никогда',
            'Регулярно, по мере развития вашей компании',
            'Только ежегодно',
            'Только ежемесячно',
          ],
        },
        correct: 1,
      },
    ],
  },
  // Day 8: Qualification Questions & Scripts
  {
    day: 8,
    title: {
      hu: 'Minősítési kérdések és szkriptek – Mit kérdezz, hogy minősíts?',
      en: 'Qualification Questions & Scripts – What to Ask to Qualify?',
      ru: 'Вопросы квалификации и скрипты – Что спрашивать для квалификации?',
    },
    content: {
      hu: `
<h1>Minősítési kérdések és szkriptek – Mit kérdezz, hogy minősíts?</h1>
<p><em>Ma megtanulod, milyen kérdéseket tegyél fel a minősítéshez, és hogyan építsd fel a beszélgetést. A kulcs: kérdezz, ne csak mutass be!</em></p>
<hr />

<h2>Napi cél</h2>
<ul>
  <li>Megérteni a minősítési kérdések típusait</li>
  <li>Létrehozni a saját minősítési kérdés listádat (BANT vagy MEDDIC alapján)</li>
  <li>Létrehozni egy minősítési szkriptet</li>
  <li>Gyakorolni a minősítési beszélgetést</li>
</ul>
<hr />

<h2>Miért fontos ez?</h2>
<ul>
  <li><strong>Jobb minősítés = jobb eredmények.</strong> Ha jól minősítesz, jobban tudod, kik fognak vásárolni.</li>
  <li><strong>Idő megtakarítás:</strong> Ne pazarold az idődet olyan lead-ekre, akik nem fognak vásárolni.</li>
  <li><strong>Jobb előrejelzés:</strong> Minősített lead-ek = pontosabb előrejelzés.</li>
  <li><strong>Professzionális megjelenés:</strong> Jó kérdések = professzionális értékesítő.</li>
</ul>
<hr />

<h2>Elmagyarázás</h2>

<h3>Minősítési kérdések típusai</h3>
<p>3 fő típus:</p>
<ol>
  <li><strong>Nyitott kérdések:</strong> "Mi a fő probléma, amit meg kell oldani?" (nem "Igen/Nem" válasz)</li>
  <li><strong>Követő kérdések:</strong> "Miért fontos ez most?" (mélyítés)</li>
  <li><strong>Záró kérdések:</strong> "Mikorra kell megoldani?" (konkrét válasz)</li>
</ol>

<h3>BANT minősítési kérdések példa</h3>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <thead>
    <tr style="background-color: #FAB908; color: #000;">
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Kritérium</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Példa kérdés</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>Budget</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">"Milyen költségvetés áll rendelkezésre erre a projektre?"</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>Authority</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">"Ki hozza meg a végső döntést a vásárlásról?"</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>Need</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">"Mi a fő probléma, amit meg kell oldani?"</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>Timeline</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">"Mikorra kell megoldani ezt a problémát?"</td>
    </tr>
  </tbody>
</table>

<h3>Minősítési szkript struktúra</h3>
<ol>
  <li><strong>Bevezetés (30 mp):</strong> Köszöntés, bemutatkozás, cél</li>
  <li><strong>Felfedezés (5-10 perc):</strong> Minősítési kérdések (BANT vagy MEDDIC)</li>
  <li><strong>Összefoglalás (1 perc):</strong> "Tehát a fő probléma X, és Y időkeretben kell megoldani?"</li>
  <li><strong>Következő lépés (1 perc):</strong> "Szeretnél egy bemutatót látni?"</li>
</ol>

<h3>Jó vs. rossz minősítési kérdések</h3>
<p><strong>Rossz példa:</strong></p>
<ul>
  <li>"Érdekelne a megoldásunk?" (zárt kérdés, könnyű "Igen" válasz)</li>
  <li>"Van költségvetés?" (túl közvetlen, védőválasz)</li>
</ul>

<p><strong>Jó példa:</strong></p>
<ul>
  <li>"Mi a fő kihívás, amit most meg kell oldani?" (nyitott, problémára fókuszál)</li>
  <li>"Hogyan oldanád meg ezt jelenleg?" (megérti a jelenlegi helyzetet)</li>
  <li>"Mekkora hatása van ennek a problémának a vállalatra?" (érték/fájdalom mélysége)</li>
</ul>

<hr />

<h2>Gyakorlat 1 – Minősítési kérdés lista (20 perc)</h2>
<ol>
  <li><strong>Válaszd ki a keretrendszert</strong> (BANT vagy MEDDIC)</li>
  <li><strong>Írj le 3-5 kérdést minden kritériumhoz</strong></li>
  <li><strong>Gyakorold hangosan</strong> – hogyan hangzanak természetesen?</li>
</ol>

<h2>Gyakorlat 2 – Minősítési szkript (15 perc)</h2>
<ol>
  <li><strong>Írd le a teljes minősítési szkriptet</strong> (bevezetés → felfedezés → összefoglalás → következő lépés)</li>
  <li><strong>Gyakorold egy kollégával</strong> vagy magadban</li>
  <li><strong>Időzd le:</strong> Mennyi időt töltesz minősítéssel? (cél: 5-10 perc)</li>
</ol>

<hr />

<h2>Kulcs tanulságok</h2>
<ul>
  <li><strong>Kérdezz, ne csak mutass be.</strong> A minősítés = felfedezés, nem prezentáció.</li>
  <li><strong>Használj nyitott kérdéseket.</strong> "Mi", "Hogyan", "Miért" – nem "Igen/Nem".</li>
  <li><strong>Hallgass többet, mint beszélsz.</strong> 70% hallgatás, 30% beszéd.</li>
  <li><strong>Dokumentáld a válaszokat.</strong> Írd le, mit mondott a lead, hogy később hivatkozhass rá.</li>
</ul>

<hr />

<h2>További anyagok (választható)</h2>
<ul>
  <li><strong>HubSpot – Sales Qualification Questions:</strong> <a href="https://blog.hubspot.com/sales/qualification-questions" target="_blank" rel="noopener noreferrer">https://blog.hubspot.com/sales/qualification-questions</a> – Minősítési kérdések</li>
  <li><strong>Salesforce – Discovery Call Script:</strong> <a href="https://www.salesforce.com/resources/articles/discovery-call-script/" target="_blank" rel="noopener noreferrer">https://www.salesforce.com/resources/articles/discovery-call-script/</a> – Felfedező hívás szkript</li>
</ul>
      `.trim(),
      en: `
<h1>Qualification Questions & Scripts – What to Ask to Qualify?</h1>
<p><em>Today you'll learn what questions to ask for qualification and how to structure the conversation. The key: ask, don't just present!</em></p>
<hr />

<h2>Daily Goal</h2>
<ul>
  <li>Understand types of qualification questions</li>
  <li>Create your own qualification question list (based on BANT or MEDDIC)</li>
  <li>Create a qualification script</li>
  <li>Practice the qualification conversation</li>
</ul>
<hr />

<h2>Why it matters</h2>
<ul>
  <li><strong>Better qualification = better results.</strong> If you qualify well, you better know who will buy.</li>
  <li><strong>Time savings:</strong> Don't waste time on leads who won't buy.</li>
  <li><strong>Better forecasting:</strong> Qualified leads = more accurate forecast.</li>
  <li><strong>Professional appearance:</strong> Good questions = professional salesperson.</li>
</ul>
<hr />

<h2>Explanation</h2>

<h3>Types of qualification questions</h3>
<p>3 main types:</p>
<ol>
  <li><strong>Open questions:</strong> "What is the main problem that needs to be solved?" (not "Yes/No" answer)</li>
  <li><strong>Follow-up questions:</strong> "Why is this important now?" (deepening)</li>
  <li><strong>Closing questions:</strong> "When does this need to be solved?" (concrete answer)</li>
</ol>

<h3>BANT qualification questions example</h3>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <thead>
    <tr style="background-color: #FAB908; color: #000;">
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Criterion</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Example question</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>Budget</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">"What budget is available for this project?"</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>Authority</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">"Who makes the final decision on the purchase?"</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>Need</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">"What is the main problem that needs to be solved?"</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>Timeline</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">"When does this problem need to be solved?"</td>
    </tr>
  </tbody>
</table>

<h3>Qualification script structure</h3>
<ol>
  <li><strong>Introduction (30 sec):</strong> Greeting, introduction, purpose</li>
  <li><strong>Discovery (5-10 min):</strong> Qualification questions (BANT or MEDDIC)</li>
  <li><strong>Summary (1 min):</strong> "So the main problem is X, and it needs to be solved in Y timeframe?"</li>
  <li><strong>Next step (1 min):</strong> "Would you like to see a demo?"</li>
</ol>

<h3>Good vs. bad qualification questions</h3>
<p><strong>Bad example:</strong></p>
<ul>
  <li>"Are you interested in our solution?" (closed question, easy "Yes" answer)</li>
  <li>"Do you have a budget?" (too direct, defensive answer)</li>
</ul>

<p><strong>Good example:</strong></p>
<ul>
  <li>"What is the main challenge you need to solve now?" (open, focuses on problem)</li>
  <li>"How are you solving this currently?" (understands current situation)</li>
  <li>"What impact does this problem have on the company?" (value/pain depth)</li>
</ul>

<hr />

<h2>Practice 1 – Qualification question list (20 min)</h2>
<ol>
  <li><strong>Choose your framework</strong> (BANT or MEDDIC)</li>
  <li><strong>Write down 3-5 questions for each criterion</strong></li>
  <li><strong>Practice out loud</strong> – how do they sound natural?</li>
</ol>

<h2>Practice 2 – Qualification script (15 min)</h2>
<ol>
  <li><strong>Write down the complete qualification script</strong> (introduction → discovery → summary → next step)</li>
  <li><strong>Practice with a colleague</strong> or by yourself</li>
  <li><strong>Time it:</strong> How long do you spend qualifying? (target: 5-10 min)</li>
</ol>

<hr />

<h2>Key Takeaways</h2>
<ul>
  <li><strong>Ask, don't just present.</strong> Qualification = discovery, not presentation.</li>
  <li><strong>Use open questions.</strong> "What", "How", "Why" – not "Yes/No".</li>
  <li><strong>Listen more than you talk.</strong> 70% listening, 30% talking.</li>
  <li><strong>Document the answers.</strong> Write down what the lead said so you can reference it later.</li>
</ul>

<hr />

<h2>Optional Resources</h2>
<ul>
  <li><strong>HubSpot – Sales Qualification Questions:</strong> <a href="https://blog.hubspot.com/sales/qualification-questions" target="_blank" rel="noopener noreferrer">https://blog.hubspot.com/sales/qualification-questions</a> – Qualification questions</li>
  <li><strong>Salesforce – Discovery Call Script:</strong> <a href="https://www.salesforce.com/resources/articles/discovery-call-script/" target="_blank" rel="noopener noreferrer">https://www.salesforce.com/resources/articles/discovery-call-script/</a> – Discovery call script</li>
</ul>
      `.trim(),
      ru: `
<h1>Вопросы квалификации и скрипты – Что спрашивать для квалификации?</h1>
<p><em>Сегодня вы узнаете, какие вопросы задавать для квалификации и как структурировать разговор. Ключ: спрашивайте, не просто представляйте!</em></p>
<hr />

<h2>Цель дня</h2>
<ul>
  <li>Понять типы вопросов квалификации</li>
  <li>Создать свой список вопросов квалификации (на основе BANT или MEDDIC)</li>
  <li>Создать скрипт квалификации</li>
  <li>Попрактиковать разговор квалификации</li>
</ul>
<hr />

<h2>Почему это важно</h2>
<ul>
  <li><strong>Лучшая квалификация = лучшие результаты.</strong> Если хорошо квалифицируете, лучше знаете, кто купит.</li>
  <li><strong>Экономия времени:</strong> Не тратьте время на лиды, которые не купят.</li>
  <li><strong>Лучшее прогнозирование:</strong> Квалифицированные лиды = более точный прогноз.</li>
  <li><strong>Профессиональный вид:</strong> Хорошие вопросы = профессиональный продавец.</li>
</ul>
<hr />

<h2>Объяснение</h2>

<h3>Типы вопросов квалификации</h3>
<p>3 основных типа:</p>
<ol>
  <li><strong>Открытые вопросы:</strong> "В чем основная проблема, которую нужно решить?" (не ответ "Да/Нет")</li>
  <li><strong>Уточняющие вопросы:</strong> "Почему это важно сейчас?" (углубление)</li>
  <li><strong>Закрывающие вопросы:</strong> "Когда нужно решить это?" (конкретный ответ)</li>
</ol>

<h3>Пример вопросов квалификации BANT</h3>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <thead>
    <tr style="background-color: #FAB908; color: #000;">
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Критерий</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Пример вопроса</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>Budget</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">"Какой бюджет доступен для этого проекта?"</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>Authority</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">"Кто принимает окончательное решение о покупке?"</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>Need</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">"В чем основная проблема, которую нужно решить?"</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>Timeline</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">"Когда нужно решить эту проблему?"</td>
    </tr>
  </tbody>
</table>

<h3>Структура скрипта квалификации</h3>
<ol>
  <li><strong>Введение (30 сек):</strong> Приветствие, представление, цель</li>
  <li><strong>Исследование (5-10 мин):</strong> Вопросы квалификации (BANT или MEDDIC)</li>
  <li><strong>Резюме (1 мин):</strong> "Итак, основная проблема X, и нужно решить в срок Y?"</li>
  <li><strong>Следующий шаг (1 мин):</strong> "Хотели бы увидеть демо?"</li>
</ol>

<h3>Хорошие vs. плохие вопросы квалификации</h3>
<p><strong>Плохой пример:</strong></p>
<ul>
  <li>"Вас интересует наше решение?" (закрытый вопрос, легкий ответ "Да")</li>
  <li>"Есть ли у вас бюджет?" (слишком прямой, защитный ответ)</li>
</ul>

<p><strong>Хороший пример:</strong></p>
<ul>
  <li>"В чем основная проблема, которую нужно решить сейчас?" (открытый, фокусируется на проблеме)</li>
  <li>"Как вы решаете это сейчас?" (понимает текущую ситуацию)</li>
  <li>"Какое влияние эта проблема оказывает на компанию?" (глубина ценности/боли)</li>
</ul>

<hr />

<h2>Практика 1 – Список вопросов квалификации (20 мин)</h2>
<ol>
  <li><strong>Выберите ваш фреймворк</strong> (BANT или MEDDIC)</li>
  <li><strong>Запишите 3-5 вопросов для каждого критерия</strong></li>
  <li><strong>Попрактикуйте вслух</strong> – как они звучат естественно?</li>
</ol>

<h2>Практика 2 – Скрипт квалификации (15 мин)</h2>
<ol>
  <li><strong>Запишите полный скрипт квалификации</strong> (введение → исследование → резюме → следующий шаг)</li>
  <li><strong>Попрактикуйте с коллегой</strong> или самостоятельно</li>
  <li><strong>Засеките время:</strong> Сколько времени тратите на квалификацию? (цель: 5-10 мин)</li>
</ol>

<hr />

<h2>Ключевые выводы</h2>
<ul>
  <li><strong>Спрашивайте, не просто представляйте.</strong> Квалификация = исследование, а не презентация.</li>
  <li><strong>Используйте открытые вопросы.</strong> "Что", "Как", "Почему" – не "Да/Нет".</li>
  <li><strong>Слушайте больше, чем говорите.</strong> 70% слушание, 30% речь.</li>
  <li><strong>Документируйте ответы.</strong> Запишите, что сказал лид, чтобы можно было ссылаться позже.</li>
</ul>

<hr />

<h2>Доп. материалы (по желанию)</h2>
<ul>
  <li><strong>HubSpot – Вопросы квалификации продаж:</strong> <a href="https://blog.hubspot.com/sales/qualification-questions" target="_blank" rel="noopener noreferrer">https://blog.hubspot.com/sales/qualification-questions</a> – Вопросы квалификации</li>
  <li><strong>Salesforce – Скрипт исследовательского звонка:</strong> <a href="https://www.salesforce.com/resources/articles/discovery-call-script/" target="_blank" rel="noopener noreferrer">https://www.salesforce.com/resources/articles/discovery-call-script/</a> – Скрипт исследовательского звонка</li>
</ul>
      `.trim(),
    },
    emailSubject: {
      hu: '{{courseName}} – 8. nap: Minősítési kérdések és szkriptek',
      en: '{{courseName}} – Day 8: Qualification Questions & Scripts',
      ru: '{{courseName}} – День 8: Вопросы квалификации и скрипты',
    },
    emailBody: {
      hu: `
<h1>{{courseName}}</h1>
<h2>8. nap: Minősítési kérdések és szkriptek</h2>
<p>Ma megtanulod, milyen kérdéseket tegyél fel a minősítéshez, és hogyan építsd fel a beszélgetést. A kulcs: kérdezz, ne csak mutass be!</p>
<p><a href="{{appUrl}}/courses/{{courseId}}/day/8">Olvasd el a teljes leckét →</a></p>
      `.trim(),
      en: `
<h1>{{courseName}}</h1>
<h2>Day 8: Qualification Questions & Scripts</h2>
<p>Today you'll learn what questions to ask for qualification and how to structure the conversation. The key: ask, don't just present!</p>
<p><a href="{{appUrl}}/courses/{{courseId}}/day/8">Read the full lesson →</a></p>
      `.trim(),
      ru: `
<h1>{{courseName}}</h1>
<h2>День 8: Вопросы квалификации и скрипты</h2>
<p>Сегодня вы узнаете, какие вопросы задавать для квалификации и как структурировать разговор. Ключ: спрашивайте, не просто представляйте!</p>
<p><a href="{{appUrl}}/courses/{{courseId}}/day/8">Прочитать полный урок →</a></p>
      `.trim(),
    },
    quiz: [
      {
        q: {
          hu: 'Milyen típusú kérdéseket használj a minősítéshez?',
          en: 'What type of questions do you use for qualification?',
          ru: 'Какой тип вопросов вы используете для квалификации?',
        },
        options: {
          hu: [
            'Csak zárt kérdéseket (Igen/Nem)',
            'Nyitott kérdéseket (Mi, Hogyan, Miért) – nem Igen/Nem válasz',
            'Csak a költségvetésre kérdezz',
            'Ne kérdezz semmit',
          ],
          en: [
            'Only closed questions (Yes/No)',
            'Open questions (What, How, Why) – not Yes/No answer',
            'Only ask about budget',
            'Don\'t ask anything',
          ],
          ru: [
            'Только закрытые вопросы (Да/Нет)',
            'Открытые вопросы (Что, Как, Почему) – не ответ Да/Нет',
            'Только спрашивайте о бюджете',
            'Ничего не спрашивайте',
          ],
        },
        correct: 1,
      },
      {
        q: {
          hu: 'Mennyi időt töltesz minősítéssel egy beszélgetésben?',
          en: 'How much time do you spend qualifying in a conversation?',
          ru: 'Сколько времени вы тратите на квалификацию в разговоре?',
        },
        options: {
          hu: ['1 perc', '5-10 perc', '30 perc', '1 óra'],
          en: ['1 minute', '5-10 minutes', '30 minutes', '1 hour'],
          ru: ['1 минута', '5-10 минут', '30 минут', '1 час'],
        },
        correct: 1,
      },
      {
        q: {
          hu: 'Mi a minősítési szkript struktúrája?',
          en: 'What is the qualification script structure?',
          ru: 'Какова структура скрипта квалификации?',
        },
        options: {
          hu: [
            'Csak bemutatkozás',
            'Bevezetés → Felfedezés → Összefoglalás → Következő lépés',
            'Csak felfedezés',
            'Nincs struktúra',
          ],
          en: [
            'Just introduction',
            'Introduction → Discovery → Summary → Next step',
            'Just discovery',
            'No structure',
          ],
          ru: [
            'Просто введение',
            'Введение → Исследование → Резюме → Следующий шаг',
            'Просто исследование',
            'Нет структуры',
          ],
        },
        correct: 1,
      },
      {
        q: {
          hu: 'Mennyit kell hallgatnod vs. beszélned egy minősítési beszélgetésben?',
          en: 'How much should you listen vs. talk in a qualification conversation?',
          ru: 'Сколько вы должны слушать vs. говорить в разговоре квалификации?',
        },
        options: {
          hu: [
            'Csak beszélj',
            '70% hallgatás, 30% beszéd',
            '50-50',
            'Csak hallgass',
          ],
          en: [
            'Just talk',
            '70% listening, 30% talking',
            '50-50',
            'Just listen',
          ],
          ru: [
            'Просто говорите',
            '70% слушание, 30% речь',
            '50-50',
            'Просто слушайте',
          ],
        },
        correct: 1,
      },
      {
        q: {
          hu: 'Miért fontos dokumentálni a minősítési válaszokat?',
          en: 'Why is it important to document qualification answers?',
          ru: 'Почему важно документировать ответы квалификации?',
        },
        options: {
          hu: [
            'Nem fontos',
            'Hogy később hivatkozhass rá, és ne kelljen újra kérdezned',
            'Csak a vezetőségnek kell',
            'Csak a CRM-ben kell',
          ],
          en: [
            'Not important',
            'To reference later and not have to ask again',
            'Only management needs it',
            'Only needed in CRM',
          ],
          ru: [
            'Не важно',
            'Чтобы ссылаться позже и не нужно было спрашивать снова',
            'Только руководству нужно',
            'Нужно только в CRM',
          ],
        },
        correct: 1,
      },
    ],
  },
  // Day 9: Lead Scoring & Prioritization
  {
    day: 9,
    title: {
      hu: 'Lead pontozás és prioritizálás – Melyik lead-et kezeld először?',
      en: 'Lead Scoring & Prioritization – Which Lead Do You Handle First?',
      ru: 'Скоринг лидов и приоритизация – Какой лид обработать первым?',
    },
    content: {
      hu: `
<h1>Lead pontozás és prioritizálás – Melyik lead-et kezeld először?</h1>
<p><em>Ma megtanulod, hogyan pontozd és prioritizáld a lead-eket. A kulcs: ne kezeld őket egyenlően – fókuszálj a legjobbakra!</em></p>
<hr />

<h2>Napi cél</h2>
<ul>
  <li>Megérteni, mi a lead scoring és miért fontos</li>
  <li>Létrehozni egy egyszerű lead scoring rendszert</li>
  <li>Létrehozni egy prioritizációs táblázatot</li>
  <li>Beállítani napi rutint a lead prioritizáláshoz</li>
</ul>
<hr />

<h2>Miért fontos ez?</h2>
<ul>
  <li><strong>Idő optimalizálás:</strong> Ne pazarold az idődet alacsony értékű lead-ekre.</li>
  <li><strong>Jobb konverzió:</strong> Ha a legjobb lead-eket kezeled először, többet zársz le.</li>
  <li><strong>Jobb előrejelzés:</strong> Pontozott lead-ek = pontosabb előrejelzés.</li>
  <li><strong>Stressz csökkentés:</strong> Ha tudod, mit kell először csinálni, kevesebb a stressz.</li>
</ul>
<hr />

<h2>Elmagyarázás</h2>

<h3>Mi a lead scoring?</h3>
<p><strong>Lead scoring = pontrendszer, amely segít rangsorolni a lead-eket vásárlási valószínűség szerint.</strong></p>
<p>Példa: 100 pontos rendszer, ahol 80+ pont = magas prioritás, 50-79 = közepes, 0-49 = alacsony.</p>

<h3>Egyszerű lead scoring rendszer</h3>
<p>5 fő tényező, mindegyik 0-20 pont:</p>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <thead>
    <tr style="background-color: #FAB908; color: #000;">
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Tényező</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">0-20 pont</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Példa</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>ICP egyezés</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0-20</td>
      <td style="padding: 12px; border: 1px solid #ddd;">Tökéletes egyezés = 20, részleges = 10, nincs = 0</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>Szükséglet erőssége</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0-20</td>
      <td style="padding: 12px; border: 1px solid #ddd;">Sürgős = 20, közepes = 10, gyenge = 5</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>Költségvetés</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0-20</td>
      <td style="padding: 12px; border: 1px solid #ddd;">Van és megfelelő = 20, van de kicsi = 10, nincs = 0</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>Döntési jogkör</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0-20</td>
      <td style="padding: 12px; border: 1px solid #ddd;">Döntéshozó = 20, befolyásoló = 10, felhasználó = 5</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>Timeline</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0-20</td>
      <td style="padding: 12px; border: 1px solid #ddd;">30 napon belül = 20, 60 nap = 10, 90+ nap = 5</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>ÖSSZESEN</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;"><strong>0-100</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>80+ = Magas, 50-79 = Közepes, 0-49 = Alacsony</strong></td>
    </tr>
  </tbody>
</table>

<h3>Prioritizációs rendszer</h3>
<p>A pontszám alapján:</p>
<ul>
  <li><strong>Magas prioritás (80+ pont):</strong> Kezeld azonnal, napi 1-2 lead</li>
  <li><strong>Közepes prioritás (50-79 pont):</strong> Kezeld ezen a héten, heti 5-10 lead</li>
  <li><strong>Alacsony prioritás (0-49 pont):</strong> Kezeld, ha van idő, vagy automatikus email kampány</li>
</ul>

<hr />

<h2>Gyakorlat 1 – Lead scoring rendszer (20 perc)</h2>
<ol>
  <li><strong>Hozd létre a saját lead scoring rendszeredet</strong> (5 tényező, 0-20 pont mindegyik)</li>
  <li><strong>Pontozz 3-5 meglévő lead-et</strong> ezzel a rendszerrel</li>
  <li><strong>Rangsorold őket</strong> pontszám szerint</li>
</ol>

<h2>Gyakorlat 2 – Prioritizációs táblázat (15 perc)</h2>
<p>Hozz létre egy prioritizációs táblázatot:</p>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <thead>
    <tr style="background-color: #FAB908; color: #000;">
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Lead</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Pontszám</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Prioritás</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Kezelés</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">Példa Cég A</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">85</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">Magas</td>
      <td style="padding: 12px; border: 1px solid #ddd;">Azonnal</td>
    </tr>
  </tbody>
</table>

<hr />

<h2>Kulcs tanulságok</h2>
<ul>
  <li><strong>Ne kezeld egyenlően.</strong> A legjobb lead-eket kezeld először.</li>
  <li><strong>Használj egy rendszert.</strong> Ne "érzés" alapján dönts, hanem pontszám alapján.</li>
  <li><strong>Frissítsd rendszeresen.</strong> A lead pontszáma változhat (pl. új információ).</li>
  <li><strong>Légy konzisztens.</strong> Ugyanazt a rendszert használd minden lead-re.</li>
</ul>

<hr />

<h2>További anyagok (választható)</h2>
<ul>
  <li><strong>HubSpot – Lead Scoring:</strong> <a href="https://blog.hubspot.com/marketing/lead-scoring" target="_blank" rel="noopener noreferrer">https://blog.hubspot.com/marketing/lead-scoring</a> – Lead scoring alapok</li>
  <li><strong>Salesforce – Lead Prioritization:</strong> <a href="https://www.salesforce.com/resources/articles/lead-prioritization/" target="_blank" rel="noopener noreferrer">https://www.salesforce.com/resources/articles/lead-prioritization/</a> – Lead prioritizálás</li>
</ul>
      `.trim(),
      en: `
<h1>Lead Scoring & Prioritization – Which Lead Do You Handle First?</h1>
<p><em>Today you'll learn how to score and prioritize leads. The key: don't treat them equally – focus on the best ones!</em></p>
<hr />

<h2>Daily Goal</h2>
<ul>
  <li>Understand what lead scoring is and why it matters</li>
  <li>Create a simple lead scoring system</li>
  <li>Create a prioritization table</li>
  <li>Set up daily routine for lead prioritization</li>
</ul>
<hr />

<h2>Why it matters</h2>
<ul>
  <li><strong>Time optimization:</strong> Don't waste time on low-value leads.</li>
  <li><strong>Better conversion:</strong> If you handle the best leads first, you close more.</li>
  <li><strong>Better forecasting:</strong> Scored leads = more accurate forecast.</li>
  <li><strong>Stress reduction:</strong> If you know what to do first, less stress.</li>
</ul>
<hr />

<h2>Explanation</h2>

<h3>What is lead scoring?</h3>
<p><strong>Lead scoring = point system that helps rank leads by purchase probability.</strong></p>
<p>Example: 100-point system where 80+ points = high priority, 50-79 = medium, 0-49 = low.</p>

<h3>Simple lead scoring system</h3>
<p>5 main factors, each 0-20 points:</p>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <thead>
    <tr style="background-color: #FAB908; color: #000;">
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Factor</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">0-20 points</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Example</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>ICP Match</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0-20</td>
      <td style="padding: 12px; border: 1px solid #ddd;">Perfect match = 20, partial = 10, none = 0</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>Need Strength</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0-20</td>
      <td style="padding: 12px; border: 1px solid #ddd;">Urgent = 20, medium = 10, weak = 5</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>Budget</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0-20</td>
      <td style="padding: 12px; border: 1px solid #ddd;">Has and adequate = 20, has but small = 10, none = 0</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>Authority</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0-20</td>
      <td style="padding: 12px; border: 1px solid #ddd;">Decision maker = 20, influencer = 10, user = 5</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>Timeline</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0-20</td>
      <td style="padding: 12px; border: 1px solid #ddd;">Within 30 days = 20, 60 days = 10, 90+ days = 5</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>TOTAL</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;"><strong>0-100</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>80+ = High, 50-79 = Medium, 0-49 = Low</strong></td>
    </tr>
  </tbody>
</table>

<h3>Prioritization system</h3>
<p>Based on score:</p>
<ul>
  <li><strong>High priority (80+ points):</strong> Handle immediately, 1-2 leads daily</li>
  <li><strong>Medium priority (50-79 points):</strong> Handle this week, 5-10 leads weekly</li>
  <li><strong>Low priority (0-49 points):</strong> Handle when time allows, or automated email campaign</li>
</ul>

<hr />

<h2>Practice 1 – Lead scoring system (20 min)</h2>
<ol>
  <li><strong>Create your own lead scoring system</strong> (5 factors, 0-20 points each)</li>
  <li><strong>Score 3-5 existing leads</strong> using this system</li>
  <li><strong>Rank them</strong> by score</li>
</ol>

<h2>Practice 2 – Prioritization table (15 min)</h2>
<p>Create a prioritization table:</p>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <thead>
    <tr style="background-color: #FAB908; color: #000;">
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Lead</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Score</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Priority</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Action</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">Example Company A</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">85</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">High</td>
      <td style="padding: 12px; border: 1px solid #ddd;">Immediately</td>
    </tr>
  </tbody>
</table>

<hr />

<h2>Key Takeaways</h2>
<ul>
  <li><strong>Don't treat equally.</strong> Handle the best leads first.</li>
  <li><strong>Use a system.</strong> Don't decide based on "feeling", but on score.</li>
  <li><strong>Update regularly.</strong> Lead score can change (e.g., new information).</li>
  <li><strong>Be consistent.</strong> Use the same system for every lead.</li>
</ul>

<hr />

<h2>Optional Resources</h2>
<ul>
  <li><strong>HubSpot – Lead Scoring:</strong> <a href="https://blog.hubspot.com/marketing/lead-scoring" target="_blank" rel="noopener noreferrer">https://blog.hubspot.com/marketing/lead-scoring</a> – Lead scoring fundamentals</li>
  <li><strong>Salesforce – Lead Prioritization:</strong> <a href="https://www.salesforce.com/resources/articles/lead-prioritization/" target="_blank" rel="noopener noreferrer">https://www.salesforce.com/resources/articles/lead-prioritization/</a> – Lead prioritization</li>
</ul>
      `.trim(),
      ru: `
<h1>Скоринг лидов и приоритизация – Какой лид обработать первым?</h1>
<p><em>Сегодня вы узнаете, как оценивать и приоритизировать лиды. Ключ: не относитесь к ним одинаково – фокусируйтесь на лучших!</em></p>
<hr />

<h2>Цель дня</h2>
<ul>
  <li>Понять, что такое скоринг лидов и почему это важно</li>
  <li>Создать простую систему скоринга лидов</li>
  <li>Создать таблицу приоритизации</li>
  <li>Настроить ежедневную рутину для приоритизации лидов</li>
</ul>
<hr />

<h2>Почему это важно</h2>
<ul>
  <li><strong>Оптимизация времени:</strong> Не тратьте время на лиды с низкой ценностью.</li>
  <li><strong>Лучшая конверсия:</strong> Если обрабатываете лучшие лиды первыми, закрываете больше.</li>
  <li><strong>Лучшее прогнозирование:</strong> Оцененные лиды = более точный прогноз.</li>
  <li><strong>Снижение стресса:</strong> Если знаете, что делать первым, меньше стресса.</li>
</ul>
<hr />

<h2>Объяснение</h2>

<h3>Что такое скоринг лидов?</h3>
<p><strong>Скоринг лидов = система баллов, которая помогает ранжировать лиды по вероятности покупки.</strong></p>
<p>Пример: 100-балльная система, где 80+ баллов = высокий приоритет, 50-79 = средний, 0-49 = низкий.</p>

<h3>Простая система скоринга лидов</h3>
<p>5 основных факторов, каждый 0-20 баллов:</p>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <thead>
    <tr style="background-color: #FAB908; color: #000;">
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Фактор</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">0-20 баллов</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Пример</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>Соответствие ICP</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0-20</td>
      <td style="padding: 12px; border: 1px solid #ddd;">Идеальное соответствие = 20, частичное = 10, нет = 0</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>Сила потребности</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0-20</td>
      <td style="padding: 12px; border: 1px solid #ddd;">Срочно = 20, среднее = 10, слабое = 5</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>Бюджет</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0-20</td>
      <td style="padding: 12px; border: 1px solid #ddd;">Есть и достаточный = 20, есть но маленький = 10, нет = 0</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>Полномочия</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0-20</td>
      <td style="padding: 12px; border: 1px solid #ddd;">Лицо, принимающее решение = 20, влияющий = 10, пользователь = 5</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>Timeline</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0-20</td>
      <td style="padding: 12px; border: 1px solid #ddd;">В течение 30 дней = 20, 60 дней = 10, 90+ дней = 5</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>ИТОГО</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;"><strong>0-100</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>80+ = Высокий, 50-79 = Средний, 0-49 = Низкий</strong></td>
    </tr>
  </tbody>
</table>

<h3>Система приоритизации</h3>
<p>На основе баллов:</p>
<ul>
  <li><strong>Высокий приоритет (80+ баллов):</strong> Обработайте немедленно, 1-2 лида ежедневно</li>
  <li><strong>Средний приоритет (50-79 баллов):</strong> Обработайте на этой неделе, 5-10 лидов еженедельно</li>
  <li><strong>Низкий приоритет (0-49 баллов):</strong> Обработайте, когда есть время, или автоматическая email кампания</li>
</ul>

<hr />

<h2>Практика 1 – Система скоринга лидов (20 мин)</h2>
<ol>
  <li><strong>Создайте свою систему скоринга лидов</strong> (5 факторов, 0-20 баллов каждый)</li>
  <li><strong>Оцените 3-5 существующих лидов</strong> используя эту систему</li>
  <li><strong>Ранжируйте их</strong> по баллам</li>
</ol>

<h2>Практика 2 – Таблица приоритизации (15 мин)</h2>
<p>Создайте таблицу приоритизации:</p>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <thead>
    <tr style="background-color: #FAB908; color: #000;">
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Лид</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Баллы</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Приоритет</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Действие</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">Пример Компания A</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">85</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">Высокий</td>
      <td style="padding: 12px; border: 1px solid #ddd;">Немедленно</td>
    </tr>
  </tbody>
</table>

<hr />

<h2>Ключевые выводы</h2>
<ul>
  <li><strong>Не относитесь одинаково.</strong> Обрабатывайте лучшие лиды первыми.</li>
  <li><strong>Используйте систему.</strong> Не решайте на основе "чувства", а на основе баллов.</li>
  <li><strong>Обновляйте регулярно.</strong> Баллы лида могут меняться (например, новая информация).</li>
  <li><strong>Будьте последовательны.</strong> Используйте ту же систему для каждого лида.</li>
</ul>

<hr />

<h2>Доп. материалы (по желанию)</h2>
<ul>
  <li><strong>HubSpot – Скоринг лидов:</strong> <a href="https://blog.hubspot.com/marketing/lead-scoring" target="_blank" rel="noopener noreferrer">https://blog.hubspot.com/marketing/lead-scoring</a> – Основы скоринга лидов</li>
  <li><strong>Salesforce – Приоритизация лидов:</strong> <a href="https://www.salesforce.com/resources/articles/lead-prioritization/" target="_blank" rel="noopener noreferrer">https://www.salesforce.com/resources/articles/lead-prioritization/</a> – Приоритизация лидов</li>
</ul>
      `.trim(),
    },
    emailSubject: {
      hu: '{{courseName}} – 9. nap: Lead pontozás és prioritizálás',
      en: '{{courseName}} – Day 9: Lead Scoring & Prioritization',
      ru: '{{courseName}} – День 9: Скоринг лидов и приоритизация',
    },
    emailBody: {
      hu: `
<h1>{{courseName}}</h1>
<h2>9. nap: Lead pontozás és prioritizálás</h2>
<p>Ma megtanulod, hogyan pontozd és prioritizáld a lead-eket. A kulcs: ne kezeld őket egyenlően – fókuszálj a legjobbakra!</p>
<p><a href="{{appUrl}}/courses/{{courseId}}/day/9">Olvasd el a teljes leckét →</a></p>
      `.trim(),
      en: `
<h1>{{courseName}}</h1>
<h2>Day 9: Lead Scoring & Prioritization</h2>
<p>Today you'll learn how to score and prioritize leads. The key: don't treat them equally – focus on the best ones!</p>
<p><a href="{{appUrl}}/courses/{{courseId}}/day/9">Read the full lesson →</a></p>
      `.trim(),
      ru: `
<h1>{{courseName}}</h1>
<h2>День 9: Скоринг лидов и приоритизация</h2>
<p>Сегодня вы узнаете, как оценивать и приоритизировать лиды. Ключ: не относитесь к ним одинаково – фокусируйтесь на лучших!</p>
<p><a href="{{appUrl}}/courses/{{courseId}}/day/9">Прочитать полный урок →</a></p>
      `.trim(),
    },
    quiz: [
      {
        q: {
          hu: 'Mi a lead scoring?',
          en: 'What is lead scoring?',
          ru: 'Что такое скоринг лидов?',
        },
        options: {
          hu: [
            'Csak a lead-ek számolása',
            'Pontrendszer, amely segít rangsorolni a lead-eket vásárlási valószínűség szerint',
            'Csak a költségvetés ellenőrzése',
            'Nem fontos',
          ],
          en: [
            'Just counting leads',
            'Point system that helps rank leads by purchase probability',
            'Just checking budget',
            'Not important',
          ],
          ru: [
            'Просто подсчет лидов',
            'Система баллов, которая помогает ранжировать лиды по вероятности покупки',
            'Просто проверка бюджета',
            'Не важно',
          ],
        },
        correct: 1,
      },
      {
        q: {
          hu: 'Hány pontot használj egy egyszerű lead scoring rendszerben?',
          en: 'How many points do you use in a simple lead scoring system?',
          ru: 'Сколько баллов вы используете в простой системе скоринга лидов?',
        },
        options: {
          hu: ['10', '50', '100 (0-20 pont 5 tényezőre)', '1000'],
          en: ['10', '50', '100 (0-20 points for 5 factors)', '1000'],
          ru: ['10', '50', '100 (0-20 баллов для 5 факторов)', '1000'],
        },
        correct: 2,
      },
      {
        q: {
          hu: 'Melyik lead-et kezeld először?',
          en: 'Which lead do you handle first?',
          ru: 'Какой лид обработать первым?',
        },
        options: {
          hu: [
            'A legutolsót',
            'A legmagasabb pontszámút (magas prioritás)',
            'Véletlenszerűen',
            'A legolcsóbbat',
          ],
          en: [
            'The last one',
            'The highest score one (high priority)',
            'Randomly',
            'The cheapest one',
          ],
          ru: [
            'Последний',
            'Самый высокий балл (высокий приоритет)',
            'Случайно',
            'Самый дешевый',
          ],
        },
        correct: 1,
      },
      {
        q: {
          hu: 'Milyen gyakran frissítsd a lead pontszámokat?',
          en: 'How often should you update lead scores?',
          ru: 'Как часто следует обновлять баллы лидов?',
        },
        options: {
          hu: [
            'Soha',
            'Rendszeresen, amikor új információ érkezik',
            'Csak évente',
            'Csak havonta',
          ],
          en: [
            'Never',
            'Regularly, when new information arrives',
            'Only yearly',
            'Only monthly',
          ],
          ru: [
            'Никогда',
            'Регулярно, когда поступает новая информация',
            'Только ежегодно',
            'Только ежемесячно',
          ],
        },
        correct: 1,
      },
      {
        q: {
          hu: 'Miért fontos konzisztensnek lenni a lead scoring-ban?',
          en: 'Why is it important to be consistent in lead scoring?',
          ru: 'Почему важно быть последовательным в скоринге лидов?',
        },
        options: {
          hu: [
            'Nem fontos',
            'Hogy minden lead-et ugyanazzal a rendszerrel értékelj, és objektív legyen a prioritizálás',
            'Csak a vezetőségnek kell',
            'Csak a CRM-ben kell',
          ],
          en: [
            'Not important',
            'To evaluate every lead with the same system and make prioritization objective',
            'Only management needs it',
            'Only needed in CRM',
          ],
          ru: [
            'Не важно',
            'Чтобы оценивать каждый лид одной системой и делать приоритизацию объективной',
            'Только руководству нужно',
            'Нужно только в CRM',
          ],
        },
        correct: 1,
      },
    ],
  },
  // Day 10: Qualification in Practice
  {
    day: 10,
    title: {
      hu: 'Minősítés gyakorlatban – Hogyan minősítsd egy valódi beszélgetésben?',
      en: 'Qualification in Practice – How to Qualify in a Real Conversation?',
      ru: 'Квалификация на практике – Как квалифицировать в реальном разговоре?',
    },
    content: {
      hu: `
<h1>Minősítés gyakorlatban – Hogyan minősítsd egy valódi beszélgetésben?</h1>
<p><em>Ma megtanulod, hogyan minősítsd a lead-eket egy valódi beszélgetésben. A kulcs: kombináld a BANT/MEDDIC keretrendszert a természetes beszélgetéssel.</em></p>
<hr />

<h2>Napi cél</h2>
<ul>
  <li>Gyakorolni a minősítési beszélgetést valós helyzetben</li>
  <li>Létrehozni egy minősítési sablont</li>
  <li>Azonosítani gyakori hibákat és elkerülni őket</li>
  <li>Beállítani minősítési rutint</li>
</ul>
<hr />

<h2>Miért fontos ez?</h2>
<ul>
  <li><strong>Gyakorlat teszi a mestert.</strong> A minősítés készség, amit gyakorlással fejleszthetsz.</li>
  <li><strong>Jobb eredmények:</strong> Jobb minősítés = jobb lead-ek = több bezárás.</li>
  <li><strong>Idő megtakarítás:</strong> Ha jól minősítesz, nem pazarolod az idődet rossz lead-ekre.</li>
  <li><strong>Professzionális megjelenés:</strong> Jó minősítés = professzionális értékesítő.</li>
</ul>
<hr />

<h2>Elmagyarázás</h2>

<h3>Minősítési beszélgetés struktúrája</h3>
<ol>
  <li><strong>Bevezetés (30 mp):</strong>
    <ul>
      <li>"Köszönöm, hogy időt szakítottál rám."</li>
      <li>"A cél, hogy megértsem, hogyan segíthetek."</li>
    </ul>
  </li>
  <li><strong>Felfedezés (5-10 perc):</strong>
    <ul>
      <li>BANT vagy MEDDIC kérdések</li>
      <li>Hallgass többet, mint beszélsz</li>
      <li>Jegyezz fel fontos információkat</li>
    </ul>
  </li>
  <li><strong>Összefoglalás (1 perc):</strong>
    <ul>
      <li>"Tehát a fő probléma X, és Y időkeretben kell megoldani?"</li>
      <li>Erősítsd meg, hogy érted a problémát</li>
    </ul>
  </li>
  <li><strong>Következő lépés (1 perc):</strong>
    <ul>
      <li>"Szeretnél egy bemutatót látni?"</li>
      <li>Konkrét dátum és időpont</li>
    </ul>
  </li>
</ol>

<h3>Gyakori hibák és elkerülésük</h3>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <thead>
    <tr style="background-color: #FAB908; color: #000;">
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Hiba</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Hogyan kerüld el?</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">Túl sokat beszélsz</td>
      <td style="padding: 12px; border: 1px solid #ddd;">70% hallgatás, 30% beszéd</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">Nem kérdezel költségvetésről</td>
      <td style="padding: 12px; border: 1px solid #ddd;">Mindig kérdezz költségvetésről (közvetetten)</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">Nem azonosítod a döntéshozót</td>
      <td style="padding: 12px; border: 1px solid #ddd;">Mindig kérdezd meg: "Ki hozza meg a végső döntést?"</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">Nem dokumentálod</td>
      <td style="padding: 12px; border: 1px solid #ddd;">Írd le a válaszokat a CRM-ben vagy jegyzetben</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">Nincs következő lépés</td>
      <td style="padding: 12px; border: 1px solid #ddd;">Mindig legyen konkrét következő lépés dátummal</td>
    </tr>
  </tbody>
</table>

<h3>Minősítési sablon példa</h3>
<p><strong>Bevezetés:</strong></p>
<p>"Köszönöm, hogy időt szakítottál rám. A cél, hogy megértsem, milyen kihívásokkal nézel szembe, és hogyan segíthetek. Néhány kérdést teszek fel, rendben?"</p>

<p><strong>Felfedezés (BANT):</strong></p>
<ul>
  <li>"Mi a fő probléma, amit most meg kell oldani?" (Need)</li>
  <li>"Miért fontos ez most?" (Need erőssége)</li>
  <li>"Mikorra kell megoldani?" (Timeline)</li>
  <li>"Ki hozza meg a végső döntést?" (Authority)</li>
  <li>"Milyen költségvetés áll rendelkezésre?" (Budget)</li>
</ul>

<p><strong>Összefoglalás:</strong></p>
<p>"Tehát a fő probléma X, és Y időkeretben kell megoldani. Van költségvetés, és te hozod meg a döntést. Helyes?"</p>

<p><strong>Következő lépés:</strong></p>
<p>"Szeretnél egy 30 perces bemutatót látni, ahol megmutatom, hogyan oldanánk meg ezt? Mikor lenne jó időpont?"</p>

<hr />

<h2>Gyakorlat 1 – Minősítési beszélgetés gyakorlása (25 perc)</h2>
<ol>
  <li><strong>Válassz egy kollégát vagy barátot</strong> gyakorláshoz</li>
  <li><strong>Gyakorold a teljes minősítési beszélgetést</strong> (10 perc)</li>
  <li><strong>Kérj visszajelzést:</strong> Természetes volt? Jó kérdéseket tettél fel?</li>
  <li><strong>Ismételd meg</strong> és javíts a visszajelzés alapján</li>
</ol>

<h2>Gyakorlat 2 – Minősítési sablon létrehozása (10 perc)</h2>
<ol>
  <li><strong>Írd le a saját minősítési sablonodat</strong> (bevezetés → felfedezés → összefoglalás → következő lépés)</li>
  <li><strong>Használd a következő beszélgetésben</strong> és nézd meg, működik-e</li>
  <li><strong>Finomhangold</strong> a tapasztalatok alapján</li>
</ol>

<hr />

<h2>Kulcs tanulságok</h2>
<ul>
  <li><strong>Gyakorlat teszi a mestert.</strong> Minél többet gyakorolsz, annál jobb leszel.</li>
  <li><strong>Hallgass többet, mint beszélsz.</strong> 70% hallgatás, 30% beszéd.</li>
  <li><strong>Mindig legyen következő lépés.</strong> Konkrét dátummal és időponttal.</li>
  <li><strong>Dokumentáld mindent.</strong> Írd le a válaszokat, hogy később hivatkozhass rá.</li>
</ul>

<hr />

<h2>További anyagok (választható)</h2>
<ul>
  <li><strong>HubSpot – Discovery Call Best Practices:</strong> <a href="https://blog.hubspot.com/sales/discovery-call" target="_blank" rel="noopener noreferrer">https://blog.hubspot.com/sales/discovery-call</a> – Felfedező hívás best practice-ek</li>
  <li><strong>Salesforce – Qualification Techniques:</strong> <a href="https://www.salesforce.com/resources/articles/qualification-techniques/" target="_blank" rel="noopener noreferrer">https://www.salesforce.com/resources/articles/qualification-techniques/</a> – Minősítési technikák</li>
</ul>
      `.trim(),
      en: `
<h1>Qualification in Practice – How to Qualify in a Real Conversation?</h1>
<p><em>Today you'll learn how to qualify leads in a real conversation. The key: combine the BANT/MEDDIC framework with natural conversation.</em></p>
<hr />

<h2>Daily Goal</h2>
<ul>
  <li>Practice the qualification conversation in a real situation</li>
  <li>Create a qualification template</li>
  <li>Identify common mistakes and avoid them</li>
  <li>Set up qualification routine</li>
</ul>
<hr />

<h2>Why it matters</h2>
<ul>
  <li><strong>Practice makes perfect.</strong> Qualification is a skill you can improve with practice.</li>
  <li><strong>Better results:</strong> Better qualification = better leads = more closes.</li>
  <li><strong>Time savings:</strong> If you qualify well, you don't waste time on bad leads.</li>
  <li><strong>Professional appearance:</strong> Good qualification = professional salesperson.</li>
</ul>
<hr />

<h2>Explanation</h2>

<h3>Qualification conversation structure</h3>
<ol>
  <li><strong>Introduction (30 sec):</strong>
    <ul>
      <li>"Thank you for taking the time."</li>
      <li>"The goal is to understand how I can help."</li>
    </ul>
  </li>
  <li><strong>Discovery (5-10 min):</strong>
    <ul>
      <li>BANT or MEDDIC questions</li>
      <li>Listen more than you talk</li>
      <li>Take notes on important information</li>
    </ul>
  </li>
  <li><strong>Summary (1 min):</strong>
    <ul>
      <li>"So the main problem is X, and it needs to be solved in Y timeframe?"</li>
      <li>Confirm you understand the problem</li>
    </ul>
  </li>
  <li><strong>Next step (1 min):</strong>
    <ul>
      <li>"Would you like to see a demo?"</li>
      <li>Concrete date and time</li>
    </ul>
  </li>
</ol>

<h3>Common mistakes and how to avoid them</h3>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <thead>
    <tr style="background-color: #FAB908; color: #000;">
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Mistake</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">How to avoid</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">Talking too much</td>
      <td style="padding: 12px; border: 1px solid #ddd;">70% listening, 30% talking</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">Not asking about budget</td>
      <td style="padding: 12px; border: 1px solid #ddd;">Always ask about budget (indirectly)</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">Not identifying decision maker</td>
      <td style="padding: 12px; border: 1px solid #ddd;">Always ask: "Who makes the final decision?"</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">Not documenting</td>
      <td style="padding: 12px; border: 1px solid #ddd;">Write down answers in CRM or notes</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">No next step</td>
      <td style="padding: 12px; border: 1px solid #ddd;">Always have concrete next step with date</td>
    </tr>
  </tbody>
</table>

<h3>Qualification template example</h3>
<p><strong>Introduction:</strong></p>
<p>"Thank you for taking the time. The goal is to understand what challenges you're facing and how I can help. I'll ask a few questions, okay?"</p>

<p><strong>Discovery (BANT):</strong></p>
<ul>
  <li>"What is the main problem you need to solve now?" (Need)</li>
  <li>"Why is this important now?" (Need strength)</li>
  <li>"When does this need to be solved?" (Timeline)</li>
  <li>"Who makes the final decision?" (Authority)</li>
  <li>"What budget is available?" (Budget)</li>
</ul>

<p><strong>Summary:</strong></p>
<p>"So the main problem is X, and it needs to be solved in Y timeframe. There's a budget, and you make the decision. Correct?"</p>

<p><strong>Next step:</strong></p>
<p>"Would you like to see a 30-minute demo where I show how we'd solve this? When would be a good time?"</p>

<hr />

<h2>Practice 1 – Practice qualification conversation (25 min)</h2>
<ol>
  <li><strong>Choose a colleague or friend</strong> to practice with</li>
  <li><strong>Practice the complete qualification conversation</strong> (10 min)</li>
  <li><strong>Ask for feedback:</strong> Was it natural? Did you ask good questions?</li>
  <li><strong>Repeat</strong> and improve based on feedback</li>
</ol>

<h2>Practice 2 – Create qualification template (10 min)</h2>
<ol>
  <li><strong>Write down your own qualification template</strong> (introduction → discovery → summary → next step)</li>
  <li><strong>Use it in the next conversation</strong> and see if it works</li>
  <li><strong>Refine</strong> based on experience</li>
</ol>

<hr />

<h2>Key Takeaways</h2>
<ul>
  <li><strong>Practice makes perfect.</strong> The more you practice, the better you'll be.</li>
  <li><strong>Listen more than you talk.</strong> 70% listening, 30% talking.</li>
  <li><strong>Always have a next step.</strong> With concrete date and time.</li>
  <li><strong>Document everything.</strong> Write down answers so you can reference them later.</li>
</ul>

<hr />

<h2>Optional Resources</h2>
<ul>
  <li><strong>HubSpot – Discovery Call Best Practices:</strong> <a href="https://blog.hubspot.com/sales/discovery-call" target="_blank" rel="noopener noreferrer">https://blog.hubspot.com/sales/discovery-call</a> – Discovery call best practices</li>
  <li><strong>Salesforce – Qualification Techniques:</strong> <a href="https://www.salesforce.com/resources/articles/qualification-techniques/" target="_blank" rel="noopener noreferrer">https://www.salesforce.com/resources/articles/qualification-techniques/</a> – Qualification techniques</li>
</ul>
      `.trim(),
      ru: `
<h1>Квалификация на практике – Как квалифицировать в реальном разговоре?</h1>
<p><em>Сегодня вы узнаете, как квалифицировать лиды в реальном разговоре. Ключ: комбинируйте фреймворк BANT/MEDDIC с естественным разговором.</em></p>
<hr />

<h2>Цель дня</h2>
<ul>
  <li>Попрактиковать разговор квалификации в реальной ситуации</li>
  <li>Создать шаблон квалификации</li>
  <li>Определить типичные ошибки и избежать их</li>
  <li>Настроить рутину квалификации</li>
</ul>
<hr />

<h2>Почему это важно</h2>
<ul>
  <li><strong>Практика делает совершенным.</strong> Квалификация – это навык, который можно улучшить практикой.</li>
  <li><strong>Лучшие результаты:</strong> Лучшая квалификация = лучшие лиды = больше закрытий.</li>
  <li><strong>Экономия времени:</strong> Если хорошо квалифицируете, не тратите время на плохие лиды.</li>
  <li><strong>Профессиональный вид:</strong> Хорошая квалификация = профессиональный продавец.</li>
</ul>
<hr />

<h2>Объяснение</h2>

<h3>Структура разговора квалификации</h3>
<ol>
  <li><strong>Введение (30 сек):</strong>
    <ul>
      <li>"Спасибо, что нашли время."</li>
      <li>"Цель – понять, как я могу помочь."</li>
    </ul>
  </li>
  <li><strong>Исследование (5-10 мин):</strong>
    <ul>
      <li>Вопросы BANT или MEDDIC</li>
      <li>Слушайте больше, чем говорите</li>
      <li>Делайте заметки о важной информации</li>
    </ul>
  </li>
  <li><strong>Резюме (1 мин):</strong>
    <ul>
      <li>"Итак, основная проблема X, и нужно решить в срок Y?"</li>
      <li>Подтвердите, что понимаете проблему</li>
    </ul>
  </li>
  <li><strong>Следующий шаг (1 мин):</strong>
    <ul>
      <li>"Хотели бы увидеть демо?"</li>
      <li>Конкретная дата и время</li>
    </ul>
  </li>
</ol>

<h3>Типичные ошибки и как их избежать</h3>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <thead>
    <tr style="background-color: #FAB908; color: #000;">
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Ошибка</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Как избежать</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">Слишком много говорите</td>
      <td style="padding: 12px; border: 1px solid #ddd;">70% слушание, 30% речь</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">Не спрашиваете о бюджете</td>
      <td style="padding: 12px; border: 1px solid #ddd;">Всегда спрашивайте о бюджете (косвенно)</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">Не определяете лицо, принимающее решение</td>
      <td style="padding: 12px; border: 1px solid #ddd;">Всегда спрашивайте: "Кто принимает окончательное решение?"</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">Не документируете</td>
      <td style="padding: 12px; border: 1px solid #ddd;">Записывайте ответы в CRM или заметках</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">Нет следующего шага</td>
      <td style="padding: 12px; border: 1px solid #ddd;">Всегда должен быть конкретный следующий шаг с датой</td>
    </tr>
  </tbody>
</table>

<h3>Пример шаблона квалификации</h3>
<p><strong>Введение:</strong></p>
<p>"Спасибо, что нашли время. Цель – понять, с какими вызовами вы сталкиваетесь и как я могу помочь. Задам несколько вопросов, хорошо?"</p>

<p><strong>Исследование (BANT):</strong></p>
<ul>
  <li>"В чем основная проблема, которую нужно решить сейчас?" (Need)</li>
  <li>"Почему это важно сейчас?" (Сила потребности)</li>
  <li>"Когда нужно решить это?" (Timeline)</li>
  <li>"Кто принимает окончательное решение?" (Authority)</li>
  <li>"Какой бюджет доступен?" (Budget)</li>
</ul>

<p><strong>Резюме:</strong></p>
<p>"Итак, основная проблема X, и нужно решить в срок Y. Есть бюджет, и вы принимаете решение. Правильно?"</p>

<p><strong>Следующий шаг:</strong></p>
<p>"Хотели бы увидеть 30-минутное демо, где я покажу, как мы решим это? Когда было бы удобно?"</p>

<hr />

<h2>Практика 1 – Практика разговора квалификации (25 мин)</h2>
<ol>
  <li><strong>Выберите коллегу или друга</strong> для практики</li>
  <li><strong>Попрактикуйте полный разговор квалификации</strong> (10 мин)</li>
  <li><strong>Попросите обратную связь:</strong> Было ли естественно? Задавали ли хорошие вопросы?</li>
  <li><strong>Повторите</strong> и улучшите на основе обратной связи</li>
</ol>

<h2>Практика 2 – Создание шаблона квалификации (10 мин)</h2>
<ol>
  <li><strong>Запишите свой шаблон квалификации</strong> (введение → исследование → резюме → следующий шаг)</li>
  <li><strong>Используйте его в следующем разговоре</strong> и посмотрите, работает ли</li>
  <li><strong>Улучшайте</strong> на основе опыта</li>
</ol>

<hr />

<h2>Ключевые выводы</h2>
<ul>
  <li><strong>Практика делает совершенным.</strong> Чем больше практикуете, тем лучше будете.</li>
  <li><strong>Слушайте больше, чем говорите.</strong> 70% слушание, 30% речь.</li>
  <li><strong>Всегда должен быть следующий шаг.</strong> С конкретной датой и временем.</li>
  <li><strong>Документируйте все.</strong> Записывайте ответы, чтобы можно было ссылаться позже.</li>
</ul>

<hr />

<h2>Доп. материалы (по желанию)</h2>
<ul>
  <li><strong>HubSpot – Лучшие практики исследовательского звонка:</strong> <a href="https://blog.hubspot.com/sales/discovery-call" target="_blank" rel="noopener noreferrer">https://blog.hubspot.com/sales/discovery-call</a> – Лучшие практики исследовательского звонка</li>
  <li><strong>Salesforce – Техники квалификации:</strong> <a href="https://www.salesforce.com/resources/articles/qualification-techniques/" target="_blank" rel="noopener noreferrer">https://www.salesforce.com/resources/articles/qualification-techniques/</a> – Техники квалификации</li>
</ul>
      `.trim(),
    },
    emailSubject: {
      hu: '{{courseName}} – 10. nap: Minősítés gyakorlatban',
      en: '{{courseName}} – Day 10: Qualification in Practice',
      ru: '{{courseName}} – День 10: Квалификация на практике',
    },
    emailBody: {
      hu: `
<h1>{{courseName}}</h1>
<h2>10. nap: Minősítés gyakorlatban</h2>
<p>Ma megtanulod, hogyan minősítsd a lead-eket egy valódi beszélgetésben. A kulcs: kombináld a BANT/MEDDIC keretrendszert a természetes beszélgetéssel.</p>
<p><a href="{{appUrl}}/courses/{{courseId}}/day/10">Olvasd el a teljes leckét →</a></p>
      `.trim(),
      en: `
<h1>{{courseName}}</h1>
<h2>Day 10: Qualification in Practice</h2>
<p>Today you'll learn how to qualify leads in a real conversation. The key: combine the BANT/MEDDIC framework with natural conversation.</p>
<p><a href="{{appUrl}}/courses/{{courseId}}/day/10">Read the full lesson →</a></p>
      `.trim(),
      ru: `
<h1>{{courseName}}</h1>
<h2>День 10: Квалификация на практике</h2>
<p>Сегодня вы узнаете, как квалифицировать лиды в реальном разговоре. Ключ: комбинируйте фреймворк BANT/MEDDIC с естественным разговором.</p>
<p><a href="{{appUrl}}/courses/{{courseId}}/day/10">Прочитать полный урок →</a></p>
      `.trim(),
    },
    quiz: [
      {
        q: {
          hu: 'Mennyi időt töltesz minősítéssel egy beszélgetésben?',
          en: 'How much time do you spend qualifying in a conversation?',
          ru: 'Сколько времени вы тратите на квалификацию в разговоре?',
        },
        options: {
          hu: ['1 perc', '5-10 perc', '30 perc', '1 óra'],
          en: ['1 minute', '5-10 minutes', '30 minutes', '1 hour'],
          ru: ['1 минута', '5-10 минут', '30 минут', '1 час'],
        },
        correct: 1,
      },
      {
        q: {
          hu: 'Mennyit kell hallgatnod vs. beszélned?',
          en: 'How much should you listen vs. talk?',
          ru: 'Сколько вы должны слушать vs. говорить?',
        },
        options: {
          hu: [
            'Csak beszélj',
            '70% hallgatás, 30% beszéd',
            '50-50',
            'Csak hallgass',
          ],
          en: [
            'Just talk',
            '70% listening, 30% talking',
            '50-50',
            'Just listen',
          ],
          ru: [
            'Просто говорите',
            '70% слушание, 30% речь',
            '50-50',
            'Просто слушайте',
          ],
        },
        correct: 1,
      },
      {
        q: {
          hu: 'Mi a leggyakoribb hiba a minősítésben?',
          en: 'What is the most common mistake in qualification?',
          ru: 'Какая самая распространенная ошибка в квалификации?',
        },
        options: {
          hu: [
            'Túl sokat hallgatsz',
            'Túl sokat beszélsz, nem kérdezel elég',
            'Túl sokat kérdezel',
            'Nem fontos',
          ],
          en: [
            'Listening too much',
            'Talking too much, not asking enough',
            'Asking too much',
            'Not important',
          ],
          ru: [
            'Слишком много слушаете',
            'Слишком много говорите, недостаточно спрашиваете',
            'Слишком много спрашиваете',
            'Не важно',
          ],
        },
        correct: 1,
      },
      {
        q: {
          hu: 'Miért fontos mindig következő lépést kérni?',
          en: 'Why is it important to always ask for next step?',
          ru: 'Почему важно всегда просить следующий шаг?',
        },
        options: {
          hu: [
            'Nem fontos',
            'Hogy legyen konkrét akció dátummal, ne csak "reménykedés"',
            'Csak a vezetőségnek kell',
            'Csak a CRM-ben kell',
          ],
          en: [
            'Not important',
            'To have concrete action with date, not just "hoping"',
            'Only management needs it',
            'Only needed in CRM',
          ],
          ru: [
            'Не важно',
            'Чтобы было конкретное действие с датой, а не просто "надежда"',
            'Только руководству нужно',
            'Нужно только в CRM',
          ],
        },
        correct: 1,
      },
      {
        q: {
          hu: 'Hogyan fejlesztheted a minősítési készségedet?',
          en: 'How do you improve your qualification skills?',
          ru: 'Как вы улучшаете свои навыки квалификации?',
        },
        options: {
          hu: [
            'Ne fejleszd',
            'Gyakorlással – minél többet gyakorolsz, annál jobb leszel',
            'Csak olvasd el a könyveket',
            'Csak nézd meg a videókat',
          ],
          en: [
            'Don\'t improve',
            'With practice – the more you practice, the better you\'ll be',
            'Just read books',
            'Just watch videos',
          ],
          ru: [
            'Не улучшайте',
            'С практикой – чем больше практикуете, тем лучше будете',
            'Просто читайте книги',
            'Просто смотрите видео',
          ],
        },
        correct: 1,
      },
    ],
  },
  // Day 11: Pricing Psychology
  {
    day: 11,
    title: {
      hu: 'Árazási pszichológia – Hogyan hat az ár a vásárlási döntésre?',
      en: 'Pricing Psychology – How Does Price Affect Buying Decisions?',
      ru: 'Психология ценообразования – Как цена влияет на решения о покупке?',
    },
    content: {
      hu: `
<h1>Árazási pszichológia – Hogyan hat az ár a vásárlási döntésre?</h1>
<p><em>Ma megtanulod, hogyan működik az árazási pszichológia. A kulcs: az ár nem csak szám – érzelmi és pszichológiai hatása van.</em></p>
<hr />

<h2>Napi cél</h2>
<ul>
  <li>Megérteni az árazási pszichológia alapjait</li>
  <li>Azonosítani a leggyakoribb árazási pszichológiai technikákat</li>
  <li>Létrehozni egy árazási stratégiát</li>
  <li>Megérteni, hogyan kommunikálod az árat</li>
</ul>
<hr />

<h2>Miért fontos ez?</h2>
<ul>
  <li><strong>Ár = érzelmi reakció.</strong> Az ügyfelek nem csak a számot látják, hanem érzelmi választ adnak.</li>
  <li><strong>Jobb konverzió:</strong> Jó árazási pszichológia = magasabb bezárási arány.</li>
  <li><strong>Magasabb ár:</strong> Ha jól kommunikálod, többet kérhetsz el.</li>
  <li><strong>Versenyelőny:</strong> Aki jobban érti az árazási pszichológiát, az többet zár le.</li>
</ul>
<hr />

<h2>Elmagyarázás</h2>

<h3>Mi az árazási pszichológia?</h3>
<p><strong>Árazási pszichológia = az ár bemutatásának módja, amely pszichológiailag hatásosabbá teszi.</strong></p>
<p>Példa: $99 vs. $100 – az első "olcsóbbnak" tűnik, bár csak $1 a különbség.</p>

<h3>5 fő árazási pszichológiai technika</h3>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <thead>
    <tr style="background-color: #FAB908; color: #000;">
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Technika</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Mit jelent</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Példa</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>1. Charm ár</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">9-re végződő ár ($99, $999)</td>
      <td style="padding: 12px; border: 1px solid #ddd;">$99 vs. $100 – "olcsóbbnak" tűnik</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>2. Anchoring</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Magas ár mutatása először</td>
      <td style="padding: 12px; border: 1px solid #ddd;">$1000 → $500 "olcsónak" tűnik</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>3. Value framing</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Értékben kommunikálás (nem árban)</td>
      <td style="padding: 12px; border: 1px solid #ddd;">"$1000/év = $2.74/nap"</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>4. Bundle pricing</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Csomag árazás</td>
      <td style="padding: 12px; border: 1px solid #ddd;">3 termék $300 vs. 1 termék $150</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>5. Premium pricing</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Magas ár = minőség jelzése</td>
      <td style="padding: 12px; border: 1px solid #ddd;">$5000 vs. $500 – "prémium"</td>
    </tr>
  </tbody>
</table>

<h3>Hogyan kommunikálod az árat?</h3>
<p><strong>Rossz példa:</strong></p>
<ul>
  <li>"Az ár $1000."</li>
  <li>Nincs kontextus, nincs érték</li>
</ul>

<p><strong>Jó példa:</strong></p>
<ul>
  <li>"A megoldás $1000/év, ami $2.74/nap. Ez megtakarítja a napi 2 órát, ami $50/óra értékben = $100/nap megtakarítás."</li>
  <li>Értékben kommunikálás, ROI mutatása</li>
</ul>

<hr />

<h2>Gyakorlat 1 – Árazási stratégia (20 perc)</h2>
<ol>
  <li><strong>Írd le a jelenlegi árazási stratégiádat</strong></li>
  <li><strong>Válassz 2-3 árazási pszichológiai technikát,</strong> amit be tudsz építeni</li>
  <li><strong>Írd le, hogyan kommunikálod az árat</strong> (értékben, nem csak számként)</li>
</ol>

<h2>Gyakorlat 2 – Ár kommunikáció sablon (15 perc)</h2>
<p>Hozz létre egy sablont, hogyan kommunikálod az árat:</p>
<ul>
  <li><strong>Érték:</strong> Mit kap az ügyfél?</li>
  <li><strong>ROI:</strong> Mennyi a megtérülés?</li>
  <li><strong>Összehasonlítás:</strong> Mennyit költ most (ha van alternatíva)?</li>
  <li><strong>Bontás:</strong> Napi/havi költség (ha nagy összeg)</li>
</ul>

<hr />

<h2>Kulcs tanulságok</h2>
<ul>
  <li><strong>Ár = érzelmi reakció.</strong> Ne csak számként mutasd be.</li>
  <li><strong>Értékben kommunikálj.</strong> "Mit kap" vs. "Mennyit fizet".</li>
  <li><strong>Használj árazási pszichológiai technikákat.</strong> Charm ár, anchoring, value framing.</li>
  <li><strong>Mutass ROI-t.</strong> Mennyi a megtérülés?</li>
</ul>

<hr />

<h2>További anyagok (választható)</h2>
<ul>
  <li><strong>HubSpot – Pricing Psychology:</strong> <a href="https://blog.hubspot.com/sales/pricing-psychology" target="_blank" rel="noopener noreferrer">https://blog.hubspot.com/sales/pricing-psychology</a> – Árazási pszichológia</li>
  <li><strong>Harvard Business Review – Pricing Strategy:</strong> <a href="https://hbr.org/topic/pricing" target="_blank" rel="noopener noreferrer">https://hbr.org/topic/pricing</a> – Árazási stratégia</li>
</ul>
      `.trim(),
      en: `
<h1>Pricing Psychology – How Does Price Affect Buying Decisions?</h1>
<p><em>Today you'll learn how pricing psychology works. The key: price is not just a number – it has emotional and psychological impact.</em></p>
<hr />

<h2>Daily Goal</h2>
<ul>
  <li>Understand the fundamentals of pricing psychology</li>
  <li>Identify the most common pricing psychology techniques</li>
  <li>Create a pricing strategy</li>
  <li>Understand how to communicate price</li>
</ul>
<hr />

<h2>Why it matters</h2>
<ul>
  <li><strong>Price = emotional reaction.</strong> Customers don't just see the number, they have an emotional response.</li>
  <li><strong>Better conversion:</strong> Good pricing psychology = higher close rate.</li>
  <li><strong>Higher price:</strong> If you communicate well, you can charge more.</li>
  <li><strong>Competitive advantage:</strong> Those who understand pricing psychology better close more.</li>
</ul>
<hr />

<h2>Explanation</h2>

<h3>What is pricing psychology?</h3>
<p><strong>Pricing psychology = the way price is presented that makes it psychologically more effective.</strong></p>
<p>Example: $99 vs. $100 – the first seems "cheaper" even though it's only $1 difference.</p>

<h3>5 main pricing psychology techniques</h3>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <thead>
    <tr style="background-color: #FAB908; color: #000;">
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Technique</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">What it means</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Example</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>1. Charm price</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Price ending in 9 ($99, $999)</td>
      <td style="padding: 12px; border: 1px solid #ddd;">$99 vs. $100 – seems "cheaper"</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>2. Anchoring</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Showing high price first</td>
      <td style="padding: 12px; border: 1px solid #ddd;">$1000 → $500 seems "cheap"</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>3. Value framing</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Communicating in value (not price)</td>
      <td style="padding: 12px; border: 1px solid #ddd;">"$1000/year = $2.74/day"</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>4. Bundle pricing</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Package pricing</td>
      <td style="padding: 12px; border: 1px solid #ddd;">3 products $300 vs. 1 product $150</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>5. Premium pricing</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">High price = quality signal</td>
      <td style="padding: 12px; border: 1px solid #ddd;">$5000 vs. $500 – "premium"</td>
    </tr>
  </tbody>
</table>

<h3>How do you communicate price?</h3>
<p><strong>Bad example:</strong></p>
<ul>
  <li>"The price is $1000."</li>
  <li>No context, no value</li>
</ul>

<p><strong>Good example:</strong></p>
<ul>
  <li>"The solution is $1000/year, which is $2.74/day. This saves you 2 hours daily, which at $50/hour value = $100/day savings."</li>
  <li>Value communication, ROI shown</li>
</ul>

<hr />

<h2>Practice 1 – Pricing strategy (20 min)</h2>
<ol>
  <li><strong>Write down your current pricing strategy</strong></li>
  <li><strong>Choose 2-3 pricing psychology techniques</strong> you can incorporate</li>
  <li><strong>Write down how you communicate price</strong> (in value, not just as a number)</li>
</ol>

<h2>Practice 2 – Price communication template (15 min)</h2>
<p>Create a template for how you communicate price:</p>
<ul>
  <li><strong>Value:</strong> What does the customer get?</li>
  <li><strong>ROI:</strong> What's the return?</li>
  <li><strong>Comparison:</strong> How much do they spend now (if there's an alternative)?</li>
  <li><strong>Breakdown:</strong> Daily/monthly cost (if large amount)</li>
</ul>

<hr />

<h2>Key Takeaways</h2>
<ul>
  <li><strong>Price = emotional reaction.</strong> Don't just present it as a number.</li>
  <li><strong>Communicate in value.</strong> "What they get" vs. "What they pay".</li>
  <li><strong>Use pricing psychology techniques.</strong> Charm price, anchoring, value framing.</li>
  <li><strong>Show ROI.</strong> What's the return?</li>
</ul>

<hr />

<h2>Optional Resources</h2>
<ul>
  <li><strong>HubSpot – Pricing Psychology:</strong> <a href="https://blog.hubspot.com/sales/pricing-psychology" target="_blank" rel="noopener noreferrer">https://blog.hubspot.com/sales/pricing-psychology</a> – Pricing psychology</li>
  <li><strong>Harvard Business Review – Pricing Strategy:</strong> <a href="https://hbr.org/topic/pricing" target="_blank" rel="noopener noreferrer">https://hbr.org/topic/pricing</a> – Pricing strategy</li>
</ul>
      `.trim(),
      ru: `
<h1>Психология ценообразования – Как цена влияет на решения о покупке?</h1>
<p><em>Сегодня вы узнаете, как работает психология ценообразования. Ключ: цена – это не просто число, она имеет эмоциональное и психологическое воздействие.</em></p>
<hr />

<h2>Цель дня</h2>
<ul>
  <li>Понять основы психологии ценообразования</li>
  <li>Определить самые распространенные техники психологии ценообразования</li>
  <li>Создать стратегию ценообразования</li>
  <li>Понять, как коммуницировать цену</li>
</ul>
<hr />

<h2>Почему это важно</h2>
<ul>
  <li><strong>Цена = эмоциональная реакция.</strong> Клиенты не просто видят число, у них есть эмоциональный отклик.</li>
  <li><strong>Лучшая конверсия:</strong> Хорошая психология ценообразования = более высокая конверсия закрытия.</li>
  <li><strong>Более высокая цена:</strong> Если хорошо коммуницируете, можете брать больше.</li>
  <li><strong>Конкурентное преимущество:</strong> Те, кто лучше понимает психологию ценообразования, закрывают больше.</li>
</ul>
<hr />

<h2>Объяснение</h2>

<h3>Что такое психология ценообразования?</h3>
<p><strong>Психология ценообразования = способ представления цены, который делает её психологически более эффективной.</strong></p>
<p>Пример: $99 vs. $100 – первое кажется "дешевле", хотя разница всего $1.</p>

<h3>5 основных техник психологии ценообразования</h3>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <thead>
    <tr style="background-color: #FAB908; color: #000;">
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Техника</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Что означает</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Пример</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>1. Charm цена</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Цена, заканчивающаяся на 9 ($99, $999)</td>
      <td style="padding: 12px; border: 1px solid #ddd;">$99 vs. $100 – кажется "дешевле"</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>2. Anchoring</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Показ высокой цены сначала</td>
      <td style="padding: 12px; border: 1px solid #ddd;">$1000 → $500 кажется "дешевым"</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>3. Value framing</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Коммуникация в ценности (не в цене)</td>
      <td style="padding: 12px; border: 1px solid #ddd;">"$1000/год = $2.74/день"</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>4. Bundle pricing</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Пакетное ценообразование</td>
      <td style="padding: 12px; border: 1px solid #ddd;">3 продукта $300 vs. 1 продукт $150</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>5. Premium pricing</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Высокая цена = сигнал качества</td>
      <td style="padding: 12px; border: 1px solid #ddd;">$5000 vs. $500 – "премиум"</td>
    </tr>
  </tbody>
</table>

<h3>Как вы коммуницируете цену?</h3>
<p><strong>Плохой пример:</strong></p>
<ul>
  <li>"Цена $1000."</li>
  <li>Нет контекста, нет ценности</li>
</ul>

<p><strong>Хороший пример:</strong></p>
<ul>
  <li>"Решение $1000/год, что составляет $2.74/день. Это экономит вам 2 часа ежедневно, что при стоимости $50/час = экономия $100/день."</li>
  <li>Коммуникация ценности, показ ROI</li>
</ul>

<hr />

<h2>Практика 1 – Стратегия ценообразования (20 мин)</h2>
<ol>
  <li><strong>Запишите вашу текущую стратегию ценообразования</strong></li>
  <li><strong>Выберите 2-3 техники психологии ценообразования,</strong> которые можете внедрить</li>
  <li><strong>Запишите, как вы коммуницируете цену</strong> (в ценности, а не просто как число)</li>
</ol>

<h2>Практика 2 – Шаблон коммуникации цены (15 мин)</h2>
<p>Создайте шаблон для коммуникации цены:</p>
<ul>
  <li><strong>Ценность:</strong> Что получает клиент?</li>
  <li><strong>ROI:</strong> Какая отдача?</li>
  <li><strong>Сравнение:</strong> Сколько они тратят сейчас (если есть альтернатива)?</li>
  <li><strong>Разбивка:</strong> Ежедневная/ежемесячная стоимость (если большая сумма)</li>
</ul>

<hr />

<h2>Ключевые выводы</h2>
<ul>
  <li><strong>Цена = эмоциональная реакция.</strong> Не просто представляйте её как число.</li>
  <li><strong>Коммуницируйте в ценности.</strong> "Что они получают" vs. "Что они платят".</li>
  <li><strong>Используйте техники психологии ценообразования.</strong> Charm цена, anchoring, value framing.</li>
  <li><strong>Показывайте ROI.</strong> Какая отдача?</li>
</ul>

<hr />

<h2>Доп. материалы (по желанию)</h2>
<ul>
  <li><strong>HubSpot – Психология ценообразования:</strong> <a href="https://blog.hubspot.com/sales/pricing-psychology" target="_blank" rel="noopener noreferrer">https://blog.hubspot.com/sales/pricing-psychology</a> – Психология ценообразования</li>
  <li><strong>Harvard Business Review – Стратегия ценообразования:</strong> <a href="https://hbr.org/topic/pricing" target="_blank" rel="noopener noreferrer">https://hbr.org/topic/pricing</a> – Стратегия ценообразования</li>
</ul>
      `.trim(),
    },
    emailSubject: {
      hu: '{{courseName}} – 11. nap: Árazási pszichológia',
      en: '{{courseName}} – Day 11: Pricing Psychology',
      ru: '{{courseName}} – День 11: Психология ценообразования',
    },
    emailBody: {
      hu: `
<h1>{{courseName}}</h1>
<h2>11. nap: Árazási pszichológia</h2>
<p>Ma megtanulod, hogyan működik az árazási pszichológia. A kulcs: az ár nem csak szám – érzelmi és pszichológiai hatása van.</p>
<p><a href="{{appUrl}}/courses/{{courseId}}/day/11">Olvasd el a teljes leckét →</a></p>
      `.trim(),
      en: `
<h1>{{courseName}}</h1>
<h2>Day 11: Pricing Psychology</h2>
<p>Today you'll learn how pricing psychology works. The key: price is not just a number – it has emotional and psychological impact.</p>
<p><a href="{{appUrl}}/courses/{{courseId}}/day/11">Read the full lesson →</a></p>
      `.trim(),
      ru: `
<h1>{{courseName}}</h1>
<h2>День 11: Психология ценообразования</h2>
<p>Сегодня вы узнаете, как работает психология ценообразования. Ключ: цена – это не просто число, она имеет эмоциональное и психологическое воздействие.</p>
<p><a href="{{appUrl}}/courses/{{courseId}}/day/11">Прочитать полный урок →</a></p>
      `.trim(),
    },
    quiz: [
      {
        q: {
          hu: 'Mi az árazási pszichológia?',
          en: 'What is pricing psychology?',
          ru: 'Что такое психология ценообразования?',
        },
        options: {
          hu: [
            'Csak az ár számolása',
            'Az ár bemutatásának módja, amely pszichológiailag hatásosabbá teszi',
            'Csak a kedvezmények',
            'Nem fontos',
          ],
          en: [
            'Just counting price',
            'The way price is presented that makes it psychologically more effective',
            'Just discounts',
            'Not important',
          ],
          ru: [
            'Просто подсчет цены',
            'Способ представления цены, который делает её психологически более эффективной',
            'Просто скидки',
            'Не важно',
          ],
        },
        correct: 1,
      },
      {
        q: {
          hu: 'Mi a "charm ár"?',
          en: 'What is a "charm price"?',
          ru: 'Что такое "charm цена"?',
        },
        options: {
          hu: [
            'Nagyon drága ár',
            '9-re végződő ár ($99, $999) – "olcsóbbnak" tűnik',
            'Kerek szám',
            'Kedvezményes ár',
          ],
          en: [
            'Very expensive price',
            'Price ending in 9 ($99, $999) – seems "cheaper"',
            'Round number',
            'Discounted price',
          ],
          ru: [
            'Очень дорогая цена',
            'Цена, заканчивающаяся на 9 ($99, $999) – кажется "дешевле"',
            'Круглое число',
            'Цена со скидкой',
          ],
        },
        correct: 1,
      },
      {
        q: {
          hu: 'Mi az "anchoring"?',
          en: 'What is "anchoring"?',
          ru: 'Что такое "anchoring"?',
        },
        options: {
          hu: [
            'Csak az ár',
            'Magas ár mutatása először, hogy az alacsonyabb ár "olcsónak" tűnjön',
            'Csak a kedvezmény',
            'Nem fontos',
          ],
          en: [
            'Just the price',
            'Showing high price first so lower price seems "cheap"',
            'Just the discount',
            'Not important',
          ],
          ru: [
            'Просто цена',
            'Показ высокой цены сначала, чтобы низкая цена казалась "дешевой"',
            'Просто скидка',
            'Не важно',
          ],
        },
        correct: 1,
      },
      {
        q: {
          hu: 'Hogyan kommunikálod az árat?',
          en: 'How do you communicate price?',
          ru: 'Как вы коммуницируете цену?',
        },
        options: {
          hu: [
            'Csak számként',
            'Értékben kommunikálás, ROI mutatása, összehasonlítás',
            'Csak a kedvezményt mutasd',
            'Ne kommunikáld',
          ],
          en: [
            'Just as a number',
            'Value communication, ROI shown, comparison',
            'Just show the discount',
            'Don\'t communicate it',
          ],
          ru: [
            'Просто как число',
            'Коммуникация в ценности, показ ROI, сравнение',
            'Просто покажите скидку',
            'Не коммуницируйте',
          ],
        },
        correct: 1,
      },
      {
        q: {
          hu: 'Miért fontos az árazási pszichológia?',
          en: 'Why is pricing psychology important?',
          ru: 'Почему важна психология ценообразования?',
        },
        options: {
          hu: [
            'Nem fontos',
            'Jobb konverzió, magasabb ár lehet, versenyelőny',
            'Csak a marketingnek kell',
            'Csak a vezetőségnek kell',
          ],
          en: [
            'Not important',
            'Better conversion, higher price possible, competitive advantage',
            'Only marketing needs it',
            'Only management needs it',
          ],
          ru: [
            'Не важно',
            'Лучшая конверсия, возможна более высокая цена, конкурентное преимущество',
            'Только маркетингу нужно',
            'Только руководству нужно',
          ],
        },
        correct: 1,
      },
    ],
  },
  // Day 12: Value-Based Pricing
  {
    day: 12,
    title: {
      hu: 'Értékalapú árazás – Hogyan árazz az érték alapján?',
      en: 'Value-Based Pricing – How to Price Based on Value?',
      ru: 'Ценностное ценообразование – Как ценообразовать на основе ценности?',
    },
    content: {
      hu: `
<h1>Értékalapú árazás – Hogyan árazz az érték alapján?</h1>
<p><em>Ma megtanulod, hogyan árazz az érték alapján, nem a költség alapján. A kulcs: az ügyfél mennyit nyer, nem mennyit költesz.</em></p>
<hr />

<h2>Napi cél</h2>
<ul>
  <li>Megérteni, mi az értékalapú árazás</li>
  <li>Létrehozni egy értékszámítási sablont</li>
  <li>Létrehozni egy ROI kalkulátort</li>
  <li>Megtanulni, hogyan kommunikálod az értéket</li>
</ul>
<hr />

<h2>Miért fontos ez?</h2>
<ul>
  <li><strong>Magasabb ár:</strong> Értékalapú árazás = magasabb ár, mint költségalapú.</li>
  <li><strong>Jobb konverzió:</strong> Ha az ügyfél látja az értéket, könnyebben vásárol.</li>
  <li><strong>Versenyelőny:</strong> Ne versenyezz az áron – versenyezz az értéken.</li>
  <li><strong>Hosszú távú ügyfélkapcsolat:</strong> Az ügyfelek, akik értéket látnak, hosszabb távon maradnak.</li>
</ul>
<hr />

<h2>Elmagyarázás</h2>

<h3>Mi az értékalapú árazás?</h3>
<p><strong>Értékalapú árazás = az ár meghatározása az ügyfél számára nyújtott érték alapján, nem a saját költségeid alapján.</strong></p>
<p>Példa: Ha a megoldásod $10,000/év megtakarítást hoz, akkor $5,000/év ár is "olcsó".</p>

<h3>Hogyan számolod ki az értéket?</h3>
<p>3 fő komponens:</p>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <thead>
    <tr style="background-color: #FAB908; color: #000;">
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Komponens</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Mit jelent</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Példa</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>1. Időmegtakarítás</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Mennyi időt takarít meg?</td>
      <td style="padding: 12px; border: 1px solid #ddd;">2 óra/nap × $50/óra × 250 nap = $25,000/év</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>2. Költségcsökkentés</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Mennyit csökkent a költség?</td>
      <td style="padding: 12px; border: 1px solid #ddd;">$5,000/év kevesebb hiba, $3,000/év kevesebb reklamáció</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>3. Bevételnövelés</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Mennyit növel a bevételt?</td>
      <td style="padding: 12px; border: 1px solid #ddd;">20% több lead = $50,000/év több bevétel</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>ÖSSZES ÉRTÉK</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>Teljes éves érték</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>$83,000/év</strong></td>
    </tr>
  </tbody>
</table>

<h3>ROI kalkuláció</h3>
<p><strong>ROI = Return on Investment</strong> (Megtérülési ráta)</p>
<p>Példa:</p>
<ul>
  <li>Érték: $83,000/év</li>
  <li>Ár: $20,000/év</li>
  <li>ROI: ($83,000 - $20,000) / $20,000 = 315%</li>
  <li>Megtérülés: 2.9 hónap</li>
</ul>

<h3>Hogyan kommunikálod az értéket?</h3>
<p><strong>Rossz példa:</strong></p>
<ul>
  <li>"Az ár $20,000/év."</li>
  <li>Nincs érték, nincs ROI</li>
</ul>

<p><strong>Jó példa:</strong></p>
<ul>
  <li>"A megoldás $20,000/év, de $83,000/év értéket hoz: $25,000 időmegtakarítás, $8,000 költségcsökkentés, $50,000 bevételnövelés. ROI: 315%, megtérülés: 2.9 hónap."</li>
  <li>Teljes érték mutatása, ROI kalkuláció</li>
</ul>

<hr />

<h2>Gyakorlat 1 – Értékszámítás (25 perc)</h2>
<ol>
  <li><strong>Válassz egy terméket/szolgáltatást</strong></li>
  <li><strong>Számold ki az értéket:</strong> Időmegtakarítás + költségcsökkentés + bevételnövelés</li>
  <li><strong>Számold ki a ROI-t:</strong> (Érték - Ár) / Ár</li>
  <li><strong>Írd le, hogyan kommunikálod</strong> ezt az értéket</li>
</ol>

<h2>Gyakorlat 2 – ROI kalkulátor (10 perc)</h2>
<p>Hozz létre egy egyszerű ROI kalkulátort Excel-ben:</p>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <thead>
    <tr style="background-color: #FAB908; color: #000;">
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Kategória</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Érték/év</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">Időmegtakarítás</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">$0</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">Költségcsökkentés</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">$0</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">Bevételnövelés</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">$0</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>Összes érték</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;"><strong>$0</strong></td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">Ár/év</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">$0</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>ROI</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;"><strong>0%</strong></td>
    </tr>
  </tbody>
</table>

<hr />

<h2>Kulcs tanulságok</h2>
<ul>
  <li><strong>Értékalapú árazás = magasabb ár.</strong> Ne a költséged alapján árazz, hanem az érték alapján.</li>
  <li><strong>Számold ki az értéket.</strong> Időmegtakarítás + költségcsökkentés + bevételnövelés.</li>
  <li><strong>Mutass ROI-t.</strong> Az ügyfelek ROI-t akarnak látni, nem csak árat.</li>
  <li><strong>Kommunikáld az értéket.</strong> Ne csak az árat, hanem az értéket is.</li>
</ul>

<hr />

<h2>További anyagok (választható)</h2>
<ul>
  <li><strong>HubSpot – Value-Based Pricing:</strong> <a href="https://blog.hubspot.com/sales/value-based-pricing" target="_blank" rel="noopener noreferrer">https://blog.hubspot.com/sales/value-based-pricing</a> – Értékalapú árazás</li>
  <li><strong>Harvard Business Review – Value Pricing:</strong> <a href="https://hbr.org/topic/value-pricing" target="_blank" rel="noopener noreferrer">https://hbr.org/topic/value-pricing</a> – Értékalapú árazás</li>
</ul>
      `.trim(),
      en: `
<h1>Value-Based Pricing – How to Price Based on Value?</h1>
<p><em>Today you'll learn how to price based on value, not cost. The key: how much the customer gains, not how much you spend.</em></p>
<hr />

<h2>Daily Goal</h2>
<ul>
  <li>Understand what value-based pricing is</li>
  <li>Create a value calculation template</li>
  <li>Create an ROI calculator</li>
  <li>Learn how to communicate value</li>
</ul>
<hr />

<h2>Why it matters</h2>
<ul>
  <li><strong>Higher price:</strong> Value-based pricing = higher price than cost-based.</li>
  <li><strong>Better conversion:</strong> If customer sees value, they buy easier.</li>
  <li><strong>Competitive advantage:</strong> Don't compete on price – compete on value.</li>
  <li><strong>Long-term customer relationship:</strong> Customers who see value stay longer.</li>
</ul>
<hr />

<h2>Explanation</h2>

<h3>What is value-based pricing?</h3>
<p><strong>Value-based pricing = setting price based on value delivered to customer, not your own costs.</strong></p>
<p>Example: If your solution brings $10,000/year savings, then $5,000/year price is "cheap".</p>

<h3>How do you calculate value?</h3>
<p>3 main components:</p>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <thead>
    <tr style="background-color: #FAB908; color: #000;">
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Component</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">What it means</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Example</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>1. Time Savings</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">How much time does it save?</td>
      <td style="padding: 12px; border: 1px solid #ddd;">2 hours/day × $50/hour × 250 days = $25,000/year</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>2. Cost Reduction</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">How much does it reduce costs?</td>
      <td style="padding: 12px; border: 1px solid #ddd;">$5,000/year fewer errors, $3,000/year fewer complaints</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>3. Revenue Increase</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">How much does it increase revenue?</td>
      <td style="padding: 12px; border: 1px solid #ddd;">20% more leads = $50,000/year more revenue</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>TOTAL VALUE</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>Total annual value</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>$83,000/year</strong></td>
    </tr>
  </tbody>
</table>

<h3>ROI calculation</h3>
<p><strong>ROI = Return on Investment</strong></p>
<p>Example:</p>
<ul>
  <li>Value: $83,000/year</li>
  <li>Price: $20,000/year</li>
  <li>ROI: ($83,000 - $20,000) / $20,000 = 315%</li>
  <li>Payback: 2.9 months</li>
</ul>

<h3>How do you communicate value?</h3>
<p><strong>Bad example:</strong></p>
<ul>
  <li>"The price is $20,000/year."</li>
  <li>No value, no ROI</li>
</ul>

<p><strong>Good example:</strong></p>
<ul>
  <li>"The solution is $20,000/year, but brings $83,000/year value: $25,000 time savings, $8,000 cost reduction, $50,000 revenue increase. ROI: 315%, payback: 2.9 months."</li>
  <li>Full value shown, ROI calculated</li>
</ul>

<hr />

<h2>Practice 1 – Value calculation (25 min)</h2>
<ol>
  <li><strong>Choose a product/service</strong></li>
  <li><strong>Calculate the value:</strong> Time savings + cost reduction + revenue increase</li>
  <li><strong>Calculate ROI:</strong> (Value - Price) / Price</li>
  <li><strong>Write down how you communicate</strong> this value</li>
</ol>

<h2>Practice 2 – ROI calculator (10 min)</h2>
<p>Create a simple ROI calculator in Excel:</p>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <thead>
    <tr style="background-color: #FAB908; color: #000;">
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Category</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Value/year</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">Time Savings</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">$0</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">Cost Reduction</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">$0</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">Revenue Increase</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">$0</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>Total Value</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;"><strong>$0</strong></td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">Price/year</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">$0</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>ROI</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;"><strong>0%</strong></td>
    </tr>
  </tbody>
</table>

<hr />

<h2>Key Takeaways</h2>
<ul>
  <li><strong>Value-based pricing = higher price.</strong> Don't price based on your cost, but on value.</li>
  <li><strong>Calculate the value.</strong> Time savings + cost reduction + revenue increase.</li>
  <li><strong>Show ROI.</strong> Customers want to see ROI, not just price.</li>
  <li><strong>Communicate value.</strong> Not just the price, but the value too.</li>
</ul>

<hr />

<h2>Optional Resources</h2>
<ul>
  <li><strong>HubSpot – Value-Based Pricing:</strong> <a href="https://blog.hubspot.com/sales/value-based-pricing" target="_blank" rel="noopener noreferrer">https://blog.hubspot.com/sales/value-based-pricing</a> – Value-based pricing</li>
  <li><strong>Harvard Business Review – Value Pricing:</strong> <a href="https://hbr.org/topic/value-pricing" target="_blank" rel="noopener noreferrer">https://hbr.org/topic/value-pricing</a> – Value pricing</li>
</ul>
      `.trim(),
      ru: `
<h1>Ценностное ценообразование – Как ценообразовать на основе ценности?</h1>
<p><em>Сегодня вы узнаете, как ценообразовать на основе ценности, а не затрат. Ключ: сколько получает клиент, а не сколько вы тратите.</em></p>
<hr />

<h2>Цель дня</h2>
<ul>
  <li>Понять, что такое ценностное ценообразование</li>
  <li>Создать шаблон расчета ценности</li>
  <li>Создать калькулятор ROI</li>
  <li>Узнать, как коммуницировать ценность</li>
</ul>
<hr />

<h2>Почему это важно</h2>
<ul>
  <li><strong>Более высокая цена:</strong> Ценностное ценообразование = более высокая цена, чем затратное.</li>
  <li><strong>Лучшая конверсия:</strong> Если клиент видит ценность, он покупает легче.</li>
  <li><strong>Конкурентное преимущество:</strong> Не конкурируйте по цене – конкурируйте по ценности.</li>
  <li><strong>Долгосрочные отношения с клиентом:</strong> Клиенты, которые видят ценность, остаются дольше.</li>
</ul>
<hr />

<h2>Объяснение</h2>

<h3>Что такое ценностное ценообразование?</h3>
<p><strong>Ценностное ценообразование = установка цены на основе ценности, предоставляемой клиенту, а не ваших затрат.</strong></p>
<p>Пример: Если ваше решение приносит экономию $10,000/год, то цена $5,000/год "дешевая".</p>

<h3>Как рассчитать ценность?</h3>
<p>3 основных компонента:</p>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <thead>
    <tr style="background-color: #FAB908; color: #000;">
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Компонент</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Что означает</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Пример</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>1. Экономия времени</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Сколько времени экономит?</td>
      <td style="padding: 12px; border: 1px solid #ddd;">2 часа/день × $50/час × 250 дней = $25,000/год</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>2. Снижение затрат</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Насколько снижает затраты?</td>
      <td style="padding: 12px; border: 1px solid #ddd;">$5,000/год меньше ошибок, $3,000/год меньше жалоб</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>3. Увеличение дохода</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Насколько увеличивает доход?</td>
      <td style="padding: 12px; border: 1px solid #ddd;">20% больше лидов = $50,000/год больше дохода</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>ОБЩАЯ ЦЕННОСТЬ</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>Общая годовая ценность</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>$83,000/год</strong></td>
    </tr>
  </tbody>
</table>

<h3>Расчет ROI</h3>
<p><strong>ROI = Return on Investment</strong> (Возврат инвестиций)</p>
<p>Пример:</p>
<ul>
  <li>Ценность: $83,000/год</li>
  <li>Цена: $20,000/год</li>
  <li>ROI: ($83,000 - $20,000) / $20,000 = 315%</li>
  <li>Окупаемость: 2.9 месяца</li>
</ul>

<h3>Как вы коммуницируете ценность?</h3>
<p><strong>Плохой пример:</strong></p>
<ul>
  <li>"Цена $20,000/год."</li>
  <li>Нет ценности, нет ROI</li>
</ul>

<p><strong>Хороший пример:</strong></p>
<ul>
  <li>"Решение $20,000/год, но приносит $83,000/год ценности: $25,000 экономия времени, $8,000 снижение затрат, $50,000 увеличение дохода. ROI: 315%, окупаемость: 2.9 месяца."</li>
  <li>Показана полная ценность, рассчитан ROI</li>
</ul>

<hr />

<h2>Практика 1 – Расчет ценности (25 мин)</h2>
<ol>
  <li><strong>Выберите продукт/услугу</strong></li>
  <li><strong>Рассчитайте ценность:</strong> Экономия времени + снижение затрат + увеличение дохода</li>
  <li><strong>Рассчитайте ROI:</strong> (Ценность - Цена) / Цена</li>
  <li><strong>Запишите, как вы коммуницируете</strong> эту ценность</li>
</ol>

<h2>Практика 2 – Калькулятор ROI (10 мин)</h2>
<p>Создайте простой калькулятор ROI в Excel:</p>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <thead>
    <tr style="background-color: #FAB908; color: #000;">
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Категория</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Ценность/год</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">Экономия времени</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">$0</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">Снижение затрат</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">$0</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">Увеличение дохода</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">$0</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>Общая ценность</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;"><strong>$0</strong></td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">Цена/год</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">$0</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>ROI</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;"><strong>0%</strong></td>
    </tr>
  </tbody>
</table>

<hr />

<h2>Ключевые выводы</h2>
<ul>
  <li><strong>Ценностное ценообразование = более высокая цена.</strong> Не ценообразуйте на основе ваших затрат, а на основе ценности.</li>
  <li><strong>Рассчитайте ценность.</strong> Экономия времени + снижение затрат + увеличение дохода.</li>
  <li><strong>Показывайте ROI.</strong> Клиенты хотят видеть ROI, а не просто цену.</li>
  <li><strong>Коммуницируйте ценность.</strong> Не только цену, но и ценность.</li>
</ul>

<hr />

<h2>Доп. материалы (по желанию)</h2>
<ul>
  <li><strong>HubSpot – Ценностное ценообразование:</strong> <a href="https://blog.hubspot.com/sales/value-based-pricing" target="_blank" rel="noopener noreferrer">https://blog.hubspot.com/sales/value-based-pricing</a> – Ценностное ценообразование</li>
  <li><strong>Harvard Business Review – Ценностное ценообразование:</strong> <a href="https://hbr.org/topic/value-pricing" target="_blank" rel="noopener noreferrer">https://hbr.org/topic/value-pricing</a> – Ценностное ценообразование</li>
</ul>
      `.trim(),
    },
    emailSubject: {
      hu: '{{courseName}} – 12. nap: Értékalapú árazás',
      en: '{{courseName}} – Day 12: Value-Based Pricing',
      ru: '{{courseName}} – День 12: Ценностное ценообразование',
    },
    emailBody: {
      hu: `
<h1>{{courseName}}</h1>
<h2>12. nap: Értékalapú árazás</h2>
<p>Ma megtanulod, hogyan árazz az érték alapján, nem a költség alapján. A kulcs: az ügyfél mennyit nyer, nem mennyit költesz.</p>
<p><a href="{{appUrl}}/courses/{{courseId}}/day/12">Olvasd el a teljes leckét →</a></p>
      `.trim(),
      en: `
<h1>{{courseName}}</h1>
<h2>Day 12: Value-Based Pricing</h2>
<p>Today you'll learn how to price based on value, not cost. The key: how much the customer gains, not how much you spend.</p>
<p><a href="{{appUrl}}/courses/{{courseId}}/day/12">Read the full lesson →</a></p>
      `.trim(),
      ru: `
<h1>{{courseName}}</h1>
<h2>День 12: Ценностное ценообразование</h2>
<p>Сегодня вы узнаете, как ценообразовать на основе ценности, а не затрат. Ключ: сколько получает клиент, а не сколько вы тратите.</p>
<p><a href="{{appUrl}}/courses/{{courseId}}/day/12">Прочитать полный урок →</a></p>
      `.trim(),
    },
    quiz: [
      {
        q: {
          hu: 'Mi az értékalapú árazás?',
          en: 'What is value-based pricing?',
          ru: 'Что такое ценностное ценообразование?',
        },
        options: {
          hu: [
            'Csak az ár',
            'Az ár meghatározása az ügyfél számára nyújtott érték alapján, nem a saját költségeid alapján',
            'Csak a kedvezmények',
            'Nem fontos',
          ],
          en: [
            'Just the price',
            'Setting price based on value delivered to customer, not your own costs',
            'Just discounts',
            'Not important',
          ],
          ru: [
            'Просто цена',
            'Установка цены на основе ценности, предоставляемой клиенту, а не ваших затрат',
            'Просто скидки',
            'Не важно',
          ],
        },
        correct: 1,
      },
      {
        q: {
          hu: 'Hogyan számolod ki az értéket?',
          en: 'How do you calculate value?',
          ru: 'Как вы рассчитываете ценность?',
        },
        options: {
          hu: [
            'Csak az árat',
            'Időmegtakarítás + költségcsökkentés + bevételnövelés',
            'Csak a költségeket',
            'Ne számold ki',
          ],
          en: [
            'Just the price',
            'Time savings + cost reduction + revenue increase',
            'Just the costs',
            'Don\'t calculate it',
          ],
          ru: [
            'Просто цену',
            'Экономия времени + снижение затрат + увеличение дохода',
            'Просто затраты',
            'Не рассчитывайте',
          ],
        },
        correct: 1,
      },
      {
        q: {
          hu: 'Mi a ROI?',
          en: 'What is ROI?',
          ru: 'Что такое ROI?',
        },
        options: {
          hu: [
            'Return on Investment – megtérülési ráta',
            'Rate of Interest',
            'Return on Income',
            'Nem fontos',
          ],
          en: [
            'Return on Investment – return rate',
            'Rate of Interest',
            'Return on Income',
            'Not important',
          ],
          ru: [
            'Return on Investment – коэффициент возврата инвестиций',
            'Rate of Interest',
            'Return on Income',
            'Не важно',
          ],
        },
        correct: 0,
      },
      {
        q: {
          hu: 'Hogyan számolod ki a ROI-t?',
          en: 'How do you calculate ROI?',
          ru: 'Как вы рассчитываете ROI?',
        },
        options: {
          hu: [
            'Csak az árat',
            '(Érték - Ár) / Ár',
            'Csak az értéket',
            'Ne számold ki',
          ],
          en: [
            'Just the price',
            '(Value - Price) / Price',
            'Just the value',
            'Don\'t calculate it',
          ],
          ru: [
            'Просто цену',
            '(Ценность - Цена) / Цена',
            'Просто ценность',
            'Не рассчитывайте',
          ],
        },
        correct: 1,
      },
      {
        q: {
          hu: 'Miért fontos az értékalapú árazás?',
          en: 'Why is value-based pricing important?',
          ru: 'Почему важно ценностное ценообразование?',
        },
        options: {
          hu: [
            'Nem fontos',
            'Magasabb ár lehet, jobb konverzió, versenyelőny',
            'Csak a marketingnek kell',
            'Csak a vezetőségnek kell',
          ],
          en: [
            'Not important',
            'Higher price possible, better conversion, competitive advantage',
            'Only marketing needs it',
            'Only management needs it',
          ],
          ru: [
            'Не важно',
            'Возможна более высокая цена, лучшая конверсия, конкурентное преимущество',
            'Только маркетингу нужно',
            'Только руководству нужно',
          ],
        },
        correct: 1,
      },
    ],
  },
  // Day 13: Freebies & Bonuses
  {
    day: 13,
    title: {
      hu: 'Ingyenes ajándékok és bónuszok – Mit adhatsz, hogy bezárj egy üzletet?',
      en: 'Freebies & Bonuses – What Can You Give to Close a Deal?',
      ru: 'Бесплатные подарки и бонусы – Что можно дать, чтобы закрыть сделку?',
    },
    content: {
      hu: `
<h1>Ingyenes ajándékok és bónuszok – Mit adhatsz, hogy bezárj egy üzletet?</h1>
<p><em>Ma megtanulod, hogyan használj ingyenes ajándékokat és bónuszokat a bezárás érdekében. A kulcs: ne adj kedvezményt – adj értéket!</em></p>
<hr />

<h2>Napi cél</h2>
<ul>
  <li>Megérteni a különbséget kedvezmény és ingyenes ajándék között</li>
  <li>Azonosítani, milyen ingyenes ajándékokat adhatsz</li>
  <li>Létrehozni egy "freebie listát"</li>
  <li>Megtanulni, hogyan kommunikálod az ingyenes ajándékokat</li>
</ul>
<hr />

<h2>Miért fontos ez?</h2>
<ul>
  <li><strong>Kedvezmény = ár csökkentés.</strong> Ingyenes ajándék = érték növelés.</li>
  <li><strong>Jobb érzés:</strong> Az ügyfelek jobban érzik magukat, ha "többet kapnak", mint ha "kevesebbet fizetnek".</li>
  <li><strong>Magasabb ár:</strong> Ha ingyenes ajándékot adsz, megtarthatod a magas árat.</li>
  <li><strong>Versenyelőny:</strong> Aki értéket ad, az többet zár le, mint aki csak kedvezményt ad.</li>
</ul>
<hr />

<h2>Elmagyarázás</h2>

<h3>Kedvezmény vs. Ingyenes ajándék</h3>
<p><strong>Kedvezmény:</strong> "Az ár $1000 helyett $800." (ár csökkentés)</p>
<p><strong>Ingyenes ajándék:</strong> "Az ár $1000, és ingyen adunk 3 hónap támogatást + onboarding-t." (érték növelés)</p>
<p><strong>Miért jobb az ingyenes ajándék?</strong> Megtarthatod a magas árat, és az ügyfél "többet kap".</p>

<h3>Milyen ingyenes ajándékokat adhatsz?</h3>
<p>5 fő kategória:</p>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <thead>
    <tr style="background-color: #FAB908; color: #000;">
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Kategória</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Mit jelent</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Példa</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>1. Szolgáltatás</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Ingyenes szolgáltatás</td>
      <td style="padding: 12px; border: 1px solid #ddd;">3 hónap támogatás, onboarding, képzés</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>2. Termék</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Ingyenes termék vagy modul</td>
      <td style="padding: 12px; border: 1px solid #ddd;">Prémium modul, extra funkció, API hozzáférés</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>3. Idő</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Ingyenes idő vagy hosszabbítás</td>
      <td style="padding: 12px; border: 1px solid #ddd;">1 hónap ingyenes, 3 hónap hosszabbítás</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>4. Képzés/Tartalom</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Ingyenes képzés vagy tartalom</td>
      <td style="padding: 12px; border: 1px solid #ddd;">Képzés, whitepaper, template, workshop</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>5. Partneri ajánlat</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Partneri kedvezmény vagy ajánlat</td>
      <td style="padding: 12px; border: 1px solid #ddd;">Partneri integráció, referral program hozzáférés</td>
    </tr>
  </tbody>
</table>

<h3>Hogyan kommunikálod az ingyenes ajándékokat?</h3>
<p><strong>Rossz példa:</strong></p>
<ul>
  <li>"Adok 20% kedvezményt."</li>
  <li>Ár csökkentés, nem érték növelés</li>
</ul>

<p><strong>Jó példa:</strong></p>
<ul>
  <li>"Az ár $1000, és ingyen adunk 3 hónap prémium támogatást ($500 érték) + onboarding képzést ($300 érték) + 1 hónap hosszabbítást. Összesen $1800 érték $1000-ért."</li>
  <li>Érték növelés, konkrét érték mutatása</li>
</ul>

<h3>Freebie stratégia</h3>
<ol>
  <li><strong>Készíts egy "freebie listát":</strong> Mit adhatsz ingyen?</li>
  <li><strong>Számold ki az értéket:</strong> Mennyit ér minden freebie?</li>
  <li><strong>Használd stratégiailag:</strong> Ne adj mindent mindenkinek – válaszd ki, mit adsz kinek</li>
  <li><strong>Kommunikáld az értéket:</strong> Ne csak "ingyen", hanem "X érték ingyen"</li>
</ol>

<hr />

<h2>Gyakorlat 1 – Freebie lista (20 perc)</h2>
<ol>
  <li><strong>Írj le 5-10 ingyenes ajándékot,</strong> amit adhatsz</li>
  <li><strong>Számold ki az értéket:</strong> Mennyit ér mindegyik?</li>
  <li><strong>Rangsorold:</strong> Melyik a legértékesebb? Melyik a legolcsóbb számodra?</li>
</ol>

<h2>Gyakorlat 2 – Freebie kommunikáció sablon (15 perc)</h2>
<p>Hozz létre egy sablont, hogyan kommunikálod az ingyenes ajándékokat:</p>
<ul>
  <li><strong>Mi az ajándék:</strong> Konkrét leírás</li>
  <li><strong>Mennyit ér:</strong> Érték számítás</li>
  <li><strong>Miért adod:</strong> "Hogy gyorsabban elindulhass" vs. "kedvezmény"</li>
  <li><strong>Hogyan kommunikálod:</strong> "Ingyen adunk X-t (Y érték)"</li>
</ul>

<hr />

<h2>Kulcs tanulságok</h2>
<ul>
  <li><strong>Ne adj kedvezményt – adj értéket.</strong> Ingyenes ajándék = érték növelés, nem ár csökkentés.</li>
  <li><strong>Számold ki az értéket.</strong> Minden freebie-nek legyen konkrét értéke.</li>
  <li><strong>Kommunikáld az értéket.</strong> Ne csak "ingyen", hanem "X érték ingyen".</li>
  <li><strong>Használd stratégiailag.</strong> Ne adj mindent mindenkinek – válaszd ki, mit adsz.</li>
</ul>

<hr />

<h2>További anyagok (választható)</h2>
<ul>
  <li><strong>HubSpot – Sales Bonuses:</strong> <a href="https://blog.hubspot.com/sales/sales-bonuses" target="_blank" rel="noopener noreferrer">https://blog.hubspot.com/sales/sales-bonuses</a> – Értékesítési bónuszok</li>
  <li><strong>Salesforce – Value-Add Selling:</strong> <a href="https://www.salesforce.com/resources/articles/value-add-selling/" target="_blank" rel="noopener noreferrer">https://www.salesforce.com/resources/articles/value-add-selling/</a> – Értékalapú értékesítés</li>
</ul>
      `.trim(),
      en: `
<h1>Freebies & Bonuses – What Can You Give to Close a Deal?</h1>
<p><em>Today you'll learn how to use freebies and bonuses to close deals. The key: don't give discount – give value!</em></p>
<hr />

<h2>Daily Goal</h2>
<ul>
  <li>Understand the difference between discount and freebie</li>
  <li>Identify what freebies you can give</li>
  <li>Create a "freebie list"</li>
  <li>Learn how to communicate freebies</li>
</ul>
<hr />

<h2>Why it matters</h2>
<ul>
  <li><strong>Discount = price reduction.</strong> Freebie = value increase.</li>
  <li><strong>Better feeling:</strong> Customers feel better if they "get more" than if they "pay less".</li>
  <li><strong>Higher price:</strong> If you give freebies, you can keep the high price.</li>
  <li><strong>Competitive advantage:</strong> Those who give value close more than those who just give discounts.</li>
</ul>
<hr />

<h2>Explanation</h2>

<h3>Discount vs. Freebie</h3>
<p><strong>Discount:</strong> "Price is $800 instead of $1000." (price reduction)</p>
<p><strong>Freebie:</strong> "Price is $1000, and we give 3 months support + onboarding for free." (value increase)</p>
<p><strong>Why is freebie better?</strong> You can keep the high price, and customer "gets more".</p>

<h3>What freebies can you give?</h3>
<p>5 main categories:</p>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <thead>
    <tr style="background-color: #FAB908; color: #000;">
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Category</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">What it means</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Example</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>1. Service</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Free service</td>
      <td style="padding: 12px; border: 1px solid #ddd;">3 months support, onboarding, training</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>2. Product</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Free product or module</td>
      <td style="padding: 12px; border: 1px solid #ddd;">Premium module, extra feature, API access</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>3. Time</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Free time or extension</td>
      <td style="padding: 12px; border: 1px solid #ddd;">1 month free, 3 months extension</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>4. Training/Content</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Free training or content</td>
      <td style="padding: 12px; border: 1px solid #ddd;">Training, whitepaper, template, workshop</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>5. Partner Offer</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Partner discount or offer</td>
      <td style="padding: 12px; border: 1px solid #ddd;">Partner integration, referral program access</td>
    </tr>
  </tbody>
</table>

<h3>How do you communicate freebies?</h3>
<p><strong>Bad example:</strong></p>
<ul>
  <li>"I'll give 20% discount."</li>
  <li>Price reduction, not value increase</li>
</ul>

<p><strong>Good example:</strong></p>
<ul>
  <li>"Price is $1000, and we give 3 months premium support ($500 value) + onboarding training ($300 value) + 1 month extension for free. Total $1800 value for $1000."</li>
  <li>Value increase, concrete value shown</li>
</ul>

<h3>Freebie strategy</h3>
<ol>
  <li><strong>Create a "freebie list":</strong> What can you give for free?</li>
  <li><strong>Calculate the value:</strong> How much is each freebie worth?</li>
  <li><strong>Use strategically:</strong> Don't give everything to everyone – choose what to give to whom</li>
  <li><strong>Communicate value:</strong> Not just "free", but "X value for free"</li>
</ol>

<hr />

<h2>Practice 1 – Freebie list (20 min)</h2>
<ol>
  <li><strong>Write down 5-10 freebies</strong> you can give</li>
  <li><strong>Calculate the value:</strong> How much is each worth?</li>
  <li><strong>Rank them:</strong> Which is most valuable? Which is cheapest for you?</li>
</ol>

<h2>Practice 2 – Freebie communication template (15 min)</h2>
<p>Create a template for how you communicate freebies:</p>
<ul>
  <li><strong>What is the gift:</strong> Concrete description</li>
  <li><strong>How much is it worth:</strong> Value calculation</li>
  <li><strong>Why you give it:</strong> "To get started faster" vs. "discount"</li>
  <li><strong>How you communicate:</strong> "We give X for free (Y value)"</li>
</ul>

<hr />

<h2>Key Takeaways</h2>
<ul>
  <li><strong>Don't give discount – give value.</strong> Freebie = value increase, not price reduction.</li>
  <li><strong>Calculate the value.</strong> Every freebie should have concrete value.</li>
  <li><strong>Communicate value.</strong> Not just "free", but "X value for free".</li>
  <li><strong>Use strategically.</strong> Don't give everything to everyone – choose what to give.</li>
</ul>

<hr />

<h2>Optional Resources</h2>
<ul>
  <li><strong>HubSpot – Sales Bonuses:</strong> <a href="https://blog.hubspot.com/sales/sales-bonuses" target="_blank" rel="noopener noreferrer">https://blog.hubspot.com/sales/sales-bonuses</a> – Sales bonuses</li>
  <li><strong>Salesforce – Value-Add Selling:</strong> <a href="https://www.salesforce.com/resources/articles/value-add-selling/" target="_blank" rel="noopener noreferrer">https://www.salesforce.com/resources/articles/value-add-selling/</a> – Value-add selling</li>
</ul>
      `.trim(),
      ru: `
<h1>Бесплатные подарки и бонусы – Что можно дать, чтобы закрыть сделку?</h1>
<p><em>Сегодня вы узнаете, как использовать бесплатные подарки и бонусы для закрытия сделок. Ключ: не давайте скидку – давайте ценность!</em></p>
<hr />

<h2>Цель дня</h2>
<ul>
  <li>Понять разницу между скидкой и бесплатным подарком</li>
  <li>Определить, какие бесплатные подарки можно дать</li>
  <li>Создать "список бесплатных подарков"</li>
  <li>Узнать, как коммуницировать бесплатные подарки</li>
</ul>
<hr />

<h2>Почему это важно</h2>
<ul>
  <li><strong>Скидка = снижение цены.</strong> Бесплатный подарок = увеличение ценности.</li>
  <li><strong>Лучшее ощущение:</strong> Клиенты чувствуют себя лучше, если "получают больше", чем если "платят меньше".</li>
  <li><strong>Более высокая цена:</strong> Если даете бесплатные подарки, можете сохранить высокую цену.</li>
  <li><strong>Конкурентное преимущество:</strong> Те, кто дает ценность, закрывают больше, чем те, кто просто дает скидки.</li>
</ul>
<hr />

<h2>Объяснение</h2>

<h3>Скидка vs. Бесплатный подарок</h3>
<p><strong>Скидка:</strong> "Цена $800 вместо $1000." (снижение цены)</p>
<p><strong>Бесплатный подарок:</strong> "Цена $1000, и мы даем 3 месяца поддержки + онбординг бесплатно." (увеличение ценности)</p>
<p><strong>Почему бесплатный подарок лучше?</strong> Можете сохранить высокую цену, и клиент "получает больше".</p>

<h3>Какие бесплатные подарки можно дать?</h3>
<p>5 основных категорий:</p>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <thead>
    <tr style="background-color: #FAB908; color: #000;">
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Категория</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Что означает</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Пример</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>1. Услуга</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Бесплатная услуга</td>
      <td style="padding: 12px; border: 1px solid #ddd;">3 месяца поддержки, онбординг, обучение</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>2. Продукт</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Бесплатный продукт или модуль</td>
      <td style="padding: 12px; border: 1px solid #ddd;">Премиум модуль, дополнительная функция, доступ к API</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>3. Время</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Бесплатное время или продление</td>
      <td style="padding: 12px; border: 1px solid #ddd;">1 месяц бесплатно, продление на 3 месяца</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>4. Обучение/Контент</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Бесплатное обучение или контент</td>
      <td style="padding: 12px; border: 1px solid #ddd;">Обучение, whitepaper, шаблон, воркшоп</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>5. Партнерское предложение</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Партнерская скидка или предложение</td>
      <td style="padding: 12px; border: 1px solid #ddd;">Партнерская интеграция, доступ к referral программе</td>
    </tr>
  </tbody>
</table>

<h3>Как вы коммуницируете бесплатные подарки?</h3>
<p><strong>Плохой пример:</strong></p>
<ul>
  <li>"Дам 20% скидку."</li>
  <li>Снижение цены, а не увеличение ценности</li>
</ul>

<p><strong>Хороший пример:</strong></p>
<ul>
  <li>"Цена $1000, и мы даем 3 месяца премиум поддержки ($500 ценности) + онбординг обучение ($300 ценности) + продление на 1 месяц бесплатно. Всего $1800 ценности за $1000."</li>
  <li>Увеличение ценности, показана конкретная ценность</li>
</ul>

<h3>Стратегия бесплатных подарков</h3>
<ol>
  <li><strong>Создайте "список бесплатных подарков":</strong> Что можете дать бесплатно?</li>
  <li><strong>Рассчитайте ценность:</strong> Сколько стоит каждый бесплатный подарок?</li>
  <li><strong>Используйте стратегически:</strong> Не давайте все всем – выберите, что дать кому</li>
  <li><strong>Коммуницируйте ценность:</strong> Не просто "бесплатно", а "X ценности бесплатно"</li>
</ol>

<hr />

<h2>Практика 1 – Список бесплатных подарков (20 мин)</h2>
<ol>
  <li><strong>Запишите 5-10 бесплатных подарков,</strong> которые можете дать</li>
  <li><strong>Рассчитайте ценность:</strong> Сколько стоит каждый?</li>
  <li><strong>Ранжируйте:</strong> Какой самый ценный? Какой самый дешевый для вас?</li>
</ol>

<h2>Практика 2 – Шаблон коммуникации бесплатных подарков (15 мин)</h2>
<p>Создайте шаблон для коммуникации бесплатных подарков:</p>
<ul>
  <li><strong>Что за подарок:</strong> Конкретное описание</li>
  <li><strong>Сколько стоит:</strong> Расчет ценности</li>
  <li><strong>Почему даете:</strong> "Чтобы быстрее начать" vs. "скидка"</li>
  <li><strong>Как коммуницируете:</strong> "Даем X бесплатно (Y ценности)"</li>
</ul>

<hr />

<h2>Ключевые выводы</h2>
<ul>
  <li><strong>Не давайте скидку – давайте ценность.</strong> Бесплатный подарок = увеличение ценности, а не снижение цены.</li>
  <li><strong>Рассчитайте ценность.</strong> Каждый бесплатный подарок должен иметь конкретную ценность.</li>
  <li><strong>Коммуницируйте ценность.</strong> Не просто "бесплатно", а "X ценности бесплатно".</li>
  <li><strong>Используйте стратегически.</strong> Не давайте все всем – выберите, что дать.</li>
</ul>

<hr />

<h2>Доп. материалы (по желанию)</h2>
<ul>
  <li><strong>HubSpot – Бонусы продаж:</strong> <a href="https://blog.hubspot.com/sales/sales-bonuses" target="_blank" rel="noopener noreferrer">https://blog.hubspot.com/sales/sales-bonuses</a> – Бонусы продаж</li>
  <li><strong>Salesforce – Продажи с добавленной ценностью:</strong> <a href="https://www.salesforce.com/resources/articles/value-add-selling/" target="_blank" rel="noopener noreferrer">https://www.salesforce.com/resources/articles/value-add-selling/</a> – Продажи с добавленной ценностью</li>
</ul>
      `.trim(),
    },
    emailSubject: {
      hu: '{{courseName}} – 13. nap: Ingyenes ajándékok és bónuszok',
      en: '{{courseName}} – Day 13: Freebies & Bonuses',
      ru: '{{courseName}} – День 13: Бесплатные подарки и бонусы',
    },
    emailBody: {
      hu: `
<h1>{{courseName}}</h1>
<h2>13. nap: Ingyenes ajándékok és bónuszok</h2>
<p>Ma megtanulod, hogyan használj ingyenes ajándékokat és bónuszokat a bezárás érdekében. A kulcs: ne adj kedvezményt – adj értéket!</p>
<p><a href="{{appUrl}}/courses/{{courseId}}/day/13">Olvasd el a teljes leckét →</a></p>
      `.trim(),
      en: `
<h1>{{courseName}}</h1>
<h2>Day 13: Freebies & Bonuses</h2>
<p>Today you'll learn how to use freebies and bonuses to close deals. The key: don't give discount – give value!</p>
<p><a href="{{appUrl}}/courses/{{courseId}}/day/13">Read the full lesson →</a></p>
      `.trim(),
      ru: `
<h1>{{courseName}}</h1>
<h2>День 13: Бесплатные подарки и бонусы</h2>
<p>Сегодня вы узнаете, как использовать бесплатные подарки и бонусы для закрытия сделок. Ключ: не давайте скидку – давайте ценность!</p>
<p><a href="{{appUrl}}/courses/{{courseId}}/day/13">Прочитать полный урок →</a></p>
      `.trim(),
    },
    quiz: [
      {
        q: {
          hu: 'Mi a különbség kedvezmény és ingyenes ajándék között?',
          en: 'What is the difference between discount and freebie?',
          ru: 'В чем разница между скидкой и бесплатным подарком?',
        },
        options: {
          hu: [
            'Nincs különbség',
            'Kedvezmény = ár csökkentés, Ingyenes ajándék = érték növelés',
            'Ugyanaz',
            'Nem fontos',
          ],
          en: [
            'No difference',
            'Discount = price reduction, Freebie = value increase',
            'Same thing',
            'Not important',
          ],
          ru: [
            'Нет разницы',
            'Скидка = снижение цены, Бесплатный подарок = увеличение ценности',
            'Одно и то же',
            'Не важно',
          ],
        },
        correct: 1,
      },
      {
        q: {
          hu: 'Miért jobb az ingyenes ajándék, mint a kedvezmény?',
          en: 'Why is freebie better than discount?',
          ru: 'Почему бесплатный подарок лучше, чем скидка?',
        },
        options: {
          hu: [
            'Nem jobb',
            'Megtarthatod a magas árat, és az ügyfél "többet kap"',
            'Csak olcsóbb',
            'Nem fontos',
          ],
          en: [
            'Not better',
            'You can keep the high price, and customer "gets more"',
            'Just cheaper',
            'Not important',
          ],
          ru: [
            'Не лучше',
            'Можете сохранить высокую цену, и клиент "получает больше"',
            'Просто дешевле',
            'Не важно',
          ],
        },
        correct: 1,
      },
      {
        q: {
          hu: 'Hány fő kategóriája van az ingyenes ajándékoknak?',
          en: 'How many main categories do freebies have?',
          ru: 'Сколько основных категорий у бесплатных подарков?',
        },
        options: {
          hu: ['3', '5', '10', 'Nincs fix szám'],
          en: ['3', '5', '10', 'No fixed number'],
          ru: ['3', '5', '10', 'Нет фиксированного числа'],
        },
        correct: 1,
      },
      {
        q: {
          hu: 'Hogyan kommunikálod az ingyenes ajándékokat?',
          en: 'How do you communicate freebies?',
          ru: 'Как вы коммуницируете бесплатные подарки?',
        },
        options: {
          hu: [
            'Csak "ingyen"',
            'Értékben kommunikálás: "X érték ingyen"',
            'Ne kommunikáld',
            'Csak a kedvezményt mutasd',
          ],
          en: [
            'Just "free"',
            'Value communication: "X value for free"',
            'Don\'t communicate it',
            'Just show the discount',
          ],
          ru: [
            'Просто "бесплатно"',
            'Коммуникация в ценности: "X ценности бесплатно"',
            'Не коммуницируйте',
            'Просто покажите скидку',
          ],
        },
        correct: 1,
      },
      {
        q: {
          hu: 'Miért fontos stratégiailag használni az ingyenes ajándékokat?',
          en: 'Why is it important to use freebies strategically?',
          ru: 'Почему важно использовать бесплатные подарки стратегически?',
        },
        options: {
          hu: [
            'Nem fontos',
            'Ne adj mindent mindenkinek – válaszd ki, mit adsz kinek',
            'Adj mindent mindenkinek',
            'Ne adj semmit',
          ],
          en: [
            'Not important',
            'Don\'t give everything to everyone – choose what to give to whom',
            'Give everything to everyone',
            'Don\'t give anything',
          ],
          ru: [
            'Не важно',
            'Не давайте все всем – выберите, что дать кому',
            'Давайте все всем',
            'Не давайте ничего',
          ],
        },
        correct: 1,
      },
    ],
  },
  // Day 14: Handling Price Objections
  {
    day: 14,
    title: {
      hu: 'Ár kifogások kezelése – Hogyan válaszolj, amikor "túl drága"?',
      en: 'Handling Price Objections – How to Respond When "Too Expensive"?',
      ru: 'Работа с возражениями по цене – Как отвечать, когда "слишком дорого"?',
    },
    content: {
      hu: `
<h1>Ár kifogások kezelése – Hogyan válaszolj, amikor "túl drága"?</h1>
<p><em>Ma megtanulod, hogyan kezeld az ár kifogásokat. A kulcs: ne védd az árat – mutasd az értéket!</em></p>
<hr />

<h2>Napi cél</h2>
<ul>
  <li>Megérteni, mi az ár kifogás és miért jelenik meg</li>
  <li>Létrehozni egy ár kifogás kezelési sablont</li>
  <li>Gyakorolni a leggyakoribb ár kifogásokra adott válaszokat</li>
  <li>Megtanulni, hogyan válts át értékre</li>
</ul>
<hr />

<h2>Miért fontos ez?</h2>
<ul>
  <li><strong>Gyakori kifogás:</strong> "Túl drága" a leggyakoribb kifogás.</li>
  <li><strong>Nem mindig ár probléma:</strong> Gyakran érték vagy bizalom probléma.</li>
  <li><strong>Jobb konverzió:</strong> Ha jól kezeled, többet zársz le.</li>
  <li><strong>Magasabb ár:</strong> Ha jól kezeled, nem kell kedvezményt adnod.</li>
</ul>
<hr />

<h2>Elmagyarázás</h2>

<h3>Mi az ár kifogás?</h3>
<p><strong>Ár kifogás = amikor az ügyfél azt mondja: "Túl drága" vagy "Nem fér bele a költségvetésbe".</strong></p>
<p>Fontos: Ez nem mindig valódi ár probléma – gyakran érték vagy bizalom probléma.</p>

<h3>5 leggyakoribb ár kifogás és válasz</h3>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <thead>
    <tr style="background-color: #FAB908; color: #000;">
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Kifogás</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Válasz</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">"Túl drága"</td>
      <td style="padding: 12px; border: 1px solid #ddd;">"Értem. Mi a fő probléma, amit meg kell oldani? [Érték mutatása]"</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">"Nincs rá költségvetés"</td>
      <td style="padding: 12px; border: 1px solid #ddd;">"Értem. Mikorra kell megoldani? [Sürgősség] Mennyi a jelenlegi költség? [Összehasonlítás]"</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">"Olcsóbb alternatíva van"</td>
      <td style="padding: 12px; border: 1px solid #ddd;">"Értem. Mi a különbség? [Érték mutatása] Mennyi az olcsóbb alternatíva valódi költsége? [Rejtett költségek]"</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">"Később döntünk"</td>
      <td style="padding: 12px; border: 1px solid #ddd;">"Értem. Mi a fő kockázat, ha nem döntötök most? [Kockázat mutatása]"</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">"Kérj kedvezményt"</td>
      <td style="padding: 12px; border: 1px solid #ddd;">"Értem. Az ár $1000, de adhatok ingyenes ajándékot: 3 hónap támogatás ($500 érték) + onboarding ($300 érték). Összesen $1800 érték $1000-ért."</td>
    </tr>
  </tbody>
</table>

<h3>Ár kifogás kezelési sablon</h3>
<ol>
  <li><strong>Elismerés (1 mp):</strong> "Értem." (ne vitázz, ne védd az árat)</li>
  <li><strong>Kérdés (30 mp):</strong> "Mi a fő probléma?" vagy "Mi a jelenlegi költség?"</li>
  <li><strong>Érték mutatása (2 perc):</strong> ROI, megtérülés, összehasonlítás</li>
  <li><strong>Következő lépés (30 mp):</strong> "Szeretnél egy ROI kalkulációt látni?"</li>
</ol>

<h3>Jó vs. rossz válasz</h3>
<p><strong>Rossz példa:</strong></p>
<ul>
  <li>"De ez nem drága!" (védés, vitatkozás)</li>
  <li>"Adok 20% kedvezményt." (azonnali kedvezmény)</li>
</ul>

<p><strong>Jó példa:</strong></p>
<ul>
  <li>"Értem. Mi a fő probléma, amit meg kell oldani? [Hallgatás] A megoldás $1000/év, de $83,000/év értéket hoz. ROI: 315%, megtérülés: 2.9 hónap. Szeretnél egy részletes ROI kalkulációt látni?"</li>
  <li>Érték mutatása, nem ár védése</li>
</ul>

<hr />

<h2>Gyakorlat 1 – Ár kifogás kezelési sablon (20 perc)</h2>
<ol>
  <li><strong>Írd le a 5 leggyakoribb ár kifogást</strong> a te üzletedhez</li>
  <li><strong>Írd le a válaszokat</strong> mindegyikre (elismerés → kérdés → érték → következő lépés)</li>
  <li><strong>Gyakorold hangosan</strong> – hogyan hangzanak természetesen?</li>
</ol>

<h2>Gyakorlat 2 – Értékre váltás (15 perc)</h2>
<p>Gyakorold, hogyan váltasz át árról értékre:</p>
<ul>
  <li><strong>Ár:</strong> "Az ár $1000."</li>
  <li><strong>Értékre váltás:</strong> "A megoldás $1000/év, de $83,000/év értéket hoz. ROI: 315%."</li>
</ul>

<hr />

<h2>Kulcs tanulságok</h2>
<ul>
  <li><strong>Ne védd az árat – mutasd az értéket.</strong> Az ár kifogás gyakran érték probléma.</li>
  <li><strong>Elismerd a kifogást.</strong> "Értem" – ne vitázz, ne védd.</li>
  <li><strong>Kérdezz.</strong> Mi a fő probléma? Mennyi a jelenlegi költség?</li>
  <li><strong>Mutasd az értéket.</strong> ROI, megtérülés, összehasonlítás.</li>
</ul>

<hr />

<h2>További anyagok (választható)</h2>
<ul>
  <li><strong>HubSpot – Handling Price Objections:</strong> <a href="https://blog.hubspot.com/sales/price-objections" target="_blank" rel="noopener noreferrer">https://blog.hubspot.com/sales/price-objections</a> – Ár kifogások kezelése</li>
  <li><strong>Salesforce – Objection Handling:</strong> <a href="https://www.salesforce.com/resources/articles/objection-handling/" target="_blank" rel="noopener noreferrer">https://www.salesforce.com/resources/articles/objection-handling/</a> – Kifogások kezelése</li>
</ul>
      `.trim(),
      en: `
<h1>Handling Price Objections – How to Respond When "Too Expensive"?</h1>
<p><em>Today you'll learn how to handle price objections. The key: don't defend the price – show the value!</em></p>
<hr />

<h2>Daily Goal</h2>
<ul>
  <li>Understand what price objection is and why it appears</li>
  <li>Create a price objection handling template</li>
  <li>Practice responses to most common price objections</li>
  <li>Learn how to switch to value</li>
</ul>
<hr />

<h2>Why it matters</h2>
<ul>
  <li><strong>Common objection:</strong> "Too expensive" is the most common objection.</li>
  <li><strong>Not always price problem:</strong> Often it's a value or trust problem.</li>
  <li><strong>Better conversion:</strong> If you handle well, you close more.</li>
  <li><strong>Higher price:</strong> If you handle well, you don't need to give discount.</li>
</ul>
<hr />

<h2>Explanation</h2>

<h3>What is price objection?</h3>
<p><strong>Price objection = when customer says: "Too expensive" or "Doesn't fit the budget".</strong></p>
<p>Important: This is not always a real price problem – often it's a value or trust problem.</p>

<h3>5 most common price objections and responses</h3>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <thead>
    <tr style="background-color: #FAB908; color: #000;">
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Objection</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Response</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">"Too expensive"</td>
      <td style="padding: 12px; border: 1px solid #ddd;">"I understand. What is the main problem that needs to be solved? [Show value]"</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">"No budget for it"</td>
      <td style="padding: 12px; border: 1px solid #ddd;">"I understand. When does this need to be solved? [Urgency] What is the current cost? [Comparison]"</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">"Cheaper alternative exists"</td>
      <td style="padding: 12px; border: 1px solid #ddd;">"I understand. What's the difference? [Show value] What is the real cost of the cheaper alternative? [Hidden costs]"</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">"We'll decide later"</td>
      <td style="padding: 12px; border: 1px solid #ddd;">"I understand. What is the main risk if you don't decide now? [Show risk]"</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">"Ask for discount"</td>
      <td style="padding: 12px; border: 1px solid #ddd;">"I understand. Price is $1000, but I can give free bonus: 3 months support ($500 value) + onboarding ($300 value). Total $1800 value for $1000."</td>
    </tr>
  </tbody>
</table>

<h3>Price objection handling template</h3>
<ol>
  <li><strong>Acknowledge (1 sec):</strong> "I understand." (don't argue, don't defend price)</li>
  <li><strong>Question (30 sec):</strong> "What is the main problem?" or "What is the current cost?"</li>
  <li><strong>Show value (2 min):</strong> ROI, payback, comparison</li>
  <li><strong>Next step (30 sec):</strong> "Would you like to see an ROI calculation?"</li>
</ol>

<h3>Good vs. bad response</h3>
<p><strong>Bad example:</strong></p>
<ul>
  <li>"But it's not expensive!" (defense, argument)</li>
  <li>"I'll give 20% discount." (immediate discount)</li>
</ul>

<p><strong>Good example:</strong></p>
<ul>
  <li>"I understand. What is the main problem that needs to be solved? [Listen] The solution is $1000/year, but brings $83,000/year value. ROI: 315%, payback: 2.9 months. Would you like to see a detailed ROI calculation?"</li>
  <li>Show value, not defend price</li>
</ul>

<hr />

<h2>Practice 1 – Price objection handling template (20 min)</h2>
<ol>
  <li><strong>Write down the 5 most common price objections</strong> for your deals</li>
  <li><strong>Write down responses</strong> to each (acknowledge → question → value → next step)</li>
  <li><strong>Practice out loud</strong> – how do they sound natural?</li>
</ol>

<h2>Practice 2 – Switch to value (15 min)</h2>
<p>Practice how to switch from price to value:</p>
<ul>
  <li><strong>Price:</strong> "The price is $1000."</li>
  <li><strong>Switch to value:</strong> "The solution is $1000/year, but brings $83,000/year value. ROI: 315%."</li>
</ul>

<hr />

<h2>Key Takeaways</h2>
<ul>
  <li><strong>Don't defend price – show value.</strong> Price objection is often a value problem.</li>
  <li><strong>Acknowledge the objection.</strong> "I understand" – don't argue, don't defend.</li>
  <li><strong>Ask questions.</strong> What is the main problem? What is the current cost?</li>
  <li><strong>Show value.</strong> ROI, payback, comparison.</li>
</ul>

<hr />

<h2>Optional Resources</h2>
<ul>
  <li><strong>HubSpot – Handling Price Objections:</strong> <a href="https://blog.hubspot.com/sales/price-objections" target="_blank" rel="noopener noreferrer">https://blog.hubspot.com/sales/price-objections</a> – Handling price objections</li>
  <li><strong>Salesforce – Objection Handling:</strong> <a href="https://www.salesforce.com/resources/articles/objection-handling/" target="_blank" rel="noopener noreferrer">https://www.salesforce.com/resources/articles/objection-handling/</a> – Objection handling</li>
</ul>
      `.trim(),
      ru: `
<h1>Работа с возражениями по цене – Как отвечать, когда "слишком дорого"?</h1>
<p><em>Сегодня вы узнаете, как работать с возражениями по цене. Ключ: не защищайте цену – показывайте ценность!</em></p>
<hr />

<h2>Цель дня</h2>
<ul>
  <li>Понять, что такое возражение по цене и почему оно появляется</li>
  <li>Создать шаблон работы с возражениями по цене</li>
  <li>Попрактиковать ответы на самые распространенные возражения по цене</li>
  <li>Узнать, как переключиться на ценность</li>
</ul>
<hr />

<h2>Почему это важно</h2>
<ul>
  <li><strong>Распространенное возражение:</strong> "Слишком дорого" – самое распространенное возражение.</li>
  <li><strong>Не всегда проблема цены:</strong> Часто это проблема ценности или доверия.</li>
  <li><strong>Лучшая конверсия:</strong> Если хорошо работаете, закрываете больше.</li>
  <li><strong>Более высокая цена:</strong> Если хорошо работаете, не нужно давать скидку.</li>
</ul>
<hr />

<h2>Объяснение</h2>

<h3>Что такое возражение по цене?</h3>
<p><strong>Возражение по цене = когда клиент говорит: "Слишком дорого" или "Не вписывается в бюджет".</strong></p>
<p>Важно: Это не всегда реальная проблема цены – часто это проблема ценности или доверия.</p>

<h3>5 самых распространенных возражений по цене и ответы</h3>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <thead>
    <tr style="background-color: #FAB908; color: #000;">
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Возражение</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Ответ</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">"Слишком дорого"</td>
      <td style="padding: 12px; border: 1px solid #ddd;">"Понимаю. В чем основная проблема, которую нужно решить? [Показать ценность]"</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">"Нет бюджета"</td>
      <td style="padding: 12px; border: 1px solid #ddd;">"Понимаю. Когда нужно решить это? [Срочность] Каковы текущие затраты? [Сравнение]"</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">"Есть более дешевая альтернатива"</td>
      <td style="padding: 12px; border: 1px solid #ddd;">"Понимаю. В чем разница? [Показать ценность] Каковы реальные затраты более дешевой альтернативы? [Скрытые затраты]"</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">"Решим позже"</td>
      <td style="padding: 12px; border: 1px solid #ddd;">"Понимаю. В чем главный риск, если не решите сейчас? [Показать риск]"</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">"Просят скидку"</td>
      <td style="padding: 12px; border: 1px solid #ddd;">"Понимаю. Цена $1000, но могу дать бесплатный бонус: 3 месяца поддержки ($500 ценности) + онбординг ($300 ценности). Всего $1800 ценности за $1000."</td>
    </tr>
  </tbody>
</table>

<h3>Шаблон работы с возражениями по цене</h3>
<ol>
  <li><strong>Признание (1 сек):</strong> "Понимаю." (не спорьте, не защищайте цену)</li>
  <li><strong>Вопрос (30 сек):</strong> "В чем основная проблема?" или "Каковы текущие затраты?"</li>
  <li><strong>Показать ценность (2 мин):</strong> ROI, окупаемость, сравнение</li>
  <li><strong>Следующий шаг (30 сек):</strong> "Хотели бы увидеть расчет ROI?"</li>
</ol>

<h3>Хороший vs. плохой ответ</h3>
<p><strong>Плохой пример:</strong></p>
<ul>
  <li>"Но это не дорого!" (защита, спор)</li>
  <li>"Дам 20% скидку." (немедленная скидка)</li>
</ul>

<p><strong>Хороший пример:</strong></p>
<ul>
  <li>"Понимаю. В чем основная проблема, которую нужно решить? [Слушайте] Решение $1000/год, но приносит $83,000/год ценности. ROI: 315%, окупаемость: 2.9 месяца. Хотели бы увидеть детальный расчет ROI?"</li>
  <li>Показать ценность, а не защищать цену</li>
</ul>

<hr />

<h2>Практика 1 – Шаблон работы с возражениями по цене (20 мин)</h2>
<ol>
  <li><strong>Запишите 5 самых распространенных возражений по цене</strong> для ваших сделок</li>
  <li><strong>Запишите ответы</strong> на каждое (признание → вопрос → ценность → следующий шаг)</li>
  <li><strong>Попрактикуйте вслух</strong> – как они звучат естественно?</li>
</ol>

<h2>Практика 2 – Переключение на ценность (15 мин)</h2>
<p>Попрактикуйте, как переключиться с цены на ценность:</p>
<ul>
  <li><strong>Цена:</strong> "Цена $1000."</li>
  <li><strong>Переключение на ценность:</strong> "Решение $1000/год, но приносит $83,000/год ценности. ROI: 315%."</li>
</ul>

<hr />

<h2>Ключевые выводы</h2>
<ul>
  <li><strong>Не защищайте цену – показывайте ценность.</strong> Возражение по цене часто является проблемой ценности.</li>
  <li><strong>Признайте возражение.</strong> "Понимаю" – не спорьте, не защищайте.</li>
  <li><strong>Задавайте вопросы.</strong> В чем основная проблема? Каковы текущие затраты?</li>
  <li><strong>Показывайте ценность.</strong> ROI, окупаемость, сравнение.</li>
</ul>

<hr />

<h2>Доп. материалы (по желанию)</h2>
<ul>
  <li><strong>HubSpot – Работа с возражениями по цене:</strong> <a href="https://blog.hubspot.com/sales/price-objections" target="_blank" rel="noopener noreferrer">https://blog.hubspot.com/sales/price-objections</a> – Работа с возражениями по цене</li>
  <li><strong>Salesforce – Работа с возражениями:</strong> <a href="https://www.salesforce.com/resources/articles/objection-handling/" target="_blank" rel="noopener noreferrer">https://www.salesforce.com/resources/articles/objection-handling/</a> – Работа с возражениями</li>
</ul>
      `.trim(),
    },
    emailSubject: {
      hu: '{{courseName}} – 14. nap: Ár kifogások kezelése',
      en: '{{courseName}} – Day 14: Handling Price Objections',
      ru: '{{courseName}} – День 14: Работа с возражениями по цене',
    },
    emailBody: {
      hu: `
<h1>{{courseName}}</h1>
<h2>14. nap: Ár kifogások kezelése</h2>
<p>Ma megtanulod, hogyan kezeld az ár kifogásokat. A kulcs: ne védd az árat – mutasd az értéket!</p>
<p><a href="{{appUrl}}/courses/{{courseId}}/day/14">Olvasd el a teljes leckét →</a></p>
      `.trim(),
      en: `
<h1>{{courseName}}</h1>
<h2>Day 14: Handling Price Objections</h2>
<p>Today you'll learn how to handle price objections. The key: don't defend the price – show the value!</p>
<p><a href="{{appUrl}}/courses/{{courseId}}/day/14">Read the full lesson →</a></p>
      `.trim(),
      ru: `
<h1>{{courseName}}</h1>
<h2>День 14: Работа с возражениями по цене</h2>
<p>Сегодня вы узнаете, как работать с возражениями по цене. Ключ: не защищайте цену – показывайте ценность!</p>
<p><a href="{{appUrl}}/courses/{{courseId}}/day/14">Прочитать полный урок →</a></p>
      `.trim(),
    },
    quiz: [
      {
        q: {
          hu: 'Mi az ár kifogás?',
          en: 'What is price objection?',
          ru: 'Что такое возражение по цене?',
        },
        options: {
          hu: [
            'Csak az ár',
            'Amikor az ügyfél azt mondja: "Túl drága" vagy "Nem fér bele a költségvetésbe"',
            'Csak a kedvezmény',
            'Nem fontos',
          ],
          en: [
            'Just the price',
            'When customer says: "Too expensive" or "Doesn\'t fit the budget"',
            'Just the discount',
            'Not important',
          ],
          ru: [
            'Просто цена',
            'Когда клиент говорит: "Слишком дорого" или "Не вписывается в бюджет"',
            'Просто скидка',
            'Не важно',
          ],
        },
        correct: 1,
      },
      {
        q: {
          hu: 'Hogyan kezeld az ár kifogást?',
          en: 'How do you handle price objection?',
          ru: 'Как вы работаете с возражением по цене?',
        },
        options: {
          hu: [
            'Védd az árat',
            'Elismerés → Kérdés → Érték mutatása → Következő lépés',
            'Csak adj kedvezményt',
            'Ne kezeld',
          ],
          en: [
            'Defend the price',
            'Acknowledge → Question → Show value → Next step',
            'Just give discount',
            'Don\'t handle it',
          ],
          ru: [
            'Защищайте цену',
            'Признание → Вопрос → Показать ценность → Следующий шаг',
            'Просто дайте скидку',
            'Не работайте с ним',
          ],
        },
        correct: 1,
      },
      {
        q: {
          hu: 'Mi a leggyakoribb ár kifogás?',
          en: 'What is the most common price objection?',
          ru: 'Какое самое распространенное возражение по цене?',
        },
        options: {
          hu: [
            'Nincs kifogás',
            '"Túl drága"',
            'Csak a kedvezmény',
            'Nem fontos',
          ],
          en: [
            'No objection',
            '"Too expensive"',
            'Just the discount',
            'Not important',
          ],
          ru: [
            'Нет возражения',
            '"Слишком дорого"',
            'Просто скидка',
            'Не важно',
          ],
        },
        correct: 1,
      },
      {
        q: {
          hu: 'Miért fontos értékre váltani ár kifogás esetén?',
          en: 'Why is it important to switch to value when there\'s price objection?',
          ru: 'Почему важно переключиться на ценность при возражении по цене?',
        },
        options: {
          hu: [
            'Nem fontos',
            'Az ár kifogás gyakran érték probléma, nem ár probléma',
            'Csak adj kedvezményt',
            'Ne válts',
          ],
          en: [
            'Not important',
            'Price objection is often a value problem, not price problem',
            'Just give discount',
            'Don\'t switch',
          ],
          ru: [
            'Не важно',
            'Возражение по цене часто является проблемой ценности, а не цены',
            'Просто дайте скидку',
            'Не переключайтесь',
          ],
        },
        correct: 1,
      },
      {
        q: {
          hu: 'Mit tegyél, amikor az ügyfél kedvezményt kér?',
          en: 'What do you do when customer asks for discount?',
          ru: 'Что делать, когда клиент просит скидку?',
        },
        options: {
          hu: [
            'Adj azonnal kedvezményt',
            'Adj ingyenes ajándékot értékben (nem kedvezményt)',
            'Ne adj semmit',
            'Ne válaszolj',
          ],
          en: [
            'Give immediate discount',
            'Give freebie in value (not discount)',
            'Don\'t give anything',
            'Don\'t respond',
          ],
          ru: [
            'Дай немедленную скидку',
            'Дай бесплатный подарок в ценности (не скидку)',
            'Не давай ничего',
            'Не отвечай',
          ],
        },
        correct: 1,
      },
    ],
  },
  // Day 15: Closing Without Discounting
  {
    day: 15,
    title: {
      hu: 'Lezárás kedvezmény nélkül – Hogyan zárd le az üzletet teljes áron?',
      en: 'Closing Without Discounting – How to Close the Deal at Full Price?',
      ru: 'Закрытие без скидок – Как закрыть сделку по полной цене?',
    },
    content: {
      hu: `
<h1>Lezárás kedvezmény nélkül – Hogyan zárd le az üzletet teljes áron?</h1>
<p><em>Ma megtanulod, hogyan zársz le üzleteket kedvezmény nélkül. A kulcs: ne versenyezz az áron – versenyezz az értéken!</em></p>
<hr />

<h2>Napi cél</h2>
<ul>
  <li>Megérteni, miért fontos kedvezmény nélkül lezárni</li>
  <li>Létrehozni egy lezárási stratégiát</li>
  <li>Gyakorolni a lezárási beszélgetést</li>
  <li>Megtanulni, hogyan használod az ingyenes ajándékokat a bezáráshoz</li>
</ul>
<hr />

<h2>Miért fontos ez?</h2>
<ul>
  <li><strong>Magasabb ár = magasabb profit.</strong> Ha kedvezményt adsz, csökkented a profitot.</li>
  <li><strong>Jobb ügyfélélmény:</strong> Az ügyfelek, akik teljes áron vásárolnak, jobban értékelik a megoldást.</li>
  <li><strong>Hosszú távú kapcsolat:</strong> Ne versenyezz az áron – versenyezz az értéken.</li>
  <li><strong>Versenyelőny:</strong> Aki értéket ad, az többet zár le, mint aki csak kedvezményt ad.</li>
</ul>
<hr />

<h2>Elmagyarázás</h2>

<h3>Miért ne adj kedvezményt?</h3>
<p><strong>Kedvezmény = ár csökkentés = profit csökkentés.</strong></p>
<p>Példa: Ha $1000 helyett $800-at kérsz, $200 profitot veszítesz. Ha ehelyett ingyenes ajándékot adsz $200 értékben, megtartod a $1000 árat.</p>

<h3>Hogyan zársz le kedvezmény nélkül?</h3>
<p>5 lépés:</p>
<ol>
  <li><strong>Érték mutatása:</strong> ROI, megtérülés, összehasonlítás</li>
  <li><strong>Kockázat mutatása:</strong> Mi történik, ha nem dönt most?</li>
  <li><strong>Ingyenes ajándék ajánlása:</strong> Ne kedvezményt, hanem értéket adj</li>
  <li><strong>Urgencia:</strong> Miért most kell dönteni?</li>
  <li><strong>Bezárás:</strong> "Szeretnél elkezdeni?"</li>
</ol>

<h3>Lezárási sablon</h3>
<p><strong>1. Érték összefoglalása:</strong></p>
<p>"Tehát a megoldás $1000/év, de $83,000/év értéket hoz. ROI: 315%, megtérülés: 2.9 hónap."</p>

<p><strong>2. Kockázat mutatása:</strong></p>
<p>"Ha nem döntesz most, a probléma továbbra is fennáll, ami $X/év költséget jelent."</p>

<p><strong>3. Ingyenes ajándék:</strong></p>
<p>"Az ár $1000, de adhatok ingyenes ajándékot: 3 hónap támogatás ($500 érték) + onboarding ($300 érték). Összesen $1800 érték $1000-ért."</p>

<p><strong>4. Urgencia:</strong></p>
<p>"Ha most döntesz, azonnal elindíthatjuk, és 2.9 hónap múlva megtérül."</p>

<p><strong>5. Bezárás:</strong></p>
<p>"Szeretnél elkezdeni? Mikor lenne jó időpont az aláírásra?"</p>

<h3>Jó vs. rossz lezárás</h3>
<p><strong>Rossz példa:</strong></p>
<ul>
  <li>"Az ár $1000. Szeretnéd?" (nincs érték, nincs urgencia)</li>
  <li>"Adok 20% kedvezményt, ha most döntesz." (kedvezmény, nem érték)</li>
</ul>

<p><strong>Jó példa:</strong></p>
<ul>
  <li>"A megoldás $1000/év, de $83,000/év értéket hoz. ROI: 315%. Adhatok ingyenes ajándékot: 3 hónap támogatás ($500 érték). Összesen $1800 érték $1000-ért. Szeretnél elkezdeni?"</li>
  <li>Teljes érték mutatása, ingyenes ajándék, bezárás</li>
</ul>

<hr />

<h2>Gyakorlat 1 – Lezárási stratégia (25 perc)</h2>
<ol>
  <li><strong>Írd le a teljes lezárási sablonodat</strong> (érték → kockázat → ingyenes ajándék → urgencia → bezárás)</li>
  <li><strong>Gyakorold hangosan</strong> – hogyan hangzik természetesen?</li>
  <li><strong>Írd le, milyen ingyenes ajándékokat adsz</strong> a bezáráshoz</li>
</ol>

<h2>Gyakorlat 2 – Lezárási beszélgetés gyakorlása (10 perc)</h2>
<p>Gyakorold a teljes lezárási beszélgetést egy kollégával vagy baráttal.</p>

<hr />

<h2>Kulcs tanulságok</h2>
<ul>
  <li><strong>Ne versenyezz az áron – versenyezz az értéken.</strong> Az érték = hosszú távú kapcsolat.</li>
  <li><strong>Ne adj kedvezményt – adj értéket.</strong> Ingyenes ajándék = érték növelés, nem ár csökkentés.</li>
  <li><strong>Mutasd az értéket.</strong> ROI, megtérülés, összehasonlítás.</li>
  <li><strong>Használj urgenciát.</strong> Miért most kell dönteni?</li>
</ul>

<hr />

<h2>További anyagok (választható)</h2>
<ul>
  <li><strong>HubSpot – Closing Techniques:</strong> <a href="https://blog.hubspot.com/sales/closing-techniques" target="_blank" rel="noopener noreferrer">https://blog.hubspot.com/sales/closing-techniques</a> – Lezárási technikák</li>
  <li><strong>Salesforce – Value-Based Closing:</strong> <a href="https://www.salesforce.com/resources/articles/value-based-closing/" target="_blank" rel="noopener noreferrer">https://www.salesforce.com/resources/articles/value-based-closing/</a> – Értékalapú lezárás</li>
</ul>
      `.trim(),
      en: `
<h1>Closing Without Discounting – How to Close the Deal at Full Price?</h1>
<p><em>Today you'll learn how to close deals without discounting. The key: don't compete on price – compete on value!</em></p>
<hr />

<h2>Daily Goal</h2>
<ul>
  <li>Understand why it's important to close without discounting</li>
  <li>Create a closing strategy</li>
  <li>Practice the closing conversation</li>
  <li>Learn how to use freebies to close</li>
</ul>
<hr />

<h2>Why it matters</h2>
<ul>
  <li><strong>Higher price = higher profit.</strong> If you give discount, you reduce profit.</li>
  <li><strong>Better customer experience:</strong> Customers who buy at full price value the solution more.</li>
  <li><strong>Long-term relationship:</strong> Don't compete on price – compete on value.</li>
  <li><strong>Competitive advantage:</strong> Those who give value close more than those who just give discounts.</li>
</ul>
<hr />

<h2>Explanation</h2>

<h3>Why not give discount?</h3>
<p><strong>Discount = price reduction = profit reduction.</strong></p>
<p>Example: If you charge $800 instead of $1000, you lose $200 profit. If instead you give freebie worth $200, you keep the $1000 price.</p>

<h3>How do you close without discounting?</h3>
<p>5 steps:</p>
<ol>
  <li><strong>Show value:</strong> ROI, payback, comparison</li>
  <li><strong>Show risk:</strong> What happens if they don't decide now?</li>
  <li><strong>Offer freebie:</strong> Don't give discount, give value</li>
  <li><strong>Urgency:</strong> Why decide now?</li>
  <li><strong>Close:</strong> "Would you like to get started?"</li>
</ol>

<h3>Closing template</h3>
<p><strong>1. Value summary:</strong></p>
<p>"So the solution is $1000/year, but brings $83,000/year value. ROI: 315%, payback: 2.9 months."</p>

<p><strong>2. Show risk:</strong></p>
<p>"If you don't decide now, the problem continues, which costs $X/year."</p>

<p><strong>3. Freebie:</strong></p>
<p>"Price is $1000, but I can give free bonus: 3 months support ($500 value) + onboarding ($300 value). Total $1800 value for $1000."</p>

<p><strong>4. Urgency:</strong></p>
<p>"If you decide now, we can start immediately, and it pays back in 2.9 months."</p>

<p><strong>5. Close:</strong></p>
<p>"Would you like to get started? When would be a good time to sign?"</p>

<h3>Good vs. bad closing</h3>
<p><strong>Bad example:</strong></p>
<ul>
  <li>"Price is $1000. Do you want it?" (no value, no urgency)</li>
  <li>"I'll give 20% discount if you decide now." (discount, not value)</li>
</ul>

<p><strong>Good example:</strong></p>
<ul>
  <li>"The solution is $1000/year, but brings $83,000/year value. ROI: 315%. I can give free bonus: 3 months support ($500 value). Total $1800 value for $1000. Would you like to get started?"</li>
  <li>Full value shown, freebie, closing</li>
</ul>

<hr />

<h2>Practice 1 – Closing strategy (25 min)</h2>
<ol>
  <li><strong>Write down your complete closing template</strong> (value → risk → freebie → urgency → close)</li>
  <li><strong>Practice out loud</strong> – how does it sound natural?</li>
  <li><strong>Write down what freebies you give</strong> to close</li>
</ol>

<h2>Practice 2 – Practice closing conversation (10 min)</h2>
<p>Practice the complete closing conversation with a colleague or friend.</p>

<hr />

<h2>Key Takeaways</h2>
<ul>
  <li><strong>Don't compete on price – compete on value.</strong> Value = long-term relationship.</li>
  <li><strong>Don't give discount – give value.</strong> Freebie = value increase, not price reduction.</li>
  <li><strong>Show value.</strong> ROI, payback, comparison.</li>
  <li><strong>Use urgency.</strong> Why decide now?</li>
</ul>

<hr />

<h2>Optional Resources</h2>
<ul>
  <li><strong>HubSpot – Closing Techniques:</strong> <a href="https://blog.hubspot.com/sales/closing-techniques" target="_blank" rel="noopener noreferrer">https://blog.hubspot.com/sales/closing-techniques</a> – Closing techniques</li>
  <li><strong>Salesforce – Value-Based Closing:</strong> <a href="https://www.salesforce.com/resources/articles/value-based-closing/" target="_blank" rel="noopener noreferrer">https://www.salesforce.com/resources/articles/value-based-closing/</a> – Value-based closing</li>
</ul>
      `.trim(),
      ru: `
<h1>Закрытие без скидок – Как закрыть сделку по полной цене?</h1>
<p><em>Сегодня вы узнаете, как закрывать сделки без скидок. Ключ: не конкурируйте по цене – конкурируйте по ценности!</em></p>
<hr />

<h2>Цель дня</h2>
<ul>
  <li>Понять, почему важно закрывать без скидок</li>
  <li>Создать стратегию закрытия</li>
  <li>Попрактиковать разговор закрытия</li>
  <li>Узнать, как использовать бесплатные подарки для закрытия</li>
</ul>
<hr />

<h2>Почему это важно</h2>
<ul>
  <li><strong>Более высокая цена = большая прибыль.</strong> Если даете скидку, снижаете прибыль.</li>
  <li><strong>Лучший опыт клиента:</strong> Клиенты, которые покупают по полной цене, больше ценят решение.</li>
  <li><strong>Долгосрочные отношения:</strong> Не конкурируйте по цене – конкурируйте по ценности.</li>
  <li><strong>Конкурентное преимущество:</strong> Те, кто дает ценность, закрывают больше, чем те, кто просто дает скидки.</li>
</ul>
<hr />

<h2>Объяснение</h2>

<h3>Почему не давать скидку?</h3>
<p><strong>Скидка = снижение цены = снижение прибыли.</strong></p>
<p>Пример: Если берете $800 вместо $1000, теряете $200 прибыли. Если вместо этого даете бесплатный подарок стоимостью $200, сохраняете цену $1000.</p>

<h3>Как закрыть без скидки?</h3>
<p>5 шагов:</p>
<ol>
  <li><strong>Показать ценность:</strong> ROI, окупаемость, сравнение</li>
  <li><strong>Показать риск:</strong> Что произойдет, если не решат сейчас?</li>
  <li><strong>Предложить бесплатный подарок:</strong> Не давайте скидку, давайте ценность</li>
  <li><strong>Срочность:</strong> Почему решать сейчас?</li>
  <li><strong>Закрытие:</strong> "Хотели бы начать?"</li>
</ol>

<h3>Шаблон закрытия</h3>
<p><strong>1. Резюме ценности:</strong></p>
<p>"Итак, решение $1000/год, но приносит $83,000/год ценности. ROI: 315%, окупаемость: 2.9 месяца."</p>

<p><strong>2. Показать риск:</strong></p>
<p>"Если не решите сейчас, проблема продолжается, что стоит $X/год."</p>

<p><strong>3. Бесплатный подарок:</strong></p>
<p>"Цена $1000, но могу дать бесплатный бонус: 3 месяца поддержки ($500 ценности) + онбординг ($300 ценности). Всего $1800 ценности за $1000."</p>

<p><strong>4. Срочность:</strong></p>
<p>"Если решите сейчас, можем начать немедленно, и это окупится через 2.9 месяца."</p>

<p><strong>5. Закрытие:</strong></p>
<p>"Хотели бы начать? Когда было бы удобно подписать?"</p>

<h3>Хорошее vs. плохое закрытие</h3>
<p><strong>Плохой пример:</strong></p>
<ul>
  <li>"Цена $1000. Хотите?" (нет ценности, нет срочности)</li>
  <li>"Дам 20% скидку, если решите сейчас." (скидка, а не ценность)</li>
</ul>

<p><strong>Хороший пример:</strong></p>
<ul>
  <li>"Решение $1000/год, но приносит $83,000/год ценности. ROI: 315%. Могу дать бесплатный бонус: 3 месяца поддержки ($500 ценности). Всего $1800 ценности за $1000. Хотели бы начать?"</li>
  <li>Показана полная ценность, бесплатный подарок, закрытие</li>
</ul>

<hr />

<h2>Практика 1 – Стратегия закрытия (25 мин)</h2>
<ol>
  <li><strong>Запишите ваш полный шаблон закрытия</strong> (ценность → риск → бесплатный подарок → срочность → закрытие)</li>
  <li><strong>Попрактикуйте вслух</strong> – как звучит естественно?</li>
  <li><strong>Запишите, какие бесплатные подарки даете</strong> для закрытия</li>
</ol>

<h2>Практика 2 – Практика разговора закрытия (10 мин)</h2>
<p>Попрактикуйте полный разговор закрытия с коллегой или другом.</p>

<hr />

<h2>Ключевые выводы</h2>
<ul>
  <li><strong>Не конкурируйте по цене – конкурируйте по ценности.</strong> Ценность = долгосрочные отношения.</li>
  <li><strong>Не давайте скидку – давайте ценность.</strong> Бесплатный подарок = увеличение ценности, а не снижение цены.</li>
  <li><strong>Показывайте ценность.</strong> ROI, окупаемость, сравнение.</li>
  <li><strong>Используйте срочность.</strong> Почему решать сейчас?</li>
</ul>

<hr />

<h2>Доп. материалы (по желанию)</h2>
<ul>
  <li><strong>HubSpot – Техники закрытия:</strong> <a href="https://blog.hubspot.com/sales/closing-techniques" target="_blank" rel="noopener noreferrer">https://blog.hubspot.com/sales/closing-techniques</a> – Техники закрытия</li>
  <li><strong>Salesforce – Ценностное закрытие:</strong> <a href="https://www.salesforce.com/resources/articles/value-based-closing/" target="_blank" rel="noopener noreferrer">https://www.salesforce.com/resources/articles/value-based-closing/</a> – Ценностное закрытие</li>
</ul>
      `.trim(),
    },
    emailSubject: {
      hu: '{{courseName}} – 15. nap: Lezárás kedvezmény nélkül',
      en: '{{courseName}} – Day 15: Closing Without Discounting',
      ru: '{{courseName}} – День 15: Закрытие без скидок',
    },
    emailBody: {
      hu: `
<h1>{{courseName}}</h1>
<h2>15. nap: Lezárás kedvezmény nélkül</h2>
<p>Ma megtanulod, hogyan zársz le üzleteket kedvezmény nélkül. A kulcs: ne versenyezz az áron – versenyezz az értéken!</p>
<p><a href="{{appUrl}}/courses/{{courseId}}/day/15">Olvasd el a teljes leckét →</a></p>
      `.trim(),
      en: `
<h1>{{courseName}}</h1>
<h2>Day 15: Closing Without Discounting</h2>
<p>Today you'll learn how to close deals without discounting. The key: don't compete on price – compete on value!</p>
<p><a href="{{appUrl}}/courses/{{courseId}}/day/15">Read the full lesson →</a></p>
      `.trim(),
      ru: `
<h1>{{courseName}}</h1>
<h2>День 15: Закрытие без скидок</h2>
<p>Сегодня вы узнаете, как закрывать сделки без скидок. Ключ: не конкурируйте по цене – конкурируйте по ценности!</p>
<p><a href="{{appUrl}}/courses/{{courseId}}/day/15">Прочитать полный урок →</a></p>
      `.trim(),
    },
    quiz: [
      {
        q: {
          hu: 'Miért fontos kedvezmény nélkül lezárni?',
          en: 'Why is it important to close without discounting?',
          ru: 'Почему важно закрывать без скидок?',
        },
        options: {
          hu: [
            'Nem fontos',
            'Magasabb ár = magasabb profit. Ha kedvezményt adsz, csökkented a profitot',
            'Csak a vezetőségnek kell',
            'Csak a marketingnek kell',
          ],
          en: [
            'Not important',
            'Higher price = higher profit. If you give discount, you reduce profit',
            'Only management needs it',
            'Only marketing needs it',
          ],
          ru: [
            'Не важно',
            'Более высокая цена = большая прибыль. Если даете скидку, снижаете прибыль',
            'Только руководству нужно',
            'Только маркетингу нужно',
          ],
        },
        correct: 1,
      },
      {
        q: {
          hu: 'Hány lépésből áll a kedvezmény nélküli lezárás?',
          en: 'How many steps does closing without discounting have?',
          ru: 'Сколько шагов в закрытии без скидок?',
        },
        options: {
          hu: ['3', '5', '10', 'Nincs fix szám'],
          en: ['3', '5', '10', 'No fixed number'],
          ru: ['3', '5', '10', 'Нет фиксированного числа'],
        },
        correct: 1,
      },
      {
        q: {
          hu: 'Mit tegyél kedvezmény kérés esetén?',
          en: 'What do you do when discount is requested?',
          ru: 'Что делать, когда просят скидку?',
        },
        options: {
          hu: [
            'Adj azonnal kedvezményt',
            'Adj ingyenes ajándékot értékben (nem kedvezményt)',
            'Ne adj semmit',
            'Ne válaszolj',
          ],
          en: [
            'Give immediate discount',
            'Give freebie in value (not discount)',
            'Don\'t give anything',
            'Don\'t respond',
          ],
          ru: [
            'Дай немедленную скидку',
            'Дай бесплатный подарок в ценности (не скидку)',
            'Не давай ничего',
            'Не отвечай',
          ],
        },
        correct: 1,
      },
      {
        q: {
          hu: 'Miért fontos az érték mutatása a lezárásnál?',
          en: 'Why is it important to show value when closing?',
          ru: 'Почему важно показывать ценность при закрытии?',
        },
        options: {
          hu: [
            'Nem fontos',
            'Az ügyfél látja az értéket, és könnyebben vásárol teljes áron',
            'Csak a vezetőségnek kell',
            'Csak a marketingnek kell',
          ],
          en: [
            'Not important',
            'Customer sees value and buys easier at full price',
            'Only management needs it',
            'Only marketing needs it',
          ],
          ru: [
            'Не важно',
            'Клиент видит ценность и покупает легче по полной цене',
            'Только руководству нужно',
            'Только маркетингу нужно',
          ],
        },
        correct: 1,
      },
      {
        q: {
          hu: 'Miért fontos urgenciát használni a lezárásnál?',
          en: 'Why is it important to use urgency when closing?',
          ru: 'Почему важно использовать срочность при закрытии?',
        },
        options: {
          hu: [
            'Nem fontos',
            'Hogy az ügyfél most döntsön, ne később',
            'Csak a vezetőségnek kell',
            'Ne használj urgenciát',
          ],
          en: [
            'Not important',
            'So customer decides now, not later',
            'Only management needs it',
            'Don\'t use urgency',
          ],
          ru: [
            'Не важно',
            'Чтобы клиент решил сейчас, а не позже',
            'Только руководству нужно',
            'Не используйте срочность',
          ],
        },
        correct: 1,
      },
    ],
  },
  // Day 16: Combining Metrics + Qualification
  {
    day: 16,
    title: {
      hu: 'Metrikák és minősítés kombinálása – Hogyan használd együtt?',
      en: 'Combining Metrics + Qualification – How to Use Together?',
      ru: 'Комбинация метрик и квалификации – Как использовать вместе?',
    },
    content: {
      hu: `
<h1>Metrikák és minősítés kombinálása – Hogyan használd együtt?</h1>
<p><em>Ma megtanulod, hogyan kombinálod a metrikákat és a minősítést. A kulcs: ne csak számokat nézz – nézd a minőséget is!</em></p>
<hr />

<h2>Napi cél</h2>
<ul>
  <li>Megérteni, hogyan működnek együtt a metrikák és a minősítés</li>
  <li>Létrehozni egy kombinált követő rendszert</li>
  <li>Azonosítani, hogyan javítod a minősítést a metrikák alapján</li>
  <li>Beállítani napi rutint a kombinált követéshez</li>
</ul>
<hr />

<h2>Miért fontos ez?</h2>
<ul>
  <li><strong>Számok + minőség = teljes kép.</strong> Ne csak számokat nézz – nézd a minőséget is.</li>
  <li><strong>Jobb konverzió:</strong> Minősített lead-ek = magasabb bezárási arány.</li>
  <li><strong>Jobb előrejelzés:</strong> Ha minősíted és méred, pontosabb az előrejelzésed.</li>
  <li><strong>Gyorsabb javítás:</strong> Ha látod, hogy a minősítés gyenge, azonnal tudod, mit kell javítani.</li>
</ul>
<hr />

<h2>Elmagyarázás</h2>

<h3>Hogyan működnek együtt a metrikák és a minősítés?</h3>
<p><strong>Metrikák = mennyiség (hány lead), Minősítés = minőség (milyen lead).</strong></p>
<p>Példa: 100 lead, de csak 20 minősített = 20% minősítési arány. Ha ezt 30%-ra növeled, 30 minősített lead-ed lesz ugyanabból a 100-ból.</p>

<h3>Kombinált követő rendszer</h3>
<p>Kövesd mindkettőt egy táblázatban:</p>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <thead>
    <tr style="background-color: #FAB908; color: #000;">
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Dátum</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Összes lead</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Minősített</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Minősítési arány</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Bezárás</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">2026-01-22</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">20</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0%</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0</td>
    </tr>
  </tbody>
</table>

<h3>Hogyan javítod a minősítést a metrikák alapján?</h3>
<ol>
  <li><strong>Mérd a minősítési arányt:</strong> Hány lead-ből hány minősített?</li>
  <li><strong>Azonosítsd a problémát:</strong> Miért alacsony a minősítési arány? (rossz ICP, rossz lead forrás, stb.)</li>
  <li><strong>Javítsd:</strong> Jobb ICP definíció, jobb lead forrás, jobb minősítési kérdések</li>
  <li><strong>Mérj újra:</strong> Javult-e a minősítési arány?</li>
</ol>

<hr />

<h2>Gyakorlat 1 – Kombinált követő rendszer (20 perc)</h2>
<ol>
  <li><strong>Hozz létre egy kombinált táblázatot:</strong> Metrikák + minősítés</li>
  <li><strong>Számold ki a minősítési arányt:</strong> Hány lead-ből hány minősített?</li>
  <li><strong>Állíts be célokat:</strong> Napi 20 lead, 10 minősített (50% minősítési arány)</li>
</ol>

<h2>Gyakorlat 2 – Minősítési arány javítása (15 perc)</h2>
<ol>
  <li><strong>Nézd meg a jelenlegi minősítési arányodat</strong></li>
  <li><strong>Írd le 3 módot,</strong> hogyan javíthatod (pl. jobb ICP, jobb lead forrás)</li>
  <li><strong>Állíts be akciótervet</strong> a javításhoz</li>
</ol>

<hr />

<h2>Kulcs tanulságok</h2>
<ul>
  <li><strong>Számok + minőség = teljes kép.</strong> Ne csak számokat nézz – nézd a minőséget is.</li>
  <li><strong>Kövesd mindkettőt.</strong> Metrikák (mennyiség) + minősítés (minőség).</li>
  <li><strong>Javítsd a minősítési arányt.</strong> Ha jobban minősítesz, többet zársz le ugyanannyi lead-del.</li>
  <li><strong>Használd a metrikákat a minősítés javításához.</strong> Ha látod, hogy a minősítési arány alacsony, tudod, mit kell javítani.</li>
</ul>

<hr />

<h2>További anyagok (választható)</h2>
<ul>
  <li><strong>HubSpot – Sales Metrics & Qualification:</strong> <a href="https://blog.hubspot.com/sales/sales-metrics" target="_blank" rel="noopener noreferrer">https://blog.hubspot.com/sales/sales-metrics</a> – Értékesítési metrikák</li>
  <li><strong>Salesforce – Lead Quality:</strong> <a href="https://www.salesforce.com/resources/articles/lead-quality/" target="_blank" rel="noopener noreferrer">https://www.salesforce.com/resources/articles/lead-quality/</a> – Lead minőség</li>
</ul>
      `.trim(),
      en: `
<h1>Combining Metrics + Qualification – How to Use Together?</h1>
<p><em>Today you'll learn how to combine metrics and qualification. The key: don't just look at numbers – look at quality too!</em></p>
<hr />

<h2>Daily Goal</h2>
<ul>
  <li>Understand how metrics and qualification work together</li>
  <li>Create a combined tracking system</li>
  <li>Identify how to improve qualification based on metrics</li>
  <li>Set up daily routine for combined tracking</li>
</ul>
<hr />

<h2>Why it matters</h2>
<ul>
  <li><strong>Numbers + quality = complete picture.</strong> Don't just look at numbers – look at quality too.</li>
  <li><strong>Better conversion:</strong> Qualified leads = higher close rate.</li>
  <li><strong>Better forecasting:</strong> If you qualify and measure, your forecast is more accurate.</li>
  <li><strong>Faster improvement:</strong> If you see qualification is weak, you immediately know what to improve.</li>
</ul>
<hr />

<h2>Explanation</h2>

<h3>How do metrics and qualification work together?</h3>
<p><strong>Metrics = quantity (how many leads), Qualification = quality (what kind of leads).</strong></p>
<p>Example: 100 leads, but only 20 qualified = 20% qualification rate. If you increase this to 30%, you'll have 30 qualified leads from the same 100.</p>

<h3>Combined tracking system</h3>
<p>Track both in one table:</p>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <thead>
    <tr style="background-color: #FAB908; color: #000;">
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Date</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Total Leads</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Qualified</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Qualification Rate</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Closes</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">2026-01-22</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">20</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0%</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0</td>
    </tr>
  </tbody>
</table>

<h3>How do you improve qualification based on metrics?</h3>
<ol>
  <li><strong>Measure qualification rate:</strong> How many qualified out of how many leads?</li>
  <li><strong>Identify the problem:</strong> Why is qualification rate low? (bad ICP, bad lead source, etc.)</li>
  <li><strong>Improve:</strong> Better ICP definition, better lead source, better qualification questions</li>
  <li><strong>Measure again:</strong> Did qualification rate improve?</li>
</ol>

<hr />

<h2>Practice 1 – Combined tracking system (20 min)</h2>
<ol>
  <li><strong>Create a combined table:</strong> Metrics + qualification</li>
  <li><strong>Calculate qualification rate:</strong> How many qualified out of how many leads?</li>
  <li><strong>Set targets:</strong> Daily 20 leads, 10 qualified (50% qualification rate)</li>
</ol>

<h2>Practice 2 – Improve qualification rate (15 min)</h2>
<ol>
  <li><strong>Look at your current qualification rate</strong></li>
  <li><strong>Write down 3 ways</strong> to improve it (e.g., better ICP, better lead source)</li>
  <li><strong>Set action plan</strong> for improvement</li>
</ol>

<hr />

<h2>Key Takeaways</h2>
<ul>
  <li><strong>Numbers + quality = complete picture.</strong> Don't just look at numbers – look at quality too.</li>
  <li><strong>Track both.</strong> Metrics (quantity) + qualification (quality).</li>
  <li><strong>Improve qualification rate.</strong> If you qualify better, you close more with the same number of leads.</li>
  <li><strong>Use metrics to improve qualification.</strong> If you see qualification rate is low, you know what to improve.</li>
</ul>

<hr />

<h2>Optional Resources</h2>
<ul>
  <li><strong>HubSpot – Sales Metrics & Qualification:</strong> <a href="https://blog.hubspot.com/sales/sales-metrics" target="_blank" rel="noopener noreferrer">https://blog.hubspot.com/sales/sales-metrics</a> – Sales metrics</li>
  <li><strong>Salesforce – Lead Quality:</strong> <a href="https://www.salesforce.com/resources/articles/lead-quality/" target="_blank" rel="noopener noreferrer">https://www.salesforce.com/resources/articles/lead-quality/</a> – Lead quality</li>
</ul>
      `.trim(),
      ru: `
<h1>Комбинация метрик и квалификации – Как использовать вместе?</h1>
<p><em>Сегодня вы узнаете, как комбинировать метрики и квалификацию. Ключ: не просто смотрите на цифры – смотрите и на качество!</em></p>
<hr />

<h2>Цель дня</h2>
<ul>
  <li>Понять, как работают вместе метрики и квалификация</li>
  <li>Создать комбинированную систему отслеживания</li>
  <li>Определить, как улучшить квалификацию на основе метрик</li>
  <li>Настроить ежедневную рутину для комбинированного отслеживания</li>
</ul>
<hr />

<h2>Почему это важно</h2>
<ul>
  <li><strong>Цифры + качество = полная картина.</strong> Не просто смотрите на цифры – смотрите и на качество.</li>
  <li><strong>Лучшая конверсия:</strong> Квалифицированные лиды = более высокая конверсия закрытия.</li>
  <li><strong>Лучшее прогнозирование:</strong> Если квалифицируете и измеряете, ваш прогноз более точный.</li>
  <li><strong>Быстрее улучшение:</strong> Если видите, что квалификация слабая, сразу знаете, что улучшить.</li>
</ul>
<hr />

<h2>Объяснение</h2>

<h3>Как работают вместе метрики и квалификация?</h3>
<p><strong>Метрики = количество (сколько лидов), Квалификация = качество (какие лиды).</strong></p>
<p>Пример: 100 лидов, но только 20 квалифицированных = 20% коэффициент квалификации. Если увеличите до 30%, у вас будет 30 квалифицированных лидов из тех же 100.</p>

<h3>Комбинированная система отслеживания</h3>
<p>Отслеживайте оба в одной таблице:</p>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <thead>
    <tr style="background-color: #FAB908; color: #000;">
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Дата</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Всего лидов</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Квалифицированные</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Коэффициент квалификации</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Закрытия</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">2026-01-22</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">20</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0%</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0</td>
    </tr>
  </tbody>
</table>

<h3>Как улучшить квалификацию на основе метрик?</h3>
<ol>
  <li><strong>Измеряйте коэффициент квалификации:</strong> Сколько квалифицированных из скольких лидов?</li>
  <li><strong>Определите проблему:</strong> Почему коэффициент квалификации низкий? (плохой ICP, плохой источник лидов и т.д.)</li>
  <li><strong>Улучшайте:</strong> Лучшее определение ICP, лучший источник лидов, лучшие вопросы квалификации</li>
  <li><strong>Измеряйте снова:</strong> Улучшился ли коэффициент квалификации?</li>
</ol>

<hr />

<h2>Практика 1 – Комбинированная система отслеживания (20 мин)</h2>
<ol>
  <li><strong>Создайте комбинированную таблицу:</strong> Метрики + квалификация</li>
  <li><strong>Рассчитайте коэффициент квалификации:</strong> Сколько квалифицированных из скольких лидов?</li>
  <li><strong>Установите цели:</strong> Ежедневно 20 лидов, 10 квалифицированных (50% коэффициент квалификации)</li>
</ol>

<h2>Практика 2 – Улучшение коэффициента квалификации (15 мин)</h2>
<ol>
  <li><strong>Посмотрите на ваш текущий коэффициент квалификации</strong></li>
  <li><strong>Запишите 3 способа,</strong> как улучшить его (например, лучший ICP, лучший источник лидов)</li>
  <li><strong>Установите план действий</strong> для улучшения</li>
</ol>

<hr />

<h2>Ключевые выводы</h2>
<ul>
  <li><strong>Цифры + качество = полная картина.</strong> Не просто смотрите на цифры – смотрите и на качество.</li>
  <li><strong>Отслеживайте оба.</strong> Метрики (количество) + квалификация (качество).</li>
  <li><strong>Улучшайте коэффициент квалификации.</strong> Если лучше квалифицируете, закрываете больше с тем же количеством лидов.</li>
  <li><strong>Используйте метрики для улучшения квалификации.</strong> Если видите, что коэффициент квалификации низкий, знаете, что улучшить.</li>
</ul>

<hr />

<h2>Доп. материалы (по желанию)</h2>
<ul>
  <li><strong>HubSpot – Метрики продаж и квалификация:</strong> <a href="https://blog.hubspot.com/sales/sales-metrics" target="_blank" rel="noopener noreferrer">https://blog.hubspot.com/sales/sales-metrics</a> – Метрики продаж</li>
  <li><strong>Salesforce – Качество лидов:</strong> <a href="https://www.salesforce.com/resources/articles/lead-quality/" target="_blank" rel="noopener noreferrer">https://www.salesforce.com/resources/articles/lead-quality/</a> – Качество лидов</li>
</ul>
      `.trim(),
    },
    emailSubject: {
      hu: '{{courseName}} – 16. nap: Metrikák és minősítés kombinálása',
      en: '{{courseName}} – Day 16: Combining Metrics + Qualification',
      ru: '{{courseName}} – День 16: Комбинация метрик и квалификации',
    },
    emailBody: {
      hu: `
<h1>{{courseName}}</h1>
<h2>16. nap: Metrikák és minősítés kombinálása</h2>
<p>Ma megtanulod, hogyan kombinálod a metrikákat és a minősítést. A kulcs: ne csak számokat nézz – nézd a minőséget is!</p>
<p><a href="{{appUrl}}/courses/{{courseId}}/day/16">Olvasd el a teljes leckét →</a></p>
      `.trim(),
      en: `
<h1>{{courseName}}</h1>
<h2>Day 16: Combining Metrics + Qualification</h2>
<p>Today you'll learn how to combine metrics and qualification. The key: don't just look at numbers – look at quality too!</p>
<p><a href="{{appUrl}}/courses/{{courseId}}/day/16">Read the full lesson →</a></p>
      `.trim(),
      ru: `
<h1>{{courseName}}</h1>
<h2>День 16: Комбинация метрик и квалификации</h2>
<p>Сегодня вы узнаете, как комбинировать метрики и квалификацию. Ключ: не просто смотрите на цифры – смотрите и на качество!</p>
<p><a href="{{appUrl}}/courses/{{courseId}}/day/16">Прочитать полный урок →</a></p>
      `.trim(),
    },
    quiz: [
      {
        q: {
          hu: 'Hogyan működnek együtt a metrikák és a minősítés?',
          en: 'How do metrics and qualification work together?',
          ru: 'Как работают вместе метрики и квалификация?',
        },
        options: {
          hu: [
            'Nem működnek együtt',
            'Metrikák = mennyiség (hány lead), Minősítés = minőség (milyen lead)',
            'Csak a metrikák számítanak',
            'Csak a minősítés számít',
          ],
          en: [
            'They don\'t work together',
            'Metrics = quantity (how many leads), Qualification = quality (what kind of leads)',
            'Only metrics matter',
            'Only qualification matters',
          ],
          ru: [
            'Они не работают вместе',
            'Метрики = количество (сколько лидов), Квалификация = качество (какие лиды)',
            'Важны только метрики',
            'Важна только квалификация',
          ],
        },
        correct: 1,
      },
      {
        q: {
          hu: 'Miért fontos mindkettőt követni?',
          en: 'Why is it important to track both?',
          ru: 'Почему важно отслеживать оба?',
        },
        options: {
          hu: [
            'Nem fontos',
            'Számok + minőség = teljes kép. Ne csak számokat nézz – nézd a minőséget is',
            'Csak a számok számítanak',
            'Csak a minőség számít',
          ],
          en: [
            'Not important',
            'Numbers + quality = complete picture. Don\'t just look at numbers – look at quality too',
            'Only numbers matter',
            'Only quality matters',
          ],
          ru: [
            'Не важно',
            'Цифры + качество = полная картина. Не просто смотрите на цифры – смотрите и на качество',
            'Важны только цифры',
            'Важно только качество',
          ],
        },
        correct: 1,
      },
      {
        q: {
          hu: 'Hogyan javítod a minősítést a metrikák alapján?',
          en: 'How do you improve qualification based on metrics?',
          ru: 'Как вы улучшаете квалификацию на основе метрик?',
        },
        options: {
          hu: [
            'Ne javítsd',
            'Mérd a minősítési arányt → Azonosítsd a problémát → Javítsd → Mérj újra',
            'Csak adj több lead-et',
            'Ne mérj semmit',
          ],
          en: [
            'Don\'t improve',
            'Measure qualification rate → Identify problem → Improve → Measure again',
            'Just add more leads',
            'Don\'t measure anything',
          ],
          ru: [
            'Не улучшайте',
            'Измеряйте коэффициент квалификации → Определите проблему → Улучшайте → Измеряйте снова',
            'Просто добавляйте больше лидов',
            'Ничего не измеряйте',
          ],
        },
        correct: 1,
      },
      {
        q: {
          hu: 'Mi a minősítési arány?',
          en: 'What is qualification rate?',
          ru: 'Что такое коэффициент квалификации?',
        },
        options: {
          hu: [
            'Csak a lead-ek száma',
            'Hány lead-ből hány minősített (pl. 20 lead-ből 10 minősített = 50%)',
            'Csak a bezárások száma',
            'Nem fontos',
          ],
          en: [
            'Just the number of leads',
            'How many qualified out of how many leads (e.g., 10 qualified out of 20 leads = 50%)',
            'Just the number of closes',
            'Not important',
          ],
          ru: [
            'Просто количество лидов',
            'Сколько квалифицированных из скольких лидов (например, 10 квалифицированных из 20 лидов = 50%)',
            'Просто количество закрытий',
            'Не важно',
          ],
        },
        correct: 1,
      },
      {
        q: {
          hu: 'Miért fontos a minősítési arányt javítani?',
          en: 'Why is it important to improve qualification rate?',
          ru: 'Почему важно улучшать коэффициент квалификации?',
        },
        options: {
          hu: [
            'Nem fontos',
            'Ha jobban minősítesz, többet zársz le ugyanannyi lead-del',
            'Csak több lead kell',
            'Ne javítsd',
          ],
          en: [
            'Not important',
            'If you qualify better, you close more with the same number of leads',
            'Just need more leads',
            'Don\'t improve it',
          ],
          ru: [
            'Не важно',
            'Если лучше квалифицируете, закрываете больше с тем же количеством лидов',
            'Просто нужно больше лидов',
            'Не улучшайте',
          ],
        },
        correct: 1,
      },
    ],
  },
  // Day 17: Building Your Sales System
  {
    day: 17,
    title: {
      hu: 'Értékesítési rendszered építése – Hogyan építsd fel a saját rendszeredet?',
      en: 'Building Your Sales System – How to Build Your Own System?',
      ru: 'Построение вашей системы продаж – Как построить свою систему?',
    },
    content: {
      hu: `
<h1>Értékesítési rendszered építése – Hogyan építsd fel a saját rendszeredet?</h1>
<p><em>Ma megtanulod, hogyan építsd fel a saját értékesítési rendszeredet. A kulcs: kombináld az eddig tanultakat egy működő rendszerré!</em></p>
<hr />

<h2>Napi cél</h2>
<ul>
  <li>Megérteni, mi az értékesítési rendszer</li>
  <li>Létrehozni a saját értékesítési rendszered vázlatát</li>
  <li>Beállítani napi rutint</li>
  <li>Létrehozni egy rendszer dokumentációt</li>
</ul>
<hr />

<h2>Miért fontos ez?</h2>
<ul>
  <li><strong>Rendszer = konzisztencia.</strong> Ha van rendszered, konzisztensen működsz.</li>
  <li><strong>Jobb eredmények:</strong> Rendszer = jobb eredmények, mint "reménykedés".</li>
  <li><strong>Skálázhatóság:</strong> Ha van rendszered, könnyebben skálázod.</li>
  <li><strong>Stressz csökkentés:</strong> Ha van rendszered, tudod, mit kell csinálni.</li>
</ul>
<hr />

<h2>Elmagyarázás</h2>

<h3>Mi az értékesítési rendszer?</h3>
<p><strong>Értékesítési rendszer = a folyamatok, eszközök és rutinok kombinációja, amelyekkel következetesen értékesítesz.</strong></p>
<p>Komponensek: Tölcsér, KPI-k, Minősítés, Árazás, Lezárás, Napi rutin.</p>

<h3>Értékesítési rendszer vázlat</h3>
<p>5 fő komponens:</p>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <thead>
    <tr style="background-color: #FAB908; color: #000;">
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Komponens</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Mit tartalmaz</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>1. Lead generálás</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">5 csatorna, napi célok, követés</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>2. Minősítés</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">BANT/MEDDIC, kérdések, szkript</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>3. Értékesítés</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Bemutató, érték kommunikáció, ár kifogások</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>4. Lezárás</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Lezárási stratégia, ingyenes ajándékok</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>5. Napi rutin</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Napi követés, heti áttekintés, havi előrejelzés</td>
    </tr>
  </tbody>
</table>

<h3>Hogyan építsd fel a rendszeredet?</h3>
<ol>
  <li><strong>Írd le az 5 komponenst:</strong> Lead generálás, Minősítés, Értékesítés, Lezárás, Napi rutin</li>
  <li><strong>Írd le mindegyik részleteit:</strong> Mit csinálsz, hogyan, mikor?</li>
  <li><strong>Hozz létre sablonokat:</strong> Tölcsér sablon, minősítési sablon, lezárási sablon</li>
  <li><strong>Állíts be napi rutint:</strong> Mit csinálsz reggel, délelőtt, délután?</li>
</ol>

<hr />

<h2>Gyakorlat 1 – Értékesítési rendszer vázlat (30 perc)</h2>
<ol>
  <li><strong>Írd le az 5 fő komponenst</strong> a saját rendszeredhez</li>
  <li><strong>Írd le a részleteket:</strong> Mindegyik komponenshez mit csinálsz, hogyan, mikor?</li>
  <li><strong>Hozz létre sablonokat:</strong> Tölcsér, minősítés, lezárás</li>
</ol>

<h2>Gyakorlat 2 – Napi rutin (15 perc)</h2>
<p>Írd le a napi rutinodat:</p>
<ul>
  <li><strong>Reggel (9-12):</strong> Mit csinálsz? (pl. lead generálás, minősítés)</li>
  <li><strong>Délután (13-17):</strong> Mit csinálsz? (pl. bemutatók, lezárások)</li>
  <li><strong>Végén (17-18):</strong> Mit csinálsz? (pl. követés, dokumentálás)</li>
</ul>

<hr />

<h2>Kulcs tanulságok</h2>
<ul>
  <li><strong>Rendszer = konzisztencia.</strong> Ha van rendszered, konzisztensen működsz.</li>
  <li><strong>Kombináld az eddig tanultakat.</strong> Tölcsér + minősítés + árazás + lezárás = rendszer.</li>
  <li><strong>Dokumentáld.</strong> Írd le a rendszeredet, hogy következetesen használhasd.</li>
  <li><strong>Finomhangold folyamatosan.</strong> A rendszer nem statikus – finomhangold a tapasztalatok alapján.</li>
</ul>

<hr />

<h2>További anyagok (választható)</h2>
<ul>
  <li><strong>HubSpot – Sales Process:</strong> <a href="https://blog.hubspot.com/sales/sales-process" target="_blank" rel="noopener noreferrer">https://blog.hubspot.com/sales/sales-process</a> – Értékesítési folyamat</li>
  <li><strong>Salesforce – Building Sales Systems:</strong> <a href="https://www.salesforce.com/resources/articles/building-sales-systems/" target="_blank" rel="noopener noreferrer">https://www.salesforce.com/resources/articles/building-sales-systems/</a> – Értékesítési rendszerek építése</li>
</ul>
      `.trim(),
      en: `
<h1>Building Your Sales System – How to Build Your Own System?</h1>
<p><em>Today you'll learn how to build your own sales system. The key: combine what you've learned so far into a working system!</em></p>
<hr />

<h2>Daily Goal</h2>
<ul>
  <li>Understand what a sales system is</li>
  <li>Create outline of your own sales system</li>
  <li>Set up daily routine</li>
  <li>Create system documentation</li>
</ul>
<hr />

<h2>Why it matters</h2>
<ul>
  <li><strong>System = consistency.</strong> If you have a system, you work consistently.</li>
  <li><strong>Better results:</strong> System = better results than "hoping".</li>
  <li><strong>Scalability:</strong> If you have a system, you scale easier.</li>
  <li><strong>Stress reduction:</strong> If you have a system, you know what to do.</li>
</ul>
<hr />

<h2>Explanation</h2>

<h3>What is a sales system?</h3>
<p><strong>Sales system = combination of processes, tools, and routines that you use to sell consistently.</strong></p>
<p>Components: Funnel, KPIs, Qualification, Pricing, Closing, Daily routine.</p>

<h3>Sales system outline</h3>
<p>5 main components:</p>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <thead>
    <tr style="background-color: #FAB908; color: #000;">
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Component</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">What it includes</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>1. Lead Generation</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">5 channels, daily targets, tracking</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>2. Qualification</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">BANT/MEDDIC, questions, script</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>3. Sales</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Demo, value communication, price objections</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>4. Closing</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Closing strategy, freebies</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>5. Daily Routine</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Daily tracking, weekly review, monthly forecast</td>
    </tr>
  </tbody>
</table>

<h3>How do you build your system?</h3>
<ol>
  <li><strong>Write down the 5 components:</strong> Lead generation, Qualification, Sales, Closing, Daily routine</li>
  <li><strong>Write down details for each:</strong> What do you do, how, when?</li>
  <li><strong>Create templates:</strong> Funnel template, qualification template, closing template</li>
  <li><strong>Set daily routine:</strong> What do you do morning, afternoon, end of day?</li>
</ol>

<hr />

<h2>Practice 1 – Sales system outline (30 min)</h2>
<ol>
  <li><strong>Write down the 5 main components</strong> for your own system</li>
  <li><strong>Write down the details:</strong> For each component, what do you do, how, when?</li>
  <li><strong>Create templates:</strong> Funnel, qualification, closing</li>
</ol>

<h2>Practice 2 – Daily routine (15 min)</h2>
<p>Write down your daily routine:</p>
<ul>
  <li><strong>Morning (9-12):</strong> What do you do? (e.g., lead generation, qualification)</li>
  <li><strong>Afternoon (13-17):</strong> What do you do? (e.g., demos, closes)</li>
  <li><strong>End (17-18):</strong> What do you do? (e.g., tracking, documentation)</li>
</ul>

<hr />

<h2>Key Takeaways</h2>
<ul>
  <li><strong>System = consistency.</strong> If you have a system, you work consistently.</li>
  <li><strong>Combine what you've learned.</strong> Funnel + qualification + pricing + closing = system.</li>
  <li><strong>Document it.</strong> Write down your system so you can use it consistently.</li>
  <li><strong>Refine continuously.</strong> System is not static – refine based on experience.</li>
</ul>

<hr />

<h2>Optional Resources</h2>
<ul>
  <li><strong>HubSpot – Sales Process:</strong> <a href="https://blog.hubspot.com/sales/sales-process" target="_blank" rel="noopener noreferrer">https://blog.hubspot.com/sales/sales-process</a> – Sales process</li>
  <li><strong>Salesforce – Building Sales Systems:</strong> <a href="https://www.salesforce.com/resources/articles/building-sales-systems/" target="_blank" rel="noopener noreferrer">https://www.salesforce.com/resources/articles/building-sales-systems/</a> – Building sales systems</li>
</ul>
      `.trim(),
      ru: `
<h1>Построение вашей системы продаж – Как построить свою систему?</h1>
<p><em>Сегодня вы узнаете, как построить свою систему продаж. Ключ: комбинируйте то, что уже изучили, в работающую систему!</em></p>
<hr />

<h2>Цель дня</h2>
<ul>
  <li>Понять, что такое система продаж</li>
  <li>Создать план вашей системы продаж</li>
  <li>Настроить ежедневную рутину</li>
  <li>Создать документацию системы</li>
</ul>
<hr />

<h2>Почему это важно</h2>
<ul>
  <li><strong>Система = последовательность.</strong> Если есть система, работаете последовательно.</li>
  <li><strong>Лучшие результаты:</strong> Система = лучшие результаты, чем "надежда".</li>
  <li><strong>Масштабируемость:</strong> Если есть система, легче масштабировать.</li>
  <li><strong>Снижение стресса:</strong> Если есть система, знаете, что делать.</li>
</ul>
<hr />

<h2>Объяснение</h2>

<h3>Что такое система продаж?</h3>
<p><strong>Система продаж = комбинация процессов, инструментов и рутин, которые вы используете для последовательных продаж.</strong></p>
<p>Компоненты: Воронка, KPI, Квалификация, Ценообразование, Закрытие, Ежедневная рутина.</p>

<h3>План системы продаж</h3>
<p>5 основных компонентов:</p>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <thead>
    <tr style="background-color: #FAB908; color: #000;">
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Компонент</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Что включает</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>1. Генерация лидов</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">5 каналов, дневные цели, отслеживание</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>2. Квалификация</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">BANT/MEDDIC, вопросы, скрипт</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>3. Продажи</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Демо, коммуникация ценности, возражения по цене</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>4. Закрытие</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Стратегия закрытия, бесплатные подарки</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>5. Ежедневная рутина</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Ежедневное отслеживание, еженедельный обзор, месячное прогнозирование</td>
    </tr>
  </tbody>
</table>

<h3>Как построить вашу систему?</h3>
<ol>
  <li><strong>Запишите 5 компонентов:</strong> Генерация лидов, Квалификация, Продажи, Закрытие, Ежедневная рутина</li>
  <li><strong>Запишите детали для каждого:</strong> Что делаете, как, когда?</li>
  <li><strong>Создайте шаблоны:</strong> Шаблон воронки, шаблон квалификации, шаблон закрытия</li>
  <li><strong>Настройте ежедневную рутину:</strong> Что делаете утром, днем, в конце дня?</li>
</ol>

<hr />

<h2>Практика 1 – План системы продаж (30 мин)</h2>
<ol>
  <li><strong>Запишите 5 основных компонентов</strong> для вашей системы</li>
  <li><strong>Запишите детали:</strong> Для каждого компонента, что делаете, как, когда?</li>
  <li><strong>Создайте шаблоны:</strong> Воронка, квалификация, закрытие</li>
</ol>

<h2>Практика 2 – Ежедневная рутина (15 мин)</h2>
<p>Запишите вашу ежедневную рутину:</p>
<ul>
  <li><strong>Утро (9-12):</strong> Что делаете? (например, генерация лидов, квалификация)</li>
  <li><strong>День (13-17):</strong> Что делаете? (например, демо, закрытия)</li>
  <li><strong>Конец (17-18):</strong> Что делаете? (например, отслеживание, документация)</li>
</ul>

<hr />

<h2>Ключевые выводы</h2>
<ul>
  <li><strong>Система = последовательность.</strong> Если есть система, работаете последовательно.</li>
  <li><strong>Комбинируйте изученное.</strong> Воронка + квалификация + ценообразование + закрытие = система.</li>
  <li><strong>Документируйте.</strong> Запишите вашу систему, чтобы использовать последовательно.</li>
  <li><strong>Улучшайте постоянно.</strong> Система не статична – улучшайте на основе опыта.</li>
</ul>

<hr />

<h2>Доп. материалы (по желанию)</h2>
<ul>
  <li><strong>HubSpot – Процесс продаж:</strong> <a href="https://blog.hubspot.com/sales/sales-process" target="_blank" rel="noopener noreferrer">https://blog.hubspot.com/sales/sales-process</a> – Процесс продаж</li>
  <li><strong>Salesforce – Построение систем продаж:</strong> <a href="https://www.salesforce.com/resources/articles/building-sales-systems/" target="_blank" rel="noopener noreferrer">https://www.salesforce.com/resources/articles/building-sales-systems/</a> – Построение систем продаж</li>
</ul>
      `.trim(),
    },
    emailSubject: {
      hu: '{{courseName}} – 17. nap: Értékesítési rendszered építése',
      en: '{{courseName}} – Day 17: Building Your Sales System',
      ru: '{{courseName}} – День 17: Построение вашей системы продаж',
    },
    emailBody: {
      hu: `
<h1>{{courseName}}</h1>
<h2>17. nap: Értékesítési rendszered építése</h2>
<p>Ma megtanulod, hogyan építsd fel a saját értékesítési rendszeredet. A kulcs: kombináld az eddig tanultakat egy működő rendszerré!</p>
<p><a href="{{appUrl}}/courses/{{courseId}}/day/17">Olvasd el a teljes leckét →</a></p>
      `.trim(),
      en: `
<h1>{{courseName}}</h1>
<h2>Day 17: Building Your Sales System</h2>
<p>Today you'll learn how to build your own sales system. The key: combine what you've learned so far into a working system!</p>
<p><a href="{{appUrl}}/courses/{{courseId}}/day/17">Read the full lesson →</a></p>
      `.trim(),
      ru: `
<h1>{{courseName}}</h1>
<h2>День 17: Построение вашей системы продаж</h2>
<p>Сегодня вы узнаете, как построить свою систему продаж. Ключ: комбинируйте то, что уже изучили, в работающую систему!</p>
<p><a href="{{appUrl}}/courses/{{courseId}}/day/17">Прочитать полный урок →</a></p>
      `.trim(),
    },
    quiz: [
      {
        q: {
          hu: 'Mi az értékesítési rendszer?',
          en: 'What is a sales system?',
          ru: 'Что такое система продаж?',
        },
        options: {
          hu: [
            'Csak a tölcsér',
            'A folyamatok, eszközök és rutinok kombinációja, amelyekkel következetesen értékesítesz',
            'Csak a minősítés',
            'Nem fontos',
          ],
          en: [
            'Just the funnel',
            'Combination of processes, tools, and routines that you use to sell consistently',
            'Just qualification',
            'Not important',
          ],
          ru: [
            'Просто воронка',
            'Комбинация процессов, инструментов и рутин, которые вы используете для последовательных продаж',
            'Просто квалификация',
            'Не важно',
          ],
        },
        correct: 1,
      },
      {
        q: {
          hu: 'Hány fő komponense van az értékesítési rendszernek?',
          en: 'How many main components does a sales system have?',
          ru: 'Сколько основных компонентов у системы продаж?',
        },
        options: {
          hu: ['3', '5', '10', 'Nincs fix szám'],
          en: ['3', '5', '10', 'No fixed number'],
          ru: ['3', '5', '10', 'Нет фиксированного числа'],
        },
        correct: 1,
      },
      {
        q: {
          hu: 'Miért fontos dokumentálni a rendszert?',
          en: 'Why is it important to document the system?',
          ru: 'Почему важно документировать систему?',
        },
        options: {
          hu: [
            'Nem fontos',
            'Hogy következetesen használhasd, és ne kelljen mindig újra kitalálni',
            'Csak a vezetőségnek kell',
            'Ne dokumentáld',
          ],
          en: [
            'Not important',
            'To use it consistently and not have to figure it out again every time',
            'Only management needs it',
            'Don\'t document it',
          ],
          ru: [
            'Не важно',
            'Чтобы использовать последовательно и не нужно было каждый раз заново придумывать',
            'Только руководству нужно',
            'Не документируйте',
          ],
        },
        correct: 1,
      },
      {
        q: {
          hu: 'Hogyan építsd fel a rendszeredet?',
          en: 'How do you build your system?',
          ru: 'Как вы строите вашу систему?',
        },
        options: {
          hu: [
            'Véletlenszerűen',
            'Írd le az 5 komponenst → Írd le a részleteket → Hozz létre sablonokat → Állíts be napi rutint',
            'Csak a tölcsért használd',
            'Ne építsd fel',
          ],
          en: [
            'Randomly',
            'Write down 5 components → Write down details → Create templates → Set daily routine',
            'Just use the funnel',
            'Don\'t build it',
          ],
          ru: [
            'Случайно',
            'Запишите 5 компонентов → Запишите детали → Создайте шаблоны → Настройте ежедневную рутину',
            'Просто используйте воронку',
            'Не стройте',
          ],
        },
        correct: 1,
      },
      {
        q: {
          hu: 'Miért fontos finomhangolni a rendszert?',
          en: 'Why is it important to refine the system?',
          ru: 'Почему важно улучшать систему?',
        },
        options: {
          hu: [
            'Nem fontos',
            'A rendszer nem statikus – finomhangold a tapasztalatok alapján',
            'Csak egyszer kell beállítani',
            'Ne finomhangold',
          ],
          en: [
            'Not important',
            'System is not static – refine based on experience',
            'Only need to set up once',
            'Don\'t refine',
          ],
          ru: [
            'Не важно',
            'Система не статична – улучшайте на основе опыта',
            'Нужно настроить только один раз',
            'Не улучшайте',
          ],
        },
        correct: 1,
      },
    ],
  },
  {
    day: 18,
    title: {
      hu: 'CRM beállítás és automatizálás',
      en: 'CRM Setup & Automation',
      ru: 'Настройка CRM и автоматизация',
    },
    content: {
      hu: `<h2>Miért fontos a CRM?</h2>
<p>A CRM (Customer Relationship Management) rendszer a modern értékesítés alapja. Segít követni a Lead-eket, a Deal-eket, és automatizálja a rutin feladatokat.</p>

<h2>Hogyan állítsd be?</h2>
<h3>1. Válassz egy CRM-et</h3>
<ul>
<li><strong>Kezdőknek:</strong> HubSpot (ingyenes verzió), Pipedrive</li>
<li><strong>Középvállalatoknak:</strong> Salesforce, Microsoft Dynamics</li>
<li><strong>Kisebb csapatoknak:</strong> Zoho CRM, Monday.com</li>
</ul>

<h3>2. Alapvető mezők beállítása</h3>
<table>
<tr><th>Mező</th><th>Leírás</th></tr>
<tr><td>Lead státusz</td><td>Új, Minősített, Kapcsolatban, Ajánlat elküldve, Lezárás</td></tr>
<tr><td>Deal érték</td><td>Pénzügyi érték (HUF vagy EUR)</td></tr>
<tr><td>Lezárás várható dátuma</td><td>Mikor várható a Win?</td></tr>
<tr><td>Kapcsolattartó információk</td><td>Email, telefon, LinkedIn</td></tr>
<tr><td>Jegyzetek</td><td>Meeting összefoglalók, következő lépések</td></tr>
</table>

<h3>3. Automatizálás beállítása</h3>
<ul>
<li><strong>Email követés:</strong> Automatikus emlékeztetők 3 nap után, ha nincs válasz</li>
<li><strong>Deal frissítés:</strong> Automatikus státusz változás, ha meghatározott feltételek teljesülnek</li>
<li><strong>Feladat létrehozás:</strong> Új Lead esetén automatikus feladat a minősítéshez</li>
</ul>

<h2>Hogyan mérjük?</h2>
<ul>
<li><strong>CRM használati arány:</strong> Hány %-a a Lead-eknek van a CRM-ben?</li>
<li><strong>Adat frissítési gyakoriság:</strong> Hányszor frissíted a Deal státuszokat hetente?</li>
<li><strong>Automatizálás hatékonysága:</strong> Hány óra időt takarítasz meg hetente?</li>
</ul>

<h2>Hogyan javítsunk?</h2>
<ul>
<li>Használj mobil alkalmazást a CRM-hez, hogy bárhol frissíthesd</li>
<li>Állíts be napi rutint: reggel 15 perc CRM frissítés</li>
<li>Kövesd a Deal-eket hetente, ne csak havonta</li>
<li>Használj sablonokat a jegyzetekhez a konzisztencia érdekében</li>
</ul>

<h2>Sablonok</h2>
<h3>CRM Lead mezők checklist</h3>
<ul>
<li>✓ Név és cég</li>
<li>✓ Email és telefon</li>
<li>✓ Lead forrása (honnan jött?)</li>
<li>✓ Jelenlegi státusz</li>
<li>✓ Deal érték (ha van)</li>
<li>✓ Lezárás várható dátuma</li>
<li>✓ Utolsó kapcsolat dátuma</li>
</ul>

<h2>További anyagok</h2>
<ul>
<li><a href="https://blog.hubspot.com/sales/crm-setup-guide">HubSpot CRM Setup Guide</a> - Részletes beállítási útmutató</li>
<li><a href="https://www.salesforce.com/resources/articles/crm-automation/">Salesforce Automation Best Practices</a> - Automatizálási tippek</li>
</ul>`,
      en: `<h2>Why CRM Matters</h2>
<p>CRM (Customer Relationship Management) systems are the foundation of modern sales. They help you track Leads, manage Deals, and automate routine tasks.</p>

<h2>How to Set It Up</h2>
<h3>1. Choose a CRM</h3>
<ul>
<li><strong>For beginners:</strong> HubSpot (free version), Pipedrive</li>
<li><strong>For mid-market:</strong> Salesforce, Microsoft Dynamics</li>
<li><strong>For small teams:</strong> Zoho CRM, Monday.com</li>
</ul>

<h3>2. Set Up Essential Fields</h3>
<table>
<tr><th>Field</th><th>Description</th></tr>
<tr><td>Lead Status</td><td>New, Qualified, Connected, Proposal Sent, Closed</td></tr>
<tr><td>Deal Value</td><td>Financial value (USD, EUR, etc.)</td></tr>
<tr><td>Expected Close Date</td><td>When do you expect to Win?</td></tr>
<tr><td>Contact Information</td><td>Email, phone, LinkedIn</td></tr>
<tr><td>Notes</td><td>Meeting summaries, next steps</td></tr>
</table>

<h3>3. Set Up Automation</h3>
<ul>
<li><strong>Email follow-up:</strong> Automatic reminders after 3 days if no response</li>
<li><strong>Deal updates:</strong> Automatic status changes when certain conditions are met</li>
<li><strong>Task creation:</strong> Automatic task for qualification when a new Lead comes in</li>
</ul>

<h2>How to Measure</h2>
<ul>
<li><strong>CRM adoption rate:</strong> What % of Leads are in the CRM?</li>
<li><strong>Data update frequency:</strong> How often do you update Deal statuses weekly?</li>
<li><strong>Automation efficiency:</strong> How many hours do you save per week?</li>
</ul>

<h2>How to Improve</h2>
<ul>
<li>Use mobile CRM app to update on the go</li>
<li>Set daily routine: 15 minutes of CRM updates each morning</li>
<li>Review Deals weekly, not just monthly</li>
<li>Use note templates for consistency</li>
</ul>

<h2>Templates</h2>
<h3>CRM Lead Fields Checklist</h3>
<ul>
<li>✓ Name and company</li>
<li>✓ Email and phone</li>
<li>✓ Lead source (where did they come from?)</li>
<li>✓ Current status</li>
<li>✓ Deal value (if applicable)</li>
<li>✓ Expected close date</li>
<li>✓ Last contact date</li>
</ul>

<h2>Additional Resources</h2>
<ul>
<li><a href="https://blog.hubspot.com/sales/crm-setup-guide">HubSpot CRM Setup Guide</a> - Detailed setup instructions</li>
<li><a href="https://www.salesforce.com/resources/articles/crm-automation/">Salesforce Automation Best Practices</a> - Automation tips</li>
</ul>`,
      ru: `<h2>Почему важен CRM?</h2>
<p>CRM (Customer Relationship Management) системы — основа современных продаж. Они помогают отслеживать Lead-ов, управлять Deal-ами и автоматизировать рутинные задачи.</p>

<h2>Как настроить</h2>
<h3>1. Выберите CRM</h3>
<ul>
<li><strong>Для начинающих:</strong> HubSpot (бесплатная версия), Pipedrive</li>
<li><strong>Для среднего бизнеса:</strong> Salesforce, Microsoft Dynamics</li>
<li><strong>Для небольших команд:</strong> Zoho CRM, Monday.com</li>
</ul>

<h3>2. Настройте основные поля</h3>
<table>
<tr><th>Поле</th><th>Описание</th></tr>
<tr><td>Статус Lead</td><td>Новый, Квалифицирован, На связи, Предложение отправлено, Закрыт</td></tr>
<tr><td>Стоимость Deal</td><td>Финансовая стоимость (USD, EUR и т.д.)</td></tr>
<tr><td>Ожидаемая дата закрытия</td><td>Когда ожидается Win?</td></tr>
<tr><td>Контактная информация</td><td>Email, телефон, LinkedIn</td></tr>
<tr><td>Заметки</td><td>Резюме встреч, следующие шаги</td></tr>
</table>

<h3>3. Настройте автоматизацию</h3>
<ul>
<li><strong>Email-напоминания:</strong> Автоматические напоминания через 3 дня, если нет ответа</li>
<li><strong>Обновление Deal:</strong> Автоматическое изменение статуса при выполнении условий</li>
<li><strong>Создание задач:</strong> Автоматическая задача на квалификацию при новом Lead</li>
</ul>

<h2>Как измерить</h2>
<ul>
<li><strong>Использование CRM:</strong> Какой % Lead-ов находится в CRM?</li>
<li><strong>Частота обновления данных:</strong> Как часто вы обновляете статусы Deal в неделю?</li>
<li><strong>Эффективность автоматизации:</strong> Сколько часов вы экономите в неделю?</li>
</ul>

<h2>Как улучшить</h2>
<ul>
<li>Используйте мобильное приложение CRM для обновления на ходу</li>
<li>Установите ежедневную рутину: 15 минут обновления CRM каждое утро</li>
<li>Проверяйте Deal еженедельно, а не только ежемесячно</li>
<li>Используйте шаблоны заметок для консистентности</li>
</ul>

<h2>Шаблоны</h2>
<h3>Чеклист полей Lead в CRM</h3>
<ul>
<li>✓ Имя и компания</li>
<li>✓ Email и телефон</li>
<li>✓ Источник Lead (откуда пришел?)</li>
<li>✓ Текущий статус</li>
<li>✓ Стоимость Deal (если применимо)</li>
<li>✓ Ожидаемая дата закрытия</li>
<li>✓ Дата последнего контакта</li>
</ul>

<h2>Доп. материалы</h2>
<ul>
<li><a href="https://blog.hubspot.com/sales/crm-setup-guide">HubSpot CRM Setup Guide</a> - Подробная инструкция по настройке</li>
<li><a href="https://www.salesforce.com/resources/articles/crm-automation/">Salesforce Automation Best Practices</a> - Советы по автоматизации</li>
</ul>`,
    },
    emailSubject: {
      hu: 'Nap 18: CRM beállítás és automatizálás',
      en: 'Day 18: CRM Setup & Automation',
      ru: 'День 18: Настройка CRM и автоматизация',
    },
    emailBody: {
      hu: 'Ma megtanulod, hogyan állítsd be a CRM-et és automatizáld a rutin feladatokat. Ez időt takarít meg és növeli a hatékonyságot.',
      en: 'Today you\'ll learn how to set up your CRM and automate routine tasks. This saves time and increases efficiency.',
      ru: 'Сегодня вы узнаете, как настроить CRM и автоматизировать рутинные задачи. Это экономит время и повышает эффективность.',
    },
    quiz: [
      {
        q: {
          hu: 'Melyik CRM ajánlott kezdőknek?',
          en: 'Which CRM is recommended for beginners?',
          ru: 'Какой CRM рекомендуется для начинающих?',
        },
        options: {
          hu: ['Salesforce Enterprise', 'HubSpot (ingyenes verzió)', 'SAP CRM', 'Oracle CRM'],
          en: ['Salesforce Enterprise', 'HubSpot (free version)', 'SAP CRM', 'Oracle CRM'],
          ru: ['Salesforce Enterprise', 'HubSpot (бесплатная версия)', 'SAP CRM', 'Oracle CRM'],
        },
        correct: 1,
      },
      {
        q: {
          hu: 'Melyik mező NEM alapvető a CRM-ben?',
          en: 'Which field is NOT essential in CRM?',
          ru: 'Какое поле НЕ является основным в CRM?',
        },
        options: {
          hu: ['Lead státusz', 'Deal érték', 'Kapcsolattartó email', 'Kedvenc szín'],
          en: ['Lead Status', 'Deal Value', 'Contact Email', 'Favorite Color'],
          ru: ['Статус Lead', 'Стоимость Deal', 'Email контакта', 'Любимый цвет'],
        },
        correct: 3,
      },
      {
        q: {
          hu: 'Mi a célja az email automatizálásnak?',
          en: 'What is the purpose of email automation?',
          ru: 'Какова цель автоматизации email?',
        },
        options: {
          hu: ['Automatikus válaszok küldése', 'Emlékeztetők küldése válasz hiányában', 'Spam küldése', 'Email törlése'],
          en: ['Sending automatic replies', 'Sending reminders when no response', 'Sending spam', 'Deleting emails'],
          ru: ['Отправка автоматических ответов', 'Отправка напоминаний при отсутствии ответа', 'Отправка спама', 'Удаление email'],
        },
        correct: 1,
      },
      {
        q: {
          hu: 'Hogyan mérhető a CRM használati arány?',
          en: 'How is CRM adoption rate measured?',
          ru: 'Как измеряется использование CRM?',
        },
        options: {
          hu: ['Hány óra van a CRM-ben', 'Hány %-a a Lead-eknek van a CRM-ben', 'Hány emailt küldesz', 'Hány meeting van'],
          en: ['How many hours in CRM', 'What % of Leads are in CRM', 'How many emails you send', 'How many meetings you have'],
          ru: ['Сколько часов в CRM', 'Какой % Lead-ов находится в CRM', 'Сколько email вы отправляете', 'Сколько встреч у вас'],
        },
        correct: 1,
      },
      {
        q: {
          hu: 'Mi a javasolt napi rutin a CRM-hez?',
          en: 'What is the recommended daily routine for CRM?',
          ru: 'Какова рекомендуемая ежедневная рутина для CRM?',
        },
        options: {
          hu: ['Hetente egyszer frissítés', 'Reggel 15 perc CRM frissítés', 'Csak este használat', 'Soha ne frissítsd'],
          en: ['Update once a week', '15 minutes of CRM updates each morning', 'Only use in the evening', 'Never update'],
          ru: ['Обновлять раз в неделю', '15 минут обновления CRM каждое утро', 'Использовать только вечером', 'Никогда не обновлять'],
        },
        correct: 1,
      },
    ],
  },
  {
    day: 19,
    title: {
      hu: 'Napi rutinok és szokások',
      en: 'Daily Routines & Habits',
      ru: 'Ежедневные рутины и привычки',
    },
    content: {
      hu: `<h2>Miért fontosak a rutinok?</h2>
<p>A sikeres értékesítők nem véletlenül érnek el eredményeket. Napi rutinjaik és szokásaik teszik őket produktívvá és konzisztenssé.</p>

<h2>Hogyan építsd fel?</h2>
<h3>1. Reggeli rutin (első 2 óra)</h3>
<ul>
<li><strong>07:00-07:15:</strong> CRM áttekintés - hol tartasz ma?</li>
<li><strong>07:15-07:30:</strong> Napi célok beállítása - mit akarsz elérni?</li>
<li><strong>07:30-08:00:</strong> Prioritás lista - mi a legfontosabb ma?</li>
<li><strong>08:00-09:00:</strong> Deep work - legfontosabb feladat (pl. nagy Deal előkészítése)</li>
</ul>

<h3>2. Napi értékesítési rutin</h3>
<table>
<tr><th>Időszak</th><th>Teendő</th><th>Időtartam</th></tr>
<tr><td>Reggel</td><td>CRM frissítés, napi célok</td><td>30 perc</td></tr>
<tr><td>Délelőtt</td><td>Outreach - új Lead-ek, follow-up</td><td>2 óra</td></tr>
<tr><td>Délután</td><td>Meeting-ek, demo-k, ajánlatok</td><td>3 óra</td></tr>
<tr><td>Este</td><td>Jegyzetek, CRM frissítés, holnap tervezése</td><td>30 perc</td></tr>
</table>

<h3>3. Heti rutin</h3>
<ul>
<li><strong>Hétfő:</strong> Heti célok beállítása, prioritás lista</li>
<li><strong>Szerda:</strong> Középheti review - hol tartasz?</li>
<li><strong>Péntek:</strong> Heti összefoglaló, következő hét tervezése</li>
</ul>

<h2>Hogyan mérjük?</h2>
<ul>
<li><strong>Rutin követés:</strong> Hány napon követted a rutint az elmúlt héten?</li>
<li><strong>Időhasználat:</strong> Mennyi időt töltesz értékesítéssel vs adminisztrációval?</li>
<li><strong>Eredmények:</strong> Nőtt-e a produktivitás a rutin bevezetése után?</li>
</ul>

<h2>Hogyan javítsunk?</h2>
<ul>
<li>Kezdj kicsiben - ne próbálj mindent egyszerre megváltoztatni</li>
<li>Használj időzítőt (Pomodoro technika) a fókuszhoz</li>
<li>Blokkolj időt a naptárban a fontos feladatokhoz</li>
<li>Végy szüneteket - a fáradt agy nem produktív</li>
<li>Kövesd a rutint legalább 21 napig, hogy szokássá váljon</li>
</ul>

<h2>Sablonok</h2>
<h3>Napi rutin checklist</h3>
<ul>
<li>✓ CRM áttekintés (15 perc)</li>
<li>✓ Napi célok beállítása (10 perc)</li>
<li>✓ Prioritás lista (5 perc)</li>
<li>✓ Deep work blokk (60 perc)</li>
<li>✓ Outreach blokk (120 perc)</li>
<li>✓ Meeting-ek (180 perc)</li>
<li>✓ Jegyzetek és holnap tervezése (30 perc)</li>
</ul>

<h2>További anyagok</h2>
<ul>
<li><a href="https://www.atlassian.com/time-management/pomodoro-technique">Pomodoro Technique</a> - Időgazdálkodási módszer</li>
<li><a href="https://jamesclear.com/atomic-habits">Atomic Habits by James Clear</a> - Szokásépítés könyv</li>
</ul>`,
      en: `<h2>Why Routines Matter</h2>
<p>Successful sales professionals don't achieve results by accident. Their daily routines and habits make them productive and consistent.</p>

<h2>How to Build Them</h2>
<h3>1. Morning Routine (First 2 Hours)</h3>
<ul>
<li><strong>07:00-07:15:</strong> CRM review - where are you today?</li>
<li><strong>07:15-07:30:</strong> Set daily goals - what do you want to achieve?</li>
<li><strong>07:30-08:00:</strong> Priority list - what's most important today?</li>
<li><strong>08:00-09:00:</strong> Deep work - most important task (e.g., preparing for big Deal)</li>
</ul>

<h3>2. Daily Sales Routine</h3>
<table>
<tr><th>Time</th><th>Activity</th><th>Duration</th></tr>
<tr><td>Morning</td><td>CRM update, daily goals</td><td>30 min</td></tr>
<tr><td>Late Morning</td><td>Outreach - new Leads, follow-ups</td><td>2 hours</td></tr>
<tr><td>Afternoon</td><td>Meetings, demos, proposals</td><td>3 hours</td></tr>
<tr><td>Evening</td><td>Notes, CRM update, plan tomorrow</td><td>30 min</td></tr>
</table>

<h3>3. Weekly Routine</h3>
<ul>
<li><strong>Monday:</strong> Set weekly goals, priority list</li>
<li><strong>Wednesday:</strong> Mid-week review - where are you?</li>
<li><strong>Friday:</strong> Weekly summary, plan next week</li>
</ul>

<h2>How to Measure</h2>
<ul>
<li><strong>Routine adherence:</strong> How many days did you follow the routine last week?</li>
<li><strong>Time allocation:</strong> How much time do you spend on sales vs admin?</li>
<li><strong>Results:</strong> Did productivity increase after implementing the routine?</li>
</ul>

<h2>How to Improve</h2>
<ul>
<li>Start small - don't try to change everything at once</li>
<li>Use a timer (Pomodoro technique) for focus</li>
<li>Block time in calendar for important tasks</li>
<li>Take breaks - tired brain is not productive</li>
<li>Follow the routine for at least 21 days to form a habit</li>
</ul>

<h2>Templates</h2>
<h3>Daily Routine Checklist</h3>
<ul>
<li>✓ CRM review (15 min)</li>
<li>✓ Set daily goals (10 min)</li>
<li>✓ Priority list (5 min)</li>
<li>✓ Deep work block (60 min)</li>
<li>✓ Outreach block (120 min)</li>
<li>✓ Meetings (180 min)</li>
<li>✓ Notes and plan tomorrow (30 min)</li>
</ul>

<h2>Additional Resources</h2>
<ul>
<li><a href="https://www.atlassian.com/time-management/pomodoro-technique">Pomodoro Technique</a> - Time management method</li>
<li><a href="https://jamesclear.com/atomic-habits">Atomic Habits by James Clear</a> - Habit building book</li>
</ul>`,
      ru: `<h2>Почему важны рутины</h2>
<p>Успешные продавцы достигают результатов не случайно. Их ежедневные рутины и привычки делают их продуктивными и последовательными.</p>

<h2>Как построить</h2>
<h3>1. Утренняя рутина (первые 2 часа)</h3>
<ul>
<li><strong>07:00-07:15:</strong> Обзор CRM - где вы сегодня?</li>
<li><strong>07:15-07:30:</strong> Установка ежедневных целей - чего вы хотите достичь?</li>
<li><strong>07:30-08:00:</strong> Список приоритетов - что самое важное сегодня?</li>
<li><strong>08:00-09:00:</strong> Глубокая работа - самая важная задача (например, подготовка к большому Deal)</li>
</ul>

<h3>2. Ежедневная рутина продаж</h3>
<table>
<tr><th>Время</th><th>Активность</th><th>Длительность</th></tr>
<tr><td>Утро</td><td>Обновление CRM, ежедневные цели</td><td>30 мин</td></tr>
<tr><td>Позднее утро</td><td>Outreach - новые Lead-ы, follow-up</td><td>2 часа</td></tr>
<tr><td>День</td><td>Встречи, демо, предложения</td><td>3 часа</td></tr>
<tr><td>Вечер</td><td>Заметки, обновление CRM, планирование завтра</td><td>30 мин</td></tr>
</table>

<h3>3. Еженедельная рутина</h3>
<ul>
<li><strong>Понедельник:</strong> Установка еженедельных целей, список приоритетов</li>
<li><strong>Среда:</strong> Обзор середины недели - где вы?</li>
<li><strong>Пятница:</strong> Еженедельное резюме, планирование следующей недели</li>
</ul>

<h2>Как измерить</h2>
<ul>
<li><strong>Соблюдение рутины:</strong> Сколько дней вы следовали рутине на прошлой неделе?</li>
<li><strong>Распределение времени:</strong> Сколько времени вы тратите на продажи vs администрирование?</li>
<li><strong>Результаты:</strong> Увеличилась ли продуктивность после внедрения рутины?</li>
</ul>

<h2>Как улучшить</h2>
<ul>
<li>Начните с малого - не пытайтесь изменить все сразу</li>
<li>Используйте таймер (техника Pomodoro) для фокуса</li>
<li>Блокируйте время в календаре для важных задач</li>
<li>Делайте перерывы - уставший мозг не продуктивен</li>
<li>Следуйте рутине минимум 21 день, чтобы сформировать привычку</li>
</ul>

<h2>Шаблоны</h2>
<h3>Чеклист ежедневной рутины</h3>
<ul>
<li>✓ Обзор CRM (15 мин)</li>
<li>✓ Установка ежедневных целей (10 мин)</li>
<li>✓ Список приоритетов (5 мин)</li>
<li>✓ Блок глубокой работы (60 мин)</li>
<li>✓ Блок outreach (120 мин)</li>
<li>✓ Встречи (180 мин)</li>
<li>✓ Заметки и планирование завтра (30 мин)</li>
</ul>

<h2>Доп. материалы</h2>
<ul>
<li><a href="https://www.atlassian.com/time-management/pomodoro-technique">Pomodoro Technique</a> - Метод управления временем</li>
<li><a href="https://jamesclear.com/atomic-habits">Atomic Habits by James Clear</a> - Книга о формировании привычек</li>
</ul>`,
    },
    emailSubject: {
      hu: 'Nap 19: Napi rutinok és szokások',
      en: 'Day 19: Daily Routines & Habits',
      ru: 'День 19: Ежедневные рутины и привычки',
    },
    emailBody: {
      hu: 'Ma megtanulod, hogyan építsd fel a napi rutinokat és szokásokat, amelyek produktívvá tesznek.',
      en: 'Today you\'ll learn how to build daily routines and habits that make you productive.',
      ru: 'Сегодня вы узнаете, как построить ежедневные рутины и привычки, которые делают вас продуктивными.',
    },
    quiz: [
      {
        q: {
          hu: 'Mennyi ideig kell követni egy rutint, hogy szokássá váljon?',
          en: 'How long should you follow a routine to make it a habit?',
          ru: 'Как долго нужно следовать рутине, чтобы она стала привычкой?',
        },
        options: {
          hu: ['7 nap', '14 nap', '21 nap', '30 nap'],
          en: ['7 days', '14 days', '21 days', '30 days'],
          ru: ['7 дней', '14 дней', '21 день', '30 дней'],
        },
        correct: 2,
      },
      {
        q: {
          hu: 'Mi a reggeli rutin első lépése?',
          en: 'What is the first step of morning routine?',
          ru: 'Какой первый шаг утренней рутины?',
        },
        options: {
          hu: ['Email olvasás', 'CRM áttekintés', 'Meeting', 'Kávé ivás'],
          en: ['Reading emails', 'CRM review', 'Meeting', 'Drinking coffee'],
          ru: ['Чтение email', 'Обзор CRM', 'Встреча', 'Пить кофе'],
        },
        correct: 1,
      },
      {
        q: {
          hu: 'Mennyi időt kell szánni a napi outreach-re?',
          en: 'How much time should you allocate for daily outreach?',
          ru: 'Сколько времени нужно выделять на ежедневный outreach?',
        },
        options: {
          hu: ['30 perc', '1 óra', '2 óra', '4 óra'],
          en: ['30 min', '1 hour', '2 hours', '4 hours'],
          ru: ['30 мин', '1 час', '2 часа', '4 часа'],
        },
        correct: 2,
      },
      {
        q: {
          hu: 'Melyik nap a heti review napja?',
          en: 'Which day is the weekly review day?',
          ru: 'Какой день является днем еженедельного обзора?',
        },
        options: {
          hu: ['Hétfő', 'Szerda', 'Péntek', 'Vasárnap'],
          en: ['Monday', 'Wednesday', 'Friday', 'Sunday'],
          ru: ['Понедельник', 'Среда', 'Пятница', 'Воскресенье'],
        },
        correct: 2,
      },
      {
        q: {
          hu: 'Mi a Pomodoro technika célja?',
          en: 'What is the purpose of Pomodoro technique?',
          ru: 'Какова цель техники Pomodoro?',
        },
        options: {
          hu: ['Időmérés', 'Fókusz javítása', 'Meeting-ek szervezése', 'Email küldés'],
          en: ['Time tracking', 'Improving focus', 'Organizing meetings', 'Sending emails'],
          ru: ['Отслеживание времени', 'Улучшение фокуса', 'Организация встреч', 'Отправка email'],
        },
        correct: 1,
      },
    ],
  },
  {
    day: 20,
    title: {
      hu: 'Heti review folyamat',
      en: 'Weekly Review Process',
      ru: 'Процесс еженедельного обзора',
    },
    content: {
      hu: `<h2>Miért fontos a heti review?</h2>
<p>A heti review segít látni, hol tartasz, mit csináltál jól, és mit kell javítani. Nélküle csak haladsz előre vakon.</p>

<h2>Hogyan csináld?</h2>
<h3>1. Adatok összegyűjtése</h3>
<ul>
<li><strong>Lead statisztikák:</strong> Hány új Lead-et szereztél?</li>
<li><strong>Deal statisztikák:</strong> Hány Deal van a tölcsérben? Melyik szinten?</li>
<li><strong>Konverzió arányok:</strong> Milyen %-a a Lead-eknek minősül?</li>
<li><strong>Win/Loss:</strong> Hány Deal-et zártál le? Hányat vesztettél el?</li>
</ul>

<h3>2. Eredmények elemzése</h3>
<table>
<tr><th>Metrika</th><th>Eredmény</th><th>Cél</th><th>Státusz</th></tr>
<tr><td>Új Lead-ek</td><td>X</td><td>Y</td><td>✓/✗</td></tr>
<tr><td>Minősített Lead-ek</td><td>X</td><td>Y</td><td>✓/✗</td></tr>
<tr><td>Meeting-ek</td><td>X</td><td>Y</td><td>✓/✗</td></tr>
<tr><td>Ajánlatok</td><td>X</td><td>Y</td><td>✓/✗</td></tr>
<tr><td>Lezárások</td><td>X</td><td>Y</td><td>✓/✗</td></tr>
</table>

<h3>3. Mi ment jól?</h3>
<ul>
<li>Melyik tevékenység hozta a legtöbb eredményt?</li>
<li>Melyik Deal-et zártad le és miért?</li>
<li>Melyik outreach módszer működött a legjobban?</li>
</li>
</ul>

<h3>4. Mit kell javítani?</h3>
<ul>
<li>Hol van a legnagyobb szűk keresztmetszet a tölcsérben?</li>
<li>Melyik Deal-eket vesztetted el és miért?</li>
<li>Melyik tevékenység vett el időt, de nem hozott eredményt?</li>
</ul>

<h3>5. Következő hét tervezése</h3>
<ul>
<li>Milyen konkrét célokat tűzöl ki?</li>
<li>Melyik Deal-ekre fogsz fókuszálni?</li>
<li>Milyen új stratégiákat próbálsz ki?</li>
</ul>

<h2>Hogyan mérjük?</h2>
<ul>
<li><strong>Review konzisztencia:</strong> Hány héten csináltad meg a review-t?</li>
<li><strong>Akció terv követés:</strong> Hány %-a a tervezett akcióknak készült el?</li>
<li><strong>Eredmény változás:</strong> Javultak-e a metrikák a review bevezetése után?</li>
</ul>

<h2>Hogyan javítsunk?</h2>
<ul>
<li>Állíts be fix időpontot a review-ra (pl. minden péntek 16:00)</li>
<li>Használj sablont, hogy ne maradjon ki semmi</li>
<li>Dokumentáld a tanulságokat, hogy később vissza tudj rá nézni</li>
<li>Oszd meg a review eredményeit a vezetőddel vagy csapatoddal</li>
<li>Készíts akció tervet konkrét lépésekkel</li>
</ul>

<h2>Sablonok</h2>
<h3>Heti review sablon</h3>
<ul>
<li>✓ Adatok összegyűjtése (10 perc)</li>
<li>✓ Eredmények elemzése (15 perc)</li>
<li>✓ Mi ment jól? (10 perc)</li>
<li>✓ Mit kell javítani? (10 perc)</li>
<li>✓ Következő hét tervezése (15 perc)</li>
</ul>

<h2>További anyagok</h2>
<ul>
<li><a href="https://www.salesforce.com/resources/articles/sales-review-meeting/">Sales Review Meeting Best Practices</a> - Review meeting tippek</li>
<li><a href="https://blog.hubspot.com/sales/weekly-sales-review">Weekly Sales Review Template</a> - Részletes sablon</li>
</ul>`,
      en: `<h2>Why Weekly Review Matters</h2>
<p>Weekly review helps you see where you are, what you did well, and what needs improvement. Without it, you're just moving forward blindly.</p>

<h2>How to Do It</h2>
<h3>1. Collect Data</h3>
<ul>
<li><strong>Lead statistics:</strong> How many new Leads did you acquire?</li>
<li><strong>Deal statistics:</strong> How many Deals are in the funnel? At which stage?</li>
<li><strong>Conversion rates:</strong> What % of Leads are qualified?</li>
<li><strong>Win/Loss:</strong> How many Deals did you Close? How many did you lose?</li>
</ul>

<h3>2. Analyze Results</h3>
<table>
<tr><th>Metric</th><th>Result</th><th>Goal</th><th>Status</th></tr>
<tr><td>New Leads</td><td>X</td><td>Y</td><td>✓/✗</td></tr>
<tr><td>Qualified Leads</td><td>X</td><td>Y</td><td>✓/✗</td></tr>
<tr><td>Meetings</td><td>X</td><td>Y</td><td>✓/✗</td></tr>
<tr><td>Proposals</td><td>X</td><td>Y</td><td>✓/✗</td></tr>
<tr><td>Closes</td><td>X</td><td>Y</td><td>✓/✗</td></tr>
</table>

<h3>3. What Went Well?</h3>
<ul>
<li>Which activity brought the most results?</li>
<li>Which Deal did you Close and why?</li>
<li>Which outreach method worked best?</li>
</ul>

<h3>4. What Needs Improvement?</h3>
<ul>
<li>Where is the biggest bottleneck in the funnel?</li>
<li>Which Deals did you lose and why?</li>
<li>Which activity took time but didn't bring results?</li>
</ul>

<h3>5. Plan Next Week</h3>
<ul>
<li>What specific goals do you set?</li>
<li>Which Deals will you focus on?</li>
<li>What new strategies will you try?</li>
</ul>

<h2>How to Measure</h2>
<ul>
<li><strong>Review consistency:</strong> How many weeks did you do the review?</li>
<li><strong>Action plan adherence:</strong> What % of planned actions were completed?</li>
<li><strong>Result improvement:</strong> Did metrics improve after implementing review?</li>
</ul>

<h2>How to Improve</h2>
<ul>
<li>Set a fixed time for review (e.g., every Friday 4 PM)</li>
<li>Use a template so nothing is missed</li>
<li>Document learnings so you can refer back later</li>
<li>Share review results with your manager or team</li>
<li>Create an action plan with concrete steps</li>
</ul>

<h2>Templates</h2>
<h3>Weekly Review Template</h3>
<ul>
<li>✓ Collect data (10 min)</li>
<li>✓ Analyze results (15 min)</li>
<li>✓ What went well? (10 min)</li>
<li>✓ What needs improvement? (10 min)</li>
<li>✓ Plan next week (15 min)</li>
</ul>

<h2>Additional Resources</h2>
<ul>
<li><a href="https://www.salesforce.com/resources/articles/sales-review-meeting/">Sales Review Meeting Best Practices</a> - Review meeting tips</li>
<li><a href="https://blog.hubspot.com/sales/weekly-sales-review">Weekly Sales Review Template</a> - Detailed template</li>
</ul>`,
      ru: `<h2>Почему важен еженедельный обзор</h2>
<p>Еженедельный обзор помогает увидеть, где вы находитесь, что сделали хорошо, и что нужно улучшить. Без него вы просто движетесь вперед вслепую.</p>

<h2>Как делать</h2>
<h3>1. Сбор данных</h3>
<ul>
<li><strong>Статистика Lead:</strong> Сколько новых Lead-ов вы получили?</li>
<li><strong>Статистика Deal:</strong> Сколько Deal в воронке? На каком этапе?</li>
<li><strong>Коэффициенты конверсии:</strong> Какой % Lead-ов квалифицирован?</li>
<li><strong>Win/Loss:</strong> Сколько Deal вы закрыли? Сколько потеряли?</li>
</ul>

<h3>2. Анализ результатов</h3>
<table>
<tr><th>Метрика</th><th>Результат</th><th>Цель</th><th>Статус</th></tr>
<tr><td>Новые Lead-ы</td><td>X</td><td>Y</td><td>✓/✗</td></tr>
<tr><td>Квалифицированные Lead-ы</td><td>X</td><td>Y</td><td>✓/✗</td></tr>
<tr><td>Встречи</td><td>X</td><td>Y</td><td>✓/✗</td></tr>
<tr><td>Предложения</td><td>X</td><td>Y</td><td>✓/✗</td></tr>
<tr><td>Закрытия</td><td>X</td><td>Y</td><td>✓/✗</td></tr>
</table>

<h3>3. Что прошло хорошо?</h3>
<ul>
<li>Какая активность принесла больше всего результатов?</li>
<li>Какой Deal вы закрыли и почему?</li>
<li>Какой метод outreach сработал лучше всего?</li>
</ul>

<h3>4. Что нужно улучшить?</h3>
<ul>
<li>Где самое большое узкое место в воронке?</li>
<li>Какие Deal вы потеряли и почему?</li>
<li>Какая активность заняла время, но не принесла результатов?</li>
</ul>

<h3>5. Планирование следующей недели</h3>
<ul>
<li>Какие конкретные цели вы ставите?</li>
<li>На каких Deal вы сосредоточитесь?</li>
<li>Какие новые стратегии вы попробуете?</li>
</ul>

<h2>Как измерить</h2>
<ul>
<li><strong>Последовательность обзора:</strong> Сколько недель вы делали обзор?</li>
<li><strong>Соблюдение плана действий:</strong> Какой % запланированных действий был выполнен?</li>
<li><strong>Улучшение результатов:</strong> Улучшились ли метрики после внедрения обзора?</li>
</ul>

<h2>Как улучшить</h2>
<ul>
<li>Установите фиксированное время для обзора (например, каждую пятницу в 16:00)</li>
<li>Используйте шаблон, чтобы ничего не пропустить</li>
<li>Документируйте уроки, чтобы можно было вернуться позже</li>
<li>Делитесь результатами обзора с менеджером или командой</li>
<li>Создайте план действий с конкретными шагами</li>
</ul>

<h2>Шаблоны</h2>
<h3>Шаблон еженедельного обзора</h3>
<ul>
<li>✓ Сбор данных (10 мин)</li>
<li>✓ Анализ результатов (15 мин)</li>
<li>✓ Что прошло хорошо? (10 мин)</li>
<li>✓ Что нужно улучшить? (10 мин)</li>
<li>✓ Планирование следующей недели (15 мин)</li>
</ul>

<h2>Доп. материалы</h2>
<ul>
<li><a href="https://www.salesforce.com/resources/articles/sales-review-meeting/">Sales Review Meeting Best Practices</a> - Советы по обзорным встречам</li>
<li><a href="https://blog.hubspot.com/sales/weekly-sales-review">Weekly Sales Review Template</a> - Подробный шаблон</li>
</ul>`,
    },
    emailSubject: {
      hu: 'Nap 20: Heti review folyamat',
      en: 'Day 20: Weekly Review Process',
      ru: 'День 20: Процесс еженедельного обзора',
    },
    emailBody: {
      hu: 'Ma megtanulod, hogyan végezz heti review-t, hogy lássad a haladást és javítsd az eredményeket.',
      en: 'Today you\'ll learn how to do weekly reviews to see progress and improve results.',
      ru: 'Сегодня вы узнаете, как проводить еженедельные обзоры, чтобы видеть прогресс и улучшать результаты.',
    },
    quiz: [
      {
        q: {
          hu: 'Melyik nap a legjobb a heti review-ra?',
          en: 'Which day is best for weekly review?',
          ru: 'Какой день лучше всего для еженедельного обзора?',
        },
        options: {
          hu: ['Hétfő', 'Szerda', 'Péntek', 'Vasárnap'],
          en: ['Monday', 'Wednesday', 'Friday', 'Sunday'],
          ru: ['Понедельник', 'Среда', 'Пятница', 'Воскресенье'],
        },
        correct: 2,
      },
      {
        q: {
          hu: 'Mi az első lépés a review-ban?',
          en: 'What is the first step in review?',
          ru: 'Какой первый шаг в обзоре?',
        },
        options: {
          hu: ['Eredmények elemzése', 'Adatok összegyűjtése', 'Következő hét tervezése', 'Meeting'],
          en: ['Analyze results', 'Collect data', 'Plan next week', 'Meeting'],
          ru: ['Анализ результатов', 'Сбор данных', 'Планирование следующей недели', 'Встреча'],
        },
        correct: 1,
      },
      {
        q: {
          hu: 'Mit kell elemezni a review-ban?',
          en: 'What should you analyze in review?',
          ru: 'Что нужно анализировать в обзоре?',
        },
        options: {
          hu: ['Csak a Win-eket', 'Csak a Loss-okat', 'Lead, Deal, Konverzió, Win/Loss', 'Csak az email-eket'],
          en: ['Only Wins', 'Only Losses', 'Lead, Deal, Conversion, Win/Loss', 'Only emails'],
          ru: ['Только Win', 'Только Loss', 'Lead, Deal, Конверсия, Win/Loss', 'Только email'],
        },
        correct: 2,
      },
      {
        q: {
          hu: 'Miért fontos dokumentálni a tanulságokat?',
          en: 'Why is it important to document learnings?',
          ru: 'Почему важно документировать уроки?',
        },
        options: {
          hu: ['Nincs jelentősége', 'Hogy később vissza tudj rá nézni', 'Csak a vezetőnek', 'Nincs ok'],
          en: ['No significance', 'To refer back later', 'Only for manager', 'No reason'],
          ru: ['Нет значения', 'Чтобы вернуться позже', 'Только для менеджера', 'Нет причины'],
        },
        correct: 1,
      },
      {
        q: {
          hu: 'Mennyi időt kell szánni a review-ra?',
          en: 'How much time should you allocate for review?',
          ru: 'Сколько времени нужно выделять на обзор?',
        },
        options: {
          hu: ['5 perc', '30 perc', '60 perc', '2 óra'],
          en: ['5 min', '30 min', '60 min', '2 hours'],
          ru: ['5 мин', '30 мин', '60 мин', '2 часа'],
        },
        correct: 2,
      },
    ],
  },
  {
    day: 21,
    title: {
      hu: 'Fejlett tölcsér optimalizálás',
      en: 'Advanced Funnel Optimization',
      ru: 'Продвинутая оптимизация воронки',
    },
    content: {
      hu: `<h2>Miért fontos a tölcsér optimalizálás?</h2>
<p>Egy optimalizált tölcsér több Deal-et hoz ugyanazzal az erőfeszítéssel. A fejlett optimalizálás a szűk keresztmetszetek megtalálását és javítását jelenti.</p>

<h2>Hogyan optimalizáld?</h2>
<h3>1. Szűk keresztmetszetek azonosítása</h3>
<ul>
<li><strong>Konverzió arányok:</strong> Melyik szinten van a legnagyobb csökkenés?</li>
<li><strong>Idő a tölcsérben:</strong> Hol ragadnak meg a Deal-ek?</li>
<li><strong>Loss okok:</strong> Miért veszítesz el Deal-eket?</li>
</ul>

<h3>2. A/B tesztelés</h3>
<table>
<tr><th>Eszköz</th><th>Mit tesztelj?</th><th>Mérték</th></tr>
<tr><td>Email tárgy</td><td>Különböző tárgyak</td><td>Open rate</td></tr>
<tr><td>Outreach üzenet</td><td>Különböző üzenetek</td><td>Válasz arány</td></tr>
<tr><td>Ajánlat formátum</td><td>Rövid vs hosszú</td><td>Elfogadás arány</td></tr>
<tr><td>Follow-up időzítés</td><td>1 nap vs 3 nap</td><td>Válasz arány</td></tr>
</table>

<h3>3. Automatizálás bevezetése</h3>
<ul>
<li><strong>Email szekvenciák:</strong> Automatikus follow-up sorozatok</li>
<li><strong>Deal frissítések:</strong> Automatikus státusz változások</li>
<li><strong>Emlékeztetők:</strong> Automatikus feladatok kritikus pontokon</li>
</ul>

<h3>4. Adatvezérelt döntések</h3>
<ul>
<li>Kövesd a metrikákat hetente, ne csak havonta</li>
<li>Használj dashboard-ot a valós idejű látásért</li>
<li>Végezz mélyebb elemzéseket negyedévente</li>
</ul>

<h2>Hogyan mérjük?</h2>
<ul>
<li><strong>Konverzió arányok:</strong> Milyen %-a a Lead-eknek halad a következő szintre?</li>
<li><strong>Idő a tölcsérben:</strong> Mennyi idő alatt zárul le egy Deal átlagosan?</li>
<li><strong>Win rate:</strong> Milyen %-a a Deal-eknek zárul le sikeresen?</li>
</ul>

<h2>Hogyan javítsunk?</h2>
<ul>
<li>Fókuszálj egy szintre egyszerre - ne próbálj mindent javítani</li>
<li>Végezz kisebb változtatásokat és mérj eredményeket</li>
<li>Dokumentáld a változtatásokat, hogy lássad mi működik</li>
<li>Oszd meg a tanulságokat a csapattal</li>
<li>Légy türelmes - az optimalizálás időbe telik</li>
</ul>

<h2>Sablonok</h2>
<h3>Tölcsér optimalizálás checklist</h3>
<ul>
<li>✓ Szűk keresztmetszetek azonosítása</li>
<li>✓ Adatok összegyűjtése (minimum 30 nap)</li>
<li>✓ Hipotézis kialakítása</li>
<li>✓ A/B teszt tervezése</li>
<li>✓ Teszt futtatása (minimum 2 hét)</li>
<li>✓ Eredmények elemzése</li>
<li>✓ Változtatások implementálása</li>
</ul>

<h2>További anyagok</h2>
<ul>
<li><a href="https://blog.hubspot.com/sales/sales-funnel-optimization">Sales Funnel Optimization Guide</a> - Részletes útmutató</li>
<li><a href="https://www.salesforce.com/resources/articles/sales-funnel-analysis/">Sales Funnel Analysis</a> - Elemzési módszerek</li>
</ul>`,
      en: `<h2>Why Funnel Optimization Matters</h2>
<p>An optimized funnel brings more Deals with the same effort. Advanced optimization means finding and fixing bottlenecks.</p>

<h2>How to Optimize</h2>
<h3>1. Identify Bottlenecks</h3>
<ul>
<li><strong>Conversion rates:</strong> At which stage is the biggest drop?</li>
<li><strong>Time in funnel:</strong> Where do Deals get stuck?</li>
<li><strong>Loss reasons:</strong> Why are you losing Deals?</li>
</ul>

<h3>2. A/B Testing</h3>
<table>
<tr><th>Element</th><th>What to Test?</th><th>Metric</th></tr>
<tr><td>Email subject</td><td>Different subjects</td><td>Open rate</td></tr>
<tr><td>Outreach message</td><td>Different messages</td><td>Response rate</td></tr>
<tr><td>Proposal format</td><td>Short vs long</td><td>Acceptance rate</td></tr>
<tr><td>Follow-up timing</td><td>1 day vs 3 days</td><td>Response rate</td></tr>
</table>

<h3>3. Implement Automation</h3>
<ul>
<li><strong>Email sequences:</strong> Automatic follow-up series</li>
<li><strong>Deal updates:</strong> Automatic status changes</li>
<li><strong>Reminders:</strong> Automatic tasks at critical points</li>
</ul>

<h3>4. Data-Driven Decisions</h3>
<ul>
<li>Track metrics weekly, not just monthly</li>
<li>Use dashboard for real-time visibility</li>
<li>Do deeper analysis quarterly</li>
</ul>

<h2>How to Measure</h2>
<ul>
<li><strong>Conversion rates:</strong> What % of Leads move to next stage?</li>
<li><strong>Time in funnel:</strong> How long does it take to Close a Deal on average?</li>
<li><strong>Win rate:</strong> What % of Deals Close successfully?</li>
</ul>

<h2>How to Improve</h2>
<ul>
<li>Focus on one stage at a time - don't try to fix everything</li>
<li>Make small changes and measure results</li>
<li>Document changes to see what works</li>
<li>Share learnings with team</li>
<li>Be patient - optimization takes time</li>
</ul>

<h2>Templates</h2>
<h3>Funnel Optimization Checklist</h3>
<ul>
<li>✓ Identify bottlenecks</li>
<li>✓ Collect data (minimum 30 days)</li>
<li>✓ Form hypothesis</li>
<li>✓ Design A/B test</li>
<li>✓ Run test (minimum 2 weeks)</li>
<li>✓ Analyze results</li>
<li>✓ Implement changes</li>
</ul>

<h2>Additional Resources</h2>
<ul>
<li><a href="https://blog.hubspot.com/sales/sales-funnel-optimization">Sales Funnel Optimization Guide</a> - Detailed guide</li>
<li><a href="https://www.salesforce.com/resources/articles/sales-funnel-analysis/">Sales Funnel Analysis</a> - Analysis methods</li>
</ul>`,
      ru: `<h2>Почему важна оптимизация воронки</h2>
<p>Оптимизированная воронка приносит больше Deal при тех же усилиях. Продвинутая оптимизация означает поиск и исправление узких мест.</p>

<h2>Как оптимизировать</h2>
<h3>1. Идентификация узких мест</h3>
<ul>
<li><strong>Коэффициенты конверсии:</strong> На каком этапе самое большое падение?</li>
<li><strong>Время в воронке:</strong> Где застревают Deal?</li>
<li><strong>Причины потерь:</strong> Почему вы теряете Deal?</li>
</ul>

<h3>2. A/B тестирование</h3>
<table>
<tr><th>Элемент</th><th>Что тестировать?</th><th>Метрика</th></tr>
<tr><td>Тема email</td><td>Разные темы</td><td>Open rate</td></tr>
<tr><td>Outreach сообщение</td><td>Разные сообщения</td><td>Коэффициент ответа</td></tr>
<tr><td>Формат предложения</td><td>Короткое vs длинное</td><td>Коэффициент принятия</td></tr>
<tr><td>Время follow-up</td><td>1 день vs 3 дня</td><td>Коэффициент ответа</td></tr>
</table>

<h3>3. Внедрение автоматизации</h3>
<ul>
<li><strong>Email-последовательности:</strong> Автоматические серии follow-up</li>
<li><strong>Обновления Deal:</strong> Автоматические изменения статуса</li>
<li><strong>Напоминания:</strong> Автоматические задачи в критических точках</li>
</ul>

<h3>4. Решения на основе данных</h3>
<ul>
<li>Отслеживайте метрики еженедельно, а не только ежемесячно</li>
<li>Используйте dashboard для видимости в реальном времени</li>
<li>Проводите более глубокий анализ ежеквартально</li>
</ul>

<h2>Как измерить</h2>
<ul>
<li><strong>Коэффициенты конверсии:</strong> Какой % Lead-ов переходит на следующий этап?</li>
<li><strong>Время в воронке:</strong> Сколько времени в среднем занимает закрытие Deal?</li>
<li><strong>Win rate:</strong> Какой % Deal закрывается успешно?</li>
</ul>

<h2>Как улучшить</h2>
<ul>
<li>Фокусируйтесь на одном этапе за раз - не пытайтесь исправить все</li>
<li>Делайте небольшие изменения и измеряйте результаты</li>
<li>Документируйте изменения, чтобы видеть, что работает</li>
<li>Делитесь уроками с командой</li>
<li>Будьте терпеливы - оптимизация требует времени</li>
</ul>

<h2>Шаблоны</h2>
<h3>Чеклист оптимизации воронки</h3>
<ul>
<li>✓ Идентификация узких мест</li>
<li>✓ Сбор данных (минимум 30 дней)</li>
<li>✓ Формирование гипотезы</li>
<li>✓ Разработка A/B теста</li>
<li>✓ Запуск теста (минимум 2 недели)</li>
<li>✓ Анализ результатов</li>
<li>✓ Внедрение изменений</li>
</ul>

<h2>Доп. материалы</h2>
<ul>
<li><a href="https://blog.hubspot.com/sales/sales-funnel-optimization">Sales Funnel Optimization Guide</a> - Подробное руководство</li>
<li><a href="https://www.salesforce.com/resources/articles/sales-funnel-analysis/">Sales Funnel Analysis</a> - Методы анализа</li>
</ul>`,
    },
    emailSubject: {
      hu: 'Nap 21: Fejlett tölcsér optimalizálás',
      en: 'Day 21: Advanced Funnel Optimization',
      ru: 'День 21: Продвинутая оптимизация воронки',
    },
    emailBody: {
      hu: 'Ma megtanulod, hogyan optimalizáld a tölcsért fejlett módszerekkel, hogy több Deal-et hozz ugyanazzal az erőfeszítéssel.',
      en: 'Today you\'ll learn how to optimize your funnel with advanced methods to bring more Deals with the same effort.',
      ru: 'Сегодня вы узнаете, как оптимизировать воронку продвинутыми методами, чтобы приносить больше Deal при тех же усилиях.',
    },
    quiz: [
      {
        q: {
          hu: 'Mi a tölcsér optimalizálás fő célja?',
          en: 'What is the main goal of funnel optimization?',
          ru: 'Какова главная цель оптимизации воронки?',
        },
        options: {
          hu: ['Több Lead', 'Több Deal ugyanazzal az erőfeszítéssel', 'Kevesebb munka', 'Nagyobb ajánlatok'],
          en: ['More Leads', 'More Deals with same effort', 'Less work', 'Bigger proposals'],
          ru: ['Больше Lead-ов', 'Больше Deal при тех же усилиях', 'Меньше работы', 'Большие предложения'],
        },
        correct: 1,
      },
      {
        q: {
          hu: 'Mit kell tesztelni A/B teszttel?',
          en: 'What should you test with A/B testing?',
          ru: 'Что нужно тестировать с помощью A/B тестирования?',
        },
        options: {
          hu: ['Csak az email tárgyakat', 'Email tárgy, üzenet, ajánlat formátum, follow-up időzítés', 'Csak a meeting-eket', 'Semmit'],
          en: ['Only email subjects', 'Email subject, message, proposal format, follow-up timing', 'Only meetings', 'Nothing'],
          ru: ['Только темы email', 'Тема email, сообщение, формат предложения, время follow-up', 'Только встречи', 'Ничего'],
        },
        correct: 1,
      },
      {
        q: {
          hu: 'Mennyi adatot kell gyűjteni az optimalizáláshoz?',
          en: 'How much data should you collect for optimization?',
          ru: 'Сколько данных нужно собирать для оптимизации?',
        },
        options: {
          hu: ['7 nap', '14 nap', '30 nap minimum', '1 nap'],
          en: ['7 days', '14 days', '30 days minimum', '1 day'],
          ru: ['7 дней', '14 дней', 'Минимум 30 дней', '1 день'],
        },
        correct: 2,
      },
      {
        q: {
          hu: 'Hány hétig kell futtatni egy A/B tesztet?',
          en: 'How long should you run an A/B test?',
          ru: 'Как долго нужно запускать A/B тест?',
        },
        options: {
          hu: ['1 hét', '2 hét minimum', '1 nap', '1 hónap'],
          en: ['1 week', '2 weeks minimum', '1 day', '1 month'],
          ru: ['1 неделя', 'Минимум 2 недели', '1 день', '1 месяц'],
        },
        correct: 1,
      },
      {
        q: {
          hu: 'Hány szinten kell fókuszálni egyszerre?',
          en: 'How many stages should you focus on at once?',
          ru: 'На скольких этапах нужно фокусироваться одновременно?',
        },
        options: {
          hu: ['Mindegyiken', '2-3', 'Egyenként', 'Semelyiken'],
          en: ['All of them', '2-3', 'One at a time', 'None'],
          ru: ['На всех', '2-3', 'По одному', 'Ни на одном'],
        },
        correct: 2,
      },
    ],
  },
  {
    day: 22,
    title: {
      hu: 'Komplex minősítési helyzetek',
      en: 'Complex Qualification Scenarios',
      ru: 'Сложные сценарии квалификации',
    },
    content: {
      hu: `<h2>Miért fontos a komplex minősítés?</h2>
<p>Nem minden Lead egyforma. Komplex helyzetekben (pl. több döntéshozó, hosszú ciklus) a minősítés kritikus a sikerhez.</p>

<h2>Hogyan kezeld?</h2>
<h3>1. Több döntéshozó (DMU)</h3>
<ul>
<li><strong>DMU azonosítás:</strong> Kik vesznek részt a döntésben?</li>
<li><strong>Szerepkörök:</strong> Ki a Champion, Economic Buyer, User, Influencer?</li>
<li><strong>Kapcsolat építés:</strong> Építs kapcsolatot mindegyikkel</li>
<li><strong>Közös cél:</strong> Találd meg a közös érdeket</li>
</ul>

<h3>2. Hosszú értékesítési ciklus</h3>
<table>
<tr><th>Időszak</th><th>Teendő</th><th>Cél</th></tr>
<tr><td>1-3 hónap</td><td>Kapcsolat építés, igény azonosítás</td><td>Champion kialakítása</td></tr>
<tr><td>3-6 hónap</td><td>Demo, ROI számítás, ajánlat</td><td>Döntés előkészítése</td></tr>
<tr><td>6+ hónap</td><td>Follow-up, érték bizonyítása</td><td>Lezárás</td></tr>
</table>

<h3>3. Bizonytalan budget</h3>
<ul>
<li><strong>Igény azonosítás:</strong> Van-e valódi igény?</li>
<li><strong>ROI számítás:</strong> Mutasd be a megtérülést</li>
<li><strong>Alternatívák:</strong> Ajánlj részletes vagy fázisos megoldást</li>
<li><strong>Urgálás:</strong> Hozz létre sürgősséget (pl. korlátozott ajánlat)</li>
</ul>

<h2>Hogyan mérjük?</h2>
<ul>
<li><strong>DMU lefedettség:</strong> Hány %-a a döntéshozóknak van kapcsolatban veled?</li>
<li><strong>Ciklus hossz:</strong> Mennyi idő alatt zárul le egy Deal átlagosan?</li>
<li><strong>Win rate komplex Deal-ekben:</strong> Milyen %-a a komplex Deal-eknek zárul le?</li>
</ul>

<h2>Hogyan javítsunk?</h2>
<ul>
<li>Készíts DMU térképet minden komplex Deal-hez</li>
<li>Használj MEDDIC framework-ot a minősítéshez</li>
<li>Dokumentáld a kapcsolatokat és beszélgetéseket</li>
<li>Kövesd a Champion-t, de ne felejtsd el a többieket</li>
<li>Légy türelmes, de proaktív</li>
</ul>

<h2>Sablonok</h2>
<h3>DMU térkép sablon</h3>
<ul>
<li>✓ Economic Buyer: [név, szerepkör, kapcsolat szint]</li>
<li>✓ Champion: [név, szerepkör, kapcsolat szint]</li>
<li>✓ User: [név, szerepkör, kapcsolat szint]</li>
<li>✓ Influencer: [név, szerepkör, kapcsolat szint]</li>
<li>✓ Gatekeeper: [név, szerepkör, kapcsolat szint]</li>
</ul>

<h2>További anyagok</h2>
<ul>
<li><a href="https://www.meddic.org/">MEDDIC Framework</a> - Minősítési framework</li>
<li><a href="https://blog.hubspot.com/sales/decision-making-unit">Understanding DMU</a> - Döntéshozó egység</li>
</ul>`,
      en: `<h2>Why Complex Qualification Matters</h2>
<p>Not every Lead is the same. In complex situations (e.g., multiple decision makers, long cycle), qualification is critical for success.</p>

<h2>How to Handle</h2>
<h3>1. Multiple Decision Makers (DMU)</h3>
<ul>
<li><strong>DMU identification:</strong> Who is involved in the decision?</li>
<li><strong>Roles:</strong> Who is the Champion, Economic Buyer, User, Influencer?</li>
<li><strong>Relationship building:</strong> Build relationship with all of them</li>
<li><strong>Common goal:</strong> Find the common interest</li>
</ul>

<h3>2. Long Sales Cycle</h3>
<table>
<tr><th>Period</th><th>Activity</th><th>Goal</th></tr>
<tr><td>1-3 months</td><td>Relationship building, need identification</td><td>Develop Champion</td></tr>
<tr><td>3-6 months</td><td>Demo, ROI calculation, proposal</td><td>Prepare decision</td></tr>
<tr><td>6+ months</td><td>Follow-up, value proof</td><td>Close</td></tr>
</table>

<h3>3. Uncertain Budget</h3>
<ul>
<li><strong>Need identification:</strong> Is there a real need?</li>
<li><strong>ROI calculation:</strong> Show the return on investment</li>
<li><strong>Alternatives:</strong> Offer phased or modular solution</li>
<li><strong>Urgency:</strong> Create urgency (e.g., limited offer)</li>
</ul>

<h2>How to Measure</h2>
<ul>
<li><strong>DMU coverage:</strong> What % of decision makers are you in contact with?</li>
<li><strong>Cycle length:</strong> How long does it take to Close a Deal on average?</li>
<li><strong>Win rate in complex Deals:</strong> What % of complex Deals Close?</li>
</ul>

<h2>How to Improve</h2>
<ul>
<li>Create DMU map for every complex Deal</li>
<li>Use MEDDIC framework for qualification</li>
<li>Document relationships and conversations</li>
<li>Follow the Champion, but don't forget others</li>
<li>Be patient but proactive</li>
</ul>

<h2>Templates</h2>
<h3>DMU Map Template</h3>
<ul>
<li>✓ Economic Buyer: [name, role, relationship level]</li>
<li>✓ Champion: [name, role, relationship level]</li>
<li>✓ User: [name, role, relationship level]</li>
<li>✓ Influencer: [name, role, relationship level]</li>
<li>✓ Gatekeeper: [name, role, relationship level]</li>
</ul>

<h2>Additional Resources</h2>
<ul>
<li><a href="https://www.meddic.org/">MEDDIC Framework</a> - Qualification framework</li>
<li><a href="https://blog.hubspot.com/sales/decision-making-unit">Understanding DMU</a> - Decision making unit</li>
</ul>`,
      ru: `<h2>Почему важна сложная квалификация</h2>
<p>Не каждый Lead одинаков. В сложных ситуациях (например, несколько лиц, принимающих решения, длинный цикл) квалификация критична для успеха.</p>

<h2>Как обрабатывать</h2>
<h3>1. Несколько лиц, принимающих решения (DMU)</h3>
<ul>
<li><strong>Идентификация DMU:</strong> Кто участвует в решении?</li>
<li><strong>Роли:</strong> Кто является Champion, Economic Buyer, User, Influencer?</li>
<li><strong>Построение отношений:</strong> Стройте отношения со всеми</li>
<li><strong>Общая цель:</strong> Найдите общий интерес</li>
</ul>

<h3>2. Длинный цикл продаж</h3>
<table>
<tr><th>Период</th><th>Активность</th><th>Цель</th></tr>
<tr><td>1-3 месяца</td><td>Построение отношений, выявление потребности</td><td>Развить Champion</td></tr>
<tr><td>3-6 месяцев</td><td>Демо, расчет ROI, предложение</td><td>Подготовить решение</td></tr>
<tr><td>6+ месяцев</td><td>Follow-up, доказательство ценности</td><td>Закрыть</td></tr>
</table>

<h3>3. Неопределенный бюджет</h3>
<ul>
<li><strong>Выявление потребности:</strong> Есть ли реальная потребность?</li>
<li><strong>Расчет ROI:</strong> Покажите возврат инвестиций</li>
<li><strong>Альтернативы:</strong> Предложите поэтапное или модульное решение</li>
<li><strong>Срочность:</strong> Создайте срочность (например, ограниченное предложение)</li>
</ul>

<h2>Как измерить</h2>
<ul>
<li><strong>Покрытие DMU:</strong> С каким % лиц, принимающих решения, вы на связи?</li>
<li><strong>Длина цикла:</strong> Сколько времени в среднем занимает закрытие Deal?</li>
<li><strong>Win rate в сложных Deal:</strong> Какой % сложных Deal закрывается?</li>
</ul>

<h2>Как улучшить</h2>
<ul>
<li>Создайте карту DMU для каждого сложного Deal</li>
<li>Используйте framework MEDDIC для квалификации</li>
<li>Документируйте отношения и разговоры</li>
<li>Следуйте за Champion, но не забывайте остальных</li>
<li>Будьте терпеливы, но проактивны</li>
</ul>

<h2>Шаблоны</h2>
<h3>Шаблон карты DMU</h3>
<ul>
<li>✓ Economic Buyer: [имя, роль, уровень отношений]</li>
<li>✓ Champion: [имя, роль, уровень отношений]</li>
<li>✓ User: [имя, роль, уровень отношений]</li>
<li>✓ Influencer: [имя, роль, уровень отношений]</li>
<li>✓ Gatekeeper: [имя, роль, уровень отношений]</li>
</ul>

<h2>Доп. материалы</h2>
<ul>
<li><a href="https://www.meddic.org/">MEDDIC Framework</a> - Framework квалификации</li>
<li><a href="https://blog.hubspot.com/sales/decision-making-unit">Understanding DMU</a> - Единица принятия решений</li>
</ul>`,
    },
    emailSubject: {
      hu: 'Nap 22: Komplex minősítési helyzetek',
      en: 'Day 22: Complex Qualification Scenarios',
      ru: 'День 22: Сложные сценарии квалификации',
    },
    emailBody: {
      hu: 'Ma megtanulod, hogyan kezeld a komplex minősítési helyzeteket, amikor több döntéshozó van vagy hosszú a ciklus.',
      en: 'Today you\'ll learn how to handle complex qualification scenarios when there are multiple decision makers or long cycles.',
      ru: 'Сегодня вы узнаете, как обрабатывать сложные сценарии квалификации, когда есть несколько лиц, принимающих решения, или длинные циклы.',
    },
    quiz: [
      {
        q: {
          hu: 'Mi a DMU?',
          en: 'What is DMU?',
          ru: 'Что такое DMU?',
        },
        options: {
          hu: ['Deal Management Unit', 'Decision Making Unit', 'Daily Meeting Update', 'Deal Marketing Unit'],
          en: ['Deal Management Unit', 'Decision Making Unit', 'Daily Meeting Update', 'Deal Marketing Unit'],
          ru: ['Единица управления Deal', 'Единица принятия решений', 'Ежедневное обновление встреч', 'Единица маркетинга Deal'],
        },
        correct: 1,
      },
      {
        q: {
          hu: 'Ki a Champion a DMU-ban?',
          en: 'Who is the Champion in DMU?',
          ru: 'Кто является Champion в DMU?',
        },
        options: {
          hu: ['Aki fizet', 'Aki támogatja a megoldást', 'Aki használja', 'Aki blokkol'],
          en: ['Who pays', 'Who supports the solution', 'Who uses it', 'Who blocks'],
          ru: ['Кто платит', 'Кто поддерживает решение', 'Кто использует', 'Кто блокирует'],
        },
        correct: 1,
      },
      {
        q: {
          hu: 'Mennyi ideig tart egy hosszú értékesítési ciklus?',
          en: 'How long does a long sales cycle take?',
          ru: 'Сколько длится длинный цикл продаж?',
        },
        options: {
          hu: ['1-2 hónap', '3-6 hónap', '6+ hónap', '1 hét'],
          en: ['1-2 months', '3-6 months', '6+ months', '1 week'],
          ru: ['1-2 месяца', '3-6 месяцев', '6+ месяцев', '1 неделя'],
        },
        correct: 2,
      },
      {
        q: {
          hu: 'Melyik framework használható komplex minősítéshez?',
          en: 'Which framework can be used for complex qualification?',
          ru: 'Какой framework можно использовать для сложной квалификации?',
        },
        options: {
          hu: ['BANT', 'MEDDIC', 'SMART', 'Mindkettő (BANT és MEDDIC)'],
          en: ['BANT', 'MEDDIC', 'SMART', 'Both (BANT and MEDDIC)'],
          ru: ['BANT', 'MEDDIC', 'SMART', 'Оба (BANT и MEDDIC)'],
        },
        correct: 3,
      },
      {
        q: {
          hu: 'Mit kell csinálni bizonytalan budget esetén?',
          en: 'What should you do with uncertain budget?',
          ru: 'Что нужно делать при неопределенном бюджете?',
        },
        options: {
          hu: ['Lemondani', 'ROI számítás, alternatívák, urgálás', 'Csak várni', 'Nincs megoldás'],
          en: ['Give up', 'ROI calculation, alternatives, urgency', 'Just wait', 'No solution'],
          ru: ['Сдаться', 'Расчет ROI, альтернативы, срочность', 'Просто ждать', 'Нет решения'],
        },
        correct: 1,
      },
    ],
  },
  {
    day: 23,
    title: {
      hu: 'Prémium árazási stratégiák',
      en: 'Premium Pricing Strategies',
      ru: 'Стратегии премиального ценообразования',
    },
    content: {
      hu: `<h2>Miért fontos a prémium árazás?</h2>
<p>A prémium árazás nem csak a magasabb ár, hanem az érték kommunikálása. Segít elkerülni a kedvezményeket és növelni a profitot.</p>

<h2>Hogyan alkalmazd?</h2>
<h3>1. Értékalapú árazás</h3>
<ul>
<li><strong>ROI számítás:</strong> Mennyit takarít meg a vevő?</li>
<li><strong>Érték demonstrálása:</strong> Mutasd be a megtérülést</li>
<li><strong>Prémium pozicionálás:</strong> Pozícionáld magad a prémium szegmensben</li>
</ul>

<h3>2. Csomagolás és bundling</h3>
<table>
<tr><th>Csomag</th><th>Tartalom</th><th>Ár</th></tr>
<tr><td>Alap</td><td>Termék</td><td>X</td></tr>
<tr><td>Prémium</td><td>Termék + Training + Support</td><td>X + 30%</td></tr>
<tr><td>Enterprise</td><td>Minden + Dedikált account manager</td><td>X + 60%</td></tr>
</table>

<h3>3. Anchoring technika</h3>
<ul>
<li><strong>Magasabb ár mutatása:</strong> Mutasd először a legdrágább opciót</li>
<li><strong>Középső választás:</strong> A középső opció tűnik ésszerűnek</li>
<li><strong>Érték érzet:</strong> A vevő úgy érzi, jól döntött</li>
</ul>

<h2>Hogyan mérjük?</h2>
<ul>
<li><strong>Átlagos Deal érték:</strong> Mennyi az átlagos Deal érték?</li>
<li><strong>Profit margin:</strong> Milyen a profit margin a prémium árazás után?</li>
<li><strong>Win rate:</strong> Változott-e a Win rate az árazás változtatása után?</li>
</ul>

<h2>Hogyan javítsunk?</h2>
<ul>
<li>Ne kezdj az árról, hanem az értékről beszélj</li>
<li>Használj ROI számításokat a bizonyításhoz</li>
<li>Ajánlj csomagokat, ne csak egyetlen opciót</li>
<li>Légy magabiztos az árazásban</li>
<li>Ne ajánlj kedvezményt, hanem értéket</li>
</ul>

<h2>Sablonok</h2>
<h3>Prémium árazás checklist</h3>
<ul>
<li>✓ ROI számítás elkészítése</li>
<li>✓ Érték demonstrálása</li>
<li>✓ Csomagok tervezése</li>
<li>✓ Anchoring stratégia</li>
<li>✓ Árazás kommunikálása</li>
</ul>

<h2>További anyagok</h2>
<ul>
<li><a href="https://blog.hubspot.com/sales/value-based-pricing">Value-Based Pricing Guide</a> - Értékalapú árazás</li>
<li><a href="https://www.salesforce.com/resources/articles/pricing-strategies/">Pricing Strategies</a> - Árazási stratégiák</li>
</ul>`,
      en: `<h2>Why Premium Pricing Matters</h2>
<p>Premium pricing is not just about higher price, but about communicating value. It helps avoid discounts and increase profit.</p>

<h2>How to Apply</h2>
<h3>1. Value-Based Pricing</h3>
<ul>
<li><strong>ROI calculation:</strong> How much does the customer save?</li>
<li><strong>Value demonstration:</strong> Show the return on investment</li>
<li><strong>Premium positioning:</strong> Position yourself in premium segment</li>
</ul>

<h3>2. Packaging and Bundling</h3>
<table>
<tr><th>Package</th><th>Content</th><th>Price</th></tr>
<tr><td>Basic</td><td>Product</td><td>X</td></tr>
<tr><td>Premium</td><td>Product + Training + Support</td><td>X + 30%</td></tr>
<tr><td>Enterprise</td><td>Everything + Dedicated account manager</td><td>X + 60%</td></tr>
</table>

<h3>3. Anchoring Technique</h3>
<ul>
<li><strong>Show higher price first:</strong> Show the most expensive option first</li>
<li><strong>Middle choice:</strong> The middle option seems reasonable</li>
<li><strong>Value perception:</strong> Customer feels they made a good decision</li>
</ul>

<h2>How to Measure</h2>
<ul>
<li><strong>Average Deal value:</strong> What is the average Deal value?</li>
<li><strong>Profit margin:</strong> What is the profit margin after premium pricing?</li>
<li><strong>Win rate:</strong> Did Win rate change after pricing change?</li>
</ul>

<h2>How to Improve</h2>
<ul>
<li>Don't start with price, talk about value first</li>
<li>Use ROI calculations for proof</li>
<li>Offer packages, not just single option</li>
<li>Be confident in pricing</li>
<li>Don't offer discount, offer value</li>
</ul>

<h2>Templates</h2>
<h3>Premium Pricing Checklist</h3>
<ul>
<li>✓ Prepare ROI calculation</li>
<li>✓ Demonstrate value</li>
<li>✓ Design packages</li>
<li>✓ Anchoring strategy</li>
<li>✓ Communicate pricing</li>
</ul>

<h2>Additional Resources</h2>
<ul>
<li><a href="https://blog.hubspot.com/sales/value-based-pricing">Value-Based Pricing Guide</a> - Value-based pricing</li>
<li><a href="https://www.salesforce.com/resources/articles/pricing-strategies/">Pricing Strategies</a> - Pricing strategies</li>
</ul>`,
      ru: `<h2>Почему важно премиальное ценообразование</h2>
<p>Премиальное ценообразование — это не просто более высокая цена, а коммуникация ценности. Это помогает избежать скидок и увеличить прибыль.</p>

<h2>Как применять</h2>
<h3>1. Ценообразование на основе ценности</h3>
<ul>
<li><strong>Расчет ROI:</strong> Сколько экономит клиент?</li>
<li><strong>Демонстрация ценности:</strong> Покажите возврат инвестиций</li>
<li><strong>Премиальное позиционирование:</strong> Позиционируйте себя в премиальном сегменте</li>
</ul>

<h3>2. Упаковка и бандлинг</h3>
<table>
<tr><th>Пакет</th><th>Содержание</th><th>Цена</th></tr>
<tr><td>Базовый</td><td>Продукт</td><td>X</td></tr>
<tr><td>Премиум</td><td>Продукт + Обучение + Поддержка</td><td>X + 30%</td></tr>
<tr><td>Enterprise</td><td>Все + Выделенный account manager</td><td>X + 60%</td></tr>
</table>

<h3>3. Техника якорения</h3>
<ul>
<li><strong>Покажите более высокую цену сначала:</strong> Покажите самый дорогой вариант сначала</li>
<li><strong>Средний выбор:</strong> Средний вариант кажется разумным</li>
<li><strong>Восприятие ценности:</strong> Клиент чувствует, что принял хорошее решение</li>
</ul>

<h2>Как измерить</h2>
<ul>
<li><strong>Средняя стоимость Deal:</strong> Какова средняя стоимость Deal?</li>
<li><strong>Маржа прибыли:</strong> Какова маржа прибыли после премиального ценообразования?</li>
<li><strong>Win rate:</strong> Изменился ли Win rate после изменения ценообразования?</li>
</ul>

<h2>Как улучшить</h2>
<ul>
<li>Не начинайте с цены, сначала говорите о ценности</li>
<li>Используйте расчеты ROI для доказательства</li>
<li>Предлагайте пакеты, а не только один вариант</li>
<li>Будьте уверены в ценообразовании</li>
<li>Не предлагайте скидку, предлагайте ценность</li>
</ul>

<h2>Шаблоны</h2>
<h3>Чеклист премиального ценообразования</h3>
<ul>
<li>✓ Подготовить расчет ROI</li>
<li>✓ Продемонстрировать ценность</li>
<li>✓ Разработать пакеты</li>
<li>✓ Стратегия якорения</li>
<li>✓ Коммуникация ценообразования</li>
</ul>

<h2>Доп. материалы</h2>
<ul>
<li><a href="https://blog.hubspot.com/sales/value-based-pricing">Value-Based Pricing Guide</a> - Ценообразование на основе ценности</li>
<li><a href="https://www.salesforce.com/resources/articles/pricing-strategies/">Pricing Strategies</a> - Стратегии ценообразования</li>
</ul>`,
    },
    emailSubject: {
      hu: 'Nap 23: Prémium árazási stratégiák',
      en: 'Day 23: Premium Pricing Strategies',
      ru: 'День 23: Стратегии премиального ценообразования',
    },
    emailBody: {
      hu: 'Ma megtanulod, hogyan alkalmazz prémium árazási stratégiákat, hogy elkerüld a kedvezményeket és növeld a profitot.',
      en: 'Today you\'ll learn how to apply premium pricing strategies to avoid discounts and increase profit.',
      ru: 'Сегодня вы узнаете, как применять стратегии премиального ценообразования, чтобы избежать скидок и увеличить прибыль.',
    },
    quiz: [
      {
        q: {
          hu: 'Mi a prémium árazás fő célja?',
          en: 'What is the main goal of premium pricing?',
          ru: 'Какова главная цель премиального ценообразования?',
        },
        options: {
          hu: ['Magasabb ár', 'Érték kommunikálása, kedvezmények elkerülése', 'Csak profit', 'Nincs cél'],
          en: ['Higher price', 'Communicate value, avoid discounts', 'Just profit', 'No goal'],
          ru: ['Более высокая цена', 'Коммуникация ценности, избежание скидок', 'Только прибыль', 'Нет цели'],
        },
        correct: 1,
      },
      {
        q: {
          hu: 'Mit kell mutatni elsőként az árazásnál?',
          en: 'What should you show first in pricing?',
          ru: 'Что нужно показывать первым при ценообразовании?',
        },
        options: {
          hu: ['Az árat', 'Az értéket', 'A kedvezményt', 'A terméket'],
          en: ['The price', 'The value', 'The discount', 'The product'],
          ru: ['Цену', 'Ценность', 'Скидку', 'Продукт'],
        },
        correct: 1,
      },
      {
        q: {
          hu: 'Mi az anchoring technika?',
          en: 'What is anchoring technique?',
          ru: 'Что такое техника якорения?',
        },
        options: {
          hu: ['Magasabb ár mutatása először', 'Alacsonyabb ár mutatása', 'Csak egy ár', 'Nincs technika'],
          en: ['Show higher price first', 'Show lower price', 'Only one price', 'No technique'],
          ru: ['Показать более высокую цену сначала', 'Показать более низкую цену', 'Только одна цена', 'Нет техники'],
        },
        correct: 0,
      },
      {
        q: {
          hu: 'Hány csomagot ajánlj?',
          en: 'How many packages should you offer?',
          ru: 'Сколько пакетов нужно предлагать?',
        },
        options: {
          hu: ['Egyet', 'Kettőt', 'Hármat (Alap, Prémium, Enterprise)', 'Tíz'],
          en: ['One', 'Two', 'Three (Basic, Premium, Enterprise)', 'Ten'],
          ru: ['Один', 'Два', 'Три (Базовый, Премиум, Enterprise)', 'Десять'],
        },
        correct: 2,
      },
      {
        q: {
          hu: 'Mit kell csinálni, ha a vevő kedvezményt kér?',
          en: 'What should you do when customer asks for discount?',
          ru: 'Что нужно делать, когда клиент просит скидку?',
        },
        options: {
          hu: ['Adni kedvezményt', 'Értéket ajánlani, nem kedvezményt', 'Elutasítani', 'Várni'],
          en: ['Give discount', 'Offer value, not discount', 'Refuse', 'Wait'],
          ru: ['Дать скидку', 'Предложить ценность, а не скидку', 'Отказать', 'Ждать'],
        },
        correct: 1,
      },
    ],
  },
  {
    day: 24,
    title: { hu: 'Enterprise értékesítési taktikák', en: 'Enterprise Sales Tactics', ru: 'Тактики корпоративных продаж' },
    content: {
      hu: `<h2>Miért fontos az Enterprise értékesítés?</h2><p>Az Enterprise Deal-ek nagyobb értékűek, de hosszabb ciklusúak és komplexebbek. Speciális taktikák kellenek a sikerhez.</p><h2>Hogyan kezeld?</h2><h3>1. Hosszú ciklus kezelése</h3><ul><li><strong>Kapcsolat építés:</strong> Építs erős kapcsolatot a Champion-nel</li><li><strong>Érték demonstrálása:</strong> Mutasd be a ROI-t és a megtérülést</li><li><strong>Türelem:</strong> Enterprise Deal-ek 6-12 hónapig is tarthatnak</li></ul><h3>2. DMU kezelése</h3><ul><li><strong>Minden döntéshozó azonosítása:</strong> Készíts DMU térképet</li><li><strong>Champion kialakítása:</strong> Találd meg és támogasd a Champion-t</li><li><strong>Kapcsolat mindegyikkel:</strong> Építs kapcsolatot minden döntéshozóval</li></ul><h2>Hogyan mérjük?</h2><ul><li><strong>Enterprise Win rate:</strong> Milyen %-a az Enterprise Deal-eknek zárul le?</li><li><strong>Átlagos ciklus hossz:</strong> Mennyi idő alatt zárul le egy Enterprise Deal?</li><li><strong>Átlagos Deal érték:</strong> Mennyi az átlagos Enterprise Deal érték?</li></ul><h2>További anyagok</h2><ul><li><a href="https://blog.hubspot.com/sales/enterprise-sales">Enterprise Sales Guide</a></li></ul>`,
      en: `<h2>Why Enterprise Sales Matters</h2><p>Enterprise Deals are higher value but longer cycle and more complex. Special tactics are needed for success.</p><h2>How to Handle</h2><h3>1. Long Cycle Management</h3><ul><li><strong>Relationship building:</strong> Build strong relationship with Champion</li><li><strong>Value demonstration:</strong> Show ROI and return</li><li><strong>Patience:</strong> Enterprise Deals can take 6-12 months</li></ul><h3>2. DMU Management</h3><ul><li><strong>Identify all decision makers:</strong> Create DMU map</li><li><strong>Develop Champion:</strong> Find and support the Champion</li><li><strong>Relationship with all:</strong> Build relationship with every decision maker</li></ul><h2>How to Measure</h2><ul><li><strong>Enterprise Win rate:</strong> What % of Enterprise Deals Close?</li><li><strong>Average cycle length:</strong> How long does it take to Close an Enterprise Deal?</li><li><strong>Average Deal value:</strong> What is the average Enterprise Deal value?</li></ul><h2>Additional Resources</h2><ul><li><a href="https://blog.hubspot.com/sales/enterprise-sales">Enterprise Sales Guide</a></li></ul>`,
      ru: `<h2>Почему важны корпоративные продажи</h2><p>Enterprise Deal более ценны, но имеют более длинный цикл и более сложны. Для успеха нужны специальные тактики.</p><h2>Как обрабатывать</h2><h3>1. Управление длинным циклом</h3><ul><li><strong>Построение отношений:</strong> Стройте сильные отношения с Champion</li><li><strong>Демонстрация ценности:</strong> Покажите ROI и возврат</li><li><strong>Терпение:</strong> Enterprise Deal могут занимать 6-12 месяцев</li></ul><h3>2. Управление DMU</h3><ul><li><strong>Идентификация всех лиц:</strong> Создайте карту DMU</li><li><strong>Развитие Champion:</strong> Найдите и поддержите Champion</li><li><strong>Отношения со всеми:</strong> Стройте отношения с каждым лицом</li></ul><h2>Как измерить</h2><ul><li><strong>Win rate Enterprise:</strong> Какой % Enterprise Deal закрывается?</li><li><strong>Средняя длина цикла:</strong> Сколько времени занимает закрытие Enterprise Deal?</li><li><strong>Средняя стоимость Deal:</strong> Какова средняя стоимость Enterprise Deal?</li></ul><h2>Доп. материалы</h2><ul><li><a href="https://blog.hubspot.com/sales/enterprise-sales">Enterprise Sales Guide</a></li></ul>`,
    },
    emailSubject: { hu: 'Nap 24: Enterprise értékesítési taktikák', en: 'Day 24: Enterprise Sales Tactics', ru: 'День 24: Тактики корпоративных продаж' },
    emailBody: { hu: 'Ma megtanulod az Enterprise értékesítési taktikákat nagy értékű Deal-ekhez.', en: 'Today you\'ll learn Enterprise sales tactics for high-value Deals.', ru: 'Сегодня вы узнаете тактики корпоративных продаж для высокоценных Deal.' },
    quiz: [
      { q: { hu: 'Mennyi ideig tarthat egy Enterprise Deal?', en: 'How long can an Enterprise Deal take?', ru: 'Сколько может длиться Enterprise Deal?' }, options: { hu: ['1 hónap', '3 hónap', '6-12 hónap', '1 hét'], en: ['1 month', '3 months', '6-12 months', '1 week'], ru: ['1 месяц', '3 месяца', '6-12 месяцев', '1 неделя'] }, correct: 2 },
      { q: { hu: 'Ki a legfontosabb az Enterprise Deal-ben?', en: 'Who is most important in Enterprise Deal?', ru: 'Кто самый важный в Enterprise Deal?' }, options: { hu: ['Economic Buyer', 'Champion', 'User', 'Mindegyik'], en: ['Economic Buyer', 'Champion', 'User', 'All'], ru: ['Economic Buyer', 'Champion', 'User', 'Все'] }, correct: 1 },
    ],
  },
  {
    day: 25,
    title: { hu: 'Tárgyalás mestery', en: 'Negotiation Mastery', ru: 'Мастерство переговоров' },
    content: {
      hu: `<h2>Miért fontos a tárgyalás?</h2><p>A jó tárgyalás több Win-t és jobb árakat jelent. Nem csak az árról szól, hanem az értékről is.</p><h2>Hogyan tárgyalj?</h2><h3>1. Előkészítés</h3><ul><li><strong>BATNA:</strong> Mi a legjobb alternatíva?</li><li><strong>Walk-away pont:</strong> Mikor mondasz nemet?</li><li><strong>Célok:</strong> Mit akarsz elérni?</li></ul><h3>2. Tárgyalási technikák</h3><ul><li><strong>Win-Win:</strong> Keress közös megoldást</li><li><strong>Anchoring:</strong> Te kezdj az árazással</li><li><strong>Concessions:</strong> Adj kicsit, kérj sokat</li></ul><h2>További anyagok</h2><ul><li><a href="https://blog.hubspot.com/sales/negotiation-techniques">Negotiation Techniques</a></li></ul>`,
      en: `<h2>Why Negotiation Matters</h2><p>Good negotiation means more Wins and better prices. It's not just about price, but about value.</p><h2>How to Negotiate</h2><h3>1. Preparation</h3><ul><li><strong>BATNA:</strong> What is your best alternative?</li><li><strong>Walk-away point:</strong> When do you say no?</li><li><strong>Goals:</strong> What do you want to achieve?</li></ul><h3>2. Negotiation Techniques</h3><ul><li><strong>Win-Win:</strong> Find common solution</li><li><strong>Anchoring:</strong> You start with pricing</li><li><strong>Concessions:</strong> Give little, ask for much</li></ul><h2>Additional Resources</h2><ul><li><a href="https://blog.hubspot.com/sales/negotiation-techniques">Negotiation Techniques</a></li></ul>`,
      ru: `<h2>Почему важны переговоры</h2><p>Хорошие переговоры означают больше Win и лучшие цены. Это не только о цене, но и о ценности.</p><h2>Как вести переговоры</h2><h3>1. Подготовка</h3><ul><li><strong>BATNA:</strong> Какова ваша лучшая альтернатива?</li><li><strong>Точка ухода:</strong> Когда вы говорите нет?</li><li><strong>Цели:</strong> Чего вы хотите достичь?</li></ul><h3>2. Техники переговоров</h3><ul><li><strong>Win-Win:</strong> Найдите общее решение</li><li><strong>Якорение:</strong> Вы начинаете с ценообразования</li><li><strong>Уступки:</strong> Дайте мало, просите много</li></ul><h2>Доп. материалы</h2><ul><li><a href="https://blog.hubspot.com/sales/negotiation-techniques">Negotiation Techniques</a></li></ul>`,
    },
    emailSubject: { hu: 'Nap 25: Tárgyalás mestery', en: 'Day 25: Negotiation Mastery', ru: 'День 25: Мастерство переговоров' },
    emailBody: { hu: 'Ma megtanulod a tárgyalás mestery technikáit, hogy több Win-t és jobb árakat érj el.', en: 'Today you\'ll learn negotiation mastery techniques to achieve more Wins and better prices.', ru: 'Сегодня вы узнаете техники мастерства переговоров для достижения большего количества Win и лучших цен.' },
    quiz: [
      { q: { hu: 'Mi a BATNA?', en: 'What is BATNA?', ru: 'Что такое BATNA?' }, options: { hu: ['Best Alternative To Negotiated Agreement', 'Bad Agreement', 'Best Agreement', 'Nincs jelentése'], en: ['Best Alternative To Negotiated Agreement', 'Bad Agreement', 'Best Agreement', 'No meaning'], ru: ['Лучшая альтернатива переговорному соглашению', 'Плохое соглашение', 'Лучшее соглашение', 'Нет значения'] }, correct: 0 },
      { q: { hu: 'Ki kezd az árazással?', en: 'Who starts with pricing?', ru: 'Кто начинает с ценообразования?' }, options: { hu: ['A vevő', 'Te', 'Mindketten', 'Senki'], en: ['The customer', 'You', 'Both', 'Nobody'], ru: ['Клиент', 'Вы', 'Оба', 'Никто'] }, correct: 1 },
    ],
  },
  {
    day: 26,
    title: { hu: 'Személyes értékesítési rendszer tervezése', en: 'Personal Sales System Design', ru: 'Дизайн личной системы продаж' },
    content: {
      hu: `<h2>Miért fontos a személyes rendszer?</h2><p>Minden értékesítő más. Tervezd meg a saját rendszeredet, ami neked működik.</p><h2>Hogyan tervezd meg?</h2><h3>1. Elemzés</h3><ul><li><strong>Erősségeid:</strong> Miben vagy jó?</li><li><strong>Gyengeségeid:</strong> Mit kell javítani?</li><li><strong>Stílusod:</strong> Milyen értékesítő vagy?</li></ul><h3>2. Rendszer építés</h3><ul><li><strong>Rutinok:</strong> Milyen napi rutinok működnek neked?</li><li><strong>Eszközök:</strong> Milyen eszközöket használsz?</li><li><strong>Metrikák:</strong> Mit mérsz?</li></ul><h2>További anyagok</h2><ul><li><a href="https://blog.hubspot.com/sales/personal-sales-system">Personal Sales System</a></li></ul>`,
      en: `<h2>Why Personal System Matters</h2><p>Every salesperson is different. Design your own system that works for you.</p><h2>How to Design</h2><h3>1. Analysis</h3><ul><li><strong>Your strengths:</strong> What are you good at?</li><li><strong>Your weaknesses:</strong> What needs improvement?</li><li><strong>Your style:</strong> What kind of salesperson are you?</li></ul><h3>2. System Building</h3><ul><li><strong>Routines:</strong> What daily routines work for you?</li><li><strong>Tools:</strong> What tools do you use?</li><li><strong>Metrics:</strong> What do you measure?</li></ul><h2>Additional Resources</h2><ul><li><a href="https://blog.hubspot.com/sales/personal-sales-system">Personal Sales System</a></li></ul>`,
      ru: `<h2>Почему важна личная система</h2><p>Каждый продавец разный. Разработайте свою систему, которая работает для вас.</p><h2>Как разработать</h2><h3>1. Анализ</h3><ul><li><strong>Ваши сильные стороны:</strong> В чем вы хороши?</li><li><strong>Ваши слабости:</strong> Что нужно улучшить?</li><li><strong>Ваш стиль:</strong> Какой вы продавец?</li></ul><h3>2. Построение системы</h3><ul><li><strong>Рутины:</strong> Какие ежедневные рутины работают для вас?</li><li><strong>Инструменты:</strong> Какие инструменты вы используете?</li><li><strong>Метрики:</strong> Что вы измеряете?</li></ul><h2>Доп. материалы</h2><ul><li><a href="https://blog.hubspot.com/sales/personal-sales-system">Personal Sales System</a></li></ul>`,
    },
    emailSubject: { hu: 'Nap 26: Személyes értékesítési rendszer tervezése', en: 'Day 26: Personal Sales System Design', ru: 'День 26: Дизайн личной системы продаж' },
    emailBody: { hu: 'Ma tervezed meg a saját értékesítési rendszeredet, ami neked működik.', en: 'Today you\'ll design your own sales system that works for you.', ru: 'Сегодня вы разработаете свою систему продаж, которая работает для вас.' },
    quiz: [
      { q: { hu: 'Mi az első lépés a rendszer tervezésében?', en: 'What is the first step in system design?', ru: 'Какой первый шаг в дизайне системы?' }, options: { hu: ['Rendszer építés', 'Elemzés', 'Metrikák', 'Eszközök'], en: ['System building', 'Analysis', 'Metrics', 'Tools'], ru: ['Построение системы', 'Анализ', 'Метрики', 'Инструменты'] }, correct: 1 },
    ],
  },
  {
    day: 27,
    title: { hu: 'Hosszú távú tervezés (90 nap)', en: 'Long-Term Planning (90 days)', ru: 'Долгосрочное планирование (90 дней)' },
    content: {
      hu: `<h2>Miért fontos a 90 napos tervezés?</h2><p>A 90 napos tervezés segít látni a nagy képet és elérni a hosszú távú célokat.</p><h2>Hogyan tervezz?</h2><h3>1. Célok beállítása</h3><ul><li><strong>Revenue cél:</strong> Mennyi bevétele legyen 90 nap alatt?</li><li><strong>Deal célok:</strong> Hány Deal-et zárj le?</li><li><strong>Lead célok:</strong> Hány új Lead-et szerezz?</li></ul><h3>2. Terv készítése</h3><ul><li><strong>Havi bontás:</strong> Oszd fel 3 hónapra</li><li><strong>Heti bontás:</strong> Oszd fel hétre</li><li><strong>Napi bontás:</strong> Oszd fel napra</li></ul><h2>További anyagok</h2><ul><li><a href="https://blog.hubspot.com/sales/90-day-sales-plan">90-Day Sales Plan</a></li></ul>`,
      en: `<h2>Why 90-Day Planning Matters</h2><p>90-day planning helps you see the big picture and achieve long-term goals.</p><h2>How to Plan</h2><h3>1. Set Goals</h3><ul><li><strong>Revenue goal:</strong> How much revenue in 90 days?</li><li><strong>Deal goals:</strong> How many Deals to Close?</li><li><strong>Lead goals:</strong> How many new Leads to acquire?</li></ul><h3>2. Create Plan</h3><ul><li><strong>Monthly breakdown:</strong> Divide into 3 months</li><li><strong>Weekly breakdown:</strong> Divide into weeks</li><li><strong>Daily breakdown:</strong> Divide into days</li></ul><h2>Additional Resources</h2><ul><li><a href="https://blog.hubspot.com/sales/90-day-sales-plan">90-Day Sales Plan</a></li></ul>`,
      ru: `<h2>Почему важно 90-дневное планирование</h2><p>90-дневное планирование помогает увидеть общую картину и достичь долгосрочных целей.</p><h2>Как планировать</h2><h3>1. Установка целей</h3><ul><li><strong>Цель по выручке:</strong> Сколько выручки за 90 дней?</li><li><strong>Цели по Deal:</strong> Сколько Deal закрыть?</li><li><strong>Цели по Lead:</strong> Сколько новых Lead получить?</li></ul><h3>2. Создание плана</h3><ul><li><strong>Месячный разбивка:</strong> Разделите на 3 месяца</li><li><strong>Недельный разбивка:</strong> Разделите на недели</li><li><strong>Дневной разбивка:</strong> Разделите на дни</li></ul><h2>Доп. материалы</h2><ul><li><a href="https://blog.hubspot.com/sales/90-day-sales-plan">90-Day Sales Plan</a></li></ul>`,
    },
    emailSubject: { hu: 'Nap 27: Hosszú távú tervezés (90 nap)', en: 'Day 27: Long-Term Planning (90 days)', ru: 'День 27: Долгосрочное планирование (90 дней)' },
    emailBody: { hu: 'Ma megtanulod, hogyan tervezz 90 napra előre, hogy elérd a hosszú távú célokat.', en: 'Today you\'ll learn how to plan 90 days ahead to achieve long-term goals.', ru: 'Сегодня вы узнаете, как планировать на 90 дней вперед для достижения долгосрочных целей.' },
    quiz: [
      { q: { hu: 'Mennyi időre tervezünk?', en: 'How long do we plan?', ru: 'На сколько мы планируем?' }, options: { hu: ['30 nap', '60 nap', '90 nap', '1 év'], en: ['30 days', '60 days', '90 days', '1 year'], ru: ['30 дней', '60 дней', '90 дней', '1 год'] }, correct: 2 },
    ],
  },
  {
    day: 28,
    title: { hu: 'Csapat értékesítés', en: 'Team Sales', ru: 'Командные продажи' },
    content: {
      hu: `<h2>Miért fontos a csapat értékesítés?</h2><p>Nagy Deal-ekben gyakran több ember dolgozik együtt. A jó csapatmunka növeli a Win esélyét.</p><h2>Hogyan működj együtt?</h2><h3>1. Szerepkörök</h3><ul><li><strong>Account Manager:</strong> Fő kapcsolattartó</li><li><strong>Sales Engineer:</strong> Technikai szakértő</li><li><strong>Sales Manager:</strong> Stratégiai támogatás</li></ul><h3>2. Kommunikáció</h3><ul><li><strong>Rendszeres sync:</strong> Heti vagy napi sync meeting-ek</li><li><strong>CRM használat:</strong> Mindenki frissítse a CRM-et</li><li><strong>Jegyzetek:</strong> Dokumentáld a meeting-eket</li></ul><h2>További anyagok</h2><ul><li><a href="https://blog.hubspot.com/sales/team-selling">Team Selling Guide</a></li></ul>`,
      en: `<h2>Why Team Sales Matters</h2><p>In large Deals, multiple people often work together. Good teamwork increases Win chances.</p><h2>How to Collaborate</h2><h3>1. Roles</h3><ul><li><strong>Account Manager:</strong> Main contact</li><li><strong>Sales Engineer:</strong> Technical expert</li><li><strong>Sales Manager:</strong> Strategic support</li></ul><h3>2. Communication</h3><ul><li><strong>Regular sync:</strong> Weekly or daily sync meetings</li><li><strong>CRM usage:</strong> Everyone updates CRM</li><li><strong>Notes:</strong> Document meetings</li></ul><h2>Additional Resources</h2><ul><li><a href="https://blog.hubspot.com/sales/team-selling">Team Selling Guide</a></li></ul>`,
      ru: `<h2>Почему важны командные продажи</h2><p>В крупных Deal часто работают вместе несколько человек. Хорошая командная работа увеличивает шансы Win.</p><h2>Как сотрудничать</h2><h3>1. Роли</h3><ul><li><strong>Account Manager:</strong> Основной контакт</li><li><strong>Sales Engineer:</strong> Технический эксперт</li><li><strong>Sales Manager:</strong> Стратегическая поддержка</li></ul><h3>2. Коммуникация</h3><ul><li><strong>Регулярная синхронизация:</strong> Еженедельные или ежедневные sync встречи</li><li><strong>Использование CRM:</strong> Все обновляют CRM</li><li><strong>Заметки:</strong> Документируйте встречи</li></ul><h2>Доп. материалы</h2><ul><li><a href="https://blog.hubspot.com/sales/team-selling">Team Selling Guide</a></li></ul>`,
    },
    emailSubject: { hu: 'Nap 28: Csapat értékesítés', en: 'Day 28: Team Sales', ru: 'День 28: Командные продажи' },
    emailBody: { hu: 'Ma megtanulod, hogyan működj együtt a csapattal nagy Deal-ekben.', en: 'Today you\'ll learn how to collaborate with team in large Deals.', ru: 'Сегодня вы узнаете, как сотрудничать с командой в крупных Deal.' },
    quiz: [
      { q: { hu: 'Ki a fő kapcsolattartó?', en: 'Who is the main contact?', ru: 'Кто основной контакт?' }, options: { hu: ['Sales Engineer', 'Account Manager', 'Sales Manager', 'Mindegyik'], en: ['Sales Engineer', 'Account Manager', 'Sales Manager', 'All'], ru: ['Sales Engineer', 'Account Manager', 'Sales Manager', 'Все'] }, correct: 1 },
    ],
  },
  {
    day: 29,
    title: { hu: 'Folyamatos fejlesztés', en: 'Continuous Improvement', ru: 'Непрерывное улучшение' },
    content: {
      hu: `<h2>Miért fontos a folyamatos fejlesztés?</h2><p>A legjobb értékesítők soha nem állnak meg. Folyamatosan fejlesztik magukat és a rendszerüket.</p><h2>Hogyan fejleszd magad?</h2><h3>1. Tanulás</h3><ul><li><strong>Könyvek:</strong> Olvass értékesítési könyveket</li><li><strong>Képzések:</strong> Vegyél részt képzéseken</li><li><strong>Mentorálás:</strong> Keress mentort</li></ul><h3>2. Gyakorlás</h3><ul><li><strong>Role play:</strong> Gyakorold a helyzeteket</li><li><strong>Feedback:</strong> Kérj visszajelzést</li><li><strong>Próbálj új dolgokat:</strong> Kísérletezz</li></ul><h2>További anyagok</h2><ul><li><a href="https://blog.hubspot.com/sales/continuous-improvement">Continuous Improvement</a></li></ul>`,
      en: `<h2>Why Continuous Improvement Matters</h2><p>The best salespeople never stop. They continuously improve themselves and their system.</p><h2>How to Improve</h2><h3>1. Learning</h3><ul><li><strong>Books:</strong> Read sales books</li><li><strong>Training:</strong> Attend trainings</li><li><strong>Mentoring:</strong> Find a mentor</li></ul><h3>2. Practice</h3><ul><li><strong>Role play:</strong> Practice situations</li><li><strong>Feedback:</strong> Ask for feedback</li><li><strong>Try new things:</strong> Experiment</li></ul><h2>Additional Resources</h2><ul><li><a href="https://blog.hubspot.com/sales/continuous-improvement">Continuous Improvement</a></li></ul>`,
      ru: `<h2>Почему важно непрерывное улучшение</h2><p>Лучшие продавцы никогда не останавливаются. Они постоянно улучшают себя и свою систему.</p><h2>Как улучшать</h2><h3>1. Обучение</h3><ul><li><strong>Книги:</strong> Читайте книги по продажам</li><li><strong>Обучение:</strong> Посещайте тренинги</li><li><strong>Менторство:</strong> Найдите ментора</li></ul><h3>2. Практика</h3><ul><li><strong>Ролевые игры:</strong> Практикуйте ситуации</li><li><strong>Обратная связь:</strong> Просите обратную связь</li><li><strong>Пробуйте новое:</strong> Экспериментируйте</li></ul><h2>Доп. материалы</h2><ul><li><a href="https://blog.hubspot.com/sales/continuous-improvement">Continuous Improvement</a></li></ul>`,
    },
    emailSubject: { hu: 'Nap 29: Folyamatos fejlesztés', en: 'Day 29: Continuous Improvement', ru: 'День 29: Непрерывное улучшение' },
    emailBody: { hu: 'Ma megtanulod, hogyan fejleszd folyamatosan magad és a rendszeredet.', en: 'Today you\'ll learn how to continuously improve yourself and your system.', ru: 'Сегодня вы узнаете, как непрерывно улучшать себя и свою систему.' },
    quiz: [
      { q: { hu: 'Mi a folyamatos fejlesztés kulcsa?', en: 'What is the key to continuous improvement?', ru: 'В чем ключ к непрерывному улучшению?' }, options: { hu: ['Megállás', 'Tanulás és gyakorlás', 'Várás', 'Semmi'], en: ['Stopping', 'Learning and practice', 'Waiting', 'Nothing'], ru: ['Остановка', 'Обучение и практика', 'Ожидание', 'Ничего'] }, correct: 1 },
    ],
  },
  {
    day: 30,
    title: { hu: 'Következő lépések és források', en: 'Next Steps & Resources', ru: 'Следующие шаги и ресурсы' },
    content: {
      hu: `<h2>Gratulálunk!</h2><p>Elkészültél a 30 napos kurzuson! Most itt az idő, hogy alkalmazd a tanultakat.</p><h2>Következő lépések</h2><h3>1. Akció terv</h3><ul><li><strong>Rövid távú (1 hét):</strong> Melyik 3 dolgot alkalmazod azonnal?</li><li><strong>Középtávú (1 hónap):</strong> Milyen rendszert építesz?</li><li><strong>Hosszú távú (90 nap):</strong> Milyen célokat tűzöl ki?</li></ul><h3>2. További tanulás</h3><ul><li><strong>Könyvek:</strong> "The Challenger Sale", "SPIN Selling"</li><li><strong>Podcast-ok:</strong> Sales podcasts hallgatása</li><li><strong>Közösségek:</strong> Csatlakozz értékesítési közösségekhez</li></ul><h3>3. Gyakorlás</h3><ul><li><strong>Alkalmazd a tanultakat:</strong> Kezdj el azonnal</li><li><strong>Mérj eredményeket:</strong> Kövesd a metrikákat</li><li><strong>Fejleszd a rendszeredet:</strong> Folyamatosan javíts</li></ul><h2>További források</h2><ul><li><a href="https://blog.hubspot.com/sales">HubSpot Sales Blog</a></li><li><a href="https://www.salesforce.com/resources/">Salesforce Resources</a></li></ul><h2>Köszönjük, hogy velünk tanultál!</h2>`,
      en: `<h2>Congratulations!</h2><p>You've completed the 30-day course! Now it's time to apply what you've learned.</p><h2>Next Steps</h2><h3>1. Action Plan</h3><ul><li><strong>Short-term (1 week):</strong> Which 3 things will you apply immediately?</li><li><strong>Mid-term (1 month):</strong> What system will you build?</li><li><strong>Long-term (90 days):</strong> What goals will you set?</li></ul><h3>2. Further Learning</h3><ul><li><strong>Books:</strong> "The Challenger Sale", "SPIN Selling"</li><li><strong>Podcasts:</strong> Listen to sales podcasts</li><li><strong>Communities:</strong> Join sales communities</li></ul><h3>3. Practice</h3><ul><li><strong>Apply what you learned:</strong> Start immediately</li><li><strong>Measure results:</strong> Track metrics</li><li><strong>Improve your system:</strong> Continuously improve</li></ul><h2>Additional Resources</h2><ul><li><a href="https://blog.hubspot.com/sales">HubSpot Sales Blog</a></li><li><a href="https://www.salesforce.com/resources/">Salesforce Resources</a></li></ul><h2>Thank you for learning with us!</h2>`,
      ru: `<h2>Поздравляем!</h2><p>Вы завершили 30-дневный курс! Теперь пора применить то, что вы узнали.</p><h2>Следующие шаги</h2><h3>1. План действий</h3><ul><li><strong>Краткосрочный (1 неделя):</strong> Какие 3 вещи вы примените немедленно?</li><li><strong>Среднесрочный (1 месяц):</strong> Какую систему вы построите?</li><li><strong>Долгосрочный (90 дней):</strong> Какие цели вы поставите?</li></ul><h3>2. Дальнейшее обучение</h3><ul><li><strong>Книги:</strong> "The Challenger Sale", "SPIN Selling"</li><li><strong>Подкасты:</strong> Слушайте подкасты по продажам</li><li><strong>Сообщества:</strong> Присоединяйтесь к сообществам продаж</li></ul><h3>3. Практика</h3><ul><li><strong>Применяйте изученное:</strong> Начните немедленно</li><li><strong>Измеряйте результаты:</strong> Отслеживайте метрики</li><li><strong>Улучшайте свою систему:</strong> Постоянно улучшайте</li></ul><h2>Дополнительные ресурсы</h2><ul><li><a href="https://blog.hubspot.com/sales">HubSpot Sales Blog</a></li><li><a href="https://www.salesforce.com/resources/">Salesforce Resources</a></li></ul><h2>Спасибо, что учились с нами!</h2>`,
    },
    emailSubject: { hu: 'Nap 30: Következő lépések és források', en: 'Day 30: Next Steps & Resources', ru: 'День 30: Следующие шаги и ресурсы' },
    emailBody: { hu: 'Gratulálunk! Elkészültél a 30 napos kurzuson! Most alkalmazd a tanultakat.', en: 'Congratulations! You\'ve completed the 30-day course! Now apply what you learned.', ru: 'Поздравляем! Вы завершили 30-дневный курс! Теперь примените изученное.' },
    quiz: [
      { q: { hu: 'Mi a következő lépés a kurzus után?', en: 'What is the next step after the course?', ru: 'Какой следующий шаг после курса?' }, options: { hu: ['Semmi', 'Alkalmazni a tanultakat', 'Várni', 'Újra kezdeni'], en: ['Nothing', 'Apply what you learned', 'Wait', 'Start over'], ru: ['Ничего', 'Применить изученное', 'Ждать', 'Начать заново'] }, correct: 1 },
    ],
  },
];

async function createCourse(language: 'hu' | 'en' | 'ru', courseId: string, courseName: string, courseDescription: string) {
  const brand = await Brand.findOne({ slug: 'amanoba' }) || await Brand.findOne({});
  if (!brand) throw new Error('No brand found');

  let course = await Course.findOne({ courseId });
  if (course) {
    console.log(`✅ Course ${courseId} already exists, updating...`);
    course.name = courseName;
    course.description = courseDescription;
    course.language = language;
    course.isActive = true;
    await course.save();
    return course;
  }

  course = await Course.create({
    courseId,
    name: courseName,
    description: courseDescription,
    language,
    durationDays: 30,
    isActive: true,
    requiresPremium: false,
    brandId: brand._id,
    pointsConfig: {
      completionPoints: 1000,
      lessonPoints: 50,
      perfectCourseBonus: 500,
    },
    xpConfig: {
      completionXP: 500,
      lessonXP: 25,
    },
    metadata: {
      category: 'sales',
      difficulty: 'beginner',
      estimatedHours: 7.5,
      tags: ['sales', 'b2b', 'funnel', 'productivity', 'leads', 'pricing'],
      instructor: 'Amanoba',
    },
  });

  console.log(`✅ Created course ${courseId}`);
  return course;
}

async function createLesson(
  course: any,
  lessonData: LessonContent,
  language: 'hu' | 'en' | 'ru'
) {
  const lessonId = `${course.courseId}_DAY_${String(lessonData.day).padStart(2, '0')}`;
  
  const lesson = await Lesson.findOneAndUpdate(
    { lessonId },
    {
      $set: {
        lessonId,
        courseId: course._id,
        dayNumber: lessonData.day,
        language,
        title: lessonData.title[language],
        content: lessonData.content[language],
        emailSubject: lessonData.emailSubject[language],
        emailBody: lessonData.emailBody[language],
        pointsReward: 50,
        xpReward: 25,
        isActive: true,
        displayOrder: lessonData.day,
        quizConfig: {
          enabled: true,
          successThreshold: 100,
          questionCount: 5,
          poolSize: 15,
          required: true,
        },
        metadata: {
          estimatedMinutes: 15,
          difficulty: 'beginner',
          tags: ['sales', 'funnel', 'numbers'],
        },
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  // Create quiz questions
  for (const q of lessonData.quiz) {
    await QuizQuestion.findOneAndUpdate(
      {
        lessonId: lesson.lessonId,
        courseId: course._id,
        question: q.q[language],
        isCourseSpecific: true,
      },
      {
        $set: {
          question: q.q[language],
          options: q.options[language],
          correctIndex: q.correct,
          difficulty: QuestionDifficulty.MEDIUM,
          category: 'Course Specific',
          lessonId: lesson.lessonId,
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
        },
      },
      { upsert: true, new: true }
    );
  }

  return lesson;
}

async function seed() {
  await connectDB();

  // Create courses for all three languages
  const courseHU = await createCourse('hu', COURSE_ID_HU, COURSE_NAME_HU, COURSE_DESCRIPTION_HU);
  const courseEN = await createCourse('en', COURSE_ID_EN, COURSE_NAME_EN, COURSE_DESCRIPTION_EN);
  const courseRU = await createCourse('ru', COURSE_ID_RU, COURSE_NAME_RU, COURSE_DESCRIPTION_RU);

  console.log('\n📚 Creating lessons...\n');

  // Create lessons for each language (one lesson at a time for all languages)
  for (const lessonData of lessonPlan) {
    console.log(`\n📖 Day ${lessonData.day}: Creating in all languages...`);
    
    await createLesson(courseHU, lessonData, 'hu');
    console.log(`   ✅ Hungarian lesson created`);
    
    await createLesson(courseEN, lessonData, 'en');
    console.log(`   ✅ English lesson created`);
    
    await createLesson(courseRU, lessonData, 'ru');
    console.log(`   ✅ Russian lesson created`);
    
    // Count quiz questions
    const questionsCount = await QuizQuestion.countDocuments({
      courseId: courseHU._id,
      lessonId: `${COURSE_ID_HU}_DAY_${String(lessonData.day).padStart(2, '0')}`,
      isCourseSpecific: true,
    });
    console.log(`   ✅ ${questionsCount} quiz questions created per language`);
  }

  console.log(`\n✅ Course creation complete!`);
  console.log(`\n📊 Summary:`);
  console.log(`   - Courses created: 3 (HU, EN, RU)`);
  console.log(`   - Lessons created: ${lessonPlan.length} per language (${lessonPlan.length * 3} total)`);
  console.log(`   - Quiz questions: ${lessonPlan.length * 5} per language (${lessonPlan.length * 5 * 3} total)`);
  console.log(`\n🎯 Next steps:`);
  console.log(`   - Review lessons in admin: /en/admin/courses/${COURSE_ID_EN}`);
  console.log(`   - Test enrollment: /en/courses/${COURSE_ID_EN}`);
  console.log(`   - Continue adding Day 2-30 lessons`);

  await mongoose.disconnect();
  console.log('\n✅ Disconnected from MongoDB');
}

seed().catch((error) => {
  console.error('❌ Seed failed:', error);
  process.exit(1);
});
