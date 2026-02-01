/**
 * Apply SCRUMMASTER_LESZEK_2026_HU Day 11 lesson content (backup-first).
 *
 * Usage:
 * - Dry-run:
 *   npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-11.ts
 * - Apply (DB write + backup):
 *   npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-11.ts --apply
 */

import { config } from 'dotenv';
import { resolve, join } from 'path';
import { mkdirSync, writeFileSync } from 'fs';
import mongoose from 'mongoose';

config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../app/lib/mongodb';
import { Lesson } from '../app/lib/models';

const COURSE_ID = 'SCRUMMASTER_LESZEK_2026_HU';
const LESSON_ID = 'SCRUMMASTER_LESZEK_2026_HU_DAY_11';

function hasFlag(flag: string) {
  return process.argv.includes(flag);
}

function isoStamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

const APPLY = hasFlag('--apply');

const title = 'Facilitáció alapok: outcome, timebox, döntési szabály';

const content = `<h1>Facilitáció alapok: outcome, timebox, döntési szabály</h1>
<p><em>Ma kapsz egy egyszerű eszköztárat, amivel egy meetinget „tartalom” helyett <strong>kimenet</strong> felé vezetsz. A Scrum Master gyakran nem a megoldást adja, hanem a <strong>kereteket</strong>, amikben a csapat jó döntést tud hozni.</em></p>

<hr />

<h2>Napi cél (kézzelfogható)</h2>
<ul>
  <li>Összeraksz egy 1 oldalas <strong>Facilitációs Brief</strong> sablont (cél → outcome → agenda → döntés → következő lépések).</li>
  <li>Megtanulsz 3 „vészhelyzeti” beavatkozást: <strong>clarify</strong>, <strong>timebox</strong>, <strong>decision rule</strong>.</li>
  <li>Tudni fogod, hogyan kezeld a domináns hangot és a csendet úgy, hogy a csapat gondolkodjon.</li>
</ul>

<hr />

<h2>A facilitátor szerepe (röviden)</h2>
<ul>
  <li><strong>Nem tartalom-szakértő</strong> (nem ő dönt helyettetek).</li>
  <li><strong>Folyamat-gazda</strong>: a beszélgetés minőségéért felel (cél, idő, szabályok, döntés).</li>
  <li><strong>Semlegesség</strong>: a kereteket tartja, és a csapatot segíti a saját döntéséhez.</li>
</ul>

<hr />

<h2>1) Outcome: mit akarunk a végére?</h2>
<p>Az outcome nem téma. Az outcome <strong>kimenet</strong>.</p>
<ul>
  <li><strong>Gyenge:</strong> „Beszéljünk a release-ről.”</li>
  <li><strong>Erős:</strong> „A meeting végére van egy elfogadott release-terv (mi, mikor, kockázatok, owner).”</li>
</ul>

<h3>Outcome-prompt (30 másodperc)</h3>
<ul>
  <li>„Mi legyen a meeting végén <strong>kézzelfogható</strong>?”</li>
  <li>„Mi az a döntés vagy dokumentum, ami nélkül nem éri meg folytatni?”</li>
</ul>

<hr />

<h2>2) Timebox: az idő a minőség védelme</h2>
<p>A timebox nem „szigor”, hanem fókusz. Az időkeret segít, hogy a csapat ne körözzön.</p>
<ul>
  <li><strong>Mini-timebox</strong>: 2–5 perc egy témára, utána döntés: folytatjuk / parkoljuk / owner viszi tovább.</li>
  <li><strong>Parking lot</strong>: külön lista a fontos, de most nem megoldható témáknak.</li>
</ul>

<h3>Hasznos mondatok</h3>
<ul>
  <li>„Két perc: mi a legjobb következő lépés?”</li>
  <li>„Ha nincs döntés, parkoljuk és jelöljünk ki ownt + határidőt.”</li>
  <li>„Ha 10 perc után nincs közeledés, változtatunk a módszeren (pl. néma írás).”</li>
</ul>

<hr />

<h2>3) Döntési szabály: hogyan születik döntés?</h2>
<p>A vita gyakran azért végtelen, mert nem tiszta, <strong>mi számít döntésnek</strong>.</p>
<ul>
  <li><strong>Owner dönt</strong>: valaki felel, kikéri a véleményeket, majd dönt (gyors).</li>
  <li><strong>Többségi szavazás</strong>: gyors, de lehet kisebbségi ellenállás.</li>
  <li><strong>Konszenzus</strong>: erős elköteleződés, de drága időben.</li>
  <li><strong>Consent (nincs „megalapozott kifogás”)</strong>: nem a tökéletes megoldást keressük, hanem a biztonságosan kipróbálhatót.</li>
</ul>

<h3>Döntés-nyelv (zárás)</h3>
<ul>
  <li><strong>Döntés:</strong> mit csinálunk?</li>
  <li><strong>Owner:</strong> ki viszi?</li>
  <li><strong>Határidő:</strong> mikor ellenőrizzük?</li>
  <li><strong>Siker kritérium:</strong> honnan tudjuk, hogy jobb lett?</li>
</ul>

<hr />

<h2>Domináns hang és csend kezelése</h2>
<h3>Ha valaki elnyomja a többieket</h3>
<ul>
  <li>Válts <strong>körkérdésre</strong>: „Mindenki 30 másodperc: mi a legnagyobb kockázat?”</li>
  <li>Használj <strong>néma írást</strong> (2–3 perc), majd körben felolvasás.</li>
  <li>Tedd láthatóvá a keretet: „Most információgyűjtés, nem vita.”</li>
</ul>

<h3>Ha csend van</h3>
<ul>
  <li>Adj választási lehetőséget: „1 perc néma gondolkodás, majd 1 mondat/fő.”</li>
  <li>Kérj konkrétumot: „Mi hiányzik a döntéshez? adat, példa, kockázat?”</li>
  <li>Ha nincs elég információ: „Owner gyűjt adatot és visszahozza holnapig.”</li>
</ul>

<hr />

<h2>Akció (25 perc) — Facilitációs Brief</h2>
<p>Írj egy 1 oldalas briefet egy 30 perces csapatbeszélgetéshez „Sok a megszakítás, hogyan védjük a fókuszt?” témában:</p>
<ol>
  <li><strong>Outcome:</strong> a végére legyen egy kipróbálható szabály + mérés (1 hét).</li>
  <li><strong>Agenda (timebox):</strong> 5 perc helyzetkép, 10 perc ötletek (néma írás), 10 perc döntés, 5 perc next steps.</li>
  <li><strong>Döntési szabály:</strong> consent (nincs megalapozott kifogás) + 1 hetes kísérlet.</li>
  <li><strong>Lezárás:</strong> döntés + owner + határidő + siker kritérium.</li>
</ol>

<hr />

<h2>Önellenőrzés</h2>
<ul>
  <li>✅ Tudom megfogalmazni az outcome-ot témák helyett.</li>
  <li>✅ Tudok timeboxot és parking lotot használni.</li>
  <li>✅ Tudok választani döntési szabályt és lezárni döntéssel + ownerrel.</li>
</ul>

<hr />

<h2>Opcionális források</h2>
<ul>
  <li>Liberating Structures (válogatott facilitation minták).</li>
  <li>Consent döntés (sociocracy alapok) — gyors, biztonságos kísérletekhez.</li>
</ul>`;

const emailSubject = 'ScrumMaster leszek 2026 — 11. nap: Facilitáció alapok (outcome + timebox + döntés)';

const emailBody = `<h1>{{courseName}}</h1>
<h2>{{dayNumber}}. nap: {{lessonTitle}}</h2>
<p>Ma megtanulod, hogyan vezethetsz megbeszélést outcome felé: timebox, döntési szabály, lezárás.</p>
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

  console.log('✅ Day 11 applied');
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

