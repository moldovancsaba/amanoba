/**
 * Seed Productivity 2026 Course - 10 Languages
 * 
 * Creates the Productivity 2026 course with Lesson 1 and Quiz 1 in:
 * - Hungarian (hu) ✅
 * - English (en) ✅
 * - Turkish (tr) - UI translation needed
 * - Bulgarian (bg) - UI translation needed
 * - Polish (pl) - UI translation needed
 * - Vietnamese (vi) - UI translation needed
 * - Indonesian (id) - UI translation needed
 * - Arabic (ar) - UI translation needed
 * - Brazilian Portuguese (pt) - UI translation needed
 * - Hindi (hi) - UI translation needed
 * 
 * Also creates UI translation files for missing languages.
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import * as fs from 'fs';

config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import {
  Brand,
  Course,
  Lesson,
  QuizQuestion,
  QuestionDifficulty
} from '../app/lib/models';

const COURSE_ID_BASE = 'PRODUCTIVITY_2026';

// ============================================================================
// COURSE METADATA
// ============================================================================

const COURSE_NAMES: Record<string, string> = {
  hu: 'Termelékenység 2026: Hogyan kezelj csapatokat és időt',
  en: 'Productivity 2026: How to Manage Teams and Time',
  tr: 'Verimlilik 2026: Ekipler ve Zaman Nasıl Yönetilir',
  bg: 'Продуктивност 2026: Как да управляваме екипи и време',
  pl: 'Produktywność 2026: Jak zarządzać zespołami i czasem',
  vi: 'Năng suất 2026: Cách quản lý nhóm và thời gian',
  id: 'Produktivitas 2026: Cara Mengelola Tim dan Waktu',
  ar: 'الإنتاجية 2026: كيفية إدارة الفرق والوقت',
  pt: 'Produtividade 2026: Como Gerenciar Equipes e Tempo',
  hi: 'उत्पादकता 2026: टीमों और समय का प्रबंधन कैसे करें',
};

const COURSE_DESCRIPTIONS: Record<string, string> = {
  hu: '30 napos gyakorlati kurzus a termelékenység alapjairól, GTD-ről, prioritizálásról, Kanban-ról, agilis módszerekről és stratégiai tervezésről. Minden nap 20-30 perces leckék, konkrét eszközök és sablonok.',
  en: '30-day practical course on productivity foundations, GTD, prioritization, Kanban, agile methods, and strategic planning. Daily 20-30 minute lessons with concrete tools and templates.',
  tr: 'Verimlilik temelleri, GTD, önceliklendirme, Kanban, çevik yöntemler ve stratejik planlama üzerine 30 günlük pratik kurs. Günlük 20-30 dakikalık dersler, somut araçlar ve şablonlarla.',
  bg: '30-дневен практически курс за основи на продуктивността, GTD, приоритизиране, Kanban, гъвкави методи и стратегическо планиране. Дневни уроци от 20-30 минути с конкретни инструменти и шаблони.',
  pl: '30-dniowy praktyczny kurs o podstawach produktywności, GTD, priorytetyzacji, Kanban, metodach zwinnych i planowaniu strategicznym. Codzienne lekcje 20-30 minutowe z konkretnymi narzędziami i szablonami.',
  vi: 'Khóa học thực hành 30 ngày về nền tảng năng suất, GTD, ưu tiên, Kanban, phương pháp linh hoạt và lập kế hoạch chiến lược. Bài học hàng ngày 20-30 phút với công cụ và mẫu cụ thể.',
  id: 'Kursus praktis 30 hari tentang dasar-dasar produktivitas, GTD, prioritisasi, Kanban, metode agile, dan perencanaan strategis. Pelajaran harian 20-30 menit dengan alat dan template konkret.',
  ar: 'دورة عملية لمدة 30 يومًا حول أساسيات الإنتاجية وGTD والأولويات وKanban والطرق الرشيقة والتخطيط الاستراتيجي. دروس يومية من 20-30 دقيقة مع أدوات وقوالب ملموسة.',
  pt: 'Curso prático de 30 dias sobre fundamentos de produtividade, GTD, priorização, Kanban, métodos ágeis e planejamento estratégico. Lições diárias de 20-30 minutos com ferramentas e modelos concretos.',
  hi: 'उत्पादकता की नींव, GTD, प्राथमिकता, कानबन, चुस्त तरीकों और रणनीतिक योजना पर 30 दिवसीय व्यावहारिक पाठ्यक्रम। दैनिक 20-30 मिनट के पाठ, ठोस उपकरणों और टेम्प्लेट के साथ।',
};

// ============================================================================
// LESSON 1 CONTENT (Day 1: Productivity definition: output, outcomes, and constraints)
// ============================================================================

interface LessonContent {
  title: string;
  content: string;
  emailSubject: string;
  emailBody: string;
}

const LESSON_1: Record<string, LessonContent> = {
  hu: {
    title: 'A termelékenység definíciója: output, eredmények és korlátok',
    content: `<h1>A termelékenység definíciója: output, eredmények és korlátok</h1>
<p><em>Az első lépés: tisztázzuk, mit is mérünk valójában</em></p>
<hr />
<h2>Tanulási cél</h2>
<ul>
<li>Megérteni a különbséget az output (kimenet) és az outcome (eredmény) között.</li>
<li>Azonosítani a saját korlátokat (idő, energia, figyelem, erőforrások).</li>
<li>Létrehozni egy személyes termelékenységi definíciót.</li>
</ul>
<hr />
<h2>Miért fontos</h2>
<ul>
<li>Az output a tevékenység mennyisége (hány email, hány meeting).</li>
<li>Az outcome az, amit elérsz (megoldott probléma, elégedett ügyfél, növekvő bevétel).</li>
<li>A termelékenység = outcome / korlátok. Nem a tevékenység mennyisége számít, hanem az eredmény a korlátokhoz viszonyítva.</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<h3>Output vs Outcome</h3>
<p><strong>Output</strong>: A tevékenységek száma vagy mennyisége. Például: 50 email küldése, 8 óra meeting, 20 dokumentum írása.</p>
<p><strong>Outcome</strong>: A tényleges változás vagy eredmény. Például: 3 új ügyfél, 20% növekvő elégedettség, projekt határidőn belül kész.</p>
<p><strong>Kulcs</strong>: Sok output nem garantál jó outcome-ot. A cél az outcome maximalizálása, nem az output növelése.</p>

<h3>Korlátok azonosítása</h3>
<p>Minden rendszernek vannak korlátai. A termelékenység növelése azt jelenti, hogy ezeket a korlátokat kezeled:</p>
<ul>
<li><strong>Idő</strong>: Hány órád van naponta? Melyik időszakokban vagy a leghatékonyabb?</li>
<li><strong>Energia</strong>: Mikor vagy friss? Mikor vagy kimerült? Milyen tevékenységek töltik fel, melyek merítenek?</li>
<li><strong>Figyelem</strong>: Mennyi ideig tudsz koncentrálni? Milyen tényezők zavarnak?</li>
<li><strong>Erőforrások</strong>: Milyen eszközök, emberek, információk állnak rendelkezésre?</li>
</ul>

<h3>Gyakorlati példa</h3>
<p><strong>Hibás megközelítés</strong>: "Ma 100 emailt küldök el!" (output fókusz)</p>
<p><strong>Helyes megközelítés</strong>: "Ma 3 kritikus ügyfélproblémát oldok meg, ami 15% növeli az elégedettséget." (outcome fókusz)</p>
<p>A második esetben lehet, hogy csak 10 emailt küldesz, de az outcome jelentősen jobb.</p>
<hr />
<h2>Gyakorlati feladat (15-20 perc) — Személyes termelékenységi definíció</h2>
<ol>
<li><strong>Output lista</strong>: Írd le, milyen tevékenységeket végzel naponta (email, meeting, dokumentumok, stb.).</li>
<li><strong>Outcome lista</strong>: Minden tevékenységhez írd le, mi a tényleges eredmény vagy cél (mit szeretnél elérni).</li>
<li><strong>Korlátok lista</strong>: Azonosítsd a saját korlátjaidat:
   <ul>
   <li>Mennyi időd van naponta?</li>
   <li>Mikor vagy a leghatékonyabb?</li>
   <li>Milyen erőforrások hiányoznak?</li>
   </ul>
</li>
<li><strong>Személyes definíció</strong>: Írd le 2-3 mondatban: "Számomra a termelékenység azt jelenti, hogy..."</li>
</ol>
<hr />
<h2>Önellenőrzés</h2>
<ul>
<li>✅ Különbséget teszel az output és outcome között.</li>
<li>✅ Azonosítottad a saját korlátjaidat (idő, energia, figyelem, erőforrások).</li>
<li>✅ Van egy személyes termelékenységi definíciód.</li>
<li>✅ Tudod, hogy a cél az outcome maximalizálása, nem az output növelése.</li>
</ul>
<hr />
<h2>Opcionális mélyítés</h2>
<ul>
<li>David Allen: "Getting Things Done" — az outcome-alapú gondolkodás alapjai</li>
<li>Eliyahu Goldratt: "The Goal" — a korlátok kezeléséről</li>
<li>Cal Newport: "Deep Work" — a mély munkáról és a figyelem korlátairól</li>
</ul>`,
    emailSubject: 'Termelékenység 2026 – 1. nap: A termelékenység definíciója',
    emailBody: `<h1>Termelékenység 2026 – 1. nap</h1>
<h2>A termelékenység definíciója: output, eredmények és korlátok</h2>
<p>Ma megtanulod a különbséget az output és outcome között, és azonosítod a saját korlátjaidat.</p>
<p><a href="{{APP_URL}}/hu/courses/${COURSE_ID_BASE}_HU/day/1">Nyisd meg a leckét →</a></p>`
  },
  en: {
    title: 'Productivity definition: output, outcomes, and constraints',
    content: `<h1>Productivity definition: output, outcomes, and constraints</h1>
<p><em>Step one: clarify what we're actually measuring</em></p>
<hr />
<h2>Learning goal</h2>
<ul>
<li>Understand the difference between output (activity) and outcome (result).</li>
<li>Identify your personal constraints (time, energy, attention, resources).</li>
<li>Create a personal productivity definition.</li>
</ul>
<hr />
<h2>Why it matters</h2>
<ul>
<li>Output is the quantity of activity (how many emails, how many meetings).</li>
<li>Outcome is what you achieve (solved problem, satisfied client, growing revenue).</li>
<li>Productivity = outcome / constraints. It's not about activity volume, but results relative to your limits.</li>
</ul>
<hr />
<h2>Explanation</h2>
<h3>Output vs Outcome</h3>
<p><strong>Output</strong>: The number or quantity of activities. For example: sending 50 emails, 8 hours of meetings, writing 20 documents.</p>
<p><strong>Outcome</strong>: The actual change or result. For example: 3 new clients, 20% increase in satisfaction, project completed on deadline.</p>
<p><strong>Key</strong>: High output doesn't guarantee good outcomes. The goal is to maximize outcomes, not increase output.</p>

<h3>Identifying Constraints</h3>
<p>Every system has constraints. Increasing productivity means managing these constraints:</p>
<ul>
<li><strong>Time</strong>: How many hours do you have daily? When are you most effective?</li>
<li><strong>Energy</strong>: When are you fresh? When are you drained? What activities energize you, what depletes you?</li>
<li><strong>Attention</strong>: How long can you focus? What factors distract you?</li>
<li><strong>Resources</strong>: What tools, people, information are available?</li>
</ul>

<h3>Practical Example</h3>
<p><strong>Wrong approach</strong>: "Today I'll send 100 emails!" (output focus)</p>
<p><strong>Right approach</strong>: "Today I'll solve 3 critical client problems, which increases satisfaction by 15%." (outcome focus)</p>
<p>In the second case, you might only send 10 emails, but the outcome is significantly better.</p>
<hr />
<h2>Practical exercise (15-20 min) — Personal productivity definition</h2>
<ol>
<li><strong>Output list</strong>: Write down what activities you do daily (emails, meetings, documents, etc.).</li>
<li><strong>Outcome list</strong>: For each activity, write what the actual result or goal is (what you want to achieve).</li>
<li><strong>Constraints list</strong>: Identify your personal constraints:
   <ul>
   <li>How much time do you have daily?</li>
   <li>When are you most effective?</li>
   <li>What resources are missing?</li>
   </ul>
</li>
<li><strong>Personal definition</strong>: Write in 2-3 sentences: "For me, productivity means..."</li>
</ol>
<hr />
<h2>Self-check</h2>
<ul>
<li>✅ You distinguish between output and outcome.</li>
<li>✅ You've identified your personal constraints (time, energy, attention, resources).</li>
<li>✅ You have a personal productivity definition.</li>
<li>✅ You know the goal is to maximize outcomes, not increase output.</li>
</ul>
<hr />
<h2>Optional deepening</h2>
<ul>
<li>David Allen: "Getting Things Done" — foundations of outcome-based thinking</li>
<li>Eliyahu Goldratt: "The Goal" — about managing constraints</li>
<li>Cal Newport: "Deep Work" — about deep work and attention constraints</li>
</ul>`,
    emailSubject: 'Productivity 2026 – Day 1: Productivity definition',
    emailBody: `<h1>Productivity 2026 – Day 1</h1>
<h2>Productivity definition: output, outcomes, and constraints</h2>
<p>Today you'll learn the difference between output and outcome, and identify your personal constraints.</p>
<p><a href="{{APP_URL}}/en/courses/${COURSE_ID_BASE}_EN/day/1">Open the lesson →</a></p>`
  },
  tr: {
    title: 'Verimlilik tanımı: çıktı, sonuçlar ve kısıtlamalar',
    content: `<h1>Verimlilik tanımı: çıktı, sonuçlar ve kısıtlamalar</h1>
<p><em>İlk adım: gerçekte neyi ölçtüğümüzü netleştirmek</em></p>
<hr />
<h2>Öğrenme hedefi</h2>
<ul>
<li>Çıktı (aktivite) ve sonuç (etki) arasındaki farkı anlamak.</li>
<li>Kişisel kısıtlamalarınızı belirlemek (zaman, enerji, dikkat, kaynaklar).</li>
<li>Kişisel bir verimlilik tanımı oluşturmak.</li>
</ul>
<hr />
<h2>Neden önemli</h2>
<ul>
<li>Çıktı, aktivitenin miktarıdır (kaç e-posta, kaç toplantı).</li>
<li>Sonuç, ulaştığınız şeydir (çözülen problem, memnun müşteri, artan gelir).</li>
<li>Verimlilik = sonuç / kısıtlamalar. Aktivite hacmi değil, sınırlarınıza göre sonuçlar önemlidir.</li>
</ul>
<hr />
<h2>Açıklama</h2>
<h3>Çıktı vs Sonuç</h3>
<p><strong>Çıktı</strong>: Aktivitelerin sayısı veya miktarı. Örneğin: 50 e-posta gönderme, 8 saat toplantı, 20 belge yazma.</p>
<p><strong>Sonuç</strong>: Gerçek değişim veya etki. Örneğin: 3 yeni müşteri, %20 memnuniyet artışı, proje teslim tarihinde tamamlandı.</p>
<p><strong>Anahtar</strong>: Yüksek çıktı, iyi sonuçları garanti etmez. Amaç sonuçları maksimize etmek, çıktıyı artırmak değil.</p>

<h3>Kısıtlamaları Belirleme</h3>
<p>Her sistemin kısıtlamaları vardır. Verimliliği artırmak, bu kısıtlamaları yönetmek anlamına gelir:</p>
<ul>
<li><strong>Zaman</strong>: Günlük kaç saatiniz var? Ne zaman en etkili olursunuz?</li>
<li><strong>Enerji</strong>: Ne zaman dinçsiniz? Ne zaman tükenmişsiniz? Hangi aktiviteler sizi enerjilendirir, hangileri tüketir?</li>
<li><strong>Dikkat</strong>: Ne kadar süre odaklanabilirsiniz? Hangi faktörler dikkatinizi dağıtır?</li>
<li><strong>Kaynaklar</strong>: Hangi araçlar, insanlar, bilgiler mevcut?</li>
</ul>

<h3>Pratik Örnek</h3>
<p><strong>Yanlış yaklaşım</strong>: "Bugün 100 e-posta göndereceğim!" (çıktı odaklı)</p>
<p><strong>Doğru yaklaşım</strong>: "Bugün 3 kritik müşteri problemini çözeceğim, bu da memnuniyeti %15 artırır." (sonuç odaklı)</p>
<p>İkinci durumda sadece 10 e-posta gönderebilirsiniz, ancak sonuç önemli ölçüde daha iyidir.</p>
<hr />
<h2>Pratik alıştırma (15-20 dakika) — Kişisel verimlilik tanımı</h2>
<ol>
<li><strong>Çıktı listesi</strong>: Günlük yaptığınız aktiviteleri yazın (e-postalar, toplantılar, belgeler, vb.).</li>
<li><strong>Sonuç listesi</strong>: Her aktivite için gerçek sonuç veya hedefi yazın (ne elde etmek istediğiniz).</li>
<li><strong>Kısıtlamalar listesi</strong>: Kişisel kısıtlamalarınızı belirleyin:
   <ul>
   <li>Günlük ne kadar zamanınız var?</li>
   <li>Ne zaman en etkili olursunuz?</li>
   <li>Hangi kaynaklar eksik?</li>
   </ul>
</li>
<li><strong>Kişisel tanım</strong>: 2-3 cümlede yazın: "Benim için verimlilik şu anlama gelir..."</li>
</ol>
<hr />
<h2>Kendi kendini kontrol</h2>
<ul>
<li>✅ Çıktı ve sonuç arasında ayrım yapıyorsunuz.</li>
<li>✅ Kişisel kısıtlamalarınızı belirlediniz (zaman, enerji, dikkat, kaynaklar).</li>
<li>✅ Kişisel bir verimlilik tanımınız var.</li>
<li>✅ Amaç sonuçları maksimize etmek, çıktıyı artırmak olmadığını biliyorsunuz.</li>
</ul>
<hr />
<h2>İsteğe bağlı derinleştirme</h2>
<ul>
<li>David Allen: "Getting Things Done" — sonuç odaklı düşüncenin temelleri</li>
<li>Eliyahu Goldratt: "The Goal" — kısıtlamaları yönetme hakkında</li>
<li>Cal Newport: "Deep Work" — derin çalışma ve dikkat kısıtlamaları hakkında</li>
</ul>`,
    emailSubject: 'Verimlilik 2026 – 1. Gün: Verimlilik tanımı',
    emailBody: `<h1>Verimlilik 2026 – 1. Gün</h1>
<h2>Verimlilik tanımı: çıktı, sonuçlar ve kısıtlamalar</h2>
<p>Bugün çıktı ve sonuç arasındaki farkı öğrenecek ve kişisel kısıtlamalarınızı belirleyeceksiniz.</p>
<p><a href="{{APP_URL}}/tr/courses/${COURSE_ID_BASE}_TR/day/1">Dersi aç →</a></p>`
  },
  bg: {
    title: 'Дефиниция на продуктивността: изход, резултати и ограничения',
    content: `<h1>Дефиниция на продуктивността: изход, резултати и ограничения</h1>
<p><em>Стъпка едно: изясняваме какво всъщност измерваме</em></p>
<hr />
<h2>Учебна цел</h2>
<ul>
<li>Да разберете разликата между изход (дейност) и резултат (ефект).</li>
<li>Да идентифицирате личните си ограничения (време, енергия, внимание, ресурси).</li>
<li>Да създадете лична дефиниция на продуктивността.</li>
</ul>
<hr />
<h2>Защо е важно</h2>
<ul>
<li>Изходът е количеството дейности (колко имейли, колко срещи).</li>
<li>Резултатът е това, което постигате (решен проблем, доволен клиент, нарастващи приходи).</li>
<li>Продуктивност = резултат / ограничения. Не става въпрос за обем на дейностите, а за резултати спрямо вашите граници.</li>
</ul>
<hr />
<h2>Обяснение</h2>
<h3>Изход срещу Резултат</h3>
<p><strong>Изход</strong>: Броят или количеството дейности. Например: изпращане на 50 имейла, 8 часа срещи, писане на 20 документа.</p>
<p><strong>Резултат</strong>: Действителната промяна или ефект. Например: 3 нови клиента, 20% увеличение на удовлетвореността, проект завършен навреме.</p>
<p><strong>Ключ</strong>: Висок изход не гарантира добри резултати. Целта е да максимизираме резултатите, а не да увеличаваме изхода.</p>

<h3>Идентифициране на ограниченията</h3>
<p>Всяка система има ограничения. Увеличаването на продуктивността означава управление на тези ограничения:</p>
<ul>
<li><strong>Време</strong>: Колко часа имате дневно? Кога сте най-ефективни?</li>
<li><strong>Енергия</strong>: Кога сте свежи? Кога сте изтощени? Какви дейности ви зареждат, какви ви изтощават?</li>
<li><strong>Внимание</strong>: Колко дълго можете да се концентрирате? Какви фактори ви разсейват?</li>
<li><strong>Ресурси</strong>: Какви инструменти, хора, информация са налични?</li>
</ul>

<h3>Практически пример</h3>
<p><strong>Грешен подход</strong>: "Днес ще изпратя 100 имейла!" (фокус върху изхода)</p>
<p><strong>Правилен подход</strong>: "Днес ще реша 3 критични клиентски проблема, което увеличава удовлетвореността с 15%." (фокус върху резултата)</p>
<p>Във втория случай може да изпратите само 10 имейла, но резултатът е значително по-добър.</p>
<hr />
<h2>Практическо упражнение (15-20 мин) — Лична дефиниция на продуктивността</h2>
<ol>
<li><strong>Списък с изходи</strong>: Напишете какви дейности извършвате дневно (имейли, срещи, документи и т.н.).</li>
<li><strong>Списък с резултати</strong>: За всяка дейност напишете какъв е действителният резултат или целта (какво искате да постигнете).</li>
<li><strong>Списък с ограничения</strong>: Идентифицирайте личните си ограничения:
   <ul>
   <li>Колко време имате дневно?</li>
   <li>Кога сте най-ефективни?</li>
   <li>Какви ресурси липсват?</li>
   </ul>
</li>
<li><strong>Лична дефиниция</strong>: Напишете с 2-3 изречения: "За мен продуктивността означава..."</li>
</ol>
<hr />
<h2>Самопроверка</h2>
<ul>
<li>✅ Правите разлика между изход и резултат.</li>
<li>✅ Идентифицирали сте личните си ограничения (време, енергия, внимание, ресурси).</li>
<li>✅ Имате лична дефиниция на продуктивността.</li>
<li>✅ Знаете, че целта е да максимизирате резултатите, а не да увеличавате изхода.</li>
</ul>
<hr />
<h2>Опционално задълбочаване</h2>
<ul>
<li>Дейвид Алън: "Getting Things Done" — основи на мисленето, фокусирано върху резултата</li>
<li>Елияху Голдрат: "The Goal" — за управление на ограниченията</li>
<li>Кал Нюпорт: "Deep Work" — за дълбока работа и ограничения на вниманието</li>
</ul>`,
    emailSubject: 'Продуктивност 2026 – Ден 1: Дефиниция на продуктивността',
    emailBody: `<h1>Продуктивност 2026 – Ден 1</h1>
<h2>Дефиниция на продуктивността: изход, резултати и ограничения</h2>
<p>Днес ще научите разликата между изход и резултат и ще идентифицирате личните си ограничения.</p>
<p><a href="{{APP_URL}}/bg/courses/${COURSE_ID_BASE}_BG/day/1">Отворете урока →</a></p>`
  },
  pl: {
    title: 'Definicja produktywności: wynik, rezultaty i ograniczenia',
    content: `<h1>Definicja produktywności: wynik, rezultaty i ograniczenia</h1>
<p><em>Krok pierwszy: wyjaśnijmy, co faktycznie mierzymy</em></p>
<hr />
<h2>Cel uczenia się</h2>
<ul>
<li>Zrozumieć różnicę między wynikiem (działanie) a rezultatem (efekt).</li>
<li>Zidentyfikować osobiste ograniczenia (czas, energia, uwaga, zasoby).</li>
<li>Stworzyć osobistą definicję produktywności.</li>
</ul>
<hr />
<h2>Dlaczego to ważne</h2>
<ul>
<li>Wynik to ilość działań (ile e-maili, ile spotkań).</li>
<li>Rezultat to to, co osiągasz (rozwiązany problem, zadowolony klient, rosnące przychody).</li>
<li>Produktywność = rezultat / ograniczenia. Nie chodzi o objętość działań, ale o rezultaty względem twoich limitów.</li>
</ul>
<hr />
<h2>Wyjaśnienie</h2>
<h3>Wynik vs Rezultat</h3>
<p><strong>Wynik</strong>: Liczba lub ilość działań. Na przykład: wysłanie 50 e-maili, 8 godzin spotkań, napisanie 20 dokumentów.</p>
<p><strong>Rezultat</strong>: Rzeczywista zmiana lub efekt. Na przykład: 3 nowych klientów, 20% wzrost satysfakcji, projekt ukończony na czas.</p>
<p><strong>Klucz</strong>: Wysoki wynik nie gwarantuje dobrych rezultatów. Celem jest maksymalizacja rezultatów, a nie zwiększenie wyniku.</p>

<h3>Identyfikowanie ograniczeń</h3>
<p>Każdy system ma ograniczenia. Zwiększanie produktywności oznacza zarządzanie tymi ograniczeniami:</p>
<ul>
<li><strong>Czas</strong>: Ile godzin masz dziennie? Kiedy jesteś najbardziej efektywny?</li>
<li><strong>Energia</strong>: Kiedy jesteś świeży? Kiedy jesteś wyczerpany? Jakie działania cię energetyzują, jakie cię wyczerpują?</li>
<li><strong>Uwaga</strong>: Jak długo możesz się skoncentrować? Jakie czynniki cię rozpraszają?</li>
<li><strong>Zasoby</strong>: Jakie narzędzia, ludzie, informacje są dostępne?</li>
</ul>

<h3>Praktyczny przykład</h3>
<p><strong>Złe podejście</strong>: "Dzisiaj wyślę 100 e-maili!" (fokus na wyniku)</p>
<p><strong>Dobre podejście</strong>: "Dzisiaj rozwiążę 3 krytyczne problemy klientów, co zwiększa satysfakcję o 15%." (fokus na rezultacie)</p>
<p>W drugim przypadku możesz wysłać tylko 10 e-maili, ale rezultat jest znacznie lepszy.</p>
<hr />
<h2>Praktyczne ćwiczenie (15-20 min) — Osobista definicja produktywności</h2>
<ol>
<li><strong>Lista wyników</strong>: Zapisz, jakie działania wykonujesz codziennie (e-maile, spotkania, dokumenty itp.).</li>
<li><strong>Lista rezultatów</strong>: Dla każdego działania zapisz, jaki jest rzeczywisty rezultat lub cel (co chcesz osiągnąć).</li>
<li><strong>Lista ograniczeń</strong>: Zidentyfikuj swoje osobiste ograniczenia:
   <ul>
   <li>Ile czasu masz dziennie?</li>
   <li>Kiedy jesteś najbardziej efektywny?</li>
   <li>Jakich zasobów brakuje?</li>
   </ul>
</li>
<li><strong>Osobista definicja</strong>: Napisz w 2-3 zdaniach: "Dla mnie produktywność oznacza..."</li>
</ol>
<hr />
<h2>Samosprawdzenie</h2>
<ul>
<li>✅ Rozróżniasz wynik i rezultat.</li>
<li>✅ Zidentyfikowałeś swoje osobiste ograniczenia (czas, energia, uwaga, zasoby).</li>
<li>✅ Masz osobistą definicję produktywności.</li>
<li>✅ Wiesz, że celem jest maksymalizacja rezultatów, a nie zwiększenie wyniku.</li>
</ul>
<hr />
<h2>Opcjonalne pogłębienie</h2>
<ul>
<li>David Allen: "Getting Things Done" — podstawy myślenia opartego na rezultatach</li>
<li>Eliyahu Goldratt: "The Goal" — o zarządzaniu ograniczeniami</li>
<li>Cal Newport: "Deep Work" — o głębokiej pracy i ograniczeniach uwagi</li>
</ul>`,
    emailSubject: 'Produktywność 2026 – Dzień 1: Definicja produktywności',
    emailBody: `<h1>Produktywność 2026 – Dzień 1</h1>
<h2>Definicja produktywności: wynik, rezultaty i ograniczenia</h2>
<p>Dzisiaj nauczysz się różnicy między wynikiem a rezultatem i zidentyfikujesz swoje osobiste ograniczenia.</p>
<p><a href="{{APP_URL}}/pl/courses/${COURSE_ID_BASE}_PL/day/1">Otwórz lekcję →</a></p>`
  },
  vi: {
    title: 'Định nghĩa năng suất: đầu ra, kết quả và ràng buộc',
    content: `<h1>Định nghĩa năng suất: đầu ra, kết quả và ràng buộc</h1>
<p><em>Bước một: làm rõ những gì chúng ta thực sự đo lường</em></p>
<hr />
<h2>Mục tiêu học tập</h2>
<ul>
<li>Hiểu sự khác biệt giữa đầu ra (hoạt động) và kết quả (tác động).</li>
<li>Xác định các ràng buộc cá nhân của bạn (thời gian, năng lượng, sự chú ý, tài nguyên).</li>
<li>Tạo định nghĩa năng suất cá nhân.</li>
</ul>
<hr />
<h2>Tại sao điều này quan trọng</h2>
<ul>
<li>Đầu ra là số lượng hoạt động (bao nhiêu email, bao nhiêu cuộc họp).</li>
<li>Kết quả là những gì bạn đạt được (vấn đề đã giải quyết, khách hàng hài lòng, doanh thu tăng trưởng).</li>
<li>Năng suất = kết quả / ràng buộc. Không phải về khối lượng hoạt động, mà là kết quả so với giới hạn của bạn.</li>
</ul>
<hr />
<h2>Giải thích</h2>
<h3>Đầu ra vs Kết quả</h3>
<p><strong>Đầu ra</strong>: Số lượng hoặc số lượng hoạt động. Ví dụ: gửi 50 email, 8 giờ họp, viết 20 tài liệu.</p>
<p><strong>Kết quả</strong>: Thay đổi hoặc tác động thực tế. Ví dụ: 3 khách hàng mới, tăng 20% sự hài lòng, dự án hoàn thành đúng hạn.</p>
<p><strong>Điểm then chốt</strong>: Đầu ra cao không đảm bảo kết quả tốt. Mục tiêu là tối đa hóa kết quả, không phải tăng đầu ra.</p>

<h3>Xác định Ràng buộc</h3>
<p>Mọi hệ thống đều có ràng buộc. Tăng năng suất có nghĩa là quản lý các ràng buộc này:</p>
<ul>
<li><strong>Thời gian</strong>: Bạn có bao nhiêu giờ mỗi ngày? Khi nào bạn hiệu quả nhất?</li>
<li><strong>Năng lượng</strong>: Khi nào bạn tươi tỉnh? Khi nào bạn kiệt sức? Hoạt động nào tiếp thêm năng lượng, hoạt động nào làm bạn kiệt sức?</li>
<li><strong>Sự chú ý</strong>: Bạn có thể tập trung bao lâu? Yếu tố nào làm bạn phân tâm?</li>
<li><strong>Tài nguyên</strong>: Công cụ, con người, thông tin nào có sẵn?</li>
</ul>

<h3>Ví dụ Thực tế</h3>
<p><strong>Cách tiếp cận sai</strong>: "Hôm nay tôi sẽ gửi 100 email!" (tập trung vào đầu ra)</p>
<p><strong>Cách tiếp cận đúng</strong>: "Hôm nay tôi sẽ giải quyết 3 vấn đề quan trọng của khách hàng, điều này tăng sự hài lòng lên 15%." (tập trung vào kết quả)</p>
<p>Trong trường hợp thứ hai, bạn có thể chỉ gửi 10 email, nhưng kết quả tốt hơn đáng kể.</p>
<hr />
<h2>Bài tập thực hành (15-20 phút) — Định nghĩa năng suất cá nhân</h2>
<ol>
<li><strong>Danh sách đầu ra</strong>: Viết ra những hoạt động bạn làm hàng ngày (email, họp, tài liệu, v.v.).</li>
<li><strong>Danh sách kết quả</strong>: Đối với mỗi hoạt động, viết ra kết quả hoặc mục tiêu thực tế là gì (bạn muốn đạt được gì).</li>
<li><strong>Danh sách ràng buộc</strong>: Xác định các ràng buộc cá nhân của bạn:
   <ul>
   <li>Bạn có bao nhiêu thời gian mỗi ngày?</li>
   <li>Khi nào bạn hiệu quả nhất?</li>
   <li>Thiếu tài nguyên gì?</li>
   </ul>
</li>
<li><strong>Định nghĩa cá nhân</strong>: Viết trong 2-3 câu: "Đối với tôi, năng suất có nghĩa là..."</li>
</ol>
<hr />
<h2>Tự kiểm tra</h2>
<ul>
<li>✅ Bạn phân biệt được đầu ra và kết quả.</li>
<li>✅ Bạn đã xác định các ràng buộc cá nhân (thời gian, năng lượng, sự chú ý, tài nguyên).</li>
<li>✅ Bạn có định nghĩa năng suất cá nhân.</li>
<li>✅ Bạn biết mục tiêu là tối đa hóa kết quả, không phải tăng đầu ra.</li>
</ul>
<hr />
<h2>Tùy chọn mở rộng</h2>
<ul>
<li>David Allen: "Getting Things Done" — nền tảng của tư duy dựa trên kết quả</li>
<li>Eliyahu Goldratt: "The Goal" — về quản lý ràng buộc</li>
<li>Cal Newport: "Deep Work" — về công việc sâu và ràng buộc của sự chú ý</li>
</ul>`,
    emailSubject: 'Năng suất 2026 – Ngày 1: Định nghĩa năng suất',
    emailBody: `<h1>Năng suất 2026 – Ngày 1</h1>
<h2>Định nghĩa năng suất: đầu ra, kết quả và ràng buộc</h2>
<p>Hôm nay bạn sẽ học sự khác biệt giữa đầu ra và kết quả, và xác định các ràng buộc cá nhân của mình.</p>
<p><a href="{{APP_URL}}/vi/courses/${COURSE_ID_BASE}_VI/day/1">Mở bài học →</a></p>`
  },
  id: {
    title: 'Definisi produktivitas: output, outcome, dan kendala',
    content: `<h1>Definisi produktivitas: output, outcome, dan kendala</h1>
<p><em>Langkah satu: perjelas apa yang sebenarnya kita ukur</em></p>
<hr />
<h2>Tujuan pembelajaran</h2>
<ul>
<li>Memahami perbedaan antara output (aktivitas) dan outcome (hasil).</li>
<li>Mengidentifikasi kendala pribadi Anda (waktu, energi, perhatian, sumber daya).</li>
<li>Membuat definisi produktivitas pribadi.</li>
</ul>
<hr />
<h2>Mengapa penting</h2>
<ul>
<li>Output adalah jumlah aktivitas (berapa banyak email, berapa banyak rapat).</li>
<li>Outcome adalah apa yang Anda capai (masalah terpecahkan, klien puas, pendapatan tumbuh).</li>
<li>Produktivitas = outcome / kendala. Bukan tentang volume aktivitas, tetapi hasil relatif terhadap batas Anda.</li>
</ul>
<hr />
<h2>Penjelasan</h2>
<h3>Output vs Outcome</h3>
<p><strong>Output</strong>: Jumlah atau kuantitas aktivitas. Misalnya: mengirim 50 email, 8 jam rapat, menulis 20 dokumen.</p>
<p><strong>Outcome</strong>: Perubahan atau dampak aktual. Misalnya: 3 klien baru, peningkatan kepuasan 20%, proyek selesai tepat waktu.</p>
<p><strong>Kunci</strong>: Output tinggi tidak menjamin outcome yang baik. Tujuannya adalah memaksimalkan outcome, bukan meningkatkan output.</p>

<h3>Mengidentifikasi Kendala</h3>
<p>Setiap sistem memiliki kendala. Meningkatkan produktivitas berarti mengelola kendala ini:</p>
<ul>
<li><strong>Waktu</strong>: Berapa jam yang Anda miliki setiap hari? Kapan Anda paling efektif?</li>
<li><strong>Energi</strong>: Kapan Anda segar? Kapan Anda lelah? Aktivitas apa yang memberi energi, apa yang menguras energi?</li>
<li><strong>Perhatian</strong>: Berapa lama Anda bisa fokus? Faktor apa yang mengalihkan perhatian Anda?</li>
<li><strong>Sumber Daya</strong>: Alat, orang, informasi apa yang tersedia?</li>
</ul>

<h3>Contoh Praktis</h3>
<p><strong>Pendekatan salah</strong>: "Hari ini saya akan mengirim 100 email!" (fokus pada output)</p>
<p><strong>Pendekatan benar</strong>: "Hari ini saya akan menyelesaikan 3 masalah kritis klien, yang meningkatkan kepuasan sebesar 15%." (fokus pada outcome)</p>
<p>Dalam kasus kedua, Anda mungkin hanya mengirim 10 email, tetapi outcome-nya jauh lebih baik.</p>
<hr />
<h2>Latihan praktis (15-20 menit) — Definisi produktivitas pribadi</h2>
<ol>
<li><strong>Daftar output</strong>: Tuliskan aktivitas apa yang Anda lakukan setiap hari (email, rapat, dokumen, dll.).</li>
<li><strong>Daftar outcome</strong>: Untuk setiap aktivitas, tuliskan apa hasil atau tujuan aktualnya (apa yang ingin Anda capai).</li>
<li><strong>Daftar kendala</strong>: Identifikasi kendala pribadi Anda:
   <ul>
   <li>Berapa banyak waktu yang Anda miliki setiap hari?</li>
   <li>Kapan Anda paling efektif?</li>
   <li>Sumber daya apa yang kurang?</li>
   </ul>
</li>
<li><strong>Definisi pribadi</strong>: Tulis dalam 2-3 kalimat: "Bagi saya, produktivitas berarti..."</li>
</ol>
<hr />
<h2>Pemeriksaan diri</h2>
<ul>
<li>✅ Anda membedakan antara output dan outcome.</li>
<li>✅ Anda telah mengidentifikasi kendala pribadi (waktu, energi, perhatian, sumber daya).</li>
<li>✅ Anda memiliki definisi produktivitas pribadi.</li>
<li>✅ Anda tahu tujuannya adalah memaksimalkan outcome, bukan meningkatkan output.</li>
</ul>
<hr />
<h2>Pendalaman opsional</h2>
<ul>
<li>David Allen: "Getting Things Done" — fondasi pemikiran berbasis outcome</li>
<li>Eliyahu Goldratt: "The Goal" — tentang mengelola kendala</li>
<li>Cal Newport: "Deep Work" — tentang pekerjaan mendalam dan kendala perhatian</li>
</ul>`,
    emailSubject: 'Produktivitas 2026 – Hari 1: Definisi produktivitas',
    emailBody: `<h1>Produktivitas 2026 – Hari 1</h1>
<h2>Definisi produktivitas: output, outcome, dan kendala</h2>
<p>Hari ini Anda akan mempelajari perbedaan antara output dan outcome, dan mengidentifikasi kendala pribadi Anda.</p>
<p><a href="{{APP_URL}}/id/courses/${COURSE_ID_BASE}_ID/day/1">Buka pelajaran →</a></p>`
  },
  ar: {
    title: 'تعريف الإنتاجية: المخرجات والنتائج والقيود',
    content: `<h1>تعريف الإنتاجية: المخرجات والنتائج والقيود</h1>
<p><em>الخطوة الأولى: توضيح ما نقيسه بالفعل</em></p>
<hr />
<h2>هدف التعلم</h2>
<ul>
<li>فهم الفرق بين المخرجات (النشاط) والنتائج (التأثير).</li>
<li>تحديد قيودك الشخصية (الوقت، الطاقة، الانتباه، الموارد).</li>
<li>إنشاء تعريف شخصي للإنتاجية.</li>
</ul>
<hr />
<h2>لماذا يهم</h2>
<ul>
<li>المخرجات هي كمية الأنشطة (كم بريد إلكتروني، كم اجتماع).</li>
<li>النتائج هي ما تحققه (مشكلة محلولة، عميل راضٍ، إيرادات متزايدة).</li>
<li>الإنتاجية = النتائج / القيود. لا يتعلق الأمر بحجم النشاط، بل بالنتائج نسبة إلى حدودك.</li>
</ul>
<hr />
<h2>شرح</h2>
<h3>المخرجات مقابل النتائج</h3>
<p><strong>المخرجات</strong>: عدد أو كمية الأنشطة. على سبيل المثال: إرسال 50 بريدًا إلكترونيًا، 8 ساعات من الاجتماعات، كتابة 20 مستندًا.</p>
<p><strong>النتائج</strong>: التغيير أو التأثير الفعلي. على سبيل المثال: 3 عملاء جدد، زيادة 20% في الرضا، مشروع مكتمل في الموعد المحدد.</p>
<p><strong>المفتاح</strong>: المخرجات العالية لا تضمن نتائج جيدة. الهدف هو تعظيم النتائج، وليس زيادة المخرجات.</p>

<h3>تحديد القيود</h3>
<p>كل نظام له قيود. زيادة الإنتاجية تعني إدارة هذه القيود:</p>
<ul>
<li><strong>الوقت</strong>: كم ساعة لديك يوميًا؟ متى تكون أكثر فعالية؟</li>
<li><strong>الطاقة</strong>: متى تكون منتعشًا؟ متى تكون مستنفدًا؟ ما الأنشطة التي تنشطك، وما الذي يستنفدك؟</li>
<li><strong>الانتباه</strong>: كم من الوقت يمكنك التركيز؟ ما العوامل التي تشتت انتباهك؟</li>
<li><strong>الموارد</strong>: ما الأدوات والأشخاص والمعلومات المتاحة؟</li>
</ul>

<h3>مثال عملي</h3>
<p><strong>نهج خاطئ</strong>: "سأرسل 100 بريد إلكتروني اليوم!" (التركيز على المخرجات)</p>
<p><strong>نهج صحيح</strong>: "سأحل 3 مشاكل حرجة للعملاء اليوم، مما يزيد الرضا بنسبة 15%." (التركيز على النتائج)</p>
<p>في الحالة الثانية، قد ترسل 10 بريدات إلكترونية فقط، لكن النتيجة أفضل بكثير.</p>
<hr />
<h2>تمرين عملي (15-20 دقيقة) — تعريف الإنتاجية الشخصية</h2>
<ol>
<li><strong>قائمة المخرجات</strong>: اكتب الأنشطة التي تقوم بها يوميًا (البريد الإلكتروني، الاجتماعات، المستندات، إلخ).</li>
<li><strong>قائمة النتائج</strong>: لكل نشاط، اكتب ما هي النتيجة أو الهدف الفعلي (ما تريد تحقيقه).</li>
<li><strong>قائمة القيود</strong>: حدد قيودك الشخصية:
   <ul>
   <li>كم من الوقت لديك يوميًا؟</li>
   <li>متى تكون أكثر فعالية؟</li>
   <li>ما الموارد المفقودة؟</li>
   </ul>
</li>
<li><strong>التعريف الشخصي</strong>: اكتب في 2-3 جمل: "بالنسبة لي، الإنتاجية تعني..."</li>
</ol>
<hr />
<h2>الفحص الذاتي</h2>
<ul>
<li>✅ أنت تميز بين المخرجات والنتائج.</li>
<li>✅ حددت قيودك الشخصية (الوقت، الطاقة، الانتباه، الموارد).</li>
<li>✅ لديك تعريف شخصي للإنتاجية.</li>
<li>✅ تعلم أن الهدف هو تعظيم النتائج، وليس زيادة المخرجات.</li>
</ul>
<hr />
<h2>تعميق اختياري</h2>
<ul>
<li>ديفيد ألين: "Getting Things Done" — أساسيات التفكير القائم على النتائج</li>
<li>إلياهو جولدرات: "The Goal" — حول إدارة القيود</li>
<li>كال نيوبورت: "Deep Work" — حول العمل العميق وقيود الانتباه</li>
</ul>`,
    emailSubject: 'الإنتاجية 2026 – اليوم 1: تعريف الإنتاجية',
    emailBody: `<h1>الإنتاجية 2026 – اليوم 1</h1>
<h2>تعريف الإنتاجية: المخرجات والنتائج والقيود</h2>
<p>اليوم سوف تتعلم الفرق بين المخرجات والنتائج، وتحدد قيودك الشخصية.</p>
<p><a href="{{APP_URL}}/ar/courses/${COURSE_ID_BASE}_AR/day/1">افتح الدرس →</a></p>`
  },
  pt: {
    title: 'Definição de produtividade: output, outcome e restrições',
    content: `<h1>Definição de produtividade: output, outcome e restrições</h1>
<p><em>Passo um: esclarecer o que realmente estamos medindo</em></p>
<hr />
<h2>Objetivo de aprendizagem</h2>
<ul>
<li>Entender a diferença entre output (atividade) e outcome (resultado).</li>
<li>Identificar suas restrições pessoais (tempo, energia, atenção, recursos).</li>
<li>Criar uma definição pessoal de produtividade.</li>
</ul>
<hr />
<h2>Por que importa</h2>
<ul>
<li>Output é a quantidade de atividades (quantos e-mails, quantas reuniões).</li>
<li>Outcome é o que você alcança (problema resolvido, cliente satisfeito, receita crescente).</li>
<li>Produtividade = outcome / restrições. Não é sobre volume de atividade, mas resultados relativos aos seus limites.</li>
</ul>
<hr />
<h2>Explicação</h2>
<h3>Output vs Outcome</h3>
<p><strong>Output</strong>: O número ou quantidade de atividades. Por exemplo: enviar 50 e-mails, 8 horas de reuniões, escrever 20 documentos.</p>
<p><strong>Outcome</strong>: A mudança ou impacto real. Por exemplo: 3 novos clientes, aumento de 20% na satisfação, projeto concluído no prazo.</p>
<p><strong>Chave</strong>: Alto output não garante bons outcomes. O objetivo é maximizar outcomes, não aumentar output.</p>

<h3>Identificando Restrições</h3>
<p>Todo sistema tem restrições. Aumentar a produtividade significa gerenciar essas restrições:</p>
<ul>
<li><strong>Tempo</strong>: Quantas horas você tem diariamente? Quando você é mais eficaz?</li>
<li><strong>Energia</strong>: Quando você está fresco? Quando está esgotado? Quais atividades te energizam, quais te esgotam?</li>
<li><strong>Atenção</strong>: Por quanto tempo você consegue se concentrar? Quais fatores te distraem?</li>
<li><strong>Recursos</strong>: Quais ferramentas, pessoas, informações estão disponíveis?</li>
</ul>

<h3>Exemplo Prático</h3>
<p><strong>Abordagem errada</strong>: "Hoje vou enviar 100 e-mails!" (foco em output)</p>
<p><strong>Abordagem certa</strong>: "Hoje vou resolver 3 problemas críticos de clientes, o que aumenta a satisfação em 15%." (foco em outcome)</p>
<p>No segundo caso, você pode enviar apenas 10 e-mails, mas o outcome é significativamente melhor.</p>
<hr />
<h2>Exercício prático (15-20 min) — Definição pessoal de produtividade</h2>
<ol>
<li><strong>Lista de outputs</strong>: Anote quais atividades você faz diariamente (e-mails, reuniões, documentos, etc.).</li>
<li><strong>Lista de outcomes</strong>: Para cada atividade, anote qual é o resultado ou objetivo real (o que você quer alcançar).</li>
<li><strong>Lista de restrições</strong>: Identifique suas restrições pessoais:
   <ul>
   <li>Quanto tempo você tem diariamente?</li>
   <li>Quando você é mais eficaz?</li>
   <li>Quais recursos estão faltando?</li>
   </ul>
</li>
<li><strong>Definição pessoal</strong>: Escreva em 2-3 frases: "Para mim, produtividade significa..."</li>
</ol>
<hr />
<h2>Auto-verificação</h2>
<ul>
<li>✅ Você distingue entre output e outcome.</li>
<li>✅ Você identificou suas restrições pessoais (tempo, energia, atenção, recursos).</li>
<li>✅ Você tem uma definição pessoal de produtividade.</li>
<li>✅ Você sabe que o objetivo é maximizar outcomes, não aumentar output.</li>
</ul>
<hr />
<h2>Aprofundamento opcional</h2>
<ul>
<li>David Allen: "Getting Things Done" — fundamentos do pensamento baseado em outcomes</li>
<li>Eliyahu Goldratt: "The Goal" — sobre gerenciar restrições</li>
<li>Cal Newport: "Deep Work" — sobre trabalho profundo e restrições de atenção</li>
</ul>`,
    emailSubject: 'Produtividade 2026 – Dia 1: Definição de produtividade',
    emailBody: `<h1>Produtividade 2026 – Dia 1</h1>
<h2>Definição de produtividade: output, outcome e restrições</h2>
<p>Hoje você aprenderá a diferença entre output e outcome, e identificará suas restrições pessoais.</p>
<p><a href="{{APP_URL}}/pt/courses/${COURSE_ID_BASE}_PT/day/1">Abrir a lição →</a></p>`
  },
  hi: {
    title: 'उत्पादकता की परिभाषा: आउटपुट, आउटकम और बाधाएं',
    content: `<h1>उत्पादकता की परिभाषा: आउटपुट, आउटकम और बाधाएं</h1>
<p><em>चरण एक: स्पष्ट करें कि हम वास्तव में क्या माप रहे हैं</em></p>
<hr />
<h2>सीखने का लक्ष्य</h2>
<ul>
<li>आउटपुट (गतिविधि) और आउटकम (परिणाम) के बीच अंतर को समझना।</li>
<li>अपनी व्यक्तिगत बाधाओं की पहचान करना (समय, ऊर्जा, ध्यान, संसाधन)।</li>
<li>एक व्यक्तिगत उत्पादकता परिभाषा बनाना।</li>
</ul>
<hr />
<h2>यह क्यों महत्वपूर्ण है</h2>
<ul>
<li>आउटपुट गतिविधियों की मात्रा है (कितने ईमेल, कितनी बैठकें)।</li>
<li>आउटकम वह है जो आप प्राप्त करते हैं (समस्या हल, संतुष्ट ग्राहक, बढ़ती आय)।</li>
<li>उत्पादकता = आउटकम / बाधाएं। यह गतिविधि की मात्रा के बारे में नहीं है, बल्कि आपकी सीमाओं के सापेक्ष परिणाम हैं।</li>
</ul>
<hr />
<h2>व्याख्या</h2>
<h3>आउटपुट vs आउटकम</h3>
<p><strong>आउटपुट</strong>: गतिविधियों की संख्या या मात्रा। उदाहरण के लिए: 50 ईमेल भेजना, 8 घंटे की बैठकें, 20 दस्तावेज़ लिखना।</p>
<p><strong>आउटकम</strong>: वास्तविक परिवर्तन या प्रभाव। उदाहरण के लिए: 3 नए ग्राहक, 20% संतुष्टि में वृद्धि, समय सीमा पर परियोजना पूरी।</p>
<p><strong>मुख्य</strong>: उच्च आउटपुट अच्छे आउटकम की गारंटी नहीं देता। लक्ष्य आउटकम को अधिकतम करना है, आउटपुट बढ़ाना नहीं।</p>

<h3>बाधाओं की पहचान</h3>
<p>हर प्रणाली की बाधाएं होती हैं। उत्पादकता बढ़ाने का मतलब है इन बाधाओं का प्रबंधन:</p>
<ul>
<li><strong>समय</strong>: आपके पास दैनिक कितने घंटे हैं? आप कब सबसे प्रभावी होते हैं?</li>
<li><strong>ऊर्जा</strong>: आप कब तरोताजा होते हैं? आप कब थक जाते हैं? कौन सी गतिविधियां आपको ऊर्जा देती हैं, कौन सी आपको थकाती हैं?</li>
<li><strong>ध्यान</strong>: आप कितनी देर तक ध्यान केंद्रित कर सकते हैं? कौन से कारक आपका ध्यान भटकाते हैं?</li>
<li><strong>संसाधन</strong>: कौन से उपकरण, लोग, जानकारी उपलब्ध हैं?</li>
</ul>

<h3>व्यावहारिक उदाहरण</h3>
<p><strong>गलत दृष्टिकोण</strong>: "आज मैं 100 ईमेल भेजूंगा!" (आउटपुट पर ध्यान)</p>
<p><strong>सही दृष्टिकोण</strong>: "आज मैं 3 महत्वपूर्ण ग्राहक समस्याओं को हल करूंगा, जो संतुष्टि को 15% बढ़ाता है।" (आउटकम पर ध्यान)</p>
<p>दूसरे मामले में, आप केवल 10 ईमेल भेज सकते हैं, लेकिन आउटकम काफी बेहतर है।</p>
<hr />
<h2>व्यावहारिक अभ्यास (15-20 मिनट) — व्यक्तिगत उत्पादकता परिभाषा</h2>
<ol>
<li><strong>आउटपुट सूची</strong>: लिखें कि आप दैनिक कौन सी गतिविधियां करते हैं (ईमेल, बैठकें, दस्तावेज़, आदि)।</li>
<li><strong>आउटकम सूची</strong>: प्रत्येक गतिविधि के लिए, लिखें कि वास्तविक परिणाम या लक्ष्य क्या है (आप क्या प्राप्त करना चाहते हैं)।</li>
<li><strong>बाधाएं सूची</strong>: अपनी व्यक्तिगत बाधाओं की पहचान करें:
   <ul>
   <li>आपके पास दैनिक कितना समय है?</li>
   <li>आप कब सबसे प्रभावी होते हैं?</li>
   <li>कौन से संसाधन गायब हैं?</li>
   </ul>
</li>
<li><strong>व्यक्तिगत परिभाषा</strong>: 2-3 वाक्यों में लिखें: "मेरे लिए, उत्पादकता का मतलब है..."</li>
</ol>
<hr />
<h2>स्व-जांच</h2>
<ul>
<li>✅ आप आउटपुट और आउटकम के बीच अंतर करते हैं।</li>
<li>✅ आपने अपनी व्यक्तिगत बाधाओं की पहचान की है (समय, ऊर्जा, ध्यान, संसाधन)।</li>
<li>✅ आपके पास एक व्यक्तिगत उत्पादकता परिभाषा है।</li>
<li>✅ आप जानते हैं कि लक्ष्य आउटकम को अधिकतम करना है, आउटपुट बढ़ाना नहीं।</li>
</ul>
<hr />
<h2>वैकल्पिक गहराई</h2>
<ul>
<li>डेविड एलन: "Getting Things Done" — आउटकम-आधारित सोच की नींव</li>
<li>एलियाहू गोल्डरैट: "The Goal" — बाधाओं के प्रबंधन के बारे में</li>
<li>कैल न्यूपोर्ट: "Deep Work" — गहरे काम और ध्यान की बाधाओं के बारे में</li>
</ul>`,
    emailSubject: 'उत्पादकता 2026 – दिन 1: उत्पादकता की परिभाषा',
    emailBody: `<h1>उत्पादकता 2026 – दिन 1</h1>
<h2>उत्पादकता की परिभाषा: आउटपुट, आउटकम और बाधाएं</h2>
<p>आज आप आउटपुट और आउटकम के बीच अंतर सीखेंगे, और अपनी व्यक्तिगत बाधाओं की पहचान करेंगे।</p>
<p><a href="{{APP_URL}}/hi/courses/${COURSE_ID_BASE}_HI/day/1">पाठ खोलें →</a></p>`
  }
};

// ============================================================================
// QUIZ 1 QUESTIONS (5 questions per language)
// ============================================================================

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

const QUIZ_1: Record<string, QuizQuestion[]> = {
  hu: [
    {
      question: 'Mi a különbség az output és az outcome között?',
      options: [
        'Az output a tevékenységek száma, az outcome a tényleges eredmény vagy változás',
        'Az output és az outcome ugyanaz',
        'Az outcome a tevékenységek száma, az output a tényleges eredmény',
        'Nincs különbség közöttük'
      ],
      correctIndex: 0
    },
    {
      question: 'Melyik példa mutatja az outcome fókuszt?',
      options: [
        '"Ma 100 emailt küldök el!"',
        '"Ma 3 kritikus ügyfélproblémát oldok meg, ami 15% növeli az elégedettséget"',
        '"Ma 8 órát meetingezek"',
        '"Ma 20 dokumentumot írok"'
      ],
      correctIndex: 1
    },
    {
      question: 'Melyik NEM számít korlátnak a termelékenység szempontjából?',
      options: [
        'Idő',
        'Energia',
        'Figyelem',
        'A tevékenységek száma'
      ],
      correctIndex: 3
    },
    {
      question: 'Mi a termelékenység helyes definíciója?',
      options: [
        'Tevékenységek maximális száma',
        'Outcome / korlátok (eredmény a korlátokhoz viszonyítva)',
        'Minél több output, annál jobb',
        'Nincs szükség korlátok kezelésére'
      ],
      correctIndex: 1
    },
    {
      question: 'Miért fontos az outcome fókusz az output fókusz helyett?',
      options: [
        'Mert a sok output automatikusan jó eredményt garantál',
        'Mert az outcome a tényleges értéket hozza, nem a tevékenység mennyisége',
        'Mert az output könnyebben mérhető',
        'Mert nincs különbség'
      ],
      correctIndex: 1
    }
  ],
  en: [
    {
      question: 'What is the difference between output and outcome?',
      options: [
        'Output is the quantity of activities, outcome is the actual result or change',
        'Output and outcome are the same',
        'Outcome is the quantity of activities, output is the actual result',
        'There is no difference between them'
      ],
      correctIndex: 0
    },
    {
      question: 'Which example shows outcome focus?',
      options: [
        '"Today I\'ll send 100 emails!"',
        '"Today I\'ll solve 3 critical client problems, which increases satisfaction by 15%"',
        '"Today I\'ll have 8 hours of meetings"',
        '"Today I\'ll write 20 documents"'
      ],
      correctIndex: 1
    },
    {
      question: 'Which is NOT considered a constraint for productivity?',
      options: [
        'Time',
        'Energy',
        'Attention',
        'The number of activities'
      ],
      correctIndex: 3
    },
    {
      question: 'What is the correct definition of productivity?',
      options: [
        'Maximum number of activities',
        'Outcome / constraints (results relative to limits)',
        'More output is always better',
        'No need to manage constraints'
      ],
      correctIndex: 1
    },
    {
      question: 'Why is outcome focus important instead of output focus?',
      options: [
        'Because high output automatically guarantees good results',
        'Because outcome brings actual value, not the quantity of activity',
        'Because output is easier to measure',
        'Because there is no difference'
      ],
      correctIndex: 1
    }
  ],
  tr: [
    {
      question: 'Çıktı ve sonuç arasındaki fark nedir?',
      options: [
        'Çıktı aktivitelerin miktarıdır, sonuç gerçek etki veya değişimdir',
        'Çıktı ve sonuç aynıdır',
        'Sonuç aktivitelerin miktarıdır, çıktı gerçek etkidir',
        'Aralarında fark yoktur'
      ],
      correctIndex: 0
    },
    {
      question: 'Hangi örnek sonuç odaklı yaklaşımı gösterir?',
      options: [
        '"Bugün 100 e-posta göndereceğim!"',
        '"Bugün 3 kritik müşteri problemini çözeceğim, bu da memnuniyeti %15 artırır"',
        '"Bugün 8 saat toplantı yapacağım"',
        '"Bugün 20 belge yazacağım"'
      ],
      correctIndex: 1
    },
    {
      question: 'Hangisi verimlilik açısından kısıtlama olarak kabul edilmez?',
      options: [
        'Zaman',
        'Enerji',
        'Dikkat',
        'Aktivitelerin sayısı'
      ],
      correctIndex: 3
    },
    {
      question: 'Verimliliğin doğru tanımı nedir?',
      options: [
        'Maksimum aktivite sayısı',
        'Sonuç / kısıtlamalar (sınırlara göre sonuçlar)',
        'Daha fazla çıktı her zaman daha iyidir',
        'Kısıtlamaları yönetmeye gerek yok'
      ],
      correctIndex: 1
    },
    {
      question: 'Neden çıktı odaklı yerine sonuç odaklı yaklaşım önemlidir?',
      options: [
        'Çünkü yüksek çıktı otomatik olarak iyi sonuçları garanti eder',
        'Çünkü sonuç gerçek değeri getirir, aktivite miktarı değil',
        'Çünkü çıktı ölçülmesi daha kolaydır',
        'Çünkü fark yoktur'
      ],
      correctIndex: 1
    }
  ],
  bg: [
    {
      question: 'Каква е разликата между изход и резултат?',
      options: [
        'Изходът е количеството дейности, резултатът е действителната промяна или ефект',
        'Изходът и резултатът са едно и също',
        'Резултатът е количеството дейности, изходът е действителният ефект',
        'Няма разлика между тях'
      ],
      correctIndex: 0
    },
    {
      question: 'Кой пример показва фокус върху резултата?',
      options: [
        '"Днес ще изпратя 100 имейла!"',
        '"Днес ще реша 3 критични клиентски проблема, което увеличава удовлетвореността с 15%"',
        '"Днес ще имам 8 часа срещи"',
        '"Днес ще напиша 20 документа"'
      ],
      correctIndex: 1
    },
    {
      question: 'Кое НЕ се счита за ограничение за продуктивността?',
      options: [
        'Време',
        'Енергия',
        'Внимание',
        'Броят на дейностите'
      ],
      correctIndex: 3
    },
    {
      question: 'Какво е правилното определение на продуктивността?',
      options: [
        'Максимален брой дейности',
        'Резултат / ограничения (резултати спрямо границите)',
        'Повече изход винаги е по-добре',
        'Няма нужда да управляваме ограниченията'
      ],
      correctIndex: 1
    },
    {
      question: 'Защо е важен фокусът върху резултата вместо върху изхода?',
      options: [
        'Защото високият изход автоматично гарантира добри резултати',
        'Защото резултатът носи действителна стойност, а не количеството дейности',
        'Защото изходът е по-лесен за измерване',
        'Защото няма разлика'
      ],
      correctIndex: 1
    }
  ],
  pl: [
    {
      question: 'Jaka jest różnica między wynikiem a rezultatem?',
      options: [
        'Wynik to ilość działań, rezultat to rzeczywista zmiana lub efekt',
        'Wynik i rezultat to to samo',
        'Rezultat to ilość działań, wynik to rzeczywisty efekt',
        'Nie ma między nimi różnicy'
      ],
      correctIndex: 0
    },
    {
      question: 'Który przykład pokazuje skupienie na rezultacie?',
      options: [
        '"Dzisiaj wyślę 100 e-maili!"',
        '"Dzisiaj rozwiążę 3 krytyczne problemy klientów, co zwiększa satysfakcję o 15%"',
        '"Dzisiaj będę miał 8 godzin spotkań"',
        '"Dzisiaj napiszę 20 dokumentów"'
      ],
      correctIndex: 1
    },
    {
      question: 'Które NIE jest uważane za ograniczenie produktywności?',
      options: [
        'Czas',
        'Energia',
        'Uwaga',
        'Liczba działań'
      ],
      correctIndex: 3
    },
    {
      question: 'Jaka jest poprawna definicja produktywności?',
      options: [
        'Maksymalna liczba działań',
        'Rezultat / ograniczenia (wyniki względem limitów)',
        'Więcej wyników zawsze jest lepsze',
        'Nie ma potrzeby zarządzania ograniczeniami'
      ],
      correctIndex: 1
    },
    {
      question: 'Dlaczego skupienie na rezultacie jest ważniejsze niż na wyniku?',
      options: [
        'Ponieważ wysoki wynik automatycznie gwarantuje dobre rezultaty',
        'Ponieważ rezultat przynosi rzeczywistą wartość, a nie ilość działań',
        'Ponieważ wynik jest łatwiejszy do zmierzenia',
        'Ponieważ nie ma różnicy'
      ],
      correctIndex: 1
    }
  ],
  vi: [
    {
      question: 'Sự khác biệt giữa đầu ra và kết quả là gì?',
      options: [
        'Đầu ra là số lượng hoạt động, kết quả là thay đổi hoặc tác động thực tế',
        'Đầu ra và kết quả giống nhau',
        'Kết quả là số lượng hoạt động, đầu ra là tác động thực tế',
        'Không có sự khác biệt giữa chúng'
      ],
      correctIndex: 0
    },
    {
      question: 'Ví dụ nào cho thấy tập trung vào kết quả?',
      options: [
        '"Hôm nay tôi sẽ gửi 100 email!"',
        '"Hôm nay tôi sẽ giải quyết 3 vấn đề quan trọng của khách hàng, điều này tăng sự hài lòng lên 15%"',
        '"Hôm nay tôi sẽ có 8 giờ họp"',
        '"Hôm nay tôi sẽ viết 20 tài liệu"'
      ],
      correctIndex: 1
    },
    {
      question: 'Điều nào KHÔNG được coi là ràng buộc cho năng suất?',
      options: [
        'Thời gian',
        'Năng lượng',
        'Sự chú ý',
        'Số lượng hoạt động'
      ],
      correctIndex: 3
    },
    {
      question: 'Định nghĩa đúng về năng suất là gì?',
      options: [
        'Số lượng hoạt động tối đa',
        'Kết quả / ràng buộc (kết quả so với giới hạn)',
        'Nhiều đầu ra luôn tốt hơn',
        'Không cần quản lý ràng buộc'
      ],
      correctIndex: 1
    },
    {
      question: 'Tại sao tập trung vào kết quả quan trọng hơn tập trung vào đầu ra?',
      options: [
        'Vì đầu ra cao tự động đảm bảo kết quả tốt',
        'Vì kết quả mang lại giá trị thực tế, không phải số lượng hoạt động',
        'Vì đầu ra dễ đo lường hơn',
        'Vì không có sự khác biệt'
      ],
      correctIndex: 1
    }
  ],
  id: [
    {
      question: 'Apa perbedaan antara output dan outcome?',
      options: [
        'Output adalah jumlah aktivitas, outcome adalah perubahan atau dampak aktual',
        'Output dan outcome adalah hal yang sama',
        'Outcome adalah jumlah aktivitas, output adalah dampak aktual',
        'Tidak ada perbedaan di antara keduanya'
      ],
      correctIndex: 0
    },
    {
      question: 'Contoh mana yang menunjukkan fokus pada outcome?',
      options: [
        '"Hari ini saya akan mengirim 100 email!"',
        '"Hari ini saya akan menyelesaikan 3 masalah kritis klien, yang meningkatkan kepuasan sebesar 15%"',
        '"Hari ini saya akan memiliki 8 jam rapat"',
        '"Hari ini saya akan menulis 20 dokumen"'
      ],
      correctIndex: 1
    },
    {
      question: 'Manakah yang TIDAK dianggap sebagai kendala untuk produktivitas?',
      options: [
        'Waktu',
        'Energi',
        'Perhatian',
        'Jumlah aktivitas'
      ],
      correctIndex: 3
    },
    {
      question: 'Apa definisi produktivitas yang benar?',
      options: [
        'Jumlah aktivitas maksimum',
        'Outcome / kendala (hasil relatif terhadap batas)',
        'Lebih banyak output selalu lebih baik',
        'Tidak perlu mengelola kendala'
      ],
      correctIndex: 1
    },
    {
      question: 'Mengapa fokus pada outcome penting daripada fokus pada output?',
      options: [
        'Karena output tinggi secara otomatis menjamin hasil yang baik',
        'Karena outcome membawa nilai aktual, bukan jumlah aktivitas',
        'Karena output lebih mudah diukur',
        'Karena tidak ada perbedaan'
      ],
      correctIndex: 1
    }
  ],
  ar: [
    {
      question: 'ما الفرق بين المخرجات والنتائج؟',
      options: [
        'المخرجات هي كمية الأنشطة، النتائج هي التغيير أو التأثير الفعلي',
        'المخرجات والنتائج هي نفس الشيء',
        'النتائج هي كمية الأنشطة، المخرجات هي التأثير الفعلي',
        'لا يوجد فرق بينهما'
      ],
      correctIndex: 0
    },
    {
      question: 'أي مثال يظهر التركيز على النتائج؟',
      options: [
        '"سأرسل 100 بريد إلكتروني اليوم!"',
        '"سأحل 3 مشاكل حرجة للعملاء اليوم، مما يزيد الرضا بنسبة 15%"',
        '"سأحضر 8 ساعات من الاجتماعات اليوم"',
        '"سأكتب 20 مستندًا اليوم"'
      ],
      correctIndex: 1
    },
    {
      question: 'أي مما يلي لا يُعتبر قيدًا للإنتاجية؟',
      options: [
        'الوقت',
        'الطاقة',
        'الانتباه',
        'عدد الأنشطة'
      ],
      correctIndex: 3
    },
    {
      question: 'ما هو التعريف الصحيح للإنتاجية؟',
      options: [
        'الحد الأقصى لعدد الأنشطة',
        'النتائج / القيود (النتائج نسبة إلى الحدود)',
        'المزيد من المخرجات دائمًا أفضل',
        'لا حاجة لإدارة القيود'
      ],
      correctIndex: 1
    },
    {
      question: 'لماذا التركيز على النتائج مهم بدلاً من التركيز على المخرجات؟',
      options: [
        'لأن المخرجات العالية تضمن تلقائيًا نتائج جيدة',
        'لأن النتائج تجلب قيمة فعلية، وليس كمية الأنشطة',
        'لأن المخرجات أسهل في القياس',
        'لأنه لا يوجد فرق'
      ],
      correctIndex: 1
    }
  ],
  pt: [
    {
      question: 'Qual é a diferença entre output e outcome?',
      options: [
        'Output é a quantidade de atividades, outcome é a mudança ou impacto real',
        'Output e outcome são a mesma coisa',
        'Outcome é a quantidade de atividades, output é o impacto real',
        'Não há diferença entre eles'
      ],
      correctIndex: 0
    },
    {
      question: 'Qual exemplo mostra foco em outcome?',
      options: [
        '"Hoje vou enviar 100 e-mails!"',
        '"Hoje vou resolver 3 problemas críticos de clientes, o que aumenta a satisfação em 15%"',
        '"Hoje vou ter 8 horas de reuniões"',
        '"Hoje vou escrever 20 documentos"'
      ],
      correctIndex: 1
    },
    {
      question: 'Qual NÃO é considerado uma restrição para produtividade?',
      options: [
        'Tempo',
        'Energia',
        'Atenção',
        'O número de atividades'
      ],
      correctIndex: 3
    },
    {
      question: 'Qual é a definição correta de produtividade?',
      options: [
        'Número máximo de atividades',
        'Outcome / restrições (resultados relativos aos limites)',
        'Mais output é sempre melhor',
        'Não há necessidade de gerenciar restrições'
      ],
      correctIndex: 1
    },
    {
      question: 'Por que o foco em outcome é importante em vez de foco em output?',
      options: [
        'Porque output alto garante automaticamente bons resultados',
        'Porque outcome traz valor real, não a quantidade de atividades',
        'Porque output é mais fácil de medir',
        'Porque não há diferença'
      ],
      correctIndex: 1
    }
  ],
  hi: [
    {
      question: 'आउटपुट और आउटकम के बीच क्या अंतर है?',
      options: [
        'आउटपुट गतिविधियों की मात्रा है, आउटकम वास्तविक परिवर्तन या प्रभाव है',
        'आउटपुट और आउटकम एक ही हैं',
        'आउटकम गतिविधियों की मात्रा है, आउटपुट वास्तविक प्रभाव है',
        'उनके बीच कोई अंतर नहीं है'
      ],
      correctIndex: 0
    },
    {
      question: 'कौन सा उदाहरण आउटकम फोकस दिखाता है?',
      options: [
        '"आज मैं 100 ईमेल भेजूंगा!"',
        '"आज मैं 3 महत्वपूर्ण ग्राहक समस्याओं को हल करूंगा, जो संतुष्टि को 15% बढ़ाता है"',
        '"आज मेरे पास 8 घंटे की मीटिंग होगी"',
        '"आज मैं 20 दस्तावेज़ लिखूंगा"'
      ],
      correctIndex: 1
    },
    {
      question: 'उत्पादकता के लिए कौन सा बाधा नहीं माना जाता?',
      options: [
        'समय',
        'ऊर्जा',
        'ध्यान',
        'गतिविधियों की संख्या'
      ],
      correctIndex: 3
    },
    {
      question: 'उत्पादकता की सही परिभाषा क्या है?',
      options: [
        'गतिविधियों की अधिकतम संख्या',
        'आउटकम / बाधाएं (सीमाओं के सापेक्ष परिणाम)',
        'अधिक आउटपुट हमेशा बेहतर है',
        'बाधाओं को प्रबंधित करने की आवश्यकता नहीं है'
      ],
      correctIndex: 1
    },
    {
      question: 'आउटपुट फोकस के बजाय आउटकम फोकस क्यों महत्वपूर्ण है?',
      options: [
        'क्योंकि उच्च आउटपुट स्वचालित रूप से अच्छे परिणाम की गारंटी देता है',
        'क्योंकि आउटकम वास्तविक मूल्य लाता है, गतिविधियों की मात्रा नहीं',
        'क्योंकि आउटपुट मापना आसान है',
        'क्योंकि कोई अंतर नहीं है'
      ],
      correctIndex: 1
    }
  ]
};

// ============================================================================
// MAIN SEED FUNCTION
// ============================================================================

async function seed() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI not set');
  }
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.amanoba.com';

  const { default: connectDB } = await import('../app/lib/mongodb');
  await connectDB();
  console.log('✅ Connected to MongoDB');

  // Get or create brand
  let brand = await Brand.findOne({ slug: 'amanoba' });
  if (!brand) {
    brand = await Brand.create({
      name: 'Amanoba',
      slug: 'amanoba',
      displayName: 'Amanoba',
      description: 'Unified Learning Platform',
      logo: '/AMANOBA.png',
      themeColors: { primary: '#FAB908', secondary: '#2D2D2D', accent: '#FAB908' },
      allowedDomains: ['amanoba.com', 'www.amanoba.com', 'localhost'],
      supportedLanguages: ['hu', 'en', 'tr', 'bg', 'pl', 'vi', 'id', 'ar', 'pt', 'hi'],
      defaultLanguage: 'hu',
      isActive: true
    });
    console.log('✅ Brand created');
  }

  // Create courses, lessons, and quizzes for each language
  for (const lang of ['hu', 'en', 'tr', 'bg', 'pl', 'vi', 'id', 'ar', 'pt', 'hi']) {
    const courseId = `${COURSE_ID_BASE}_${lang.toUpperCase()}`;
    const courseName = COURSE_NAMES[lang];
    const courseDescription = COURSE_DESCRIPTIONS[lang];
    const lesson1 = LESSON_1[lang];
    const quiz1 = QUIZ_1[lang];

    if (!courseName || !lesson1 || !quiz1) {
      console.log(`⚠️  Skipping ${lang} - missing content`);
      continue;
    }

    // Create course
    const course = await Course.findOneAndUpdate(
      { courseId },
      {
        $set: {
          courseId,
          name: courseName,
          description: courseDescription,
          language: lang,
          durationDays: 30,
          isActive: false, // Start as draft
          requiresPremium: false,
          brandId: brand._id,
          pointsConfig: {
            completionPoints: 1000,
            lessonPoints: 50,
            perfectCourseBonus: 500
          },
          xpConfig: {
            completionXP: 500,
            lessonXP: 25
          },
          metadata: {
            category: 'productivity',
            difficulty: 'intermediate',
            estimatedHours: 10,
            tags: ['productivity', 'time-management', 'GTD', 'kanban', 'agile'],
            instructor: 'Amanoba'
          }
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`✅ Course ${courseId} created/updated`);

    // Create Lesson 1
    const lessonId = `${courseId}_DAY_01`;
    const lesson = await Lesson.findOneAndUpdate(
      { lessonId },
      {
        $set: {
          lessonId,
          courseId: course._id,
          dayNumber: 1,
          language: lang,
          isActive: true,
          title: lesson1.title,
          content: lesson1.content,
          emailSubject: lesson1.emailSubject.replace(/\{\{APP_URL\}\}/g, appUrl),
          emailBody: lesson1.emailBody.replace(/\{\{APP_URL\}\}/g, appUrl),
          quizConfig: {
            enabled: true,
            successThreshold: 70,
            questionCount: 5,
            poolSize: 5,
            required: true
          },
          pointsReward: 50,
          xpReward: 25,
          metadata: {
            estimatedMinutes: 25,
            difficulty: 'medium'
          }
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`✅ Lesson 1 for ${lang} created/updated`);

    // Create Quiz 1 questions
    for (let i = 0; i < quiz1.length; i++) {
      const q = quiz1[i];
      await QuizQuestion.findOneAndUpdate(
        {
          lessonId: lesson.lessonId,
          question: q.question
        },
        {
          $set: {
            question: q.question,
            options: q.options,
            correctIndex: q.correctIndex,
            difficulty: QuestionDifficulty.MEDIUM,
            category: 'Productivity Foundations',
            lessonId: lesson.lessonId,
            courseId: course._id,
            isCourseSpecific: true,
            isActive: true,
            showCount: 0,
            correctCount: 0,
            metadata: {
              createdAt: new Date(),
              updatedAt: new Date()
            }
          }
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }
    console.log(`✅ Quiz 1 (${quiz1.length} questions) for ${lang} created/updated`);
  }

  console.log('✅ Seed completed!');
  process.exit(0);
}

seed().catch((error) => {
  console.error('❌ Seed failed:', error);
  process.exit(1);
});
