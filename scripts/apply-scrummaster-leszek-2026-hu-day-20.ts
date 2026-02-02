/**
 * Apply SCRUMMASTER_LESZEK_2026_HU Day 20 lesson content (backup-first).
 *
 * Usage:
 * - Dry-run:
 *   npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-20.ts
 * - Apply (DB write + backup):
 *   npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-20.ts --apply
 */

import { config } from 'dotenv';
import { resolve, join } from 'path';
import { mkdirSync, writeFileSync } from 'fs';
import mongoose from 'mongoose';

config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../app/lib/mongodb';
import { Lesson } from '../app/lib/models';

const COURSE_ID = 'SCRUMMASTER_LESZEK_2026_HU';
const LESSON_ID = 'SCRUMMASTER_LESZEK_2026_HU_DAY_20';

function hasFlag(flag: string) {
  return process.argv.includes(flag);
}

function isoStamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

const APPLY = hasFlag('--apply');

const title = 'Remote/hybrid Scrum: fókusz és meeting-higiénia';

const content = `<h1>Remote/hybrid Scrum: fókusz és meeting-higiénia</h1>
<p><em>Remote/hybrid környezetben a Scrum könnyen „meeting-folyammá” válik, ahol mindenki fáradt, de kevesebb készül el. Ma kapsz egy egyszerű, gyakorlatias keretet: hogyan legyenek rövidek, hasznosak a meetingek, és hogyan védd a csapat fókuszát távoli munkában.</em></p>

<hr />

<h2>Napi cél (kézzelfogható)</h2>
<ul>
  <li>Készítesz egy <strong>remote meeting szabályrendszert</strong> (kamera/mikrofon/chat, döntések, facilitáció).</li>
  <li>Összeraksz egy <strong>tool etikettet</strong>: hol jön a kérés, hol a státusz, hol a döntés.</li>
  <li>Újratervezel egy remote <strong>Daily</strong>-t: kevesebb státusz, több döntés és akadály-feloldás.</li>
</ul>

<hr />

<h2>Mi romlik el remote-ban a leggyakrabban?</h2>
<ul>
  <li><strong>Rejtett multitasking</strong>: látszólag jelen vannak, valójában párhuzamosan dolgoznak.</li>
  <li><strong>Késleltetett visszajelzés</strong>: nincs „folyosói” tisztázás, nő a félreértés.</li>
  <li><strong>Chat-zaj</strong>: ad-hoc megszakítások és csatorna-szétcsúszás.</li>
  <li><strong>Meeting-hossz</strong>: a beszélgetés „kifolyik”, nincs timebox és lezárás.</li>
</ul>

<hr />

<h2>Remote meeting szabályok (egyszerű, kezdőbarát)</h2>
<ul>
  <li><strong>Outcome a meghívóban</strong>: mi a kézzelfogható kimenet (döntés, lista, terv)?</li>
  <li><strong>Timebox</strong>: a meeting időkerete és a témák időkerete is legyen látható.</li>
  <li><strong>Single-thread</strong>: egyszerre egy beszélgetés (nem 3 thread a chatben + hangban).</li>
  <li><strong>Facilitátor</strong>: valaki figyel a sorrendre, bevonásra, lezárásra.</li>
  <li><strong>Döntésnapló</strong>: döntés + owner + határidő + „mi változik emiatt?”</li>
</ul>

<hr />

<h2>Tool etikett (hogy ne legyen káosz)</h2>
<ul>
  <li><strong>Igények</strong>: egy helyen (pl. ticket/backlog), nem 6 chatben.</li>
  <li><strong>Státusz</strong>: aszinkron update (pl. napi rövid board frissítés).</li>
  <li><strong>Döntések</strong>: döntésnapló / döntési thread (később visszakereshető).</li>
  <li><strong>Megszakítások</strong>: „urgent” csatorna csak valóban sürgősre (egyértelmű definícióval).</li>
</ul>

<hr />

<h2>Remote Daily redesign (minta, 12 perc)</h2>
<ol>
  <li><strong>1 perc</strong> — Sprint Goal / fókusz emlékeztető.</li>
  <li><strong>8 perc</strong> — Flow kérdések:
    <ul>
      <li>Mi blokkolja a befejezést?</li>
      <li>Hol túl magas a WIP?</li>
      <li>Mi a legjobb következő lépés ma?</li>
    </ul>
  </li>
  <li><strong>3 perc</strong> — Döntések + next step (owner, határidő).</li>
</ol>

<hr />

<h2>Akció (30 perc) — Remote meeting charter</h2>
<ol>
  <li>Írj 8 szabályt a meetingekhez (outcome, timebox, döntésnapló, single-thread).</li>
  <li>Írj 5 tool szabályt (hol kérés, hol státusz, hol döntés, mikor urgent).</li>
  <li>Írd meg a remote Daily új menetét 12 percre (3 lépés + kérdések).</li>
</ol>

<hr />

<h2>Önellenőrzés</h2>
<ul>
  <li>✅ Van remote meeting szabályrendszerem és döntésnaplóm.</li>
  <li>✅ Van tool etikett, ami csökkenti a chat-zajt.</li>
  <li>✅ A Daily-t flow és döntés felé vittem, nem státusz felé.</li>
</ul>`;

const emailSubject = 'ScrumMaster leszek 2026 — 20. nap: Remote/hybrid Scrum (fókusz + meeting-higiénia)';

const emailBody = `<h1>{{courseName}}</h1>
<h2>{{dayNumber}}. nap: {{lessonTitle}}</h2>
<p>Ma remote meeting szabályokat és tool etikettet építesz, hogy kevesebb zaj mellett több készülhessen el.</p>
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

  console.log('✅ Day 20 applied');
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

