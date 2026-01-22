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
  <li>Azonosítani a tölcsér 5 fő szintjét (Lead → Minősített → Kapcsolat → Engedélyezett → Bezárás)</li>
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
  <li>5 ember részt vesz egy bemutatón (Engedélyezett)</li>
  <li>2 ember vásárol (Bezárás)</li>
</ul>

<p>Ez azt jelenti: <strong>2% konverzió</strong> a lead-től a bezárásig.</p>

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
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>4. Engedélyezett</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd;">Bemutató/demo megtörtént, érdeklődés van</td>
      <td style="padding: 12px; border: 1px solid #ddd;">Demo megtartva, ajánlat elküldve</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>5. Bezárás</strong></td>
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
  <li><strong>Kapcsolat → Engedélyezett:</strong> 30-40% (10 kapcsolat-ból 3-4 engedélyezett)</li>
  <li><strong>Engedélyezett → Bezárás:</strong> 20-30% (4 engedélyezett-ből 1 bezárás)</li>
</ul>

<p><strong>Összesen:</strong> 100 lead → ~1 bezárás (1% konverzió lead-től bezárásig)</p>

<hr />

<h2>Példák</h2>

<h3>Jó példa: Mérhető tölcsér</h3>
<p><strong>Havi célok:</strong></p>
<ul>
  <li>400 új lead (napi 20)</li>
  <li>200 minősített (napi 10)</li>
  <li>48 bemutató (heti 12)</li>
  <li>12 bezárás (havi 12)</li>
</ul>
<p><strong>Miért jó:</strong> Minden szinten van konkrét szám, napi/heti/havi bontásban. Tudod, ha elmaradsz, és hol kell gyorsítani.</p>

<h3>Rossz példa: "Reménykedés"</h3>
<p><strong>Havi célok:</strong></p>
<ul>
  <li>"Sok lead"</li>
  <li>"Jó üzletek"</li>
  <li>"Remélem, bezárunk 5-öt"</li>
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
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>4. Engedélyezett</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">4</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">16</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">33%</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;"><strong>5. Bezárás</strong></td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">0</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">1</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">4</td>
      <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">25%</td>
    </tr>
  </tbody>
</table>

<ol start="2">
  <li><strong>Számítsd ki a konverziós arányokat:</strong> Minden szinthez add meg, hány százalék halad tovább.</li>
  <li><strong>Állítsd be a célokat:</strong> Kezdj a bezárással (pl. "havi 4 üzlet"), és számold visszafelé.</li>
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
      <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Bezárás</th>
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
  <li><strong>Minden szinten kell cél.</strong> Nem elég csak a bezárásra koncentrálni – minden szinten kell aktivitás.</li>
  <li><strong>Napi követés = kontroll.</strong> Ha nem méred naponta, elveszíted a kontrollt.</li>
  <li><strong>Konverziós arányok változnak.</strong> Mérj, javíts, optimalizálj folyamatosan.</li>
</ul>

<hr />

<h2>Dop. anyagok (opcionális)</h2>
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
            'Csak a bezárások számolása',
            'A lead-ek tárolása egy helyen',
            'Előrejelzés és kontroll – tudni, hány üzletet fogsz bezárni',
            'Csak a marketing aktivitások követése',
          ],
          en: [
            'Just counting closes',
            'Storing leads in one place',
            'Forecasting and control – knowing how many deals you'll close',
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
            'Bezárás → Lead → Minősített',
            'Lead → Minősített → Kapcsolat → Engedélyezett → Bezárás',
            'Kapcsolat → Lead → Bezárás',
            'Engedélyezett → Lead → Minősített',
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
          hu: 'Mi a tipikus konverziós arány Lead-től Bezárásig B2B értékesítésben?',
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
            'Nem fontos, csak a bezárás számít',
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
  // Day 2-30 will be added progressively
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
