/**
 * Apply SCRUMMASTER_LESZEK_2026_HU Day 04 lesson content (backup-first).
 *
 * Usage:
 * - Dry-run:
 *   npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-04.ts
 * - Apply (DB write + backup):
 *   npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-04.ts --apply
 */

import { config } from 'dotenv';
import { resolve, join } from 'path';
import { mkdirSync, writeFileSync } from 'fs';
import mongoose from 'mongoose';

config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../app/lib/mongodb';
import { Lesson } from '../app/lib/models';

const COURSE_ID = 'SCRUMMASTER_LESZEK_2026_HU';
const LESSON_ID = 'SCRUMMASTER_LESZEK_2026_HU_DAY_04';

function hasFlag(flag: string) {
  return process.argv.includes(flag);
}

function isoStamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

const APPLY = hasFlag('--apply');

const title = 'Pszichológiai biztonság + fókusz: 5 mikroszabály kezdőknek';

const content = `<h1>Pszichológiai biztonság + fókusz: 5 mikroszabály kezdőknek</h1>
<p><em>Ma egy egyszerű, működő „csapat-higiénia” csomagot kapsz. Kezdő Scrum Masterként a legnagyobb veszély: túl korán akarsz nagy változást. Ehelyett apró, követhető szabályokkal építs biztonságot és fókuszt.</em></p>

<hr />

<h2>Napi cél (kézzelfogható)</h2>
<ul>
  <li>Készítesz egy <strong>5 pontos mikroszabály-listát</strong> (biztonság + fókusz) a csapatodnak.</li>
  <li>Megírsz egy <strong>2 mondatos beavatkozási scriptet</strong> konfliktusra vagy domináns hangra.</li>
  <li>Beállítasz <strong>1 mérőpontot</strong>, amiből kiderül, javul-e a helyzet (nem csak „érzésre”).</li>
</ul>

<hr />

<h2>Gyors fogalomtisztázás</h2>
<ul>
  <li><strong>Pszichológiai biztonság</strong>: a csapat tagjai mernek kérdezni, hibát jelezni, ellent mondani és ötletet bedobni anélkül, hogy megszégyenülnének.</li>
  <li><strong>Fókusz</strong>: kevesebb párhuzamos munka, kevesebb megszakítás, tisztább döntések.</li>
  <li><strong>Miért együtt?</strong> Biztonság nélkül nincs őszinte valóságkép; fókusz nélkül nincs kézzelfogható eredmény. Mindkettő kell a tanuláshoz.</li>
</ul>

<hr />

<h2>Az 5 mikroszabály (vezethető, kezdőbarát)</h2>
<ol>
  <li><strong>Kérdés előny</strong>: ha valaki nem ért valamit, kérdezhet azonnal. A cél nem „okosnak látszani”, hanem tisztázni.</li>
  <li><strong>Blame helyett tanulás</strong>: hibánál a kérdés: „mi tette ésszerűvé ezt a döntést akkor?” és „mit változtatunk a rendszerben?”.</li>
  <li><strong>Egy beszél, mindenki figyel</strong>: egyszerre egy ember beszél. A többiek nem vitatkoznak közben, hanem kérdeznek.</li>
  <li><strong>Timebox + kimenet</strong>: meeting végén legyen 1 konkrét döntés vagy következő lépés. Ha nincs, a struktúrán változtatunk.</li>
  <li><strong>Megszakítás-kezelés</strong>: „sürgős” kérésnél 2 perc triage: mi a hatás, mi a deadline, ki az owner, mi csúszik miatta.</li>
</ol>

<hr />

<h2>Beavatkozási script (2 mondat)</h2>
<p><strong>Cél:</strong> megvéded a biztonságot és a fókuszt, de nem szégyenítesz meg senkit.</p>
<ul>
  <li><strong>Domináns hangra:</strong> „Megállítalak egy pillanatra, hogy mindenki szóhoz jusson. Menjünk körbe: 1 mondatban mindenki mondjon 1 kockázatot vagy ötletet.”</li>
  <li><strong>Konfliktusra:</strong> „Álljunk meg: most két nézőpont van. Először rögzítsük a közös célt, aztán írjunk fel 2 döntési szempontot, és válasszunk 1 hetes kísérletet.”</li>
</ul>

<hr />

<h2>Példák (jó vs rossz)</h2>

<h3>Példa 1: Hibakeresés „bűnbak” módban</h3>
<p><strong>Rossz:</strong> „Ki rontotta el? Ki felelős?”</p>
<p><strong>Jó:</strong> „Mi volt a döntési helyzet? Milyen információ hiányzott? Mit változtatunk a folyamatban (pl. ellenőrzőlista, review, Definition of Done), hogy ez ritkább legyen?”</p>

<h3>Példa 2: Meeting szétcsúszik</h3>
<p><strong>Rossz:</strong> 30 perc beszélgetés, nincs döntés, mindenki frusztrált.</p>
<p><strong>Jó:</strong> 10 perces timebox + 1 döntési kérdés + 1 következő lépés (owner + határidő).</p>

<h3>Példa 3: Csend a csapatban</h3>
<p><strong>Rossz:</strong> „Senki sem mond semmit, akkor menjünk tovább.”</p>
<p><strong>Jó:</strong> „Adok 60 másodperc néma gondolkodást, majd mindenki mond 1 aggályt vagy kérdést. A cél: előhozni a rejtett kockázatot.”</p>

<hr />

<h2>Mérőpont (hogy ne legyen „érzés”)</h2>
<ul>
  <li><strong>Beszéd-idő arány</strong>: 1–2 ember beszél-e 80%-ot? Cél: egyenletesebb megoszlás.</li>
  <li><strong>Meeting kimenet arány</strong>: hány meeting végződik döntéssel/következő lépéssel? Cél: közel 100%.</li>
  <li><strong>Megszakítás számláló</strong>: naponta hányszor szakítják meg a fókuszt „sürgős” kéréssel? Cél: csökkenő trend.</li>
</ul>

<hr />

<h2>Akció (20 perc)</h2>
<ol>
  <li>Írd le a saját 5 mikroszabályodat (a fenti lista alapján, a saját szavaiddal).</li>
  <li>Válassz ki 1 tipikus helyzetet (domináns hang / csend / bűnbakkeresés), és írd le a 2 mondatos scriptedet.</li>
  <li>Válassz 1 mérőpontot a listából, és add meg: hogyan fogod rögzíteni a következő 1 hétben (pl. napi 1 perc jelölés).</li>
</ol>

<hr />

<h2>Önellenőrzés</h2>
<ul>
  <li>✅ Van 5 mikroszabályom, amit a csapat megérthet és kipróbálhat.</li>
  <li>✅ Van 2 mondatos beavatkozási script domináns hangra és konfliktusra.</li>
  <li>✅ Van 1 mérőpontom, amivel ellenőrzöm a változást.</li>
</ul>

<hr />

<h2>Opcionális források</h2>
<ul>
  <li>Amy Edmondson: psychological safety (alapötlet).</li>
  <li>Facilitation: timebox + kimenet + döntési szabály.</li>
</ul>`;

const emailSubject = 'ScrumMaster leszek 2026 — 4. nap: Pszichológiai biztonság + fókusz';

const emailBody = `<h1>{{courseName}}</h1>
<h2>{{dayNumber}}. nap: {{lessonTitle}}</h2>
<p>Ma kapsz 5 mikroszabályt és 2 mondatos beavatkozási mondatokat, hogy a csapatban legyen biztonság és fókusz.</p>
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

  console.log('✅ Day 04 applied');
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

