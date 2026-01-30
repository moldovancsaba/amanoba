/**
 * Refine Productivity 2026 ID Lessons (quality lift to >=70, strict-quiz ready)
 *
 * Purpose:
 * - Expand weak Indonesian lessons so strict quiz generation can succeed (0 recall, >=7 valid, >=5 application).
 * - Keep language integrity (no English leakage) while staying aligned to Productivity CCS procedures.
 *
 * Safety:
 * - Dry-run by default (no DB writes).
 * - On apply: creates per-lesson backups under scripts/lesson-backups/PRODUCTIVITY_2026_ID/.
 * - Restore via scripts/restore-lesson-from-backup.ts
 *
 * Usage:
 * - Dry-run:
 *   npx tsx --env-file=.env.local scripts/refine-productivity-2026-id-lessons.ts --from-day 1 --to-day 30
 * - Apply:
 *   npx tsx --env-file=.env.local scripts/refine-productivity-2026-id-lessons.ts --from-day 1 --to-day 30 --apply
 */

import { config } from 'dotenv';
import { resolve, join } from 'path';
import { mkdirSync, readFileSync, writeFileSync } from 'fs';

config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../app/lib/mongodb';
import { Course, Lesson } from '../app/lib/models';
import { assessLessonQuality } from './lesson-quality';
import { validateLessonRecordLanguageIntegrity } from './language-integrity';

function getArgValue(flag: string): string | undefined {
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return undefined;
  return process.argv[idx + 1];
}

const COURSE_ID = getArgValue('--course') || 'PRODUCTIVITY_2026_ID';
const FROM_DAY = Number(getArgValue('--from-day') || '1');
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

function escapeHtml(s: string) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function ul(items: string[]) {
  return `<ul>\n${items.map((i) => `  <li>${escapeHtml(i)}</li>`).join('\n')}\n</ul>\n`;
}

function ol(items: string[]) {
  return `<ol>\n${items.map((i) => `  <li>${escapeHtml(i)}</li>`).join('\n')}\n</ol>\n`;
}

type CCSLesson = {
  dayNumber: number;
  canonicalTitle: string;
  intent: string;
  goals: string[];
  requiredProcedures?: string[];
};

type CCSProcedure = {
  id: string;
  name: string;
  steps: string[];
};

function loadProductivityCCS(): { lessons: CCSLesson[]; procedures: CCSProcedure[] } {
  const p = join(process.cwd(), 'docs', 'canonical', 'PRODUCTIVITY_2026', 'PRODUCTIVITY_2026.canonical.json');
  const raw = readFileSync(p, 'utf8');
  const parsed = JSON.parse(raw);
  return { lessons: parsed.lessons || [], procedures: parsed.procedures || [] };
}

function procedureNameId(id: string, fallback: string) {
  const map: Record<string, string> = {
    P1_PERSONAL_PRODUCTIVITY_DEFINITION: 'Definisi Produktivitas Pribadi (output → outcome → batasan)',
    P2_WEEKLY_REVIEW_THROUGHPUT_FOCUS_CARRYOVER: 'Tinjauan Mingguan (throughput / blok fokus / carryover)',
    P3_DEEP_WORK_DAY_DESIGN: 'Desain Hari Deep Work (blok + aturan + buffer)',
    P4_TASK_AUDIT_DELEGATE_ELIMINATE: 'Audit Tugas (delegasikan vs hilangkan)',
    P5_DECISION_MATRIX_AND_CATEGORIES: 'Matriks Keputusan + Kategori Keputusan',
  };
  return map[id] || fallback;
}

function procedureStepsId(id: string): string[] {
  const stepsById: Record<string, string[]> = {
    P1_PERSONAL_PRODUCTIVITY_DEFINITION: [
      'Daftar output berulang yang Anda hasilkan (aktivitas yang selalu muncul).',
      'Ubah setiap output menjadi outcome yang diinginkan (hasil yang terukur).',
      'Daftar batasan Anda (waktu, energi, perhatian, sumber daya).',
      'Tulis definisi produktivitas pribadi 2–3 kalimat yang mengaitkan outcome dan batasan.',
      'Pilih 1 “tuas” perbaikan minggu ini (kurangi pemborosan batasan atau naikkan kualitas outcome).',
    ],
    P2_WEEKLY_REVIEW_THROUGHPUT_FOCUS_CARRYOVER: [
      'Hitung throughput: outcome penting yang selesai.',
      'Hitung blok fokus: blok deep work yang selesai tanpa gangguan.',
      'Hitung carryover: tugas yang “terseret” dari minggu lalu.',
      'Tulis 2 insight: apa yang berhasil / apa yang rusak (dan kenapa).',
      'Tentukan 1 perubahan aturan untuk minggu depan dan jadwalkan.',
    ],
    P3_DEEP_WORK_DAY_DESIGN: [
      'Audit perpindahan konteks Anda selama 1 hari (apa yang paling sering memecah fokus?).',
      'Batch tugas serupa ke dalam jendela tetap (misal: cek email 2×/hari).',
      'Jadwalkan 1–3 blok deep work (90–120 menit) dengan aturan jelas (tanpa notifikasi).',
      'Tambahkan buffer 20–30% dan lindungi dari rapat/pesan mendadak.',
      'Lacak kepatuhan selama 1 minggu lalu sesuaikan.',
    ],
    P4_TASK_AUDIT_DELEGATE_ELIMINATE: [
      'Daftar semua tugas yang Anda lakukan dalam 1 minggu.',
      'Tandai tugas bernilai rendah (biaya waktu tinggi, outcome rendah).',
      'Untuk tiap tugas bernilai rendah: putuskan delegasikan vs hilangkan vs pertahankan.',
      'Tulis brief delegasi (output yang diharapkan, deadline, kriteria sukses, titik check-in).',
      'Eksekusi: hilangkan 1 tugas dan delegasikan 1 tugas minggu ini; tinjau dampaknya.',
    ],
    P5_DECISION_MATRIX_AND_CATEGORIES: [
      'Tentukan kategori keputusan (kecil/sedang/besar) berdasarkan reversibilitas dan dampak.',
      'Untuk sedang/besar: daftar opsi + kriteria; beri bobot; skor tiap opsi.',
      'Tentukan batas informasi (batas waktu / data minimum).',
      'Ambil keputusan “80% cukup” lalu implementasikan.',
      'Tinjau outcome dan perbarui aturan keputusan Anda.',
    ],
  };
  return stepsById[id] || ['Pilih 1 aturan, 1 metrik, lakukan uji kecil, lalu tinjau hasilnya.'];
}

function buildIntentId(requiredProcedureIds: string[]) {
  if (requiredProcedureIds.includes('P3_DEEP_WORK_DAY_DESIGN')) {
    return 'Hari ini Anda mendesain hari kerja untuk melindungi fokus: mengurangi perpindahan konteks dan mengubah waktu menjadi outcome yang terukur.';
  }
  if (requiredProcedureIds.includes('P2_WEEKLY_REVIEW_THROUGHPUT_FOCUS_CARRYOVER')) {
    return 'Hari ini Anda membuat loop umpan balik mingguan: ukur throughput, blok fokus, dan carryover, lalu ubah 1 aturan untuk minggu depan.';
  }
  if (requiredProcedureIds.includes('P4_TASK_AUDIT_DELEGATE_ELIMINATE')) {
    return 'Hari ini Anda mengurangi beban dan meningkatkan hasil dengan audit tugas: delegasikan atau hilangkan pekerjaan bernilai rendah.';
  }
  if (requiredProcedureIds.includes('P5_DECISION_MATRIX_AND_CATEGORIES')) {
    return 'Hari ini Anda mempercepat keputusan: gunakan kategori keputusan + matriks kriteria, tetapkan batas informasi, lalu jalankan keputusan 80%.';
  }
  return 'Hari ini Anda menghubungkan aktivitas ke hasil: definisikan “selesai”, pilih metrik, dan tetapkan ambang sukses.';
}

function buildGoalsId(requiredProcedureIds: string[]) {
  const goals: string[] = [];
  if (requiredProcedureIds.includes('P2_WEEKLY_REVIEW_THROUGHPUT_FOCUS_CARRYOVER')) {
    goals.push('Ukur 3 angka: throughput, blok fokus, dan carryover.');
    goals.push('Tulis 2 insight: apa yang berhasil dan apa yang rusak.');
    goals.push('Pilih 1 perubahan aturan dan masukkan ke kalender.');
  }
  if (requiredProcedureIds.includes('P3_DEEP_WORK_DAY_DESIGN')) {
    goals.push('Jadwalkan 1–3 blok deep work dengan aturan jelas.');
    goals.push('Batch tugas komunikasi ke jendela tetap.');
    goals.push('Tambahkan buffer 20–30% untuk mencegah rencana runtuh.');
  }
  if (requiredProcedureIds.includes('P4_TASK_AUDIT_DELEGATE_ELIMINATE')) {
    goals.push('Identifikasi 3 tugas bernilai rendah dan putuskan: delegasi/hilangkan/pertahankan.');
    goals.push('Tulis 1 brief delegasi yang jelas (output + deadline + kriteria + check-in).');
    goals.push('Eksekusi minggu ini: hilangkan 1 tugas dan delegasikan 1 tugas.');
  }
  if (requiredProcedureIds.includes('P5_DECISION_MATRIX_AND_CATEGORIES')) {
    goals.push('Tentukan 1 keputusan yang tertunda dan kategorikan (kecil/sedang/besar).');
    goals.push('Tulis kriteria + bobot + skor sederhana untuk 2–3 opsi.');
    goals.push('Ambil keputusan 80% dan jadwalkan review hasil.');
  }
  if (goals.length < 4) {
    goals.push('Tulis definisi “selesai” yang bisa diverifikasi sebelum mulai.');
    goals.push('Pilih 1 metrik + 1 ambang sukses (threshold).');
  }
  return goals.slice(0, 6);
}

function buildDefinitionsId(requiredProcedureIds: string[]) {
  const defs: Array<{ term: string; def: string }> = [];
  defs.push({ term: 'Output', def: 'Artefak/hasil kerja yang Anda hasilkan (misal: draf, laporan, keputusan tertulis).' });
  defs.push({ term: 'Outcome', def: 'Perubahan/hasil yang diinginkan dan bisa diukur (misal: 3 prospek tersentuh, 1 fitur rilis).' });
  defs.push({ term: 'Batasan (constraints)', def: 'Keterbatasan nyata: waktu, energi, perhatian, sumber daya.' });
  if (requiredProcedureIds.includes('P2_WEEKLY_REVIEW_THROUGHPUT_FOCUS_CARRYOVER')) {
    defs.push({ term: 'Throughput', def: 'Jumlah outcome penting yang selesai dalam periode tertentu.' });
    defs.push({ term: 'Blok fokus', def: 'Blok kerja tanpa gangguan (deep work) yang selesai sesuai aturan.' });
    defs.push({ term: 'Carryover', def: 'Tugas yang tertunda/terseret ke minggu berikutnya.' });
  }
  if (requiredProcedureIds.includes('P3_DEEP_WORK_DAY_DESIGN')) {
    defs.push({ term: 'Deep work', def: 'Kerja mendalam dengan konsentrasi tinggi tanpa gangguan.' });
    defs.push({ term: 'Batching', def: 'Mengelompokkan tugas serupa agar biaya pindah konteks turun.' });
    defs.push({ term: 'Buffer', def: 'Waktu cadangan 20–30% untuk gangguan/tugas tak terduga.' });
  }
  if (requiredProcedureIds.includes('P4_TASK_AUDIT_DELEGATE_ELIMINATE')) {
    defs.push({ term: 'Delegasi', def: 'Memberi tugas pada orang lain dengan output + kriteria + check-in yang jelas.' });
    defs.push({ term: 'Eliminasi', def: 'Menghapus pekerjaan bernilai rendah agar kapasitas kembali.' });
  }
  if (requiredProcedureIds.includes('P5_DECISION_MATRIX_AND_CATEGORIES')) {
    defs.push({ term: 'Matriks keputusan', def: 'Membandingkan opsi memakai kriteria + bobot + skor.' });
    defs.push({ term: 'Batas informasi', def: 'Batas waktu atau data minimum sebelum memutuskan.' });
  }
  return defs.slice(0, 8);
}

function buildExampleId(requiredProcedureIds: string[]) {
  if (requiredProcedureIds.includes('P2_WEEKLY_REVIEW_THROUGHPUT_FOCUS_CARRYOVER')) {
    return {
      good: 'Minggu ini: throughput=5 outcome penting, blok fokus=7, carryover=3. Anda ubah 1 aturan: email hanya 2×/hari dan jadwalkan 2 blok deep work.',
      bad: 'Anda “sibuk” 50 jam, tapi tidak tahu throughput dan carryover. Minggu depan Anda tidak mengubah aturan apa pun.',
    };
  }
  if (requiredProcedureIds.includes('P4_TASK_AUDIT_DELEGATE_ELIMINATE')) {
    return {
      good: 'Anda menemukan 3 tugas bernilai rendah, menghapus 1 rapat rutin, dan mendelegasikan 1 laporan dengan brief yang jelas + check-in Rabu.',
      bad: 'Anda menambah alat baru, tapi tetap mengerjakan semua tugas sendiri tanpa kriteria prioritas.',
    };
  }
  if (requiredProcedureIds.includes('P5_DECISION_MATRIX_AND_CATEGORIES')) {
    return {
      good: 'Anda menilai 3 opsi (A/B/C) memakai 3 kriteria berbobot, lalu memilih opsi B dengan keputusan 80% dan review 7 hari.',
      bad: 'Anda menunggu “data lengkap” tanpa batas waktu, sehingga keputusan tertunda 3 minggu.',
    };
  }
  return {
    good: 'Anda menulis definisi “selesai” + 1 metrik + ambang sukses, lalu menjalankan uji kecil 1 minggu dan meninjau hasil.',
    bad: 'Anda menulis tujuan umum tanpa metrik, lalu berharap motivasi menjaga konsistensi.',
  };
}

function buildMetricsId(requiredProcedureIds: string[]) {
  const metrics: string[] = [];
  metrics.push('Metrik: jumlah outcome penting yang selesai minggu ini.');
  metrics.push('Kriteria: definisi “selesai” bisa diverifikasi sebelum mulai.');
  metrics.push('Ambang (threshold): batas minimum sukses ditentukan di awal.');
  if (requiredProcedureIds.includes('P2_WEEKLY_REVIEW_THROUGHPUT_FOCUS_CARRYOVER')) {
    metrics.push('Metrik: blok fokus yang selesai tanpa gangguan.');
    metrics.push('Metrik: carryover (jumlah/rasio) + alasan carryover.');
  }
  if (requiredProcedureIds.includes('P3_DEEP_WORK_DAY_DESIGN')) {
    metrics.push('Kepatuhan: % blok deep work yang terlaksana sesuai aturan.');
  }
  if (requiredProcedureIds.includes('P4_TASK_AUDIT_DELEGATE_ELIMINATE')) {
    metrics.push('Metrik: jumlah tugas yang berhasil didelegasikan + kualitas output (lulus kriteria).');
  }
  if (requiredProcedureIds.includes('P5_DECISION_MATRIX_AND_CATEGORIES')) {
    metrics.push('Kriteria: keputusan tidak melewati batas waktu (misal 48 jam untuk keputusan sedang).');
  }
  return metrics.slice(0, 6);
}

function buildIdLessonHtml(params: { day: number; title: string; intent: string; goals: string[]; requiredProcedureIds: string[] }) {
  const { day, title, intent, goals, requiredProcedureIds } = params;
  const defs = buildDefinitionsId(requiredProcedureIds);
  const example = buildExampleId(requiredProcedureIds);
  const metrics = buildMetricsId(requiredProcedureIds);
  const mainProc = requiredProcedureIds[0] || '';
  const steps = mainProc ? procedureStepsId(mainProc) : [];
  const procName = mainProc ? procedureNameId(mainProc, mainProc) : '';

  return (
    `<h1>${escapeHtml(`Produktivitas 2026 — Hari ${day}`)}</h1>\n` +
    `<h2>${escapeHtml(title)}</h2>\n` +
    `<p><strong>Mengapa penting:</strong> ${escapeHtml(intent)}</p>\n` +
    `<h2>Tujuan hari ini</h2>\n` +
    ul(goals) +
    `<h2>Definisi kunci</h2>\n` +
    ul(defs.map((d) => `${d.term}: ${d.def}`)) +
    `<h2>Langkah (praktik)</h2>\n` +
    (procName ? `<h3>${escapeHtml(procName)}</h3>\n` : '') +
    (steps.length ? ol(steps) : `<p>Pilih 1 aturan, 1 metrik, jalankan uji kecil, lalu tinjau hasilnya.</p>\n`) +
    `<h2>Contoh (baik vs buruk)</h2>\n` +
    `<p><strong>✅ Baik:</strong> ${escapeHtml(example.good)}</p>\n` +
    `<p><strong>❌ Buruk:</strong> ${escapeHtml(example.bad)}</p>\n` +
    `<h2>Checklist</h2>\n` +
    ul([
      'Saya menulis definisi “selesai” sebelum mulai.',
      'Saya memilih 1 metrik + 1 ambang sukses.',
      'Saya menjalankan 1 uji kecil (bukan perubahan besar sekaligus).',
      'Saya menjadwalkan review hasil (tanggal/jam).',
    ]) +
    `<h2>Metrik / kriteria</h2>\n` +
    ul(metrics) +
    `<h2>Kesalahan umum + perbaikan</h2>\n` +
    ul([
      'Kesalahan: mengejar “sibuk”. Perbaikan: ukur throughput/outcome.',
      'Kesalahan: tanpa definisi “selesai”. Perbaikan: tulis test + bukti.',
      'Kesalahan: terlalu banyak perubahan. Perbaikan: 1 aturan + 1 metrik + 1 minggu.',
    ])
  );
}

async function main() {
  await connectDB();

  const course = await Course.findOne({ courseId: COURSE_ID, isActive: true }).lean();
  if (!course) throw new Error(`Course not found: ${COURSE_ID}`);
  if (String(course.language || '').toLowerCase() !== 'id') {
    throw new Error(`Course language is not ID for ${COURSE_ID} (found: ${course.language})`);
  }

  const ccs = loadProductivityCCS();
  const ccsByDay = new Map<number, CCSLesson>();
  for (const l of ccs.lessons || []) ccsByDay.set(l.dayNumber, l);

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
    const oldScore = assessLessonQuality({ title: oldTitle, content: oldContent, language: 'id' });
    const oldIntegrity = validateLessonRecordLanguageIntegrity({
      language: 'id',
      content: oldContent,
      emailSubject: lesson.emailSubject || null,
      emailBody: lesson.emailBody || null,
    });

    const forceRefine = !oldIntegrity.ok;
    if (oldScore.score >= 70 && !forceRefine) {
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

    const requiredProcedureIds = (ccsLesson.requiredProcedures || []).filter(Boolean);
    const nextTitle = String(oldTitle || ccsLesson.canonicalTitle || `Produktivitas 2026 — Hari ${day}`).trim();
    const nextContent = buildIdLessonHtml({
      day,
      title: nextTitle,
      intent: buildIntentId(requiredProcedureIds),
      goals: buildGoalsId(requiredProcedureIds),
      requiredProcedureIds,
    });
    const nextScore = assessLessonQuality({ title: nextTitle, content: nextContent, language: 'id' });

    const emailSubject = `Produktivitas 2026 – Hari ${day}: ${nextTitle}`;
    const emailBody =
      `<h1>Produktivitas 2026 – Hari ${day}</h1>\n` +
      `<h2>${escapeHtml(nextTitle)}</h2>\n` +
      `<p>${escapeHtml(buildIntentId(requiredProcedureIds))}</p>\n` +
      `<p><a href=\"${appUrl}/id/courses/${COURSE_ID}/day/${day}\">Buka pelajaran →</a></p>`;

    const integrity = validateLessonRecordLanguageIntegrity({
      language: 'id',
      content: nextContent,
      emailSubject,
      emailBody,
    });

    planRows.push({
      day,
      lessonId: lesson.lessonId,
      title: nextTitle,
      action: 'REFINE',
      quality: { old: oldScore, next: nextScore },
      lengths: { oldChars: stripHtml(oldContent).length, nextChars: stripHtml(nextContent).length },
      applyEligible: nextScore.score >= 70 && integrity.ok,
      languageIntegrity: integrity,
    });

    if (!APPLY) continue;
    if (!integrity.ok) {
      throw new Error(
        `Language integrity failed for ${COURSE_ID} day ${day} (${lesson.lessonId}): ${integrity.errors[0] || 'unknown'}`
      );
    }
    if (nextScore.score < 70) {
      throw new Error(`Refined lesson score is still below 70 for ${COURSE_ID} day ${day} (${lesson.lessonId})`);
    }

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

    const update = await Lesson.updateOne(
      { _id: lesson._id },
      {
        $set: {
          title: nextTitle,
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

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

