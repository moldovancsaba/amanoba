/**
 * Apply SCRUMMASTER_LESZEK_2026_HU Day 16 lesson content (backup-first).
 *
 * Usage:
 * - Dry-run:
 *   npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-16.ts
 * - Apply (DB write + backup):
 *   npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-16.ts --apply
 */

import { config } from 'dotenv';
import { resolve, join } from 'path';
import { mkdirSync, writeFileSync } from 'fs';
import mongoose from 'mongoose';

config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../app/lib/mongodb';
import { Lesson } from '../app/lib/models';

const COURSE_ID = 'SCRUMMASTER_LESZEK_2026_HU';
const LESSON_ID = 'SCRUMMASTER_LESZEK_2026_HU_DAY_16';

function hasFlag(flag: string) {
  return process.argv.includes(flag);
}

function isoStamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

const APPLY = hasFlag('--apply');

const title = 'Metrikák kóstoló: flow + minőség + érték + egészség';

const content = `<h1>Metrikák kóstoló: flow + minőség + érték + egészség</h1>
<p><em>A metrika nem fegyver. A metrika <strong>műszerfal</strong>: segít észrevenni, mi romlik vagy javul. Scrum Masterként a cél: olyan egyszerű mutatókat választani, amik a csapatot <strong>tanulásra</strong> és <strong>javításra</strong> segítik, nem „büntetésre”.</em></p>

<hr />

<h2>Napi cél (kézzelfogható)</h2>
<ul>
  <li>Összeraksz egy <strong>4 blokkból álló metrika-műszerfalat</strong>: flow, minőség, érték, egészség.</li>
  <li>Megtanulod 6 alap fogalmat: <strong>lead time</strong>, <strong>cycle time</strong>, <strong>throughput</strong>, <strong>WIP</strong>, <strong>rework</strong>, <strong>defect escape</strong>.</li>
  <li>Kapsz egy „Goodhart-védelmet”: hogyan kerüld el, hogy a metrika tönkretegye a viselkedést.</li>
</ul>

<hr />

<h2>Flow metrikák (hogyan halad a munka?)</h2>
<ul>
  <li><strong>WIP</strong>: hány munka van egyszerre folyamatban.</li>
  <li><strong>Cycle time</strong>: mennyi idő, míg a munka „folyamatban”-ból „kész”-be kerül.</li>
  <li><strong>Lead time</strong>: mennyi idő telik el a kérés megjelenésétől a leszállításig.</li>
  <li><strong>Throughput</strong>: mennyi kész dolog születik időegység alatt.</li>
</ul>
<p><strong>Gyors jel:</strong> ha nő a WIP és nő a cycle time, valószínűleg túl sok a párhuzamosság / várakozás.</p>

<hr />

<h2>Minőség metrikák (mennyire jó a kimenet?)</h2>
<ul>
  <li><strong>Rework arány</strong>: mennyi idő megy „újra-csinálásra”.</li>
  <li><strong>Defect escape</strong>: mennyi hiba jut ki a felhasználóhoz/élesbe.</li>
  <li><strong>Stabilitás</strong>: regressziók, incidensek, visszagörgetések.</li>
</ul>
<p><strong>Gyors jel:</strong> ha nő a throughput, de nő a rework és a hibák, a rendszer „gyorsan termel hibát”.</p>

<hr />

<h2>Érték metrikák (mi változik az ügyfélnél/üzletben?)</h2>
<ul>
  <li><strong>Outcome</strong>: pl. aktiváció, konverzió, megtartás, elégedettség.</li>
  <li><strong>Adoption</strong>: használják-e az új funkciót?</li>
  <li><strong>Support load</strong>: csökken-e a ticket mennyiség / panasz?</li>
</ul>
<p><strong>Gyors jel:</strong> ha sok dolgot szállítotok, de nem változik semmi outcome, valószínűleg rossz a szeletelés vagy a probléma-keretezés.</p>

<hr />

<h2>Egészség metrikák (fenntartható-e?)</h2>
<ul>
  <li><strong>Overtime</strong> / kiégés jelzések.</li>
  <li><strong>Meeting load</strong> és megszakítások.</li>
  <li><strong>Pszichológiai biztonság</strong> (pl. safety check).</li>
</ul>

<hr />

<h2>Goodhart-védelem (hogy ne romoljon a viselkedés)</h2>
<ul>
  <li><strong>Ne köss büntetést</strong> a metrikához (különben gaming lesz).</li>
  <li><strong>Trendeket nézz</strong>, ne egyetlen számot.</li>
  <li><strong>Párosíts</strong>: flow + minőség együtt (különben a gyorsaság „megeszi” a minőséget).</li>
  <li><strong>Egyszerű</strong>: 1–2 metrika/blokk elég a kezdéshez.</li>
</ul>

<hr />

<h2>Akció (30 perc) — Metrika-műszerfal</h2>
<p>Állíts össze egy 1 oldalas műszerfalat:</p>
<ul>
  <li><strong>Flow:</strong> WIP + cycle time</li>
  <li><strong>Minőség:</strong> rework arány + defect escape</li>
  <li><strong>Érték:</strong> 1 outcome jel (pl. aktiváció)</li>
  <li><strong>Egészség:</strong> 1 jel (pl. overtime / megszakítások)</li>
</ul>
<p>Írd le: milyen döntést hoznál, ha egy jel romlik (pl. WIP nő → WIP limit).</p>

<hr />

<h2>Önellenőrzés</h2>
<ul>
  <li>✅ Tudom, mi a különbség lead time és cycle time között.</li>
  <li>✅ Tudok műszerfalat összerakni, ami nem „büntető rendszer”.</li>
  <li>✅ Tudok a metrikákból konkrét beavatkozást választani.</li>
</ul>`;

const emailSubject = 'ScrumMaster leszek 2026 — 16. nap: Metrikák (flow + minőség + érték + egészség)';

const emailBody = `<h1>{{courseName}}</h1>
<h2>{{dayNumber}}. nap: {{lessonTitle}}</h2>
<p>Ma egy egyszerű metrika-műszerfalat kapsz, amivel tanulni és javítani tud a csapat (nem büntetni).</p>
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

  console.log('✅ Day 16 applied');
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

