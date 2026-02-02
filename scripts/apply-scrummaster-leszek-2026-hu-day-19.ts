/**
 * Apply SCRUMMASTER_LESZEK_2026_HU Day 19 lesson content (backup-first).
 *
 * Usage:
 * - Dry-run:
 *   npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-19.ts
 * - Apply (DB write + backup):
 *   npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-19.ts --apply
 */

import { config } from 'dotenv';
import { resolve, join } from 'path';
import { mkdirSync, writeFileSync } from 'fs';
import mongoose from 'mongoose';

config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../app/lib/mongodb';
import { Lesson } from '../app/lib/models';

const COURSE_ID = 'SCRUMMASTER_LESZEK_2026_HU';
const LESSON_ID = 'SCRUMMASTER_LESZEK_2026_HU_DAY_19';

function hasFlag(flag: string) {
  return process.argv.includes(flag);
}

function isoStamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

const APPLY = hasFlag('--apply');

const title = 'Change management: új szokás 2 hetes kísérletként';

const content = `<h1>Change management: új szokás 2 hetes kísérletként</h1>
<p><em>Scrum Masterként rengeteg jó ötleted lesz: WIP limit, DoD, fókusz idősáv, jobb Daily, jobb retro. A valóságban a nehéz rész nem az ötlet, hanem a <strong>bevezetés</strong>. Ma kapsz egy egyszerű, kezdőbarát keretet: hogyan vezetsz be új szokást <strong>2 hetes kísérletként</strong>, ellenállás mellett is.</em></p>

<hr />

<h2>Napi cél (kézzelfogható)</h2>
<ul>
  <li>Készítesz egy <strong>2 hetes szokás-kísérlet tervet</strong>: miért, mit, hogyan, mérés, védőkorlát, stop/continue.</li>
  <li>Megtanulod az ellenállás 3 formáját és a válaszokat: <strong>félelem</strong>, <strong>szkepszis</strong>, <strong>szokás</strong>.</li>
  <li>Kapsz egy egyszerű „kommszöveget”: hogyan kommunikáld úgy, hogy ne parancsnak, hanem közös kísérletnek hasson.</li>
</ul>

<hr />

<h2>Miért buknak el a változtatások?</h2>
<ul>
  <li>Túl nagy változás egyszerre („mindent átállítunk”).</li>
  <li>Nincs világos <strong>miért</strong> (milyen problémát oldunk meg?).</li>
  <li>Nincs <strong>mérés</strong> és nincs felülvizsgálat (nem derül ki, működik-e).</li>
  <li>Rejtett félelem: „ha ez bejön, több munkát kapok / kevesebb kontrollom lesz / látszani fog a probléma”.</li>
</ul>

<hr />

<h2>Az új szokás bevezetése mint kísérlet</h2>
<p><strong>Szabály:</strong> nem „örökre bevezetjük”, hanem „2 hétig kipróbáljuk és tanulunk”.</p>

<h3>2 hetes kísérlet sablon</h3>
<ul>
  <li><strong>Probléma</strong>: mi fáj most? (tünet + hatás)</li>
  <li><strong>Hipotézis</strong>: „Ha X-et csinálunk, Y javul, mert…”</li>
  <li><strong>Szokás / szabály</strong>: 1 konkrét viselkedés (pl. 1 munka/fő WIP limit)</li>
  <li><strong>Mérés</strong>: 1–2 jel (pl. félkész elemek száma, cycle time, megszakítások/nap)</li>
  <li><strong>Védőkorlát</strong>: mi az, amit nem áldozunk fel (minőség, biztonság, ügyfél impact)</li>
  <li><strong>Cadencia</strong>: mikor nézzük meg? (1 hét mini-check + 2 hét döntés)</li>
  <li><strong>Stop/continue</strong>: mitől állítjuk le, mitől tartjuk meg?</li>
</ul>

<hr />

<h2>Ellenállás kezelése (3 minta)</h2>
<h3>1) Félelem</h3>
<ul>
  <li>Jel: „Ez veszélyes / túl nagy / mi lesz, ha…”</li>
  <li>Válasz: védőkorlát + kis hatókör + visszafordíthatóság.</li>
</ul>

<h3>2) Szkepszis</h3>
<ul>
  <li>Jel: „Úgysem működik / már próbáltuk.”</li>
  <li>Válasz: pontos hipotézis + mérés + időbox (nem hitvita, hanem teszt).</li>
</ul>

<h3>3) Szokás (inercia)</h3>
<ul>
  <li>Jel: „Mindig így csináltuk.”</li>
  <li>Válasz: 1 apró változás + emlékeztető + gyors visszajelzés, hogy látszódjon a nyereség.</li>
</ul>

<hr />

<h2>Kommunikáció (5 mondatos minta)</h2>
<ol>
  <li>„A mostani problémánk: <strong>X</strong> (tünet) → <strong>Y</strong> (hatás).”</li>
  <li>„Javaslat: 2 hétig kipróbálunk egy szokást: <strong>Z</strong>.”</li>
  <li>„Mérni fogjuk: <strong>M1</strong>, <strong>M2</strong>.”</li>
  <li>„Védőkorlát: <strong>V</strong> (ha sérül, leállítjuk).”</li>
  <li>„2 hét múlva döntünk: megtartjuk / módosítjuk / elengedjük.”</li>
</ol>

<hr />

<h2>Akció (35 perc) — 2 hetes szokás-kísérlet terv</h2>
<p>Válassz 1 szokást a csapatodhoz:</p>
<ul>
  <li>WIP limit (1 munka/fő + finish-first)</li>
  <li>Definition of Done szigorítás (minőség védőkorlát)</li>
  <li>Fókusz idősáv (meeting-mentes blokkok)</li>
</ul>
<ol>
  <li>Írd le a problémát és a hipotézist.</li>
  <li>Írd le a konkrét szabályt (mit csináltok másképp holnaptól?).</li>
  <li>Válassz 2 mérést és 1 védőkorlátot.</li>
  <li>Írd meg a 5 mondatos kommunikációt (csapat + stakeholder).</li>
</ol>

<hr />

<h2>Önellenőrzés</h2>
<ul>
  <li>✅ Van 2 hetes kísérlet tervem mérőpontokkal és védőkorláttal.</li>
  <li>✅ Tudom kezelni az ellenállást (félelem/szkepszis/szokás).</li>
  <li>✅ Van döntési pont: stop/continue 2 hét után.</li>
</ul>`;

const emailSubject = 'ScrumMaster leszek 2026 — 19. nap: Change management (2 hetes szokás-kísérlet)';

const emailBody = `<h1>{{courseName}}</h1>
<h2>{{dayNumber}}. nap: {{lessonTitle}}</h2>
<p>Ma megtanulod, hogyan vezess be új szokást 2 hetes kísérletként: mérés, védőkorlát, ellenállás kezelése.</p>
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

  console.log('✅ Day 19 applied');
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

