/**
 * Apply SCRUMMASTER_LESZEK_2026_HU Day 03 lesson content (backup-first).
 *
 * Usage:
 * - Dry-run:
 *   npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-03.ts
 * - Apply (DB write + backup):
 *   npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-03.ts --apply
 */

import { config } from 'dotenv';
import { resolve, join } from 'path';
import { mkdirSync, writeFileSync } from 'fs';
import mongoose from 'mongoose';

config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../app/lib/mongodb';
import { Lesson } from '../app/lib/models';

const COURSE_ID = 'SCRUMMASTER_LESZEK_2026_HU';
const LESSON_ID = 'SCRUMMASTER_LESZEK_2026_HU_DAY_03';

function hasFlag(flag: string) {
  return process.argv.includes(flag);
}

function isoStamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

const APPLY = hasFlag('--apply');

const title = 'Agile vs Scrum: mikor melyik segít, és mit mérj?';

const content = `<h1>Agile vs Scrum: mikor melyik segít, és mit mérj?</h1>
<p><em>Ma letisztázzuk a leggyakoribb tévhitet: az Agile nem „gyorsabb fejlesztés” szinonimája. Az Agile egy gondolkodásmód a bizonytalanság kezelésére; a Scrum pedig egy konkrét keret, ami segít empirikusan tanulni.</em></p>

<hr />

<h2>Napi cél (kézzelfogható)</h2>
<ul>
  <li>Készítesz egy 1 oldalas <strong>Agile-térképet</strong>: mi a cél, milyen jelzéseket figyelsz, és hol illeszkedik ehhez a Scrum.</li>
  <li>Átírsz 3 homályos mondatot <strong>ellenőrizhető szándékká</strong> (mérhető vagy legalább dönthető).</li>
  <li>Kapsz egy egyszerű <strong>mérőszám-választó</strong> keretet (mit mérj, hogy ne „Agile-színház” legyen).</li>
</ul>

<hr />

<h2>Mi az Agile (gyakorlatban)?</h2>
<p><strong>Az Agile lényege:</strong> gyors tanulás és jobb döntések bizonytalanságban. Ez akkor működik, ha a csapat rendszeresen kap <strong>valós visszajelzést</strong> és képes <strong>változtatni</strong> a terven, a munkán vagy a működésen.</p>

<h3>Három jel, hogy „Agile” irányba haladsz</h3>
<ul>
  <li><strong>Átlátható</strong>, mi kész és mi nincs (nem szépítve).</li>
  <li><strong>Rendszeresen</strong> van ellenőrzés (nem csak bemutató, hanem döntés).</li>
  <li><strong>Van alkalmazkodás</strong>: konkrét változtatások a következő időszakra.</li>
</ul>

<hr />

<h2>Mi a Scrum (és miért szeretik kezdők)?</h2>
<p>A Scrum egy konkrét keret (szerepek + események + artefaktok), ami segít abban, hogy az empirizmus ne csak szép szó legyen.</p>

<h3>Scrum akkor segít igazán, ha</h3>
<ul>
  <li>a munka <strong>komplex</strong> (sok bizonytalanság, sok érintett, sok függőség),</li>
  <li>kell egy <strong>ritmus</strong> (Sprint), hogy legyen rendszeres döntés,</li>
  <li>kell egy <strong>fókusz</strong> (Sprint Goal), hogy ne legyen minden egyszerre.</li>
</ul>

<hr />

<h2>Gyakori tévhitek (és a gyors javítás)</h2>
<ul>
  <li><strong>Tévhit:</strong> „Agile = gyorsabb.” <strong>Javítás:</strong> Agile = gyorsabb tanulás. A sebesség csak akkor jó, ha közben a minőség és a fókusz is megmarad.</li>
  <li><strong>Tévhit:</strong> „Scrum = meetingek.” <strong>Javítás:</strong> Scrum = kimenetek és döntések ritmusa. Ha nincs döntés, csak időrablás.</li>
  <li><strong>Tévhit:</strong> „Ha csináljuk a ceremóniákat, Agile-ok vagyunk.” <strong>Javítás:</strong> Ha nincs valós visszajelzés + alkalmazkodás, akkor csak Agile-színház.</li>
</ul>

<hr />

<h2>Mérőszám-választó (kezdőknek)</h2>
<p><strong>Cél:</strong> ne az aktivitást mérd, hanem a kimenetet/eredményt.</p>
<ul>
  <li><strong>Flow</strong>: lead time / cycle time (mennyi idő, míg valami elkészül).</li>
  <li><strong>Minőség</strong>: hibaarány / rework arány / visszagörgetett munka.</li>
  <li><strong>Érték</strong>: felhasználói elégedettség / konverzió / bevétel / ügyféligény teljesülés.</li>
  <li><strong>Csapat-egészség</strong>: túlóra, megszakítások, fókuszidő.</li>
</ul>

<hr />

<h2>Eljárás: 3 mondatból ellenőrizhető szándék</h2>
<ol>
  <li><strong>Mi a cél?</strong> (érték, nem tevékenység)</li>
  <li><strong>Mi lesz a jel, hogy közelebb vagyunk?</strong> (mérőszám vagy döntési szabály)</li>
  <li><strong>Mi az első kísérlet 1–2 hétre?</strong> (pici változtatás, felelős, mérés)</li>
</ol>

<hr />

<h2>Példák (jó vs rossz)</h2>

<h3>Példa 1: „Legyünk Agile-ok”</h3>
<p><strong>Rossz:</strong> „Legyünk Agile-ok, tartsunk több meetinget.”</p>
<p><strong>Jó:</strong> „2 héten belül 20%-kal csökkentjük a lead time-ot. Kísérlet: WIP limit + Daily végén 2 konkrét koordinációs döntés. Mérjük: lead time és megszakítások száma.”</p>

<h3>Példa 2: „Scrumot bevezetjük”</h3>
<p><strong>Rossz:</strong> „Mostantól minden esemény kötelező, de nem változtatunk semmin.”</p>
<p><strong>Jó:</strong> „Minden Sprint végén legyen 1 döntés a következő értékről (Review) és 1 kísérlet a működésben (Retro). Ha nincs döntés/kísérlet, álljunk meg és javítsuk a keretet.”</p>

<hr />

<h2>Akció (20 perc)</h2>
<ol>
  <li>Készíts 1 oldalas <strong>Agile-térképet</strong> (4 doboz): Cél / Jelzés / Kísérlet / Tanulság.</li>
  <li>Írd át ezt a 3 mondatot ellenőrizhetővé (vagy cseréld saját példára):
    <ul>
      <li>„Legyünk gyorsabbak.”</li>
      <li>„Legyen jobb a minőség.”</li>
      <li>„Legyen kevesebb meeting.”</li>
    </ul>
  </li>
  <li>Válassz 1 mérőszámot a flow/minőség/érték/csapat-egészség közül, és írd le: <strong>mi a küszöb</strong>, ami már javulásnak számít.</li>
</ol>

<hr />

<h2>Önellenőrzés</h2>
<ul>
  <li>✅ Tudok 1 mondatban különbséget tenni Agile (szemlélet) és Scrum (keret) között.</li>
  <li>✅ Van 3 átírt mondatom, ami ellenőrizhető (mérhető vagy dönthető).</li>
  <li>✅ Van 1 kiválasztott mérőszámom és egy kísérletem 1–2 hétre.</li>
</ul>

<hr />

<h2>Opcionális források</h2>
<ul>
  <li>Agile Manifesto: olvasd úgy, hogy „mit jelent a gyakorlatban?”.</li>
  <li>Scrum Guide: keresd a kimeneteket és a döntési pontokat.</li>
</ul>`;

const emailSubject = 'ScrumMaster leszek 2026 — 3. nap: Agile vs Scrum (mikor melyik segít?)';

const emailBody = `<h1>{{courseName}}</h1>
<h2>{{dayNumber}}. nap: {{lessonTitle}}</h2>
<p>Ma tisztán látod: az Agile szemlélet, a Scrum pedig egy keret. Kimenet: 1 oldalas Agile-térkép + 3 ellenőrizhető célmondat.</p>
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

  console.log('✅ Day 03 applied');
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

