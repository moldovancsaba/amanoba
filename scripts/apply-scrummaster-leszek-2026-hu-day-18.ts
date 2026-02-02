/**
 * Apply SCRUMMASTER_LESZEK_2026_HU Day 18 lesson content (backup-first).
 *
 * Usage:
 * - Dry-run:
 *   npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-18.ts
 * - Apply (DB write + backup):
 *   npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-18.ts --apply
 */

import { config } from 'dotenv';
import { resolve, join } from 'path';
import { mkdirSync, writeFileSync } from 'fs';
import mongoose from 'mongoose';

config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../app/lib/mongodb';
import { Lesson } from '../app/lib/models';

const COURSE_ID = 'SCRUMMASTER_LESZEK_2026_HU';
const LESSON_ID = 'SCRUMMASTER_LESZEK_2026_HU_DAY_18';

function hasFlag(flag: string) {
  return process.argv.includes(flag);
}

function isoStamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

const APPLY = hasFlag('--apply');

const title = 'Stakeholder management: elvárások és kommunikációs cadencia';

const content = `<h1>Stakeholder management: elvárások és kommunikációs cadencia</h1>
<p><em>Stakeholder nélkül nincs érték — viszont stakeholder zajjal nincs fókusz. Scrum Masterként nem az a cél, hogy mindenki boldog legyen, hanem hogy a csapat <strong>transzparensen</strong> és <strong>megbízhatóan</strong> szállítson, miközben a stakeholder tudja: mikor, hogyan és miről kap információt.</em></p>

<hr />

<h2>Napi cél (kézzelfogható)</h2>
<ul>
  <li>Készítesz egy <strong>stakeholder térképet</strong> (befolyás × érintettség) és egy „kinek mit mondunk” listát.</li>
  <li>Összeraksz egy <strong>kommunikációs cadenciát</strong>: mikor milyen csatornán, milyen kimenettel kommunikáltok.</li>
  <li>Megtanulod az elvárás-kezelést: <strong>forecast ≠ ígéret</strong>, trade-offok transzparensen.</li>
</ul>

<hr />

<h2>Stakeholder típusok (egyszerűen)</h2>
<ul>
  <li><strong>Magas befolyás + magas érintettség</strong>: kulcs partnerek — velük rendszeres, kétirányú kommunikáció kell.</li>
  <li><strong>Magas befolyás + alacsony érintettség</strong>: szponzorok — rövid, érték- és kockázat-fókuszú update.</li>
  <li><strong>Alacsony befolyás + magas érintettség</strong>: power user — gyakori feedback csatorna.</li>
  <li><strong>Alacsony befolyás + alacsony érintettség</strong>: tájékoztatás elég.</li>
</ul>

<hr />

<h2>Kommunikációs cadencia (minta)</h2>
<ul>
  <li><strong>Heti</strong>: 1 oldalas update — „mi készült el”, „mi változott”, „kockázatok”, „következő lépés”.</li>
  <li><strong>Sprint Review</strong>: inkrementum + döntések + backlog adaptáció.</li>
  <li><strong>Ad-hoc</strong> csak vészhelyzetben: incidens / kritikus kockázat.</li>
</ul>

<hr />

<h2>Forecast vs ígéret</h2>
<p><strong>Forecast</strong> = jelenlegi tudás alapján becslés. <strong>Ígéret</strong> = fix elköteleződés. Scrum empirikus: a forecast finomodik.</p>
<ul>
  <li>Ha valaki „fix dátumot” kér: adj <strong>feltételeket</strong> és <strong>trade-offokat</strong> (mi csúszik, mi az elhagyható).</li>
  <li>Ha változik a környezet: transzparensen kommunikáld, hogy miért változik a forecast.</li>
</ul>

<hr />

<h2>Zaj csökkentése (stakeholder „pings”)</h2>
<ul>
  <li><strong>Átláthatóság</strong>: legyen egy hely, ahol látszik a státusz (pl. egyszerű board / update).</li>
  <li><strong>Időkeret</strong>: mikor van „kérdezz-felelek” ablak.</li>
  <li><strong>Egy csatorna</strong>: ne 6 külön chatben jöjjenek az igények.</li>
</ul>

<hr />

<h2>Akció (30 perc) — Stakeholder kommunikációs terv</h2>
<ol>
  <li>Írd fel 6 stakeholder nevét/típusát és tedd be a térképbe (befolyás × érintettség).</li>
  <li>Minden kulcs stakeholderhez írd le:
    <ul>
      <li>Mit akar tudni? (érték, kockázat, dátum, scope)</li>
      <li>Milyen gyakran? (heti / Sprintenként)</li>
      <li>Milyen formában? (1 oldalas update / demo / 15 perces sync)</li>
    </ul>
  </li>
  <li>Írj egy 5 mondatos update sablont (kész, változás, kockázat, következő, kérés).</li>
</ol>

<hr />

<h2>Önellenőrzés</h2>
<ul>
  <li>✅ Van stakeholder térképem és tudom, kinek mit kommunikálunk.</li>
  <li>✅ Van cadenciám, ami csökkenti az ad-hoc zajt.</li>
  <li>✅ Tudom kezelni a dátum/ígéret témát trade-offokkal és transzparenciával.</li>
</ul>`;

const emailSubject = 'ScrumMaster leszek 2026 — 18. nap: Stakeholder management (elvárás + cadencia)';

const emailBody = `<h1>{{courseName}}</h1>
<h2>{{dayNumber}}. nap: {{lessonTitle}}</h2>
<p>Ma stakeholder térképet és kommunikációs cadenciát építesz, hogy kevesebb zaj mellett több érték készüljön el.</p>
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

  console.log('✅ Day 18 applied');
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

