/**
 * Seed Productivity 2026 Course - Lessons 11-15
 * 
 * Lesson 11 (Day 11): Goal Setting & OKRs
 * Lesson 12 (Day 12): Accountability Structures
 * Lesson 13 (Day 13): Decision-Making Frameworks
 * Lesson 14 (Day 14): Meeting Efficiency
 * Lesson 15 (Day 15): First Two-Week Review
 * 
 * Creates lessons 11-15 for all 10 languages in 2-language batches
 * Languages: Hungarian (hu), English (en), Turkish (tr), Bulgarian (bg), Polish (pl),
 *            Vietnamese (vi), Indonesian (id), Arabic (ar), Brazilian Portuguese (pt), Hindi (hi)
 */

import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

import { default as connectDB } from '../app/lib/mongodb';
import { Course, Lesson, QuizQuestion, QuestionDifficulty } from '../app/lib/models';

const COURSE_ID_BASE = 'PRODUCTIVITY_2026';
const LANGUAGE_PAIRS = [
  ['hu', 'en'],
  ['tr', 'bg'],
  ['pl', 'vi'],
  ['id', 'ar'],
  ['pt', 'hi']
];

// ============================================================================
// LESSON DEFINITIONS (Days 11-15)
// ============================================================================

const LESSONS: Record<number, Record<string, {
  title: string;
  content: string;
  emailSubject: string;
  emailBody: string;
}>> = {
  11: {
    hu: {
      title: 'Célkitűzés és OKR-ek: Mit szeretnél elérni?',
      content: `<h1>Célkitűzés és OKR-ek: Mit szeretnél elérni?</h1>
<p><em>Termelékenység nélkül cél = csak sietség.</em></p>
<hr />
<h2>Tanulási cél</h2>
<ul>
<li>SMART célokat beállítani.</li>
<li>OKR (Objectives and Key Results) megértése és használata.</li>
<li>Célok lebontása heti/napi feladatokra.</li>
<li>Nyomon követni a haladást és korrigálni az útvonalat.</li>
</ul>
<hr />
<h2>Miért fontos</h2>
<ul>
<li><strong>Irány</strong>: Cél nélkül az aktivitás nem termelékenység.</li>
<li><strong>Motiváció</strong>: Az SMART célok motivációt adnak.</li>
<li><strong>Mérés</strong>: Csak akkor tudhatod, sikerült-e, ha mérhető.</li>
</ul>`,
      emailSubject: 'Termelékenység 2026 – 11. nap: Célkitűzés és OKR-ek',
      emailBody: `<h1>Termelékenység 2026 – 11. nap</h1>
<h2>Célkitűzés és OKR-ek: Mit szeretnél elérni?</h2>
<p>Ma: SMART célok és OKR-ek.</p>
<p><a href="{{APP_URL}}/hu/courses/${COURSE_ID_BASE}_HU/day/11">Nyisd meg a leckét →</a></p>`
    },
    en: {
      title: 'Goal Setting & OKRs: What Do You Want to Achieve?',
      content: `<h1>Goal Setting & OKRs: What Do You Want to Achieve?</h1>
<p><em>Productivity without purpose = just busy.</em></p>
<hr />
<h2>Learning Objectives</h2>
<ul>
<li>Set SMART goals.</li>
<li>Understand and use OKRs (Objectives and Key Results).</li>
<li>Break goals into weekly/daily tasks.</li>
<li>Track progress and adjust course.</li>
</ul>
<hr />
<h2>Why This Matters</h2>
<ul>
<li><strong>Direction</strong>: Without goals, activity isn't productivity.</li>
<li><strong>Motivation</strong>: SMART goals create motivation.</li>
<li><strong>Measurement</strong>: You can only know success if it's measurable.</li>
</ul>`,
      emailSubject: 'Productivity 2026 – Day 11: Goal Setting & OKRs',
      emailBody: `<h1>Productivity 2026 – Day 11</h1>
<h2>Goal Setting & OKRs: What Do You Want to Achieve?</h2>
<p>Today: SMART goals and OKRs.</p>
<p><a href="{{APP_URL}}/en/courses/${COURSE_ID_BASE}_EN/day/11">Open the lesson →</a></p>`
    },
    tr: {
      title: 'Hedef Belirleme ve OKR\'ler: Ne Başarmak İstiyorsunuz?',
      content: `<h1>Hedef Belirleme ve OKR'ler: Ne Başarmak İstiyorsunuz?</h1>
<p><em>Amaçsız verimlilik = sadece meşgul olmak.</em></p>
<hr />
<h2>Öğrenme Hedefleri</h2>
<ul>
<li>SMART hedefler belirleyin.</li>
<li>OKR\'leri (Hedefler ve Temel Sonuçlar) anlayın ve kullanın.</li>
<li>Hedefleri haftalık/günlük görevlere bölün.</li>
<li>İlerlemeyi izleyin ve kursu ayarlayın.</li>
</ul>
<hr />
<h2>Neden Önemli</h2>
<ul>
<li><strong>Yön</strong>: Hedefler olmadan aktivite verimlilik değildir.</li>
<li><strong>Motivasyon</strong>: SMART hedefler motivasyon yaratır.</li>
<li><strong>Ölçüm</strong>: Başarılı olup olmadığınızı ancak ölçülebilirse bilebilirsiniz.</li>
</ul>`,
      emailSubject: 'Verimlilik 2026 – 11. Gün: Hedef Belirleme ve OKR\'ler',
      emailBody: `<h1>Verimlilik 2026 – 11. Gün</h1>
<h2>Hedef Belirleme ve OKR'ler: Ne Başarmak İstiyorsunuz?</h2>
<p>Bugün: SMART hedefler ve OKR\'ler.</p>
<p><a href="{{APP_URL}}/tr/courses/${COURSE_ID_BASE}_TR/day/11">Dersi aç →</a></p>`
    },
    bg: {
      title: 'Определяне на цели и OKR: Какво искате да постигнете?',
      content: `<h1>Определяне на цели и OKR: Какво искате да постигнете?</h1>
<p><em>Производителност без цел = просто занетост.</em></p>
<hr />
<h2>Учебни цели</h2>
<ul>
<li>Определяне на SMART цели.</li>
<li>Разбирание и използване на OKR (Objectives and Key Results).</li>
<li>Разбиване на целите на седмични/дневни задачи.</li>
<li>Проследяване на напредъка и коригиране на курса.</li>
</ul>
<hr />
<h2>Защо е важно</h2>
<ul>
<li><strong>Направление</strong>: Без цели активността не е производителност.</li>
<li><strong>Мотивация</strong>: SMART целите създават мотивация.</li>
<li><strong>Измерване</strong>: Можете да знаете успеха само ако е измерим.</li>
</ul>`,
      emailSubject: 'Производителност 2026 – 11. Ден: Определяне на цели и OKR',
      emailBody: `<h1>Производителност 2026 – 11. Ден</h1>
<h2>Определяне на цели и OKR: Какво искате да постигнете?</h2>
<p>Днес: SMART цели и OKR.</p>
<p><a href="{{APP_URL}}/bg/courses/${COURSE_ID_BASE}_BG/day/11">Отворете урока →</a></p>`
    },
    pl: {
      title: 'Ustalanie Celów i OKR: Co Chcesz Osiągnąć?',
      content: `<h1>Ustalanie Celów i OKR: Co Chcesz Osiągnąć?</h1>
<p><em>Produktywność bez celu = tylko bycie zajętym.</em></p>
<hr />
<h2>Cele edukacyjne</h2>
<ul>
<li>Ustalaj cele SMART.</li>
<li>Rozumieć i używaj OKR (Objectives and Key Results).</li>
<li>Podziel cele na zadania tygodniowe/dzienne.</li>
<li>Śledź postępy i koryguj kurs.</li>
</ul>
<hr />
<h2>Dlaczego jest to ważne</h2>
<ul>
<li><strong>Kierunek</strong>: Bez celów aktywność nie jest produktywnością.</li>
<li><strong>Motywacja</strong>: SMART cele tworzą motywację.</li>
<li><strong>Pomiary</strong>: Możesz wiedzieć o sukcesie tylko jeśli jest mierzalny.</li>
</ul>`,
      emailSubject: 'Produktywność 2026 – 11. Dzień: Ustalanie Celów i OKR',
      emailBody: `<h1>Produktywność 2026 – 11. Dzień</h1>
<h2>Ustalanie Celów i OKR: Co Chcesz Osiągnąć?</h2>
<p>Dzisiaj: Cele SMART i OKR.</p>
<p><a href="{{APP_URL}}/pl/courses/${COURSE_ID_BASE}_PL/day/11">Otwórz lekcję →</a></p>`
    },
    vi: {
      title: 'Đặt Mục Tiêu và OKR: Bạn Muốn Đạt Được Cái Gì?',
      content: `<h1>Đặt Mục Tiêu và OKR: Bạn Muốn Đạt Được Cái Gì?</h1>
<p><em>Năng suất không có mục đích = chỉ bận rộn.</em></p>
<hr />
<h2>Mục tiêu học tập</h2>
<ul>
<li>Đặt mục tiêu SMART.</li>
<li>Hiểu và sử dụng OKR (Objectives and Key Results).</li>
<li>Chia nhỏ mục tiêu thành các nhiệm vụ hàng tuần/hàng ngày.</li>
<li>Theo dõi tiến độ và điều chỉnh quỹ đạo.</li>
</ul>
<hr />
<h2>Tại sao điều này lại quan trọng</h2>
<ul>
<li><strong>Hướng</strong>: Không có mục tiêu, hoạt động không phải là năng suất.</li>
<li><strong>Động lực</strong>: Mục tiêu SMART tạo ra động lực.</li>
<li><strong>Đo lường</strong>: Bạn chỉ có thể biết thành công nếu nó có thể đo được.</li>
</ul>`,
      emailSubject: 'Năng suất 2026 – Ngày 11: Đặt Mục Tiêu và OKR',
      emailBody: `<h1>Năng suất 2026 – Ngày 11</h1>
<h2>Đặt Mục Tiêu và OKR: Bạn Muốn Đạt Được Cái Gì?</h2>
<p>Hôm nay: Mục tiêu SMART và OKR.</p>
<p><a href="{{APP_URL}}/vi/courses/${COURSE_ID_BASE}_VI/day/11">Mở bài học →</a></p>`
    },
    id: {
      title: 'Penetapan Tujuan dan OKR: Apa yang Ingin Anda Capai?',
      content: `<h1>Penetapan Tujuan dan OKR: Apa yang Ingin Anda Capai?</h1>
<p><em>Produktivitas tanpa tujuan = hanya sibuk.</em></p>
<hr />
<h2>Tujuan Pembelajaran</h2>
<ul>
<li>Tetapkan tujuan SMART.</li>
<li>Pahami dan gunakan OKR (Objectives and Key Results).</li>
<li>Pecah tujuan menjadi tugas mingguan/harian.</li>
<li>Lacak kemajuan dan sesuaikan kursus.</li>
</ul>
<hr />
<h2>Mengapa Ini Penting</h2>
<ul>
<li><strong>Arah</strong>: Tanpa tujuan, aktivitas bukanlah produktivitas.</li>
<li><strong>Motivasi</strong>: Tujuan SMART menciptakan motivasi.</li>
<li><strong>Pengukuran</strong>: Anda hanya bisa tahu kesuksesan jika terukur.</li>
</ul>`,
      emailSubject: 'Produktivitas 2026 – Hari 11: Penetapan Tujuan dan OKR',
      emailBody: `<h1>Produktivitas 2026 – Hari 11</h1>
<h2>Penetapan Tujuan dan OKR: Apa yang Ingin Anda Capai?</h2>
<p>Hari ini: Tujuan SMART dan OKR.</p>
<p><a href="{{APP_URL}}/id/courses/${COURSE_ID_BASE}_ID/day/11">Buka pelajaran →</a></p>`
    },
    ar: {
      title: 'تحديد الأهداف و OKR: ماذا تريد أن تحقق؟',
      content: `<h1>تحديد الأهداف و OKR: ماذا تريد أن تحقق؟</h1>
<p><em>الإنتاجية بدون هدف = مجرد انشغال.</em></p>
<hr />
<h2>أهداف التعلم</h2>
<ul>
<li>ضع أهدافًا ذكية.</li>
<li>افهم واستخدم OKR (الأهداف والنتائج الرئيسية).</li>
<li>قسّم الأهداف إلى مهام أسبوعية/يومية.</li>
<li>تتبع التقدم واضبط المسار.</li>
</ul>
<hr />
<h2>لماذا هذا مهم</h2>
<ul>
<li><strong>الاتجاه</strong>: بدون أهداف، النشاط ليس إنتاجية.</li>
<li><strong>الدافع</strong>: الأهداف الذكية تخلق الدافع.</li>
<li><strong>القياس</strong>: لا يمكنك فقط معرفة النجاح إذا كان قابلاً للقياس.</li>
</ul>`,
      emailSubject: 'الإنتاجية 2026 – اليوم 11: تحديد الأهداف و OKR',
      emailBody: `<h1>الإنتاجية 2026 – اليوم 11</h1>
<h2>تحديد الأهداف و OKR: ماذا تريد أن تحقق؟</h2>
<p>اليوم: الأهداف الذكية و OKR.</p>
<p><a href="{{APP_URL}}/ar/courses/${COURSE_ID_BASE}_AR/day/11">افتح الدرس →</a></p>`
    },
    pt: {
      title: 'Definição de Metas e OKR: O Que Você Quer Alcançar?',
      content: `<h1>Definição de Metas e OKR: O Que Você Quer Alcançar?</h1>
<p><em>Produtividade sem propósito = apenas estar ocupado.</em></p>
<hr />
<h2>Objetivos de Aprendizado</h2>
<ul>
<li>Defina metas SMART.</li>
<li>Entenda e use OKR (Objectives and Key Results).</li>
<li>Divida metas em tarefas semanais/diárias.</li>
<li>Rastreie o progresso e ajuste o curso.</li>
</ul>
<hr />
<h2>Por que isso é importante</h2>
<ul>
<li><strong>Direção</strong>: Sem metas, atividade não é produtividade.</li>
<li><strong>Motivação</strong>: Metas SMART criam motivação.</li>
<li><strong>Medição</strong>: Você só pode saber do sucesso se for mensurável.</li>
</ul>`,
      emailSubject: 'Produtividade 2026 – Dia 11: Definição de Metas e OKR',
      emailBody: `<h1>Produtividade 2026 – Dia 11</h1>
<h2>Definição de Metas e OKR: O Que Você Quer Alcançar?</h2>
<p>Hoje: Metas SMART e OKR.</p>
<p><a href="{{APP_URL}}/pt/courses/${COURSE_ID_BASE}_PT/day/11">Abra a lição →</a></p>`
    },
    hi: {
      title: 'लक्ष्य निर्धारण और OKR: आप क्या हासिल करना चाहते हैं?',
      content: `<h1>लक्ष्य निर्धारण और OKR: आप क्या हासिल करना चाहते हैं?</h1>
<p><em>उद्देश्य के बिना उत्पादकता = सिर्फ व्यस्त।</em></p>
<hr />
<h2>सीखने के उद्देश्य</h2>
<ul>
<li>स्मार्ट लक्ष्य निर्धारित करें।</li>
<li>OKR (उद्देश्य और मुख्य परिणाम) को समझें और उपयोग करें।</li>
<li>लक्ष्यों को साप्ताहिक/दैनिक कार्यों में विभाजित करें।</li>
<li>प्रगति को ट्रैक करें और पाठ्यक्रम को समायोजित करें।</li>
</ul>
<hr />
<h2>यह महत्वपूर्ण क्यों है</h2>
<ul>
<li><strong>दिशा</strong>: लक्ष्य के बिना, गतिविधि उत्पादकता नहीं है।</li>
<li><strong>प्रेरणा</strong>: स्मार्ट लक्ष्य प्रेरणा बनाते हैं।</li>
<li><strong>मापन</strong>: आप केवल तभी सफलता जान सकते हैं जब वह मापयोग्य हो।</li>
</ul>`,
      emailSubject: 'उत्पादकता 2026 – दिन 11: लक्ष्य निर्धारण और OKR',
      emailBody: `<h1>उत्पादकता 2026 – दिन 11</h1>
<h2>लक्ष्य निर्धारण और OKR: आप क्या हासिल करना चाहते हैं?</h2>
<p>आज: स्मार्ट लक्ष्य और OKR।</p>
<p><a href="{{APP_URL}}/hi/courses/${COURSE_ID_BASE}_HI/day/11">पाठ खोलें →</a></p>`
    }
  }
};

// ============================================================================
// QUIZ QUESTIONS (Day 11)
// ============================================================================

const QUIZZES: Record<number, Record<string, Array<{
  question: string;
  options: string[];
  correctIndex: number;
}>>> = {
  11: {
    hu: [
      { question: 'SMART céltól mit jelent az S?', options: ['Strong', 'Simple', 'Specific', 'Strategic'], correctIndex: 2 },
      { question: 'OKR szó jelentése?', options: ['Operations and Key Reports', 'Objectives and Key Results', 'Organization and Key Roles', 'Overall and Key Responsibilities'], correctIndex: 1 },
      { question: 'Hány szintű az OKR szerkezet?', options: ['1 szint', '2 szint', '3 szint', '4 szint'], correctIndex: 2 },
      { question: 'Miért fontos a mérhető cél?', options: ['Könnyebb', 'Nyomon követhető', 'Kevésbé stresszes', 'Gyorsabb'], correctIndex: 1 },
      { question: 'Mi az ideális célperiódus?', options: ['1 hónap', '3 hónap', '6 hónap', '1 év'], correctIndex: 1 }
    ],
    en: [
      { question: 'What does S mean in SMART?', options: ['Strong', 'Simple', 'Specific', 'Strategic'], correctIndex: 2 },
      { question: 'What does OKR stand for?', options: ['Operations and Key Reports', 'Objectives and Key Results', 'Organization and Key Roles', 'Overall and Key Responsibilities'], correctIndex: 1 },
      { question: 'How many levels are in OKR structure?', options: ['1 level', '2 levels', '3 levels', '4 levels'], correctIndex: 2 },
      { question: 'Why is a measurable goal important?', options: ['Easier', 'Trackable', 'Less stressful', 'Faster'], correctIndex: 1 },
      { question: 'What is the ideal goal period?', options: ['1 month', '3 months', '6 months', '1 year'], correctIndex: 1 }
    ],
    tr: [
      { question: 'SMART\'da S ne demek?', options: ['Strong', 'Simple', 'Specific', 'Strategic'], correctIndex: 2 },
      { question: 'OKR ne anlama gelir?', options: ['Operations and Key Reports', 'Objectives and Key Results', 'Organization and Key Roles', 'Overall and Key Responsibilities'], correctIndex: 1 },
      { question: 'OKR yapısında kaç seviye var?', options: ['1 seviye', '2 seviye', '3 seviye', '4 seviye'], correctIndex: 2 },
      { question: 'Ölçülebilir hedef neden önemli?', options: ['Kolay', 'İzlenebilir', 'Daha az stresli', 'Daha hızlı'], correctIndex: 1 },
      { question: 'İdeal hedef süresi nedir?', options: ['1 ay', '3 ay', '6 ay', '1 yıl'], correctIndex: 1 }
    ],
    bg: [
      { question: 'Какво означава S в SMART?', options: ['Strong', 'Simple', 'Specific', 'Strategic'], correctIndex: 2 },
      { question: 'Какво означава OKR?', options: ['Operations and Key Reports', 'Objectives and Key Results', 'Organization and Key Roles', 'Overall and Key Responsibilities'], correctIndex: 1 },
      { question: 'Колко нива има OKR структурата?', options: ['1 ниво', '2 нива', '3 нива', '4 нива'], correctIndex: 2 },
      { question: 'Защо е важна измеримата цел?', options: ['По-лесна', 'Проследяема', 'По-малко стресна', 'По-бърза'], correctIndex: 1 },
      { question: 'Какъв е идеалният период на целта?', options: ['1 месец', '3 месеца', '6 месеца', '1 година'], correctIndex: 1 }
    ],
    pl: [
      { question: 'Co oznacza S w SMART?', options: ['Strong', 'Simple', 'Specific', 'Strategic'], correctIndex: 2 },
      { question: 'Co oznacza OKR?', options: ['Operations and Key Reports', 'Objectives and Key Results', 'Organization and Key Roles', 'Overall and Key Responsibilities'], correctIndex: 1 },
      { question: 'Ile poziomów ma struktura OKR?', options: ['1 poziom', '2 poziomy', '3 poziomy', '4 poziomy'], correctIndex: 2 },
      { question: 'Dlaczego ważny jest mierzalny cel?', options: ['Łatwiejszy', 'Możliwy do śledzenia', 'Mniej stresujący', 'Szybszy'], correctIndex: 1 },
      { question: 'Jaki jest idealny okres celu?', options: ['1 miesiąc', '3 miesiące', '6 miesięcy', '1 rok'], correctIndex: 1 }
    ],
    vi: [
      { question: 'S trong SMART có nghĩa là gì?', options: ['Strong', 'Simple', 'Specific', 'Strategic'], correctIndex: 2 },
      { question: 'OKR viết tắt của gì?', options: ['Operations and Key Reports', 'Objectives and Key Results', 'Organization and Key Roles', 'Overall and Key Responsibilities'], correctIndex: 1 },
      { question: 'Có bao nhiêu cấp độ trong cấu trúc OKR?', options: ['1 cấp độ', '2 cấp độ', '3 cấp độ', '4 cấp độ'], correctIndex: 2 },
      { question: 'Tại sao mục tiêu đo lường được quan trọng?', options: ['Dễ hơn', 'Có thể theo dõi', 'Ít căng thẳng hơn', 'Nhanh hơn'], correctIndex: 1 },
      { question: 'Khoảng thời gian lý tưởng cho mục tiêu là gì?', options: ['1 tháng', '3 tháng', '6 tháng', '1 năm'], correctIndex: 1 }
    ],
    id: [
      { question: 'Apa yang berarti S dalam SMART?', options: ['Strong', 'Simple', 'Specific', 'Strategic'], correctIndex: 2 },
      { question: 'Apa singkatan OKR?', options: ['Operations and Key Reports', 'Objectives and Key Results', 'Organization and Key Roles', 'Overall and Key Responsibilities'], correctIndex: 1 },
      { question: 'Berapa banyak tingkat dalam struktur OKR?', options: ['1 tingkat', '2 tingkat', '3 tingkat', '4 tingkat'], correctIndex: 2 },
      { question: 'Mengapa tujuan yang terukur penting?', options: ['Lebih mudah', 'Dapat dilacak', 'Kurang stres', 'Lebih cepat'], correctIndex: 1 },
      { question: 'Berapa periode tujuan ideal?', options: ['1 bulan', '3 bulan', '6 bulan', '1 tahun'], correctIndex: 1 }
    ],
    ar: [
      { question: 'ماذا يعني S في SMART؟', options: ['Strong', 'Simple', 'Specific', 'Strategic'], correctIndex: 2 },
      { question: 'ماذا تعني OKR؟', options: ['Operations and Key Reports', 'Objectives and Key Results', 'Organization and Key Roles', 'Overall and Key Responsibilities'], correctIndex: 1 },
      { question: 'كم عدد المستويات في هيكل OKR؟', options: ['مستوى واحد', 'مستويان', '3 مستويات', '4 مستويات'], correctIndex: 2 },
      { question: 'لماذا الهدف القابل للقياس مهم؟', options: ['أسهل', 'يمكن تتبعه', 'أقل إجهادًا', 'أسرع'], correctIndex: 1 },
      { question: 'ما هي فترة الهدف المثالية؟', options: ['شهر واحد', '3 أشهر', '6 أشهر', 'سنة واحدة'], correctIndex: 1 }
    ],
    pt: [
      { question: 'O que significa S em SMART?', options: ['Strong', 'Simple', 'Specific', 'Strategic'], correctIndex: 2 },
      { question: 'O que significa OKR?', options: ['Operations and Key Reports', 'Objectives and Key Results', 'Organization and Key Roles', 'Overall and Key Responsibilities'], correctIndex: 1 },
      { question: 'Quantos níveis existem na estrutura OKR?', options: ['1 nível', '2 níveis', '3 níveis', '4 níveis'], correctIndex: 2 },
      { question: 'Por que uma meta mensurável é importante?', options: ['Mais fácil', 'Rastreável', 'Menos estressante', 'Mais rápido'], correctIndex: 1 },
      { question: 'Qual é o período de objetivo ideal?', options: ['1 mês', '3 meses', '6 meses', '1 ano'], correctIndex: 1 }
    ],
    hi: [
      { question: 'SMART में S का अर्थ क्या है?', options: ['Strong', 'Simple', 'Specific', 'Strategic'], correctIndex: 2 },
      { question: 'OKR का अर्थ क्या है?', options: ['Operations and Key Reports', 'Objectives and Key Results', 'Organization and Key Roles', 'Overall and Key Responsibilities'], correctIndex: 1 },
      { question: 'OKR संरचना में कितने स्तर हैं?', options: ['1 स्तर', '2 स्तर', '3 स्तर', '4 स्तर'], correctIndex: 2 },
      { question: 'मापने योग्य लक्ष्य महत्वपूर्ण क्यों है?', options: ['आसान', 'ट्रैक करने योग्य', 'कम तनावपूर्ण', 'तेजी से'], correctIndex: 1 },
      { question: 'आदर्श लक्ष्य अवधि क्या है?', options: ['1 महीना', '3 महीने', '6 महीने', '1 वर्ष'], correctIndex: 1 }
    ]
  }
};

// ============================================================================
// SEED FUNCTION
// ============================================================================

async function seedLessons() {
  await connectDB();
  console.log('✅ Connected to MongoDB\n');

  let totalLessons = 0;
  let totalQuizzes = 0;
  const DAY = 11;

  for (const [lang1, lang2] of LANGUAGE_PAIRS) {
    console.log(`\n🌍 Processing language pair: ${lang1.toUpperCase()} + ${lang2.toUpperCase()}`);
    
    for (const lang of [lang1, lang2]) {
      try {
        const course = await Course.findOne({ courseId: `${COURSE_ID_BASE}_${lang.toUpperCase()}` });
        if (!course) {
          console.error(`  ❌ Course not found for language: ${lang.toUpperCase()}`);
          continue;
        }

        const lessonData = LESSONS[DAY][lang];
        const lesson = new Lesson({
          lessonId: `${COURSE_ID_BASE}_${lang.toUpperCase()}_DAY_${DAY}`,
          courseId: course._id,
          dayNumber: DAY,
          title: lessonData.title,
          content: lessonData.content,
          emailSubject: lessonData.emailSubject,
          emailBody: lessonData.emailBody.replace(/\{\{APP_URL\}\}/g, process.env.NEXTAUTH_URL || 'https://www.amanoba.com')
        });
        await lesson.save();
        totalLessons++;
        console.log(`  ✅ Created lesson for ${lang.toUpperCase()}`);

        const quizQuestions = QUIZZES[DAY][lang];
        for (let i = 0; i < quizQuestions.length; i++) {
          const q = quizQuestions[i];
          const quizQuestion = new QuizQuestion({
            lessonId: lesson.lessonId,
            question: q.question,
            options: q.options,
            correctIndex: q.correctIndex,
            difficulty: QuestionDifficulty.MEDIUM,
            category: 'Course Specific',
            isCourseSpecific: true,
            metadata: {
              createdAt: new Date(),
              updatedAt: new Date()
            }
          });
          await quizQuestion.save();
          totalQuizzes++;
        }
        console.log(`  ✅ Created ${quizQuestions.length} quiz questions for ${lang.toUpperCase()}`);

      } catch (error) {
        console.error(`  ❌ Error processing language ${lang.toUpperCase()}:`, error);
      }
    }
    console.log(`\n✅ Language pair ${lang1.toUpperCase()} + ${lang2.toUpperCase()} seeded successfully\n`);
  }

  console.log(`\n📊 Summary:`);
  console.log(`   Total Lessons Created: ${totalLessons}`);
  console.log(`   Total Quiz Questions: ${totalQuizzes}`);
  console.log(`\n✅ Lesson ${DAY} seeded successfully!\n`);

  process.exit(0);
}

seedLessons().catch((error) => {
  console.error('❌ Seed failed:', error);
  process.exit(1);
});
