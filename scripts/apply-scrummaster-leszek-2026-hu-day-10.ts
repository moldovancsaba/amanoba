/**
 * Apply SCRUMMASTER_LESZEK_2026_HU Day 10 lesson content (backup-first).
 *
 * Usage:
 * - Dry-run:
 *   npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-10.ts
 * - Apply (DB write + backup):
 *   npx tsx --env-file=.env.local scripts/apply-scrummaster-leszek-2026-hu-day-10.ts --apply
 */

import { config } from 'dotenv';
import { resolve, join } from 'path';
import { mkdirSync, writeFileSync } from 'fs';
import mongoose from 'mongoose';

config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../app/lib/mongodb';
import { Lesson } from '../app/lib/models';

const COURSE_ID = 'SCRUMMASTER_LESZEK_2026_HU';
const LESSON_ID = 'SCRUMMASTER_LESZEK_2026_HU_DAY_10';

function hasFlag(flag: string) {
  return process.argv.includes(flag);
}

function isoStamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

const APPLY = hasFlag('--apply');

const title = 'WIP és fókusz: miért öl a párhuzamosság?';

const content = `<h1>WIP és fókusz: miért öl a párhuzamosság?</h1>
<p><em>Ma azt érted meg, miért romlik a flow, ha mindenki egyszerre 5 dolgon dolgozik. A cél nem az, hogy „többet csináljunk”, hanem hogy többet <strong>befejezzünk</strong>. Ez a Scrum Master egyik legnagyobb hatású beavatkozási területe.</em></p>

<hr />

<h2>Napi cél (kézzelfogható)</h2>
<ul>
  <li>Beállítasz 1 <strong>WIP-szabályt</strong> (maximum párhuzamos munka) a csapatodra.</li>
  <li>Kapsz egy <strong>stop-start-continue</strong> mikrolistát, hogy mit állítsatok le és mit kezdjetek el.</li>
  <li>Megtanulsz egy egyszerű <strong>triage</strong> döntést: mi „sürgős”, mi „fontos”, és mi kerül várólistára.</li>
</ul>

<hr />

<h2>Mi az a WIP?</h2>
<ul>
  <li><strong>WIP (Work In Progress)</strong>: az egyszerre folyamatban lévő munka mennyisége.</li>
  <li>Ha túl magas, tipikus tünetek:
    <ul>
      <li>minden halad „kicsit”, de semmi nem kész,</li>
      <li>nő a kontextusváltás és a hibaarány,</li>
      <li>a csapat folyamatosan tűzolt.</li>
    </ul>
  </li>
</ul>

<hr />

<h2>Miért öl a párhuzamosság? (3 ok)</h2>
<ol>
  <li><strong>Kontextusváltás</strong>: az agy újra és újra „felállítja” a munkát → időveszteség.</li>
  <li><strong>Rész-kész állapot</strong>: a „majdnem kész” nem érték. A kész ad döntést és visszajelzést.</li>
  <li><strong>Rejtett függőségek</strong>: sok nyitott szál növeli a blokkolást és a várakozást.</li>
</ol>

<hr />

<h2>WIP-szabály (egyszerű, kezdőbarát)</h2>
<p><strong>Alapszabály:</strong> egyszerre max 1 munka fejenként. Ha blokkolt, akkor a csapat először a blokkolást oldja, nem új munkát kezd.</p>

<h3>Gyakorlati döntési szabály</h3>
<ul>
  <li>Ha van „majdnem kész” elem: <strong>fejezzük be</strong> először.</li>
  <li>Ha blokkolt elem van: <strong>oldjuk a blokkolást</strong> (owner + next step).</li>
  <li>Új munka csak akkor indul, ha a WIP limit engedi.</li>
</ul>

<hr />

<h2>Stop-Start-Continue (mikro)</h2>
<ul>
  <li><strong>STOP:</strong> új munka indítása csak azért, mert „minden sürgős”.</li>
  <li><strong>START:</strong> befejezés fókusz (finish-first) + WIP limit.</li>
  <li><strong>CONTINUE:</strong> napi koordináció (Daily) döntésekkel, hogy látszódjon a valós sorrend.</li>
</ul>

<hr />

<h2>Példák (jó vs rossz)</h2>

<h3>Példa 1: „Minden sürgős”</h3>
<p><strong>Rossz:</strong> a csapat 12 feladatot indít el, és mindegyik félkész.</p>
<p><strong>Jó:</strong> 2 feladat fut egyszerre, a többinél „várólista”; a csapat befejez és csak utána indít újat.</p>

<h3>Példa 2: blokkolt munka</h3>
<p><strong>Rossz:</strong> blokkolásnál mindenki új munkát kezd, és nő a káosz.</p>
<p><strong>Jó:</strong> blokkolás owner + next step, a csapat rááll és feloldja, hogy a flow visszajöjjön.</p>

<hr />

<h2>Mérőpont (hogy látszódjon a javulás)</h2>
<ul>
  <li><strong>Cycle time</strong>: csökken-e az idő, míg valami elkészül?</li>
  <li><strong>„Majdnem kész” darabszám</strong>: csökken-e a félkész munka?</li>
  <li><strong>Megszakítások</strong>: csökken-e a napközbeni ad-hoc koordináció?</li>
</ul>

<hr />

<h2>Akció (25 perc)</h2>
<ol>
  <li>Írj egy WIP-szabályt (pl. 1 munka/fő + finish-first).</li>
  <li>Válassz ki 1 szokást, amit leállítotok (STOP) és 1-et, amit elindítotok (START).</li>
  <li>Írd le, hogyan döntötök „sürgős” kéréseknél (2 perces triage: hatás, deadline, owner, mi csúszik).</li>
</ol>

<hr />

<h2>Önellenőrzés</h2>
<ul>
  <li>✅ Tudom, mi a WIP és miért veszélyes a túl magas érték.</li>
  <li>✅ Van WIP-szabályom és finish-first döntésem.</li>
  <li>✅ Van 1 mérőpontom, amivel ellenőrzöm a javulást.</li>
</ul>

<hr />

<h2>Opcionális források</h2>
<ul>
  <li>Flow gondolkodás: kevesebb WIP → gyorsabb befejezés.</li>
  <li>Kanban alapok: WIP limit mint rendszer-védelem.</li>
</ul>`;

const emailSubject = 'ScrumMaster leszek 2026 — 10. nap: WIP és fókusz (finish-first)';

const emailBody = `<h1>{{courseName}}</h1>
<h2>{{dayNumber}}. nap: {{lessonTitle}}</h2>
<p>Ma WIP-szabályt állítasz be és a befejezésre fókuszálsz: kevesebb párhuzamos munka → gyorsabb flow.</p>
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

  console.log('✅ Day 10 applied');
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

