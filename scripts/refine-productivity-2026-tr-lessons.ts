/**
 * Refine Productivity 2026 TR Lessons (low-quality days)
 *
 * Purpose:
 * - Improve lesson content quality so quizzes can be generated at strict standards (0 recall, >=7 questions, >=5 application).
 *
 * Safety:
 * - Dry-run by default (no DB writes).
 * - On apply: creates per-lesson backups under scripts/lesson-backups/PRODUCTIVITY_2026_TR/.
 * - Restore via scripts/restore-lesson-from-backup.ts
 *
 * Usage:
 * - Dry-run (preview + report):
 *   npx tsx --env-file=.env.local scripts/refine-productivity-2026-tr-lessons.ts --from-day 7 --to-day 30
 *
 * - Apply (DB writes + backups):
 *   npx tsx --env-file=.env.local scripts/refine-productivity-2026-tr-lessons.ts --from-day 7 --to-day 30 --apply
 */

import { config } from 'dotenv';
import { resolve, join } from 'path';
import { mkdirSync, readFileSync, writeFileSync } from 'fs';

config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../app/lib/mongodb';
import { Course, Lesson } from '../app/lib/models';
import { assessLessonQuality } from './lesson-quality';

function getArgValue(flag: string): string | undefined {
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return undefined;
  return process.argv[idx + 1];
}

const COURSE_ID = getArgValue('--course') || 'PRODUCTIVITY_2026_TR';
const FROM_DAY = Number(getArgValue('--from-day') || '7');
const TO_DAY = Number(getArgValue('--to-day') || '30');
const APPLY = process.argv.includes('--apply');
const OUT_DIR = getArgValue('--out-dir') || join(process.cwd(), 'scripts', 'reports');
const BACKUP_DIR = getArgValue('--backup-dir') || join(process.cwd(), 'scripts', 'lesson-backups');

function isoStamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function stripHtml(input: string) {
  return String(input || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

type CCSLesson = {
  dayNumber: number;
  canonicalTitle: string;
  intent: string;
  goals: string[];
  requiredConcepts?: string[];
  requiredProcedures?: string[];
  canonicalExample?: string;
  commonMistakes?: string[];
};

type CCSProcedure = {
  id: string;
  name: string;
  steps: string[];
};

function loadProductivityCCS(): {
  lessons: CCSLesson[];
  concepts: Record<string, { definition: string; notes?: string[] }>;
  procedures: CCSProcedure[];
} {
  const p = join(process.cwd(), 'docs', 'canonical', 'PRODUCTIVITY_2026', 'PRODUCTIVITY_2026.canonical.json');
  const raw = readFileSync(p, 'utf8');
  return JSON.parse(raw);
}

function ul(items: string[]) {
  return `<ul>\n${items.map(i => `  <li>${i}</li>`).join('\n')}\n</ul>`;
}

function ol(items: string[]) {
  return `<ol>\n${items.map(i => `  <li>${i}</li>`).join('\n')}\n</ol>`;
}

function escapeHtml(s: string) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function conceptLabelTr(id: string) {
  const map: Record<string, string> = {
    Vision: 'Vizyon',
    Output: 'Output (çıktı)',
    Outcome: 'Outcome (sonuç/etki)',
    Project: 'Proje',
    NextAction: 'Sonraki Aksiyon (next action)',
    GoalHierarchy: 'Hedef Hiyerarşisi',
    Constraints: 'Kısıtlar',
    ProductivityDefinition: 'Verimlilik Tanımı',
    TimeBlocking: 'Zaman Bloklama (time blocking)',
    DeepWork: 'Derin Çalışma (deep work)',
    Batching: 'Gruplama (batching)',
    AttentionResidue: 'Dikkat Artığı (attention residue)',
    Throughput: 'Throughput (akış / tamamlanan değer)',
    FocusBlocks: 'Odak Blokları',
    Carryover: 'Carryover (devreden işler)',
    CaptureSystem: 'Yakalama Sistemi (capture)',
    TriggersList: 'Tetikleyici Listesi',
    HabitsVsSystems: 'Alışkanlıklar vs Sistemler',
    Delegation: 'Delege Etme',
    Elimination: 'Eleme (elimination)',
    EnergyManagement: 'Enerji Yönetimi',
    DecisionMatrix: 'Karar Matrisi',
    DecisionCategories: 'Karar Kategorileri',
    GoodEnough80Rule: '“%80 Yeterince İyi” Kuralı',
    SMARTGoals: 'SMART Hedefler',
    OKR: 'OKR (Objective & Key Results)',
  };
  return map[id] || id;
}

function conceptDefinitionTr(id: string) {
  const map: Record<string, string> = {
    Vision: 'Uzun vadeli yön ve “neden”; günlük kararların hizalandığı çerçeve.',
    Output: 'Somut, teslim edilebilir çıktı (doküman, karar, teslim edilen parça vb.).',
    Outcome: 'Çıktının gerçek etkisi (müşteri değeri, kalite, hız, hata azalması vb.).',
    Project: 'Bir sonuca giden, birden fazla adımdan oluşan iş (tek görev değil).',
    NextAction: 'En küçük, net yapılabilir sonraki adım (fiille başlar).',
    GoalHierarchy: 'Vizyon → sonuçlar → projeler → sonraki aksiyonlar → gün/hafta planı.',
    Constraints: 'Zaman, enerji, dikkat, kapasite gibi gerçek kısıtlar.',
    ProductivityDefinition:
      'Verimlilik = değerli çıktı (output) → ölçülebilir etki (outcome), kısıtlar altında.',
    TimeBlocking: 'Takvimde önceden blok ayırarak öncelikli işlere korumalı zaman yaratmak.',
    DeepWork: 'Kesintisiz, yüksek odak gerektiren çalışma bloğu.',
    Batching: 'Benzer işleri gruplayıp birlikte yapmak; bağlam değişimini azaltmak.',
    AttentionResidue: 'Görev değişimi sonrası önceki işin zihinde kalması; odak düşer.',
    Throughput: 'Belli sürede tamamlanan önemli çıktılar (meşguliyet değil).',
    FocusBlocks: 'Planlanan kesintisiz odak bloklarının sayısı ve gerçekleşmesi.',
    Carryover: 'Tamamlanmadan devreden iş oranı; aşırı planlama/yanlış öncelik sinyali.',
    CaptureSystem: 'İş/idea yakalama için tek sistem; kafada taşımayı azaltır.',
    TriggersList: 'Sık bölücüler (bildirimler, chat, siteler) listesi ve kontrol planı.',
    HabitsVsSystems: 'Alışkanlık otomatik; sistem ise kural + ortam + ölçüm kombinasyonudur.',
    Delegation: 'Amaç, kriter ve kontrol noktaları net olacak şekilde işi devretmek.',
    Elimination: 'Düşük değerli işleri kaldırarak kapasite açmak.',
    EnergyManagement: 'İş yoğunluğunu enerji ritmine göre ayarlamak; toparlanma planlamak.',
    DecisionMatrix: 'Kararları etki × çaba (veya risk) ile kriterlere göre sıralamak.',
    DecisionCategories: 'Küçük/orta/büyük karar ayrımı ve uygun derinlikte süreç seçimi.',
    GoodEnough80Rule: 'Çoğu durumda %80 çözüm, mükemmeliyetten daha hızlı sonuç getirir.',
    SMARTGoals: 'Net, ölçülebilir, ulaşılabilir, ilgili ve zaman bağlı hedef tanımı.',
    OKR: 'Objective (yön) + 2–4 ölçülebilir Key Result (kriter/eşik) bir dönem için.',
  };
  return map[id] || '';
}

function procedureNameTr(id: string, fallback: string) {
  const map: Record<string, string> = {
    P1_PERSONAL_PRODUCTIVITY_DEFINITION: 'Kişisel Verimlilik Tanımı (output → outcome → kısıtlar)',
    P2_WEEKLY_REVIEW_THROUGHPUT_FOCUS_CARRYOVER: 'Haftalık İnceleme (throughput / odak blokları / carryover)',
    P3_DEEP_WORK_DAY_DESIGN: 'Derin Çalışma Günü Tasarımı (blok + koruma + buffer)',
    P4_TASK_AUDIT_DELEGATE_ELIMINATE: 'Görev Denetimi (delege et / ele)',
    P5_DECISION_MATRIX_AND_CATEGORIES: 'Karar Matrisi + Karar Kategorileri',
  };
  return map[id] || fallback;
}

function translateProcedureStepTr(step: string) {
  const s = String(step || '').trim();
  const map: Array<[RegExp, string]> = [
    [/^Count throughput:/i, 'Throughput’u say:'],
    [/^Count focus blocks:/i, 'Odak bloklarını say:'],
    [/^Count carryover:/i, 'Carryover’ı say:'],
    [/^Write 2 insights:/i, '2 içgörü yaz:'],
    [/^Make 1 rule change/i, 'Gelecek hafta için 1 kural değişikliği seç ve planla:'],
  ];
  for (const [re, rep] of map) {
    if (re.test(s)) return s.replace(re, rep);
  }
  return s;
}

function buildMetricsTr(requiredConcepts: string[], requiredProcedures: string[]) {
  const metrics: string[] = [];

  if (requiredConcepts.includes('Throughput')) metrics.push('Metrik: throughput (tamamlanan önemli çıktılar).');
  if (requiredConcepts.includes('FocusBlocks') || requiredConcepts.includes('DeepWork')) {
    metrics.push('Metrik: odak blokları (kesintisiz deep work blok sayısı).');
  }
  if (requiredConcepts.includes('Carryover')) metrics.push('Metrik: carryover (devreden iş sayısı/oranı).');
  if (requiredConcepts.includes('Constraints')) metrics.push('Kriter: kısıtlar (zaman/enerji/dikkat) korunuyor mu?');
  if (requiredConcepts.includes('Delegation')) metrics.push('Metrik: delege edilen işler ve “geri dönme” sayısı.');
  if (requiredConcepts.includes('DecisionMatrix')) metrics.push('Kriter: karar gecikmesi (48 saat eşiği gibi).');

  if (metrics.length < 4) {
    metrics.push('Kriter: “bitti” tanımı net mi ve kontrol edilebilir mi?');
    metrics.push('Eşik (threshold): başarı için minimum seviye önceden tanımlı mı?');
  }

  return metrics.slice(0, 6);
}

function buildTRLessonHtml(params: {
  day: number;
  title: string;
  intent: string;
  goals: string[];
  requiredConcepts: string[];
  requiredProcedures: CCSProcedure[];
  canonicalExample?: string;
  commonMistakes: string[];
}) {
  const { day, title, intent, goals, requiredConcepts, requiredProcedures, canonicalExample, commonMistakes } = params;

  const conceptBlocks = requiredConcepts
    .map((id) => {
      const label = conceptLabelTr(id);
      const def = conceptDefinitionTr(id);
      return `<p><strong>${escapeHtml(label)} (tanım):</strong> ${escapeHtml(def || 'Tanım eklenecek.')}</p>`;
    })
    .join('\n');

  const procedureBlocks = requiredProcedures
    .map((p) => {
      const stepsTr = (p.steps || []).map(translateProcedureStepTr);
      return (
        `<h3>${escapeHtml(procedureNameTr(p.id, p.name))}</h3>\n` +
        `<p><em>Amaç:</em> ölçülebilir output üret ve outcome’a bağla (kriter + metrik + eşik).</p>\n` +
        ol(stepsTr.map((s) => escapeHtml(s)))
      );
    })
    .join('\n');

  const exampleText =
    canonicalExample ||
    '✅ İyi örnek: 2 odak bloğu + 1 önemli çıktı teslim + düşük carryover. ❌ Kötü örnek: 12 “başlandı” ama 0 sonuç; kısıtlar bozuluyor.';

  const mistakes = commonMistakes.length
    ? commonMistakes.map((m) => `❌ Hata: ${m}. ✅ Düzeltme: kriter/metrik yaz, küçük pilot yap, tek kural değiştir.`)
    : [
        '❌ Hata: her şeyi aynı anda değiştirmek. ✅ Düzeltme: 1 kural, 1 metrik, 1 haftalık test.',
        '❌ Hata: “bitti” kriteri yok. ✅ Düzeltme: kontrol edilebilir “done” tanımı yaz ve ölç.',
      ];

  const metrics = buildMetricsTr(requiredConcepts, requiredProcedures.map((p) => p.id));

  const cleanTitle = title.includes('—') ? title.split('—').pop()!.trim() : title;
  const content =
    `<h1>${escapeHtml(`Verimlilik 2026 — Gün ${day}`)}</h1>\n` +
    `<h2>${escapeHtml(cleanTitle)}</h2>\n` +
    `<p><strong>Neden önemli?</strong> ${escapeHtml(intent)}</p>\n` +
    `<h2>Bugünün hedefleri (outcome)</h2>\n` +
    ul(goals.map((g) => escapeHtml(g))) +
    `<h2>Ana kavramlar (tanım / karşılaştırma)</h2>\n` +
    conceptBlocks +
    `<h2>Adımlar (uygulama) + kontrol</h2>\n` +
    (procedureBlocks || `<p>Bugün: 1 kural seç, 1 metrik belirle, küçük pilot yap ve sonuçları kontrol et.</p>`) +
    `<h2>Örnek (iyi vs kötü)</h2>\n` +
    `<p>${escapeHtml(exampleText)}</p>\n` +
    `<h2>Yaygın hatalar ve düzeltmeler</h2>\n` +
    ul(mistakes.map((m) => escapeHtml(m))) +
    `<h2>Metrikler, kriterler, eşikler</h2>\n` +
    ul(metrics.map((m) => escapeHtml(m)));

  return content;
}

async function main() {
  await connectDB();

  const course = await Course.findOne({ courseId: COURSE_ID, isActive: true }).lean();
  if (!course) throw new Error(`Course not found: ${COURSE_ID}`);
  if (String(course.language || '').toLowerCase() !== 'tr') {
    throw new Error(`Course language is not TR for ${COURSE_ID} (found: ${course.language})`);
  }

  const lessons = await Lesson.find({ courseId: course._id, isActive: true })
    .sort({ dayNumber: 1, displayOrder: 1, createdAt: 1, _id: 1 })
    .select({ _id: 1, lessonId: 1, dayNumber: 1, title: 1, content: 1, emailSubject: 1, emailBody: 1, createdAt: 1 })
    .lean();

  // Deduplicate by dayNumber (keep oldest record per day)
  const byDay = new Map<number, any>();
  for (const lesson of lessons) {
    const existing = byDay.get(lesson.dayNumber);
    if (!existing) {
      byDay.set(lesson.dayNumber, lesson);
      continue;
    }
    const a = existing.createdAt ? new Date(existing.createdAt).getTime() : 0;
    const b = lesson.createdAt ? new Date(lesson.createdAt).getTime() : 0;
    if (b < a) byDay.set(lesson.dayNumber, lesson);
  }

  const ccs = loadProductivityCCS();
  const ccsByDay = new Map<number, CCSLesson>();
  for (const l of ccs.lessons || []) ccsByDay.set(l.dayNumber, l);

  const procById = new Map<string, CCSProcedure>();
  for (const p of ccs.procedures || []) procById.set(p.id, p);

  const stamp = isoStamp();
  mkdirSync(OUT_DIR, { recursive: true });

  const planRows: any[] = [];
  const applyResults: any[] = [];

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.amanoba.com';

  for (let day = FROM_DAY; day <= TO_DAY; day++) {
    const lesson = byDay.get(day);
    if (!lesson) {
      planRows.push({ day, action: 'SKIP_NO_LESSON', reason: 'Missing lesson in DB for that day' });
      continue;
    }

    const ccsLesson = ccsByDay.get(day);
    if (!ccsLesson) {
      planRows.push({ day, lessonId: lesson.lessonId, action: 'SKIP_NO_CCS', reason: 'Missing CCS entry' });
      continue;
    }

    const oldContent = String(lesson.content || '');
    const oldTitle = String(lesson.title || '');
    const oldScore = assessLessonQuality({ title: oldTitle, content: oldContent, language: 'tr' });

    // Safety: never overwrite already-strong lessons. Only refine when score is below the threshold.
    if (oldScore.score >= 70) {
      planRows.push({
        day,
        lessonId: lesson.lessonId,
        title: oldTitle,
        action: 'SKIP_ALREADY_OK',
        quality: { old: oldScore, next: oldScore },
        lengths: { oldChars: stripHtml(oldContent).length, nextChars: stripHtml(oldContent).length },
        applyEligible: true,
      });
      continue;
    }

    const requiredConcepts = (ccsLesson.requiredConcepts || []).filter(Boolean);
    const requiredProcedures = (ccsLesson.requiredProcedures || [])
      .map((id) => procById.get(id))
      .filter(Boolean) as CCSProcedure[];

    const nextContent = buildTRLessonHtml({
      day,
      title: oldTitle || `Verimlilik 2026 — Gün ${day}`,
      intent: ccsLesson.intent || 'Kısıtlar altında ölçülebilir output üret ve outcome’a bağla.',
      goals: (ccsLesson.goals || []).slice(0, 6),
      requiredConcepts,
      requiredProcedures,
      canonicalExample: ccsLesson.canonicalExample,
      commonMistakes: (ccsLesson.commonMistakes || []).slice(0, 8),
    });
    const nextScore = assessLessonQuality({ title: oldTitle, content: nextContent, language: 'tr' });

    planRows.push({
      day,
      lessonId: lesson.lessonId,
      title: oldTitle,
      action: 'REFINE',
      quality: { old: oldScore, next: nextScore },
      lengths: { oldChars: stripHtml(oldContent).length, nextChars: stripHtml(nextContent).length },
      applyEligible: nextScore.score >= 70,
    });

    if (!APPLY) continue;

    // Backup before update
    const courseFolder = join(BACKUP_DIR, COURSE_ID);
    mkdirSync(courseFolder, { recursive: true });
    const backupPath = join(courseFolder, `${lesson.lessonId}__${stamp}.json`);
    writeFileSync(
      backupPath,
      JSON.stringify(
        {
          backedUpAt: new Date().toISOString(),
          courseId: COURSE_ID,
          lessonId: lesson.lessonId,
          dayNumber: lesson.dayNumber,
          title: oldTitle,
          content: oldContent,
          emailSubject: lesson.emailSubject || null,
          emailBody: lesson.emailBody || null,
        },
        null,
        2
      )
    );

    const emailSubject = `Verimlilik 2026 – Gün ${day}: ${oldTitle}`;
    const emailBody =
      `<h1>Verimlilik 2026 – Gün ${day}</h1>\n` +
      `<h2>${escapeHtml(oldTitle)}</h2>\n` +
      `<p>${escapeHtml(ccsLesson.intent || '')}</p>\n` +
      `<p><a href=\"${appUrl}/tr/courses/${COURSE_ID}/day/${day}\">Dersi aç →</a></p>`;

    const update = await Lesson.updateOne(
      { _id: lesson._id },
      {
        $set: {
          content: nextContent,
          emailSubject,
          emailBody,
          'metadata.updatedAt': new Date(),
        },
      }
    );

    applyResults.push({
      day,
      lessonId: lesson.lessonId,
      backupPath,
      matched: update.matchedCount,
      modified: update.modifiedCount,
      newScore: nextScore.score,
    });
  }

  const reportPath = join(OUT_DIR, `lesson-refine-preview__${COURSE_ID}__${stamp}.json`);
  writeFileSync(
    reportPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        courseId: COURSE_ID,
        fromDay: FROM_DAY,
        toDay: TO_DAY,
        apply: APPLY,
        totals: {
          considered: planRows.length,
          eligible70: planRows.filter((r) => r.applyEligible).length,
          below70: planRows.filter((r) => !r.applyEligible).length,
          applied: applyResults.length,
        },
        planRows,
        applyResults,
      },
      null,
      2
    )
  );

  console.log('✅ Lesson refinement preview complete');
  console.log(`- Apply mode: ${APPLY ? 'YES (DB writes + backups)' : 'NO (dry-run only)'}`);
  console.log(`- Report: ${reportPath}`);
  if (APPLY) console.log(`- Backups: ${join(BACKUP_DIR, COURSE_ID)}`);
  if (APPLY) console.log(`- Applied lessons: ${applyResults.length}`);

  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
