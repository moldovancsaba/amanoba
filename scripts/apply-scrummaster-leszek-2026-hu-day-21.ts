/**
 * Apply SCRUMMASTER_LESZEK_2026_HU Day 21 lesson content (backup-first).
 *
 * Usage:
 * - Dry-run:
 *   npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-21.ts
 * - Apply (DB write + backup):
 *   npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-21.ts --apply
 */

import { config } from 'dotenv';
import { resolve, join } from 'path';
import { mkdirSync, writeFileSync } from 'fs';
import mongoose from 'mongoose';

config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../app/lib/mongodb';
import { Lesson } from '../app/lib/models';

const COURSE_ID = 'SCRUMMASTER_LESZEK_2026_HU';
const LESSON_ID = 'SCRUMMASTER_LESZEK_2026_HU_DAY_21';

function hasFlag(flag: string) {
  return process.argv.includes(flag);
}

function isoStamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

const APPLY = hasFlag('--apply');

const title = 'Skálázás kóstoló: mikor segít és mikor árt?';

const content = `<h1>Skálázás kóstoló: mikor segít és mikor árt?</h1>
<p><em>„Nagy a cég → kell SAFe.” Ez gyakori tévhit. A skálázás keretrendszerek (pl. SAFe, LeSS) nem varázspálcák: ha rossz problémára alkalmazod, több meetinget és több koordinációs költséget kapsz. Ma nem mély merülés: kapsz egy kezdőbarát keretet, amivel felismered, mikor van tényleg skálázási problémád, és mi az első lépés.</em></p>

<hr />

<h2>Napi cél (kézzelfogható)</h2>
<ul>
  <li>Készítesz egy <strong>„skálázás jelzők” listát</strong> (tünetek + első beavatkozás).</li>
  <li>Megtanulod megkülönböztetni: skálázás-probléma vs <strong>fókusz/WIP</strong> probléma.</li>
  <li>Kapsz egy 2 scenarió döntési keretet: „kell-e skálázás, vagy elég a rendszer alapjait rendbe tenni?”</li>
</ul>

<hr />

<h2>Mikor tűnik „skálázásnak”, de nem az?</h2>
<ul>
  <li>Túl sok párhuzamos munka (WIP magas) → valójában flow probléma.</li>
  <li>Nincs tiszta prioritás → PO/backlog probléma.</li>
  <li>Sok félkész munka → szeletelés és befejezés fókusz hiánya.</li>
  <li>Meeting-áradat → rossz keretek és döntésnapló hiánya.</li>
</ul>

<hr />

<h2>Skálázás jelzők (tünet → első lépés)</h2>
<ul>
  <li><strong>Erős cross-team függőségek</strong> (minden feature 3–5 csapatot érint) → térképezd a függőségeket és szeletelj vertikálisan.</li>
  <li><strong>Integrációs fájdalom</strong> (összeolvasztás a végén, sok konfliktus/hiba) → CI/CD és integrációs gyakorlatok erősítése.</li>
  <li><strong>Koordinációs torlódás</strong> (minden döntés 1 emberen akad) → döntési jogkörök tisztázása, decision log.</li>
  <li><strong>Termék-irány hiány</strong> (10 stakeholder 10 irány) → termékcélok és priorizálási keret tisztázása.</li>
  <li><strong>Egységes release kényszer</strong> (mindenki egyszerre deployol) → release decoupling, kisebb batch.</li>
</ul>

<hr />

<h2>„Első lépés” szabály</h2>
<p>Skálázás előtt tedd rendbe az alapokat:</p>
<ul>
  <li>Fókusz: WIP limit + finish-first</li>
  <li>Transzparencia: döntésnapló + backlog SSOT</li>
  <li>Minőség: integráció és teszt alapok</li>
</ul>

<hr />

<h2>Akció (30 perc) — Döntés két scenarióval</h2>
<ol>
  <li><strong>Scenario A</strong>: 4 csapat, de a backlog kaotikus és mindenki mást csinál. Döntsd el: skálázás kell, vagy alapok?</li>
  <li><strong>Scenario B</strong>: 8 csapat, minden érték-szelet 4 csapatot érint, és az integráció a Sprint végén összeomlik. Döntsd el: mi az első lépés?</li>
</ol>
<p>Mindkettőhöz írd le: tünet → ok → első beavatkozás (nem keretrendszer neve, hanem konkrét lépés).</p>

<hr />

<h2>Önellenőrzés</h2>
<ul>
  <li>✅ Felismerem, mikor „skálázás” címkével fednek el alap-problémákat.</li>
  <li>✅ Tudok jelzőlistát és első beavatkozást adni.</li>
  <li>✅ Tudok vezetői kérésre (pl. „legyen SAFe”) értelmes diagnózist javasolni.</li>
</ul>`;

const emailSubject = 'ScrumMaster leszek 2026 — 21. nap: Skálázás kóstoló (mikor segít vs mikor árt)';

const emailBody = `<h1>{{courseName}}</h1>
<h2>{{dayNumber}}. nap: {{lessonTitle}}</h2>
<p>Ma egy diagnózis-keretet kapsz skálázás témában: mikor probléma valójában a fókusz/prioritás, és mi az első lépés.</p>
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

  console.log('✅ Day 21 applied');
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

