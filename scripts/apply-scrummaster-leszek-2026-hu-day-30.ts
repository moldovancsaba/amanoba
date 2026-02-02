/**
 * Apply SCRUMMASTER_LESZEK_2026_HU Day 30 lesson content (backup-first).
 */

import { config } from 'dotenv';
import { resolve, join } from 'path';
import { mkdirSync, writeFileSync } from 'fs';
import mongoose from 'mongoose';

config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../app/lib/mongodb';
import { Lesson } from '../app/lib/models';

const COURSE_ID = 'SCRUMMASTER_LESZEK_2026_HU';
const LESSON_ID = 'SCRUMMASTER_LESZEK_2026_HU_DAY_30';

function hasFlag(flag: string) {
  return process.argv.includes(flag);
}
function isoStamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}
const APPLY = hasFlag('--apply');

const title = 'Zárás: Scrum Master playbook v1 + tanúsítvány terv';

const content = `<h1>Zárás: Scrum Master playbook v1 + tanúsítvány terv</h1>
<p><em>Gratulálok: 30 nap alatt kaptál egy „kóstolót” az agilis óceánból. A következő lépés: legyen egy saját, kézzelfogható <strong>Scrum Master playbookod</strong> (mit csinálsz, hogyan, milyen szabályokkal), és egy egyszerű <strong>tanúsítvány terv</strong>, hogy a tudásod bizonyítható legyen.</em></p>

<hr />

<h2>Napi cél (kézzelfogható)</h2>
<ul>
  <li>Összeraksz egy <strong>SM Playbook v1</strong>-et (agenda-k + szabályok + mérőjelek + script-ek).</li>
  <li>Van egy 30 napos utótered: miben mélyülsz tovább (Scrum, facilitation, coaching, PO, minőség).</li>
  <li>Tisztán látod, hogyan készülj a tanúsítvány megszerzésére (vizsga + gyakorlás).</li>
</ul>

<hr />

<h2>SM Playbook v1 — minimális tartalom (amit érdemes leírni)</h2>
<h3>1) Agenda-k (rövid, használható)</h3>
<ul>
  <li><strong>Sprint Planning</strong>: cél → opciók → forecast → kockázat → commitment.</li>
  <li><strong>Daily</strong>: Sprint célhoz igazodó kérdések + parkoló.</li>
  <li><strong>Review</strong>: érték bemutatása + stakeholder döntések + feedback.</li>
  <li><strong>Retro</strong>: 1 kísérlet + mérőjel + felelős + visszanézés.</li>
  <li><strong>Refinement</strong>: slicing + kockázat tisztázás + DoR jelleg.</li>
</ul>

<h3>2) Szabályok és policy-k</h3>
<ul>
  <li><strong>Board hygiene</strong>: státusz = lépés, WIP limit, blocked policy.</li>
  <li><strong>Definition of Done</strong>: minőségi kapuk, rework csökkentés.</li>
  <li><strong>Stakeholder cadence</strong>: mikor, hol, milyen formában kérünk feedbacket.</li>
</ul>

<h3>3) Metrikák (kicsiben, érthetően)</h3>
<ul>
  <li>Flow: WIP, torlódás, blokk ideje, átfutási idő trend.</li>
  <li>Minőség: visszanyitás, bug trend, stabilitás.</li>
  <li>Érték/outcome: 1–2 jel, amit a stakeholder is ért.</li>
</ul>

<h3>4) Script-ek (mondatok, amiket tényleg használsz)</h3>
<ul>
  <li>„Mi a Sprint cél, és mi akadályozza most leginkább?”</li>
  <li>„Ha ezt választjuk, mi a tradeoff? Melyik opciót választjuk tudatosan?”</li>
  <li>„Ezt így nem vállalom, mert kockázatot hoz. Viszont itt két opció…”</li>
</ul>

<hr />

<h2>Akció (45–60 perc) — Saját Playbook v1 elkészítése</h2>
<ol>
  <li>Válassz 3 eseményt (Planning, Daily, Review, Retro, Refinement) és írd le 5–7 bulletben az agendát.</li>
  <li>Írj le 3 policy-t (board, DoD, blocked), amit holnaptól be tudsz vezetni.</li>
  <li>Válassz 3 mérőjelet (flow/minőség/outcome) és írd le, hogyan fogod követni.</li>
  <li>Írj le 5 „script mondatot”, amit használni fogsz.</li>
</ol>

<hr />

<h2>30 napos utóterv (miben mélyülsz tovább?)</h2>
<p>Válassz egy fókuszt:</p>
<ul>
  <li><strong>Scrum mély</strong>: események minősége + empirizmus.</li>
  <li><strong>Facilitáció</strong>: konfliktus, döntés, workshop design.</li>
  <li><strong>Coaching</strong>: kérdezéstechnika, rendszer szemlélet.</li>
  <li><strong>PO együttműködés</strong>: érték, slicing, stakeholder management.</li>
  <li><strong>Minőség</strong>: DoD, flow, technikai kockázat kérdezése.</li>
</ul>

<hr />

<h2>Tanúsítvány terv (egyszerű)</h2>
<ol>
  <li>Gyakorlás: napi 10–15 perc szituációs kérdések (nem definíció-memorizálás).</li>
  <li>Rendszer: hibák elemzése (miért volt rossz a válasz?), majd kísérlet a működésben.</li>
  <li>Vizsga: akkor menj, ha stabilan tudsz mintázatot felismerni és tradeoffot mondani.</li>
</ol>

<hr />

<h2>Önellenőrzés</h2>
<ul>
  <li>✅ Van Playbook v1-em, amit holnap használni tudok.</li>
  <li>✅ Tudom, miben mélyülök a következő 30 napban.</li>
  <li>✅ Van egyszerű vizsga/tanúsítvány tervem.</li>
</ul>`;

const emailSubject = 'ScrumMaster leszek 2026 — 30. nap: Zárás (SM Playbook v1 + tanúsítvány terv)';

const emailBody = `<h1>{{courseName}}</h1>
<h2>{{dayNumber}}. nap: {{lessonTitle}}</h2>
<p>Ma elkészíted a saját Scrum Master Playbook v1-edet és a tanúsítvány tervedet.</p>
<div>{{lessonContent}}</div>
<p><a href="{{appUrl}}/courses/SCRUMMASTER_LESZEK_2026_HU/day/{{dayNumber}}">Olvasd el a teljes leckét →</a></p>`;

async function main() {
  await connectDB();
  const lesson = await Lesson.findOne({ lessonId: LESSON_ID }).lean();
  if (!lesson) throw new Error(`Lesson not found: ${LESSON_ID}`);

  const current = {
    title: String((lesson as any).title ?? ''),
    content: String((lesson as any).content ?? ''),
    emailSubject: String((lesson as any).emailSubject ?? ''),
    emailBody: String((lesson as any).emailBody ?? ''),
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
      `- current.contentPreview: ${JSON.stringify(current.content.length > 200 ? `${current.content.slice(0, 200)}…` : current.content)}`
    );
    console.log(`- would backup to: ${backupFile}`);
    console.log(`- would set title/content/email fields (keeping isActive as-is)`);
    await mongoose.disconnect();
    return;
  }

  mkdirSync(backupDir, { recursive: true });
  writeFileSync(backupFile, JSON.stringify(backupPayload, null, 2));
  const update = await Lesson.updateOne({ lessonId: LESSON_ID }, { $set: { title, content, emailSubject, emailBody } });
  console.log('✅ Day 30 applied');
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

