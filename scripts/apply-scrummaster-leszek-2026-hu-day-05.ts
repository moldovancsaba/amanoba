/**
 * Apply SCRUMMASTER_LESZEK_2026_HU Day 05 lesson content (backup-first).
 *
 * Usage:
 * - Dry-run:
 *   npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-05.ts
 * - Apply (DB write + backup):
 *   npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-05.ts --apply
 */

import { config } from 'dotenv';
import { resolve, join } from 'path';
import { mkdirSync, writeFileSync } from 'fs';
import mongoose from 'mongoose';

config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../app/lib/mongodb';
import { Lesson } from '../app/lib/models';

const COURSE_ID = 'SCRUMMASTER_LESZEK_2026_HU';
const LESSON_ID = 'SCRUMMASTER_LESZEK_2026_HU_DAY_05';

function hasFlag(flag: string) {
  return process.argv.includes(flag);
}

function isoStamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

const APPLY = hasFlag('--apply');

const title = 'Definition of Done (DoD): minőség-kapu, ami nem lassít, hanem gyorsít';

const content = `<h1>Definition of Done (DoD): minőség-kapu, ami nem lassít, hanem gyorsít</h1>
<p><em>Ma egy olyan eszközt kapsz, ami kezdő Scrum Masterként aranyat ér: a közös „kész” definíciót. A DoD nem dokumentum a fiókba. A DoD egy megállapodás, ami csökkenti a vitát, a visszagörgetést és a rework-öt.</em></p>

<hr />

<h2>Napi cél (kézzelfogható)</h2>
<ul>
  <li>Készítesz egy <strong>DoD v0.1</strong>-et (7–10 pont) a csapatodnak.</li>
  <li>Megtanulod, hogyan építs <strong>minőség-kaput</strong> úgy, hogy ne „rendőrség” legyen, hanem döntési tisztaság.</li>
  <li>Beállítasz 1–2 <strong>mérőpontot</strong>, amiből látszik, hogy a DoD segít-e (pl. visszagörgetés / hibák / rework).</li>
</ul>

<hr />

<h2>Mi a DoD valójában?</h2>
<ul>
  <li><strong>DoD</strong> = közös megállapodás arról, mit jelent a <strong>„kész, használható eredmény”</strong>.</li>
  <li><strong>Miért kell?</strong> Mert „kész” nélkül nincs átláthatóság. Ha mindenki mást ért kész alatt, a Review nem tud döntést hozni.</li>
  <li><strong>Mit NEM jelent?</strong> Nem azt, hogy minden tökéletes. Azt jelenti, hogy a csapat szerint <strong>vállalható minőség</strong> és <strong>ellenőrizhető</strong>.</li>
</ul>

<hr />

<h2>DoD vs Acceptance Criteria (ne keverd)</h2>
<ul>
  <li><strong>Acceptance Criteria</strong>: az adott work itemhez tartozó elvárás („mit tudjon a felhasználó / milyen viselkedés jó”).</li>
  <li><strong>DoD</strong>: a csapat minőségi minimuma minden itemre (teszt, review, dokumentálás, deploy készség, stb.).</li>
  <li><strong>Gyors szabály:</strong> AC = „mit”; DoD = „hogyan ellenőrizhetően kész”.</li>
</ul>

<hr />

<h2>DoD v0.1 (kezdő sablon)</h2>
<p>Válassz 7–10 pontot. A cél: közös minimum, amit a csapat <strong>tényleg</strong> be tud tartani.</p>
<ol>
  <li>Van tiszta leírás (mi változik, mi a cél).</li>
  <li>Elfogadási feltételek vannak (legalább 2–3 konkrét pont).</li>
  <li>Megvan az ellenőrzés módja (kézi / automata, ki nézi, mikor).</li>
  <li>Kód review megtörtént (vagy páros munka) — minőségi check.</li>
  <li>Alap teszt lefutott (minimális smoke / unit / e2e — ami releváns).</li>
  <li>Nincs kritikus hiba és nincs „nyitva hagyott” alap kockázat.</li>
  <li>Dokumentált a változás (minimum: release note / használati megjegyzés).</li>
  <li>Deploy/kiadás szempontból vállalható (visszagörgetési terv vagy safe release mód).</li>
</ol>

<hr />

<h2>Eljárás: hogyan vezess be DoD-t úgy, hogy ne lassítson</h2>
<ol>
  <li><strong>Legyen 2 szint:</strong>
    <ul>
      <li><strong>DoD-Minimum</strong> (mindig kötelező, 7–10 pont)</li>
      <li><strong>DoD-Plusz</strong> (ha a kockázat magas / új terület / kritikus elem)</li>
    </ul>
  </li>
  <li><strong>Keveset változtass egyszerre:</strong> v0.1, majd 2 Sprint múlva felülvizsgálat.</li>
  <li><strong>Kaput ne „érzésre” tarts:</strong> ha a DoD nem teljesül, akkor az item nem „kész” — ez nem vita, hanem definíció.</li>
  <li><strong>Mérj:</strong> a DoD értéke a csökkenő visszagörgetés és csökkenő rework.</li>
</ol>

<hr />

<h2>Példák (jó vs rossz)</h2>

<h3>Példa 1: „Kész, mert működik a gépemen”</h3>
<p><strong>Rossz:</strong> nincs review, nincs teszt, nincs kockázat jelzés. A csapat csak reméli, hogy jó lesz.</p>
<p><strong>Jó:</strong> minimális teszt + review + 1 mondatos release note + rollback terv. A kimenet ellenőrizhető.</p>

<h3>Példa 2: DoD túl nehéz</h3>
<p><strong>Rossz:</strong> 35 pont, amit senki nem tart be → a DoD hitelessége elvész.</p>
<p><strong>Jó:</strong> 8 pont (kötelező), + 5 pont „plusz” kockázat esetén. A csapat vállalni tudja.</p>

<h3>Példa 3: PO nyomja a gyors kiadást</h3>
<p><strong>Rossz:</strong> a csapat „kész”-nek jelöli DoD nélkül, majd utána tűzolt.</p>
<p><strong>Jó:</strong> a döntés tiszta: vagy teljes DoD, vagy tudatosan vállalt kockázat (külön megállapodással).</p>

<hr />

<h2>Mérőpontok (hogy lásd a hatást)</h2>
<ul>
  <li><strong>Visszagörgetés</strong>: hányszor kerül vissza „kész” után a munka?</li>
  <li><strong>Rework arány</strong>: mennyi idő megy javításra ugyanarra a dologra?</li>
  <li><strong>Hibák a kiadás után</strong>: csökken-e a kritikus hibák száma?</li>
</ul>

<hr />

<h2>Akció (25 perc): DoD v0.1 megírása</h2>
<ol>
  <li>Írj 10 pontot „kész” feltételnek, majd húzd le 7–8-ra (a minimum legyen tartható).</li>
  <li>Jelölj ki 3 pontot „plusz” szabálynak (csak magas kockázat esetén).</li>
  <li>Válassz 1 mérőpontot (visszagörgetés / rework / hibák), és döntsd el, hogyan fogod rögzíteni 2 Sprintig.</li>
</ol>

<hr />

<h2>Önellenőrzés</h2>
<ul>
  <li>✅ Tudok különbséget tenni DoD és acceptance criteria között.</li>
  <li>✅ Van DoD v0.1-em (minimum + plusz).</li>
  <li>✅ Van 1 mérőpontom a hatás ellenőrzésére.</li>
</ul>

<hr />

<h2>Opcionális források</h2>
<ul>
  <li>Scrum Guide: Increment + transparency.</li>
  <li>Minőség: „build quality in” szemlélet (teszt + review + release hygiene).</li>
</ul>`;

const emailSubject = 'ScrumMaster leszek 2026 — 5. nap: Definition of Done (DoD)';

const emailBody = `<h1>{{courseName}}</h1>
<h2>{{dayNumber}}. nap: {{lessonTitle}}</h2>
<p>Ma DoD v0.1-et készítesz: minőség-kapu, ami csökkenti a visszagörgetést és a rework-öt.</p>
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

  console.log('✅ Day 05 applied');
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

