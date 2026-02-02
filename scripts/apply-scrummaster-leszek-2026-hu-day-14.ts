/**
 * Apply SCRUMMASTER_LESZEK_2026_HU Day 14 lesson content (backup-first).
 *
 * Usage:
 * - Dry-run:
 *   npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-14.ts
 * - Apply (DB write + backup):
 *   npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-14.ts --apply
 */

import { config } from 'dotenv';
import { resolve, join } from 'path';
import { mkdirSync, writeFileSync } from 'fs';
import mongoose from 'mongoose';

config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../app/lib/mongodb';
import { Lesson } from '../app/lib/models';

const COURSE_ID = 'SCRUMMASTER_LESZEK_2026_HU';
const LESSON_ID = 'SCRUMMASTER_LESZEK_2026_HU_DAY_14';

function hasFlag(flag: string) {
  return process.argv.includes(flag);
}

function isoStamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

const APPLY = hasFlag('--apply');

const title = 'Konfliktus mintázatok: PO vs Dev vs Stakeholder';

const content = `<h1>Konfliktus mintázatok: PO vs Dev vs Stakeholder</h1>
<p><em>Konfliktus mindig lesz. A kérdés: rombolja a bizalmat, vagy segít tisztázni a valós igényeket? Ma kapsz egy egyszerű „konfliktus-levezető” keretet, ami különösen hasznos Scrum Masterként: szerepek tisztázása, érdekalapú beszélgetés és döntési következő lépés.</em></p>

<hr />

<h2>Napi cél (kézzelfogható)</h2>
<ul>
  <li>Készítesz egy <strong>Konfliktus Triage lapot</strong>: tények, érdekek, kockázatok, opciók, döntés/next step.</li>
  <li>Megtanulod a 3 leggyakoribb konfliktus-mintát: <strong>scope vs kapacitás</strong>, <strong>minőség vs gyorsaság</strong>, <strong>prioritás vs elvárás</strong>.</li>
  <li>Kapsz 5 „mondatot”, amivel megállítod a személyeskedést és visszaviszed a beszélgetést a problémára.</li>
</ul>

<hr />

<h2>3 tipikus konfliktus-minta Scrum környezetben</h2>

<h3>1) Scope vs kapacitás (PO vs Dev)</h3>
<ul>
  <li><strong>PO</strong>: „Még ez is kell, különben nincs értelme.”</li>
  <li><strong>Dev</strong>: „Nem fér bele, túl sok a függőség/technikai kockázat.”</li>
  <li><strong>Valódi kérdés</strong>: mi a legkisebb érték-szelet, ami validálható?</li>
</ul>

<h3>2) Minőség vs gyorsaság (Stakeholder vs Dev)</h3>
<ul>
  <li><strong>Stakeholder</strong>: „Kell holnapra.”</li>
  <li><strong>Dev</strong>: „Ha most gyorsítunk, később több hiba és rework lesz.”</li>
  <li><strong>Valódi kérdés</strong>: melyik kockázat nagyobb (piaci vs technikai), és mi a minimum minőség-védelem?</li>
</ul>

<h3>3) Prioritás vs elvárás (PO vs Stakeholder)</h3>
<ul>
  <li><strong>Stakeholder</strong>: „Az én igényem legyen első.”</li>
  <li><strong>PO</strong>: „A teljes termék értéke alapján priorizálunk.”</li>
  <li><strong>Valódi kérdés</strong>: milyen érték/kockázat/hatás alapján döntünk, és mi csúszik emiatt?</li>
</ul>

<hr />

<h2>Konfliktus Triage (5 lépés, 10 perc)</h2>
<ol>
  <li><strong>Tények</strong>: mi történt konkrétan? (1–3 mondat, megfigyelhető)</li>
  <li><strong>Érdekek</strong>: mit akar valójában mindkét fél? (érték, kockázat, határidő, minőség)</li>
  <li><strong>Korlátok</strong>: kapacitás, függőség, policy, költség, határidő</li>
  <li><strong>Opciók</strong>: 2–3 valós alternatíva (slice, trade-off, kísérlet)</li>
  <li><strong>Next step</strong>: döntés most / kísérlet / owner adatot hoz + mikor visszanézzük</li>
</ol>

<hr />

<h2>Személyeskedés helyett probléma (mondatok)</h2>
<ul>
  <li>„Álljunk meg: mit <strong>figyeltünk meg</strong>, mi a tény?”</li>
  <li>„Mi a <strong>valódi kockázat</strong>, amitől félsz?”</li>
  <li>„Mi az a <strong>minimum kimenet</strong>, ami még érték?”</li>
  <li>„Melyik döntés <strong>reverzibilis</strong>, és melyik drága visszafordítani?”</li>
  <li>„Ha ezt választjuk, <strong>mi csúszik</strong>, és ki vállalja a felelősséget?”</li>
</ul>

<hr />

<h2>Akció (30 perc) — Konfliktus levezetése</h2>
<p>Helyzet: a stakeholder a Sprint közepén új „must-have” funkciót kér, a dev csapat szerint ez szétveri a fókuszt.</p>
<ol>
  <li>Töltsd ki a Konfliktus Triage lapot (tények, érdekek, korlátok).</li>
  <li>Adj 3 opciót:
    <ul>
      <li><strong>Slice</strong>: a minimum érték-szelet még ebben a Sprintben.</li>
      <li><strong>Trade-off</strong>: mi kerül ki a scope-ból.</li>
      <li><strong>Kísérlet</strong>: gyors validálás (pl. mock / demo / A-B), majd döntés.</li>
    </ul>
  </li>
  <li>Zárd le: döntés vagy next step (owner + határidő).</li>
</ol>

<hr />

<h2>Önellenőrzés</h2>
<ul>
  <li>✅ Tudok konfliktust tényekre és érdekekre bontani.</li>
  <li>✅ Tudok 2–3 reális opciót adni (slice / trade-off / kísérlet).</li>
  <li>✅ Tudok lezárni döntéssel vagy következő lépéssel.</li>
</ul>

<hr />

<h2>Opcionális források</h2>
<ul>
  <li>Érdek-alapú tárgyalás (win-win) alapok.</li>
  <li>Reverzibilis döntések: gyors iteráció vs nagy, drága elköteleződés.</li>
</ul>`;

const emailSubject = 'ScrumMaster leszek 2026 — 14. nap: Konfliktusok kezelése (érdek + opciók)';

const emailBody = `<h1>{{courseName}}</h1>
<h2>{{dayNumber}}. nap: {{lessonTitle}}</h2>
<p>Ma egy konfliktus-triage keretet kapsz, amivel PO–Dev–Stakeholder vitákból döntés és next step lesz.</p>
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

  console.log('✅ Day 14 applied');
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

