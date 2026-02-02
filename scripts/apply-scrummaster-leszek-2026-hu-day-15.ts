/**
 * Apply SCRUMMASTER_LESZEK_2026_HU Day 15 lesson content (backup-first).
 *
 * Usage:
 * - Dry-run:
 *   npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-15.ts
 * - Apply (DB write + backup):
 *   npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-15.ts --apply
 */

import { config } from 'dotenv';
import { resolve, join } from 'path';
import { mkdirSync, writeFileSync } from 'fs';
import mongoose from 'mongoose';

config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../app/lib/mongodb';
import { Lesson } from '../app/lib/models';

const COURSE_ID = 'SCRUMMASTER_LESZEK_2026_HU';
const LESSON_ID = 'SCRUMMASTER_LESZEK_2026_HU_DAY_15';

function hasFlag(flag: string) {
  return process.argv.includes(flag);
}

function isoStamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

const APPLY = hasFlag('--apply');

const title = 'Döntés vagy kísérlet? Hogyan zárd le a végtelen vitákat';

const content = `<h1>Döntés vagy kísérlet? Hogyan zárd le a végtelen vitákat</h1>
<p><em>Sok csapat ott vérzik el, hogy mindent „tökéletesen eldönt” — vagy épp semmit nem dönt el. Scrum Masterként az egyik legerősebb képesség: felismerni, mikor kell <strong>kemény döntés</strong>, és mikor elég egy <strong>időboxolt kísérlet</strong> gyors visszajelzéssel.</em></p>

<hr />

<h2>Napi cél (kézzelfogható)</h2>
<ul>
  <li>Összeraksz egy <strong>Döntés vs Kísérlet</strong> mini-keretet (3 kérdés + kimenet).</li>
  <li>Készítesz egy <strong>1 hetes kísérlet sablont</strong>: hipotézis, mérés, idő, stop/continue.</li>
  <li>Megtanulod a „végtelen vita” lezárását: döntési szabály + owner + következő lépés.</li>
</ul>

<hr />

<h2>Miért végtelenek a viták?</h2>
<ul>
  <li>Nincs tiszta <strong>döntési szabály</strong> (ki dönt? hogyan?)</li>
  <li>Nincs tiszta <strong>kimenet</strong> (mit akarunk a végére?)</li>
  <li>Túl nagy a bizonytalanság, és mégis „végleges döntést” akarunk</li>
</ul>

<hr />

<h2>Döntés vs Kísérlet — 3 kérdés</h2>
<ol>
  <li><strong>Reverzibilis?</strong> Könnyű visszafordítani, ha rossz? (Igen → kísérlet gyakran elég)</li>
  <li><strong>Bizonytalanság?</strong> Tudjuk, mi fog történni? (Nagy → kísérlet)</li>
  <li><strong>Költség a hibának?</strong> Ha rossz, mennyire drága? (Nagy → több adat / óvatos kísérlet / minimum védelem)</li>
</ol>

<hr />

<h2>Az „1 hetes kísérlet” sablon</h2>
<ul>
  <li><strong>Hipotézis</strong>: „Ha ezt csináljuk, akkor ez javul, mert…”</li>
  <li><strong>Időbox</strong>: 1 hét (vagy 1 Sprinten belül kis szelet)</li>
  <li><strong>Mérés</strong>: 1–2 jel (pl. megszakítások száma, cycle time, hibák)</li>
  <li><strong>Védőkorlát</strong>: mi az, amit nem lépünk át (minőség, biztonság, ügyfél impact)</li>
  <li><strong>Stop/continue szabály</strong>: mikor állítjuk le, mikor folytatjuk?</li>
</ul>

<hr />

<h2>Hogyan zársz le egy vitát 2 perc alatt?</h2>
<ol>
  <li><strong>Összegzés</strong> (1 mondat): mi a kérdés?</li>
  <li><strong>Opciók</strong> (max 2): A vagy B</li>
  <li><strong>Döntési szabály</strong>: consent / owner dönt / szavazás</li>
  <li><strong>Next step</strong>: döntés + owner + határidő + mérés</li>
</ol>

<hr />

<h2>Akció (30 perc) — Döntés vagy kísérlet?</h2>
<p>Válassz egy helyzetet:</p>
<ul>
  <li>A) „Térjünk át új ticket-rendszerre?”</li>
  <li>B) „Bevezetünk WIP limitet?”</li>
  <li>C) „Átszervezzük a Daily-t?”</li>
</ul>
<ol>
  <li>Válaszolj a 3 kérdésre (reverzibilis, bizonytalanság, hiba költsége).</li>
  <li>Ha kísérlet: töltsd ki az 1 hetes kísérlet sablont.</li>
  <li>Ha döntés: írd le a döntési szabályt és a lezárást (owner + mikor nézzük meg).</li>
</ol>

<hr />

<h2>Önellenőrzés</h2>
<ul>
  <li>✅ Felismerem, mikor kell döntés és mikor elég kísérlet.</li>
  <li>✅ Tudok kísérletet tervezni mérőponttal és stop/continue szabállyal.</li>
  <li>✅ Tudok vitát lezárni döntéssel + next steppel.</li>
</ul>`;

const emailSubject = 'ScrumMaster leszek 2026 — 15. nap: Döntés vs kísérlet (lezárás 2 perc alatt)';

const emailBody = `<h1>{{courseName}}</h1>
<h2>{{dayNumber}}. nap: {{lessonTitle}}</h2>
<p>Ma keretet kapsz, hogy a végtelen vitákból döntés vagy időboxolt kísérlet legyen.</p>
<div>{{lessonContent}}</div>
<p><a href="{{appUrl}}/courses/SCRUMMASTER_LESZEK_2026_HU/day/{{dayNumber}}">Olvasd el a teljes leckét →</a></p>`;

async function main() {
  await connectDB();

  const lesson = await Lesson.findOne({ lessonId: LESSON_ID }).lean();
  if (!lesson) throw new Error(`Lesson not found: ${LESSON_ID}`);

  const current = {
    title: String((lesson as { title?: unknown }).title ?? ''),
    content: String((lesson as { content?: unknown }).content ?? ''),
    emailSubject: String((lesson as { emailSubject?: unknown }).emailSubject ?? ''),
    emailBody: String((lesson as { emailBody?: unknown }).emailBody ?? ''),
  };

  const backupPayload = {
    generatedAt: new Date().toISOString(),
    courseId: COURSE_ID,
    lessonId: LESSON_ID,
    title: current.title,
    content: current.content,
    emailSubject: current.emailSubject,
    emailBody: current.emailBody,
  };

  const stamp = isoStamp();
  const backupDir = join(process.cwd(), 'scripts', 'lesson-backups', COURSE_ID);
  const backupFile = join(backupDir, `${LESSON_ID}__${stamp}.json`);

  if (!APPLY) {
    console.log('DRY RUN (no DB writes).');
    console.log(`- lessonId: ${LESSON_ID}`);
    console.log(`- current.title: ${JSON.stringify(current.title)}`);
    console.log(`- current.emailSubject: ${JSON.stringify(current.emailSubject)}`);
    console.log(
      `- current.contentPreview: ${JSON.stringify(
        current.content.length > 200 ? `${current.content.slice(0, 200)}…` : current.content
      )}`
    );
    console.log(`- would backup to: ${backupFile}`);
    console.log(`- would set title/content/email fields (keeping isActive as-is)`);
    await mongoose.disconnect();
    return;
  }

  mkdirSync(backupDir, { recursive: true });
  writeFileSync(backupFile, JSON.stringify(backupPayload, null, 2));

  const update = await Lesson.updateOne(
    { lessonId: LESSON_ID },
    {
      $set: {
        title,
        content,
        emailSubject,
        emailBody,
      },
    }
  );

  console.log('✅ Day 15 applied');
  console.log(`- lessonId: ${LESSON_ID}`);
  console.log(`- matched: ${update.matchedCount}`);
  console.log(`- modified: ${update.modifiedCount}`);
  console.log(`- backup: ${backupFile}`);
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

