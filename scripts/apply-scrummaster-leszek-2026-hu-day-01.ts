/**
 * Apply SCRUMMASTER_LESZEK_2026_HU Day 01 lesson content (backup-first).
 *
 * Usage:
 * - Dry-run:
 *   npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-01.ts
 * - Apply (DB write + backup):
 *   npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-01.ts --apply
 */

import { config } from 'dotenv';
import { resolve, join } from 'path';
import { mkdirSync, writeFileSync } from 'fs';
import mongoose from 'mongoose';

config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../app/lib/mongodb';
import { Lesson } from '../app/lib/models';

const COURSE_ID = 'SCRUMMASTER_LESZEK_2026_HU';
const LESSON_ID = 'SCRUMMASTER_LESZEK_2026_HU_DAY_01';

function hasFlag(flag: string) {
  return process.argv.includes(flag);
}

function isoStamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

const APPLY = hasFlag('--apply');

const title = 'Scrum Master 2026: szerep, határok, impact';

const content = `<h1>Scrum Master 2026: szerep, határok, impact</h1>
<p><em>Ma kapsz egy tiszta „szerep-kártyát”, hogy tudd: mit csinál a Scrum Master a gyakorlatban, és mit NEM. Ez megvéd a leggyakoribb kezdő hibáktól.</em></p>

<hr />

<h2>Napi cél (kézzelfogható)</h2>
<ul>
  <li>Megérted a Scrum Master szerep lényegét: <strong>rendszert és működést javítasz</strong>, nem „főnökösködsz”.</li>
  <li>Elkészítesz egy 1 oldalas <strong>Scrum Master szerep-kártyát</strong> (felelősségek + tiltott szerep-keverések).</li>
  <li>Megtanulsz 3 mondatot, amivel <strong>határt tartasz</strong> (PO / vezető / csapat helyzetekben) úgy, hogy közben segítesz.</li>
</ul>

<hr />

<h2>Miért fontos ez neked?</h2>
<ul>
  <li><strong>A legtöbb kezdő Scrum Master nem azért bukik el, mert nem tudja a definíciókat</strong>, hanem mert rossz szerepet vesz fel: projektmenedzser, meeting-szervező, „rendőr”.</li>
  <li>Ha nem tartod a határokat, a csapat tulajdonlása elolvad: minden döntést rád tolnak.</li>
  <li>Ha jól csinálod, gyorsan látszik az impact: tisztább meetingek, kevesebb felesleges vita, több fókusz, jobb minőség.</li>
</ul>

<hr />

<h2>Gyors fogalomtisztázás (kezdőknek, praktikus)</h2>
<ul>
  <li><strong>Agile</strong>: gondolkodásmód a bizonytalanság kezelésére (tanulás, visszacsatolás, alkalmazkodás).</li>
  <li><strong>Scrum</strong>: keretrendszer komplex problémákra: szerepek + események + artefaktok.</li>
  <li><strong>Empirizmus</strong>: <strong>átláthatóság → ellenőrzés → alkalmazkodás</strong>. Ha nem látod a valóságot, nem tudsz javítani.</li>
  <li><strong>Scrum Master</strong>: olyan szerep, aki <strong>segíti a rendszert működni</strong>: coachol, facilitál, akadályokat bont, védi a fókuszt.</li>
</ul>

<hr />

<h2>A Scrum Master 3 fő felelőssége (amit ma megjegyzel)</h2>
<ol>
  <li><strong>Facilitáció</strong>: meetingeknek legyen célja, outputja, döntési szabálya.</li>
  <li><strong>Coaching</strong>: kérdésekkel képességet építesz, nem „megoldást adsz” helyettük.</li>
  <li><strong>Rendszer-javítás</strong>: a csapat működése (szokások, szabályok, DoD, WIP, visszacsatolás) legyen stabil.</li>
</ol>

<hr />

<h2>A legfontosabb határ: mit NEM csinálsz Scrum Masterként</h2>
<ul>
  <li><strong>Nem te priorizálsz.</strong> (Ez a Product Owner döntési felelőssége.)</li>
  <li><strong>Nem te döntöd el a technikai megoldást.</strong> (Ez a fejlesztők felelőssége.)</li>
  <li><strong>Nem te vagy a státusz-riporter.</strong> (A rendszer adja a transzparenciát, nem a te prezentációd.)</li>
  <li><strong>Nem te vagy a „rendőr”.</strong> (A cél outcome és tanulás, nem szabály-fetisizmus.)</li>
</ul>

<hr />

<h2>Gyakorlati eljárás: „Határ + segítség” (3 lépés)</h2>
<p><strong>Cél:</strong> nemet mondasz a rossz szerepre, de azonnal adsz egy jobb utat.</p>
<ol>
  <li><strong>Nevezd meg a kérést</strong> (tényszerűen).</li>
  <li><strong>Tisztázd a tulajdonlást</strong> (kié a döntés / felelősség).</li>
  <li><strong>Adj egy következő lépést</strong> (agenda, kérdéslista, döntési szabály, mini workshop).</li>
</ol>

<h3>3 kész mondat (másold ki)</h3>
<ul>
  <li><strong>PO helyzet:</strong> „A prioritás a te döntésed. Amit én tudok adni: egy 20 perces döntési keret, hogy tisztán lássuk az opciókat és a kockázatokat.”</li>
  <li><strong>Vezető helyzet:</strong> „A Daily nem státusz-meeting. Ha státuszt szeretnél, csináljunk külön 10 perces összefoglalót. A Daily-t megvédem a csapat fókusza miatt.”</li>
  <li><strong>Csapat helyzet:</strong> „Nem én döntöm el helyettetek. Viszont segítek: fogalmazzuk meg a döntési szempontokat, és ha nincs adat, csináljunk 1 hetes kísérletet mérőszámmal.”</li>
</ul>

<hr />

<h2>Példák (valós helyzetek 2026-ban)</h2>

<h3>1) „Légy projektmenedzser” nyomás</h3>
<p><strong>Helyzet:</strong> valaki azt kéri, hogy te oszd ki a feladatokat és kérd számon.</p>
<p><strong>Jó válasz:</strong> visszaviszed a tulajdonlást a csapathoz (vizuális tábla, WIP szabály, következő lépés), és te a rendszert javítod.</p>

<h3>2) „A Daily túl hosszú és semmi nem dől el”</h3>
<p><strong>Helyzet:</strong> 20–30 perces körbemondás, nincs akadály-kezelés.</p>
<p><strong>Jó válasz:</strong> bevezetsz 10 perces timeboxot + akadály-first struktúrát + 1–3 napi koordinációs döntést.</p>

<h3>3) „A csapat rád tolja a technikai döntést”</h3>
<p><strong>Helyzet:</strong> „Te mondd meg, melyik megoldás a jó.”</p>
<p><strong>Jó válasz:</strong> döntési keret + kísérlet: kritériumok, kockázat, mérés, review dátum.</p>

<hr />

<h2>Akció (15–20 perc)</h2>
<ol>
  <li>Készíts egy 1 oldalas <strong>Scrum Master szerep-kártyát</strong> 2 oszloppal:
    <ul>
      <li><strong>Mit csinálok</strong> (facilitáció / coaching / rendszer)</li>
      <li><strong>Mit nem csinálok</strong> (priorizálás / tech döntés / státusz-riport)</li>
    </ul>
  </li>
  <li>Írd le a fenti 3 mondatot a saját szavaiddal, hogy természetesen hangozzon magyarul.</li>
  <li>Válassz ki <strong>1</strong> tipikus helyzetet a saját környezetedből (munka/iskola/saját projekt), és írd le: mi lenne a „határ + segítség” következő lépése.</li>
</ol>

<hr />

<h2>Önellenőrzés</h2>
<ul>
  <li>✅ Tudok 1 mondatban válaszolni: „Mit csinál a Scrum Master?”</li>
  <li>✅ Van kész szerep-kártyám (mit igen / mit nem).</li>
  <li>✅ Van 1 konkrét mondatom PO-ra, vezetőre, csapatra.</li>
</ul>

<hr />

<h2>Opcionális források</h2>
<ul>
  <li>Scrum Guide (hivatalos): olvasd át a szerepek és események részt, és jelöld be, mi volt új.</li>
  <li>Coaching Agile Teams (Lyssa Adkins): „coach vs solve” szemlélet (kóstoló).</li>
</ul>`;

const emailSubject = 'ScrumMaster leszek 2026 — 1. nap: Szerep, határok, impact';

const emailBody = `<h1>{{courseName}}</h1>
<h2>{{dayNumber}}. nap: {{lessonTitle}}</h2>
<p>Ma kapsz egy tiszta „szerep-kártyát”, hogy tudd: mit csinál a Scrum Master, és mit nem.</p>
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

  console.log('✅ Day 01 applied');
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
